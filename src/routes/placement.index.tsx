import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Code2, Brain, MessagesSquare, FileText } from "lucide-react";

export const Route = createFileRoute("/placement/")({
  component: PlacementHome,
});

const tools = [
  {
    to: "/placement/coding",
    icon: Code2,
    title: "Coding Practice",
    desc: "Curated DSA + company patterns. Ranked by frequency in Indian tech placements.",
  },
  {
    to: "/placement/aptitude",
    icon: Brain,
    title: "Aptitude Quiz",
    desc: "Quant, logical reasoning & verbal. 10-question sets, AI-generated, exam-style.",
  },
  {
    to: "/placement/interview",
    icon: MessagesSquare,
    title: "Mock Interview",
    desc: "Realistic HR + technical interview simulator. Get feedback after every answer.",
  },
  {
    to: "/placement/resume",
    icon: FileText,
    title: "Resume Analyzer",
    desc: "Upload your resume PDF. AI scores it and gives line-by-line improvements.",
  },
] as const;

function PlacementHome() {
  return (
    <>
      <section className="relative overflow-hidden px-4 pb-16 pt-20">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
            <Briefcase className="h-3 w-3" /> Placement · AI Prep
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[0.9] tracking-tighter md:text-6xl">
            Land the <span className="grad-text">offer</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Coding practice, aptitude, mock interviews, and resume analysis — one AI-powered
            workflow that prepares you for placement season without juggling ten tools.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          {tools.map(({ to, icon: Icon, title, desc }) => (
            <Link key={to} to={to} className="group panel tilt-3d shine p-6">
              <Icon className="h-8 w-8 text-primary" strokeWidth={2} />
              <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              <div className="mt-4 font-mono text-[11px] uppercase tracking-widest text-primary group-hover:underline">
                Open →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
