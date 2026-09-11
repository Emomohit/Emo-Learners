# Dashboard Learning Hub and External YouTube Flow

## Scope

Turn the existing Dashboard into the primary student overview, remove the embedded YouTube player, update Padho With Pratyush links, and repair errors found in these connected flows. Keep existing Profile and Progress URLs working, but make Dashboard the main overview without introducing duplicate profile or progress storage.

## Verified current state

- Dashboard already reads the current student through the shared profile query, but still focuses on resource counts and has no course-progress overview.
- Profile edits already write to the existing `profiles` row and invalidate the shared profile query before returning to Dashboard.
- Course progress currently uses the existing `course_progress` table with a signed-out local fallback, but Dashboard and the Courses library do not yet use one shared query for all progress rows.
- The course page embeds `YouTubePlayer`; that component supplies automatic timestamps and ended events.
- Padho With Pratyush courses currently point to the old channel handle `@PadhoWithPratyush`, not the supplied `https://www.youtube.com/@padho_with_pratyush` URL.
- The separate Progress page still calculates course activity from browser storage and therefore is not the same authenticated source used for cross-device course progress.

## Course and YouTube changes

1. **Use the supplied creator channel**
   - Replace the old Padho With Pratyush channel URL everywhere those five courses display creator attribution.
   - Preserve the existing verified playlist URLs, lesson video IDs, titles, order, unavailable entry, teacher name, and professional profile.

2. **Remove in-app YouTube playback**
   - Remove the embedded YouTube player from course screens and remove its unused component after all imports are gone.
   - Show the selected lesson’s real thumbnail, title, duration, source status, and a prominent **Watch on YouTube** action instead.
   - For a single-video course, build the action from the exact course video ID plus the selected chapter’s verified timestamp.
   - For a playlist course, build the action from the selected module’s exact video ID and saved timestamp when one exists; otherwise start at that module’s verified start.
   - Unavailable playlist entries remain clearly unavailable and never receive a replacement video.

3. **Keep progress honest after player removal**
   - Selecting a chapter/module records it as the current learning item, but does not falsely mark it complete.
   - Keep **Mark done** as the explicit completion control and persist it through the existing progress table/local fallback.
   - Continue Learning opens the correct course and selects the saved chapter/module; its YouTube action opens the exact saved timestamp when that timestamp already exists.
   - Do not invent watched time. Once the embedded player is removed, YouTube cannot report playback time back to the app, so automatic new timestamp and video-ended tracking will be removed rather than simulated.

## Shared progress source

4. **Create one reusable progress query layer**
   - Add a shared authenticated course-progress query keyed by the current user ID.
   - Read all current-user `course_progress` rows under the existing owner-only rules, merge only the valid newest local fallback where needed, and expose normalized progress records to Dashboard, Courses, and Progress.
   - Route all progress writes through one mutation/helper path and invalidate the shared progress query after chapter selection, completion, reset, or timestamp changes.
   - Log real read/write errors, show user-safe messages, and never silently replace failed authenticated reads with zeroed or dummy values.

5. **Make existing progress surfaces consistent**
   - Update the Courses library’s Continue Learning area to use the shared progress source.
   - Update the existing Progress page to use the same course-progress records instead of its separate browser-only course calculation, while preserving its unrelated quiz, challenge, bookmark, and roadmap statistics.
   - Keep `/profile` and `/progress` functional for direct links; Dashboard becomes the primary overview rather than deleting useful edit/detail screens.

## Dashboard redesign

6. **My Profile**
   - Use the existing shared profile query and current authenticated user ID.
   - Display signed profile picture, name, expanded branch label, semester, and academic year in a compact Dashboard section.
   - Link **Edit Profile** to the existing Profile editor; saving there continues to invalidate the same query so Dashboard updates immediately.
   - Show a profile skeleton while loading and a clear retry state on failure, with no fake “Student” or placeholder academic values presented as real data.

7. **My Progress and Continue Learning**
   - Compute from the shared course catalog plus the current student’s real progress rows:
     - courses started;
     - courses completed only when every available required lesson is complete;
     - completed chapters/modules;
     - overall progress from completed required items divided by total required items across started courses;
     - current course from the most recent `last_watched_at` row.
   - Exclude unavailable playlist entries from completion requirements while still showing them in course content.
   - Show total learning time only if trustworthy stored duration data exists; otherwise omit it.
   - Make the primary Continue Learning action open the saved course and selected lesson, ready for its exact YouTube timestamp action.

8. **Recently Learned and recommendations**
   - Build Recently Learned strictly from real progress rows ordered by `last_watched_at`, resolving each row to its real course and chapter/module title.
   - Format relative dates from persisted timestamps; show an honest empty state when no activity exists.
   - Recommend real catalog courses the student has not completed, without inventing personalization claims or activity.

9. **Responsive structure**
   - Preserve the app’s minimal visual system, navigation, semantic tokens, and restrained motion.
   - Desktop order: welcome; profile/progress overview; Continue Learning; statistics; recent learning; recommended courses; existing resource access where still useful.
   - Mobile order: welcome; profile; Continue Learning; progress; statistics; recent learning; recommendations.
   - Remove the redundant Profile quick card and replace old Dashboard summary elements with the integrated sections; prevent horizontal overflow and text collisions.

## Error handling and technical cleanup

- Use existing design-system buttons for new controls and accessible external-link labels.
- Add complete Dashboard metadata: title, description, Open Graph title/description/type, and Twitter card.
- Address concrete TypeScript, console, network, stale-query, broken-link, and rendering errors discovered in the touched Dashboard/Profile/Courses/Progress flow; unrelated product areas remain unchanged.
- Preserve owner-only data access: every profile/progress query remains scoped to the signed-in student and protected by the existing database rules.

## Verification

- Confirm all five Padho With Pratyush courses link to `https://www.youtube.com/@padho_with_pratyush`.
- Confirm every chapter/module button opens its exact original YouTube video at the expected timestamp, with no iframe/player remaining in the app.
- Verify unavailable Graph Series content remains unavailable and is never substituted.
- Test authenticated isolation and database error/retry states for profile and progress.
- Test: sign in → Dashboard profile/progress load → choose a course chapter → open exact YouTube timestamp → mark complete → return to Dashboard → progress and recent learning update → edit Profile → save → Dashboard updates → refresh → data persists.
- Test Courses, Dashboard, Profile, and Progress on desktop and mobile, including empty/loading/error states, browser console/network failures, and horizontal overflow.
- Run focused type checks/tests and verify no remaining `YouTubePlayer` imports or old Padho With Pratyush channel URLs.
