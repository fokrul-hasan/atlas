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

### Admin login

No public sign-up — created directly in Supabase: **Authentication → Users → Add user**. Sign in at `/admin/login`.

### Deploying

Push to `main` on GitHub — Netlify rebuilds automatically.

---

## Tech stack

- **Next.js 15** (App Router), TypeScript, strict mode
- **Tailwind CSS** configured, but most actual styling lives in plain CSS in `app/globals.css` — Tailwind's Preflight reset strips default list markers, heading sizes, etc., so a fair amount of the CSS in this file exists specifically to restore/override that reset inside post content
- **Supabase** — Postgres database, Storage (images), Auth (single admin user, no public sign-up)
- **Tiptap** — rich text editor for the admin dashboard, with:
  - Table support (`@tiptap/extension-table` + row/cell/header)
  - Task list / checkbox support (`@tiptap/extension-task-list` + task-item)
  - **Markdown paste support** — pasting raw Markdown text (from Obsidian, AI chat output, etc.) auto-converts into proper rich formatting via the `marked` library, including a custom converter for GFM task-list checkboxes into Tiptap's expected format
- **Google Fonts** via `next/font/google`:
  - **Fraunces** — headings only (display serif)
  - **Literata** — English post body/reading text (switched from Fraunces, which felt too heavy for long paragraphs)
  - **Noto Serif Bengali** — Bangla post body text
  - A handwriting font for the decorative "soul" word in the hero (currently mapped to CSS variable `--font-caveat` regardless of which actual font is loaded — several were tried: Caveat, Covered By Your Grace, Shadows Into Light; check `app/layout.tsx` for whichever is currently active)

---

## Site structure

```
/                       Homepage — hero + previews of Thoughts, Playground & Recipes
/thoughts               List of published Thoughts posts (sort + tag sidebar)
/thoughts/[slug]        Individual Thoughts post
/playground             List of published Playground posts (sort + tag sidebar)
/playground/[slug]      Individual Playground post
/recipes                List of published Recipes posts (sort + tag sidebar) — square tile style, same as Playground
/recipes/[slug]         Individual Recipe post
/tag/[slug]             Archive page — all posts (any category) sharing a tag
/admin/login            Admin sign-in
/admin                  Dashboard — list all posts (draft + published), edit/delete
/admin/posts/new        Write a new post
/admin/posts/[id]       Edit an existing post
/sitemap.xml            Auto-generated, includes every published post across all three categories
/robots.txt             Allows crawling, blocks /admin, points to sitemap
```

**Note:** a fourth category called "Collection" (curated excerpts from others) was tried early on and deliberately removed. Current categories are **Thoughts**, **Playground**, and **Recipes**.

---

## Project structure

```
app/                  routes (App Router — each folder = a URL)
  thoughts/           list + individual post pages
  playground/         list + individual post pages
  recipes/            list + individual post pages
  tag/[slug]/         tag archive page
  admin/              dashboard: login, post list, new/edit post forms
  page.tsx            homepage
  globals.css         the entire design system (colors, fonts, gradients, layout, post-content typography)
  sitemap.ts, robots.ts
components/
  admin/              Editor (Tiptap + markdown paste), PostForm, TagInput, LogoutButton, DeletePostButton
  RecipeTile.tsx      square tile card, same style as PlaygroundTile
  ...                  shared public UI (Header, Footer, BlogCard, ShareButton, Spine, ListSidebar)
lib/
  supabase/           client + server + middleware Supabase connections
  posts.ts            public data-fetching logic (generic across all 3 categories) + sample fallback data
  admin-actions.ts     server actions the dashboard uses to save/delete posts
  slug.ts             random slug generator + safe URL decoding
  site.ts             central SITE_URL config
types/                shared TypeScript types (Category is now "thoughts" | "playground" | "recipes")
supabase/schema.sql   run once in Supabase to set up the database (category constraint has since been altered live — see below)
middleware.ts         protects everything under /admin
```

---

## Design system

