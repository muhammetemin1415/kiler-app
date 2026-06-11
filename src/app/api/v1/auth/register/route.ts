import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { generateToken, generateVerificationToken } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';
import { successResponse, errorResponse, createdResponse } from '@/lib/api';
import { ConflictError, ValidationError, ServerError } from '@/lib/errors';
import { sendVerificationEmail } from '@/lib/email';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const details = validation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new ValidationError('Invalid input', details);
    }

    const { email, password, firstName, lastName } = validation.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate verification token
    const verificationToken = generateVerificationToken(email);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        verificationToken,
      },
    });

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    // Send verification email (optional for MVP)
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.warn('Failed to send verification email:', emailError);
    }

    return createdResponse({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
      message: 'Registration successful. Please verify your email.',
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof z.ZodError) {
      const details = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return errorResponse(new ValidationError('Invalid input', details), 400);
    }

    if (error instanceof ConflictError || error instanceof ValidationError) {
      return errorResponse(error, error.statusCode);
    }

    return errorResponse(new ServerError('Registration failed'), 500);
  }
}
