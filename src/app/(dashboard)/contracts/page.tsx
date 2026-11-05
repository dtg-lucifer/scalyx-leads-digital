"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  ContractBlock,
  ContractPreset,
} from "@/lib/contract/types";
import {
  CONTRACT_PRESETS,
  createDefaultContractBlocks,
  createBlankContractBlocks,
} from "@/lib/contract/blocks";
import { renderContractHtml } from "@/lib/contract/renderer";
import { VisualContractEditor } from "@/components/contract/VisualContractEditor";
import {
  CONTRACT_CATALOGUE_ITEMS,
  ContractCatalogueItem,
} from "@/lib/contract/catalogue";
import {
  createPasswordProtectedHtml,
  downloadPasswordProtectedPdf,
  downloadCleanPdf,
} from "@/lib/contract/protection";
import { AppNavbar } from "@/components/layout/AppNavbar";
import {
  FileSignature,
  Printer,
  Mail,
  Send,
  Sparkles,
  RotateCcw,
  LayoutGrid,
  Columns2,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Users,
  Building,
  Loader2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Layers,
  Lock,
  KeyRound,
  Download,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Search,
  Plus,
  Copy,
  RefreshCw,
  LayoutTemplate,
  FolderClock,
  PenLine,
  Save,
  Check,
  Clock,
} from "lucide-react";
import { SavedDocumentsModal } from "@/components/common/SavedDocumentsModal";
import type { SavedContractDoc } from "@/types/savedDocument";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface LeadOption {
  id: string;
  name: string;
  company?: string;
  email: string;
  dealValue: string | number;
  status: string;
}

const INITIAL_LEAD_OPTIONS: LeadOption[] = [
  {
    id: "lead-santosh-1",
    name: "Santosh Kumar",
    company: "Brozz Bharat Private Limited",
    email: "brozz.co.in@gmail.com",
    dealValue: 40000,
    status: "Won",
  },
  {
    id: "lead-acme-2",
    name: "Acme Global Solutions",
    company: "Acme Enterprises Pvt. Ltd.",
    email: "contact@acme.com",
    dealValue: 150000,
    status: "Negotiating",
  },
  {
    id: "lead-techcorp-3",
    name: "TechCorp Global",
    company: "TechCorp Solutions Inc.",
    email: "operations@techcorp.com",
    dealValue: 85000,
    status: "Proposal Sent",
  },
];

