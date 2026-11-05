import { jsPDF } from "jspdf";
import { ContractBlock } from "./types";
import { SCALYX_LOGO_DATA_URI } from "@/lib/branding";

interface ExportPdfOptions {
  filename?: string;
  password?: string;
  contractTitle?: string;
}

function cleanPdfText(text: string): string {
  if (!text) return "";
  return text
    .replace(/₹\s?/g, "INR ")
    .replace(/•/g, "-")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\*\*/g, "");
}

export function generateContractPdf(
  blocks: ContractBlock[],
  options: ExportPdfOptions = {},
): jsPDF {
  const { password, contractTitle = "Master Services Agreement" } = options;

  const pdfOptions: any = {
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  };

  if (password && password.trim().length > 0) {
    pdfOptions.encryption = {
      userPassword: password.trim(),
      ownerPassword: `${password.trim()}_scalyx_admin`,
      userPermissions: ["print", "copy", "annot-forms"],
    };
  }

  const doc = new jsPDF(pdfOptions);
  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 18;
  const contentWidth = pageWidth - marginX * 2; // 174 mm
  let y = 18;

  function checkPageBreak(requiredHeight: number) {
    if (y + requiredHeight > pageHeight - 20) {
      // Add running footer on current page
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(150, 150, 150);
      doc.text(
        "Scalyx Confidential Contract Agreement • A4 Standard",
        marginX,
        pageHeight - 10,
      );
      doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - marginX - 12, pageHeight - 10);

      doc.addPage();
      y = 18;

      // Add running header
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(140, 140, 140);
      doc.text(`${contractTitle} • Confidential`, marginX, 12);
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.2);
      doc.line(marginX, 14, pageWidth - marginX, 14);
      y = 20;
    }
  }

  for (const block of blocks) {
    switch (block.type) {
      case "contract_header": {
        checkPageBreak(35);

        // Scalyx Brand Logo Image
        try {
          doc.addImage(SCALYX_LOGO_DATA_URI, "PNG", marginX, y - 2, 14, 14);
        } catch (e) {
          console.warn("Could not render logo image in PDF", e);
        }

        // Header Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("SCALYX", marginX + 17, y + 8);

        // Right Meta Box
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(0, 0, 0);
        doc.text("CONTRACT AGREEMENT", pageWidth - marginX - 45, y - 1);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(70, 70, 70);
        doc.text(`REF: ${block.referenceNo}`, pageWidth - marginX - 45, y + 3.8);
        doc.text(`DATE: ${block.agreementDate}`, pageWidth - marginX - 45, y + 8);
        doc.text(`WEB: ${block.website}`, pageWidth - marginX - 45, y + 12.2);
        doc.text(`EMAIL: ${block.email}`, pageWidth - marginX - 45, y + 16.4);

        y += 22;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.35);
        doc.line(marginX, y, pageWidth - marginX, y);
        y += 7;
        break;
      }

      case "contract_parties": {
        const cardWidth = (contentWidth - 6) / 2; // 84 mm
        const innerTextW = cardWidth - 8; // 76 mm

        // Pre-calculate wrapped lines for both cards to determine non-overflow height
        const provEntityLines = doc.splitTextToSize(block.providerEntity || "Scalyx", innerTextW);
        const provAddrLines = doc.splitTextToSize(block.providerAddress || "Salt Lake Sector V, Kolkata, WB 700091", innerTextW);
        const provSignLines = doc.splitTextToSize(`Signatory: ${block.providerSignatory} (${block.providerSignatoryTitle})`, innerTextW);
        const provContactLines = doc.splitTextToSize(`Contact: ${block.providerEmail}`, innerTextW);

        const clientCompanyLines = doc.splitTextToSize(block.clientCompany, innerTextW);
        const clientAddrLines = doc.splitTextToSize(block.clientAddress, innerTextW);
        const clientRepLines = doc.splitTextToSize(`Authorized Rep: ${block.clientName} (${block.clientSignatoryTitle})`, innerTextW);
        const clientContactLines = doc.splitTextToSize(`Contact: ${block.clientEmail} • ${block.clientPhone}`, innerTextW);

        const provHeight = 15 + (provEntityLines.length + provAddrLines.length + provSignLines.length + provContactLines.length) * 4.2 + 4;
        const clientHeight = 15 + (clientCompanyLines.length + clientAddrLines.length + clientRepLines.length + clientContactLines.length) * 4.2 + 4;
        const cardHeight = Math.max(provHeight, clientHeight, 46);

        checkPageBreak(cardHeight + 6);

        // --- Provider Card (Left) ---
        doc.setFillColor(250, 250, 250);
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.25);
        doc.rect(marginX, y, cardWidth, cardHeight, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(110, 110, 110);
        doc.text("SERVICE PROVIDER", marginX + 4, y + 5.5);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(0, 0, 0);
        doc.text("Scalyx", marginX + 4, y + 11);

        let curProvY = y + 16;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(70, 70, 70);

        doc.text(provEntityLines, marginX + 4, curProvY);
        curProvY += provEntityLines.length * 4.2;

        doc.text(provAddrLines, marginX + 4, curProvY);
        curProvY += provAddrLines.length * 4.2;

        doc.text(provSignLines, marginX + 4, curProvY);
        curProvY += provSignLines.length * 4.2;

        doc.text(provContactLines, marginX + 4, curProvY);

        // --- Client Card (Right) ---
        const clientX = marginX + cardWidth + 6;
        doc.setFillColor(250, 250, 250);
        doc.setDrawColor(220, 220, 220);
        doc.rect(clientX, y, cardWidth, cardHeight, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(110, 110, 110);
        doc.text("CLIENT (COUNTERPARTY)", clientX + 4, y + 5.5);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(0, 0, 0);
        doc.text(block.clientName, clientX + 4, y + 11);

        let curClientY = y + 16;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(70, 70, 70);

        doc.text(clientCompanyLines, clientX + 4, curClientY);
        curClientY += clientCompanyLines.length * 4.2;

        doc.text(clientAddrLines, clientX + 4, curClientY);
        curClientY += clientAddrLines.length * 4.2;

        // Wrapped Authorized Rep Line (Never overflows border!)
        doc.text(clientRepLines, clientX + 4, curClientY);
        curClientY += clientRepLines.length * 4.2;

        // Wrapped Contact Line
        doc.text(clientContactLines, clientX + 4, curClientY);

        y += cardHeight + 8;
        break;
      }

      case "contract_preamble": {
        checkPageBreak(30);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11.5);
        doc.setTextColor(0, 0, 0);
        doc.text(block.title, pageWidth / 2, y + 3, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(110, 110, 110);
        doc.text(`EFFECTIVE DATE: ${block.effectiveDate}`, pageWidth / 2, y + 8.5, { align: "center" });
        y += 14;

        const cleanBody = block.body
          .replace(/Scalyx Software Technologies/g, "Scalyx")
          .replace(/Scalyx Digital Agency/g, "Scalyx");
        const paras = cleanBody.split("\n\n");
        for (const p of paras) {
          const cleanP = p.replace(/\n/g, " ").trim();
          if (!cleanP) continue;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(40, 40, 40);
          const lines = doc.splitTextToSize(cleanP, contentWidth);
          checkPageBreak(lines.length * 4.2 + 4);
          doc.text(lines, marginX, y);
          y += lines.length * 4.2 + 3.5;
        }
        y += 4;
        break;
      }

      case "contract_clause": {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(0, 0, 0);
        const headingText = `${block.clauseNumber} ${block.title.toUpperCase()}`;
        checkPageBreak(14);
        doc.text(headingText, marginX, y);
        y += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(45, 45, 45);
        const lines = doc.splitTextToSize(cleanPdfText(block.body), contentWidth);
        checkPageBreak(lines.length * 4.2 + 5);
        doc.text(lines, marginX, y);
        y += lines.length * 4.2 + 6;
        break;
      }

      case "contract_scope_table": {
        checkPageBreak(28);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(0, 0, 0);
        doc.text(block.title.toUpperCase(), marginX, y);
        y += 4.5;

        if (block.description) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(110, 110, 110);
          doc.text(block.description, marginX, y);
          y += 4.5;
        }

        // Table Header
        doc.setFillColor(245, 245, 245);
        doc.rect(marginX, y, contentWidth, 7, "F");
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.line(marginX, y, pageWidth - marginX, y);
        doc.line(marginX, y + 7, pageWidth - marginX, y + 7);

        // Columns across 174mm:
        // Col 1: DELIVERABLE / MODULE (44mm, x = marginX + 2)
        // Col 2: SPECIFICATIONS (66mm, x = marginX + 48)
        // Col 3: TIMELINE (22mm, x = marginX + 116)
        // Col 4: ACCEPTANCE (34mm, x = marginX + 140)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.2);
        doc.setTextColor(0, 0, 0);
        doc.text("DELIVERABLE / MODULE", marginX + 2, y + 4.8);
        doc.text("SPECIFICATIONS", marginX + 48, y + 4.8);
        doc.text("TIMELINE", marginX + 116, y + 4.8);
        doc.text("ACCEPTANCE", marginX + 140, y + 4.8);
        y += 7;

        // Table Rows with proper multi-column maxLines and breathing padding
        for (const row of block.rows) {
          const delivLines = doc.splitTextToSize(cleanPdfText(row.deliverable), 42);
          const specLines = doc.splitTextToSize(cleanPdfText(row.specifications), 64);
          const timeLines = doc.splitTextToSize(cleanPdfText(row.timeline), 20);
          const acceptLines = doc.splitTextToSize(cleanPdfText(row.acceptance), 32);

          const maxLines = Math.max(
            delivLines.length,
            specLines.length,
            timeLines.length,
            acceptLines.length,
            1,
          );
          const rowHeight = maxLines * 4.4 + 5;

          checkPageBreak(rowHeight + 2);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(0, 0, 0);
          doc.text(delivLines, marginX + 2, y + 4.2);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(60, 60, 60);
          doc.text(specLines, marginX + 48, y + 4.2);
          doc.text(timeLines, marginX + 116, y + 4.2);
          doc.text(acceptLines, marginX + 140, y + 4.2);

          y += rowHeight;
          doc.setDrawColor(230, 230, 230);
          doc.setLineWidth(0.2);
          doc.line(marginX, y, pageWidth - marginX, y);
        }
        y += 7;
        break;
      }

      case "contract_commercials": {
        checkPageBreak(32);

        const cleanTotal = cleanPdfText(block.totalValue);

        // Banner
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(0, 0, 0);
        doc.text(block.title.toUpperCase(), marginX, y);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(0, 0, 0);
        doc.text(`TOTAL VALUE: ${cleanTotal}`, pageWidth - marginX, y, { align: "right" });
        y += 5.5;

        // Tranches Table Header
        doc.setFillColor(245, 245, 245);
        doc.rect(marginX, y, contentWidth, 7, "F");
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.line(marginX, y, pageWidth - marginX, y);
        doc.line(marginX, y + 7, pageWidth - marginX, y + 7);

        // Columns across 174mm:
        // Col 1: PAYMENT MILESTONE (64mm, x = marginX + 2)
        // Col 2: SHARE (20mm, x = marginX + 68)
        // Col 3: AMOUNT (28mm, x = marginX + 90)
        // Col 4: DUE CONDITION / TRIGGER (54mm, x = marginX + 120)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.2);
        doc.setTextColor(0, 0, 0);
        doc.text("PAYMENT MILESTONE", marginX + 2, y + 4.8);
        doc.text("SHARE", marginX + 68, y + 4.8);
        doc.text("AMOUNT", marginX + 90, y + 4.8);
        doc.text("DUE CONDITION / TRIGGER", marginX + 120, y + 4.8);
        y += 7;

        for (const tr of block.tranches) {
          const milLines = doc.splitTextToSize(cleanPdfText(tr.milestone), 63);
          const trigLines = doc.splitTextToSize(cleanPdfText(tr.dueCondition), 52);
          const cleanAmount = cleanPdfText(tr.amount);
          const maxLines = Math.max(milLines.length, trigLines.length, 1);
          const rowHeight = maxLines * 4.4 + 5;

          checkPageBreak(rowHeight + 2);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(0, 0, 0);
          doc.text(milLines, marginX + 2, y + 4.2);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          doc.text(tr.percentage, marginX + 68, y + 4.2);

          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0);
          doc.text(cleanAmount, marginX + 90, y + 4.2);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          doc.text(trigLines, marginX + 120, y + 4.2);

          y += rowHeight;
          doc.setDrawColor(230, 230, 230);
          doc.setLineWidth(0.2);
          doc.line(marginX, y, pageWidth - marginX, y);
        }

        // Policy box with comfortable spacing
        y += 4;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(90, 90, 90);
        const policy1 = doc.splitTextToSize(`Invoicing Policy: ${cleanPdfText(block.invoicingNotes)}`, contentWidth);
        const policy2 = doc.splitTextToSize(`Late Payments: ${cleanPdfText(block.lateFeePolicy)}`, contentWidth);
        checkPageBreak(policy1.length * 4.2 + policy2.length * 4.2 + 6);
        doc.text(policy1, marginX, y);
        y += policy1.length * 4.2 + 2;
        doc.text(policy2, marginX, y);
        y += policy2.length * 4.2 + 7;
        break;
      }

      case "contract_signature": {
        const disclaimer = cleanPdfText(block.agreementDisclaimer || `By signing this I, [client_name] am in full agreement about all of the clauses mentioned above`);

        checkPageBreak(75);

        y += 4;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(0, 0, 0);
        doc.text("CLIENT EXECUTION & BINDING ACCEPTANCE", pageWidth / 2, y, { align: "center" });
        y += 6;

        // Centered Client Execution Card (Generous 140mm width & 64mm height)
        const cardW = 140;
        const cardX = (pageWidth - cardW) / 2;
        const cardH = 64;

        doc.setFillColor(252, 252, 252);
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.35);
        doc.rect(cardX, y, cardW, cardH, "FD");

        // Client Title / Company Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(0, 0, 0);
        doc.text(block.clientTitle || "CLIENT (COUNTERPARTY)", cardX + cardW / 2, y + 7.5, { align: "center" });

        // Dotted Signature Line
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.25);
        doc.line(cardX + 20, y + 20, cardX + cardW - 20, y + 20);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(140, 140, 140);
        doc.text("CLIENT AUTHORIZED SIGNATURE & COMPANY SEAL", cardX + cardW / 2, y + 24.5, { align: "center" });

        // Signatory metadata with generous vertical spacing
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(0, 0, 0);
        doc.text(`Authorized Signatory: ${block.clientSignatory}`, cardX + 12, y + 31.5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(60, 60, 60);
        doc.text(`Designation: ${block.clientDesignation}`, cardX + 12, y + 36.5);
        doc.text(`Execution Date: ${block.clientDate}`, cardX + 12, y + 41.5);

        // Mandatory Agreement Pledge Box (Height: 12mm with inner vertical padding)
        const pledgeBoxY = y + 46.5;
        const pledgeBoxH = 12;
        doc.setFillColor(245, 245, 245);
        doc.setDrawColor(160, 160, 160);
        doc.setLineWidth(0.25);
        doc.rect(cardX + 8, pledgeBoxY, cardW - 16, pledgeBoxH, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.8);
        doc.setTextColor(0, 0, 0);
        const pledgeLines = doc.splitTextToSize(`"${disclaimer}"`, cardW - 22);
        const textStartY = pledgeBoxY + (pledgeBoxH - pledgeLines.length * 3.6) / 2 + 2.8;
        doc.text(pledgeLines, cardX + cardW / 2, textStartY, { align: "center" });

        y += cardH + 8;
        break;
      }
    }
  }

  // Running footer on final page
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Scalyx Confidential Contract Agreement • A4 Standard",
    marginX,
    pageHeight - 10,
  );
  doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - marginX - 12, pageHeight - 10);

  return doc;
}
