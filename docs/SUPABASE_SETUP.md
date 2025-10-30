# Supabase Setup for Feedback Feature

Follow these steps to prepare Supabase so the feedback screens work end-to-end.

## 1. Configure environment variables locally

Create or edit `.env.local` (git-ignored) with your project credentials:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Restart the Vite dev server (`npm run dev`) whenever you change these values.

## 2. Create the feedback table & policies

Open the Supabase SQL editor and run the statements in [`supabase.sql`](../supabase.sql). This will:

- Create the `feedback_votes` table (if it does not exist)
- Enable Row Level Security
- Add insert/select policies for the `anon` role

## 3. Enable Realtime

In the Supabase dashboard go to **Database → Replication → Realtime** and toggle the `feedback_votes` table on. This lets the app receive live updates after new votes arrive.

## 4. Verify from the app

1. Start the dev server with `npm run dev`.
2. Visit the Feedback page, submit a rating, and confirm it appears in the leaderboard without refreshing.

If anything fails, double-check that the environment variables are set and the SQL ran without errors.
