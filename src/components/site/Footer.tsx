import { Link } from "@tanstack/react-router";
import { Zap, Instagram, Send, Linkedin, Youtube, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border bg-surface/30">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 rotate-12 items-center justify-center rounded-lg bg-primary shadow-brand">
              <Zap className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-extrabold italic uppercase tracking-tighter">
              EMO <span className="text-primary">Learners</span>
            </span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            A free playground for ambitious Indian students. AI tools, curated
            resources, quizzes, tests, and real internships — built so you can
            stop wasting time and start building.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="https://instagram.com/emolearners" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-all hover:border-primary hover:text-primary">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://t.me/Emo_Learners" target="_blank" rel="noreferrer" aria-label="Telegram" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-all hover:border-primary hover:text-primary">
              <Send className="h-4 w-4" />
            </a>
            <a href="https://youtube.com/@emolearners" target="_blank" rel="noreferrer" aria-label="YouTube" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-all hover:border-primary hover:text-primary">
              <Youtube className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com/in/username/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-all hover:border-primary hover:text-primary">
              <Linkedin className="h-4 w-4" />
            </a>
            <Link to="/contact" aria-label="Contact" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-all hover:border-primary hover:text-primary">
              <Mail className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Explore</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/emoiq" className="transition-colors hover:text-foreground">EMoIQ (AI Exam Engine)</Link></li>
            <li><Link to="/resources" className="transition-colors hover:text-foreground">Resources</Link></li>
            <li><Link to="/internships" className="transition-colors hover:text-foreground">Internships</Link></li>
            <li><Link to="/quizzes" className="transition-colors hover:text-foreground">Quizzes</Link></li>
            <li><Link to="/tests" className="transition-colors hover:text-foreground">Tests</Link></li>
            <li><Link to="/about" className="transition-colors hover:text-foreground">About</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Community</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/join" className="transition-colors hover:text-foreground">Join Community</Link></li>
            <li><a href="https://t.me/Emo_Learners" target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">Telegram</a></li>
            <li><a href="https://instagram.com/emolearners" target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">Instagram</a></li>
            <li><Link to="/contact" className="transition-colors hover:text-foreground">Contact Us</Link></li>
            <li><Link to="/privacy-policy" className="transition-colors hover:text-foreground">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <p className="font-mono uppercase tracking-widest">© {new Date().getFullYear()} EMO Learners — Built for students, by students. 🇮🇳</p>
          <p className="font-mono uppercase tracking-widest">By Mohit Ahirwar · Made in India</p>
        </div>
      </div>
    </footer>
  );
}
