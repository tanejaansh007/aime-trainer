# AMC 8 Trainer — Adaptive Math Practice (MVP)

Train for AMC 8. Pick a topic, read a short lesson, then solve problems whose
difficulty auto-adjusts to a per-subject **ELO rating**. Logged-in users get saved
ratings, attempt history, and custom review tests; guests get the same loop with no
persistence.

This MVP ships one topic end-to-end: **AMC 8 → Number Theory** (64 problems, rating
700–1700).

## Stack

- **Next.js 16** (App Router, TypeScript, React 19) + Turbopack
- **Prisma 7** ORM over **SQLite** (local dev; uses the `better-sqlite3` driver adapter)
- **NextAuth (Auth.js) v5** — email/password credentials + a no-session guest path
- **Tailwind CSS 4**, **KaTeX** (via `react-markdown` + `remark-math` + `rehype-katex`)
- **Zod** for API validation, **Vitest** for unit tests

> The plan targets Postgres for production. SQLite was chosen for a zero-dependency
> local MVP; swapping the Prisma datasource provider to `postgresql` (plus a Postgres
> driver adapter) is the main change needed to deploy.

## Getting started

```bash
npm install
npx prisma migrate dev      # create the SQLite DB + schema
npm run seed                # load AMC 8 Number Theory lesson + 64 problems
npm run dev                 # http://localhost:3000
```

Required env (`.env`, already created locally):

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="…"             # generated; required by NextAuth
```

## Scripts

- `npm run dev` — dev server
- `npm run build` / `npm start` — production build / serve
- `npm test` — Vitest unit tests (ELO, answer checking, matchmaking)
- `npm run seed` — (re)seed the curriculum, lesson, and problem bank

## How it works

- **ELO engine** (`src/lib/elo.ts`): only the student's rating moves; problem ratings
  are seeded and fixed. `newRating = rating + K·(actual − expected)` with a decaying K.
- **Matchmaking** (`src/lib/selectProblem.ts`): serves the unseen problem whose rating
  is closest to the student's, with small jitter.
- **Answer checking** (`src/lib/checkAnswer.ts`): server-side only — numeric
  equivalence for short answers, letter match for multiple choice. **Correct answers
  and solutions never appear in `/api/practice/next` responses**, only in
  `/api/practice/answer` after submission.
- **Guests** run the identical engine, with rating + "seen" set held in the browser;
  nothing is written to the DB. **Logged-in** users have the server treat the stored
  rating as authoritative and persist every attempt.

## Key paths

```
content/amc8/number-theory/   lesson.md + problems.json (the pre-built bank)
prisma/schema.prisma          data model
prisma/seed.ts                offline content loader
src/lib/                      elo.ts, selectProblem.ts, checkAnswer.ts (+ tests)
src/app/api/                  practice/next, practice/answer, review, review/grade, register
src/app/                      / (browser), learn/[slug], practice/[slug], review, profile, login
```

## Out of scope (MVP)

Full AMC 8 curriculum beyond Number Theory, live AI generation, OAuth, spaced
repetition, leaderboards, and deploy automation — deferred until the single-topic loop
is proven.
