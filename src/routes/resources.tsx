import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import { useState, useMemo } from "react";
import { ExternalLink, Search } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — EMO Learners" },
      { name: "description", content: "Curated AI tools, learning platforms, and resources for ambitious Indian students." },
      { property: "og:title", content: "Resources — EMO Learners" },
      { property: "og:description", content: "Curated AI tools, learning platforms, and resources for ambitious Indian students." },
    ],
  }),
  component: ResourcesPage,
});

type R = { name: string; cat: string; desc: string; url: string; tag?: string };

const resources: R[] = [
  { name: "ChatGPT", cat: "AI", desc: "The reasoning workhorse. Great for explanations, planning, and code review.", url: "https://chat.openai.com", tag: "Daily" },
  { name: "Claude", cat: "AI", desc: "Strong at long-context reasoning and writing. Free tier is generous.", url: "https://claude.ai" },
  { name: "Perplexity", cat: "AI", desc: "AI-powered research with citations. Better than Google for studying.", url: "https://perplexity.ai", tag: "Research" },
  { name: "Cursor", cat: "Coding", desc: "AI-first code editor. Pair-program with frontier models.", url: "https://cursor.sh" },
  { name: "GitHub Copilot", cat: "Coding", desc: "Free for verified students. Inline autocomplete and chat.", url: "https://github.com/features/copilot", tag: "Student Free" },
  { name: "Replit", cat: "Coding", desc: "Code in the browser. Free hosting for student projects.", url: "https://replit.com" },
  { name: "Notion AI", cat: "Productivity", desc: "Notes, docs, and a database — supercharged with AI.", url: "https://notion.so" },
  { name: "Obsidian", cat: "Productivity", desc: "Local-first notes with backlinks. Build a real second brain.", url: "https://obsidian.md" },
  { name: "freeCodeCamp", cat: "Learning", desc: "Free, certificate-backed courses on web dev, Python, and more.", url: "https://freecodecamp.org" },
  { name: "Hugging Face", cat: "AI", desc: "Open-source models, datasets, and demos. Where ML lives.", url: "https://huggingface.co" },
  { name: "Kaggle", cat: "Learning", desc: "Datasets, notebooks, and competitions. Win swag, learn fast.", url: "https://kaggle.com" },
  { name: "LeetCode", cat: "DSA", desc: "Daily problems for interviews and DSA practice.", url: "https://leetcode.com" },
  { name: "Excalidraw", cat: "Productivity", desc: "Hand-drawn diagrams in your browser. Free and open-source.", url: "https://excalidraw.com" },
  { name: "v0 by Vercel", cat: "AI", desc: "Generate React + Tailwind UI from prompts.", url: "https://v0.dev" },
  { name: "NPTEL", cat: "Learning", desc: "Free courses from IITs with certificates that count.", url: "https://nptel.ac.in", tag: "🇮🇳" },
  { name: "Unstop", cat: "Career", desc: "Internships, hackathons, and competitions for Indian students.", url: "https://unstop.com", tag: "🇮🇳" },
];

const categories = ["All", "AI", "Coding", "Learning", "Productivity", "DSA", "Career"] as const;

function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(
    () =>
      resources.filter((r) => {
        const matchesCat = cat === "All" || r.cat === cat;
        const q = query.toLowerCase();
        const matchesQ = !q || r.name.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q);
        return matchesCat && matchesQ;
      }),
    [query, cat],
  );

  return (
    <div className="min-h-screen">
      <Marquee />
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-12 pt-20">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-6xl">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// Directory</span>
          <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.85] tracking-tighter md:text-7xl">
            Resources <span className="italic text-primary">that ship.</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Hand-picked AI tools, learning platforms, and student-friendly products. No fluff, no sponsored junk.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resources…"
                className="w-full rounded-full border border-border bg-surface/60 px-11 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full border px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${
                    cat === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface/60 text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="group relative rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">{r.cat}</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <h3 className="mt-4 font-display text-xl font-extrabold uppercase">{r.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
                {r.tag && (
                  <span className="mt-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-primary">
                    {r.tag}
                  </span>
                )}
              </a>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-border bg-surface/30 p-12 text-center text-muted-foreground">
                Nothing matches that search yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
