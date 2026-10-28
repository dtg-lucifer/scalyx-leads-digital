"use client";

import React, { useState, useEffect } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Deliverable, DeliverableCategory } from "@/types/deliverable";
import { Lead } from "@/types/lead";
import {
  PackageCheck,
  Upload,
  Download,
  Clock,
  Trash2,
  RotateCcw,
  Plus,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Search,
  Filter,
  X,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function DeliverablesPage() {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<DeliverableCategory>("deliverable_from_us");
  const [loading, setLoading] = useState(true);
  const [retentionDays, setRetentionDays] = useState(3);

  // New Deliverable Modal
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [leadId, setLeadId] = useState("");
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Client & Search Filter state
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [delivRes, leadsRes, settingsRes] = await Promise.all([
        fetch("/api/deliverables"),
        fetch("/api/leads"),
        fetch("/api/settings"),
      ]);

      const [delivData, leadsData, settingsData] = await Promise.all([
        delivRes.json(),
        leadsRes.json(),
        settingsRes.json(),
      ]);

      if (delivData.deliverables) setDeliverables(delivData.deliverables);
      if (leadsData.leads) setLeads(leadsData.leads);
      if (settingsData.retentionDays) setRetentionDays(settingsData.retentionDays);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownload = (id: string, url?: string) => {
    try {
      const downloadEndpoint = `/api/deliverables/${id}/download`;
      const link = document.createElement("a");
      link.href = downloadEndpoint;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        fetchData();
      }, 800);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await fetch(`/api/deliverables/${id}/restore`, { method: "POST" });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this item?")) return;
    try {
      await fetch(`/api/deliverables?id=${id}`, { method: "DELETE" });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !leadId) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("leadId", leadId);
      formData.append("category", activeTab);
      if (fileObj) {
        formData.append("file", fileObj);
      } else {
        formData.append("fileName", "package.zip");
        formData.append("fileSize", "4194304");
      }

      const res = await fetch("/api/deliverables", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setIsOpen(false);
        setTitle("");
        setDescription("");
        setFileObj(null);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = deliverables.filter((d) => {
    if (d.category !== activeTab) return false;
    if (selectedClientFilter !== "all" && d.leadId !== selectedClientFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchFile = d.fileName.toLowerCase().includes(q);
      const matchClient = (d.leadName || "").toLowerCase().includes(q);
      if (!matchTitle && !matchFile && !matchClient) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AppNavbar
        title="Deliverables & Collectibles"
        description="Stream agency deliverables & client collectible assets with auto soft-delete countdowns."
        actions={
          <Button
            type="button"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="gap-1.5 text-xs h-9 font-semibold"
          >
            <Plus className="size-3.5" />
            <span>
              {activeTab === "deliverable_from_us" ? "Add Deliverable" : "Add Collectible"}
            </span>
          </Button>
        }
      />

      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Retention Policy Banner */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="font-bold text-sm">
                Active Retention Policy: {retentionDays} Days After Download
              </p>
              <p className="text-xs opacity-90 mt-0.5 leading-relaxed">
                Once downloaded by the respective party, uploaded materials will be soft deleted after{" "}
                <strong>{retentionDays} days</strong>. You can customize this timeframe in{" "}
                <a href="/settings" className="underline font-bold hover:text-amber-900">
                  Settings
                </a>.
              </p>
            </div>
          </div>

          <a href="/settings" className="shrink-0">
            <Button variant="outline" size="sm" className="h-9 text-xs border-amber-500/30 rounded-xl font-semibold">
              Change in Settings
            </Button>
          </a>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("deliverable_from_us")}
            className={`pb-3.5 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "deliverable_from_us"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <PackageCheck className="size-4" />
            <span>Deliverables (From Us to Client)</span>
            <Badge variant="secondary" className="text-[11px] ml-1 rounded-full px-2 py-0.5 font-medium">
              {deliverables.filter((d) => d.category === "deliverable_from_us").length}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("collectible_from_client")}
            className={`pb-3.5 px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "collectible_from_client"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Upload className="size-4" />
            <span>Collectibles (From Client to Us)</span>
            <Badge variant="secondary" className="text-[11px] ml-1 rounded-full px-2 py-0.5 font-medium">
              {deliverables.filter((d) => d.category === "collectible_from_client").length}
            </Badge>
          </button>
        </div>

        {/* Client & Search Filter Controls Bar */}
        <div className="bg-card border border-border/80 rounded-2xl shadow-xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search package title or filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-xs sm:text-sm rounded-xl bg-muted/20 border-border/80 focus:bg-background"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Client Filter Dropdown */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building className="size-4 text-primary" />
              <span className="font-semibold text-foreground">Client:</span>
              <select
                value={selectedClientFilter}
                onChange={(e) => setSelectedClientFilter(e.target.value)}
                className="h-10 px-3 bg-muted/20 border border-border/80 text-xs text-foreground focus:outline-none focus:bg-background rounded-xl font-medium"
              >
                <option value="all">All Clients ({leads.length})</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} {l.company ? `(${l.company})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {(selectedClientFilter !== "all" || searchQuery) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedClientFilter("all");
                  setSearchQuery("");
                }}
                className="h-10 px-3 text-xs text-muted-foreground hover:text-foreground rounded-xl gap-1"
              >
                <X className="size-3" />
                <span>Reset Filters</span>
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground font-medium self-end sm:self-center">
            Showing <strong className="text-foreground">{filteredItems.length}</strong> items
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-card border border-border/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[950px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30 font-semibold text-muted-foreground text-xs">
                  <th className="py-3.5 px-4 min-w-[200px]">Asset Title & File</th>
                  <th className="py-3.5 px-4 min-w-[150px]">Client / Lead</th>
                  <th className="py-3.5 px-4 min-w-[140px]">Downloads</th>
                  <th className="py-3.5 px-4 min-w-[170px]">Retention Countdown</th>
                  <th className="py-3.5 px-4 min-w-[110px]">Status</th>
                  <th className="py-3.5 px-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-muted-foreground">
                      <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-xs font-medium">Loading deliverables...</p>
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-muted-foreground">
                      <div className="max-w-sm mx-auto flex flex-col items-center">
                        <div className="size-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-3 shadow-2xs">
                          <PackageCheck className="size-6" />
                        </div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                          No {activeTab === "deliverable_from_us" ? "Deliverables" : "Collectibles"} Found
                        </h4>
                        <p className="text-xs text-muted-foreground mb-4">
                          Upload files to share with client portals or request assets from clients.
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setIsOpen(true)}
                          className="rounded-xl gap-1.5 font-semibold"
                        >
                          <Plus className="size-3.5" />
                          <span>{activeTab === "deliverable_from_us" ? "Add Deliverable" : "Add Collectible"}</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-foreground">{item.title}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {item.fileName} • {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-foreground">
                        {item.leadName || "Acme Client"}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-muted-foreground">
                          <Download className="size-3 text-primary" />
                          <span>{item.downloadCount} times</span>
                        </div>
                        {item.downloadedAt && (
                          <div className="text-[10px] text-muted-foreground">
                            1st: {new Date(item.downloadedAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      {/* Retention Countdown */}
                      <td className="py-3.5 px-4">
                        {item.isSoftDeleted ? (
                          <div className="flex items-center gap-1.5 text-destructive font-semibold">
                            <AlertTriangle className="size-3.5" />
                            <span>Soft Deleted (Period Expired)</span>
                          </div>
                        ) : item.downloadedAt ? (
                          <div>
                            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                              {(() => {
                                if (!item.softDeleteAt) return "Active countdown";
                                const diff = new Date(item.softDeleteAt).getTime() - Date.now();
                                if (diff <= 0) return "Expired (Auto-delete pending)";
                                const totalH = Math.floor(diff / (1000 * 60 * 60));
                                const d = Math.floor(totalH / 24);
                                const h = totalH % 24;
                                return d > 0 ? `${d}d ${h}h remaining` : `${totalH}h remaining`;
                              })()}
                            </span>
                            <div className="text-[10px] text-muted-foreground">
                              Auto-deletes {new Date(item.softDeleteAt || "").toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-[11px]">
                            Not downloaded yet (Timer pending)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {item.isSoftDeleted ? (
                          <Badge variant="destructive" className="text-[10px]">Soft Deleted</Badge>
                        ) : item.downloadCount > 0 ? (
                          <Badge variant="secondary" className="text-[10px] text-amber-600">Active Countdown</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-emerald-600">Fresh Upload</Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!item.isSoftDeleted ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(item.id, item.fileUrl)}
                              className="h-7 text-xs gap-1"
                            >
                              <Download className="size-3" />
                              <span>Download</span>
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestore(item.id)}
                              className="h-7 text-xs gap-1 text-primary"
                            >
                              <RotateCcw className="size-3" />
                              <span>Restore</span>
                            </Button>
                          )}

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            className="size-7 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Deliverable / Collectible Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[94vw] sm:max-w-xl md:max-w-2xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <PackageCheck className="size-4 text-primary" />
              <span>
                {activeTab === "deliverable_from_us" ? "Upload Deliverable for Client" : "Register Collectible from Client"}
              </span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Client / Lead <span className="text-destructive">*</span>
              </label>
              <select
                required
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg bg-transparent border border-input text-xs text-foreground focus:outline-none"
              >
                <option value="" className="bg-card">Select Client...</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id} className="bg-card">
                    {l.name} ({l.company || "Independent"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Asset Title <span className="text-destructive">*</span>
              </label>
              <Input
                required
                placeholder="e.g. Next.js SaaS MVP Final Production Bundle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 text-xs rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Description / Release Notes
              </label>
              <Textarea
                rows={2}
                placeholder="Included artifacts, migration instructions, design tokens..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                File Package
              </label>
              <Input
                type="file"
                onChange={(e) => setFileObj(e.target.files?.[0] || null)}
                className="text-xs file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-2.5 file:py-1 file:text-xs file:mr-2 cursor-pointer"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)} className="rounded-lg">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="font-semibold rounded-lg">
                {submitting ? "Uploading..." : "Save Package"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
