import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Flame, Loader2, Sparkles, RefreshCw, Search, ArrowUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { callEmoIq, type AnalyzeResult, type PredictedQuestion } from "@/lib/emoiq/api";
import { PdfDropzone } from "@/components/site/PdfDropzone";

export const Route = createFileRoute("/emoiq/top32")({
  validateSearch: (s: Record<string, unknown>) => ({
    id: typeof s.id === "string" ? s.id : undefined,
  }),
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
  const [questions, setQuestions] = useState<PredictedQuestion[] | null>(null);
  const [unitFilter, setUnitFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"probability" | "marks" | "unit">("probability");
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
    setQuestions(null);
    try {
      let subj = subject;
      let analysisData: {
        weightage: unknown;
        topic_freq: unknown;
        year_trend: unknown;
      };
      let analysisId: string | null = null;

      if (mode === "saved") {
        const a = analyses.find((x) => x.id === selected);
        if (!a) {
          toast.error("Pick a saved analysis first");
          return;
        }
        subj = a.subject;
        analysisData = {
          weightage: a.weightage,
          topic_freq: a.topic_freq,
          year_trend: a.year_trend,
        };
        analysisId = a.id;
      } else {
        if (!subject.trim() || !text.trim()) {
          toast.error("Subject and PYQ text are required");
          return;
        }
        toast.info("Analyzing your PYQs…");
        const r = await callEmoIq<AnalyzeResult>("analyze", {
          subject,
          years,
          text,
        });
        analysisData = {
          weightage: r.weightage,
          topic_freq: r.topic_freq,
          year_trend: r.year_trend,
        };
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
      const qs = (r.questions ?? []).slice(0, 32);
      setQuestions(qs);
      setUnitFilter("All");

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

  const units = questions
    ? ["All", ...Array.from(new Set(questions.map((q) => q.unit)))]
    : [];
  const filtered = (() => {
    if (!questions) return [];
    const q = query.trim().toLowerCase();
    let list = unitFilter === "All" ? questions.slice() : questions.filter((x) => x.unit === unitFilter);
    if (q) {
      list = list.filter(
        (x) =>
          x.question.toLowerCase().includes(q) ||
          x.unit.toLowerCase().includes(q) ||
          (x.reason ?? "").toLowerCase().includes(q),
      );
    }
    const dir = sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      if (sortBy === "probability") return (a.probability - b.probability) * dir;
      if (sortBy === "marks") return (a.marks - b.marks) * dir;
      return a.unit.localeCompare(b.unit) * dir;
    });
    return list;
  })();

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
        <Flame className="h-3 w-3" /> AI · from your PYQs
      </div>
      <h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tighter md:text-5xl">
        Top 32 <span className="italic text-primary">Important</span> Questions
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Upload your past-year papers (or pick a saved analysis). EMoIQ analyses them and returns the 32 most important questions ranked by probability.
      </p>

      <div className="mt-8 inline-flex rounded-full border border-border bg-surface p-1 font-mono text-[11px] uppercase tracking-widest">
        <button
          onClick={() => setMode("upload")}
          className={`rounded-full px-4 py-2 transition-colors ${mode === "upload" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Upload PYQs
        </button>
        <button
          onClick={() => setMode("saved")}
          className={`rounded-full px-4 py-2 transition-colors ${mode === "saved" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          Use saved analysis
        </button>
      </div>

      {mode === "upload" ? (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="Subject (e.g. Operating Systems)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <input
              className="rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
              placeholder="Years covered (e.g. 2020–2024)"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
          <PdfDropzone
            label="Upload PYQ PDFs"
            hint="Drop one or more past-year paper PDFs. Text is extracted automatically."
            onText={(t) =>
              setText((prev) => {
                const base = prev;
                return t ? `${base}${base ? "\n\n" : ""}${t}` : base;
              })
            }
          />
          <textarea
            className="min-h-[200px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
            placeholder="Or paste past-year paper text here."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      ) : (
        <div className="mt-6">
          {!user ? (
            <p className="text-sm">
              <Link to="/auth" className="text-primary underline">Sign in</Link> to see saved analyses.
            </p>
          ) : analyses.length === 0 ? (
            <p className="text-sm">
              No saved analyses yet. Run one from{" "}
              <Link to="/emoiq/analyze" className="text-primary underline">Analyze PYQs</Link>{" "}
              or switch to Upload PYQs.
            </p>
          ) : (
            <select
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
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
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-transform hover:scale-[1.02] disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "Working…" : questions ? "Regenerate top 32" : "Generate top 32"}
      </button>

      {loading && !questions && (
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-surface/40" />
          ))}
        </div>
      )}

      {questions && questions.length > 0 && (
        <div className="mt-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="font-mono text-[11px] uppercase tracking-widest text-primary">
              // {filtered.length}/{questions.length} shown · sorted by {sortBy} {sortDir === "desc" ? "↓" : "↑"}
            </div>
            <button
              onClick={run}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions, units, reasoning…"
                className="w-full rounded-full border border-border bg-surface py-2 pl-10 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-full border border-border bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-widest outline-none focus:border-primary"
            >
              <option value="probability">Sort: Probability</option>
              <option value="marks">Sort: Marks</option>
              <option value="unit">Sort: Unit</option>
            </select>
            <button
              onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
              title={`Toggle direction (${sortDir === "desc" ? "descending" : "ascending"})`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:border-primary hover:text-primary"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              {sortDir === "desc" ? "Desc" : "Asc"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {units.map((u) => (
              <button
                key={u}
                onClick={() => setUnitFilter(u)}
                className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  unitFilter === u
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface/60 text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-6 rounded-2xl border border-dashed border-border bg-surface/40 p-6 text-center text-sm text-muted-foreground">
              No questions match your search. Try clearing filters or a different keyword.
            </p>
          )}

          <ol className="mt-5 grid gap-3 md:grid-cols-2">
            {filtered.map((q, i) => (
              <li key={i} className="rounded-2xl border border-border bg-surface/60 p-4 transition-colors hover:border-primary">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 rounded-md bg-primary/10 px-2 py-1 font-mono text-[10px] font-bold text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-medium leading-snug">{q.question}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
                    {Math.round(q.probability)}%
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded-full border border-border px-2 py-0.5 font-mono uppercase tracking-widest">{q.unit}</span>
                  <span className="rounded-full border border-border px-2 py-0.5 font-mono uppercase tracking-widest">{q.marks} marks</span>
                </div>
                {q.reason && <p className="mt-2 text-xs text-muted-foreground">Why: {q.reason}</p>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
