## Goal

Rebuild the entire EMO Learners interface as a polished, responsive student dashboard and repair all confirmed application errors without changing existing learning, AI, account, admin, or data functionality.

## Locked visual direction

- **Canvas:** pure `#FFFFFF` everywhere, including navigation, cards, menus, forms, footers, mobile navigation, loading states, and special sections. No dark, tinted, colored, translucent, or gradient backgrounds.
- **Color:** vibrant electric blue, yellow, orange, red, green, purple, pink, and cyan used strategically for text, headings, icons, buttons, progress indicators, borders, marker accents, and small decorative details.
- **Typography:** Space Grotesk for bold, oversized headings; DM Sans for readable interface and body copy. Letter spacing remains neutral.
- **Structure:** the selected Modern Student Dashboard direction—compact navigation, clear status and progress areas, fast access to key tools, disciplined card grids, and a strong mobile layout.
- **Shape and depth:** crisp 6–8px radii, thin colored borders, restrained neutral shadows, and no glassmorphism, glow fields, floating color blobs, or 3D tilt effects.
- **Motion:** short entrance fades, marker-underline draws, subtle card lifts, and tactile button presses, with reduced-motion support.

## 1. Restore a working application first

- Fix the confirmed malformed Windows path string in `src/lib/learn-data.ts` that currently prevents every page from loading.
- Re-run type checks and the application build, then resolve every remaining compile or route error revealed by those checks.
- Exercise the main interactive flows in the live preview and fix verified browser errors, failed actions, and broken navigation.

## 2. Establish one white-background design system

- Replace the existing Midnight Indigo variables in `src/styles.css` with semantic white-canvas tokens, dark readable text, neutral borders, and a controlled set of vibrant accent roles.
- Remove all page backgrounds based on gradients, dark themes, glass effects, glows, and colored surfaces, including the challenge-specific dark sub-theme.
- Replace legacy utilities such as gradient buttons, animated gradient text, aurora fields, shine sweeps, and 3D tilt with reusable white cards, colored-outline controls, marker accents, progress treatments, and restrained elevation.
- Load DM Sans alongside Space Grotesk through the document head and preserve JetBrains Mono only where code benefits from it.
- Standardize spacing, headings, form fields, buttons, badges, empty states, errors, skeletons, and focus states for accessibility.

## 3. Rebuild the shared student shell

- Redesign the top navigation, mobile bottom navigation, footer, announcement strip, feedback control, and global error/not-found screens using the selected dashboard composition.
- Keep every existing destination and signed-in/admin action available, while simplifying labels and menu grouping for quick student access.
- Ensure desktop, tablet, and mobile navigation remains readable, touch-friendly, and free of overlap.

## 4. Redesign every page in consistent batches

### Home and public information

- Rebuild `/` as the product itself: oversized colorful headline, prominent search, quick actions, learning resources, EMoIQ, placement preparation, current progress, and recent content.
- Restyle About, Contact, Join, Internships, and Privacy without turning them into disconnected card walls.

### Learning and practice

- Redesign Courses, course detail, the 30-Day Challenge, Practice, Quizzes, Tests, Resources, and Roadmap.
- Preserve teacher credits, embedded videos, exercises, quizzes, code execution, bookmarks, filters, search, exports, and progress tracking.
- Give course topics distinct accent colors while keeping every surface white.

### EMoIQ and AI tools

- Unify the EMoIQ hub, PYQ analysis, prediction, study plan, diagnostic quiz, doubt solver, Top 32 questions, and AI Assistant.
- Improve upload, processing, loading, results, retry, search, sorting, and empty states without changing the secured AI request flow.

### Placement and progress

- Redesign Placement, Coding Practice, Aptitude, Mock Interview, Resume Analyzer, Dashboard, and Progress Analytics as focused workspaces with clear steps and scannable results.
- Keep analytics visually expressive through colored text, lines, icons, borders, and charts—not colored panels.

### Account and administration

- Restyle sign-in, sign-up, password reset, and Admin tools with clear validation and safe error messages.
- Preserve current authentication, role checks, upload restrictions, and server-side security controls.

## 5. Content, accessibility, and metadata quality

- Correct visible spelling, capitalization, clipped labels, inconsistent terminology, and unclear calls to action across the interface.
- Keep one clear H1 per page, meaningful labels, keyboard focus, adequate color contrast, reduced-motion behavior, and descriptive image/icon treatment.
- Add or correct unique title, description, Open Graph title/description, Open Graph type, and Twitter card metadata on every content route that lacks them.

## 6. Verification

- Confirm type checks and application build pass.
- Test key routes and interactions in the browser: navigation, search, authentication forms, resources, courses, quizzes/tests, EMoIQ uploads/results, placement tools, roadmap export, progress, and admin access states.
- Visually inspect representative pages at desktop and mobile sizes, checking pure-white backgrounds, text fit, spacing, contrast, navigation, and loading/error states.
- Re-scan the changed frontend for forbidden dark, tinted, colored, and gradient background treatments before completion.

## Technical notes

- Tailwind v4 semantic tokens remain in `src/styles.css`; visual values will not be hardcoded throughout page components.
- Existing backend schema, RLS policies, rate limiting, CSRF checks, upload validation, and authentication gates remain intact unless testing proves a defect.
- Shared patterns will be extracted into focused reusable components so all routes stay consistent and future edits do not drift.
- The selected prototype guides hierarchy and density, but its gray outer canvas and dark action banner will be converted to white because the pure-white rule takes priority.
