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
  { to: "/roadmap", label: "Roadmap" },
  { to: "/resources", label: "Notes & PYQs" },
] as const;

const moreLinks = [
  { to: "/profile", label: "My Profile" },
  { to: "/progress", label: "My Progress" },
  { to: "/ai-assistant", label: "AI Helper" },
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
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-3 group" aria-label="EMO Learners home">
          <div className="flex h-9 w-9 items-center justify-center rounded-md btn-grad md:h-10 md:w-10">
            <Zap className="h-4 w-4 text-primary-foreground md:h-5 md:w-5" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold tracking-tighter md:text-xl">
            EMO <span className="text-primary">Learners</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold text-muted-foreground lg:flex">
          {primaryLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="border-b-2 border-transparent py-5 transition-colors hover:text-primary"
              activeProps={{ className: "border-primary text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}

          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className="inline-flex items-center gap-1 py-5 transition-colors hover:text-primary"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
            >
              More <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {moreOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1 w-56 overflow-hidden rounded-md border border-border bg-background py-2 shadow-lg"
              >
                {moreLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMoreOpen(false)}
                    className="block border-l-2 border-transparent px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
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
                className="hidden items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-xs font-bold text-foreground transition-all hover:border-primary hover:text-primary md:inline-flex"
              >
                <LayoutDashboard className="h-3.5 w-3.5" /> My space
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden items-center gap-1.5 rounded-md px-4 py-2 text-xs font-bold btn-grad md:inline-flex"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Admin
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="hidden items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary md:inline-flex"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="hidden items-center gap-1.5 rounded-md px-5 py-2.5 text-xs font-bold btn-grad md:inline-flex"
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
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-4 py-4 text-sm font-semibold">
            {[...primaryLinks, ...moreLinks].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md border border-transparent px-3 py-2.5 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                activeProps={{ className: "border-primary text-primary" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-transparent px-3 py-2.5 text-muted-foreground hover:border-border hover:text-foreground"
                >
                  My space
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="rounded-md border border-primary px-3 py-2.5 text-primary"
                  >
                    Admin panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="rounded-md border border-transparent px-3 py-2.5 text-left text-muted-foreground hover:border-border"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="col-span-2 mt-2 rounded-md bg-primary px-5 py-3 text-center text-xs font-bold text-primary-foreground"
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
