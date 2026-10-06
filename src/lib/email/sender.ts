import { Resend } from "resend";
import { db } from "@/lib/db/store";
import type { EmailTemplateId } from "@/types/email";
import { getScalyxLogoBuffer, SCALYX_LOGO_CID } from "./logo";
import { renderEmailHtml } from "./templates";
import { sanitizeEmailParams } from "@/lib/url";

const resendApiKey =
  process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
  contentId?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  templateId: EmailTemplateId;
  params: Record<string, string>;
  attachments?: EmailAttachment[];
  sentBy?: string;
}

export async function sendTemplatedEmail(
  options: SendEmailOptions,
  req?: Request | Headers,
): Promise<{ success: boolean; id?: string; error?: string }> {
  // Render HTML with forSending: true so it references the inline CID attachment (cid:scalyx-logo)
  const sanitizedParams = sanitizeEmailParams(options.params, req);
  const html = await renderEmailHtml(options.templateId, sanitizedParams, {
    forSending: true,
  }, req);

  // Take the verified sender address from the environment, defaulting to contact@piush.in
  const rawSender = (
    process.env.RESEND_FROM_EMAIL || "contact@piush.in"
  ).trim();
  const senderEmail = rawSender.includes("<")
    ? rawSender
    : `Scalyx <${rawSender}>`;

  if (!resend) {
    const errorMsg = "Resend API key not configured";
    await db.logEmail({
      recipient: options.to,
      subject: options.subject,
      templateType: options.templateId,
      status: "failed",
      errorMessage: errorMsg,
      sentBy: options.sentBy,
    });
    return { success: false, error: errorMsg };
  }

  try {
    // Prepare attachments including inline CID logo
    const logoBuffer = getScalyxLogoBuffer();
    const attachmentsPayload: EmailAttachment[] = [
      {
        filename: "scalyx_logo.png",
        content: logoBuffer,
        contentType: "image/png",
        contentId: SCALYX_LOGO_CID,
      },
    ];

    if (options.attachments && options.attachments.length > 0) {
      for (const a of options.attachments) {
        attachmentsPayload.push({
          filename: a.filename,
          content: a.content,
          contentType: a.contentType,
          ...(a.contentId ? { contentId: a.contentId } : {}),
        });
      }
    }

    const emailPayload = {
      from: senderEmail,
      to: options.to,
      subject: options.subject,
      html,
      attachments: attachmentsPayload,
    };

    const result = await resend.emails.send(emailPayload);

    if (result.error) {
      await db.logEmail({
        recipient: options.to,
        subject: options.subject,
        templateType: options.templateId,
        status: "failed",
        errorMessage: result.error.message,
        sentBy: options.sentBy,
      });
      return { success: false, error: result.error.message };
    }

    await db.logEmail({
      recipient: options.to,
      subject: options.subject,
      templateType: options.templateId,
      status: "sent",
      sentBy: options.sentBy,
    });

    return { success: true, id: result.data?.id };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Unknown Resend error";
    await db.logEmail({
      recipient: options.to,
      subject: options.subject,
      templateType: options.templateId,
      status: "failed",
      errorMessage: errorMsg,
      sentBy: options.sentBy,
    });
    return { success: false, error: errorMsg };
  }
}
