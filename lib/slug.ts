/**
 * Generates a URL-safe slug for a post.
 *
 * Always returns a short random slug (e.g. "post-a1b2c3") rather than a
 * readable, title-based one — this was a deliberate choice (not just the
 * earlier Bangla-encoding fix): it keeps URLs short and consistent across
 * languages, and avoids ever needing to think about slug uniqueness,
 * special characters, or title changes breaking links later.
 */
export function generateSlug(_title: string): string {
  return `post-${randomSuffix()}`;
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
