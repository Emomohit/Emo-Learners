import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import { tests } from "@/lib/learn-data";
import { ArrowRight, Timer } from "lucide-react";

export const Route = createFileRoute("/tests/")({
  head: () => ({
    meta: [
      { title: "Tests — EMO Learners" },
      { name: "description", content: "Timed mock tests with scoring and a full review breakdown." },
      { property: "og:title", content: "Tests — EMO Learners" },
      { property: "og:description", content: "Timed mock tests with scoring and a full review breakdown." },
    ],
  }),
  component: TestsIndex,
});

function TestsIndex() {
  return (
    <div className="min-h-screen">
      <Marquee />
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-12 pt-20">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-6xl">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// Prove</span>
          <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.85] tracking-tighter md:text-7xl">
            Tests <span className="italic text-primary">under pressure.</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Longer, timed, and unforgiving. Score, review every answer, and learn where you actually stand.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((t) => (
            <Link
              key={t.slug}
              to="/tests/$slug"
              params={{ slug: t.slug }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-7 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary"
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl">{t.emoji}</span>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-primary">
                  {t.topic}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-extrabold uppercase">{t.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span><Timer className="mr-1 inline h-3 w-3 text-primary" /> {t.questions.length} Q · {t.minutes} min</span>
                <span className="inline-flex items-center gap-1 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Start <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
