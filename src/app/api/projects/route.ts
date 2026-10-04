import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'projects', 'view')) {
    return NextResponse.json({ error: 'Unauthorized to view projects' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get('leadId') || undefined;

  const projects = await db.getProjects(leadId);
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'projects', 'create')) {
    return NextResponse.json({ error: 'Unauthorized to create projects' }, { status: 403 });
  }

  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: 'Project title is required' }, { status: 400 });
    }

    const newProject = await db.createProject({
      leadId: body.leadId || undefined,
      leadName: body.leadName,
      title: body.title,
      description: body.description || '',
      status: body.status || 'In Progress',
      budget: Number(body.budget) || 0,
      currency: body.currency || 'INR',
      kanbanUrl: body.kanbanUrl || '',
      startDate: body.startDate,
      targetDate: body.targetDate,
      assignedTeammates: body.assignedTeammates || [user.name],
    });

    return NextResponse.json({ success: true, project: newProject });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create project' }, { status: 400 });
  }
}
