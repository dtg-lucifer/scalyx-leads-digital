import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasPermission } from '@/lib/auth/rbac';
import { sendTemplatedEmail, EmailAttachment } from '@/lib/email/sender';
import { sanitizeEmailParams } from '@/lib/url';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, 'emails', 'send')) {
    return NextResponse.json({ error: 'Unauthorized to send emails' }, { status: 403 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let to = '';
    let subject = '';
    let templateId: any = 'client_onboarding';
    let params: Record<string, string> = {};
    const attachments: EmailAttachment[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      to = (formData.get('to') as string) || '';
      subject = (formData.get('subject') as string) || '';
      templateId = (formData.get('templateId') as any) || 'client_onboarding';

      const paramsRaw = formData.get('params');
      if (paramsRaw && typeof paramsRaw === 'string') {
        try {
          params = JSON.parse(paramsRaw);
        } catch {
          params = {};
        }
      }

      // Collect all attached files
      const files = formData.getAll('attachments') as File[];
      for (const file of files) {
        if (file && typeof file.arrayBuffer === 'function') {
          const arrayBuffer = await file.arrayBuffer();
          attachments.push({
            filename: file.name,
            content: Buffer.from(arrayBuffer),
            contentType: file.type || 'application/octet-stream',
          });
        }
      }
    } else {
      const body = await req.json();
      to = body.to;
      subject = body.subject;
      templateId = body.templateId;
      params = body.params || {};

      if (body.attachments && Array.isArray(body.attachments)) {
        for (const att of body.attachments) {
          attachments.push({
            filename: att.filename,
            content: att.content,
            contentType: att.contentType,
          });
        }
      }
    }

    if (!to || !subject || !templateId) {
      return NextResponse.json({ error: 'Recipient email, subject, and template are required' }, { status: 400 });
    }

    // Pass attached files list to template if not already passed
    if (attachments.length > 0 && !params.attachedFilesList) {
      params.attachedFilesList = attachments.map((a) => a.filename).join(', ');
    }

    const sanitizedParams = sanitizeEmailParams(params, req);

    const result = await sendTemplatedEmail(
      {
        to,
        subject,
        templateId,
        params: sanitizedParams,
        attachments,
        sentBy: user.email,
      },
      req,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to dispatch email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: result.id, attachmentsCount: attachments.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Email sending failed' }, { status: 500 });
  }
}
