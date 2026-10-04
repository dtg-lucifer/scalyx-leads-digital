"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/leads");
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="size-10 border-3 border-muted border-t-primary rounded-full animate-spin mb-3" />
      <p className="text-xs text-muted-foreground font-mono">Loading LeadsDigital...</p>
    </div>
  );
}
