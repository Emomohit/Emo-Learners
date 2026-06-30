import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import { Send, Instagram, Youtube, Linkedin, Mail, MessageCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join the Community — EMO Learners" },
      { name: "description", content: "Plug into the EMO Learners community. Telegram, Instagram, YouTube, LinkedIn — pick your platform." },
      { property: "og:title", content: "Join the Community — EMO Learners" },
      { property: "og:description", content: "Plug into the EMO Learners community. No signup. Just pick a platform and dive in." },
    ],
  }),
  component: JoinPage,
});

const platforms = [
  {
    icon: <Send className="h-6 w-6" />,
    name: "Telegram",
    tag: "Recommended",
    desc: "Daily resources, tips, discussions, and early announcements.",
    cta: "Join Telegram",
    href: "https://t.me/emolarners",
  },
  {
    icon: <Instagram className="h-6 w-6" />,
    name: "Instagram",
    tag: "30-Day Challenge",
    desc: "Daily Python videos starting July 1st — follow to get Day 1.",
    cta: "Follow @emolearners",
    href: "https://instagram.com/emolearners",
  },
  {
    icon: <Youtube className="h-6 w-6" />,
    name: "YouTube",
    tag: "Long-form",
    desc: "In-depth tutorials, full walkthroughs, and project builds.",
    cta: "Subscribe",
    href: "https://youtube.com/@emolearners",
  },
  {
    icon: <Linkedin className="h-6 w-6" />,
    name: "LinkedIn",
    tag: "Career",
    desc: "Career tips, professional network, and industry insights.",
    cta: "Connect",
    href: "https://linkedin.com/in/mohitahirwar",
  },
];

const perks = [
  { emoji: "🐍", title: "30 Days Python Challenge — July 1st", desc: "One free video per day, from zero to real projects. Don't miss Day 1." },
  { emoji: "🤖", title: "AI Tools Directory", desc: "Curated tools that actually help students work smarter." },
  { emoji: "🗺️", title: "Clear Learning Roadmaps", desc: "No more tutorial hell. Know exactly what to learn and in what order." },
  { emoji: "💼", title: "Internship Board — Coming Soon", desc: "Be first in line when we launch verified internship listings." },
];

function JoinPage() {
  return (
    <div className="min-h-screen">
      <Marquee />
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-16 pt-20">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// 100% Free · Always</span>
          <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.85] tracking-tighter md:text-7xl">
            Start your journey. <span className="italic text-primary">today.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            No signup form. No email required. Just choose where you want to plug in — and we'll see you on the other side.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {perks.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur-sm transition-colors hover:border-primary/60">
              <div className="text-3xl">{p.emoji}</div>
              <h3 className="mt-3 font-display text-lg font-extrabold uppercase tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// Pick your platform</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold uppercase italic md:text-4xl">Join where you're already active.</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              Each channel has different content — you can follow all of them.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-5 rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur-sm transition-all hover:border-primary"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {p.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl font-extrabold uppercase">{p.name}</h3>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-primary">
                      {p.tag}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-surface/40 to-background p-10 text-center backdrop-blur-sm">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// Or get in touch</span>
          <h2 className="mt-3 font-display text-2xl font-extrabold uppercase italic md:text-3xl">Talk to the founder.</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://t.me/Emomohit"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-primary hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" /> Message Mohit
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-transform hover:scale-105"
            >
              <Mail className="h-4 w-4" /> Contact Us
            </Link>
          </div>
          <div className="mt-8">
            <Link to="/" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
