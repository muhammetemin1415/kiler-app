import jwt from 'jsonwebtoken';
import { JWTPayload } from '@/types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-at-least-32-characters-long-1234567890';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';

export function generateToken(userId: string, email: string): string {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId,
    email,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });

  return token;
}

export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Failed to verify token');
  }
}

export function generateResetToken(email: string): string {
  const payload = {
    email,
    purpose: 'password-reset',
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h',
  });

  return token;
}

export function verifyResetToken(token: string): { email: string; purpose: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      email: string;
      purpose: string;
      iat: number;
      exp: number;
    };

    if (decoded.purpose !== 'password-reset') {
      throw new Error('Invalid token purpose');
    }

    return { email: decoded.email, purpose: decoded.purpose };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Reset token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid reset token');
    }
    throw error;
  }
}

export function generateVerificationToken(email: string): string {
  const payload = {
    email,
    purpose: 'email-verification',
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });

  return token;
}

export function verifyVerificationToken(token: string): { email: string; purpose: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      email: string;
      purpose: string;
      iat: number;
      exp: number;
    };

    if (decoded.purpose !== 'email-verification') {
      throw new Error('Invalid token purpose');
    }

    return { email: decoded.email, purpose: decoded.purpose };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Verification token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid verification token');
    }
    throw error;
  }
}

export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}
