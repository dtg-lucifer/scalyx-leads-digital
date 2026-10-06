import { NextRequest, NextResponse } from 'next/server';
import { getEmailTemplates } from '@/lib/email/templates';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ templates: getEmailTemplates(req) });
}
