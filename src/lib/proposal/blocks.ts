export interface ArchitectureStep {
  id: string;
  label: string;
  subtext?: string;
}

export type ProposalBlock =
  | {
      id: string;
      type: "header";
      brandTitle: string;
      brandSubtitle: string;
      website: string;
      email: string;
      helpline: string;
      helplineNote: string;
    }
  | {
      id: string;
      type: "title_meta";
      title: string;
      subtitle: string;
      eyebrow: string;
      preparedFor: string;
      preparedBy: string;
      date: string;
      version: string;
      status: string;
    }
  | {
      id: string;
      type: "stats";
      items: Array<{ id: string; label: string; value: string; subtext: string }>;
    }
  | {
      id: string;
      type: "section_header";
      number: string;
      title: string;
    }
  | {
      id: string;
      type: "text";
      content: string;
    }
  | {
      id: string;
      type: "architecture";
      title: string;
      badge: string;
      steps?: ArchitectureStep[];
      flow?: string;
    }
  | {
      id: string;
      type: "tech_stack_table";
      rows: Array<{ id: string; layer: string; technology: string; rationale: string }>;
    }
  | {
      id: string;
      type: "cloud_infra_table";
      rows: Array<{ id: string; component: string; estimate: string; notes: string }>;
      totalLabel: string;
      totalEstimate: string;
      totalNotes: string;
    }
  | {
      id: string;
      type: "feature_grid";
      cards: Array<{ id: string; badge: string; title: string; bullets: string[] }>;
    }
  | {
      id: string;
      type: "scale_grid";
      cards: Array<{ id: string; number: string; title: string; bullets: string[] }>;
    }
  | {
      id: string;
      type: "callout_green";
      title: string;
      content: string;
    }
  | {
      id: string;
      type: "callout_amber";
      title: string;
      content: string;
    }
  | {
      id: string;
      type: "commercial_quotation";
      totalInvestment: string;
      subtitle: string;
      phases: Array<{ id: string; label: string; amount: string }>;
      terms: string;
    }
  | {
      id: string;
      type: "milestones";
      title: string;
      items: Array<{ id: string; title: string; amount: string; description: string }>;
    }
  | {
      id: string;
      type: "signoff";
      clientName: string;
      signee: string;
      email: string;
      scope: string;
      investment: string;
      agency: string;
      website: string;
      agencyEmail: string;
      helpline: string;
    }
  | {
      id: string;
      type: "page_break";
      label: string;
    }
  | {
      id: string;
      type: "footer";
      textLeft: string;
      textRight: string;
    };

