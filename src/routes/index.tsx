import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Flame,
  GraduationCap,
  ListChecks,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";

const SITE = "https://emolearners.vercel.app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EMO Learners — Notes, Courses & AI Exam Prep" },
      { name: "description", content: "Free notes, PYQs, coding courses, practice tests and AI exam tools for Indian engineering students." },
      { name: "keywords", content: "EMO Learners, RGPV notes, engineering PYQs, coding courses, EMoIQ, placement preparation" },
      { property: "og:title", content: "EMO Learners — Your engineering study workspace" },
      { property: "og:description", content: "Study, practise and prepare for placements in one free student workspace." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "EMO Learners",
        url: `${SITE}/`,
        potentialAction: { "@type": "SearchAction", target: `${SITE}/resources?q={search_term_string}`, "query-input": "required name=search_term_string" },
      }),
    }],
  }),
  component: Home,
});

const quickActions = [
  { to: "/resources", icon: FileText, title: "Notes & PYQs", desc: "Find material by branch, semester, and subject.", label: "Study", color: "text-primary", border: "hover:border-primary" },
  { to: "/courses", icon: GraduationCap, title: "Coding courses", desc: "Learn Python, Java, C, and DSA step by step.", label: "Learn", color: "text-purple", border: "hover:border-purple" },
  { to: "/emoiq", icon: Brain, title: "EMoIQ exam AI", desc: "Analyze papers and focus on likely questions.", label: "Analyze", color: "text-pink", border: "hover:border-pink" },
  { to: "/practice", icon: ListChecks, title: "Practice", desc: "Attempt focused quizzes and timed mock tests.", label: "Improve", color: "text-orange", border: "hover:border-orange" },
  { to: "/placement", icon: BriefcaseBusiness, title: "Placement prep", desc: "Coding, aptitude, interviews, and resume review.", label: "Prepare", color: "text-success", border: "hover:border-success" },
  { to: "/roadmap", icon: TrendingUp, title: "AI roadmap", desc: "Turn your goal into a practical weekly plan.", label: "Plan", color: "text-cyan", border: "hover:border-cyan" },
] as const;

const steps = [
  { number: "01", title: "Choose a goal", text: "Pick a subject, coding skill, exam, or placement target." },
  { number: "02", title: "Follow a clear path", text: "Use focused notes, lessons, practice, and AI guidance." },
  { number: "03", title: "See real progress", text: "Track completed work, streaks, bookmarks, and weak areas." },
];

function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function search(event: FormEvent) {
    event.preventDefault();
    const term = query.trim().toLowerCase();
    if (!term) return;
    if (/python|java|c language|programming|dsa|data structure/.test(term)) navigate({ to: "/courses" });
    else if (/quiz|test|mock|practice/.test(term)) navigate({ to: "/practice" });
    else if (/placement|resume|interview|aptitude/.test(term)) navigate({ to: "/placement" });
    else if (/ai|pyq analysis|predict|study plan/.test(term)) navigate({ to: "/emoiq" });
    else navigate({ to: "/resources" });
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Marquee />
      <Navbar />
      <main>
        <section className="border-b border-border px-4 py-14 md:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.25fr_.75fr]">
            <div className="animate-rise min-w-0">
              <div className="inline-flex items-center gap-2 border-l-4 border-yellow pl-3 font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                <Sparkles className="h-4 w-4 text-orange" /> Free for every student
              </div>
              <h1 className="mt-7 max-w-4xl break-words font-display text-[clamp(2rem,10vw,3rem)] font-bold leading-[1.02] sm:text-6xl md:text-7xl">
                Learn smarter. <span className="text-primary">Score better.</span>{" "}
                <span className="text-pink">Build your future.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Your focused workspace for engineering notes, PYQs, coding, exam strategy, and placement preparation.
              </p>
              <form onSubmit={search} role="search" className="mt-9 flex max-w-2xl items-center gap-2 rounded-md border-2 border-foreground bg-background p-2 shadow-[5px_5px_0_var(--border)]">
                <Search className="ml-2 h-5 w-5 text-primary" aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="What do you want to learn?" className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm outline-none" aria-label="Search EMO Learners" />
                <Button type="submit" className="h-11 rounded-md px-5 font-bold">Search</Button>
              </form>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild className="h-11 rounded-md px-5 font-bold"><Link to="/dashboard">Open my dashboard <ArrowRight /></Link></Button>
                <Button asChild variant="outline" className="h-11 rounded-md border-foreground px-5 font-bold"><Link to="/resources">Browse free notes</Link></Button>
              </div>
            </div>

            <aside className="animate-rise border-t-4 border-primary bg-background pt-6 lg:border-l-4 lg:border-t-0 lg:pl-8 lg:pt-0" aria-label="Popular learning paths">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Start here</p>
              <div className="mt-5 space-y-3">
                {[
                  { to: "/challenge", icon: Flame, title: "30-Day Python", meta: "Daily guided lessons", color: "text-orange" },
                  { to: "/emoiq/top32", icon: Brain, title: "Top 32 Questions", meta: "Analyze your PYQs", color: "text-pink" },
                  { to: "/placement", icon: BriefcaseBusiness, title: "Placement Sprint", meta: "Prepare end to end", color: "text-success" },
                ].map(({ to, icon: Icon, title, meta, color }) => (
                  <Link key={to} to={to} className="group flex items-center gap-4 rounded-md border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-foreground hover:shadow-md">
                    <Icon className={`h-6 w-6 ${color}`} />
                    <span className="min-w-0 flex-1"><span className="block font-display font-bold">{title}</span><span className="block text-sm text-muted-foreground">{meta}</span></span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Choose your next move" title="Everything you need, without the clutter." />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickActions.map(({ to, icon: Icon, title, desc, label, color, border }, index) => (
                <Link key={to} to={to} className={`group panel panel-hover flex min-h-56 flex-col p-6 ${border}`}>
                  <div className="flex items-start justify-between"><Icon className={`h-7 w-7 ${color}`} /><span className="font-mono text-xs text-muted-foreground">0{index + 1}</span></div>
                  <h2 className="mt-8 font-display text-2xl font-bold">{title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{desc}</p>
                  <span className={`mt-6 inline-flex items-center gap-2 text-sm font-bold ${color}`}>{label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border px-4 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="A simple system" title="From confused to consistent." />
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="border-l-2 border-border pl-5 first:border-primary nth-[2]:border-orange nth-[3]:border-success">
                  <span className="font-mono text-xs font-bold text-muted-foreground">{step.number}</span>
                  <h2 className="mt-3 text-xl font-bold">{step.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 border-2 border-foreground p-7 shadow-[6px_6px_0_var(--primary)] md:flex-row md:items-center md:p-10">
            <div><span className="font-mono text-xs font-bold uppercase tracking-widest text-success">Built for students</span><h2 className="mt-3 text-3xl font-bold md:text-4xl">Your next focused study session starts here.</h2><p className="mt-3 text-muted-foreground">Create a free account to save progress and continue from any device.</p></div>
            <Button asChild className="h-12 shrink-0 rounded-md px-7 font-bold"><Link to="/auth">Create free account <ArrowRight /></Link></Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="max-w-3xl"><div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-primary"><BookOpen className="h-4 w-4" /> {eyebrow}</div><h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-5xl">{title}</h2></div>;
}