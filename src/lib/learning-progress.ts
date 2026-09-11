import { courses, type Course } from "@/lib/course-data";
import type { CourseProgressEntry } from "@/lib/course-progress";

export type LearningActivity = CourseProgressEntry & {
  course: Course;
  chapter: Course["chapters"][number];
  completedCount: number;
  requiredCount: number;
  percentage: number;
  isComplete: boolean;
};

export function buildLearningActivities(entries: CourseProgressEntry[]): LearningActivity[] {
  return entries.flatMap((entry) => {
    const course = courses.find((item) => item.slug === entry.slug);
    if (!course) return [];
    const chapter = course.chapters.find((item) => item.id === entry.progress.lastChapterId) ?? course.chapters[0];
    if (!chapter) return [];
    const requiredIds = new Set(course.chapters.filter((item) => !item.unavailable).map((item) => item.id));
    const completedCount = new Set(entry.progress.completedChapters.filter((id) => requiredIds.has(id))).size;
    const requiredCount = requiredIds.size;
    const percentage = requiredCount ? Math.round((completedCount / requiredCount) * 100) : 0;
    return [{ ...entry, course, chapter, completedCount, requiredCount, percentage, isComplete: requiredCount > 0 && completedCount === requiredCount }];
  }).sort((a, b) => (b.progress.lastWatchedAt ?? "").localeCompare(a.progress.lastWatchedAt ?? ""));
}

export function summarizeLearning(entries: CourseProgressEntry[]) {
  const activities = buildLearningActivities(entries);
  const completedChapters = activities.reduce((sum, item) => sum + item.completedCount, 0);
  const totalRequired = activities.reduce((sum, item) => sum + item.requiredCount, 0);
  return {
    activities,
    coursesStarted: activities.length,
    coursesCompleted: activities.filter((item) => item.isComplete).length,
    completedChapters,
    overallPercentage: totalRequired ? Math.round((completedChapters / totalRequired) * 100) : 0,
  };
}