import { EmailTemplateMeta, EmailTemplateId } from '@/types/email';

export const EMAIL_TEMPLATES: EmailTemplateMeta[] = [
  {
    id: 'client_onboarding',
    name: 'Client Onboarding & Portal Welcome',
    description: 'Welcome new client, share project kick-off details, portal URL, and their generated access password.',
    defaultSubject: 'Welcome to Scalyx • Your Dedicated Client Portal & Project Setup',
    fields: [
      { key: 'clientName', label: 'Client Name', type: 'text', defaultValue: 'Arjun Mehta', placeholder: 'Client contact name' },
      { key: 'companyName', label: 'Company / Project', type: 'text', defaultValue: 'TechCorp Solutions', placeholder: 'Client company' },
      { key: 'portalUrl', label: 'Portal Link', type: 'text', defaultValue: 'https://leads.scalyx.in/portal/techcorp', placeholder: 'URL to client portal' },
      { key: 'portalPassword', label: 'Portal Password / Access Code', type: 'text', defaultValue: 'tc-portal-pass-2026', placeholder: 'Secret access code' },
      { key: 'customMessage', label: 'Personal Message', type: 'textarea', defaultValue: 'We are thrilled to partner with your team on this project! Everything is set up for Phase 1.', placeholder: 'Optional custom note' },
    ],
  },
  {
    id: 'project_milestone',
    name: 'Project Milestone / Sprint Update',
    description: 'Inform client of milestone completion, live demo links, and upcoming deliverables.',
    defaultSubject: 'Project Milestone Completed • Sprint Progress Update',
    fields: [
      { key: 'clientName', label: 'Client Name', type: 'text', defaultValue: 'Arjun Mehta' },
      { key: 'projectName', label: 'Project Name', type: 'text', defaultValue: 'AI Assistant & Full-Stack Portal' },
      { key: 'milestoneTitle', label: 'Milestone Title', type: 'text', defaultValue: 'Phase 1 MVP Architecture & Authentication Deployed' },
      { key: 'completionPercentage', label: 'Overall Completion (%)', type: 'number', defaultValue: '65' },
      { key: 'demoUrl', label: 'Staging / Demo URL', type: 'text', defaultValue: 'https://staging.scalyx.in' },
      { key: 'notes', label: 'Summary & Next Steps', type: 'textarea', defaultValue: 'Database indexes and API endpoints have been tested. Next week we will commence testing payment flows and final UI polish.' },
    ],
  },
  {
    id: 'deliverables_ready',
    name: 'Deliverables Ready for Download',
    description: 'Notify client that new files/deliverables are ready with retention notice (3-day soft delete notice).',
    defaultSubject: 'New Deliverables Ready for Download • Scalyx Project Portal',
    fields: [
      { key: 'clientName', label: 'Client Name', type: 'text', defaultValue: 'Arjun Mehta' },
      { key: 'deliverableTitle', label: 'Deliverable Title', type: 'text', defaultValue: 'Phase 1 Frontend Prototype & UI Source Code' },
      { key: 'downloadUrl', label: 'Portal Download Link', type: 'text', defaultValue: 'https://leads.scalyx.in/portal/techcorp' },
      { key: 'retentionNotice', label: 'Retention Days Notice', type: 'text', defaultValue: '3 days after first download' },
      { key: 'notes', label: 'Instructions', type: 'textarea', defaultValue: 'Please review the attached release notes and download your deliverables package before the retention period expires.' },
    ],
  },
  {
    id: 'invoice_reminder',
    name: 'Invoice Notification & Payment Reminder',
    description: 'Share invoice number, due date, amount, and payment details.',
    defaultSubject: 'Invoice INV-2026-001 from Scalyx • Amount Due',
    fields: [
      { key: 'clientName', label: 'Client Name', type: 'text', defaultValue: 'Arjun Mehta' },
      { key: 'invoiceNumber', label: 'Invoice #', type: 'text', defaultValue: 'INV-2026-001' },
      { key: 'amount', label: 'Amount Due', type: 'text', defaultValue: '₹60,000.00' },
      { key: 'dueDate', label: 'Due Date', type: 'date', defaultValue: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] },
      { key: 'paymentDetails', label: 'Payment Details / UPI', type: 'text', defaultValue: 'contact@scalyx.in / Bank Transfer: Scalyx' },
      { key: 'notes', label: 'Notes', type: 'textarea', defaultValue: 'Thank you for your business. Please reply with payment receipt upon clearing.' },
    ],
  },
  {
    id: 'meeting_followup',
    name: 'Meeting Follow-up & Next Steps',
    description: 'Quick summary after client sync call with action items and timelines.',
    defaultSubject: 'Meeting Notes & Next Steps • Scalyx Discussion',
    fields: [
      { key: 'clientName', label: 'Client Name', type: 'text', defaultValue: 'Arjun Mehta' },
      { key: 'meetingTopic', label: 'Meeting Topic', type: 'text', defaultValue: 'Feature Scope Review & Deliverables Timeline' },
      { key: 'actionItems', label: 'Agreed Action Items', type: 'textarea', defaultValue: '1. Scalyx will deliver staging build by Friday.\n2. Client team will provide production API credentials.\n3. Next check-in scheduled for Tuesday at 4 PM.' },
      { key: 'portalUrl', label: 'Project Portal', type: 'text', defaultValue: 'https://leads.scalyx.in/portal/techcorp' },
    ],
  },
  {
    id: 'portal_credentials',
    name: 'Client Portal Access Credentials',
    description: 'Send or regenerate dedicated password for client portal.',
    defaultSubject: 'Your Scalyx Project Portal Access Password',
    fields: [
      { key: 'clientName', label: 'Client Name', type: 'text', defaultValue: 'Arjun Mehta' },
      { key: 'portalUrl', label: 'Portal Link', type: 'text', defaultValue: 'https://leads.scalyx.in/portal/techcorp' },
      { key: 'portalPassword', label: 'Your Password', type: 'text', defaultValue: 'tc-portal-pass-2026' },
      { key: 'customMessage', label: 'Notes', type: 'textarea', defaultValue: 'Use this confidential code to access your live project growth charts, notices, and deliverables.' },
    ],
  },
];

