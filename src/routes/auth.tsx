import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Zap, Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — EMO Learners" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Read ?next=/path and remember it across the OAuth round-trip.
  const nextPath = (() => {
    if (typeof window === "undefined") return "/challenge";
    const p = new URLSearchParams(window.location.search).get("next");
    if (p && p.startsWith("/") && !p.startsWith("//")) return p;
    return "/challenge";
  })();

  useEffect(() => {
    if (!loading && user) {
      const stored =
        typeof window !== "undefined" ? sessionStorage.getItem("postAuthRedirect") : null;
      const dest = stored && stored.startsWith("/") && !stored.startsWith("//") ? stored : nextPath;
      if (typeof window !== "undefined") sessionStorage.removeItem("postAuthRedirect");
      nav({ to: dest });
    }
  }, [loading, user, nav, nextPath]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        if (password.length < 8) throw new Error("Password must be at least 8 characters.");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${nextPath}`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Account created. Welcome!");
          nav({ to: nextPath });
        } else {
          // Email confirmation required — try auto sign-in
          const { error: siErr } = await supabase.auth.signInWithPassword({ email, password });
          if (siErr) {
            toast.success("Account created. Check your inbox to confirm your email, then sign in.");
            setMode("signin");
          } else {
            toast.success("Account created. Welcome!");
            nav({ to: nextPath });
          }
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        nav({ to: nextPath });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative min-h-[80vh] overflow-hidden px-4 py-20">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-md">
          <div className="panel p-8 backdrop-blur-xl">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 rotate-12 items-center justify-center rounded-lg btn-grad">
                <Zap className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="mt-6 text-center font-display text-3xl font-bold tracking-tighter">
              {mode === "signin" ? "Welcome back" : "Join the squad"}
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {mode === "signin" ? "Login to your study hub" : "Free forever. No spam."}
            </p>

            <div className="mt-6">
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("postAuthRedirect", nextPath);
                    }
                    const host = window.location.hostname;
                    if (host.endsWith("lovable.app") || host === "localhost") {
                      // Managed broker flow — only valid on Lovable-hosted domains.
                      const result = await lovable.auth.signInWithOAuth("google", {
                        redirect_uri: window.location.origin,
                      });
                      if (result.error) throw result.error;
                      if (result.redirected) return;
                      nav({ to: nextPath });
                    } else {
                      // Any other hosting (Vercel, custom domain): raw Supabase OAuth.
                      // Requires Google Client ID/Secret in Cloud → Users → Auth Settings → Google.
                      const { error } = await supabase.auth.signInWithOAuth({
                        provider: "google",
                        options: {
                          redirectTo: `${window.location.origin}/auth`,
                          queryParams: { prompt: "select_account" },
                        },
                      });
                      if (error) throw error;
                      // Browser is navigating to Google; nothing else to do.
                    }
                  } catch (err: any) {
                    toast.error(err?.message ?? "Google sign-in failed");
                  } finally {
                    setBusy(false);
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold transition-colors hover:border-primary disabled:opacity-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4.2h6.6c-.1 1.1-.9 2.8-2.5 3.9l-.1.1 3.6 2.8.2.1c2.3-2.1 3.7-5.3 3.7-8.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.2 0 5.9-1.1 7.8-2.9l-3.7-2.9c-1 .7-2.3 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5l-.1.1-3.7 2.9-.1.1C3.3 21.3 7.3 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.4c-.3-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4l-3.9-3C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4l3.9-3z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.7c2.2 0 3.7.9 4.6 1.7l3.3-3.2C17.9 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.4 6.6l3.9 3c.9-2.9 3.6-4.9 6.7-4.9z"
                  />
                </svg>
                Continue with Google
              </button>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  or
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
            </div>

            <form onSubmit={submit} className="space-y-3">
              {mode === "signup" && (
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    required
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-10 py-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  type="email"
                  placeholder="you@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-10 py-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  minLength={6}
                  placeholder="Password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-10 py-3 pr-10 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {mode === "signin" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!email)
                        return toast.error("Enter your email first, then click Forgot password.");
                      try {
                        const { error } = await supabase.auth.resetPasswordForEmail(email, {
                          redirectTo: `${window.location.origin}/reset-password`,
                        });
                        if (error) throw error;
                        toast.success("Password reset link sent. Check your inbox.");
                      } catch (err: any) {
                        toast.error(err.message ?? "Could not send reset email");
                      }
                    }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl py-3 text-sm font-bold uppercase tracking-widest btn-grad transition-transform hover:scale-[1.01] disabled:opacity-50"
              >
                {busy ? "..." : mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="font-bold text-primary hover:underline"
              >
                {mode === "signin" ? "Create account" : "Sign in"}
              </button>
            </p>
            <p className="mt-3 text-center text-[10px] text-muted-foreground">
              By continuing you agree to our{" "}
              <Link to="/privacy-policy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
