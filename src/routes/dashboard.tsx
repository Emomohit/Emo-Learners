import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { courses } from "@/lib/course-data";
import { useCourseProgresses } from "@/lib/course-progress";
import { summarizeLearning } from "@/lib/learning-progress";
import { useStudentProfile, getPrivateAvatarUrl } from "@/lib/use-profile";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Pencil,
  PlayCircle,
  RefreshCw,
  User,
  FileText,
  Download,
  Sparkles,
  ShieldCheck,
  MessagesSquare,
  ListChecks,
  Flame,
  Bookmark,
  Trophy,
  Zap,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import {
  getCoursesProgress,
  getQuizHistory,
  getQuickStats,
  type CourseProgress,
  type QuizAttempt,
  type QuickStats,
} from "@/lib/dashboard-stats";
import { getStreakData, recordStudyDay, type StreakData } from "@/lib/study-streak";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard | EMO Learners" },
      {
        name: "description",
        content:
          "View your profile, course progress, recent learning, and next lesson in one student dashboard.",
      },
      { property: "og:title", content: "Student Dashboard | EMO Learners" },
      {
        property: "og:description",
        content:
          "Your central overview for profile details, learning progress, recent activity, and courses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const branchLabels: Record<string, string> = {
  CSE: "Computer Science & Engineering",
  "CSE-IT": "Computer Science & Information Technology",
  "CSE-CY": "Computer Science & Cyber Security",
  AIML: "Artificial Intelligence & Machine Learning",
};

type Row = {
  id: string;
  title: string;
  kind: string;
  file_path: string;
  created_at: string;
  subject: { code: string; name: string; branch: string; semester: number } | null;
};

