import { useEffect, useState } from "react";
import { Flame, Trophy, X, Zap } from "lucide-react";
import { getStreakData, type StreakData } from "@/lib/study-streak";
import { Link } from "@tanstack/react-router";

export function StreakWidget() {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Small delay so we don't flash on initial load
    const t = setTimeout(() => {
      try {
        const data = getStreakData();
        setStreak(data);
      } catch {
        // ignore
      }
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  // Listen for storage changes to update streak in real-time
  useEffect(() => {
    const handler = () => {
      try {
        setStreak(getStreakData());
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", handler);
    // Also poll occasionally (for same-tab updates)
    const interval = setInterval(handler, 30000);
    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, []);

  // Don't show if no streak data or dismissed
  if (!streak || dismissed) return null;
  // Don't show if user has no activity at all
  if (streak.currentStreak === 0 && streak.bestStreak === 0 && !streak.todayDone) return null;

  const getMessage = () => {
    if (!streak.todayDone && streak.currentStreak > 0) {
      return "Don't break your streak! Study today.";
    }
    if (streak.todayDone && streak.currentStreak >= 7) {
      return `🔥 ${streak.currentStreak}-day streak! You're on fire!`;
    }
    if (streak.todayDone && streak.currentStreak >= 3) {
      return `Nice! ${streak.currentStreak} days and counting.`;
    }
    if (streak.todayDone) {
      return "Today's study: done ✓";
    }
    if (streak.currentStreak === 0 && streak.bestStreak > 0) {
      return "Start a new streak today!";
    }
    return "Keep learning every day!";
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed bottom-20 right-4 z-30 flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 shadow-lg transition-all hover:border-primary hover:shadow-xl lg:bottom-6 animate-rise"
        title="Study streak"
      >
        <Flame
          className={`h-4 w-4 ${streak.todayDone ? "text-orange-500" : "text-muted-foreground"}`}
        />
        <span className="font-mono text-xs font-bold tabular-nums">{streak.currentStreak}</span>
        {!streak.todayDone && streak.currentStreak > 0 && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-30 w-72 animate-rise panel overflow-hidden shadow-xl lg:bottom-6">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Flame
            className={`h-4 w-4 ${streak.todayDone ? "text-orange-500" : "text-muted-foreground"}`}
          />
          <span className="font-display text-sm font-bold">Study Streak</span>
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Collapse"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-end gap-6">
          <div>
            <div className="font-display text-3xl font-bold tabular-nums text-primary">
              {streak.currentStreak}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Current
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 font-display text-xl font-bold tabular-nums text-foreground/70">
              <Trophy className="h-3.5 w-3.5 text-yellow-500" />
              {streak.bestStreak}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Best
            </div>
          </div>
          <div className="ml-auto">
            {streak.todayDone ? (
              <div className="flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-success">
                <Zap className="h-3 w-3" /> Done
              </div>
            ) : (
              <div className="flex items-center gap-1 rounded-full border border-orange-400/40 bg-orange-400/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-orange-500">
                <Zap className="h-3 w-3" /> Pending
              </div>
            )}
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">{getMessage()}</p>

        <div className="mt-3 flex items-center gap-2">
          <Link
            to="/courses"
            onClick={() => setExpanded(false)}
            className="flex-1 rounded-lg bg-primary px-3 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {streak.todayDone ? "Keep going" : "Study now"}
          </Link>
          <button
            onClick={() => {
              setExpanded(false);
              setDismissed(true);
            }}
            className="rounded-lg border border-border px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            Hide
          </button>
        </div>
      </div>
    </div>
  );
}
