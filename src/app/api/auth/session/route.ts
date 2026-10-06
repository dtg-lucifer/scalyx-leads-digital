import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { handleCorsPreflight, applyCorsHeaders } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  return handleCorsPreflight(req);
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return applyCorsHeaders(
      NextResponse.json({ authenticated: false, user: null }),
      req,
    );
  }
  return applyCorsHeaders(
    NextResponse.json({ authenticated: true, user }),
    req,
  );
}
