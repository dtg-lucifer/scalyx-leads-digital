"use client";

import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="size-10 border-3 border-muted border-t-primary rounded-full animate-spin mb-3" />
        <p className="text-xs text-muted-foreground font-mono">Verifying authorization...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
