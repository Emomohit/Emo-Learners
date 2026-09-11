import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Flame, Loader2, Sparkles, RefreshCw, Search, ArrowUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { callEmoIq, type AnalyzeResult, type PredictedQuestion } from "@/lib/emoiq/api";
import { PdfDropzone } from "@/components/site/PdfDropzone";
import { TOP_QUESTIONS } from "@/lib/emoiq/top-questions";
import {
  DIFFICULTY_LEVELS,
  DIFFICULTY_META,
  deriveDifficulty,
  isDifficulty,
  type Difficulty,
} from "@/lib/emoiq/difficulty";

export const Route = createFileRoute("/emoiq/top32")({
  validateSearch: (s: Record<string, unknown>) => ({
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  head: () => {
    const title = "Top 32 Important Questions — EMoIQ";
    const description =
      "The 32 most important exam questions from your past-year papers, each tagged with a difficulty level and filterable by Easy to Advanced.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Top32Page,
});

type Analysis = {
  id: string;
  subject: string;
  weightage: unknown;
  topic_freq: unknown;
  year_trend: unknown;
  summary: string | null;
  created_at: string;
};

type RankedQuestion = PredictedQuestion & { difficulty: Difficulty };

/** Every question always carries exactly one level: AI value when valid, else complexity-derived. */
function withDifficulty(list: PredictedQuestion[]): RankedQuestion[] {
  return list.map((q) => ({
    ...q,
    difficulty: isDifficulty(q.difficulty) ? q.difficulty : deriveDifficulty(q),
  }));
}

const CURATED: RankedQuestion[] = TOP_QUESTIONS.map((q) => ({
  question: q.q,
  probability: q.probability,
  unit: q.unit,
  marks: q.marks,
  reason: `${q.subject} · repeated topic (${q.tags.join(", ")})`,
  difficulty: q.difficulty,
}));

function DifficultyBadge({ level }: { level: Difficulty }) {
  const meta = DIFFICULTY_META[level];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest ${meta.className}`}
    >
      <span aria-hidden>{meta.dot}</span>
      {meta.label}
    </span>
  );
}

function Top32Page() {
  const { user } = useAuth();
  const { id } = Route.useSearch();

  const [mode, setMode] = useState<"upload" | "saved">("upload");
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selected, setSelected] = useState<string | undefined>(id);

  const [subject, setSubject] = useState("");
  const [years, setYears] = useState("");
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<RankedQuestion[]>(CURATED);
  const [isAiResult, setIsAiResult] = useState(false);
  const [unitFilter, setUnitFilter] = useState<string>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | Difficulty>("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"probability" | "marks" | "unit" | "difficulty">("probability");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("pyq_analyses")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setAnalyses(data as Analysis[]);
      });
  }, [user]);

  useEffect(() => {
    if (id) setMode("saved");
  }, [id]);

  async function run() {
    setLoading(true);
    try {
      let subj = subject;
      let analysisData: { weightage: unknown; topic_freq: unknown; year_trend: unknown };
      let analysisId: string | null = null;

      if (mode === "saved") {
        const a = analyses.find((x) => x.id === selected);
        if (!a) {
          toast.error("Pick a saved analysis first");
          return;
        }
        subj = a.subject;
        analysisData = { weightage: a.weightage, topic_freq: a.topic_freq, year_trend: a.year_trend };
        analysisId = a.id;
      } else {
        if (!subject.trim() || !text.trim()) {
          toast.error("Subject and PYQ text are required");
          return;
        }
        toast.info("Analyzing your PYQs…");
        const r = await callEmoIq<AnalyzeResult>("analyze", { subject, years, text });
        analysisData = { weightage: r.weightage, topic_freq: r.topic_freq, year_trend: r.year_trend };
        if (user) {
          const { data } = await supabase
            .from("pyq_analyses")
            .insert({
              user_id: user.id,
              subject,
              weightage: r.weightage as never,
              topic_freq: r.topic_freq as never,
              year_trend: r.year_trend as never,
              summary: r.summary,
            })
            .select("id")
            .single();
          if (data) analysisId = data.id;
        }
      }

      toast.info("Ranking the top 32 questions…");
      const r = await callEmoIq<{ questions: PredictedQuestion[] }>("predict", {
        subject: subj,
        count: 32,
        analysis: analysisData,
      });
      const qs = withDifficulty((r.questions ?? []).slice(0, 32));
      setQuestions(qs);
      setIsAiResult(true);
      setUnitFilter("All");
      setDifficultyFilter("all");

      if (user && analysisId) {
        await supabase.from("predicted_questions").insert(
          qs.map((q) => ({
            user_id: user.id,
            analysis_id: analysisId,
            question: q.question,
            probability: q.probability,
            unit: q.unit,
            marks: q.marks,
          })),
        );
      }
      toast.success("Top 32 ready");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const units = useMemo(
    () => ["All", ...Array.from(new Set(questions.map((q) => q.unit)))],
    [questions],
  );

  const counts = useMemo(() => {
    const map = new Map<Difficulty, number>();
    for (const q of questions) map.set(q.difficulty, (map.get(q.difficulty) ?? 0) + 1);
    return map;
  }, [questions]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let list = questions.slice();
    if (unitFilter !== "All") list = list.filter((x) => x.unit === unitFilter);
    if (difficultyFilter !== "all") list = list.filter((x) => x.difficulty === difficultyFilter);
    if (needle) {
      list = list.filter(
        (x) =>
          x.question.toLowerCase().includes(needle) ||
          x.unit.toLowerCase().includes(needle) ||
          (x.reason ?? "").toLowerCase().includes(needle),
      );
    }
    const dir = sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      if (sortBy === "probability") return (a.probability - b.probability) * dir;
      if (sortBy === "marks") return (a.marks - b.marks) * dir;
      if (sortBy === "difficulty")
        return (
          (DIFFICULTY_LEVELS.indexOf(a.difficulty) - DIFFICULTY_LEVELS.indexOf(b.difficulty)) * dir
        );
      return a.unit.localeCompare(b.unit) * dir;
    });
    return list;
  }, [questions, unitFilter, difficultyFilter, query, sortBy, sortDir]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
        <Flame className="h-3 w-3 shrink-0" /> <span className="truncate">AI · from your PYQs</span>
      </div>
      <h1 className="mt-3 font-display text-[clamp(1.75rem,5vw,3rem)] font-bold leading-tight tracking-tighter">
        Top 32 <span className="grad-text">Important</span> Questions
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
        Every question carries a difficulty level — Easy, Medium, Moderate, Hard or Advanced. Upload
        your past-year papers (or pick a saved analysis) to replace this curated set with your own
        ranked 32.
      </p>

      <div className="mt-8 flex w-full max-w-full flex-wrap gap-1 rounded-2xl border border-border bg-surface p-1 font-mono text-[11px] uppercase tracking-widest sm:w-auto sm:rounded-full">
        <button
          onClick={() => setMode("upload")}
          className={`min-w-0 flex-1 rounded-full px-4 py-2 transition-colors sm:flex-none ${mode === "upload" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Upload PYQs
        </button>
        <button
          onClick={() => setMode("saved")}
          className={`min-w-0 flex-1 rounded-full px-4 py-2 transition-colors sm:flex-none ${mode === "saved" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Use saved analysis
        </button>
      </div>

      {mode === "upload" ? (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className="w-full min-w-0 rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="Subject (e.g. Operating Systems)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <input
              className="w-full min-w-0 rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="Years covered (e.g. 2020–2024)"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
          <PdfDropzone
            label="Upload PYQ PDFs"
            hint="Drop one or more past-year paper PDFs. Text is extracted automatically."
            onText={(t) =>
              setText((prev) => (t ? `${prev}${prev ? "\n\n" : ""}${t}` : prev))
            }
          />
          <textarea
            className="min-h-[200px] w-full min-w-0 rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="Or paste past-year paper text here."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      ) : (
        <div className="mt-6">
          {!user ? (
            <p className="text-sm">
              <Link to="/auth" className="text-primary underline">
                Sign in
              </Link>{" "}
              to see saved analyses.
            </p>
          ) : analyses.length === 0 ? (
            <p className="text-sm">
              No saved analyses yet. Run one from{" "}
              <Link to="/emoiq/analyze" className="text-primary underline">
                Analyze PYQs
              </Link>{" "}
              or switch to Upload PYQs.
            </p>
          ) : (
            <select
              className="w-full min-w-0 rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              value={selected ?? ""}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">Select saved analysis…</option>
              {analyses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.subject} — {new Date(a.created_at).toLocaleDateString()}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <button
        onClick={run}
        disabled={loading}
        className="btn-grad mt-6 inline-flex max-w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-transform hover:scale-[1.02] disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "Working…" : isAiResult ? "Regenerate top 32" : "Generate top 32"}
      </button>

      {loading && (
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="panel h-24 animate-pulse" />
          ))}
        </div>
      )}

      <div className="mt-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 font-mono text-[11px] uppercase tracking-widest text-primary">
            // {filtered.length}/{questions.length} shown · {isAiResult ? "your PYQs" : "curated set"}{" "}
            · sorted by {sortBy} {sortDir === "desc" ? "↓" : "↑"}
          </div>
          <button
            onClick={run}
            disabled={loading}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50"
          >
            <RefreshCw className="h-3 w-3" /> Refresh
          </button>
        </div>

        {/* Difficulty filter — scrolls on small screens, never widens the page. */}
        <div className="-mx-4 mt-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            <button
              onClick={() => setDifficultyFilter("all")}
              className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${
                difficultyFilter === "all"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface/60 text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              All ({questions.length})
            </button>
            {DIFFICULTY_LEVELS.map((level) => {
              const meta = DIFFICULTY_META[level];
              const active = difficultyFilter === level;
              return (
                <button
                  key={level}
                  onClick={() => setDifficultyFilter(level)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : `${meta.className} hover:border-primary`
                  }`}
                >
                  <span aria-hidden>{meta.dot}</span> {meta.label} ({counts.get(level) ?? 0})
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="relative min-w-0 sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions, units, reasoning…"
              className="w-full min-w-0 rounded-full border border-border bg-surface py-2 pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="min-w-0 rounded-full border border-border bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-widest outline-none focus:border-primary"
          >
            <option value="probability">Sort: Probability</option>
            <option value="marks">Sort: Marks</option>
            <option value="difficulty">Sort: Difficulty</option>
            <option value="unit">Sort: Unit</option>
          </select>
          <button
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            title={`Toggle direction (${sortDir === "desc" ? "descending" : "ascending"})`}
            className="inline-flex min-w-0 items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary"
          >
            <ArrowUpDown className="h-3.5 w-3.5 shrink-0" />
            {sortDir === "desc" ? "Desc" : "Asc"}
          </button>
        </div>

        {units.length > 2 && (
          <div className="-mx-4 mt-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0">
            <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
              {units.map((u) => (
                <button
                  key={u}
                  onClick={() => setUnitFilter(u)}
                  className={`shrink-0 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    unitFilter === u
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface/60 text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <p className="mt-6 rounded-2xl border border-dashed border-border bg-surface/40 p-6 text-center text-sm text-muted-foreground">
            No questions match this filter. Try another difficulty level or clear the search.
          </p>
        )}

        <ol className="mt-5 grid gap-3 sm:grid-cols-2">
          {filtered.map((q, i) => (
            <li key={`${q.question}-${i}`} className="panel min-w-0 p-4 transition-colors hover:border-primary">
              <div className="flex items-start justify-between gap-2">
                <span className="shrink-0 rounded-md bg-primary/10 px-2 py-1 font-mono text-[10px] font-bold text-primary">
                  Q{String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-wrap items-center justify-end gap-1.5">
                  <DifficultyBadge level={q.difficulty} />
                  <span className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
                    {Math.round(q.probability)}%
                  </span>
                </div>
              </div>
              <p className="mt-3 break-words text-[clamp(0.875rem,2.6vw,0.95rem)] font-medium leading-snug">
                {q.question}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                <span className="rounded-full border border-border px-2 py-0.5 font-mono uppercase tracking-widest">
                  {q.unit}
                </span>
                <span className="rounded-full border border-border px-2 py-0.5 font-mono uppercase tracking-widest">
                  {q.marks} marks
                </span>
              </div>
              {q.reason && (
                <p className="mt-2 break-words text-xs text-muted-foreground">Why: {q.reason}</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
