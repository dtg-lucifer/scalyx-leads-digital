"use client";

import { useAuth } from "@/components/auth/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  FileSpreadsheet,
  FolderTree,
  Kanban,
  LogOut,
  Mail,
  PackageCheck,
  ScrollText,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    name: "Proposal Studio",
    href: "/proposals",
    icon: ScrollText,
    description: "Live Markdown blueprint & quotation builder",
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
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Team accounts & security credentials",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col justify-between shrink-0 h-screen sticky top-0 text-foreground">
      {/* Brand Header */}
      <div className="flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-8 bg-foreground rounded-none flex items-center justify-center text-background font-bold text-lg tracking-wider group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <div className="font-bold text-sm leading-tight text-foreground">
                Scalyx
              </div>
              <div className="text-[10px] text-muted-foreground font-mono leading-tight">
                LEADS DIGITAL
              </div>
            </div>
          </Link>
          <Badge
            variant="outline"
            className="text-[10px] font-mono py-0 h-4 border-border rounded-none"
          >
            v1.2.0
          </Badge>
        </div>

        {/* Navigation Links */}
        <nav className="p-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-none transition-all group ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon
                  className={`size-4 shrink-0 transition-colors ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
                <div className="flex-1 truncate">
                  <div className="truncate">{item.name}</div>
                  <div
                    className={`text-[10px] truncate font-normal ${
                      isActive
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground/80"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer / Portal & Logout */}
      <div className="p-3 border-t border-border bg-muted/20 space-y-2">
        {user ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-2 min-w-0">
                <div className="size-6 bg-primary/10 text-primary border border-primary/20 rounded-none flex items-center justify-center font-bold text-xs uppercase shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="truncate">
                  <div className="font-semibold text-foreground truncate text-xs">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate capitalize">
                    {user.role} Account
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className="text-[9px] uppercase font-mono px-1 py-0 border-emerald-500/30 text-emerald-500 rounded-none"
              >
                Active
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-1 pt-1">
              <Link
                href="/portal/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center text-[11px] h-7 gap-1 border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 font-semibold rounded-none transition-colors"
              >
                <ExternalLink className="size-3" />
                <span>Portal</span>
              </Link>
              <Button
                variant="ghost"
                size="xs"
                onClick={logout}
                className="w-full text-[11px] h-7 gap-1 text-destructive hover:bg-destructive/10 rounded-none"
              >
                <LogOut className="size-3" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-1">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center text-xs h-7 border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 font-semibold rounded-none transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
