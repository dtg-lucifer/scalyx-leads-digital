export type FontType = 'roboto' | 'poppins' | 'systemfont';

export interface InvoiceItem {
  id: string;
  description: string;
  cost: number;
}

export interface CompanyDetails {
  name: string;
  logoUrl: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  tagline: string;
}

export interface ClientDetails {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  currencySymbol: string;
  taxRate: number; // e.g. 0% or 18%
  notes: string;
  paymentDetails: string;
  font: FontType;
  company: CompanyDetails;
  client: ClientDetails;
  items: InvoiceItem[];
}

export const SCALYX_DEFAULTS: CompanyDetails = {
  name: "Scalyx",
  logoUrl: "/assets/scalyx_light.png",
  website: "https://scalyx.in",
  email: "contact@scalyx.in",
  phone: "+91-89271-24748",
  address: "India",
  tagline: "Websites • Mobile Apps • AI Helpers • ERP/CRM Systems",
};

export const INITIAL_INVOICE_DATA: InvoiceData = {
  invoiceNumber: "INV-2026-001",
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
  currency: "INR",
  currencySymbol: "₹",
  taxRate: 0,
  notes: "Thank you for partnering with Scalyx. We build reliable software for growing businesses.",
  paymentDetails: "UPI / Bank Transfer: contact@scalyx.in | Account: Scalyx",
  font: "poppins",
  company: SCALYX_DEFAULTS,
  client: {
    name: "Acme Corporation",
    email: "billing@acmecorp.com",
    phone: "+91 98765 43210",
    address: "Bangalore, Karnataka, India",
  },
  items: [
    {
      id: "item-1",
      description: "Custom Web Application Development (Phase 1)",
      cost: 45000,
    },
    {
      id: "item-2",
      description: "Cloud Architecture & Hosting Setup",
      cost: 15000,
    },
    {
      id: "item-3",
      description: "AI Assistant Integration & Smart Search",
      cost: 25000,
    },
  ],
};
