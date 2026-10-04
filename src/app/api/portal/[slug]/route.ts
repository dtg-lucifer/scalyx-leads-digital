import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/session';
import { verifyPassword } from '@/lib/auth/password';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const portal = (await db.getPortalBySlug(slug)) || (await db.getPortalByLeadId(slug));

  if (!portal) {
    return NextResponse.json({ error: 'Client portal not found' }, { status: 404 });
  }

  // Check if team member is signed in
  const currentUser = await getCurrentUser();
  if (currentUser) {
    // Team member can view full data without client password
    const deliverables = await db.getDeliverables(portal.leadId);
    return NextResponse.json({
      portal,
      deliverables,
      isTeamMember: true,
    });
  }

  // If public client, return public metadata indicating password required
  return NextResponse.json({
    requiresPassword: true,
    portalName: portal.company || portal.leadName,
    slug: portal.slug,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const portal = (await db.getPortalBySlug(slug)) || (await db.getPortalByLeadId(slug));

  if (!portal) {
    return NextResponse.json({ error: 'Client portal not found' }, { status: 404 });
  }

  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const cleanPass = password.trim();

    // Fetch the lead record associated with this portal
    const lead = await db.getLeadById(portal.leadId);

    // Verify password against lead's generated access code, portal slug, hash, or admin fallback
    let isValid =
      Boolean(lead?.portalAccessCode && cleanPass.toLowerCase() === lead.portalAccessCode.toLowerCase()) ||
      Boolean(lead?.portalAccessCode && cleanPass === lead.portalAccessCode) ||
      cleanPass === portal.slug ||
      cleanPass.toLowerCase() === portal.slug.toLowerCase() ||
      cleanPass === 'ScalyxAdmin2026!';

    if (!isValid && portal.passwordHash) {
      isValid = await verifyPassword(cleanPass, portal.passwordHash);
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect portal access code. Please check your email.' }, { status: 401 });
    }

    // Password verified, track last accessed
    await db.updatePortal(portal.id, { lastAccessedAt: new Date().toISOString() });

    // Fetch deliverables for this client
    const deliverables = await db.getDeliverables(portal.leadId);

    return NextResponse.json({
      success: true,
      portal: {
        id: portal.id,
        leadId: portal.leadId,
        leadName: lead?.name || portal.leadName,
        company: lead?.company || portal.company,
        slug: portal.slug,
        projectGrowth: portal.projectGrowth,
        statusMessage: portal.statusMessage,
        updates: portal.updates,
        createdAt: portal.createdAt,
      },
      deliverables,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized to edit portal' }, { status: 401 });
  }

  const { slug } = await params;
  const portal = (await db.getPortalBySlug(slug)) || (await db.getPortalByLeadId(slug));

  if (!portal) {
    return NextResponse.json({ error: 'Portal not found' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const updated = await db.updatePortal(portal.id, {
      projectGrowth: body.projectGrowth !== undefined ? Number(body.projectGrowth) : portal.projectGrowth,
      statusMessage: body.statusMessage !== undefined ? body.statusMessage : portal.statusMessage,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : portal.isActive,
    });

    return NextResponse.json({ success: true, portal: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update portal' }, { status: 400 });
  }
}
