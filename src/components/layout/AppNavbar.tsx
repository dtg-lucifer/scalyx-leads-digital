"use client";

import React from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { Badge } from "@/components/ui/badge";

interface AppNavbarProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AppNavbar({ title, description, actions }: AppNavbarProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 min-h-[72px] sm:min-h-20 py-3.5 sm:py-4 px-6 sm:px-8 border-b border-border bg-card/95 backdrop-blur-md flex items-center justify-between gap-6 rounded-none no-print">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground leading-snug">
              {title}
            </h1>
            <Badge
              variant="outline"
              className="hidden md:inline-flex items-center text-[10px] font-mono font-medium tracking-wider px-2 py-0.5 h-5 border-border/80 bg-muted/40 text-muted-foreground uppercase shrink-0"
            >
              System
            </Badge>
          </div>
          {description && (
            <p className="text-xs sm:text-[13px] text-muted-foreground font-normal mt-1 leading-normal max-w-2xl xl:max-w-4xl">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-auto">
        {actions && <div className="flex items-center gap-2.5">{actions}</div>}

        <div className="hidden sm:flex items-center pl-3.5 border-l border-border/80 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/40 border border-border text-xs font-mono font-medium text-foreground rounded-none shadow-2xs">
            <span className="size-2 bg-emerald-500 rounded-full shrink-0 animate-pulse" />
            <span className="text-[11px] font-mono tracking-tight text-muted-foreground font-medium whitespace-nowrap">
              {user?.role === "super_admin" ? "Super Admin" : "Team Member"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
