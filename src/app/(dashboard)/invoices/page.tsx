"use client";

import React, { useState, useEffect, useRef } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { InvoiceData, FontType, INITIAL_INVOICE_DATA } from "@/types/invoice";
import { Lead } from "@/types/lead";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import FontChooserDialog from "@/components/invoice/FontChooserDialog";
import { exportInvoiceToPdf } from "@/lib/invoice/generatePdf";
import { printInvoiceDocument } from "@/lib/invoice/printInvoice";
import {
  Download,
  Printer,
  Eye,
  Edit3,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Type,
  Users,
  Plus,
  FolderClock,
  Save,
  PenLine,
  Check,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  SavedDocumentsModal,
  type SavedDocSummary,
} from "@/components/common/SavedDocumentsModal";
import type { SavedInvoiceDoc } from "@/types/savedDocument";

function computeInvoiceTotal(data: InvoiceData): number {
  const subtotal = (data.items || []).reduce(
    (acc, item) => acc + (Number(item.cost) || 0),
    0,
  );
  const taxAmount = (subtotal * (Number(data.taxRate) || 0)) / 100;
  return subtotal + taxAmount;
}

export default function InvoicesPage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(INITIAL_INVOICE_DATA);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isFontDialogOpen, setIsFontDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Persistence & Draft Management State
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [docName, setDocName] = useState<string>("Tax Invoice Draft");
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoiceDoc[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // Storage Keys
  const INVOICES_STORAGE_KEY = "scalyx_saved_invoices_v1";
  const CURRENT_INVOICE_ID_KEY = "scalyx_current_invoice_id";

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

  // Load saved invoices from localStorage and API on mount
  useEffect(() => {
    try {
      const local = localStorage.getItem(INVOICES_STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedInvoices(parsed);
        }
      }
      const storedId = localStorage.getItem(CURRENT_INVOICE_ID_KEY);
      if (storedId) {
        setCurrentDocId(storedId);
      }
    } catch (e) {
      console.error("Local storage read error for invoices:", e);
    }

    async function loadSavedFromApi() {
      try {
        setIsLoadingSaved(true);
        const res = await fetch("/api/invoices");
        const data = await res.json();
        if (data.invoices && Array.isArray(data.invoices)) {
          setSavedInvoices(data.invoices);
          localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(data.invoices));
        }
      } catch (err) {
        console.error("Failed to load saved invoices from API:", err);
      } finally {
        setIsLoadingSaved(false);
      }
    }
    loadSavedFromApi();
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Persist helper
  const persistInvoice = async (
    targetId: string,
    dataToSave: InvoiceData,
    nameToSave?: string,
  ) => {
    try {
      setSaveStatus("saving");
      const now = new Date().toISOString();
      const currentName = (nameToSave || docName).trim() || `Invoice ${dataToSave.invoiceNumber || "Draft"}`;
      const docToSave: SavedInvoiceDoc = {
        id: targetId,
        invoiceNumber: dataToSave.invoiceNumber || "INV-2026-001",
        referenceNo: dataToSave.invoiceNumber || "INV-2026-001",
        name: currentName,
        title: `Invoice ${dataToSave.invoiceNumber || "Draft"}`,
        clientName: dataToSave.client?.name || "",
        clientCompany: dataToSave.client?.address || "",
        dealValue: `${dataToSave.currencySymbol || "₹"} ${computeInvoiceTotal(dataToSave).toLocaleString("en-IN")}`,
        data: dataToSave,
        updatedAt: now,
        createdAt: now,
        isDraft: true,
      };

      // 1. Instant local update
      setSavedInvoices((prev) => {
        const withoutCurrent = prev.filter((i) => i.id !== targetId);
        const updated = [docToSave, ...withoutCurrent];
        try {
          localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(updated));
          localStorage.setItem(CURRENT_INVOICE_ID_KEY, targetId);
        } catch (e) {
          console.error("Local storage write error for invoice:", e);
        }
        return updated;
      });

      // 2. Background sync to backend API
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docToSave),
      });

      if (!res.ok) {
        console.warn("API save warning:", await res.text());
      }
      setSaveStatus("saved");
      setLastSavedTime(new Date());
    } catch (err) {
      console.error("Failed to persist invoice:", err);
      setSaveStatus("error");
    }
  };

  // Continuous Debounced Auto-Save (1 Second)
  useEffect(() => {
    if (!hasUserEdited) return;

    const docId =
      currentDocId ||
      `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    if (!currentDocId) {
      setCurrentDocId(docId);
    }

    const timer = setTimeout(() => {
      persistInvoice(docId, invoiceData);
    }, 1000);

    return () => clearTimeout(timer);
  }, [invoiceData, docName, hasUserEdited]);

  const handleInvoiceChange = (updater: React.SetStateAction<InvoiceData>) => {
    setInvoiceData(updater);
    setHasUserEdited(true);
  };

  const handleExplicitSave = () => {
    const docId =
      currentDocId ||
      `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setCurrentDocId(docId);
    setHasUserEdited(true);
    persistInvoice(docId, invoiceData);
    showToast("success", `Invoice draft "${docName}" saved to storage!`);
  };

  const handleCreateBlank = () => {
    const newNumber = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const blankData: InvoiceData = {
      ...INITIAL_INVOICE_DATA,
      invoiceNumber: newNumber,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      client: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      items: [
        {
          id: `item_${Date.now()}`,
          description: "Software Architecture & Turnkey Engineering Services",
          cost: 50000,
        },
      ],
    };
    const docId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setInvoiceData(blankData);
    setDocName(`Invoice ${newNumber}`);
    setCurrentDocId(docId);
    setHasUserEdited(true);
    persistInvoice(docId, blankData, `Invoice ${newNumber}`);
    showToast("success", `Created new blank invoice ${newNumber}!`);
  };

  const handleLoadSavedInvoice = (id: string) => {
    const found = savedInvoices.find((inv) => inv.id === id);
    if (found && found.data) {
      setInvoiceData(found.data);
      setCurrentDocId(found.id);
      setDocName(found.name || `Invoice ${found.invoiceNumber || "Draft"}`);
      setHasUserEdited(true);
      setSaveStatus("saved");
      showToast("success", `Loaded invoice "${found.name || found.invoiceNumber}"!`);
    }
  };

  const handleDeleteSavedInvoice = async (id: string) => {
    try {
      const updated = savedInvoices.filter((inv) => inv.id !== id);
      setSavedInvoices(updated);
      try {
        localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Local storage delete error:", e);
      }
      if (currentDocId === id) {
        setCurrentDocId(null);
      }
      await fetch(`/api/invoices?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      showToast("success", "Deleted saved invoice draft.");
    } catch (err) {
      console.error("Failed to delete invoice:", err);
    }
  };

  const handlePrint = () => {
    printInvoiceDocument("invoice-document");
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
    handleInvoiceChange((prev) => ({
      ...prev,
      font,
    }));
  };

  const handleLoadLead = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    handleInvoiceChange((prev) => ({
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
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold ${
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

      {/* Top Navbar */}
      <AppNavbar
        title="Scalyx Invoice Generator"
        description="Official high-resolution A4 billing tool integrated with client records."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Create Blank Invoice Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCreateBlank}
              className="gap-1.5 text-xs font-semibold rounded-lg border-border"
              title="Create a new blank invoice canvas"
            >
              <Plus className="size-3.5" />
              <span>New Blank</span>
            </Button>

            {/* Saved Drafts Modal Trigger */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSavedModalOpen(true)}
              className="gap-1.5 text-xs font-semibold rounded-lg border-border relative"
              title="View and restore saved invoice drafts"
            >
              <FolderClock className="size-3.5 text-primary" />
              <span>Saved Drafts</span>
              {savedInvoices.length > 0 && (
                <Badge
                  variant="secondary"
                  className="size-4 p-0 flex items-center justify-center text-[10px] font-mono rounded-full bg-primary/10 text-primary"
                >
                  {savedInvoices.length}
                </Badge>
              )}
            </Button>

            {/* Save Draft Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExplicitSave}
              className="gap-1.5 text-xs font-semibold rounded-lg border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
              title="Save invoice draft immediately"
            >
              <Save className="size-3.5" />
              <span>Save Draft</span>
            </Button>

            {/* Font Chooser */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFontDialogOpen(true)}
              className="gap-1.5 text-xs h-9 rounded-lg border-border"
            >
              <Type className="size-3.5 text-primary" />
              <span className="hidden sm:inline">Font:</span>
              <span className="capitalize text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground">
                {invoiceData.font}
              </span>
            </Button>

            {/* Print Invoice Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs h-9 font-semibold rounded-lg border-border"
              title="Print invoice or save as PDF via system dialog"
            >
              <Printer className="size-3.5 text-primary" />
              <span>Print</span>
            </Button>

            {/* Download PDF Button */}
            <Button
              type="button"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="gap-2 text-xs h-9 font-semibold rounded-lg"
            >
              {isDownloading ? (
                <>
                  <div className="size-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
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

      {/* Sleek Workspace Draft & Status Toolbar */}
      <div className="bg-card border-b border-border/70 px-4 sm:px-6 lg:px-8 py-2.5 shadow-xs shrink-0 flex flex-wrap items-center justify-between gap-3 no-print">
        {/* Left: Draft Name & Status */}
        <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
          <div className="flex items-center gap-2 bg-muted/40 hover:bg-muted/60 focus-within:bg-background focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 border border-border/80 px-2.5 py-1 rounded-lg transition-all shadow-2xs">
            <PenLine className="size-3.5 text-primary shrink-0" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0">
              Draft:
            </span>
            <input
              type="text"
              value={docName}
              onChange={(e) => {
                setDocName(e.target.value);
                setHasUserEdited(true);
              }}
              placeholder="Invoice Name..."
              className="h-5 w-44 sm:w-56 md:w-64 text-xs font-semibold bg-transparent border-0 focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground/60 truncate"
              title="Name this invoice draft to easily identify it in saved drafts"
            />
          </div>

          {/* Unique Invoice Number Badge */}
          {invoiceData.invoiceNumber && (
            <span
              className="font-mono text-[10.5px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md shrink-0 cursor-default"
              title="Unique Invoice Number ID"
            >
              {invoiceData.invoiceNumber}
            </span>
          )}

          {/* Autosave Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium text-muted-foreground bg-muted/30 border border-border/50 shrink-0">
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="size-3 animate-spin text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400">Saving...</span>
              </>
            ) : saveStatus === "saved" ? (
              <>
                <Check className="size-3 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Saved</span>
              </>
            ) : (
              <>
                <Clock className="size-3 text-muted-foreground" />
                <span>Unsaved</span>
              </>
            )}
          </div>

          <div className="h-4 w-px bg-border/70 hidden md:block" />

          {/* Quick Fill from Lead Selector */}
          {leads.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="size-3.5 text-primary shrink-0" />
              <select
                onChange={(e) => e.target.value && handleLoadLead(e.target.value)}
                defaultValue=""
                className="h-7 px-2 pr-6 rounded-lg bg-background hover:bg-muted/40 border border-border/80 text-xs font-medium text-foreground focus:outline-none transition-colors cursor-pointer"
              >
                <option value="" disabled className="bg-card">
                  Autofill Lead...
                </option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id} className="bg-card">
                    {l.company || l.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right: Metrics & Items Count */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[10.5px] text-muted-foreground bg-muted/40 border border-border/60 px-2 py-0.5 rounded-md">
            {invoiceData.items?.length || 0} {(invoiceData.items?.length || 0) === 1 ? "Line Item" : "Line Items"}
          </span>
          <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
            {invoiceData.currencySymbol || "₹"} {computeInvoiceTotal(invoiceData).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

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
      <div className="flex-1 p-4 sm:p-6 lg:p-8 print:p-0 print:m-0 print:block w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:block print:m-0 print:p-0">
          {/* Left Column: Form & Item Controls (5 cols) */}
          <div
            className={`lg:col-span-5 no-print ${
              mobileTab === "edit" ? "block" : "hidden lg:block"
            }`}
          >
            <InvoiceForm
              data={invoiceData}
              onChange={handleInvoiceChange}
              onOpenFontDialog={() => setIsFontDialogOpen(true)}
              onDownloadPdf={handleDownloadPdf}
              onPrint={handlePrint}
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
                <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-foreground">Live A4 Document Preview</span>
                <span className="text-[10px] font-mono text-muted-foreground">(210mm × 297mm)</span>
              </div>

              {/* Action Buttons & Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="h-7 px-2.5 text-xs font-semibold gap-1.5 rounded-lg border-border shadow-2xs hover:bg-muted"
                  title="Print invoice or save as PDF"
                >
                  <Printer className="size-3 text-primary" />
                  <span>Print</span>
                </Button>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-card border border-border/80 rounded-xl p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setPreviewScale((s) => Math.max(0.4, s - 0.1))}
                  title="Zoom Out"
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
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
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ZoomIn className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewScale(0.82)}
                  title="Reset Zoom"
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border-l border-border"
                >
                  <Maximize2 className="size-3.5" />
                </button>
                </div>
              </div>
            </div>

            {/* A4 Sheet Container */}
            <div className="w-full overflow-x-auto flex justify-center py-6 bg-muted/20 rounded-2xl border border-border/80 shadow-inner print:p-0 print:m-0 print:bg-transparent print:border-none print:shadow-none print:block print:overflow-visible">
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

      {/* Saved Invoices & Drafts Modal */}
      <SavedDocumentsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        documentType="invoice"
        documents={savedInvoices.map((inv) => ({
          id: inv.id,
          docNumber: inv.invoiceNumber || inv.referenceNo || inv.id,
          name: inv.name,
          title: inv.title,
          clientName: inv.clientName,
          clientCompany: inv.clientCompany,
          dealValue: inv.dealValue,
          updatedAt: inv.updatedAt,
          createdAt: inv.createdAt,
          blocksCount: inv.data?.items?.length || 0,
        }))}
        currentId={currentDocId}
        onLoad={handleLoadSavedInvoice}
        onDelete={handleDeleteSavedInvoice}
        onCreateBlank={handleCreateBlank}
        isLoading={isLoadingSaved}
      />
    </div>
  );
}
