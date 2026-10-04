"use client";

import React, { useState, useEffect } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { Lead, LeadStatus, LeadSource } from "@/types/lead";
import {
  Users,
  Plus,
  Search,
  Download,
  ExternalLink,
  FolderTree,
  PackageCheck,
  Kanban,
  FileText,
  DollarSign,
  TrendingUp,
  Sparkles,
  Eye,
  Trash2,
  Edit2,
  Copy,
  Check,
  Mail,
  Phone,
  Building,
  KeyRound,
  Filter,
  Save,
  MessageSquare,
  Clock,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

const STATUS_CONFIG: Record<LeadStatus, { color: string; bg: string }> = {
  New: { color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  Contacted: { color: "text-purple-700 dark:text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  Qualified: { color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  "Proposal Sent": { color: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  Won: { color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  Lost: { color: "text-rose-700 dark:text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  Completed: { color: "text-teal-700 dark:text-teal-400", bg: "bg-teal-500/10 border-teal-500/20" },
};

const SOURCES: LeadSource[] = [
  "Website",
  "Referral",
  "LinkedIn",
  "Twitter / X",
  "Upwork",
  "Fiverr",
  "Cold Outreach",
  "Personal Network",
  "Other",
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  // Add Lead Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    roleTitle: "",
    source: "Website" as LeadSource,
    status: "New" as LeadStatus,
    dealValue: 50000,
    currency: "INR",
    notes: "",
    remarks: "",
    sendWelcomeEmail: false,
  });

  // Selected Lead Details Sheet
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadRelations, setLeadRelations] = useState<any>(null);
  const [relationsLoading, setRelationsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPortalUrl, setCopiedPortalUrl] = useState(false);

  // Edit Drawer State
  const [editStatus, setEditStatus] = useState<LeadStatus>("New");
  const [editRevenue, setEditRevenue] = useState(0);
  const [editRemarks, setEditRemarks] = useState("");
  const [savingDrawer, setSavingDrawer] = useState(false);
  const [sendingPortalEmail, setSendingPortalEmail] = useState(false);
  const [portalEmailToast, setPortalEmailToast] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleOpenDetails = async (lead: Lead) => {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setEditRevenue(lead.revenueCollected);
    setEditRemarks(lead.remarks || "");
    setRelationsLoading(true);

    try {
      const res = await fetch(`/api/leads/${lead.id}`);
      const data = await res.json();
      if (data.relations) {
        setLeadRelations(data.relations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRelationsLoading(false);
    }
  };

  const handleSaveDrawerDetails = async () => {
    if (!selectedLead) return;
    try {
      setSavingDrawer(true);
      const res = await fetch(`/api/leads/${selectedLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          revenueCollected: Number(editRevenue),
          remarks: editRemarks,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedLead((prev) => (prev ? { ...prev, ...data.lead } : null));
        await fetchLeads();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingDrawer(false);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.email) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddOpen(false);
        setNewLead({
          name: "",
          email: "",
          phone: "",
          company: "",
          roleTitle: "",
          source: "Website",
          status: "New",
          dealValue: 50000,
          currency: "INR",
          notes: "",
          remarks: "",
          sendWelcomeEmail: false,
        });
        await fetchLeads();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead? All associated records will be removed.")) return;
    try {
      await fetch(`/api/leads/${id}`, { method: "DELETE" });
      setSelectedLead(null);
      await fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendPortalCredentialsEmail = async (lead: Lead) => {
    try {
      setSendingPortalEmail(true);
      const portalSlug = leadRelations?.portal?.slug || lead.id;
      const portalUrl = `${window.location.origin}/portal/${portalSlug}`;
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: lead.email,
          subject: `Your Scalyx Project Portal Access Password • ${lead.company || lead.name}`,
          templateId: "portal_credentials",
          params: {
            clientName: lead.name,
            portalUrl,
            portalPassword: lead.portalAccessCode || "pass-1234",
            customMessage: "Use this confidential code to access your live project growth charts, notices, and deliverables.",
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPortalEmailToast("Credentials email dispatched via Resend!");
      } else {
        setPortalEmailToast(data.error || "Failed to send email");
      }
    } catch (err: any) {
      setPortalEmailToast(err.message || "Failed to send email");
    } finally {
      setSendingPortalEmail(false);
      setTimeout(() => setPortalEmailToast(null), 4000);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyPortalUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedPortalUrl(true);
    setTimeout(() => setCopiedPortalUrl(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Company", "Source", "Status", "Deal Value", "Revenue Collected", "Remarks"];
    const rows = leads.map((l) => [
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.phone || ""}"`,
      `"${l.company || ""}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      l.dealValue,
      l.revenueCollected,
      `"${(l.remarks || "").replace(/"/g, '""')}"`,
    ]);

    const csvText = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `LeadsDigital_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Filter leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    const matchesSource = sourceFilter === "all" || l.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  // KPI calculations
  const totalPipelineValue = leads.reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0);
  const totalCollectedRevenue = leads.reduce((sum, l) => sum + (Number(l.revenueCollected) || 0), 0);
  const wonLeadsCount = leads.filter((l) => l.status === "Won" || l.status === "Completed").length;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AppNavbar
        title="Leads Record"
        description="Excel-like relational database to manage client relationships, documents & revenue."
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="gap-1.5 text-xs h-9 rounded-none"
            >
              <Download className="size-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setIsAddOpen(true)}
              className="gap-1.5 text-xs h-9 font-semibold rounded-none"
            >
              <Plus className="size-3.5" />
              <span>Add Lead</span>
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-card border border-border rounded-none shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Revenue Collected
              </p>
              <h2 className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                ₹{totalCollectedRevenue.toLocaleString("en-IN")}
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Across closed deals</p>
            </div>
            <div className="size-11 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center rounded-none">
              <DollarSign className="size-5" />
            </div>
          </div>

          <div className="p-5 bg-card border border-border rounded-none shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pipeline Deal Value
              </p>
              <h2 className="text-2xl font-bold font-mono text-primary mt-1">
                ₹{totalPipelineValue.toLocaleString("en-IN")}
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Total opportunity pipeline</p>
            </div>
            <div className="size-11 bg-primary/10 border border-primary/20 text-primary flex items-center justify-center rounded-none">
              <TrendingUp className="size-5" />
            </div>
          </div>

          <div className="p-5 bg-card border border-border rounded-none shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Client Relationships
              </p>
              <h2 className="text-2xl font-bold text-foreground mt-1">
                {leads.length} <span className="text-xs font-normal text-muted-foreground">leads ({wonLeadsCount} won)</span>
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">Linked to drive & portals</p>
            </div>
            <div className="size-11 bg-accent text-foreground flex items-center justify-center rounded-none">
              <Users className="size-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-card border border-border rounded-none shadow-xs">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search leads by name, email, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs rounded-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter className="size-3.5" />
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 px-2 bg-transparent border border-input text-xs text-foreground focus:outline-none rounded-none"
              >
                <option value="all" className="bg-card">All Statuses</option>
                <option value="New" className="bg-card">New</option>
                <option value="Contacted" className="bg-card">Contacted</option>
                <option value="Qualified" className="bg-card">Qualified</option>
                <option value="Proposal Sent" className="bg-card">Proposal Sent</option>
                <option value="Won" className="bg-card">Won</option>
                <option value="Completed" className="bg-card">Completed</option>
                <option value="Lost" className="bg-card">Lost</option>
              </select>
            </div>

            {/* Source Filter */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Source:</span>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="h-8 px-2 bg-transparent border border-input text-xs text-foreground focus:outline-none rounded-none"
              >
                <option value="all" className="bg-card">All Sources</option>
                {SOURCES.map((s) => (
                  <option key={s} value={s} className="bg-card">{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-muted-foreground font-mono">
            Showing <strong>{filteredLeads.length}</strong> of {leads.length} records
          </div>
        </div>

        {/* Excel-like Relational Table View */}
        <div className="bg-card border border-border rounded-none shadow-xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1150px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 min-w-[200px]">Client / Lead</th>
                  <th className="py-3 px-4 min-w-[130px]">Source</th>
                  <th className="py-3 px-4 min-w-[120px]">Status</th>
                  <th className="py-3 px-4 min-w-[120px] text-right">Deal Value</th>
                  <th className="py-3 px-4 min-w-[130px] text-right font-bold text-emerald-600 dark:text-emerald-400">
                    Revenue Recv
                  </th>
                  <th className="py-3 px-4 min-w-[220px]">Relations Hub</th>
                  <th className="py-3 px-4 min-w-[160px]">Remarks</th>
                  <th className="py-3 px-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-muted-foreground">
                      <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading relational records...
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-muted-foreground">
                      No leads found matching your search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, idx) => {
                    const statusCfg = STATUS_CONFIG[lead.status] || { color: "text-foreground", bg: "bg-muted" };
                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-muted/40 transition-colors group cursor-pointer"
                        onClick={() => handleOpenDetails(lead)}
                      >
                        <td className="py-3.5 px-4 text-center font-mono text-muted-foreground">
                          {String(idx + 1).padStart(2, "0")}
                        </td>

                        {/* Client details */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {lead.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            {lead.company && <span>{lead.company} •</span>}
                            <span>{lead.email}</span>
                          </div>
                        </td>

                        {/* Source */}
                        <td className="py-3.5 px-4">
                          <Badge variant="outline" className="text-[11px] font-normal rounded-none">
                            {lead.source}
                          </Badge>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold border rounded-none ${statusCfg.color} ${statusCfg.bg}`}
                          >
                            {lead.status}
                          </span>
                        </td>

                        {/* Deal Value */}
                        <td className="py-3.5 px-4 text-right font-mono font-medium text-foreground">
                          ₹{Number(lead.dealValue).toLocaleString("en-IN")}
                        </td>

                        {/* Revenue Collected */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{Number(lead.revenueCollected).toLocaleString("en-IN")}
                        </td>

                        {/* Relational Hub Badges */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              title="Connected Documents in Drive"
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted/60 border border-border text-[11px] text-muted-foreground rounded-none"
                            >
                              <FolderTree className="size-3 text-primary" />
                              <span>{lead.documentsCount ?? 0} docs</span>
                            </span>

                            <span
                              title="Active Deliverables"
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted/60 border border-border text-[11px] text-muted-foreground rounded-none"
                            >
                              <PackageCheck className="size-3 text-emerald-500" />
                              <span>{lead.deliverablesCount ?? 0} deliv</span>
                            </span>

                            <span
                              title="Linked Projects"
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted/60 border border-border text-[11px] text-muted-foreground rounded-none"
                            >
                              <Kanban className="size-3 text-purple-500" />
                              <span>{lead.projectsCount ?? 0} proj</span>
                            </span>
                          </div>
                        </td>

                        {/* Remarks */}
                        <td className="py-3.5 px-4 text-muted-foreground truncate max-w-[180px]" title={lead.remarks || ""}>
                          {lead.remarks || <span className="italic text-muted-foreground/60">—</span>}
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDetails(lead)}
                              title="Open Relational Drawer"
                              className="size-7 text-muted-foreground hover:text-foreground rounded-none"
                            >
                              <Eye className="size-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteLead(lead.id)}
                              title="Delete Lead"
                              className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-none"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Lead Dialog Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="w-[94vw] sm:max-w-xl md:max-w-2xl bg-card rounded-none border border-border p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Plus className="size-4 text-primary" />
              <span>Create New Client Lead</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateLead} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Client Full Name <span className="text-destructive">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Vikram Singhania"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="h-9 text-xs rounded-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Company / Organization
                </label>
                <Input
                  placeholder="e.g. Singhania Tech Ltd"
                  value={newLead.company}
                  onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                  className="h-9 text-xs rounded-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <Input
                  required
                  type="email"
                  placeholder="vikram@singhaniatech.com"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="h-9 text-xs rounded-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Phone / WhatsApp
                </label>
                <Input
                  placeholder="+91 98200 55443"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  className="h-9 text-xs rounded-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Lead Source
                </label>
                <select
                  value={newLead.source}
                  onChange={(e) => setNewLead({ ...newLead, source: e.target.value as any })}
                  className="w-full h-9 px-2 bg-transparent border border-input text-xs text-foreground focus:outline-none rounded-none"
                >
                  {SOURCES.map((s) => (
                    <option key={s} value={s} className="bg-card">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Pipeline Status
                </label>
                <select
                  value={newLead.status}
                  onChange={(e) => setNewLead({ ...newLead, status: e.target.value as any })}
                  className="w-full h-9 px-2 bg-transparent border border-input text-xs text-foreground focus:outline-none rounded-none"
                >
                  <option value="New" className="bg-card">New</option>
                  <option value="Contacted" className="bg-card">Contacted</option>
                  <option value="Qualified" className="bg-card">Qualified</option>
                  <option value="Proposal Sent" className="bg-card">Proposal Sent</option>
                  <option value="Won" className="bg-card">Won</option>
                  <option value="Completed" className="bg-card">Completed</option>
                  <option value="Lost" className="bg-card">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Deal Value (₹)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={newLead.dealValue}
                  onChange={(e) => setNewLead({ ...newLead, dealValue: parseFloat(e.target.value) || 0 })}
                  className="h-9 text-xs font-mono rounded-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Internal Notes & Remarks
              </label>
              <Textarea
                rows={2}
                placeholder="Key requirements, milestones agreed, meeting summary..."
                value={newLead.remarks}
                onChange={(e) => setNewLead({ ...newLead, remarks: e.target.value })}
                className="text-xs rounded-none"
              />
            </div>

            {/* Welcome Email Option */}
            <div className="p-3 border border-border bg-muted/20 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="sendWelcomeEmail"
                checked={newLead.sendWelcomeEmail}
                onChange={(e) => setNewLead({ ...newLead, sendWelcomeEmail: e.target.checked })}
                className="mt-0.5 size-4 accent-primary rounded-none cursor-pointer"
              />
              <label htmlFor="sendWelcomeEmail" className="text-xs cursor-pointer select-none">
                <span className="font-semibold text-foreground block">
                  Send welcome email with client portal access credentials
                </span>
                <span className="text-[11px] text-muted-foreground block mt-0.5">
                  Automatically delivers an onboarding email with their portal link and password via Resend. (You can also send or regenerate this later anytime).
                </span>
              </label>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="rounded-none">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submitting} className="font-semibold rounded-none">
                {submitting ? "Saving..." : "Create Client & Hub"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Redesigned Sharp-Cornered Slide-Over Drawer for Selected Lead */}
      <Sheet open={Boolean(selectedLead)} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <SheetContent className="overflow-y-auto bg-card border-l border-border p-0 rounded-none w-full max-w-2xl">
          {selectedLead && (
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="p-6 border-b border-border bg-muted/20">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-primary border-primary/20 text-[10px] rounded-none font-semibold">
                    Client Hub
                  </Badge>
                  <span className="text-[11px] font-mono text-muted-foreground">ID: {selectedLead.id}</span>
                </div>

                <h2 className="text-xl font-bold text-foreground">{selectedLead.name}</h2>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                  {selectedLead.company && (
                    <span className="flex items-center gap-1">
                      <Building className="size-3" />
                      {selectedLead.company}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Mail className="size-3" />
                    {selectedLead.email}
                  </span>
                  {selectedLead.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="size-3" />
                      {selectedLead.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* 1. Client Portal Access Credentials Card */}
                <div className="border border-border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs text-foreground uppercase tracking-wider">
                      <KeyRound className="size-3.5 text-primary" />
                      <span>Dedicated Client Portal</span>
                    </div>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-500/20 text-[10px] rounded-none">
                      Password Protected
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Your client uses this unique password to access their live progress dashboard and deliverables without creating an account.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="border border-border p-3 bg-muted/20">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                        Portal Link
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <a
                          href={`/portal/${leadRelations?.portal?.slug || selectedLead.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-mono text-xs truncate"
                        >
                          /portal/{leadRelations?.portal?.slug || selectedLead.id}
                        </a>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleCopyPortalUrl(
                              `${window.location.origin}/portal/${leadRelations?.portal?.slug || selectedLead.id}`
                            )
                          }
                          className="size-6 text-muted-foreground hover:text-foreground rounded-none"
                        >
                          {copiedPortalUrl ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                        </Button>
                      </div>
                    </div>

                    <div className="border border-border p-3 bg-muted/20">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                        Client Password
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <code className="font-mono text-xs font-bold text-foreground">
                          {selectedLead.portalAccessCode || "pass-1234"}
                        </code>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyCode(selectedLead.portalAccessCode || "")}
                          className="size-6 text-muted-foreground hover:text-foreground rounded-none"
                        >
                          {copiedKey ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action: Email Credentials via Resend */}
                  <div className="pt-3 border-t border-border flex items-center justify-between gap-3 flex-wrap">
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <Mail className="size-3 text-primary" />
                      <span>Send portal login details directly to client via Resend email</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={sendingPortalEmail}
                      onClick={() => handleSendPortalCredentialsEmail(selectedLead)}
                      className="h-7 text-xs font-semibold rounded-none gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <Mail className="size-3" />
                      <span>{sendingPortalEmail ? "Sending Email..." : "Send Credentials via Email"}</span>
                    </Button>
                  </div>

                  {portalEmailToast && (
                    <div className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 p-2 text-center rounded-none">
                      {portalEmailToast}
                    </div>
                  )}
                </div>

                {/* 2. Quick Edit Status & Revenue */}
                <div className="border border-border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Status & Revenue Adjustment
                    </h3>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSaveDrawerDetails}
                      disabled={savingDrawer}
                      className="h-7 text-xs gap-1 font-semibold rounded-none"
                    >
                      <Save className="size-3" />
                      <span>{savingDrawer ? "Saving..." : "Save"}</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        Pipeline Status
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="w-full h-8 px-2 bg-transparent border border-input text-xs text-foreground focus:outline-none rounded-none"
                      >
                        <option value="New" className="bg-card">New</option>
                        <option value="Contacted" className="bg-card">Contacted</option>
                        <option value="Qualified" className="bg-card">Qualified</option>
                        <option value="Proposal Sent" className="bg-card">Proposal Sent</option>
                        <option value="Won" className="bg-card">Won</option>
                        <option value="Completed" className="bg-card">Completed</option>
                        <option value="Lost" className="bg-card">Lost</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        Revenue Collected (₹)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={editRevenue}
                        onChange={(e) => setEditRevenue(parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs font-mono rounded-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Notes & Remarks
                    </label>
                    <Textarea
                      rows={2}
                      value={editRemarks}
                      onChange={(e) => setEditRemarks(e.target.value)}
                      placeholder="Add remarks or next follow-up details..."
                      className="text-xs rounded-none"
                    />
                  </div>
                </div>

                {/* 3. Connected Drive Documents */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <FolderTree className="size-3.5 text-primary" />
                      <span>Connected Documents ({leadRelations?.files?.length || 0})</span>
                    </h3>
                    <a href="/documents" className="text-[11px] text-primary hover:underline">
                      Open Drive &rarr;
                    </a>
                  </div>

                  <div className="border border-border divide-y divide-border">
                    {!leadRelations?.files || leadRelations.files.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground bg-muted/10">
                        No documents stored in this client&apos;s folder.
                      </div>
                    ) : (
                      leadRelations.files.map((file: any) => (
                        <div key={file.id} className="p-3 flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground truncate max-w-[300px]">
                            {file.name}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 4. Connected Deliverables & Collectibles */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <PackageCheck className="size-3.5 text-emerald-500" />
                      <span>Deliverables & Collectibles ({leadRelations?.deliverables?.length || 0})</span>
                    </h3>
                    <a href="/deliverables" className="text-[11px] text-primary hover:underline">
                      Manage &rarr;
                    </a>
                  </div>

                  <div className="border border-border divide-y divide-border">
                    {!leadRelations?.deliverables || leadRelations.deliverables.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground bg-muted/10">
                        No deliverables uploaded yet.
                      </div>
                    ) : (
                      leadRelations.deliverables.map((item: any) => (
                        <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-semibold text-foreground">{item.title}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {item.category === "deliverable_from_us" ? "From Scalyx" : "From Client"} • {item.downloadCount} downloads
                            </div>
                          </div>
                          {item.isSoftDeleted ? (
                            <Badge variant="destructive" className="text-[10px] rounded-none">Expired</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-emerald-600 rounded-none">Active</Badge>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 5. Running Projects */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Kanban className="size-3.5 text-purple-500" />
                      <span>Projects ({leadRelations?.projects?.length || 0})</span>
                    </h3>
                    <a href="/projects" className="text-[11px] text-primary hover:underline">
                      Projects Hub &rarr;
                    </a>
                  </div>

                  <div className="border border-border divide-y divide-border">
                    {!leadRelations?.projects || leadRelations.projects.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground bg-muted/10">
                        No active project sprint boards attached.
                      </div>
                    ) : (
                      leadRelations.projects.map((proj: any) => (
                        <div key={proj.id} className="p-3 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-semibold text-foreground">{proj.title}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              Status: {proj.status}
                            </div>
                          </div>
                          {proj.kanbanUrl && (
                            <a
                              href={proj.kanbanUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                            >
                              Kanban <ExternalLink className="size-2.5" />
                            </a>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Sticky Footer with Delete Action and Close */}
              <div className="p-4 border-t border-border bg-card flex items-center justify-between shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteLead(selectedLead.id)}
                  className="text-xs text-destructive border-destructive/40 hover:bg-destructive hover:text-destructive-foreground h-8 px-3 rounded-none flex items-center gap-1.5 font-medium"
                >
                  <Trash2 className="size-3.5" />
                  <span>Delete Client Lead</span>
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedLead(null)}
                  className="h-8 px-4 text-xs font-semibold rounded-none"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
