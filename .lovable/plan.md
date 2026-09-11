# Courses Learning System and Dashboard Profile Sync

## Scope

Upgrade the Courses section into a working YouTube learning system and repair the existing Dashboard-to-Profile connection. Keep authentication, Dashboard layout, Profile layout, and unrelated features unchanged except for the minimum profile fields/data wiring required by the requested sync.

## Verified source corrections

The implementation will use the supplied URLs and their current verified YouTube metadata without substitutions:

- **Python** `UrsmFxEIp5k`: CodeWithHarry, **10:53:54**, **33 official timestamped sections**.
- **Java** `q6z_UCBM5Ek`: Telusko / Navin Reddy, actual title **“Complete Java Development: Spring Boot, Microservices, Spring AI”**, **62:55:08**, **30 official chapters**. This exact source is not a 10-hour/24-chapter course, so the app will show the verified source facts.
- **C** `irqbmMNs2Bo`: Apna College / Shradha Khapra, **10:32:06**, **14 verified sections including introduction/setup**. No fabricated 24-chapter split will be added.
- **DSA Basics**: verified playlist with 4 available videos.
- **DSA Patterns**: verified playlist with 128 videos.
- **Recursion**: verified playlist with 9 videos.
- **Graph Series**: verified playlist with 17 resolved videos plus 1 unavailable entry. The unavailable entry remains represented as unavailable; no replacement is used. The playlist has 18 entries, so it will not be mislabeled as only 12 days.
- **AI Engineer**: verified playlist with 27 videos. Week labels will be used only where supported by the source titles/order; lessons will not be forced into invented ten-week groupings.

## Courses implementation

### 1. Replace placeholder course data

- Remove every reused, placeholder, and joke fallback video ID from the Courses section.
- Preserve all eight exact source URLs and store verified video IDs, titles, channels, thumbnails, durations, ordering, and official timestamps.
- Refine the course model to distinguish:
  - single-video courses with timestamped chapters;
  - playlist courses with ordered video modules;
  - unavailable playlist entries with an explicit unavailable state.
- Keep the data structure easy to extend with additional YouTube courses later.

### 2. Build the in-app YouTube player

- Replace the passive iframe wrapper with the official YouTube IFrame Player API while preserving YouTube branding and controls.
- Support play, pause, seek, volume, playback speed, fullscreen, chapter seeking, video switching, playback-state tracking, and ended events.
- For single videos, selecting a chapter seeks to its verified start time.
- For playlists, selecting a module loads that module’s exact video ID.
- Detect player/embed failures where the API exposes them and show the requested message plus an **Open on YouTube** action; never substitute another source.

### 3. Add durable progress and resume

- Add an authenticated, owner-only course progress table storing course ID, content item ID, video ID, last timestamp, completed items, percentage, and last watched date.
- Apply explicit authenticated/service grants and row-level rules scoped to the current user.
- Use the existing query/cache system for loading and saving progress, with throttled timestamp updates rather than writing every second.
- Keep a local fallback for signed-out learners, then merge the newest valid progress after sign-in.
- Make **Continue Learning** restore the exact course, video/chapter, and timestamp across devices.
- Mark completion manually and from verified video-ended events; update course cards immediately.

### 4. Upgrade the Courses library and player screen

- Course cards will show the actual thumbnail, verified title/source, instructor/channel, level, actual duration, module count, progress, and Start/Continue action.
- Add search across course titles, instructors, channels, tags, and module/chapter titles.
- Add category, level, duration, and instructor filters using the requested category vocabulary.
- Keep the existing restrained visual design and only restructure the course player into the requested player/content/sidebar layout.
- Preserve Notes, Quiz, and Exercises where real authored content already exists; do not fabricate lesson material for playlist videos.
- Add loading skeletons, empty states, unavailable-video states, retry actions, and accessible mobile behavior.

## Dashboard and Profile synchronization

### 5. Establish one profile data source

- Add one shared current-profile query keyed by the authenticated user ID.
- Use that query in both Profile and Dashboard instead of Dashboard user metadata or duplicate state.
- Add the requested persisted `academic_year` profile field, with validation consistent with semesters 1–8.
- Add loading skeletons, a visible non-fake fallback, error logging, and retry controls.
- Keep owner-only profile access enforced so one student cannot read another student’s row.

### 6. Repair profile save and avatar flow

- Update the existing Profile form minimally to edit academic year alongside its current fields.
- Convert profile saving to the existing mutation/cache pattern and immediately update or invalidate the shared profile query before returning to Dashboard.
- Create/configure the missing avatar storage bucket and owner-scoped upload/update/delete rules required by the existing upload flow.
- Store avatar files under the authenticated user’s folder, validate image type/size, avoid orphaning replaced files where possible, and show the existing default avatar if loading fails.

### 7. Display synchronized data on Dashboard

- Keep the current Dashboard structure and resource functionality intact.
- Replace the greeting’s auth-metadata lookup with the shared profile row.
- Display the current student’s name, avatar, branch, semester, and academic year.
- Refetch on entry/focus and after profile save so edits appear immediately, after refresh, and after logout/login.

## Technical details

- Add one database migration for `profiles.academic_year`, the user-owned course-progress table, required grants/RLS policies, and avatar storage setup/policies.
- Use TanStack Query for profile/course-progress reads and mutations; no second state library.
- Keep public course metadata static and source-controlled so the app does not depend on an exposed YouTube API key or a runtime scraping service.
- Correct typed course links to use the `/courses/$slug` route with params.
- Add complete route metadata (`title`, description, Open Graph, Twitter card) to both Courses routes while keeping bundled/external-image metadata rules intact.

## Verification

- Validate that every stored source URL/ID exactly matches the user-supplied source list.
- Compare every single-video chapter against official source timestamps and every playlist module against the retrieved order/title/duration.
- Confirm the three supplied single videos load in-app and chapter clicks seek accurately.
- Confirm playlist module switching, unavailable-entry fallback, previous/next, completion, timestamp persistence, and cross-device resume behavior.
- Test search and every filter on desktop and mobile with no overflow or text overlap.
- Test authenticated profile ownership and course-progress row isolation.
- Test the full requested flow: login → Dashboard → Profile edits for name/branch/semester/year/avatar → save → Dashboard updates → refresh → logout/login → values remain correct.
- Run focused type checks/tests and browser checks with console/network error review.
