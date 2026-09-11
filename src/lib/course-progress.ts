import { supabase } from "@/integrations/supabase/client";

export type CourseProgress = {
  completedItems: number[];
  completedChapters: number[];
  currentItemId?: number;
  lastChapterId: number;
  totalChapters: number;
  videoId?: string;
  lastTimestamp: number;
  percentage: number;
  lastWatchedAt?: string;
};

const key = (slug: string) => `course-progress:${slug}`;

export function getCourseProgress(slug: string): CourseProgress {
  if (typeof window === "undefined") return { completedItems: [], completedChapters: [], lastChapterId: 1, totalChapters: 0, lastTimestamp: 0, percentage: 0 };
  try {
    const parsed = JSON.parse(localStorage.getItem(key(slug)) || "{}");
    return {
      completedItems: parsed.completedItems || parsed.completedChapters || [],
      completedChapters: parsed.completedItems || parsed.completedChapters || [],
      currentItemId: parsed.currentItemId,
      lastChapterId: parsed.lastChapterId || parsed.currentItemId || 1,
      totalChapters: parsed.totalChapters || 0,
      videoId: parsed.videoId,
      lastTimestamp: Number(parsed.lastTimestamp || 0),
      percentage: Number(parsed.percentage || 0),
      lastWatchedAt: parsed.lastWatchedAt,
    };
  } catch { return { completedItems: [], completedChapters: [], lastChapterId: 1, totalChapters: 0, lastTimestamp: 0, percentage: 0 }; }
}

export function saveCourseProgress(slug: string, value: CourseProgress) {
  if (typeof window !== "undefined") localStorage.setItem(key(slug), JSON.stringify(value));
}

export async function loadSyncedCourseProgress(slug: string): Promise<CourseProgress> {
  const local = getCourseProgress(slug);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return local;
  const { data } = await supabase.from("course_progress").select("*").eq("user_id", user.id).eq("course_slug", slug).maybeSingle();
  if (!data) return local;
  const cloud: CourseProgress = {
    completedItems: data.completed_items || [], completedChapters: data.completed_items || [], currentItemId: data.content_item_id || undefined,
    lastChapterId: data.content_item_id || 1, totalChapters: local.totalChapters,
    videoId: data.video_id || undefined, lastTimestamp: Number(data.last_timestamp), percentage: Number(data.percentage),
    lastWatchedAt: data.last_watched_at,
  };
  const merged = (cloud.lastWatchedAt || "") >= (local.lastWatchedAt || "") ? cloud : local;
  saveCourseProgress(slug, merged);
  return merged;
}

export const getProgress = getCourseProgress;
export function saveProgress(slug: string, patch: Partial<CourseProgress> & { totalChapters: number; completedChapters: number[] }) {
  const old = getCourseProgress(slug);
  const completed = patch.completedChapters;
  const next: CourseProgress = { ...old, ...patch, completedItems: completed, completedChapters: completed, currentItemId: patch.lastChapterId || old.lastChapterId, percentage: Math.round(completed.length / Math.max(1, patch.totalChapters) * 100) };
  void persistCourseProgress(slug, next);
}
export function toggleChapterDone(slug: string, id: number, total: number) {
  const old = getCourseProgress(slug); const set = new Set(old.completedChapters);
  set.has(id) ? set.delete(id) : set.add(id);
  saveProgress(slug, { lastChapterId: id, totalChapters: total, completedChapters: [...set] });
  return set;
}
export function clearProgress(slug: string) { if (typeof window !== "undefined") localStorage.removeItem(key(slug)); }
export function getAllProgress() {
  const result: { slug: string; progress: CourseProgress }[] = [];
  if (typeof window === "undefined") return result;
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k?.startsWith("course-progress:")) { const slug = k.slice(16); result.push({ slug, progress: getCourseProgress(slug) }); } }
  return result;
}

export async function persistCourseProgress(slug: string, progress: CourseProgress) {
  const value = { ...progress, lastWatchedAt: new Date().toISOString() };
  saveCourseProgress(slug, value);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("course_progress").upsert({
    user_id: user.id, course_slug: slug, content_item_id: value.currentItemId || 1, video_id: value.videoId || null,
    last_timestamp: Math.max(0, Math.floor(value.lastTimestamp)), completed_items: value.completedItems,
    percentage: Math.max(0, Math.min(100, Math.round(value.percentage))), last_watched_at: value.lastWatchedAt,
  }, { onConflict: "user_id,course_slug" });
}

export function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600); const m = Math.floor((seconds % 3600) / 60); const s = Math.floor(seconds % 60);
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}