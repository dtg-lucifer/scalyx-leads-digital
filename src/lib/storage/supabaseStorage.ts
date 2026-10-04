import { supabaseAdmin } from '@/lib/supabase/admin';

export async function uploadToSupabaseStorage(
  bucket: string,
  storagePath: string,
  buffer: Buffer,
  contentType: string = 'application/octet-stream'
): Promise<{ success: boolean; publicUrl: string; error?: string }> {
  try {
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(storagePath, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error(`[Supabase Storage] Upload error to ${bucket}/${storagePath}:`, uploadError);
      return { success: false, publicUrl: '', error: uploadError.message };
    }

    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(storagePath);
    return { success: true, publicUrl: urlData.publicUrl };
  } catch (err: any) {
    console.error(`[Supabase Storage] Unexpected upload error:`, err);
    return { success: false, publicUrl: '', error: err.message };
  }
}

export async function downloadFromSupabaseStorage(
  bucket: string,
  storagePath: string
): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    // Clean path if leading slash or bucket name is duplicated
    const cleanPath = storagePath.replace(new RegExp(`^${bucket}/`), '').replace(/^\/+/, '');

    // Try direct download
    let { data, error } = await supabaseAdmin.storage.from(bucket).download(cleanPath);

    // If failed, try with filename only
    if (error || !data) {
      const filename = cleanPath.split('/').pop() || cleanPath;
      const retry = await supabaseAdmin.storage.from(bucket).download(filename);
      if (retry.data) {
        data = retry.data;
        error = null;
      }
    }

    if (error || !data) {
      console.warn(`[Supabase Storage] Download not found for ${bucket}/${cleanPath}`);
      return null;
    }

    const arrayBuffer = await data.arrayBuffer();
    return {
      buffer: Buffer.from(arrayBuffer),
      contentType: data.type || 'application/octet-stream',
    };
  } catch (err: any) {
    console.error(`[Supabase Storage] Download error:`, err);
    return null;
  }
}

export async function deleteFromSupabaseStorage(
  bucket: string,
  storagePath: string
): Promise<boolean> {
  try {
    const cleanPath = storagePath.replace(new RegExp(`^${bucket}/`), '').replace(/^\/+/, '');
    const { error } = await supabaseAdmin.storage.from(bucket).remove([cleanPath]);
    return !error;
  } catch {
    return false;
  }
}

export function getSupabasePublicUrl(bucket: string, storagePath: string): string {
  const cleanPath = storagePath.replace(new RegExp(`^${bucket}/`), '').replace(/^\/+/, '');
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(cleanPath);
  return data.publicUrl;
}
