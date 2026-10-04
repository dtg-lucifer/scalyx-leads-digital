import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/session';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const item = await db.restoreDeliverable(id);
    return NextResponse.json({ success: true, deliverable: item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to restore deliverable' }, { status: 400 });
  }
}
