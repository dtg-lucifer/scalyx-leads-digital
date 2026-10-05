import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { SCALYX_LOGO_DATA_URI } from "@/lib/email/logo";

export const PROPOSAL_STYLESHEET = `
  *, *:before, *:after {
    box-sizing: border-box !important;
    border-radius: 0px !important;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #f8fafc;
    color: #1e293b;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 13.5px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .proposal-page {
    width: 100%;
    max-width: 840px;
    margin: 0 auto;
    background: #ffffff;
    padding: 44px 48px;
    box-sizing: border-box;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  }
  .proposal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 16px;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 24px;
  }
  .proposal-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .proposal-logo-img {
    width: 44px;
    height: 44px;
    object-fit: contain;
    display: block;
    border-radius: 0px !important;
  }
  .proposal-brand-title {
    font-size: 20px;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.5px;
    line-height: 1;
  }
  .proposal-brand-subtitle {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1.2px;
    color: #64748b;
    text-transform: uppercase;
    margin-top: 3px;
  }
  .proposal-header-right {
    text-align: right;
    font-size: 11px;
    color: #475569;
    line-height: 1.5;
  }
  .proposal-header-right .text-muted {
    color: #94a3b8;
  }
  .proposal-title-meta-grid {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    margin: 24px 0 28px;
  }
  .proposal-eyebrow {
    font-size: 11px;
    font-weight: 800;
    color: #2563eb;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 6px;
  }
  .proposal-main-title {
    font-size: 32px;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -1px;
    line-height: 1.1;
    margin: 0 0 6px;
  }
  .proposal-main-subtitle {
    font-size: 13px;
    color: #475569;
    max-width: 440px;
    line-height: 1.5;
  }
  .proposal-meta-card {
    border: 1px solid #e2e8f0;
    background-color: #f8fafc;
    padding: 14px 18px;
    min-width: 220px;
    font-size: 11.5px;
  }
  .proposal-meta-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    color: #475569;
  }
  .proposal-meta-row strong {
    color: #0f172a;
  }
  .proposal-badge-confidential {
    display: block;
    text-align: center;
    margin-top: 10px;
    padding: 4px 8px;
    background-color: #fef3c7;
    border: 1px solid #fde68a;
    color: #92400e;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .stat-grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin: 24px 0;
  }
  .stat-card {
    border: 1px solid #e2e8f0;
    background-color: #ffffff;
    padding: 14px;
    border-top: 3px solid #0f172a;
  }
  .border-top-blue { border-top-color: #2563eb !important; }
  .border-top-purple { border-top-color: #7c3aed !important; }
  .border-top-emerald { border-top-color: #059669 !important; }
  .border-top-amber { border-top-color: #d97706 !important; }
  .stat-card-label {
    font-size: 9.5px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #64748b;
    margin-bottom: 4px;
  }
  .stat-card-value {
    font-size: 20px;
    font-weight: 900;
    color: #0f172a;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: -0.5px;
    line-height: 1.15;
  }
  .stat-card-desc {
    font-size: 11px;
    color: #64748b;
    margin-top: 4px;
    line-height: 1.35;
  }
  .section-title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 32px 0 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f5f9;
  }
  .section-number-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background-color: #eff6ff;
    border: 1px solid #dbeafe;
    color: #2563eb;
    font-weight: 800;
    font-size: 12px;
    font-family: ui-monospace, monospace;
  }
  .section-title {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.4px;
    margin: 0;
  }
  .architecture-terminal {
    background-color: #0a0f1d;
    border: 1px solid #1e293b;
    padding: 18px 20px;
    margin: 20px 0;
    color: #f8fafc;
  }
  .architecture-terminal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    margin-bottom: 14px;
    border-bottom: 1px solid #1e293b;
  }
  .terminal-title {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1.5px;
    color: #94a3b8;
  }
  .terminal-badge {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1px;
    color: #38bdf8;
    background-color: rgba(56, 189, 248, 0.1);
    border: 1px solid rgba(56, 189, 248, 0.25);
    padding: 2px 8px;
  }
  .pipeline-flow-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font-size: 12px;
  }
  .pipeline-node {
    display: inline-block;
    background-color: #1e293b;
    color: #e2e8f0;
    border: 1px solid #334155;
    padding: 6px 10px;
    font-family: ui-monospace, monospace;
    font-size: 11.5px;
  }
  .node-primary {
    background-color: #1e3a8a;
    border-color: #2563eb;
    color: #ffffff;
  }
  .node-accent {
    background-color: #1e1b4b;
    border-color: #6366f1;
    color: #c7d2fe;
  }
  .node-warning {
    background-color: #451a03;
    border-color: #b45309;
    color: #fde68a;
  }
  .pipeline-arrow {
    color: #38bdf8;
    font-weight: bold;
    padding: 0 2px;
  }
  .proposal-table {
    width: 100%;
    border-collapse: collapse;
    margin: 18px 0;
    font-size: 12.5px;
  }
  .proposal-table th {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 9px 12px;
    font-weight: 800;
    color: #0f172a;
    text-align: left;
    font-size: 11px;
    letter-spacing: 0.5px;
  }
  .proposal-table td {
    border: 1px solid #e2e8f0;
    padding: 10px 12px;
    color: #334155;
    vertical-align: top;
    line-height: 1.55;
  }
  .table-total-row td {
    background-color: #f8fafc;
    border-top: 2px solid #0f172a;
  }
  .tech-chip {
    display: inline-block;
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
    padding: 2px 7px;
    font-size: 11px;
    font-weight: 700;
    font-family: ui-monospace, monospace;
  }
  .features-2col-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin: 16px 0;
  }
  .feature-card {
    border: 1px solid #e2e8f0;
    background-color: #ffffff;
    padding: 16px;
  }
  .feature-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f5f9;
  }
  .feature-letter-badge {
    width: 22px;
    height: 22px;
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #2563eb;
    font-weight: 800;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .feature-card-title {
    font-size: 13.5px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
  }
  .scale-card-title {
    font-size: 13px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid #f1f5f9;
  }
  .feature-bullets {
    margin: 0;
    padding-left: 18px;
    font-size: 12px;
    color: #475569;
    line-height: 1.6;
  }
  .feature-bullets li {
    margin-bottom: 5px;
  }
  .commercial-quote-card {
    background-color: #0f172a;
    color: #ffffff;
    padding: 22px 24px;
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }
  .quote-card-label {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.5px;
    color: #94a3b8;
    text-transform: uppercase;
  }
  .quote-card-amount {
    font-size: 34px;
    font-weight: 900;
    color: #ffffff;
    font-family: ui-monospace, monospace;
    letter-spacing: -1px;
    margin: 4px 0 2px;
  }
  .quote-card-sub {
    font-size: 11.5px;
    color: #94a3b8;
  }
  .quote-card-right {
    min-width: 250px;
    font-size: 12px;
    line-height: 1.7;
    border-left: 1px solid #334155;
    padding-left: 20px;
  }
  .quote-breakdown-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    color: #cbd5e1;
  }
  .quote-breakdown-row strong {
    color: #ffffff;
    font-family: ui-monospace, monospace;
  }
  .milestones-heading {
    font-size: 14.5px;
    font-weight: 800;
    color: #0f172a;
    margin: 22px 0 12px;
  }
  .milestone-timeline {
    border-left: 2px solid #e2e8f0;
    padding-left: 18px;
    margin: 14px 0 18px 8px;
  }
  .milestone-item {
    position: relative;
    margin-bottom: 14px;
  }
  .milestone-bullet {
    position: absolute;
    left: -25px;
    top: 3px;
    width: 12px;
    height: 12px;
    background-color: #ffffff;
    border: 2px solid #2563eb;
  }
  .milestone-content {
    font-size: 12.5px;
  }
  .milestone-title-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 2px;
  }
  .milestone-title-row strong {
    color: #0f172a;
  }
  .milestone-price {
    font-family: ui-monospace, monospace;
    font-weight: 800;
    color: #2563eb;
    font-size: 13px;
  }
  .milestone-desc {
    color: #64748b;
    margin: 0;
    font-size: 12px;
    line-height: 1.45;
  }
  .callout-box-amber {
    border: 1px solid #fde68a;
    border-left: 4px solid #d97706;
    background-color: #fffbeb;
    color: #92400e;
    padding: 14px 16px;
    margin: 18px 0;
    font-size: 12.5px;
    line-height: 1.6;
  }
  .callout-box-green {
    border: 1px solid #a7f3d0;
    border-left: 4px solid #059669;
    background-color: #ecfdf5;
    color: #065f46;
    padding: 14px 16px;
    margin: 18px 0;
    font-size: 12.5px;
    line-height: 1.6;
  }
  .assumptions-list {
    padding-left: 20px;
    font-size: 12.5px;
    color: #334155;
    line-height: 1.65;
  }
  .assumptions-list li {
    margin-bottom: 8px;
  }
  .signoff-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin: 22px 0;
  }
  .signoff-card {
    border: 1px solid #e2e8f0;
    background-color: #f8fafc;
    padding: 16px 18px;
    font-size: 12px;
  }
  .signoff-title {
    font-size: 13.5px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid #e2e8f0;
  }
  .signoff-line {
    margin-bottom: 5px;
    color: #475569;
  }
  .signoff-line strong {
    color: #0f172a;
  }
  .signature-line-box {
    margin-top: 18px;
    padding-top: 12px;
    border-top: 1px dashed #cbd5e1;
  }
  .signature-placeholder {
    font-weight: 700;
    color: #64748b;
    font-style: italic;
    font-size: 11.5px;
  }
  .signature-caption {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 4px;
  }
  .proposal-running-footer {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #94a3b8;
    border-top: 1px solid #f1f5f9;
    padding-top: 12px;
    margin-top: 24px;
  }
  .page-break {
    border-top: 2px dashed #cbd5e1;
    margin: 36px -48px 36px;
    position: relative;
  }
  .page-break:after {
    content: "PAGE BREAK (A4)";
    position: absolute;
    right: 48px;
    top: -9px;
    background-color: #f1f5f9;
    padding: 0 8px;
    font-size: 9px;
    font-weight: 800;
    color: #94a3b8;
    letter-spacing: 0.8px;
  }

  /* Print specific formatting */
  @media print {
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    body {
      background: #ffffff !important;
      color: #000000 !important;
    }
    .proposal-page {
      border: none !important;
      box-shadow: none !important;
      padding: 0 !important;
      max-width: 100% !important;
    }
    .page-break {
      border: none !important;
      margin: 0 !important;
      page-break-before: always !important;
      break-before: page !important;
      height: 0 !important;
    }
    .page-break:after {
      display: none !important;
    }
    .architecture-terminal {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .commercial-quote-card {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }

  @media screen and (max-width: 680px) {
    .proposal-page {
      padding: 24px 16px;
    }
    .stat-grid-4 {
      grid-template-columns: repeat(2, 1fr);
    }
    .features-2col-grid, .signoff-grid, .proposal-title-meta-grid {
      grid-template-columns: 1fr;
      flex-direction: column;
    }
    .commercial-quote-card {
      flex-direction: column;
      align-items: flex-start;
    }
    .quote-card-right {
      border-left: none;
      border-top: 1px solid #334155;
      padding-left: 0;
      padding-top: 14px;
      width: 100%;
    }
  }
`;

