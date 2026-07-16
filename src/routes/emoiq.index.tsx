import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, FileSearch, Sparkles, CalendarClock, MessageCircleQuestion, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/emoiq/")({
  component: EmoIqHome,
});

const tools = [
  { to: "/emoiq/analyze", icon: FileSearch, title: "Analyze PYQs", desc: "Upload past-year papers. AI detects units, topic weightage, yearly trends and the Top 32 most important questions." },
  { to: "/emoiq/predict", icon: Sparkles, title: "Predict Questions", desc: "Get probability-ranked questions from your PYQ analysis." },
  { to: "/emoiq/plan", icon: CalendarClock, title: "Study Plan", desc: "Day-by-day plan based on weak topics and days left. Includes Last-24h crash mode." },
  { to: "/emoiq/quiz", icon: TrendingUp, title: "Diagnostic Quiz", desc: "10-question quiz that finds your weak areas and updates your plan." },
  { to: "/emoiq/doubt", icon: MessageCircleQuestion, title: "AI Doubt Solver", desc: "Ask any syllabus doubt. Get concise, exam-focused answers." },
] as const;

function EmoIqHome() {
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

      <section className="px-4 pb-24">
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
    </>
  );
}
