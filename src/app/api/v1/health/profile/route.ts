import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { healthProfileSchema } from '@/lib/validation';
import { successResponse, errorResponse, createdResponse } from '@/lib/api';
import { AuthenticationError, ValidationError, NotFoundError, ServerError } from '@/lib/errors';
import { z } from 'zod';

async function getUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    throw new AuthenticationError('No token provided');
  }

  const payload = verifyToken(token);
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  return user;
}

// Helper: Calculate BMI
function calculateBMI(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 100) / 100;
}

// Helper: Get BMI category
function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal_weight';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

// Helper: Calculate daily caloric needs using Harris-Benedict formula
function calculateDailyCaloricNeeds(
  heightCm: number,
  weightKg: number,
  age: number,
  gender: string,
  activityLevel: string
): number {
  let bmr: number;

  if (gender === 'male') {
    bmr = 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age;
  } else {
    bmr = 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
  }

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  };

  const multiplier = activityMultipliers[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);

    const healthProfile = await prisma.healthProfile.findUnique({
      where: { userId: user.id },
    });

    if (!healthProfile) {
      return successResponse({
        message: 'No health profile found. Please create one.',
        data: null,
      });
    }

    const bmi =
      healthProfile.heightCm && healthProfile.weightKg
        ? calculateBMI(Number(healthProfile.heightCm), Number(healthProfile.weightKg))
        : null;

    const dailyCaloricNeeds =
      healthProfile.heightCm &&
      healthProfile.weightKg &&
      healthProfile.age &&
      healthProfile.gender &&
      healthProfile.activityLevel
        ? calculateDailyCaloricNeeds(
            Number(healthProfile.heightCm),
            Number(healthProfile.weightKg),
            healthProfile.age,
            healthProfile.gender,
            healthProfile.activityLevel
          )
        : null;

    return successResponse({
      id: healthProfile.id,
      userId: healthProfile.userId,
      heightCm: healthProfile.heightCm ? Number(healthProfile.heightCm) : null,
      weightKg: healthProfile.weightKg ? Number(healthProfile.weightKg) : null,
      age: healthProfile.age,
      gender: healthProfile.gender,
      activityLevel: healthProfile.activityLevel,
      goal: healthProfile.goal,
      targetWeightKg: healthProfile.targetWeightKg ? Number(healthProfile.targetWeightKg) : null,
      bmi,
      bmiCategory: bmi ? getBMICategory(bmi) : null,
      dailyCaloricNeeds,
      createdAt: healthProfile.createdAt,
    });
  } catch (error) {
    console.error('Get health profile error:', error);

    if (error instanceof AuthenticationError || error instanceof NotFoundError) {
      return errorResponse(error, error.statusCode);
    }

    return errorResponse(new ServerError('Failed to fetch health profile'), 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    const body = await request.json();

    const validation = healthProfileSchema.safeParse(body);
    if (!validation.success) {
      const details = validation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new ValidationError('Invalid input', details);
    }

    const { heightCm, weightKg, age, gender, activityLevel, goal, targetWeightKg } =
      validation.data;

    // Check if health profile exists
    const existingProfile = await prisma.healthProfile.findUnique({
      where: { userId: user.id },
    });

    let healthProfile;

    if (existingProfile) {
      // Update existing
      healthProfile = await prisma.healthProfile.update({
        where: { id: existingProfile.id },
        data: {
          heightCm: String(heightCm),
          weightKg: String(weightKg),
          age,
          gender,
          activityLevel,
          goal,
          targetWeightKg: targetWeightKg ? String(targetWeightKg) : null,
        },
      });
    } else {
      // Create new
      healthProfile = await prisma.healthProfile.create({
        data: {
          userId: user.id,
          heightCm: String(heightCm),
          weightKg: String(weightKg),
          age,
          gender,
          activityLevel,
          goal,
          targetWeightKg: targetWeightKg ? String(targetWeightKg) : null,
        },
      });
    }

    const bmi = calculateBMI(heightCm, weightKg);
    const dailyCaloricNeeds = calculateDailyCaloricNeeds(
      heightCm,
      weightKg,
      age,
      gender,
      activityLevel
    );

    return createdResponse({
      id: healthProfile.id,
      userId: healthProfile.userId,
      heightCm: Number(healthProfile.heightCm),
      weightKg: Number(healthProfile.weightKg),
      age: healthProfile.age,
      gender: healthProfile.gender,
      activityLevel: healthProfile.activityLevel,
      goal: healthProfile.goal,
      targetWeightKg: healthProfile.targetWeightKg ? Number(healthProfile.targetWeightKg) : null,
      bmi,
      bmiCategory: getBMICategory(bmi),
      dailyCaloricNeeds,
      message: existingProfile ? 'Health profile updated' : 'Health profile created',
    });
  } catch (error) {
    console.error('Post/Update health profile error:', error);

    if (error instanceof z.ZodError) {
      const details = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return errorResponse(new ValidationError('Invalid input', details), 400);
    }

    if (
      error instanceof AuthenticationError ||
      error instanceof ValidationError ||
      error instanceof NotFoundError
    ) {
      return errorResponse(error, error.statusCode);
    }

    return errorResponse(new ServerError('Failed to save health profile'), 500);
  }
}
