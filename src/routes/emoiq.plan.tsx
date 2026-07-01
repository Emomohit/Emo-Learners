import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, CalendarClock, Zap } from "lucide-react";
import { callEmoIq, type PlanResult } from "@/lib/emoiq/api";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/emoiq/plan")({
  component: PlanPage,
});

function PlanPage() {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [weak, setWeak] = useState("");
  const [days, setDays] = useState(7);
  const [mode, setMode] = useState<"normal" | "crash">("normal");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanResult | null>(null);

  async function generate() {
    if (!subject.trim()) { toast.error("Subject required"); return; }
    setLoading(true);
    setPlan(null);
    try {
      const r = await callEmoIq<PlanResult>("plan", {
        subject,
        weakTopics: weak.split(",").map((t) => t.trim()).filter(Boolean),
        daysLeft: mode === "crash" ? 1 : days,
        mode,
      });
      setPlan(r);
      if (user) {
        await supabase.from("study_plans").insert({
          user_id: user.id,
          subject,
          days_left: mode === "crash" ? 1 : days,
          mode,
          plan: r as never,
          active: true,
        });
      }
      toast.success("Plan ready");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tighter md:text-5xl">
        Study <span className="italic text-primary">Plan</span>
      </h1>
      <p className="mt-3 text-muted-foreground">A day-by-day plan tuned to your weak topics and time left. Try Last-24h mode if the exam is tomorrow.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <input className="rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <input className="rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary" placeholder="Weak topics (comma-separated)" value={weak} onChange={(e) => setWeak(e.target.value)} />
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted-foreground">Days left</label>
          <input type="number" min={1} max={60} value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-24 rounded-xl border border-border bg-surface px-3 py-2 text-sm focus:border-primary" disabled={mode === "crash"} />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setMode("normal")} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest ${mode === "normal" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
            <CalendarClock className="h-3 w-3" /> Normal
          </button>
          <button type="button" onClick={() => setMode("crash")} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest ${mode === "crash" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
            <Zap className="h-3 w-3" /> Last 24h
          </button>
        </div>
      </div>

      <button onClick={generate} disabled={loading} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand disabled:opacity-50">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
        {loading ? "Building plan…" : "Build my plan"}
      </button>

      {plan && (
        <div className="mt-10 space-y-6">
          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6">
            <div className="font-display text-xl font-extrabold uppercase">{plan.headline}</div>
            <p className="mt-2 text-sm text-muted-foreground">{plan.strategy}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {plan.days?.map((d) => (
              <div key={d.day} className="rounded-xl border border-border bg-surface/60 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-primary">
                    {mode === "crash" ? `Block ${d.day}` : `Day ${d.day}`}
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{d.hours}h</span>
                </div>
                <div className="mt-1 font-bold">{d.focus}</div>
                <div className="mt-2 text-xs text-muted-foreground">Topics: {d.topics?.join(", ")}</div>
                <ul className="mt-3 list-disc pl-5 text-sm text-foreground/80">
                  {d.tasks?.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            ))}
          </div>
          {plan.skip?.length ? (
            <div className="rounded-xl border border-border bg-surface/40 p-4">
              <div className="font-mono text-[11px] uppercase tracking-widest text-red-400">// Skip for now</div>
              <div className="mt-2 text-sm">{plan.skip.join(" · ")}</div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
