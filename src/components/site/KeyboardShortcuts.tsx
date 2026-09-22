import { useEffect, useState } from "react";
import { Keyboard, X } from "lucide-react";

type Shortcut = {
  keys: string[];
  description: string;
};

type ShortcutGroup = {
  title: string;
  shortcuts: Shortcut[];
};

const groups: ShortcutGroup[] = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["Ctrl", "K"], description: "Open command palette" },
      { keys: ["?"], description: "Show keyboard shortcuts" },
      { keys: ["G", "then", "H"], description: "Go to Home" },
      { keys: ["G", "then", "D"], description: "Go to Dashboard" },
      { keys: ["G", "then", "P"], description: "Go to Progress" },
      { keys: ["G", "then", "C"], description: "Go to Courses" },
    ],
  },
  {
    title: "Study Tools",
    shortcuts: [
      { keys: ["G", "then", "A"], description: "Open AI Assistant" },
      { keys: ["G", "then", "Q"], description: "Open Practice & Quizzes" },
      { keys: ["G", "then", "R"], description: "Open Resources" },
    ],
  },
  {
    title: "General",
    shortcuts: [
      { keys: ["Esc"], description: "Close dialog / menu" },
      { keys: ["↑", "↓"], description: "Navigate lists" },
      { keys: ["Enter"], description: "Select / confirm" },
    ],
  },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let gPressed = false;
    let gTimer: ReturnType<typeof setTimeout> | null = null;

    const down = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      // "?" key opens shortcuts
      if (e.key === "?" && !isInput) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }

      // "G then X" navigation sequences
      if (isInput) return;

      if (e.key === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (!gPressed) {
          gPressed = true;
          if (gTimer) clearTimeout(gTimer);
          gTimer = setTimeout(() => {
            gPressed = false;
          }, 800);
          return;
        }
      }

      if (gPressed) {
        gPressed = false;
        if (gTimer) clearTimeout(gTimer);
        const routes: Record<string, string> = {
          h: "/",
          d: "/dashboard",
          p: "/progress",
          c: "/courses",
          a: "/ai-assistant",
          q: "/practice",
          r: "/resources",
        };
        const route = routes[e.key.toLowerCase()];
        if (route) {
          e.preventDefault();
          window.location.href = route;
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
      if (gTimer) clearTimeout(gTimer);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/30 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <div className="mx-4 w-full max-w-lg animate-rise panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Keyboard className="h-4 w-4" />
            </div>
            <h2 className="font-display text-lg font-bold tracking-tight">Keyboard shortcuts</h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
          {groups.map((group, gi) => (
            <div key={group.title} className={gi > 0 ? "mt-6" : ""}>
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                {group.title}
              </div>
              <div className="mt-3 space-y-2">
                {group.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.description}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-primary/5"
                  >
                    <span className="text-muted-foreground">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, ki) =>
                        key === "then" ? (
                          <span key={ki} className="px-1 text-[10px] text-muted-foreground">
                            then
                          </span>
                        ) : (
                          <kbd
                            key={ki}
                            className="inline-flex h-6 min-w-[24px] items-center justify-center rounded border border-border bg-surface px-1.5 font-mono text-[11px] font-medium text-foreground shadow-[0_1px_0_1px] shadow-border/50"
                          >
                            {key}
                          </kbd>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-6 py-3">
          <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Press{" "}
            <kbd className="rounded border border-border bg-surface px-1 py-0.5 font-mono text-[10px]">
              ?
            </kbd>{" "}
            to toggle · Press{" "}
            <kbd className="rounded border border-border bg-surface px-1 py-0.5 font-mono text-[10px]">
              Esc
            </kbd>{" "}
            to close
          </p>
        </div>
      </div>
    </div>
  );
}