export function generateBlockId(prefix: string = "block"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

export function parseFlowToSteps(flowStr: string): ArchitectureStep[] {
  if (!flowStr || !flowStr.trim()) return [];
  const parts = flowStr.split(/\s*(?:➔|->|→|=>)\s*/).filter(Boolean);
  return parts.map((part) => {
    const trimmed = part.trim().replace(/^[-*•●\s]+/, "");
    const match = trimmed.match(/^(.*?)\s*\(([^()]+)\)$/);
    if (match) {
      return {
        id: generateBlockId("step"),
        label: match[1].trim(),
        subtext: match[2].trim(),
      };
    }
    return {
      id: generateBlockId("step"),
      label: trimmed,
    };
  });
}

export function stepsToFlow(steps: ArchitectureStep[]): string {
  if (!steps || steps.length === 0) return "";
  return steps
    .map((s) => {
      const lbl = (s.label || "").trim();
      const sub = (s.subtext || "").trim();
      if (!lbl) return "";
      return sub ? `${lbl} (${sub})` : lbl;
    })
    .filter(Boolean)
    .join(" ➔ ");
}

export function getArchitectureSteps(block: {
  steps?: ArchitectureStep[];
  flow?: string;
}): ArchitectureStep[] {
  if (block.steps && Array.isArray(block.steps) && block.steps.length > 0) {
    return block.steps;
  }
  if (block.flow) {
    const parsed = parseFlowToSteps(block.flow);
    if (parsed.length > 0) return parsed;
  }
  return [
    { id: generateBlockId("step"), label: "Client Apps", subtext: "iOS / Android / Web" },
    { id: generateBlockId("step"), label: "Cloudflare WAF", subtext: "DDoS Shield & Edge CDN" },
    { id: generateBlockId("step"), label: "API Gateway", subtext: "Go Core & WebSocket Hub" },
    { id: generateBlockId("step"), label: "Database Cluster", subtext: "PostgreSQL 16 ACID" },
  ];
}

/**
 * Creates default block with rich prefilled data for each component
 */
export function createDefaultBlock(type: string): ProposalBlock {
  const id = generateBlockId(type);

  switch (type) {
    case "header":
      return {
        id,
        type: "header",
        brandTitle: "Scalyx",
        brandSubtitle: "CUSTOM SOFTWARE DEVELOPMENT & CLOUD SYSTEMS",
        website: "scalyx.in",
        email: "contact@scalyx.in",
        helpline: "+91 8927124748",
        helplineNote: "(Call & WhatsApp)",
      };

    case "title_meta":
      return {
        id,
        type: "title_meta",
        title: "Technical Architecture & Systems Blueprint",
        subtitle: "Enterprise Platform Engineering & Turnkey Cloud Infrastructure",
        eyebrow: "PROPOSAL & ARCHITECTURAL BLUEPRINT",
        preparedFor: "Valued Client",
        preparedBy: "Scalyx",
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        version: "v1.0 (Production Blueprint)",
        status: "CONFIDENTIAL",
      };

    case "stats":
      return {
        id,
        type: "stats",
        items: [
          { id: generateBlockId("item"), label: "TARGET CAPACITY", value: "1,00,000", subtext: "Active monthly verified users" },
          { id: generateBlockId("item"), label: "CONCURRENCY", value: "10% – 15%", subtext: "Simultaneous real-time sockets" },
          { id: generateBlockId("item"), label: "PHASE 1 (MVP)", value: "₹60,000", subtext: "Core production release" },
          { id: generateBlockId("item"), label: "PHASE 2 (SCALE)", value: "₹25,000", subtext: "Hardening & auto-clustering" },
        ],
      };

    case "section_header":
      return {
        id,
        type: "section_header",
        number: "01",
        title: "Executive Summary & Project Scope",
      };

    case "text":
      return {
        id,
        type: "text",
        content:
          "This engineering engagement provides an enterprise-grade digital architecture built for maximum concurrency, resilience, and strict data security. Every module is purpose-engineered to ensure zero technical debt and turnkey handover upon launch.",
      };

    case "architecture": {
      const defaultSteps: ArchitectureStep[] = [
        { id: generateBlockId("step"), label: "Client Apps", subtext: "iOS / Android / Web" },
        { id: generateBlockId("step"), label: "Cloudflare WAF", subtext: "DDoS Shield & Edge CDN" },
        { id: generateBlockId("step"), label: "Go API Gateway", subtext: "WebSocket Hub & Auth" },
        { id: generateBlockId("step"), label: "Event Broker", subtext: "Redis Presence & Kafka" },
        { id: generateBlockId("step"), label: "PostgreSQL 16", subtext: "ACID Relational Core" },
        { id: generateBlockId("step"), label: "Cloud Storage", subtext: "Encrypted R2 / S3" },
      ];
      return {
        id,
        type: "architecture",
        title: "ENTERPRISE END-TO-END DATA PIPELINE",
        badge: "SIGNAL PROTOCOL E2EE",
        steps: defaultSteps,
        flow: stepsToFlow(defaultSteps),
      };
    }

    case "tech_stack_table":
      return {
        id,
        type: "tech_stack_table",
        rows: [
          { id: generateBlockId("row"), layer: "Backend Core", technology: "Golang", rationale: "Sub-millisecond execution, high concurrency, and low memory footprint." },
          { id: generateBlockId("row"), layer: "Relational DB", technology: "PostgreSQL 16", rationale: "ACID transactions, relational integrity, and robust JSONB indexing." },
          { id: generateBlockId("row"), layer: "In-Memory Cache", technology: "Redis Cluster", rationale: "Real-time user presence, rate limiting, and pub/sub socket events." },
          { id: generateBlockId("row"), layer: "Storage & CDN", technology: "Cloudflare R2", rationale: "S3-compatible object storage with zero egress bandwidth charges." },
          { id: generateBlockId("row"), layer: "Frontend Web", technology: "Next.js (React)", rationale: "Modern server-rendered portal with responsive layout and strict typing." },
        ],
      };

    case "cloud_infra_table":
      return {
        id,
        type: "cloud_infra_table",
        rows: [
          { id: generateBlockId("row"), component: "Application Servers (Go / VPS)", estimate: "₹2,500 – ₹4,000", notes: "2x Scalable VPS nodes behind load balancer" },
          { id: generateBlockId("row"), component: "Managed PostgreSQL & Redis", estimate: "₹3,500 – ₹5,000", notes: "Automated backups with point-in-time recovery" },
          { id: generateBlockId("row"), component: "Cloudflare Business & R2 Storage", estimate: "₹2,000 – ₹3,000", notes: "DDoS shielding, edge caching, zero egress fees" },
          { id: generateBlockId("row"), component: "Push Notifications & SMS OTP", estimate: "₹1,500 – ₹2,500", notes: "Firebase FCM + Transactional SMS Gateway" },
        ],
        totalLabel: "Estimated Total Monthly Cloud Run-Rate",
        totalEstimate: "₹9,500 – ₹14,500",
        totalNotes: "Direct client billing via Cloud console",
      };

    case "feature_grid":
      return {
        id,
        type: "feature_grid",
        cards: [
          {
            id: generateBlockId("card"),
            badge: "A",
            title: "Identity, Access & Verification Pipeline",
            bullets: [
              "Mandatory registration state machine (Pending ➔ Verified ➔ Active).",
              "Multi-factor authentication (SMS / WhatsApp OTP + Passwordless links).",
              "Encrypted credential vault with role-based permission control.",
            ],
          },
          {
            id: generateBlockId("card"),
            badge: "B",
            title: "Real-Time Communications & Document Hub",
            bullets: [
              "Sub-50ms message delivery via horizontal WebSocket gateway cluster.",
              "End-to-end payload encryption with client-side key generation.",
              "High-volume document attachments with automated virus scanning.",
            ],
          },
        ],
      };

    case "scale_grid":
      return {
        id,
        type: "scale_grid",
        cards: [
          {
            id: generateBlockId("card"),
            number: "1",
            title: "Database Connection Pooling & Read Replicas",
            bullets: [
              "Implementation of PgBouncer connection poolers to handle 10,000+ connections.",
              "Primary-replica replication setup: intensive search queries routed to read replicas.",
            ],
          },
          {
            id: generateBlockId("card"),
            number: "2",
            title: "High-Capacity WebSocket Gateway Clustering",
            bullets: [
              "Stateless Go WebSocket gateways horizontally auto-scaled behind load balancer.",
              "Distributed Redis Pub/Sub channels to broadcast presence and events across server nodes.",
            ],
          },
        ],
      };

    case "callout_green":
      return {
        id,
        type: "callout_green",
        title: "Recommended Phase 1 Infrastructure Budget:",
        content:
          "We recommend maintaining an operational budget of ₹10,000 – ₹15,000 / month. Heavy document storage is isolated on Cloudflare R2 to completely eliminate egress network charges.",
      };

    case "callout_amber":
      return {
        id,
        type: "callout_amber",
        title: "Zero Throwaway Code Policy:",
        content:
          "Phase 1 establishes the exact enterprise architecture and database schemas that support subsequent scale-up phases. The core platform architecture remains unified, eliminating costly backend rewrites.",
      };

    case "commercial_quotation":
      return {
        id,
        type: "commercial_quotation",
        totalInvestment: "₹85,000",
        subtitle: "Complete 2-Phase Engineering & Production Hardening",
        phases: [
          { id: generateBlockId("phase"), label: "Phase 1 — Core Production MVP", amount: "₹60,000" },
          { id: generateBlockId("phase"), label: "Phase 2 — Scale-Up Hardening", amount: "₹25,000" },
        ],
        terms: "INR (Milestone-based)",
      };

    case "milestones":
      return {
        id,
        type: "milestones",
        title: "Phase 1 Payment Schedule (₹60,000)",
        items: [
          {
            id: generateBlockId("m"),
            title: "Milestone 1: Project Initiation & Architecture Spec",
            amount: "₹15,000",
            description: "System design signoff, PostgreSQL schemas, Docker orchestration, and API contracts.",
          },
          {
            id: generateBlockId("m"),
            title: "Milestone 2: Backend Core, Auth & Database",
            amount: "₹15,000",
            description: "OTP authentication flow, user directory, verification state machine, and fast search indexing.",
          },
          {
            id: generateBlockId("m"),
            title: "Milestone 3: Real-Time Engine, E2EE & Cloud Storage",
            amount: "₹15,000",
            description: "WebSocket messaging hub, Redis presence engine, and Cloudflare R2 asset pipeline.",
          },
          {
            id: generateBlockId("m"),
            title: "Milestone 4: Web/App Clients, Admin Console & Launch",
            amount: "₹15,000",
            description: "Production UI build, Super Admin console, QA testing, staging verification, and live deployment.",
          },
        ],
      };

    case "signoff":
      return {
        id,
        type: "signoff",
        clientName: "Client Company or Name",
        signee: "Authorized Representative",
        email: "client@example.com",
        scope: "Full Technical Architecture & Turnkey Delivery",
        investment: "₹85,000 INR (Milestone Schedule)",
        agency: "Scalyx",
        website: "https://scalyx.in",
        agencyEmail: "contact@scalyx.in",
        helpline: "+91 8927124748 (Call & WhatsApp)",
      };

    case "page_break":
      return {
        id,
        type: "page_break",
        label: "Scalyx — Technical Proposal | Architectural Blueprint",
      };

    case "footer":
      return {
        id,
        type: "footer",
        textLeft: "Scalyx Architectural Blueprint & Engineering Proposal • Confidential",
        textRight: "Page Fit: A4 Standard • scalyx.in",
      };

    default:
      return {
        id,
        type: "text",
        content: "New proposal block content.",
      };
  }
}

/**
 * Maps snippet IDs from PROPOSAL_SNIPPETS into ready-to-use ProposalBlocks.
 */
export function createBlockFromSnippet(snippetId: string): ProposalBlock {
  switch (snippetId) {
    case "header_brand":
      return createDefaultBlock("header");
    case "title_meta":
      return createDefaultBlock("title_meta");
    case "stat_cards":
      return createDefaultBlock("stats");
    case "section_header":
      return createDefaultBlock("section_header");
    case "architecture_diagram":
      return createDefaultBlock("architecture");
    case "tech_stack_table":
      return createDefaultBlock("tech_stack_table");
    case "cloud_infra_table":
      return createDefaultBlock("cloud_infra_table");
    case "feature_grid_2col":
      return createDefaultBlock("feature_grid");
    case "scale_grid_2col":
      return createDefaultBlock("scale_grid");
    case "callout_green":
      return createDefaultBlock("callout_green");
    case "callout_amber":
      return createDefaultBlock("callout_amber");
    case "commercial_quotation":
      return createDefaultBlock("commercial_quotation");
    case "milestones_timeline":
      return createDefaultBlock("milestones");
    case "signoff_acceptance":
      return createDefaultBlock("signoff");
    case "page_break":
      return createDefaultBlock("page_break");
    case "footer_running":
      return createDefaultBlock("footer");
    default:
      return createDefaultBlock(snippetId);
  }
}

/**
 * Converts an array of visual ProposalBlocks into clean, standard Markdown.
 */
export function blocksToMarkdown(blocks: ProposalBlock[]): string {
  const parts: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case "header": {
        const lines: string[] = ["::: header"];
        if (block.brandTitle) lines.push(`brand: ${block.brandTitle}`);
        if (block.brandSubtitle) lines.push(`subtitle: ${block.brandSubtitle}`);
        if (block.website) lines.push(`web: ${block.website}`);
        if (block.email) lines.push(`email: ${block.email}`);
        if (block.helpline) lines.push(`helpline: ${block.helpline}`);
        if (block.helplineNote) lines.push(`helplineNote: ${block.helplineNote}`);
        lines.push(":::");
        parts.push(lines.join("\n"));
        break;
      }

      case "title_meta": {
        const lines: string[] = ["::: title-meta"];
        if (block.title) lines.push(`# ${block.title}`);
        if (block.subtitle) lines.push(`## ${block.subtitle}`);
        if (block.eyebrow) lines.push(`- **Eyebrow:** ${block.eyebrow}`);
        if (block.preparedFor) lines.push(`- **Prepared For:** ${block.preparedFor}`);
        if (block.preparedBy) lines.push(`- **Prepared By:** ${block.preparedBy}`);
        if (block.date) lines.push(`- **Date:** ${block.date}`);
        if (block.version) lines.push(`- **Version:** ${block.version}`);
        if (block.status) lines.push(`- **Status:** ${block.status}`);
        lines.push(":::");
        parts.push(lines.join("\n"));
        break;
      }

      case "stats": {
        const lines: string[] = ["::: stats"];
        for (const item of block.items) {
          lines.push(`- **${item.label}** | \`${item.value}\` | ${item.subtext}`);
        }
        lines.push(":::");
        parts.push(lines.join("\n"));
        break;
      }

      case "section_header": {
        if (block.number) {
          parts.push(`## [${block.number}] ${block.title}`);
        } else {
          parts.push(`## ${block.title}`);
        }
        break;
      }

      case "text": {
        if (block.content.trim()) {
          parts.push(block.content.trim());
        }
        break;
      }

      case "architecture": {
        const titleAttr = block.title ? ` title="${block.title}"` : "";
        const badgeAttr = block.badge ? ` badge="${block.badge}"` : "";
        const steps = getArchitectureSteps(block);
        const flowText = stepsToFlow(steps);
        parts.push(`::: architecture${titleAttr}${badgeAttr}\n${flowText}\n:::`);
        break;
      }

      case "tech_stack_table": {
        const lines: string[] = [
          "| Layer | Technology Selected | Rationale & Enterprise Advantage |",
          "| :--- | :--- | :--- |",
        ];
        for (const r of block.rows) {
          lines.push(`| **${r.layer}** | \`${r.technology}\` | ${r.rationale} |`);
        }
        parts.push(lines.join("\n"));
        break;
      }

      case "cloud_infra_table": {
        const lines: string[] = [
          "| Component | Monthly Estimate (Phase 1) | Operational Notes |",
          "| :--- | :--- | :--- |",
        ];
        for (const r of block.rows) {
          lines.push(`| ${r.component} | \`${r.estimate}\` | ${r.notes} |`);
        }
        if (block.totalEstimate) {
          lines.push(
            `| **${block.totalLabel || "Estimated Total Monthly Cloud Run-Rate"}** | **${block.totalEstimate}** | ${block.totalNotes || "Direct client billing via Cloud console"} |`
          );
        }
        parts.push(lines.join("\n"));
        break;
      }

      case "feature_grid": {
        const lines: string[] = ["::: feature-grid"];
        for (const c of block.cards) {
          const badge = c.badge.startsWith("[") ? c.badge : `[${c.badge}]`;
          lines.push(`### ${badge} ${c.title}`);
          for (const b of c.bullets) {
            lines.push(`- ${b}`);
          }
          lines.push("");
        }
        lines.push(":::");
        parts.push(lines.join("\n"));
        break;
      }

      case "scale_grid": {
        const lines: string[] = ["::: scale-grid"];
        for (const c of block.cards) {
          lines.push(`### ${c.number}. ${c.title}`);
          for (const b of c.bullets) {
            lines.push(`- ${b}`);
          }
          lines.push("");
        }
        lines.push(":::");
        parts.push(lines.join("\n"));
        break;
      }

      case "callout_green": {
        parts.push(`::: callout-green\n**${block.title}** ${block.content}\n:::`);
        break;
      }

      case "callout_amber": {
        parts.push(`::: policy-amber\n**${block.title}** ${block.content}\n:::`);
        break;
      }

      case "commercial_quotation": {
        const lines: string[] = ["::: quotation"];
        if (block.totalInvestment) lines.push(`**Total Investment:** ${block.totalInvestment}`);
        if (block.subtitle) lines.push(`**Subtitle:** ${block.subtitle}`);
        for (const p of block.phases) {
          lines.push(`- **${p.label}:** ${p.amount}`);
        }
        if (block.terms) lines.push(`- **Currency / Terms:** ${block.terms}`);
        lines.push(":::");
        parts.push(lines.join("\n"));
        break;
      }

      case "milestones": {
        const titleAttr = block.title ? ` title="${block.title}"` : "";
        const lines: string[] = [`::: milestones${titleAttr}`];
        for (const m of block.items) {
          lines.push(`- **${m.title}** | \`${m.amount}\`\n  ${m.description}`);
        }
        lines.push(":::");
        parts.push(lines.join("\n"));
        break;
      }

      case "signoff": {
        const lines: string[] = [
          "::: signoff",
          `- **Client Name:** ${block.clientName || "[Client Company or Name]"}`,
          `- **Authorized Signee:** ${block.signee || "[Representative Name / Title]"}`,
          `- **Client Email:** ${block.email || "client@company.com"}`,
          `- **Agreed Scope:** ${block.scope || "Full Technical Architecture & Turnkey Delivery"}`,
          `- **Total Investment:** ${block.investment || "As per agreed milestone schedule"}`,
          `- **Agency:** ${block.agency || "Scalyx"}`,
          `- **Website:** ${block.website || "https://scalyx.in"}`,
          `- **Email:** ${block.agencyEmail || "contact@scalyx.in"}`,
          `- **Helpline:** ${block.helpline || "+91 8927124748 (Call & WhatsApp)"}`,
          ":::",
        ];
        parts.push(lines.join("\n"));
        break;
      }

      case "page_break": {
        parts.push(`::: pagebreak\n${block.label || "Scalyx — Technical Proposal | Architectural Blueprint"}\n:::`);
        break;
      }

      case "footer": {
        const lines: string[] = ["::: footer"];
        if (block.textLeft) lines.push(`textLeft: ${block.textLeft}`);
        if (block.textRight) lines.push(`textRight: ${block.textRight}`);
        lines.push(":::");
        parts.push(lines.join("\n"));
        break;
      }
    }
  }

  return parts.join("\n\n");
}

