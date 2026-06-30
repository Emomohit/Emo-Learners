import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/internships")({
  head: () => ({
    meta: [
      { title: "Internships — EMO Learners" },
      { name: "description", content: "Curated tech internships for Indian students. Remote, paid, and skill-aligned." },
      { property: "og:title", content: "Internships — EMO Learners" },
      { property: "og:description", content: "Curated tech internships for Indian students. Remote, paid, and skill-aligned." },
    ],
  }),
  component: InternshipsPage,
});

const roles = [
  { title: "AI Research Intern", company: "Stealth Startup", loc: "Remote · India", type: "3 months", stipend: "₹25k/mo", tags: ["Python", "PyTorch", "LLMs"] },
  { title: "Frontend Engineer Intern", company: "Open Source Collective", loc: "Remote", type: "Part-time", stipend: "Unpaid · Letter", tags: ["React", "TypeScript"] },
  { title: "ML Engineer Intern", company: "FinTech Scale-up", loc: "Bengaluru", type: "6 months", stipend: "₹40k/mo", tags: ["Python", "MLOps"] },
  { title: "Data Analyst Intern", company: "D2C Brand", loc: "Mumbai · Hybrid", type: "3 months", stipend: "₹15k/mo", tags: ["SQL", "Excel"] },
  { title: "Backend Dev Intern", company: "Web3 Studio", loc: "Remote", type: "6 months", stipend: "₹30k/mo", tags: ["Node", "Postgres"] },
  { title: "Growth Intern", company: "EdTech (seed)", loc: "Remote", type: "3 months", stipend: "₹10k + equity", tags: ["Content", "SEO"] },
];

function InternshipsPage() {
  return (
    <div className="min-h-screen">
      <Marquee />
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-12 pt-20">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-6xl">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// Career</span>
          <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.85] tracking-tighter md:text-7xl">
            Real <span className="italic text-primary">internships.</span>
            <br /> Real growth.
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Curated opportunities at startups and scale-ups looking for Indian student talent. Updated weekly.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl space-y-4">
          {roles.map((r) => (
            <article key={r.title} className="group flex flex-col gap-6 rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur-sm transition-all hover:border-primary md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-extrabold uppercase">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.company}</p>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {r.loc}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {r.type}</span>
                    <span className="text-primary">{r.stipend}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.tags.map((t) => (
                      <span key={t} className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-all group-hover:scale-105">
                Apply <ArrowRight className="h-3 w-3" />
              </button>
            </article>
          ))}

          <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface/30 p-8 text-center text-sm text-muted-foreground">
            More opportunities drop every week. Join the Telegram for instant alerts.
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
