export type ContractBlock =
  | {
      id: string;
      type: "contract_header";
      brandName: string;
      brandSubtitle: string;
      referenceNo: string;
      agreementDate: string;
      website: string;
      email: string;
      phone: string;
      address: string;
    }
  | {
      id: string;
      type: "contract_parties";
      providerName: string;
      providerEntity: string;
      providerAddress: string;
      providerSignatory: string;
      providerSignatoryTitle: string;
      providerEmail: string;
      clientName: string;
      clientCompany: string;
      clientAddress: string;
      clientSignatoryTitle: string;
      clientEmail: string;
      clientPhone: string;
    }
  | {
      id: string;
      type: "contract_preamble";
      title: string;
      effectiveDate: string;
      body: string;
    }
  | {
      id: string;
      type: "contract_clause";
      clauseNumber: string;
      title: string;
      body: string;
    }
  | {
      id: string;
      type: "contract_scope_table";
      title: string;
      description: string;
      rows: Array<{
        id: string;
        deliverable: string;
        specifications: string;
        timeline: string;
        acceptance: string;
      }>;
    }
  | {
      id: string;
      type: "contract_commercials";
      title: string;
      totalValue: string;
      currency: string;
      paymentTermsSummary: string;
      tranches: Array<{
        id: string;
        milestone: string;
        percentage: string;
        amount: string;
        dueCondition: string;
      }>;
      invoicingNotes: string;
      lateFeePolicy: string;
    }
  | {
      id: string;
      type: "contract_signature";
      clientTitle: string;
      clientSignatory: string;
      clientDesignation: string;
      clientDate: string;
      agreementDisclaimer: string; // "By signing this I, [client_name] am in full agreement about all of the clauses mentioned above"
      countersignNote: string;
    };

export interface ContractPreset {
  id: string;
  name: string;
  description: string;
  documentType: string;
  referencePrefix: string;
}