/**
 * Parses raw proposal Markdown into structured visual ProposalBlocks.
 */
export function markdownToBlocks(rawMd: string): ProposalBlock[] {
  if (!rawMd || !rawMd.trim()) {
    return [createDefaultBlock("header"), createDefaultBlock("title_meta")];
  }

  const lines = rawMd.split("\n");
  const blocks: ProposalBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line || line === ":::") {
      i++;
      continue;
    }

    // Directives
    if (line.startsWith(":::")) {
      const dirMatch = line.match(/^:::\s*([a-zA-Z0-9_-]+)(.*)$/);
      if (!dirMatch) {
        i++;
        continue;
      }

      const dirName = dirMatch[1].toLowerCase();
      const dirArgs = dirMatch[2].trim();
      i++;

      const bodyLines: string[] = [];
      if (dirName === "header" || dirName === "footer") {
        if (i < lines.length && lines[i].trim() === ":::") i++;
      } else {
        while (i < lines.length && !lines[i].trim().startsWith(":::")) {
          bodyLines.push(lines[i]);
          i++;
        }
        if (i < lines.length && lines[i].trim().startsWith(":::")) {
          i++;
        }
      }

      const body = bodyLines.join("\n").trim();

      switch (dirName) {
        case "header": {
          let brandTitle = "Scalyx";
          let brandSubtitle = "CUSTOM SOFTWARE DEVELOPMENT & CLOUD SYSTEMS";
          let website = "scalyx.in";
          let email = "contact@scalyx.in";
          let helpline = "+91 8927124748";
          let helplineNote = "(Call & WhatsApp)";

          for (const bl of bodyLines) {
            const tl = bl.trim();
            const kv = tl.match(/^(?:brand|brandTitle|company):\s*(.*)$/i);
            if (kv) brandTitle = kv[1].trim();
            const kvSub = tl.match(/^(?:subtitle|brandSubtitle|tagline):\s*(.*)$/i);
            if (kvSub) brandSubtitle = kvSub[1].trim();
            const kvWeb = tl.match(/^(?:web|website):\s*(.*)$/i);
            if (kvWeb) website = kvWeb[1].trim();
            const kvEmail = tl.match(/^email:\s*(.*)$/i);
            if (kvEmail) email = kvEmail[1].trim();
            const kvHelp = tl.match(/^helpline:\s*(.*)$/i);
            if (kvHelp) helpline = kvHelp[1].trim();
            const kvNote = tl.match(/^(?:helplineNote|callNote):\s*(.*)$/i);
            if (kvNote) helplineNote = kvNote[1].trim();
          }

          blocks.push({
            id: generateBlockId("header"),
            type: "header",
            brandTitle,
            brandSubtitle,
            website,
            email,
            helpline,
            helplineNote,
          });
          break;
        }

        case "title-meta":
        case "title_meta": {
          let eyebrow = "PROPOSAL & ARCHITECTURAL BLUEPRINT";
          let title = "Technical Proposal";
          let subtitle = "";
          let preparedFor = "";
          let preparedBy = "Scalyx";
          let date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
          let version = "v1.0";
          let status = "CONFIDENTIAL";

          for (const bl of bodyLines) {
            const tl = bl.trim();
            if (tl.startsWith("# ")) title = tl.replace(/^#\s+/, "").trim();
            else if (tl.startsWith("## ")) subtitle = tl.replace(/^##\s+/, "").trim();
            else if (tl.startsWith("### ")) eyebrow = tl.replace(/^###\s+/, "").trim();
            else {
              const kvMatch = tl.replace(/^[-*•●\s]+/, "").match(/^(?:\*\*)?([^:]+?)(?:\*\*)?:\s*(.*)$/);
              if (kvMatch) {
                const k = kvMatch[1].replace(/\*\*/g, "").trim().toLowerCase();
                const v = kvMatch[2].replace(/\*\*/g, "").trim();
                if (k.includes("eyebrow")) eyebrow = v;
                else if (k.includes("client") || k.includes("prepared for") || k.includes("for")) preparedFor = v;
                else if (k.includes("prepared by") || k.includes("by")) preparedBy = v;
                else if (k.includes("date")) date = v;
                else if (k.includes("version")) version = v;
                else if (k.includes("status")) status = v;
                else if (k.includes("title")) title = v;
                else if (k.includes("subtitle")) subtitle = v;
              }
            }
          }

          blocks.push({
            id: generateBlockId("title_meta"),
            type: "title_meta",
            title,
            subtitle,
            eyebrow,
            preparedFor,
            preparedBy,
            date,
            version,
            status,
          });
          break;
        }

        case "stats": {
          const items: Array<{ id: string; label: string; value: string; subtext: string }> = [];
          for (const bl of bodyLines) {
            const tl = bl.trim();
            if (!tl) continue;
            const parts = tl.replace(/^[-*•●\s]+/, "").split("|").map((p) => p.trim());
            if (parts.length >= 2) {
              const label = parts[0].replace(/\*\*/g, "").trim();
              const value = parts[1].replace(/[`*]/g, "").trim();
              const subtext = parts[2] ? parts[2].trim() : "";
              items.push({ id: generateBlockId("item"), label, value, subtext });
            }
          }
          blocks.push({
            id: generateBlockId("stats"),
            type: "stats",
            items: items.length > 0 ? items : (createDefaultBlock("stats") as any).items,
          });
          break;
        }

        case "architecture": {
          let title = "ENTERPRISE ARCHITECTURE FLOW";
          let badge = "SIGNAL PROTOCOL E2EE";
          const titleMatch = dirArgs.match(/title="([^"]+)"/i);
          if (titleMatch) title = titleMatch[1];
          const badgeMatch = dirArgs.match(/badge="([^"]+)"/i);
          if (badgeMatch) badge = badgeMatch[1];

          const rawFlow = body || "Client ➔ API Gateway ➔ Core Service ➔ Database";
          const steps = parseFlowToSteps(rawFlow);

          blocks.push({
            id: generateBlockId("arch"),
            type: "architecture",
            title,
            badge,
            steps,
            flow: rawFlow,
          });
          break;
        }

        case "feature-grid":
        case "feature_grid": {
          const cards: Array<{ id: string; badge: string; title: string; bullets: string[] }> = [];
          let currentCard: { id: string; badge: string; title: string; bullets: string[] } | null = null;

          for (const bl of bodyLines) {
            const tl = bl.trim();
            if (tl.startsWith("### ")) {
              if (currentCard) cards.push(currentCard);
              const headerText = tl.replace(/^###\s+/, "").trim();
              const badgeMatch = headerText.match(/^\[([A-Za-z0-9]+)\]\s*(.*)$/);
              if (badgeMatch) {
                currentCard = {
                  id: generateBlockId("card"),
                  badge: badgeMatch[1],
                  title: badgeMatch[2].trim(),
                  bullets: [],
                };
              } else {
                currentCard = {
                  id: generateBlockId("card"),
                  badge: String.fromCharCode(65 + cards.length),
                  title: headerText,
                  bullets: [],
                };
              }
            } else if (tl.startsWith("- ") || tl.startsWith("* ")) {
              if (currentCard) {
                currentCard.bullets.push(tl.replace(/^[-*]\s+/, "").trim());
              }
            }
          }
          if (currentCard) cards.push(currentCard);

          blocks.push({
            id: generateBlockId("feature_grid"),
            type: "feature_grid",
            cards: cards.length > 0 ? cards : (createDefaultBlock("feature_grid") as any).cards,
          });
          break;
        }

        case "scale-grid":
        case "scale_grid": {
          const cards: Array<{ id: string; number: string; title: string; bullets: string[] }> = [];
          let currentCard: { id: string; number: string; title: string; bullets: string[] } | null = null;

          for (const bl of bodyLines) {
            const tl = bl.trim();
            if (tl.startsWith("### ")) {
              if (currentCard) cards.push(currentCard);
              const headerText = tl.replace(/^###\s+/, "").trim();
              const numMatch = headerText.match(/^(\d+)[\.\)]\s*(.*)$/);
              if (numMatch) {
                currentCard = {
                  id: generateBlockId("card"),
                  number: numMatch[1],
                  title: numMatch[2].trim(),
                  bullets: [],
                };
              } else {
                currentCard = {
                  id: generateBlockId("card"),
                  number: String(cards.length + 1),
                  title: headerText,
                  bullets: [],
                };
              }
            } else if (tl.startsWith("- ") || tl.startsWith("* ")) {
              if (currentCard) {
                currentCard.bullets.push(tl.replace(/^[-*]\s+/, "").trim());
              }
            }
          }
          if (currentCard) cards.push(currentCard);

          blocks.push({
            id: generateBlockId("scale_grid"),
            type: "scale_grid",
            cards: cards.length > 0 ? cards : (createDefaultBlock("scale_grid") as any).cards,
          });
          break;
        }

        case "callout-green": {
          let title = "Budget Recommendation:";
          let content = body;
          const match = body.match(/^\*\*([^*]+)\*\*\s*([\s\S]*)$/);
          if (match) {
            title = match[1].trim();
            content = match[2].trim();
          }
          blocks.push({
            id: generateBlockId("callout_green"),
            type: "callout_green",
            title,
            content,
          });
          break;
        }

        case "policy-amber": {
          let title = "Architecture Policy:";
          let content = body;
          const match = body.match(/^\*\*([^*]+)\*\*\s*([\s\S]*)$/);
          if (match) {
            title = match[1].trim();
            content = match[2].trim();
          }
          blocks.push({
            id: generateBlockId("callout_amber"),
            type: "callout_amber",
            title,
            content,
          });
          break;
        }

        case "quotation": {
          let totalInvestment = "₹85,000";
          let subtitle = "Complete Production Engineering";
          const phases: Array<{ id: string; label: string; amount: string }> = [];
          let terms = "INR (Milestone-based)";

          for (const bl of bodyLines) {
            const tl = bl.trim();
            const kv = tl.replace(/^[-*•●\s]+/, "").match(/^(?:\*\*)?([^:]+?)(?:\*\*)?:\s*(.*)$/);
            if (kv) {
              const k = kv[1].replace(/\*\*/g, "").trim().toLowerCase();
              const v = kv[2].replace(/\*\*/g, "").trim();
              if (k.includes("total investment") || k === "total") totalInvestment = v;
              else if (k.includes("subtitle")) subtitle = v;
              else if (k.includes("currency") || k.includes("terms")) terms = v;
              else {
                phases.push({ id: generateBlockId("phase"), label: kv[1].replace(/\*\*/g, "").trim(), amount: v });
              }
            }
          }

          blocks.push({
            id: generateBlockId("quotation"),
            type: "commercial_quotation",
            totalInvestment,
            subtitle,
            phases: phases.length > 0 ? phases : (createDefaultBlock("commercial_quotation") as any).phases,
            terms,
          });
          break;
        }

        case "milestones": {
          let title = "Payment Milestones Schedule";
          const titleMatch = dirArgs.match(/title="([^"]+)"/i);
          if (titleMatch) title = titleMatch[1];

          const items: Array<{ id: string; title: string; amount: string; description: string }> = [];
          let currentItem: { id: string; title: string; amount: string; description: string } | null = null;

          for (const bl of bodyLines) {
            const tl = bl.trim();
            if (tl.startsWith("- ") || tl.startsWith("* ")) {
              if (currentItem) items.push(currentItem);
              const headerLine = tl.replace(/^[-*]\s+/, "");
              const parts = headerLine.split("|").map((p) => p.trim());
              const mTitle = parts[0].replace(/\*\*/g, "").trim();
              const mAmount = parts[1] ? parts[1].replace(/[`*]/g, "").trim() : "";
              currentItem = {
                id: generateBlockId("m"),
                title: mTitle,
                amount: mAmount,
                description: "",
              };
            } else if (currentItem) {
              currentItem.description = (currentItem.description ? currentItem.description + " " : "") + tl;
            }
          }
          if (currentItem) items.push(currentItem);

          blocks.push({
            id: generateBlockId("milestones"),
            type: "milestones",
            title,
            items: items.length > 0 ? items : (createDefaultBlock("milestones") as any).items,
          });
          break;
        }

        case "signoff": {
          let clientName = "";
          let signee = "";
          let email = "";
          let scope = "Full Technical Architecture & Turnkey Delivery";
          let investment = "₹85,000 INR (Milestone Schedule)";
          let agency = "Scalyx";
          let website = "https://scalyx.in";
          let agencyEmail = "contact@scalyx.in";
          let helpline = "+91 8927124748 (Call & WhatsApp)";

          for (const bl of bodyLines) {
            const kv = bl.replace(/^[-*•●\s]+/, "").match(/^(?:\*\*)?([^:]+?)(?:\*\*)?:\s*(.*)$/);
            if (kv) {
              const k = kv[1].replace(/\*\*/g, "").trim().toLowerCase();
              const v = kv[2].replace(/\*\*/g, "").trim();
              if (k.includes("client name") || k === "client") clientName = v;
              else if (k.includes("signee") || k.includes("representative")) signee = v;
              else if (k.includes("client email")) email = v;
              else if (k.includes("scope")) scope = v;
              else if (k.includes("investment")) investment = v;
              else if (k.includes("agency")) agency = v;
              else if (k.includes("website")) website = v;
              else if (k.includes("email")) agencyEmail = v;
              else if (k.includes("helpline") || k.includes("phone")) helpline = v;
            }
          }

          blocks.push({
            id: generateBlockId("signoff"),
            type: "signoff",
            clientName,
            signee,
            email,
            scope,
            investment,
            agency,
            website,
            agencyEmail,
            helpline,
          });
          break;
        }

        case "pagebreak": {
          blocks.push({
            id: generateBlockId("page_break"),
            type: "page_break",
            label: body || "Scalyx — Technical Proposal | Architectural Blueprint",
          });
          break;
        }

        case "footer": {
          let textLeft = "Scalyx Architectural Blueprint & Engineering Proposal • Confidential";
          let textRight = "Page Fit: A4 Standard • scalyx.in";

          for (const bl of bodyLines) {
            const tl = bl.trim();
            const kvLeft = tl.match(/^(?:textLeft|left|confidential):\s*(.*)$/i);
            if (kvLeft) textLeft = kvLeft[1].trim();
            const kvRight = tl.match(/^(?:textRight|right|pageFit):\s*(.*)$/i);
            if (kvRight) textRight = kvRight[1].trim();
          }

          blocks.push({
            id: generateBlockId("footer"),
            type: "footer",
            textLeft,
            textRight,
          });
          break;
        }

        default: {
          blocks.push({
            id: generateBlockId("text"),
            type: "text",
            content: `::: ${dirName}\n${body}\n:::`,
          });
          break;
        }
      }
      continue;
    }

    // Section Header
    if (line.startsWith("## ") || line.startsWith("### [") || line.startsWith("# [")) {
      const secMatch = line.match(/^#{1,3}\s*(?:\[(\d+)\])?\s*(.*)$/);
      blocks.push({
        id: generateBlockId("section_header"),
        type: "section_header",
        number: secMatch?.[1] || "",
        title: secMatch?.[2] || line.replace(/^#{1,3}\s*/, ""),
      });
      i++;
      continue;
    }

    // Markdown Table
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      // Check table columns to detect tech stack vs cloud infra vs generic table
      const headerLine = tableLines[0] || "";
      const isTechStack = headerLine.toLowerCase().includes("technology") || headerLine.toLowerCase().includes("layer");
      const isCloudCost = headerLine.toLowerCase().includes("monthly estimate") || headerLine.toLowerCase().includes("operational notes");

      if (isTechStack) {
        const rows: Array<{ id: string; layer: string; technology: string; rationale: string }> = [];
        // Skip header and separator
        for (let r = 2; r < tableLines.length; r++) {
          const cells = tableLines[r]
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim());
          if (cells.length >= 3) {
            rows.push({
              id: generateBlockId("row"),
              layer: cells[0].replace(/\*\*/g, ""),
              technology: cells[1].replace(/[`*]/g, ""),
              rationale: cells[2],
            });
          }
        }
        blocks.push({
          id: generateBlockId("tech_stack_table"),
          type: "tech_stack_table",
          rows: rows.length > 0 ? rows : (createDefaultBlock("tech_stack_table") as any).rows,
        });
      } else if (isCloudCost) {
        const rows: Array<{ id: string; component: string; estimate: string; notes: string }> = [];
        let totalLabel = "Estimated Total Monthly Cloud Run-Rate";
        let totalEstimate = "";
        let totalNotes = "Direct client billing via Cloud console";

        for (let r = 2; r < tableLines.length; r++) {
          const cells = tableLines[r]
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim());
          if (cells.length >= 2) {
            if (cells[0].includes("**Estimated Total") || cells[0].includes("**Total")) {
              totalLabel = cells[0].replace(/\*\*/g, "").trim();
              totalEstimate = cells[1].replace(/[`*]/g, "").trim();
              if (cells[2]) totalNotes = cells[2].trim();
            } else {
              rows.push({
                id: generateBlockId("row"),
                component: cells[0].replace(/\*\*/g, ""),
                estimate: cells[1].replace(/[`*]/g, ""),
                notes: cells[2] || "",
              });
            }
          }
        }
        blocks.push({
          id: generateBlockId("cloud_infra_table"),
          type: "cloud_infra_table",
          rows: rows.length > 0 ? rows : (createDefaultBlock("cloud_infra_table") as any).rows,
          totalLabel,
          totalEstimate,
          totalNotes,
        });
      } else {
        // Generic table converted into clean text or structured representation
        blocks.push({
          id: generateBlockId("text"),
          type: "text",
          content: tableLines.join("\n"),
        });
      }
      continue;
    }

    // Regular Text Chunk
    const textLines: string[] = [];
    while (
      i < lines.length &&
      !lines[i].trim().startsWith(":::") &&
      !lines[i].trim().startsWith("## ") &&
      !lines[i].trim().startsWith("### [") &&
      !lines[i].trim().startsWith("# [") &&
      !lines[i].trim().startsWith("|")
    ) {
      textLines.push(lines[i]);
      i++;
    }
    const content = textLines.join("\n").trim();
    if (content) {
      blocks.push({
        id: generateBlockId("text"),
        type: "text",
        content,
      });
    }
  }

  return blocks;
}
