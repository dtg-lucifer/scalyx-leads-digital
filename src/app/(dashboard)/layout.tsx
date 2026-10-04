import React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppSidebar } from "@/components/layout/AppSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
