# EMo Learners

> A next-generation student learning platform built for the community, by the community.

## Live Site

Coming soon — built with Lovable and deployed via Vercel.

## What is EMo Learners?

EMo Learners is a **student-focused learning platform** designed to help engineering students access academic resources, practice with interactive quizzes, and connect with a community of learners.

Founded by **Mohit Ahirwar**, the platform brings together:

- Academic Notes & Previous Year Questions (PYQs)
- Interactive Quizzes & Timed Tests
- AI Study Assistant
- Internship Listings & Resources
- Community via Telegram & Socials

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (React 19 + Vite 7) |
| Styling | Tailwind CSS v4 |
| Backend | Lovable Cloud (PostgreSQL + Storage) |
| Auth | Email/Password + Google OAuth |
| AI | Gemini-powered Study Assistant |
| Fonts | Syne (headings), Inter (body) |

## Features

- **Student Login/Signup** — Secure auth with email verification
- **Subject-wise Notes & PYQs** — Branch and semester filtered (CSE, IT, CY, AIML)
- **Search** — Instant resource search across all materials
- **Admin Panel** — Secure PDF upload and resource management (founder-only)
- **Feedback & Contact** — Authenticated feedback submissions
- **AI Study Assistant** — Ask questions, get explanations, study smarter
- **Dashboard** — Track recent uploads and activity
- **Quiz & Test Engine** — Create and take interactive quizzes with timers
- **Dark Mode** — Cyberpunk brutalist aesthetic, always dark
- **Mobile Responsive** — Fully responsive across all devices

## Design Direction

**Cyberpunk Brutalist** — High contrast black backgrounds with electric orange accents, monospace terminals, sharp edges, and raw typography.

## Founder

**Mohit Ahirwar** — Building EMo Learners to make quality education accessible to every student.

## Community

- Telegram: [Emo Learners](https://t.me/Emo_Learners)
- Instagram: [@Emolearners](https://www.instagram.com/Emolearners)
- YouTube: [@EmoLearners](https://www.youtube.com/@EmoLearners)
- GitHub: [Emomohit](https://github.com/Emomohit)

## Local Development

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Build for production
bun run build
```

## Environment Variables

Required environment variables (set in Lovable Cloud / `.env`):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

Server-side secrets (managed via Lovable Cloud):

```
SUPABASE_SECRET_KEY
FOUNDER_ADMIN_EMAIL
```

## License

Built with love for the student community. All rights reserved.
