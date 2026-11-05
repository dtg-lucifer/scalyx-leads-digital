import { ContractBlock } from "./types";
import { SCALYX_LOGO_DATA_URI } from "@/lib/branding";

export function renderContractHtml(blocks: ContractBlock[]): string {
  let contentHtml = "";

  for (const block of blocks) {
    switch (block.type) {
      case "contract_header": {
        contentHtml += `
<header class="contract-header">
  <div class="contract-brand-col">
    <div class="contract-logo-wrapper">
      <img src="/assets/scalyx_dark.png" alt="${escapeHtml(block.brandName)}" class="contract-logo" onerror="this.onerror=null;this.src='${SCALYX_LOGO_DATA_URI}';" />
      <div class="contract-brand-meta">
        <h1 class="contract-brand-title">${escapeHtml(block.brandName)}</h1>
        ${block.brandSubtitle ? `<p class="contract-brand-subtitle">${escapeHtml(block.brandSubtitle)}</p>` : ""}
      </div>
    </div>
  </div>
  <div class="contract-meta-col">
    <div class="contract-ref-badge">CONTRACT AGREEMENT</div>
    <div class="contract-meta-line"><strong>REF:</strong> ${escapeHtml(block.referenceNo)}</div>
    <div class="contract-meta-line"><strong>DATE:</strong> ${escapeHtml(block.agreementDate)}</div>
    <div class="contract-meta-line"><strong>WEB:</strong> ${escapeHtml(block.website)}</div>
    <div class="contract-meta-line"><strong>EMAIL:</strong> ${escapeHtml(block.email)}</div>
  </div>
</header>
<div class="contract-hairline-rule"></div>
`;
        break;
      }

      case "contract_parties": {
        contentHtml += `
<section class="contract-parties-section">
  <div class="contract-party-card">
    <div class="contract-party-label">SERVICE PROVIDER</div>
    <div class="contract-party-name">${escapeHtml(block.providerName)}</div>
    <div class="contract-party-entity">${escapeHtml(block.providerEntity)}</div>
    <div class="contract-party-detail">${escapeHtml(block.providerAddress)}</div>
    <div class="contract-party-detail"><strong>Signatory:</strong> ${escapeHtml(block.providerSignatory)} (${escapeHtml(block.providerSignatoryTitle)})</div>
    <div class="contract-party-detail"><strong>Contact:</strong> ${escapeHtml(block.providerEmail)}</div>
  </div>

  <div class="contract-party-card">
    <div class="contract-party-label">CLIENT (COUNTERPARTY)</div>
    <div class="contract-party-name">${escapeHtml(block.clientName)}</div>
    <div class="contract-party-entity">${escapeHtml(block.clientCompany)}</div>
    <div class="contract-party-detail">${escapeHtml(block.clientAddress)}</div>
    <div class="contract-party-detail"><strong>Authorized Rep:</strong> ${escapeHtml(block.clientName)} (${escapeHtml(block.clientSignatoryTitle)})</div>
    <div class="contract-party-detail"><strong>Contact:</strong> ${escapeHtml(block.clientEmail)} &bull; ${escapeHtml(block.clientPhone)}</div>
  </div>
</section>
`;
        break;
      }

      case "contract_preamble": {
        const paragraphs = block.body.split("\n\n").filter(Boolean);
        contentHtml += `
<section class="contract-preamble-section">
  <h2 class="contract-document-title">${escapeHtml(block.title)}</h2>
  <div class="contract-effective-bar">EFFECTIVE DATE: ${escapeHtml(block.effectiveDate)}</div>
  <div class="contract-preamble-body">
    ${paragraphs.map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`).join("")}
  </div>
</section>
`;
        break;
      }

      case "contract_clause": {
        contentHtml += `
<section class="contract-clause-section">
  <div class="contract-clause-header">
    <span class="contract-clause-num">${escapeHtml(block.clauseNumber)}</span>
    <span class="contract-clause-title">${escapeHtml(block.title)}</span>
  </div>
  <div class="contract-clause-body">
    ${escapeHtml(block.body).replace(/\n/g, "<br/>")}
  </div>
</section>
`;
        break;
      }

      case "contract_scope_table": {
        contentHtml += `
<section class="contract-table-section">
  <h3 class="contract-sub-heading">${escapeHtml(block.title)}</h3>
  ${block.description ? `<p class="contract-sub-desc">${escapeHtml(block.description)}</p>` : ""}
  <table class="contract-minimal-table">
    <thead>
      <tr>
        <th style="width: 30%;">Deliverable / Module</th>
        <th style="width: 40%;">Specification & Technical Scope</th>
        <th style="width: 15%;">Timeline</th>
        <th style="width: 15%;">Acceptance Criteria</th>
      </tr>
    </thead>
    <tbody>
      ${block.rows
        .map(
          (row) => `
        <tr>
          <td><strong>${escapeHtml(row.deliverable)}</strong></td>
          <td>${escapeHtml(row.specifications)}</td>
          <td><span class="contract-tag">${escapeHtml(row.timeline)}</span></td>
          <td>${escapeHtml(row.acceptance)}</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>
</section>
`;
        break;
      }

      case "contract_commercials": {
        contentHtml += `
<section class="contract-commercials-section">
  <div class="contract-commercials-banner">
    <div>
      <h3 class="contract-sub-heading" style="margin: 0;">${escapeHtml(block.title)}</h3>
      <p class="contract-sub-desc" style="margin: 4px 0 0;">${escapeHtml(block.paymentTermsSummary)}</p>
    </div>
    <div class="contract-total-badge">
      <span class="contract-total-label">TOTAL CONTRACT VALUE</span>
      <span class="contract-total-val">${escapeHtml(block.totalValue)}</span>
    </div>
  </div>

  <table class="contract-minimal-table">
    <thead>
      <tr>
        <th style="width: 35%;">Payment Milestone</th>
        <th style="width: 15%;">Share</th>
        <th style="width: 20%;">Amount</th>
        <th style="width: 30%;">Payment Condition / Trigger</th>
      </tr>
    </thead>
    <tbody>
      ${block.tranches
        .map(
          (tr) => `
        <tr>
          <td><strong>${escapeHtml(tr.milestone)}</strong></td>
          <td><span class="contract-tag">${escapeHtml(tr.percentage)}</span></td>
          <td class="contract-amount-cell">${escapeHtml(tr.amount)}</td>
          <td>${escapeHtml(tr.dueCondition)}</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>

  <div class="contract-policy-box">
    <div class="contract-policy-row"><strong>Invoicing Policy:</strong> ${escapeHtml(block.invoicingNotes)}</div>
    <div class="contract-policy-row"><strong>Late Payments:</strong> ${escapeHtml(block.lateFeePolicy)}</div>
  </div>
</section>
`;
        break;
      }

      case "contract_signature": {
        // Resolve [client_name] in agreement disclaimer
        const disclaimer = (block.agreementDisclaimer || `By signing this I, [client_name] am in full agreement about all of the clauses mentioned above`)
          .replace(/\[client_name\]/gi, block.clientSignatory || "Client");

        contentHtml += `
<section class="contract-signature-section">
  <div class="contract-hairline-rule" style="margin: 32px 0 24px;"></div>
  
  <div class="contract-signature-instruction">
    IN WITNESS WHEREOF, this Agreement is executed by the Client's authorized representative as of the date written below under the issuance of Scalyx.
  </div>

  <div class="contract-client-signature-wrapper">
    <!-- Client Signature Box -->
    <div class="contract-signature-card contract-client-signature-card">
      <div class="contract-sig-party-title">${escapeHtml(block.clientTitle)} &bull; CLIENT EXECUTION & ACCEPTANCE</div>
      <div class="contract-sig-line-area">
        <div class="contract-sig-placeholder">AUTHORIZED CLIENT SIGNATURE &amp; COMPANY SEAL</div>
        <div class="contract-sig-line"></div>
      </div>
      <div class="contract-sig-meta-grid">
        <div class="contract-sig-meta-row"><strong>Authorized Signatory:</strong> ${escapeHtml(block.clientSignatory)}</div>
        <div class="contract-sig-meta-row"><strong>Title / Designation:</strong> ${escapeHtml(block.clientDesignation)}</div>
        <div class="contract-sig-meta-row"><strong>Execution Date:</strong> ${escapeHtml(block.clientDate)}</div>
      </div>

      <!-- MANDATORY REQUIRED CLIENT CONSENT LINE -->
      <div class="contract-client-pledge">
        &ldquo;${escapeHtml(disclaimer)}&rdquo;
      </div>
    </div>
  </div>

  ${block.countersignNote ? `<div class="contract-countersign-note">${escapeHtml(block.countersignNote)}</div>` : ""}
</section>
`;
        break;
      }
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Legal Contract Agreement</title>
  <style>
    /* Minimal yet Elegant Monochrome Contract Styling */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #fafafa;
      color: #111827;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 13px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      padding: 32px 16px;
    }

    .contract-document-container {
      max-width: 820px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
      padding: 48px 56px;
      border-radius: 4px;
    }

    /* Header Letterhead */
    .contract-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      margin-bottom: 24px;
    }

    .contract-logo-wrapper {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .contract-logo {
      height: 38px;
      width: auto;
      object-fit: contain;
    }

    .contract-brand-title {
      font-size: 19px;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: #000000;
      line-height: 1.1;
    }

    .contract-brand-subtitle {
      font-size: 9.5px;
      font-weight: 600;
      color: #6b7280;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-top: 3px;
    }

    .contract-meta-col {
      text-align: right;
      font-size: 11px;
      line-height: 1.5;
      color: #4b5563;
    }

    .contract-ref-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #000000;
      border: 1px solid #000000;
      padding: 2px 8px;
      margin-bottom: 6px;
      text-transform: uppercase;
    }

    .contract-meta-line strong {
      color: #111827;
      font-weight: 600;
    }

    .contract-hairline-rule {
      height: 1px;
      background-color: #111827;
      width: 100%;
      margin: 20px 0 28px;
    }

    /* Parties Section */
    .contract-parties-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 32px;
    }

    .contract-party-card {
      border: 1px solid #e5e7eb;
      background-color: #fafafa;
      padding: 18px 20px;
      border-radius: 4px;
      font-size: 11.5px;
      word-break: break-word;
      overflow-wrap: anywhere;
    }

    .contract-party-label {
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .contract-party-name {
      font-size: 14px;
      font-weight: 700;
      color: #000000;
      margin-bottom: 3px;
    }

    .contract-party-entity {
      font-size: 11.5px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
    }

    .contract-party-detail {
      color: #4b5563;
      margin-bottom: 5px;
      line-height: 1.5;
      word-break: break-word;
      overflow-wrap: anywhere;
    }

    .contract-party-detail strong {
      color: #111827;
    }

    /* Document Title & Preamble */
    .contract-preamble-section {
      margin-bottom: 28px;
    }

    .contract-document-title {
      font-size: 20px;
      font-weight: 800;
      text-align: center;
      letter-spacing: 0.03em;
      color: #000000;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .contract-effective-bar {
      text-align: center;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: #6b7280;
      margin-bottom: 20px;
      text-transform: uppercase;
    }

    .contract-preamble-body p {
      margin-bottom: 12px;
      text-align: justify;
      color: #374151;
      font-size: 12.5px;
      line-height: 1.65;
    }

    /* Clauses */
    .contract-clause-section {
      margin-bottom: 22px;
      page-break-inside: avoid;
    }

    .contract-clause-header {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 6px;
    }

    .contract-clause-num {
      font-size: 13px;
      font-weight: 800;
      color: #000000;
    }

    .contract-clause-title {
      font-size: 13px;
      font-weight: 700;
      color: #000000;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .contract-clause-body {
      color: #374151;
      font-size: 12.5px;
      line-height: 1.65;
      text-align: justify;
      padding-left: 2px;
    }

    /* Tables */
    .contract-table-section, .contract-commercials-section {
      margin: 26px 0;
      page-break-inside: avoid;
    }

    .contract-sub-heading {
      font-size: 12.5px;
      font-weight: 700;
      color: #000000;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 4px;
    }

    .contract-sub-desc {
      font-size: 11.5px;
      color: #6b7280;
      margin-bottom: 12px;
    }

    .contract-minimal-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 11.5px;
    }

    .contract-minimal-table th {
      border-top: 1px solid #111827;
      border-bottom: 1px solid #111827;
      padding: 8px 10px;
      text-align: left;
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #000000;
      background-color: #f9fafb;
    }

    .contract-minimal-table td {
      border-bottom: 1px solid #e5e7eb;
      padding: 9px 10px;
      color: #374151;
      line-height: 1.45;
      vertical-align: top;
    }

    .contract-amount-cell {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 700;
      color: #000000;
    }

    .contract-tag {
      display: inline-block;
      font-size: 10px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      padding: 1px 6px;
      border: 1px solid #d1d5db;
      background-color: #ffffff;
      color: #374151;
    }

    /* Commercials Banner & Policy Box */
    .contract-commercials-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 10px;
    }

    .contract-total-badge {
      text-align: right;
    }

    .contract-total-label {
      display: block;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #6b7280;
    }

    .contract-total-val {
      font-size: 18px;
      font-weight: 800;
      color: #000000;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }

    .contract-policy-box {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 12px 14px;
      font-size: 11px;
      margin-top: 10px;
    }

    .contract-policy-row {
      margin-bottom: 4px;
      color: #4b5563;
    }

    .contract-policy-row:last-child {
      margin-bottom: 0;
    }

    /* Signature Section */
    .contract-signature-section {
      margin-top: 36px;
      page-break-inside: avoid;
    }

    .contract-signature-instruction {
      font-size: 11.5px;
      color: #4b5563;
      font-style: italic;
      margin-bottom: 20px;
      text-align: center;
    }

    .contract-client-signature-wrapper {
      max-width: 600px;
      margin: 0 auto 24px;
    }

    .contract-signature-card {
      border: 1px solid #d1d5db;
      padding: 24px;
      background-color: #ffffff;
      position: relative;
    }

    .contract-client-signature-card {
      border: 1.5px solid #000000;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    .contract-sig-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px dashed #e5e7eb;
    }

    .contract-sig-party-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #000000;
      margin-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 6px;
    }

    .contract-sig-line-area {
      height: 70px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      margin-bottom: 12px;
    }

    .contract-sig-handwriting {
      font-family: "Brush Script MT", "Caveat", "Segoe Script", cursive, serif;
      font-size: 26px;
      color: #1e3a8a;
      padding-left: 10px;
      line-height: 1;
    }

    .contract-sig-placeholder {
      font-size: 11px;
      color: #9ca3af;
      text-align: center;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .contract-sig-line {
      height: 1px;
      background-color: #9ca3af;
      width: 100%;
    }

    .contract-sig-meta-row {
      font-size: 11px;
      color: #4b5563;
      margin-bottom: 5px;
      line-height: 1.5;
    }

    .contract-sig-meta-row strong {
      color: #111827;
      font-weight: 600;
    }

    /* MANDATORY AGREEMENT DISCLAIMER */
    .contract-client-pledge {
      margin-top: 18px;
      padding: 12px 16px;
      background-color: #f9fafb;
      border: 1px dashed #000000;
      font-size: 11.5px;
      font-weight: 700;
      color: #000000;
      line-height: 1.5;
      text-align: center;
      letter-spacing: -0.01em;
    }

    .contract-countersign-note {
      font-size: 10.5px;
      color: #6b7280;
      text-align: center;
      margin-top: 16px;
    }

    /* Print Styles */
    @media print {
      body {
        background-color: #ffffff;
        padding: 0;
      }

      .contract-document-container {
        border: none;
        box-shadow: none;
        padding: 0;
        max-width: 100%;
      }

      .contract-clause-section,
      .contract-table-section,
      .contract-commercials-section,
      .contract-signature-section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="contract-document-container">
    ${contentHtml}
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
