import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, CheckCircle2, XCircle, Brain } from "lucide-react";
import { callEmoIq, type QuizQuestion } from "@/lib/emoiq/api";

export const Route = createFileRoute("/placement/aptitude")({
  component: AptitudePage,
});

const categories = [
  { label: "Quantitative", topics: ["percentages", "ratios", "time and work", "profit and loss", "averages"] },
  { label: "Logical Reasoning", topics: ["series", "coding-decoding", "blood relations", "syllogisms", "puzzles"] },
  { label: "Verbal", topics: ["synonyms", "antonyms", "reading comprehension", "sentence correction"] },
  { label: "Data Interpretation", topics: ["tables", "bar charts", "pie charts", "line graphs"] },
] as const;

function AptitudePage() {
  const [cat, setCat] = useState<typeof categories[number]["label"]>("Quantitative");
  const [loading, setLoading] = useState(false);
  const [qs, setQs] = useState<QuizQuestion[] | null>(null);
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  async function generate() {
    setLoading(true);
    setQs(null); setPicks({}); setSubmitted(false);
    try {
      const topics = categories.find((c) => c.label === cat)?.topics ?? [];
      const r = await callEmoIq<{ questions: QuizQuestion[] }>("quiz", {
        subject: `Aptitude — ${cat}`,
        topics,
      });
      setQs(r.questions ?? []);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function submit() {
    if (!qs) return;
    setSubmitted(true);
    const score = qs.reduce((s, q, i) => s + (picks[i] === q.answer ? 1 : 0), 0);
    toast.success(`Score: ${score} / ${qs.length}`);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-primary" />
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tighter md:text-5xl">
          Aptitude <span className="italic text-primary">Quiz</span>
        </h1>
      </div>
      <p className="mt-3 text-muted-foreground">Pick a category. AI generates a fresh 10-question set every time.</p>

      {!qs && (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.label}
                onClick={() => setCat(c.label)}
                className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${cat === c.label ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-muted-foreground hover:border-primary/50"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <button onClick={generate} disabled={loading} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating…" : "Generate quiz"}
          </button>
        </>
      )}

      {qs && (
        <div className="mt-8 space-y-5">
          {qs.map((q, i) => {
            const picked = picks[i];
            return (
              <div key={i} className="rounded-xl border border-border bg-surface/60 p-5">
                <div className="font-bold">{i + 1}. {q.q}</div>
                <div className="mt-3 grid gap-2">
                  {q.options.map((opt, oi) => {
                    const isPicked = picked === oi;
                    const isCorrect = submitted && oi === q.answer;
                    const isWrong = submitted && isPicked && oi !== q.answer;
                    return (
                      <button
                        key={oi}
                        disabled={submitted}
                        onClick={() => setPicks((p) => ({ ...p, [i]: oi }))}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                          isCorrect ? "border-emerald-400/60 bg-emerald-400/10"
                          : isWrong ? "border-red-400/60 bg-red-400/10"
                          : isPicked ? "border-primary bg-primary/10"
                          : "border-border bg-surface hover:border-primary/40"
                        }`}
                      >
                        <span>{opt}</span>
                        {isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                        {isWrong && <XCircle className="h-4 w-4 text-red-400" />}
                      </button>
                    );
                  })}
                </div>
                {submitted && q.explain && (
                  <p className="mt-3 text-xs text-muted-foreground"><span className="font-mono uppercase tracking-widest text-primary">Why:</span> {q.explain}</p>
                )}
              </div>
            );
          })}
          {!submitted ? (
            <button onClick={submit} className="rounded-full bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand">Submit</button>
          ) : (
            <button onClick={() => setQs(null)} className="rounded-full border border-border bg-surface px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest">Try another</button>
          )}
        </div>
      )}
    </section>
  );
}