export default function ContractBuilderPage() {
  const [blocks, setBlocks] = useState<ContractBlock[]>([]);
  const [activePreset, setActivePreset] = useState<string>("msa");
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  const [contractTitle, setContractTitle] = useState<string>("Master Services Agreement");

  // Leads for Autofill & Emailing (Pre-populated so it is never empty)
  const [leads, setLeads] = useState<LeadOption[]>(INITIAL_LEAD_OPTIONS);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [loadingLeads, setLoadingLeads] = useState(false);

  // Component Catalogue modal
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategory, setCatalogCategory] = useState<string>("All");

  // Password-Protected Download modal
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadPassword, setDownloadPassword] = useState("scalyx2026");
  const [showDownloadPassword, setShowDownloadPassword] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Email Dialog state with fully editable client fields
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailRecipientName, setEmailRecipientName] = useState("");
  const [emailClientCompany, setEmailClientCompany] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailCoverNote, setEmailCoverNote] = useState("");
  const [emailPassword, setEmailPassword] = useState("scalyx2026");
  const [includePasswordInEmail, setIncludePasswordInEmail] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Live Email Template Preview
  const [emailPreviewHtml, setEmailPreviewHtml] = useState("");
  const [isEmailPreviewLoading, setIsEmailPreviewLoading] = useState(false);
  const [emailPreviewDevice, setEmailPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Saved Contracts & Drafts Persistence State
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [docName, setDocName] = useState<string>(
    "Master Services Agreement Draft",
  );
  const [savedContracts, setSavedContracts] = useState<SavedContractDoc[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  const CONTRACTS_STORAGE_KEY = "scalyx_saved_contracts";
  const CURRENT_CONTRACT_ID_KEY = "scalyx_current_contract_id";

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Derive contract metadata (title, clientName, clientCompany, dealValue)
  const contractMetadata = useMemo(() => {
    let title = contractTitle || "Master Services Agreement";
    let clientName = "";
    let clientCompany = "";
    let dealValue = "";

    for (const b of blocks) {
      if (b.type === "contract_preamble") {
        if (b.title) title = b.title;
      } else if (b.type === "contract_parties") {
        if (b.clientName) clientName = b.clientName;
        if (b.clientCompany) clientCompany = b.clientCompany;
      } else if (b.type === "contract_commercials") {
        if (b.totalValue) dealValue = b.totalValue;
      } else if (b.type === "contract_signature") {
        if (!clientName && b.clientSignatory) clientName = b.clientSignatory;
        if (!clientCompany && b.clientTitle) clientCompany = b.clientTitle;
      }
    }

    return { title, clientName, clientCompany, dealValue };
  }, [blocks, contractTitle]);

  // Load saved contracts from localStorage and API on mount
  useEffect(() => {
    try {
      const local = localStorage.getItem(CONTRACTS_STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedContracts(parsed);
        }
      }
      const storedId = localStorage.getItem(CURRENT_CONTRACT_ID_KEY);
      if (storedId) {
        setCurrentDocId(storedId);
      }
    } catch (e) {
      console.error("Local storage read error for contracts:", e);
    }

    async function loadSavedFromApi() {
      try {
        setIsLoadingSaved(true);
        const res = await fetch("/api/contracts");
        const data = await res.json();
        if (data.contracts && Array.isArray(data.contracts)) {
          setSavedContracts(data.contracts);
          localStorage.setItem(
            CONTRACTS_STORAGE_KEY,
            JSON.stringify(data.contracts),
          );
        }
      } catch (err) {
        console.error("Failed to load saved contracts from API:", err);
      } finally {
        setIsLoadingSaved(false);
      }
    }
    loadSavedFromApi();
  }, []);

  // Persist helper
  const persistContract = async (
    targetId: string,
    targetBlocks: ContractBlock[],
  ) => {
    try {
      setSaveStatus("saving");
      const now = new Date().toISOString();
      const docToSave: SavedContractDoc = {
        id: targetId,
        name:
          docName.trim() ||
          contractMetadata.title ||
          "Scalyx Service Agreement",
        title: contractMetadata.title || "Scalyx Service Agreement",
        clientName: contractMetadata.clientName,
        clientCompany: contractMetadata.clientCompany,
        dealValue: contractMetadata.dealValue,
        blocks: targetBlocks,
        updatedAt: now,
        createdAt: now,
        isDraft: true,
      };

      setSavedContracts((prev) => {
        const withoutCurrent = prev.filter((c) => c.id !== targetId);
        const updated = [docToSave, ...withoutCurrent];
        try {
          localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(updated));
          localStorage.setItem(CURRENT_CONTRACT_ID_KEY, targetId);
        } catch (e) {
          console.error("Local storage write error for contract:", e);
        }
        return updated;
      });

      await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contract: docToSave }),
      });

      setSaveStatus("saved");
      setLastSavedTime(new Date());
    } catch (err) {
      console.error("Failed to save contract:", err);
      setSaveStatus("error");
    }
  };

  // 1-second debounced auto-saver
  useEffect(() => {
    if (!hasUserEdited && !currentDocId) {
      return;
    }

    setSaveStatus("saving");
    const docId =
      currentDocId ||
      `ctr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    if (!currentDocId) {
      setCurrentDocId(docId);
    }

    const timer = setTimeout(() => {
      persistContract(docId, blocks);
    }, 1000);

    return () => clearTimeout(timer);
  }, [blocks, docName, hasUserEdited]);

  const handleBlocksChange = (newBlocks: ContractBlock[]) => {
    setBlocks(newBlocks);
    setHasUserEdited(true);
  };

  const handleCreateBlank = () => {
    const blankBlocks = createBlankContractBlocks();
    const docId = `ctr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setBlocks(blankBlocks);
    setDocName("New Blank Contract Agreement");
    setActivePreset("blank");
    setContractTitle("Service Contract & Engagement Agreement");
    setCurrentDocId(docId);
    setHasUserEdited(true);
    persistContract(docId, blankBlocks);
    setEmailStatusMessage({
      type: "success",
      text: "Created new blank contract agreement canvas!",
    });
    setTimeout(() => setEmailStatusMessage(null), 3000);
  };

  const handleExplicitSave = () => {
    const docId =
      currentDocId ||
      `ctr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setCurrentDocId(docId);
    setHasUserEdited(true);
    persistContract(docId, blocks);
    setEmailStatusMessage({
      type: "success",
      text: `Contract draft "${docName || "Contract"}" saved to storage!`,
    });
    setTimeout(() => setEmailStatusMessage(null), 3000);
  };

  const handleLoadSavedContract = (id: string) => {
    const found = savedContracts.find((c) => c.id === id);
    if (found) {
      setBlocks(found.blocks);
      setCurrentDocId(found.id);
      setDocName(found.name || found.title || "Custom Contract Draft");
      setContractTitle(found.title || "Master Services Agreement");
      setActivePreset("custom");
      setHasUserEdited(true);
      setSaveStatus("saved");
      setEmailStatusMessage({
        type: "success",
        text: `Loaded contract draft "${found.name || found.title}"!`,
      });
      setTimeout(() => setEmailStatusMessage(null), 3000);
    }
  };

  const handleDeleteSavedContract = async (id: string) => {
    try {
      const updated = savedContracts.filter((c) => c.id !== id);
      setSavedContracts(updated);
      try {
        localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Local storage delete error for contract:", e);
      }
      if (currentDocId === id) {
        setCurrentDocId(null);
      }
      await fetch(`/api/contracts?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setEmailStatusMessage({
        type: "success",
        text: "Deleted saved contract draft.",
      });
      setTimeout(() => setEmailStatusMessage(null), 2500);
    } catch (err) {
      console.error("Failed to delete contract:", err);
    }
  };

  // Initialize blocks on mount
  useEffect(() => {
    setBlocks(createDefaultContractBlocks());
  }, []);

  // Fetch leads for autofill and direct dispatch
  useEffect(() => {
    async function fetchLeads() {
      setLoadingLeads(true);
      try {
        const res = await fetch("/api/leads");
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : Array.isArray(data?.leads) ? data.leads : [];
          if (list.length > 0) {
            setLeads(list);
          }
        }
      } catch (err) {
        console.error("Failed to load leads for contract autofill", err);
      } finally {
        setLoadingLeads(false);
      }
    }
    fetchLeads();
  }, []);

  // Autofill contract from selected lead
  const handleApplyLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    if (!leadId) return;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    const formattedDealValue = lead.dealValue
      ? `₹${Number(lead.dealValue).toLocaleString("en-IN")}`
      : "₹1,50,000";

    const clientCompany = lead.company || `${lead.name} Enterprises`;

    // Update relevant blocks
    const updated = blocks.map((block) => {
      if (block.type === "contract_parties") {
        return {
          ...block,
          clientName: lead.name,
          clientCompany: clientCompany,
          clientEmail: lead.email || block.clientEmail,
        };
      }
      if (block.type === "contract_preamble") {
        return {
          ...block,
          body: block.body.replace(
            /and WHEREAS[\s\S]*?Client desires/,
            `and WHEREAS, ${clientCompany} ("Client") desires`,
          ),
        };
      }
      if (block.type === "contract_commercials") {
        return {
          ...block,
          totalValue: formattedDealValue,
        };
      }
      if (block.type === "contract_signature") {
        return {
          ...block,
          clientTitle: clientCompany.toUpperCase(),
          clientSignatory: lead.name,
          agreementDisclaimer: `By signing this I, ${lead.name} am in full agreement about all of the clauses mentioned above`,
        };
      }
      return block;
    });

    setBlocks(updated);
    setDocName(`${lead.company || lead.name} Service Agreement`);
    setHasUserEdited(true);
  };

  // Switch preset
  const handleSelectPreset = (presetId: string) => {
    setActivePreset(presetId);
    const preset = CONTRACT_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setContractTitle(preset.documentType);

    // Get current client details if already filled
    const partiesBlock = blocks.find((b) => b.type === "contract_parties");
    const clientName = partiesBlock && partiesBlock.type === "contract_parties" ? partiesBlock.clientName : "Acme Global Solutions";
    const clientCompany = partiesBlock && partiesBlock.type === "contract_parties" ? partiesBlock.clientCompany : "Acme Enterprises Pvt. Ltd.";
    const clientEmail = partiesBlock && partiesBlock.type === "contract_parties" ? partiesBlock.clientEmail : "contact@acme.com";

    const newBlocks = createDefaultContractBlocks(clientName, clientCompany, clientEmail);

    // Tailor reference number prefix
    const updated = newBlocks.map((b) => {
      if (b.type === "contract_header") {
        return {
          ...b,
          referenceNo: `${preset.referencePrefix}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        };
      }
      if (b.type === "contract_preamble") {
        return {
          ...b,
          title: preset.documentType.toUpperCase(),
        };
      }
      return b;
    });

    setBlocks(updated);
    setDocName(`${preset.documentType} Draft`);
    setCurrentDocId(null);
    setHasUserEdited(false);
    setSaveStatus("idle");
  };

  // Insert block from Component Catalogue
  const handleInsertCatalogueItem = (item: ContractCatalogueItem) => {
    const partiesBlock = blocks.find((b) => b.type === "contract_parties");
    const clientName = partiesBlock && partiesBlock.type === "contract_parties" ? partiesBlock.clientName : "Client Lead";
    const clientCompany = partiesBlock && partiesBlock.type === "contract_parties" ? partiesBlock.clientCompany : "Client Enterprises";

    const newBlock = item.createBlock(clientName, clientCompany);

    // Insert right before signature block if present, else at end
    const sigIndex = blocks.findIndex((b) => b.type === "contract_signature");
    if (sigIndex !== -1 && item.category !== "Execution") {
      const next = [...blocks];
      next.splice(sigIndex, 0, newBlock);
      setBlocks(next);
    } else {
      setBlocks([...blocks, newBlock]);
    }
    setIsCatalogOpen(false);
  };

  // Print A4 Document directly
  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  // Generate random password helper
  const handleGenerateRandomPassword = (target: "download" | "email") => {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789";
    let pass = "scx-";
    for (let i = 0; i < 6; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    if (target === "download") setDownloadPassword(pass);
    else setEmailPassword(pass);
  };

  // Execute Password-Protected Standalone HTML Download
  const handleDownloadEncryptedHtml = async () => {
    setIsExporting(true);
    try {
      const headerBlock = blocks.find((b) => b.type === "contract_header");
      const partiesBlock = blocks.find((b) => b.type === "contract_parties");
      const refNo = headerBlock && headerBlock.type === "contract_header" ? headerBlock.referenceNo : "SCX-CTR-2026";
      const clientName = partiesBlock && partiesBlock.type === "contract_parties" ? partiesBlock.clientName : "Client";

      const encryptedHtml = await createPasswordProtectedHtml(renderedHtml, downloadPassword, {
        referenceNo: refNo,
        clientName: clientName,
        contractTitle: contractTitle,
      });

      const blob = new Blob([encryptedHtml], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${refNo}-CONFIDENTIAL-CONTRACT.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsDownloadModalOpen(false);
    } catch (err) {
      console.error("Failed to generate encrypted contract HTML", err);
      alert("Failed to generate encrypted contract file.");
    } finally {
      setIsExporting(false);
    }
  };

  // Execute Proper Password-Protected PDF Download (Native 128-bit Encrypted Vector PDF)
  const handleDownloadEncryptedPdf = async () => {
    setIsExporting(true);
    try {
      const headerBlock = blocks.find((b) => b.type === "contract_header");
      const refNo = headerBlock && headerBlock.type === "contract_header" ? headerBlock.referenceNo : "SCX-CTR-2026";
      await downloadPasswordProtectedPdf(blocks, downloadPassword, `${refNo}-CONFIDENTIAL.pdf`, contractTitle);
      setIsDownloadModalOpen(false);
    } catch (err) {
      console.error("Failed to generate encrypted PDF", err);
      alert("Failed to generate encrypted PDF. Please check your inputs.");
    } finally {
      setIsExporting(false);
    }
  };

  // Execute Clean Unencrypted PDF Download
  const handleDownloadCleanPdf = async () => {
    setIsExporting(true);
    try {
      const headerBlock = blocks.find((b) => b.type === "contract_header");
      const refNo = headerBlock && headerBlock.type === "contract_header" ? headerBlock.referenceNo : "SCX-CTR-2026";
      await downloadCleanPdf(blocks, `${refNo}-Contract.pdf`, contractTitle);
      setIsDownloadModalOpen(false);
    } catch (err) {
      console.error("Failed to generate clean PDF", err);
      alert("Failed to generate clean PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  // Open Email Modal with prefilled parameters
  const handleOpenEmailModal = () => {
    const partiesBlock = blocks.find((b) => b.type === "contract_parties");
    const headerBlock = blocks.find((b) => b.type === "contract_header");
    const clientName = partiesBlock && partiesBlock.type === "contract_parties" ? partiesBlock.clientName : "Valued Client";
    const clientCompany = partiesBlock && partiesBlock.type === "contract_parties" ? partiesBlock.clientCompany : "";
    const clientEmail = partiesBlock && partiesBlock.type === "contract_parties" ? partiesBlock.clientEmail : "";
    const refNo = headerBlock && headerBlock.type === "contract_header" ? headerBlock.referenceNo : "SCX-CTR-2026";

    setEmailRecipientName(clientName);
    setEmailClientCompany(clientCompany);
    setEmailTo(clientEmail);
    setEmailSubject(`Contract Agreement & Execution • Scalyx & ${clientName} (${refNo})`);
    const initialNote = `Dear ${clientName},\n\nPlease find the official agreement for our upcoming engineering engagement.\n\nAll agreed scopes of work, intellectual property transfer terms, warranty coverage, and milestone schedules have been itemized according to our discussions.\n\nPlease review the terms and confirm your agreement at your earliest convenience to initiate Phase 1 kick-off.`;
    setEmailCoverNote(initialNote);
    setEmailStatusMessage(null);

    // Instantly generate initial branded email preview so there is zero blank screen flash
    const initialMarkdown = `${initialNote}\n\n---\n\n### Contract Summary & Specifications\n- **Contract Document:** ${contractTitle}\n- **Counterparty / Client:** **${clientName}${clientCompany ? ` (${clientCompany})` : ""}**\n- **Reference ID:** \`${refNo}\`\n- **Execution Status:** Pending Digital Agreement\n\n> 🔐 **Document Security Notice**\n> This contract is password-protected for client confidentiality.\n> **Security Password:** \`${emailPassword}\`\n\n> 📜 **Digital Agreement & Acceptance Notice**\n> Replying to this email stating that you agree will constitute your full binding acceptance and agreement to all clauses, milestone schedules, and terms mentioned in this contract.\n\nYour digital contract is linked to your secure Scalyx Client Portal. You can review all real-time sprints, milestone deliverables, and invoices directly from your workspace.`;
    setEmailPreviewHtml(
      buildClientEmailPreview({
        recipientName: clientName,
        bodyMarkdown: initialMarkdown,
        origin: typeof window !== "undefined" ? window.location.origin : "",
      }),
    );
    setIsEmailModalOpen(true);
  };

  // Instant client-side branded template generator (zero latency fallback)
  function buildClientEmailPreview(params: {
    recipientName: string;
    bodyMarkdown: string;
    origin: string;
  }) {
    const formattedBody = params.bodyMarkdown
      .split("\n\n")
      .map((p) => {
        const trimmed = p.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith("### ")) {
          return `<h3 style="margin:20px 0 10px 0;color:#0f172a;font-size:16px;font-weight:700;">${trimmed.slice(4)}</h3>`;
        }
        if (trimmed.startsWith("> ")) {
          return `<div style="margin:14px 0;padding:12px 16px;background:#f8fafc;border-left:3px solid #0f172a;color:#334155;font-size:13.5px;line-height:1.6;">${trimmed.replace(/^>\s*/gm, "")}</div>`;
        }
        if (trimmed.startsWith("- ")) {
          const items = trimmed
            .split("\n")
            .map((li) => `<li style="margin-bottom:6px;">${li.replace(/^-\s*/, "")}</li>`)
            .join("");
          return `<ul style="margin:0 0 16px 0;padding-left:20px;color:#334155;font-size:14px;line-height:1.65;">${items}</ul>`;
        }
        return `<p style="margin:0 0 14px 0;color:#334155;font-size:14px;line-height:1.65;">${trimmed}</p>`;
      })
      .join("")
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#0f172a;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color:#1e293b;">$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;color:#0f172a;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:12px;">$1</code>');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { margin:0; padding:24px 16px; background:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; color:#0f172a; }
    .card { max-width:580px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.03); }
    .header { border-bottom:2px solid #0f172a; padding-bottom:16px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center; }
    .brand { font-size:18px; font-weight:900; letter-spacing:2px; color:#0f172a; }
    .badge { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:#475569; background:#f1f5f9; border:1px solid #e2e8f0; padding:3px 8px; }
    .headline { font-size:22px; font-weight:800; color:#0f172a; margin:0 0 16px 0; line-height:1.25; }
    .btn { display:inline-block; background:#0f172a; color:#ffffff !important; padding:12px 26px; font-size:13.5px; font-weight:700; text-decoration:none; margin:22px 0 16px 0; }
    .footer { border-top:1px solid #e2e8f0; padding-top:16px; margin-top:28px; font-size:11px; color:#64748b; text-align:center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="brand">SCALYX</span>
      <span class="badge">OFFICIAL CONTRACT AGREEMENT</span>
    </div>
    <h1 class="headline">Service Agreement — Scalyx &amp; ${params.recipientName}</h1>
    <div>${formattedBody}</div>
    <div>
      <a href="${params.origin}/portal" class="btn" target="_blank">Open Scalyx Client Workspace</a>
    </div>
    <div class="footer">
      Scalyx
    </div>
  </div>
</body>
</html>`;
  }

  // Build markdown body for email
  const buildEmailBodyMarkdown = () => {
    const headerBlock = blocks.find((b) => b.type === "contract_header");
    const commBlock = blocks.find((b) => b.type === "contract_commercials");

    const refNo = headerBlock && headerBlock.type === "contract_header" ? headerBlock.referenceNo : "SCX-CTR-2026";
    const totalValue = commBlock && commBlock.type === "contract_commercials" ? commBlock.totalValue : "As Agreed";
    const clientDisplay = emailRecipientName || "Client";
    const companyDisplay = emailClientCompany ? ` (${emailClientCompany})` : "";

    let body = `${emailCoverNote}\n\n---\n\n### Contract Summary & Specifications\n- **Contract Document:** ${contractTitle}\n- **Counterparty / Client:** **${clientDisplay}${companyDisplay}**\n- **Reference ID:** \`${refNo}\`\n- **Total Contract Value:** **${totalValue}**\n- **Execution Status:** Pending Digital Agreement`;

    if (includePasswordInEmail && emailPassword) {
      body += `\n\n> 🔐 **Document Security Notice**\n> This contract is password-protected for client confidentiality.\n> **Security Password:** \`${emailPassword}\`\n> Please use this password when unlocking your contract document or portal credentials.`;
    }

    body += `\n\n> 📜 **Digital Agreement & Acceptance Notice**\n> Replying to this email stating that you agree will constitute your full binding acceptance and agreement to all clauses, milestone schedules, and terms mentioned in this contract.\n\nYour digital contract is linked to your secure Scalyx Client Portal. You can review all real-time sprints, milestone deliverables, and invoices directly from your workspace.`;

    return body;
  };

  // Live update the branded email template preview when fields change
  useEffect(() => {
    if (!isEmailModalOpen) return;
    let isCancelled = false;

    async function updateEmailPreview() {
      setIsEmailPreviewLoading(true);
      const bodyMarkdown = buildEmailBodyMarkdown();
      try {
        const payload = {
          templateId: "custom_email",
          params: {
            eyebrow: "OFFICIAL CONTRACT AGREEMENT",
            headline: `Service Agreement — Scalyx & ${emailRecipientName || "Client"}`,
            bodyMarkdown: bodyMarkdown,
            buttonText: "Open Scalyx Client Workspace",
            buttonUrl: `${window.location.origin}/portal`,
            closingNote: "Scalyx",
          },
        };

        let res = await fetch("/api/email/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          res = await fetch("/api/email/logs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }

        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.html) {
            setEmailPreviewHtml(data.html);
          }
        } else {
          // Graceful fallback to client template
          if (!isCancelled && !emailPreviewHtml) {
            setEmailPreviewHtml(
              buildClientEmailPreview({
                recipientName: emailRecipientName || "Client",
                bodyMarkdown: bodyMarkdown,
                origin: window.location.origin,
              }),
            );
          }
        }
      } catch (err) {
        console.error("Failed to generate live email preview", err);
        if (!isCancelled && !emailPreviewHtml) {
          setEmailPreviewHtml(
            buildClientEmailPreview({
              recipientName: emailRecipientName || "Client",
              bodyMarkdown: bodyMarkdown,
              origin: window.location.origin,
            }),
          );
        }
      } finally {
        if (!isCancelled) setIsEmailPreviewLoading(false);
      }
    }

    const timer = setTimeout(updateEmailPreview, 200);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [
    isEmailModalOpen,
    emailRecipientName,
    emailClientCompany,
    emailCoverNote,
    emailPassword,
    includePasswordInEmail,
    contractTitle,
  ]);

  // Dispatch Email
  const handleSendEmail = async () => {
    if (!emailTo || !emailSubject) {
      setEmailStatusMessage({
        type: "error",
        text: "Please provide a valid recipient email address and subject line.",
      });
      return;
    }

    setIsSendingEmail(true);
    setEmailStatusMessage(null);

    try {
      const bodyMarkdown = buildEmailBodyMarkdown();

      const payload = {
        to: emailTo,
        subject: emailSubject,
        templateId: "custom_email",
        params: {
          eyebrow: "OFFICIAL CONTRACT AGREEMENT",
          headline: `Service Agreement — Scalyx & ${emailRecipientName || "Client"}`,
          bodyMarkdown: bodyMarkdown,
          buttonText: "Open Scalyx Client Workspace",
          buttonUrl: `${window.location.origin}/portal`,
          closingNote: "Scalyx",
        },
      };

      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch contract email");
      }

      setEmailStatusMessage({
        type: "success",
        text: `Contract email successfully dispatched to ${emailTo}!`,
      });

      setTimeout(() => {
        setIsEmailModalOpen(false);
      }, 2000);
    } catch (err: any) {
      setEmailStatusMessage({
        type: "error",
        text: err.message || "Failed to send email. Please check your network or Resend credentials.",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Compile contract HTML for live preview
  const renderedHtml = renderContractHtml(blocks);

  // Extract client details
  const partiesBlock = blocks.find((b) => b.type === "contract_parties");
  const activeClientName = partiesBlock && partiesBlock.type === "contract_parties" ? partiesBlock.clientName : undefined;

  // Filter catalogue items
  const filteredCatalogItems = CONTRACT_CATALOGUE_ITEMS.filter((item) => {
    const matchesCategory = catalogCategory === "All" || item.category === catalogCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.badge.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Top Standard App Navbar (Identical Height & Layout to Proposal Studio) */}
      <div className="shrink-0">
        <AppNavbar
          title="Contract Builder"
          description="Draft, customize, encrypt, and dispatch binding agreements."
          actions={
            <div className="flex items-center gap-2">
              {/* Create Blank Contract Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCreateBlank}
                className="gap-1.5 text-xs font-medium rounded-lg border-border"
                title="Create a new blank contract from scratch"
              >
                <Plus className="size-3.5" />
                <span>New Blank</span>
              </Button>

              {/* Saved Contracts Popup List Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsSavedModalOpen(true)}
                className="gap-1.5 text-xs font-medium rounded-lg border-border"
                title="View and load saved contracts & drafts"
              >
                <FolderClock className="size-3.5 text-primary" />
                <span>Saved Drafts ({savedContracts.length})</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDownloadModalOpen(true)}
                className="gap-1.5 text-xs font-medium rounded-lg border-border"
                title="Download / Export with 256-bit AES Password Protection"
              >
                <Lock className="size-3.5 text-amber-500" />
                <span className="hidden sm:inline">Encrypted PDF</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-1.5 text-xs font-medium rounded-lg border-border"
                title="Print or Save as A4 PDF"
              >
                <Printer className="size-3.5" />
                <span>Print PDF</span>
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleOpenEmailModal}
                className="gap-1.5 text-xs font-semibold rounded-lg shadow-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Mail className="size-3.5" />
                <span>Send Contract</span>
              </Button>
            </div>
          }
        />
      </div>

      {/* Main Workspace Body */}
      <div className="p-3 xl:p-4 space-y-2.5 flex-1 flex flex-col min-h-0 h-full overflow-hidden">
        {/* Elegant Workspace Toolbar */}
        <div className="bg-card border border-border/70 rounded-xl px-3 py-2 shadow-xs shrink-0 flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Draft Name & Status */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center gap-2 bg-muted/40 hover:bg-muted/60 focus-within:bg-background focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 border border-border/80 px-2.5 py-1 rounded-lg transition-all shadow-2xs">
              <PenLine className="size-3.5 text-primary shrink-0" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0">
                Draft:
              </span>
              <input
                type="text"
                value={docName}
                onChange={(e) => {
                  setDocName(e.target.value);
                  setHasUserEdited(true);
                }}
                placeholder="Contract Name..."
                className="h-5 w-44 sm:w-56 md:w-64 text-xs font-semibold bg-transparent border-0 focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground/60 truncate"
                title="Name this contract draft to easily identify it in saved drafts"
              />
            </div>

            {/* Autosave Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium text-muted-foreground bg-muted/30 border border-border/50 shrink-0">
              {saveStatus === "saving" ? (
                <>
                  <Loader2 className="size-3 animate-spin text-amber-500" />
                  <span className="text-amber-600 dark:text-amber-400">Saving...</span>
                </>
              ) : saveStatus === "saved" ? (
                <>
                  <Check className="size-3 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Saved</span>
                </>
              ) : (
                <>
                  <Clock className="size-3 text-muted-foreground" />
                  <span>Unsaved</span>
                </>
              )}
            </div>

            <div className="h-4 w-px bg-border/70 hidden md:block" />

            {/* Template Selector as sleek inline select */}
            <div className="hidden md:flex items-center gap-1.5 text-xs">
              <LayoutTemplate className="size-3.5 text-muted-foreground shrink-0" />
              <select
                value={activePreset}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="h-7 px-2 pr-6 rounded-lg bg-background hover:bg-muted/40 border border-border/80 text-xs font-medium text-foreground focus:outline-none transition-colors cursor-pointer"
                title="Load a contract template"
              >
                {CONTRACT_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    Template: {p.name.split("(")[0].trim()}
                  </option>
                ))}
              </select>
            </div>

            {/* Autofill with Lead Dropdown */}
            {leads.length > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 text-xs">
                <Users className="size-3.5 text-muted-foreground shrink-0" />
                <select
                  value={selectedLeadId}
                  onChange={(e) => e.target.value && handleApplyLead(e.target.value)}
                  className="h-7 px-2 pr-6 rounded-lg bg-background hover:bg-muted/40 border border-border/80 text-xs font-medium text-foreground focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="">Autofill Lead...</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.company || l.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Right: Component Catalog & Segmented View Mode */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Component Catalog Modal Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCatalogOpen(true)}
              className="h-7 px-2.5 rounded-lg text-xs font-medium gap-1.5 border-border/80 bg-background hover:bg-muted/60 shadow-2xs"
              title="Open Component Catalog modal"
            >
              <Layers className="size-3.5 text-primary" />
              <span>Catalog</span>
            </Button>

            <div className="h-4 w-px bg-border/70" />

            {/* View Mode Switcher */}
            <div className="flex items-center border border-border/80 rounded-lg bg-muted/40 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`px-2 py-0.5 flex items-center gap-1 text-[11px] font-medium rounded-md transition-colors ${viewMode === "split"
                    ? "bg-card text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
                title="Split Visual Editor & Live Preview"
              >
                <Columns2 className="size-3" />
                <span>Split</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("editor")}
                className={`px-2 py-0.5 flex items-center gap-1 text-[11px] font-medium transition-colors ${viewMode === "editor"
                    ? "bg-card text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
                title="Visual Block Editor Only"
              >
                <FileCode className="size-3" />
                <span>Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`px-2 py-0.5 flex items-center gap-1 text-[11px] font-medium transition-colors ${viewMode === "preview"
                    ? "bg-card text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
                title="Live A4 Document Preview Only"
              >
                <LayoutGrid className="size-3" />
                <span>Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* Locked Grid Workspace: Visual Block Editor & Preview scroll independently */}
        <div className="grid grid-cols-12 grid-rows-1 gap-3.5 items-stretch flex-1 min-h-0 h-full overflow-hidden">
          {/* Left Column: Visual Block Editor */}
          <div
            className={`${viewMode === "split"
                ? "col-span-12 lg:col-span-6 2xl:col-span-6"
                : viewMode === "editor"
                  ? "col-span-12"
                  : "hidden"
              } bg-card border border-border/80 rounded-xl p-3 flex flex-col h-full min-h-0 overflow-hidden shadow-xs`}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/70 shrink-0">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Visual Contract Editor
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] rounded-full px-2 py-0 border-border"
                >
                  {blocks.length} Blocks
                </Badge>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Drag to reorder &bull; Fully editable
              </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
              <VisualContractEditor
                blocks={blocks}
                onChange={handleBlocksChange}
                activeClientName={activeClientName}
              />
            </div>
          </div>

          {/* Right Column: Minimal Elegant Live Preview */}
          <div
            className={`${viewMode === "split"
                ? "col-span-12 lg:col-span-6 2xl:col-span-6"
                : viewMode === "preview"
                  ? "col-span-12"
                  : "hidden"
              } bg-card border border-border/80 rounded-xl p-3 flex flex-col h-full min-h-0 overflow-hidden shadow-xs`}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/70 shrink-0">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Live A4 Contract Preview
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] rounded-full px-2 py-0 border-emerald-500/20 text-emerald-600 bg-emerald-500/5 font-mono"
                >
                  A4 Monochrome
                </Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handlePrint}
                  className="h-6 text-[11px] gap-1 px-2 text-muted-foreground hover:text-foreground"
                >
                  <Printer className="size-3" />
                  <span>Print PDF</span>
                </Button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-border/60 bg-muted/20 flex items-center justify-center p-2">
              <iframe
                ref={iframeRef}
                srcDoc={renderedHtml}
                title="Contract Preview"
                className="w-full h-full border-none rounded bg-background shadow-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 1. Component Catalogue Dialog (Matches Proposal Studio exact style) */}
      <Dialog open={isCatalogOpen} onOpenChange={setIsCatalogOpen}>
        <DialogContent className="w-[94vw] sm:max-w-2xl md:max-w-3xl bg-card rounded-2xl p-6 shadow-2xl max-h-[85vh] flex flex-col border-border">
          <DialogHeader className="pb-3 border-b border-border/80 shrink-0">
            <DialogTitle className="text-base font-bold flex items-center justify-between text-foreground">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-primary shrink-0" />
                <span>Contract Component Catalogue ({CONTRACT_CATALOGUE_ITEMS.length} Pre-Styled Elements)</span>
              </div>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Select and insert legal clauses, itemized schedules, headers, or execution blocks into your contract.
            </DialogDescription>

            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row gap-2 pt-3">
              <div className="relative flex-1">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search contract components, clauses, tables..."
                  className="h-8 pl-8 text-xs"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {["All", "Structure", "Schedules", "Legal Clauses", "Execution"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCatalogCategory(cat)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors shrink-0 ${catalogCategory === cat
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted/40 text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </DialogHeader>

          {/* Catalogue Grid */}
          <div className="flex-1 overflow-y-auto py-3 space-y-2.5 scrollbar-thin">
            {filteredCatalogItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-muted/20 hover:bg-muted/40 border border-border/80 rounded-xl flex items-start justify-between gap-3 transition-colors group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </span>
                    <Badge variant="outline" className="text-[9.5px] font-mono py-0 px-1.5 uppercase">
                      {item.badge}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      &bull; {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleInsertCatalogueItem(item)}
                  className="h-7 px-3 text-xs rounded-lg gap-1 font-semibold shrink-0"
                >
                  <Plus className="size-3" />
                  <span>Insert Block</span>
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-2 border-t border-border/80 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCatalogOpen(false)}
              className="rounded-lg"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Password-Protected Export / Download Modal */}
      <Dialog open={isDownloadModalOpen} onOpenChange={setIsDownloadModalOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-border">
          <DialogHeader className="p-5 pb-3 border-b border-border/70 bg-muted/20">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Lock className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">
                  Password-Protected Export
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Protect your contract with 256-bit AES encryption. Set your custom password below.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-5 space-y-4">
            {/* Password input & generator */}
            <div className="p-3.5 bg-muted/30 border border-border/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <KeyRound className="size-3.5 text-primary" />
                  <span>Document Access Password</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleGenerateRandomPassword("download")}
                  className="text-[11px] text-primary hover:underline font-medium flex items-center gap-1"
                >
                  <RefreshCw className="size-2.5" />
                  <span>Randomize</span>
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showDownloadPassword ? "text" : "password"}
                  value={downloadPassword}
                  onChange={(e) => setDownloadPassword(e.target.value)}
                  placeholder="Choose document password..."
                  className="h-9 text-xs font-mono font-medium pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowDownloadPassword(!showDownloadPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showDownloadPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Anyone opening the downloaded file will be required to enter this exact password before the contract is revealed.
              </p>
            </div>

            {/* Export Format Options */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-foreground">Choose Download Format:</div>

              {/* Option A: Proper 128-bit Encrypted PDF */}
              <button
                type="button"
                onClick={handleDownloadEncryptedPdf}
                disabled={isExporting || !downloadPassword}
                className="w-full p-3.5 bg-card hover:bg-muted/40 border-2 border-primary/40 hover:border-primary rounded-xl text-left transition-all flex items-center justify-between group shadow-xs"
              >
                <div>
                  <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <Lock className="size-3.5 text-amber-500" />
                    <span>Encrypted Vector PDF (.pdf)</span>
                    <Badge variant="outline" className="text-[9px] text-amber-600 bg-amber-500/10 border-amber-500/20">
                      Standard PDF Encryption
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Real 128-bit encrypted PDF. Requires password in Adobe Acrobat, Apple Preview, Chrome, or any PDF reader.
                  </div>
                </div>
                <Download className="size-4 text-muted-foreground group-hover:text-primary shrink-0 ml-2" />
              </button>

              {/* Option B: Self-decrypting Standalone HTML */}
              <button
                type="button"
                onClick={handleDownloadEncryptedHtml}
                disabled={isExporting || !downloadPassword}
                className="w-full p-3.5 bg-card hover:bg-muted/40 border border-border/80 rounded-xl text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-emerald-500" />
                    <span>Protected Standalone Web Doc (.html)</span>
                    <Badge variant="outline" className="text-[9px] text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
                      256-bit AES
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Self-decrypting AES-256 web document. Opens offline on any browser with branded Scalyx security lock screen.
                  </div>
                </div>
                <Download className="size-4 text-muted-foreground group-hover:text-primary shrink-0 ml-2" />
              </button>

              {/* Option C: Clean Unencrypted PDF */}
              <button
                type="button"
                onClick={handleDownloadCleanPdf}
                disabled={isExporting}
                className="w-full p-3.5 bg-card hover:bg-muted/40 border border-border/80 rounded-xl text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <FileCode className="size-3.5 text-blue-500" />
                    <span>Clean Unencrypted Vector PDF (.pdf)</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Directly downloads clean A4 PDF without password requirement.
                  </div>
                </div>
                <Download className="size-4 text-muted-foreground group-hover:text-primary shrink-0 ml-2" />
              </button>

              {/* Option D: Standard Browser Print */}
              <button
                type="button"
                onClick={handlePrint}
                className="w-full p-3.5 bg-card hover:bg-muted/40 border border-border/80 rounded-xl text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <Printer className="size-3.5 text-primary" />
                    <span>Native Browser Print Dialog</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Opens browser native print preview for paper or system print drivers.
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary shrink-0 ml-2" />
              </button>
            </div>
          </div>

          <DialogFooter className="p-4 border-t border-border/70 bg-muted/10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDownloadModalOpen(false)}
              className="h-8 text-xs rounded-xl"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Spacious, Well-Proportioned Email Dispatch Dialog with Live Branded Preview */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="!w-[96vw] !max-w-[1240px] p-0 overflow-hidden rounded-2xl border border-border/80 h-[90vh] max-h-[880px] flex flex-col shadow-2xl">
          <DialogHeader className="px-6 py-4 pr-16 border-b border-border/70 bg-muted/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Mail className="size-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                    Send Contract via Email
                  </DialogTitle>
                  <Badge variant="outline" className="text-[10px] font-mono border-primary/20 text-primary hidden sm:inline-flex">
                    Transactional Mail
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Dispatch this contract with real-time template preview and password security.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Two-Column Spacious Layout (Compose on Left, Full Branded Preview on Right) */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Left Pane: Compose Form (Wide, Roomy, Dedicated 480px) */}
            <div className="w-full md:w-[480px] shrink-0 p-5 sm:p-6 space-y-4 overflow-y-auto bg-card scrollbar-thin flex flex-col">
              {emailStatusMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${emailStatusMessage.type === "success"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                >
                  {emailStatusMessage.type === "success" ? (
                    <CheckCircle2 className="size-4 shrink-0" />
                  ) : (
                    <AlertCircle className="size-4 shrink-0" />
                  )}
                  <span>{emailStatusMessage.text}</span>
                </div>
              )}

              {/* Quick-Fill from Registered Client */}
              <div className="p-3 bg-muted/30 border border-border/80 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Users className="size-3.5 text-primary" />
                    <span>Select Client / Registered Lead</span>
                  </label>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {leads.length} available
                  </span>
                </div>
                <select
                  value={selectedLeadId}
                  onChange={(e) => {
                    const lId = e.target.value;
                    setSelectedLeadId(lId);
                    const lead = leads.find((l) => l.id === lId);
                    if (lead) {
                      setEmailTo(lead.email || "");
                      setEmailRecipientName(lead.name);
                      setEmailClientCompany(lead.company || "");
                      setEmailSubject(`Contract Agreement & Execution • Scalyx & ${lead.name}`);
                    }
                  }}
                  className="w-full h-9 px-3 bg-background border border-border/80 rounded-xl text-xs text-foreground font-medium focus:outline-none focus:border-primary"
                >
                  <option value="">Choose an existing client to autofill...</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} {l.company ? `— ${l.company}` : ""} ({l.email || "No Email"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Directly Editable Client Details */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-foreground">
                      Client Contact Name
                    </label>
                    <Input
                      value={emailRecipientName}
                      onChange={(e) => setEmailRecipientName(e.target.value)}
                      placeholder="Client contact name"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-foreground">
                      Company Name
                    </label>
                    <Input
                      value={emailClientCompany}
                      onChange={(e) => setEmailClientCompany(e.target.value)}
                      placeholder="Company / Entity name"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-foreground">
                    Recipient Email Address
                  </label>
                  <Input
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="recipient@company.com"
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-foreground">
                    Email Subject Line
                  </label>
                  <Input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Contract Agreement & Execution • Scalyx & Client"
                    className="h-9 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Password Protection Card */}
              <div className="p-3.5 bg-muted/20 border border-border/80 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Lock className="size-3.5 text-amber-500" />
                    <span>Contract Security Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleGenerateRandomPassword("email")}
                    className="text-[11px] text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    <RefreshCw className="size-2.5" />
                    <span>Randomize</span>
                  </button>
                </div>
                <Input
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  placeholder="Set contract password..."
                  className="h-8 text-xs font-mono font-bold"
                />
                <label className="flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePasswordInEmail}
                    onChange={(e) => setIncludePasswordInEmail(e.target.checked)}
                    className="rounded text-primary focus:ring-primary size-3.5"
                  />
                  <span>Include password callout inside the email message</span>
                </label>
              </div>

              {/* Cover Note Markdown */}
              <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-foreground">
                    Cover Note &amp; Project Overview (Markdown)
                  </label>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Markdown supported
                  </span>
                </div>
                <textarea
                  value={emailCoverNote}
                  onChange={(e) => setEmailCoverNote(e.target.value)}
                  rows={9}
                  className="w-full min-h-[220px] sm:min-h-[260px] p-3.5 bg-muted/20 border border-border/80 rounded-xl text-xs text-foreground font-normal leading-relaxed focus:outline-none focus:border-primary resize-y font-mono flex-1"
                  placeholder="Enter cover note message..."
                />
              </div>
            </div>

            {/* Right Pane: Full-Height Branded Template Live Preview (Spacious & Clean) */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-muted/10">
              <div className="h-10 px-5 bg-card border-b border-border/80 flex items-center justify-between shrink-0 text-xs">
                <span className="font-semibold text-foreground flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Branded Scalyx Transactional Email Preview</span>
                </span>

                <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => setEmailPreviewDevice("desktop")}
                    className={`px-2.5 py-1 text-xs rounded transition-colors flex items-center gap-1.5 ${emailPreviewDevice === "desktop"
                        ? "bg-card text-foreground shadow-2xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                    title="Desktop Preview (600px)"
                  >
                    <Monitor className="size-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailPreviewDevice("mobile")}
                    className={`px-2.5 py-1 text-xs rounded transition-colors flex items-center gap-1.5 ${emailPreviewDevice === "mobile"
                        ? "bg-card text-foreground shadow-2xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                    title="Mobile Preview (375px)"
                  >
                    <Smartphone className="size-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              {/* Preview Canvas */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex items-start justify-center bg-muted/20 scrollbar-thin">
                {isEmailPreviewLoading && !emailPreviewHtml ? (
                  <div className="flex flex-col items-center justify-center py-24 text-muted-foreground text-xs gap-3">
                    <Loader2 className="size-7 animate-spin text-primary" />
                    <span className="font-medium">Compiling branded Scalyx transactional email...</span>
                  </div>
                ) : (
                  <div
                    className={`transition-all duration-300 w-full bg-white shadow-xl border border-border/80 rounded-none overflow-hidden my-auto ${emailPreviewDevice === "mobile"
                        ? "max-w-[375px] border-4 border-slate-800 rounded-2xl shadow-2xl"
                        : "max-w-[600px]"
                      }`}
                  >
                    <iframe
                      srcDoc={emailPreviewHtml}
                      title="Live Scalyx Email Preview"
                      className="w-full h-[620px] border-none block bg-white"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <DialogFooter className="px-6 py-3.5 border-t border-border/70 bg-card gap-2 shrink-0 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground font-mono hidden sm:inline">
              Delivered via Scalyx Resend Infrastructure &bull; TLS Encrypted
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEmailModalOpen(false)}
                className="h-8 text-xs rounded-xl"
                disabled={isSendingEmail}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSendEmail}
                disabled={isSendingEmail || !emailTo}
                className="h-8 px-4 text-xs font-semibold rounded-xl bg-primary text-primary-foreground gap-1.5 shadow-xs"
              >
                {isSendingEmail ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    <span>Send Contract Now</span>
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Saved Contracts & Drafts Modal */}
      <SavedDocumentsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        documentType="contract"
        documents={savedContracts.map((c) => ({
          id: c.id,
          name: c.name,
          title: c.title,
          clientName: c.clientName,
          clientCompany: c.clientCompany,
          dealValue: c.dealValue,
          updatedAt: c.updatedAt,
          createdAt: c.createdAt,
          blocksCount: c.blocks?.length || 0,
        }))}
        currentId={currentDocId}
        onLoad={handleLoadSavedContract}
        onDelete={handleDeleteSavedContract}
        onCreateBlank={handleCreateBlank}
        isLoading={isLoadingSaved}
      />
    </div>
  );
}
