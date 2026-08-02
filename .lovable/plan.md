## Goal

Two things: (1) redesign every page on a single new premium SaaS-style design system, and (2) credit the actual teacher behind each course video in the learn sections.

## 1. New design system (foundation first)

Midnight Indigo, applied as semantic tokens in `src/styles.css` — no hardcoded colors in components:

- Background `#0a0a1a`, elevated surfaces `#141432`, borders `#1e1e5a`, primary/accent `#4f46e5`
- Fonts loaded via `<link>` in `src/routes/__root.tsx`: Space Grotesk 700 (headings), Inter 400/500 (body), JetBrains Mono (code)
- Rounded cards (xl/2xl radius), subtle indigo gradient glows, soft elevation shadows, glass surfaces
- Motion: fade-in on section reveal, gentle card lift on hover, smooth focus rings — Stripe/Linear/Notion restraint, not flashy
- Retire the old brutalist orange/hard-shadow utilities so nothing renders half-old, half-new

Shared shell rebuilt on the new system: `Navbar`, `BottomNav`, `Footer`, and reusable pieces (page hero, section header, card, stat tile, empty state, skeleton) so every page looks consistent instead of individually styled.

## 2. Homepage rebuilt for discoverability

Large hero (headline, subline, primary + secondary CTA, trust strip) followed by clean responsive card grids in this order: Branch selection → Semester-wise materials → Notes → PYQs → Important Questions → Courses → Coding Resources → AI Assistant / EMoIQ → Latest Uploads. Mobile-first, consistent spacing scale.

## 3. Every other page restyled

Auth & reset · Resources · Courses index + course detail · Challenge · Practice, Quizzes, Tests · EMoIQ hub and its 6 tools · Placement hub + coding/aptitude/interview/resume · Roadmap · Progress · Dashboard · AI Assistant · About · Join · Contact · Internships · Admin · Privacy.

Each keeps its current functionality and data wiring — only layout, spacing, typography, cards, and states change. Loading skeletons, empty states, and error/retry states get the same treatment so no page falls back to unstyled output.

## 4. Real teacher credits in learn sections

Course metadata gains proper credit fields (teacher real name, channel, source video URL) and a small reusable `CourseCredit` component showing e.g. **Haris Ali Khan · CodeWithHarry · Watch source →**:

- Python (video `UrsmFxEIp5k`) — Haris Ali Khan, CodeWithHarry
- Java (`q6z_UCBM5Ek`) — Haris Ali Khan, CodeWithHarry
- C (`irqbmMNs2Bo`) — Haris Ali Khan, CodeWithHarry
- DSA track — no single source video today, so it stays honestly credited as an EMO Learners curated track (no invented teacher). If you give me the YouTube video/playlist you want it built on, I'll add that teacher's name and link too.

Credit shown on course cards, course detail headers, each chapter's video link, and the 30-Day Challenge day cards. Plus a short "Credits & sources" block on `/about` listing every external teacher whose material the platform links to.

## Technical notes

- Tokens in `src/styles.css` (`@theme inline`), fonts via root-route `<link>` — no `@import` of remote URLs.
- Credit fields added to the `Course` type in `src/lib/course-data.ts` (+ `dsa-course.ts`, `challenge-data.ts`); rendering via one shared component so it can't drift.
- No database or backend changes; RLS, auth, admin, and AI functions untouched.
- Each route keeps/gets its own `head()` metadata with unique title and description; existing SEO, sitemap, and verification files preserved.
- Verified after: typecheck/build clean, mobile + desktop spot-checks in the preview.

## Scope note

This touches ~35 route files, so I'll go foundation → shell → homepage → section by section, and you can course-correct after the homepage lands.
