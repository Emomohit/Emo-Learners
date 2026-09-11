import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";

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

export type CourseProgressEntry = {
  slug: string;
  progress: CourseProgress;
};

export const courseProgressQueryKey = (userId?: string) => ["course-progress", userId ?? "guest"] as const;

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

function fromCloudRow(row: {
  course_slug: string;
  content_item_id: number;
  video_id: string | null;
  last_timestamp: number;
  completed_items: number[];
  percentage: number;
  last_watched_at: string;
}): CourseProgressEntry {
  return {
    slug: row.course_slug,
    progress: {
      completedItems: row.completed_items ?? [],
      completedChapters: row.completed_items ?? [],
      currentItemId: row.content_item_id,
      lastChapterId: row.content_item_id,
      totalChapters: 0,
      videoId: row.video_id ?? undefined,
      lastTimestamp: Number(row.last_timestamp || 0),
      percentage: Number(row.percentage || 0),
      lastWatchedAt: row.last_watched_at,
    },
  };
}

export async function loadAllSyncedCourseProgress(): Promise<CourseProgressEntry[]> {
  const localEntries = getAllProgress();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error("Course progress authentication failed", authError);
    throw authError;
  }
  if (!authData.user) return localEntries;

  const { data, error } = await supabase
    .from("course_progress")
    .select("course_slug,content_item_id,video_id,last_timestamp,completed_items,percentage,last_watched_at")
    .eq("user_id", authData.user.id)
    .order("last_watched_at", { ascending: false });
  if (error) {
    console.error("Course progress could not be loaded", error);
    throw error;
  }

  const merged = new Map((data ?? []).map((row) => {
    const entry = fromCloudRow(row);
    return [entry.slug, entry] as const;
  }));
  const newerLocal: CourseProgressEntry[] = [];
  for (const localEntry of localEntries) {
    const cloudEntry = merged.get(localEntry.slug);
    if (!cloudEntry || (localEntry.progress.lastWatchedAt ?? "") > (cloudEntry.progress.lastWatchedAt ?? "")) {
      merged.set(localEntry.slug, localEntry);
      newerLocal.push(localEntry);
    }
  }

  if (newerLocal.length) {
    const { error: mergeError } = await supabase.from("course_progress").upsert(
      newerLocal.map(({ slug, progress }) => ({
        user_id: authData.user.id,
        course_slug: slug,
        content_item_id: progress.currentItemId || progress.lastChapterId || 1,
        video_id: progress.videoId || null,
        last_timestamp: Math.max(0, Math.floor(progress.lastTimestamp || 0)),
        completed_items: progress.completedItems || progress.completedChapters || [],
        percentage: Math.max(0, Math.min(100, Math.round(progress.percentage || 0))),
        last_watched_at: progress.lastWatchedAt || new Date().toISOString(),
      })),
      { onConflict: "user_id,course_slug" },
    );
    if (mergeError) {
      console.error("Local course progress could not be synchronized", mergeError);
      throw mergeError;
    }
  }

  const result = [...merged.values()].sort((a, b) =>
    (b.progress.lastWatchedAt ?? "").localeCompare(a.progress.lastWatchedAt ?? ""),
  );
  result.forEach(({ slug, progress }) => saveCourseProgress(slug, progress));
  return result;
}

export function useCourseProgresses() {
  const { user, loading } = useAuth();
  return useQuery({
    queryKey: courseProgressQueryKey(user?.id),
    queryFn: loadAllSyncedCourseProgress,
    enabled: !loading,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

export async function loadSyncedCourseProgress(slug: string): Promise<CourseProgress> {
  const local = getCourseProgress(slug);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error("Course progress authentication failed", authError);
    throw authError;
  }
  if (!user) return local;
  const { data, error } = await supabase.from("course_progress").select("*").eq("user_id", user.id).eq("course_slug", slug).maybeSingle();
  if (error) {
    console.error(`Course progress could not be loaded for ${slug}`, error);
    throw error;
  }
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
  return persistCourseProgress(slug, next);
}
export function toggleChapterDone(slug: string, id: number, total: number) {
  const old = getCourseProgress(slug); const set = new Set(old.completedChapters);
  set.has(id) ? set.delete(id) : set.add(id);
  void saveProgress(slug, { lastChapterId: id, totalChapters: total, completedChapters: [...set] }).catch((error) => {
    console.error(`Course progress could not be saved for ${slug}`, error);
  });
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
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) return;
  const { error } = await supabase.from("course_progress").upsert({
    user_id: user.id, course_slug: slug, content_item_id: value.currentItemId || 1, video_id: value.videoId || null,
    last_timestamp: Math.max(0, Math.floor(value.lastTimestamp)), completed_items: value.completedItems,
    percentage: Math.max(0, Math.min(100, Math.round(value.percentage))), last_watched_at: value.lastWatchedAt,
  }, { onConflict: "user_id,course_slug" });
  if (error) throw error;
}

export function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600); const m = Math.floor((seconds % 3600) / 60); const s = Math.floor(seconds % 60);
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}