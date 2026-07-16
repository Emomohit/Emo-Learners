import { Link } from "@tanstack/react-router";
import {
  Zap,
  Menu,
  X,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  LogIn,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";

// Primary nav — short, plain-English labels.
const primaryLinks = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Learn" },
  { to: "/practice", label: "Practice" },
  { to: "/emoiq", label: "EMoIQ" },
  { to: "/placement", label: "Placement" },
  { to: "/resources", label: "Notes & PYQs" },
  { to: "/ai-assistant", label: "AI Helper" },
] as const;

const moreLinks = [
  { to: "/challenge", label: "30-Day Python" },
  { to: "/internships", label: "Internships" },
  { to: "/about", label: "About" },
  { to: "/join", label: "Join Community" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:h-18 md:px-6">
        <Link to="/" className="flex items-center gap-3 group" aria-label="EMO Learners home">
          <div className="flex h-9 w-9 rotate-12 items-center justify-center rounded-lg bg-primary shadow-brand transition-transform group-hover:rotate-[24deg] md:h-10 md:w-10">
            <Zap className="h-4 w-4 text-primary-foreground md:h-5 md:w-5" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-extrabold italic uppercase tracking-tighter md:text-xl">
            EMO <span className="text-primary">Learners</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground lg:flex">
          {primaryLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="transition-colors hover:text-primary"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}

          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className="inline-flex items-center gap-1 uppercase tracking-[0.18em] transition-colors hover:text-primary"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
            >
              More <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {moreOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-xl border border-border bg-background/95 py-2 shadow-lg backdrop-blur-xl"
              >
                {moreLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMoreOpen(false)}
                    className="block px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                    role="menuitem"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden items-center gap-1.5 rounded-full border border-border bg-surface/60 px-4 py-2 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-primary hover:text-primary md:inline-flex"
              >
                <LayoutDashboard className="h-3.5 w-3.5" /> My space
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand md:inline-flex"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Admin
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary md:inline-flex"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="hidden items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-all hover:scale-105 active:scale-95 md:inline-flex"
            >
              <LogIn className="h-3.5 w-3.5" /> Sign in
            </Link>
          )}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-border p-2 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-sm font-semibold uppercase tracking-wider">
            {[...primaryLinks, ...moreLinks].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                activeProps={{ className: "bg-surface text-foreground" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-muted-foreground hover:bg-surface hover:text-foreground">
                  My space
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-primary hover:bg-surface">
                    Admin panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="rounded-md px-3 py-2.5 text-left text-muted-foreground hover:bg-surface"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-widest text-primary-foreground"
              >
                Sign in / Create account
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
