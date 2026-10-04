import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/session';
import { generateRandomPassword } from '@/lib/auth/password';
import { sendTemplatedEmail } from '@/lib/email/sender';
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
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`;
    await sendTemplatedEmail({
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
    });

    return NextResponse.json({
      success: true,
      user: newUser,
      generatedPassword: autoPassword, // returned so admin can see/copy if needed
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create user' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'super_admin') {
    return NextResponse.json({ error: 'Only Super Admin can update user permissions' }, { status: 403 });
  }

  try {
    const { userId, permissions } = await req.json();
    if (!userId || !permissions) {
      return NextResponse.json({ error: 'User ID and permissions are required' }, { status: 400 });
    }

    const updatedUser = await db.updateUserPermissions(userId, permissions);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update user' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'super_admin') {
    return NextResponse.json({ error: 'Only Super Admin can delete users' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    await db.deleteUser(userId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete user' }, { status: 400 });
  }
}
