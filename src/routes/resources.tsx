import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Marquee } from "@/components/site/Marquee";
import { Footer } from "@/components/site/Footer";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Search, FileText, BookOpen, Download, ChevronRight, Sparkles, GraduationCap, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — EMO Learners" },
      { name: "description", content: "B.Tech notes, PYQs, syllabus & AI tools for CSE, CSE-IT, CSE-CY, and AIML students." },
    ],
  }),
  component: ResourcesPage,
});

type Branch = "CSE" | "CSE-IT" | "CSE-CY" | "AIML";
const BRANCHES: { code: Branch; label: string }[] = [
  { code: "CSE", label: "CSE" },
  { code: "CSE-IT", label: "CSE-IT" },
  { code: "CSE-CY", label: "CSE-CY" },
  { code: "AIML", label: "AIML" },
];

type Subject = { id: string; branch: Branch; semester: number; code: string; name: string };
type Resource = {
  id: string;
  subject_id: string;
  kind: "notes" | "pyq" | "syllabus" | "important_qs";
  title: string;
  description: string | null;
  file_path: string;
  year: number | null;
  created_at: string;
};

const KIND_LABEL: Record<Resource["kind"], string> = {
  notes: "Notes",
  pyq: "PYQ",
  syllabus: "Syllabus",
  important_qs: "Imp Qs",
};

type AiTool = { name: string; cat: string; desc: string; url: string; tag?: string };
const aiTools: AiTool[] = [
  { name: "ChatGPT", cat: "AI", desc: "The reasoning workhorse. Great for explanations, planning, and code review.", url: "https://chat.openai.com", tag: "Daily" },
  { name: "Claude", cat: "AI", desc: "Strong at long-context reasoning and writing.", url: "https://claude.ai" },
  { name: "Perplexity", cat: "AI", desc: "AI research with citations. Better than Google for studying.", url: "https://perplexity.ai", tag: "Research" },
  { name: "Cursor", cat: "Coding", desc: "AI-first code editor. Pair-program with frontier models.", url: "https://cursor.sh" },
  { name: "GitHub Copilot", cat: "Coding", desc: "Free for verified students. Inline autocomplete and chat.", url: "https://github.com/features/copilot", tag: "Student Free" },
  { name: "Replit", cat: "Coding", desc: "Code in the browser. Free hosting for student projects.", url: "https://replit.com" },
  { name: "Notion AI", cat: "Productivity", desc: "Notes, docs, and a database — supercharged with AI.", url: "https://notion.so" },
  { name: "Obsidian", cat: "Productivity", desc: "Local-first notes with backlinks.", url: "https://obsidian.md" },
  { name: "freeCodeCamp", cat: "Learning", desc: "Free, certificate-backed courses.", url: "https://freecodecamp.org" },
  { name: "Hugging Face", cat: "AI", desc: "Open-source models, datasets, and demos.", url: "https://huggingface.co" },
  { name: "Kaggle", cat: "Learning", desc: "Datasets, notebooks, competitions.", url: "https://kaggle.com" },
  { name: "LeetCode", cat: "DSA", desc: "Daily problems for interviews.", url: "https://leetcode.com" },
  { name: "Excalidraw", cat: "Productivity", desc: "Hand-drawn diagrams in your browser.", url: "https://excalidraw.com" },
  { name: "v0 by Vercel", cat: "AI", desc: "Generate React + Tailwind UI from prompts.", url: "https://v0.dev" },
  { name: "NPTEL", cat: "Learning", desc: "Free courses from IITs with certificates.", url: "https://nptel.ac.in", tag: "🇮🇳" },
  { name: "Unstop", cat: "Career", desc: "Internships, hackathons, competitions.", url: "https://unstop.com", tag: "🇮🇳" },
];
const aiCats = ["All", "AI", "Coding", "Learning", "Productivity", "DSA", "Career"] as const;

