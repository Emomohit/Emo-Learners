import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { QuizBlock } from "@/components/site/QuizBlock";
import { ExerciseBlock } from "@/components/site/ExerciseBlock";
import { getCourse, chapterUrl, courses } from "@/lib/course-data";
import { getChapterExtras } from "@/lib/course-extras";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, GraduationCap,
  PlayCircle, Youtube, BookOpen, Sparkles, ListChecks,
} from "lucide-react";

const SITE = "https://emotion-spark-unlimited.lovable.app";

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
        { property: "og:type", content: "article" },
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
  const hasVideo = course.videoId.length > 0;

  const [done, setDone] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = window.localStorage.getItem(storageKey);
      return new Set(raw ? (JSON.parse(raw) as number[]) : []);
    } catch {
      return new Set();
    }
  });
  const [selectedId, setSelectedId] = useState<number>(1);

  const selectedChapter = useMemo(
    () => course.chapters.find((c) => c.id === selectedId) ?? course.chapters[0],
    [course, selectedId],
  );
  const extras = getChapterExtras(course.slug, selectedChapter.id);

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
  const currentIndex = course.chapters.findIndex((c) => c.id === selectedChapter.id);
  const prevChapter = currentIndex > 0 ? course.chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < course.chapters.length - 1 ? course.chapters[currentIndex + 1] : null;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-14 pb-10 md:pt-20">
        <div className={`absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b ${course.accent} opacity-20 blur-3xl`} />
        <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
        <div className="mx-auto max-w-6xl animate-rise">
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-3.5 w-3.5" /> All courses
          </Link>
          <div className="mt-6 grid gap-6 md:grid-cols-[auto_1fr] md:items-start">
            <div className="text-6xl md:text-7xl">{course.emoji}</div>
            <div className="min-w-0">
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
                <Pill icon={<ListChecks className="h-3 w-3" />}>Notes · Quizzes · Exercises</Pill>
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
              <div className="h-full bg-primary transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {hasVideo && (
                <a
                  href={`https://youtu.be/${course.videoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105 active:scale-95"
                >
                  <Youtube className="h-4 w-4" /> Watch full video
                </a>
              )}
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

      {/* Two-column reading surface */}
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar: chapter list */}
          <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Chapters
            </h3>
            <ol className="mt-4 space-y-1">
              {course.chapters.map((ch) => {
                const isDone = done.has(ch.id);
                const isActive = ch.id === selectedChapter.id;
                return (
                  <li key={ch.id}>
                    <button
                      onClick={() => setSelectedId(ch.id)}
                      className={`group flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${
                        isActive
                          ? "border-primary/60 bg-primary/10 shadow-brand"
                          : "border-transparent hover:border-border hover:bg-surface/40"
                      }`}
                    >
                      <span className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground/40" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground/80">
                          Ch {String(ch.id).padStart(2, "0")}
                        </span>
                        <span
                          className={`mt-0.5 block text-sm font-semibold leading-snug ${
                            isActive ? "text-foreground" : "text-foreground/80"
                          } ${isDone ? "opacity-70" : ""}`}
                        >
                          {ch.title}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>

          {/* Main reading content */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              <span className="text-primary">Chapter {String(selectedChapter.id).padStart(2, "0")}</span>
              <span className="opacity-40">·</span>
              <span>{selectedChapter.topic}</span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
              {selectedChapter.title}
            </h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {hasVideo && (
                <a
                  href={chapterUrl(course.videoId, selectedChapter.t)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <Youtube className="h-3.5 w-3.5" /> Watch chapter
                </a>
              )}
              <button
                onClick={() => toggleDone(selectedChapter.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${
                  done.has(selectedChapter.id)
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border bg-surface text-muted-foreground hover:text-primary"
                }`}
              >
                {done.has(selectedChapter.id) ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                  </>
                ) : (
                  <>
                    <Circle className="h-3.5 w-3.5" /> Mark done
                  </>
                )}
              </button>
            </div>

            {/* Notes */}
            <div className="mt-8 rounded-2xl border border-border bg-surface/40 p-5 md:p-6">
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                Key notes
              </h4>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/90">
                {selectedChapter.notes.map((n, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Snippet */}
            {selectedChapter.snippet && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-background/80">
                <div className="flex items-center justify-between border-b border-border px-4 py-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                    Snippet
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{course.language.toLowerCase()}</span>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-foreground/90">
{selectedChapter.snippet}
                </pre>
              </div>
            )}

            {/* Quiz */}
            {extras?.quiz && (
              <div className="mt-6">
                <QuizBlock
                  courseSlug={course.slug}
                  chapterId={selectedChapter.id}
                  quiz={extras.quiz}
                  onPass={() => {
                    if (!done.has(selectedChapter.id)) toggleDone(selectedChapter.id);
                  }}
                />
              </div>
            )}

            {/* Exercise */}
            {extras?.exercise && (
              <div className="mt-6">
                <ExerciseBlock exercise={extras.exercise} />
              </div>
            )}

            {!extras && (
              <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface/20 p-5 text-center">
                <p className="text-sm text-muted-foreground">
                  More practice for this chapter is on the way. Notes & video are ready.
                </p>
              </div>
            )}

            {/* Prev / next */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between">
              {prevChapter ? (
                <button
                  onClick={() => setSelectedId(prevChapter.id)}
                  className="group inline-flex flex-1 items-center gap-3 rounded-xl border border-border bg-surface/40 p-4 text-left transition-all hover:border-primary/60"
                >
                  <ArrowLeft className="h-4 w-4 text-primary transition-transform group-hover:-translate-x-1" />
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Previous
                    </div>
                    <div className="truncate text-sm font-semibold">{prevChapter.title}</div>
                  </div>
                </button>
              ) : <div className="flex-1" />}
              {nextChapter ? (
                <button
                  onClick={() => setSelectedId(nextChapter.id)}
                  className="group inline-flex flex-1 items-center gap-3 rounded-xl border border-border bg-surface/40 p-4 text-right transition-all hover:border-primary/60"
                >
                  <div className="ml-auto min-w-0">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Next
                    </div>
                    <div className="truncate text-sm font-semibold">{nextChapter.title}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </button>
              ) : <div className="flex-1" />}
            </div>
          </div>
        </div>
      </section>

      {/* Other courses */}
      <section className="border-t border-border bg-surface/20 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">Keep learning</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {otherCourses.map((c) => {
              const href = c.slug === "python" ? "/challenge" : `/courses/${c.slug}`;
              return (
                <Link
                  key={c.slug}
                  to={href}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-surface/40 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/60"
                >
                  <div className="text-4xl">{c.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-lg font-extrabold">{c.title.split(" — ")[0]}</div>
                    <div className="truncate text-xs text-muted-foreground">{c.tagline}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
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
