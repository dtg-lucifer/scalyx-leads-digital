import { ContractBlock, ContractPreset } from "./types";

export function generateContractBlockId(prefix: string = "ctr"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

export const CONTRACT_PRESETS: ContractPreset[] = [
  {
    id: "msa",
    name: "Master Services Agreement (MSA)",
    description: "Comprehensive software engineering agreement with IP transfer, strict milestone deliverables, and NDA clauses.",
    documentType: "Master Services Agreement",
    referencePrefix: "SCX-MSA",
  },
  {
    id: "fixed_scope",
    name: "Fixed-Price Project Contract",
    description: "Standard project-based contract with defined milestone tranches, kill fee, and warranty terms.",
    documentType: "Fixed-Price Engineering Contract",
    referencePrefix: "SCX-CTR",
  },
  {
    id: "retainer",
    name: "Monthly Retainer & SLA Agreement",
    description: "Recurring monthly DevOps, platform engineering, and maintenance service level agreement.",
    documentType: "Retainer & SLA Service Agreement",
    referencePrefix: "SCX-SLA",
  },
];

export const AVAILABLE_CLAUSE_TEMPLATES = [
  {
    title: "Intellectual Property & Work for Hire",
    body: "Upon receipt of full and final payment, Service Provider hereby assigns to Client all right, title, and interest in and to the custom software code, deliverables, and designs specifically authored for Client under this Agreement. Service Provider retains ownership of its proprietary pre-existing background code, developer tools, reusable libraries, and infrastructure templates.",
  },
  {
    title: "Client Responsibilities & Asset Provision",
    body: "Client agrees to furnish all necessary third-party API credentials, domain access, cloud accounts, brand assets, and feedback within five (5) business days of written request. Any delay exceeding seven (7) business days caused by Client inaction shall automatically extend delivery deadlines by an equivalent duration without penalty to Service Provider.",
  },
  {
    title: "Confidentiality & Mutual Non-Disclosure",
    body: "Both parties agree to treat all business, financial, technical, and proprietary information disclosed during the course of this engagement as strictly confidential. Neither party shall disclose Confidential Information to any third party without prior written consent. This confidentiality obligation shall survive the termination of this Agreement for a period of three (3) years.",
  },
  {
    title: "Warranty Period & Post-Launch Support",
    body: "Service Provider provides a thirty (30) day warranty period commencing on the final deployment date, during which Service Provider will fix any reproducible bugs, deviations from agreed specifications, or critical security vulnerabilities at no additional charge. This warranty excludes modifications made by Client or third parties not authorized by Service Provider.",
  },
  {
    title: "Limitation of Liability",
    body: "Except for breaches of confidentiality or gross negligence, neither party shall be liable for any indirect, incidental, consequential, or punitive damages. The aggregate liability of Service Provider under this Agreement shall in no event exceed the total amount actually paid by Client to Service Provider under this specific contract.",
  },
  {
    title: "Termination & Kill Fee",
    body: "Either party may terminate this Agreement immediately upon written notice if the other party materially breaches any provision and fails to remedy such breach within fourteen (14) days. In the event of termination for convenience by Client, Client shall pay for all work completed up to the date of notice, plus a twenty percent (20%) cancellation kill fee of the remaining contract balance.",
  },
  {
    title: "Non-Solicitation",
    body: "During the term of this Agreement and for twelve (12) months following its termination, neither party shall directly or indirectly solicit, recruit, or hire any employee, developer, or contractor of the other party who was directly involved in the provision or receipt of services under this Agreement without prior written consent.",
  },
  {
    title: "Governing Law & Dispute Resolution",
    body: "This Agreement shall be governed by and construed in accordance with the laws of India. In the event of any dispute arising out of or in connection with this Agreement, the parties shall first attempt amicable resolution. If unresolved within thirty (30) days, disputes shall be submitted to the exclusive jurisdiction of the competent courts in Kolkata, West Bengal.",
  },
];

export function createDefaultContractBlocks(
  clientName: string = "Acme Global Solutions",
  clientCompany: string = "Acme Enterprises Pvt. Ltd.",
  clientEmail: string = "contact@acme.com",
  dealValue: string = "₹1,50,000",
): ContractBlock[] {
  const today = new Date().toISOString().split("T")[0];

  return [
    {
      id: generateContractBlockId("header"),
      type: "contract_header",
      brandName: "SCALYX",
      brandSubtitle: "",
      referenceNo: "SCX-CTR-2026-088",
      agreementDate: today,
      website: "scalyx.in",
      email: "contact@scalyx.in",
      phone: "+91 8927124748",
      address: "Kolkata, West Bengal, India",
    },
    {
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
      clientSignatoryTitle: "Managing Director / Authorized Representative",
      clientEmail: clientEmail,
      clientPhone: "+91 98765 43210",
    },
    {
      id: generateContractBlockId("preamble"),
      type: "contract_preamble",
      title: "MASTER PROFESSIONAL SERVICES AGREEMENT",
      effectiveDate: today,
      body: `This Master Professional Services Agreement (the "Agreement") is entered into and made effective as of ${today}, by and between Scalyx ("Service Provider"), and ${clientCompany} ("Client").\n\nWHEREAS, Service Provider specializes in cloud application engineering, high-throughput backend infrastructure, and reactive web applications; and\n\nWHEREAS, Client desires to retain Service Provider to design, build, test, and deploy production software systems under the terms and conditions outlined herein.\n\nNOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:`,
    },
    {
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: "1.0",
      title: "Scope of Services & Deliverables",
      body: "Service Provider shall deliver the engineering modules, source code repositories, automated pipelines, and cloud deployment infrastructure as specified in Schedule A (Scope Table) attached hereto. Any modifications or additions requested outside the agreed specifications shall be executed via an authorized written Change Order specifying additional fee schedules and timeline adjustments.",
    },
    {
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
    },
    {
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: "2.0",
      title: "Client Obligations & Resource Access",
      body: "Client shall promptly furnish Service Provider with all required technical prerequisites, API credentials, third-party accounts, and domain names within five (5) business days of execution. Timely review and milestone approvals are mandatory; if Client fails to respond to milestone delivery within seven (7) business days, such milestone shall be deemed accepted.",
    },
    {
      id: generateContractBlockId("commercials"),
      type: "contract_commercials",
      title: "Schedule B: Commercials & Payment Milestones",
      totalValue: dealValue,
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
    },
    {
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: "3.0",
      title: "Intellectual Property Rights & Work for Hire",
      body: "Upon receipt of full and final payment under this Agreement, Service Provider assigns to Client all right, title, and interest in and to the custom codebase, graphics, and architectural blueprints produced specifically for Client. Service Provider retains ownership of its pre-existing internal libraries, developer toolkits, starter templates, and general engineering methodologies used across its agency operations.",
    },
    {
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: "4.0",
      title: "Confidentiality & Mutual Non-Disclosure",
      body: "Both parties agree to protect each other's Confidential Information (including business processes, technical architecture, proprietary trade secrets, customer records, and financial details) with the same degree of care used to protect their own sensitive information. This covenant shall survive the termination of this Agreement for three (3) years.",
    },
    {
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: "5.0",
      title: "Warranties, Bug-Fix Support & Limitation of Liability",
      body: "Service Provider provides thirty (30) days of complimentary post-launch bug fixing for any functional defect that deviates from agreed specifications. Except for willful misconduct or breach of confidentiality, Service Provider's total aggregate liability under this Agreement shall not exceed the total fees paid by Client under this Agreement.",
    },
    {
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: "6.0",
      title: "Termination & Kill Fee",
      body: "Either party may terminate this Agreement upon fourteen (14) days written notice for material breach. In the event of termination for convenience by Client, Client shall pay for all work completed up to the termination date plus a twenty percent (20%) mobilization kill fee on the remaining contract balance.",
    },
    {
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: "7.0",
      title: "Governing Law & Legal Jurisdiction",
      body: "This Agreement shall be governed by and interpreted under the laws of India. Any legal dispute or proceeding arising out of or relating to this Agreement shall be subject to the exclusive jurisdiction of the competent courts in Kolkata, West Bengal.",
    },
    {
      id: generateContractBlockId("signature"),
      type: "contract_signature",
      clientTitle: clientCompany.toUpperCase(),
      clientSignatory: clientName,
      clientDesignation: "Authorized Representative",
      clientDate: today,
      agreementDisclaimer: `By signing this I, ${clientName} am in full agreement about all of the clauses mentioned above`,
      countersignNote: "Please sign in the designated space above and return one signed digital copy via email to contact@scalyx.in.",
    },
  ];
}

