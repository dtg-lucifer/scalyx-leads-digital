import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { sendTemplatedEmail } from '@/lib/email/sender';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'leads', 'view')) {
    return NextResponse.json({ error: 'Unauthorized to view leads' }, { status: 401 });
  }

  const leads = await db.getLeads();
  return NextResponse.json({ leads });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'leads', 'create')) {
    return NextResponse.json({ error: 'Unauthorized to create leads' }, { status: 403 });
  }

  try {
    const body = await req.json();

    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Lead name and email are required' }, { status: 400 });
    }

    const lead = await db.createLead({
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      company: body.company || '',
      roleTitle: body.roleTitle || '',
      source: body.source || 'Website',
      status: body.status || 'New',
      dealValue: Number(body.dealValue) || 0,
      revenueCollected: Number(body.revenueCollected) || 0,
      currency: body.currency || 'INR',
      notes: body.notes || '',
      remarks: body.remarks || '',
      portalAccessCode: body.portalAccessCode,
    });

    // Optionally send welcome email with portal link if requested
    if (body.sendWelcomeEmail) {
      const { getAppBaseUrl } = await import('@/lib/email/templates');
      const portal = await db.getPortalByLeadId(lead.id);
      const portalUrl = `${getAppBaseUrl()}/portal/${portal?.slug || lead.id}`;
      await sendTemplatedEmail({
        to: lead.email,
        subject: `Welcome to Scalyx • Your Dedicated Client Portal for ${lead.company || lead.name}`,
        templateId: 'client_onboarding',
        params: {
          clientName: lead.name,
          companyName: lead.company || lead.name,
          portalUrl,
          portalPassword: lead.portalAccessCode || '',
          customMessage: lead.notes || 'Welcome to Scalyx! Track your project milestones and files via your portal.',
        },
        sentBy: user.email,
      });
    }

    return NextResponse.json({ success: true, lead });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create lead' }, { status: 400 });
  }
}
