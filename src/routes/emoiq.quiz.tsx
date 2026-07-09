import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { callEmoIq, type QuizQuestion } from "@/lib/emoiq/api";
import { PdfDropzone } from "@/components/site/PdfDropzone";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/emoiq/quiz")({
  component: QuizPage,
});

function QuizPage() {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState("");
  const [pdfContext, setPdfContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [qs, setQs] = useState<QuizQuestion[] | null>(null);
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  async function generate() {
    if (!subject.trim()) { toast.error("Subject required"); return; }
    setLoading(true);
    setQs(null); setPicks({}); setSubmitted(false);
    try {
      const r = await callEmoIq<{ questions: QuizQuestion[] }>("quiz", {
        subject,
        topics: topics.split(",").map((t) => t.trim()).filter(Boolean),
        notes: pdfContext || undefined,
      });
      setQs(r.questions ?? []);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    if (!qs) return;
    setSubmitted(true);
    const score = qs.reduce((s, q, i) => s + (picks[i] === q.answer ? 1 : 0), 0);
    if (user) {
      const weakByTopic: Record<string, { correct: number; total: number }> = {};
      qs.forEach((q, i) => {
        const t = q.topic || "general";
        weakByTopic[t] = weakByTopic[t] ?? { correct: 0, total: 0 };
        weakByTopic[t].total += 1;
        if (picks[i] === q.answer) weakByTopic[t].correct += 1;
      });
      await supabase.from("emoiq_quiz_attempts").insert({
        user_id: user.id,
        subject,
        topics: Object.keys(weakByTopic),
        score,
        total: qs.length,
        details: qs.map((q, i) => ({ q: q.q, picked: picks[i] ?? -1, answer: q.answer, topic: q.topic })) as never,
      });
      for (const [topic, s] of Object.entries(weakByTopic)) {
        const weakness = 1 - s.correct / Math.max(1, s.total);
        await supabase.from("emoiq_weak_topics").upsert({
          user_id: user.id, subject, topic, score: weakness,
        }, { onConflict: "user_id,subject,topic" });
      }
    }
    toast.success(`Score: ${score} / ${qs.length}`);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tighter md:text-5xl">
        Diagnostic <span className="italic text-primary">Quiz</span>
      </h1>
      <p className="mt-3 text-muted-foreground">10 MCQs. Results update your weak-topic profile and next study plan.</p>

      {!qs && (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input className="rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <input className="rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary" placeholder="Topics (optional)" value={topics} onChange={(e) => setTopics(e.target.value)} />
          </div>
          <div className="mt-4">
            <PdfDropzone
              label="Upload notes / textbook PDFs (optional)"
              hint="Quiz questions will be drawn from their content."
              onText={(t) => setPdfContext(t)}
            />
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
            <button onClick={() => { setQs(null); }} className="rounded-full border border-border bg-surface px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest">Try another</button>
          )}
        </div>
      )}
    </section>
  );
}
