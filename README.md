# EMO Learners

> A free, student-first learning platform for Indian engineering students — one place for notes, PYQs, practice, courses, and an AI helper.

**Founder:** Mohit Ahirwar
**Live site:** https://emolearners.vercel.app
**Community:** [Telegram](https://t.me/Emo_Learners) · [Instagram](https://www.instagram.com/Emolearners) · [YouTube](https://www.youtube.com/@EmoLearners) · [LinkedIn](https://www.linkedin.com/in/mohit-ahirwar-12bb58386/)

---

## 1. Problem statement

Engineering students in India (especially at RGPV and similar universities) waste huge amounts of time every semester just **finding** study material. The real problems are:

- **Notes and PYQs are scattered** across random Telegram groups, Drive folders, WhatsApp forwards, and paid apps.
- **Quality is inconsistent.** The same subject has ten different PDFs — none of them aligned to the current syllabus.
- **Practice is missing.** Even after reading notes, students have no easy way to test what they actually understood.
- **Paid apps gate the basics.** Simple things — a quiz, a mock test, a good AI explanation — sit behind subscriptions most students can't afford.
- **No community.** Learning alone kills consistency. Most students give up in the first two weeks.

The result: bright students spend more time hunting for material than actually learning.

## 2. Why I built EMO Learners

I'm Mohit Ahirwar, an engineering student myself. I lived every problem in the list above. I've searched for PYQs the night before an exam, paid for apps that turned out to be locked, and watched friends drop out of coding because "it felt too hard alone."

I built EMO Learners because I wanted **one place** that a first-year student could open on their phone and immediately find:

- notes that match their syllabus,
- previous year questions,
- short quizzes to check understanding,
- a small daily coding habit,
- and a community that keeps them going.

Free. Always. No paywalls. No ads. No dark patterns.

## 3. How the project addresses the problem

Every feature maps back to a real student pain point.

| Student pain | EMO Learners answer |
| --- | --- |
| Notes scattered everywhere | `/resources` — branch and semester filtered notes and PYQs, uploaded by the founder / verified admins |
| No structured way to learn coding | `/courses` — full Python, Java, C, and DSA tracks with notes, code snippets, quizzes, and hands-on exercises |
| No practice after reading | `/practice` — quizzes and timed mock tests with instant feedback |
| No consistency | 30-day Python challenge with a streak tracker and daily lessons |
| Stuck on a concept at midnight | AI Helper — a Gemini-powered study assistant that explains topics in simple words |
| Learning alone is hard | Telegram + Instagram + YouTube community |
| Syllabus mismatch | RGPV Bhopal AICTE Flexible Curricula seeded across all branches and semesters |

## 4. Approach

### Product decisions

- **Student-first information architecture.** The whole app is organised around five things a student actually wants: Learn, Practice, Notes & PYQs, AI Helper, Community.
- **Plain English everywhere.** No jargon, no marketing fluff. Every button says what it does.
- **Mobile-first.** Most Indian students study on their phone. Every layout is designed for a 360 px screen first, desktop second.
- **Free forever.** No paywall, no "pro" plan, no ads. Community-supported.

### Technical decisions

- **TanStack Start (React 19 + Vite 7)** — full-stack framework with SSR, file-based routing, and server functions. Fast, type-safe, and good for SEO.
- **Tailwind CSS v4** — design tokens live in `src/styles.css` (`@theme`). No hard-coded colors in components.
- **Lovable Cloud (Supabase)** — Postgres, Auth, and private file storage. Row Level Security (RLS) on every table.
- **Gemini via Lovable AI Gateway** — the AI Helper runs server-side; the model key never touches the browser.
- **Framer Motion** — page transitions and micro-interactions with `prefers-reduced-motion` respected.

### Security decisions

- Row Level Security **enabled and enforced** on every public table with explicit `GRANT`s.
- The `study-materials` storage bucket is **private**. Files are served via short-lived signed URLs from a server function — no public direct links.
- Admin access is checked **server-side only** through the `has_role()` security-definer function and the `FOUNDER_ADMIN_EMAIL` project secret. The client is never trusted.
- Roles stored in a separate `user_roles` table (never on `profiles`) to prevent privilege escalation.
- All server function inputs validated with Zod.
- No secrets committed. Publishable keys only in `.env`; service role and admin email as server secrets.
- Strict HTTP security headers on every SSR response.
- Password sign-up uses the Have I Been Pwned (HIBP) leaked-password check.

## 5. Architecture

```text
                ┌────────────────────────────────────────────┐
                │              Browser (React 19)            │
                │  Routes · Framer Motion · Tailwind v4 UI   │
                └───────────────┬────────────────────────────┘
                                │
                     HTTPS + Supabase bearer token
                                │
        ┌───────────────────────┴───────────────────────┐
        │        TanStack Start server (Edge)           │
        │  createServerFn + /api/public/* routes        │
        │  requireSupabaseAuth · Zod validation         │
        └────────┬───────────────────────┬──────────────┘
                 │                       │
    ┌────────────▼──────────┐   ┌────────▼──────────────┐
    │  Supabase Postgres    │   │  Supabase Storage     │
    │  RLS on every table   │   │  study-materials      │
    │  user_roles · profiles│   │  (private, signed URLs)│
    │  resources · subjects │   └───────────────────────┘
    │  custom_tests · ...   │
    └───────────┬───────────┘
                │
        ┌───────▼────────────┐
        │  Lovable AI Gateway │
        │  Gemini (server-side)│
        └────────────────────┘
```

## 6. Features — the full list

Every feature below is live on the site. Each one is explained in plain English so a first-year student can tell exactly what it does.

### 6.1 Accounts & Auth (`/auth`, `/reset-password`)

- **Email + password sign-up.** No phone, no OTP, no "verify your college ID". Just email and a password.
- **Show / hide password toggle.** Eye icon on every password field so students can double-check what they typed on a phone keyboard.
- **HIBP leaked-password check.** If the password has ever appeared in a public breach, sign-up is blocked with a clear message. No weak passwords slip in.
- **Minimum length: 8 characters.** Enforced client-side and server-side.
- **Instant login after sign-up.** Email auto-confirm is on, so a new student goes straight to the dashboard — no "check your inbox" wall.
- **Forgot password (in-app reset).** `/reset-password` verifies the account's full name (set at signup) via a server function and lets the user pick a new password directly.
- **Persistent session** across refreshes via the Supabase JS client; auth state streamed through `src/lib/auth.tsx`.
- **Sign out** from the navbar dropdown on every page.

### 6.2 Home page (`/`)

- **Hero + countdown** to the next 30-day challenge cohort (SSR-safe — no hydration flicker).
- **Site-wide search bar** that jumps to notes, courses, quizzes, tests, or EMoIQ.
- **Quick-start cards**: Learn, Practice, Notes & PYQs, AI Helper, EMoIQ, Community.
- **Featured EMoIQ block** — flagged "New · AI" to surface the exam-strategy engine.
- **Live stats strip** — students, resources, quizzes, streaks.
- **Marquee banner** for community updates.

### 6.3 Notes & PYQs (`/resources`)

- **Two tabs**: Academics (branch-tagged PDFs) and AI Tools (curated links).
- **Filters**: Branch (CSE, IT, CY, AL, more) + Semester (1–8), aligned to RGPV Bhopal AICTE Flexible Curricula.
- **Fuzzy search** across title, subject, and tags — typos tolerated.
- **Subject cards** with unit-wise breakdowns.
- **Signed-URL downloads.** Files served via short-lived signed URLs from a server function — no permanent public link.
- **Bookmark any resource** with one tap; shows on the dashboard.
- **"Report a mistake"** widget on every resource card feeds the `feedback` table.

### 6.4 Courses (`/courses`, `/courses/$slug`)

Chapter-based courses. Every chapter ships with **notes + code snippets + inline quiz + hands-on exercise + YouTube deep-link**.

- **Python — Basic to Advanced** (CodeWithHarry, timestamped)
- **Java — Basic to Advanced** (`https://youtu.be/q6z_UCBM5Ek`)
- **C Language — Basic to Advanced** (`https://youtu.be/irqbmMNs2Bo`)
- **DSA — 20-chapter track** (arrays, strings, linked lists, stacks, queues, trees, graphs, DP, greedy, backtracking, and more; see `src/lib/dsa-course.ts`)

Per-chapter mechanics:
- **Notes** in phone-friendly chunks.
- **Code snippets** with copy-to-clipboard.
- **YouTube deep-link** to the exact timestamp for that concept.
- **Inline quiz** (`QuizBlock.tsx`) — MCQs with instant right/wrong and explanations.
- **Hands-on exercise** (`ExerciseBlock.tsx`) — small coding task with expected output.
- **Progress tracker** per user; sidebar shows done and next.
- **Two-column reading layout** on desktop; single-column on mobile.

### 6.5 30-Day Python Challenge (`/challenge`)

- **Day 1 → Day 30 tracker** with streak counter, badges, and a personalized certificate preview.
- **Curriculum from a single 12-hour video** (`https://youtu.be/UrsmFxEIp5k`) so lessons stay consistent — no cross-tutor confusion.
- **Per-day card**: what you'll learn, time estimate, notes, code snippet, YouTube deep-link.
- **Local streak persistence** in `localStorage` — works even before login.
- **Aurora / glassmorphism** visuals with `prefers-reduced-motion` respected.
- **Restart & mark-complete** actions per day.

### 6.6 Practice hub (`/practice`, `/quizzes`, `/tests`)

One landing page that unifies three practice modes:

- **Quizzes (`/quizzes`, `/quizzes/$slug`)** — short MCQ sets, instant feedback, per-question explanations, final score.
- **Timed mock tests (`/tests`, `/tests/$slug`)** — countdown timer, review mode after submit, question-wise breakdown.
- **30-Day Python Challenge** — deep-linked for daily habit-building.
- **Admin-authored tests** appear here automatically once created in `/admin`.

### 6.7 EMoIQ — AI-Powered Smart Exam Strategy Engine (`/emoiq`)

The exam-strategy layer. Five tools, all backed by a single edge function (`supabase/functions/emoiq`) that routes actions through Gemini via the Lovable AI Gateway.

- **`/emoiq` — Hub** with all five tools.
- **`/emoiq/analyze` — PYQ Intelligence Engine.**
  - Paste past-paper text (or upload a PDF into the private `pyq-papers` bucket).
  - NLP extracts **unit-wise weightage**, **topic frequency**, **marks distribution**, **year-over-year trends**.
  - Sample output: "Unit 3 = 35% weightage, HIGH priority".
  - Saved to `pyq_analyses` under the student's account.
- **`/emoiq/predict` — Smart Question Prediction.**
  - Pick a saved analysis → **10 probability-ranked questions** (e.g. "70% chance").
  - Shows unit, mark weight, and the reason each was ranked high.
  - Saved to `predicted_questions` for later review.
- **`/emoiq/plan` — Personalized Study Plan.**
  - Inputs: subject, days left, weak topics.
  - Output: **day-by-day plan** — what to study, in what order, for how many hours.
  - **Last-24-Hour Mode** toggle → collapses into a crash-revision plan when the exam is tomorrow.
  - Explicit **skip list** so students know what to drop when time runs out.
- **`/emoiq/quiz` — Diagnostic Quiz with feedback loop.**
  - 10 adaptive MCQs across the syllabus.
  - Results write into `emoiq_weak_topics`, which the planner reads on the next run — the plan adjusts to your weak spots automatically.
- **`/emoiq/doubt` — AI Doubt Solver.**
  - Chat scoped to the current syllabus.
  - Conversations persisted in `doubt_threads` / `doubt_messages`.

### 6.8 AI Study Helper (`/ai-assistant`)

- **General-purpose AI helper** for any syllabus doubt (separate from EMoIQ's exam-scoped chat).
- Runs on the `ai-chat` edge function; Gemini key stays server-side.
- Simple language by default — asks follow-ups when the topic is too broad.

### 6.9 Dashboard (`/dashboard`)

- **Course progress** across Python / Java / C / DSA.
- **Challenge streak** and days completed.
- **Bookmarks** — saved chapters, resources, quizzes, and tests in one place.
- **Recent uploads** so students see what's new since last visit.

### 6.10 Community & content pages

- **`/join`** — Telegram (`t.me/Emo_Learners`), Instagram (`@Emolearners`), YouTube (`@EmoLearners`), founder's LinkedIn.
- **`/about`** — mission, founder's story, link to the founder's portfolio (`https://mohitahirwarportfolio.vercel.app/`).
- **`/contact`** — feedback / bug-report form wired to the `feedback` table.
- **`/internships`** — "Coming Soon" placeholder for future partner programs.
- **`/privacy-policy`** — plain-English privacy note.

### 6.11 Site-wide UX

- **Bookmarks (`src/lib/bookmarks.ts`)** on any chapter, quiz, resource, or test.
- **Feedback widget** — floating "Report a mistake" button on every page.
- **Bottom nav on mobile** — thumb-reachable Home / Learn / Practice / Notes / You.
- **Dark by default** with Tailwind v4 `@theme` tokens. No hard-coded colors.
- **Framer Motion** page transitions; disabled under `prefers-reduced-motion`.
- **Keyboard accessible** — focus rings, skip links, ARIA labels on icon-only buttons.
- **SEO** — per-route `<head>` (title, description, OpenGraph, Twitter), semantic HTML, canonical tags, generated `/sitemap.xml`.

### 6.12 Admin panel (`/admin`) — founder-only

Access gated server-side against `FOUNDER_ADMIN_EMAIL`. The client is never trusted.

- **Upload PDFs** with drag-and-drop → tagged by branch + semester + subject.
- **Manage subjects** — add / rename / delete, aligned to the RGPV syllabus seed.
- **Manage resources** inline — edit title, tags, visibility.
- **Create & edit custom quizzes** — question, options, correct answer, per-question explanation.
- **Create & edit timed tests** — duration, total questions, negative marking, review mode toggle.
- **Feedback inbox** — every "Report a mistake" with context (page URL, user, timestamp).
- **Role management** — grant / revoke `admin` via the `user_roles` table (never on `profiles`).

### 6.13 Backend surface (developer reference)

- **Tables**: `profiles`, `user_roles`, `subjects`, `resources`, `custom_quizzes`, `custom_tests`, `feedback`, `pyq_papers`, `pyq_analyses`, `predicted_questions`, `study_plans`, `emoiq_weak_topics`, `emoiq_quiz_attempts`, `doubt_threads`, `doubt_messages`. All with RLS enabled and explicit `GRANT`s.
- **Storage buckets** (private): `study-materials`, `pyq-papers`. Signed-URL access only, minted by a server function.
- **Edge functions**: `ai-chat` (general AI helper), `emoiq` (analyze / predict / plan / quiz).
- **Server functions**: admin bootstrap, direct password reset, signed-URL minting — all Zod-validated.

## 7. Findings — what I learned building this

- **Students don't read long text on phones.** Short, chunked notes with code blocks beat walls of paragraphs every time.
- **The single most-asked-for thing was PYQs.** Not fancy AI, not videos — previous year question papers. So they became a first-class object.
- **A quiz right after notes converts far better than a quiz on a separate page.** That's why every course chapter now has its quiz and exercise inline.
- **Streaks work.** The 30-day challenge tracker had the highest return-visits in early testing.
- **Trust matters.** Students only upload their own notes once they see the site takes security seriously (private bucket, signed URLs, real auth). That directly informed the security model.
- **Plain English wins.** Rewriting "Cyberpunk Brutalist Practice Engine" to "Quizzes with instant answers" doubled the click-through in informal testing.

## 8. Impact

_These numbers are updated by the founder. Placeholders shown below._

- 🎓 **Students onboarded:** _add real number_
- 📄 **Notes and PYQs live on the platform:** _add real number_
- 🧠 **Quizzes and tests taken:** _add real number_
- 🔥 **Longest 30-day challenge streak completed:** _add real number_
- 📱 **Telegram community members:** _add real number_
- 📸 **Instagram followers:** _add real number_
- 🎥 **YouTube subscribers:** _add real number_

Qualitative impact:

- Students at RGPV Bhopal now have a single, syllabus-aligned notes hub instead of hunting Telegram forwards.
- First-year students who had never written a line of Python have finished the 30-day challenge and shipped their first project.
- Community members contribute back — sending in PYQs and pointing out errors through the on-page feedback widget.

## 9. Tech stack

| Layer | Technology |
| --- | --- |
| Framework | TanStack Start (React 19 + Vite 7) |
| Styling | Tailwind CSS v4 (`@theme` tokens) |
| Motion | Framer Motion |
| Backend | Lovable Cloud (Supabase Postgres + Storage + Auth) |
| Auth | Email + password (HIBP leaked-password check) |
| AI | Google Gemini via Lovable AI Gateway |
| Fonts | Syne (display), Inter (body), JetBrains Mono (code) |
| Hosting | Lovable / Vercel |

## 10. Local development

```bash
# Install dependencies
bun install

# Start the dev server
bun dev

# Build for production
bun run build
```

## 11. Environment variables

Public (safe in the client, prefixed `VITE_`):

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
```

Server-only (set via Lovable Cloud secrets — never commit):

```
SUPABASE_SECRET_KEY        # service role for verified admin work only
FOUNDER_ADMIN_EMAIL        # server-side admin identity check
LOVABLE_API_KEY            # Gemini access through Lovable AI Gateway
```

## 12. Security model (short version)

- RLS on every public table; explicit `GRANT` statements per role.
- Roles in `user_roles`, checked via `has_role()` security-definer function.
- Admin identity verified server-side against `FOUNDER_ADMIN_EMAIL`.
- Storage bucket private; access only via signed URLs from server functions.
- All server function inputs validated with Zod.
- HIBP leaked-password protection on signup.
- Strict HTTP security headers on every SSR response.
- No secrets in the repo. Publishable keys only.

## 13. Roadmap

- Bookmarks synced across devices
- Offline notes (PWA)
- Peer study rooms
- Placement-prep track (aptitude + interview questions)
- Regional-language support (Hindi first)

## 14. Contributing

Issues and pull requests are welcome. If you're a student who wants clean notes for your subject added to the platform, message the founder on any community channel.

## 15. Credits

Built with love for the student community.

- Founder & maintainer: **Mohit Ahirwar**
- Community: everyone in the EMO Learners Telegram who tests, complains, and pushes back — this project exists because of you.

## License

All rights reserved. Content in `/resources` remains the property of its original authors; the platform is built for educational, non-commercial use by students.
