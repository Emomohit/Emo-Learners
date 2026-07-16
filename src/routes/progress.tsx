import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import { getBookmarks } from "@/lib/bookmarks";
import { TrendingUp, BookOpen, ListChecks, Flame, Route as RouteIcon, Bookmark, GraduationCap, RefreshCw, AlertTriangle, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress Analytics — EMO Learners" },
      { name: "description", content: "See what you've learned so far: courses started, quizzes attempted, streak, bookmarks and your latest AI roadmap." },
      { property: "og:title", content: "Progress Analytics — EMO Learners" },
      { property: "og:description", content: "Track your learning progress across courses, quizzes and streaks." },
    ],
  }),
  component: ProgressPage,
});

type Snapshot = {
  courses: { slug: string; done: number }[];
  quizzes: { key: string; attempted: number }[];
  bookmarks: number;
  streakDays: number;
  lastRoadmap: { title?: string; branch?: string; semester?: number; at?: number } | null;
};

function readSnapshot(): Snapshot {
  const courses: { slug: string; done: number }[] = [];
  const quizzes: { key: string; attempted: number }[] = [];
  let streakDays = 0;
  let lastRoadmap: Snapshot["lastRoadmap"] = null;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      const val = localStorage.getItem(key) ?? "";
      if (key.startsWith("course-progress:") || key.startsWith("course:")) {
        try {
          const arr = JSON.parse(val);
          if (Array.isArray(arr)) courses.push({ slug: key.split(":").slice(1).join(":"), done: arr.length });
        } catch {}
      } else if (key.startsWith("quiz:") || key.includes("quiz-answers")) {
        try {
          const arr = JSON.parse(val);
          const attempted = Array.isArray(arr) ? arr.length : Object.keys(arr ?? {}).length;
          if (attempted) quizzes.push({ key: key.replace(/^quiz:/, ""), attempted });
        } catch {}
      } else if (key.includes("challenge") || key === "python30:done") {
        try {
          const arr = JSON.parse(val);
          if (Array.isArray(arr)) streakDays = arr.length;
        } catch {}
      } else if (key === "emo:last-roadmap") {
        try { lastRoadmap = JSON.parse(val); } catch {}
      }
    }
  } catch {}

  const bookmarks = (() => { try { return getBookmarks().length; } catch { return 0; } })();
  return { courses, quizzes, bookmarks, streakDays, lastRoadmap };
}

