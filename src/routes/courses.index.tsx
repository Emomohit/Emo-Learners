import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { courses } from "@/lib/course-data";
import { ArrowRight, Clock, GraduationCap, PlayCircle, Sparkles } from "lucide-react";

const SITE = "https://emo-learners.vercel.app";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Free Programming Courses — Python, Java, C | EMO Learners" },
      {
        name: "description",
        content:
          "Free programming courses: Python 30-day challenge, complete Java, and C — all built around CodeWithHarry's tutorials.",
      },
      { property: "og:title", content: "Free Programming Courses — EMO Learners" },
      {
        property: "og:description",
        content: "Python, Java, and C — chaptered, free, and built for serious students.",
      },
      { property: "og:url", content: `${SITE}/courses` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/courses` }],
  }),
  component: CoursesIndex,
});

function CoursesIndex() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden px-6 pt-20 pb-16 md:pt-28">
        <div className="absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="absolute inset-0 -z-10 radial-glow" />
        <div className="mx-auto max-w-6xl text-center animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
            <Sparkles className="h-3 w-3" /> Free · Notes · Quizzes · Exercises

          </span>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tighter md:text-7xl">
            Learn a language.
            <br />
            <span className="text-primary">From zero to ship.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Pick a language or the DSA track. Each course ships a structured chapter map, expanded notes, deep-linked videos, auto-graded quizzes, and hands-on exercises. No fluff, no paywall.
          </p>

        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => {
            const href = c.slug === "python" ? "/challenge" : `/courses/${c.slug}`;
            return (
              <Link
                key={c.slug}
                to={href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-surface hover:shadow-brand animate-rise"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${c.accent} opacity-20 blur-3xl transition-opacity group-hover:opacity-40`} />
                <div className="relative">
                  <div className="text-5xl">{c.emoji}</div>
                  <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.tagline}</p>
                  <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2.5 py-1">
                      <GraduationCap className="h-3 w-3" /> {c.level}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2.5 py-1">
                      <Clock className="h-3 w-3" /> {c.hours}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2.5 py-1">
                      <PlayCircle className="h-3 w-3" /> {c.instructor}
                    </span>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-widest text-primary transition-transform group-hover:translate-x-1">
                    {c.slug === "python" ? "Start the challenge" : "Open course"} <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
