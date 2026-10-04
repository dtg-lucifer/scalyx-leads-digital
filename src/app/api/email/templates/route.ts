import { NextResponse } from 'next/server';
import { EMAIL_TEMPLATES } from '@/lib/email/templates';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ templates: EMAIL_TEMPLATES });
}
