"use client";

import React, { useState } from "react";
import {
  ContractBlock,
  ContractPreset,
} from "@/lib/contract/types";
import {
  generateContractBlockId,
} from "@/lib/contract/blocks";
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Plus,
  FileSignature,
  Building,
  Scale,
  DollarSign,
  FileText,
  ListPlus,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface VisualContractEditorProps {
  blocks: ContractBlock[];
  onChange: (blocks: ContractBlock[]) => void;
  activeClientName?: string;
}

export function VisualContractEditor({
  blocks,
  onChange,
  activeClientName,
}: VisualContractEditorProps) {
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const toggleCollapse = (id: string) => {
    setCollapsedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const updated = [...blocks];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated);
  };

  const handleDuplicate = (index: number) => {
    const original = blocks[index];
    const duplicate: ContractBlock = {
      ...JSON.parse(JSON.stringify(original)),
      id: generateContractBlockId(original.type),
    };
    const updated = [...blocks];
    updated.splice(index + 1, 0, duplicate);
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    if (blocks.length <= 1) return;
    const updated = blocks.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleUpdateBlock = (index: number, updatedBlock: ContractBlock) => {
    const next = [...blocks];
    next[index] = updatedBlock;
    onChange(next);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const updated = [...blocks];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);
    onChange(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleAddCustomClause = () => {
    const clauses = blocks.filter((b) => b.type === "contract_clause");
    const nextNum = `${clauses.length + 1}.0`;
    const newBlock: ContractBlock = {
      id: generateContractBlockId("clause"),
      type: "contract_clause",
      clauseNumber: nextNum,
      title: "Custom Legal / Engineering Provision",
      body: "Insert legal terms, specific warranties, or technical stipulations here...",
    };
    const sigIndex = blocks.findIndex((b) => b.type === "contract_signature");
    if (sigIndex !== -1) {
      const next = [...blocks];
      next.splice(sigIndex, 0, newBlock);
      onChange(next);
    } else {
      onChange([...blocks, newBlock]);
    }
  };

  const handleAddScopeTable = () => {
    const newBlock: ContractBlock = {
      id: generateContractBlockId("scope"),
      type: "contract_scope_table",
      title: "Schedule: Scope of Work & Deliverables",
      description: "Detailed specification of deliverables and acceptance milestones.",
      rows: [
        {
          id: generateContractBlockId("row"),
          deliverable: "Deliverable Item",
          specifications: "Detailed technical specifications",
          timeline: "2 Weeks",
          acceptance: "Client sign-off criteria",
        },
      ],
    };
    const sigIndex = blocks.findIndex((b) => b.type === "contract_signature");
    if (sigIndex !== -1) {
      const next = [...blocks];
      next.splice(sigIndex, 0, newBlock);
      onChange(next);
    } else {
      onChange([...blocks, newBlock]);
    }
  };

  const handleAddCommercials = () => {
    const newBlock: ContractBlock = {
      id: generateContractBlockId("commercials"),
      type: "contract_commercials",
      title: "Schedule: Commercials & Fee Tranches",
      totalValue: "₹1,00,000",
      currency: "INR",
      paymentTermsSummary: "All invoices net 7 days via wire transfer.",
      tranches: [
        {
          id: generateContractBlockId("tranche"),
          milestone: "Tranche 1: Advance Deposit",
          percentage: "50%",
          amount: "₹50,000",
          dueCondition: "Upon execution of Agreement",
        },
        {
          id: generateContractBlockId("tranche"),
          milestone: "Tranche 2: Final Acceptance",
          percentage: "50%",
          amount: "₹50,000",
          dueCondition: "Upon final deployment sign-off",
        },
      ],
      invoicingNotes: "Electronic invoice transmitted upon milestone completion.",
      lateFeePolicy: "Late fee of 1.5% per month.",
    };
    const sigIndex = blocks.findIndex((b) => b.type === "contract_signature");
    if (sigIndex !== -1) {
      const next = [...blocks];
      next.splice(sigIndex, 0, newBlock);
      onChange(next);
    } else {
      onChange([...blocks, newBlock]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-card border border-border/80 rounded-xl p-3 shadow-xs flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
            <Scale className="size-3.5 text-primary" />
            <span>Contract Blocks &amp; Clauses</span>
            <Badge variant="outline" className="text-[10px] font-mono py-0 px-1.5">
              {blocks.length} Elements
            </Badge>
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Drag handles to reorder blocks. Click any element to edit its content.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCustomClause}
            className="h-7 text-xs font-semibold gap-1.5 rounded-lg border-dashed"
          >
            <Plus className="size-3 text-primary" />
            <span>Add Blank Clause</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddScopeTable}
            className="h-7 text-xs font-medium gap-1.5 rounded-lg"
          >
            <ListPlus className="size-3" />
            <span>Scope Table</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCommercials}
            className="h-7 text-xs font-medium gap-1.5 rounded-lg"
          >
            <DollarSign className="size-3" />
            <span>Commercials</span>
          </Button>
        </div>
      </div>

      {/* Blocks List */}
      <div className="space-y-3">
        {blocks.map((block, index) => {
          const isCollapsed = !!collapsedMap[block.id];
          const isDragging = draggedIndex === index;
          const isOver = dragOverIndex === index;

          return (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              className={`bg-card border rounded-2xl transition-all duration-150 ${
                isDragging ? "opacity-40 scale-[0.99] border-primary" : "border-border/80"
              } ${isOver ? "border-primary ring-2 ring-primary/20" : "shadow-xs"}`}
            >
              {/* Block Header */}
              <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-border/50 bg-muted/20 rounded-t-2xl">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                    title="Drag to reorder"
                  >
                    <GripVertical className="size-4" />
                  </div>

                  <span className="text-[11px] font-mono text-muted-foreground/70 w-5 text-right">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex items-center gap-2 min-w-0">
                    {getBlockIcon(block.type)}
                    <span className="font-bold text-xs text-foreground truncate">
                      {getBlockTitle(block)}
                    </span>
                    <Badge variant="outline" className="text-[9.5px] font-mono py-0 px-1.5 uppercase shrink-0">
                      {block.type.replace("contract_", "")}
                    </Badge>
                  </div>
                </div>

                {/* Block Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0}
                    title="Move up"
                  >
                    <ChevronUp className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
                    onClick={() => handleMove(index, "down")}
                    disabled={index === blocks.length - 1}
                    title="Move down"
                  >
                    <ChevronDown className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
                    onClick={() => handleDuplicate(index)}
                    title="Duplicate block"
                  >
                    <Copy className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(index)}
                    title="Delete block"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                  <div className="w-px h-4 bg-border/60 mx-0.5" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
                    onClick={() => toggleCollapse(block.id)}
                    title={isCollapsed ? "Expand block" : "Collapse block"}
                  >
                    {isCollapsed ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                  </Button>
                </div>
              </div>

              {/* Block Body Form */}
              {!isCollapsed && (
                <div className="p-4 sm:p-5">
                  {renderContractBlockForm(block, (updated) => handleUpdateBlock(index, updated))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getBlockIcon(type: ContractBlock["type"]) {
  switch (type) {
    case "contract_header":
      return <Building className="size-3.5 text-primary" />;
    case "contract_parties":
      return <Building className="size-3.5 text-blue-500" />;
    case "contract_preamble":
      return <FileText className="size-3.5 text-amber-500" />;
    case "contract_clause":
      return <Scale className="size-3.5 text-emerald-500" />;
    case "contract_scope_table":
      return <ListPlus className="size-3.5 text-purple-500" />;
    case "contract_commercials":
      return <DollarSign className="size-3.5 text-emerald-600" />;
    case "contract_signature":
      return <FileSignature className="size-3.5 text-primary" />;
  }
}

function getBlockTitle(block: ContractBlock): string {
  switch (block.type) {
    case "contract_header":
      return `${block.brandName || "Letterhead"} Header`;
    case "contract_parties":
      return `Parties: Scalyx & ${block.clientName || "Client"}`;
    case "contract_preamble":
      return block.title || "Agreement Preamble";
    case "contract_clause":
      return `${block.clauseNumber} ${block.title || "Contract Clause"}`;
    case "contract_scope_table":
      return block.title || "Scope Deliverables Table";
    case "contract_commercials":
      return `${block.title || "Commercials"} (${block.totalValue || "₹0"})`;
    case "contract_signature":
      return `Signatures: ${block.clientSignatory || "Client Consent"}`;
  }
}

/**
 * Dedicated visual form fields for every contract block type
 */
function renderContractBlockForm(
  block: ContractBlock,
  onChange: (updated: ContractBlock) => void,
) {
  switch (block.type) {
    case "contract_header":
      return (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Agency / Brand Name
              </label>
              <Input
                value={block.brandName}
                onChange={(e) => onChange({ ...block, brandName: e.target.value })}
                placeholder="SCALYX"
                className="h-8 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Tagline / Engineering Scope
              </label>
              <Input
                value={block.brandSubtitle}
                onChange={(e) => onChange({ ...block, brandSubtitle: e.target.value })}
                placeholder="CUSTOM SOFTWARE ENGINEERING & CLOUD SYSTEMS"
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Contract Reference #
              </label>
              <Input
                value={block.referenceNo}
                onChange={(e) => onChange({ ...block, referenceNo: e.target.value })}
                placeholder="SCX-CTR-2026-088"
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Agreement Date
              </label>
              <Input
                type="date"
                value={block.agreementDate}
                onChange={(e) => onChange({ ...block, agreementDate: e.target.value })}
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Website
              </label>
              <Input
                value={block.website}
                onChange={(e) => onChange({ ...block, website: e.target.value })}
                placeholder="scalyx.in"
                className="h-8 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Official Email
              </label>
              <Input
                value={block.email}
                onChange={(e) => onChange({ ...block, email: e.target.value })}
                placeholder="contact@scalyx.in"
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      );

    case "contract_parties":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Provider Box */}
            <div className="p-3.5 bg-muted/20 border border-border/80 rounded-xl space-y-3">
              <div className="text-xs font-bold text-foreground pb-2 border-b border-border/60 flex items-center justify-between">
                <span>Party 1: Service Provider</span>
                <Badge variant="outline" className="text-[9px]">
                  Scalyx
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Entity / Agency Name
                  </label>
                  <Input
                    value={block.providerName}
                    onChange={(e) => onChange({ ...block, providerName: e.target.value })}
                    className="h-8 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Operating Entity
                  </label>
                  <Input
                    value={block.providerEntity}
                    onChange={(e) => onChange({ ...block, providerEntity: e.target.value })}
                    className="h-8 text-xs font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  Registered Address
                </label>
                <Input
                  value={block.providerAddress}
                  onChange={(e) => onChange({ ...block, providerAddress: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Authorized Signatory
                  </label>
                  <Input
                    value={block.providerSignatory}
                    onChange={(e) => onChange({ ...block, providerSignatory: e.target.value })}
                    className="h-8 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Signatory Title
                  </label>
                  <Input
                    value={block.providerSignatoryTitle}
                    onChange={(e) => onChange({ ...block, providerSignatoryTitle: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Client Counterparty Box */}
            <div className="p-3.5 bg-muted/20 border border-border/80 rounded-xl space-y-3">
              <div className="text-xs font-bold text-foreground pb-2 border-b border-border/60 flex items-center justify-between">
                <span>Party 2: Client / Counterparty</span>
                <Badge variant="outline" className="text-[9px] text-primary border-primary/20">
                  Client
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Client Contact Name
                  </label>
                  <Input
                    value={block.clientName}
                    onChange={(e) => onChange({ ...block, clientName: e.target.value })}
                    className="h-8 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Client Legal Entity
                  </label>
                  <Input
                    value={block.clientCompany}
                    onChange={(e) => onChange({ ...block, clientCompany: e.target.value })}
                    className="h-8 text-xs font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  Client Corporate Address
                </label>
                <Input
                  value={block.clientAddress}
                  onChange={(e) => onChange({ ...block, clientAddress: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Client Designation
                  </label>
                  <Input
                    value={block.clientSignatoryTitle}
                    onChange={(e) => onChange({ ...block, clientSignatoryTitle: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Client Email
                  </label>
                  <Input
                    value={block.clientEmail}
                    onChange={(e) => onChange({ ...block, clientEmail: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                    Client Phone
                  </label>
                  <Input
                    value={block.clientPhone}
                    onChange={(e) => onChange({ ...block, clientPhone: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "contract_preamble":
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Contract Title
              </label>
              <Input
                value={block.title}
                onChange={(e) => onChange({ ...block, title: e.target.value })}
                placeholder="MASTER PROFESSIONAL SERVICES AGREEMENT"
                className="h-8 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Effective Date
              </label>
              <Input
                type="date"
                value={block.effectiveDate}
                onChange={(e) => onChange({ ...block, effectiveDate: e.target.value })}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Preamble & Recitals Text (WHEREAS...)
            </label>
            <textarea
              value={block.body}
              onChange={(e) => onChange({ ...block, body: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 bg-muted/20 border border-border/80 rounded-xl text-xs font-normal text-foreground leading-relaxed focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      );

    case "contract_clause":
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Clause Number
              </label>
              <Input
                value={block.clauseNumber}
                onChange={(e) => onChange({ ...block, clauseNumber: e.target.value })}
                placeholder="1.0"
                className="h-8 text-xs font-mono font-bold"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Clause Title
              </label>
              <Input
                value={block.title}
                onChange={(e) => onChange({ ...block, title: e.target.value })}
                placeholder="Scope of Services & Deliverables"
                className="h-8 text-xs font-semibold"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Legal Provision & Terms Body
            </label>
            <textarea
              value={block.body}
              onChange={(e) => onChange({ ...block, body: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-muted/20 border border-border/80 rounded-xl text-xs font-normal text-foreground leading-relaxed focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      );

    case "contract_scope_table": {
      const addRow = () => {
        const newRow = {
          id: generateContractBlockId("row"),
          deliverable: "New Deliverable Module",
          specifications: "Technical scope details",
          timeline: "2 Weeks",
          acceptance: "Client sign-off criteria",
        };
        onChange({ ...block, rows: [...block.rows, newRow] });
      };

      const updateRow = (idx: number, patch: Partial<(typeof block.rows)[0]>) => {
        const nextRows = [...block.rows];
        nextRows[idx] = { ...nextRows[idx], ...patch };
        onChange({ ...block, rows: nextRows });
      };

      const removeRow = (idx: number) => {
        if (block.rows.length <= 1) return;
        onChange({ ...block, rows: block.rows.filter((_, i) => i !== idx) });
      };

      return (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Schedule Title
              </label>
              <Input
                value={block.title}
                onChange={(e) => onChange({ ...block, title: e.target.value })}
                placeholder="Schedule A: Itemized Scope & Milestone Deliverables"
                className="h-8 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Schedule Notes / Intro
              </label>
              <Input
                value={block.description}
                onChange={(e) => onChange({ ...block, description: e.target.value })}
                placeholder="The following milestones define the core deliverables of this contract"
                className="h-8 text-xs text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Deliverables & Milestone Specifications
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRow}
                className="h-7 text-xs font-medium gap-1 rounded-lg"
              >
                <Plus className="size-3" />
                <span>Add Row</span>
              </Button>
            </div>

            <div className="space-y-2">
              {block.rows.map((row, idx) => (
                <div
                  key={row.id}
                  className="p-3 bg-muted/20 border border-border/80 rounded-xl space-y-2 relative group"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-4">
                      <Input
                        value={row.deliverable}
                        onChange={(e) => updateRow(idx, { deliverable: e.target.value })}
                        placeholder="Deliverable Name"
                        className="h-8 text-xs font-medium"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <Input
                        value={row.specifications}
                        onChange={(e) => updateRow(idx, { specifications: e.target.value })}
                        placeholder="Technical scope specifications..."
                        className="h-8 text-xs text-muted-foreground"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        value={row.timeline}
                        onChange={(e) => updateRow(idx, { timeline: e.target.value })}
                        placeholder="Timeline (e.g. Week 2)"
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-1.5">
                      <Input
                        value={row.acceptance}
                        onChange={(e) => updateRow(idx, { acceptance: e.target.value })}
                        placeholder="Acceptance criteria"
                        className="h-8 text-xs text-muted-foreground"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRow(idx)}
                        disabled={block.rows.length <= 1}
                        className="size-7 text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case "contract_commercials": {
      const addTranche = () => {
        const newTranche = {
          id: generateContractBlockId("tranche"),
          milestone: "Next Milestone Tranche",
          percentage: "25%",
          amount: "₹25,000",
          dueCondition: "Upon deliverable acceptance",
        };
        onChange({ ...block, tranches: [...block.tranches, newTranche] });
      };

      const updateTranche = (idx: number, patch: Partial<(typeof block.tranches)[0]>) => {
        const next = [...block.tranches];
        next[idx] = { ...next[idx], ...patch };
        onChange({ ...block, tranches: next });
      };

      const removeTranche = (idx: number) => {
        if (block.tranches.length <= 1) return;
        onChange({ ...block, tranches: block.tranches.filter((_, i) => i !== idx) });
      };

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Commercial Schedule Title
              </label>
              <Input
                value={block.title}
                onChange={(e) => onChange({ ...block, title: e.target.value })}
                placeholder="Schedule B: Commercials & Payment Milestones"
                className="h-8 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Total Contract Value
              </label>
              <Input
                value={block.totalValue}
                onChange={(e) => onChange({ ...block, totalValue: e.target.value })}
                placeholder="₹1,50,000"
                className="h-8 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Payment Terms Summary
            </label>
            <Input
              value={block.paymentTermsSummary}
              onChange={(e) => onChange({ ...block, paymentTermsSummary: e.target.value })}
              placeholder="All invoices payable net 7 days via wire transfer..."
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                Payment Milestones & Tranches
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTranche}
                className="h-7 text-xs font-medium gap-1 rounded-lg"
              >
                <Plus className="size-3" />
                <span>Add Tranche</span>
              </Button>
            </div>

            <div className="space-y-2">
              {block.tranches.map((tr, idx) => (
                <div
                  key={tr.id}
                  className="p-3 bg-muted/20 border border-border/80 rounded-xl space-y-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-4">
                      <Input
                        value={tr.milestone}
                        onChange={(e) => updateTranche(idx, { milestone: e.target.value })}
                        placeholder="Milestone Name"
                        className="h-8 text-xs font-medium"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        value={tr.percentage}
                        onChange={(e) => updateTranche(idx, { percentage: e.target.value })}
                        placeholder="Share (40%)"
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        value={tr.amount}
                        onChange={(e) => updateTranche(idx, { amount: e.target.value })}
                        placeholder="Amount (₹60,000)"
                        className="h-8 text-xs font-mono font-bold"
                      />
                    </div>
                    <div className="sm:col-span-4 flex items-center gap-1.5">
                      <Input
                        value={tr.dueCondition}
                        onChange={(e) => updateTranche(idx, { dueCondition: e.target.value })}
                        placeholder="Trigger condition..."
                        className="h-8 text-xs text-muted-foreground"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTranche(idx)}
                        disabled={block.tranches.length <= 1}
                        className="size-7 text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Invoicing Policy
              </label>
              <Input
                value={block.invoicingNotes}
                onChange={(e) => onChange({ ...block, invoicingNotes: e.target.value })}
                placeholder="Invoices transmitted electronically upon milestone..."
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Late Payment Penalty Policy
              </label>
              <Input
                value={block.lateFeePolicy}
                onChange={(e) => onChange({ ...block, lateFeePolicy: e.target.value })}
                placeholder="Late fee 1.5% per month..."
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>
      );
    }

    case "contract_signature": {
      // Dynamic replacement helper preview
      const previewPledge = (block.agreementDisclaimer || `By signing this I, [client_name] am in full agreement about all of the clauses mentioned above`)
        .replace(/\[client_name\]/gi, block.clientSignatory || "Client");

      return (
        <div className="space-y-4">
          {/* Client Signatory Box Only - Issued under company's name */}
          <div className="p-4 bg-muted/20 border-2 border-primary/40 rounded-xl space-y-3.5">
            <div className="text-xs font-bold text-foreground pb-2 border-b border-border/60 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileSignature className="size-3.5 text-primary" />
                <span>Client Counterparty Execution (Issued Under Scalyx)</span>
              </span>
              <Badge variant="outline" className="text-[9px] text-primary border-primary/20">
                Client Signing Place
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  Client Entity Title
                </label>
                <Input
                  value={block.clientTitle}
                  onChange={(e) => onChange({ ...block, clientTitle: e.target.value })}
                  placeholder="ACME ENTERPRISES PVT. LTD."
                  className="h-8 text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  Execution Date
                </label>
                <Input
                  type="date"
                  value={block.clientDate}
                  onChange={(e) => onChange({ ...block, clientDate: e.target.value })}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  Authorized Client Signatory Name
                </label>
                <Input
                  value={block.clientSignatory}
                  onChange={(e) => onChange({ ...block, clientSignatory: e.target.value })}
                  placeholder="e.g. John Doe / Client Name"
                  className="h-8 text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                  Signatory Designation / Title
                </label>
                <Input
                  value={block.clientDesignation}
                  onChange={(e) => onChange({ ...block, clientDesignation: e.target.value })}
                  placeholder="Managing Director / Authorized Representative"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* REQUIRED EXACT CLIENT CONSENT PLEDGE */}
          <div className="p-4 bg-primary/5 border border-primary/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>Client Agreement Pledge (Printed Under Client Signature)</span>
                <Badge variant="outline" className="text-[9px] bg-background text-primary border-primary/20">
                  Mandatory Legal Term
                </Badge>
              </label>
              <span className="text-[10px] text-muted-foreground font-mono">
                Supports [client_name] placeholder
              </span>
            </div>
            <Input
              value={block.agreementDisclaimer}
              onChange={(e) => onChange({ ...block, agreementDisclaimer: e.target.value })}
              placeholder="By signing this I, [client_name] am in full agreement about all of the clauses mentioned above"
              className="h-9 text-xs font-medium bg-background"
            />
            <div className="text-[11px] text-muted-foreground bg-muted/40 p-2 rounded-lg font-mono">
              <strong>Live Rendered Text:</strong> &ldquo;{previewPledge}&rdquo;
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Countersign Note / Return Instructions
            </label>
            <Input
              value={block.countersignNote}
              onChange={(e) => onChange({ ...block, countersignNote: e.target.value })}
              placeholder="Please sign in the designated space above and return one signed digital copy via email to contact@scalyx.in"
              className="h-8 text-xs text-muted-foreground"
            />
          </div>
        </div>
      );
    }
  }
}

