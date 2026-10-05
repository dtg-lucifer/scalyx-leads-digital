export interface ProposalPreset {
  id: string;
  name: string;
  description: string;
  markdown: string;
}

export const LEXCONNECT_FULL_PROPOSAL = `::: header

::: title-meta
# LEXCONNECT
## Private Messaging & High-Volume Document Exchange Platform for Verified Advocates
- **Client:** LexConnect
- **Prepared By:** Scalyx
- **Date:** October 5, 2026
- **Currency:** INR (₹)
- **Status:** CONFIDENTIAL & PRIVILEGED
:::

::: stats
- **TARGET CAPACITY** | \`1,00,000\` | Verified legal advocates
- **PEAK CONCURRENCY** | \`10% – 15%\` | 10,000–15,000 simultaneous users
- **PHASE 1 (MVP)** | \`₹60,000\` | Up to ~10,000 advocates
- **PHASE 2 (SCALE)** | \`₹25,000\` | Full 1 Lakh capacity hardening
:::

## [01] Executive Summary & Project Mission

LexConnect is conceived as an enterprise-grade private communication network tailored specifically for verified legal practitioners. The platform addresses critical workflow inefficiencies and confidentiality risks inherent in consumer chat applications by offering:

- **Strict Identity Verification:** Mandatory Bar Council enrollment verification with administrative credential approval before account activation.
- **End-to-End Cryptographic Privacy:** Zero-knowledge Signal Protocol encryption ensuring that case deliberations, confidential client disclosures, and vakalatnamas remain strictly private.
- **High-Volume Case Document Exchange:** Accelerated PDF transmission infrastructure engineered to handle heavy legal briefs, petition annexures, and case compilations with zero bandwidth egress penalties.
- **Dedicated Courtroom Channels:** Structured, verified broadcast feeds organized by High Courts and District Courts for official cause lists, urgent mentions, and bar association notices.

::: pagebreak
Scalyx — Technical Proposal | LexConnect Architectural Blueprint | Page 1 of 10
:::

## [02] Architectural Blueprint & Technology Stack

The LexConnect infrastructure is engineered for resilience, sub-second latency, and horizontal scalability. At its core, the system decouples synchronous WebSocket message routing from asynchronous document processing pipelines.

::: architecture title="ENTERPRISE END-TO-END ENCRYPTED DATA PIPELINE" badge="SIGNAL PROTOCOL E2EE"
Client Apps (iOS / Android / Web) ➔ Cloudflare WAF & CDN ➔ Go API & WebSocket Hub ➔ Redis (Presence) & Kafka (Broker) ➔ PostgreSQL (ACID) ➔ Cloudflare R2 / S3 (Encrypted Storage)
:::

### Comprehensive Technology Stack & Engineering Rationale

| Layer | Technology Chosen | Strategic Purpose & Rationale |
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
| **Super Admin Console** | \`Next.js + Tailwind\` | Dedicated administrative command center for Bar Council credential verification, audit logs, and courtroom channel management. |
| **Infrastructure** | \`Docker & Docker Compose\` | Fully containerized microservices ensuring zero configuration drift between local development, staging, and production. |

::: pagebreak
Scalyx — Technical Proposal | LexConnect Architectural Blueprint | Page 2 of 10
:::

## [03] Phase 1 Deliverables Specification (MVP)

Phase 1 provides a fully operational, production-ready private messaging platform supporting up to 10,000 active advocates across mobile (iOS & Android) and web platforms.

::: feature-grid
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

### [D] High-Volume PDF & Document Exchange
- In-chat encrypted PDF, document, and image sharing.
- Chunked multi-part upload pipeline optimized for slow mobile networks.
- Built-in PDF reader with page thumbnail navigation and quick preview.
- File retention, download, and forward controls.

### [E] Private Groups & Advocate Chambers
- Multi-party encrypted group chats for senior-junior advocate chambers.
- Role-based permissions: Chamber Admin, Associate, and Read-Only Member.
- Centralized group document drawer collecting all shared case briefs.

### [F] Court-Wise Channels & Public Broadcasts
- Structured broadcast channels for High Courts and District Courts.
- Verified admin posting: Daily cause lists, urgent bench notifications, and bar association circulars.
- Read-only subscriber feeds with push notification alerts.

### [G] Cross-Platform Client Applications
- Native Android APK and Google Play Store submission build.
- Native iOS IPA with Apple TestFlight distribution build.
- Next.js responsive desktop web platform with biometric lock support.

### [H] Super Admin Console
- Comprehensive advocate verification queue with document previews.
- Bar Council credential approval and rejection workflows.
- User status controls (Active, Pending Verification, Suspended).
- Court channel management and broadcast moderation tools.
:::

::: pagebreak
Scalyx — Technical Proposal | LexConnect Architectural Blueprint | Page 3 of 10
:::

## [04] Phase 1 Infrastructure & Hosting Estimates

The following estimates detail monthly cloud infrastructure costs during Phase 1 operations (supporting up to 10,000 active legal advocates).

| Infrastructure Component | Estimated Monthly Cost |
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

## [05] Phase 2 Scale-Up Architecture (1,00,000 Advocates)

Phase 2 introduces deep architectural hardening, read replica scaling, connection pooling, and multi-node Redis clusters to comfortably support 1,00,000 registered advocates with 10,000–15,000 peak concurrent connections.

::: scale-grid
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

### 5. Document Pipeline Optimization
- Presigned multipart direct-to-cloud uploads bypassing API servers.
- Automatic PDF compression and background thumbnail pre-generation.
- Multi-tier lifecycle rules moving older case filings to low-cost cold storage.

### 6. Cloudflare Enterprise Hardening
- Cloudflare Enterprise WAF rules tuned for legal document security.
- Advanced DDoS mitigation and geographic rate-limiting protections.
- Edge caching for public cause lists and directory assets.

### 7. APM & Infrastructure Observability
- Distributed tracing across Go microservices using OpenTelemetry.
- Prometheus & Grafana real-time monitoring dashboards.
- Automated Slack / PagerDuty alerts for abnormal server spikes.

### 8. Enterprise Load & Stress Testing
- Rigorous Locust/k6 simulations modeling 10,000 concurrent WebSocket connections.
- Peak upload burst testing simulating 2,000 concurrent 25MB brief submissions.
- Chaos engineering drills validating zero downtime failover.
:::

::: pagebreak
Scalyx — Technical Proposal | LexConnect Architectural Blueprint | Page 4 of 10
:::

## [06] Phase 2 Infrastructure & Hosting Estimates

The following estimates project monthly cloud infrastructure costs when operating at 1,00,000 active advocates.

| Scale Infrastructure Component | Estimated Monthly Cost |
| :--- | :---: |
| High-Availability Go Application Cluster (3–5 Nodes) | \`₹12,000 – ₹20,000\` |
| Managed PostgreSQL High-Availability Cluster + Read Replica | \`₹10,000 – ₹18,000\` |
| Redis Cluster Nodes (Presence & Caching) | \`₹4,000 – ₹7,000\` |
| Managed Apache Kafka Cluster / Event Bus | \`₹4,000 – ₹8,000\` |
| Cloudflare R2 High-Volume Storage (~2–5 TB Legal Briefs) | \`₹3,500 – ₹6,000\` |
| Cloudflare Business Tier CDN / WAF | \`₹1,500 – ₹3,000\` |
| APM, Distributed Tracing & Centralized Logging | \`₹1,500 – ₹3,000\` |
| **Total Estimated Phase 2 Monthly Hosting** | **₹36,500 – ₹65,000 / mo** |

## [07] Commercial Quotation & Investment Breakdown

Scalyx offers an all-inclusive, fixed-price engagement model covering complete end-to-end design, backend engineering, mobile app compilation, and deployment.

::: quotation
**Total Investment:** ₹85,000
**Subtitle:** Complete 2-Phase Engineering & Production Hardening (Up to 1 Lakh Users)
- **Phase 1 — MVP (10k Users):** ₹60,000
- **Phase 2 — Scale-Up (1 Lakh Users):** ₹25,000
- **Currency / Terms:** INR (Milestone-based)
:::

::: milestones title="Phase 1 Payment Schedule (₹60,000)"
- **Milestone 1: Project Initiation & Core Architecture** | \`₹15,000\`
  Architecture finalization, PostgreSQL database schemas, Docker environment setup, and API specifications.
- **Milestone 2: Core Go Backend, Auth & Database** | \`₹15,000\`
  Mobile OTP authentication flow, advocate onboarding registry, Bar Council verification state machine, and directory search.
- **Milestone 3: Real-Time Chat Engine, E2EE & PDF Sharing** | \`₹15,000\`
  WebSocket messaging hub, Signal Protocol E2EE integration, Redis presence status, and Cloudflare R2 PDF upload pipeline.
- **Milestone 4: Multi-Platform Clients, Admin Panel & Launch** | \`₹15,000\`
  Android APK, iOS TestFlight build, Next.js desktop web client, Super Admin console, QA testing, and staging deployment.
:::

::: milestones title="Phase 2 Payment Schedule (₹25,000)"
- **Milestone 5: Database Scaling, Read Replicas & PgBouncer** | \`₹7,000\`
  Connection pooling configuration, query profiling, index optimization, and read replica setup.
- **Milestone 6: Go Backend Clustering & Redis Partitioning** | \`₹7,000\`
  Horizontal application scaling, load balancer health checks, and Redis presence clustering.
- **Milestone 7: Kafka Broker Setup & Document Optimization** | \`₹6,000\`
  Event bus streaming, direct-to-cloud presigned multipart uploads, and lifecycle rules.
- **Milestone 8: Observability, Load Testing & 1 Lakh Sign-Off** | \`₹5,000\`
  Grafana dashboards, OpenTelemetry distributed tracing, 10k concurrent user load tests, and launch sign-off.
:::

::: pagebreak
Scalyx — Technical Proposal | LexConnect Architectural Blueprint | Page 5 of 10
:::

## [08] Zero Throwaway Code Policy

::: policy-amber
**Zero Throwaway Code Policy:** At **₹60,000**, Phase 1 establishes the exact enterprise architecture that eventually supports 1,00,000 advocates. The core data pipeline (**Client ➔ Cloudflare ➔ Go API/WebSocket ➔ Redis/Kafka/PostgreSQL ➔ Cloudflare R2 with Signal Protocol E2EE**) remains fundamentally unified, eliminating expensive backend rewrites when growing from 10k to 1 lakh users.
:::

## [09] Assumptions & Exclusions

1. **Infrastructure Billing:** Cloud server hosting, object storage, and third-party SaaS bills are separate from development charges and billed directly to the client based on actual usage.
2. **Third-Party Usage Fees:** SMS OTP gateways (e.g. MSG91, Twilio), Cloudflare, and AWS/R2 services are billed according to actual volume. Push notifications utilize FCM and Apple APNs.
3. **App Store Fees:** Apple Developer Account ($99/year) and Google Play Console ($25 one-time) fees are excluded.
4. **Bar Council Verification:** Phase 1 implements an admin-assisted manual verification workflow with document review. Direct automated Bar Council portal scraping is excluded from MVP.
5. **PDF Storage Policy:** Heavy document usage is subject to reasonable retention and fair-usage parameters; unlimited document storage without archival policies is excluded.
6. **Court Channels & Specs:** Initial courtroom administrators and maximum allowed PDF/image upload file limits will be finalized during Milestone 1.

## [10] Formal Authorization & Sign-Off

::: signoff
- **Agency:** Scalyx
- **Website:** https://scalyx.in
- **Email:** contact@scalyx.in
- **Helpline:** +91 8927124748 (Call & WhatsApp)
- **Region:** India (Serving Global Clients)
- **Engagement:** Custom Enterprise Development
- **Client:** LexConnect
- **Total Investment:** ₹85,000 INR (2 Phases)
:::
`;

