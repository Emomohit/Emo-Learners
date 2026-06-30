import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import { quizzes } from "@/lib/learn-data";
import { ArrowRight, Trophy } from "lucide-react";

export const Route = createFileRoute("/quizzes/")({
  head: () => ({
    meta: [
      { title: "Quizzes — EMO Learners" },
      { name: "description", content: "Topic-wise interactive quizzes with instant feedback and explanations." },
      { property: "og:title", content: "Quizzes — EMO Learners" },
      { property: "og:description", content: "Topic-wise interactive quizzes with instant feedback and explanations." },
    ],
  }),
  component: QuizzesIndex,
});

function QuizzesIndex() {
  return (
    <div className="min-h-screen">
      <Marquee />
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-12 pt-20">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-6xl">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// Practice</span>
          <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.85] tracking-tighter md:text-7xl">
            Quizzes <span className="italic text-primary">that teach.</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Short, focused rounds. Instant feedback after every answer with the why. Built for the bus, the break, the boring class.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((q) => (
            <Link
              key={q.slug}
              to="/quizzes/$slug"
              params={{ slug: q.slug }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-7 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary"
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl">{q.emoji}</span>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-primary">
                  {q.topic}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-extrabold uppercase">{q.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{q.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span><Trophy className="mr-1 inline h-3 w-3 text-primary" /> {q.questions.length} Q · {q.minutes} min</span>
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
