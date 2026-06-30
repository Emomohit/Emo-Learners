import { Link } from "@tanstack/react-router";
import { Zap, Menu, X, LayoutDashboard, ShieldCheck, LogOut, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/", label: "Home" },
  { to: "/challenge", label: "Challenge" },
  { to: "/resources", label: "Resources" },
  { to: "/ai-assistant", label: "AI Tutor" },
  { to: "/quizzes", label: "Quizzes" },
  { to: "/tests", label: "Tests" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 rotate-12 items-center justify-center rounded-lg bg-primary shadow-brand transition-transform group-hover:rotate-[24deg]">
            <Zap className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-extrabold italic uppercase tracking-tighter">
            EMO <span className="text-primary">Learners</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground lg:flex">
          {links.map((l) => (
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
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden items-center gap-1.5 rounded-full border border-border bg-surface/60 px-4 py-2 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-primary hover:text-primary md:inline-flex"
              >
                <LayoutDashboard className="h-3.5 w-3.5" /> Dash
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
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="hidden items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-all hover:scale-105 active:scale-95 md:inline-flex"
            >
              <LogIn className="h-3.5 w-3.5" /> Login
            </Link>
          )}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-border p-2 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4 text-sm font-semibold uppercase tracking-wider">
            {links.map((l) => (
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
                <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-muted-foreground hover:bg-surface hover:text-foreground">Dashboard</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-primary hover:bg-surface">Admin Panel</Link>
                )}
                <button onClick={() => { signOut(); setOpen(false); }} className="rounded-md px-3 py-2.5 text-left text-muted-foreground hover:bg-surface">
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-primary px-5 py-3 text-center text-xs font-bold uppercase tracking-widest text-primary-foreground"
              >
                Login / Sign up →
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
