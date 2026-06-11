import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/auth';
import { AppError } from './errors';

export function successResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: statusCode }
  );
}

export function errorResponse(
  error: Error | AppError | string,
  statusCode: number = 500
): NextResponse<ApiResponse> {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  const message = error instanceof Error ? error.message : String(error);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: message || 'Internal server error',
      },
    },
    { status: statusCode }
  );
}

export function createdResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return successResponse(data, 'Created', 201);
}

export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}
