import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Sparkles } from "lucide-react";
import type { QuizQuestion } from "@/lib/course-extras";

type Props = {
  courseSlug: string;
  chapterId: number;
  quiz: QuizQuestion[];
  onPass?: () => void;
};

type SavedState = {
  answers: Record<number, number>;
  submitted: boolean;
  score: number;
};

export function QuizBlock({ courseSlug, chapterId, quiz, onPass }: Props) {
  const storageKey = `emo:course:${courseSlug}:quiz:${chapterId}`;

  const [state, setState] = useState<SavedState>({
    answers: {},
    submitted: false,
    score: 0,
  });

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setState(JSON.parse(raw) as SavedState);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const pick = (qi: number, oi: number) => {
    if (state.submitted) return;
    setState((s) => ({ ...s, answers: { ...s.answers, [qi]: oi } }));
  };

  const submit = () => {
    const score = quiz.reduce(
      (acc, q, i) => acc + (state.answers[i] === q.answer ? 1 : 0),
      0,
    );
    const next = { ...state, submitted: true, score };
    setState(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
    if (score === quiz.length) onPass?.();
  };

  const reset = () => {
    const next = { answers: {}, submitted: false, score: 0 };
    setState(next);
    try {
      window.localStorage.removeItem(storageKey);
    } catch {}
  };

  const answeredAll = quiz.every((_, i) => state.answers[i] !== undefined);
  const pct = state.submitted ? Math.round((state.score / quiz.length) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h4 className="font-display text-lg font-extrabold uppercase tracking-tight">
            Practice quiz
          </h4>
        </div>
        {state.submitted && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest ${
              state.score === quiz.length
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-background/60 text-muted-foreground"
            }`}
          >
            {state.score}/{quiz.length} · {pct}%
          </span>
        )}
      </div>

      <div className="mt-5 space-y-5">
        {quiz.map((q, qi) => {
          const chosen = state.answers[qi];
          return (
            <div key={qi} className="rounded-xl border border-border bg-background/40 p-4">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                  Q{String(qi + 1).padStart(2, "0")}
                </span>
                <p className="flex-1 text-sm font-semibold text-foreground/90">{q.q}</p>
              </div>
              <div className="mt-3 grid gap-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isRight = oi === q.answer;
                  const isWrongChoice = state.submitted && isChosen && !isRight;
                  const showRight = state.submitted && isRight;
                  return (
                    <button
                      key={oi}
                      onClick={() => pick(qi, oi)}
                      disabled={state.submitted}
                      className={`group flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                        showRight
                          ? "border-primary/60 bg-primary/10 text-foreground"
                          : isWrongChoice
                            ? "border-destructive/50 bg-destructive/10 text-foreground"
                            : isChosen
                              ? "border-primary/40 bg-primary/5 text-foreground"
                              : "border-border bg-transparent text-foreground/80 hover:border-primary/40 hover:bg-surface/60"
                      } ${state.submitted ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          showRight
                            ? "border-primary bg-primary/20 text-primary"
                            : isWrongChoice
                              ? "border-destructive bg-destructive/20 text-destructive-foreground"
                              : isChosen
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-transparent"
                        }`}
                      >
                        {showRight ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : isWrongChoice ? (
                          <XCircle className="h-3 w-3" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        )}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
              {state.submitted && (
                <p className="mt-3 rounded-md border border-border bg-background/50 p-3 text-xs leading-relaxed text-muted-foreground">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                    Why:
                  </span>{" "}
                  {q.why}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {!state.submitted ? (
          <button
            onClick={submit}
            disabled={!answeredAll}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit answers
          </button>
        ) : (
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Retry
          </button>
        )}
      </div>
    </div>
  );
}
