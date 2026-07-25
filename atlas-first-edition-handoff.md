# Atlas — Fokrul Hasan's Personal Site
### Milestone: "First Edition" — stable, live, fully working

---

## 1. What this is

A personal website for Fokrul Hasan — described as "a personal library, not a portfolio." Calm, minimal, book-themed design. Bilingual (Bangla + English) content. Built from scratch with no prior coding experience, working turn-by-turn with Claude.

**Live URL:** https://fokrulh.netlify.app
**GitHub repo:** https://github.com/fokrul-hasan/atlas
**Hosting:** Netlify (auto-deploys on every `git push` to `main`)
**Backend:** Supabase (Postgres database + file storage + auth)

---

## 2. Tech stack

- **Next.js 15** (App Router), TypeScript, strict mode
- **Tailwind CSS** configured, but most actual styling lives in plain CSS in `app/globals.css` (design system was prototyped first as static HTML, then ported in — Tailwind utilities are available but underused)
- **Supabase** — Postgres database, Storage (for images), Auth (single admin user, no public sign-up)
- **Tiptap** — rich text editor for the admin dashboard (Google-Docs-style toolbar)
- **Google Fonts** via `next/font/google`: Fraunces (headings + English body), Noto Serif Bengali (Bangla body text), a handwriting font for one decorative word in the hero (currently testing options — see Section 6)

---

## 3. Site structure

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

**Note:** There used to be a third content category called "Collection" (curated excerpts from others) — it was deliberately removed. Only **Thoughts** and **Playground** remain.

---

## 4. Design system

- **Dark mode is the default** on every page load (toggle in the header switches to light, preference saved via localStorage)
- **Fonts:** Fraunces (serif, headings + English body text — chosen deliberately, English body text is serif not sans-serif per Fokrul's preference), Noto Serif Bengali (Bangla body text, 1.9 line-height for matras/conjuncts)
- **Colors:** warm cream/parchment light background (`--warm-white: #F7F1E6`, `--paper: #F1EADC` — mild warm tone, tuned down from an earlier too-strong sepia version), near-black dark mode, **purple gradient accent** (`--accent-gradient`, different stops for light/dark)
- **Paper grain texture** on the background — subtle noise via inline SVG, with a *higher* opacity specifically in light mode (`body[data-theme="light"]` override) since noise is naturally less visible against light backgrounds
- **The "spine"** — a vertical chapter-number nav (I, II, III) on the left edge of the homepage on desktop only, scroll-spy highlighted, echoing the book metaphor
- **Hero headline** currently reads "Notes from a quiet ~~mind~~ soul." — "mind" has a hand-drawn gradient strikethrough (custom SVG with roughness/displacement filter, tuned extensively for a natural non-wavy look), "soul" is in a handwriting font + gradient text
- **Post content font consistency:** a `!important`-based CSS override (`.article-body p, li, span...`) forces consistent fonts inside post bodies, since pasted text (Google Docs, Word, etc.) can carry inline styles that override the site's design — this was a real bug we found and fixed
- **Share button:** native share sheet on mobile, custom Facebook + copy-link dropdown on desktop

---

## 5. Content model

- **Posts** have: title, slug, excerpt, content (HTML from Tiptap), category (`thoughts` | `playground`), language (`bn` | `en`), status (`draft` | `published`), cover image, tags
- **Slugs are always random** (e.g. `post-a1b2c3`) — not derived from the title. This was a deliberate fix after repeated issues with Bangla text in URLs (encoding/normalization mismatches between browsers and hosts). Slugs are generated once at creation and never change.
- **Tags** are shared across categories, matched by name (case-insensitive) to prevent accidental duplicates from misspellings — the admin dashboard has an autocomplete chip input for this
- **Related posts** use tag-overlap + same-category scoring (top 3 shown)
- **Reading time & word count** are calculated automatically from content, never entered manually

---

## 6. Known quirks / things to remember

- **This sandbox resets between sessions** — any files created in a working session don't persist to the next one. The *real* project lives on Fokrul's own PC and on GitHub — always treat those as the source of truth, not anything in a prior session's sandbox.
- **Fokrul runs everything on a Lubuntu PC**, is comfortable with terminal copy-paste but not writing code from scratch. Always give exact file paths and exact terminal commands.
- **Test locally first** (`npm run dev` → `localhost:3000`) before pushing for anything visual/iterative — Netlify has a limited free build-minute quota, and Fokrul is mindful of it.
- **Two hosting platforms exist in history:** Vercel was used first, then Netlify. Fokrul intends to drop Vercel — if `@vercel/analytics` or similar Vercel-only tooling still appears anywhere, it should be removed (it was already removed once already, in favor of Netlify's built-in Web Analytics).
- **The handwriting font for "soul" is still being tried out** — Caveat, then Covered By Your Grace, then Shadows Into Light were each tested in sequence. Check `app/layout.tsx` for whichever is currently active (look for the `next/font/google` import and the `handwriting` font variable — it's mapped to CSS variable `--font-caveat` regardless of which actual font is loaded, so don't be thrown by the variable name).
- **Supabase free tier limits:** 500MB database (essentially a non-issue for text), 1GB file storage (Fokrul compresses images to ~150KB each, so this has a lot of headroom — thousands of images before it matters).
- **Google Search Console is set up** — sitemap submitted, ownership verified via HTML file at `public/googlec8abddd40393883e.html`. Don't remove that file.

---

## 7. Environment variables (needed in `.env.local` and in Netlify's dashboard)

```
NEXT_PUBLIC_SUPABASE_URL=https://ahidvvknplohjyxjfnme.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=(the anon public key — safe to be public, protected by RLS)
```

The anon key is not a secret in the traditional sense (it's meant to be used client-side), but Fokrul should still avoid pasting it into public places unnecessarily.

---

## 8. What's deliberately NOT built yet (possible future work)

- Custom domain (currently on the free `.netlify.app` subdomain)
- RSS feed
- Monetization — discussed conceptually (ads, sponsorships, affiliate, possibly a "support me" link) but nothing implemented
- Comments/guestbook
- Multi-language toggle for site chrome itself (chrome stays English by design; only post content is Bangla/English)
- Image compression automated in the upload flow (Fokrul currently compresses manually before uploading, which works fine)

---

## 9. How to pick this back up in a new conversation

Just share this document. It covers the stack, the live URLs, the design decisions and why they were made, and the quirks worth knowing before touching code. From there, describe whatever the new task is — the project is stable and fully deployed, so any new conversation can safely build on top of it.
