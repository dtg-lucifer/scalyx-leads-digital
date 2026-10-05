import type React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppSidebar } from "@/components/layout/AppSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="h-screen w-screen overflow-hidden flex bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
