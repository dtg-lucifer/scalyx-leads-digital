"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import {
  Users,
  FolderTree,
  PackageCheck,
  Kanban,
  FileSpreadsheet,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  {
    name: "Leads Record",
    href: "/leads",
    icon: Users,
    description: "Excel-like relational lead manager",
  },
  {
    name: "Projects",
    href: "/projects",
    icon: Kanban,
    description: "Active projects & Kanban boards",
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FolderTree,
    description: "Drive organizer & recursive sharing",
  },
  {
    name: "Deliverables",
    href: "/deliverables",
    icon: PackageCheck,
    description: "Deliverables & client collectibles",
  },
  {
    name: "Invoice Generator",
    href: "/invoices",
    icon: FileSpreadsheet,
    description: "Official Scalyx A4 billing tool",
  },
  {
    name: "Email Sender",
    href: "/emails",
    icon: Mail,
    description: "Resend transactional client templates",
  },
  {
    name: "Settings & RBAC",
    href: "/settings",
    icon: Settings,
    description: "Permissions matrix & retention policy",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 border-r border-border bg-card/60 backdrop-blur-md flex flex-col shrink-0 min-h-screen rounded-none no-print">
      {/* Brand Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Link href="/leads" className="flex items-center gap-2.5 group">
          <div className="size-9 rounded-none overflow-hidden shrink-0 border border-border bg-card group-hover:border-primary/50 transition-colors p-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/scalyx_light.png"
              alt="Scalyx"
              className="w-full h-full object-cover rounded-none"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-foreground tracking-tight group-hover:text-primary transition-colors">
                LeadsDigital
              </span>
              <Badge variant="outline" className="text-[10px] px-1 py-0 font-mono text-primary border-primary/20 rounded-none">
                v1.0
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              by <span className="font-semibold text-foreground/80">Scalyx</span>
            </p>
          </div>
        </Link>
        <a
          href="https://scalyx.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary p-1.5 transition-colors"
          title="Visit Scalyx Website"
        >
          <ExternalLink className="size-3.5" />
        </a>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Workspace
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-none text-xs font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <div className="flex-1 truncate">
                <div className="leading-none">{item.name}</div>
              </div>
              {item.href === "/deliverables" && (
                <span className="size-1.5 bg-emerald-500 animate-pulse rounded-none" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Agency Quick Info Card */}
      <div className="p-3">
        <div className="p-3 rounded-none bg-accent/30 border border-border text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-foreground font-semibold">
            <Sparkles className="size-3.5 text-primary" />
            <span>Scalyx Agency</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Single software to manage and organize all of your leads.
          </p>
          <a
            href="https://scalyx.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
          >
            scalyx.in <ExternalLink className="size-2.5" />
          </a>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-border bg-card/80">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="size-8 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-foreground truncate leading-tight">
                {user?.name || "Admin"}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Shield className="size-2.5 text-primary" />
                <span className="capitalize">{user?.role?.replace("_", " ") || "Teammate"}</span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Log Out"
            className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 rounded-none"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
