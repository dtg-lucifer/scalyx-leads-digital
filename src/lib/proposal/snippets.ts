export interface ProposalSnippet {
  id: string;
  name: string;
  category: "Header & Meta" | "Architecture & Tech" | "Scope & Features" | "Commercial & Sign-off";
  description: string;
  markdown: string;
}

export const PROPOSAL_SNIPPETS: ProposalSnippet[] = [
  {
    id: "header_brand",
    name: "Scalyx Formal Header",
    category: "Header & Meta",
    description: "Official Scalyx logo, contact details, web address, and corporate tagline",
    markdown: `::: header
:::
`,
  },
  {
    id: "title_meta",
    name: "Proposal Title & Meta Box",
    category: "Header & Meta",
    description: "Document title, subtitle, eyebrow, and client metadata card with status badge",
    markdown: `::: title-meta
# Scalyx Custom Platform Architecture
## Private Messaging & High-Volume Document Exchange Platform for Verified Advocates
- **Eyebrow:** PROPOSAL & ARCHITECTURAL BLUEPRINT
- **Prepared For:** LexConnect
- **Prepared By:** Scalyx
- **Date:** October 5, 2026
- **Version:** v1.0 (Production Blueprint)
- **Status:** CONFIDENTIAL
:::
`,
  },
  {
    id: "stat_cards",
    name: "Key Metrics Cards (4-Grid)",
    category: "Header & Meta",
    description: "4 high-contrast KPI cards (Capacity, Peak Concurrency, Phase 1 MVP, Phase 2 Scale)",
    markdown: `::: stats
- **TARGET CAPACITY** | \`1,00,000\` | Verified legal advocates
- **PEAK CONCURRENCY** | \`10% – 15%\` | 10,000–15,000 simultaneous users
- **PHASE 1 (MVP)** | \`₹60,000\` | Up to ~10,000 advocates
- **PHASE 2 (SCALE)** | \`₹25,000\` | Full 1 Lakh capacity hardening
:::
`,
  },
  {
    id: "section_header",
    name: "Numbered Section Header",
    category: "Header & Meta",
    description: "Section banner with square badge number (e.g., [01] Executive Summary)",
    markdown: `## [01] Executive Summary & Project Mission
`,
  },
  {
    id: "architecture_diagram",
    name: "Architecture Flow Terminal",
    category: "Architecture & Tech",
    description: "Dark terminal container showing end-to-end data pipelines with node badges and cyan arrows",
    markdown: `::: architecture title="ENTERPRISE END-TO-END ENCRYPTED DATA PIPELINE" badge="SIGNAL PROTOCOL E2EE"
Client Apps (iOS / Android / Web) ➔ Cloudflare WAF & CDN ➔ Go API & WebSocket Hub ➔ Redis (Presence) & Kafka (Broker) ➔ PostgreSQL (ACID) ➔ Cloudflare R2 / S3 (Encrypted Storage)
:::
`,
  },
  {
    id: "tech_stack_table",
    name: "Technology Stack Table",
    category: "Architecture & Tech",
    description: "Clean tabular layout for infrastructure, frameworks, databases, and justification",
    markdown: `| Layer | Technology Selected | Rationale & Enterprise Advantage |
| :--- | :--- | :--- |
| **Backend Core** | \`Golang\` | Extreme concurrency, sub-millisecond execution, lightweight Docker footprint. |
| **Relational DB** | \`PostgreSQL 16\` | Rock-solid ACID guarantees for advocate directory and audit logs. |
| **In-Memory Cache** | \`Redis Cluster\` | Real-time user presence, channel member rosters, and pub/sub routing. |
| **Message Queue** | \`Apache Kafka\` | High-throughput async message pipeline decoupling WebSocket ingestion. |
| **Encrypted Storage** | \`Cloudflare R2\` | Zero-egress fee object storage for PDFs and encrypted media archives. |
| **Web & Desktop** | \`Next.js (React)\` | Responsive, type-safe advocate desktop console and administration portal. |
`,
  },
  {
    id: "cloud_infra_table",
    name: "Cloud Cost Estimates Table",
    category: "Architecture & Tech",
    description: "Phase 1 monthly recurring infrastructure & hosting estimate breakdown",
    markdown: `| Component | Monthly Estimate (Phase 1) | Operational Notes |
| :--- | :--- | :--- |
| Go Backend / Compute Application Servers | \`₹2,500 – ₹4,000\` | 2x Scalable VPS nodes behind load balancer |
| Managed PostgreSQL & Redis Cluster | \`₹3,500 – ₹5,000\` | Automated backups, point-in-time recovery |
| Cloudflare Business & R2 Storage | \`₹2,000 – ₹3,000\` | DDoS shielding, Zero-egress bandwidth fees |
| Push Notifications & SMS OTP Gateway | \`₹1,500 – ₹2,500\` | Firebase FCM + Twilio/MSG91 transactional OTPs |
| Domain, SSL Certificates & Logging | \`₹1,000 – ₹1,500\` | BetterStack uptime & centralized monitoring |
| **Estimated Total Monthly Cloud Run-Rate** | **₹10,500 – ₹16,000** | Direct client billing via Cloud console |
`,
  },
  {
    id: "feature_grid_2col",
    name: "2-Column Deliverables Grid",
    category: "Scope & Features",
    description: "Lettered cards [A], [B], [C] for modular project scope deliverables",
    markdown: `::: feature-grid
### [A] Advocate Directory & Bar Council Verification
- Mandatory enrollment registration state machine (Pending ➔ Verified ➔ Active).
- Bar Council certificate and photo ID cryptographic verification uploads.
- State-wise, High Court-wise, and Practice Area directory lookup with instant fuzzy search.

### [B] E2EE Real-Time Messaging Engine
- Double Ratchet Algorithm (Signal Protocol) for zero-knowledge end-to-end encryption.
- One-on-one private counsel deliberations and multi-advocate case consultation rooms.
- Ephemeral messaging option with custom auto-shred timers for sensitive case filings.
:::
`,
  },
  {
    id: "scale_grid_2col",
    name: "Phase 2 Scale-Up Architecture (2-Col)",
    category: "Scope & Features",
    description: "Numbered engineering pillars describing concurrency, sharding, and CDN acceleration",
    markdown: `::: scale-grid
### 1. Database Connection Pooling & Read Replicas
- Implementation of **PgBouncer** connection poolers to handle 10,000+ simultaneous connections.
- Primary-replica replication setup: intensive search queries routed to read replicas.

### 2. High-Capacity WebSocket Clustering
- Stateless Go WebSocket gateways horizontally auto-scaled behind Cloudflare load balancer.
- Distributed Redis Pub/Sub channels to broadcast presence and events across server nodes.
:::
`,
  },
  {
    id: "callout_green",
    name: "Budget / Recommendation Callout",
    category: "Scope & Features",
    description: "Soft emerald highlight box for budget advice and infrastructure notes",
    markdown: `::: callout-green
**Recommended Phase 1 Infrastructure Budget:** We recommend maintaining an operational budget of **₹12,000 – ₹15,000 / month**. Heavy PDF document transfer is the primary variable; Cloudflare R2 is utilized specifically to eliminate high bandwidth egress fees.
:::
`,
  },
  {
    id: "callout_amber",
    name: "Policy / Architecture Callout",
    category: "Scope & Features",
    description: "Soft amber highlight box for zero-throwaway code guarantees and compliance rules",
    markdown: `::: policy-amber
**Zero Throwaway Code Policy:** At **₹60,000**, Phase 1 establishes the exact enterprise architecture that eventually supports 1,00,000 advocates. The core data pipeline remains fundamentally unified, eliminating expensive backend rewrites when growing from 10k to 1 lakh users.
:::
`,
  },
  {
    id: "commercial_quotation",
    name: "Commercial Quote Summary Card",
    category: "Commercial & Sign-off",
    description: "High-contrast dark card displaying total investment with phased price breakdown",
    markdown: `::: quotation
**Total Investment:** ₹85,000
**Subtitle:** Complete 2-Phase Engineering & Production Hardening (Up to 1 Lakh Users)
- **Phase 1 — MVP (10k Users):** ₹60,000
- **Phase 2 — Scale-Up (1 Lakh Users):** ₹25,000
- **Currency / Terms:** INR (Milestone-based)
:::
`,
  },
  {
    id: "milestones_timeline",
    name: "Payment Milestones Timeline",
    category: "Commercial & Sign-off",
    description: "Vertical timeline layout with milestone numbers, deliverables, and price chips",
    markdown: `::: milestones title="Phase 1 Payment Schedule (₹60,000)"
- **Milestone 1: Project Initiation & Core Architecture** | \`₹15,000\`
  Architecture finalization, PostgreSQL database schemas, Docker environment setup, and API specifications.
- **Milestone 2: Core Go Backend, Auth & Database** | \`₹15,000\`
  Mobile OTP authentication flow, advocate onboarding registry, Bar Council verification state machine, and directory search.
- **Milestone 3: Real-Time Chat Engine, E2EE & PDF Sharing** | \`₹15,000\`
  WebSocket messaging hub, Signal Protocol E2EE integration, Redis presence status, and Cloudflare R2 PDF upload pipeline.
- **Milestone 4: Multi-Platform Clients, Admin Panel & Launch** | \`₹15,000\`
  Android APK, iOS TestFlight build, Next.js desktop web client, Super Admin console, QA testing, and staging deployment.
:::
`,
  },
  {
    id: "signoff_acceptance",
    name: "Sign-off & Acceptance Grid",
    category: "Commercial & Sign-off",
    description: "Formal dual-column approval box for client sign-off and Scalyx team authorization",
    markdown: `::: signoff
- **Agency:** Scalyx
- **Website:** https://scalyx.in
- **Email:** contact@scalyx.in
- **Helpline:** +91 8927124748 (Call & WhatsApp)
- **Client:** LexConnect
- **Total Investment:** ₹85,000 INR (2 Phases)
:::
`,
  },
  {
    id: "page_break",
    name: "A4 Page Break Divider",
    category: "Header & Meta",
    description: "Visual dashed separator in editor that forces a hard page break when printing or exporting to PDF",
    markdown: `::: pagebreak
Scalyx — Technical Proposal | Architectural Blueprint
:::
`,
  },
  {
    id: "footer_running",
    name: "Running Page Footer",
    category: "Header & Meta",
    description: "Subtle bottom document footer with page fit indication and confidentiality notice",
    markdown: `::: footer
:::
`,
  },
];
