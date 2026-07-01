import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Zap, Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

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
      const stored = typeof window !== "undefined" ? sessionStorage.getItem("postAuthRedirect") : null;
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
          <div className="rounded-3xl border border-border bg-surface/60 p-8 backdrop-blur-xl shadow-brand">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 rotate-12 items-center justify-center rounded-lg bg-primary shadow-brand">
                <Zap className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="mt-6 text-center font-display text-3xl font-extrabold uppercase italic tracking-tighter">
              {mode === "signin" ? "Welcome back" : "Join the squad"}
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {mode === "signin" ? "Login to your study hub" : "Free forever. No spam."}
            </p>

            <div className="mt-6" />


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
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-primary py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-transform hover:scale-[1.01] disabled:opacity-50"
              >
                {busy ? "..." : mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
              <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-bold text-primary hover:underline">
                {mode === "signin" ? "Create account" : "Sign in"}
              </button>
            </p>
            <p className="mt-3 text-center text-[10px] text-muted-foreground">
              By continuing you agree to our <Link to="/privacy-policy" className="underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
