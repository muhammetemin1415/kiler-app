import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyVerificationToken } from '@/lib/auth';
import { verifyEmailSchema } from '@/lib/validation';
import { successResponse, errorResponse } from '@/lib/api';
import { AuthenticationError, ValidationError, NotFoundError, ServerError } from '@/lib/errors';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = verifyEmailSchema.safeParse(body);
    if (!validation.success) {
      const details = validation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new ValidationError('Invalid input', details);
    }

    const { token } = validation.data;

    // Verify token
    let decoded;
    try {
      decoded = verifyVerificationToken(token);
    } catch (error) {
      throw new AuthenticationError(
        error instanceof Error ? error.message : 'Invalid verification token'
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    // Check if already verified
    if (user.isVerified) {
      return successResponse({
        message: 'Email already verified',
        isVerified: true,
      });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    return successResponse({
      id: updatedUser.id,
      email: updatedUser.email,
      isVerified: updatedUser.isVerified,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Email verification error:', error);

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

    return errorResponse(new ServerError('Email verification failed'), 500);
  }
}
