
## Goal

Bring back the original engineering study hub on **/resources** alongside the existing AI Tools directory, and layer on a real backend: student auth, admin-only PDF uploads (notes & PYQs), branch/semester/subject browsing, search, a student dashboard, feedback form, and an AI Study Assistant chat. Everything stays in the existing Cyberpunk Brutalist look.

## Scope (your selections)

- **/resources** with two tabs: **Academics** (default) + **AI Tools** (existing directory).
- **Branches at launch:** CSE, CSE‑IT, CSE‑CY, AIML — all 8 semesters scaffolded.
- **Auth:** Email/password + Google. Role-based admin (you become admin and can promote others).
- **Dashboard:** Recent uploads + Lovable-AI Q&A chat (general study assistant, no PDF RAG yet).

## What gets built

### 1. Backend (Lovable Cloud)

Enabled in step 1 so DB, auth, and storage are available.

- **Tables**
  - `profiles` (id → auth.users, full_name, branch, current_semester, avatar_url)
  - `app_role` enum (`admin`, `student`) + `user_roles` table + `has_role()` security-definer function (per Lovable user-roles pattern)
  - `subjects` (id, branch, semester, code, name) — seeded for the 4 branches × 8 sems
  - `resources` (id, subject_id, kind enum: `notes` | `pyq` | `syllabus` | `important_qs`, title, description, file_path, file_size, year nullable, uploaded_by, created_at)
  - `feedback` (id, user_id nullable, name, email, message, created_at)
  - `ai_conversations` + `ai_messages` for the study assistant (per-user threads)
- **Storage bucket** `study-materials` (public read, admin-only write via RLS on `storage.objects`).
- **RLS**
  - `profiles`: user reads/updates own row.
  - `resources`, `subjects`: public SELECT; INSERT/UPDATE/DELETE only when `has_role(auth.uid(), 'admin')`.
  - `feedback`: anyone INSERT; admin-only SELECT.
  - `ai_conversations`/`ai_messages`: owner-scoped via `auth.uid()`.
- **Seed migration** populates the 4 branches × 8 semesters and a starter set of standard subjects per semester.
- **Bootstrap admin:** trigger that grants `admin` role to the first signup whose verified email matches the configured founder address (`hello.emolearners@gmail.com`) — guarded by `email_confirmed_at` to avoid the domain-spoof escalation path.

### 2. Auth surface

- **`/auth`** — public page with Email/password (sign in + sign up tabs) and "Continue with Google" via the Lovable broker.
- Managed `_authenticated/route.tsx` gate (ssr: false → redirect to `/auth`).
- Root listener wired for `SIGNED_IN`/`SIGNED_OUT`/`USER_UPDATED` → router invalidate + selective query refresh.
- Navbar shows **Sign in** when logged out; avatar + dropdown (Dashboard / Admin if role / Sign out) when logged in.
- Sign-up flow creates a `profiles` row via DB trigger and a default `student` role.

### 3. /resources rebuild (tabbed)

- Two pill tabs at the top: **Academics** | **AI Tools**.
- **Academics tab**
  - Hero with site-wide search bar (free-text across subjects + resources).
  - Branch picker (4 cards): CSE, CSE‑IT, CSE‑CY, AIML.
  - Branch detail → semester strip (1–8) → subject list.
  - Subject page (`/resources/$branch/$semester/$subject`) lists Notes, PYQs, Syllabus, Important Questions tabs; each card links to a signed-URL PDF download.
  - PDFs render in a lightweight inline viewer (object/iframe) with download fallback.
- **AI Tools tab** keeps the existing curated directory.

### 4. Admin panel (`/_authenticated/admin`)

Visible only to `admin` role; gated by `beforeLoad` calling a `requireSupabaseAuth` server fn that checks `has_role`.

- **Dashboard** (counts: total resources, by kind, recent uploads, feedback unread)
- **Upload form** — branch + semester + subject + kind + title + year (PYQs) + description + PDF file. Server fn: validate (Zod, max 25 MB, mime `application/pdf`), get signed upload URL, insert `resources` row.
- **Manage list** — table of uploads with delete (revokes storage object + row).
- **Feedback inbox** — read-only list with email + message.
- **Promote user to admin** — input email → server fn looks up auth user via admin API, inserts `user_roles` row.

### 5. Student dashboard (`/_authenticated/dashboard`)

- Welcome card with branch/semester selector (writes to `profiles`).
- **Recent uploads** — last 10 across the site, plus a "for your branch + sem" lane.
- **AI Study Assistant** card linking to `/dashboard/ai`.
- Edit profile + sign out.

