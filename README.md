# Fokrul Hasan — Personal Site

## What's built so far

- Full design system (colors, dark mode default, Fraunces/Inter/Noto Serif Bengali fonts, gradient accents) as global CSS
- Homepage with Thoughts / Playground previews and the spine chapter nav
- **Thoughts** fully wired: list page, individual post pages, share button (native share on mobile, Facebook + copy link on desktop), tags, prev/next, tag-based related posts, SEO metadata
- **Admin dashboard** at `/admin`: login, a Google-Docs-style rich text editor (bold/italic/headings/lists/quotes/links/images), cover image upload, tags, category + language picker, save-as-draft or publish, edit and delete existing posts
- Supabase schema (`supabase/schema.sql`) with posts, tags, and secure read/write policies
- Works immediately with sample posts even before Supabase is connected

## Not built yet (next steps)

- Playground's *public* list/detail pages — the admin dashboard can already create posts in this category, but the public-facing pages to display them still need to be copied from the `app/thoughts/` pattern
- `/tag/[slug]` archive pages (tag links already point here)
- Sitemap, RSS feed, robots.txt

## Running it locally

You'll need [Node.js](https://nodejs.org) 18+ installed.

```bash
cd atlas
npm install
npm run dev
```

Open http://localhost:3000 — it'll work immediately using built-in sample posts, before you've touched Supabase at all.

## Connecting real content (Supabase)

1. Create a free project at https://supabase.com
2. In the Supabase dashboard, go to **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and run it. This creates your tables and a storage bucket for images.
3. Go to **Project Settings → API**, copy your Project URL and anon public key.
4. Copy `.env.local.example` to `.env.local` and paste those two values in.
5. Restart `npm run dev`. The site will now read from your real (empty) database instead of sample posts.

## Setting up your admin login

There's deliberately no public sign-up page — it's your site, one admin (you).

1. In Supabase, go to **Authentication → Users → Add user**
2. Enter your email and a password
3. Go to `localhost:3000/admin/login` and sign in with those same credentials
4. You're now in the dashboard — click **New post** to write your first one

## Deploying

1. Push this project to a GitHub repository
2. Go to https://vercel.com, import the repo
3. Add the same two environment variables from `.env.local` in Vercel's project settings
4. Deploy — Vercel builds and hosts it automatically, and redeploys every time you push

## Project structure

```
app/                  routes (App Router — each folder = a URL)
  thoughts/           list + individual post pages
  admin/              dashboard: login, post list, new/edit post forms
  page.tsx            homepage
components/
  admin/              Editor, PostForm, LogoutButton, DeletePostButton
  ...                  shared public UI (Header, Footer, BlogCard, ShareButton)
lib/
  supabase/           client + server + middleware Supabase connections
  posts.ts            public data-fetching logic (+ sample fallback data)
  admin-actions.ts     server actions the dashboard uses to save/delete posts
  slug.ts             Unicode-safe slug generator (handles Bangla titles)
types/                shared TypeScript types
supabase/schema.sql   run once in Supabase to set up your database
middleware.ts         protects everything under /admin
```
