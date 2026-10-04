import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { uploadToSupabaseStorage, deleteFromSupabaseStorage } from '@/lib/storage/supabaseStorage';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'documents', 'view')) {
    return NextResponse.json({ error: 'Unauthorized to view files' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get('folderId');

  const files = await db.getFiles(folderId || undefined);
  return NextResponse.json({ files });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'documents', 'upload')) {
    return NextResponse.json({ error: 'Unauthorized to upload files' }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folderId = (formData.get('folderId') as string) || null;
    const leadId = (formData.get('leadId') as string) || null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = file.name;
    const fileSize = file.size;
    const mimeType = file.type || 'application/octet-stream';
    const storagePath = `${Date.now()}-${fileName.replace(/\s+/g, '_')}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload directly to Supabase storage bucket 'documents'
    const { publicUrl, error: uploadErr } = await uploadToSupabaseStorage(
      'documents',
      storagePath,
      buffer,
      mimeType
    );

    if (uploadErr) {
      console.warn('Supabase storage upload warning:', uploadErr);
    }

    let leadName = undefined;
    if (leadId) {
      const lead = await db.getLeadById(leadId);
      if (lead) leadName = lead.name;
    }

    const newFile = await db.createFile({
      name: fileName,
      folderId,
      leadId: leadId || undefined,
      leadName,
      size: fileSize,
      mimeType,
      storagePath,
      publicUrl: publicUrl || `/api/documents/download?id=${storagePath}`,
      isShared: false,
      uploadedBy: user.id,
    });

    return NextResponse.json({ success: true, file: newFile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to upload file' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'documents', 'share')) {
    return NextResponse.json({ error: 'Unauthorized to share files' }, { status: 403 });
  }

  try {
    const { fileId, isShared } = await req.json();
    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    const updated = await db.shareFile(fileId, Boolean(isShared));
    if (!updated) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const shareUrl = `${url.replace(/\/$/, "")}/share/${updated.shareToken}`;

    return NextResponse.json({ success: true, file: updated, shareUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to share file' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'documents', 'delete')) {
    return NextResponse.json({ error: 'Unauthorized to delete files' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');
    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    const file = await db.getFileById(fileId);
    if (file) {
      await deleteFromSupabaseStorage('documents', file.storagePath);
      await db.deleteFile(fileId);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete file' }, { status: 400 });
  }
}
