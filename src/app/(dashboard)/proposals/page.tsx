"use client";

import {
  AlertCircle,
  Bold,
  Check,
  CheckCircle2,
  Code2,
  Columns2,
  Copy,
  Download,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Layers,
  LayoutTemplate,
  List,
  ListOrdered,
  Monitor,
  PanelLeft,
  PanelLeftClose,
  Plus,
  Printer,
  Quote,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { Lead } from "@/types/lead";

export default function ProposalsPage() {
  const [selectedPresetId, setSelectedPresetId] = useState("lexconnect");
  const [markdown, setMarkdown] = useState<string>(LEXCONNECT_FULL_PROPOSAL);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewDocHeight, setPreviewDocHeight] = useState<number>(1400);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [showSnippets, setShowSnippets] = useState<boolean>(true);
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

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // Debounced proposal rendering
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

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = PROPOSAL_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setMarkdown(preset.markdown);
      setNotification({
        type: "success",
        message: `Loaded "${preset.name}" preset template!`,
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleInsertSnippet = (snippet: ProposalSnippet) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setMarkdown((prev) => `${prev}\n\n${snippet.markdown}\n`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;

    const before = current.substring(0, start);
    const after = current.substring(end);

    const insertion = `\n\n${snippet.markdown}\n\n`;
    const newText = before + insertion + after;

    setMarkdown(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + insertion.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 50);

    setNotification({
      type: "success",
      message: `Inserted "${snippet.name}" component!`,
    });
    setTimeout(() => setNotification(null), 2500);
  };

  const handleFormat = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = textarea.value;
    const selected = current.substring(start, end) || "text";

    const newText =
      current.substring(0, start) +
      prefix +
      selected +
      suffix +
      current.substring(end);

    setMarkdown(newText);

    setTimeout(() => {
      textarea.focus();
      const cursor = start + prefix.length + selected.length + suffix.length;
      textarea.setSelectionRange(cursor, cursor);
    }, 50);
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

    let updated = markdown;
    updated = updated.replace(
      /(\*\*Client:\*\*)\s*([^\n]+)/g,
      `$1 ${clientName}`,
    );
    updated = updated.replace(/(\*\*Date:\*\*)\s*([^\n]+)/g, `$1 ${dateStr}`);
    if (lead.dealValue) {
      const prefix = lead.currency === "USD" ? "$" : "₹";
      const formattedVal = `${prefix}${lead.dealValue.toLocaleString("en-IN")}`;
      updated = updated.replace(
        /(\*\*Total Investment:\*\*)\s*([^\n]+)/g,
        `$1 ${formattedVal}`,
      );
    }

    setMarkdown(updated);
    setNotification({
      type: "success",
      message: `Autofilled document metadata for "${clientName}"!`,
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
          ? "Copied raw Markdown to clipboard!"
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
    "Structure",
    "Technical",
    "Financial",
    "Legal & Close",
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

  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
  const lineCount = markdown.split("\n").length;

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 text-foreground bg-background overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 border rounded-none text-xs font-semibold max-w-md shadow-xl ${
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
        <div className="max-w-md w-full bg-card border border-border p-8 rounded-none shadow-sm flex flex-col items-center">
          <div className="size-14 bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 mb-4 rounded-none">
            <Monitor className="size-7" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 border border-amber-500/20 mb-3">
            Desktop Viewport Required
          </span>
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">
            Please Open on Desktop
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed mb-6">
            Proposal Studio is an architectural document compiler and blueprint
            engineering workspace designed for desktop screens. To write
            markdown, insert architecture components, and compile print-ready A4
            PDF proposals, please access this page from a desktop or laptop
            device.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 w-full">
            <Link
              href="/leads"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-none"
            >
              Back to Leads Record
            </Link>
            <Link
              href="/emails"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border transition-colors rounded-none"
            >
              Open Email Sender
            </Link>
          </div>
        </div>
      </div>

      {/* DESKTOP WORKSPACE (>= 1024px) - Strictly fits screen without outer scrolling */}
      <div className="hidden lg:flex flex-col flex-1 min-h-0 h-full overflow-hidden">
        <div className="shrink-0">
          <AppNavbar
            title="Proposal Studio & Architecture Blueprint Builder"
            description="Live RemarkGFM Markdown editor with prestyled components for technical blueprints and milestone quotations."
            actions={
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="gap-1.5 text-xs font-semibold rounded-none border-border"
                  title="Print to PDF (A4 Page Fit)"
                >
                  <Printer className="size-3.5" />
                  <span>Print / Save as PDF</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleCopy("md")}
                  className="gap-1.5 text-xs font-semibold rounded-none shadow-xs"
                >
                  {copiedType === "md" ? (
                    <Check className="size-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  <span>Copy Markdown</span>
                </Button>
              </div>
            }
          />
        </div>

        <div className="p-3 xl:p-4 space-y-2.5 flex-1 flex flex-col min-h-0 h-full overflow-hidden">
          {/* Preset Selector & Autofill Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-card border border-border rounded-none shadow-xs shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <LayoutTemplate className="size-3.5 text-primary" />
                Templates:
              </span>
              {PROPOSAL_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p.id)}
                  className={`px-3 py-1.5 text-xs font-semibold border rounded-none transition-all flex items-center gap-1.5 ${
                    selectedPresetId === p.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <span>{p.name.split("(")[0].trim()}</span>
                  {p.id === "lexconnect" && (
                    <span className="text-[10px] bg-primary-foreground/20 text-primary-foreground px-1 py-0.5 rounded-none font-bold">
                      Official Blueprint
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {leads.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <Users className="size-3.5 text-primary" />
                  <select
                    onChange={(e) =>
                      e.target.value && handleAutofillLead(e.target.value)
                    }
                    defaultValue=""
                    className="h-8 px-2 rounded-none bg-background border border-input text-xs text-foreground focus:outline-none"
                  >
                    <option value="" disabled>
                      Autofill with Lead...
                    </option>
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.company || l.name} ({l.name})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Component Drawer Toggle */}
              <button
                type="button"
                onClick={() => setShowSnippets((prev) => !prev)}
                className={`h-8 px-2.5 flex items-center gap-1.5 border rounded-none text-xs font-semibold transition-colors ${
                  showSnippets
                    ? "bg-muted text-foreground border-border"
                    : "bg-card text-muted-foreground hover:text-foreground border-border"
                }`}
                title="Toggle Component Palette"
              >
                {showSnippets ? (
                  <PanelLeftClose className="size-3.5 text-primary" />
                ) : (
                  <PanelLeft className="size-3.5" />
                )}
                <span>Components</span>
              </button>

              {/* View Mode Switcher */}
              <div className="flex items-center border border-border rounded-none bg-muted/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("split")}
                  className={`p-1 px-2.5 flex items-center gap-1 text-[11px] font-medium transition-colors ${
                    viewMode === "split"
                      ? "bg-card text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Split Editor & Preview"
                >
                  <Columns2 className="size-3.5" />
                  <span>Split</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("edit")}
                  className={`p-1 px-2.5 flex items-center gap-1 text-[11px] font-medium transition-colors ${
                    viewMode === "edit"
                      ? "bg-card text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Editor Only"
                >
                  <Code2 className="size-3.5" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("preview")}
                  className={`p-1 px-2.5 flex items-center gap-1 text-[11px] font-medium transition-colors ${
                    viewMode === "preview"
                      ? "bg-card text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Live A4 Document Preview"
                >
                  <Eye className="size-3.5" />
                  <span>Preview</span>
                </button>
              </div>
            </div>
          </div>

          {/* Locked Grid Workspace: Editor and Preview scroll independently */}
          <div className="grid grid-cols-12 grid-rows-1 gap-3.5 items-stretch flex-1 min-h-0 h-full overflow-hidden">
            {/* Left Sidebar: Prestyled Component Palette */}
            {showSnippets && (
              <div className="col-span-3 xl:col-span-3 2xl:col-span-2 bg-card border border-border rounded-none shadow-xs p-3 space-y-2.5 h-full min-h-0 flex flex-col overflow-hidden">
                <div className="shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Layers className="size-3.5 text-primary" />
                      Components
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-[10px] rounded-none px-1.5 py-0 border-border"
                    >
                      {filteredSnippets.length}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    Click to insert markdown component block.
                  </p>
                </div>

                {/* Component Search */}
                <div className="relative shrink-0">
                  <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                  <Input
                    placeholder="Search blocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 text-xs rounded-none"
                  />
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-1 shrink-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`text-[10px] px-2 py-0.5 font-medium border rounded-none transition-colors ${
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Snippets List: only this scrolls inside the palette */}
                <div className="space-y-1.5 pt-1 flex-1 min-h-0 overflow-y-auto pr-1">
                  {filteredSnippets.map((snippet) => (
                    <div
                      key={snippet.id}
                      className="p-2 border border-border/70 hover:border-primary/60 bg-muted/10 hover:bg-muted/30 transition-all rounded-none group text-left"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                          {snippet.name}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleInsertSnippet(snippet)}
                          className="shrink-0 p-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-[10px] flex items-center gap-0.5"
                          title="Insert snippet at cursor"
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

            {/* Middle Pane: Markdown Code Editor */}
            {(viewMode === "split" || viewMode === "edit") && (
              <div
                className={`${
                  viewMode === "edit"
                    ? showSnippets
                      ? "col-span-9 xl:col-span-9 2xl:col-span-10"
                      : "col-span-12"
                    : showSnippets
                      ? "col-span-4 xl:col-span-4 2xl:col-span-5"
                      : "col-span-6"
                } bg-card border border-border rounded-none shadow-xs flex flex-col h-full min-h-0 overflow-hidden`}
              >
                {/* Formatting Toolbar - Fixed at top of editor */}
                <div className="p-2 border-b border-border bg-muted/20 flex flex-wrap items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleFormat("**", "**")}
                      className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-none"
                      title="Bold (**text**)"
                    >
                      <Bold className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormat("*", "*")}
                      className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-none"
                      title="Italic (*text*)"
                    >
                      <Italic className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormat("`", "`")}
                      className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-none font-mono text-xs font-bold px-2"
                      title="Inline Code (`code`)"
                    >
                      `code`
                    </button>
                    <span className="text-border mx-1">|</span>
                    <button
                      type="button"
                      onClick={() => handleFormat("# ", "")}
                      className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-none"
                      title="Heading 1"
                    >
                      <Heading1 className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormat("## ", "")}
                      className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-none"
                      title="Heading 2"
                    >
                      <Heading2 className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormat("### ", "")}
                      className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-none"
                      title="Heading 3"
                    >
                      <Heading3 className="size-3.5" />
                    </button>
                    <span className="text-border mx-1">|</span>
                    <button
                      type="button"
                      onClick={() => handleFormat("- ", "")}
                      className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-none"
                      title="Bullet list"
                    >
                      <List className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormat("1. ", "")}
                      className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-none"
                      title="Numbered list"
                    >
                      <ListOrdered className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFormat("> ", "")}
                      className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-none"
                      title="Blockquote"
                    >
                      <Quote className="size-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span>{lineCount} lines</span>
                    <button
                      type="button"
                      onClick={handleDownloadMd}
                      className="p-1 hover:text-foreground"
                      title="Download .md file"
                    >
                      <Download className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Textarea Editor: strictly scrolls inside the editor */}
                <Textarea
                  ref={textareaRef}
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="Write your technical proposal in Markdown..."
                  className="w-full font-mono text-xs p-4 rounded-none border-none focus-visible:ring-0 flex-1 min-h-0 h-full resize-none leading-relaxed overflow-y-auto"
                  spellCheck={false}
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
                      ? "col-span-5 xl:col-span-5 2xl:col-span-5"
                      : "col-span-6"
                } bg-card border border-border rounded-none shadow-xs flex flex-col h-full min-h-0 overflow-hidden`}
              >
                {/* Preview Bar - Fixed at top of preview */}
                <div className="p-2 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="size-2 bg-emerald-500 animate-pulse" />
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
                      className="h-7 px-2 text-[11px] rounded-none gap-1"
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
                      className="h-7 px-2.5 text-[11px] rounded-none gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
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
    </div>
  );
}
