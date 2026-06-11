import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateResetToken } from '@/lib/auth';
import { forgotPasswordSchema } from '@/lib/validation';
import { successResponse, errorResponse } from '@/lib/api';
import { ValidationError, ServerError } from '@/lib/errors';
import { sendPasswordResetEmail } from '@/lib/email';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      const details = validation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new ValidationError('Invalid input', details);
    }

    const { email } = validation.data;

    // Find user - don't expose if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success (security best practice)
    // Only send email if user exists
    if (user) {
      try {
        const resetToken = generateResetToken(email);

        // Store reset token in database
        await prisma.user.update({
          where: { id: user.id },
          data: {
            resetToken,
            resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
          },
        });

        // Send email
        await sendPasswordResetEmail(email, resetToken);
      } catch (emailError) {
        console.error('Failed to send reset email:', emailError);
      }
    }

    // Always return success message
    return successResponse({
      message: 'If an account with this email exists, you will receive a password reset link shortly.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);

    if (error instanceof z.ZodError) {
      const details = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return errorResponse(new ValidationError('Invalid input', details), 400);
    }

    if (error instanceof ValidationError) {
      return errorResponse(error, error.statusCode);
    }

    return errorResponse(
      new ServerError('Failed to process password reset request'),
      500
    );
  }
}
