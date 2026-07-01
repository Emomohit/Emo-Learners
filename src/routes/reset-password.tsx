import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Zap, Lock, Eye, EyeOff } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — EMO Learners" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Supabase sends users here with a recovery token in the URL hash.
    // The client picks it up automatically and fires PASSWORD_RECOVERY.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters.");
    if (password !== confirm) return toast.error("Passwords do not match.");
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. You are now signed in.");
      nav({ to: "/challenge" });
    } catch (err: any) {
      toast.error(err.message ?? "Could not update password");
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
              Set a new password
            </h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {ready
                ? "Choose a strong password (min 8 characters)."
                : "Open this page from the reset link in your email."}
            </p>

            <form onSubmit={submit} className="mt-6 space-y-3">
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  type={show ? "text" : "password"}
                  minLength={8}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-10 py-3 pr-10 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  type={show ? "text" : "password"}
                  minLength={8}
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-10 py-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={busy || !ready}
                className="w-full rounded-xl bg-primary py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-transform hover:scale-[1.01] disabled:opacity-50"
              >
                {busy ? "Updating..." : "Update password"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              Back to <Link to="/auth" className="font-bold text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
