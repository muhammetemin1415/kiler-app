import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { updateProfileSchema } from '@/lib/validation';
import { successResponse, errorResponse } from '@/lib/api';
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

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);

    return successResponse({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePictureUrl: user.profilePictureUrl,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Get profile error:', error);

    if (error instanceof AuthenticationError || error instanceof NotFoundError) {
      return errorResponse(error, error.statusCode);
    }

    return errorResponse(new ServerError('Failed to fetch profile'), 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    const body = await request.json();

    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      const details = validation.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new ValidationError('Invalid input', details);
    }

    const { firstName, lastName, profilePictureUrl } = validation.data;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(profilePictureUrl !== undefined && { profilePictureUrl }),
      },
    });

    return successResponse({
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      profilePictureUrl: updatedUser.profilePictureUrl,
      isVerified: updatedUser.isVerified,
    });
  } catch (error) {
    console.error('Update profile error:', error);

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

    return errorResponse(new ServerError('Failed to update profile'), 500);
  }
}
