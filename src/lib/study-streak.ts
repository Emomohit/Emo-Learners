/**
 * Study‐streak tracking — records daily study activity and computes
 * current / best streak counts.  All dates are local calendar dates
 * (YYYY-MM-DD) so time-zone / daylight-saving boundaries are handled
 * consistently.
 *
 * Storage key: "emo:study-streak:days"
 * Schema:      string[]  — sorted array of ISO date strings ("2026-09-12")
 */

const KEY = "emo:study-streak:days";

// ────────────────────────────── helpers ──────────────────────────────

/** Return today's local date as "YYYY-MM-DD". */
function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Return yesterday's local date as "YYYY-MM-DD". */
function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Parse a "YYYY-MM-DD" string to a plain Date at midnight local. */
function parseDay(s: string): Date | null {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  // Guard against invalid dates (e.g. Feb 30)
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

/** Difference in calendar days between two Dates (a - b). */
function diffDays(a: Date, b: Date): number {
  // Normalize to midnight to avoid DST edge-cases
  const msA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const msB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((msA - msB) / 86_400_000);
}

// ──────────────────────────── storage I/O ────────────────────────────

/** Read the persisted day-strings, filtering out any invalid entries. */
function readDays(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const today = todayStr();
    // Keep only valid date-strings that are not in the future
    return (parsed as unknown[])
      .filter((v): v is string => typeof v === "string" && parseDay(v) !== null && v <= today)
      .sort();
  } catch {
    return [];
  }
}

function writeDays(days: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(days));
  } catch {
    /* storage full — non-fatal */
  }
}

// ──────────────────────────── public API ─────────────────────────────

export type StreakData = {
  /** Number of consecutive days ending today or yesterday. */
  currentStreak: number;
  /** Longest streak ever recorded. */
  bestStreak: number;
  /** Whether today has been marked as a study day. */
  todayDone: boolean;
  /** ISO date string of the most recent study day, or null. */
  lastStudied: string | null;
};

/**
 * Record today as a study day.  Safe to call multiple times — duplicates
 * are ignored.
 */
export function recordStudyDay(): void {
  const days = readDays();
  const t = todayStr();
  if (days.includes(t)) return; // already recorded
  days.push(t);
  days.sort();
  writeDays(days);
}

/**
 * Compute streak statistics from persisted data.
 *
 * The "current streak" is the number of consecutive calendar days that
 * end on **today** or **yesterday** (so the user doesn't lose their
 * streak until the next day is over without activity).
 */
export function getStreakData(): StreakData {
  const days = readDays();
  if (days.length === 0) {
    return { currentStreak: 0, bestStreak: 0, todayDone: false, lastStudied: null };
  }

  const today = todayStr();
  const yesterday = yesterdayStr();
  const todayDone = days.includes(today);
  const lastStudied = days[days.length - 1];

  // Parse all valid dates once
  const parsed = days
    .map((s) => ({ s, d: parseDay(s) }))
    .filter((x): x is { s: string; d: Date } => x.d !== null);

  // De-duplicate (same calendar date) and sort descending
  const unique = [...new Map(parsed.map((x) => [x.s, x.d])).entries()].sort(([a], [b]) =>
    a > b ? -1 : a < b ? 1 : 0,
  );

  // ── compute current streak ──
  // The streak must end on today or yesterday to count
  let currentStreak = 0;
  if (unique.length > 0) {
    const [headStr] = unique[0];
    if (headStr === today || headStr === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < unique.length; i++) {
        if (diffDays(unique[i - 1][1], unique[i][1]) === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  // ── compute best streak ──
  let bestStreak = 0;
  if (unique.length > 0) {
    let run = 1;
    // Walk ascending for best-streak calculation
    const asc = [...unique].reverse();
    for (let i = 1; i < asc.length; i++) {
      if (diffDays(asc[i][1], asc[i - 1][1]) === 1) {
        run++;
      } else {
        bestStreak = Math.max(bestStreak, run);
        run = 1;
      }
    }
    bestStreak = Math.max(bestStreak, run);
  }

  return { currentStreak, bestStreak, todayDone, lastStudied };
}
