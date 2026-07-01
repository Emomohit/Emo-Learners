# EMoIQ — AI-Powered Smart Exam Strategy Engine

Also done this turn: About page's "View Portfolio" now links to https://mohitahirwarportfolio.vercel.app/.

## Where it lives
- Full new section inside EMO Learners at `/emoiq` (shares login, DB, AI credits).
- Prominent card on home + nav item + footer link.
- If you later want a standalone project, create it from Lovable dashboard and I'll port this code.

## User flow
1. Student signs in (existing EMO Learners auth).
2. `/emoiq` — landing with 4 tools: **Analyze PYQs**, **Predict Questions**, **Study Plan**, **Doubt Solver**. Plus dashboard of past analyses/plans.
3. `/emoiq/analyze` — upload 1–5 PDFs of past year papers → AI extracts units, topic frequency, marks distribution, year trend → visual report ("Unit 3 = 35% weightage, HIGH").
4. `/emoiq/predict` — pick a saved analysis → AI returns top 10 probability-ranked questions ("70% chance of appearing").
5. `/emoiq/plan` — enter subject, weak topics (auto-filled from quiz history), days left → AI generates day-by-day plan. Toggle **Last-24h crash mode** for a 24-hour revision sprint.
6. `/emoiq/quiz` — 10-Q adaptive quiz on selected topics → results retune the active plan (moves weak topics to top).
7. `/emoiq/doubt` — syllabus-scoped AI chat (streams answers, remembers thread, cites which unit).

## Backend (Lovable Cloud)
- Storage bucket **`pyq-papers`** (private, per-user path `userId/{uuid}.pdf`, 20MB cap).
- Tables (all with GRANTs + RLS scoped to `auth.uid()`):
  - `pyq_papers` — id, user_id, subject, year, storage_path, page_count, status.
  - `pyq_analyses` — id, user_id, subject, weightage_json, topic_freq_json, trend_json, summary, created_at.
  - `predicted_questions` — id, analysis_id, user_id, question, probability, unit, marks.
  - `study_plans` — id, user_id, subject, days_left, mode ('normal'|'crash'), plan_json, active.
  - `emoiq_weak_topics` — user_id, subject, topic, score, updated_at.
  - `emoiq_quiz_attempts` — id, user_id, subject, topics[], score, details_json.
  - `emoiq_doubt_threads` / `emoiq_doubt_messages` — chat history.
- Edge functions (Lovable AI Gateway, `google/gemini-2.5-flash`):
  - `emoiq-analyze` — extracts PDF text, prompts model for structured JSON (units, weightage, trend, summary), stores in `pyq_analyses`.
  - `emoiq-predict` — takes analysis id → returns ranked question list.
  - `emoiq-plan` — inputs (subject, weak topics, days, mode) → returns daily plan JSON.
  - `emoiq-quiz` — generates MCQs targeted at weak topics; on submit, updates `emoiq_weak_topics`.
  - `emoiq-doubt` — streaming chat, syllabus-scoped system prompt.
- Rate limit: 20 AI calls/user/day (counted in `profiles`).

## Frontend
- New routes under `src/routes/emoiq.*` (index, analyze, predict, plan, quiz, doubt, `$analysisId`).
- Shared `src/lib/emoiq/*` (types, api wrappers, prompts).
- Cyber-brutalist theme reused; adds a signature EMoIQ accent (electric cyan) so it feels like its own product-in-a-product.
- Charts: `recharts` (already in the tree) for weightage bars + year trends.
- Navbar: add "EMoIQ" pill (with "AI" badge). Home hero: add a full-width EMoIQ CTA card. Footer: link under Explore.

## Security
- All tables `authenticated`-only; policies use `auth.uid() = user_id`.
- Storage policies restrict `pyq-papers` to owner path.
- Edge functions verify JWT; PDF size + MIME check; per-user rate limit.
- Zod validation on every server input.
- No PII in logs.

## Out of scope (v1)
- Multi-user shared analyses / marketplace of PYQ packs.
- OCR for scanned handwritten papers (v1 assumes text-based PDFs; scanned ones get a "text not extractable" warning).
- Payment tier — everything free for signed-in students.

## Deliverables checklist
- [ ] DB migration (7 tables + policies + grants)
- [ ] Storage bucket + policies
- [ ] 5 edge functions
- [ ] 7 route files
- [ ] Nav + Home + Footer links
- [ ] Rate limiting
- [ ] Basic empty/error/loading states across all screens

Approve and I'll build it end-to-end.
