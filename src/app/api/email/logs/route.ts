import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { renderEmailHtml } from '@/lib/email/templates';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const logs = await db.getEmailLogs();
  return NextResponse.json({ logs });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { templateId, params } = await req.json();
  const html = renderEmailHtml(templateId, params || {});
  return NextResponse.json({ html });
}
