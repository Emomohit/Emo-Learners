
# EMO Learners — Student-First Rebuild

Goal: make every feature easy to find, use simple English everywhere, add missing pieces students actually need, harden security, and rewrite the README as a proper project report.

## 1. Information architecture (so students find things fast)

Rebuild the navbar and home page around 5 clear sections. No jargon, no clever names — plain words.

```text
Home
├─ Learn          → /courses           (Python, Java, C, DSA)
├─ Practice       → /practice          (tabs: Quizzes · Tests · Daily Challenge)
├─ Notes & PYQs   → /resources         (branch + semester filter, search)
├─ AI Helper      → /ai-assistant
└─ More           → About · Join · Internships · Contact
```

- New `/practice` hub page merges Quizzes, Tests, and the 30-Day Python Challenge behind one tab UI (existing pages stay as deep links).
- Home page rewritten with 5 big "what do you want to do today?" cards + a search bar that jumps to notes / courses / quizzes.
- Sticky bottom nav on mobile (Home · Learn · Practice · Notes · Me).
- Global `Cmd/Ctrl+K` search across courses, chapters, quizzes, tests, subjects.
- Breadcrumbs on every inner page.

## 2. Plain-English pass + spelling fixes

- Sweep every route, component, and data file (`course-data.ts`, `dsa-course.ts`, `challenge-data.ts`, `learn-data.ts`, `course-extras.ts`) and rewrite copy at ~8th-grade reading level. No "curriculum", "engine", "brutalist", "obsidian" in user-facing text.
- Fix spellings and Hinglish typos. Consistent capitalization: "EMO Learners", "Notes & PYQs", "Practice", "AI Helper".
- Every button says what it does ("Start quiz", "Open notes", "Download PDF").
- Add tiny helper text under every section heading ("Short quizzes with instant answers").

## 3. New / upgraded features

**Student-facing**
- **Bookmarks**: save any chapter, quiz, PYQ, or resource (`localStorage`, later syncable).
- **Recently viewed** strip on home + dashboard.
- **Progress dashboard** (`/dashboard`): courses % done, quiz scores, challenge streak, badges, bookmarks — all in one place.
- **Downloadable notes**: each course chapter gets a "Download notes (PDF)" via client-side print-to-PDF.
- **Share results**: quiz/test result card with a "Share" button (image + link).
- **Feedback widget**: floating "Report a mistake" on every page (writes to existing `feedback` table).
- **Better search on /resources**: fuzzy search, filter chips, sort by newest.
- **Accessibility**: keyboard nav, focus rings, aria labels, `prefers-reduced-motion`, larger tap targets, contrast pass.
- **Offline-friendly**: cache last-opened notes and course pages via a small service worker.
- **PWA install**: manifest + icons so students can "Add to Home Screen".

**Admin**
- Bulk PDF upload with drag-and-drop.
- Edit / delete resources and tests inline.
- Simple analytics: uploads, active students, top quizzes (from existing tables).

## 4. Security hardening

- Run a full security scan and fix findings before shipping.
- Confirm RLS + explicit `GRANT`s on every public table (`profiles`, `resources`, `subjects`, `user_roles`, `feedback`, `custom_tests`, `ai_conversations`, `ai_messages`).
- Keep `study-materials` bucket private; serve via short-lived signed URLs from a server function, not public links.
- Server-side admin check only (`has_role` + `FOUNDER_ADMIN_EMAIL` secret) — never trust the client.
- Zod validation on every server function input (auth, feedback, admin uploads, tests CRUD, AI chat).
- Rate-limit AI chat and feedback per user (simple counter table).
- Turn on Leaked-Password (HIBP) check for signup.
- Strict security headers on the SSR response (CSP, Referrer-Policy, X-Content-Type-Options, Permissions-Policy).
- Sanitize any user-rendered strings (feedback, test titles) — no `dangerouslySetInnerHTML`.
- Ensure no secrets in the repo; `.env.example` only.
- Update `security-memory` after the pass.

## 5. Visual polish (keep current Premium Tech Noir direction)

- Consistent tokens already in `src/styles.css` — no new palette, just apply everywhere and remove leftover hard-coded colors.
- Smoother page transitions (framer-motion `AnimatePresence`).
- Empty states with a friendly line + a next action on every list page.
- Loading skeletons instead of spinners.
- Mobile-first spacing pass; no horizontal scroll anywhere.

## 6. README rewrite (project-report style)

Replace `README.md` with these sections, in this order:

1. **Project title + one-line pitch**
2. **Live demo + screenshots**
3. **Problem statement** — Indian engineering students juggle scattered PDFs, paid apps, and low-quality YouTube playlists; no single free place has notes + PYQs + practice + AI help tuned to RGPV syllabus.
4. **Why I built this** — founder's story (Mohit Ahirwar), the gap felt as a student, the goal of a free community-first platform.
5. **How the project addresses the problem** — mapped feature-by-feature: RGPV-aligned notes, structured courses (Python/Java/C/DSA), quizzes + timed tests, 30-day challenge, AI helper, admin-curated resources.
6. **Approach** — product decisions (student-first IA, plain English, mobile-first), tech decisions (TanStack Start, Lovable Cloud, Tailwind v4, Gemini via server function), security decisions (RLS, server-only admin, signed URLs).
7. **Architecture diagram** (ASCII) — client, server functions, database, storage, AI.
8. **Features** — grouped list.
9. **Findings / what I learned** — usage insights, what students asked for most, what worked, what didn't.
10. **Impact** — users onboarded, notes uploaded, quizzes taken, community size (Telegram/Insta/YT), testimonials — with placeholders the user can fill in.
11. **Tech stack**
12. **Local setup**
13. **Environment variables** (names only)
14. **Security model** — short version of section 4.
15. **Roadmap**
16. **Contributing + Community links**
17. **License + Credits**

I will draft real content for every section; the user only edits the numbers in "Impact" and the screenshots.

## 7. Out of scope this pass

- No Google/OAuth re-enable.
- No paid features / pricing.
- No new backend tables unless a listed feature requires it (bookmarks + rate-limit will add 2 small tables with RLS + GRANTs).

## Technical notes

- New routes: `src/routes/practice.tsx`, `src/routes/dashboard.tsx` (upgraded), `src/routes/api/public/og.$slug.ts` (dynamic OG image for shares).
- New components: `CommandPalette`, `BottomNav`, `BookmarkButton`, `FeedbackWidget`, `ResultCard`, `EmptyState`, `Skeletons`.
- New libs: `src/lib/bookmarks.ts`, `src/lib/search-index.ts`, `src/lib/rate-limit.functions.ts`, `src/lib/signed-url.functions.ts`.
- New tables (migration): `bookmarks(user_id, kind, ref, created_at)` and `rate_limits(user_id, action, window_start, count)` — both with RLS + explicit GRANTs.
- PWA: `public/manifest.webmanifest` + `public/sw.js` registered in `__root.tsx`.
- Security headers set in `src/server.ts`.
- Every route gets unique `head()` metadata (title, description, og:title, og:description, canonical, og:url); leaf routes only for og:image.