### 6. AI Study Assistant (`/_authenticated/dashboard/ai`)

- Chat UI using `useChat` from `@ai-sdk/react`, streaming via a server route `/api/chat`.
- Server route uses Lovable AI Gateway with `google/gemini-3-flash-preview` and a system prompt scoped to engineering study help (concepts, problem-solving, exam prep).
- Conversations persisted to `ai_conversations` / `ai_messages` for the signed-in user; thread list in sidebar.
- Markdown rendering with `react-markdown` + `remark-gfm`.

### 7. Search

- Global search bar on Academics tab and a dedicated `/search?q=` route.
- Server fn does `ilike` across `subjects.name`, `subjects.code`, `resources.title`, `resources.description`. Results grouped by subject and resource kind.

### 8. Feedback & Contact (`/contact`)

- Public form: name, email, message (Zod validated, length-bounded).
- POST writes to `feedback`. Confirmation toast. Existing email/Telegram CTAs from `/join` link here.

### 9. UI consistency

- All new pages use the existing Cyberpunk Brutalist tokens, `Navbar`, `Marquee`, `Footer`.
- New shadcn components used as needed (Tabs, Dialog, DropdownMenu, Avatar, Table, Toast — already in `src/components/ui/`).
- Mobile responsive via existing grid patterns.

## Technical details

```text
src/
├── integrations/supabase/        # managed (auth-middleware, client, client.server, types)
├── routes/
│   ├── __root.tsx                # add auth listener + nav dropdown
│   ├── auth.tsx                  # public sign in/up (email+pw, Google)
│   ├── resources.tsx             # tabbed shell (Academics | AI Tools)
│   ├── resources.$branch.tsx
│   ├── resources.$branch.$semester.tsx
│   ├── resources.$branch.$semester.$subject.tsx
│   ├── search.tsx
│   ├── contact.tsx
│   └── _authenticated/
│       ├── route.tsx             # integration-managed gate
│       ├── dashboard.tsx
│       ├── dashboard.ai.tsx
│       └── admin.tsx             # role-gated inside loader
├── routes/api/
│   └── chat.ts                   # AI SDK streaming server route
├── lib/
│   ├── ai-gateway.server.ts      # Lovable AI provider helper
│   ├── resources.functions.ts    # list/get/search resources, signed download
│   ├── admin.functions.ts        # require admin role; upload/delete/promote
│   ├── feedback.functions.ts
│   └── ai-threads.functions.ts
└── components/
    ├── auth/UserMenu.tsx
    ├── resources/{BranchGrid,SemesterStrip,SubjectList,ResourceCard,PdfViewer,SearchBar}.tsx
    └── admin/{UploadForm,ResourceTable,FeedbackInbox,PromoteForm}.tsx
```

Server-fn rules followed: secrets read inside handlers, admin client loaded with `await import()` only after role check, public read-only paths use the publishable server client, `requireSupabaseAuth` for user-scoped calls, file uploads via signed URL from the client direct to Storage.

## Build order

1. **Enable Lovable Cloud** (auth + DB + storage become available).
2. **DB migration #1**: roles, profiles, subjects, resources, feedback, ai tables + RLS + grants + seed + admin-bootstrap trigger.
3. **Storage bucket** `study-materials` + RLS on `storage.objects`.
4. **Auth surface**: `/auth` page, `UserMenu`, root auth listener, managed `_authenticated/route.tsx`.
5. **Resources tabbed page** + branch/semester/subject routes + signed-URL viewer.
6. **Search route + global SearchBar**.
7. **Admin panel** (gated) with upload form, manage list, promote, feedback inbox.
8. **Student dashboard** with recent uploads + profile editor.
9. **AI chat**: `/api/chat` server route, `ai-gateway.server.ts`, `dashboard.ai.tsx` UI, threads persistence.
10. **Contact/feedback** public form.
11. **Manual smoke test** every flow (sign up → admin promote → upload → student browse/search/download → AI chat → feedback).

## Out of scope for v1 (can ship later)

- PDF-grounded AI (RAG over selected PDFs) — explicitly deferred per your choice.
- Bookmarks / saved resources.
- Notifications, comments on resources, ratings.
- Bulk upload / drag-multi-PDF zip ingest.

## What I need from you to start building

- Confirm the **founder admin email** that should be auto-promoted on first verified signup. Default: `hello.emolearners@gmail.com`. (You can also promote yourself manually later if you prefer that.)

If that's correct, approving this plan kicks off step 1 (enabling Lovable Cloud) and the migration.
