export type EmailTemplateId =
  | "client_onboarding"
  | "project_milestone"
  | "deliverables_ready"
  | "invoice_reminder"
  | "meeting_followup"
  | "portal_credentials"
  | "user_credentials"
  | "custom_email";

export interface EmailTemplateField {
  key: string;
  label: string;
  type: "text" | "textarea" | "date" | "number";
  defaultValue: string;
  placeholder?: string;
  isMarkdown?: boolean;
}

export interface EmailTemplateMeta {
  id: EmailTemplateId;
  name: string;
  description: string;
  defaultSubject: string;
  fields: EmailTemplateField[];
}

export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  templateType: string;
  status: "sent" | "failed";
  errorMessage?: string;
  sentBy?: string;
  createdAt: string;
}
