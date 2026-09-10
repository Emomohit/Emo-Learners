import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Code2, Brain, MessagesSquare, FileText } from "lucide-react";

export const Route = createFileRoute("/placement/")({
  head: () => ({ meta: [
    { title: "Placement Preparation — EMO Learners" },
    { name: "description", content: "Prepare for placements with coding practice, aptitude, mock interviews and AI resume feedback." },
    { property: "og:title", content: "Placement Preparation — EMO Learners" },
    { property: "og:description", content: "One focused workspace for coding, aptitude, interviews and resume improvement." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
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
      <section className="border-b border-border px-4 pb-16 pt-20">
        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 border-l-4 border-success pl-3 font-mono text-[10px] font-bold uppercase tracking-widest text-success">
            <Briefcase className="h-3 w-3" /> Placement · AI Prep
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[0.9] tracking-tighter md:text-6xl">
            Land the <span className="text-success">offer</span>
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
            <Link key={to} to={to} className="group panel panel-hover p-6">
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