function renderMilestoneItem(item: {
  title: string;
  price: string;
  desc: string;
}) {
  return `  <div class="milestone-item">
    <div class="milestone-bullet"></div>
    <div class="milestone-content">
      <div class="milestone-title-row">
        <strong>${item.title}</strong>
        ${item.price ? `<span class="milestone-price">${item.price}</span>` : ""}
      </div>
      ${item.desc ? `<p class="milestone-desc">${item.desc}</p>` : ""}
    </div>
  </div>`;
}

/**
 * Pre-processes proposal markdown directives and isolates them cleanly
 * via an injection callback.
 */
export function preprocessProposalDirectives(
  rawMd: string,
  register: (html: string) => string,
): string {
  let md = rawMd;

  // 1. Header: supports single-line "::: header", "::: header :::", "::: header\n:::", or "<Header />"
  md = md.replace(
    /(?:^:::\s*header\b[^\n]*(?:\r?\n:::\s*)?|<Header\s*\/?>|<Header>[\s\S]*?<\/Header>)/gm,
    () => {
      return register(`
<div class="proposal-header">
  <div class="proposal-header-left">
    <img src="/assets/scalyx_light.png" alt="Scalyx Logo" class="proposal-logo-img" onerror="this.onerror=null;this.src='${SCALYX_LOGO_DATA_URI}';" />
    <div>
      <div class="proposal-brand-title">Scalyx</div>
      <div class="proposal-brand-subtitle">CUSTOM SOFTWARE DEVELOPMENT & CLOUD SYSTEMS</div>
    </div>
  </div>
  <div class="proposal-header-right">
    <div><strong>Web:</strong> scalyx.in</div>
    <div><strong>Email:</strong> contact@scalyx.in</div>
    <div><strong>Helpline:</strong> +91 8927124748 <span class="text-muted">(Call & WhatsApp)</span></div>
  </div>
</div>
`);
    },
  );

  // 2. Page Break: supports single-line "::: pagebreak", "::: pagebreak ...", or "<PageBreak />"
  md = md.replace(
    /(?:^:::\s*pagebreak(?:\s+([^\n]+))?(?:\r?\n:::\s*)?|<PageBreak(?:\s+footer="([^"]+)")?\s*\/?>|<!--\s*pagebreak\s*-->)/gm,
    (_match, footer1, footer2) => {
      const footerText =
        footer1 ||
        footer2 ||
        "Scalyx — Technical Proposal | Confidential & Privileged | Architectural Blueprint";
      const parts = footerText
        .trim()
        .split("|")
        .map((p: string) => p.trim());
      const spans = parts.map((p: string) => `<span>${p}</span>`).join("\n  ");
      return register(`
<div class="proposal-running-footer">
  ${spans}
</div>
<div class="page-break"></div>
`);
    },
  );

  // 3. Title & Meta Box
  md = md.replace(
    /(?:^:::\s*title-meta\s*$([\s\S]*?)^:::\s*$|<TitleMeta>([\s\S]*?)<\/TitleMeta>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").trim();
      let title = "PROPOSAL";
      let subtitle = "";
      let eyebrow = "— TECHNICAL PROPOSAL & EXECUTION SPECIFICATION";
      const metaRows: { label: string; value: string }[] = [];
      let confidentialBadge = "";

      const lines = body.split("\n");
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;
        if (line.startsWith("# ")) {
          title = line.replace(/^#\s+/, "");
        } else if (line.startsWith("## ")) {
          subtitle = line.replace(/^##\s+/, "");
        } else if (line.startsWith("### ")) {
          eyebrow = line.replace(/^###\s+/, "");
        } else if (line.startsWith("- ") || line.startsWith("* ")) {
          const item = line.replace(/^[-*]\s+/, "");
          const matchMeta = item.match(/\*\*([^:]+):\*\*\s*(.*)/);
          if (matchMeta) {
            const key = matchMeta[1].trim();
            const val = matchMeta[2].trim();
            if (
              key.toLowerCase() === "status" ||
              key.toLowerCase() === "confidential"
            ) {
              confidentialBadge = val;
            } else {
              metaRows.push({ label: key, value: val });
            }
          }
        }
      }

      const rowsHtml = metaRows
        .map(
          (r) =>
            `<div class="proposal-meta-row"><span>${r.label}:</span> <strong>${r.value}</strong></div>`,
        )
        .join("\n");

      const badgeHtml = confidentialBadge
        ? `<div class="proposal-badge-confidential">${confidentialBadge}</div>`
        : `<div class="proposal-badge-confidential">CONFIDENTIAL & PRIVILEGED</div>`;

      return register(`
<div class="proposal-title-meta-grid">
  <div>
    <div class="proposal-eyebrow">${eyebrow}</div>
    <h1 class="proposal-main-title">${title}</h1>
    <div class="proposal-main-subtitle">${subtitle}</div>
  </div>
  <div class="proposal-meta-card">
    ${rowsHtml}
    ${badgeHtml}
  </div>
</div>
`);
    },
  );

  // 4. Stats: 4-Grid Metric Cards
  md = md.replace(
    /(?:^:::\s*stats\s*$([\s\S]*?)^:::\s*$|<Stats>([\s\S]*?)<\/Stats>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").trim();
      const borders = [
        "border-top-blue",
        "border-top-purple",
        "border-top-emerald",
        "border-top-amber",
      ];
      const cards: string[] = [];

      const lines = body.split("\n");
      let idx = 0;
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || (!line.startsWith("- ") && !line.startsWith("* ")))
          continue;
        const content = line.replace(/^[-*]\s+/, "");
        const parts = content.split("|").map((p: string) => p.trim());
        if (parts.length >= 2) {
          const label = parts[0].replace(/\*\*/g, "");
          const val = parts[1].replace(/`/g, "");
          const desc = parts[2] || "";
          const borderClass = borders[idx % borders.length];
          cards.push(`
  <div class="stat-card ${borderClass}">
    <div class="stat-card-label">${label}</div>
    <div class="stat-card-value">${val}</div>
    <div class="stat-card-desc">${desc}</div>
  </div>`);
          idx++;
        }
      }

      return register(`
<div class="stat-grid-4">
  ${cards.join("\n")}
</div>
`);
    },
  );

  // 5. Section headers: ## [01] Title or ## [ 01 ] Title
  md = md.replace(
    /^##\s*\[\s*([0-9A-Za-z]+)\s*\]\s*(.*)$/gm,
    (_match, num, title) => {
      return register(`
<div class="section-title-wrap">
  <span class="section-number-badge">${num}</span>
  <h2 class="section-title">${title}</h2>
</div>
`);
    },
  );

  // 6. Architecture Terminal Diagram
  md = md.replace(
    /(?:^:::\s*architecture(.*?)[\r\n]+([\s\S]*?)^:::\s*$|<Architecture(.*?)>([\s\S]*?)<\/Architecture>)/gm,
    (_match, attrs1, body1, attrs2, body2) => {
      const attrs = attrs1 || attrs2 || "";
      const body = (body1 || body2 || "").trim();
      const titleMatch = attrs.match(/title="([^"]+)"/);
      const badgeMatch = attrs.match(/badge="([^"]+)"/);
      const title = titleMatch
        ? titleMatch[1]
        : "ENTERPRISE END-TO-END ENCRYPTED DATA PIPELINE";
      const badge = badgeMatch ? badgeMatch[1] : "SIGNAL PROTOCOL E2EE";

      const flowLine = body.split("\n")[0] || body;
      const nodes = flowLine
        .split(/➔|->/)
        .map((n: string) => n.trim())
        .filter(Boolean);

      const nodesHtml = nodes
        .map((node: string, i: number) => {
          let nodeClass = "pipeline-node";
          if (i === 0) nodeClass += " node-primary";
          else if (i === 2) nodeClass += " node-accent";
          else if (i === nodes.length - 1) nodeClass += " node-warning";

          const arrow =
            i < nodes.length - 1 ? '<span class="pipeline-arrow">➔</span>' : "";
          return `<span class="${nodeClass}">${node}</span>${
            arrow ? ` ${arrow}` : ""
          }`;
        })
        .join(" ");

      return register(`
<div class="architecture-terminal">
  <div class="architecture-terminal-header">
    <span class="terminal-title">${title}</span>
    <span class="terminal-badge">${badge}</span>
  </div>
  <div class="pipeline-flow-wrapper">
    ${nodesHtml}
  </div>
</div>
`);
    },
  );

  // 7. Feature Grid: 2-Column Cards
  md = md.replace(
    /(?:^:::\s*feature-grid\s*$([\s\S]*?)^:::\s*$|<FeatureGrid>([\s\S]*?)<\/FeatureGrid>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").trim();
      const sections = body
        .split(/^###\s+/m)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

      const cards = sections.map((sec: string, i: number) => {
        const lines = sec.split("\n");
        const titleLine = lines[0]?.trim() || "";
        const letterMatch = titleLine.match(/^\[([A-Za-z0-9])\]\s*(.*)/);
        const letter = letterMatch
          ? letterMatch[1]
          : i < 26
            ? String.fromCharCode(65 + i)
            : `${i + 1}`;
        const cardTitle = letterMatch ? letterMatch[2] : titleLine;

        const bulletLines = lines
          .slice(1)
          .map((l: string) => l.trim())
          .filter((l: string) => l.startsWith("- ") || l.startsWith("* "));

        const bulletsHtml =
          bulletLines.length > 0
            ? `<ul class="feature-bullets">\n        ${bulletLines
                .map((l: string) => `<li>${l.replace(/^[-*]\s+/, "")}</li>`)
                .join("\n        ")}\n      </ul>`
            : "";

        return `
  <div class="feature-card">
    <div class="feature-card-header">
      <span class="feature-letter-badge">${letter}</span>
      <h3 class="feature-card-title">${cardTitle}</h3>
    </div>
    ${bulletsHtml}
  </div>`;
      });

      return register(`
<div class="features-2col-grid">
  ${cards.join("\n")}
</div>
`);
    },
  );

  // 8. Scale Grid: Engineering Hardening Cards
  md = md.replace(
    /(?:^:::\s*scale-grid\s*$([\s\S]*?)^:::\s*$|<ScaleGrid>([\s\S]*?)<\/ScaleGrid>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").trim();
      const sections = body
        .split(/^###\s+/m)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

      const cards = sections.map((sec: string) => {
        const lines = sec.split("\n");
        const titleLine = lines[0]?.trim() || "";
        const bulletLines = lines
          .slice(1)
          .map((l: string) => l.trim())
          .filter((l: string) => l.startsWith("- ") || l.startsWith("* "));

        const bulletsHtml =
          bulletLines.length > 0
            ? `<ul class="feature-bullets">\n        ${bulletLines
                .map((l: string) => `<li>${l.replace(/^[-*]\s+/, "")}</li>`)
                .join("\n        ")}\n      </ul>`
            : "";

        return `
  <div class="feature-card">
    <h4 class="scale-card-title">${titleLine}</h4>
    ${bulletsHtml}
  </div>`;
      });

      return register(`
<div class="features-2col-grid">
  ${cards.join("\n")}
</div>
`);
    },
  );

  // 9. Quotation: Dark Commercial Investment Card
  md = md.replace(
    /(?:^:::\s*quotation\s*$([\s\S]*?)^:::\s*$|<Quotation>([\s\S]*?)<\/Quotation>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").trim();
      let amount = "₹85,000";
      let subtitle = "Complete 2-Phase Engineering & Production Hardening";
      const rows: { label: string; value: string }[] = [];

      const lines = body.split("\n");
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;
        if (
          line.toLowerCase().includes("total investment:") ||
          line.toLowerCase().includes("total commercial investment:")
        ) {
          amount = line.split(":")[1]?.trim() || amount;
        } else if (line.toLowerCase().startsWith("**subtitle:**")) {
          subtitle = line.replace(/^\*\*subtitle:\*\*\s*/i, "");
        } else if (line.startsWith("- ") || line.startsWith("* ")) {
          const item = line.replace(/^[-*]\s+/, "");
          const match = item.match(/\*\*([^:]+):\*\*\s*(.*)/);
          if (match) {
            rows.push({ label: match[1].trim(), value: match[2].trim() });
          }
        }
      }

      const rowsHtml = rows
        .map(
          (r) =>
            `<div class="quote-breakdown-row"><span>${r.label}</span> <strong>${r.value}</strong></div>`,
        )
        .join("\n");

      return register(`
<div class="commercial-quote-card">
  <div class="quote-card-left">
    <div class="quote-card-label">TOTAL COMMERCIAL INVESTMENT</div>
    <div class="quote-card-amount">${amount}</div>
    <div class="quote-card-sub">${subtitle}</div>
  </div>
  <div class="quote-card-right">
    ${rowsHtml}
  </div>
</div>
`);
    },
  );

  // 10. Milestones: Phased Payment Schedule
  md = md.replace(
    /(?:^:::\s*milestones(.*?)[\r\n]+([\s\S]*?)^:::\s*$|<Milestones(.*?)>([\s\S]*?)<\/Milestones>)/gm,
    (_match, attrs1, body1, attrs2, body2) => {
      const attrs = attrs1 || attrs2 || "";
      const body = (body1 || body2 || "").trim();
      const titleMatch = attrs.match(/title="([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : "Payment Milestones Schedule";

      const items: string[] = [];
      const lines = body.split("\n");
      let currentItem: { title: string; price: string; desc: string } | null =
        null;

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;
        if (line.startsWith("- ") || line.startsWith("* ")) {
          if (currentItem) {
            items.push(renderMilestoneItem(currentItem));
          }
          const content = line.replace(/^[-*]\s+/, "");
          const parts = content.split("|").map((p: string) => p.trim());
          const mTitle = parts[0]?.replace(/\*\*/g, "") || "";
          const mPrice = parts[1]?.replace(/`/g, "") || "";
          currentItem = { title: mTitle, price: mPrice, desc: "" };
        } else if (currentItem) {
          currentItem.desc = currentItem.desc
            ? `${currentItem.desc} ${line}`
            : line;
        }
      }
      if (currentItem) {
        items.push(renderMilestoneItem(currentItem));
      }

      return register(`
<h3 class="milestones-heading">${title}</h3>
<div class="milestone-timeline">
  ${items.join("\n")}
</div>
`);
    },
  );

  // 11. Callouts
  md = md.replace(
    /(?:^:::\s*(?:callout-amber|policy-amber)\s*$([\s\S]*?)^:::\s*$|<Callout\s+variant="amber">([\s\S]*?)<\/Callout>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").trim();
      return register(`<div class="callout-box-amber">${body}</div>`);
    },
  );
  md = md.replace(
    /(?:^:::\s*callout-green\s*$([\s\S]*?)^:::\s*$|<Callout\s+variant="green">([\s\S]*?)<\/Callout>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").trim();
      return register(`<div class="callout-box-green">${body}</div>`);
    },
  );

  // 12. Sign-off & Client Acceptance
  md = md.replace(
    /(?:^:::\s*signoff\s*$([\s\S]*?)^:::\s*$|<SignOff>([\s\S]*?)<\/SignOff>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").trim();
      let clientName = "LexConnect";
      let investment = "₹85,000 INR (2 Phases)";
      const agencyLines: string[] = [];

      const lines = body.split("\n");
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || (!line.startsWith("- ") && !line.startsWith("* ")))
          continue;
        const content = line.replace(/^[-*]\s+/, "");
        const match = content.match(/\*\*([^:]+):\*\*\s*(.*)/);
        if (match) {
          const key = match[1].trim();
          const val = match[2].trim();
          if (key.toLowerCase() === "client") {
            clientName = val;
          } else if (
            key.toLowerCase() === "total investment" ||
            key.toLowerCase() === "investment"
          ) {
            investment = val;
          } else {
            agencyLines.push(
              `<div class="signoff-line"><strong>${key}:</strong> ${val}</div>`,
            );
          }
        }
      }

      return register(`
<div class="signoff-grid">
  <div class="signoff-card">
    <h4 class="signoff-title">Scalyx</h4>
    ${agencyLines.join("\n    ")}
  </div>
  <div class="signoff-card">
    <h4 class="signoff-title">Proposal Acceptance</h4>
    <div class="signoff-line"><strong>Client:</strong> ${clientName}</div>
    <div class="signoff-line"><strong>Total Agreed Investment:</strong> ${investment}</div>
    <div class="signature-line-box">
      <div class="signature-placeholder">Authorized Signatory & Seal</div>
      <div class="signature-caption">Date: ________________________</div>
    </div>
  </div>
</div>
`);
    },
  );

  return md;
}