export const COMMERCIAL_STARTER_PROPOSAL = `::: header

::: title-meta
# PROJECT TECHNICAL PROPOSAL
## Enterprise Architecture & Turnkey Application Delivery Specification
- **Client:** Acme Technologies
- **Prepared By:** Scalyx
- **Date:** October 5, 2026
- **Currency:** INR (₹)
- **Status:** CONFIDENTIAL & PRIVILEGED
:::

::: stats
- **TARGET USERS** | \`25,000\` | Active platform subscribers
- **DELIVERY TIMELINE** | \`6 WEEKS\` | Phased agile milestone delivery
- **ENGINEERING** | \`₹45,000\` | Turnkey custom full-stack delivery
- **MAINTENANCE** | \`INCLUDED\` | 30-day post-launch warranty
:::

## [01] Executive Summary & Scope

Scalyx has engineered this technical quotation to outline the scope, architecture, and commercial payment schedule for the turnkey delivery of your custom application platform.

- **High-Performance Architecture:** Sub-second response times backed by compiled microservices.
- **Relational Integrity:** ACID-compliant PostgreSQL database schema with migration auditing.
- **Modern User Experience:** Sharp-cornered, responsive mobile and desktop client interfaces.

::: architecture title="SYSTEM FLOW PIPELINE" badge="MODERN STACK"
Web & Mobile Clients ➔ Cloudflare Edge CDN ➔ API Gateway & Microservices ➔ PostgreSQL & Redis Cache
:::

## [02] Deliverables & Feature Grid

::: feature-grid
### [A] User Authentication & Onboarding
- Email/SMS verification flow with secure session issuance.
- Profile setup, avatar management, and permission assignments.

### [B] Core Platform Dashboard & Search
- High-speed query engine with instant fuzzy search.
- Responsive tabular views with custom filtering and export.

### [C] Secure File & Asset Storage
- Direct-to-storage presigned uploads with virus scanning.
- Role-based file access permissions and audit downloads.

### [D] Administrative Management Portal
- Comprehensive team management and activity tracking.
- Configuration controls and billing invoice generation.
:::

## [03] Commercial Quotation & Payment Schedule

::: quotation
**Total Investment:** ₹45,000
**Subtitle:** Turnkey Design, Architecture, Full-Stack Development & Deployment
- **Milestone 1 — Architecture & Setup:** ₹15,000
- **Milestone 2 — Core Features & Testing:** ₹15,000
- **Milestone 3 — Production Launch:** ₹15,000
:::

::: milestones title="Payment Milestones Schedule"
- **Milestone 1: Architecture, Schemas & UI Prototype** | \`₹15,000\`
  System blueprint approval, database schema design, and interactive frontend prototype.
- **Milestone 2: API Development, Database & Integration** | \`₹15,000\`
  Complete backend endpoints, third-party integrations, and staging environment verification.
- **Milestone 3: QA Testing, Production Deployment & Handover** | \`₹15,000\`
  Production server provisioning, domain & SSL configuration, source code handover, and launch.
:::

## [04] Acceptance & Authorization

::: signoff
- **Agency:** Scalyx
- **Website:** https://scalyx.in
- **Email:** contact@scalyx.in
- **Helpline:** +91 8927124748 (Call & WhatsApp)
- **Client:** Acme Technologies
- **Total Investment:** ₹45,000 INR
:::
`;

