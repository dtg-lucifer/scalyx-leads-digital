"use client";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Columns2,
  Copy,
  Download,
  Eye,
  FileCode,
  FolderClock,
  Layers,
  LayoutTemplate,
  Loader2,
  Monitor,
  PanelLeft,
  PanelLeftClose,
  PenLine,
  Plus,
  Printer,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  LEXCONNECT_FULL_PROPOSAL,
  PROPOSAL_PRESETS,
} from "@/lib/proposal/presets";
import {
  PROPOSAL_SNIPPETS,
  type ProposalSnippet,
} from "@/lib/proposal/snippets";
import {
  ProposalBlock,
  blocksToMarkdown,
  createBlankProposalBlocks,
  createBlockFromSnippet,
  generateBlockId,
  markdownToBlocks,
} from "@/lib/proposal/blocks";
import { VisualBlockEditor } from "@/components/proposal/VisualBlockEditor";
import {
  SavedDocumentsModal,
  type SavedDocSummary,
} from "@/components/common/SavedDocumentsModal";
import type { SavedProposalDoc } from "@/types/savedDocument";
import type { Lead } from "@/types/lead";

export default function ProposalsPage() {
  const [selectedPresetId, setSelectedPresetId] = useState("lexconnect");
  const [blocks, setBlocks] = useState<ProposalBlock[]>(() =>
    markdownToBlocks(LEXCONNECT_FULL_PROPOSAL),
  );
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewDocHeight, setPreviewDocHeight] = useState<number>(1400);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [showSnippets, setShowSnippets] = useState<boolean>(false);
  const [isSignoffModalOpen, setIsSignoffModalOpen] = useState<boolean>(false);
  const [isComponentCatalogOpen, setIsComponentCatalogOpen] =
    useState<boolean>(false);
  const [isRawMarkdownModalOpen, setIsRawMarkdownModalOpen] =
    useState<boolean>(false);

  const [signoffClientName, setSignoffClientName] = useState<string>("");
  const [signoffSignee, setSignoffSignee] = useState<string>("");
  const [signoffEmail, setSignoffEmail] = useState<string>("");
  const [signoffScope, setSignoffScope] = useState<string>(
    "Full Technical Architecture & Turnkey Delivery",
  );
  const [signoffInvestment, setSignoffInvestment] = useState<string>(
    "₹85,000 INR (2 Phases)",
  );

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">(
    "split",
  );
  const [leads, setLeads] = useState<Lead[]>([]);
  const [copiedType, setCopiedType] = useState<"md" | "html" | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Persistence & Draft Management State
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [docName, setDocName] = useState<string>(
    "LexConnect Architecture Proposal",
  );
  const [savedProposals, setSavedProposals] = useState<SavedProposalDoc[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Storage Keys
  const PROPOSALS_STORAGE_KEY = "scalyx_saved_proposals";
  const CURRENT_PROPOSAL_ID_KEY = "scalyx_current_proposal_id";

  // Derive proposal metadata (title, client, deal value)
  const proposalMetadata = useMemo(() => {
    let title = "Technical Architecture Proposal";
    let clientName = "";
    let dealValue = "";

    for (const b of blocks) {
      if (b.type === "title_meta") {
        if (b.title) title = b.title;
        if (b.preparedFor) clientName = b.preparedFor;
      } else if (b.type === "commercial_quotation") {
        if (b.totalInvestment) dealValue = b.totalInvestment;
      } else if (b.type === "signoff") {
        if (!clientName && b.clientName) clientName = b.clientName;
        if (!dealValue && b.investment) dealValue = b.investment;
      }
    }

    return { title, clientName, dealValue };
  }, [blocks]);

  // Derive compiled markdown from visual blocks
  const markdown = useMemo(() => {
    return blocksToMarkdown(blocks);
  }, [blocks]);

  // Load saved drafts from localStorage and API on mount
  useEffect(() => {
    try {
      const local = localStorage.getItem(PROPOSALS_STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedProposals(parsed);
        }
      }
      const storedId = localStorage.getItem(CURRENT_PROPOSAL_ID_KEY);
      if (storedId) {
        setCurrentDocId(storedId);
      }
    } catch (e) {
      console.error("Local storage read error:", e);
    }

    async function loadSavedFromApi() {
      try {
        setIsLoadingSaved(true);
        const res = await fetch("/api/proposals");
        const data = await res.json();
        if (data.proposals && Array.isArray(data.proposals)) {
          setSavedProposals(data.proposals);
          localStorage.setItem(
            PROPOSALS_STORAGE_KEY,
            JSON.stringify(data.proposals),
          );
        }
      } catch (err) {
        console.error("Failed to load saved proposals from API:", err);
      } finally {
        setIsLoadingSaved(false);
      }
    }
    loadSavedFromApi();
  }, []);

  // Persist helper
  const persistProposal = async (
    targetId: string,
    targetBlocks: ProposalBlock[],
  ) => {
    try {
      setSaveStatus("saving");
      const now = new Date().toISOString();
      const docToSave: SavedProposalDoc = {
        id: targetId,
        name:
          docName.trim() ||
          proposalMetadata.title ||
          "Scalyx Technical Proposal",
        title: proposalMetadata.title || "Scalyx Technical Proposal",
        clientName: proposalMetadata.clientName,
        dealValue: proposalMetadata.dealValue,
        blocks: targetBlocks,
        updatedAt: now,
        createdAt: now,
        isDraft: true,
      };

      // 1. Instant local update
      setSavedProposals((prev) => {
        const withoutCurrent = prev.filter((p) => p.id !== targetId);
        const updated = [docToSave, ...withoutCurrent];
        try {
          localStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(updated));
          localStorage.setItem(CURRENT_PROPOSAL_ID_KEY, targetId);
        } catch (e) {
          console.error("Local storage write error:", e);
        }
        return updated;
      });

      // 2. Background sync to backend API
      await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal: docToSave }),
      });

      setSaveStatus("saved");
      setLastSavedTime(new Date());
    } catch (err) {
      console.error("Failed to save proposal:", err);
      setSaveStatus("error");
    }
  };

  // 1-second debounced auto-save
  useEffect(() => {
    if (!hasUserEdited && !currentDocId) {
      return;
    }

    setSaveStatus("saving");
    const docId =
      currentDocId ||
      `prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    if (!currentDocId) {
      setCurrentDocId(docId);
    }

    const timer = setTimeout(() => {
      persistProposal(docId, blocks);
    }, 1000);

    return () => clearTimeout(timer);
  }, [blocks, docName, hasUserEdited]);

  // Fetch leads for autofill
  useEffect(() => {
    async function loadLeads() {
      try {
        const res = await fetch("/api/leads");
        const data = await res.json();
        if (data.leads) setLeads(data.leads);
      } catch (err) {
        console.error("Failed to load leads for proposal studio:", err);
      }
    }
    loadLeads();
  }, []);

  // Debounced proposal rendering into live A4 HTML
  useEffect(() => {
    let isCancelled = false;
    async function renderContent() {
      try {
        setIsRendering(true);
        const res = await fetch("/api/proposals/render", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ markdown }),
        });
        const data = await res.json();
        if (!isCancelled && data.html) {
          setPreviewHtml(data.html);
        }
      } catch (err) {
        console.error("Failed to render proposal markdown:", err);
      } finally {
        if (!isCancelled) setIsRendering(false);
      }
    }

    const timer = setTimeout(renderContent, 200);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [markdown]);

  // Listen to height messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data &&
        event.data.type === "PROPOSAL_DOCUMENT_HEIGHT" &&
        typeof event.data.height === "number" &&
        event.data.height > 200
      ) {
        setPreviewDocHeight(event.data.height);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleBlocksChange = (newBlocks: ProposalBlock[]) => {
    setBlocks(newBlocks);
    setHasUserEdited(true);
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = PROPOSAL_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const parsedBlocks = markdownToBlocks(preset.markdown);
      setBlocks(parsedBlocks);
      setDocName(`${preset.name.split("(")[0].trim()} Proposal`);
      setCurrentDocId(null);
      setHasUserEdited(false);
      setSaveStatus("idle");
      setNotification({
        type: "success",
        message: `Loaded "${preset.name}" visual proposal template!`,
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleCreateBlank = () => {
    const blankBlocks = createBlankProposalBlocks();
    const docId = `prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setBlocks(blankBlocks);
    setDocName("New Blank Proposal");
    setSelectedPresetId("blank");
    setCurrentDocId(docId);
    setHasUserEdited(true);
    persistProposal(docId, blankBlocks);
    setNotification({
      type: "success",
      message: "Created new blank proposal canvas!",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExplicitSave = () => {
    const docId =
      currentDocId ||
      `prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setCurrentDocId(docId);
    setHasUserEdited(true);
    persistProposal(docId, blocks);
    setNotification({
      type: "success",
      message: `Draft "${docName || "Proposal"}" saved to storage!`,
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLoadSavedProposal = (id: string) => {
    const found = savedProposals.find((p) => p.id === id);
    if (found) {
      setBlocks(found.blocks);
      setCurrentDocId(found.id);
      setDocName(found.name || found.title || "Custom Proposal Draft");
      setSelectedPresetId("custom");
      setHasUserEdited(true);
      setSaveStatus("saved");
      setNotification({
        type: "success",
        message: `Loaded draft "${found.name || found.title}"!`,
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDeleteSavedProposal = async (id: string) => {
    try {
      const updated = savedProposals.filter((p) => p.id !== id);
      setSavedProposals(updated);
      try {
        localStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Local storage delete error:", e);
      }
      if (currentDocId === id) {
        setCurrentDocId(null);
      }
      await fetch(`/api/proposals?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setNotification({
        type: "success",
        message: "Deleted saved proposal draft.",
      });
      setTimeout(() => setNotification(null), 2500);
    } catch (err) {
      console.error("Failed to delete proposal:", err);
    }
  };

  const handleInsertSnippet = (snippet: ProposalSnippet) => {
    if (snippet.id === "signoff_acceptance") {
      setIsComponentCatalogOpen(false);
      setIsSignoffModalOpen(true);
      return;
    }

    const newBlock = createBlockFromSnippet(snippet.id);
    setBlocks((prev) => [...prev, newBlock]);

    setNotification({
      type: "success",
      message: `Added "${snippet.name}" component block!`,
    });
    setTimeout(() => setNotification(null), 2500);
  };

  const handleConfirmInsertSignoff = () => {
    const clientName = signoffClientName.trim() || "[Client Company or Name]";
    const signee = signoffSignee.trim() || "[Representative Name / Title]";
    const email = signoffEmail.trim() || "client@company.com";
    const scope =
      signoffScope.trim() || "Full Technical Architecture & Turnkey Delivery";
    const investment =
      signoffInvestment.trim() || "As per agreed milestone schedule";

    const signoffBlock: ProposalBlock = {
      id: generateBlockId("signoff"),
      type: "signoff",
      clientName,
      signee,
      email,
      scope,
      investment,
      agency: "Scalyx",
      website: "https://scalyx.in",
      agencyEmail: "contact@scalyx.in",
      helpline: "+91 8927124748 (Call & WhatsApp)",
    };

    setBlocks((prev) => [...prev, signoffBlock]);
    setIsSignoffModalOpen(false);
    setNotification({
      type: "success",
      message: `Added customized Sign-off Grid for "${clientName}"!`,
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAutofillLead = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const clientName = lead.company || lead.name || "Client";
    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    setSignoffClientName(clientName);
    setSignoffSignee(lead.name || "");
    setSignoffEmail(lead.email || "");
    const prefix = lead.currency === "USD" ? "$" : "₹";
    const formattedVal = lead.dealValue
      ? `${prefix}${lead.dealValue.toLocaleString("en-IN")}`
      : "";
    if (formattedVal) {
      setSignoffInvestment(`${formattedVal} (2 Phases)`);
    }

    // Update matching visual blocks directly
    setBlocks((prev) => {
      return prev.map((block) => {
        if (block.type === "title_meta") {
          return {
            ...block,
            preparedFor: clientName,
            date: dateStr,
          };
        }
        if (block.type === "signoff") {
          return {
            ...block,
            clientName,
            signee: lead.name || block.signee,
            email: lead.email || block.email,
            investment: formattedVal
              ? `${formattedVal} (Agreed Schedule)`
              : block.investment,
          };
        }
        if (block.type === "commercial_quotation" && formattedVal) {
          return {
            ...block,
            totalInvestment: formattedVal,
          };
        }
        return block;
      });
    });

    setNotification({
      type: "success",
      message: `Autofilled document metadata & sign-off blocks for "${clientName}"!`,
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePrint = () => {
    const iframe = iframeRef.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } else {
      window.print();
    }
  };

  const handleCopy = (type: "md" | "html") => {
    const content = type === "md" ? markdown : previewHtml;
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setNotification({
      type: "success",
      message:
        type === "md"
          ? "Copied proposal Markdown to clipboard!"
          : "Copied compiled HTML document to clipboard!",
    });
    setTimeout(() => {
      setCopiedType(null);
      setNotification(null);
    }, 2500);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Scalyx_Proposal_${selectedPresetId}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = [
    "All",
    "Header & Meta",
    "Scope & Features",
    "Architecture & Tech",
    "Commercial & Sign-off",
  ];

  const filteredSnippets = PROPOSAL_SNIPPETS.filter((s) => {
    const matchesCat =
      activeCategory === "All" || s.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 text-foreground bg-background overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 border rounded-xl text-xs font-semibold max-w-md shadow-xl ${
              notification.type === "success"
                ? "bg-card text-emerald-600 border-emerald-500/20"
                : "bg-card text-rose-600 border-rose-500/20"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle className="size-4 shrink-0 text-rose-500" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* MOBILE SCREEN BLOCKER (< 1024px) */}
      <div className="lg:hidden flex-1 flex flex-col items-center justify-center p-6 text-center h-full">
        <div className="max-w-md w-full bg-card border border-border/80 p-8 rounded-2xl shadow-sm flex flex-col items-center">
          <div className="size-14 bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 mb-4 rounded-xl">
            <Monitor className="size-7" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 border border-amber-500/20 mb-3 rounded-full">
            Desktop Viewport Required
          </span>
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">
            Please Open on Desktop
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed mb-6">
            Proposal Studio is a visual block editor and document compiler
            designed for desktop screens. To configure visual components, drag
            and reorder blocks, and compile print-ready A4 PDF proposals, please
            access this page from a desktop device.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 w-full">
            <Link
              href="/leads"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg"
            >
              Back to Leads Record
            </Link>
            <Link
              href="/emails"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors rounded-lg"
            >
              Open Email Sender
            </Link>
          </div>
        </div>
      </div>

      {/* DESKTOP WORKSPACE (>= 1024px) */}
      <div className="hidden lg:flex flex-col flex-1 min-h-0 h-full overflow-hidden">
        <div className="shrink-0">
          <AppNavbar
            title="Proposal Studio"
            description="Drag-and-drop visual component blocks with intuitive fields. No Markdown syntax required."
            actions={
              <div className="flex items-center gap-2">
                {/* Create Blank Proposal Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCreateBlank}
                  className="gap-1.5 text-xs font-medium rounded-lg border-border"
                  title="Create a new blank proposal from scratch"
                >
                  <Plus className="size-3.5" />
                  <span>New Blank</span>
                </Button>

                {/* Saved Proposals Popup List Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSavedModalOpen(true)}
                  className="gap-1.5 text-xs font-medium rounded-lg border-border"
                  title="View and load saved proposals & drafts"
                >
                  <FolderClock className="size-3.5 text-primary" />
                  <span>Saved Drafts ({savedProposals.length})</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRawMarkdownModalOpen(true)}
                  className="gap-1.5 text-xs font-medium rounded-lg border-border"
                  title="View / Copy compiled Markdown output"
                >
                  <FileCode className="size-3.5 text-primary" />
                  <span className="hidden sm:inline">Markdown</span>
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handlePrint}
                  className="gap-1.5 text-xs font-semibold rounded-lg shadow-xs bg-primary text-primary-foreground hover:bg-primary/90"
                  title="Print to PDF (A4 Page Fit)"
                >
                  <Printer className="size-3.5" />
                  <span>Print / PDF</span>
                </Button>
              </div>
            }
          />
        </div>

        <div className="p-3 xl:p-4 space-y-2.5 flex-1 flex flex-col min-h-0 h-full overflow-hidden">
          {/* Elegant Workspace Toolbar */}
          <div className="bg-card border border-border/70 rounded-xl px-3 py-2 shadow-xs shrink-0 flex flex-wrap items-center justify-between gap-2.5">
            {/* Left: Draft Name & Status */}
            <div className="flex items-center gap-2.5 min-w-0">
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
                  placeholder="Proposal Name..."
                  className="h-5 w-44 sm:w-56 md:w-64 text-xs font-semibold bg-transparent border-0 focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground/60 truncate"
                  title="Name this proposal draft to easily identify it later in your saved drafts"
                />
              </div>

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

              {/* Template Selector as sleek inline select */}
              <div className="hidden md:flex items-center gap-1.5 text-xs">
                <LayoutTemplate className="size-3.5 text-muted-foreground shrink-0" />
                <select
                  value={selectedPresetId}
                  onChange={(e) => handleSelectPreset(e.target.value)}
                  className="h-7 px-2 pr-6 rounded-lg bg-background hover:bg-muted/40 border border-border/80 text-xs font-medium text-foreground focus:outline-none transition-colors cursor-pointer"
                  title="Load a preset template"
                >
                  {PROPOSAL_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      Template: {p.name.split("(")[0].trim()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Autofill with Lead Dropdown */}
              {leads.length > 0 && (
                <div className="hidden lg:flex items-center gap-1.5 text-xs">
                  <Users className="size-3.5 text-muted-foreground shrink-0" />
                  <select
                    onChange={(e) =>
                      e.target.value && handleAutofillLead(e.target.value)
                    }
                    defaultValue=""
                    className="h-7 px-2 pr-6 rounded-lg bg-background hover:bg-muted/40 border border-border/80 text-xs font-medium text-foreground focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="" disabled>
                      Autofill Lead...
                    </option>
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.company || l.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Right: Action Buttons & View Mode Switcher */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Custom Client Sign-Off Quick Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsSignoffModalOpen(true)}
                className="h-7 px-2 rounded-lg text-xs font-medium gap-1 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                title="Configure client acceptance sign-off block"
              >
                <PenLine className="size-3 text-primary" />
                <span className="hidden sm:inline">Sign-Off</span>
              </Button>

              {/* Component Catalog Modal Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsComponentCatalogOpen(true)}
                className="h-7 px-2.5 rounded-lg text-xs font-medium gap-1.5 border-border/80 bg-background hover:bg-muted/60 shadow-2xs"
                title="Open Component Catalog modal"
              >
                <Layers className="size-3.5 text-primary" />
                <span>Catalog</span>
              </Button>

              {/* Component Drawer Toggle */}
              <button
                type="button"
                onClick={() => setShowSnippets((prev) => !prev)}
                className={`h-7 px-2 flex items-center gap-1 border rounded-lg text-xs font-medium transition-colors ${
                  showSnippets
                    ? "bg-muted text-foreground border-border"
                    : "bg-card text-muted-foreground hover:text-foreground border-border"
                }`}
                title="Toggle Side Component Palette"
              >
                {showSnippets ? (
                  <PanelLeftClose className="size-3.5 text-primary" />
                ) : (
                  <PanelLeft className="size-3.5" />
                )}
                <span className="hidden sm:inline">Palette</span>
              </button>

              <div className="h-4 w-px bg-border/70" />

              {/* View Mode Switcher */}
              <div className="flex items-center border border-border/80 rounded-lg bg-muted/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("split")}
                  className={`px-2 py-0.5 flex items-center gap-1 text-[11px] font-medium rounded-md transition-colors ${
                    viewMode === "split"
                      ? "bg-card text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Split Visual Editor & Live Preview"
                >
                  <Columns2 className="size-3" />
                  <span>Split</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("edit")}
                  className={`px-2 py-0.5 flex items-center gap-1 text-[11px] font-medium transition-colors ${
                    viewMode === "edit"
                      ? "bg-card text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Visual Block Editor Only"
                >
                  <LayoutTemplate className="size-3" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("preview")}
                  className={`px-2 py-0.5 flex items-center gap-1 text-[11px] font-medium transition-colors ${
                    viewMode === "preview"
                      ? "bg-card text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Live A4 Document Preview Only"
                >
                  <Eye className="size-3" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          </div>

          {/* Locked Grid Workspace: Visual Block Editor & Preview scroll independently */}
          <div className="grid grid-cols-12 grid-rows-1 gap-3.5 items-stretch flex-1 min-h-0 h-full overflow-hidden">
            {/* Left Sidebar: Prestyled Component Palette */}
            {showSnippets && (
              <div className="col-span-3 xl:col-span-3 2xl:col-span-2 bg-card border border-border/80 rounded-xl shadow-xs p-3 space-y-2.5 h-full min-h-0 flex flex-col overflow-hidden">
                <div className="shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Layers className="size-3.5 text-primary" />
                      Components
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-[10px] rounded-full px-2 py-0 border-border"
                    >
                      {filteredSnippets.length}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    Click Insert to add visual component block.
                  </p>
                </div>

                {/* Component Search */}
                <div className="relative shrink-0">
                  <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                  <Input
                    placeholder="Search blocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-xs rounded-lg"
                  />
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-1 shrink-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`text-[10px] px-2.5 py-0.5 font-medium border rounded-full transition-colors ${
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Snippets List */}
                <div className="space-y-1.5 pt-1 flex-1 min-h-0 overflow-y-auto pr-1">
                  {filteredSnippets.map((snippet) => (
                    <div
                      key={snippet.id}
                      className="p-2.5 border border-border/70 hover:border-primary/60 bg-muted/10 hover:bg-muted/30 transition-all rounded-xl group text-left"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                          {snippet.name}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleInsertSnippet(snippet)}
                          className="shrink-0 p-1 px-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-[10px] flex items-center gap-0.5 font-semibold"
                          title="Insert visual block"
                        >
                          <Plus className="size-3" />
                          <span>Insert</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-tight">
                        {snippet.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Middle Pane: FULLY VISUAL WYSIWYG BLOCK EDITOR */}
            {(viewMode === "split" || viewMode === "edit") && (
              <div
                className={`${
                  viewMode === "edit"
                    ? showSnippets
                      ? "col-span-9 xl:col-span-9 2xl:col-span-10"
                      : "col-span-12"
                    : showSnippets
                      ? "col-span-5 xl:col-span-5 2xl:col-span-5"
                      : "col-span-6"
                } bg-card border border-border/80 rounded-xl shadow-xs flex flex-col h-full min-h-0 overflow-hidden`}
              >
                <VisualBlockEditor
                  blocks={blocks}
                  onChange={handleBlocksChange}
                  onInsertSnippet={(snippetId) => {
                    const s = PROPOSAL_SNIPPETS.find((sp) => sp.id === snippetId);
                    if (s) handleInsertSnippet(s);
                  }}
                />
              </div>
            )}

            {/* Right Pane: Live Document Preview */}
            {(viewMode === "split" || viewMode === "preview") && (
              <div
                className={`${
                  viewMode === "preview"
                    ? showSnippets
                      ? "col-span-9 xl:col-span-9 2xl:col-span-10"
                      : "col-span-12"
                    : showSnippets
                      ? "col-span-4 xl:col-span-4 2xl:col-span-5"
                      : "col-span-6"
                } bg-card border border-border/80 rounded-xl shadow-xs flex flex-col h-full min-h-0 overflow-hidden`}
              >
                {/* Preview Bar */}
                <div className="p-2 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Document Preview (A4 Scaled)
                    </span>
                    {isRendering && (
                      <RefreshCw className="size-3 animate-spin text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy("html")}
                      className="h-7 px-2 text-[11px] rounded-lg gap-1"
                    >
                      {copiedType === "html" ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      <span>Copy HTML</span>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handlePrint}
                      className="h-7 px-2.5 text-[11px] rounded-lg gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Printer className="size-3" />
                      <span>Print PDF</span>
                    </Button>
                  </div>
                </div>

                {/* Preview Container: strictly scrolls the document within its pane */}
                <div className="flex-1 min-h-0 overflow-y-auto bg-slate-100 dark:bg-slate-900/60 p-4 xl:p-6 flex justify-center">
                  <div className="w-full max-w-[840px] bg-white text-slate-900 shadow-xl border border-slate-200 h-fit shrink-0">
                    <iframe
                      ref={iframeRef}
                      title="Proposal Live Blueprint Preview"
                      srcDoc={previewHtml}
                      onLoad={() => {
                        try {
                          const doc = iframeRef.current?.contentDocument;
                          if (doc) {
                            const h = Math.max(
                              doc.documentElement.scrollHeight,
                              doc.body.scrollHeight,
                            );
                            if (h > 200) setPreviewDocHeight(h);
                          }
                        } catch {
                          // Handled via postMessage
                        }
                      }}
                      className="w-full border-none block"
                      style={{
                        height: `${previewDocHeight}px`,
                        minHeight: "100%",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1. Client Sign-Off & Acceptance Customization Modal */}
      <Dialog open={isSignoffModalOpen} onOpenChange={setIsSignoffModalOpen}>
        <DialogContent className="w-[94vw] sm:max-w-lg md:max-w-xl bg-card rounded-2xl p-6 shadow-2xl">
          <DialogHeader className="pb-3 border-b border-border/80">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <PenLine className="size-4 text-primary shrink-0" />
              <span>Customize Client Sign-off & Acceptance Grid</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Specify the client details, authorized representative, scope, and
              total investment for this proposal document.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Quick Autofill from Leads Database */}
            {leads.length > 0 && (
              <div className="p-3 bg-muted/40 border border-border/80 rounded-xl space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Users className="size-3.5 text-primary" />
                  <span>Quick Autofill with Registered Lead</span>
                </label>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const selectedLead = leads.find(
                      (l) => l.id === e.target.value,
                    );
                    if (selectedLead) {
                      setSignoffClientName(
                        selectedLead.company || selectedLead.name,
                      );
                      setSignoffSignee(selectedLead.name);
                      setSignoffEmail(selectedLead.email);
                      if (selectedLead.dealValue) {
                        const prefix =
                          selectedLead.currency === "USD" ? "$" : "₹";
                        setSignoffInvestment(
                          `${prefix}${selectedLead.dealValue.toLocaleString("en-IN")}`,
                        );
                      }
                    }
                  }}
                  className="w-full h-9 px-3 rounded-lg bg-background border border-input text-xs text-foreground focus:outline-none"
                >
                  <option value="" disabled>
                    Select lead to auto-populate...
                  </option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.company || l.name} ({l.name} — {l.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Client / Company Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={signoffClientName}
                  onChange={(e) => setSignoffClientName(e.target.value)}
                  placeholder="e.g. LexConnect Legal Tech"
                  className="h-9 text-xs rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Authorized Signee / Title
                </label>
                <Input
                  value={signoffSignee}
                  onChange={(e) => setSignoffSignee(e.target.value)}
                  placeholder="e.g. Adv. Rohit Mehra, Founder"
                  className="h-9 text-xs rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Client Contact Email
                </label>
                <Input
                  type="email"
                  value={signoffEmail}
                  onChange={(e) => setSignoffEmail(e.target.value)}
                  placeholder="e.g. rohit@lexconnect.in"
                  className="h-9 text-xs rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Total Commercial Investment
                </label>
                <Input
                  value={signoffInvestment}
                  onChange={(e) => setSignoffInvestment(e.target.value)}
                  placeholder="e.g. ₹85,000 INR (2 Phases)"
                  className="h-9 text-xs rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Agreed Scope of Delivery
              </label>
              <Input
                value={signoffScope}
                onChange={(e) => setSignoffScope(e.target.value)}
                placeholder="e.g. Full Technical Architecture & Turnkey Delivery"
                className="h-9 text-xs rounded-lg"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSignoffModalOpen(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmInsertSignoff}
              className="font-semibold rounded-lg bg-primary text-primary-foreground gap-1.5"
            >
              <Check className="size-3.5" />
              <span>Insert Sign-off Block</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Component Catalog Dialog */}
      <Dialog
        open={isComponentCatalogOpen}
        onOpenChange={setIsComponentCatalogOpen}
      >
        <DialogContent className="w-[94vw] sm:max-w-2xl md:max-w-3xl bg-card rounded-2xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
          <DialogHeader className="pb-3 border-b border-border/80 shrink-0">
            <DialogTitle className="text-base font-bold flex items-center justify-between text-foreground">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-primary shrink-0" />
                <span>
                  Components Catalog ({PROPOSAL_SNIPPETS.length} Pre-Styled
                  Blocks)
                </span>
              </div>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Click any component to insert it directly into your visual proposal
              blocks flow.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3 flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <div className="relative flex-1">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search components by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-9 text-xs rounded-lg"
                />
              </div>
              <div className="flex flex-wrap gap-1 shrink-0 items-center">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs px-2.5 py-1 font-medium border rounded-full transition-colors ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 overflow-y-auto flex-1 min-h-0 pr-1">
              {filteredSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className="p-3.5 border border-border/80 hover:border-primary/60 bg-muted/10 hover:bg-muted/30 transition-all rounded-xl flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-xs text-foreground">
                        {snippet.name}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                        {snippet.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {snippet.description}
                    </p>
                  </div>
                  <div className="flex justify-end pt-1">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        handleInsertSnippet(snippet);
                        if (snippet.id !== "signoff_acceptance") {
                          setIsComponentCatalogOpen(false);
                        }
                      }}
                      className="h-7 px-3 text-xs rounded-lg gap-1 font-semibold"
                    >
                      <Plus className="size-3" />
                      <span>
                        {snippet.id === "signoff_acceptance"
                          ? "Configure & Insert"
                          : "Insert Block"}
                      </span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border/80 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsComponentCatalogOpen(false)}
              className="rounded-lg"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. View Compiled Markdown Code Modal */}
      <Dialog
        open={isRawMarkdownModalOpen}
        onOpenChange={setIsRawMarkdownModalOpen}
      >
        <DialogContent className="w-[94vw] sm:max-w-2xl md:max-w-3xl bg-card rounded-2xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
          <DialogHeader className="pb-3 border-b border-border/80 shrink-0">
            <DialogTitle className="text-base font-bold flex items-center justify-between text-foreground">
              <div className="flex items-center gap-2">
                <FileCode className="size-4 text-primary shrink-0" />
                <span>Compiled Proposal Markdown</span>
              </div>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Clean Markdown generated from your visual blocks. You can copy or
              download this for version control or exports.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 flex-1 min-h-0 flex flex-col">
            <Textarea
              readOnly
              value={markdown}
              rows={16}
              className="font-mono text-xs p-3.5 bg-muted/30 border border-border rounded-xl resize-none flex-1 overflow-y-auto leading-relaxed"
            />
          </div>

          <DialogFooter className="pt-2 border-t border-border/80 flex items-center justify-between sm:justify-between w-full">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadMd}
              className="gap-1.5 text-xs font-semibold rounded-lg"
            >
              <Download className="size-3.5" />
              <span>Download .md</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsRawMarkdownModalOpen(false)}
                className="rounded-lg text-xs"
              >
                Close
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => handleCopy("md")}
                className="gap-1.5 text-xs font-semibold rounded-lg shadow-xs"
              >
                {copiedType === "md" ? (
                  <Check className="size-3.5 text-emerald-400" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span>Copy to Clipboard</span>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Saved Proposals & Drafts Modal */}
      <SavedDocumentsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        documentType="proposal"
        documents={savedProposals.map((p) => ({
          id: p.id,
          name: p.name,
          title: p.title,
          clientName: p.clientName,
          clientCompany: p.clientCompany,
          dealValue: p.dealValue,
          updatedAt: p.updatedAt,
          createdAt: p.createdAt,
          blocksCount: p.blocks?.length || 0,
        }))}
        currentId={currentDocId}
        onLoad={handleLoadSavedProposal}
        onDelete={handleDeleteSavedProposal}
        onCreateBlank={handleCreateBlank}
        isLoading={isLoadingSaved}
      />
    </div>
  );
}
