import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'pickpick-dev-secret-change-in-production'
);

export interface JwtPayload {
  userId: string;
  email: string;
  name: string;
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(req: NextRequest): Promise<JwtPayload | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  return verifyToken(token);
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'pickpick-salt').digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
