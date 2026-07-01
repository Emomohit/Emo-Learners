import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import { quizzes, tests } from "@/lib/learn-data";
import { ArrowRight, Trophy, Timer, Flame } from "lucide-react";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice — Quizzes, Tests & 30-Day Python | EMO Learners" },
      { name: "description", content: "One place to practice: short quizzes with instant answers, timed mock tests, and the 30-day Python challenge." },
      { property: "og:title", content: "Practice — EMO Learners" },
      { property: "og:description", content: "Quizzes, tests, and the 30-day Python challenge — all in one place." },
      { property: "og:url", content: "https://emotion-spark-unlimited.lovable.app/practice" },
    ],
    links: [{ rel: "canonical", href: "https://emotion-spark-unlimited.lovable.app/practice" }],
  }),
  component: PracticePage,
});

type Tab = "quizzes" | "tests" | "challenge";

function PracticePage() {
  const [tab, setTab] = useState<Tab>("quizzes");

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <Marquee />
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-8 pt-16">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-6xl">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
            // Practice
          </span>
          <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.85] tracking-tighter md:text-7xl">
            Learn by <span className="italic text-primary">doing.</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Short quizzes with instant answers, timed mock tests, and a daily habit that
            turns 30 days of small steps into your first Python project.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div
          role="tablist"
          aria-label="Practice types"
          className="flex flex-wrap gap-2 border-b border-border pb-1"
        >
          {[
            { id: "quizzes", label: "Quizzes", count: `${quizzes.length}` },
            { id: "tests", label: "Timed tests", count: `${tests.length}` },
            { id: "challenge", label: "30-day Python", count: "New" },
          ].map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id as Tab)}
              className={`inline-flex items-center gap-2 rounded-t-lg px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                tab === t.id
                  ? "border-b-2 border-primary bg-surface/40 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              <span className="rounded-full border border-border bg-background/60 px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {tab === "quizzes" && (
          <div>
            <p className="mb-6 text-sm text-muted-foreground">
              Small rounds of 5–10 questions. Answer, and see the correct answer with a short
              explanation right after.
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((q) => (
                <Link
                  key={q.slug}
                  to="/quizzes/$slug"
                  params={{ slug: q.slug }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-6 transition-all hover:-translate-y-1 hover:border-primary"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl" aria-hidden="true">{q.emoji}</span>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-primary">
                      {q.topic}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-extrabold uppercase">{q.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{q.description}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span>
                      <Trophy className="mr-1 inline h-3 w-3 text-primary" />
                      {q.questions.length} Q · {q.minutes} min
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Start <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {tab === "tests" && (
          <div>
            <p className="mb-6 text-sm text-muted-foreground">
              Timed. Real exam-style. You see your score and a full answer key at the end.
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tests.map((t) => (
                <Link
                  key={t.slug}
                  to="/tests/$slug"
                  params={{ slug: t.slug }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-6 transition-all hover:-translate-y-1 hover:border-primary"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl" aria-hidden="true">{t.emoji}</span>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-primary">
                      {t.topic}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-extrabold uppercase">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span>
                      <Timer className="mr-1 inline h-3 w-3 text-primary" />
                      {t.questions.length} Q · {t.minutes} min
                    </span>
                    <span className="inline-flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Start test <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {tab === "challenge" && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-surface/40 p-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                <Flame className="h-3 w-3" /> 30 days · Free
              </span>
              <h2 className="mt-5 font-display text-4xl font-extrabold uppercase italic leading-none tracking-tighter md:text-5xl">
                30-Day <span className="text-primary">Python</span> Challenge
              </h2>
              <p className="mt-6 text-muted-foreground">
                A small step every day. Watch a short lesson, read the notes, try the exercise.
                In 30 days you go from zero Python to a first project you can show off.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>• Video lesson, notes, and code for each day</li>
                <li>• Streak tracker so you don't break the habit</li>
                <li>• A certificate preview when you finish</li>
                <li>• Community of learners doing it with you</li>
              </ul>
              <Link
                to="/challenge"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand"
              >
                Open the challenge <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-surface/40 to-background p-8">
              <h3 className="font-display text-2xl font-extrabold uppercase">Why 30 days?</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Most students give up in the first week because they try to learn too much
                at once. This challenge is built the other way — small daily steps, one topic
                a day, so you keep showing up.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { k: "1 hr", v: "Per day" },
                  { k: "30", v: "Lessons" },
                  { k: "1", v: "Real project" },
                ].map((s) => (
                  <div key={s.v} className="rounded-xl border border-border bg-background/60 p-4 text-center">
                    <div className="font-display text-2xl font-extrabold text-primary">{s.k}</div>
                    <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
