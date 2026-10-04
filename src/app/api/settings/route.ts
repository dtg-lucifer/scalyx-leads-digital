import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [settings, retentionDays] = await Promise.all([
    db.getSettings(),
    db.getRetentionDays(),
  ]);
  return NextResponse.json({ settings, retentionDays });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Only Super Admin can update settings' }, { status: 403 });
  }

  try {
    const { retentionDays, agencyName, agencyEmail, agencyPhone, agencyWebsite } = await req.json();

    if (retentionDays !== undefined) {
      await db.setRetentionDays(Number(retentionDays));
    }
    if (agencyName) await db.updateSetting('agencyName', agencyName);
    if (agencyEmail) await db.updateSetting('agencyEmail', agencyEmail);
    if (agencyPhone) await db.updateSetting('agencyPhone', agencyPhone);
    if (agencyWebsite) await db.updateSetting('agencyWebsite', agencyWebsite);

    const [updatedSettings, updatedRetention] = await Promise.all([
      db.getSettings(),
      db.getRetentionDays(),
    ]);

    return NextResponse.json({ success: true, settings: updatedSettings, retentionDays: updatedRetention });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update settings' }, { status: 400 });
  }
}
