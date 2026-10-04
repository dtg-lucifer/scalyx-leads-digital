import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { uploadToSupabaseStorage, deleteFromSupabaseStorage } from '@/lib/storage/supabaseStorage';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get('leadId') || undefined;

  const deliverables = await db.getDeliverables(leadId);
  return NextResponse.json({ deliverables });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const leadId = formData.get('leadId') as string;
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) || '';
    const category = (formData.get('category') as string) || 'deliverable_from_us';
    const file = formData.get('file') as File | null;
    const uploader = (formData.get('uploadedBy') as string) || 'Team Member';

    if (!leadId || !title) {
      return NextResponse.json({ error: 'Lead and Title are required' }, { status: 400 });
    }

    const fileName = file ? file.name : (formData.get('fileName') as string) || 'deliverable-package.zip';
    const fileSize = file ? file.size : Number(formData.get('fileSize')) || 1024;
    let fileUrl = (formData.get('fileUrl') as string) || '';

    let storagePath: string | undefined = undefined;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      storagePath = `${Date.now()}-${fileName.replace(/\s+/g, '_')}`;

      // Upload directly to Supabase storage bucket 'deliverables'
      const { publicUrl, error: uploadErr } = await uploadToSupabaseStorage(
        'deliverables',
        storagePath,
        buffer,
        file.type || 'application/octet-stream'
      );

      if (uploadErr) {
        console.warn('Supabase deliverables upload warning:', uploadErr);
      }
      if (publicUrl) {
        fileUrl = publicUrl;
      }
    }

    const item = await db.createDeliverable({
      leadId,
      title,
      description,
      category: category as any,
      fileName,
      fileSize,
      fileUrl: fileUrl || `#`,
      storagePath,
      uploadedBy: uploader,
    });

    item.fileUrl = `/api/deliverables/${item.id}/download`;

    return NextResponse.json({ success: true, deliverable: item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create deliverable' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'deliverables', 'delete')) {
    return NextResponse.json({ error: 'Unauthorized to delete deliverables' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const deliverable = await db.getDeliverableById(id);
    if (deliverable && deliverable.storagePath) {
      await deleteFromSupabaseStorage('deliverables', deliverable.storagePath);
    }

    await db.deleteDeliverable(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete deliverable' }, { status: 400 });
  }
}
