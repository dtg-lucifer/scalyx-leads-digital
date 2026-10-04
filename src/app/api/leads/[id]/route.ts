import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'leads', 'view')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const lead = await db.getLeadById(id);
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  // Fetch full relational data
  const [allFiles, allFolders, deliverables, projects, portal] = await Promise.all([
    db.getFiles(),
    db.getFolders(),
    db.getDeliverables(id),
    db.getProjects(id),
    db.getPortalByLeadId(id),
  ]);

  const files = allFiles.filter((f) => f.leadId === id);
  const folders = allFolders.filter((f) => f.leadId === id);

  return NextResponse.json({
    lead,
    relations: {
      files,
      folders,
      deliverables,
      projects,
      portal,
    },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'leads', 'edit')) {
    return NextResponse.json({ error: 'Unauthorized to edit leads' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const updates = await req.json();
    const updatedLead = await db.updateLead(id, updates);
    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update lead' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'leads', 'delete')) {
    return NextResponse.json({ error: 'Unauthorized to delete leads' }, { status: 403 });
  }

  const { id } = await params;
  try {
    await db.deleteLead(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete lead' }, { status: 400 });
  }
}
