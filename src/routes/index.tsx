import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import {
  ArrowRight,
  Sparkles,
  Briefcase,
  Users,
  Brain,
  Code2,
  Trophy,
  Timer,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { quizzes, tests } from "@/lib/learn-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EMO Learners — Stop Wasting Time. Start Building." },
      { name: "description", content: "Free AI tools, study resources, quizzes, tests, and internships built for ambitious Indian students." },
      { property: "og:title", content: "EMO Learners — Stop Wasting Time. Start Building." },
      { property: "og:description", content: "Free AI tools, study resources, quizzes, tests, and internships built for ambitious Indian students." },
    ],
  }),
  component: Home,
});

function useCountdown(targetMs: number) {
  // Start at target so SSR and first client render match (all zeros), then tick on the client.
  const [now, setNow] = useState(targetMs);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  const diff = Math.max(0, targetMs - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

function Home() {
  // Next July 1 (challenge cohort) — computed once so identity is stable.
  const [targetMs] = useState(() => {
    const today = new Date();
    const y = today.getMonth() > 5 || (today.getMonth() === 5 && today.getDate() > 30) ? today.getFullYear() + 1 : today.getFullYear();
    return new Date(`${y}-07-01T00:00:00`).getTime();
  });
  const { d, h, m, s } = useCountdown(targetMs);

  return (
    <div className="relative min-h-screen">
      <Marquee />
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-32 pt-16 md:pt-24">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
          <div className="animate-rise inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
              Built for Indian Students
            </span>
          </div>

          <h1 className="animate-rise mt-10 font-display text-6xl font-extrabold uppercase leading-[0.85] tracking-tighter md:text-8xl lg:text-9xl" style={{ animationDelay: "80ms" }}>
            <span className="block drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">Stop Wasting</span>
            <span className="relative mt-2 block py-2 italic text-primary">
              Time.
              <span className="absolute -inset-4 -z-10 rounded-full bg-primary/20 blur-3xl" />
            </span>
            <span className="mt-4 block text-stroke">Start Building.</span>
          </h1>

          <p className="animate-rise mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "160ms" }}>
            AI tools, curated study resources, interactive quizzes, timed tests,
            and real internships — all free, all in one playground for ambitious
            builders.
          </p>

          <div className="animate-rise mt-10 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "240ms" }}>
            <Link to="/resources" className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-all hover:scale-105">
              Explore Resources
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/quizzes" className="inline-flex items-center gap-3 rounded-full border border-border bg-surface/60 px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-foreground backdrop-blur-sm transition-all hover:border-primary hover:text-primary">
              Try a Quiz
            </Link>
          </div>

          {/* Stat strip */}
          <div className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
            {[
              { k: "100%", v: "Free forever" },
              { k: "30", v: "Day Python challenge" },
              { k: "20+", v: "AI tools curated" },
              { k: "∞", v: "Resources" },
            ].map((it) => (
              <div key={it.v} className="bg-surface/60 px-6 py-7 backdrop-blur-sm">
                <div className="font-display text-3xl font-extrabold text-primary md:text-4xl">{it.k}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{it.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader tag="// What we offer" title="Everything you need. Nothing you don't." />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard num="01" icon={<Brain className="h-5 w-5" />} title="AI Tools" desc="The best AI tools that actually help students study faster and build better." to="/resources" />
            <FeatureCard num="02" icon={<Code2 className="h-5 w-5" />} title="Quizzes" desc="Topic-wise interactive quizzes with instant feedback and explanations." to="/quizzes" />
            <FeatureCard num="03" icon={<Timer className="h-5 w-5" />} title="Tests" desc="Timed mock tests with scoring, review mode, and a results breakdown." to="/tests" />
            <FeatureCard num="04" icon={<Briefcase className="h-5 w-5" />} title="Internships" desc="Curated internships built for Indian tech students. Real experience, real growth." to="/internships" />
            <FeatureCard num="05" icon={<Sparkles className="h-5 w-5" />} title="Courses" desc="Free Python, Java, and C — chaptered, with notes, snippets, and deep-linked videos." to="/courses" />
            <FeatureCard num="06" icon={<Users className="h-5 w-5" />} title="Community" desc="A Telegram full of builders sharing resources, opportunities, and accountability." to="/about" />
          </div>
        </div>
      </section>

      {/* CHALLENGE COUNTDOWN */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface/40 backdrop-blur-sm">
          <div className="grid gap-10 p-8 md:grid-cols-2 md:p-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                <Rocket className="h-3 w-3" /> Cohort 01
              </span>
              <h2 className="mt-5 font-display text-4xl font-extrabold uppercase italic leading-none tracking-tighter md:text-6xl">
                30 Day <br />
                <span className="text-primary">Python</span> Challenge
              </h2>
              <p className="mt-6 max-w-md text-muted-foreground">
                One problem a day. One project a week. Built with a community
                that ships. Starts July 1.
              </p>
              <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
                Reserve your seat <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { v: d, l: "Days" },
                { v: h, l: "Hours" },
                { v: m, l: "Minutes" },
                { v: s, l: "Seconds" },
              ].map((b) => (
                <div key={b.l} className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background/60 p-4 md:p-6">
                  <div className="font-display text-3xl font-extrabold tabular-nums text-primary md:text-5xl">{String(b.v).padStart(2, "0")}</div>
                  <div className="mt-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground md:text-[10px]">{b.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUIZ + TEST PREVIEW */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader tag="// Practice + Prove" title="Quizzes & Tests" />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface/40 p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-extrabold uppercase">Quizzes</h3>
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Short, instant-feedback rounds.</p>
              <div className="mt-6 space-y-3">
                {quizzes.slice(0, 3).map((q) => (
                  <Link key={q.slug} to="/quizzes/$slug" params={{ slug: q.slug }} className="group flex items-center justify-between rounded-xl border border-border bg-background/50 p-4 transition-all hover:border-primary">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{q.emoji}</span>
                      <div>
                        <div className="font-semibold">{q.title}</div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{q.questions.length} Q · {q.minutes} min</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
              <Link to="/quizzes" className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                All quizzes <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-surface/40 p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-extrabold uppercase">Tests</h3>
                <Timer className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Timed mock tests with full review.</p>
              <div className="mt-6 space-y-3">
                {tests.map((t) => (
                  <Link key={t.slug} to="/tests/$slug" params={{ slug: t.slug }} className="group flex items-center justify-between rounded-xl border border-border bg-background/50 p-4 transition-all hover:border-primary">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{t.emoji}</span>
                      <div>
                        <div className="font-semibold">{t.title}</div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t.questions.length} Q · {t.minutes} min</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
              <Link to="/tests" className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                All tests <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY EMO */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader tag="// Why EMO" title="Built different." />
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
            {[
              { t: "100% Free, no asterisks", d: "Every resource, quiz, and test — forever free. No paywalls hiding behind 'pro'." },
              { t: "Made for Indian students", d: "Curated for the realities of Indian colleges, placements, and timelines." },
              { t: "Ship-first mindset", d: "Less consumption, more building. Every lesson ends with something you make." },
            ].map((c) => (
              <div key={c.t} className="bg-surface/60 p-8 backdrop-blur-sm">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h4 className="mt-4 font-display text-xl font-extrabold uppercase">{c.t}</h4>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-surface/40 to-background p-12 text-center backdrop-blur-sm md:p-20">
          <h2 className="font-display text-4xl font-extrabold uppercase italic leading-none tracking-tighter md:text-6xl">
            Stop scrolling. <br />
            <span className="text-primary">Start shipping.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-muted-foreground">
            Join 5,000+ students who chose to build instead of doomscroll.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="https://instagram.com/emolearners" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-all hover:scale-105">
              Follow on Instagram <ArrowRight className="h-4 w-4" />
            </a>
            <a href="https://t.me/emolarners" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full border border-border bg-surface/60 px-8 py-4 text-sm font-bold uppercase tracking-widest text-foreground backdrop-blur-sm transition-all hover:border-primary hover:text-primary">
              Join Telegram
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">{tag}</span>
      <h2 className="font-display text-4xl font-extrabold uppercase leading-none tracking-tighter md:text-6xl">
        {title}
      </h2>
    </div>
  );
}

function FeatureCard({ num, icon, title, desc, to }: { num: string; icon: React.ReactNode; title: string; desc: string; to: string }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-8 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary"
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-xs font-bold tracking-widest text-muted-foreground">{num}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/60 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
          {icon}
        </span>
      </div>
      <h3 className="mt-8 font-display text-2xl font-extrabold uppercase">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary opacity-0 transition-opacity group-hover:opacity-100">
        Open <ArrowRight className="h-3 w-3" />
      </div>
    </Link>
  );
}
