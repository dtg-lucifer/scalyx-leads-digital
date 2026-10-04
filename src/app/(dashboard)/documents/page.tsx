"use client";

import React, { useState, useEffect } from "react";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { FolderItem, FileItem, BreadcrumbItem } from "@/types/document";
import { Lead } from "@/types/lead";
import {
  FolderTree,
  Folder,
  FileText,
  Plus,
  Upload,
  Share2,
  Trash2,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Download,
  LayoutGrid,
  List,
  Eye,
  File,
  Lock,
  Globe,
  Sparkles,
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

export default function DocumentsPage() {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: null, name: "Drive Root" },
  ]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);

  // Modals
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState("");

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [shareResource, setShareResource] = useState<{
    type: "folder" | "file";
    item: FolderItem | FileItem;
    shareUrl: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [foldersRes, filesRes, leadsRes] = await Promise.all([
        fetch(`/api/documents/folders?parentId=${currentFolderId || "root"}`),
        fetch(`/api/documents/files?folderId=${currentFolderId || "root"}`),
        fetch("/api/leads"),
      ]);

      const [foldersData, filesData, leadsData] = await Promise.all([
        foldersRes.json(),
        filesRes.json(),
        leadsRes.json(),
      ]);

      if (foldersData.folders) setFolders(foldersData.folders);
      if (filesData.files) setFiles(filesData.files);
      if (leadsData.leads) setLeads(leadsData.leads);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentFolderId]);

  const handleOpenFolder = (folder: FolderItem) => {
    setCurrentFolderId(folder.id);
    setBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleNavigateBreadcrumb = (index: number) => {
    const target = breadcrumbs[index];
    setCurrentFolderId(target.id);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const res = await fetch("/api/documents/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFolderName.trim(),
          parentId: currentFolderId,
          leadId: selectedLeadId || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsFolderModalOpen(false);
        setNewFolderName("");
        setSelectedLeadId("");
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFileObj) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFileObj);
      if (currentFolderId) formData.append("folderId", currentFolderId);
      if (selectedLeadId) formData.append("leadId", selectedLeadId);

      const res = await fetch("/api/documents/files", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setIsFileModalOpen(false);
        setSelectedFileObj(null);
        setSelectedLeadId("");
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Delete this folder and all subfolders & files inside it?")) return;
    try {
      await fetch(`/api/documents/folders?folderId=${folderId}`, { method: "DELETE" });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm("Delete this file?")) return;
    try {
      await fetch(`/api/documents/files?fileId=${fileId}`, { method: "DELETE" });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenShare = async (type: "folder" | "file", item: FolderItem | FileItem) => {
    const endpoint = type === "folder" ? "/api/documents/folders" : "/api/documents/files";
    const body = type === "folder" ? { folderId: item.id, isShared: true } : { fileId: item.id, isShared: true };

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setShareResource({
          type,
          item: data[type],
          shareUrl: data.shareUrl,
        });
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyShareLink = () => {
    if (!shareResource) return;
    navigator.clipboard.writeText(shareResource.shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AppNavbar
        title="Document Organizer"
        description="Google Drive-like organizer with recursive public links and client folder trees."
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFolderModalOpen(true)}
              className="gap-1.5 text-xs h-9"
            >
              <Folder className="size-3.5" />
              <span>New Folder</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => setIsFileModalOpen(true)}
              className="gap-1.5 text-xs h-9 font-semibold"
            >
              <Upload className="size-3.5" />
              <span>Upload File</span>
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Drive Explorer Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-card border border-border rounded-none shadow-xs">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={b.id || "root"}>
                {idx > 0 && <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />}
                <button
                  type="button"
                  onClick={() => handleNavigateBreadcrumb(idx)}
                  className={`px-2 py-1 rounded-none transition-colors whitespace-nowrap ${
                    idx === breadcrumbs.length - 1
                      ? "bg-accent/40 font-bold text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {b.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-muted/40 border border-border rounded-none p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-none text-xs transition-colors ${
                viewMode === "grid" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground"
              }`}
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-none text-xs transition-colors ${
                viewMode === "list" ? "bg-card text-foreground shadow-xs font-semibold" : "text-muted-foreground"
              }`}
            >
              <List className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Folders Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Folder className="size-3.5 text-primary" />
              Folders ({folders.length})
            </h3>
          </div>

          {folders.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-none bg-muted/10">
              No folders inside this directory. Click &quot;New Folder&quot; above to organize your client assets.
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => handleOpenFolder(folder)}
                  className="group p-4 rounded-none bg-card border border-border hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="size-10 rounded-none bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                      <Folder className="size-5" />
                    </div>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenShare("folder", folder)}
                        title="Share Folder Recursively"
                        className="size-7 text-muted-foreground hover:text-foreground"
                      >
                        <Share2 className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteFolder(folder.id)}
                        title="Delete Folder"
                        className="size-7 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                      {folder.name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                      <span>{folder.leadName ? folder.leadName : "General"}</span>
                      {folder.isShared && (
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                          <Globe className="size-2.5" /> Public
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-none overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                    <th className="py-2.5 px-4">Folder Name</th>
                    <th className="py-2.5 px-4">Associated Client</th>
                    <th className="py-2.5 px-4">Sharing</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {folders.map((folder) => (
                    <tr
                      key={folder.id}
                      onClick={() => handleOpenFolder(folder)}
                      className="hover:bg-muted/40 cursor-pointer"
                    >
                      <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-2">
                        <Folder className="size-4 text-primary" />
                        <span>{folder.name}</span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{folder.leadName || "—"}</td>
                      <td className="py-3 px-4">
                        {folder.isShared ? (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-500/20 text-[10px]">
                            Public Link
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">Private</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenShare("folder", folder)}
                          className="size-7 text-muted-foreground hover:text-foreground"
                        >
                          <Share2 className="size-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Files Section */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="size-3.5 text-primary" />
              Files ({files.length})
            </h3>
          </div>

          {files.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-none bg-muted/10">
              No files in this folder. Upload project deliverables, specs, contracts, or media assets.
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="group p-4 rounded-none bg-card border border-border hover:border-primary/50 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="size-10 rounded-none bg-accent text-foreground flex items-center justify-center">
                      <FileText className="size-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenShare("file", file)}
                        title="Share File"
                        className="size-7 text-muted-foreground hover:text-foreground"
                      >
                        <Share2 className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteFile(file.id)}
                        title="Delete File"
                        className="size-7 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs text-foreground truncate" title={file.name}>
                      {file.name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <a
                        href={`/api/documents/download?id=${file.id}`}
                        download
                        title="Download File"
                        className="text-primary hover:underline inline-flex items-center gap-0.5"
                      >
                        <Download className="size-3" />
                        <span className="text-[10px]">Download</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-none overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                    <th className="py-2.5 px-4">File Name</th>
                    <th className="py-2.5 px-4">Size</th>
                    <th className="py-2.5 px-4">Uploaded</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-muted/40">
                      <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-2">
                        <FileText className="size-4 text-primary" />
                        <span className="truncate max-w-sm">{file.name}</span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/api/documents/download?id=${file.id}`}
                            download
                            title="Download File"
                            className="inline-flex items-center justify-center size-7 text-muted-foreground hover:text-foreground"
                          >
                            <Download className="size-3.5" />
                          </a>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenShare("file", file)}
                            title="Share File"
                            className="size-7 text-muted-foreground hover:text-foreground"
                          >
                            <Share2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Folder Modal */}
      <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
        <DialogContent className="w-[94vw] sm:max-w-lg md:max-w-xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Folder className="size-4 text-primary" />
              <span>Create New Folder</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateFolder} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Folder Name <span className="text-destructive">*</span>
              </label>
              <Input
                required
                placeholder="e.g. Design Assets & Prototypes"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Associate with Client Lead (Optional)
              </label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full h-9 px-2 rounded-none bg-transparent border border-input text-xs text-foreground focus:outline-none"
              >
                <option value="" className="bg-card">None (General Folder)</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id} className="bg-card">
                    {l.name} ({l.company || "Independent"})
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsFolderModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="font-semibold">
                Create Folder
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Upload File Modal */}
      <Dialog open={isFileModalOpen} onOpenChange={setIsFileModalOpen}>
        <DialogContent className="w-[94vw] sm:max-w-lg md:max-w-xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Upload className="size-4 text-primary" />
              <span>Upload Document to Drive</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUploadFile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Select File <span className="text-destructive">*</span>
              </label>
              <Input
                required
                type="file"
                onChange={(e) => setSelectedFileObj(e.target.files?.[0] || null)}
                className="text-xs file:bg-primary file:text-primary-foreground file:border-0 file:rounded-none file:px-2 file:py-1 file:text-xs file:mr-2 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Assign to Client Lead (Optional)
              </label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full h-9 px-2 rounded-none bg-transparent border border-input text-xs text-foreground focus:outline-none"
              >
                <option value="" className="bg-card">None (General File)</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id} className="bg-card">
                    {l.name} ({l.company || "Independent"})
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsFileModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isUploading || !selectedFileObj} className="font-semibold">
                {isUploading ? "Uploading..." : "Upload File"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Public Share Link Modal */}
      <Dialog open={Boolean(shareResource)} onOpenChange={(open) => !open && setShareResource(null)}>
        <DialogContent className="w-[94vw] sm:max-w-xl md:max-w-2xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Globe className="size-4 text-primary" />
              <span>Public Share Link Generated</span>
            </DialogTitle>
          </DialogHeader>

          {shareResource && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-none bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                <p className="font-semibold mb-1">
                  Anyone with this link can view and download without signing in.
                </p>
                {shareResource.type === "folder" && (
                  <p className="text-[11px] opacity-90">
                    <strong>Recursive Sharing Active:</strong> All nested subfolders and files inside this folder are automatically accessible recursively.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                  Public Sharable Link
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={shareResource.shareUrl}
                    className="font-mono text-xs h-9 bg-muted/30"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCopyShareLink}
                    className="shrink-0 gap-1 text-xs h-9"
                  >
                    {copiedLink ? <Check className="size-3.5 text-emerald-300" /> : <Copy className="size-3.5" />}
                    <span>{copiedLink ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(shareResource.shareUrl, "_blank")}
                  className="gap-1.5 text-xs"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Open Public View</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShareResource(null)}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
