import { SCALYX_LOGO_DATA_URI } from "@/lib/email/logo";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export const PROPOSAL_STYLESHEET = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

  *, *:before, *:after {
    box-sizing: border-box !important;
    border-radius: 0px !important;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #f8fafc;
    color: #334155;
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif;
    font-weight: 600 !important;
    color: #0f172a;
    letter-spacing: -0.02em;
  }
  h1 { font-size: 26px; line-height: 1.25; margin: 20px 0 10px; }
  h2 { font-size: 18px; line-height: 1.35; margin: 24px 0 10px; }
  h3 { font-size: 15px; line-height: 1.4; margin: 18px 0 8px; }
  h4 { font-size: 13.5px; line-height: 1.4; margin: 14px 0 6px; }
  strong, b {
    font-weight: 600;
    color: #0f172a;
  }
  p {
    margin: 0 0 12px;
  }
  blockquote, q {
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    font-style: italic;
    border-left: 3px solid #cbd5e1;
    padding-left: 14px;
    margin: 14px 0;
    color: #475569;
  }
  code, pre, kbd, samp, .font-mono {
    font-family: 'Space Grotesk', ui-monospace, SFMono-Regular, Menlo, monospace !important;
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
    font-size: 19px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.02em;
    line-height: 1;
  }
  .proposal-brand-subtitle {
    font-size: 8.5px;
    font-weight: 500;
    letter-spacing: 1px;
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
    font-size: 10.5px;
    font-weight: 600;
    color: #2563eb;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 6px;
  }
  .proposal-main-title {
    font-size: 26px;
    font-weight: 600;
    color: #0f172a;
    letter-spacing: -0.025em;
    line-height: 1.2;
    margin: 0 0 6px;
  }
  .proposal-main-subtitle {
    font-size: 12.5px;
    font-weight: 400;
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
    gap: 12px;
  }
  .proposal-meta-row span {
    color: #64748b;
  }
  .proposal-meta-row strong {
    color: #0f172a;
    font-weight: 600;
    text-align: right;
  }
  .proposal-badge-confidential {
    display: block;
    text-align: center;
    margin-top: 10px;
    padding: 4px 8px;
    background-color: #fef3c7;
    border: 1px solid #fde68a;
    color: #92400e;
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.8px;
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
    padding: 12px 14px;
    border-top: 3px solid #0f172a;
  }
  .border-top-blue { border-top-color: #2563eb !important; }
  .border-top-purple { border-top-color: #7c3aed !important; }
  .border-top-emerald { border-top-color: #059669 !important; }
  .border-top-amber { border-top-color: #d97706 !important; }
  .stat-card-label {
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #64748b;
    margin-bottom: 4px;
  }
  .stat-card-value {
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
    font-family: 'Space Grotesk', ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  .stat-card-desc {
    font-size: 10.5px;
    font-weight: 400;
    color: #64748b;
    margin-top: 4px;
    line-height: 1.35;
  }
  .section-title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 30px 0 14px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f1f5f9;
  }
  .section-number-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    background-color: #eff6ff;
    border: 1px solid #dbeafe;
    color: #2563eb;
    font-weight: 600;
    font-size: 11px;
    font-family: 'Space Grotesk', ui-monospace, monospace;
  }
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    letter-spacing: -0.02em;
    margin: 0;
  }
  .architecture-terminal {
    background-color: #0a0f1d;
    border: 1px solid #1e293b;
    padding: 16px 18px;
    margin: 20px 0;
    color: #f8fafc;
  }
  .architecture-terminal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    margin-bottom: 12px;
    border-bottom: 1px solid #1e293b;
  }
  .terminal-title {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    color: #94a3b8;
  }
  .terminal-badge {
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.6px;
    color: #38bdf8;
    background-color: rgba(56, 189, 248, 0.1);
    border: 1px solid rgba(56, 189, 248, 0.25);
    padding: 2px 7px;
  }
  .pipeline-flow-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font-size: 11.5px;
  }
  .pipeline-node {
    display: inline-block;
    background-color: #1e293b;
    color: #e2e8f0;
    border: 1px solid #334155;
    padding: 5px 9px;
    font-family: 'Space Grotesk', ui-monospace, monospace;
    font-size: 11px;
    font-weight: 500;
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
    font-weight: normal;
    padding: 0 2px;
  }
  .proposal-table {
    width: 100%;
    border-collapse: collapse;
    margin: 18px 0;
    font-size: 12px;
  }
  .proposal-table th {
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
    font-weight: 600;
    color: #0f172a;
    text-align: left;
    font-size: 10.5px;
    letter-spacing: 0.4px;
  }
  .proposal-table td {
    border: 1px solid #e2e8f0;
    padding: 9px 12px;
    color: #334155;
    vertical-align: top;
    line-height: 1.55;
  }
  .table-total-row td {
    background-color: #f8fafc;
    border-top: 2px solid #0f172a;
    font-weight: 600;
  }
  .tech-chip {
    display: inline-block;
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
    padding: 1px 6px;
    font-size: 10.5px;
    font-weight: 500;
    font-family: 'Space Grotesk', ui-monospace, monospace;
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
    padding: 14px 16px;
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
    width: 20px;
    height: 20px;
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #2563eb;
    font-weight: 600;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .feature-card-title {
    font-size: 12.5px;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
  }
  .scale-card-title {
    font-size: 12.5px;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid #f1f5f9;
  }
  .feature-bullets {
    margin: 0;
    padding-left: 16px;
    font-size: 11.5px;
    color: #475569;
    line-height: 1.55;
  }
  .feature-bullets li {
    margin-bottom: 5px;
  }
  .commercial-quote-card {
    background-color: #0f172a;
    color: #ffffff;
    padding: 20px 22px;
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
  }
  .quote-card-label {
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 1.2px;
    color: #94a3b8;
    text-transform: uppercase;
  }
  .quote-card-amount {
    font-size: 28px;
    font-weight: 600;
    color: #ffffff;
    font-family: 'Space Grotesk', ui-monospace, monospace;
    letter-spacing: -0.02em;
    margin: 3px 0 2px;
  }
  .quote-card-sub {
    font-size: 11px;
    font-weight: 400;
    color: #94a3b8;
  }
  .quote-card-right {
    min-width: 250px;
    font-size: 11.5px;
    line-height: 1.65;
    border-left: 1px solid #334155;
    padding-left: 18px;
  }
  .quote-breakdown-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    color: #cbd5e1;
    margin-bottom: 3px;
  }
  .quote-breakdown-row strong {
    color: #ffffff;
    font-weight: 600;
    font-family: 'Space Grotesk', ui-monospace, monospace;
  }
  .milestones-heading {
    font-size: 13.5px;
    font-weight: 600;
    color: #0f172a;
    margin: 22px 0 10px;
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
    font-size: 12px;
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
    font-weight: 600;
  }
  .milestone-price {
    font-family: 'Space Grotesk', ui-monospace, monospace;
    font-weight: 600;
    color: #2563eb;
    font-size: 12px;
  }
  .milestone-desc {
    color: #64748b;
    margin: 0;
    font-size: 11.5px;
    line-height: 1.45;
  }
  .callout-box-amber {
    border: 1px solid #fde68a;
    border-left: 4px solid #d97706;
    background-color: #fffbeb;
    color: #92400e;
    padding: 12px 14px;
    margin: 16px 0;
    font-size: 11.5px;
    line-height: 1.6;
  }
  .callout-box-amber strong {
    color: #78350f;
    font-weight: 600;
  }
  .callout-box-green {
    border: 1px solid #a7f3d0;
    border-left: 4px solid #059669;
    background-color: #ecfdf5;
    color: #065f46;
    padding: 12px 14px;
    margin: 16px 0;
    font-size: 11.5px;
    line-height: 1.6;
  }
  .callout-box-green strong {
    color: #064e3b;
    font-weight: 600;
  }
  .assumptions-list {
    padding-left: 20px;
    font-size: 12px;
    color: #334155;
    line-height: 1.65;
  }
  .assumptions-list li {
    margin-bottom: 6px;
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
    padding: 14px 16px;
    font-size: 11.5px;
  }
  .signoff-title {
    font-size: 12.5px;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid #e2e8f0;
  }
  .signoff-line {
    margin-bottom: 4px;
    color: #475569;
  }
  .signoff-line strong {
    color: #0f172a;
    font-weight: 600;
  }
  .signature-line-box {
    margin-top: 16px;
    padding-top: 10px;
    border-top: 1px dashed #cbd5e1;
  }
  .signature-placeholder {
    font-weight: 500;
    color: #64748b;
    font-style: italic;
    font-size: 11px;
  }
  .signature-caption {
    font-size: 10px;
    color: #94a3b8;
    margin-top: 3px;
  }
  .proposal-running-footer {
    display: flex;
    justify-content: space-between;
    font-size: 9.5px;
    color: #94a3b8;
    border-top: 1px solid #f1f5f9;
    padding-top: 10px;
    margin-top: 22px;
  }
  .page-break {
    border-top: 2px dashed #cbd5e1;
    margin: 32px 0;
    position: relative;
    text-align: center;
    height: 0;
  }
  .page-break-text {
    display: inline-block;
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    color: #94a3b8;
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.6px;
    padding: 2px 10px;
    transform: translateY(-50%);
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
    .page-break-text {
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

/**
 * Clean stat labels and values of stray markdown bold, backticks, or brackets.
 */
function cleanStatText(text: string): string {
  if (!text) return "";
  return text
    .replace(/^[-*•●\s]+/, "")
    .replace(/^\\`|\\`$/g, "")
    .replace(/^`|`$/g, "")
    .replace(/^\*\*|\*\*$/g, "")
    .replace(/^\[|\]$/g, "")
    .replace(/^\\`|\\`$/g, "")
    .replace(/^`|`$/g, "")
    .trim();
}

/**
 * Safely renders inline markdown (converting **bold**, *italic*, `code`, etc.)
 * for text injected into pre-styled directive blocks.
 */
function renderInlineMarkdown(text: string): string {
  if (!text) return "";
  try {
    const rendered = remark()
      .use(remarkGfm)
      .use(remarkHtml, { sanitize: false })
      .processSync(text)
      .toString()
      .trim();
    if (
      rendered.startsWith("<p>") &&
      rendered.endsWith("</p>") &&
      rendered.indexOf("<p>", 3) === -1
    ) {
      return rendered.slice(3, -4);
    }
    return rendered;
  } catch {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.*?)`/g, "<code>$1</code>");
  }
}

function renderMilestoneItem(item: {
  title: string;
  price: string;
  desc: string;
}) {
  const formattedDesc = renderInlineMarkdown(item.desc);
  return `  <div class="milestone-item">
    <div class="milestone-bullet"></div>
    <div class="milestone-content">
      <div class="milestone-title-row">
        <strong>${item.title}</strong>
        ${item.price ? `<span class="milestone-price">${item.price}</span>` : ""}
      </div>
      ${formattedDesc ? `<p class="milestone-desc">${formattedDesc}</p>` : ""}
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

  // 1. Header: supports single-line "::: header", "::: header :::", multiline, or "<Header />"
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

  // 2. Title & Meta Block (fully editable via Markdown headings, key-value pairs, or attributes)
  md = md.replace(
    /(?:^:::\s*title-meta\b([\s\S]*?)(?:^:::|:::\s*$)|<TitleMeta>([\s\S]*?)<\/TitleMeta>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").replace(/:::\s*$/, "").trim();
      let eyebrow = "PROPOSAL & ARCHITECTURAL BLUEPRINT";
      let title = "";
      let subtitle = "";
      let badge = "CONFIDENTIAL";
      const metaRows: { label: string; value: string }[] = [];

      // Check inline attributes on the directive line if any
      const firstLine = body.split("\n")[0] || "";
      const attrTitle = firstLine.match(/title="([^"]+)"/i);
      if (attrTitle) title = attrTitle[1].trim();
      const attrSubtitle = firstLine.match(/subtitle="([^"]+)"/i);
      if (attrSubtitle) subtitle = attrSubtitle[1].trim();
      const attrEyebrow = firstLine.match(/eyebrow="([^"]+)"/i);
      if (attrEyebrow) eyebrow = attrEyebrow[1].trim();
      const attrBadge = firstLine.match(
        /(?:badge|status|confidential)="([^"]+)"/i,
      );
      if (attrBadge) badge = attrBadge[1].trim();

      const lines = body.split("\n");
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        if (line.startsWith("# ")) {
          title = line.replace(/^#\s+/, "").trim();
          continue;
        }
        if (line.startsWith("## ")) {
          subtitle = line.replace(/^##\s+/, "").trim();
          continue;
        }
        if (line.startsWith("### ") || line.startsWith("#### ")) {
          eyebrow = line.replace(/^#{3,4}\s+/, "").trim();
          continue;
        }

        const cleanLine = line.replace(/^[-*•●\s]+/, "");
        // Match Key: Value or **Key:** Value or **Key**: Value
        const kvMatch = cleanLine.match(/^(?:\*\*)?([^:]+?)(?:\*\*)?:\s*(.*)$/);
        if (kvMatch) {
          const key = kvMatch[1].replace(/\*\*/g, "").trim();
          const val = kvMatch[2].replace(/\*\*/g, "").trim();
          const keyLower = key.toLowerCase();

          if (
            keyLower === "title" ||
            keyLower === "project title" ||
            keyLower === "document title"
          ) {
            title = val;
          } else if (keyLower === "subtitle" || keyLower === "sub-title") {
            subtitle = val;
          } else if (keyLower === "eyebrow") {
            eyebrow = val;
          } else if (
            keyLower === "badge" ||
            keyLower === "confidential" ||
            keyLower === "status"
          ) {
            badge = val;
          } else if (keyLower === "client" || keyLower === "prepared for") {
            metaRows.push({ label: "Prepared For", value: val });
          } else {
            metaRows.push({ label: key, value: val });
          }
        } else if (!title && !line.startsWith(":::") && !line.includes("=")) {
          title = cleanLine;
        }
      }

      if (!title) {
        title = "Scalyx Custom Platform Architecture";
      }

      if (metaRows.length === 0) {
        metaRows.push({ label: "Prepared For", value: "LexConnect" });
        metaRows.push({ label: "Date", value: "October 5, 2026" });
        metaRows.push({
          label: "Version",
          value: "v1.0 (Production Blueprint)",
        });
      }

      const metaRowsHtml = metaRows
        .map(
          (row) =>
            `<div class="proposal-meta-row"><span>${row.label}:</span> <strong>${row.value}</strong></div>`,
        )
        .join("\n    ");

      const badgeHtml =
        badge &&
        badge.toLowerCase() !== "none" &&
        badge.toLowerCase() !== "false"
          ? `<span class="proposal-badge-confidential">${badge}</span>`
          : "";

      return register(`
<div class="proposal-title-meta-grid">
  <div>
    <div class="proposal-eyebrow">${eyebrow}</div>
    <h1 class="proposal-main-title">${title}</h1>
    ${subtitle ? `<p class="proposal-main-subtitle">${subtitle}</p>` : ""}
  </div>
  <div class="proposal-meta-card">
    ${metaRowsHtml}
    ${badgeHtml}
  </div>
</div>
`);
    },
  );

  // 3. Four-Column Stat Grid
  md = md.replace(
    /(?:^:::\s*stats\b([\s\S]*?)(?:^:::|:::\s*$)|<Stats>([\s\S]*?)<\/Stats>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").replace(/:::\s*$/, "").trim();
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
        if (!line || !/^[-*•●]/.test(line)) continue;
        const content = line.replace(/^[-*•●\s]+/, "");
        const parts = content.split("|").map((p: string) => p.trim());
        const label = cleanStatText(parts[0] || "");
        const value = cleanStatText(parts[1] || "");
        const desc = renderInlineMarkdown(parts[2] || "");
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

  // 4. Page Break (supports "::: pagebreak ... :::" or "::: page-break" single/multi-line)
  md = md.replace(
    /(?:^:::\s*page-?break\b([\s\S]*?)(?:^:::|:::\s*$)|<PageBreak\s*(?:\/?>|>([\s\S]*?)<\/PageBreak>))/gm,
    (_match, body1, body2) => {
      const raw = (body1 || body2 || "").replace(/:::\s*$/, "").trim();
      const label = raw ? raw : "PAGE BREAK (A4)";
      return `\n\n<div class="page-break"><span class="page-break-text">${label}</span></div>\n\n`;
    },
  );

  // 5. Section Header with Badge
  md = md.replace(
    /(?:^:::\s*section-header\s+num="([^"]+)"\s+title="([^"]+)"\s*(?:\r?\n:::\s*)?|<SectionHeader\s+num="([^"]+)"\s+title="([^"]+)"\s*\/?>)/gm,
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

  // 6. Architecture Terminal Diagram (supports single-line, multiline, inline closing :::)
  md = md.replace(
    /(?:^:::\s*architecture\b([\s\S]*?)(?:^:::|:::\s*$)|<Architecture([\s\S]*?)<\/Architecture>)/gm,
    (_match, body1, body2) => {
      const raw = (body1 || body2 || "").replace(/:::\s*$/, "").trim();
      const titleMatch =
        raw.match(/title="([^"]+)"/i) || raw.match(/title=([^\s]+)/i);
      const badgeMatch =
        raw.match(/badge="([^"]+)"/i) || raw.match(/badge=([^\s]+)/i);
      const title = titleMatch
        ? titleMatch[1]
        : "ENTERPRISE END-TO-END ENCRYPTED DATA PIPELINE";
      const badge = badgeMatch ? badgeMatch[1] : "SIGNAL PROTOCOL E2EE";

      const flowContent = raw
        .replace(/title="[^"]*"/gi, "")
        .replace(/badge="[^"]*"/gi, "")
        .replace(/title=[^\s]*/gi, "")
        .replace(/badge=[^\s]*/gi, "")
        .trim();

      const nodes = flowContent
        .split(/\u2794|->|\u2192|=>/)
        .map((n: string) => n.trim().replace(/^[-*•●\s]+/, ""))
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
    /(?:^:::\s*feature-grid\b([\s\S]*?)(?:^:::|:::\s*$)|<FeatureGrid>([\s\S]*?)<\/FeatureGrid>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").replace(/:::\s*$/, "").trim();
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
          if (/^[-*•●]/.test(trimmed)) {
            const bulletText = trimmed.replace(/^[-*•●\s]+/, "");
            bullets.push(`<li>${renderInlineMarkdown(bulletText)}</li>`);
          }
        }

        cards.push(`
  <div class="feature-card">
    <div class="feature-card-header">
      <span class="feature-letter-badge">${letterBadge}</span>
      <h4 class="feature-card-title">${heading}</h4>
    </div>
    <ul class="feature-bullets">
      ${bullets.join("\n      ")}
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
    /(?:^:::\s*scale-grid\b([\s\S]*?)(?:^:::|:::\s*$)|<ScaleGrid>([\s\S]*?)<\/ScaleGrid>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").replace(/:::\s*$/, "").trim();
      const rawBlocks = body.split(/^###\s+/m).filter(Boolean);
      const cards: string[] = [];

      for (const block of rawBlocks) {
        const lines = block.split("\n");
        const heading = lines[0]?.trim() || "Scale Pillar";
        const contentLines = lines.slice(1);

        const bullets: string[] = [];
        for (const line of contentLines) {
          const trimmed = line.trim();
          if (/^[-*•●]/.test(trimmed)) {
            const bulletText = trimmed.replace(/^[-*•●\s]+/, "");
            bullets.push(`<li>${renderInlineMarkdown(bulletText)}</li>`);
          }
        }

        cards.push(`
  <div class="feature-card">
    <h4 class="scale-card-title">${heading}</h4>
    <ul class="feature-bullets">
      ${bullets.join("\n      ")}
    </ul>
  </div>
`);
      }

      return register(
        `<div class="features-2col-grid">\n${cards.join("\n")}\n</div>\n`,
      );
    },
  );

  // 9. Commercial Quote / Quotation Card
  md = md.replace(
    /(?:^:::\s*(?:quotation|quote-box|quote)\b([\s\S]*?)(?:^:::|:::\s*$)|<(?:QuoteBox|Quotation)([\s\S]*?)<\/(?:QuoteBox|Quotation)>)/gm,
    (_match, body1, body2) => {
      const raw = (body1 || body2 || "").replace(/:::\s*$/, "").trim();
      let amount = "₹85,000";
      let subtitle = "Complete Architecture, MVP & Production Hardening";
      const rows: { label: string; value: string }[] = [];

      const lines = raw.split("\n");
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        // Match amount or total investment
        const amtMatch =
          line.match(
            /(?:total\s*investment|amount)\s*[:=]\s*(?:(?:"([^"]+)")|(?:\x27([^\x27]+)\x27)|([^\n\r]+?)(?=\s+subtitle|\s*$))/i,
          ) || line.match(/\*\*Total\s+Investment:\*\*\s*(.*)/i);
        if (amtMatch) {
          const val = (
            amtMatch[1] ||
            amtMatch[2] ||
            amtMatch[3] ||
            ""
          )
            .replace(/\*\*/g, "")
            .trim();
          if (val) amount = val;
        }

        // Match subtitle
        const subMatch =
          line.match(
            /subtitle\s*[:=]\s*(?:(?:"([^"]+)")|(?:\x27([^\x27]+)\x27)|([^\n\r]+))/i,
          ) || line.match(/\*\*Subtitle:\*\*\s*(.*)/i);
        if (subMatch) {
          const val = (
            subMatch[1] ||
            subMatch[2] ||
            subMatch[3] ||
            ""
          )
            .replace(/\*\*/g, "")
            .trim();
          if (val) subtitle = val;
        }

        // Check for bullet row (e.g. • or - or * or ●)
        const isBullet =
          /^[\u2022\u25cf]/.test(line) || /^[-*]\s+/.test(line);
        if (isBullet) {
          const cleanLine = line
            .replace(/^[\u2022\u25cf\-\*]+\s*/, "")
            .replace(/\*\*/g, "")
            .trim();

          if (
            /^total\s+investment/i.test(cleanLine) ||
            /^subtitle/i.test(cleanLine)
          ) {
            continue;
          }

          if (cleanLine.includes("|")) {
            const parts = cleanLine.split("|").map((p: string) => p.trim());
            rows.push({ label: parts[0], value: parts[1] || "" });
          } else {
            const colonIdx = cleanLine.lastIndexOf(":");
            if (colonIdx !== -1) {
              rows.push({
                label: cleanLine.slice(0, colonIdx).trim(),
                value: cleanLine.slice(colonIdx + 1).trim(),
              });
            } else {
              rows.push({ label: cleanLine, value: "" });
            }
          }
        }
      }

      const rowsHtml = rows
        .map(
          (r) =>
            `<div class="quote-breakdown-row"><span>${r.label}</span><strong>${r.value}</strong></div>`,
        )
        .join("\n    ");

      return register(`
<div class="commercial-quote-card">
  <div>
    <div class="quote-card-label">TOTAL PROJECT INVESTMENT</div>
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

  // 10. Payment Milestones Timeline
  md = md.replace(
    /(?:^:::\s*milestones\b([\s\S]*?)(?:^:::|:::\s*$)|<Milestones([\s\S]*?)<\/Milestones>)/gm,
    (_match, body1, body2) => {
      const raw = (body1 || body2 || "").replace(/:::\s*$/, "").trim();
      const titleMatch = raw.match(/title="([^"]+)"/i) || raw.match(/title=([^\\n]+)/i);
      const title = titleMatch ? titleMatch[1].trim() : "Payment Milestones Schedule";

      const contentWithoutTitle = raw
        .replace(/title="[^"]*"/gi, "")
        .replace(/title=[^\\n]*/gi, "")
        .trim();

      const items: string[] = [];
      const lines = contentWithoutTitle.split("\n");
      let currentItem: { title: string; price: string; desc: string } | null =
        null;

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;
        if (/^[-*•●]/.test(line)) {
          if (currentItem) {
            items.push(renderMilestoneItem(currentItem));
          }
          const content = line.replace(/^[-*•●\s]+/, "");
          const parts = content.split("|").map((p: string) => p.trim());
          const mTitle = parts[0]?.replace(/\*\*/g, "") || "";
          const mPrice = parts[1]?.replace(/\\?`/g, "") || "";
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

  // 11. Callouts (Amber / Green / Info) - with Markdown parsing!
  md = md.replace(
    /(?:^:::\s*(?:callout-green|callout-emerald)\b([\s\S]*?)(?:^:::|:::\s*$)|<Callout\s+variant="green">([\s\S]*?)<\/Callout>)/gm,
    (_match, body1, body2) => {
      const raw = (body1 || body2 || "").replace(/:::\s*$/, "").trim();
      return register(`<div class="callout-box-green">${renderInlineMarkdown(raw)}</div>`);
    },
  );
  md = md.replace(
    /(?:^:::\s*(?:callout-amber|policy-amber|callout-warning)\b([\s\S]*?)(?:^:::|:::\s*$)|<Callout\s+variant="amber">([\s\S]*?)<\/Callout>)/gm,
    (_match, body1, body2) => {
      const raw = (body1 || body2 || "").replace(/:::\s*$/, "").trim();
      return register(`<div class="callout-box-amber">${renderInlineMarkdown(raw)}</div>`);
    },
  );

  // 12. Sign-off & Client Acceptance
  md = md.replace(
    /(?:^:::\s*signoff\b([\s\S]*?)(?:^:::|:::\s*$)|<SignOff>([\s\S]*?)<\/SignOff>)/gm,
    (_match, body1, body2) => {
      const body = (body1 || body2 || "").replace(/:::\s*$/, "").trim();
      let clientName = "LexConnect";
      let investment = "₹85,000 INR (2 Phases)";
      const agencyLines: string[] = [];

      const lines = body.split("\n");
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line || !/^[-*•●]/.test(line)) continue;
        const content = line.replace(/^[-*•●\s]+/, "");
        const match = content.match(/\*\*([^:]+):\*\*\s*(.*)/i);
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
    ${agencyLines.join("\n    ")}
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
    /(?:^:::\s*footer\b[^\n]*(?:\r?\n:::\s*)?|<Footer\s*\/?>)/gm,
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

  // Automatically style numbered section headers like "## [01] Executive Summary"
  bodyHtml = bodyHtml.replace(
    /<h2>\s*\[(\d+)\]\s*(.*?)<\/h2>/g,
    '<div class="section-title-wrap"><span class="section-number-badge">$1</span><h2 class="section-title">$2</h2></div>',
  );

  // Post-process table styling and code badges
  bodyHtml = bodyHtml
    .replace(/<table>/g, '<table class="proposal-table">')
    .replace(
      /<td><code>([^<]+)<\/code><\/td>/g,
      '<td><span class="tech-chip">$1</span></td>',
    )
    .replace(
      /<td>\\`([^<]+)\\`<\/td>/g,
      '<td><span class="tech-chip">$1</span></td>',
    )
    .replace(
      /<td>`([^<]+)`<\/td>/g,
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
