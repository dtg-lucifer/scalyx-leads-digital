"use client";

/**
 * Dedicated, isolated invoice print function.
 * Clones the invoice DOM element into a clean, detached iframe with complete stylesheet links,
 * eliminating interference from sidebar navigation, layout clipping, and scale transformations.
 */
export function printInvoiceDocument(elementId: string = "invoice-document"): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Find or create the dedicated hidden print iframe
  let printIframe = document.getElementById("invoice-print-frame") as HTMLIFrameElement | null;
  if (printIframe) {
    printIframe.remove();
  }

  printIframe = document.createElement("iframe");
  printIframe.id = "invoice-print-frame";
  printIframe.style.position = "fixed";
  printIframe.style.right = "0";
  printIframe.style.bottom = "0";
  printIframe.style.width = "0";
  printIframe.style.height = "0";
  printIframe.style.border = "none";
  printIframe.style.opacity = "0";
  printIframe.style.pointerEvents = "none";
  printIframe.style.zIndex = "-9999";
  document.body.appendChild(printIframe);

  const iframeDoc = printIframe.contentWindow?.document;
  if (!iframeDoc) {
    window.print();
    return;
  }

  // Harvest all stylesheet link tags and style tags from the current page
  const headElements = document.head.querySelectorAll("link[rel='stylesheet'], style");
  let stylesMarkup = "";
  headElements.forEach((node) => {
    stylesMarkup += node.outerHTML;
  });

  // Extract clean invoice HTML
  const invoiceHtml = element.outerHTML;

  iframeDoc.open();
  iframeDoc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Invoice</title>
        ${stylesMarkup}
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            width: 210mm !important;
            min-height: 297mm !important;
          }
          .invoice-scale-wrapper {
            transform: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #invoice-document {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 auto !important;
            padding: 18mm !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
            border: none !important;
            background-color: #ffffff !important;
            transform: none !important;
            position: relative !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
        </style>
      </head>
      <body>
        ${invoiceHtml}
      </body>
    </html>
  `);
  iframeDoc.close();

  // Allow styles and images to finish rendering before invoking the print dialog
  setTimeout(() => {
    try {
      printIframe?.contentWindow?.focus();
      printIframe?.contentWindow?.print();
    } catch (err) {
      console.error("Print dialog launch error:", err);
      window.print();
    }
  }, 250);
}

