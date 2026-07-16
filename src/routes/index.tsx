import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import {
  ArrowRight,
  FileText,
  ListChecks,
  GraduationCap,
  Sparkles,
  Users,
  Flame,
  Search,
  ShieldCheck,
  Clock,
  Heart,
  Brain,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EMO Learners — Free Notes, PYQs, Courses & AI Study Help" },
      {
        name: "description",
        content:
          "Free study platform for Indian engineering students: notes, PYQs, coding courses, quizzes, tests & AI tools.",
      },
      {
        name: "keywords",
        content:
          "EMO Learners, EmoLearners, EMO Learners app, EMoIQ, RGPV notes, engineering PYQs, free coding courses, Python course India, DSA course, AI study helper, student learning platform India",
      },
      { name: "application-name", content: "EMO Learners" },
      { name: "apple-mobile-web-app-title", content: "EMO Learners" },
      { property: "og:site_name", content: "EMO Learners" },
      { property: "og:title", content: "EMO Learners — Free Notes, PYQs, Courses & AI Study Help" },
      {
        property: "og:description",
        content:
          "Free notes, PYQs, coding courses, quizzes, tests and AI helpers built for Indian students.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://emolearners.vercel.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "EMO Learners — Free study platform" },
      {
        name: "twitter:description",
        content: "Notes, PYQs, coding courses, quizzes, tests and AI helpers. Free for students.",
      },
    ],
    links: [{ rel: "canonical", href: "https://emolearners.vercel.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "EMO Learners",
          alternateName: ["EmoLearners", "EMO Learners App", "Emo Learners"],
          url: "https://emolearners.vercel.app/",
          logo: "https://emolearners.vercel.app/favicon.ico",
          description:
            "Free study platform for Indian engineering students — notes, PYQs, coding courses, quizzes, tests and AI study tools.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "EMO Learners",
          alternateName: "EmoLearners",
          url: "https://emolearners.vercel.app/",
          potentialAction: {
            "@type": "SearchAction",
            target:
              "https://emolearners.vercel.app/resources?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  component: Home,
});

const quickCards = [
  {
    to: "/resources",
    icon: FileText,
    title: "Notes & PYQs",
    desc: "Subject-wise notes and previous year papers. Filter by branch and semester.",
    tag: "Study",
  },
  {
    to: "/courses",
    icon: GraduationCap,
    title: "Learn coding",
    desc: "Full Python, Java, C, and DSA — with notes, code, quizzes and exercises.",
    tag: "Courses",
  },
  {
    to: "/emoiq",
    icon: Brain,
    title: "EMoIQ — Exam AI",
    desc: "Analyze PYQs, predict likely questions, and get a personalized study plan.",
    tag: "New · AI",
  },
  {
    to: "/practice",
    icon: ListChecks,
    title: "Practice",
    desc: "Short quizzes with instant answers and timed mock tests.",
    tag: "Do",
  },
  {
    to: "/ai-assistant",
    icon: Sparkles,
    title: "AI Helper",
    desc: "Stuck on a topic? Ask the AI helper for a simple explanation.",
    tag: "Ask",
  },
  {
    to: "/challenge",
    icon: Flame,
    title: "30-Day Python",
    desc: "One small step every day. Build a real project in a month.",
    tag: "Habit",
  },
  {
    to: "/join",
    icon: Users,
    title: "Community",
    desc: "Join Telegram, Instagram and YouTube. Learn with other students.",
    tag: "Together",
  },
] as const;

function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim().toLowerCase();
    if (!term) return;
    // Simple router: coding keywords → courses, everything else → resources.
    const codingWords = ["python", "java", "c ", "c language", "c programming", "dsa", "data structure"];
    if (codingWords.some((k) => term.includes(k))) {
      navigate({ to: "/courses" });
    } else if (["quiz", "quizzes"].some((k) => term.includes(k))) {
      navigate({ to: "/practice" });
    } else if (["test", "mock"].some((k) => term.includes(k))) {
      navigate({ to: "/practice" });
    } else {
      navigate({ to: "/resources" });
    }
  };

  return (
    <div className="relative min-h-screen pb-24 lg:pb-0">
      <Marquee />
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-20 pt-14 md:pt-20">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <div className="animate-rise inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
              Free · Made for Indian students
            </span>
          </div>

          <h1
            className="animate-rise mt-8 font-display text-5xl font-extrabold uppercase leading-[0.85] tracking-tighter md:text-7xl lg:text-8xl"
            style={{ animationDelay: "80ms" }}
          >
            <span className="block">One place to</span>
            <span className="relative mt-2 block py-2 italic text-primary">
              study, practice, and grow.
              <span className="absolute -inset-4 -z-10 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
            </span>
          </h1>

          <p
            className="animate-rise mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            Free notes, previous year questions, coding courses, quizzes, timed tests and an
            AI helper — all in simple English, on your phone.
          </p>

          {/* Search */}
          <form
            onSubmit={onSearch}
            role="search"
            aria-label="Search the site"
            className="animate-rise mt-10 flex w-full max-w-xl items-center gap-2 rounded-full border border-border bg-surface/60 p-2 backdrop-blur-sm"
            style={{ animationDelay: "200ms" }}
          >
            <Search className="ml-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search notes, courses, quizzes..."
              className="flex-1 bg-transparent px-2 py-2 text-sm text-foreground focus:outline-none"
              aria-label="Search"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand"
            >
              Go
            </button>
          </form>

          <div
            className="animate-rise mt-8 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-primary hover:text-primary"
            >
              Open notes <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-primary hover:text-primary"
            >
              Start a course
            </Link>
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-primary hover:text-primary"
            >
              Try a quiz
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT DO YOU WANT TO DO TODAY */}
      <section className="relative px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            tag="// Quick start"
            title="What do you want to do today?"
            subtitle="Pick one. You can always come back for the rest."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {quickCards.map((c, i) => (
              <Link
                key={c.to}
                to={c.to}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-7 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold tracking-widest text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-primary">
                    {c.tag}
                  </span>
                </div>
                <span className="mt-6 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/60 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                  <c.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-extrabold uppercase">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                  Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONCEPT PITCH */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeader tag="// The concept" title="Learning + career, unified." subtitle="Engineering students juggle YouTube, PDFs, coaching apps and placement portals. EMO Learners folds it all into one AI-driven workspace." />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { t: "Syllabus-aware learning", d: "Notes, PYQs and roadmaps mapped to RGPV Bhopal AICTE flexible curriculum, branch by branch." },
              { t: "AI that actually helps", d: "Doubt solver, PYQ predictor, quiz generator and mock interviews — one gateway, zero setup." },
              { t: "Placement-ready by design", d: "Coding practice, aptitude, resume analysis and interview prep baked into the same flow." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur-sm">
                <h4 className="font-display text-lg font-extrabold uppercase tracking-tighter">{c.t}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OBJECTIVES */}
      <section className="relative px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <SectionHeader tag="// Objectives" title="What we're building." />
          <ol className="mt-10 grid gap-3 md:grid-cols-2">
            {[
              "Give every Indian engineering student a free, syllabus-aware study hub.",
              "Replace scattered notes/videos/PDFs with one AI-powered workspace.",
              "Turn past-year papers into predictions, plans and quizzes automatically.",
              "Prepare students for placement — DSA, aptitude, HR, resume — end-to-end.",
              "Track real progress: courses, quizzes, streaks and roadmap milestones.",
              "Stay affordable at scale via a SaaS model for colleges and universities.",
            ].map((o, i) => (
              <li key={o} className="flex items-start gap-3 rounded-xl border border-border bg-surface/40 p-4">
                <span className="mt-0.5 font-mono text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm">{o}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* BLOCK DIAGRAM */}
      <section className="relative px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <SectionHeader tag="// Block diagram" title="How the platform flows." />
          <div className="mt-10 rounded-3xl border border-border bg-surface/40 p-6 md:p-10">
            <div className="flex flex-col items-center gap-3">
              <BlockNode>Student</BlockNode>
              <Arrow />
              <BlockNode>Login & Profile</BlockNode>
              <Arrow />
              <BlockNode primary>AI Assessment Engine</BlockNode>
              <Arrow />
              <div className="grid w-full gap-3 md:grid-cols-5">
                {["Learning Roadmap", "Doubt Solver", "PYQ Analysis", "Coding Practice", "Placement Module"].map((n) => (
                  <BlockNode key={n}>{n}</BlockNode>
                ))}
              </div>
              <Arrow />
              <BlockNode>Progress Analytics</BlockNode>
              <Arrow />
              <BlockNode primary>Personalized Recommendations</BlockNode>
            </div>
          </div>
        </div>
      </section>

      {/* MARKET */}
      <section className="relative px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <SectionHeader tag="// Market" title="Why now." />
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              { k: "40M+", v: "Higher-ed students in India" },
              { k: "1.5M+", v: "Engineering graduates every year" },
              { k: "70%+", v: "Struggle with placement readiness" },
              { k: "SaaS", v: "Affordable college-wide deployment" },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-border bg-surface/40 p-6 text-center">
                <div className="font-display text-3xl font-extrabold text-primary md:text-4xl">{s.k}</div>
                <div className="mt-2 text-sm text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY EMO */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-6xl">

          <SectionHeader tag="// Why EMO Learners" title="Built for real students." />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
            {[
              {
                icon: Heart,
                t: "100% free",
                d: "Every note, every quiz, every course — free forever. No paywalls, no ads.",
              },
              {
                icon: Clock,
                t: "Made for your syllabus",
                d: "Notes and PYQs match the RGPV Bhopal curriculum, by branch and semester.",
              },
              {
                icon: ShieldCheck,
                t: "Safe & simple",
                d: "Secure login. Private file storage. Simple English on every page.",
              },
            ].map((c) => (
              <div key={c.t} className="bg-surface/60 p-8 backdrop-blur-sm">
                <c.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h4 className="mt-4 font-display text-xl font-extrabold uppercase">{c.t}</h4>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-surface/40 to-background p-10 text-center backdrop-blur-sm md:p-16">
          <h2 className="font-display text-3xl font-extrabold uppercase italic leading-none tracking-tighter md:text-5xl">
            Ready to start? <br />
            <span className="text-primary">Create a free account.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-muted-foreground">
            Save your progress, bookmark chapters, and pick up right where you left off.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-all hover:scale-105"
            >
              Sign up free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/join"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-6 py-3 text-xs font-bold uppercase tracking-widest text-foreground backdrop-blur-sm transition-all hover:border-primary hover:text-primary"
            >
              Join community
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SectionHeader({ tag, title, subtitle }: { tag: string; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">{tag}</span>
      <h2 className="font-display text-3xl font-extrabold uppercase leading-none tracking-tighter md:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function BlockNode({ children, primary }: { children: React.ReactNode; primary?: boolean }) {
  return (
    <div className={`w-full rounded-xl border px-4 py-3 text-center text-sm font-semibold uppercase tracking-widest ${primary ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface/60 text-foreground"}`}>
      {children}
    </div>
  );
}

function Arrow() {
  return <div className="h-6 w-px bg-border" aria-hidden="true" />;
}
