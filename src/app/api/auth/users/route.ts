import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/session';
import { generateRandomPassword } from '@/lib/auth/password';
import { sendTemplatedEmail } from '@/lib/email/sender';
import { getDeployedAppUrl } from '@/lib/url';
import { DEFAULT_TEAMMATE_PERMISSIONS, DEFAULT_VIEWER_PERMISSIONS } from '@/types/auth';

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const users = await db.getUsers();
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'super_admin') {
    return NextResponse.json({ error: 'Only Super Admin can create users' }, { status: 403 });
  }

  try {
    const { email, name, role, permissions } = await req.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const autoPassword = generateRandomPassword(12);

    let userPerms = permissions;
    if (!userPerms) {
      userPerms = role === 'viewer' ? DEFAULT_VIEWER_PERMISSIONS : DEFAULT_TEAMMATE_PERMISSIONS;
    }

    const newUser = await db.createUser({
      email,
      name,
      password: autoPassword,
      role: role || 'teammate',
      permissions: userPerms,
    });

    // Send auto-generated password to user's email via Resend
    // Always use deployed host so the teammate receives a live accessible link
    const deployedBase = getDeployedAppUrl(req);
    const loginUrl = `${deployedBase}/login`;
    await sendTemplatedEmail(
      {
        to: email,
        subject: 'Your LeadsDigital Credentials • Scalyx Portal',
        templateId: 'user_credentials',
        params: {
          name,
          email,
          password: autoPassword,
          role: role || 'teammate',
          loginUrl,
        },
        sentBy: currentUser.email,
      },
      req,
    );

    return NextResponse.json({
      success: true,
      user: newUser,
      generatedPassword: autoPassword, // returned so admin can see/copy if needed
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create user' }, { status: 400 });
  }
}
