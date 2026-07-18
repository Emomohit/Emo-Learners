import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import { Instagram, Send, Linkedin, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — EMO Learners" },
      { name: "description", content: "Meet Mohit Ahirwar and the story behind EMO Learners — a free platform built for Indian students by a student." },
      { property: "og:title", content: "About — EMO Learners" },
      { property: "og:description", content: "Meet the founder and the story behind EMO Learners." },
    ],
  }),
  component: AboutPage,
});

const story = [
  { emoji: "💡", title: "The Idea", desc: "What if there was one place that cut through the noise? No overpriced bootcamps. No 100-hour courses that teach nothing. Just clear roadmaps, real tools, and a community that pushes you forward." },
  { emoji: "🏗️", title: "The Build", desc: "EMO Learners is brand new — and that's exactly the point. We're building this in public, with the community, from the ground up. No fake numbers, no inflated claims. Just real work, starting now." },
  { emoji: "🐍", title: "The First Challenge", desc: "The 30 Days Python Challenge launches July 1st. One video every day, starting from zero. It's the first of many structured learning experiences we're building — completely free." },
  { emoji: "🎯", title: "The Goal", desc: "To make EMO Learners the #1 platform for Indian students who want to build real tech skills, get internships, and launch their careers — without spending a single rupee." },
];

const values = [
  { emoji: "🔓", title: "Open Access", desc: "Everything we build is free. Education shouldn't be locked behind money." },
  { emoji: "🛠️", title: "Practical First", desc: "We teach what gets you hired: real tools, real projects, real skills." },
  { emoji: "🧭", title: "No Noise", desc: "Clear roadmaps. Zero fluff. We respect your time." },
  { emoji: "🤝", title: "Community Over Competition", desc: "We grow faster when we grow together. The community is the product." },
  { emoji: "📣", title: "Honest Always", desc: "We're new. We'll tell you that. No fake numbers, no manufactured hype." },
  { emoji: "🚀", title: "Builder Mindset", desc: "We don't just teach you to study. We teach you to ship things." },
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Marquee />
      <Navbar />

      {/* Founder */}
      <section className="relative overflow-hidden px-4 pb-20 pt-20">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// The Founder</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tighter md:text-6xl">
              Meet <span className="italic text-primary">Mohit Ahirwar.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              A student who got tired of outdated syllabi, tutorial hell, and watching peers struggle to break into tech.
              So he decided to build the platform he wished he had — open, practical, and built for Indian students who
              want more than a degree.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="https://instagram.com/emolearners" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-primary hover:text-primary">
                <Instagram className="h-4 w-4" /> Instagram
              </a>
              <a href="https://t.me/emolarners" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-primary hover:text-primary">
                <Send className="h-4 w-4" /> Telegram
              </a>
              <a href="https://www.linkedin.com/in/mohit-ahirwar-12bb58386/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-primary hover:text-primary">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              <a href="https://mohitahirwarportfolio.vercel.app/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-transform hover:scale-105">
                <ExternalLink className="h-4 w-4" /> View Portfolio
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-surface/60 to-background p-8 backdrop-blur-sm">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="relative flex h-full flex-col justify-between">
                <span className="self-start rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                  🚀 Builder
                </span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">🧑‍💻 Founder</div>
                  <div className="mt-2 font-display text-3xl font-extrabold uppercase leading-none tracking-tight md:text-4xl">
                    Mohit<br />Ahirwar
                  </div>
                  <div className="mt-3 font-mono text-[11px] uppercase tracking-widest text-primary">EMO Learners</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// The Story</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase italic tracking-tighter md:text-5xl">
            Why EMO Learners exists.
          </h2>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            It started with a simple frustration: Indian students are smart, driven, and hungry to grow —
            but the resources available to them are either outdated, overpriced, or buried under an avalanche of noise.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {story.map((s) => (
              <div key={s.title} className="rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur-sm">
                <div className="text-3xl">{s.emoji}</div>
                <h3 className="mt-3 font-display text-xl font-extrabold uppercase">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-surface/40 to-background p-10 text-center backdrop-blur-sm md:p-16">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// Our Mission</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase italic tracking-tighter md:text-5xl">
            Make tech education actually work for Indian students.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            No gatekeeping. No paywalls. No fluff. Just clear paths, honest content,
            and a real community of builders — from day one.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// What We Stand For</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase italic tracking-tighter md:text-5xl">
            Our values.
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="bg-surface/60 p-8 backdrop-blur-sm">
                <div className="text-3xl">{v.emoji}</div>
                <h3 className="mt-4 font-display text-xl font-extrabold uppercase">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
