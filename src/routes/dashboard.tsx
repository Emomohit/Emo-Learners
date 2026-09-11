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
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, Clock3, GraduationCap, Pencil, PlayCircle, RefreshCw, User } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard | EMO Learners" },
      { name: "description", content: "View your profile, course progress, recent learning, and next lesson in one student dashboard." },
      { property: "og:title", content: "Student Dashboard | EMO Learners" },
      { property: "og:description", content: "Your central overview for profile details, learning progress, recent activity, and courses." },
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

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const profileQuery = useStudentProfile();
  const progressQuery = useCourseProgresses();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    let active = true;
    void getPrivateAvatarUrl(profileQuery.data?.avatar_url ?? null).then((url) => {
      if (active) setAvatarUrl(url);
    });
    return () => { active = false; };
  }, [profileQuery.data?.avatar_url]);

  const summary = useMemo(() => summarizeLearning(progressQuery.data ?? []), [progressQuery.data]);
  const current = summary.activities[0];
  const recommendations = courses.filter((course) => !summary.activities.some((item) => item.course.slug === course.slug && item.isComplete)).slice(0, 3);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <header className="border-b border-border pb-8">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Student dashboard</p>
          {profileQuery.isLoading ? <Skeleton className="mt-4 h-14 max-w-xl" /> : (
            <h1 className="mt-3 font-display text-4xl font-bold md:text-6xl">
              Welcome back{profileQuery.data?.full_name ? `, ${profileQuery.data.full_name.split(" ")[0]}` : ""}.
            </h1>
          )}
          <p className="mt-3 text-muted-foreground">Your profile, next lesson, and real learning progress in one place.</p>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <DashboardPanel title="My Profile" action={<Button asChild variant="outline" size="sm"><Link to="/profile"><Pencil /> Edit Profile</Link></Button>}>
            {profileQuery.isLoading ? <ProfileSkeleton /> : profileQuery.isError ? (
              <ErrorState title="Profile could not load" onRetry={() => profileQuery.refetch()} />
            ) : profileQuery.data ? (
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface">
                  {avatarUrl ? <img src={avatarUrl} alt={`${profileQuery.data.full_name || "Student"} profile`} className="h-full w-full object-cover" /> : <User className="h-9 w-9 text-muted-foreground" />}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-2xl font-bold">{profileQuery.data.full_name || "Name not set"}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{profileQuery.data.branch ? branchLabels[profileQuery.data.branch] ?? profileQuery.data.branch : "Branch not set"}</p>
                  <p className="mt-2 text-sm font-semibold">{profileQuery.data.current_semester ? `Semester ${profileQuery.data.current_semester}` : "Semester not set"} · {profileQuery.data.academic_year ? `Academic year ${profileQuery.data.academic_year}` : "Academic year not set"}</p>
                </div>
              </div>
            ) : null}
          </DashboardPanel>

          <DashboardPanel title="My Progress" action={<Button asChild variant="ghost" size="sm"><Link to="/progress">Details <ArrowRight /></Link></Button>}>
            {progressQuery.isLoading ? <ProgressSkeleton /> : progressQuery.isError ? (
              <ErrorState title="Progress could not load" onRetry={() => progressQuery.refetch()} />
            ) : (
              <div>
                <div className="flex items-end justify-between gap-4"><span className="text-sm text-muted-foreground">Overall progress</span><strong className="font-display text-3xl">{summary.overallPercentage}%</strong></div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface"><div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${summary.overallPercentage}%` }} /></div>
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
            <ErrorState title="Learning overview could not load" onRetry={() => progressQuery.refetch()} />
          </section>
        ) : <>
        <section className="mt-10">
          <SectionHeading title="Continue Learning" />
          {progressQuery.isLoading ? <Skeleton className="h-56" /> : current ? (
            <div className="overflow-hidden rounded-lg border border-border bg-surface/25 md:grid md:grid-cols-[240px_1fr]">
              <img src={current.course.thumbnailUrl || `https://img.youtube.com/vi/${current.course.videoId}/hqdefault.jpg`} alt={`${current.course.title} thumbnail`} className="aspect-video h-full w-full object-cover md:aspect-auto" />
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Chapter {current.chapter.id}</p>
                <h2 className="mt-2 font-display text-2xl font-bold">{current.course.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{current.chapter.title}</p>
                <div className="mt-5 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-background"><div className="h-full bg-primary" style={{ width: `${current.percentage}%` }} /></div><span className="text-sm font-bold">{current.percentage}%</span></div>
                <Button asChild className="mt-5"><Link to="/courses/$slug" params={{ slug: current.course.slug }} search={{ chapter: current.chapter.id }}><PlayCircle /> Continue Learning <ArrowRight /></Link></Button>
              </div>
            </div>
          ) : <EmptyState title="No course started yet" text="Choose a course to begin building your learning progress." cta="Browse courses" />}
        </section>

        <section className="mt-10">
          <SectionHeading title="My Learning Stats" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat icon={BookOpen} value={summary.coursesStarted} label="Courses started" />
            <Stat icon={GraduationCap} value={summary.coursesCompleted} label="Courses completed" />
            <Stat icon={CheckCircle2} value={summary.completedChapters} label="Chapters completed" />
            <Stat icon={Clock3} value={`${summary.overallPercentage}%`} label="Overall progress" />
          </div>
        </section>

        <section className="mt-10">
          <SectionHeading title="Recently Learned" />
          {progressQuery.isLoading ? <div className="space-y-3"><Skeleton className="h-20" /><Skeleton className="h-20" /></div> : summary.activities.length ? (
            <div className="divide-y divide-border rounded-lg border border-border">
              {summary.activities.slice(0, 4).map((item) => (
                <Link key={item.slug} to="/courses/$slug" params={{ slug: item.slug }} search={{ chapter: item.chapter.id }} className="flex min-w-0 items-center justify-between gap-4 p-4 transition-colors hover:bg-surface/50">
                  <div className="min-w-0"><p className="font-bold">{item.course.title}</p><p className="truncate text-sm text-muted-foreground">Chapter {item.chapter.id} · {item.chapter.title}</p></div>
                  <div className="shrink-0 text-right"><p className="text-sm font-bold text-primary">{item.percentage}%</p><p className="text-xs text-muted-foreground">{formatActivity(item.progress.lastWatchedAt)}</p></div>
                </Link>
              ))}
            </div>
          ) : <EmptyState title="No recent learning" text="Your latest real course activity will appear here." cta="Start learning" />}
        </section>

        <section className="mt-10 pb-12">
          <SectionHeading title="Recommended Courses" />
          <div className="grid gap-4 md:grid-cols-3">
            {recommendations.map((course) => <Link key={course.slug} to="/courses/$slug" params={{ slug: course.slug }} search={{ chapter: undefined }} className="group overflow-hidden rounded-lg border border-border bg-surface/20 transition-colors hover:border-primary"><img src={course.thumbnailUrl || `https://img.youtube.com/vi/${course.videoId}/hqdefault.jpg`} alt={`${course.title} thumbnail`} className="aspect-video w-full object-cover" loading="lazy" /><div className="p-4"><p className="font-display text-lg font-bold group-hover:text-primary">{course.title}</p><p className="mt-1 text-sm text-muted-foreground">{course.level} · {course.chapters.length} lessons</p></div></Link>)}
          </div>
        </section>
        </>}
      </main>
      <Footer />
    </div>
  );
}

