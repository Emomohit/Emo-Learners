/**
 * Dashboard statistics — reads existing localStorage data to compute
 * personalized student metrics.  All schemas match the actual keys
 * already used by the EMO Learners codebase.
 *
 * Course progress : "emo:course:{slug}:done"           → number[]
 * Course quizzes  : "emo:course:{slug}:quiz:{chapterId}" → SavedState
 * Challenge days  : "emo:challenge:completed-days"      → number[]
 * Bookmarks       : "emo:bookmarks:v1"                  → Bookmark[]
 * Last roadmap    : "emo:last-roadmap"                  → { at, title, ... }
 */

import { courses, type Course } from "@/lib/course-data";
import { getBookmarks } from "@/lib/bookmarks";

// ────────────────────────── Course progress ──────────────────────────

export type CourseProgress = {
  slug: string;
  title: string;
  emoji: string;
  /** Chapter IDs the student marked done. */
  doneIds: number[];
  /** Number of chapters completed. */
  done: number;
  /** Total chapters in the course. */
  total: number;
  /** Rounded percentage 0-100. */
  progress: number;
  /** True if the course uses /challenge instead of /courses/$slug. */
  isChallenge: boolean;
};

/**
 * Return progress for every course the student has started.
 * Only includes courses where at least 1 chapter is completed.
 */
export function getCoursesProgress(): CourseProgress[] {
  if (typeof window === "undefined") return [];

  const result: CourseProgress[] = [];

  for (const course of courses) {
    // Python uses a separate challenge page with different storage
    if (course.slug === "python") {
      const progress = readChallengeProgress(course);
      if (progress) result.push(progress);
      continue;
    }

    const storageKey = `emo:course:${course.slug}:done`;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) continue;
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) continue;
      const doneIds = parsed.filter(
        (v): v is number => typeof v === "number" && Number.isFinite(v),
      );
      if (doneIds.length === 0) continue;
      const total = course.chapters.length;
      result.push({
        slug: course.slug,
        title: course.title.split(" — ")[0],
        emoji: course.emoji,
        doneIds,
        done: doneIds.length,
        total,
        progress: total > 0 ? Math.round((doneIds.length / total) * 100) : 0,
        isChallenge: false,
      });
    } catch {
      // malformed JSON — skip
    }
  }

  return result;
}

/**
 * Read the Python challenge progress from its own storage key.
 */
function readChallengeProgress(course: Course): CourseProgress | null {
  try {
    const raw = localStorage.getItem("emo:challenge:completed-days");
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const doneIds = parsed.filter((v): v is number => typeof v === "number" && Number.isFinite(v));
    if (doneIds.length === 0) return null;
    const total = 30; // 30-day challenge
    return {
      slug: course.slug,
      title: "30-Day Python Challenge",
      emoji: course.emoji,
      doneIds,
      done: doneIds.length,
      total,
      progress: Math.round((doneIds.length / total) * 100),
      isChallenge: true,
    };
  } catch {
    return null;
  }
}

// ──────────────────────────── Quiz history ────────────────────────────

export type QuizAttempt = {
  /** The course this quiz belongs to. */
  courseSlug: string;
  /** Chapter ID within the course. */
  chapterId: number;
  /** Human-readable label, e.g. "Java Ch 03". */
  label: string;
  /** Score achieved. */
  score: number;
  /** Total questions in the quiz. */
  total: number;
  /** Score as a percentage. */
  pct: number;
};

/**
 * Scan localStorage for course quiz results.
 * Returns the most recent N submitted quiz attempts.
 *
 * Key pattern: "emo:course:{slug}:quiz:{chapterId}"
 * Value: { answers: Record<number,number>, submitted: boolean, score: number }
 */
export function getQuizHistory(limit = 5): QuizAttempt[] {
  if (typeof window === "undefined") return [];

  const attempts: QuizAttempt[] = [];
  const prefix = "emo:course:";
  const quizSeg = ":quiz:";

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(prefix) || !key.includes(quizSeg)) continue;

      // Parse key: "emo:course:{slug}:quiz:{chapterId}"
      const afterPrefix = key.slice(prefix.length); // "java:quiz:3"
      const segIdx = afterPrefix.indexOf(quizSeg.slice(1)); // find ":quiz:"
      if (segIdx < 0) continue;
      const courseSlug = afterPrefix.slice(0, segIdx);
      const chapterStr = afterPrefix.slice(segIdx + quizSeg.length - 1);
      const chapterId = parseInt(chapterStr, 10);
      if (!Number.isFinite(chapterId)) continue;

      try {
        const val = localStorage.getItem(key);
        if (!val) continue;
        const state: unknown = JSON.parse(val);
        if (
          typeof state !== "object" ||
          state === null ||
          !("submitted" in state) ||
          !("score" in state)
        )
          continue;
        const s = state as { submitted: boolean; score: number; answers?: Record<string, number> };
        if (!s.submitted) continue;

        const total = s.answers ? Object.keys(s.answers).length : 0;

        // Find a friendly course name
        const course = courses.find((c) => c.slug === courseSlug);
        const courseName = course
          ? course.title.split(" — ")[0]
          : courseSlug.charAt(0).toUpperCase() + courseSlug.slice(1);

        attempts.push({
          courseSlug,
          chapterId,
          label: `${courseName} Ch ${String(chapterId).padStart(2, "0")}`,
          score: typeof s.score === "number" ? s.score : 0,
          total: total > 0 ? total : s.score, // fallback if answers is missing
          pct: total > 0 ? Math.round((s.score / total) * 100) : 100,
        });
      } catch {
        // malformed value — skip
      }
    }
  } catch {
    // localStorage unavailable or corrupt
  }

  // Sort by chapter ID descending (most recently numbered first) and limit
  return attempts
    .sort((a, b) => {
      if (a.courseSlug !== b.courseSlug) return a.courseSlug.localeCompare(b.courseSlug);
      return b.chapterId - a.chapterId;
    })
    .slice(0, limit);
}

// ──────────────────────── Aggregate quick stats ──────────────────────

export type QuickStats = {
  /** Number of courses the student has started. */
  coursesStarted: number;
  /** Total number of courses available. */
  coursesTotal: number;
  /** Total quiz questions the student has answered (across all course quizzes). */
  quizQuestionsAttempted: number;
  /** Number of challenge days completed (0-30). */
  challengeDays: number;
  /** Number of saved bookmarks. */
  bookmarkCount: number;
};

export function getQuickStats(): QuickStats {
  const started = getCoursesProgress();

  // Count quiz questions from all submitted quizzes
  let quizQuestionsAttempted = 0;
  if (typeof window !== "undefined") {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith("emo:course:") || !key.includes(":quiz:")) continue;
        try {
          const val = localStorage.getItem(key);
          if (!val) continue;
          const state = JSON.parse(val) as {
            submitted?: boolean;
            answers?: Record<string, number>;
          };
          if (state.submitted && state.answers) {
            quizQuestionsAttempted += Object.keys(state.answers).length;
          }
        } catch {
          /* skip */
        }
      }
    } catch {
      /* localStorage unavailable */
    }
  }

  // Challenge days
  let challengeDays = 0;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("emo:challenge:completed-days");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) challengeDays = parsed.length;
      }
    } catch {
      /* skip */
    }
  }

  // Bookmarks
  let bookmarkCount = 0;
  try {
    bookmarkCount = getBookmarks().length;
  } catch {
    /* skip */
  }

  return {
    coursesStarted: started.length,
    coursesTotal: courses.length,
    quizQuestionsAttempted,
    challengeDays,
    bookmarkCount,
  };
}
