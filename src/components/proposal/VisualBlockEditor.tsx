"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Building,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Cloud,
  Code2,
  Copy,
  Cpu,
  CreditCard,
  DollarSign,
  FileCheck,
  FileText,
  FoldHorizontal,
  FolderTree,
  GripVertical,
  HelpCircle,
  Info,
  Kanban,
  Layers,
  LayoutTemplate,
  List,
  Milestone,
  MoveDown,
  MoveUp,
  PenLine,
  Plus,
  Scissors,
  Server,
  Sparkles,
  Table,
  Terminal,
  Trash2,
  Type,
  UnfoldHorizontal,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ProposalBlock,
  ArchitectureStep,
  createDefaultBlock,
  generateBlockId,
  getArchitectureSteps,
  stepsToFlow,
} from "@/lib/proposal/blocks";

interface VisualBlockEditorProps {
  blocks: ProposalBlock[];
  onChange: (blocks: ProposalBlock[]) => void;
  onInsertSnippet?: (snippetId: string) => void;
}

const BLOCK_META: Record<
  string,
  { label: string; icon: any; color: string; bg: string; badge: string }
> = {
  header: {
    label: "Scalyx Corporate Header",
    icon: Building,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    badge: "Letterhead",
  },
  title_meta: {
    label: "Document Title & Meta Card",
    icon: FileText,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    badge: "Cover & Meta",
  },
  stats: {
    label: "Key Metrics & KPI Grid",
    icon: Sparkles,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    badge: "KPIs",
  },
  section_header: {
    label: "Numbered Section Header",
    icon: Milestone,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    badge: "Section",
  },
  text: {
    label: "Narrative & Scope Content",
    icon: Type,
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-500/10 border-slate-500/20",
    badge: "Text",
  },
  architecture: {
    label: "Architecture Flow Terminal",
    icon: Cpu,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    badge: "Pipeline",
  },
  tech_stack_table: {
    label: "Technology Stack Table",
    icon: Server,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    badge: "Tech Table",
  },
  cloud_infra_table: {
    label: "Cloud Cost Estimates Table",
    icon: Cloud,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    badge: "Cloud Table",
  },
  feature_grid: {
    label: "Scope Deliverables Grid (2-Col)",
    icon: LayoutTemplate,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10 border-teal-500/20",
    badge: "Scope",
  },
  scale_grid: {
    label: "Scale-Up Architecture Grid (2-Col)",
    icon: Kanban,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    badge: "Scaling",
  },
  callout_green: {
    label: "Budget Recommendation Callout",
    icon: DollarSign,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    badge: "Budget Callout",
  },
  callout_amber: {
    label: "Policy & Architecture Callout",
    icon: AlertCircle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    badge: "Policy Callout",
  },
  commercial_quotation: {
    label: "Commercial Quote Summary",
    icon: CreditCard,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    badge: "Commercial",
  },
  milestones: {
    label: "Payment Milestones Timeline",
    icon: Calendar,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    badge: "Milestones",
  },
  signoff: {
    label: "Sign-Off & Client Acceptance Grid",
    icon: PenLine,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    badge: "Sign-Off",
  },
  page_break: {
    label: "A4 Page Break Divider",
    icon: Scissors,
    color: "text-zinc-500 dark:text-zinc-400",
    bg: "bg-zinc-500/10 border-zinc-500/20",
    badge: "Page Break",
  },
  footer: {
    label: "Running Document Footer",
    icon: FileCheck,
    color: "text-zinc-500 dark:text-zinc-400",
    bg: "bg-zinc-500/10 border-zinc-500/20",
    badge: "Footer",
  },
};

