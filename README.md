# TRICOMBA

Trial by combat for the digital age. A mobile-first web app for issuing, accepting, and watching consented combat-sport challenges.

## Stack

- Next.js 16 (App Router)
- TypeScript + Tailwind CSS 4
- Clerk (auth)
- Neon Postgres + Drizzle ORM
- Vercel-ready

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local`:

1. **Clerk** — create an app at [dashboard.clerk.com](https://dashboard.clerk.com), copy publishable + secret keys
2. **Neon** — create a Postgres DB, copy `DATABASE_URL`

Then push the schema and run:

```bash
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Clerk/DB keys the UI still loads (catalog demo). Sign-in, profile save, and challenge persistence need both keys.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local app |
| `npm run db:push` | Apply Drizzle schema to Neon |
| `npm run db:studio` | Browse tables |
| `npm run build` | Production build |

## Product surface

- Social challenge feed + stories
- Auth-aware drop / accept / negotiate / pass
- Profiles synced from Clerk → Postgres
- Watch desk, fighter catalog, partner gyms, rules
- 18+ age gate

Catalog fighters live in `src/lib/data.ts`. User-issued challenges persist in Neon.
