"use client";

import React from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { Globe, ShieldCheck, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AppNavbarProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AppNavbar({ title, description, actions }: AppNavbarProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/90 backdrop-blur-md px-6 flex items-center justify-between rounded-none no-print">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-foreground tracking-tight">{title}</h1>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 border border-border px-2 py-0.5 font-mono rounded-none">
            <Sparkles className="size-2.5 text-primary" /> Scalyx OS
          </span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground hidden md:block">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {actions}

        <div className="hidden lg:flex items-center gap-2 border-l border-border pl-3">
          <a
            href="https://scalyx.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 px-2.5 py-1.5 transition-colors border border-transparent hover:border-border rounded-none"
          >
            <Globe className="size-3.5 text-primary" />
            <span>scalyx.in</span>
            <ExternalLink className="size-2.5" />
          </a>

          <Badge variant="outline" className="text-[11px] gap-1 font-normal text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10 rounded-none">
            <ShieldCheck className="size-3" />
            {user?.role === "super_admin" ? "Super Admin" : "Team Member"}
          </Badge>
        </div>
      </div>
    </header>
  );
}
