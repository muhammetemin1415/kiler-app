import { NextRequest } from 'next/server';
import { successResponse, errorResponse, noContentResponse } from '@/lib/api';
import { ServerError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    // Logout is typically handled client-side by removing the token
    // This endpoint serves as a confirmation and can be used for server-side session tracking in the future

    return noContentResponse();
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse(new ServerError('Logout failed'), 500);
  }
}
