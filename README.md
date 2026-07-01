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

## 6. Features

**For students**

- Login / Signup (email + password, HIBP-checked)
- Subject-wise Notes and PYQs, filtered by branch and semester
- Fuzzy search across resources
- Full Python, Java, C, and DSA courses — notes + code + quizzes + exercises
- 30-day Python challenge with streaks, badges, and a certificate preview
- Interactive quizzes with instant feedback and explanations
- Timed mock tests with review mode and scoring
- AI Study Helper (Gemini) — ask any doubt, get a simple explanation
- Personal dashboard: progress, streaks, bookmarks
- Bookmarks — save any chapter, quiz, or resource
- Feedback widget on every page ("Report a mistake")
- Mobile-friendly, dark by default, keyboard-accessible

**For admins**

- Secure admin panel (`/admin`), founder-only
- Upload PDFs (drag and drop) with branch + semester tagging
- Create and edit custom quizzes and tests
- Manage subjects and resources inline

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
