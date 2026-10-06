import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth/session';
import { handleCorsPreflight, applyCorsHeaders } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  return handleCorsPreflight(req);
}

export async function POST(req: NextRequest) {
  await clearSessionCookie();
  return applyCorsHeaders(
    NextResponse.json({ success: true }),
    req,
  );
}
