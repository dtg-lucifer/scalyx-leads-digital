"use client";

import React, { useState, useEffect } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { EmailTemplateMeta, EmailLog } from "@/types/email";
import { Lead } from "@/types/lead";
import {
  Mail,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  Clock,
  History,
  Check,
  RotateCcw,
  Paperclip,
  Trash2,
  FileText,
  FolderDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export default function EmailSenderPage() {
  const [templates, setTemplates] = useState<EmailTemplateMeta[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("client_onboarding");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);

  // Email form values
  const [recipient, setRecipient] = useState("arjun@techcorp.io");
  const [subject, setSubject] = useState("");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  // Attachments & Deliverables Notice
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [includeDeliverablesFooter, setIncludeDeliverablesFooter] = useState(false);
  const [deliverablesUrl, setDeliverablesUrl] = useState("");

  // Live preview & sending state
  const [previewHtml, setPreviewHtml] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

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
          // Set initial template
          const first = templatesData.templates[0];
          if (first) {
            setSelectedTemplateId(first.id);
            setSubject(first.defaultSubject);
            const initialVals: Record<string, string> = {};
            first.fields.forEach((f: any) => {
              initialVals[f.key] = f.defaultValue;
            });
            setFieldValues(initialVals);
          }
        }
        if (leadsData.leads) setLeads(leadsData.leads);
        if (logsData.logs) setEmailLogs(logsData.logs);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  // Update preview when fields, template, attachments, or footer toggle changes
  useEffect(() => {
    if (!selectedTemplateId) return;
    async function updatePreview() {
      try {
        const mergedParams: Record<string, string> = {
          ...fieldValues,
          includeDeliverablesFooter: includeDeliverablesFooter ? "true" : "false",
          deliverablesUrl: deliverablesUrl || fieldValues.portalUrl || "",
        };
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
        if (data.html) setPreviewHtml(data.html);
      } catch (err) {
        console.error(err);
      }
    }
    const timer = setTimeout(updatePreview, 150);
    return () => clearTimeout(timer);
  }, [selectedTemplateId, fieldValues, includeDeliverablesFooter, deliverablesUrl, attachedFiles]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = templates.find((t) => t.id === templateId);
    if (tmpl) {
      setSubject(tmpl.defaultSubject);
      const vals: Record<string, string> = {};
      tmpl.fields.forEach((f) => {
        vals[f.key] = f.defaultValue;
      });
      setFieldValues(vals);
    }
  };

  const handleLeadSelect = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    setRecipient(lead.email);
    const origin = typeof window !== "undefined"
      ? window.location.origin
      : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const portalUrl = `${origin}/portal/${lead.portalAccessCode || lead.id}`;
    setDeliverablesUrl(`${portalUrl}?tab=deliverables`);
    setFieldValues((prev) => ({
      ...prev,
      clientName: lead.name,
      companyName: lead.company || lead.name,
      portalPassword: lead.portalAccessCode || prev.portalPassword || "tc-pass-2026",
      portalUrl: portalUrl,
    }));
  };

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [key]: value,
    }));
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
      const mergedParams: Record<string, string> = {
        ...fieldValues,
        includeDeliverablesFooter: includeDeliverablesFooter ? "true" : "false",
        deliverablesUrl: deliverablesUrl || fieldValues.portalUrl || "",
      };
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
      attachedFiles.forEach((file) => {
        formData.append("attachments", file);
      });

      const res = await fetch("/api/email/send", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setNotification({
          type: "success",
          message: `Email dispatched successfully via Resend! (ID: ${data.id}${attachedFiles.length > 0 ? `, ${attachedFiles.length} file(s) attached` : ""})`,
        });
        setAttachedFiles([]);
        // Refresh logs
        const logsRes = await fetch("/api/email/logs");
        const logsData = await logsRes.json();
        if (logsData.logs) setEmailLogs(logsData.logs);
      } else {
        setNotification({
          type: "error",
          message: data.error || "Failed to send email. Check Resend API key or domain verification.",
        });
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Email dispatch failed.",
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
            className={`flex items-center gap-2.5 px-4 py-3 rounded-none shadow-xl border text-xs font-semibold max-w-md ${
              notification.type === "success"
                ? "bg-card text-emerald-600 border-emerald-500/20 shadow-emerald-500/10"
                : "bg-card text-rose-600 border-rose-500/20 shadow-rose-500/10"
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
        title="Email Sender (Resend)"
        description="Send transactional React templated emails to clients with real-time preview."
        actions={
          <Badge variant="outline" className="gap-1.5 text-xs text-primary border-primary/20">
            <Sparkles className="size-3" />
            <span>Powered by Resend</span>
          </Badge>
        }
      />

      <div className="p-6 space-y-6">
        {/* Template Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTemplateChange(t.id)}
              className={`px-3.5 py-2 rounded-none text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                selectedTemplateId === t.id
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <Mail className="size-3.5" />
              <span>{t.name}</span>
            </button>
          ))}
        </div>

        {/* Workspace: Left Form, Right Live HTML Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Recipient & Parameters (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-none bg-card border border-border shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Email Parameters</h3>
                {leads.length > 0 && (
                  <div className="flex items-center gap-1 text-xs">
                    <Users className="size-3 text-primary" />
                    <select
                      onChange={(e) => e.target.value && handleLeadSelect(e.target.value)}
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
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Recipient Email Address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="client@company.com"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Subject Line <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-9 text-xs font-medium"
                  />
                </div>

                {/* Highly Visible File Attachments Section */}
                <div className="p-3.5 bg-muted/20 border border-border rounded-none space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Paperclip className="size-3.5 text-primary" />
                      Email Attachments
                      {attachedFiles.length > 0 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-none bg-primary/10 text-primary border border-primary/20">
                          {attachedFiles.length} {attachedFiles.length === 1 ? 'file' : 'files'}
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
                            <span className="truncate font-semibold text-foreground" title={file.name}>
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
                        Attach documents, PDF proposals, deliverables, or specifications (multi-file support)
                      </p>
                    </label>
                  )}
                </div>

                {/* Dynamic Template Fields */}
                <div className="pt-2 border-t border-border space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Template Variables ({selectedTemplate?.name})
                  </div>

                  {selectedTemplate?.fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <Textarea
                          rows={3}
                          value={fieldValues[field.key] || ""}
                          placeholder={field.placeholder}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          className="text-xs"
                        />
                      ) : (
                        <Input
                          type={field.type}
                          value={fieldValues[field.key] || ""}
                          placeholder={field.placeholder}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          className="h-9 text-xs"
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
                      onChange={(e) => setIncludeDeliverablesFooter(e.target.checked)}
                      className="mt-0.5 size-4 rounded-none accent-primary border-input cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <FolderDown className="size-3.5 text-primary" />
                        Add &quot;Download Documents from Deliverables&quot; footer
                      </span>
                      <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                        Appends a branded callout inviting the client to view and download all project deliverables from their secure portal.
                      </p>
                    </div>
                  </label>

                  {includeDeliverablesFooter && (
                    <div className="pt-1.5 pl-6 space-y-1">
                      <label className="block text-[11px] font-semibold text-muted-foreground">
                        Custom Deliverables Portal URL (Optional)
                      </label>
                      <Input
                        type="url"
                        placeholder="https://scalyx.in/portal/client?tab=deliverables"
                        value={deliverablesUrl}
                        onChange={(e) => setDeliverablesUrl(e.target.value)}
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSending}
                  className="w-full h-10 gap-2 font-semibold text-xs mt-3 rounded-none shadow-xs"
                >
                  {isSending ? (
                    <>
                      <div className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-none animate-spin" />
                      <span>Dispatching via Resend...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      <span>Send Templated Email {attachedFiles.length > 0 && `(${attachedFiles.length} file${attachedFiles.length > 1 ? "s" : ""})`}</span>
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Email Logs Card */}
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
                        <div className="font-semibold text-foreground truncate">{log.subject}</div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          To: {log.recipient} • {new Date(log.createdAt).toLocaleTimeString()}
                        </div>
                      </div>

                      <Badge
                        variant={log.status === "sent" ? "outline" : "destructive"}
                        className={`text-[10px] capitalize ${
                          log.status === "sent" ? "text-emerald-600 border-emerald-500/20" : ""
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

          {/* Right Live HTML Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-none bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Live React Email Template Preview
                </h3>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                Subject: {subject}
              </span>
            </div>

            <div className="rounded-none border border-border bg-white shadow-md overflow-hidden min-h-[640px] flex flex-col">
              <iframe
                title="Email Preview"
                srcDoc={previewHtml}
                className="w-full flex-1 min-h-[640px] border-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
