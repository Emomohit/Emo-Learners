import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { QuizBlock } from "@/components/site/QuizBlock";
import { ExerciseBlock } from "@/components/site/ExerciseBlock";
import { TeacherCredit } from "@/components/site/TeacherCredit";
import { getCourse, courses } from "@/lib/course-data";
import { getChapterExtras } from "@/lib/course-extras";
import { courseProgressQueryKey, getProgress, saveProgress, resetCourseProgress, loadSyncedCourseProgress } from "@/lib/course-progress";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  PlayCircle,
  Clock,
  BookOpen,
  ListChecks,
  Sparkles,
  Share,
  ExternalLink,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/courses/$slug")({
  validateSearch: (search: Record<string, unknown>) => ({
    chapter: typeof search.chapter === "number" ? search.chapter : Number(search.chapter) || undefined,
  }),
  beforeLoad: ({ params }) => {
    if (!getCourse(params.slug)) throw notFound();
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
      ],
    };
  },
  component: CoursePlayer,
});

function CoursePlayer() {
  const { slug } = Route.useParams();
  const { chapter: requestedChapter } = Route.useSearch();
  const course = getCourse(slug)!;
  const isPlaylist = course.type === "playlist";
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [done, setDone] = useState<Set<number>>(new Set());
  const [selectedId, setSelectedId] = useState<number>(requestedChapter ?? course.chapters[0]?.id ?? 1);
  const [isHydrated, setIsHydrated] = useState(false);
  const [resumeAt, setResumeAt] = useState(0);
  const selectedChapter = useMemo(
    () => course.chapters.find((c) => c.id === selectedId) ?? course.chapters[0],
    [course, selectedId],
  );

  // Load progress on mount
  useEffect(() => {
    const p = getProgress(course.slug);
    if (p) {
      setDone(new Set(p.completedChapters));
      // Resume from last chapter
      const lastCh = course.chapters.find((c) => c.id === p.lastChapterId);
       if (lastCh && !requestedChapter) setSelectedId(lastCh.id);
      setResumeAt(p.lastTimestamp || 0);
    }
    void loadSyncedCourseProgress(course.slug).then((synced) => {
      setDone(new Set(synced.completedChapters));
      const last = course.chapters.find((chapter) => chapter.id === synced.lastChapterId);
       if (last && !requestedChapter) setSelectedId(last.id);
      setResumeAt(requestedChapter && requestedChapter !== synced.lastChapterId ? 0 : synced.lastTimestamp || 0);
    }).catch((error) => {
      console.error(`Course progress could not be loaded for ${course.slug}`, error);
      toast.error("Your saved progress could not be loaded. Please retry.");
    }).finally(() => setIsHydrated(true));
  }, [course.slug, course.chapters, requestedChapter]);

  // Save last chapter on change
  useEffect(() => {
    if (!isHydrated) return;
    void saveProgress(course.slug, {
      lastChapterId: selectedId,
      videoId: isPlaylist ? selectedChapter?.videoId : course.videoId,
      lastTimestamp: selectedId === getProgress(course.slug).lastChapterId ? resumeAt : (isPlaylist ? 0 : selectedChapter?.t ?? 0),
      completedChapters: [...done].filter((id) => course.chapters.some((chapter) => chapter.id === id && !chapter.unavailable)),
      totalChapters: course.chapters.filter((chapter) => !chapter.unavailable).length,
    }).then(() => queryClient.invalidateQueries({ queryKey: courseProgressQueryKey(user?.id) })).catch((error) => {
      console.error(`Course progress could not be saved for ${course.slug}`, error);
      toast.error("Progress could not be saved. Please retry.");
    });
  }, [selectedId, isHydrated, course.slug, course.chapters.length, done, isPlaylist, selectedChapter, course.videoId, resumeAt, queryClient, user?.id]);

  const extras = getChapterExtras(course.slug, selectedChapter?.id ?? 0);

  const handleToggleDone = (id: number) => {
    setDone((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleReset = async () => {
    try {
      setIsHydrated(false);
      await resetCourseProgress(course.slug);
      setDone(new Set());
      setSelectedId(course.chapters[0]?.id ?? 1);
      setResumeAt(0);
      await queryClient.invalidateQueries({ queryKey: courseProgressQueryKey(user?.id) });
      toast.success("Course progress reset.");
    } catch (error) {
      console.error(`Course progress could not be reset for ${course.slug}`, error);
      toast.error("Progress could not be reset. Please retry.");
    } finally {
      setIsHydrated(true);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: course.title,
        text: course.tagline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const requiredChapterIds = new Set(course.chapters.filter((chapter) => !chapter.unavailable).map((chapter) => chapter.id));
  const completedRequired = [...done].filter((id) => requiredChapterIds.has(id)).length;
  const progressPct = Math.round((completedRequired / Math.max(1, requiredChapterIds.size)) * 100);
  const currentIndex = course.chapters.findIndex((c) => c.id === selectedChapter?.id);
  const prevChapter = currentIndex > 0 ? course.chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < course.chapters.length - 1 ? course.chapters[currentIndex + 1] : null;

  // For the player: if playlist, use chapter.videoId, else use course.videoId
  const selectedVideoId = isPlaylist ? selectedChapter?.videoId ?? course.videoId : course.videoId;
  const youtubeStartTime = resumeAt > 0 && selectedChapter?.id === getProgress(course.slug).lastChapterId
    ? resumeAt
    : isPlaylist ? 0 : selectedChapter?.t ?? 0;
  const youtubeUrl = isPlaylist && course.playlistId
    ? `https://www.youtube.com/watch?v=${selectedVideoId}&list=${course.playlistId}&t=${Math.max(0, Math.floor(youtubeStartTime))}s`
    : `https://www.youtube.com/watch?v=${selectedVideoId}&t=${Math.max(0, Math.floor(youtubeStartTime))}s`;
  const thumbnailUrl = `https://img.youtube.com/vi/${selectedVideoId}/hqdefault.jpg`;

  if (!course.chapters.length) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 py-32 text-center">
          <h1 className="font-display text-4xl font-bold">Coming Soon</h1>
          <p className="mt-3 text-muted-foreground">This course is being built.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Main Player Area - Sticking out below navbar */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Player & Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
            <button 
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
            >
              <Share className="h-3.5 w-3.5" /> Share
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <span>{course.category}</span>
              <span className="text-muted-foreground/40">•</span>
              <span>{course.level}</span>
            </div>
            <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
              {course.title}
            </h1>
          </div>

          {/* Exact source link — playback stays on YouTube. */}
          {selectedVideoId && !selectedChapter.unavailable && (
            <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-surface">
              <img src={thumbnailUrl} alt={`${selectedChapter.title} YouTube thumbnail`} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/45 p-6">
                <Button asChild size="lg" className="shadow-lg">
                  <a href={youtubeUrl} target="_blank" rel="noreferrer" aria-label={`Watch ${selectedChapter.title} on YouTube at the saved timestamp`}>
                    <Youtube className="h-5 w-5" /> Watch on YouTube <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          )}
          {selectedChapter.unavailable && <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">This playlist entry is unavailable. No replacement has been used.</div>}

          {/* Player Controls & Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface/30 p-4 rounded-2xl border border-border">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Chapter {String(selectedChapter.id).padStart(2, "0")}
              </p>
              <h2 className="text-lg md:text-xl font-bold truncate">
                {selectedChapter.title}
              </h2>
            </div>
            
            <div className="flex shrink-0 items-center gap-2">
              {!selectedChapter.unavailable && (
                <Button
                  onClick={() => handleToggleDone(selectedChapter.id)}
                  variant={done.has(selectedChapter.id) ? "default" : "outline"}
                >
                  {done.has(selectedChapter.id) ? <><CheckCircle2 /> Done</> : <><Circle /> Mark done</>}
                </Button>
              )}
            </div>
          </div>

          {/* Prev/Next Navigation */}
          <div className="grid grid-cols-2 gap-4">
            {prevChapter ? (
              <button
                onClick={() => setSelectedId(prevChapter.id)}
                className="group flex flex-col items-start gap-1 p-4 rounded-2xl border border-border bg-surface/20 transition-colors hover:bg-surface/60 hover:border-primary/30"
              >
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> Previous
                </span>
                <span className="text-sm font-semibold truncate w-full text-left">{prevChapter.title}</span>
              </button>
            ) : <div />}
            
            {nextChapter ? (
              <button
                onClick={() => setSelectedId(nextChapter.id)}
                className="group flex flex-col items-end gap-1 p-4 rounded-2xl border border-border bg-surface/20 transition-colors hover:bg-surface/60 hover:border-primary/30"
              >
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Next <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-sm font-semibold truncate w-full text-right">{nextChapter.title}</span>
              </button>
            ) : <div />}
          </div>

          {/* Content Tabs (Notes, Quiz, Exercises) */}
          <div className="flex flex-col gap-8 pb-20">
            {selectedChapter.notes?.length > 0 && (
              <div className="panel p-5 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h3 className="font-display text-lg font-bold">Chapter Notes</h3>
                </div>
                <ul className="space-y-3 text-sm leading-relaxed text-foreground/90">
                  {selectedChapter.notes.map((n, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedChapter.snippet && (
              <div className="overflow-hidden rounded-2xl border border-border bg-background/80">
                <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface/30">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                    Snippet
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {course.language.toLowerCase()}
                  </span>
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed text-foreground/90">
                  {selectedChapter.snippet}
                </pre>
              </div>
            )}

            {extras?.quiz && (
              <QuizBlock
                courseSlug={course.slug}
                chapterId={selectedChapter.id}
                quiz={extras.quiz}
                onPass={() => {
                  if (!done.has(selectedChapter.id)) handleToggleDone(selectedChapter.id);
                }}
              />
            )}

            {extras?.exercise && (
              <ExerciseBlock exercise={extras.exercise} />
            )}
          </div>
        </div>

        {/* Right Column: Sidebar (Chapters) */}
        <aside className="lg:w-[380px] shrink-0 flex flex-col gap-6">
          {/* Progress Widget */}
          <div className="panel p-5">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-3">
              <span className="text-muted-foreground">Course Progress</span>
              <span className="text-primary">{progressPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full bg-primary transition-all duration-700 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {done.size} of {course.chapters.length} chapters completed
            </p>
          </div>

          <TeacherCredit
            teacher={course.teacher}
            channel={course.channel}
            channelUrl={course.channelUrl}
            sourceUrl={isPlaylist ? `https://youtube.com/playlist?list=${course.playlistId}` : `https://youtu.be/${course.videoId}`}
            teacherProfileUrl={course.teacherProfileUrl}
            teacherBio={course.teacherBio}
          />

          {/* Chapters List */}
          <div className="panel flex flex-col overflow-hidden max-h-[600px] lg:max-h-[calc(100vh-12rem)] lg:sticky lg:top-24">
            <div className="p-4 border-b border-border bg-surface/40 flex items-center justify-between">
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">
                Course Content
              </h3>
              <span className="text-xs text-muted-foreground">
                {course.chapters.length} videos
              </span>
            </div>
            <div className="overflow-y-auto p-2 space-y-1">
              {course.chapters.map((ch) => {
                const isDone = done.has(ch.id);
                const isActive = ch.id === selectedChapter?.id;
                return (
                   <button
                     key={ch.id}
                     onClick={() => { setSelectedId(ch.id); setResumeAt(ch.id === getProgress(course.slug).lastChapterId ? getProgress(course.slug).lastTimestamp : 0); }}
                    className={`group w-full flex items-start gap-3 rounded-lg px-3 py-3 text-left transition-all ${
                      isActive
                        ? "bg-primary/10 border border-primary/30"
                        : "border border-transparent hover:bg-surface/50"
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground/60" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-tight mb-1 truncate">
                        {ch.id}. {ch.title}
                      </span>
                      {ch.duration && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono uppercase">
                          <Clock className="h-3 w-3" /> {ch.duration}
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <span className="shrink-0 flex items-center h-full">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
      
      <Footer />
    </div>
  );
}
