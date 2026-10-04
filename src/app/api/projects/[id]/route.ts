import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'projects', 'edit')) {
    return NextResponse.json({ error: 'Unauthorized to edit projects' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const updates = await req.json();
    const updated = await db.updateProject(id, updates);
    return NextResponse.json({ success: true, project: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update project' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'projects', 'delete')) {
    return NextResponse.json({ error: 'Unauthorized to delete projects' }, { status: 403 });
  }

  const { id } = await params;
  try {
    await db.deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete project' }, { status: 400 });
  }
}
