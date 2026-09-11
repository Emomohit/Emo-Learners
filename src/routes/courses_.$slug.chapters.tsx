import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { getCourse } from "@/lib/course-data";
import { getProgress, loadSyncedCourseProgress } from "@/lib/course-progress";
import { ArrowLeft, CheckCircle2, Circle, Clock, ExternalLink, PlayCircle, Search } from "lucide-react";

export const Route = createFileRoute("/courses_/$slug/chapters")({
  beforeLoad: ({ params }) => {
    if (!getCourse(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const course = getCourse(params.slug);
    const title = course ? `${course.title} — All chapters` : "Chapters — EMO Learners";
    const description = course
      ? `Full chapter list for ${course.title}: ${course.chapters.length} lessons you can open directly, no timestamp guessing.`
      : "Full chapter list with direct lesson links.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: ChapterListPage,
});

function ChapterListPage() {
  const { slug } = Route.useParams();
  const course = getCourse(slug)!;
  const isPlaylist = course.type === "playlist";
  const [done, setDone] = useState<Set<number>>(new Set());
  const [query, setQuery] = useState("");

  useEffect(() => {
    setDone(new Set(getProgress(course.slug).completedChapters));
    void loadSyncedCourseProgress(course.slug)
      .then((synced) => setDone(new Set(synced.completedChapters)))
      .catch((error) => console.error(`Course progress could not be loaded for ${course.slug}`, error));
  }, [course.slug]);

  const chapters = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return course.chapters;
    return course.chapters.filter(
      (c) => c.title.toLowerCase().includes(needle) || (c.topic ?? "").toLowerCase().includes(needle),
    );
  }, [course.chapters, query]);

  const required = course.chapters.filter((c) => !c.unavailable);
  const completed = [...done].filter((id) => required.some((c) => c.id === id)).length;
  const pct = Math.round((completed / Math.max(1, required.length)) * 100);

  const youtubeUrl = (chapter: (typeof course.chapters)[number]) => {
    const videoId = isPlaylist ? chapter.videoId ?? course.videoId : course.videoId;
    const start = Math.max(0, Math.floor(isPlaylist ? 0 : chapter.t ?? 0));
    return isPlaylist && course.playlistId
      ? `https://www.youtube.com/watch?v=${videoId}&list=${course.playlistId}&t=${start}s`
      : `https://www.youtube.com/watch?v=${videoId}&t=${start}s`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Link
          to="/courses/$slug"
          params={{ slug: course.slug }}
          search={{ chapter: undefined }}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to course
        </Link>

        <h1 className="mt-4 font-display text-[clamp(1.6rem,4.5vw,2.5rem)] font-bold leading-tight tracking-tight">
          {course.title} — All chapters
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {course.chapters.length} chapters. Tap any chapter to open it in the course, or jump straight
          to its exact spot on YouTube.
        </p>

        <div className="panel mt-6 p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
            <span className="text-muted-foreground">Your progress</span>
            <span className="text-primary">{pct}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {completed} of {required.length} chapters completed
          </p>
        </div>

        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chapters…"
            className="w-full min-w-0 rounded-full border border-border bg-surface py-2 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>

        {chapters.length === 0 && (
          <p className="mt-6 rounded-2xl border border-dashed border-border bg-surface/40 p-6 text-center text-sm text-muted-foreground">
            No chapter matches that search.
          </p>
        )}

        <ol className="mt-5 space-y-2">
          {chapters.map((chapter) => {
            const isDone = done.has(chapter.id);
            return (
              <li
                key={chapter.id}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-2xl border border-border bg-surface/30 p-3 sm:p-4"
              >
                <span className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/40" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="break-words text-sm font-semibold leading-snug">
                    {chapter.id}. {chapter.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {chapter.duration && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {chapter.duration}
                      </span>
                    )}
                    {chapter.topic && <span className="truncate">{chapter.topic}</span>}
                    {chapter.unavailable && <span className="text-rose-600">Unavailable</span>}
                  </div>
                  {!chapter.unavailable && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        to="/courses/$slug"
                        params={{ slug: course.slug }}
                        search={{ chapter: chapter.id }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary-foreground"
                      >
                        <PlayCircle className="h-3.5 w-3.5" /> Open chapter
                      </Link>
                      <a
                        href={youtubeUrl(chapter)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Watch on YouTube
                      </a>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </main>
      <Footer />
    </div>
  );
}
