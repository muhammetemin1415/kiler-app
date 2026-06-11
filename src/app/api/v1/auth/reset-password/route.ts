import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyResetToken } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { resetPasswordSchema } from '@/lib/validation';
import { successResponse, errorResponse } from '@/lib/api';
import { AuthenticationError, ValidationError, NotFoundError, ServerError } from '@/lib/errors';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      const details = validation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new ValidationError('Invalid input', details);
    }

    const { token, newPassword } = validation.data;

    // Verify token
    let decoded;
    try {
      decoded = verifyResetToken(token);
    } catch (error) {
      throw new AuthenticationError(
        error instanceof Error ? error.message : 'Invalid or expired reset token'
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    // Check if token matches and not expired
    if (!user.resetToken || user.resetToken !== token) {
      throw new AuthenticationError('Invalid reset token');
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new AuthenticationError('Reset token has expired');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return successResponse({
      id: updatedUser.id,
      email: updatedUser.email,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    console.error('Password reset error:', error);

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

    return errorResponse(new ServerError('Password reset failed'), 500);
  }
}
