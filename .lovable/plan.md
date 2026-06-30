
## 1. Fix the infinite-loop crash on Home (root cause of "broken after login")

`src/routes/index.tsx` → `useCountdown(target)` receives a `new Date(...)` re-created on every render. The effect depends on `[target]`, so it re-runs every render → `setNow` → re-render → new `target` → "Maximum update depth exceeded" (the exact error in console). After Google sign-in the browser lands on `/` and the home page crashes, which is why the challenge page is unreachable.

Fix: compute the target date once with `useState`/`useMemo` so the reference is stable, and depend on its timestamp (number) inside the effect — same fix applied in `src/routes/challenge.tsx` if it has the same pattern.

## 2. Google sign-in callback → land on `/challenge`

Today the Google flow uses `redirect_uri: window.location.origin` (public, correct) but the user wants to land on the challenge page after auth.

- Before calling `lovable.auth.signInWithOAuth("google", ...)` in `src/routes/auth.tsx`, store `sessionStorage.setItem("postAuthRedirect", "/challenge")` (or read it from a `?next=` query param if present on `/auth`).
- Keep `redirect_uri: window.location.origin` (must stay public per platform rules).
- In `src/routes/__root.tsx`, extend the existing `supabase.auth.onAuthStateChange` listener: on `SIGNED_IN`, if `sessionStorage.postAuthRedirect` is a same-origin path, `router.navigate({ to: that path })` and clear the key.
- Also update the email-password path in `auth.tsx` to honor the same `postAuthRedirect` instead of hard-coding `/dashboard`.
- Add a small note in the sign-in card: "You'll be taken to the 30-Day Python Challenge."

Preview-iframe note: per platform guidance, full Google sign-in is verified on the published URL — the preview proxy can interfere with the POST. We will not add iframe detection or alternate `/login?google=1` routes.

## 3. Rewrite all 30-day notes from the single video `https://youtu.be/UrsmFxEIp5k`

Replace `seeds[]` in `src/lib/challenge-data.ts` so every day maps to a chapter of that one-shot video (CodeWithHarry's Python tutorial in Hindi, ~12 hours, chaptered). For each day:

- `title` — the chapter name as it appears in the video.
- `topic` — one-line description of what that chapter covers.
- `notes` — 4–6 bullets explaining the concept *as taught in that chapter* (definition, syntax, when to use it, common mistake/tip).
- `snippet` — a runnable Python example matching that chapter.
- `videoUrl` — `https://youtu.be/UrsmFxEIp5k?t=<seconds>` deep-linked to the chapter start so "Watch on CodeWithHarry" jumps directly to that section.

Chapter → Day mapping (drawn from the video's own chapter list):

```text
Day 1  Introduction & Installation        Day 16 List Methods
Day 2  Modules, Pip & PyPI                Day 17 Tuples
Day 3  How Python Works                   Day 18 Sets
Day 4  Comments, Escape Seq, print()      Day 19 Dictionaries
Day 5  Variables & Data Types             Day 20 Functions
Day 6  Operators                          Day 21 Function Arguments & Recursion
Day 7  Type Conversion & input()          Day 22 File I/O
Day 8  Strings                            Day 23 Classes & Objects (OOP basics)
Day 9  String Methods                     Day 24 Constructor & `self`
Day 10 if / elif / else                   Day 25 Inheritance
Day 11 Match-case                         Day 26 Access Modifiers, @property
Day 12 while loops                        Day 27 Static Methods & Class Methods
Day 13 for loops + range                  Day 28 Exception Handling (try/except)
Day 14 break, continue, pass              Day 29 Iterators & Generators
Day 15 Lists                              Day 30 Decorators + Mini Project recap
```

Each day's `notes` will be written in EMO Learners' voice (short, direct, student-friendly) and explain *why* the concept matters, not just what it is — e.g. for Day 19 (Dictionaries): what a key/value pair is, `{}` vs `dict()`, `.get()` vs `[]` for missing keys, why dicts are ordered since Python 3.7, common bug of using a mutable key.

I'll also remove `COURSE_PLAYLIST_URL` references in the UI so every "Watch" link points at the single requested video at the right timestamp.

## 4. Verify

- Open `/` → no console "Maximum update depth" error; countdown ticks.
- Open `/auth`, click Continue with Google on published URL → after callback, land on `/challenge` with session active.
- Open `/challenge`, click any day card → dialog shows new chapter title, explanation bullets, snippet, and the "Watch on CodeWithHarry" button opens the video at that chapter's timestamp.

## Files touched

- `src/routes/index.tsx` — stabilize `target` in `useCountdown`.
- `src/routes/challenge.tsx` — same countdown fix if present; honor chapter-deep-linked video URLs.
- `src/routes/auth.tsx` — read `?next=`, store `postAuthRedirect`, default to `/challenge` for Google.
- `src/routes/__root.tsx` — on `SIGNED_IN`, navigate to stored `postAuthRedirect`.
- `src/lib/challenge-data.ts` — full rewrite of `seeds[]` with chapter-accurate notes, snippets, and timestamped video URLs from `youtu.be/UrsmFxEIp5k`.
