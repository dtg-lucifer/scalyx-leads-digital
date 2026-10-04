"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ClientPortal, PortalUpdate } from "@/types/portal";
import { Deliverable } from "@/types/deliverable";
import {
  Sparkles,
  Lock,
  ArrowRight,
  TrendingUp,
  Bell,
  Download,
  Upload,
  Calendar,
  ShieldCheck,
  Globe,
  ExternalLink,
  Plus,
  Edit3,
  Pin,
  Clock,
  PackageCheck,
  CheckCircle2,
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

export default function ClientPortalPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [portal, setPortal] = useState<ClientPortal | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Team Edit Controls
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editGrowth, setEditGrowth] = useState(50);
  const [editStatusMsg, setEditStatusMsg] = useState("");

  // Post Notice Modal
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeType, setNoticeType] = useState<"notice" | "milestone" | "announcement">("notice");
  const [noticePinned, setNoticePinned] = useState(false);

  // Client Collectible Upload Modal
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function checkPortal() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/portal/${slug}`);
        const data = await res.json();

        if (data.isTeamMember && data.portal) {
          setPortal(data.portal);
          setDeliverables(data.deliverables || []);
          setIsTeamMember(true);
          setIsUnlocked(true);
          setEditGrowth(data.portal.projectGrowth);
          setEditStatusMsg(data.portal.statusMessage);
        } else if (data.requiresPassword) {
          setIsUnlocked(false);
        } else {
          setError(data.error || "Portal not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load portal");
      } finally {
        setLoading(false);
      }
    }
    checkPortal();
  }, [slug]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/portal/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPortal(data.portal);
        setDeliverables(data.deliverables || []);
        setIsUnlocked(true);
      } else {
        setError(data.error || "Incorrect access code. Please check your email.");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGrowth = async () => {
    if (!portal) return;
    try {
      const res = await fetch(`/api/portal/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectGrowth: editGrowth,
          statusMessage: editStatusMsg,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPortal(data.portal);
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    try {
      const res = await fetch(`/api/portal/${slug}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noticeTitle.trim(),
          content: noticeContent.trim(),
          updateType: noticeType,
          pinned: noticePinned,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPortal((prev) =>
          prev ? { ...prev, updates: [data.update, ...prev.updates] } : null
        );
        setIsNoticeModalOpen(false);
        setNoticeTitle("");
        setNoticeContent("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadDeliverable = async (id: string, url?: string) => {
    try {
      const downloadEndpoint = `/api/deliverables/${id}/download`;
      const link = document.createElement("a");
      link.href = downloadEndpoint;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Refresh list after download
      setTimeout(async () => {
        const res = await fetch(`/api/deliverables?leadId=${portal?.leadId}`);
        const data = await res.json();
        if (data.deliverables) setDeliverables(data.deliverables);
      }, 800);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadCollectible = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !portal) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("leadId", portal.leadId);
      formData.append("title", uploadTitle.trim());
      formData.append("category", "collectible_from_client");
      formData.append("uploadedBy", portal.leadName + " (Client)");
      if (uploadFile) {
        formData.append("file", uploadFile);
      } else {
        formData.append("fileName", "client-asset.zip");
        formData.append("fileSize", "2048000");
      }

      const res = await fetch("/api/deliverables", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setIsUploadOpen(false);
        setUploadTitle("");
        setUploadFile(null);
        // Refresh deliverables
        const delivRes = await fetch(`/api/deliverables?leadId=${portal.leadId}`);
        const delivData = await delivRes.json();
        if (delivData.deliverables) setDeliverables(delivData.deliverables);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // PASSWORD CHALLENGE VIEW
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-muted/20 relative">
        <div className="w-full max-w-md bg-card border border-border rounded-none p-8 shadow-xl text-center">
          <div className="size-16 rounded-none overflow-hidden mx-auto mb-4 border border-border bg-card p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/scalyx_light.png"
              alt="Scalyx"
              className="w-full h-full object-cover rounded-none"
            />
          </div>

          <Badge variant="outline" className="text-primary border-primary/20 text-[11px] mb-2">
            Secure Client Portal
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Project Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            Please enter the auto-generated password sent to your email to view your project&apos;s growth and deliverables.
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-none bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter access password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 text-center font-mono tracking-widest text-sm"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 gap-2 font-semibold">
              {loading ? "Verifying..." : "Unlock Dashboard"}
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <p className="text-[11px] text-muted-foreground mt-6">
            Need help? Contact Scalyx at{" "}
            <a href="mailto:contact@scalyx.in" className="text-primary hover:underline">
              contact@scalyx.in
            </a>
          </p>
        </div>
      </div>
    );
  }

  // UNLOCKED CLIENT PORTAL VIEW
  return (
    <div className="min-h-screen flex flex-col bg-muted/20 text-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 h-16 border-b border-border bg-card/85 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-none overflow-hidden shrink-0 border border-border bg-card p-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/scalyx_light.png"
              alt="Scalyx"
              className="w-full h-full object-cover rounded-none"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-foreground">Scalyx • Client Portal</span>
              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/20">
                Verified Portal
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {portal?.company || portal?.leadName} Workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isTeamMember && (
            <div className="flex items-center gap-2 mr-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="gap-1.5 text-xs h-8"
              >
                <Edit3 className="size-3.5" />
                <span>Update Progress</span>
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => setIsNoticeModalOpen(true)}
                className="gap-1.5 text-xs h-8 font-semibold"
              >
                <Plus className="size-3.5" />
                <span>Post Notice</span>
              </Button>
            </div>
          )}

          <a
            href="https://scalyx.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-medium"
          >
            <span>scalyx.in</span>
            <ExternalLink className="size-2.5" />
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto p-6 sm:p-8 space-y-8 flex-1">
        {/* Hero Card: Project Growth Bar & Status Message */}
        <div className="p-8 rounded-none bg-card border border-border shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Live Project Status
                </span>
                <span className="size-2 rounded-none bg-emerald-500 animate-pulse" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {portal?.company || portal?.leadName}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
                {portal?.statusMessage}
              </p>
            </div>

            {/* Growth KPI */}
            <div className="text-right">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Overall Growth
              </div>
              <div className="text-4xl sm:text-5xl font-black font-mono text-primary mt-1">
                {portal?.projectGrowth || 0}%
              </div>
            </div>
          </div>

          {/* Interactive Animated Growth Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-muted/60 rounded-none h-4 p-0.5 overflow-hidden border border-border">
              <div
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full rounded-none transition-all duration-700 shadow-sm"
                style={{ width: `${portal?.projectGrowth || 0}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
              <span>0% Project Kickoff</span>
              <span>50% Architecture & MVP</span>
              <span>100% Production Launch</span>
            </div>
          </div>
        </div>

        {/* Two Columns: Left (Updates & Notices Feed), Right (Deliverables & Collectibles) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Notices Feed (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Bell className="size-4 text-primary" />
                <span>Notices & Milestones ({portal?.updates?.length || 0})</span>
              </h3>
            </div>

            <div className="space-y-3.5">
              {!portal?.updates || portal.updates.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground bg-card border border-dashed border-border rounded-none">
                  No notices posted yet. All announcements from Scalyx will show up here.
                </div>
              ) : (
                portal.updates.map((update) => (
                  <div
                    key={update.id}
                    className={`p-5 rounded-none bg-card border transition-all ${
                      update.pinned ? "border-primary/40 shadow-xs" : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {update.pinned && (
                          <Badge variant="secondary" className="gap-1 text-[10px] text-primary">
                            <Pin className="size-2.5" /> Pinned
                          </Badge>
                        )}
                        <Badge variant="outline" className="capitalize text-[10px]">
                          {update.updateType}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(update.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {update.postedBy && (
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Posted by {update.postedBy}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-foreground mb-1.5">{update.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                      {update.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Deliverables & Collectibles (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Deliverables from Scalyx */}
            <div className="p-6 bg-card border border-border rounded-none shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PackageCheck className="size-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-foreground">Project Deliverables</h3>
                </div>
                <Badge variant="outline" className="text-[10px] text-emerald-600">
                  Ready for Download
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Download release builds, code archives, and design bundles provided by our agency.
              </p>

              {/* 3-day Soft Delete Notice Box */}
              <div className="p-3 rounded-none bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs">
                <div className="font-semibold flex items-center gap-1.5 mb-0.5">
                  <Clock className="size-3.5" />
                  <span>3-Day Retention Policy</span>
                </div>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  Downloaded materials remain available for 3 days before auto soft-delete. Please download and back up your assets.
                </p>
              </div>

              {/* Deliverables List */}
              <div className="space-y-2">
                {deliverables.filter((d) => d.category === "deliverable_from_us").length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-3 text-center">
                    No deliverables prepared yet.
                  </p>
                ) : (
                  deliverables
                    .filter((d) => d.category === "deliverable_from_us")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-none bg-muted/30 border border-border flex items-center justify-between text-xs"
                      >
                        <div className="truncate max-w-[65%]">
                          <div className="font-semibold text-foreground truncate">{item.title}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {item.fileName} • {(item.fileSize / 1024 / 1024).toFixed(1)} MB
                          </div>
                        </div>

                        {item.isSoftDeleted ? (
                          <Badge variant="destructive" className="text-[10px]">Expired</Badge>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleDownloadDeliverable(item.id, item.fileUrl)}
                            className="h-8 gap-1.5 text-xs font-semibold"
                          >
                            <Download className="size-3.5" />
                            <span>Download</span>
                          </Button>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Collectibles from Client */}
            <div className="p-6 bg-card border border-border rounded-none shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="size-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Client Collectibles</h3>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsUploadOpen(true)}
                  className="h-7 text-xs gap-1"
                >
                  <Plus className="size-3" />
                  <span>Upload Asset</span>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Upload your brand guides, vector logos, API credentials, or feedback files here for Scalyx engineers to retrieve.
              </p>

              <div className="space-y-2">
                {deliverables.filter((d) => d.category === "collectible_from_client").length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-3 text-center">
                    No client assets uploaded yet.
                  </p>
                ) : (
                  deliverables
                    .filter((d) => d.category === "collectible_from_client")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-none bg-muted/30 border border-border flex items-center justify-between text-xs"
                      >
                        <div className="truncate max-w-[65%]">
                          <div className="font-semibold text-foreground truncate">{item.title}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            Uploaded by client • {(item.fileSize / 1024 / 1024).toFixed(1)} MB
                          </div>
                        </div>

                        <Badge variant="outline" className="text-[10px] text-emerald-600">
                          Uploaded
                        </Badge>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Growth Dialog (For Team) */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[94vw] sm:max-w-lg md:max-w-xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Edit3 className="size-4 text-primary" />
              <span>Update Project Growth & Message</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Growth Percentage</span>
                <span className="font-mono text-primary">{editGrowth}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={editGrowth}
                onChange={(e) => setEditGrowth(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-none appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Current Status Message
              </label>
              <Textarea
                rows={2}
                value={editStatusMsg}
                onChange={(e) => setEditStatusMsg(e.target.value)}
                placeholder="e.g. Sprint 2 in active progress. AI search indexing module being finalized."
                className="text-xs"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleSaveGrowth}>
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Post Notice Dialog (For Team) */}
      <Dialog open={isNoticeModalOpen} onOpenChange={setIsNoticeModalOpen}>
        <DialogContent className="w-[94vw] sm:max-w-xl md:max-w-2xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Bell className="size-4 text-primary" />
              <span>Post Client Notice or Milestone</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handlePostNotice} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Notice Title <span className="text-destructive">*</span>
              </label>
              <Input
                required
                placeholder="e.g. Phase 1 Architecture & Supabase Schema Approved"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Type
              </label>
              <select
                value={noticeType}
                onChange={(e) => setNoticeType(e.target.value as any)}
                className="w-full h-9 px-2 rounded-none bg-transparent border border-input text-xs text-foreground focus:outline-none"
              >
                <option value="notice" className="bg-card">General Notice</option>
                <option value="milestone" className="bg-card">Milestone Completed</option>
                <option value="announcement" className="bg-card">Major Announcement</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Notice Content <span className="text-destructive">*</span>
              </label>
              <Textarea
                required
                rows={3}
                placeholder="Details of progress made, demo links, instructions for client..."
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pinNotice"
                checked={noticePinned}
                onChange={(e) => setNoticePinned(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary size-4"
              />
              <label htmlFor="pinNotice" className="text-xs text-foreground font-medium cursor-pointer">
                Pin this notice to top of client feed
              </label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsNoticeModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="font-semibold">
                Publish Notice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Client Upload Asset Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="w-[94vw] sm:max-w-lg md:max-w-xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Upload className="size-4 text-primary" />
              <span>Upload Collectible Asset for Scalyx</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUploadCollectible} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Asset Title <span className="text-destructive">*</span>
              </label>
              <Input
                required
                placeholder="e.g. Brand Vector Logo & Brand Guidelines"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                File Attachment
              </label>
              <Input
                type="file"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="text-xs file:bg-primary file:text-primary-foreground file:border-0 file:rounded-none file:px-2 file:py-1 file:text-xs file:mr-2 cursor-pointer"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={uploading} className="font-semibold">
                {uploading ? "Uploading..." : "Submit to Scalyx"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
