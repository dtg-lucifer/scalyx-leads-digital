export interface ProposalSnippet {
  id: string;
  name: string;
  category:
    | "Header & Meta"
    | "Structure"
    | "Technical"
    | "Financial"
    | "Legal & Close";
  description: string;
  markdown: string;
}

export const PROPOSAL_SNIPPETS: ProposalSnippet[] = [
  {
    id: "header",
    name: "Branded Header",
    category: "Header & Meta",
    description:
      "Official Scalyx letterhead with logo, web, email and helpline",
    markdown: `::: header
`,
  },
  {
    id: "title_meta",
    name: "Proposal Title & Meta Box",
    category: "Header & Meta",
    description:
      "Document title, subtitle, and client metadata box with confidentiality badge",
    markdown: `::: title-meta
# LEXCONNECT
## Private Messaging & High-Volume Document Exchange Platform for Verified Advocates
- **Client:** LexConnect
- **Prepared By:** Scalyx
- **Date:** October 5, 2026
- **Currency:** INR (₹)
- **Status:** CONFIDENTIAL & PRIVILEGED
:::
`,
  },
  {
    id: "stat_cards",
    name: "Key Metrics Cards (4-Grid)",
    category: "Header & Meta",
    description:
      "4 high-contrast KPI cards (Capacity, Peak Concurrency, Phase 1 MVP, Phase 2 Scale)",
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
    category: "Structure",
    description:
      "Sharp numbered badge section title [01], [02], etc. matching blueprint typography",
    markdown: `## [01] Executive Summary & Project Mission
`,
  },
  {
    id: "architecture_terminal",
    name: "Dark Architecture Diagram",
    category: "Technical",
    description:
      "Dark charcoal terminal box with pipeline steps from Apps to WAF, Go Hub, and Databases",
    markdown: `::: architecture title="ENTERPRISE END-TO-END ENCRYPTED DATA PIPELINE" badge="SIGNAL PROTOCOL E2EE"
Client Apps (iOS / Android / Web) ➔ Cloudflare WAF & CDN ➔ Go API & WebSocket Hub ➔ Redis (Presence) & Kafka (Broker) ➔ PostgreSQL (ACID) ➔ Cloudflare R2 / S3 (Encrypted Storage)
:::
`,
  },
  {
    id: "tech_stack_table",
    name: "Technology Stack Table",
    category: "Technical",
    description:
      "Structured table with layer, technology chip, and strategic rationale",
    markdown: `| Layer | Technology Chosen | Strategic Purpose & Rationale |
| :--- | :--- | :--- |
| **Backend Core** | \`Golang\` | Compiled microservices with lightweight goroutines handling high-volume concurrent WebSocket connections with minimal RAM footprint. |
| **API Structure** | \`Hybrid REST + WebSocket\` | REST endpoints for directory searches and authentication; real-time WebSockets for instant message transmission, typing state, and presence. |
| **Encryption** | \`Signal Protocol (E2EE)\` | Gold-standard End-to-End Encryption ensuring zero-knowledge privacy — neither server administrators nor third parties can decrypt private communications. |
| **Primary Database** | \`PostgreSQL\` | Enterprise ACID-compliant relational persistence for advocate credentials, court channels, group metadata, and verification audit logs. |
| **Cache & Presence** | \`Redis\` | Sub-millisecond in-memory data store for live online/offline presence tracking, token caching, and API rate-limiting buckets. |
| **Message Broker** | \`Apache Kafka\` | High-throughput distributed event streaming bus handling async delivery receipts, court channel broadcasting, and audit pipelines. |
| **Document Storage** | \`Cloudflare R2 / AWS S3\` | S3-compatible encrypted object storage for court briefs, vakalatnamas, and voice notes with zero egress fees. |
| **Mobile Clients** | \`React Native (Expo)\` | Single cross-platform TypeScript codebase generating native iOS and Android binaries with biometric security. |
| **Web Platform** | \`Next.js 15 (React 19)\` | High-performance desktop web interface for advocates, chamber staff, and multi-window case file inspection. |
`,
  },
  {
    id: "deliverables_grid",
    name: "Feature Deliverables Grid",
    category: "Structure",
    description:
      "2-column card grid with letter badges [A], [B], [C] and bulleted features",
    markdown: `::: feature-grid
### [A] Authentication & Advocate Onboarding
- Mobile OTP verification & secure session issuance.
- Advocate registration: Full Name, Bar Council Enrollment Number, Primary Practice Court, Profile Photo, and Advocate Bio.
- Verification status lifecycle with Verified Badge display.
- Admin-assisted manual verification workflow for credentials.

### [B] Advocate Directory & Discovery
- Real-time advocate search by name with fuzzy matching.
- Filter and search by registered practice court (High Court, District Courts).
- Public advocate credential profile view.
- Direct 1-to-1 chat initiation without exchanging private phone numbers.

### [C] Secure 1-to-1 Real-Time Chat (E2EE)
- End-to-End Encrypted messaging backed by Signal Protocol.
- Real-time WebSocket delivery with online/offline presence indicators.
- Message status indicators: Sent, Delivered, and Read receipts.
- Ephemeral message expiry options for sensitive case deliberations.

### [D] Court-Wise Channels & Public Broadcasts
- Structured broadcast channels for High Courts and District Courts.
- Verified admin posting: Daily cause lists, urgent bench notifications, and bar association circulars.
- Read-only subscriber feeds with push notification alerts.
:::
`,
  },
  {
    id: "hosting_table",
    name: "Hosting Infrastructure Budget",
    category: "Financial",
    description:
      "Breakdown table of monthly cloud hosting costs with recommended budget callout",
    markdown: `| Infrastructure Component | Estimated Monthly Cost |
| :--- | :---: |
| Go Backend / Compute Application Servers | \`₹2,500 – ₹4,000\` |
| PostgreSQL Managed Database + Redis Cache + Kafka Broker | \`₹3,000 – ₹5,000\` |
| Cloudflare R2 / AWS S3 Document Storage | \`₹1,000 – ₹2,500\` |
| Cloudflare CDN / Security & SSL | \`₹0 – ₹1,500\` |
| Automated Backups, Monitoring & Centralized Logs | \`₹1,000 – ₹2,000\` |
| **Total Estimated Phase 1 Monthly Hosting** | **₹7,500 – ₹14,000 / mo** |

::: callout-green
**Recommended Phase 1 Infrastructure Budget:** We recommend maintaining an operational budget of **₹12,000 – ₹15,000 / month**. Heavy PDF document transfer is the primary variable; Cloudflare R2 is utilized specifically to eliminate high bandwidth egress fees.
:::
`,
  },
  {
    id: "scale_hardening_cards",
    name: "Phase 2 Scale-Up Cards",
    category: "Technical",
    description:
      "Numbered engineering hardening modules (Go clustering, PgBouncer, Kafka sharding)",
    markdown: `::: scale-grid
### 1. Backend Horizontal Scaling
- Horizontal Go clustering behind high-availability load balancers.
- Distributed WebSocket connection routing with session sticky flags.
- Fine-grained API rate limiting and token bucket throttles.
- Decoupled background worker scaling for asynchronous workloads.

### 2. PostgreSQL Enterprise Scaling
- Advanced query profiling and composite index optimization.
- Production connection pooling via PgBouncer.
- Read replica configuration to offload directory search queries.
- Point-in-time recovery (PITR) and data archival strategy.

### 3. Redis In-Memory Optimization
- Dedicated Redis cluster nodes partitioned for ephemeral presence.
- Memory-efficient serialization protocols (Protobuf) for reduced RAM overhead.
- Pub/Sub channel sharding across advocate groups.

### 4. Kafka Enterprise Event Bus
- Partitioned topics for regional courtroom notification dispatch.
- Message replay capability ensuring zero message loss during surges.
- High-throughput consumers for real-time document virus scanning.
:::
`,
  },
  {
    id: "quotation_box",
    name: "Commercial Quotation Box",
    category: "Financial",
    description:
      "High-contrast dark commercial card with total investment amount and breakdown",
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
    id: "milestones_schedule",
    name: "Payment Milestones Schedule",
    category: "Financial",
    description:
      "Structured timeline with milestone deliverables, criteria, and INR amounts",
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
    id: "policy_callout",
    name: "Policy Callout Box",
    category: "Structure",
    description:
      "Sharp amber accent box for critical engineering policies (e.g. Zero Throwaway Code)",
    markdown: `::: policy-amber
**Zero Throwaway Code Policy:** At **₹60,000**, Phase 1 establishes the exact enterprise architecture that eventually supports 1,00,000 advocates. The core data pipeline (**Client ➔ Cloudflare ➔ Go API/WebSocket ➔ Redis/Kafka/PostgreSQL ➔ Cloudflare R2 with Signal Protocol E2EE**) remains fundamentally unified, eliminating expensive backend rewrites when growing from 10k to 1 lakh users.
:::
`,
  },
  {
    id: "assumptions_list",
    name: "Assumptions & Exclusions List",
    category: "Legal & Close",
    description:
      "Numbered legal boundaries covering cloud billing, SMS OTPs, and App Store fees",
    markdown: `1. **Infrastructure Billing:** Cloud server hosting, object storage, and third-party SaaS bills are separate from development charges and billed directly to the client based on actual usage.
2. **Third-Party Usage Fees:** SMS OTP gateways (e.g. MSG91, Twilio), Cloudflare, and AWS/R2 services are billed according to actual volume. Push notifications utilize FCM and Apple APNs.
3. **App Store Fees:** Apple Developer Account ($99/year) and Google Play Console ($25 one-time) fees are excluded.
4. **Bar Council Verification:** Phase 1 implements an admin-assisted manual verification workflow with document review. Direct automated Bar Council portal scraping is excluded from MVP.
5. **PDF Storage Policy:** Heavy document usage is subject to reasonable retention and fair-usage parameters; unlimited document storage without archival policies is excluded.
6. **Court Channels & Specs:** Initial courtroom administrators and maximum allowed PDF/image upload file limits will be finalized during Milestone 1.
`,
  },
  {
    id: "signoff_block",
    name: "Agency Sign-Off & Acceptance",
    category: "Legal & Close",
    description:
      "Scalyx company details alongside the formal proposal acceptance signature block",
    markdown: `::: signoff
- **Agency:** Scalyx
- **Website:** https://scalyx.in
- **Email:** contact@scalyx.in
- **Helpline:** +91 8927124748 (Call & WhatsApp)
- **Region:** India (Serving Global Clients)
- **Engagement:** Custom Enterprise Development
- **Client:** LexConnect
- **Total Investment:** ₹85,000 INR (2 Phases)
:::
`,
  },
  {
    id: "page_break",
    name: "A4 Page Break with Running Footer",
    category: "Structure",
    description:
      "Forces a clean A4 page split in print with running headers & footers",
    markdown: `::: pagebreak
Scalyx — Technical Proposal | Confidential & Privileged — Prepared for LexConnect | 2-Phase Architecture Specification
`,
  },
];
