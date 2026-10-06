import {
  getAppUrl,
  getDeployedAppUrl,
  ensureDeployedUrl,
  sanitizeEmailParams,
  DEFAULT_APP_HOST,
  DEPLOYED_VERCEL_HOST,
} from "@/lib/url";
import type { EmailTemplateId, EmailTemplateMeta } from "@/types/email";
import { SCALYX_LOGO_CID, SCALYX_LOGO_DATA_URI } from "./logo";
import { markdownToEmailHtml } from "./markdown";

export { getDeployedAppUrl as getAppBaseUrl, getDeployedAppUrl, ensureDeployedUrl };

export const EMAIL_TEMPLATES: EmailTemplateMeta[] = [
  {
    id: "client_onboarding",
    name: "Client Onboarding & Welcome",
    description:
      "Welcome new client, share project kick-off details, portal URL, and generated access credentials.",
    defaultSubject:
      "Welcome to Scalyx • Your Dedicated Client Portal & Project Setup",
    fields: [
      {
        key: "clientName",
        label: "Client Name",
        type: "text",
        defaultValue: "Arjun Mehta",
        placeholder: "Client contact name",
      },
      {
        key: "companyName",
        label: "Company / Project",
        type: "text",
        defaultValue: "TechCorp Solutions",
        placeholder: "Client company",
      },
      {
        key: "portalUrl",
        label: "Portal Link",
        type: "text",
        defaultValue: `${DEFAULT_APP_HOST}/portal/techcorp`,
        placeholder: "URL to client portal",
      },
      {
        key: "portalPassword",
        label: "Portal Password / Access Code",
        type: "text",
        defaultValue: "tc-portal-pass-2026",
        placeholder: "Secret access code",
      },
      {
        key: "customMessage",
        label: "Message & Project Overview (Markdown)",
        type: "textarea",
        defaultValue:
          "We are thrilled to welcome you to **Scalyx**! Everything is configured and ready for our *Phase 1* kick-off.\n\nPlease find your dedicated client portal link and secure access credentials below to monitor real-time sprints, notices, and project deliverables.",
        placeholder:
          "Markdown supported: paragraphs, **bold**, *italic*, bullet lists...",
        isMarkdown: true,
      },
    ],
  },
  {
    id: "custom_email",
    name: "Custom Markdown Email",
    description:
      "Custom email with branded Scalyx header & footer. Write any message using Markdown (paragraphs, bold, italic, lists, quotes, tables).",
    defaultSubject: "Important Announcement • Scalyx Digital Agency",
    fields: [
      {
        key: "eyebrow",
        label: "Eyebrow / Tag",
        type: "text",
        defaultValue: "OFFICIAL UPDATE",
        placeholder: "e.g. OFFICIAL NOTICE",
      },
      {
        key: "headline",
        label: "Main Headline",
        type: "text",
        defaultValue: "HELLO! We Have an Important Update",
        placeholder: "Headline text",
      },
      {
        key: "bodyMarkdown",
        label: "Email Body Content (Markdown)",
        type: "textarea",
        defaultValue:
          'We are delighted to share key updates regarding our **digital infrastructure** and upcoming deliverables.\n\n### What to expect this sprint:\n- **Full UI Refresh**: Sleek modern typography and optimized loading states\n- **Client Portal Deliverables**: Direct downloads with security retention notices\n- **Direct API Integrations**: Seamless syncing with external workflows\n\n> "Simplicity and high performance are the foundation of everything we build at Scalyx."\n\nIf you have any questions or feedback, please reply directly to this email or reach out to our project lead.',
        placeholder:
          "Write any markdown here: paragraphs, **bold**, *italic*, lists...",
        isMarkdown: true,
      },
      {
        key: "buttonText",
        label: "Button CTA Text (Optional)",
        type: "text",
        defaultValue: "Open Client Portal →",
        placeholder: "e.g. View Portal (leave empty for none)",
      },
      {
        key: "buttonUrl",
        label: "Button CTA Link (Optional)",
        type: "text",
        defaultValue: DEFAULT_APP_HOST,
        placeholder: "https://...",
      },
      {
        key: "closingNote",
        label: "Closing Note (Optional Markdown)",
        type: "textarea",
        defaultValue: "*Best regards,*  \n**The Scalyx Digital Team**",
        placeholder: "Closing note or sign-off...",
        isMarkdown: true,
      },
    ],
  },
  {
    id: "project_milestone",
    name: "Project Milestone / Sprint Update",
    description:
      "Inform client of milestone completion, live demo links, and upcoming deliverables.",
    defaultSubject: "Project Milestone Completed • Sprint Progress Update",
    fields: [
      {
        key: "clientName",
        label: "Client Name",
        type: "text",
        defaultValue: "Arjun Mehta",
      },
      {
        key: "projectName",
        label: "Project Name",
        type: "text",
        defaultValue: "AI Assistant & Full-Stack Portal",
      },
      {
        key: "milestoneTitle",
        label: "Milestone Title",
        type: "text",
        defaultValue: "Phase 1 MVP Architecture & Authentication Deployed",
      },
      {
        key: "completionPercentage",
        label: "Overall Completion (%)",
        type: "number",
        defaultValue: "65",
      },
      {
        key: "demoUrl",
        label: "Staging / Demo URL",
        type: "text",
        defaultValue: "https://staging.scalyx.in",
      },
      {
        key: "notes",
        label: "Summary & Next Steps (Markdown)",
        type: "textarea",
        defaultValue:
          "Database indexes, API endpoints, and authentication pipelines have been **tested and deployed successfully**.\n\nNext sprint focus:\n- Real-time client analytics dashboard\n- Final UI polish and mobile responsiveness testing",
        placeholder: "Markdown supported...",
        isMarkdown: true,
      },
    ],
  },
  {
    id: "deliverables_ready",
    name: "Deliverables Ready for Download",
    description:
      "Notify client that new deliverables are packaged with retention notice (3-day soft delete notice).",
    defaultSubject:
      "New Deliverables Ready for Download • Scalyx Project Portal",
    fields: [
      {
        key: "clientName",
        label: "Client Name",
        type: "text",
        defaultValue: "Arjun Mehta",
      },
      {
        key: "deliverableTitle",
        label: "Deliverable Title",
        type: "text",
        defaultValue: "Phase 1 Frontend Prototype & UI Source Code",
      },
      {
        key: "downloadUrl",
        label: "Portal Download Link",
        type: "text",
        defaultValue: `${DEFAULT_APP_HOST}/portal/techcorp`,
      },
      {
        key: "retentionNotice",
        label: "Retention Days Notice",
        type: "text",
        defaultValue: "3 days after first download",
      },
      {
        key: "notes",
        label: "Instructions & Notes (Markdown)",
        type: "textarea",
        defaultValue:
          "Please review the attached package and download your deliverables before the retention window expires.\n\nAll verified source code, architectural schemas, and media assets are packaged in the download bundle.",
        placeholder: "Markdown supported...",
        isMarkdown: true,
      },
    ],
  },
  {
    id: "invoice_reminder",
    name: "Invoice Notification & Payment Reminder",
    description: "Share invoice number, due date, amount, and payment details.",
    defaultSubject: "Invoice INV-2026-001 from Scalyx • Amount Due",
    fields: [
      {
        key: "clientName",
        label: "Client Name",
        type: "text",
        defaultValue: "Arjun Mehta",
      },
      {
        key: "invoiceNumber",
        label: "Invoice #",
        type: "text",
        defaultValue: "INV-2026-001",
      },
      {
        key: "amount",
        label: "Amount Due",
        type: "text",
        defaultValue: "₹60,000.00",
      },
      {
        key: "dueDate",
        label: "Due Date",
        type: "date",
        defaultValue: new Date(Date.now() + 7 * 86400000)
          .toISOString()
          .split("T")[0],
      },
      {
        key: "paymentDetails",
        label: "Payment Details / UPI",
        type: "text",
        defaultValue: "contact@scalyx.in / Bank Transfer: Scalyx",
      },
      {
        key: "notes",
        label: "Notes & Policy (Markdown)",
        type: "textarea",
        defaultValue:
          "Thank you for your business. Please reply to this email with the payment confirmation receipt upon initiation.\n\nFor any billing questions, contact our finance desk at **billing@scalyx.in**.",
        placeholder: "Markdown supported...",
        isMarkdown: true,
      },
    ],
  },
  {
    id: "meeting_followup",
    name: "Meeting Follow-up & Next Steps",
    description:
      "Quick summary after client sync call with action items and timelines.",
    defaultSubject: "Meeting Notes & Next Steps • Scalyx Discussion",
    fields: [
      {
        key: "clientName",
        label: "Client Name",
        type: "text",
        defaultValue: "Arjun Mehta",
      },
      {
        key: "meetingTopic",
        label: "Meeting Topic",
        type: "text",
        defaultValue: "Feature Scope Review & Deliverables Timeline",
      },
      {
        key: "actionItems",
        label: "Agreed Action Items (Markdown)",
        type: "textarea",
        defaultValue:
          "1. **Scalyx Team**: Deliver staging build and test coverage by *Friday*.\n2. **Client Team**: Provide production credentials and third-party API keys.\n3. **Joint Sync**: Next sprint review scheduled for **Tuesday at 4 PM IST**.",
        placeholder: "Markdown supported...",
        isMarkdown: true,
      },
      {
        key: "portalUrl",
        label: "Project Portal",
        type: "text",
        defaultValue: `${DEFAULT_APP_HOST}/portal/techcorp`,
      },
    ],
  },
  {
    id: "portal_credentials",
    name: "Client Portal Access Credentials",
    description: "Send or regenerate dedicated password for client portal.",
    defaultSubject: "Your Scalyx Project Portal Access Password",
    fields: [
      {
        key: "clientName",
        label: "Client Name",
        type: "text",
        defaultValue: "Arjun Mehta",
      },
      {
        key: "portalUrl",
        label: "Portal Link",
        type: "text",
        defaultValue: `${DEFAULT_APP_HOST}/portal/techcorp`,
      },
      {
        key: "portalPassword",
        label: "Your Password",
        type: "text",
        defaultValue: "tc-portal-pass-2026",
      },
      {
        key: "customMessage",
        label: "Instructions & Notes (Markdown)",
        type: "textarea",
        defaultValue:
          "Here are your refreshed credentials for your **Scalyx Client Portal**.\n\nUse this confidential access code whenever prompted to access your live project growth charts, notices, and deliverables.",
        placeholder: "Markdown supported...",
        isMarkdown: true,
      },
    ],
  },
  {
    id: "user_credentials",
    name: "Team User Account Credentials",
    description:
      "Send invitation and login password to new internal team members.",
    defaultSubject: "Welcome to LeadsDigital Team! • Scalyx Credentials",
    fields: [
      {
        key: "name",
        label: "Teammate Name",
        type: "text",
        defaultValue: "Team Member",
      },
      {
        key: "email",
        label: "Email",
        type: "text",
        defaultValue: "team@scalyx.in",
      },
      {
        key: "password",
        label: "Temporary Password",
        type: "text",
        defaultValue: "Secr3t-Pass#2026",
      },
      {
        key: "role",
        label: "Role",
        type: "text",
        defaultValue: "Teammate",
      },
      {
        key: "loginUrl",
        label: "Login URL",
        type: "text",
        defaultValue: `${DEFAULT_APP_HOST}/login`,
      },
      {
        key: "notes",
        label: "Notes & Instructions (Markdown)",
        type: "textarea",
        defaultValue:
          "A team account has been provisioned for you on the **LeadsDigital** portal for **Scalyx**.\n\nPlease sign in using your temporary password and update it in your profile settings.",
        placeholder: "Markdown supported...",
        isMarkdown: true,
      },
    ],
  },
];

