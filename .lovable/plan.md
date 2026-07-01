# EMO Learners — Full Rebuild v3

## 1. Pick a visual direction

All three keep the same information architecture and motion quality; only the skin changes.

**A. Aurora Studio** — Midnight canvas `#07070C`, soft aurora blobs (teal `#3DDBD9` → violet `#7C3AED` → magenta `#EC4899`), glassy cards, generous whitespace. Display: Instrument Serif. Body: Inter. Editorial, premium, calm.

**B. Terminal Prestige** — Refined evolution of the current cyberpunk brutalist. Near-black `#0A0A0A`, single warm amber accent `#F5A524`, hairline borders, mono labels (JetBrains Mono) paired with a clean sans, dense but disciplined. Feels like Linear + a hacker terminal.

**C. Paper Circuit** — Light warm paper `#FAF7F2`, ink `#0B0B0F`, electric accent `#2E5BFF`. Fraunces display + Manrope body. Subtle circuit-line motifs. Reads like a printed textbook meets modern SaaS. Bold on light.

Say A, B, or C.

## 2. Global UX rebuild (all directions)

- New `src/styles.css` tokens per chosen palette; retire the black/orange hard-coded look.
- Rebuilt shell: sticky `Navbar` with active-route indicator, redesigned `Footer`, unified `Container` and section rhythm.
- New primitives: `Hero`, `SectionHeader`, `Card`, `Stat`, `Pill`, `ProgressBar`, `CodeBlock`, `QuizCard`, `ExerciseCard`.
- Motion: framer-motion staggered reveals on cards, animated progress bars, hover lift, reduced-motion respected.
- Mobile-first pass — grid + `min-w-0` + `shrink-0` on every header row.
- Head metadata + og:image polish on every route.

## 3. Pages rebuilt

- `/` home — new hero, live stats strip, "Learn a language" module (4 courses), 30-day challenge module, resources teaser, quizzes/tests teaser, testimonials, join CTA.
- `/courses` — polished catalog with progress badges pulled from `localStorage`.
- `/courses/$slug` — new two-column reading layout (notes left, sticky video/quiz/exercise rail right).
- `/challenge`, `/quizzes`, `/quizzes/$slug`, `/tests`, `/tests/$slug`, `/resources`, `/about`, `/join`, `/internships`, `/contact`, `/auth`, `/dashboard`, `/admin` — all restyled to the new system; content preserved.

## 4. Courses content upgrade (Python, Java, C, DSA)

For every chapter of every course:

- **5–7 expanded notes** — concepts, gotchas, when-to-use.
- **2–3 code snippets** — minimal → real usage → common pitfall.
- **Practice quiz** — 4 auto-graded MCQs with instant feedback + explanation, saved per-chapter to `localStorage`.
- **1–2 hands-on exercises** — prompt + expected output + solution reveal.
- Deep-linked "Watch chapter" pill (existing YouTube timestamps preserved).
- Per-chapter completion counts progress only when notes read + quiz passed.

New DSA track `/courses/dsa`:

- 20 chapters: Big-O, Arrays, Strings, Hashing, Two Pointers, Sliding Window, Stack, Queue, Linked List, Recursion, Sorting, Binary Search, Trees, BST, Heap, Graphs BFS/DFS, Backtracking, DP intro, DP patterns, System design lite.
- Language-agnostic pseudocode + Python + Java snippets.
- Each chapter same shape: notes + snippets + quiz + exercise.

## 5. Data model

Course content stays in-repo (`src/lib/course-data.ts`) so it works offline and doesn't need DB writes. Extends the `Chapter` type:

```ts
type Chapter = {
  id: number; title: string; topic: string; t: number;
  notes: string[];              // 5–7 items
  snippets: { label: string; code: string }[];
  quiz: { q: string; options: string[]; answer: number; why: string }[];
  exercises: { prompt: string; expected: string; solution: string }[];
};
```

`localStorage` keys per user-device: `emo:course:<slug>:done`, `emo:course:<slug>:quiz:<chapId>`.

## 6. Technical notes

- No backend changes; no new tables. RLS + admin flow untouched.
- No new npm deps beyond `framer-motion` (already usable via animations utility, but I'll install it if not present).
- Web fonts loaded via `<link>` in `src/routes/__root.tsx` (never `@import` remote in `styles.css`).
- Tailwind v4 tokens via `@theme` in `src/styles.css`.
- Every new route + head() gets a unique title/description/og.

## 7. Out of scope

- No pricing, no paid tier.
- No Google/OAuth re-enable.
- No Vercel republish work — that's a separate hosting turn.

## Deliverable

Ship the chosen direction end-to-end in one build turn: tokens → primitives → shell → pages → course content upgrade → DSA course → QA on `/`, `/courses`, `/courses/java`, `/courses/dsa`, `/challenge`, `/tests`, `/quizzes`.
