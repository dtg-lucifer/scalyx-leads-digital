"use client";

import {
  AlertCircle,
  Bold,
  Check,
  CheckCircle2,
  FileText,
  FolderDown,
  History,
  Italic,
  Layers,
  Link2,
  List,
  Mail,
  Monitor,
  Paperclip,
  Pilcrow,
  Quote,
  RefreshCw,
  Search,
  Send,
  Smartphone,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
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
import type { EmailLog, EmailTemplateMeta } from "@/types/email";
import type { Lead } from "@/types/lead";
import { getDeployedAppUrl, ensureDeployedUrl, sanitizeEmailParams } from "@/lib/url";

export default function EmailSenderPage() {
  const [templates, setTemplates] = useState<EmailTemplateMeta[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<string>("custom_email");
  const [isTemplateCatalogOpen, setIsTemplateCatalogOpen] = useState(false);
  const [templateSearchQuery, setTemplateSearchQuery] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);

  // Email form values
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  // Attachments & Deliverables Notice
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [includeDeliverablesFooter, setIncludeDeliverablesFooter] =
    useState(false);
  const [deliverablesUrl, setDeliverablesUrl] = useState("");

  // Live preview & sending state
  const [previewHtml, setPreviewHtml] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [iframeHeight, setIframeHeight] = useState<number>(850);
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [templatesRes, leadsRes, logsRes] = await Promise.all([
          fetch("/api/email/templates"),
          fetch("/api/leads"),
          fetch("/api/email/logs"),
        ]);

        const [templatesData, leadsData, logsData] = await Promise.all([
          templatesRes.json(),
          leadsRes.json(),
          logsRes.json(),
        ]);

        if (templatesData.templates) {
          setTemplates(templatesData.templates);
          const defaultTpl =
            templatesData.templates.find(
              (t: EmailTemplateMeta) => t.id === "custom_email",
            ) || templatesData.templates[0];
          if (defaultTpl) {
            setSelectedTemplateId(defaultTpl.id);
            setSubject(defaultTpl.defaultSubject);
            const initialVals: Record<string, string> = {};
            for (const f of defaultTpl.fields) {
              initialVals[f.key] = f.defaultValue;
            }
            setFieldValues(initialVals);
          }
        }
        if (leadsData.leads) setLeads(leadsData.leads);
        if (logsData.logs) setEmailLogs(logsData.logs);
      } catch (err) {
        console.error("Failed to load email page data:", err);
      }
    }
    loadData();
  }, []);

  // Listen for iframe height adjustments to prevent trapped scroll boxes and infinite expansion
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (
        e.data &&
        e.data.type === "EMAIL_PREVIEW_HEIGHT" &&
        typeof e.data.height === "number"
      ) {
        const measured = Math.ceil(e.data.height);
        setIframeHeight((prev) => {
          if (Math.abs(prev - measured) > 4) {
            return measured;
          }
          return prev;
        });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Update preview when fields, template, attachments, or footer toggle changes
  useEffect(() => {
    if (!selectedTemplateId) return;
    let isCancelled = false;

    async function updatePreview() {
      try {
        setIsPreviewLoading(true);
        const rawParams: Record<string, string> = {
          ...fieldValues,
          includeDeliverablesFooter: includeDeliverablesFooter
            ? "true"
            : "false",
          deliverablesUrl: deliverablesUrl || fieldValues.portalUrl || "",
        };
        const mergedParams = sanitizeEmailParams(rawParams);
        if (attachedFiles.length > 0) {
          mergedParams.attachedFilesList = attachedFiles
            .map((f) => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`)
            .join(", ");
        }

        const res = await fetch("/api/email/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateId: selectedTemplateId,
            params: mergedParams,
          }),
        });
        const data = await res.json();
        if (!isCancelled && data.html) {
          setPreviewHtml(data.html);
        }
      } catch (err) {
        console.error("Failed to update email preview:", err);
      } finally {
        if (!isCancelled) {
          setIsPreviewLoading(false);
        }
      }
    }

    const timer = setTimeout(updatePreview, 150);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [
    selectedTemplateId,
    fieldValues,
    includeDeliverablesFooter,
    deliverablesUrl,
    attachedFiles,
  ]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = templates.find((t) => t.id === templateId);
    if (tmpl) {
      setSubject(tmpl.defaultSubject);
      const vals: Record<string, string> = {};
      for (const f of tmpl.fields) {
        vals[f.key] = f.defaultValue;
      }
      setFieldValues(vals);
    }
  };

  const handleLeadSelect = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    setRecipient(lead.email);
    const origin = getDeployedAppUrl();
    const portalUrl = `${origin}/portal/${lead.portalAccessCode || lead.id}`;
    setDeliverablesUrl(`${portalUrl}?tab=deliverables`);
    setFieldValues((prev) => ({
      ...prev,
      clientName: lead.name,
      companyName: lead.company || lead.name,
      portalPassword:
        lead.portalAccessCode || prev.portalPassword || "tc-portal-pass-2026",
      portalUrl: portalUrl,
    }));
  };

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const insertMarkdown = (fieldKey: string, before: string, after = "") => {
    const currentVal = fieldValues[fieldKey] || "";
    const textarea = document.getElementById(
      `input-${fieldKey}`,
    ) as HTMLTextAreaElement | null;
    if (textarea && typeof textarea.selectionStart === "number") {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = currentVal.substring(start, end);
      const replacement = `${before}${selected || "text"}${after}`;
      const newVal =
        currentVal.substring(0, start) +
        replacement +
        currentVal.substring(end);
      handleFieldChange(fieldKey, newVal);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + (selected ? selected.length : "text".length),
        );
      }, 10);
    } else {
      const newVal = currentVal
        ? `${currentVal}\n\n${before}text${after}`
        : `${before}text${after}`;
      handleFieldChange(fieldKey, newVal);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles((prev) => [...prev, ...newFiles]);
      e.target.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !subject.trim() || !selectedTemplateId) return;

    try {
      setIsSending(true);
      const rawParams: Record<string, string> = {
        ...fieldValues,
        includeDeliverablesFooter: includeDeliverablesFooter ? "true" : "false",
        deliverablesUrl: deliverablesUrl || fieldValues.portalUrl || "",
      };
      const mergedParams = sanitizeEmailParams(rawParams);
      if (attachedFiles.length > 0) {
        mergedParams.attachedFilesList = attachedFiles
          .map((f) => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`)
          .join(", ");
      }

      const formData = new FormData();
      formData.append("to", recipient.trim());
      formData.append("subject", subject.trim());
      formData.append("templateId", selectedTemplateId);
      formData.append("params", JSON.stringify(mergedParams));
      for (const file of attachedFiles) {
        formData.append("attachments", file);
      }

      const res = await fetch("/api/email/send", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setNotification({
          type: "success",
          message: `Email dispatched successfully via Resend! (ID: ${data.id}${
            attachedFiles.length > 0
              ? `, ${attachedFiles.length} file(s) attached`
              : ""
          })`,
        });
        setAttachedFiles([]);
        const logsRes = await fetch("/api/email/logs");
        const logsData = await logsRes.json();
        if (logsData.logs) setEmailLogs(logsData.logs);
      } else {
        setNotification({
          type: "error",
          message:
            data.error ||
            "Failed to send email. Check Resend API key or domain verification.",
        });
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Email dispatch failed.";
      setNotification({
        type: "error",
        message: errorMsg,
      });
    } finally {
      setIsSending(false);
      setTimeout(() => setNotification(null), 6000);
    }
  };

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  const filteredTemplates = templates.filter((t) => {
    if (!templateSearchQuery.trim()) return true;
    const q = templateSearchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.defaultSubject.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen text-foreground">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 border rounded-xl text-xs font-semibold max-w-md ${
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

      <AppNavbar
        title="Email Studio & Sender"
        description="Craft, preview, and dispatch transactional emails with RemarkGFM and Resend."
        actions={
          <Badge
            variant="outline"
            className="gap-1.5 text-xs text-primary border-primary/20 rounded-full h-8 px-2.5 font-medium"
          >
            <Sparkles className="size-3" />
            <span>RemarkGFM & Resend</span>
          </Badge>
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 w-full">
        {/* Template Catalog Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={() => setIsTemplateCatalogOpen(true)}
              className="h-9 px-4 text-xs font-semibold rounded-xl gap-2 shadow-xs"
            >
              <Layers className="size-4" />
              <span>Browse Template Catalog</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-primary-foreground/20 text-primary-foreground font-bold">
                {templates.length}
              </span>
            </Button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/70 bg-muted/30">
              <span className="text-[11px] text-muted-foreground font-medium">
                Active Template:
              </span>
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Mail className="size-3.5 text-primary" />
                {selectedTemplate?.name || "Custom Markdown Email"}
              </span>
              {selectedTemplateId === "custom_email" ? (
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 px-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 rounded-full font-semibold"
                >
                  Markdown Composer
                </Badge>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTemplateChange("custom_email")}
                  className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground font-medium rounded-lg"
                  title="Switch back to Custom Markdown Email"
                >
                  Reset to Custom
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {leads.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs">
                <Users className="size-3.5 text-muted-foreground" />
                <select
                  onChange={(e) =>
                    e.target.value && handleLeadSelect(e.target.value)
                  }
                  defaultValue=""
                  className="h-8 px-2.5 rounded-xl bg-card border border-input text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                >
                  <option value="" disabled className="bg-card">
                    Autofill from Lead...
                  </option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id} className="bg-card">
                      {l.name} ({l.company || "Client"})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Workspace: Left Form, Right Live HTML Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Recipient & Parameters (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {selectedTemplate?.name || "Email Parameters"}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {selectedTemplate?.description}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTemplateCatalogOpen(true)}
                  className="h-7 px-2.5 text-xs rounded-lg gap-1.5 shrink-0"
                >
                  <Layers className="size-3 text-muted-foreground" />
                  <span>Change</span>
                </Button>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-3.5">
                <div>
                  <label
                    htmlFor="email-recipient-input"
                    className="block text-xs font-semibold text-muted-foreground mb-1"
                  >
                    Recipient Email Address{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email-recipient-input"
                    type="email"
                    required
                    placeholder="client@company.com"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="h-9 text-xs rounded-lg"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email-subject-input"
                    className="block text-xs font-semibold text-muted-foreground mb-1"
                  >
                    Subject Line <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email-subject-input"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-9 text-xs font-medium rounded-lg"
                  />
                </div>

                {/* File Attachments Section */}
                <div className="p-3.5 bg-muted/20 border border-border/80 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Paperclip className="size-3.5 text-primary" />
                      Email Attachments
                      {attachedFiles.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-2 py-0 rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                          {attachedFiles.length}{" "}
                          {attachedFiles.length === 1 ? "file" : "files"}
                        </Badge>
                      )}
                    </span>
                    <label
                      htmlFor="email-file-input"
                      className="cursor-pointer text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Paperclip className="size-3" />
                      <span>+ Attach Files</span>
                    </label>
                    <input
                      id="email-file-input"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {attachedFiles.length > 0 ? (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {attachedFiles.map((file, idx) => (
                        <div
                          key={`${file.name}-${idx}`}
                          className="flex items-center justify-between px-2.5 py-1.5 bg-card border border-border/80 text-xs rounded-lg"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="size-3.5 text-primary shrink-0" />
                            <span
                              className="truncate font-semibold text-foreground"
                              title={file.name}
                            >
                              {file.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors ml-2"
                            title="Remove attachment"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <label
                      htmlFor="email-file-input"
                      className="border-2 border-dashed border-border/80 hover:border-primary/50 bg-card p-3.5 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all rounded-xl text-center"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        <Paperclip className="size-4 text-primary" />
                        <span>Click to attach files to this email</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Attach documents, PDF proposals, deliverables, or
                        specifications (multi-file support)
                      </p>
                    </label>
                  )}
                </div>

                {/* Dynamic Template Fields */}
                <div className="pt-2 border-t border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Template Variables
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-2 py-0.5 border-border rounded-full"
                    >
                      {selectedTemplate?.name}
                    </Badge>
                  </div>

                  {selectedTemplate?.fields.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor={`input-${field.key}`}
                          className="block text-xs font-semibold text-foreground"
                        >
                          {field.label}
                        </label>
                        {field.isMarkdown && (
                          <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            RemarkGFM Enabled
                          </span>
                        )}
                      </div>

                      {field.type === "textarea" ? (
                        <div className="space-y-1.5">
                          {/* Markdown Formatting Helper Toolbar */}
                          <div className="flex items-center gap-1 p-1 bg-muted/40 border border-input rounded-lg text-xs">
                            <button
                              type="button"
                              onClick={() =>
                                insertMarkdown(field.key, "**", "**")
                              }
                              className="p-1 px-1.5 hover:bg-card hover:text-foreground text-muted-foreground rounded-md transition-colors flex items-center gap-1 text-[11px] font-bold"
                              title="Bold (**text**)"
                            >
                              <Bold className="size-3" />
                              <span>Bold</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                insertMarkdown(field.key, "*", "*")
                              }
                              className="p-1 px-1.5 hover:bg-card hover:text-foreground text-muted-foreground rounded-md transition-colors flex items-center gap-1 text-[11px] italic"
                              title="Italic (*text*)"
                            >
                              <Italic className="size-3" />
                              <span>Italic</span>
                            </button>
                            <div className="h-3.5 w-px bg-border mx-0.5" />
                            <button
                              type="button"
                              onClick={() => insertMarkdown(field.key, "- ")}
                              className="p-1 px-1.5 hover:bg-card hover:text-foreground text-muted-foreground rounded-md transition-colors flex items-center gap-1 text-[11px]"
                              title="Bullet List (- item)"
                            >
                              <List className="size-3" />
                              <span>List</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => insertMarkdown(field.key, "> ")}
                              className="p-1 px-1.5 hover:bg-card hover:text-foreground text-muted-foreground rounded-md transition-colors flex items-center gap-1 text-[11px]"
                              title="Quote (> quote)"
                            >
                              <Quote className="size-3" />
                              <span>Quote</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                insertMarkdown(field.key, "[link title](", ")")
                              }
                              className="p-1 px-1.5 hover:bg-card hover:text-foreground text-muted-foreground rounded-md transition-colors flex items-center gap-1 text-[11px]"
                              title="Hyperlink [title](url)"
                            >
                              <Link2 className="size-3" />
                              <span>Link</span>
                            </button>
                            <div className="h-3.5 w-px bg-border mx-0.5" />
                            <button
                              type="button"
                              onClick={() =>
                                insertMarkdown(field.key, "\n\n", "")
                              }
                              className="p-1 px-1.5 hover:bg-card hover:text-foreground text-muted-foreground rounded-md transition-colors flex items-center gap-1 text-[11px]"
                              title="New Paragraph"
                            >
                              <Pilcrow className="size-3" />
                              <span>Paragraph</span>
                            </button>
                          </div>

                          <Textarea
                            id={`input-${field.key}`}
                            rows={
                              selectedTemplateId === "custom_email" &&
                              field.key === "bodyMarkdown"
                                ? 10
                                : 4
                            }
                            value={fieldValues[field.key] || ""}
                            placeholder={field.placeholder}
                            onChange={(e) =>
                              handleFieldChange(field.key, e.target.value)
                            }
                            className="text-xs font-mono rounded-lg leading-relaxed"
                          />
                        </div>
                      ) : (
                        <Input
                          id={`input-${field.key}`}
                          type={field.type}
                          value={fieldValues[field.key] || ""}
                          placeholder={field.placeholder}
                          onChange={(e) =>
                            handleFieldChange(field.key, e.target.value)
                          }
                          className="h-9 text-xs rounded-lg"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Deliverables Footer Toggle */}
                <div className="pt-3 border-t border-border space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDeliverablesFooter}
                      onChange={(e) =>
                        setIncludeDeliverablesFooter(e.target.checked)
                      }
                      className="mt-0.5 size-4 rounded accent-primary border-input cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <FolderDown className="size-3.5 text-primary" />
                        Add &quot;Download Documents from Deliverables&quot;
                        footer
                      </span>
                      <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                        Appends a branded callout inviting the client to view
                        and download official project deliverables from their
                        secure portal.
                      </p>
                    </div>
                  </label>

                  {includeDeliverablesFooter && (
                    <div className="pt-1.5 pl-6 space-y-1">
                      <label
                        htmlFor="deliverables-url-input"
                        className="block text-[11px] font-semibold text-muted-foreground"
                      >
                        Custom Deliverables Portal URL (Optional)
                      </label>
                      <Input
                        id="deliverables-url-input"
                        type="url"
                        placeholder="https://leads.scalyx.in/portal/client?tab=deliverables"
                        value={deliverablesUrl}
                        onChange={(e) => setDeliverablesUrl(e.target.value)}
                        className="h-8 text-xs font-mono rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSending}
                  className="w-full h-10 gap-2 font-semibold text-xs mt-3 rounded-lg shadow-xs cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <div className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span>Dispatching via Resend...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      <span>
                        Send Templated Email{" "}
                        {attachedFiles.length > 0 &&
                          `(${attachedFiles.length} file${
                            attachedFiles.length > 1 ? "s" : ""
                          })`}
                      </span>
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Email Logs Card */}
            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <History className="size-3.5" />
                  Recent Dispatch Logs ({emailLogs.length})
                </h4>
              </div>

              {emailLogs.length === 0 ? (
                <p className="text-xs text-muted-foreground italic text-center py-2">
                  No emails sent in this session yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {emailLogs.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-muted/30 border border-border/80 text-xs flex items-center justify-between"
                    >
                      <div className="truncate max-w-[70%]">
                        <div className="font-semibold text-foreground truncate">
                          {log.subject}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          To: {log.recipient} •{" "}
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </div>
                      </div>

                      <Badge
                        variant={
                          log.status === "sent" ? "outline" : "destructive"
                        }
                        className={`text-[10px] capitalize rounded-full ${
                          log.status === "sent"
                            ? "text-emerald-600 border-emerald-500/20"
                            : ""
                        }`}
                      >
                        {log.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Live HTML Preview: The parent container handles scrolling, eliminating the trapped inner scrollbox */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Live Email Template Preview
                </h3>
                {isPreviewLoading && (
                  <RefreshCw className="size-3 text-muted-foreground animate-spin" />
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Device viewport switcher */}
                <div className="flex items-center bg-muted/50 p-0.5 border border-border/80 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`p-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                      previewDevice === "desktop"
                        ? "bg-card text-foreground shadow-xs font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Desktop Preview (620px)"
                  >
                    <Monitor className="size-3.5" />
                    <span className="text-[11px]">Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`p-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                      previewDevice === "mobile"
                        ? "bg-card text-foreground shadow-xs font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Mobile Preview (375px)"
                  >
                    <Smartphone className="size-3.5" />
                    <span className="text-[11px]">Mobile</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Parent Scroll Container: Smooth natural scrolling without trapped inner iframe scrollbox */}
            <div className="border border-border/80 bg-muted/20 p-6 flex flex-col items-center max-h-[calc(100vh-160px)] overflow-y-auto overflow-x-hidden rounded-2xl shadow-xs">
              <div
                className={`transition-all duration-300 w-full bg-white rounded-none ${
                  previewDevice === "mobile"
                    ? "max-w-[375px] border-4 border-slate-800 shadow-xl"
                    : "max-w-[620px] border border-border shadow-md"
                }`}
              >
                <iframe
                  title="Email Preview"
                  srcDoc={previewHtml}
                  style={{
                    height: `${iframeHeight}px`,
                    width: "100%",
                    display: "block",
                  }}
                  scrolling="no"
                  className="w-full border-none block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Templates Catalog Dialog */}
      <Dialog open={isTemplateCatalogOpen} onOpenChange={setIsTemplateCatalogOpen}>
        <DialogContent className="w-[94vw] sm:max-w-2xl md:max-w-3xl bg-card rounded-2xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
          <DialogHeader className="pb-3 border-b border-border/80 shrink-0">
            <DialogTitle className="text-base font-bold flex items-center justify-between text-foreground">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-primary shrink-0" />
                <span>Email Templates Catalog ({templates.length} Templates)</span>
              </div>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Select any pre-designed transactional template or use the freeform Markdown composer to write custom emails.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3 flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="relative shrink-0">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates by name, subject, or description..."
                value={templateSearchQuery}
                onChange={(e) => setTemplateSearchQuery(e.target.value)}
                className="h-9 pl-9 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto flex-1 min-h-0 pr-1">
              {filteredTemplates.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                const isCustom = tmpl.id === "custom_email";

                return (
                  <div
                    key={tmpl.id}
                    className={`p-4 border transition-all rounded-xl flex flex-col justify-between gap-3 text-left ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
                        : "border-border/80 hover:border-primary/50 bg-muted/10 hover:bg-muted/20"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-1.5 rounded-lg ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Mail className="size-3.5" />
                          </div>
                          <div>
                            <span className="font-semibold text-xs text-foreground block">
                              {tmpl.name}
                            </span>
                            {isCustom && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wide uppercase">
                                Default • Freeform Composer
                              </span>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <Badge
                            variant="default"
                            className="text-[10px] h-5 px-1.5 gap-1 rounded-full font-medium"
                          >
                            <Check className="size-2.5" />
                            <span>Active</span>
                          </Badge>
                        )}
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {tmpl.description}
                      </p>

                      <div className="pt-1">
                        <div className="text-[10px] text-muted-foreground font-medium truncate">
                          <span className="font-semibold text-foreground/80">Subject: </span>
                          {tmpl.defaultSubject}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md font-medium">
                        {tmpl.fields.length} parameter{tmpl.fields.length === 1 ? "" : "s"}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant={isSelected ? "secondary" : "default"}
                        onClick={() => {
                          handleTemplateChange(tmpl.id);
                          setIsTemplateCatalogOpen(false);
                        }}
                        className="h-7 px-3 text-xs rounded-lg font-semibold gap-1.5"
                      >
                        {isSelected ? (
                          <>
                            <Check className="size-3" />
                            <span>Selected</span>
                          </>
                        ) : (
                          <span>Use Template</span>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}

              {filteredTemplates.length === 0 && (
                <div className="col-span-2 py-12 text-center text-muted-foreground">
                  <Mail className="size-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No email templates match "{templateSearchQuery}"</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border/80 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsTemplateCatalogOpen(false)}
              className="rounded-lg text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
