import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { callEmoIq, type PredictedQuestion } from "@/lib/emoiq/api";
import { PdfDropzone } from "@/components/site/PdfDropzone";

export const Route = createFileRoute("/emoiq/predict")({
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s.id === "string" ? s.id : undefined }),
  component: PredictPage,
});

type Analysis = { id: string; subject: string; weightage: unknown; topic_freq: unknown; year_trend: unknown; summary: string | null; created_at: string };

function PredictPage() {
  const { user } = useAuth();
  const { id } = Route.useSearch();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selected, setSelected] = useState<string | undefined>(id);
  const [loading, setLoading] = useState(false);
  const [qs, setQs] = useState<PredictedQuestion[] | null>(null);
  const [pdfContext, setPdfContext] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("pyq_analyses").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setAnalyses(data as Analysis[]);
    });
  }, [user]);

  async function predict() {
    const a = analyses.find((x) => x.id === selected);
    if (!a) {
      toast.error("Pick an analysis first");
      return;
    }
    setLoading(true);
    setQs(null);
    try {
      const r = await callEmoIq<{ questions: PredictedQuestion[] }>("predict", {
        subject: a.subject,
        analysis: { weightage: a.weightage, topic_freq: a.topic_freq, year_trend: a.year_trend },
      });
      setQs(r.questions ?? []);
      if (user) {
        await supabase.from("predicted_questions").insert(
          (r.questions ?? []).map((q) => ({
            user_id: user.id,
            analysis_id: a.id,
            question: q.question,
            probability: q.probability,
            unit: q.unit,
            marks: q.marks,
          }))
        );
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tighter md:text-5xl">
        Predict <span className="italic text-primary">Questions</span>
      </h1>
      <p className="mt-3 text-muted-foreground">Pick a saved analysis. EMoIQ ranks 10 likely questions with a probability score.</p>

      {!user ? (
        <p className="mt-6 text-sm">Sign in and run an analysis first.</p>
      ) : analyses.length === 0 ? (
        <p className="mt-6 text-sm">No analyses yet. Run one from <a className="text-primary underline" href="/emoiq/analyze">Analyze PYQs</a>.</p>
      ) : (
        <>
          <select
            className="mt-6 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
            value={selected ?? ""}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Select analysis…</option>
            {analyses.map((a) => (
              <option key={a.id} value={a.id}>{a.subject} — {new Date(a.created_at).toLocaleDateString()}</option>
            ))}
          </select>
          <button onClick={predict} disabled={loading || !selected} className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Predicting…" : "Predict top 10"}
          </button>
        </>
      )}

      {qs && (
        <ol className="mt-8 space-y-3">
          {qs.map((q, i) => (
            <li key={i} className="rounded-xl border border-border bg-surface/50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="font-bold">{i + 1}. {q.question}</div>
                <span className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
                  {Math.round(q.probability)}%
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Unit: {q.unit}</span>
                <span>·</span>
                <span>{q.marks} marks</span>
              </div>
              {q.reason && <p className="mt-2 text-xs text-muted-foreground">Why: {q.reason}</p>}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
