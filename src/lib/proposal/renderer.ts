import { SCALYX_LOGO_DATA_URI } from "@/lib/email/logo";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export const PROPOSAL_STYLESHEET = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

  *, *:before, *:after {
    box-sizing: border-box !important;
    border-radius: 0px !important;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #f8fafc;
    color: #1e293b;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 13.5px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  blockquote, q {
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    font-style: italic;
  }
  code, pre, kbd, samp, .font-mono {
    font-family: 'Space Grotesk', ui-monospace, SFMono-Regular, Menlo, monospace !important;
  }
  .proposal-page {
    width: 100%;\n    max-width: 840px;\n    margin: 0 auto;\n    background: #ffffff;\n    padding: 44px 48px;\n    box-sizing: border-box;\n    border: 1px solid #e2e8f0;\n    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);\n  }
  .proposal-header {
    display: flex;\n    justify-content: space-between;\n    align-items: flex-start;\n    padding-bottom: 16px;\n    border-bottom: 1px solid #e2e8f0;\n    margin-bottom: 24px;\n  }
  .proposal-header-left {
    display: flex;\n    align-items: center;\n    gap: 12px;\n  }
  .proposal-logo-img {
    width: 44px;\n    height: 44px;\n    object-fit: contain;\n    display: block;\n    border-radius: 0px !important;\n  }
  .proposal-brand-title {
    font-size: 20px;\n    font-weight: 900;\n    color: #0f172a;\n    letter-spacing: -0.5px;\n    line-height: 1;\n  }
  .proposal-brand-subtitle {
    font-size: 9px;\n    font-weight: 700;\n    letter-spacing: 1.2px;\n    color: #64748b;\n    text-transform: uppercase;\n    margin-top: 3px;\n  }
  .proposal-header-right {
    text-align: right;\n    font-size: 11px;\n    color: #475569;\n    line-height: 1.5;\n  }
  .proposal-header-right .text-muted {
    color: #94a3b8;\n  }
  .proposal-title-meta-grid {
    display: flex;\n    justify-content: space-between;\n    align-items: flex-start;\n    gap: 24px;\n    margin: 24px 0 28px;\n  }
  .proposal-eyebrow {
    font-size: 11px;\n    font-weight: 800;\n    color: #2563eb;\n    text-transform: uppercase;\n    letter-spacing: 1px;\n    margin-bottom: 6px;\n  }
  .proposal-main-title {
    font-size: 32px;\n    font-weight: 900;\n    color: #0f172a;\n    letter-spacing: -1px;\n    line-height: 1.1;\n    margin: 0 0 6px;\n  }
  .proposal-main-subtitle {
    font-size: 13px;\n    color: #475569;\n    max-width: 440px;\n    line-height: 1.5;\n  }
  .proposal-meta-card {
    border: 1px solid #e2e8f0;\n    background-color: #f8fafc;\n    padding: 14px 18px;\n    min-width: 220px;\n    font-size: 11.5px;\n  }
  .proposal-meta-row {
    display: flex;\n    justify-content: space-between;\n    margin-bottom: 4px;\n    color: #475569;\n  }
  .proposal-meta-row strong {
    color: #0f172a;\n  }
  .proposal-badge-confidential {
    display: block;\n    text-align: center;\n    margin-top: 10px;\n    padding: 4px 8px;\n    background-color: #fef3c7;\n    border: 1px solid #fde68a;\n    color: #92400e;\n    font-size: 10px;\n    font-weight: 800;\n    letter-spacing: 1px;\n    text-transform: uppercase;\n  }
  .stat-grid-4 {
    display: grid;\n    grid-template-columns: repeat(4, 1fr);\n    gap: 12px;\n    margin: 24px 0;\n  }
  .stat-card {
    border: 1px solid #e2e8f0;\n    background-color: #ffffff;\n    padding: 14px;\n    border-top: 3px solid #0f172a;\n  }
  .border-top-blue { border-top-color: #2563eb !important; }
  .border-top-purple { border-top-color: #7c3aed !important; }
  .border-top-emerald { border-top-color: #059669 !important; }
  .border-top-amber { border-top-color: #d97706 !important; }
  .stat-card-label {
    font-size: 9.5px;\n    font-weight: 800;\n    text-transform: uppercase;\n    letter-spacing: 0.8px;\n    color: #64748b;\n    margin-bottom: 4px;\n  }
  .stat-card-value {
    font-size: 20px;\n    font-weight: 900;\n    color: #0f172a;\n    font-family: 'Space Grotesk', ui-monospace, SFMono-Regular, Menlo, monospace;\n    letter-spacing: -0.5px;\n    line-height: 1.15;\n  }
  .stat-card-desc {
    font-size: 11px;\n    color: #64748b;\n    margin-top: 4px;\n    line-height: 1.35;\n  }
  .section-title-wrap {
    display: flex;\n    align-items: center;\n    gap: 10px;\n    margin: 32px 0 14px;\n    padding-bottom: 8px;\n    border-bottom: 1px solid #f1f5f9;\n  }
  .section-number-badge {
    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    width: 28px;\n    height: 28px;\n    background-color: #eff6ff;\n    border: 1px solid #dbeafe;\n    color: #2563eb;\n    font-weight: 800;\n    font-size: 12px;\n    font-family: 'Space Grotesk', ui-monospace, monospace;\n  }
  .section-title {
    font-size: 18px;\n    font-weight: 800;\n    color: #0f172a;\n    letter-spacing: -0.4px;\n    margin: 0;\n  }
  .architecture-terminal {
    background-color: #0a0f1d;\n    border: 1px solid #1e293b;\n    padding: 18px 20px;\n    margin: 20px 0;\n    color: #f8fafc;\n  }
  .architecture-terminal-header {
    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding-bottom: 12px;\n    margin-bottom: 14px;\n    border-bottom: 1px solid #1e293b;\n  }
  .terminal-title {
    font-size: 11px;\n    font-weight: 800;\n    letter-spacing: 1.5px;\n    color: #94a3b8;\n  }
  .terminal-badge {
    font-size: 10px;\n    font-weight: 800;\n    letter-spacing: 1px;\n    color: #38bdf8;\n    background-color: rgba(56, 189, 248, 0.1);\n    border: 1px solid rgba(56, 189, 248, 0.25);\n    padding: 2px 8px;\n  }
  .pipeline-flow-wrapper {
    display: flex;\n    flex-wrap: wrap;\n    align-items: center;\n    gap: 8px;\n    font-size: 12px;\n  }
  .pipeline-node {
    display: inline-block;\n    background-color: #1e293b;\n    color: #e2e8f0;\n    border: 1px solid #334155;\n    padding: 6px 10px;\n    font-family: 'Space Grotesk', ui-monospace, monospace;\n    font-size: 11.5px;\n  }
  .node-primary {
    background-color: #1e3a8a;\n    border-color: #2563eb;\n    color: #ffffff;\n  }
  .node-accent {
    background-color: #1e1b4b;\n    border-color: #6366f1;\n    color: #c7d2fe;\n  }
  .node-warning {
    background-color: #451a03;\n    border-color: #b45309;\n    color: #fde68a;\n  }
  .pipeline-arrow {
    color: #38bdf8;\n    font-weight: bold;\n    padding: 0 2px;\n  }
  .proposal-table {
    width: 100%;\n    border-collapse: collapse;\n    margin: 18px 0;\n    font-size: 12.5px;\n  }
  .proposal-table th {
    background-color: #f8fafc;\n    border: 1px solid #e2e8f0;\n    padding: 9px 12px;\n    font-weight: 800;\n    color: #0f172a;\n    text-align: left;\n    font-size: 11px;\n    letter-spacing: 0.5px;\n  }
  .proposal-table td {
    border: 1px solid #e2e8f0;\n    padding: 10px 12px;\n    color: #334155;\n    vertical-align: top;\n    line-height: 1.55;\n  }
  .table-total-row td {
    background-color: #f8fafc;\n    border-top: 2px solid #0f172a;\n  }
  .tech-chip {
    display: inline-block;\n    background-color: #eff6ff;\n    border: 1px solid #bfdbfe;\n    color: #1d4ed8;\n    padding: 2px 7px;\n    font-size: 11px;\n    font-weight: 700;\n    font-family: 'Space Grotesk', ui-monospace, monospace;\n  }
  .features-2col-grid {
    display: grid;\n    grid-template-columns: repeat(2, 1fr);\n    gap: 14px;\n    margin: 16px 0;\n  }
  .feature-card {
    border: 1px solid #e2e8f0;\n    background-color: #ffffff;\n    padding: 16px;\n  }
  .feature-card-header {
    display: flex;\n    align-items: center;\n    gap: 8px;\n    margin-bottom: 10px;\n    padding-bottom: 8px;\n    border-bottom: 1px solid #f1f5f9;\n  }
  .feature-letter-badge {
    width: 22px;\n    height: 22px;\n    background-color: #eff6ff;\n    border: 1px solid #bfdbfe;\n    color: #2563eb;\n    font-weight: 800;\n    font-size: 11px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }
  .feature-card-title {
    font-size: 13.5px;\n    font-weight: 800;\n    color: #0f172a;\n    margin: 0;\n  }
  .scale-card-title {
    font-size: 13px;\n    font-weight: 800;\n    color: #0f172a;\n    margin: 0 0 8px;\n    padding-bottom: 6px;\n    border-bottom: 1px solid #f1f5f9;\n  }
  .feature-bullets {
    margin: 0;\n    padding-left: 18px;\n    font-size: 12px;\n    color: #475569;\n    line-height: 1.6;\n  }
  .feature-bullets li {
    margin-bottom: 5px;\n  }
  .commercial-quote-card {
    background-color: #0f172a;\n    color: #ffffff;\n    padding: 22px 24px;\n    margin: 20px 0;\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 24px;\n  }
  .quote-card-label {
    font-size: 10px;\n    font-weight: 800;\n    letter-spacing: 1.5px;\n    color: #94a3b8;\n    text-transform: uppercase;\n  }
  .quote-card-amount {
    font-size: 34px;\n    font-weight: 900;\n    color: #ffffff;\n    font-family: 'Space Grotesk', ui-monospace, monospace;\n    letter-spacing: -1px;\n    margin: 4px 0 2px;\n  }
  .quote-card-sub {
    font-size: 11.5px;\n    color: #94a3b8;\n  }
  .quote-card-right {
    min-width: 250px;\n    font-size: 12px;\n    line-height: 1.7;\n    border-left: 1px solid #334155;\n    padding-left: 20px;\n  }
  .quote-breakdown-row {
    display: flex;\n    justify-content: space-between;\n    gap: 12px;\n    color: #cbd5e1;\n  }
  .quote-breakdown-row strong {
    color: #ffffff;\n    font-family: 'Space Grotesk', ui-monospace, monospace;\n  }
  .milestones-heading {
    font-size: 14.5px;\n    font-weight: 800;\n    color: #0f172a;\n    margin: 22px 0 12px;\n  }
  .milestone-timeline {
    border-left: 2px solid #e2e8f0;\n    padding-left: 18px;\n    margin: 14px 0 18px 8px;\n  }
  .milestone-item {
    position: relative;\n    margin-bottom: 14px;\n  }
  .milestone-bullet {
    position: absolute;\n    left: -25px;\n    top: 3px;\n    width: 12px;\n    height: 12px;\n    background-color: #ffffff;\n    border: 2px solid #2563eb;\n  }
  .milestone-content {
    font-size: 12.5px;\n  }
  .milestone-title-row {
    display: flex;\n    justify-content: space-between;\n    align-items: baseline;\n    gap: 12px;\n    margin-bottom: 2px;\n  }
  .milestone-title-row strong {
    color: #0f172a;\n  }
  .milestone-price {
    font-family: 'Space Grotesk', ui-monospace, monospace;\n    font-weight: 800;\n    color: #2563eb;\n    font-size: 13px;\n  }
  .milestone-desc {
    color: #64748b;\n    margin: 0;\n    font-size: 12px;\n    line-height: 1.45;\n  }
  .callout-box-amber {
    border: 1px solid #fde68a;\n    border-left: 4px solid #d97706;\n    background-color: #fffbeb;\n    color: #92400e;\n    padding: 14px 16px;\n    margin: 18px 0;\n    font-size: 12.5px;\n    line-height: 1.6;\n  }
  .callout-box-green {
    border: 1px solid #a7f3d0;\n    border-left: 4px solid #059669;\n    background-color: #ecfdf5;\n    color: #065f46;\n    padding: 14px 16px;\n    margin: 18px 0;\n    font-size: 12.5px;\n    line-height: 1.6;\n  }
  .assumptions-list {
    padding-left: 20px;\n    font-size: 12.5px;\n    color: #334155;\n    line-height: 1.65;\n  }
  .assumptions-list li {
    margin-bottom: 8px;\n  }
  .signoff-grid {
    display: grid;\n    grid-template-columns: repeat(2, 1fr);\n    gap: 16px;\n    margin: 22px 0;\n  }
  .signoff-card {
    border: 1px solid #e2e8f0;\n    background-color: #f8fafc;\n    padding: 16px 18px;\n    font-size: 12px;\n  }
  .signoff-title {
    font-size: 13.5px;\n    font-weight: 800;\n    color: #0f172a;\n    margin: 0 0 10px;\n    padding-bottom: 6px;\n    border-bottom: 1px solid #e2e8f0;\n  }
  .signoff-line {
    margin-bottom: 5px;\n    color: #475569;\n  }
  .signoff-line strong {
    color: #0f172a;\n  }
  .signature-line-box {
    margin-top: 18px;\n    padding-top: 12px;\n    border-top: 1px dashed #cbd5e1;\n  }
  .signature-placeholder {
    font-weight: 700;\n    color: #64748b;\n    font-style: italic;\n    font-size: 11.5px;\n  }
  .signature-caption {
    font-size: 11px;\n    color: #94a3b8;\n    margin-top: 4px;\n  }
  .proposal-running-footer {
    display: flex;\n    justify-content: space-between;\n    font-size: 10px;\n    color: #94a3b8;\n    border-top: 1px solid #f1f5f9;\n    padding-top: 12px;\n    margin-top: 24px;\n  }
  .page-break {
    border-top: 2px dashed #cbd5e1;\n    margin: 36px -48px 36px;\n    position: relative;\n  }
  .page-break:after {
    content: "PAGE BREAK (A4)";\n    position: absolute;\n    right: 48px;\n    top: -9px;\n    background-color: #f1f5f9;\n    padding: 0 8px;\n    font-size: 9px;\n    font-weight: 800;\n    color: #94a3b8;\n    letter-spacing: 0.8px;\n  }

  /* Print specific formatting */
  @media print {
    @page {
      size: A4 portrait;\n      margin: 12mm 15mm;\n    }
    body {
      background: #ffffff !important;\n      color: #000000 !important;\n    }
    .proposal-page {
      border: none !important;\n      box-shadow: none !important;\n      padding: 0 !important;\n      max-width: 100% !important;\n    }
    .page-break {
      border: none !important;\n      margin: 0 !important;\n      page-break-before: always !important;\n      break-before: page !important;\n      height: 0 !important;\n    }
    .page-break:after {
      display: none !important;\n    }
    .architecture-terminal {
      -webkit-print-color-adjust: exact !important;\n      print-color-adjust: exact !important;\n    }
    .commercial-quote-card {
      -webkit-print-color-adjust: exact !important;\n      print-color-adjust: exact !important;\n    }
  }

  @media screen and (max-width: 680px) {
    .proposal-page {
      padding: 24px 16px;\n    }
    .stat-grid-4 {
      grid-template-columns: repeat(2, 1fr);\n    }
    .features-2col-grid, .signoff-grid, .proposal-title-meta-grid {
      grid-template-columns: 1fr;\n      flex-direction: column;\n    }
    .commercial-quote-card {
      flex-direction: column;\n      align-items: flex-start;\n    }
    .quote-card-right {
      border-left: none;\n      border-top: 1px solid #334155;\n      padding-left: 0;\n      padding-top: 14px;\n      width: 100%;\n    }
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

  // 2. Title & Meta Block
  md = md.replace(
    /(?:^:::\s*title-meta\s*$([\s\S]*?)^:::\s*$|<TitleMeta>([\s\S]*?)<\/TitleMeta>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").trim();
      let eyebrow = "PROPOSAL & ARCHITECTURAL BLUEPRINT";
      let title = "Scalyx Custom Platform Architecture";
      let subtitle = "";
      let client = "LexConnect";
      let date = "March 2026";
      let version = "v1.0 (Production Blueprint)";

      const lines = body.split("\n");
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || (!line.startsWith("- ") && !line.startsWith("* ")))
          continue;
        const content = line.replace(/^[-*]\s+/, "");
        const match = content.match(/\*\*([^:]+):\*\*\s*(.*)/);
        if (match) {
          const key = match[1].trim().toLowerCase();
          const val = match[2].trim();
          if (key === "eyebrow") eyebrow = val;
          else if (key === "title") title = val;
          else if (key === "subtitle") subtitle = val;
          else if (key === "client") client = val;
          else if (key === "date") date = val;
          else if (key === "version") version = val;
        }
      }

      return register(`
<div class="proposal-title-meta-grid">
  <div>
    <div class="proposal-eyebrow">${eyebrow}</div>
    <h1 class="proposal-main-title">${title}</h1>
    ${subtitle ? `<p class="proposal-main-subtitle">${subtitle}</p>` : ""}
  </div>
  <div class="proposal-meta-card">
    <div class="proposal-meta-row"><span>Prepared For:</span> <strong>${client}</strong></div>
    <div class="proposal-meta-row"><span>Date:</span> <strong>${date}</strong></div>
    <div class="proposal-meta-row"><span>Version:</span> <strong>${version}</strong></div>
    <span class="proposal-badge-confidential">CONFIDENTIAL</span>
  </div>
</div>
`);
    },
  );

  // 3. Four-Column Stat Grid
  md = md.replace(
    /(?:^:::\s*stats\s*$([\s\S]*?)^:::\s*$|<Stats>([\s\S]*?)<\/Stats>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").trim();
      const lines = body.split("\n");
      const cards: string[] = [];
      const borderColors = [
        "border-top-blue",
        "border-top-purple",
        "border-top-emerald",
        "border-top-amber",
      ];

      let cardIdx = 0;
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || (!line.startsWith("- ") && !line.startsWith("* ")))
          continue;
        const content = line.replace(/^[-*]\s+/, "");
        const parts = content.split("|").map((p: string) => p.trim());
        const label = parts[0] || "";
        const value = parts[1] || "";
        const desc = parts[2] || "";
        const borderColor = borderColors[cardIdx % borderColors.length];
        cardIdx++;

        cards.push(`
  <div class="stat-card ${borderColor}">
    <div class="stat-card-label">${label}</div>
    <div class="stat-card-value">${value}</div>
    ${desc ? `<div class="stat-card-desc">${desc}</div>` : ""}
  </div>
`);
      }

      return register(
        `<div class="stat-grid-4">\n${cards.join("\n")}\n</div>\n`,
      );
    },
  );

  // 4. Page Break
  md = md.replace(
    /(?:^:::\s*page-break\s*$|<PageBreak\s*\/?>)/gm,
    () => `\n\n<div class="page-break"></div>\n\n`,
  );

  // 5. Section Header with Badge
  md = md.replace(
    /(?:^:::\s*section-header\s+num="([^"]+)"\s+title="([^"]+)"\s*$|<SectionHeader\s+num="([^"]+)"\s+title="([^"]+)"\s*\/?>)/gm,
    (_match, num1, title1, num2, title2) => {
      const num = num1 || num2 || "01";
      const title = title1 || title2 || "Section";
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
    /(?:^:::\s*architecture(.*?)[\\r\\n]+([\s\S]*?)^:::\s*$|<Architecture(.*?)>([\s\S]*?)<\/Architecture>)/gm,
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
      const rawBlocks = body.split(/^###\s+/m).filter(Boolean);
      const cards: string[] = [];

      let badgeLetterIdx = 0;
      for (const block of rawBlocks) {
        const lines = block.split("\n");
        const heading = lines[0]?.trim() || "Feature";
        const contentLines = lines.slice(1);
        const letterBadge = String.fromCharCode(65 + badgeLetterIdx++);

        const bullets: string[] = [];
        for (const line of contentLines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            bullets.push(
              `<li>${trimmed
                .replace(/^[-*]\s+/, "")
                .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")}</li>`,
            );
          }
        }

        cards.push(`
  <div class="feature-card">
    <div class="feature-card-header">
      <span class="feature-letter-badge">${letterBadge}</span>
      <h4 class="feature-card-title">${heading}</h4>
    </div>
    <ul class="feature-bullets">
      ${bullets.join("\n")}
    </ul>
  </div>
`);
      }

      return register(
        `<div class="features-2col-grid">\n${cards.join("\n")}\n</div>\n`,
      );
    },
  );

  // 8. Scale Grid: 2-Column Architecture Pillars
  md = md.replace(
    /(?:^:::\s*scale-grid\s*$([\s\S]*?)^:::\s*$|<ScaleGrid>([\s\S]*?)<\/ScaleGrid>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").trim();
      const rawBlocks = body.split(/^###\s+/m).filter(Boolean);
      const cards: string[] = [];

      for (const block of rawBlocks) {
        const lines = block.split("\n");
        const heading = lines[0]?.trim() || "Scale Pillar";
        const contentLines = lines.slice(1);

        const bullets: string[] = [];
        for (const line of contentLines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            bullets.push(
              `<li>${trimmed
                .replace(/^[-*]\s+/, "")
                .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")}</li>`,
            );
          }
        }

        cards.push(`
  <div class="feature-card">
    <h4 class="scale-card-title">${heading}</h4>
    <ul class="feature-bullets">
      ${bullets.join("\n")}
    </ul>
  </div>
`);
      }

      return register(
        `<div class="features-2col-grid">\n${cards.join("\n")}\n</div>\n`,
      );
    },
  );

  // 9. Commercial Quote Highlight Box
  md = md.replace(
    /(?:^:::\s*quote-box(.*?)[\\r\\n]+([\s\S]*?)^:::\s*$|<QuoteBox(.*?)>([\s\S]*?)<\/QuoteBox>)/gm,
    (_match, attrs1, body1, attrs2, body2) => {
      const attrs = attrs1 || attrs2 || "";
      const body = (body1 || body2 || "").trim();
      const amountMatch = attrs.match(/amount="([^"]+)"/);
      const subMatch = attrs.match(/subtitle="([^"]+)"/);
      const amount = amountMatch ? amountMatch[1] : "₹85,000 INR";
      const subtitle = subMatch
        ? subMatch[1]
        : "Complete Architecture, MVP & Production Hardening";

      const rows: string[] = [];
      const lines = body.split("\n");
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || (!line.startsWith("- ") && !line.startsWith("* ")))
          continue;
        const content = line.replace(/^[-*]\s+/, "");
        const parts = content.split("|").map((p: string) => p.trim());
        if (parts.length >= 2) {
          rows.push(
            `<div class="quote-breakdown-row"><span>${parts[0]}</span><strong>${parts[1]}</strong></div>`,
          );
        }
      }

      return register(`
<div class="commercial-quote-card">
  <div>
    <div class="quote-card-label">TOTAL PROJECT INVESTMENT</div>
    <div class="quote-card-amount">${amount}</div>
    <div class="quote-card-sub">${subtitle}</div>
  </div>
  <div class="quote-card-right">
    ${rows.join("\n")}
  </div>
</div>
`);
    },
  );

  // 10. Payment Milestones Timeline
  md = md.replace(
    /(?:^:::\s*milestones(.*?)[\\r\\n]+([\s\S]*?)^:::\s*$|<Milestones(.*?)>([\s\S]*?)<\/Milestones>)/gm,
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
          } else if (key.toLowerCase().includes("investment")) {
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
    <div class="signoff-title">Client Acceptance</div>
    <div class="signoff-line"><strong>Authorized Client:</strong> ${clientName}</div>
    <div class="signoff-line"><strong>Agreed Scope:</strong> Full Technical Proposal & Blueprint</div>
    <div class="signoff-line"><strong>Total Investment:</strong> ${investment}</div>
    <div class="signature-line-box">
      <div class="signature-placeholder">[ Sign & Confirm Acceptance ]</div>
      <div class="signature-caption">Signature / Digital Confirmation</div>
    </div>
  </div>

  <div class="signoff-card">
    <div class="signoff-title">Scalyx Digital Execution Team</div>
    ${agencyLines.join("\n")}
    <div class="signature-line-box">
      <div class="signature-placeholder">Scalyx Enterprise Delivery & Engineering</div>
      <div class="signature-caption">Signature & Project Stamp</div>
    </div>
  </div>
</div>
`);
    },
  );

  // 13. Running Footer
  md = md.replace(
    /(?:^:::\s*footer\s*$|<Footer\s*\/?>)/gm,
    () => `
<div class="proposal-running-footer">
  <span>Scalyx Architectural Blueprint & Engineering Proposal &bull; Confidential</span>
  <span>Page Fit: A4 Standard &bull; scalyx.in</span>
</div>
`,
  );

  return md;
}

/**
 * Strips raw custom directives for preview or safe export
 */
export function stripDirectives(rawMd: string): string {
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
