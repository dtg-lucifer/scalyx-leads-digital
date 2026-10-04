"use client";

import React, { useState, useEffect } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { User, UserRole, UserPermissions } from "@/types/auth";
import { useAuth } from "@/components/auth/AuthContext";
import {
  Settings,
  Shield,
  Clock,
  Users,
  Plus,
  Trash2,
  Check,
  X,
  Sparkles,
  KeyRound,
  ExternalLink,
  Copy,
  Mail,
  Building,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const MODULES = [
  { id: "leads", name: "Leads Record", actions: ["view", "create", "edit", "delete", "export"] },
  { id: "documents", name: "Document Organizer", actions: ["view", "upload", "share", "delete"] },
  { id: "deliverables", name: "Deliverables & Collectibles", actions: ["view", "upload", "download", "delete"] },
  { id: "projects", name: "Projects Dashboard", actions: ["view", "create", "edit", "delete"] },
  { id: "invoices", name: "Invoice Generator", actions: ["view", "generate"] },
  { id: "emails", name: "Email Sender (Resend)", actions: ["view", "send"] },
  { id: "settings", name: "Settings & RBAC Admin", actions: ["view", "manageUsers", "manageRbac", "manageRetention"] },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"users_rbac" | "retention" | "agency">("users_rbac");

  const [usersList, setUsersList] = useState<User[]>([]);
  const [retentionDays, setRetentionDays] = useState(3);
  const [loading, setLoading] = useState(true);
  const [savingRetention, setSavingRetention] = useState(false);
  const [retentionSavedNotice, setRetentionSavedNotice] = useState(false);

  // Agency info
  const [agencyName, setAgencyName] = useState("Scalyx");
  const [agencyWebsite, setAgencyWebsite] = useState("https://scalyx.in");
  const [agencyEmail, setAgencyEmail] = useState("contact@scalyx.in");
  const [agencyPhone, setAgencyPhone] = useState("+91-89271-24748");
  const [savingAgency, setSavingAgency] = useState(false);

  // Create User Modal
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("teammate");
  const [creatingUser, setCreatingUser] = useState(false);
  const [createdPasswordModal, setCreatedPasswordModal] = useState<{ email: string; pass: string } | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, settingsRes] = await Promise.all([
        fetch("/api/auth/users"),
        fetch("/api/settings"),
      ]);

      const [usersData, settingsData] = await Promise.all([
        usersRes.json(),
        settingsRes.json(),
      ]);

      if (usersData.users) setUsersList(usersData.users);
      if (settingsData.retentionDays) setRetentionDays(settingsData.retentionDays);
      if (settingsData.settings?.agencyName) setAgencyName(settingsData.settings.agencyName);
      if (settingsData.settings?.agencyWebsite) setAgencyWebsite(settingsData.settings.agencyWebsite);
      if (settingsData.settings?.agencyEmail) setAgencyEmail(settingsData.settings.agencyEmail);
      if (settingsData.settings?.agencyPhone) setAgencyPhone(settingsData.settings.agencyPhone);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveRetention = async () => {
    try {
      setSavingRetention(true);
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retentionDays }),
      });
      const data = await res.json();
      if (data.success) {
        setRetentionSavedNotice(true);
        setTimeout(() => setRetentionSavedNotice(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRetention(false);
    }
  };

  const handleSaveAgency = async () => {
    try {
      setSavingAgency(true);
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agencyName, agencyWebsite, agencyEmail, agencyPhone }),
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingAgency(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    try {
      setCreatingUser(true);
      const res = await fetch("/api/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName.trim(),
          email: newUserEmail.trim(),
          role: newUserRole,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsCreateUserOpen(false);
        setCreatedPasswordModal({
          email: newUserEmail.trim(),
          pass: data.generatedPassword,
        });
        setNewUserName("");
        setNewUserEmail("");
        await fetchData();
      } else {
        alert(data.error || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this user?")) return;
    try {
      const res = await fetch(`/api/auth/users?userId=${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchData();
      } else {
        alert(data.error || "Cannot delete user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyPass = () => {
    if (!createdPasswordModal) return;
    navigator.clipboard.writeText(createdPasswordModal.pass);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const isSuperAdmin = user?.role === "super_admin";

  return (
    <div className="flex-1 flex flex-col min-h-screen text-foreground">
      <AppNavbar
        title="Settings & Administration"
        description="RBAC permissions matrix, user provisioning with Resend emails, and retention policies."
      />

      <div className="p-6 space-y-6 max-w-6xl w-full">
        {/* Settings Navigation Tabs */}
        <div className="flex border-b border-border gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("users_rbac")}
            className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "users_rbac"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="size-4" />
            <span>RBAC Matrix & User Management</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("retention")}
            className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "retention"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="size-4" />
            <span>Deliverables Retention Policy ({retentionDays} Days)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("agency")}
            className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "agency"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building className="size-4" />
            <span>Agency Profile & Scalyx Defaults</span>
          </button>
        </div>

        {/* TAB 1: USERS & RBAC MATRIX */}
        {activeTab === "users_rbac" && (
          <div className="space-y-8">
            {/* User Provisioning Header */}
            <div className="p-6 rounded-none bg-card border border-border shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Users className="size-4 text-primary" />
                    <span>Authorized Team Members</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Users must be created by Super Admin. Upon creation, their credentials and temporary password are sent directly to their email via Resend.
                  </p>
                </div>

                {isSuperAdmin && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsCreateUserOpen(true)}
                    className="gap-1.5 text-xs h-9 font-semibold shrink-0"
                  >
                    <Plus className="size-3.5" />
                    <span>Create User</span>
                  </Button>
                )}
              </div>

              {/* Users List Table */}
              <div className="border border-border rounded-none overflow-hidden mt-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Provisioned</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/40">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-foreground">{u.name}</div>
                          <div className="text-[11px] text-muted-foreground">{u.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={u.role === "super_admin" ? "default" : "outline"}
                            className="capitalize text-[11px]"
                          >
                            {u.role.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground font-mono text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isSuperAdmin && u.role !== "super_admin" && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(u.id)}
                              className="size-7 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RBAC Visual Matrix */}
            <div className="p-6 rounded-none bg-card border border-border shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Shield className="size-4 text-primary" />
                  <span>Role-Based Access Control (RBAC) Matrix</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Granular permission distribution enforced across server API routes and UI components.
                </p>
              </div>

              <div className="border border-border rounded-none overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4 min-w-[160px]">Application Module</th>
                      <th className="py-3 px-4 min-w-[140px]">Permission Action</th>
                      <th className="py-3 px-4 text-center min-w-[120px]">Super Admin</th>
                      <th className="py-3 px-4 text-center min-w-[120px]">Teammate</th>
                      <th className="py-3 px-4 text-center min-w-[120px]">Viewer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {MODULES.map((mod) =>
                      mod.actions.map((act, actIdx) => (
                        <tr key={`${mod.id}-${act}`} className="hover:bg-muted/30">
                          {actIdx === 0 ? (
                            <td
                              rowSpan={mod.actions.length}
                              className="py-3 px-4 font-bold text-foreground bg-muted/10 border-r border-border align-top"
                            >
                              {mod.name}
                            </td>
                          ) : null}

                          <td className="py-2.5 px-4 font-mono text-[11px] capitalize text-muted-foreground">
                            {act}
                          </td>

                          {/* Super admin */}
                          <td className="py-2.5 px-4 text-center">
                            <span className="inline-flex size-5 rounded-none bg-emerald-500/10 text-emerald-600 items-center justify-center">
                              <Check className="size-3" />
                            </span>
                          </td>

                          {/* Teammate */}
                          <td className="py-2.5 px-4 text-center">
                            {act === "delete" || mod.id === "settings" ? (
                              <span className="inline-flex size-5 rounded-none bg-muted text-muted-foreground/50 items-center justify-center">
                                <X className="size-3" />
                              </span>
                            ) : (
                              <span className="inline-flex size-5 rounded-none bg-emerald-500/10 text-emerald-600 items-center justify-center">
                                <Check className="size-3" />
                              </span>
                            )}
                          </td>

                          {/* Viewer */}
                          <td className="py-2.5 px-4 text-center">
                            {act === "view" || act === "download" ? (
                              <span className="inline-flex size-5 rounded-none bg-emerald-500/10 text-emerald-600 items-center justify-center">
                                <Check className="size-3" />
                              </span>
                            ) : (
                              <span className="inline-flex size-5 rounded-none bg-muted text-muted-foreground/50 items-center justify-center">
                                <X className="size-3" />
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DELIVERABLES RETENTION POLICY */}
        {activeTab === "retention" && (
          <div className="p-6 rounded-none bg-card border border-border shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <span>Deliverables & Collectibles Auto Soft-Delete Period</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                As per system design: &quot;after downloading the uploaded content will get soft deleted after 3 days from this page, the respected party have to download the uploaded material before this period&quot;. You can configure the global number of retention days here.
              </p>
            </div>

            <div className="p-5 rounded-none bg-muted/30 border border-border max-w-lg space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span>Auto Soft-Delete Window</span>
                  <span className="text-sm font-bold font-mono text-primary">
                    {retentionDays} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-none appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
                  <span>1 day</span>
                  <span>Default (3 days)</span>
                  <span>14 days</span>
                  <span>30 days</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveRetention}
                  disabled={savingRetention}
                  className="gap-2 text-xs font-semibold"
                >
                  <Save className="size-3.5" />
                  <span>{savingRetention ? "Saving..." : "Save Retention Window"}</span>
                </Button>

                {retentionSavedNotice && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="size-3.5" /> Updated successfully!
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AGENCY PROFILE */}
        {activeTab === "agency" && (
          <div className="p-6 rounded-none bg-card border border-border shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Building className="size-4 text-primary" />
                <span>Scalyx Agency Details</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                These values are injected across invoices, transactional emails, and public client portals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Agency Name
                </label>
                <Input
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Official Website
                </label>
                <Input
                  value={agencyWebsite}
                  onChange={(e) => setAgencyWebsite(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Contact Email
                </label>
                <Input
                  value={agencyEmail}
                  onChange={(e) => setAgencyEmail(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Support Phone / WhatsApp
                </label>
                <Input
                  value={agencyPhone}
                  onChange={(e) => setAgencyPhone(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={handleSaveAgency}
              disabled={savingAgency}
              className="gap-2 text-xs font-semibold"
            >
              <Save className="size-3.5" />
              <span>{savingAgency ? "Saving..." : "Update Agency Defaults"}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Create User Dialog */}
      <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <DialogContent className="w-[94vw] sm:max-w-lg md:max-w-xl bg-card rounded-none p-6">
          <DialogHeader className="pr-12 pb-3 border-b border-border">
            <DialogTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
              <Users className="size-4 text-primary shrink-0" />
              <span>Create New Team User</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              A temporary password will be auto-generated and dispatched via Resend.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                required
                placeholder="e.g. Ananya Sen"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Email Address <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                required
                placeholder="ananya@scalyx.in"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Role & RBAC Access
              </label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as any)}
                className="w-full h-9 px-2 rounded-none bg-transparent border border-input text-xs text-foreground focus:outline-none"
              >
                <option value="teammate" className="bg-card">Teammate (Standard Agency Member)</option>
                <option value="viewer" className="bg-card">Viewer (Read Only Access)</option>
                <option value="super_admin" className="bg-card">Super Admin (Full Administrative Powers)</option>
              </select>
            </div>

            <div className="p-3 rounded-none bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center gap-2">
              <Sparkles className="size-4 shrink-0" />
              <span>An auto-generated secure password will be dispatched to their inbox via Resend.</span>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateUserOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={creatingUser} className="font-semibold">
                {creatingUser ? "Creating..." : "Create & Send Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Generated Password Modal */}
      <Dialog open={Boolean(createdPasswordModal)} onOpenChange={(open) => !open && setCreatedPasswordModal(null)}>
        <DialogContent className="w-[94vw] sm:max-w-lg md:max-w-xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-emerald-600">
              <Check className="size-5" />
              <span>User Successfully Provisioned!</span>
            </DialogTitle>
          </DialogHeader>

          {createdPasswordModal && (
            <div className="space-y-4 text-xs">
              <p className="text-muted-foreground">
                An invitation email has been sent to <strong>{createdPasswordModal.email}</strong>. For your records, here is the generated password:
              </p>

              <div className="flex items-center gap-2 p-3 bg-muted/40 border border-border rounded-none">
                <code className="font-mono text-sm font-bold text-foreground flex-1">
                  {createdPasswordModal.pass}
                </code>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCopyPass}
                  className="gap-1 h-8 text-xs shrink-0"
                >
                  {copiedPass ? <Check className="size-3 text-emerald-300" /> : <Copy className="size-3" />}
                  <span>{copiedPass ? "Copied" : "Copy"}</span>
                </Button>
              </div>

              <div className="flex justify-end pt-2">
                <Button size="sm" onClick={() => setCreatedPasswordModal(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
