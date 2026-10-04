import { Resend } from 'resend';
import { db } from '@/lib/db/store';
import { renderEmailHtml } from './templates';
import { EmailTemplateId } from '@/types/email';

const resendApiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  templateId: EmailTemplateId;
  params: Record<string, string>;
  attachments?: EmailAttachment[];
  sentBy?: string;
}

export async function sendTemplatedEmail(options: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  const html = renderEmailHtml(options.templateId, options.params);
  const senderEmail = process.env.RESEND_FROM_EMAIL || 'Scalyx <onboarding@resend.dev>';

  if (!resend) {
    const errorMsg = 'Resend API key not configured';
    await db.logEmail({
      recipient: options.to,
      subject: options.subject,
      templateType: options.templateId,
      status: 'failed',
      errorMessage: errorMsg,
      sentBy: options.sentBy,
    });
    return { success: false, error: errorMsg };
  }

  try {
    const emailPayload: any = {
      from: senderEmail,
      to: options.to,
      subject: options.subject,
      html,
    };

    if (options.attachments && options.attachments.length > 0) {
      emailPayload.attachments = options.attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
      }));
    }

    const result = await resend.emails.send(emailPayload);

    if (result.error) {
      await db.logEmail({
        recipient: options.to,
        subject: options.subject,
        templateType: options.templateId,
        status: 'failed',
        errorMessage: result.error.message,
        sentBy: options.sentBy,
      });
      return { success: false, error: result.error.message };
    }

    await db.logEmail({
      recipient: options.to,
      subject: options.subject,
      templateType: options.templateId,
      status: 'sent',
      sentBy: options.sentBy,
    });

    return { success: true, id: result.data?.id };
  } catch (err: any) {
    const errorMsg = err.message || 'Unknown Resend error';
    await db.logEmail({
      recipient: options.to,
      subject: options.subject,
      templateType: options.templateId,
      status: 'failed',
      errorMessage: errorMsg,
      sentBy: options.sentBy,
    });
    return { success: false, error: errorMsg };
  }
}
