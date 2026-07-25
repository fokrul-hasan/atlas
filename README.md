# Atlas — Fokrul Hasan's Personal Site
### Milestone: "First Edition" — stable, live, fully working

A personal website for Fokrul Hasan — "a personal library, not a portfolio." Calm, minimal, book-themed design. Bilingual (Bangla + English) content. Built from scratch with no prior coding experience, working turn-by-turn with Claude.

**Live URL:** https://fokrulh.netlify.app
**Hosting:** Netlify (auto-deploys on every `git push` to `main`)
**Backend:** Supabase (Postgres database + file storage + auth)

---

## Running it locally

You'll need [Node.js](https://nodejs.org) 18+ installed.

```bash
git clone https://github.com/fokrul-hasan/atlas.git
cd atlas
npm install
npm run dev
```

Open http://localhost:3000. **Test any visual/content change here first** before pushing — Netlify has a limited free build-minute quota.

### Environment variables

Copy `.env.local.example` to `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://ahidvvknplohjyxjfnme.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=(find this in Supabase → Project Settings → API)
```
(The anon key is meant to be public-facing — safe to use client-side, protected by Row Level Security — but still no need to paste it into public places unnecessarily.)

### Admin login

No public sign-up — create your login directly in Supabase: **Authentication → Users → Add user**. Then sign in at `/admin/login`.

### Deploying

Push to `main` on GitHub — Netlify rebuilds automatically. To deploy from scratch on a new Netlify project: import the repo, add the same two environment variables above in Netlify's dashboard, deploy.

---

## Tech stack

- **Next.js 15** (App Router), TypeScript, strict mode
- **Tailwind CSS** configured, but most actual styling lives in plain CSS in `app/globals.css` (design was prototyped first as static HTML, then ported in — Tailwind utilities are available but underused)
- **Supabase** — Postgres database, Storage (images), Auth (single admin user, no public sign-up)
- **Tiptap** — rich text editor for the admin dashboard (Google-Docs-style toolbar)
- **Google Fonts** via `next/font/google`: Fraunces (headings + English body), Noto Serif Bengali (Bangla body), plus a handwriting font for one decorative word in the hero

---

## Site structure

```
/                       Homepage — hero + previews of Thoughts & Playground
/thoughts               List of all published Thoughts posts (sort + tag sidebar)
/thoughts/[slug]        Individual Thoughts post
/playground             List of all published Playground posts (sort + tag sidebar)
/playground/[slug]      Individual Playground post
/tag/[slug]             Archive page — all posts (any category) sharing a tag
/admin/login            Admin sign-in
/admin                  Dashboard — list all posts (draft + published), edit/delete
/admin/posts/new        Write a new post
/admin/posts/[id]       Edit an existing post
/sitemap.xml            Auto-generated, includes every published post
/robots.txt             Allows crawling, blocks /admin, points to sitemap
```

**Note:** a third content category called "Collection" (curated excerpts from others) was deliberately removed. Only **Thoughts** and **Playground** remain.

---

## Project structure

```
app/                  routes (App Router — each folder = a URL)
  thoughts/           list + individual post pages
  playground/         list + individual post pages
  tag/[slug]/         tag archive page
  admin/              dashboard: login, post list, new/edit post forms
  page.tsx            homepage
  globals.css         the entire design system (colors, fonts, gradients, layout)
  sitemap.ts, robots.ts
components/
  admin/              Editor, PostForm, TagInput, LogoutButton, DeletePostButton
  ...                  shared public UI (Header, Footer, BlogCard, ShareButton, Spine)
lib/
  supabase/           client + server + middleware Supabase connections
  posts.ts            public data-fetching logic (+ sample fallback data)
  admin-actions.ts     server actions the dashboard uses to save/delete posts
  slug.ts             random slug generator + safe URL decoding
  site.ts             central SITE_URL config
types/                shared TypeScript types
supabase/schema.sql   run once in Supabase to set up the database
middleware.ts         protects everything under /admin
```

---

## Design system

- **Dark mode is the default** on every page load (toggle in header, saved via localStorage)
- **Fonts:** Fraunces (serif — headings *and* English body text, a deliberate choice), Noto Serif Bengali (Bangla body, 1.9 line-height for matras/conjuncts)
- **Colors:** warm cream/parchment light background (`--warm-white: #F7F1E6`, `--paper: #F1EADC`), near-black dark mode, purple gradient accent (`--accent-gradient`, different stops per theme)
- **Paper grain texture** on the background — subtle SVG noise, with a *higher* opacity specifically in light mode (`body[data-theme="light"]` override), since noise is naturally less visible against light backgrounds
- **The "spine"** — a vertical chapter-number nav (I, II, III) on the homepage's left edge, desktop only, scroll-spy highlighted
- **Hero headline:** "Notes from a quiet ~~mind~~ soul." — "mind" has a hand-drawn gradient strikethrough (custom SVG with a roughness/displacement filter), "soul" is in a handwriting font + gradient text
- **Post content font consistency:** a `!important`-based CSS override forces consistent fonts inside post bodies, since pasted text (Google Docs, Word, etc.) can carry inline styles that override the site's design
- **Share button:** native share sheet on mobile, custom Facebook + copy-link dropdown on desktop

---

## Content model

- Posts: title, slug, excerpt, content (HTML from Tiptap), category (`thoughts` | `playground`), language (`bn` | `en`), status (`draft` | `published`), cover image, tags
- **Slugs are always random** (e.g. `post-a1b2c3`), not title-derived — after repeated bugs with Bangla text in URLs (encoding/normalization mismatches between browsers and hosts). Generated once at creation, never change.
- **Tags** shared across categories, matched by name (case-insensitive) to prevent accidental duplicates — admin dashboard has an autocomplete chip input
- **Related posts:** tag-overlap + same-category scoring (top 3)
- **Reading time & word count** auto-calculated from content

---

## Known quirks worth remembering

- **Two hosting platforms exist in history:** Vercel was used first, then Netlify. Vercel is being phased out — if `@vercel/analytics` or similar Vercel-only tooling reappears, remove it (Netlify's built-in Web Analytics replaced it).
- **The handwriting font is still being experimented with** — check the `next/font/google` import in `app/layout.tsx` for whichever is currently active (mapped to CSS variable `--font-caveat` regardless of which actual font is loaded — don't be thrown by the variable name).
- **Supabase free tier:** 500MB database (a non-issue for text), 1GB file storage (images are compressed to ~150KB each, so there's a lot of headroom).
- **Google Search Console is set up** — sitemap submitted, ownership verified via `public/googlec8abddd40393883e.html`. Don't remove that file.

---

## Not built yet (possible future work)

- Custom domain (currently on the free `.netlify.app` subdomain)
- RSS feed
- Monetization (discussed conceptually — ads, sponsorships, affiliate, "support me" link — nothing implemented)
- Comments/guestbook
- Automated image compression in the upload flow (currently done manually before upload, which works fine)
