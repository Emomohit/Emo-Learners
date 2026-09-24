import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  X,
  Sparkles,
  Keyboard,
  MessageSquare,
  Flame,
  BarChart3,
  Copy,
  Bookmark,
} from "lucide-react";

type ChangelogEntry = {
  date: string;
  title: string;
  description: string;
  icon: React.ElementType;
  link?: { to: string; label: string };
  tag: "new" | "improved" | "fix";
};

const changelog: ChangelogEntry[] = [
  {
    date: "Sep 24",
    title: "Study Streak Widget",
    description:
      "A floating streak counter now shows your study streak across all pages. Don't break the chain!",
    icon: Flame,
    link: { to: "/dashboard", label: "View dashboard" },
    tag: "new",
  },
  {
    date: "Sep 22",
    title: "Keyboard Shortcuts",
    description:
      'Press "?" anywhere to see all keyboard shortcuts. Navigate faster with G-then-key combos.',
    icon: Keyboard,
    tag: "new",
  },
  {
    date: "Sep 22",
    title: "AI Markdown + Copy",
    description:
      "AI responses now render with proper formatting — code blocks, tables, bold text. Plus a one-click Copy button.",
    icon: Copy,
    link: { to: "/emoiq/doubt", label: "Try doubt solver" },
    tag: "improved",
  },
  {
    date: "Sep 21",
    title: "Progress Dashboard",
    description: "Track mock tests, AI interviews, and resume analysis all from the progress page.",
    icon: BarChart3,
    link: { to: "/progress", label: "View progress" },
    tag: "improved",
  },
  {
    date: "Sep 21",
    title: "Interactive Marquee",
    description:
      "The scrolling banner now pauses on hover and links to real pages. Quiz & test state persists on refresh.",
    icon: MessageSquare,
    tag: "improved",
  },
  {
    date: "Sep 20",
    title: "Command Palette (Ctrl+K)",
    description: "Search and navigate anywhere instantly with the command palette.",
    icon: Sparkles,
    tag: "new",
  },
  {
    date: "Sep 20",
    title: "Bookmarks Page",
    description: "Save courses, chapters, and resources to your personal bookmarks list.",
    icon: Bookmark,
    link: { to: "/bookmarks", label: "View bookmarks" },
    tag: "new",
  },
];

const tagStyles = {
  new: "bg-success/10 text-success border-success/30",
  improved: "bg-primary/10 text-primary border-primary/30",
  fix: "bg-orange/10 text-orange border-orange/30",
} as const;

export function WhatsNew() {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const last = localStorage.getItem("emo:changelog:seen");
      return last === changelog[0]?.date;
    } catch {
      return true;
    }
  });

  const markSeen = () => {
    setSeen(true);
    try {
      localStorage.setItem("emo:changelog:seen", changelog[0]?.date ?? "");
    } catch {
      // ignore
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          markSeen();
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        aria-label="What's new"
        title="What's new"
      >
        <Bell className="h-4 w-4" />
        {!seen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex justify-end"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-foreground/20" />
          <div className="relative ml-auto h-full w-full max-w-md animate-rise overflow-y-auto border-l border-border bg-background shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h2 className="font-display text-lg font-bold tracking-tight">What's new</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="space-y-1">
                {changelog.map((entry, i) => {
                  const Icon = entry.icon;
                  return (
                    <div
                      key={`${entry.date}-${entry.title}`}
                      className={`relative rounded-xl p-4 transition-colors hover:bg-primary/5 ${i === 0 ? "border border-primary/20 bg-primary/5" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                              {entry.date}
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${tagStyles[entry.tag]}`}
                            >
                              {entry.tag}
                            </span>
                          </div>
                          <h3 className="mt-1 font-semibold text-foreground">{entry.title}</h3>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {entry.description}
                          </p>
                          {entry.link && (
                            <Link
                              to={entry.link.to}
                              onClick={() => setOpen(false)}
                              className="mt-2 inline-flex font-mono text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                            >
                              {entry.link.label} →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-xl border border-dashed border-border p-4 text-center">
                <p className="text-xs text-muted-foreground">Want a feature? Have feedback?</p>
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="mt-1 inline-flex font-mono text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                >
                  Let us know →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