function Dashboard() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const profileQuery = useStudentProfile();
  const progressQuery = useCourseProgresses();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Platform resources state
  const [recent, setRecent] = useState<Row[]>([]);
  const [counts, setCounts] = useState({ notes: 0, pyq: 0, syllabus: 0, important_qs: 0 });

  // Personalized state — hydrated client-side only
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  // Hydrate personalized data client-side (avoids SSR/hydration mismatch)
  useEffect(() => {
    if (typeof window === "undefined" || !user) return;
    setCourseProgress(getCoursesProgress());
    setQuizHistory(getQuizHistory(5));
    setQuickStats(getQuickStats());

    recordStudyDay();
    setStreak(getStreakData());
  }, [user]);

  // Avatar fetching
  useEffect(() => {
    let active = true;
    void getPrivateAvatarUrl(profileQuery.data?.avatar_url ?? null).then((url) => {
      if (active) setAvatarUrl(url);
    });
    return () => {
      active = false;
    };
  }, [profileQuery.data?.avatar_url]);

  // Fetch platform resource counts
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("resources")
        .select("id,title,kind,file_path,created_at,subject:subjects(code,name,branch,semester)")
        .order("created_at", { ascending: false })
        .limit(8);
      setRecent((data as unknown as Row[]) ?? []);

      const kinds: (keyof typeof counts)[] = ["notes", "pyq", "syllabus", "important_qs"];
      const next = { notes: 0, pyq: 0, syllabus: 0, important_qs: 0 };
      await Promise.all(
        kinds.map(async (k) => {
          const { count } = await supabase
            .from("resources")
            .select("*", { count: "exact", head: true })
            .eq("kind", k);
          next[k] = count ?? 0;
        }),
      );
      setCounts(next);
    })();
  }, [user]);

  const download = async (path: string) => {
    const { data, error } = await supabase.storage
      .from("study-materials")
      .createSignedUrl(path, 600);
    if (error || !data?.signedUrl) return toast.error("Couldn't fetch file");
    window.open(data.signedUrl, "_blank", "noopener");
  };

  const summary = useMemo(() => summarizeLearning(progressQuery.data ?? []), [progressQuery.data]);
  const current = summary.activities[0];
  const recommendations = courses
    .filter(
      (course) =>
        !summary.activities.some((item) => item.course.slug === course.slug && item.isComplete),
    )
    .slice(0, 3);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <header className="border-b border-border pb-8">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
            Student dashboard
          </p>
          {profileQuery.isLoading ? (
            <Skeleton className="mt-4 h-14 max-w-xl" />
          ) : (
            <h1 className="mt-3 font-display text-4xl font-bold md:text-6xl">
              Welcome back
              {profileQuery.data?.full_name ? `, ${profileQuery.data.full_name.split(" ")[0]}` : ""}
              .
            </h1>
          )}
          <p className="mt-3 text-muted-foreground">
            Pick up your last chapter, check your progress and keep your profile details up to date.
          </p>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <DashboardPanel
            title="My Profile"
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/profile">
                  <Pencil /> Edit Profile
                </Link>
              </Button>
            }
          >
            {profileQuery.isLoading ? (
              <ProfileSkeleton />
            ) : profileQuery.isError ? (
              <ErrorState
                title="We couldn't load your profile"
                onRetry={() => profileQuery.refetch()}
              />
            ) : profileQuery.data ? (
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={`${profileQuery.data.full_name || "Student"} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-9 w-9 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-2xl font-bold">
                    {profileQuery.data.full_name || "Name not set"}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {profileQuery.data.branch
                      ? (branchLabels[profileQuery.data.branch] ?? profileQuery.data.branch)
                      : "Branch not set"}
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {profileQuery.data.current_semester
                      ? `Semester ${profileQuery.data.current_semester}`
                      : "Semester not set"}{" "}
                    ·{" "}
                    {profileQuery.data.academic_year
                      ? `Academic year ${profileQuery.data.academic_year}`
                      : "Academic year not set"}
                  </p>
                </div>
              </div>
            ) : null}
          </DashboardPanel>

          <DashboardPanel
            title="My Progress"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link to="/progress">
                  Details <ArrowRight />
                </Link>
              </Button>
            }
          >
            {progressQuery.isLoading ? (
              <ProgressSkeleton />
            ) : progressQuery.isError ? (
              <ErrorState
                title="We couldn't load your progress"
                onRetry={() => progressQuery.refetch()}
              />
            ) : (
              <div>
                <div className="flex items-end justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Overall progress</span>
                  <strong className="font-display text-3xl">{summary.overallPercentage}%</strong>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full bg-primary transition-[width] duration-500"
                    style={{ width: `${summary.overallPercentage}%` }}
                  />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <MiniStat value={summary.coursesStarted} label="Started" />
                  <MiniStat value={summary.coursesCompleted} label="Completed" />
                  <MiniStat value={summary.completedChapters} label="Chapters" />
                </div>
              </div>
            )}
          </DashboardPanel>
        </section>

        {progressQuery.isError ? (
          <section className="mt-10">
            <ErrorState
              title="We couldn't load your learning overview"
              onRetry={() => progressQuery.refetch()}
            />
          </section>
        ) : (
          <>
            {/* ──── Continue Learning (Local Storage + Remote) ──── */}
            <section className="mt-10">
              <SectionLabel icon={PlayCircle} label="Continue learning" />

              {/* The remote top chapter display */}
              {progressQuery.isLoading ? (
                <Skeleton className="h-56 mt-4" />
              ) : current ? (
                <div className="mt-4 overflow-hidden rounded-lg border border-border bg-surface/25 md:grid md:grid-cols-[240px_1fr]">
                  <img
                    src={
                      current.course.thumbnailUrl ||
                      `https://img.youtube.com/vi/${current.course.videoId}/hqdefault.jpg`
                    }
                    alt={`${current.course.title} thumbnail`}
                    className="aspect-video h-full w-full object-cover md:aspect-auto"
                  />
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">
                      Chapter {current.chapter.id}
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-bold">{current.course.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {current.chapter.title}
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-background">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${current.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold">{current.percentage}%</span>
                    </div>
                    <Button asChild className="mt-5">
                      <Link
                        to="/courses/$slug"
                        params={{ slug: current.course.slug }}
                        search={{ chapter: current.chapter.id }}
                      >
                        <PlayCircle /> Continue Learning <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : null}

              {/* The local storage course cards */}
              {courseProgress.length > 0 ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {courseProgress.map((cp) => (
                    <CourseCard key={cp.slug} cp={cp} />
                  ))}
                </div>
              ) : (
                !current && (
                  <EmptyState
                    title="You haven't started a course yet"
                    text="Once you open a chapter, it will show up here so you can continue from exactly where you stopped. Pick a language or a DSA course to begin."
                    cta="Explore courses"
                  />
                )
              )}
            </section>

            {/* ──── Personalized Quick Stats ──── */}
            {quickStats && (
              <div className="mt-10">
                <SectionLabel icon={BarChart3} label="Your stats" />
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <PersonalStat
                    icon={GraduationCap}
                    label="Courses started"
                    value={`${quickStats.coursesStarted}/${quickStats.coursesTotal}`}
                  />
                  <PersonalStat
                    icon={ListChecks}
                    label="Quiz Qs answered"
                    value={quickStats.quizQuestionsAttempted}
                  />
                  <PersonalStat
                    icon={Flame}
                    label="Challenge days"
                    value={quickStats.challengeDays}
                  />
                  <PersonalStat
                    icon={Bookmark}
                    label="Bookmarks"
                    value={quickStats.bookmarkCount}
                  />
                </div>
              </div>
            )}

            {/* ──── Study Streak ──── */}
            {streak && (
              <div className="mt-10">
                <SectionLabel icon={Flame} label="Study streak" />
                <div className="mt-4 panel p-5">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <div className="font-display text-5xl font-bold text-primary">
                        {streak.currentStreak}
                      </div>
                      <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Day streak
                      </div>
                    </div>
                    <div className="h-12 w-px bg-border hidden sm:block" />
                    <div>
                      <div className="font-display text-2xl font-bold">{streak.bestStreak}</div>
                      <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Best streak
                      </div>
                    </div>
                    <div className="h-12 w-px bg-border hidden sm:block" />
                    <div className="flex items-center gap-2">
                      {streak.todayDone ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span className="text-sm font-semibold text-primary">Today done ✓</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-semibold text-muted-foreground">
                            Study today to keep the streak!
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ──── Recent Quiz Performance ──── */}
            <div className="mt-10">
              <SectionLabel icon={Trophy} label="Recent quiz performance" />
              {quizHistory.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {quizHistory.map((q, i) => (
                    <div
                      key={`${q.courseSlug}-${q.chapterId}-${i}`}
                      className="flex items-center justify-between gap-3 panel rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                          <ListChecks className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-sm">{q.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {q.score}/{q.total} correct
                          </div>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${
                          q.pct >= 80
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : q.pct >= 50
                              ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-500"
                              : "border-destructive/40 bg-destructive/10 text-destructive"
                        }`}
                      >
                        {q.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface/30 p-5 text-center text-sm text-muted-foreground">
                  No quiz attempts yet. Complete a course quiz to see your performance here.
                  <div className="mt-3">
                    <Link
                      to="/courses"
                      className="inline-flex text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                    >
                      Open courses →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ──── Quick Actions ──── */}
            <div className="mt-10">
              <SectionLabel icon={Sparkles} label="Quick actions" />
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <QuickCard
                  to="/resources"
                  icon={<BookOpen className="h-5 w-5" />}
                  title="Browse Resources"
                  desc="Notes, PYQs & syllabus by branch & sem."
                />
                <QuickCard
                  to="/ai-assistant"
                  icon={<Sparkles className="h-5 w-5" />}
                  title="AI Study Assistant"
                  desc="Ask doubts. Get clean answers."
                />
                <QuickCard
                  to="/contact"
                  icon={<MessagesSquare className="h-5 w-5" />}
                  title="Feedback"
                  desc="Tell us what to build next."
                />
                {isAdmin && (
                  <QuickCard
                    to="/admin"
                    icon={<ShieldCheck className="h-5 w-5" />}
                    title="Admin Panel"
                    desc="Upload PDFs · view feedback."
                    accent
                  />
                )}
              </div>
            </div>

            {/* ──── Recently Learned (Remote) ──── */}
            <section className="mt-10">
              <SectionHeading title="Recently Learned" />
              {progressQuery.isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
              ) : summary.activities.length ? (
                <div className="divide-y divide-border rounded-lg border border-border">
                  {summary.activities.slice(0, 4).map((item) => (
                    <Link
                      key={item.slug}
                      to="/courses/$slug"
                      params={{ slug: item.slug }}
                      search={{ chapter: item.chapter.id }}
                      className="flex min-w-0 items-center justify-between gap-4 p-4 transition-colors hover:bg-surface/50"
                    >
                      <div className="min-w-0">
                        <p className="font-bold">{item.course.title}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          Chapter {item.chapter.id} · {item.chapter.title}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-primary">{item.percentage}%</p>
                        <p className="text-xs text-muted-foreground">
                          {formatActivity(item.progress.lastWatchedAt)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No recent activity yet"
                  text="The chapters you watch and mark as done will be listed here, with the most recent one first."
                  cta="Start learning"
                />
              )}
            </section>

            {/* ──── Recommended Courses (Remote) ──── */}
            <section className="mt-10 pb-12">
              <SectionHeading title="Recommended Courses" />
              <div className="grid gap-4 md:grid-cols-3">
                {recommendations.map((course) => (
                  <Link
                    key={course.slug}
                    to="/courses/$slug"
                    params={{ slug: course.slug }}
                    search={{ chapter: undefined }}
                    className="group overflow-hidden rounded-lg border border-border bg-surface/20 transition-colors hover:border-primary"
                  >
                    <img
                      src={
                        course.thumbnailUrl ||
                        `https://img.youtube.com/vi/${course.videoId}/hqdefault.jpg`
                      }
                      alt={`${course.title} thumbnail`}
                      className="aspect-video w-full object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <p className="font-display text-lg font-bold group-hover:text-primary">
                        {course.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {course.level} · {course.chapters.length} lessons
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* ──── Platform Resources ──── */}
            <div className="mt-10">
              <SectionLabel icon={FileText} label="Platform resources" />
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ResourceStat label="Notes" value={counts.notes} />
                <ResourceStat label="PYQs" value={counts.pyq} />
                <ResourceStat label="Syllabus" value={counts.syllabus} />
                <ResourceStat label="Important Qs" value={counts.important_qs} />
              </div>
            </div>

            {/* ──── Recent Uploads ──── */}
            <div className="mt-12 pb-12">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                // Recent uploads
              </h2>
              <div className="mt-3 space-y-2">
                {recent.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border bg-surface/30 p-8 text-center text-sm text-muted-foreground">
                    No materials uploaded yet. Check back soon.
                  </div>
                )}
                {recent.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-3 panel rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold">{r.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.subject?.code} · {r.subject?.name} · {r.subject?.branch} · Sem{" "}
                          {r.subject?.semester}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => download(r.file_path)}
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-widest btn-grad"
                    >
                      <Download className="h-3.5 w-3.5" /> Open
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

// ──────────────────────── Sub-components ────────────────────────────

function formatActivity(value?: string) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : formatDistanceToNow(date, { addSuffix: true });
}
function SectionHeading({ title }: { title: string }) {
  return <h2 className="mb-4 font-display text-2xl font-bold">{title}</h2>;
}
function DashboardPanel({
  title,
  action,
  children,
}: {
  title: string;
  action: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border p-5 md:p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="border-l-2 border-primary pl-3">
      <p className="font-display text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number | string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-4 font-display text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
function ErrorState({ title, onRetry }: { title: string; onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 p-4">
      <div className="flex items-center gap-2 font-bold">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        {title}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Nothing has been lost. Please check your internet connection and try again.
      </p>
      <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
        <RefreshCw /> Try again
      </Button>
    </div>
  );
}
function EmptyState({ title, text, cta }: { title: string; text: string; cta: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center">
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      <Button asChild variant="outline" className="mt-4">
        <Link to="/courses">
          {cta} <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}
function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface ${className}`} />;
}
function ProfileSkeleton() {
  return (
    <div className="flex gap-5">
      <Skeleton className="h-24 w-24 rounded-full" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
function ProgressSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

function SectionLabel({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </h2>
    </div>
  );
}

function CourseCard({ cp }: { cp: CourseProgress }) {
  const href = cp.isChallenge ? "/challenge" : `/courses/${cp.slug}`;
  return (
    <Link
      to={href}
      className="group panel rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-primary/60"
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{cp.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-lg font-bold">{cp.title}</div>
          <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {cp.done}/{cp.total} chapters · {cp.progress}%
          </div>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-background/60">
        <div
          className="h-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${cp.progress}%` }}
        />
      </div>
      <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary opacity-80 transition-opacity group-hover:opacity-100">
        Resume <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function PersonalStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
}) {
  return (
    <div className="panel p-5">
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-3 font-display text-3xl font-bold">{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function ResourceStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="panel p-5 backdrop-blur">
      <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-4xl font-bold text-primary">{value}</div>
    </div>
  );
}

function QuickCard({
  to,
  icon,
  title,
  desc,
  accent,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group rounded-2xl border p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary ${accent ? "border-primary/40 bg-primary/5" : "border-border bg-surface/40"}`}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        <div className="font-display text-lg font-bold">{title}</div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
    </Link>
  );
}
