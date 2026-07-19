/**
 * Generates a URL-safe slug.
 *
 * For Latin-script (English) titles, produces a readable slug like
 * "ten-little-scribes". For titles containing non-Latin scripts (like
 * Bangla), embedding the original characters in the URL turned out to be
 * fragile — subtle Unicode normalization differences between the browser,
 * keyboard input method, and Postgres could make an identical-looking slug
 * fail to match on lookup. So instead, non-Latin titles get a short,
 * guaranteed-safe random slug — no encoding ambiguity possible.
 */
export function generateSlug(title: string): string {
  const normalized = title.normalize("NFC").trim();
  const isAsciiOnly = /^[\x00-\x7F]*$/.test(normalized);

  if (!isAsciiOnly) {
    return `post-${randomSuffix()}`;
  }

  const slug = normalized
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || `post-${randomSuffix()}`;
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
}

/**
 * Safely decodes a URL path segment. Some hosts (Vercel) auto-decode
 * dynamic route params before they reach the page; others (Netlify's
 * Next.js runtime) pass them through still percent-encoded. Always
 * decoding manually here makes lookups work the same on either host.
 */
export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
