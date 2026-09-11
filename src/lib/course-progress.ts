import { supabase } from "@/integrations/supabase/client";

export type CourseProgress = {
  completedItems: string[];
  currentItemId?: string;
  videoId?: string;
  lastTimestamp: number;
  percentage: number;
  lastWatchedAt?: string;
};

const key = (slug: string) => `course-progress:${slug}`;

export function getCourseProgress(slug: string): CourseProgress {
  if (typeof window === "undefined") return { completedItems: [], lastTimestamp: 0, percentage: 0 };
  try {
    const parsed = JSON.parse(localStorage.getItem(key(slug)) || "{}");
    return {
      completedItems: parsed.completedItems || parsed.completedChapters?.map(String) || [],
      currentItemId: parsed.currentItemId,
      videoId: parsed.videoId,
      lastTimestamp: Number(parsed.lastTimestamp || 0),
      percentage: Number(parsed.percentage || 0),
      lastWatchedAt: parsed.lastWatchedAt,
    };
  } catch { return { completedItems: [], lastTimestamp: 0, percentage: 0 }; }
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
    completedItems: (data.completed_items as string[]) || [], currentItemId: data.content_item_id || undefined,
    videoId: data.video_id || undefined, lastTimestamp: Number(data.last_timestamp), percentage: Number(data.percentage),
    lastWatchedAt: data.last_watched_at,
  };
  const merged = (cloud.lastWatchedAt || "") >= (local.lastWatchedAt || "") ? cloud : local;
  saveCourseProgress(slug, merged);
  return merged;
}

export async function persistCourseProgress(slug: string, progress: CourseProgress) {
  const value = { ...progress, lastWatchedAt: new Date().toISOString() };
  saveCourseProgress(slug, value);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("course_progress").upsert({
    user_id: user.id, course_slug: slug, content_item_id: value.currentItemId || null, video_id: value.videoId || null,
    last_timestamp: Math.max(0, Math.floor(value.lastTimestamp)), completed_items: value.completedItems,
    percentage: Math.max(0, Math.min(100, Math.round(value.percentage))), last_watched_at: value.lastWatchedAt,
  }, { onConflict: "user_id,course_slug" });
}

export function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600); const m = Math.floor((seconds % 3600) / 60); const s = Math.floor(seconds % 60);
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}