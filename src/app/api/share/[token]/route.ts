import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json({ error: 'Share token is required' }, { status: 400 });
  }

  const resource = await db.getSharedResourceByToken(token);
  if (!resource) {
    return NextResponse.json({ error: 'Shared link not found or access has been revoked' }, { status: 404 });
  }

  return NextResponse.json({ resource });
}
