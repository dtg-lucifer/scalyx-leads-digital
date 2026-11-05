import { ContractBlock } from "./types";
import { generateContractBlockId } from "./blocks";

export interface ContractCatalogueItem {
  id: string;
  title: string;
  category: "Structure" | "Schedules" | "Legal Clauses" | "Execution";
  badge: string;
  description: string;
  createBlock: (clientName?: string, clientCompany?: string) => ContractBlock;
}

export const CONTRACT_CATALOGUE_ITEMS: ContractCatalogueItem[] = [
  // --- Structure ---
  {
    id: "header_letterhead",
    title: "Official Scalyx Letterhead & Reference",
    category: "Structure",
    badge: "Header",
    description: "Official agency letterhead with registration reference, date, and contact credentials.",
    createBlock: () => ({
      id: generateContractBlockId("header"),
      type: "contract_header",
      brandName: "SCALYX",
      brandSubtitle: "",
      referenceNo: `SCX-CTR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      agreementDate: new Date().toISOString().split("T")[0],
      website: "scalyx.in",
      email: "contact@scalyx.in",
      phone: "+91 8927124748",
      address: "Kolkata, West Bengal, India",
    }),
  },
  {
    id: "parties_block",
    title: "Parties to Agreement",
    category: "Structure",
    badge: "Parties",
    description: "Legal entities description: Service Provider (Scalyx) and Client Counterparty.",
    createBlock: (clientName = "Client Lead", clientCompany = "Client Enterprises") => ({
      id: generateContractBlockId("parties"),
      type: "contract_parties",
      providerName: "Scalyx",
      providerEntity: "Scalyx",
      providerAddress: "Salt Lake Sector V, Kolkata, WB 700091",
      providerSignatory: "Mainak Panda",
      providerSignatoryTitle: "Managing Principal & Lead Architect",
      providerEmail: "contact@scalyx.in",
      clientName: clientName,
      clientCompany: clientCompany,
      clientAddress: "Corporate Office, Business District",
      clientSignatoryTitle: "Authorized Representative",
      clientEmail: "billing@client.com",
      clientPhone: "+91 98765 43210",
    }),
  },
  {
    id: "preamble_recitals",
    title: "Agreement Preamble & Recitals",
    category: "Structure",
    badge: "Preamble",
    description: "Formal legal opening with effective date, recitals, and 'WHEREAS' clauses.",
    createBlock: (_clientName, clientCompany = "Client Enterprises") => ({
      id: generateContractBlockId("preamble"),
      type: "contract_preamble",
      title: "MASTER PROFESSIONAL SERVICES AGREEMENT",
      effectiveDate: new Date().toISOString().split("T")[0],
      body: `This Master Professional Services Agreement (the "Agreement") is entered into and made effective as of ${new Date().toISOString().split("T")[0]}, by and between Scalyx ("Service Provider"), and ${clientCompany} ("Client").\n\nWHEREAS, Service Provider specializes in cloud application engineering, high-throughput backend infrastructure, and reactive web applications; and\n\nWHEREAS, Client desires to retain Service Provider to design, build, test, and deploy production software systems under the terms and conditions outlined herein.\n\nNOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:`,
    }),
  },

  // --- Schedules ---
  {
    id: "schedule_scope_table",
    title: "Schedule A: Scope & Itemized Deliverables",
    category: "Schedules",
    badge: "Schedule A",
    description: "Structured tabular breakdown of deliverables, technical specifications, timelines, and acceptance criteria.",
    createBlock: () => ({
      id: generateContractBlockId("scope"),
      type: "contract_scope_table",
      title: "Schedule A: Itemized Scope & Milestone Deliverables",
      description: "The following engineering milestones define the core deliverables of this contract:",
      rows: [
        {
          id: generateContractBlockId("row"),
          deliverable: "High-Performance Cloud Architecture & DB Schema",
          specifications: "PostgreSQL schemas, security RLS policies, microservice edge routes, and authentication system.",
          timeline: "Week 1 - 2",
          acceptance: "Staging deployment with automated schema migration runs.",
        },
        {
          id: generateContractBlockId("row"),
          deliverable: "Core Application Frontend & Realtime Dashboard",
          specifications: "Next.js visual workflow engine, real-time client sync, responsive UI, and role-based permissions.",
          timeline: "Week 3 - 5",
          acceptance: "End-to-end user acceptance testing (UAT) sign-off.",
        },
        {
          id: generateContractBlockId("row"),
          deliverable: "Production Deployment, CI/CD & Launch Handoff",
          specifications: "Dockerized production build, CDN distribution, monitoring instrumentation, and code documentation.",
          timeline: "Week 6",
          acceptance: "Production live cut-over and zero-downtime sign-off.",
        },
      ],
    }),
  },
  {
    id: "schedule_commercials",
    title: "Schedule B: Commercials & Payment Tranches",
    category: "Schedules",
    badge: "Schedule B",
    description: "Commercial fee breakdown, advance deposit, milestone tranches, invoicing rules, and late payment penalties.",
    createBlock: () => ({
      id: generateContractBlockId("commercials"),
      type: "contract_commercials",
      title: "Schedule B: Commercials & Payment Milestones",
      totalValue: "₹1,50,000",
      currency: "INR",
      paymentTermsSummary: "All invoices are payable within seven (7) business days of issuance via direct wire transfer / NEFT / RTGS / UPI.",
      tranches: [
        {
          id: generateContractBlockId("tranche"),
          milestone: "Tranche 1: Project Mobilization & Setup",
          percentage: "40%",
          amount: "₹60,000",
          dueCondition: "Upon execution of this Agreement (Advance deposit)",
        },
        {
          id: generateContractBlockId("tranche"),
          milestone: "Tranche 2: Alpha Core Delivery & Functional UAT",
          percentage: "35%",
          amount: "₹52,500",
          dueCondition: "Upon staging demonstration of core operational flows",
        },
        {
          id: generateContractBlockId("tranche"),
          milestone: "Tranche 3: Final Launch & Production Handoff",
          percentage: "25%",
          amount: "₹37,500",
          dueCondition: "Upon live deployment and administrative repository handoff",
        },
      ],
      invoicingNotes: "Invoices will be transmitted electronically to the designated client billing address. Work on subsequent milestones may be suspended if invoices remain unpaid beyond net 7 days.",
      lateFeePolicy: "Late payments shall accrue interest at the rate of 1.5% per month or the highest rate permitted by applicable law, calculated daily.",
    }),
  },

  // --- Legal Clauses ---
  {
    id: "clause_scope",
    title: "Scope of Services & Change Order Policy",
    category: "Legal Clauses",
    badge: "Clause 1.0",
    description: "Defines engineering deliverables and establishes formal written Change Order procedures.",
    createBlock: () => ({
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: "1.0",
      title: "Scope of Services & Deliverables",
      body: "Service Provider shall deliver the engineering modules, source code repositories, automated pipelines, and cloud deployment infrastructure as specified in Schedule A attached hereto. Any modifications or additions requested outside the agreed specifications shall be executed via an authorized written Change Order specifying additional fee schedules and timeline adjustments.",
    }),
  },
  {
    id: "clause_client_obligations",
    title: "Client Obligations & Asset Provision",
    category: "Legal Clauses",
    badge: "Clause 2.0",
    description: "Requires timely delivery of API credentials, domain access, and milestone approvals within 5 days.",
    createBlock: () => ({
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: "2.0",
      title: "Client Obligations & Resource Access",
      body: "Client shall promptly furnish Service Provider with all required technical prerequisites, API credentials, third-party accounts, and domain names within five (5) business days of execution. Timely review and milestone approvals are mandatory; if Client fails to respond to milestone delivery within seven (7) business days, such milestone shall be deemed accepted.",
    }),
  },
  {
    id: "clause_ip_transfer",
    title: "Intellectual Property Rights & Work for Hire",
    category: "Legal Clauses",
    badge: "Clause 3.0",
    description: "Assigns 100% of custom code and IP to client upon final payment; retains background libraries.",
    createBlock: () => ({
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: "3.0",
      title: "Intellectual Property Rights & Work for Hire",
      body: "Upon receipt of full and final payment under this Agreement, Service Provider assigns to Client all right, title, and interest in and to the custom codebase, graphics, and architectural blueprints produced specifically for Client. Service Provider retains ownership of its pre-existing internal libraries, developer toolkits, starter templates, and general engineering methodologies used across its agency operations.",
    }),
  },
  {
    id: "clause_confidentiality_nda",
    title: "Mutual Confidentiality & Non-Disclosure (NDA)",
    category: "Legal Clauses",
    badge: "Clause 4.0",
    description: "Strict 3-year mutual confidentiality protecting proprietary source code, secrets, and financials.",
    createBlock: () => ({
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: "4.0",
      title: "Confidentiality & Mutual Non-Disclosure",
      body: "Both parties agree to protect each other's Confidential Information (including business processes, technical architecture, proprietary trade secrets, customer records, and financial details) with the same degree of care used to protect their own sensitive information. This covenant shall survive the termination of this Agreement for three (3) years.",
    }),
  },
  {
    id: "clause_warranties_liability",
    title: "Warranty Period & Limitation of Liability",
    category: "Legal Clauses",
    badge: "Clause 5.0",
    description: "30-day post-launch warranty for bug fixes; liability capped at total contract amount.",
    createBlock: () => ({
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: "5.0",
      title: "Warranties, Bug-Fix Support & Limitation of Liability",
      body: "Service Provider provides thirty (30) days of complimentary post-launch bug fixing for any functional defect that deviates from agreed specifications. Except for willful misconduct or breach of confidentiality, Service Provider's total aggregate liability under this Agreement shall not exceed the total fees paid by Client under this Agreement.",
    }),
  },
  {
    id: "clause_termination_kill_fee",
    title: "Termination, Notice & 20% Kill Fee",
    category: "Legal Clauses",
    badge: "Clause 6.0",
    description: "14-day notice for material breach, payment for work completed plus 20% kill fee upon convenience termination.",
    createBlock: () => ({
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: "6.0",
      title: "Termination & Kill Fee",
      body: "Either party may terminate this Agreement upon fourteen (14) days written notice for material breach. In the event of termination for convenience by Client, Client shall pay for all work completed up to the termination date plus a twenty percent (20%) mobilization kill fee on the remaining contract balance.",
    }),
  },
  {
    id: "clause_non_solicitation",
    title: "Non-Solicitation of Personnel",
    category: "Legal Clauses",
    badge: "Clause 7.0",
    description: "Prohibits recruiting or hiring key engineers and staff for 12 months following completion.",
    createBlock: () => ({
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: "7.0",
      title: "Non-Solicitation of Personnel",
      body: "During the term of this Agreement and for twelve (12) months following its termination, neither party shall directly or indirectly solicit, recruit, or hire any developer, engineer, or contractor of the other party who was directly involved in the provision of services under this Agreement without prior written authorization.",
    }),
  },
  {
    id: "clause_governing_law",
    title: "Governing Law & Legal Jurisdiction",
    category: "Legal Clauses",
    badge: "Clause 8.0",
    description: "Governed by laws of India with exclusive jurisdiction of competent courts in Kolkata, West Bengal.",
    createBlock: () => ({
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: "8.0",
      title: "Governing Law & Legal Jurisdiction",
      body: "This Agreement shall be governed by and interpreted under the laws of India. Any legal dispute or proceeding arising out of or relating to this Agreement shall be subject to the exclusive jurisdiction of the competent courts in Kolkata, West Bengal.",
    }),
  },

  // --- Execution ---
  {
    id: "client_signature_block",
    title: "Client Acceptance & Signature Block",
    category: "Execution",
    badge: "Signature",
    description: "Client execution card with company seal line and mandatory agreement pledge text.",
    createBlock: (clientName = "Client Lead", clientCompany = "Client Enterprises") => ({
      id: generateContractBlockId("signature"),
      type: "contract_signature",
      clientTitle: clientCompany.toUpperCase(),
      clientSignatory: clientName,
      clientDesignation: "Authorized Representative",
      clientDate: new Date().toISOString().split("T")[0],
      agreementDisclaimer: `By signing this I, ${clientName} am in full agreement about all of the clauses mentioned above`,
      countersignNote: "Please sign in the designated space above and return one signed digital copy via email to contact@scalyx.in.",
    }),
  },
];

