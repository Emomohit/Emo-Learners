// Difficulty levels used across EMoIQ. Exactly five levels — do not add others.
export const DIFFICULTY_LEVELS = ["easy", "medium", "moderate", "hard", "advanced"] as const;
export type Difficulty = (typeof DIFFICULTY_LEVELS)[number];

export const DIFFICULTY_META: Record<Difficulty, { label: string; dot: string; className: string }> = {
  easy: {
    label: "Easy",
    dot: "🟢",
    className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700",
  },
  medium: {
    label: "Medium",
    dot: "🔵",
    className: "border-sky-500/40 bg-sky-500/10 text-sky-700",
  },
  moderate: {
    label: "Moderate",
    dot: "🟡",
    className: "border-amber-500/40 bg-amber-500/10 text-amber-700",
  },
  hard: {
    label: "Hard",
    dot: "🟠",
    className: "border-orange-500/40 bg-orange-500/10 text-orange-700",
  },
  advanced: {
    label: "Advanced",
    dot: "🔴",
    className: "border-rose-500/40 bg-rose-500/10 text-rose-700",
  },
};

export function isDifficulty(value: unknown): value is Difficulty {
  return typeof value === "string" && (DIFFICULTY_LEVELS as readonly string[]).includes(value);
}

const ADVANCED_HINTS = [
  "prove",
  "derivation",
  "derive",
  "pumping lemma",
  "turing",
  "booth",
  "construct",
  "design",
  "backpropagation",
];
const HARD_HINTS = [
  "numerical",
  "solve",
  "normalize",
  "normalization",
  "algorithm",
  "analyse",
  "analyze",
  "complexity",
  "dynamic programming",
  "convert",
];
const MODERATE_HINTS = [
  "compare",
  "differentiate",
  "with example",
  "with examples",
  "techniques",
  "tradeoff",
  "hazards",
  "with a neat diagram",
  "with diagrams",
];
const EASY_HINTS = ["define", "list", "what is", "state the", "explain the term"];

/**
 * Complexity-based difficulty: marks weight + cognitive verbs in the question.
 * Deterministic — never random.
 */
export function deriveDifficulty(input: {
  question: string;
  marks?: number;
  probability?: number;
  reason?: string;
}): Difficulty {
  const text = `${input.question} ${input.reason ?? ""}`.toLowerCase();
  const has = (list: string[]) => list.some((k) => text.includes(k));

  let score = 0;
  const marks = Number(input.marks ?? 0);
  if (marks >= 10) score += 2;
  else if (marks >= 7) score += 1;

  if (has(ADVANCED_HINTS)) score += 2;
  else if (has(HARD_HINTS)) score += 1.5;
  else if (has(MODERATE_HINTS)) score += 1;
  else if (has(EASY_HINTS)) score -= 0.5;

  // Very frequently repeated questions are better rehearsed, so slightly easier in practice.
  if (Number(input.probability ?? 0) >= 93) score -= 0.5;

  if (score <= 0.5) return "easy";
  if (score <= 1.5) return "medium";
  if (score <= 2.5) return "moderate";
  if (score <= 3.5) return "hard";
  return "advanced";
}
