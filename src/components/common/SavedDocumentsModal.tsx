"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FolderClock,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Building,
  DollarSign,
} from "lucide-react";

export interface SavedDocSummary {
  id: string;
  name?: string;
  title: string;
  clientName?: string;
  clientCompany?: string;
  dealValue?: string;
  updatedAt: string;
  createdAt?: string;
  blocksCount: number;
}

interface SavedDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: "proposal" | "contract";
  documents: SavedDocSummary[];
  currentId: string | null;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateBlank: () => void;
  isLoading?: boolean;
}

function formatRelativeTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffSecs = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffSecs < 10) return "Just now";
    if (diffSecs < 60) return `${diffSecs}s ago`;
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function SavedDocumentsModal({
  isOpen,
  onClose,
  documentType,
  documents,
  currentId,
  onLoad,
  onDelete,
  onCreateBlank,
  isLoading = false,
}: SavedDocumentsModalProps) {
  const [query, setQuery] = useState("");

  const filtered = documents.filter((doc) => {
    const q = query.toLowerCase();
    const nameMatch = (doc.name || "").toLowerCase().includes(q);
    const titleMatch = (doc.title || "").toLowerCase().includes(q);
    const clientMatch = (doc.clientName || "").toLowerCase().includes(q);
    const companyMatch = (doc.clientCompany || "").toLowerCase().includes(q);
    return nameMatch || titleMatch || clientMatch || companyMatch;
  });

  const labelSingular = documentType === "proposal" ? "Proposal" : "Contract";
  const labelPlural = documentType === "proposal" ? "Proposals" : "Contracts";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[94vw] sm:max-w-xl md:max-w-2xl bg-card rounded-2xl border border-border/80 shadow-2xl p-6 max-h-[88vh] flex flex-col">
        <DialogHeader className="shrink-0 pb-3 border-b border-border/70">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FolderClock className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Saved {labelPlural} &amp; Drafts
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Select and load any previously saved draft or blank session into
                  the visual editor.
                </DialogDescription>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onCreateBlank();
                onClose();
              }}
              className="h-8 text-xs font-semibold gap-1.5 rounded-lg shrink-0"
            >
              <Plus className="size-3.5" />
              <span>New Blank {labelSingular}</span>
            </Button>
          </div>

          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search saved ${labelPlural.toLowerCase()} by title, client, or company...`}
              className="h-9 pl-9 text-xs rounded-lg bg-background"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 min-h-[220px]">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Loading saved {labelPlural.toLowerCase()}...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/80 p-6">
              <FileText className="size-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="font-semibold text-foreground">
                {query ? "No matching saved drafts found" : `No saved ${labelPlural.toLowerCase()} yet`}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 max-w-xs mx-auto">
                {query
                  ? "Try searching with a different client name or keyword."
                  : `Your drafts auto-save continuously every 1 second as you edit. You can also start a fresh blank ${labelSingular.toLowerCase()}.`}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onCreateBlank();
                  onClose();
                }}
                className="mt-3.5 h-8 text-xs gap-1.5 rounded-lg border-primary/30 text-primary"
              >
                <Plus className="size-3.5" />
                <span>Create Blank {labelSingular}</span>
              </Button>
            </div>
          ) : (
            filtered.map((doc) => {
              const isCurrent = doc.id === currentId;
              const clientInfo =
                doc.clientCompany || doc.clientName
                  ? `${doc.clientCompany || ""}${
                      doc.clientCompany && doc.clientName ? " • " : ""
                    }${doc.clientName || ""}`
                  : null;

              return (
                <div
                  key={doc.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? "border-primary/50 bg-primary/5 shadow-2xs"
                      : "border-border/70 bg-card hover:border-primary/30 hover:bg-muted/30"
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-foreground truncate max-w-[280px]">
                        {doc.name || doc.title || `Untitled ${labelSingular}`}
                      </span>
                      {doc.name && doc.title && doc.name !== doc.title && (
                        <span className="text-[10.5px] text-muted-foreground/80 font-mono truncate max-w-[180px]">
                          ({doc.title})
                        </span>
                      )}
                      {isCurrent && (
                        <Badge
                          variant="outline"
                          className="h-5 px-1.5 text-[9.5px] font-semibold border-primary/30 text-primary bg-primary/10 rounded-full"
                        >
                          <CheckCircle2 className="size-2.5 mr-1" />
                          Currently Loaded
                        </Badge>
                      )}
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {doc.blocksCount} {doc.blocksCount === 1 ? "section" : "sections"}
                      </span>
                      {doc.dealValue && (
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-semibold">
                          {doc.dealValue}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                      {clientInfo && (
                        <span className="flex items-center gap-1 text-foreground/80 font-medium truncate max-w-[220px]">
                          <Building className="size-3 text-muted-foreground" />
                          <span>{clientInfo}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-mono text-[10.5px]">
                        <Clock className="size-3" />
                        <span>Saved {formatRelativeTime(doc.updatedAt)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      variant={isCurrent ? "outline" : "default"}
                      onClick={() => {
                        onLoad(doc.id);
                        onClose();
                      }}
                      className="h-8 text-xs font-semibold gap-1.5 rounded-lg"
                    >
                      <span>{isCurrent ? "Active" : "Load Draft"}</span>
                      {!isCurrent && <ArrowRight className="size-3" />}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure you want to delete "${doc.title || `Untitled ${labelSingular}`}"? This cannot be undone.`
                          )
                        ) {
                          onDelete(doc.id);
                        }
                      }}
                      title="Delete Draft"
                      className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter className="mt-2 pt-2 border-t border-border/70 flex items-center justify-between sm:justify-between w-full">
          <span className="text-[11px] text-muted-foreground font-mono">
            {documents.length} {documents.length === 1 ? "document" : "documents"} saved
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-lg text-xs"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