export function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "https://scalyx.in";
}

export function renderEmailHtml(templateId: EmailTemplateId, params: Record<string, string>): string {
  const currentYear = new Date().getFullYear();
  const baseUrl = getAppBaseUrl();
  const logoUrl = `${baseUrl}/assets/scalyx_light.png`;

  let bodyContent = '';

  switch (templateId) {
    case 'client_onboarding':
      bodyContent = `
        <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 22px; font-weight: 700;">Welcome to Scalyx, ${params.clientName || 'Partner'}!</h2>
        <p style="margin: 0 0 16px; color: #475569; font-size: 15px; line-height: 1.6;">
          ${params.customMessage || 'We are excited to build high-performance digital software for your business.'}
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0px; padding: 20px; margin: 24px 0;">
          <h3 style="margin: 0 0 12px; color: #1e293b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Your Client Portal Credentials</h3>
          <p style="margin: 0 0 8px; font-size: 14px; color: #334155;"><strong>Portal Link:</strong> <a href="${params.portalUrl}" style="color: #2563eb; text-decoration: underline;">${params.portalUrl}</a></p>
          <p style="margin: 0; font-size: 14px; color: #334155;"><strong>Access Password:</strong> <code style="background: #e2e8f0; padding: 4px 8px; border-radius: 0px; font-weight: 700; color: #0f172a;">${params.portalPassword}</code></p>
        </div>
        <p style="margin: 0 0 24px; color: #64748b; font-size: 13px;">
          Keep this code secure. You can visit this portal at any time to monitor your project's development timeline, download files, and view official team updates.
        </p>
        <a href="${params.portalUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 28px; border-radius: 0px; font-weight: 600; text-decoration: none; font-size: 14px;">Open Client Portal &rarr;</a>
      `;
      break;

    case 'project_milestone':
      bodyContent = `
        <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 22px; font-weight: 700;">Project Update: ${params.projectName || 'Active Sprint'}</h2>
        <p style="margin: 0 0 16px; color: #475569; font-size: 15px; line-height: 1.6;">
          Hi ${params.clientName || 'there'}, we're pleased to let you know that <strong>${params.milestoneTitle}</strong> has been achieved!
        </p>
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 0px; padding: 20px; margin: 24px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; font-weight: 600; color: #166534;">Project Progress</span>
            <span style="font-size: 14px; font-weight: 700; color: #15803d;">${params.completionPercentage || '65'}% Complete</span>
          </div>
          <div style="background-color: #dcfce7; border-radius: 0px; height: 8px; overflow: hidden;">
            <div style="background-color: #16a34a; height: 100%; width: ${params.completionPercentage || '65'}%;"></div>
          </div>
          ${params.demoUrl ? `<p style="margin: 14px 0 0; font-size: 13px; color: #166534;"><strong>Demo / Staging Link:</strong> <a href="${params.demoUrl}" style="color: #15803d; text-decoration: underline;">${params.demoUrl}</a></p>` : ''}
        </div>
        <div style="margin: 20px 0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-line;">
          <strong>Notes & Next Steps:</strong><br/>
          ${params.notes || 'Please feel free to test the build and let us know your feedback.'}
        </div>
      `;
      break;

    case 'deliverables_ready':
      bodyContent = `
        <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 22px; font-weight: 700;">New Deliverable Ready for Review</h2>
        <p style="margin: 0 0 16px; color: #475569; font-size: 15px; line-height: 1.6;">
          Hi ${params.clientName || 'there'}, your requested asset <strong>${params.deliverableTitle}</strong> is now packaged and ready for download.
        </p>
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 0px; padding: 18px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #991b1b; line-height: 1.5;">
            <strong>Retention Notice:</strong> Under our agency storage policy, downloadable items expire and get soft-deleted <strong>${params.retentionNotice || '3 days'}</strong> after first download. Please retrieve your materials promptly.
          </p>
        </div>
        <p style="margin: 0 0 24px; color: #475569; font-size: 14px; line-height: 1.6; white-space: pre-line;">
          ${params.notes || ''}
        </p>
        <a href="${params.downloadUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 0px; font-weight: 600; text-decoration: none; font-size: 14px;">Download Deliverable &rarr;</a>
      `;
      break;

    case 'invoice_reminder':
      bodyContent = `
        <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 22px; font-weight: 700;">Invoice ${params.invoiceNumber} from Scalyx</h2>
        <p style="margin: 0 0 16px; color: #475569; font-size: 15px; line-height: 1.6;">
          Dear ${params.clientName || 'Partner'}, please find the invoice details for your project below:
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Invoice Reference:</td>
              <td style="padding: 6px 0; font-weight: 700; text-align: right; color: #0f172a;">${params.invoiceNumber}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Amount Payable:</td>
              <td style="padding: 6px 0; font-weight: 800; font-size: 18px; text-align: right; color: #2563eb;">${params.amount}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Payment Due Date:</td>
              <td style="padding: 6px 0; font-weight: 600; text-align: right; color: #0f172a;">${params.dueDate}</td>
            </tr>
          </table>
          <div style="margin-top: 14px; pt-3; border-top: 1px dashed #cbd5e1; font-size: 12px; color: #475569;">
            <strong>Payment Modes:</strong> ${params.paymentDetails}
          </div>
        </div>
        <p style="margin: 0 0 16px; color: #475569; font-size: 14px; line-height: 1.6;">
          ${params.notes || 'Thank you for your valued partnership. Please reply to this email with payment confirmation once initiated.'}
        </p>
      `;
      break;

    case 'meeting_followup':
      bodyContent = `
        <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 22px; font-weight: 700;">Meeting Follow-Up & Action Items</h2>
        <p style="margin: 0 0 16px; color: #475569; font-size: 15px; line-height: 1.6;">
          Hi ${params.clientName || 'there'}, thank you for taking the time to speak with us regarding <strong>${params.meetingTopic}</strong>.
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px; font-size: 13px; text-transform: uppercase; color: #0f172a; font-weight: 700;">Action Items & Agreed Next Steps</h3>
          <div style="font-size: 14px; color: #334155; line-height: 1.7; white-space: pre-line;">
            ${params.actionItems}
          </div>
        </div>
        ${params.portalUrl ? `<p style="margin: 16px 0; font-size: 13px; color: #64748b;">You can track real-time progress on your <a href="${params.portalUrl}" style="color: #2563eb; text-decoration: underline;">Project Portal</a>.</p>` : ''}
      `;
      break;

    case 'portal_credentials':
      bodyContent = `
        <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 22px; font-weight: 700;">Your Scalyx Client Portal Access Code</h2>
        <p style="margin: 0 0 16px; color: #475569; font-size: 15px; line-height: 1.6;">
          Hi ${params.clientName || 'there'}, here are your refreshed access credentials for the project portal:
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 10px; font-size: 14px; color: #334155;"><strong>Direct URL:</strong> <a href="${params.portalUrl}" style="color: #2563eb;">${params.portalUrl}</a></p>
          <p style="margin: 0; font-size: 14px; color: #334155;"><strong>Access Code:</strong> <code style="background: #e2e8f0; padding: 4px 10px; border-radius: 0px; font-weight: 700; color: #0f172a; font-size: 15px;">${params.portalPassword}</code></p>
        </div>
        <p style="margin: 0 0 20px; font-size: 13px; color: #64748b;">
          ${params.customMessage || 'Use this code whenever prompted on your portal page.'}
        </p>
        <a href="${params.portalUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 28px; border-radius: 0px; font-weight: 600; text-decoration: none; font-size: 14px;">Open Portal &rarr;</a>
      `;
      break;

    case 'user_credentials':
      bodyContent = `
        <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 22px; font-weight: 700;">Welcome to LeadsDigital Team!</h2>
        <p style="margin: 0 0 16px; color: #475569; font-size: 15px; line-height: 1.6;">
          Hi ${params.name || 'there'}, a team account has been provisioned for you on the LeadsDigital portal for Scalyx.
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #334155;"><strong>Email:</strong> ${params.email}</p>
          <p style="margin: 0 0 8px; font-size: 14px; color: #334155;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 4px 8px; border-radius: 0px; font-weight: 700;">${params.password}</code></p>
          <p style="margin: 0; font-size: 14px; color: #334155;"><strong>Role:</strong> <span style="text-transform: capitalize; font-weight: 600;">${params.role}</span></p>
        </div>
        <p style="margin: 0 0 24px; color: #64748b; font-size: 13px;">
          Please sign in and change your password in settings if desired.
        </p>
        <a href="${params.loginUrl || 'http://localhost:3000/login'}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 0px; font-weight: 600; text-decoration: none; font-size: 14px;">Sign In to LeadsDigital &rarr;</a>
      `;
      break;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scalyx Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 0px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0;">
          <!-- Top Accent Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #2563eb, #6366f1, #10b981);"></td>
          </tr>
          <!-- Header with Scalyx Brand Logo from App URL -->
          <tr>
            <td style="padding: 24px 32px 20px; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 12px;">
                          <img src="${logoUrl}" alt="Scalyx Logo" height="34" style="display: block; height: 34px; max-height: 34px; width: auto; border: 0;" />
                        </td>
                        <td style="vertical-align: middle;">
                          <div style="font-size: 19px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; line-height: 1.2;">Scalyx</div>
                          <div style="font-size: 11px; color: #64748b; margin-top: 1px;">Digital Leads & Client Portal • <a href="https://scalyx.in" style="color: #2563eb; text-decoration: none;">scalyx.in</a></div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; font-size: 11px; font-weight: 600; color: #2563eb; background-color: #eff6ff; border: 1px solid #dbeafe; padding: 4px 10px; border-radius: 0px;">Verified Agency</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 32px;">
              ${bodyContent}

              ${params.attachedFilesList ? `
                <div style="margin-top: 24px; padding: 14px 16px; background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 0px;">
                  <div style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                    Attached Documents (${params.attachedFilesList.split(',').length})
                  </div>
                  <div style="font-size: 12px; color: #0f172a; font-family: monospace;">
                    ${params.attachedFilesList}
                  </div>
                </div>
              ` : ''}

              ${String(params.includeDeliverablesFooter) === 'true' ? `
                <div style="margin-top: 28px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0f172a; border-radius: 0px; padding: 16px 20px;">
                  <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
                    Project Documents & Deliverables Notice
                  </div>
                  <p style="margin: 0 0 10px; font-size: 13px; color: #475569; line-height: 1.5;">
                    You can download all official project documents, assets, and deliverables directly from your Client Deliverables Portal.
                  </p>
                  <a href="${params.deliverablesUrl || params.portalUrl || `${baseUrl}/portal/client`}" style="display: inline-block; font-size: 12px; font-weight: 700; color: #ffffff; background-color: #0f172a; padding: 8px 16px; border-radius: 0px; text-decoration: none;">
                    Download Documents from Deliverables &rarr;
                  </a>
                </div>
              ` : ''}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
              Scalyx Digital Agency • <a href="https://scalyx.in" style="color: #64748b; text-decoration: underline;">scalyx.in</a> • WhatsApp: +91-89271-24748<br/>
              &copy; ${currentYear} Scalyx. Single software to manage and organize all of your leads.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
