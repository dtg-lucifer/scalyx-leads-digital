import jsPDF from "jspdf";
import { toPng, toJpeg } from "html-to-image";

export async function exportInvoiceToPdf(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const cleanFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  const a4WidthPx = 794;
  const a4HeightPx = 1123;

  let dataUrl: string | null = null;

  try {
    dataUrl = await toPng(element, {
      width: a4WidthPx,
      height: a4HeightPx,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      skipFonts: true,
      fontEmbedCSS: "",
      cacheBust: false,
      style: {
        transform: "none",
        transformOrigin: "top left",
        margin: "0",
        boxShadow: "none",
      },
    });
  } catch (err1) {
    console.warn("toPng direct export encountered an issue, trying toJpeg:", err1);
    try {
      dataUrl = await toJpeg(element, {
        quality: 0.95,
        pixelRatio: 1.5,
        backgroundColor: "#ffffff",
        skipFonts: true,
        fontEmbedCSS: "",
      });
    } catch (err2) {
      console.warn("toJpeg also failed:", err2);
    }
  }

  if (dataUrl) {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });
    pdf.addImage(dataUrl, "JPEG", 0, 0, 210, 297, undefined, "FAST");
    pdf.save(cleanFilename);
    return;
  }

  // Final fallback: Use jsPDF html renderer
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  await doc.html(element, {
    callback: (renderedDoc) => {
      renderedDoc.save(cleanFilename);
    },
    x: 10,
    y: 10,
    width: 575,
    windowWidth: a4WidthPx,
  });
}