/**
 * Returns all email templates with dynamic default URLs resolved
 * via getDeployedAppUrl using the active NEXT_PUBLIC_APP_URL.
 */
export function getEmailTemplates(req?: Request | Headers): EmailTemplateMeta[] {
  return EMAIL_TEMPLATES.map((tmpl) => ({
    ...tmpl,
    fields: tmpl.fields.map((f) => {
      if (
        f.defaultValue &&
        (f.key.toLowerCase().endsWith("url") ||
          f.key.toLowerCase().endsWith("link"))
      ) {
        return {
          ...f,
          defaultValue: ensureDeployedUrl(f.defaultValue, req),
        };
      }
      return f;
    }),
  }));
}

interface RenderOptions {
  forSending?: boolean;
}

export async function renderEmailHtml(
  templateId: EmailTemplateId,
  rawParams: Record<string, string>,
  options?: RenderOptions,
  req?: Request | Headers,
): Promise<string> {
  const currentYear = new Date().getFullYear();
  const baseUrl = getDeployedAppUrl(req);
  const params = sanitizeEmailParams(rawParams, req);

  // For emails dispatched via Resend, reference the inline CID attachment.
  // For web preview in dashboard iframe, use the base64 data URI so it renders instantly.
  const logoSrc = options?.forSending
    ? `cid:${SCALYX_LOGO_CID}`
    : SCALYX_LOGO_DATA_URI;

  let bodyContent = "";

  switch (templateId) {
    case "custom_email": {
      const eyebrow = params.eyebrow || "OFFICIAL UPDATE";
      const headline = params.headline || "HELLO!";
      const bodyHtml = await markdownToEmailHtml(
        params.bodyMarkdown ||
          "We are delighted to share key updates regarding our **digital infrastructure** and upcoming deliverables.",
      );
      const closingHtml = params.closingNote
        ? await markdownToEmailHtml(params.closingNote)
        : "";
      const buttonHtml =
        params.buttonText && params.buttonUrl
          ? `
        <div style="margin: 26px 0 20px;">
          <a href="${params.buttonUrl}" class="cta-button" style="display: inline-block; background-color: #0f172a; color: #ffffff !important; padding: 13px 28px; border-radius: 0px !important; font-weight: 700; text-decoration: none; font-size: 13.5px; letter-spacing: 0.1px; box-sizing: border-box; text-align: center; max-width: 100%;">
            ${params.buttonText}
          </a>
        </div>
      `
          : "";

      bodyContent = `
        <div style="margin-bottom: 12px;">
          <span style="display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #475569; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 0px !important;">
            ${eyebrow}
          </span>
        </div>
        <h1 class="headline-title" style="margin: 0 0 18px 0; color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.25; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;">
          ${headline}
        </h1>
        <div style="color: #334155; font-size: 14px; line-height: 1.7; word-break: break-word; overflow-wrap: anywhere;">
          ${bodyHtml}
        </div>
        ${buttonHtml}
        ${
          closingHtml
            ? `<div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; color: #475569; font-size: 13.5px; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;">${closingHtml}</div>`
            : ""
        }
      `;
      break;
    }

    case "client_onboarding": {
      const customMessageHtml = await markdownToEmailHtml(
        params.customMessage ||
          "We are excited to partner with your team on this project! Everything is configured and ready for Phase 1 kick-off.",
      );

      bodyContent = `
        <div style="margin-bottom: 12px;">
          <span style="display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #475569; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 0px !important;">
            PROJECT ONBOARDING
          </span>
        </div>
        <h1 class="headline-title" style="margin: 0 0 18px 0; color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.25; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;">
          Welcome Aboard, ${params.clientName || "Partner"}
        </h1>
        <div style="color: #334155; font-size: 14px; line-height: 1.7; margin-bottom: 22px; word-break: break-word; overflow-wrap: anywhere;">
          ${customMessageHtml}
        </div>

        <!-- Modern Zero-Overflow & 100% Sharp-Cornered Credentials Card -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0px !important; padding: 18px 20px; margin: 22px 0; box-sizing: border-box; max-width: 100%;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #0f172a; margin-bottom: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
            Client Portal Credentials
          </div>
          
          <div style="margin-bottom: 14px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px;">
              Direct Portal URL
            </div>
            <div style="word-break: break-all; overflow-wrap: anywhere;">
              <a href="${params.portalUrl}" style="color: #2563eb; font-weight: 600; text-decoration: underline; font-size: 13.5px; word-break: break-all;">
                ${params.portalUrl}
              </a>
            </div>
          </div>

          <div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 6px;">
              Access Code / Password
            </div>
            <div style="display: inline-block; background-color: #0f172a; color: #ffffff; font-family: 'Space Grotesk', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13.5px; font-weight: 700; padding: 7px 16px; border-radius: 0px !important; letter-spacing: 0.8px; word-break: break-all; max-width: 100%; box-sizing: border-box;">
              ${params.portalPassword}
            </div>
          </div>
        </div>

        <p style="margin: 0 0 22px; color: #64748b; font-size: 13px; line-height: 1.6; word-break: break-word;">
          Keep this code confidential. You can access your portal at any time to monitor your project development timeline, review notices, and download deliverables.
        </p>

        <div>
          <a href="${params.portalUrl}" class="cta-button" style="display: inline-block; background-color: #0f172a; color: #ffffff !important; padding: 13px 28px; border-radius: 0px !important; font-weight: 700; text-decoration: none; font-size: 13.5px; letter-spacing: 0.1px; box-sizing: border-box; text-align: center; max-width: 100%;">
            Open Client Portal &rarr;
          </a>
        </div>
      `;
      break;
    }

    case "project_milestone": {
      const notesHtml = await markdownToEmailHtml(
        params.notes ||
          "Please feel free to test the build and let us know your feedback.",
      );
      const completion = params.completionPercentage || "65";

      bodyContent = `
        <div style="margin-bottom: 12px;">
          <span style="display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #475569; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 0px !important;">
            SPRINT MILESTONE
          </span>
        </div>
        <h1 class="headline-title" style="margin: 0 0 18px 0; color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.25; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;">
          Project Update: ${params.projectName || "Active Sprint"}
        </h1>
        <p style="margin: 0 0 20px; color: #334155; font-size: 14px; line-height: 1.65; word-break: break-word;">
          Hi ${params.clientName || "there"}, milestone <strong>${params.milestoneTitle}</strong> has been completed.
        </p>

        <!-- Modern Sharp-Cornered Progress Card -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0px !important; padding: 18px 20px; margin: 22px 0; box-sizing: border-box; max-width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a;">Sprint Progress</span>
            <span style="font-size: 12.5px; font-weight: 800; color: #059669; background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 2px 8px; border-radius: 0px !important;">
              ${completion}% Complete
            </span>
          </div>
          <div style="background-color: #e2e8f0; border-radius: 0px !important; height: 8px; overflow: hidden; margin-top: 8px;">
            <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); height: 100%; width: ${completion}%; border-radius: 0px !important;"></div>
          </div>
          ${
            params.demoUrl
              ? `
            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #334155; word-break: break-all; overflow-wrap: anywhere;">
              <span style="color: #64748b; font-weight: 600;">Staging / Demo URL:</span> 
              <a href="${params.demoUrl}" style="color: #2563eb; text-decoration: underline; font-weight: 600; margin-left: 4px; word-break: break-all;">
                ${params.demoUrl}
              </a>
            </div>
          `
              : ""
          }
        </div>

        <div style="margin: 20px 0;">
          <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; margin-bottom: 8px;">
            Summary & Next Steps
          </div>
          <div style="color: #334155; font-size: 14px; line-height: 1.7; word-break: break-word; overflow-wrap: anywhere;">
            ${notesHtml}
          </div>
        </div>
      `;
      break;
    }

    case "deliverables_ready": {
      const notesHtml = await markdownToEmailHtml(params.notes || "");

      bodyContent = `
        <div style="margin-bottom: 12px;">
          <span style="display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #475569; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 0px !important;">
            DELIVERABLES READY
          </span>
        </div>
        <h1 class="headline-title" style="margin: 0 0 18px 0; color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.25; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;">
          Deliverable Ready for Review
        </h1>
        <p style="margin: 0 0 20px; color: #334155; font-size: 14px; line-height: 1.65; word-break: break-word;">
          Hi ${params.clientName || "there"}, your deliverable <strong>${params.deliverableTitle}</strong> is ready for download.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #0f172a; border-radius: 0px !important; padding: 14px 16px; margin: 20px 0; box-sizing: border-box; max-width: 100%;">
          <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.55; word-break: break-word;">
            <strong>Retention Window:</strong> In accordance with project policy, downloadable assets remain accessible on the portal for <strong>${params.retentionNotice || "3 days"}</strong>. Please retrieve your packages promptly.
          </p>
        </div>

        ${
          notesHtml
            ? `<div style="margin: 20px 0; color: #334155; font-size: 14px; line-height: 1.7; word-break: break-word; overflow-wrap: anywhere;">${notesHtml}</div>`
            : ""
        }

        <div style="margin-top: 24px;">
          <a href="${params.downloadUrl}" class="cta-button" style="display: inline-block; background-color: #0f172a; color: #ffffff !important; padding: 13px 28px; border-radius: 0px !important; font-weight: 700; text-decoration: none; font-size: 13.5px; letter-spacing: 0.1px; box-sizing: border-box; text-align: center; max-width: 100%;">
            Download Deliverable &rarr;
          </a>
        </div>
      `;
      break;
    }

    case "invoice_reminder": {
      const notesHtml = await markdownToEmailHtml(
        params.notes ||
          "Thank you for your valued partnership. Please reply to this email with payment confirmation once initiated.",
      );

      bodyContent = `
        <div style="margin-bottom: 12px;">
          <span style="display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #475569; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 0px !important;">
            INVOICE STATEMENT
          </span>
        </div>
        <h1 class="headline-title" style="margin: 0 0 18px 0; color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.25; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;">
          Invoice ${params.invoiceNumber}
        </h1>
        <p style="margin: 0 0 20px; color: #334155; font-size: 14px; line-height: 1.65; word-break: break-word;">
          Dear ${params.clientName || "Partner"}, please find your invoice statement and payment breakdown below:
        </p>

        <!-- Modern Sharp-Cornered Invoice Card -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0px !important; padding: 20px 22px; margin: 20px 0; box-sizing: border-box; max-width: 100%;">
          <div style="margin-bottom: 12px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Invoice Reference</div>
            <div style="font-size: 14px; font-weight: 700; color: #0f172a; font-family: 'Space Grotesk', ui-monospace, Menlo, monospace; margin-top: 2px;">
              ${params.invoiceNumber}
            </div>
          </div>

          <div style="margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px dashed #cbd5e1;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Amount Payable</div>
            <div class="stat-amount" style="font-size: 28px; font-weight: 900; color: #0f172a; letter-spacing: -0.03em; margin-top: 2px;">
              ${params.amount}
            </div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
              Due Date: <strong style="color: #0f172a;">${params.dueDate}</strong>
            </div>
          </div>

          <div style="font-size: 12.5px; color: #475569; word-break: break-word; overflow-wrap: anywhere;">
            <span style="font-weight: 700; color: #0f172a;">Payment Modes:</span> ${params.paymentDetails}
          </div>
        </div>

        <div style="margin: 20px 0; color: #334155; font-size: 14.5px; line-height: 1.7; word-break: break-word; overflow-wrap: anywhere;">
          ${notesHtml}
        </div>
      `;
      break;
    }

    case "meeting_followup": {
      const actionItemsHtml = await markdownToEmailHtml(
        params.actionItems || "",
      );

      bodyContent = `
        <div style="margin-bottom: 12px;">
          <span style="display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #475569; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 0px !important;">
            MEETING FOLLOW-UP
          </span>
        </div>
        <h1 class="headline-title" style="margin: 0 0 18px 0; color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.25; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;">
          Discussion Recap & Action Items
        </h1>
        <p style="margin: 0 0 20px; color: #334155; font-size: 14px; line-height: 1.65; word-break: break-word;">
          Hi ${params.clientName || "there"}, thank you for meeting with us regarding <strong>${params.meetingTopic}</strong>.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0px !important; padding: 18px 20px; margin: 20px 0; box-sizing: border-box; max-width: 100%;">
          <div style="margin: 0 0 12px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
            Action Items & Next Steps
          </div>
          <div style="font-size: 14px; color: #334155; line-height: 1.7; word-break: break-word; overflow-wrap: anywhere;">
            ${actionItemsHtml}
          </div>
        </div>

        ${
          params.portalUrl
            ? `
          <div style="margin-top: 24px;">
            <a href="${params.portalUrl}" class="cta-button" style="display: inline-block; background-color: #0f172a; color: #ffffff !important; padding: 13px 28px; border-radius: 0px !important; font-weight: 700; text-decoration: none; font-size: 13.5px; letter-spacing: 0.1px; box-sizing: border-box; text-align: center; max-width: 100%;">
              Open Project Portal &rarr;
            </a>
          </div>
        `
            : ""
        }
      `;
      break;
    }

    case "portal_credentials": {
      const customMessageHtml = await markdownToEmailHtml(
        params.customMessage ||
          "Use this confidential code to access your live project growth charts, notices, and deliverables.",
      );

      bodyContent = `
        <div style="margin-bottom: 12px;">
          <span style="display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #475569; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 0px !important;">
            PORTAL ACCESS
          </span>
        </div>
        <h1 class="headline-title" style="margin: 0 0 18px 0; color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.25; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;">
          Client Portal Access
        </h1>
        <p style="margin: 0 0 20px; color: #334155; font-size: 14px; line-height: 1.65; word-break: break-word;">
          Hi ${params.clientName || "there"}, here are your direct access credentials for your client portal:
        </p>

        <!-- Modern Sharp-Cornered Credentials Card -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0px !important; padding: 18px 20px; margin: 22px 0; box-sizing: border-box; max-width: 100%;">
          <div style="margin-bottom: 14px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px;">
              Direct Portal URL
            </div>
            <div style="word-break: break-all; overflow-wrap: anywhere;">
              <a href="${params.portalUrl}" style="color: #2563eb; font-weight: 600; text-decoration: underline; font-size: 13.5px; word-break: break-all;">
                ${params.portalUrl}
              </a>
            </div>
          </div>

          <div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 6px;">
              Access Code / Password
            </div>
            <div style="display: inline-block; background-color: #0f172a; color: #ffffff; font-family: 'Space Grotesk', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13.5px; font-weight: 700; padding: 7px 16px; border-radius: 0px !important; letter-spacing: 0.8px; word-break: break-all; max-width: 100%; box-sizing: border-box;">
              ${params.portalPassword}
            </div>
          </div>
        </div>

        <div style="margin: 0 0 22px; font-size: 13px; color: #64748b; line-height: 1.6; word-break: break-word;">
          ${customMessageHtml}
        </div>

        <div>
          <a href="${params.portalUrl}" class="cta-button" style="display: inline-block; background-color: #0f172a; color: #ffffff !important; padding: 13px 28px; border-radius: 0px !important; font-weight: 700; text-decoration: none; font-size: 13.5px; letter-spacing: 0.1px; box-sizing: border-box; text-align: center; max-width: 100%;">
            Open Client Portal &rarr;
          </a>
        </div>
      `;
      break;
    }

    case "user_credentials": {
      const notesHtml = await markdownToEmailHtml(
        params.notes ||
          "Please sign in and change your password in settings if desired.",
      );

      bodyContent = `
        <div style="margin-bottom: 12px;">
          <span style="display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #475569; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 0px !important;">
            TEAM ACCOUNT
          </span>
        </div>
        <h1 class="headline-title" style="margin: 0 0 18px 0; color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.25; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;">
          Welcome to the Team
        </h1>
        <p style="margin: 0 0 20px; color: #334155; font-size: 14px; line-height: 1.65; word-break: break-word;">
          Hi ${params.name || "there"}, your account has been provisioned on Scalyx LeadsDigital.
        </p>

        <!-- Modern Sharp-Cornered Team Credentials Card -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0px !important; padding: 18px 20px; margin: 20px 0; box-sizing: border-box; max-width: 100%;">
          <div style="margin-bottom: 12px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Email Address</div>
            <div style="font-size: 14px; font-weight: 700; color: #0f172a; word-break: break-all; margin-top: 2px;">
              ${params.email}
            </div>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px;">Temporary Password</div>
            <div style="display: inline-block; background-color: #0f172a; color: #ffffff; font-family: 'Space Grotesk', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13.5px; font-weight: 700; padding: 6px 14px; border-radius: 0px !important; letter-spacing: 0.8px; word-break: break-all; max-width: 100%; box-sizing: border-box;">
              ${params.password}
            </div>
          </div>

          <div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Assigned Role</div>
            <div style="font-size: 13px; font-weight: 700; color: #0f172a; text-transform: capitalize; margin-top: 2px;">
              ${params.role}
            </div>
          </div>
        </div>

        <div style="margin: 0 0 22px; color: #64748b; font-size: 13px; line-height: 1.6; word-break: break-word;">
          ${notesHtml}
        </div>

        <div>
          <a href="${params.loginUrl || `${baseUrl}/login`}" class="cta-button" style="display: inline-block; background-color: #0f172a; color: #ffffff !important; padding: 13px 28px; border-radius: 0px !important; font-weight: 700; text-decoration: none; font-size: 13.5px; letter-spacing: 0.1px; box-sizing: border-box; text-align: center; max-width: 100%;">
            Sign In &rarr;
          </a>
        </div>
      `;
      break;
    }
  }

  const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Scalyx Email</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>
    /* Sharp corners everywhere and box-sizing guarantees */
    body, table, td, p, a, li {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    blockquote, q {
      font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }
    code, pre, .stat-amount, .font-mono {
      font-family: 'Space Grotesk', ui-monospace, Menlo, monospace !important;
    }
    *, *:before, *:after {
      box-sizing: border-box !important;
      border-radius: 0px !important;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      min-width: 100% !important;
      background-color: #f1f5f9;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      border-radius: 0px !important;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      border-radius: 0px !important;
    }
    td {
      padding: 0;
      border-radius: 0px !important;
    }
    img {
      border: 0;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
      max-width: 100%;
      border-radius: 0px !important;
    }
    a {
      word-break: break-all;
      border-radius: 0px !important;
    }

    /* Anti-overflow and responsive mobile rules */
    @media only screen and (max-width: 600px) {
      .outer-wrapper {
        padding: 12px 6px !important;
      }
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 0px !important;
      }
      .header-pad {
        padding: 18px 16px 14px !important;
      }
      .body-pad {
        padding: 22px 16px 20px !important;
      }
      .footer-pad {
        padding: 18px 16px !important;
      }
      .headline-title {
        font-size: 21px !important;
        line-height: 1.25 !important;
      }
      .cta-button {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
        padding: 13px 16px !important;
        border-radius: 0px !important;
      }
      .header-table {
        display: block !important;
        width: 100% !important;
      }
      .header-col-left {
        display: block !important;
        width: 100% !important;
      }
      .header-col-right {
        display: block !important;
        width: 100% !important;
        text-align: left !important;
        margin-top: 10px !important;
      }
      .stat-amount {
        font-size: 22px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; border-radius: 0px !important;">
  <!-- Full-Width Background Wrapper -->
  <table id="email-root-table" width="100%" border="0" cellspacing="0" cellpadding="0" class="outer-wrapper" style="width: 100% !important; min-width: 100%; height: auto !important; min-height: 0 !important; background-color: #f1f5f9; margin: 0; padding: 28px 12px; box-sizing: border-box; border-radius: 0px !important;">
    <tr>
      <td align="center" style="padding: 0; border-radius: 0px !important;">
        <!-- Card Container with fixed table-layout to prevent horizontal overflow and sharp corners -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" class="email-container" style="width: 100%; max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 0px !important; overflow: hidden; border: 1px solid #e2e8f0; table-layout: fixed; box-sizing: border-box;">
          
          <!-- Top Modern Gradient Accent -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #2563eb 0%, #6366f1 50%, #10b981 100%); line-height: 4px; font-size: 4px; border-radius: 0px !important;">&nbsp;</td>
          </tr>

          <!-- Modern Sleek Sharp Branded Header -->
          <tr>
            <td class="header-pad" style="padding: 22px 26px 18px; border-bottom: 1px solid #f1f5f9; box-sizing: border-box; border-radius: 0px !important;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="header-table" style="border-radius: 0px !important;">
                <tr>
                  <td class="header-col-left" style="vertical-align: middle; border-radius: 0px !important;">
                    <table border="0" cellspacing="0" cellpadding="0" style="border-radius: 0px !important;">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 12px; width: 36px; border-radius: 0px !important;">
                          <img src="${logoSrc}" alt="Scalyx Logo" width="34" height="34" style="display: block; width: 34px; height: 34px; max-width: 34px; max-height: 34px; border: 0; border-radius: 0px !important; object-fit: contain;" />
                        </td>
                        <td style="vertical-align: middle; border-radius: 0px !important;">
                          <div style="font-size: 19px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; line-height: 1.1;">Scalyx</div>
                          <div style="font-size: 11px; color: #64748b; margin-top: 2px; font-weight: 500;">
                            Client Operations &bull; <a href="https://scalyx.in" style="color: #475569; text-decoration: none;">scalyx.in</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td class="header-col-right" align="right" style="vertical-align: middle; border-radius: 0px !important;">
                    <a href="${baseUrl}" style="display: inline-block; font-size: 11px; font-weight: 600; color: #475569; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 0px !important; text-decoration: none; letter-spacing: 0.2px; white-space: nowrap;">
                      Client Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td class="body-pad" style="padding: 30px 26px 26px; box-sizing: border-box; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;">
              ${bodyContent}

              ${
                params.attachedFilesList
                  ? `
                <div style="margin-top: 24px; padding: 14px 16px; background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 0px !important; box-sizing: border-box; max-width: 100%;">
                  <div style="font-size: 10.5px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;">
                    Attached Documents (${params.attachedFilesList.split(",").length})
                  </div>
                  <div style="font-size: 12px; color: #0f172a; font-family: 'Space Grotesk', ui-monospace, Menlo, monospace; word-break: break-word; overflow-wrap: anywhere; line-height: 1.5;">
                    ${params.attachedFilesList}
                  </div>
                </div>
              `
                  : ""
              }

              ${
                String(params.includeDeliverablesFooter) === "true"
                  ? `
                <div style="margin-top: 26px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0f172a; border-radius: 0px !important; padding: 16px 18px; box-sizing: border-box; max-width: 100%;">
                  <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
                    Project Documents & Deliverables Notice
                  </div>
                  <p style="margin: 0 0 12px; font-size: 12.5px; color: #475569; line-height: 1.55; word-break: break-word;">
                    You can download all official project documents, assets, and source code deliverables directly from your secure Deliverables Portal.
                  </p>
                  <a href="${params.deliverablesUrl || params.portalUrl || `${baseUrl}/portal/client`}" class="cta-button" style="display: inline-block; font-size: 12px; font-weight: 700; color: #ffffff !important; background-color: #0f172a; padding: 9px 18px; border-radius: 0px !important; text-decoration: none; box-sizing: border-box; text-align: center;">
                    Download Documents from Deliverables &rarr;
                  </a>
                </div>
              `
                  : ""
              }
            </td>
          </tr>

          <!-- Modern Sharp Branded Footer -->
          <tr>
            <td class="footer-pad" style="padding: 22px 26px; background-color: #fafafa; border-top: 1px solid #f1f5f9; font-size: 11.5px; color: #71717a; text-align: center; line-height: 1.6; box-sizing: border-box; word-break: break-word; overflow-wrap: anywhere; border-radius: 0px !important;">
              Scalyx &bull; Digital Systems & Client Operations &bull; <a href="https://scalyx.in" style="color: #475569; text-decoration: underline;">scalyx.in</a><br/>
              &copy; ${currentYear} Scalyx. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <script>
    function sendHeight() {
      try {
        var h = Math.max(
          document.body.scrollHeight || 0,
          document.documentElement.scrollHeight || 0,
          document.body.offsetHeight || 0
        );
        if (h > 100) {
          window.parent.postMessage({ type: 'EMAIL_PREVIEW_HEIGHT', height: h }, '*');
        }
      } catch (e) {}
    }
    window.addEventListener('load', sendHeight);
    window.addEventListener('resize', sendHeight);
    setTimeout(sendHeight, 150);
    setTimeout(sendHeight, 500);
  </script>
</body>
</html>
  `;

  // Final safety pass: rewrite any leftover relative links, localhost links,
  // or legacy vercel links to the canonical baseUrl
  const relativeLinkRegex = /href="(\/(?:portal|share|login|deliverables)[^"]*)"/gi;
  const legacyVercelLinkRegex = /href="https?:\/\/scalyx-leads-digital\.vercel\.app([^"]*)"/gi;
  const localhostLinkRegex = /href="https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(?::\d+)?([^"]*)"/gi;

  return fullHtml
    .replace(relativeLinkRegex, `href="${baseUrl}$1"`)
    .replace(legacyVercelLinkRegex, `href="${baseUrl}$1"`)
    .replace(localhostLinkRegex, `href="${baseUrl}$1"`);
}
