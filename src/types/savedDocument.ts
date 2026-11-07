import type { ProposalBlock } from "@/lib/proposal/blocks";
import type { ContractBlock } from "@/lib/contract/types";
import type { InvoiceData } from "@/types/invoice";

export interface SavedProposalDoc {
  id: string;
  referenceNo?: string; // e.g. "SCX-PRP-2026-001"
  name?: string; // User-defined recognizable draft name
  title: string;
  clientName?: string;
  clientCompany?: string;
  dealValue?: string;
  blocks: ProposalBlock[];
  updatedAt: string;
  createdAt: string;
  isDraft?: boolean;
}

export interface SavedContractDoc {
  id: string;
  referenceNo?: string; // e.g. "SCX-CTR-2026-088"
  name?: string; // User-defined recognizable draft name
  title: string;
  clientName?: string;
  clientCompany?: string;
  dealValue?: string;
  blocks: ContractBlock[];
  updatedAt: string;
  createdAt: string;
  isDraft?: boolean;
}

export interface SavedInvoiceDoc {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-001"
  referenceNo?: string; // alias to invoiceNumber for consistent searching
  name?: string; // User-defined recognizable draft name
  title: string;
  clientName?: string;
  clientCompany?: string;
  dealValue?: string; // Formatted total cost e.g. "₹85,000"
  data: InvoiceData;
  updatedAt: string;
  createdAt: string;
  isDraft?: boolean;
}

