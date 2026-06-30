import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { getCourse, chapterUrl, courses } from "@/lib/course-data";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, GraduationCap,
  PlayCircle, Youtube, BookOpen, Sparkles,
} from "lucide-react";

const SITE = "https://emo-learners.vercel.app";

export const Route = createFileRoute("/courses/$slug")({
  beforeLoad: ({ params }) => {
    if (!getCourse(params.slug) || params.slug === "python") throw notFound();
  },
  head: ({ params }) => {
    const c = getCourse(params.slug);
    const title = c ? `${c.title} — EMO Learners` : "Course — EMO Learners";
    const desc = c?.description ?? "Free programming course.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: `${SITE}/courses/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `${SITE}/courses/${params.slug}` }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-4xl font-extrabold">Course not found</h1>
        <p className="mt-3 text-muted-foreground">That course doesn't exist yet.</p>
        <Link to="/courses" className="mt-6 inline-block rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
          See all courses
        </Link>
      </div>
      <Footer />
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-4xl font-extrabold">Something broke</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="mt-6 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">Try again</button>
      </div>
      <Footer />
    </div>
  ),
  component: CourseDetail,
});

function CourseDetail() {
  const { slug } = Route.useParams();
  const course = getCourse(slug)!;
  const storageKey = `emo:course:${slug}:done`;

  const [done, setDone] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = window.localStorage.getItem(storageKey);
      return new Set(raw ? (JSON.parse(raw) as number[]) : []);
    } catch {
      return new Set();
    }
  });
  const [open, setOpen] = useState<number | null>(1);

  const toggleDone = (id: number) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  const progress = Math.round((done.size / course.chapters.length) * 100);
  const otherCourses = courses.filter((c) => c.slug !== slug);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-16 pb-12 md:pt-24">
        <div className={`absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b ${course.accent} opacity-20 blur-3xl`} />
        <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
        <div className="mx-auto max-w-5xl animate-rise">
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-3.5 w-3.5" /> All courses
          </Link>
          <div className="mt-6 flex items-start gap-5">
            <div className="text-6xl md:text-7xl">{course.emoji}</div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                <Sparkles className="h-3 w-3" /> Free · Self-paced
              </span>
              <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tighter md:text-6xl">
                {course.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">{course.description}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-widest">
                <Pill icon={<GraduationCap className="h-3 w-3" />}>{course.level}</Pill>
                <Pill icon={<Clock className="h-3 w-3" />}>{course.hours}</Pill>
                <Pill icon={<PlayCircle className="h-3 w-3" />}>{course.instructor}</Pill>
                <Pill icon={<BookOpen className="h-3 w-3" />}>{course.chapters.length} chapters</Pill>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-8 rounded-2xl border border-border bg-surface/40 p-5">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
              <span className="text-muted-foreground">Your progress</span>
              <span className="text-primary">{done.size}/{course.chapters.length} · {progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-background/60">
              <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`https://youtu.be/${course.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105 active:scale-95"
              >
                <Youtube className="h-4 w-4" /> Watch full video
              </a>
              <button
                onClick={() => { setDone(new Set()); try { localStorage.removeItem(storageKey); } catch {} }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
              >
                Reset progress
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">Course chapters</h2>
          <p className="mt-1 text-sm text-muted-foreground">Click any chapter to open notes and watch on YouTube.</p>

          <div className="mt-6 space-y-3">
            {course.chapters.map((ch) => {
              const isDone = done.has(ch.id);
              const isOpen = open === ch.id;
              return (
                <div
                  key={ch.id}
                  className={`overflow-hidden rounded-xl border bg-surface/40 transition-all duration-300 ${
                    isOpen ? "border-primary/60 shadow-brand" : "border-border hover:border-primary/30"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : ch.id)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left"
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleDone(ch.id); }}
                      className="shrink-0 transition-transform hover:scale-110"
                      aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                        Chapter {String(ch.id).padStart(2, "0")}
                      </div>
                      <div className={`mt-0.5 font-display text-lg font-bold tracking-tight ${isDone ? "line-through opacity-60" : ""}`}>
                        {ch.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{ch.topic}</div>
                    </div>
                    <ArrowRight className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-90 text-primary" : ""}`} />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-border px-5 py-5">
                        <div className="grid gap-5 md:grid-cols-[1fr_auto]">
                          <div>
                            <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Key notes</h4>
                            <ul className="mt-3 space-y-2 text-sm text-foreground/90">
                              {ch.notes.map((n, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                                  <span>{n}</span>
                                </li>
                              ))}
                            </ul>
                            {ch.snippet && (
                              <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-background/80 p-4 font-mono text-xs leading-relaxed text-foreground/90">
{ch.snippet}
                              </pre>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 md:w-44">
                            <a
                              href={chapterUrl(course.videoId, ch.t)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
                            >
                              <Youtube className="h-3.5 w-3.5" /> Watch chapter
                            </a>
                            <button
                              onClick={() => toggleDone(ch.id)}
                              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                            >
                              {isDone ? "Undo" : "Mark done"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Other courses */}
      <section className="border-t border-border bg-surface/20 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">Keep learning</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {otherCourses.map((c) => {
              const href = c.slug === "python" ? "/challenge" : `/courses/${c.slug}`;
              return (
                <Link
                  key={c.slug}
                  to={href}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-surface/40 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/60"
                >
                  <div className="text-4xl">{c.emoji}</div>
                  <div className="flex-1">
                    <div className="font-display text-lg font-extrabold">{c.title}</div>
                    <div className="text-xs text-muted-foreground">{c.tagline}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Pill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface/60 px-2.5 py-1 text-muted-foreground">
      {icon} {children}
    </span>
  );
}
