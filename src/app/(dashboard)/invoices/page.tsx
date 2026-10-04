"use client";

import React, { useState, useEffect, useRef } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { InvoiceData, FontType, INITIAL_INVOICE_DATA } from "@/types/invoice";
import { Lead } from "@/types/lead";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import FontChooserDialog from "@/components/invoice/FontChooserDialog";
import { exportInvoiceToPdf } from "@/lib/invoice/generatePdf";
import {
  Download,
  Eye,
  Edit3,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Type,
  Users,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function InvoicesPage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(INITIAL_INVOICE_DATA);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isFontDialogOpen, setIsFontDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Zoom scale for preview (defaults to ~0.82 for desktop screens to fit A4 neatly)
  const [previewScale, setPreviewScale] = useState(0.82);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadLeads() {
      try {
        const res = await fetch("/api/leads");
        const data = await res.json();
        if (data.leads) setLeads(data.leads);
      } catch (err) {
        console.error(err);
      }
    }
    loadLeads();
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      const filename = `Invoice-${invoiceData.invoiceNumber || "draft"}-${invoiceData.company.name.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      await exportInvoiceToPdf("invoice-document", filename);
      showToast("success", `Downloaded ${filename} successfully!`);
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      showToast("error", err?.message || "PDF generation encountered an issue.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSelectFont = (font: FontType) => {
    setInvoiceData((prev) => ({
      ...prev,
      font,
    }));
  };

  const handleLoadLead = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    setInvoiceData((prev) => ({
      ...prev,
      client: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone || "",
        address: lead.company || "",
      },
    }));
    showToast("success", `Loaded client details for ${lead.name}`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen text-foreground print:bg-white print:min-h-0 print:p-0 print:block">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-none shadow-xl border text-xs font-semibold ${
              notification.type === "success"
                ? "bg-card text-emerald-600 border-emerald-500/20"
                : "bg-card text-rose-600 border-rose-500/20"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="size-4 text-emerald-500" />
            ) : (
              <AlertCircle className="size-4 text-rose-500" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <AppNavbar
        title="Scalyx Invoice Generator"
        description="Official high-resolution A4 invoice generator integrated with client leads."
        actions={
          <div className="flex items-center gap-2">
            {/* Quick Fill from Lead Selector */}
            {leads.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
                <Users className="size-3.5 text-primary" />
                <select
                  onChange={(e) => e.target.value && handleLoadLead(e.target.value)}
                  defaultValue=""
                  className="h-8 px-2 rounded-none bg-transparent border border-input text-xs text-foreground focus:outline-none"
                >
                  <option value="" disabled className="bg-card">
                    Prefill From Lead...
                  </option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id} className="bg-card">
                      {l.name} ({l.company || "Client"})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFontDialogOpen(true)}
              className="gap-1.5 text-xs h-9"
            >
              <Type className="size-3.5 text-primary" />
              <span className="hidden sm:inline">Font:</span>
              <Badge variant="secondary" className="capitalize text-[10px] px-1.5 py-0">
                {invoiceData.font}
              </Badge>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="gap-2 text-xs h-9 font-semibold"
            >
              {isDownloading ? (
                <>
                  <div className="size-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-none animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="size-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* Mobile Mode Switcher Tabs */}
      <div className="lg:hidden flex border-b border-border bg-card no-print">
        <button
          type="button"
          onClick={() => setMobileTab("edit")}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
            mobileTab === "edit"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground"
          }`}
        >
          <Edit3 className="size-3.5" />
          <span>Editor & Items</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
            mobileTab === "preview"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground"
          }`}
        >
          <Eye className="size-3.5" />
          <span>Live A4 Preview</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 print:p-0 print:m-0 print:block">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block print:m-0 print:p-0">
          {/* Left Column: Form & Item Controls (5 cols) */}
          <div
            className={`lg:col-span-5 no-print ${
              mobileTab === "edit" ? "block" : "hidden lg:block"
            }`}
          >
            <InvoiceForm
              data={invoiceData}
              onChange={setInvoiceData}
              onOpenFontDialog={() => setIsFontDialogOpen(true)}
              onDownloadPdf={handleDownloadPdf}
              isDownloading={isDownloading}
            />
          </div>

          {/* Right Column: Live A4 Document Preview (7 cols) */}
          <div
            ref={previewContainerRef}
            className={`lg:col-span-7 flex flex-col items-center print:block print:p-0 print:m-0 ${
              mobileTab === "preview" ? "block" : "hidden lg:flex"
            }`}
          >
            {/* Preview Toolbar */}
            <div className="w-full max-w-[210mm] flex items-center justify-between pb-3 mb-3 border-b border-border text-xs no-print">
              <div className="flex items-center gap-2">
                <span className="flex size-2 rounded-none bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-foreground">Live A4 Document Preview</span>
                <span className="text-[10px] font-mono text-muted-foreground">(210mm × 297mm)</span>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-card border border-border rounded-none p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setPreviewScale((s) => Math.max(0.4, s - 0.1))}
                  title="Zoom Out"
                  className="p-1.5 rounded-none hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ZoomOut className="size-3.5" />
                </button>
                <span className="text-[11px] font-mono px-1.5 text-foreground w-12 text-center font-medium">
                  {Math.round(previewScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewScale((s) => Math.min(1.2, s + 0.1))}
                  title="Zoom In"
                  className="p-1.5 rounded-none hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ZoomIn className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewScale(0.82)}
                  title="Reset Zoom"
                  className="p-1.5 rounded-none hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border-l border-border"
                >
                  <Maximize2 className="size-3.5" />
                </button>
              </div>
            </div>

            {/* A4 Sheet Container */}
            <div className="w-full overflow-x-auto flex justify-center py-6 bg-muted/20 rounded-none border border-border shadow-inner print:p-0 print:m-0 print:bg-transparent print:border-none print:shadow-none print:block print:overflow-visible">
              <InvoicePreview data={invoiceData} scale={previewScale} />
            </div>
          </div>
        </div>
      </div>

      {/* Font Chooser Modal Dialog */}
      <FontChooserDialog
        isOpen={isFontDialogOpen}
        onClose={() => setIsFontDialogOpen(false)}
        selectedFont={invoiceData.font}
        onSelectFont={handleSelectFont}
      />
    </div>
  );
}
