import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { generateToken } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import { successResponse, errorResponse } from '@/lib/api';
import { AuthenticationError, ValidationError, ServerError } from '@/lib/errors';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      const details = validation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new ValidationError('Invalid input', details);
    }

    const { email, password } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    return successResponse(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        token,
      },
      'Login successful'
    );
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof z.ZodError) {
      const details = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return errorResponse(new ValidationError('Invalid input', details), 400);
    }

    if (error instanceof AuthenticationError || error instanceof ValidationError) {
      return errorResponse(error, error.statusCode);
    }

    return errorResponse(new ServerError('Login failed'), 500);
  }
}
