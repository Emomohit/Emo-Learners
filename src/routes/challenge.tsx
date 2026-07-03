import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Flame, Trophy, Sparkles, Lock, CheckCircle2, Play, Rocket, Users,
  Target, Award, BookOpen, Star, ChevronDown, ArrowRight, Zap, X, Youtube,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import {
  CHALLENGE_DAYS, CHALLENGE_START_DATE, COURSE_URL, BADGES, FAQ,
} from "@/lib/challenge-data";
import { useAuth } from "@/lib/auth";

const SITE = "https://emolearners.vercel.app";
const STORAGE_KEY = "emo:challenge:completed-days";

export const Route = createFileRoute("/challenge")({
  head: () => ({
    meta: [
      { title: "30 Days Python Challenge — EMO Learners" },
      { name: "description", content: "Master Python in 30 days with EMO Learners. Daily structure, progress tracking, badges, and a completion certificate — follow CodeWithHarry's free course." },
      { property: "og:title", content: "30 Days Python Challenge — EMO Learners" },
      { property: "og:description", content: "Build consistency. Master Python. Earn your certificate in 30 days." },
      { property: "og:url", content: `${SITE}/challenge` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/challenge` }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Course",
        name: "30 Days Python Challenge",
        description: "30-day structured Python learning challenge by EMO Learners using CodeWithHarry's Complete Python Course.",
        provider: { "@type": "Organization", name: "EMO Learners", url: SITE },
        url: `${SITE}/challenge`,
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: "PT30H",
        },
      }),
    }],
  }),
  component: ChallengePage,
});

function ChallengePage() {
  return (
    <div className="challenge-theme min-h-screen">
      <Navbar />
      <Hero />
      <Countdown />
      <WhySection />
      <Tracker />
      <Dashboard />
      <Badges />
      <Certificate />
      <Testimonials />
      <FaqSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  const { user } = useAuth();
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="aurora" />
      <div className="relative mx-auto max-w-6xl text-center reveal">
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-mono uppercase tracking-[0.2em] text-white/80">
          <Sparkles className="h-3.5 w-3.5" /> EMO Learners · Cohort 01
        </span>
        <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tighter md:text-7xl lg:text-8xl">
          <span className="grad-text">30 Days</span>
          <br />
          <span className="text-white">Python Challenge</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-lg">
          Build the habit. Master the language. Ship real projects.
          Follow CodeWithHarry's complete Python course in 30 focused days — with daily structure, streaks, badges, and a certificate when you finish.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={user ? "/dashboard" : "/auth"}
            className="grad-btn inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-widest transition-transform hover:scale-105"
          >
            <Rocket className="h-4 w-4" /> Join the Challenge
          </Link>
          <a
            href={COURSE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full glass glass-hover px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-white"
          >
            <Play className="h-4 w-4" /> Watch the Course
          </a>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { k: "30", v: "Days" },
            { k: "1-2h", v: "Daily" },
            { k: "100%", v: "Free" },
            { k: "1", v: "Certificate" },
          ].map((s) => (
            <div key={s.v} className="glass glass-hover p-5">
              <div className="grad-text font-display text-3xl font-extrabold">{s.k}</div>
              <div className="mt-1 text-xs font-mono uppercase tracking-widest text-white/60">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Countdown ---------------- */
function useCountdown(target: string) {
  const [now, setNow] = useState(() => new Date(target).getTime());
  useEffect(() => {
    setNow(Date.now());
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, [target]);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s, done: diff === 0 };
}

function Countdown() {
  const { d, h, m, s, done } = useCountdown(CHALLENGE_START_DATE);
  const cells = [
    { v: d, l: "Days" },
    { v: h, l: "Hours" },
    { v: m, l: "Minutes" },
    { v: s, l: "Seconds" },
  ];
  return (
    <section id="challenge" className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="glass grad-border p-8 md:p-12">
          <div className="flex flex-col items-center text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">
              {done ? "Challenge is live" : "Next cohort starts in"}
            </span>
            <div className="mt-6 grid w-full grid-cols-4 gap-3 md:gap-6">
              {cells.map((c) => (
                <div key={c.l} className="glass p-4 md:p-6">
                  <div className="grad-text font-display text-3xl font-extrabold md:text-5xl">
                    {String(c.v).padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-white/60 md:text-xs">
                    {c.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Why ---------------- */
function WhySection() {
  const items = [
    { icon: Target, title: "Consistency Wins", desc: "Small daily reps beat marathon weekends. 30 days locks in the habit." },
    { icon: Users, title: "Built-in Accountability", desc: "Track streaks, share progress, get nudged by the EMO community." },
    { icon: BookOpen, title: "Structured Curriculum", desc: "Day-by-day topics mapped to CodeWithHarry's course. No guesswork." },
  ];
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="Why this challenge" title={<>Consistency is the <span className="grad-text">cheat code</span></>} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="glass glass-hover p-7">
              <div className="grad-btn inline-flex h-11 w-11 items-center justify-center rounded-xl">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold">{it.title}</h3>
              <p className="mt-2 text-sm text-white/70">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Tracker ---------------- */
function useCompleted() {
  const [done, setDone] = useState<Set<number>>(new Set());
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(new Set(JSON.parse(raw)));
    } catch {}
  }, []);
  const toggle = (id: number) => {
    setDone((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...n])); } catch {}
      return n;
    });
  };
  return { done, toggle };
}

function Tracker() {
  const { done, toggle } = useCompleted();
  const [openId, setOpenId] = useState<number | null>(null);
  const openDay = openId != null ? CHALLENGE_DAYS.find((d) => d.id === openId) : null;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="The roadmap" title={<>30 Days. 30 <span className="grad-text">Wins.</span></>} subtitle="Tap a day to read the notes, copy the snippet, and watch the matching CodeWithHarry chapter. Progress saves locally." />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {CHALLENGE_DAYS.map((day) => {
            const completed = done.has(day.id);
            return (
              <div
                key={day.id}
                className={`glass glass-hover group relative p-4 text-left ${completed ? "grad-border" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(day.id)}
                  className="block w-full text-left"
                  aria-label={`Open notes for Day ${day.id}: ${day.title}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                      Day {String(day.id).padStart(2, "0")}
                    </span>
                    <BookOpen className="h-3.5 w-3.5 text-white/40 group-hover:text-white/80" />
                  </div>
                  <h4 className="mt-3 font-display text-sm font-bold leading-tight">{day.title}</h4>
                  <p className="mt-1 line-clamp-2 text-[11px] text-white/60">{day.topic}</p>
                </button>
                <button
                  type="button"
                  onClick={() => toggle(day.id)}
                  className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-[10px] font-mono uppercase tracking-widest transition ${
                    completed
                      ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/90"
                  }`}
                  aria-pressed={completed}
                >
                  {completed ? <><CheckCircle2 className="h-3 w-3" /> Done</> : <><Lock className="h-3 w-3" /> Mark done</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {openDay && <DayNotesDialog day={openDay} onClose={() => setOpenId(null)} />}
    </section>
  );
}

function DayNotesDialog({ day, onClose }: { day: typeof CHALLENGE_DAYS[number]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="glass relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e1a]/95 p-0 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/50">
              Day {String(day.id).padStart(2, "0")} · CodeWithHarry notes
            </div>
            <h3 className="mt-1 font-display text-2xl font-extrabold">{day.title}</h3>
            <p className="mt-1 text-sm text-white/60">{day.topic}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Close dialog">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">What you'll learn</span>
              <span className="rounded-full border border-white/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white/70">~{day.minutes} min</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/85">{day.whatYouLearn}</p>
          </div>
          <h4 className="mt-6 font-mono text-[11px] uppercase tracking-widest text-primary">Key notes</h4>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/85">
            {day.notes.map((n, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{n}</span>
              </li>
            ))}
          </ul>

          {day.snippet && (
            <>
              <h4 className="mt-6 font-mono text-[11px] uppercase tracking-widest text-primary">Try it</h4>
              <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/60 p-4 text-[12.5px] leading-relaxed text-emerald-200"><code>{day.snippet}</code></pre>
            </>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/10 p-4 sm:flex-row sm:justify-between">
          <a
            href={day.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 hover:border-primary hover:text-white"
          >
            <Youtube className="h-4 w-4" /> Watch on CodeWithHarry
          </a>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90"
          >
            Got it <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function Dashboard() {
  const { done } = useCompleted();
  const completed = done.size;
  const pct = Math.round((completed / 30) * 100);
  const streak = useMemo(() => {
    let s = 0;
    const sorted = [...done].sort((a, b) => a - b);
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (i === sorted.length - 1 || sorted[i] === sorted[i + 1] - 1) s++;
      else break;
    }
    return s;
  }, [done]);

  const message = completed === 0
    ? "Day 1 is the hardest. Just start."
    : completed >= 30 ? "Legend. You finished. Now build something."
    : completed >= 21 ? "Final stretch. Stay locked in."
    : completed >= 14 ? "Halfway there. Momentum is on your side."
    : completed >= 7 ? "One week in. The habit is forming."
    : "Keep going. One day at a time.";

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="Your dashboard" title={<>Track every <span className="grad-text">streak</span></>} />
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          <Stat icon={CheckCircle2} label="Completed" value={`${completed}/30`} />
          <Stat icon={Flame} label="Current streak" value={`${streak} 🔥`} />
          <Stat icon={Target} label="Progress" value={`${pct}%`} />
          <Stat icon={Sparkles} label="Status" value={completed >= 30 ? "Done" : completed > 0 ? "Active" : "Not started"} />
        </div>

        <div className="glass mt-6 p-7">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-white/60">
            <span>Overall progress</span>
            <span>{pct}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, var(--c-cyan), var(--c-blue), var(--c-purple))",
              }}
            />
          </div>
          <p className="mt-5 font-display text-xl">{message}</p>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="glass glass-hover p-6">
      <Icon className="h-5 w-5 text-white/70" />
      <div className="mt-4 font-display text-3xl font-extrabold">{value}</div>
      <div className="mt-1 text-xs font-mono uppercase tracking-widest text-white/60">{label}</div>
    </div>
  );
}

/* ---------------- Badges ---------------- */
function Badges() {
  const { done } = useCompleted();
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="Achievements" title={<>Unlock <span className="grad-text">milestone</span> badges</>} subtitle="Every checkpoint earns a badge. Show off your grind." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {BADGES.map((b) => {
            const unlocked = done.size >= b.threshold;
            return (
              <div key={b.id} className={`glass glass-hover p-6 ${unlocked ? "grad-border" : "opacity-60"}`}>
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${unlocked ? "grad-btn" : "bg-white/5"}`}>
                  {unlocked ? <Award className="h-6 w-6" /> : <Lock className="h-5 w-5 text-white/50" />}
                </div>
                <h4 className="mt-4 font-display text-lg font-bold">{b.label}</h4>
                <p className="text-sm text-white/60">{b.desc}</p>
                <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
                  {unlocked ? "Unlocked" : `${done.size}/${b.threshold} days`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Certificate ---------------- */
function Certificate() {
  const { user } = useAuth();
  const name = (user?.user_metadata as any)?.full_name || user?.email?.split("@")[0] || "Your Name";
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="The reward" title={<>Earn your <span className="grad-text">certificate</span></>} subtitle="Finish all 30 days and unlock a shareable completion certificate." />
        <div className="mt-12 glass grad-border p-2 md:p-3">
          <div className="rounded-2xl p-8 md:p-14 text-center" style={{
            background: "linear-gradient(135deg, color-mix(in oklab, var(--c-blue) 14%, transparent), color-mix(in oklab, var(--c-purple) 14%, transparent))",
          }}>
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/70">EMO Learners · Certificate of Completion</div>
            <Zap className="mx-auto mt-6 h-10 w-10 text-white" />
            <h3 className="mt-6 font-display text-3xl font-extrabold md:text-5xl">{name}</h3>
            <p className="mt-3 text-sm text-white/70">has successfully completed the</p>
            <p className="mt-2 grad-text font-display text-2xl font-extrabold md:text-3xl">30 Days Python Challenge</p>
            <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-mono uppercase tracking-widest text-white/50">
              <span>Issued by EMO Learners</span>
              <span>·</span>
              <span>30 / 30 days</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
function Testimonials() {
  const items = [
    { name: "Aarav S.", role: "B.Tech CSE · 2nd year", quote: "The daily structure made Python click for me. Streaks kept me honest." },
    { name: "Priya K.", role: "BCA · final year", quote: "Best free challenge I've joined. The dashboard is genuinely motivating." },
    { name: "Rohan M.", role: "12th passout", quote: "Started zero. Built my first project on Day 29. Worth every minute." },
  ];
  return (
    <section id="community" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="Community" title={<>Stories from <span className="grad-text">past cohorts</span></>} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <div key={t.name} className="glass glass-hover p-7">
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/80">"{t.quote}"</p>
              <div className="mt-6">
                <div className="font-display text-base font-bold">{t.name}</div>
                <div className="text-xs font-mono uppercase tracking-widest text-white/50">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <SectionHeader eyebrow="FAQ" title={<>Quick <span className="grad-text">answers</span></>} />
        <div className="mt-10 space-y-3">
          {FAQ.map((f, i) => (
            <button
              key={f.q}
              onClick={() => setOpen(open === i ? null : i)}
              className="glass w-full text-left p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-base font-bold md:text-lg">{f.q}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-white/60 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </div>
              {open === i && <p className="mt-3 text-sm text-white/70">{f.a}</p>}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
function FinalCTA() {
  const { user } = useAuth();
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="glass grad-border relative overflow-hidden p-10 text-center md:p-16">
          <div className="aurora" />
          <div className="relative">
            <Trophy className="mx-auto h-10 w-10 text-white" />
            <h2 className="mt-6 font-display text-4xl font-extrabold md:text-6xl">
              Your <span className="grad-text">30 days</span> start now.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Join hundreds of Indian students who are turning small daily reps into real Python skill.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to={user ? "/dashboard" : "/auth"} className="grad-btn inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest transition-transform hover:scale-105">
                Join Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/join" className="glass glass-hover inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-widest text-white">
                <Users className="h-4 w-4" /> Join Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Section Header ---------------- */
function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center">
      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">{eyebrow}</span>
      <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tighter md:text-6xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-sm text-white/70 md:text-base">{subtitle}</p>}
    </div>
  );
}
