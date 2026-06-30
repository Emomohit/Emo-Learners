## Goal
1. Fix Google login not working.
2. Build a premium new landing route `/challenge` (30 Days Python Challenge) for EMO Learners — without breaking the existing Cyberpunk Brutalist theme of the rest of the site.

---

## Part 1 — Fix Google Login

**Diagnosis (most likely cause):** The Google provider isn't enabled in Lovable Cloud Auth. The code in `src/routes/auth.tsx` already uses the correct managed `lovable.auth.signInWithOAuth("google", ...)` flow, so the fix is configuration, not code.

**Fix:**
- Run `supabase--configure_social_auth` with `providers: ["google"]` to enable managed Google OAuth (no credentials needed — Lovable manages them).
- Verify `redirect_uri` is `window.location.origin` (public route) — it currently points to `/dashboard` which is a **protected route**. This causes a transient "no session" bounce after Google returns. Change it to `window.location.origin` and navigate to `/dashboard` only after `onAuthStateChange` confirms the session.
- Add a small `useEffect` in `auth.tsx` to redirect signed-in users to `/dashboard` (already partially present — just ensure it fires post-OAuth).

---

## Part 2 — New `/challenge` Landing Page

A dedicated route at `/challenge` (linked from navbar + home). The existing site keeps its black/orange Cyberpunk Brutalist look; the challenge page introduces a **blue + purple gradient sub-theme** scoped to that route only, using CSS variables on a wrapper class so it doesn't pollute the global theme.

### Route & files
- `src/routes/challenge.tsx` — the new landing page
- `src/lib/challenge-data.ts` — 30-day curriculum array (title, topic, video timestamp, status placeholder) so cards can later hook into notes/quizzes/progress
- `src/components/challenge/` — section components: `Hero`, `Countdown`, `WhyChallenge`, `DayTracker`, `ProgressDashboard`, `Badges`, `CertificatePreview`, `Testimonials`, `FAQ`, `FinalCTA`
- Add a `challenge` scoped CSS block in `src/styles.css` (`.challenge-theme { --primary: blue; ... }`) — does not touch global tokens
- Update `Navbar.tsx` + `Footer.tsx` to link to `/challenge`

### Sections
1. **Sticky Navbar** — Home, Challenge, Community, FAQ, Contact (scoped to challenge page; uses existing global Navbar with anchor links)
2. **Hero** — bold "30 Days Python Challenge" headline, animated gradient bg, glow accents, two CTAs: *Join the Challenge* (→ `/auth` if logged out, else marks join in DB) and *Watch the Course* (→ YouTube link)
3. **Countdown Timer** — configurable start date constant in `challenge-data.ts`; live ticking days/hours/minutes/seconds
4. **Why This Challenge** — 3 glassmorphism cards: Consistency, Accountability, Community
5. **30-Day Tracker Grid** — 30 interactive cards (Day 1 → 30), each with topic, lock/unlock state, hover lift, click → modal placeholder (future: notes/quiz/resources). Data-driven from `challenge-data.ts`.
6. **Progress Dashboard** — completed days, current streak, % progress ring, motivational message. Reads from local state now; structured to later sync via Supabase `challenge_progress` table.
7. **Badges & Milestones** — 6 unlockable badges (Day 1, Day 7, Day 14, Day 21, Day 30, Streak-Master) with locked/unlocked visuals
8. **Certificate Preview** — mock certificate card with user name placeholder + glassmorphism frame
9. **Testimonials** — 3 placeholder cards
10. **FAQ** — accordion (shadcn `Accordion`) with 6 Q&As
11. **Final CTA** — full-width gradient band + "Join Now" button
12. **Footer** — reuse existing `Footer.tsx`

### Design system
- Scoped CSS: `--challenge-primary: oklch(0.65 0.22 265)` (blue), `--challenge-accent: oklch(0.62 0.25 305)` (purple), animated conic gradient bg, backdrop-blur glass cards
- Framer Motion for hero entrance, scroll-reveal (`whileInView`), day-card stagger, badge unlock animation
- SEO: `head()` with unique title, description, og:image (use hero gradient screenshot or generated image), JSON-LD `Course` schema with the YouTube link
- Responsive: grid `grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6` for tracker; mobile-first hero stacking
- Performance: lazy-load below-fold sections via `React.lazy` not needed (single route), but defer heavy framer-motion variants

### Future scalability (data shape, not built now)
Day card props already include: `id`, `title`, `topic`, `videoStart`, `notesUrl?`, `quizSlug?`, `assignmentUrl?`, `status: 'locked' | 'available' | 'completed'`. When auth+DB are wired later, the same component reads from a `challenge_progress` table without any redesign.

---

## Technical Details
- **No DB migrations this turn** — progress lives in component state + `localStorage`. (Optional follow-up: add `challenge_progress` table.)
- **No new deps** — uses existing `framer-motion`, `lucide-react`, shadcn `accordion`, `card`, `button`, `progress`.
- **TanStack Start route** with `createFileRoute("/challenge")`, `head()` for SEO, no loader needed (static).
- **Scoped theme**: wrap page in `<div className="challenge-theme">` so CSS vars only apply inside.

---

## Out of Scope (call out, don't build)
- Real Google credentials / BYOK — managed OAuth is sufficient.
- Backend tables for progress/leaderboard — flagged as future work.
- Email notifications, certificates as PDFs — UI preview only.
