"use client";

import {
  AlertCircle,
  Bold,
  CheckCircle2,
  FileText,
  FolderDown,
  History,
  Italic,
  Link2,
  List,
  Mail,
  Monitor,
  Paperclip,
  Pilcrow,
  Quote,
  RefreshCw,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { EmailLog, EmailTemplateMeta } from "@/types/email";
import type { Lead } from "@/types/lead";
import { getDeployedAppUrl, ensureDeployedUrl, sanitizeEmailParams } from "@/lib/url";

export default function EmailSenderPage() {
  const [templates, setTemplates] = useState<EmailTemplateMeta[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<string>("client_onboarding");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);

  // Email form values
  const [recipient, setRecipient] = useState("arjun@techcorp.io");
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
          const first = templatesData.templates[0];
          if (first) {
            setSelectedTemplateId(first.id);
            setSubject(first.defaultSubject);
            const initialVals: Record<string, string> = {};
            for (const f of first.fields) {
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

  return (
    <div className="flex-1 flex flex-col min-h-screen text-foreground">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 border rounded-none text-xs font-semibold max-w-md ${
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
        description="Craft, preview, and dispatch modern transactional emails with RemarkGFM Markdown and Resend."
        actions={
          <Badge
            variant="outline"
            className="gap-1.5 text-xs text-primary border-primary/20 rounded-none"
          >
            <Sparkles className="size-3" />
            <span>RemarkGFM & Resend</span>
          </Badge>
        }
      />

      <div className="p-6 space-y-6">
        {/* Template Selector Pills (Sharp-Cornered) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTemplateChange(t.id)}
              className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border rounded-none ${
                selectedTemplateId === t.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <Mail className="size-3.5" />
              <span>{t.name}</span>
              {t.id === "custom_email" && (
                <span className="text-[10px] bg-primary-foreground/20 text-primary-foreground px-1.5 py-0.5 rounded-none uppercase font-bold tracking-wider">
                  New
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Workspace: Left Form, Right Live HTML Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Recipient & Parameters (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-none bg-card border border-border shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Email Parameters
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {selectedTemplate?.description}
                  </p>
                </div>
                {leads.length > 0 && (
                  <div className="flex items-center gap-1 text-xs shrink-0">
                    <Users className="size-3 text-primary" />
                    <select
                      onChange={(e) =>
                        e.target.value && handleLeadSelect(e.target.value)
                      }
                      defaultValue=""
                      className="h-7 px-1.5 rounded-none bg-transparent border border-input text-xs text-foreground focus:outline-none"
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
                    className="h-9 text-xs rounded-none"
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
                    className="h-9 text-xs font-medium rounded-none"
                  />
                </div>

                {/* File Attachments Section (Sharp-Cornered) */}
                <div className="p-3.5 bg-muted/20 border border-border rounded-none space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Paperclip className="size-3.5 text-primary" />
                      Email Attachments
                      {attachedFiles.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 rounded-none bg-primary/10 text-primary border border-primary/20"
                        >
                          {attachedFiles.length}{" "}
                          {attachedFiles.length === 1 ? "file" : "files"}
                        </Badge>
                      )}
                    </span>
                    <label
                      htmlFor="email-file-input"
                      className="cursor-pointer text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 px-3 py-1 rounded-none flex items-center gap-1.5 transition-colors shadow-xs"
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
                          className="flex items-center justify-between px-2.5 py-1.5 bg-card border border-border text-xs rounded-none"
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
                            className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-none transition-colors ml-2"
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
                      className="border-2 border-dashed border-border hover:border-primary/50 bg-card p-3.5 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all rounded-none text-center"
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
                      className="text-[10px] px-2 py-0.5 border-border rounded-none"
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
                          <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-none">
                            RemarkGFM Enabled
                          </span>
                        )}
                      </div>

                      {field.type === "textarea" ? (
                        <div className="space-y-1.5">
                          {/* Markdown Formatting Helper Toolbar (Sharp Corners) */}
                          <div className="flex items-center gap-1 p-1 bg-muted/40 border border-input rounded-none text-xs">
                            <button
                              type="button"
                              onClick={() =>
                                insertMarkdown(field.key, "**", "**")
                              }
                              className="p-1 px-1.5 hover:bg-card hover:text-foreground text-muted-foreground rounded-none transition-colors flex items-center gap-1 text-[11px] font-bold"
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
                              className="p-1 px-1.5 hover:bg-card hover:text-foreground text-muted-foreground rounded-none transition-colors flex items-center gap-1 text-[11px] italic"
                              title="Italic (*text*)"
                            >
                              <Italic className="size-3" />
                              <span>Italic</span>
                            </button>
                            <div className="h-3.5 w-px bg-border mx-0.5" />
                            <button
                              type="button"
                              onClick={() => insertMarkdown(field.key, "- ")}
                              className="p-1 px-1.5 hover:bg-card hover:text-foreground text-muted-foreground rounded-none transition-colors flex items-center gap-1 text-[11px]"
                              title="Bullet List (- item)"
                            >
                              <List className="size-3" />
                              <span>List</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => insertMarkdown(field.key, "> ")}
                              className="p-1 px-1.5 hover:bg-card hover:text-foreground text-muted-foreground rounded-none transition-colors flex items-center gap-1 text-[11px]"
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
                              className="p-1 px-1.5 hover:bg-card hover:text-foreground text-muted-foreground rounded-none transition-colors flex items-center gap-1 text-[11px]"
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
                              className="p-1 px-1.5 hover:bg-card hover:text-foreground text-muted-foreground rounded-none transition-colors flex items-center gap-1 text-[11px]"
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
                            className="text-xs font-mono rounded-none leading-relaxed"
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
                          className="h-9 text-xs rounded-none"
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
                      className="mt-0.5 size-4 rounded-none accent-primary border-input cursor-pointer"
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
                        className="h-8 text-xs font-mono rounded-none"
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSending}
                  className="w-full h-10 gap-2 font-semibold text-xs mt-3 rounded-none shadow-xs cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <div className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-none animate-spin" />
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

            {/* Email Logs Card (Sharp Corners) */}
            <div className="p-6 rounded-none bg-card border border-border shadow-xs space-y-3">
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
                      className="p-2.5 rounded-none bg-muted/30 border border-border text-xs flex items-center justify-between"
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
                        className={`text-[10px] capitalize rounded-none ${
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
                <span className="size-2 bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Live Email Template Preview
                </h3>
                {isPreviewLoading && (
                  <RefreshCw className="size-3 text-muted-foreground animate-spin" />
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Device viewport switcher */}
                <div className="flex items-center bg-muted/50 p-0.5 border border-border">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`p-1 text-xs transition-colors flex items-center gap-1 ${
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
                    className={`p-1 text-xs transition-colors flex items-center gap-1 ${
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
            <div className="border border-border bg-muted/20 p-6 flex flex-col items-center max-h-[calc(100vh-160px)] overflow-y-auto overflow-x-hidden rounded-none shadow-xs">
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
    </div>
  );
}
