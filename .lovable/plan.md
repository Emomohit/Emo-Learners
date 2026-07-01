# EMO Learners — Full Rebuild v3 (Premium Tech Noir)

## 1. Visual direction (locked)

**Premium Tech Noir** — the refined evolution of the current black+orange look.

- Canvas `#050505`, surface `#0A0A0A`, hairline borders `rgba(255,255,255,0.08)`.
- Single warm amber accent `#F5A524` (with `#EA580C` for CTAs).
- Display: Space Grotesk 500/700. Body: Inter. Mono labels: JetBrains Mono.
- Ambient orange glows (soft radial mesh, not neon), gradient borders on cards, obsidian glass surfaces.
- Dense but calm — Linear meets hacker terminal.

## 2. Global UX rebuild

- New `src/styles.css` tokens (colors, fonts, radii, shadows, easings). Retire hard-coded blacks/oranges scattered in components.
- Fonts loaded via `<link>` in `src/routes/__root.tsx`.
- Rebuilt shell: sticky Navbar with active-route indicator + pulsing status dot, redesigned Footer with mono sublabels.
- New primitives in `src/components/ui-emo/`: `Container`, `SectionHeader`, `Card`, `Stat`, `Pill`, `ProgressBar`, `CodeBlock`, `QuizCard`, `ExerciseCard`, `HeroGlow`.
- Motion: framer-motion staggered reveals, animated progress bars, hover lift, subtle parallax on hero glow, `prefers-reduced-motion` respected.
- Mobile-first pass — grid + `min-w-0` + `shrink-0` on every header row.
- Unique `head()` metadata on every route.

## 3. Pages rebuilt (same routes, new skin)

- `/` — new hero, live stats strip, "Learn a language" module (4 courses), 30-day challenge teaser, resources teaser, quizzes/tests teaser, join CTA.
- `/courses` — polished catalog with progress badges from `localStorage`.
- `/courses/$slug` — two-column reading layout (notes left, sticky video/quiz/exercise rail right).
- `/challenge`, `/quizzes`, `/quizzes/$slug`, `/tests`, `/tests/$slug`, `/resources`, `/ai-assistant`, `/about`, `/join`, `/internships`, `/contact`, `/auth`, `/dashboard`, `/admin` — restyled to the new tokens; content preserved.

## 4. Courses content upgrade (Python, Java, C, DSA)

Every chapter of every course gets:

- **5–7 expanded notes** — concepts, gotchas, when-to-use.
- **2–3 code snippets** — minimal → real usage → common pitfall.
- **Practice quiz** — 4 auto-graded MCQs with instant feedback + explanation, saved per-chapter to `localStorage`.
- **1–2 hands-on exercises** — prompt + expected output + solution reveal.
- Deep-linked "Watch chapter" pill (existing YouTube timestamps preserved).
- Per-chapter completion requires notes viewed + quiz passed.

New DSA track `/courses/dsa`:

- 20 chapters: Big-O, Arrays, Strings, Hashing, Two Pointers, Sliding Window, Stack, Queue, Linked List, Recursion, Sorting, Binary Search, Trees, BST, Heap, Graphs BFS/DFS, Backtracking, DP intro, DP patterns, System design lite.
- Language-agnostic pseudocode + Python + Java snippets.
- Same shape: notes + snippets + quiz + exercise.

## 5. Data model

Course content stays in-repo (`src/lib/course-data.ts`). Extends `Chapter`:

```ts
type Chapter = {
  id: number; title: string; topic: string; t: number;
  notes: string[];
  snippets: { label: string; code: string }[];
  quiz: { q: string; options: string[]; answer: number; why: string }[];
  exercises: { prompt: string; expected: string; solution: string }[];
};
```

`localStorage` keys: `emo:course:<slug>:done`, `emo:course:<slug>:quiz:<chapId>`.

## 6. Technical notes

- No backend changes; no new tables. RLS + admin flow untouched.
- Install `framer-motion` if missing.
- Tailwind v4 tokens via `@theme` in `src/styles.css`.
- No Google/OAuth re-enable, no Vercel republish, no pricing.

## 7. QA checklist

Manual smoke on `/`, `/courses`, `/courses/java`, `/courses/dsa`, `/challenge`, `/tests`, `/quizzes`, `/resources`, `/admin`. Build must be clean.
