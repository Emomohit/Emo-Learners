import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, Check, X, Trophy, RotateCcw, Timer } from "lucide-react";
import type { Question } from "@/lib/learn-data";

type Mode = "quiz" | "test";

export function Runner({
  title,
  emoji,
  topic,
  minutes,
  questions,
  mode,
  backHref,
}: {
  title: string;
  emoji: string;
  topic: string;
  minutes: number;
  questions: Question[];
  mode: Mode;
  backHref: string;
}) {
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(() => questions.map(() => null));
  const [finished, setFinished] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>(() => questions.map(() => false));
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);

  const isTest = mode === "test";

  useEffect(() => {
    if (!isTest || finished) return;
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [isTest, finished]);

  useEffect(() => {
    if (isTest && secondsLeft === 0 && !finished) setFinished(true);
  }, [secondsLeft, isTest, finished]);

  const score = useMemo(
    () => picks.reduce<number>((acc, p, i) => acc + (p === questions[i].answer ? 1 : 0), 0),
    [picks, questions],
  );

  const current = questions[idx];
  const pick = picks[idx];
  const isRevealed = revealed[idx];

  const choose = (optIdx: number) => {
    if (isTest) {
      // Test: lock pick, no instant reveal
      setPicks((p) => p.map((v, i) => (i === idx ? optIdx : v)));
      return;
    }
    // Quiz: instant feedback, lock once revealed
    if (isRevealed) return;
    setPicks((p) => p.map((v, i) => (i === idx ? optIdx : v)));
    setRevealed((r) => r.map((v, i) => (i === idx ? true : v)));
  };

  const next = () => {
    if (idx < questions.length - 1) setIdx(idx + 1);
    else setFinished(true);
  };
  const prev = () => idx > 0 && setIdx(idx - 1);

  const reset = () => {
    setIdx(0);
    setPicks(questions.map(() => null));
    setRevealed(questions.map(() => false));
    setFinished(false);
    setSecondsLeft(minutes * 60);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const progress = ((idx + 1) / questions.length) * 100;

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-border bg-surface/40 p-8 backdrop-blur-sm md:p-12">
          <div className="flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Trophy className="h-9 w-9" />
            </div>
          </div>
          <h2 className="mt-6 text-center font-display text-4xl font-extrabold uppercase md:text-5xl">
            {pct >= 80 ? "Crushed it." : pct >= 50 ? "Solid work." : "Keep going."}
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            You scored <span className="font-bold text-foreground">{score} / {questions.length}</span> ({pct}%).
          </p>

          <div className="mt-10 space-y-3">
            {questions.map((q, i) => {
              const correct = picks[i] === q.answer;
              return (
                <div key={i} className="rounded-xl border border-border bg-background/50 p-5">
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${correct ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
                      {correct ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold">{i + 1}. {q.q}</p>
                      <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        Your answer: <span className={correct ? "text-success" : "text-destructive"}>{picks[i] === null ? "—" : q.options[picks[i]!]}</span>
                      </p>
                      {!correct && (
                        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                          Correct: <span className="text-primary">{q.options[q.answer]}</span>
                        </p>
                      )}
                      {q.explain && <p className="mt-2 text-sm text-muted-foreground">{q.explain}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button onClick={reset} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-all hover:scale-105">
              <RotateCcw className="h-3.5 w-3.5" /> Retake
            </button>
            <Link to={backHref} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-6 py-3 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-primary hover:text-primary">
              Back to {mode === "quiz" ? "quizzes" : "tests"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary">{topic}</div>
            <h1 className="font-display text-2xl font-extrabold uppercase md:text-3xl">{title}</h1>
          </div>
        </div>
        {isTest && (
          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 font-mono text-sm font-bold tabular-nums text-primary">
            <Timer className="h-3.5 w-3.5" /> {mm}:{ss}
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>Q {idx + 1} / {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="mt-8 rounded-3xl border border-border bg-surface/40 p-7 backdrop-blur-sm md:p-10">
        <p className="font-display text-2xl font-extrabold leading-tight md:text-3xl">{current.q}</p>

        <div className="mt-8 space-y-3">
          {current.options.map((opt, i) => {
            const selected = pick === i;
            const showCorrect = !isTest && isRevealed && i === current.answer;
            const showWrong = !isTest && isRevealed && selected && i !== current.answer;
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={!isTest && isRevealed}
                className={`flex w-full items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left transition-all ${
                  showCorrect
                    ? "border-success bg-success/10 text-foreground"
                    : showWrong
                    ? "border-destructive bg-destructive/10 text-foreground"
                    : selected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background/50 text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-bold ${
                    selected || showCorrect ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm md:text-base">{opt}</span>
                </div>
                {showCorrect && <Check className="h-4 w-4 text-success" />}
                {showWrong && <X className="h-4 w-4 text-destructive" />}
              </button>
            );
          })}
        </div>

        {!isTest && isRevealed && current.explain && (
          <div className="mt-6 rounded-xl border border-border bg-background/50 p-4 text-sm text-muted-foreground">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">// Why</span>
            <p className="mt-1">{current.explain}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={prev}
          disabled={idx === 0}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all hover:border-primary hover:text-foreground disabled:opacity-40"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Prev
        </button>
        <button
          onClick={next}
          disabled={isTest ? false : !isRevealed}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-brand transition-all hover:scale-105 disabled:opacity-40"
        >
          {idx === questions.length - 1 ? "Finish" : "Next"} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
