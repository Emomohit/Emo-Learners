import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, FileSearch, Sparkles, CalendarClock, MessageCircleQuestion, TrendingUp, Flame } from "lucide-react";
import { useMemo, useState } from "react";
import { TOP_QUESTIONS } from "@/lib/emoiq/top-questions";

export const Route = createFileRoute("/emoiq/")({
  component: EmoIqHome,
});

const tools = [
  { to: "/emoiq/analyze", icon: FileSearch, title: "Analyze PYQs", desc: "Paste past-year paper text. AI detects units, topic weightage, and yearly trends." },
  { to: "/emoiq/predict", icon: Sparkles, title: "Predict Questions", desc: "Get 10 probability-ranked questions from your PYQ analysis." },
  { to: "/emoiq/plan", icon: CalendarClock, title: "Study Plan", desc: "Day-by-day plan based on weak topics and days left. Includes Last-24h crash mode." },
  { to: "/emoiq/quiz", icon: TrendingUp, title: "Diagnostic Quiz", desc: "10-question quiz that finds your weak areas and updates your plan." },
  { to: "/emoiq/doubt", icon: MessageCircleQuestion, title: "AI Doubt Solver", desc: "Ask any syllabus doubt. Get concise, exam-focused answers." },
] as const;

function EmoIqHome() {
  const subjects = useMemo(() => ["All", ...Array.from(new Set(TOP_QUESTIONS.map((q) => q.subject)))], []);
  const [filter, setFilter] = useState<string>("All");
  const filtered = useMemo(
    () =>
      (filter === "All" ? TOP_QUESTIONS : TOP_QUESTIONS.filter((q) => q.subject === filter))
        .slice()
        .sort((a, b) => b.probability - a.probability),
    [filter],
  );

  return (
    <>
      <section className="relative overflow-hidden px-4 pb-16 pt-20">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            <Brain className="h-3 w-3" /> New · AI Exam Engine
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tighter md:text-6xl">
            EM<span className="italic text-primary">o</span>IQ
            <span className="ml-3 align-middle font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">smart exam strategy</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Beat the exam, not the syllabus. EMoIQ reads your past-year papers, predicts what's likely to come, and builds a plan you can actually finish.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ to, icon: Icon, title, desc }) => (
            <Link key={to} to={to} className="group rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-brand">
              <Icon className="h-8 w-8 text-primary" strokeWidth={2} />
              <h3 className="mt-4 font-display text-xl font-extrabold uppercase">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              <div className="mt-4 font-mono text-[11px] uppercase tracking-widest text-primary group-hover:underline">Open →</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                <Flame className="h-3 w-3" /> Top 32 · most-repeated
              </div>
              <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tighter md:text-4xl">
                32 Most <span className="italic text-primary">Asked</span> Questions
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Hand-picked repeat questions from core B.Tech CSE / IT / AIML papers. Learn these first — they carry the highest probability of appearing.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    filter === s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface/60 text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <ol className="mt-6 grid gap-3 md:grid-cols-2">
            {filtered.map((q, i) => (
              <li
                key={`${q.subject}-${i}`}
                className="group rounded-2xl border border-border bg-surface/60 p-4 transition-colors hover:border-primary"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 rounded-md bg-primary/10 px-2 py-1 font-mono text-[10px] font-bold text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-medium leading-snug">{q.q}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
                    {q.probability}%
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded-full border border-border px-2 py-0.5 font-mono uppercase tracking-widest">{q.subject}</span>
                  <span className="rounded-full border border-border px-2 py-0.5 font-mono uppercase tracking-widest">{q.unit}</span>
                  <span className="rounded-full border border-border px-2 py-0.5 font-mono uppercase tracking-widest">{q.marks} marks</span>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface/40 p-4 text-sm text-muted-foreground">
            Want questions tuned to <span className="text-foreground">your</span> syllabus? Run{" "}
            <Link to="/emoiq/analyze" className="text-primary underline">Analyze PYQs</Link> then{" "}
            <Link to="/emoiq/predict" className="text-primary underline">Predict Questions</Link>.
          </div>
        </div>
      </section>
    </>
  );
}
