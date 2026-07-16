import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { callEmoIq, type AnalyzeResult, type PredictedQuestion } from "@/lib/emoiq/api";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Flame, Loader2, Sparkles } from "lucide-react";
import { PdfDropzone } from "@/components/site/PdfDropzone";

export const Route = createFileRoute("/emoiq/analyze")({
  component: AnalyzePage,
});

const priorityColor: Record<string, string> = {
  HIGH: "text-red-400 border-red-400/40 bg-red-400/10",
  MEDIUM: "text-yellow-300 border-yellow-300/40 bg-yellow-300/10",
  LOW: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
};

function AnalyzePage() {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [years, setYears] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  async function generateTop32(analysisResult: AnalyzeResult, analysisId: string | null) {
    setTop32Loading(true);
    setTop32(null);
    try {
      const r = await callEmoIq<{ questions: PredictedQuestion[] }>("predict", {
        subject,
        count: 32,
        analysis: {
          weightage: analysisResult.weightage,
          topic_freq: analysisResult.topic_freq,
          year_trend: analysisResult.year_trend,
        },
      });
      const qs = (r.questions ?? []).slice(0, 32);
      setTop32(qs);
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
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setTop32Loading(false);
    }
  }

  async function analyze() {
    if (!subject.trim() || !text.trim()) {
      toast.error("Subject and paper text are required");
      return;
    }
    setLoading(true);
    setResult(null);
    setSavedId(null);
    setTop32(null);
    try {
      const r = await callEmoIq<AnalyzeResult>("analyze", { subject, years, text });
      setResult(r);
      let newId: string | null = null;
      if (user) {
        const { data, error } = await supabase
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
        if (!error && data) {
          setSavedId(data.id);
          newId = data.id;
        }
      }
      toast.success("Analysis ready · generating Top 32 questions");
      void generateTop32(r, newId);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tighter md:text-5xl">
        Analyze <span className="italic text-primary">PYQs</span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Paste the text of your past-year papers. EMoIQ finds units, weightage, and yearly trends.
      </p>

      {!user && (
        <div className="mt-6 rounded-xl border border-border bg-surface/60 p-4 text-sm">
          <Link to="/auth" className="font-bold text-primary underline">Sign in</Link> to save analyses to your account.
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
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
      <div className="mt-4">
        <PdfDropzone
          label="Upload PYQ PDFs (optional)"
          hint="Drop one or more past-year paper PDFs. Text is extracted and added below."
          onText={(t) => setText((prev) => {
            const marker = "\n\n--- ";
            const base = prev.split(marker)[0];
            return t ? `${base}${base ? "\n\n" : ""}${t}` : base;
          })}
        />
      </div>
      <textarea
        className="mt-4 min-h-[240px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
        placeholder="Paste past-year paper text here — or upload PDFs above."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={analyze}
        disabled={loading}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-transform hover:scale-[1.02] disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "Analyzing…" : "Run analysis"}
      </button>

      {result && (
        <div className="mt-10 space-y-8">
          <div className="rounded-2xl border border-border bg-surface/60 p-6">
            <div className="font-mono text-[11px] uppercase tracking-widest text-primary">// Summary</div>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{result.summary}</p>
            {savedId && (
              <Link to="/emoiq/predict" search={{ id: savedId } as never} className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground">
                Predict questions from this →
              </Link>
            )}
          </div>

          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-primary">// Unit Weightage</div>
            <div className="mt-3 space-y-2">
              {result.weightage?.map((w, i) => (
                <div key={i} className="rounded-xl border border-border bg-surface/40 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold">{w.unit}</div>
                    <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${priorityColor[w.priority] ?? ""}`}>
                      {w.priority} · {w.percent}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, w.percent)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-primary">// Top Topics</div>
              <ul className="mt-3 space-y-2 text-sm">
                {result.topic_freq?.map((t, i) => (
                  <li key={i} className="flex items-center justify-between rounded-lg border border-border bg-surface/40 px-3 py-2">
                    <span>{t.topic} <span className="text-xs text-muted-foreground">({t.unit})</span></span>
                    <span className="font-mono text-xs text-primary">×{t.count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-primary">// Year Trends</div>
              <ul className="mt-3 space-y-2 text-sm">
                {result.year_trend?.map((y, i) => (
                  <li key={i} className="rounded-lg border border-border bg-surface/40 px-3 py-2">
                    <div className="font-bold">{y.year}</div>
                    <div className="text-xs text-muted-foreground">{y.top_topics?.join(" · ")}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-primary/40 bg-primary/5 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                  <Flame className="h-3 w-3" /> Top 32 · from your analysis
                </div>
                <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tighter md:text-3xl">
                  32 Most <span className="italic text-primary">Important</span> Questions
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Ranked from the PYQs you uploaded — high-weightage units and repeat topics first.
                </p>
              </div>
              <button
                onClick={() => result && generateTop32(result, savedId)}
                disabled={top32Loading}
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
              >
                {top32Loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                {top32Loading ? "Generating…" : top32 ? "Regenerate" : "Generate Top 32"}
              </button>
            </div>

            {top32Loading && !top32 && (
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-20 animate-pulse rounded-xl border border-border bg-surface/40" />
                ))}
              </div>
            )}

            {top32 && top32.length > 0 && (() => {
              const units = ["All", ...Array.from(new Set(top32.map((q) => q.unit)))];
              const list = subjectFilter === "All" ? top32 : top32.filter((q) => q.unit === subjectFilter);
              return (
                <>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {units.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSubjectFilter(s)}
                        className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                          subjectFilter === s
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-surface/60 text-muted-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <ol className="mt-4 grid gap-3 md:grid-cols-2">
                    {list.map((q, i) => (
                      <li key={i} className="rounded-xl border border-border bg-surface/60 p-4">
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
                </>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
}
