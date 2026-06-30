import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import { Heart, Target, Users, Rocket } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — EMO Learners" },
      { name: "description", content: "Why EMO Learners exists, who built it, and what we believe about learning." },
      { property: "og:title", content: "About — EMO Learners" },
      { property: "og:description", content: "Why EMO Learners exists, who built it, and what we believe about learning." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Marquee />
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-24 pt-20">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-3xl">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// About</span>
          <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.85] tracking-tighter md:text-7xl">
            We're here so <span className="italic text-primary">you build.</span>
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            EMO Learners started as a frustration. Most learning platforms in India are
            either overpriced, gatekept, or built for selling courses — not for actually
            getting students to ship real things.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            We're a community of students and builders who curate the best free
            resources, run challenges, surface real internships, and build quizzes
            and tests that actually teach. Everything stays free. Always.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto grid max-w-6xl gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: <Heart className="h-5 w-5" />, t: "Free forever", d: "No paywalls. No 'unlock with pro'. Funded by community." },
            { icon: <Target className="h-5 w-5" />, t: "Ship-first", d: "Every lesson ends with something you've actually built." },
            { icon: <Users className="h-5 w-5" />, t: "Student-led", d: "Built by students who know the Indian college grind." },
            { icon: <Rocket className="h-5 w-5" />, t: "Career-ready", d: "From DSA to LLMs to internships — placement-grade prep." },
          ].map((v) => (
            <div key={v.t} className="bg-surface/60 p-8 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {v.icon}
              </div>
              <h3 className="mt-5 font-display text-xl font-extrabold uppercase">{v.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-surface/40 to-background p-10 text-center backdrop-blur-sm md:p-16">
          <h2 className="font-display text-3xl font-extrabold uppercase italic md:text-5xl">Be part of the build.</h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Join 5,000+ ambitious students on Telegram. Resources, opportunities, and accountability.
          </p>
          <a href="https://t.me/emolarners" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-all hover:scale-105">
            Join Telegram →
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
