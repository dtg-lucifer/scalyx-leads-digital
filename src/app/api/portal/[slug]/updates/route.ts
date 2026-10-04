import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/session';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized to post updates' }, { status: 401 });
  }

  const { slug } = await params;
  const portal = (await db.getPortalBySlug(slug)) || (await db.getPortalByLeadId(slug));

  if (!portal) {
    return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
  }

  try {
    const { title, content, updateType, pinned } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const update = await db.addPortalUpdate(portal.id, {
      title,
      content,
      updateType: updateType || 'notice',
      pinned: Boolean(pinned),
      postedBy: currentUser.name,
    });

    return NextResponse.json({ success: true, update });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to post update' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  const portal = (await db.getPortalBySlug(slug)) || (await db.getPortalByLeadId(slug));

  if (!portal) {
    return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const updateId = searchParams.get('updateId');
    if (!updateId) {
      return NextResponse.json({ error: 'Update ID required' }, { status: 400 });
    }

    await db.deletePortalUpdate(portal.id, updateId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete update' }, { status: 400 });
  }
}
