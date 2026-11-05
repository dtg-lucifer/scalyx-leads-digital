import type { ProposalBlock } from "@/lib/proposal/blocks";
import type { ContractBlock } from "@/lib/contract/types";

export interface SavedProposalDoc {
  id: string;
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

