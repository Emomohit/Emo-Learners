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

## 7. How every feature helps students

This section maps each feature back to a real student problem and shows exactly how it saves time, effort, or stress. Nothing on the platform exists just to look nice — every item below earns its place.

### 7.1 Accounts & Auth

- **Email + password only** → zero barrier to entry. A student can start using the site in under 30 seconds; no phone number, no OTP wait, no college-ID upload.
- **Show / hide password toggle** → fewer failed logins on phones where typos are common. Students stop getting locked out for a mis-typed character.
- **HIBP leaked-password check** → protects students from using a password that's already been stolen elsewhere. Their EMO Learners account can't be hijacked because of a leak on some other site.
- **Instant login after sign-up** → the student lands on the dashboard immediately and starts learning, instead of sitting on a "check your inbox" screen that often never delivers.
- **In-app forgot password** → a student who forgets their password on exam night can reset it right now, without waiting for an email that may go to spam.
- **Persistent session** → open the site tomorrow and you're still logged in. Streaks, bookmarks, and progress just work.

### 7.2 Home page

- **Countdown to the next challenge cohort** → creates urgency and a clear "start date" so students actually begin instead of postponing.
- **Site-wide search bar** → the student types "linked list" or "sem 3 maths" and lands on the right page in one step, instead of clicking through menus.
- **Quick-start cards** → a first-time visitor sees the five things the site does within 2 seconds and picks one. No confusion about where to go.
- **Live stats strip** → social proof. Seeing "X students, Y resources" tells a new visitor this is real and used, so they trust it enough to sign up.

### 7.3 Notes & PYQs

- **Branch + semester filters aligned to RGPV** → a CSE Sem-3 student sees only their subjects. No wading through irrelevant material.
- **Fuzzy search** → typo-tolerant. Search "operatng system" still finds Operating Systems. Students on mobile keyboards benefit the most.
- **Subject cards with unit breakdowns** → matches how exams are actually organized. Students can revise unit-by-unit the night before a test.
- **Signed-URL downloads** → files download instantly and stay private. Notes uploaded by other students aren't scraped by random bots.
- **Bookmark any resource** → the student saves the exact PDF they need for an upcoming exam and finds it again in one tap from the dashboard.
- **"Report a mistake"** → students actively improve content. If a PDF has a wrong answer, the founder sees it the same day and fixes it.

### 7.4 Courses (Python, Java, C, DSA)

- **Chapters instead of long videos** → a student with 20 minutes can finish one chapter and feel progress. Long-form videos make people quit at minute 8.
- **Notes + code + video timestamp per chapter** → the student reads first, tries the code, and only jumps to the video for the exact concept they didn't get. Saves hours over watching passively.
- **Copy-to-clipboard on code snippets** → students paste code into their own editor without typos. Fewer "why doesn't my code run?" moments.
- **Inline quiz right after notes** → immediate check that the concept actually landed. If they fail the quiz, they re-read before moving on — the classic learning-science loop.
- **Hands-on exercise per chapter** → moves from passive reading to actually writing code. This is what turns "I watched a course" into "I can build things".
- **Progress tracker + sidebar** → the student always knows what's next. No decision fatigue about which chapter to open. Coming back after a week, they resume in one click.
- **DSA 20-chapter track** → gives placement-prep students a structured path instead of random LeetCode grinding.

### 7.5 30-Day Python Challenge

- **Fixed 30-day structure** → converts a vague "I want to learn Python" into a concrete daily habit with an end date. Way higher completion than open-ended courses.
- **Single-tutor curriculum** → no confusion from switching styles mid-course. Consistency reduces cognitive load.
- **Time estimate per day** → the student can honestly commit to 30–45 min a day, and knows in advance if today is doable.
- **Streak counter and badges** → basic behavioural loop. Students come back not just for content, but to keep the streak alive.
- **YouTube deep-link to exact timestamp** → skips the intro, sponsors, and recap. The student is watching the actual concept in seconds.
- **Personalized certificate preview** → a real incentive to finish. Shareable on LinkedIn, useful for placements.
- **Works before login (localStorage)** → students can try Day 1 without commitment. When they hit Day 3 and want their streak safe, they sign up.

### 7.6 Practice hub

