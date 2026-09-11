// Course progress helpers — localStorage-based persistence.
// Backward-compatible with existing `emo:course:${slug}:done` keys.

export type CourseProgress = {
  lastChapterId: number;
  lastTimestamp: number; // seconds into the video
  completedChapters: number[];
  lastAccess: number; // Date.now()
  percentage: number;
};

const PROGRESS_PREFIX = "emo:course:";
const PROGRESS_SUFFIX = ":progress";
const DONE_SUFFIX = ":done";

function progressKey(slug: string) {
  return `${PROGRESS_PREFIX}${slug}${PROGRESS_SUFFIX}`;
}

function doneKey(slug: string) {
  return `${PROGRESS_PREFIX}${slug}${DONE_SUFFIX}`;
}

/** Save course progress to localStorage. */
export function saveProgress(
  slug: string,
  data: Partial<CourseProgress> & { totalChapters: number },
) {
  if (typeof window === "undefined") return;
  try {
    const existing = getProgress(slug);
    const completedChapters = data.completedChapters ?? existing?.completedChapters ?? [];
    const percentage = Math.round((completedChapters.length / data.totalChapters) * 100);
    const progress: CourseProgress = {
      lastChapterId: data.lastChapterId ?? existing?.lastChapterId ?? 1,
      lastTimestamp: data.lastTimestamp ?? existing?.lastTimestamp ?? 0,
      completedChapters,
      lastAccess: Date.now(),
      percentage,
    };
    window.localStorage.setItem(progressKey(slug), JSON.stringify(progress));
    // Also sync the legacy :done key for backward compat with progress.tsx
    window.localStorage.setItem(doneKey(slug), JSON.stringify(completedChapters));
  } catch {
    // localStorage full or unavailable
  }
}

/** Read course progress from localStorage. Migrates legacy :done keys. */
export function getProgress(slug: string): CourseProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(progressKey(slug));
    if (raw) return JSON.parse(raw) as CourseProgress;

    // Try migrating from legacy :done key
    const doneRaw = window.localStorage.getItem(doneKey(slug));
    if (doneRaw) {
      const completedChapters = JSON.parse(doneRaw) as number[];
      if (Array.isArray(completedChapters) && completedChapters.length > 0) {
        return {
          lastChapterId: Math.max(...completedChapters),
          lastTimestamp: 0,
          completedChapters,
          lastAccess: Date.now(),
          percentage: 0, // can't compute without totalChapters
        };
      }
    }
  } catch {
    // corrupt data
  }
  return null;
}

/** Get progress for all courses that have saved data. */
export function getAllProgress(): { slug: string; progress: CourseProgress }[] {
  if (typeof window === "undefined") return [];
  const results: { slug: string; progress: CourseProgress }[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key.startsWith(PROGRESS_PREFIX) && key.endsWith(PROGRESS_SUFFIX)) {
        const slug = key.slice(PROGRESS_PREFIX.length, -PROGRESS_SUFFIX.length);
        const progress = getProgress(slug);
        if (progress) results.push({ slug, progress });
      }
    }
  } catch {
    // ignore
  }
  // Sort by most recently accessed
  results.sort((a, b) => b.progress.lastAccess - a.progress.lastAccess);
  return results;
}

/** Clear all progress for a course. */
export function clearProgress(slug: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(progressKey(slug));
    window.localStorage.removeItem(doneKey(slug));
  } catch {}
}

/** Toggle a chapter's completion state and save. */
export function toggleChapterDone(slug: string, chapterId: number, totalChapters: number) {
  const progress = getProgress(slug);
  const completed = new Set(progress?.completedChapters ?? []);
  if (completed.has(chapterId)) {
    completed.delete(chapterId);
  } else {
    completed.add(chapterId);
  }
  saveProgress(slug, {
    ...progress,
    completedChapters: [...completed],
    totalChapters,
  });
  return completed;
}