export function VisualBlockEditor({
  blocks,
  onChange,
  onInsertSnippet,
}: VisualBlockEditorProps) {
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [insertPopoverIndex, setInsertPopoverIndex] = useState<number | null>(
    null,
  );

  // Toggle Collapse
  const toggleCollapse = (id: string) => {
    setCollapsedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const collapseAll = () => {
    const map: Record<string, boolean> = {};
    blocks.forEach((b) => (map[b.id] = true));
    setCollapsedMap(map);
  };

  const expandAll = () => {
    setCollapsedMap({});
  };

  // Move Block Up / Down
  const moveBlock = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);
    onChange(newBlocks);
  };

  // Duplicate Block
  const duplicateBlock = (index: number) => {
    const blockToCopy = blocks[index];
    const cloned = JSON.parse(JSON.stringify(blockToCopy));
    cloned.id = generateBlockId(cloned.type);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, cloned);
    onChange(newBlocks);
  };

  // Delete Block
  const deleteBlock = (index: number) => {
    if (blocks.length <= 1) {
      alert("A proposal must have at least one block.");
      return;
    }
    const newBlocks = blocks.filter((_, i) => i !== index);
    onChange(newBlocks);
  };

  // Insert Block At Specific Position
  const insertBlockAt = (index: number, type: string) => {
    const newBlock = createDefaultBlock(type);
    const newBlocks = [...blocks];
    newBlocks.splice(index, 0, newBlock);
    onChange(newBlocks);
    setInsertPopoverIndex(null);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, movedBlock);
    onChange(newBlocks);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Update specific block
  const updateBlock = (index: number, updated: ProposalBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updated;
    onChange(newBlocks);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-background overflow-hidden select-none">
      {/* Top Block Control Bar */}
      <div className="px-3.5 py-2 border-b border-border bg-card/60 backdrop-blur-xs flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="size-3.5 text-primary" />
            <span>Visual Document Flow</span>
          </span>
          <Badge
            variant="outline"
            className="text-[10px] px-2 py-0 font-mono font-semibold"
          >
            {blocks.length} Blocks
          </Badge>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={collapseAll}
            className="h-7 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
            title="Collapse all block bodies to view full outline"
          >
            <FoldHorizontal className="size-3" />
            <span>Collapse</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={expandAll}
            className="h-7 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
            title="Expand all block fields"
          >
            <UnfoldHorizontal className="size-3" />
            <span>Expand</span>
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          <Button
            type="button"
            size="sm"
            onClick={() => setInsertPopoverIndex(blocks.length)}
            className="h-7 px-2.5 text-[11px] font-semibold gap-1 rounded-lg bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            <Plus className="size-3" />
            <span>Add Block</span>
          </Button>
        </div>
      </div>

      {/* Main Blocks Scroll Container */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 xl:p-4 space-y-3.5 select-text">
        {blocks.map((block, idx) => {
          const meta = BLOCK_META[block.type] || {
            label: block.type,
            icon: FileText,
            color: "text-foreground",
            bg: "bg-muted border-border",
            badge: "Block",
          };
          const Icon = meta.icon;
          const isCollapsed = Boolean(collapsedMap[block.id]);
          const isDragging = draggedIndex === idx;
          const isDragOver = dragOverIndex === idx;

          // Block Title / Preview snippet for header
          let blockSummary = "";
          if (block.type === "section_header") {
            blockSummary = block.number
              ? `[${block.number}] ${block.title}`
              : block.title;
          } else if (block.type === "title_meta") {
            blockSummary = block.title || "Document Title";
          } else if (block.type === "stats") {
            blockSummary = `${block.items.length} KPI Metric Cards`;
          } else if (block.type === "tech_stack_table") {
            blockSummary = `${block.rows.length} Technologies Listed`;
          } else if (block.type === "cloud_infra_table") {
            blockSummary = `${block.rows.length} Cloud Components (${block.totalEstimate || "Estimates"})`;
          } else if (block.type === "feature_grid") {
            blockSummary = `${block.cards.length} Scope Deliverables`;
          } else if (block.type === "scale_grid") {
            blockSummary = `${block.cards.length} Scaling Pillars`;
          } else if (block.type === "commercial_quotation") {
            blockSummary = `Total: ${block.totalInvestment}`;
          } else if (block.type === "milestones") {
            blockSummary = `${block.items.length} Milestones (${block.title || "Schedule"})`;
          } else if (block.type === "signoff") {
            blockSummary = block.clientName || "Client Sign-off Grid";
          } else if (block.type === "architecture") {
            blockSummary = block.title || "Data Pipeline Flow";
          } else if (block.type === "text") {
            blockSummary =
              block.content.slice(0, 50) +
              (block.content.length > 50 ? "..." : "");
          }

          return (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, idx)}
              className={`group/block relative bg-card border rounded-2xl transition-all shadow-2xs ${isDragging
                  ? "opacity-40 border-dashed border-primary"
                  : isDragOver
                    ? "border-primary ring-2 ring-primary/20 shadow-md"
                    : "border-border/80 hover:border-border"
                }`}
            >
              {/* Drop Target Top Line */}
              {isDragOver && (
                <div className="absolute -top-2 left-0 right-0 h-1 bg-primary rounded-full z-20 animate-pulse" />
              )}

              {/* Block Header Card */}
              <div
                className={`flex items-center justify-between gap-2 p-3 sm:px-4 cursor-pointer select-none rounded-t-2xl transition-colors ${isCollapsed
                    ? "rounded-b-2xl bg-card hover:bg-muted/40"
                    : "border-b border-border/70 bg-muted/20"
                  }`}
                onClick={() => toggleCollapse(block.id)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Drag Handle */}
                  <div
                    className="p-1 -ml-1 text-muted-foreground/60 group-hover/block:text-muted-foreground hover:!text-primary cursor-grab active:cursor-grabbing rounded-md transition-colors"
                    title="Drag to reorder block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical className="size-4" />
                  </div>

                  {/* Block Number Indicator */}
                  <span className="font-mono text-[10px] font-bold text-muted-foreground/80 bg-muted/80 px-1.5 py-0.5 rounded-md shrink-0">
                    #{String(idx + 1).padStart(2, "0")}
                  </span>

                  {/* Block Icon & Type Badge */}
                  <div
                    className={`size-6 rounded-lg flex items-center justify-center shrink-0 border ${meta.bg}`}
                  >
                    <Icon className={`size-3.5 ${meta.color}`} />
                  </div>

                  {/* Block Label & Dynamic Summary */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-xs text-foreground shrink-0">
                      {meta.label}
                    </span>
                    {blockSummary && (
                      <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
                        • {blockSummary}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Action Icons */}
                <div
                  className="flex items-center gap-0.5 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={idx === 0}
                    onClick={() => moveBlock(idx, "up")}
                    className="size-7 rounded-md text-muted-foreground hover:text-foreground disabled:opacity-20"
                    title="Move block up"
                  >
                    <ChevronUp className="size-3.5" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={idx === blocks.length - 1}
                    onClick={() => moveBlock(idx, "down")}
                    className="size-7 rounded-md text-muted-foreground hover:text-foreground disabled:opacity-20"
                    title="Move block down"
                  >
                    <ChevronDown className="size-3.5" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => duplicateBlock(idx)}
                    className="size-7 rounded-md text-muted-foreground hover:text-foreground"
                    title="Duplicate block"
                  >
                    <Copy className="size-3" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteBlock(idx)}
                    className="size-7 rounded-md text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                    title="Delete block"
                  >
                    <Trash2 className="size-3" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleCollapse(block.id)}
                    className="size-7 rounded-md text-muted-foreground hover:text-foreground ml-1"
                    title={isCollapsed ? "Expand block" : "Collapse block"}
                  >
                    {isCollapsed ? (
                      <ChevronRight className="size-3.5" />
                    ) : (
                      <ChevronDown className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Block Content Body (Rendered when expanded) */}
              {!isCollapsed && (
                <div className="p-3.5 sm:p-5 bg-card rounded-b-2xl">
                  {renderBlockForm(block, (updated) =>
                    updateBlock(idx, updated),
                  )}
                </div>
              )}

              {/* Between-Block Insert Trigger Hover Button */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover/block:opacity-100 transition-opacity z-10">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setInsertPopoverIndex(idx + 1)}
                  className="h-6 px-2 text-[10px] font-semibold gap-1 rounded-full bg-card border-primary/50 text-primary shadow-xs hover:bg-primary hover:text-primary-foreground"
                >
                  <Plus className="size-2.5" />
                  <span>Insert Block Here</span>
                </Button>
              </div>
            </div>
          );
        })}

        {/* Bottom Add Block Card */}
        <div className="p-4 sm:p-6 border-2 border-dashed border-border/80 hover:border-primary/60 rounded-2xl bg-card/40 flex flex-col items-center justify-center text-center transition-colors">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-2.5 shadow-2xs">
            <Plus className="size-5" />
          </div>
          <h4 className="text-xs font-bold text-foreground">
            Add New Proposal Block
          </h4>
          <p className="text-[11px] text-muted-foreground mt-0.5 max-w-sm mb-3">
            Choose from formal letterheads, architecture pipelines, tech stack
            tables, milestone schedules, and sign-off grids.
          </p>
          <Button
            type="button"
            size="sm"
            onClick={() => setInsertPopoverIndex(blocks.length)}
            className="rounded-xl gap-1.5 font-semibold text-xs shadow-xs"
          >
            <Plus className="size-3.5" />
            <span>Select Component Block</span>
          </Button>
        </div>
      </div>

      {/* Insert Block Dialog / Popover */}
      {insertPopoverIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setInsertPopoverIndex(null)}
        >
          <div
            className="w-full max-w-2xl bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Layers className="size-4 text-primary" />
                  <span>Insert Proposal Component Block</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select a ready-to-use visual component to add to your document
                  flow.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setInsertPopoverIndex(null)}
                className="h-8 px-2 text-xs"
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {Object.entries(BLOCK_META).map(([type, meta]) => {
                const Icon = meta.icon;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => insertBlockAt(insertPopoverIndex, type)}
                    className="p-3 text-left border border-border/80 hover:border-primary/60 bg-muted/10 hover:bg-muted/30 rounded-xl transition-all flex items-start gap-3 group"
                  >
                    <div
                      className={`size-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${meta.bg}`}
                    >
                      <Icon className={`size-4 ${meta.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                        <span>{meta.label}</span>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 font-normal"
                        >
                          {meta.badge}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        Insert preformatted {meta.label.toLowerCase()} into your
                        proposal.
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Tailored, dedicated visual forms for each ProposalBlock type
 */
function renderBlockForm(
  block: ProposalBlock,
  onChange: (updated: ProposalBlock) => void,
) {
  switch (block.type) {
    case "header":
      return (
        <div className="space-y-3 p-3.5 bg-muted/20 border border-border/80 rounded-xl">
          <div className="flex items-center gap-3 pb-3 border-b border-border/60">
            <div className="size-10 rounded-xl bg-card border border-border flex items-center justify-center p-1 shadow-2xs shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/scalyx_dark.png"
                alt="Scalyx"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <span>Scalyx Official Letterhead Header</span>
                <Badge
                  variant="outline"
                  className="text-[9px] text-primary border-primary/20"
                >
                  Editable Header
                </Badge>
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                Customize your agency letterhead, contact details, web address, and corporate tagline.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Brand / Agency Name
              </label>
              <Input
                value={block.brandTitle || ""}
                onChange={(e) =>
                  onChange({ ...block, brandTitle: e.target.value })
                }
                placeholder="Scalyx"
                className="h-8 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Brand Subtitle / Tagline
              </label>
              <Input
                value={block.brandSubtitle || ""}
                onChange={(e) =>
                  onChange({ ...block, brandSubtitle: e.target.value })
                }
                placeholder="CUSTOM SOFTWARE DEVELOPMENT & CLOUD SYSTEMS"
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Website
              </label>
              <Input
                value={block.website || ""}
                onChange={(e) =>
                  onChange({ ...block, website: e.target.value })
                }
                placeholder="scalyx.in"
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Email Address
              </label>
              <Input
                value={block.email || ""}
                onChange={(e) =>
                  onChange({ ...block, email: e.target.value })
                }
                placeholder="contact@scalyx.in"
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Helpline & Notes
              </label>
              <div className="flex gap-1.5">
                <Input
                  value={block.helpline || ""}
                  onChange={(e) =>
                    onChange({ ...block, helpline: e.target.value })
                  }
                  placeholder="+91 8927124748"
                  className="h-8 text-xs font-mono w-2/3"
                />
                <Input
                  value={block.helplineNote || ""}
                  onChange={(e) =>
                    onChange({ ...block, helplineNote: e.target.value })
                  }
                  placeholder="(Call & WhatsApp)"
                  className="h-8 text-[11px] w-1/3"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case "title_meta":
      return (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Document Title
              </label>
              <Input
                value={block.title}
                onChange={(e) => onChange({ ...block, title: e.target.value })}
                placeholder="e.g. Scalyx Custom Platform Architecture"
                className="h-9 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Eyebrow Category Banner
              </label>
              <Input
                value={block.eyebrow}
                onChange={(e) =>
                  onChange({ ...block, eyebrow: e.target.value })
                }
                placeholder="e.g. PROPOSAL & ARCHITECTURAL BLUEPRINT"
                className="h-9 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Document Subtitle
            </label>
            <Input
              value={block.subtitle}
              onChange={(e) => onChange({ ...block, subtitle: e.target.value })}
              placeholder="e.g. Private Messaging & High-Volume Document Exchange Platform for Verified Advocates"
              className="h-9 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Prepared For (Client)
              </label>
              <Input
                value={block.preparedFor}
                onChange={(e) =>
                  onChange({ ...block, preparedFor: e.target.value })
                }
                placeholder="e.g. LexConnect / Santosh Kumar"
                className="h-8 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Prepared By (Agency)
              </label>
              <Input
                value={block.preparedBy}
                onChange={(e) =>
                  onChange({ ...block, preparedBy: e.target.value })
                }
                placeholder="Scalyx"
                className="h-8 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Date
              </label>
              <Input
                value={block.date}
                onChange={(e) => onChange({ ...block, date: e.target.value })}
                placeholder="e.g. October 5, 2026"
                className="h-8 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Status Badge
              </label>
              <select
                value={block.status}
                onChange={(e) => onChange({ ...block, status: e.target.value })}
                className="w-full h-8 px-2.5 rounded-lg bg-card border border-input text-xs text-foreground focus:outline-none"
              >
                <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                <option value="CONFIDENTIAL & PRIVILEGED">
                  CONFIDENTIAL & PRIVILEGED
                </option>
                <option value="DRAFT BLUEPRINT">DRAFT BLUEPRINT</option>
                <option value="FINAL PROPOSAL">FINAL PROPOSAL</option>
                <option value="APPROVED FOR SIGN-OFF">
                  APPROVED FOR SIGN-OFF
                </option>
              </select>
            </div>
          </div>
        </div>
      );

    case "stats":
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Flexible 1–4 Metrics Grid Cards
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newItems = [
                  ...block.items,
                  {
                    id: generateBlockId("item"),
                    label: "NEW METRIC",
                    value: "99.99%",
                    subtext: "Description",
                  },
                ];
                onChange({ ...block, items: newItems });
              }}
              className="h-7 px-2 text-xs font-semibold gap-1"
            >
              <Plus className="size-3" />
              <span>Add Metric Card</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {block.items.map((item, i) => (
              <div
                key={item.id}
                className="p-3 bg-muted/20 border border-border/80 rounded-xl space-y-2 relative group/card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground">
                    Card #{i + 1}
                  </span>
                  {block.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = block.items.filter(
                          (_, idx) => idx !== i,
                        );
                        onChange({ ...block, items: newItems });
                      }}
                      className="text-muted-foreground hover:text-destructive p-0.5 rounded transition-colors"
                      title="Remove card"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground mb-0.5">
                    Metric Label
                  </label>
                  <Input
                    value={item.label}
                    onChange={(e) => {
                      const newItems = [...block.items];
                      newItems[i] = { ...item, label: e.target.value };
                      onChange({ ...block, items: newItems });
                    }}
                    placeholder="e.g. TARGET CAPACITY"
                    className="h-7 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground mb-0.5">
                    Highlighted Value
                  </label>
                  <Input
                    value={item.value}
                    onChange={(e) => {
                      const newItems = [...block.items];
                      newItems[i] = { ...item, value: e.target.value };
                      onChange({ ...block, items: newItems });
                    }}
                    placeholder="e.g. 1,00,000"
                    className="h-7 text-xs font-mono font-bold text-primary"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-muted-foreground mb-0.5">
                    Subtext Note
                  </label>
                  <Input
                    value={item.subtext}
                    onChange={(e) => {
                      const newItems = [...block.items];
                      newItems[i] = { ...item, subtext: e.target.value };
                      onChange({ ...block, items: newItems });
                    }}
                    placeholder="e.g. Verified advocates"
                    className="h-7 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "section_header":
      return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="w-24 shrink-0">
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Badge #
            </label>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-muted-foreground">[</span>
              <Input
                value={block.number}
                onChange={(e) => onChange({ ...block, number: e.target.value })}
                placeholder="01"
                className="h-9 text-xs font-mono font-bold text-center"
              />
              <span className="font-mono text-xs text-muted-foreground">]</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Section Title
            </label>
            <Input
              value={block.title}
              onChange={(e) => onChange({ ...block, title: e.target.value })}
              placeholder="e.g. Executive Summary & Project Mission"
              className="h-9 text-xs font-bold text-foreground"
            />
          </div>
        </div>
      );

    case "text":
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Paragraph & Scope Description
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  onChange({
                    ...block,
                    content: `${block.content}\n\n- New bullet point item`,
                  })
                }
                className="h-6 px-1.5 text-[10px] text-muted-foreground hover:text-foreground"
              >
                + Bullet Point
              </Button>
            </div>
          </div>

          <Textarea
            value={block.content}
            onChange={(e) => onChange({ ...block, content: e.target.value })}
            rows={4}
            placeholder="Type your proposal narrative, scope breakdown, or executive points..."
            className="text-xs leading-relaxed font-sans"
          />
        </div>
      );

    case "architecture": {
      const archSteps = getArchitectureSteps(block);

      const updateArchSteps = (newSteps: ArchitectureStep[]) => {
        onChange({
          ...block,
          steps: newSteps,
          flow: stepsToFlow(newSteps),
        });
      };

      const handleStepChange = (
        index: number,
        field: "label" | "subtext",
        value: string
      ) => {
        const next = archSteps.map((st, i) =>
          i === index ? { ...st, [field]: value } : st
        );
        updateArchSteps(next);
      };

      const handleAddStep = (insertAfterIndex?: number) => {
        const newStep: ArchitectureStep = {
          id: generateBlockId("step"),
          label: "New Service Node",
          subtext: "Purpose / technology",
        };
        const next = [...archSteps];
        if (typeof insertAfterIndex === "number") {
          next.splice(insertAfterIndex + 1, 0, newStep);
        } else {
          next.push(newStep);
        }
        updateArchSteps(next);
      };

      const handleRemoveStep = (index: number) => {
        if (archSteps.length <= 1) return;
        const next = archSteps.filter((_, i) => i !== index);
        updateArchSteps(next);
      };

      const handleMoveStep = (index: number, dir: -1 | 1) => {
        const target = index + dir;
        if (target < 0 || target >= archSteps.length) return;
        const next = [...archSteps];
        const [moved] = next.splice(index, 1);
        next.splice(target, 0, moved);
        updateArchSteps(next);
      };

      return (
        <div className="space-y-4">
          {/* Header Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/20 p-3 rounded-lg border border-border/50">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Terminal Header Title
              </label>
              <Input
                value={block.title}
                onChange={(e) => onChange({ ...block, title: e.target.value })}
                placeholder="ENTERPRISE END-TO-END DATA PIPELINE"
                className="h-9 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Security / Status Badge
              </label>
              <Input
                value={block.badge}
                onChange={(e) => onChange({ ...block, badge: e.target.value })}
                placeholder="SIGNAL PROTOCOL E2EE"
                className="h-9 text-xs font-mono"
              />
            </div>
          </div>

          {/* Pipeline Steps Builder */}
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-border/40">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                  Architecture Pipeline Steps
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  {archSteps.length} nodes
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddStep()}
                className="h-7 text-xs gap-1 border-cyan-500/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/10"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Pipeline Step
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Define the sequence of services, gateways, brokers, and databases. Each step is automatically styled and formatted with connected arrows.
            </p>

            <div className="space-y-2.5 pt-1">
              {archSteps.map((step, idx) => (
                <div key={step.id || `step-${idx}`} className="group relative">
                  <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border/60 bg-background hover:border-cyan-500/40 transition-colors shadow-sm">
                    {/* Index badge */}
                    <div className="flex flex-col items-center justify-center pt-1">
                      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-muted font-mono text-[10px] font-bold text-muted-foreground group-hover:bg-cyan-500/10 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-medium text-muted-foreground mb-0.5">
                          Node / Service Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={step.label}
                          onChange={(e) =>
                            handleStepChange(idx, "label", e.target.value)
                          }
                          placeholder="e.g. Cloudflare WAF, Go API, PostgreSQL"
                          className="h-8 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-muted-foreground mb-0.5">
                          Technology / Subtext <span className="text-muted-foreground/60">(Optional)</span>
                        </label>
                        <Input
                          value={step.subtext || ""}
                          onChange={(e) =>
                            handleStepChange(idx, "subtext", e.target.value)
                          }
                          placeholder="e.g. DDoS Shield & CDN, ACID Relational Core"
                          className="h-8 text-xs text-muted-foreground"
                        />
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-30"
                        disabled={idx === 0}
                        onClick={() => handleMoveStep(idx, -1)}
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-30"
                        disabled={idx === archSteps.length - 1}
                        onClick={() => handleMoveStep(idx, 1)}
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-red-600 disabled:opacity-30"
                        disabled={archSteps.length <= 1}
                        onClick={() => handleRemoveStep(idx)}
                        title="Delete Step"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Flow connector between steps */}
                  {idx < archSteps.length - 1 && (
                    <div className="flex items-center justify-center my-1">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[10px] font-mono">
                        <span className="font-bold">➔</span>
                        <span>downstream flow</span>
                        <button
                          type="button"
                          onClick={() => handleAddStep(idx)}
                          className="ml-1 text-[10px] hover:underline font-sans text-cyan-600 dark:text-cyan-300"
                          title="Insert step after this node"
                        >
                          + insert
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddStep()}
                className="w-full h-8 text-xs border-dashed gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Pipeline Step
              </Button>
            </div>
          </div>

          {/* Live In-Editor Dark Terminal Preview */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Terminal className="h-3.5 w-3.5 text-cyan-500" />
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Live Terminal Preview
              </span>
            </div>
            <div className="rounded-xl border border-cyan-900/40 bg-[#0a0f1d] p-4 text-slate-100 font-mono shadow-md overflow-hidden">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-300 tracking-wider uppercase ml-1">
                    {block.title || "ENTERPRISE PIPELINE ARCHITECTURE"}
                  </span>
                </div>
                <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 tracking-wider">
                  {block.badge || "SIGNAL PROTOCOL E2EE"}
                </span>
              </div>

              {/* Terminal Pipeline Nodes Flow */}
              <div className="flex flex-wrap items-center gap-2 py-1">
                {archSteps.map((step, sIdx) => {
                  let badgeStyle = "bg-slate-800/80 border-slate-700 text-slate-200";
                  if (sIdx === 0) {
                    badgeStyle = "bg-cyan-950/70 border-cyan-500/40 text-cyan-300 font-semibold";
                  } else if (sIdx === archSteps.length - 1) {
                    badgeStyle = "bg-emerald-950/70 border-emerald-500/40 text-emerald-300 font-semibold";
                  } else if (sIdx === 2) {
                    badgeStyle = "bg-indigo-950/70 border-indigo-500/40 text-indigo-300";
                  }

                  return (
                    <React.Fragment key={step.id || `pv-${sIdx}`}>
                      <span className={`inline-flex items-baseline gap-1.5 px-2.5 py-1 rounded-md text-xs border shadow-sm ${badgeStyle}`}>
                        <span>{step.label || "Untitled Step"}</span>
                        {step.subtext && (
                          <span className="text-[10px] opacity-75">
                            ({step.subtext})
                          </span>
                        )}
                      </span>
                      {sIdx < archSteps.length - 1 && (
                        <span className="text-cyan-400 font-bold text-xs select-none px-0.5">
                          ➔
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    case "tech_stack_table":
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Technology Stack Rows
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newRows = [
                  ...block.rows,
                  {
                    id: generateBlockId("row"),
                    layer: "Infrastructure",
                    technology: "Docker",
                    rationale: "Containerized deployment",
                  },
                ];
                onChange({ ...block, rows: newRows });
              }}
              className="h-7 px-2 text-xs font-semibold gap-1"
            >
              <Plus className="size-3" />
              <span>Add Technology Row</span>
            </Button>
          </div>

          <div className="space-y-2">
            {block.rows.map((row, rIdx) => (
              <div
                key={row.id}
                className="p-2.5 bg-muted/20 border border-border/80 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-2 items-center"
              >
                <div className="md:col-span-3">
                  <Input
                    value={row.layer}
                    onChange={(e) => {
                      const newRows = [...block.rows];
                      newRows[rIdx] = { ...row, layer: e.target.value };
                      onChange({ ...block, rows: newRows });
                    }}
                    placeholder="Layer (e.g. Backend Core)"
                    className="h-8 text-xs font-bold"
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    value={row.technology}
                    onChange={(e) => {
                      const newRows = [...block.rows];
                      newRows[rIdx] = { ...row, technology: e.target.value };
                      onChange({ ...block, rows: newRows });
                    }}
                    placeholder="Technology (e.g. Golang)"
                    className="h-8 text-xs font-mono font-semibold text-primary"
                  />
                </div>
                <div className="md:col-span-5">
                  <Input
                    value={row.rationale}
                    onChange={(e) => {
                      const newRows = [...block.rows];
                      newRows[rIdx] = { ...row, rationale: e.target.value };
                      onChange({ ...block, rows: newRows });
                    }}
                    placeholder="Rationale & Advantage"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="md:col-span-1 text-right">
                  {block.rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newRows = block.rows.filter(
                          (_, idx) => idx !== rIdx,
                        );
                        onChange({ ...block, rows: newRows });
                      }}
                      className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors"
                      title="Delete row"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "cloud_infra_table":
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Cloud Cost Component Rows
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newRows = [
                  ...block.rows,
                  {
                    id: generateBlockId("row"),
                    component: "Compute Service",
                    estimate: "₹2,000 – ₹3,000",
                    notes: "High memory instance",
                  },
                ];
                onChange({ ...block, rows: newRows });
              }}
              className="h-7 px-2 text-xs font-semibold gap-1"
            >
              <Plus className="size-3" />
              <span>Add Cost Component</span>
            </Button>
          </div>

          <div className="space-y-2">
            {block.rows.map((row, rIdx) => (
              <div
                key={row.id}
                className="p-2.5 bg-muted/20 border border-border/80 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-2 items-center"
              >
                <div className="md:col-span-4">
                  <Input
                    value={row.component}
                    onChange={(e) => {
                      const newRows = [...block.rows];
                      newRows[rIdx] = { ...row, component: e.target.value };
                      onChange({ ...block, rows: newRows });
                    }}
                    placeholder="Component (e.g. VPS / Compute)"
                    className="h-8 text-xs font-medium"
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    value={row.estimate}
                    onChange={(e) => {
                      const newRows = [...block.rows];
                      newRows[rIdx] = { ...row, estimate: e.target.value };
                      onChange({ ...block, rows: newRows });
                    }}
                    placeholder="Estimate (e.g. ₹2,500 – ₹4,000)"
                    className="h-8 text-xs font-mono font-bold text-amber-600 dark:text-amber-400"
                  />
                </div>
                <div className="md:col-span-4">
                  <Input
                    value={row.notes}
                    onChange={(e) => {
                      const newRows = [...block.rows];
                      newRows[rIdx] = { ...row, notes: e.target.value };
                      onChange({ ...block, rows: newRows });
                    }}
                    placeholder="Operational Notes"
                    className="h-8 text-xs text-muted-foreground"
                  />
                </div>
                <div className="md:col-span-1 text-right">
                  {block.rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newRows = block.rows.filter(
                          (_, idx) => idx !== rIdx,
                        );
                        onChange({ ...block, rows: newRows });
                      }}
                      className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors"
                      title="Delete component"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total Row Configuration */}
          <div className="p-3 bg-muted/40 border border-border rounded-xl grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold text-muted-foreground mb-0.5">
                Total Row Title
              </label>
              <Input
                value={block.totalLabel}
                onChange={(e) =>
                  onChange({ ...block, totalLabel: e.target.value })
                }
                placeholder="Estimated Total Monthly Cloud Run-Rate"
                className="h-8 text-xs font-bold"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold text-muted-foreground mb-0.5">
                Total Estimate Range
              </label>
              <Input
                value={block.totalEstimate}
                onChange={(e) =>
                  onChange({ ...block, totalEstimate: e.target.value })
                }
                placeholder="₹10,500 – ₹16,000"
                className="h-8 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <div className="md:col-span-5">
              <label className="block text-[10px] font-bold text-muted-foreground mb-0.5">
                Billing Notes
              </label>
              <Input
                value={block.totalNotes}
                onChange={(e) =>
                  onChange({ ...block, totalNotes: e.target.value })
                }
                placeholder="Direct client billing via Cloud console"
                className="h-8 text-xs text-muted-foreground"
              />
            </div>
          </div>
        </div>
      );

    case "feature_grid":
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Scope Deliverables Cards (Lettered Cards [A], [B], [C])
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const nextBadge = String.fromCharCode(65 + block.cards.length);
                const newCards = [
                  ...block.cards,
                  {
                    id: generateBlockId("card"),
                    badge: nextBadge,
                    title: "New Functional Scope Module",
                    bullets: ["Specification item 1", "Specification item 2"],
                  },
                ];
                onChange({ ...block, cards: newCards });
              }}
              className="h-7 px-2 text-xs font-semibold gap-1"
            >
              <Plus className="size-3" />
              <span>Add Deliverables Card</span>
            </Button>
          </div>

          <div className="space-y-3">
            {block.cards.map((card, cIdx) => (
              <div
                key={card.id}
                className="p-3.5 bg-muted/20 border border-border/80 rounded-xl space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-16 shrink-0">
                      <Input
                        value={card.badge}
                        onChange={(e) => {
                          const newCards = [...block.cards];
                          newCards[cIdx] = { ...card, badge: e.target.value };
                          onChange({ ...block, cards: newCards });
                        }}
                        placeholder="A"
                        className="h-8 text-xs font-bold text-center font-mono"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        value={card.title}
                        onChange={(e) => {
                          const newCards = [...block.cards];
                          newCards[cIdx] = { ...card, title: e.target.value };
                          onChange({ ...block, cards: newCards });
                        }}
                        placeholder="Module Title (e.g. Advocate Directory & Verification)"
                        className="h-8 text-xs font-bold"
                      />
                    </div>
                  </div>

                  {block.cards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newCards = block.cards.filter(
                          (_, idx) => idx !== cIdx,
                        );
                        onChange({ ...block, cards: newCards });
                      }}
                      className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors"
                      title="Delete card"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Bullets List */}
                <div className="space-y-1.5 pl-2 border-l-2 border-border/70 ml-2">
                  {card.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-primary shrink-0" />
                      <Input
                        value={bullet}
                        onChange={(e) => {
                          const newCards = [...block.cards];
                          const newBullets = [...card.bullets];
                          newBullets[bIdx] = e.target.value;
                          newCards[cIdx] = { ...card, bullets: newBullets };
                          onChange({ ...block, cards: newCards });
                        }}
                        placeholder="Deliverable bullet point..."
                        className="h-7 text-xs flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newCards = [...block.cards];
                          const newBullets = card.bullets.filter(
                            (_, idx) => idx !== bIdx,
                          );
                          newCards[cIdx] = { ...card, bullets: newBullets };
                          onChange({ ...block, cards: newCards });
                        }}
                        className="text-muted-foreground hover:text-destructive p-1 rounded"
                        title="Remove bullet"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newCards = [...block.cards];
                      newCards[cIdx] = {
                        ...card,
                        bullets: [
                          ...card.bullets,
                          "New deliverable specification",
                        ],
                      };
                      onChange({ ...block, cards: newCards });
                    }}
                    className="h-6 px-2 text-[10px] text-primary gap-1 font-semibold"
                  >
                    <Plus className="size-2.5" />
                    <span>Add Item</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "scale_grid":
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Scale-Up Architecture Engineering Pillars (Numbered)
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const nextNum = String(block.cards.length + 1);
                const newCards = [
                  ...block.cards,
                  {
                    id: generateBlockId("card"),
                    number: nextNum,
                    title: "Scale Optimization Pillar",
                    bullets: ["Architectural optimization detail"],
                  },
                ];
                onChange({ ...block, cards: newCards });
              }}
              className="h-7 px-2 text-xs font-semibold gap-1"
            >
              <Plus className="size-3" />
              <span>Add Scale Pillar</span>
            </Button>
          </div>

          <div className="space-y-3">
            {block.cards.map((card, cIdx) => (
              <div
                key={card.id}
                className="p-3.5 bg-muted/20 border border-border/80 rounded-xl space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-16 shrink-0">
                      <Input
                        value={card.number}
                        onChange={(e) => {
                          const newCards = [...block.cards];
                          newCards[cIdx] = { ...card, number: e.target.value };
                          onChange({ ...block, cards: newCards });
                        }}
                        placeholder="1"
                        className="h-8 text-xs font-bold text-center font-mono"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        value={card.title}
                        onChange={(e) => {
                          const newCards = [...block.cards];
                          newCards[cIdx] = { ...card, title: e.target.value };
                          onChange({ ...block, cards: newCards });
                        }}
                        placeholder="Pillar Title (e.g. Database Connection Pooling)"
                        className="h-8 text-xs font-bold"
                      />
                    </div>
                  </div>

                  {block.cards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newCards = block.cards.filter(
                          (_, idx) => idx !== cIdx,
                        );
                        onChange({ ...block, cards: newCards });
                      }}
                      className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors"
                      title="Delete card"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Bullets List */}
                <div className="space-y-1.5 pl-2 border-l-2 border-border/70 ml-2">
                  {card.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-purple-500 shrink-0" />
                      <Input
                        value={bullet}
                        onChange={(e) => {
                          const newCards = [...block.cards];
                          const newBullets = [...card.bullets];
                          newBullets[bIdx] = e.target.value;
                          newCards[cIdx] = { ...card, bullets: newBullets };
                          onChange({ ...block, cards: newCards });
                        }}
                        placeholder="Engineering detail..."
                        className="h-7 text-xs flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newCards = [...block.cards];
                          const newBullets = card.bullets.filter(
                            (_, idx) => idx !== bIdx,
                          );
                          newCards[cIdx] = { ...card, bullets: newBullets };
                          onChange({ ...block, cards: newCards });
                        }}
                        className="text-muted-foreground hover:text-destructive p-1 rounded"
                        title="Remove bullet"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newCards = [...block.cards];
                      newCards[cIdx] = {
                        ...card,
                        bullets: [
                          ...card.bullets,
                          "New scaling implementation detail",
                        ],
                      };
                      onChange({ ...block, cards: newCards });
                    }}
                    className="h-6 px-2 text-[10px] text-purple-600 dark:text-purple-400 gap-1 font-semibold"
                  >
                    <Plus className="size-2.5" />
                    <span>Add Item</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "callout_green":
    case "callout_amber": {
      const isGreen = block.type === "callout_green";
      return (
        <div
          className={`p-3.5 rounded-xl border space-y-2.5 ${isGreen
              ? "bg-emerald-500/5 border-emerald-500/20"
              : "bg-amber-500/5 border-amber-500/20"
            }`}
        >
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              {isGreen
                ? "Budget Advice / Callout Prefix"
                : "Policy Name / Callout Prefix"}
            </label>
            <Input
              value={block.title}
              onChange={(e) => onChange({ ...block, title: e.target.value })}
              placeholder={
                isGreen
                  ? "Recommended Phase 1 Budget:"
                  : "Zero Throwaway Code Guarantee:"
              }
              className="h-8 text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Callout Message Body
            </label>
            <Textarea
              value={block.content}
              onChange={(e) => onChange({ ...block, content: e.target.value })}
              rows={2}
              placeholder="Callout narrative..."
              className="text-xs"
            />
          </div>
        </div>
      );
    }

    case "commercial_quotation":
      return (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Total Fixed Investment
              </label>
              <Input
                value={block.totalInvestment}
                onChange={(e) =>
                  onChange({ ...block, totalInvestment: e.target.value })
                }
                placeholder="₹85,000"
                className="h-9 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Quotation Subtitle / Scope Summary
              </label>
              <Input
                value={block.subtitle}
                onChange={(e) =>
                  onChange({ ...block, subtitle: e.target.value })
                }
                placeholder="Complete 2-Phase Engineering & Production Hardening"
                className="h-9 text-xs font-medium"
              />
            </div>
          </div>

          {/* Phased Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Phase Breakdown Items
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newPhases = [
                    ...block.phases,
                    {
                      id: generateBlockId("phase"),
                      label: `Phase ${block.phases.length + 1}`,
                      amount: "₹20,000",
                    },
                  ];
                  onChange({ ...block, phases: newPhases });
                }}
                className="h-6 px-2 text-[10px] font-semibold gap-1"
              >
                <Plus className="size-2.5" />
                <span>Add Phase</span>
              </Button>
            </div>

            {block.phases.map((ph, pIdx) => (
              <div
                key={ph.id}
                className="flex items-center gap-2 p-2 bg-muted/20 border border-border/80 rounded-xl"
              >
                <div className="flex-1">
                  <Input
                    value={ph.label}
                    onChange={(e) => {
                      const newPhases = [...block.phases];
                      newPhases[pIdx] = { ...ph, label: e.target.value };
                      onChange({ ...block, phases: newPhases });
                    }}
                    placeholder="Phase Label (e.g. Phase 1 — MVP)"
                    className="h-8 text-xs font-medium"
                  />
                </div>
                <div className="w-36 shrink-0">
                  <Input
                    value={ph.amount}
                    onChange={(e) => {
                      const newPhases = [...block.phases];
                      newPhases[pIdx] = { ...ph, amount: e.target.value };
                      onChange({ ...block, phases: newPhases });
                    }}
                    placeholder="₹60,000"
                    className="h-8 text-xs font-mono font-bold"
                  />
                </div>
                {block.phases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newPhases = block.phases.filter(
                        (_, idx) => idx !== pIdx,
                      );
                      onChange({ ...block, phases: newPhases });
                    }}
                    className="p-1 text-muted-foreground hover:text-destructive rounded"
                    title="Remove phase"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Payment Terms / Currency
            </label>
            <Input
              value={block.terms}
              onChange={(e) => onChange({ ...block, terms: e.target.value })}
              placeholder="INR (Milestone-based)"
              className="h-8 text-xs text-muted-foreground"
            />
          </div>
        </div>
      );

    case "milestones":
      return (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Milestone Schedule Header Title
              </label>
              <Input
                value={block.title}
                onChange={(e) => onChange({ ...block, title: e.target.value })}
                placeholder="Phase 1 Payment Schedule (₹60,000)"
                className="h-8 text-xs font-bold"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const nextNum = block.items.length + 1;
                const newItems = [
                  ...block.items,
                  {
                    id: generateBlockId("m"),
                    title: `Milestone ${nextNum}: New Engineering Phase`,
                    amount: "₹15,000",
                    description: "Specifications and deliverables breakdown.",
                  },
                ];
                onChange({ ...block, items: newItems });
              }}
              className="h-8 px-2.5 text-xs font-semibold gap-1 mt-auto shrink-0"
            >
              <Plus className="size-3" />
              <span>Add Milestone</span>
            </Button>
          </div>

          <div className="space-y-2.5">
            {block.items.map((m, mIdx) => (
              <div
                key={m.id}
                className="p-3 bg-muted/20 border border-border/80 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <Input
                      value={m.title}
                      onChange={(e) => {
                        const newItems = [...block.items];
                        newItems[mIdx] = { ...m, title: e.target.value };
                        onChange({ ...block, items: newItems });
                      }}
                      placeholder="Milestone Title (e.g. Milestone 1: Project Initiation)"
                      className="h-8 text-xs font-bold"
                    />
                  </div>
                  <div className="w-32 shrink-0">
                    <Input
                      value={m.amount}
                      onChange={(e) => {
                        const newItems = [...block.items];
                        newItems[mIdx] = { ...m, amount: e.target.value };
                        onChange({ ...block, items: newItems });
                      }}
                      placeholder="₹15,000"
                      className="h-8 text-xs font-mono font-bold text-primary text-right"
                    />
                  </div>
                  {block.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = block.items.filter(
                          (_, idx) => idx !== mIdx,
                        );
                        onChange({ ...block, items: newItems });
                      }}
                      className="p-1 text-muted-foreground hover:text-destructive rounded"
                      title="Delete milestone"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <Textarea
                    value={m.description}
                    onChange={(e) => {
                      const newItems = [...block.items];
                      newItems[mIdx] = { ...m, description: e.target.value };
                      onChange({ ...block, items: newItems });
                    }}
                    rows={2}
                    placeholder="Deliverables description for this milestone..."
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "signoff":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Client Authorization */}
            <div className="p-3.5 bg-muted/20 border border-border/80 rounded-xl space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Users className="size-3.5" />
                <span>Client Sign-Off Details</span>
              </span>

              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground mb-0.5">
                  Client Company / Full Name
                </label>
                <Input
                  value={block.clientName}
                  onChange={(e) =>
                    onChange({ ...block, clientName: e.target.value })
                  }
                  placeholder="e.g. Brozz Bharat / Santosh Kumar"
                  className="h-8 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground mb-0.5">
                  Authorized Signee / Title
                </label>
                <Input
                  value={block.signee}
                  onChange={(e) =>
                    onChange({ ...block, signee: e.target.value })
                  }
                  placeholder="e.g. Managing Director / CTO"
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground mb-0.5">
                  Client Email
                </label>
                <Input
                  value={block.email}
                  onChange={(e) =>
                    onChange({ ...block, email: e.target.value })
                  }
                  placeholder="client@company.com"
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground mb-0.5">
                  Agreed Scope
                </label>
                <Input
                  value={block.scope}
                  onChange={(e) =>
                    onChange({ ...block, scope: e.target.value })
                  }
                  placeholder="Full Technical Architecture & Turnkey Delivery"
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground mb-0.5">
                  Total Agreed Investment
                </label>
                <Input
                  value={block.investment}
                  onChange={(e) =>
                    onChange({ ...block, investment: e.target.value })
                  }
                  placeholder="₹85,000 INR (Milestone Schedule)"
                  className="h-8 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400"
                />
              </div>
            </div>

            {/* Right: Scalyx Agency Authorization */}
            <div className="p-3.5 bg-muted/20 border border-border/80 rounded-xl space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Building className="size-3.5" />
                <span>Agency Authorization</span>
              </span>

              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground mb-0.5">
                  Agency Name
                </label>
                <Input
                  value={block.agency}
                  onChange={(e) =>
                    onChange({ ...block, agency: e.target.value })
                  }
                  placeholder="Scalyx"
                  className="h-8 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground mb-0.5">
                  Official Website
                </label>
                <Input
                  value={block.website}
                  onChange={(e) =>
                    onChange({ ...block, website: e.target.value })
                  }
                  placeholder="https://scalyx.in"
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground mb-0.5">
                  Official Contact Email
                </label>
                <Input
                  value={block.agencyEmail}
                  onChange={(e) =>
                    onChange({ ...block, agencyEmail: e.target.value })
                  }
                  placeholder="contact@scalyx.in"
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground mb-0.5">
                  Helpline / Support Phone
                </label>
                <Input
                  value={block.helpline}
                  onChange={(e) =>
                    onChange({ ...block, helpline: e.target.value })
                  }
                  placeholder="+91 8927124748 (Call & WhatsApp)"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case "page_break":
      return (
        <div className="p-3 bg-muted/30 border border-dashed border-border rounded-xl flex items-center gap-3">
          <Scissors className="size-4 text-muted-foreground" />
          <div className="flex-1">
            <Input
              value={block.label}
              onChange={(e) => onChange({ ...block, label: e.target.value })}
              placeholder="Header running label on subsequent page..."
              className="h-8 text-xs font-mono"
            />
          </div>
          <span className="text-[10px] text-muted-foreground font-mono shrink-0">
            Forces A4 Page Break
          </span>
        </div>
      );

    case "footer":
      return (
        <div className="space-y-3 p-3.5 bg-muted/20 border border-border/80 rounded-xl">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
            <span className="font-semibold text-xs text-foreground">
              Running Page Footer
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              Printed on bottom of proposal pages
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Left Footer Notice (Confidentiality)
              </label>
              <Input
                value={block.textLeft || ""}
                onChange={(e) =>
                  onChange({ ...block, textLeft: e.target.value })
                }
                placeholder="Scalyx Architectural Blueprint & Engineering Proposal • Confidential"
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Right Footer Notice (Page Fit & Web)
              </label>
              <Input
                value={block.textRight || ""}
                onChange={(e) =>
                  onChange({ ...block, textRight: e.target.value })
                }
                placeholder="Page Fit: A4 Standard • scalyx.in"
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

