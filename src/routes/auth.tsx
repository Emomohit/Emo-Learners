import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Zap, Mail, Lock, User as UserIcon } from "lucide-react";
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

  useEffect(() => {
    if (!loading && user) nav({ to: "/dashboard" });
  }, [loading, user, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Check your inbox to confirm your email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        nav({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    try {
      const res = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if ((res as any).error) throw (res as any).error;
    } catch (err: any) {
      toast.error(err.message ?? "Google sign-in failed");
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

            <button
              onClick={google}
              disabled={busy}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold transition-all hover:border-primary disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.2 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8c1.8-4.3 6-7 10.6-7 2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.2 29.1 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5 0 9.5-1.7 13.1-4.5l-6.1-5c-1.9 1.3-4.3 2-7 2-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.6 39 16.2 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.5l6.1 5c-.4.4 6.3-4.5 6.3-14.5 0-1.2-.1-2.3-.5-3.5z"/></svg>
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> or email <div className="h-px flex-1 bg-border" />
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
                  type="password"
                  minLength={6}
                  placeholder="Password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-10 py-3 text-sm focus:border-primary focus:outline-none"
                />
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
