import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'documents', 'view')) {
    return NextResponse.json({ error: 'Unauthorized to view documents' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const parentId = searchParams.get('parentId'); // null or string

  const folders = await db.getFolders(parentId === 'root' ? null : parentId || undefined);
  return NextResponse.json({ folders });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'documents', 'upload')) {
    return NextResponse.json({ error: 'Unauthorized to create folders' }, { status: 403 });
  }

  try {
    const { name, parentId, leadId } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const folder = await db.createFolder({
      name,
      parentId: parentId || null,
      leadId,
      createdBy: user.id,
    });

    return NextResponse.json({ success: true, folder });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create folder' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'documents', 'share')) {
    return NextResponse.json({ error: 'Unauthorized to share folders' }, { status: 403 });
  }

  try {
    const { folderId, isShared } = await req.json();
    if (!folderId) {
      return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
    }

    const updated = await db.shareFolder(folderId, Boolean(isShared));
    if (!updated) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/share/${updated.shareToken}`;

    return NextResponse.json({ success: true, folder: updated, shareUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to share folder' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'documents', 'delete')) {
    return NextResponse.json({ error: 'Unauthorized to delete folders' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get('folderId');
    if (!folderId) {
      return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
    }

    await db.deleteFolder(folderId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete folder' }, { status: 400 });
  }
}
