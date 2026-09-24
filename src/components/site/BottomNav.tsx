import { Link } from "@tanstack/react-router";
import { Home, GraduationCap, ListChecks, FileText, User, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { getStreakData } from "@/lib/study-streak";

const items = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/courses", label: "Learn", icon: GraduationCap, exact: false },
  { to: "/practice", label: "Practice", icon: ListChecks, exact: false },
  { to: "/resources", label: "Notes", icon: FileText, exact: false },
  { to: "/dashboard", label: "Me", icon: User, exact: false },
] as const;

export function BottomNav() {
  const [streakCount, setStreakCount] = useState(0);
  const [todayDone, setTodayDone] = useState(false);

  useEffect(() => {
    try {
      const data = getStreakData();
      setStreakCount(data.currentStreak);
      setTodayDone(data.todayDone);
    } catch {
      // ignore
    }
  }, []);

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 py-1">
        {items.map(({ to, label, icon: Icon, exact }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact }}
              className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-md border-t-2 border-transparent px-2 py-2 text-[10px] font-bold text-muted-foreground transition-colors"
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </Link>
          </li>
        ))}
        {streakCount > 0 && (
          <li className="flex-1">
            <Link
              to="/progress"
              activeProps={{ className: "text-primary" }}
              className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-md border-t-2 border-transparent px-2 py-2 text-[10px] font-bold text-muted-foreground transition-colors"
            >
              <div className="relative">
                <Flame
                  className={`h-5 w-5 ${todayDone ? "text-orange-500" : "text-muted-foreground"}`}
                  aria-hidden="true"
                />
                <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 font-mono text-[8px] font-bold text-primary-foreground">
                  {streakCount}
                </span>
              </div>
              Streak
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
