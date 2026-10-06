"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SessionUser, UserPermissions } from "@/types/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: SessionUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPerm: (resource: keyof UserPermissions, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
  hasPerm: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/session", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Immediate protocol upgrade if loaded over insecure HTTP in production
    if (
      typeof window !== "undefined" &&
      window.location.protocol === "http:" &&
      !["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname)
    ) {
      try {
        if (window.top && window.top.location.protocol === "http:") {
          window.top.location.replace(
            window.top.location.href.replace(/^http:/, "https:")
          );
          return;
        }
      } catch {
        // Fallback for restricted cross-origin iframes
      }
      window.location.replace(window.location.href.replace(/^http:/, "https:"));
      return;
    }
    fetchSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Login failed" };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/login");
    } catch {
      setUser(null);
      router.push("/login");
    }
  };

  const hasPerm = (resource: keyof UserPermissions, action: string): boolean => {
    if (!user) return false;
    if (user.role === "super_admin") return true;
    const resPerms = user.permissions[resource];
    if (!resPerms) return false;
    // @ts-expect-error dynamic access
    return Boolean(resPerms[action]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser: fetchSession,
        hasPerm,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