/**
 * Translates proposal directives into semantic HTML strings directly.
 */
export function translateProposalMarkdown(rawMd: string): string {
  return preprocessProposalDirectives(rawMd, (html) => html);
}

/**
 * Renders Markdown into a complete, standalone A4-styled Proposal HTML document.
 */
export async function renderProposalHtml(markdown: string): Promise<string> {
  const componentMap = new Map<string, string>();
  let tokenCounter = 0;

  function registerComponent(html: string): string {
    const token = `%%PROPOSAL_COMPONENT_TOKEN_${tokenCounter++}%%`;
    componentMap.set(token, html);
    return `\n\n${token}\n\n`;
  }

  // Pre-process markdown directives and replace with tokens
  const mdWithTokens = preprocessProposalDirectives(
    markdown || "",
    registerComponent,
  );

  const file = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(mdWithTokens);

  let bodyHtml = String(file);

  // Substitute the pristine HTML components back into the Remark output
  componentMap.forEach((html, token) => {
    // In case Remark wraps %%TOKEN%% in a <p>
    const pTokenRegex = new RegExp(`<p>\\s*${token}\\s*<\\/p>`, "g");
    bodyHtml = bodyHtml.replace(pTokenRegex, html);
    bodyHtml = bodyHtml.replace(new RegExp(token, "g"), html);
  });

  // Post-process table styling and code badges
  bodyHtml = bodyHtml
    .replace(/<table>/g, '<table class="proposal-table">')
    .replace(
      /<td><code>([^<]+)<\/code><\/td>/g,
      '<td><span class="tech-chip">$1</span></td>',
    );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Scalyx Proposal & Architectural Blueprint</title>
  <style>
    ${PROPOSAL_STYLESHEET}
  </style>
</head>
<body>
  <div class="proposal-page">
    ${bodyHtml}
  </div>
  <script>
    function notifyHeight() {
      try {
        var body = document.body;
        var doc = document.documentElement;
        var h = Math.max(
          body ? body.scrollHeight : 0,
          doc ? doc.scrollHeight : 0,
          body ? body.offsetHeight : 0,
          doc ? doc.offsetHeight : 0
        );
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: "PROPOSAL_DOCUMENT_HEIGHT", height: h }, "*");
        }
      } catch (e) {}
    }
    window.addEventListener("load", notifyHeight);
    window.addEventListener("resize", notifyHeight);
    if (typeof ResizeObserver !== "undefined" && document.body) {
      new ResizeObserver(notifyHeight).observe(document.body);
    }
    setTimeout(notifyHeight, 50);
    setTimeout(notifyHeight, 250);
    setTimeout(notifyHeight, 800);
  </script>
</body>
</html>`;
}