function ProgressPage() {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    // small delay so skeletons don't flash on fast devices
    setTimeout(() => {
      try {
        setSnap(readSnapshot());
      } catch (e) {
        const msg = (e as Error)?.message ?? "Couldn't load your progress.";
        setError(msg);
        toast.error("We couldn't load your progress. Please retry.");
      } finally {
        setLoading(false);
      }
    }, 250);
  }

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    if (!snap) return null;
    const totalQuiz = snap.quizzes.reduce((a, b) => a + b.attempted, 0);
    const totalCourse = snap.courses.reduce((a, b) => a + b.done, 0);
    return {
      totalQuiz,
      totalCourse,
      streak: snap.streakDays,
      bookmarks: snap.bookmarks,
    };
  }, [snap]);

  const summary = useMemo(() => {
    if (!snap || !stats) return null;
    const activeCourses = snap.courses.length;
    const quizzedTopics = snap.quizzes.length;
    const totalActivity = stats.totalCourse + stats.totalQuiz + stats.streak + stats.bookmarks;
    const level = totalActivity < 5 ? "Just getting started" : totalActivity < 25 ? "Building momentum" : totalActivity < 75 ? "On a roll" : "Power learner";
    return { activeCourses, quizzedTopics, totalActivity, level };
  }, [snap, stats]);

  return (
    <div className="min-h-screen">
      <Marquee />
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-8 pt-16">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
              <TrendingUp className="h-3 w-3" /> Progress Analytics
            </div>
            <button onClick={load} disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest hover:border-primary disabled:opacity-50">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tighter md:text-6xl">
            Your <span className="italic text-primary">learning graph</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            A quick view of what you've completed so far — courses, quizzes, streak days, bookmarks, and your active AI roadmap.
          </p>
        </div>

      </section>

      {error && !loading && (
        <section className="px-4 pb-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                <div>
                  <div className="font-display text-lg font-extrabold uppercase">Couldn't load progress</div>
                  <div className="mt-1 text-sm text-muted-foreground">{error}</div>
                </div>
              </div>
              <button onClick={load}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground">
                <RefreshCw className="h-4 w-4" /> Retry
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="px-4 pb-10">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-32" />)
          ) : (
            <>
              <Stat icon={GraduationCap} label="Course lessons done" value={stats?.totalCourse ?? 0} />
              <Stat icon={ListChecks} label="Quiz answers attempted" value={stats?.totalQuiz ?? 0} />
              <Stat icon={Flame} label="Challenge day streak" value={stats?.streak ?? 0} />
              <Stat icon={Bookmark} label="Saved bookmarks" value={stats?.bookmarks ?? 0} />
            </>
          )}
        </div>
      </section>

      {!loading && summary && (
        <section className="px-4 pb-10">
          <div className="mx-auto max-w-6xl rounded-2xl border border-primary/40 bg-primary/5 p-6">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h3 className="font-display text-xl font-extrabold uppercase tracking-tighter">Summary</h3>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryStat label="Level" value={summary.level} />
              <SummaryStat label="Total activity" value={summary.totalActivity} />
              <SummaryStat label="Active courses" value={summary.activeCourses} />
              <SummaryStat label="Quizzed topics" value={summary.quizzedTopics} />
            </div>
          </div>
        </section>
      )}



      <section className="px-4 pb-24">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <Panel icon={BookOpen} title="Courses progress">
            {snap?.courses.length ? (
              <ul className="space-y-2">
                {snap.courses.map((c) => (
                  <li key={c.slug} className="flex items-center justify-between rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm">
                    <span className="font-mono text-xs uppercase tracking-widest">{c.slug}</span>
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-0.5 font-mono text-[10px] text-primary">{c.done} lessons</span>
                  </li>
                ))}
              </ul>
            ) : <Empty text="No course progress yet. Start a course to see stats." to="/courses" cta="Open courses" />}
          </Panel>

          <Panel icon={RouteIcon} title="Active AI roadmap">
            {snap?.lastRoadmap ? (
              <div className="rounded-xl border border-border bg-surface/50 p-5">
                <div className="font-mono text-[11px] uppercase tracking-widest text-primary">Latest</div>
                <div className="mt-1 font-semibold">{snap.lastRoadmap.title ?? "Roadmap"}</div>
                <div className="mt-1 text-xs text-muted-foreground">{snap.lastRoadmap.branch} · Sem {snap.lastRoadmap.semester}</div>
                <Link to="/roadmap" className="mt-4 inline-flex text-xs font-bold uppercase tracking-widest text-primary hover:underline">Open roadmap →</Link>
              </div>
            ) : <Empty text="No roadmap yet. Generate a personalized weekly plan." to="/roadmap" cta="Generate roadmap" />}
          </Panel>

          <Panel icon={ListChecks} title="Quiz attempts">
            {snap?.quizzes.length ? (
              <ul className="space-y-2">
                {snap.quizzes.slice(0, 8).map((q) => (
                  <li key={q.key} className="flex items-center justify-between rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm">
                    <span className="truncate font-mono text-xs">{q.key}</span>
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-0.5 font-mono text-[10px] text-primary">{q.attempted}</span>
                  </li>
                ))}
              </ul>
            ) : <Empty text="Attempt a quiz to see stats here." to="/practice" cta="Try practice" />}
          </Panel>

          <Panel icon={Flame} title="30-Day Python streak">
            <div className="rounded-xl border border-border bg-surface/50 p-5">
              <div className="font-display text-4xl font-extrabold text-primary">{snap?.streakDays ?? 0}<span className="ml-2 text-base text-muted-foreground">days</span></div>
              <Link to="/challenge" className="mt-4 inline-flex text-xs font-bold uppercase tracking-widest text-primary hover:underline">Continue challenge →</Link>
            </div>
          </Panel>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5">
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-3 font-display text-3xl font-extrabold">{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function Panel({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-display text-xl font-extrabold uppercase tracking-tighter">{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Empty({ text, to, cta }: { text: string; to: string; cta: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface/30 p-5 text-sm text-muted-foreground">
      {text}
      <div className="mt-3"><Link to={to} className="inline-flex text-xs font-bold uppercase tracking-widest text-primary hover:underline">{cta} →</Link></div>
    </div>
  );
}