function ResourcesPage() {
  const [tab, setTab] = useState<"academics" | "ai">("academics");

  return (
    <div className="min-h-screen">
      <Marquee />
      <Navbar />

      <section className="relative overflow-hidden px-4 pb-8 pt-16">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <div className="pointer-events-none absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-6xl">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// Study Hub</span>
          <h1 className="mt-4 font-display text-5xl font-extrabold uppercase leading-[0.85] tracking-tighter md:text-7xl">
            Everything you need <span className="italic text-primary">to top your sems.</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Branch-wise notes, PYQs, and syllabus for CSE, CSE-IT, CSE-CY, and AIML — plus a curated AI tools directory.
          </p>

          <div className="mt-8 inline-flex rounded-full border border-border bg-surface/60 p-1 backdrop-blur">
            <button
              onClick={() => setTab("academics")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                tab === "academics" ? "bg-primary text-primary-foreground shadow-brand" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" /> Academics
            </button>
            <button
              onClick={() => setTab("ai")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                tab === "ai" ? "bg-primary text-primary-foreground shadow-brand" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> AI Tools
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          {tab === "academics" ? <Academics /> : <AiToolsDirectory />}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Academics() {
  const { user } = useAuth();
  const [branch, setBranch] = useState<Branch>("CSE");
  const [semester, setSemester] = useState<number>(1);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("subjects")
        .select("*")
        .eq("branch", branch)
        .eq("semester", semester)
        .order("code");
      setSubjects((data ?? []) as Subject[]);
      setActiveSubject(null);
      setResources([]);
      setLoading(false);
    })();
  }, [branch, semester]);

  useEffect(() => {
    if (!activeSubject || !user) {
      setResources([]);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("resources")
        .select("*")
        .eq("subject_id", activeSubject.id)
        .order("created_at", { ascending: false });
      setResources((data ?? []) as Resource[]);
    })();
  }, [activeSubject]);

  const filteredSubjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter(
      (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
    );
  }, [subjects, search]);

  const download = async (path: string) => {
    if (!user) {
      toast.error("Sign in to download resources");
      return;
    }
    const { data, error } = await supabase.storage
      .from("study-materials")
      .createSignedUrl(path, 60 * 10);
    if (error || !data?.signedUrl) {
      toast.error("Couldn't fetch file");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subject or code…"
            className="w-full rounded-full border border-border bg-surface/60 px-11 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {BRANCHES.map((b) => (
            <button
              key={b.code}
              onClick={() => setBranch(b.code)}
              className={`rounded-full border px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${
                branch === b.code
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface/60 text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
          <button
            key={s}
            onClick={() => setSemester(s)}
            className={`rounded-lg border px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest transition-all ${
              semester === s
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-surface/40 text-muted-foreground hover:border-primary"
            }`}
          >
            Sem {s}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            // {branch} · Sem {semester} · {filteredSubjects.length} subjects
          </h3>
          <div className="mt-3 space-y-2">
            {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
            {!loading && filteredSubjects.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-surface/30 p-6 text-center text-sm text-muted-foreground">
                No subjects match.
              </div>
            )}
            {filteredSubjects.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSubject(s)}
                className={`group flex w-full items-center justify-between rounded-xl border bg-surface/40 px-4 py-3 text-left transition-all hover:border-primary ${
                  activeSubject?.id === s.id ? "border-primary" : "border-border"
                }`}
              >
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">{s.code}</div>
                  <div className="font-semibold">{s.name}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </button>
            ))}
          </div>
        </div>

        <div>
          {!activeSubject && (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/30 p-10 text-center">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">Pick a subject to see notes, PYQs and syllabus.</p>
            </div>
          )}
          {activeSubject && (
            <div className="rounded-2xl border border-border bg-surface/40 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">{activeSubject.code}</div>
                  <h3 className="mt-1 font-display text-2xl font-extrabold uppercase">{activeSubject.name}</h3>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {!user && (
                  <div className="rounded-xl border border-dashed border-border bg-background/40 p-6 text-center">
                    <p className="text-sm text-muted-foreground">Sign in to view notes, PYQs and syllabus files.</p>
                    <Link to="/auth" className="mt-2 inline-block text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                      Go to login
                    </Link>
                  </div>
                )}
                {user && resources.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border bg-background/40 p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      No materials uploaded yet for this subject.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Admin uploads from <Link to="/admin" className="text-primary hover:underline">/admin</Link>.
                    </p>
                  </div>
                )}
                {resources.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-primary">{KIND_LABEL[r.kind]}</span>
                          {r.year && <span className="font-mono text-[9px] text-muted-foreground">· {r.year}</span>}
                        </div>
                        <div className="font-semibold">{r.title}</div>
                        {r.description && <p className="text-xs text-muted-foreground">{r.description}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => download(r.file_path)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-brand"
                    >
                      {user ? <Download className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      {user ? "Download" : "Login"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AiToolsDirectory() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof aiCats)[number]>("All");
  const filtered = useMemo(
    () =>
      aiTools.filter((r) => {
        const matchesCat = cat === "All" || r.cat === cat;
        const q = query.toLowerCase();
        const matchesQ = !q || r.name.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q);
        return matchesCat && matchesQ;
      }),
    [query, cat],
  );
  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            className="w-full rounded-full border border-border bg-surface/60 px-11 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {aiCats.map((c) => (
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
  );
}