export const BLANK_PROPOSAL = `::: header

::: title-meta
# NEW TECHNICAL PROPOSAL
## Enter document subtitle or client mission here
- **Client:** [Client Name]
- **Prepared By:** Scalyx
- **Date:** October 5, 2026
- **Currency:** INR (₹)
- **Status:** CONFIDENTIAL & PRIVILEGED
:::

## [01] Executive Summary

Write your executive summary here using standard Markdown...

::: pagebreak
Scalyx — Technical Proposal | Prepared for [Client Name]
:::

## [02] Commercial Quotation

::: quotation
**Total Investment:** ₹0
**Subtitle:** Turnkey Engineering & Delivery
- **Phase 1:** ₹0
- **Phase 2:** ₹0
:::

::: signoff
- **Agency:** Scalyx
- **Website:** https://scalyx.in
- **Email:** contact@scalyx.in
- **Helpline:** +91 8927124748
- **Client:** [Client Name]
- **Total Investment:** ₹0 INR
:::
`;

export const PROPOSAL_PRESETS: ProposalPreset[] = [
  {
    id: "lexconnect",
    name: "LexConnect Enterprise Blueprint (Full 10-Page)",
    description:
      "Complete 10-page LexConnect technical proposal matching official blueprint PDF",
    markdown: LEXCONNECT_FULL_PROPOSAL,
  },
  {
    id: "commercial_starter",
    name: "Commercial Quotation Starter (3-Page)",
    description:
      "Concise 3-page commercial proposal with deliverables, quotation, and milestones",
    markdown: COMMERCIAL_STARTER_PROPOSAL,
  },
  {
    id: "blank",
    name: "Blank Proposal Canvas",
    description:
      "Clean canvas with Scalyx header and title box ready for custom markdown",
    markdown: BLANK_PROPOSAL,
  },
];
