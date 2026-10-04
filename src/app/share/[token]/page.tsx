"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PublicSharedResource, FolderItem, FileItem } from "@/types/document";
import {
  Folder,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Globe,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PublicSharePage() {
  const params = useParams<{ token: string }>();
  const token = params?.token;

  const [resource, setResource] = useState<PublicSharedResource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResource() {
      if (!token) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/share/${token}`);
        const data = await res.json();
        if (data.resource) {
          setResource(data.resource);
        } else {
          setError(data.error || "Shared resource not found or link has expired.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load shared document.");
      } finally {
        setLoading(false);
      }
    }
    loadResource();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="size-10 border-3 border-muted border-t-primary rounded-none animate-spin mb-3" />
        <p className="text-xs text-muted-foreground font-mono">Loading shared files...</p>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/20">
        <div className="max-w-md w-full bg-card border border-border rounded-none p-8 text-center shadow-lg">
          <div className="size-12 rounded-none bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center mx-auto mb-4">
            <Globe className="size-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Link Expired or Inaccessible</h2>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            {error || "This shared link is no longer valid or access has been restricted by the owner."}
          </p>
          <div className="mt-6">
            <a
              href="https://scalyx.in"
              className="text-xs text-primary hover:underline font-semibold"
            >
              Contact Scalyx Support &rarr;
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isFolder = resource.type === "folder";
  const item = resource.item;

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      {/* Top Header */}
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
              <span className="font-bold text-sm text-foreground">Shared via LeadsDigital</span>
              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/20">
                Public Shared Link
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Official client portal by <a href="https://scalyx.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Scalyx Agency</a>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Main Shared Content */}
      <main className="max-w-5xl w-full mx-auto p-6 sm:p-8 flex-1">
        {/* Title Card */}
        <div className="p-6 bg-card border border-border rounded-none shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-none bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
              {isFolder ? <Folder className="size-6" /> : <FileText className="size-6" />}
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                {isFolder ? "Shared Directory" : "Shared Document"}
              </div>
              <h2 className="text-lg font-bold text-foreground">{item.name}</h2>
              <div className="text-xs text-muted-foreground mt-0.5">
                Uploaded {new Date(item.createdAt).toLocaleDateString()} • No login required
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFolder && (item as FileItem).publicUrl && (
              <Button
                type="button"
                size="sm"
                onClick={() => window.open((item as FileItem).publicUrl, "_blank")}
                className="gap-2 font-semibold"
              >
                <Download className="size-4" />
                <span>Download Document</span>
              </Button>
            )}
          </div>
        </div>

        {/* Folder Content Listing */}
        {isFolder && (
          <div className="space-y-6">
            {/* Subfolders */}
            {resource.subfolders && resource.subfolders.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Folders ({resource.subfolders.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {resource.subfolders.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 rounded-none bg-card border border-border flex items-center gap-3"
                    >
                      <Folder className="size-5 text-primary shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold text-xs text-foreground truncate">{sub.name}</div>
                        <div className="text-[10px] text-muted-foreground">Recursive Folder</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Files List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Files ({resource.files?.length || 0})
              </h3>

              {!resource.files || resource.files.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground bg-card border border-dashed border-border rounded-none">
                  This shared folder does not contain files yet.
                </div>
              ) : (
                <div className="bg-card border border-border rounded-none overflow-hidden divide-y divide-border">
                  {resource.files.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-none bg-accent text-foreground flex items-center justify-center shrink-0">
                          <FileText className="size-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-foreground">{file.name}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded {new Date(file.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <a
                        href={`/api/documents/download?id=${file.id}&token=${token}`}
                        download
                        className="inline-flex"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs rounded-none"
                        >
                          <Download className="size-3.5" />
                          <span>Download</span>
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
