import { SignJWT, jwtVerify } from 'jose';
import { SessionUser } from '@/types/auth';

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || 'leads_digital_super_secret_jwt_key_2026_scalyx'
);

export async function signSessionToken(user: SessionUser): Promise<string> {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions: user.permissions,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as SessionUser['role'],
      permissions: payload.permissions as SessionUser['permissions'],
    };
  } catch {
    return null;
  }
}
