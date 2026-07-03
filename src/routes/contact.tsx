import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Feedback — EMO Learners" },
      { name: "description", content: "Contact EMO Learners. Send feedback, report issues, or get in touch with the team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name ?? "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !user.email) {
      toast.error("Please sign in to send feedback.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("feedback").insert({
      name: name.trim(),
      email: user.email,
      message: message.trim(),
      user_id: user.id,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Thanks! We read every message.");
    setMessage("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden px-4 py-20">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// Talk to us</span>
            <h1 className="mt-3 font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tighter md:text-6xl">
              Feedback <span className="italic text-primary">moves us.</span>
            </h1>
            <p className="mt-5 text-muted-foreground">
              Spot a bug? Want a new feature? Need notes for a subject we missed? Drop a line — Mohit reads every message.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Mail className="h-4 w-4" /> Use the form — we reply fast.
            </p>
            {!user && (
              <p className="mt-4 text-sm text-muted-foreground">
                Please <Link to="/auth" className="text-primary hover:underline">sign in</Link> to send verified feedback.
              </p>
            )}
          </div>
          <form onSubmit={submit} className="space-y-4 rounded-3xl border border-border bg-surface/40 p-6 backdrop-blur">
            <div>
              <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</label>
              <input
                required
                type="email"
                value={user?.email ?? "Sign in required"}
                readOnly
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Message</label>
              <textarea required rows={6} minLength={5} value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
            </div>
            <button type="submit" disabled={busy || !user} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-brand disabled:opacity-50">
              <Send className="h-4 w-4" /> {busy ? "Sending…" : "Send"}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}
