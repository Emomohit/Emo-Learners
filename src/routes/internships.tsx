import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import { CheckCircle2, Target, Sparkles, Send, Instagram } from "lucide-react";

export const Route = createFileRoute("/internships")({
  head: () => ({
    meta: [
      { title: "Internships — EMO Learners" },
      { name: "description", content: "Verified, skill-matched internships for Indian students. Launching soon — join Telegram for first access." },
      { property: "og:title", content: "Internships — EMO Learners" },
      { property: "og:description", content: "Verified, skill-matched internships for Indian students. Launching soon." },
    ],
  }),
  component: InternshipsPage,
});

const promises = [
  {
    icon: <CheckCircle2 className="h-6 w-6" />,
    title: "Verified Listings",
    desc: "Every opportunity will be checked and confirmed before it goes live.",
    badge: "Coming Soon",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Skill-Matched",
    desc: "Opportunities matched to what you're actually learning on this platform.",
    badge: "Coming Soon",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Always Free",
    desc: "No fees, no “premium access”. Free for every student on EMO Learners.",
    badge: "Always",
  },
];

function InternshipsPage() {
  return (
    <div className="min-h-screen">
      <Marquee />
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-16 pt-20">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Launching Soon
          </span>
          <h1 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.85] tracking-tighter md:text-7xl">
            Intern<span className="italic text-primary">ships.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            We're curating real internship opportunities for students who've built real skills.
            Not generic job boards — verified, current, and matched to what you've been learning.
          </p>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground">
            Be the first to know when we launch →
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://t.me/emolarners"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-transform hover:scale-105"
            >
              <Send className="h-4 w-4" /> Join Telegram for Updates
            </a>
            <a
              href="https://instagram.com/emolearners"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-primary hover:text-primary"
            >
              <Instagram className="h-4 w-4" /> Follow @emolearners
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {promises.map((p) => (
            <div key={p.title} className="relative rounded-2xl border border-border bg-surface/40 p-7 backdrop-blur-sm transition-colors hover:border-primary/60">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {p.icon}
              </div>
              <h3 className="mt-5 font-display text-xl font-extrabold uppercase">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              <span className="mt-5 inline-block rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
                {p.badge}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-border bg-surface/30 p-10 text-center">
          <h2 className="font-display text-2xl font-extrabold uppercase italic md:text-3xl">
            In the meantime — <span className="text-primary">build skills.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            The students who get hired aren't the ones with the longest resumes. They're the ones who ship.
            Start the 30-Day Python Challenge and stack real projects.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