- **Quizzes with instant feedback** → students learn on the spot instead of finding out days later that they were wrong. Per-question explanations turn every mistake into a lesson.
- **Timed mock tests** → simulates real exam pressure. Students walk into the real exam with their nerves already trained.
- **Review mode after submit** → they see every question again with the right answer and reasoning. Most other quiz apps skip this.
- **One hub for all practice modes** → no hunting between three different pages. The student picks quiz / test / challenge from one screen.

### 7.7 EMoIQ — Smart Exam Strategy Engine

- **PYQ Intelligence Engine** → answers the eternal question "which units matter for this exam?" with data instead of guesses. A student staring at 5 units the night before can now confidently spend 70% of their time on the one that's actually 35% of the paper.
- **Smart Question Prediction** → gives 10 concrete questions to focus on with probability scores. Students revise with purpose instead of trying to memorize the whole book.
- **Personalized Study Plan** → replaces "I don't know where to start" with a specific day-by-day schedule. Turns a mountain of syllabus into a checklist of daily tasks.
- **Last-24-Hour Mode** → the crash-revision mode every student secretly needs. When there's no time for a full plan, EMoIQ tells them exactly what to cover and what to drop.
- **Diagnostic Quiz + feedback loop** → the plan literally adjusts to what the student got wrong. The system learns their weak spots so they don't have to self-diagnose.
- **Skip list** → tells students explicitly what NOT to study. Removes guilt about skipping units when time is short — a huge psychological win.
- **AI Doubt Solver scoped to syllabus** → generic ChatGPT often over-answers or drifts off-topic. EMoIQ's doubt solver stays inside the exam scope.

### 7.8 AI Study Helper

- **Available 24/7** → the friend who explains things at 2 AM before an exam, without judgement.
- **Simple language by default** → doesn't drown a first-year in academic jargon. Explains like a senior would.
- **Asks follow-ups on broad topics** → forces the student to narrow their doubt, which is often half the battle in understanding it.
- **Server-side Gemini key** → the student uses top-tier AI without paying for ChatGPT Plus.

### 7.9 Dashboard

- **Everything in one place** → progress, streaks, bookmarks, recent uploads. The student doesn't have to remember where they left off.
- **Recent uploads section** → students see new notes / PYQs the day they land. Encourages return visits.
- **Bookmarks list** → the "save for later" that actually gets used. Reading a bookmarked chapter is one tap from login.

### 7.10 Community & content pages

- **`/join` with all social links** → a student who wants to ask questions in real time finds the Telegram group in one click. Community reduces the drop-off that kills self-study.
- **`/about` with founder's story** → trust. Students know a real engineering student built this for them, not a faceless startup.
- **`/contact`** → a direct line to the founder for stuck students, bug reports, or content requests.
- **`/privacy-policy` in plain English** → students actually understand what data is stored. No dark patterns.

### 7.11 Site-wide UX

- **Bookmarks everywhere** → saves the student's short-term memory. They can bounce between resources without losing their place.
- **Feedback widget on every page** → one-tap way to flag errors. Content quality improves continuously because students patch it in real time.
- **Bottom nav on mobile** → thumb-reachable navigation. Faster and less frustrating on phones, which is how most students use the site.
- **Dark mode by default** → easier on the eyes during long night-before-exam sessions.
- **Reduced motion respected** → students with motion sensitivity aren't punished by animations.
- **Keyboard accessible** → students on assistive tech or budget devices without a working touchscreen can still use everything.
- **SSR + SEO** → the right pages show up on Google, so a student searching "RGPV CS-303 notes" finds EMO Learners without ever being told about it.

### 7.12 Admin panel (indirect student benefit)

- **Drag-and-drop PDF uploads** → the founder ships new notes in minutes, not hours. Students get fresh material faster.
- **Inline subject / resource / quiz / test editing** → typos and outdated PDFs get fixed the same day a student reports them.
- **Feedback inbox** → every "report a mistake" reaches the founder with context. The student who reported it sees the fix on their next visit.
- **Server-side admin gate** → students trust the platform because content can't be tampered with by fake admins.

### 7.13 Security posture (why students can trust the site)

- **RLS on every table** → one student can never read or modify another student's data. Bookmarks, progress, and doubts stay private.
- **Private storage buckets + signed URLs** → uploaded PDFs are not scrapeable via a public link. Content stays on the platform where it belongs.
- **Roles in a separate table** → a bug in the profile screen can never accidentally make someone an admin.
- **HIBP + strict security headers + Zod validation** → the boring stuff that makes sure a student's account, streak, and certificate are still there tomorrow.



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
