import { useState } from "react";
import { Eye, EyeOff, Terminal } from "lucide-react";
import type { Exercise } from "@/lib/course-extras";

type Props = { exercise: Exercise };

export function ExerciseBlock({ exercise }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5 md:p-6">
      <div className="flex items-center gap-2">
        <Terminal className="h-4 w-4 text-primary" />
        <h4 className="font-display text-lg font-extrabold uppercase tracking-tight">
          Hands-on exercise
        </h4>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-foreground/90">{exercise.prompt}</p>

      <div className="mt-4 rounded-lg border border-border bg-background/60 p-4">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
          Expected output
        </div>
        <pre className="mt-2 whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/90">
{exercise.expected}
        </pre>
      </div>

      <button
        onClick={() => setRevealed((v) => !v)}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
      >
        {revealed ? (
          <>
            <EyeOff className="h-3.5 w-3.5" /> Hide solution
          </>
        ) : (
          <>
            <Eye className="h-3.5 w-3.5" /> Show solution
          </>
        )}
      </button>

      {revealed && (
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-background/80 p-4 font-mono text-xs leading-relaxed text-foreground/90">
{exercise.solution}
        </pre>
      )}
    </div>
  );
}
