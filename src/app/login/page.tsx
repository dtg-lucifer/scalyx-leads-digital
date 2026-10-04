"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { Lock, Mail, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await login(email, password);
      if (res.success) {
        router.push("/leads");
      } else {
        setError(res.error || "Invalid email or password");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-muted/15 relative">
      <div className="w-full max-w-md bg-card border border-border rounded-none shadow-xl p-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="size-16 rounded-none overflow-hidden mb-4 border border-border shadow-xs bg-card p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/scalyx_light.png"
              alt="Scalyx Logo"
              className="w-full h-full object-cover rounded-none"
            />
          </div>

          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">LeadsDigital</h1>
            <Badge variant="outline" className="text-[10px] text-primary border-primary/20 rounded-none">
              Scalyx
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            Single software to manage and organize all of your leads for your freelancing gig.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-none bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2.5">
            <span className="size-1.5 bg-destructive shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="your.email@agency.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 text-sm rounded-none"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11 text-sm font-mono rounded-none"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 gap-2 text-sm font-semibold shadow-xs mt-2 rounded-none"
          >
            {loading ? (
              <>
                <div className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>

        {/* Agency Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <a
            href="https://scalyx.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Sparkles className="size-3 text-primary" />
            <span>Built by Scalyx • scalyx.in</span>
            <ExternalLink className="size-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