- **Dark mode is the default** on every page load (toggle in header, saved via localStorage)
- **Fonts:** Fraunces for headings, Literata for English body text, Noto Serif Bengali for Bangla body text (1.9 line-height for matras/conjuncts)
- **Colors:** warm cream/parchment light background (`--warm-white: #F7F1E6`, `--paper: #F1EADC` — deliberately mild, an earlier stronger sepia version was tuned back), near-black dark mode, purple gradient accent (`--accent-gradient`, different stops per theme)
- **Paper grain texture** on the background — subtle SVG noise, with a *higher* opacity specifically in light mode (`body[data-theme="light"]` override), since noise is naturally less visible against light backgrounds
- **The "spine"** — a vertical chapter-number nav (I–IV) on the homepage's left edge, desktop only, scroll-spy highlighted, now covering Thoughts/Playground/Recipes
- **Hero headline:** "Notes from a quiet ~~mind~~ soul." — "mind" has a hand-drawn gradient strikethrough (custom SVG with a roughness/displacement filter, tuned extensively to avoid looking either too smooth or too "wavy"), "soul" is in a handwriting font + gradient text, with a manual `{" "}` space fix before the final period
- **Post content typography** (`.article-body` in `globals.css`) has several deliberate overrides fighting Tailwind's reset and pasted-content inconsistency:
  - Forces consistent fonts (Literata for English, Noto Serif Bengali for Bangla) regardless of inline styles carried over from pasted text
  - Restores numbered/bulleted list markers (Tailwind strips these by default)
  - Gives headings inside posts actual distinct sizes (Tailwind resets heading sizes to inherit from surrounding text)
  - Styles tables, task-list checkboxes, code blocks, and horizontal rules
- **Share button:** native share sheet on mobile, custom Facebook + copy-link dropdown on desktop
- **Tried and deliberately reverted:** a small circular "badge" logo in the footer — looked too graphic/busy next to the site's minimal aesthetic, removed after testing

---

## Content model

- Posts: title, slug, excerpt, content (HTML from Tiptap), category (`thoughts` | `playground` | `recipes`), language (`bn` | `en`), status (`draft` | `published`), cover image, tags
- **Slugs are always random** (e.g. `post-a1b2c3`), not title-derived — after repeated bugs with Bangla text in URLs (encoding/normalization mismatches between browsers and hosts). Generated once at creation, never change on edit.
- **Tags** shared across all categories, matched by name (case-insensitive) to prevent accidental duplicates — admin dashboard has an autocomplete chip input (type to see suggestions, press Enter to add a new one)
- **Related posts:** tag-overlap + same-category scoring (top 3)
- **Reading time & word count** auto-calculated from content

---

## Known quirks worth remembering

- **This sandbox resets between sessions** if working with Claude in a fresh conversation elsewhere — any files created in a prior working session don't persist. The *real* project lives on Fokrul's own PC and on GitHub — always treat those as source of truth.
- **Fokrul runs everything on a Lubuntu PC**, comfortable with terminal copy-paste but not writing code from scratch. Always give exact file paths and exact terminal commands, and prefer full-file replacements over "find this line and edit it" where practical.
- **Test locally first** (`npm run dev` → `localhost:3000`) before pushing anything visual/iterative — Netlify has a limited free build-minute quota, and Fokrul is mindful of it.
- **Two hosting platforms exist in history:** Vercel was used first, then Netlify. Vercel has been phased out — `@vercel/analytics` was already removed in favor of Netlify's built-in Web Analytics. If any Vercel-only tooling reappears in a future request, flag it.
- **Database schema changes made live, not just in `supabase/schema.sql`:** the `posts_category_check` constraint was altered directly in Supabase's SQL Editor to add `'recipes'` — the schema.sql file itself may be out of sync with the live database's exact constraint definition. If adding another category in future, check the live constraint first with:
  ```sql
  select pg_get_constraintdef(oid) from pg_constraint where conname = 'posts_category_check';
  ```
- **Supabase free tier:** 500MB database (a non-issue for text), 1GB file storage (images are compressed to ~150KB each by Fokrul before upload, so there's a lot of headroom).
- **Google Search Console is set up** — sitemap submitted, ownership verified via `public/googlec8abddd40393883e.html`. Don't remove that file.
- **Markdown-paste in the editor is heuristic-based**, not a hard rule — it checks for common Markdown patterns (`#`, `**`, `-`, numbered lists, `>`, backticks, `|`) before converting. Covers standard Obsidian/AI-generated markdown well (headings, bold/italic, lists, quotes, tables, checklists, code, links, images, horizontal rules) but does NOT handle Obsidian-specific syntax like `[[wiki links]]`, footnotes, or callout blocks.

---

## Not built yet (possible future work)

- Custom domain (currently on the free `.netlify.app` subdomain)
- RSS feed
- Monetization (discussed conceptually — ads, sponsorships, affiliate, "support me" link — nothing implemented)
- Comments/guestbook
- Automated image compression in the upload flow (currently done manually before upload, which works fine)