function formatActivity(value?: string) { if (!value) return "Date unavailable"; const date = new Date(value); return Number.isNaN(date.getTime()) ? "Date unavailable" : formatDistanceToNow(date, { addSuffix: true }); }
function SectionHeading({ title }: { title: string }) { return <h2 className="mb-4 font-display text-2xl font-bold">{title}</h2>; }
function DashboardPanel({ title, action, children }: { title: string; action: React.ReactNode; children: React.ReactNode }) { return <section className="rounded-lg border border-border p-5 md:p-6"><div className="mb-6 flex items-center justify-between gap-3"><h2 className="font-display text-xl font-bold">{title}</h2>{action}</div>{children}</section>; }
function MiniStat({ value, label }: { value: number; label: string }) { return <div className="border-l-2 border-primary pl-3"><p className="font-display text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>; }
function Stat({ icon: Icon, value, label }: { icon: React.ComponentType<{ className?: string }>; value: number | string; label: string }) { return <div className="rounded-lg border border-border p-4"><Icon className="h-5 w-5 text-primary" /><p className="mt-4 font-display text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>; }
function ErrorState({ title, onRetry }: { title: string; onRetry: () => void }) { return <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 p-4"><div className="flex items-center gap-2 font-bold"><AlertTriangle className="h-4 w-4 text-destructive" />{title}</div><p className="mt-1 text-sm text-muted-foreground">Check your connection and try again.</p><Button variant="outline" size="sm" className="mt-3" onClick={onRetry}><RefreshCw /> Retry</Button></div>; }
function EmptyState({ title, text, cta }: { title: string; text: string; cta: string }) { return <div className="rounded-lg border border-dashed border-border p-8 text-center"><p className="font-bold">{title}</p><p className="mt-1 text-sm text-muted-foreground">{text}</p><Button asChild variant="outline" className="mt-4"><Link to="/courses">{cta} <ArrowRight /></Link></Button></div>; }
function Skeleton({ className }: { className: string }) { return <div className={`animate-pulse rounded-lg bg-surface ${className}`} />; }
function ProfileSkeleton() { return <div className="flex gap-5"><Skeleton className="h-24 w-24 rounded-full" /><div className="flex-1 space-y-3"><Skeleton className="h-7 w-1/2" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-2/3" /></div></div>; }
function ProgressSkeleton() { return <div className="space-y-4"><Skeleton className="h-9 w-full" /><Skeleton className="h-2 w-full" /><Skeleton className="h-16 w-full" /></div>; }
