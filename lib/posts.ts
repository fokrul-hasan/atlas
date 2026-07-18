import readingTime from "reading-time";
import { createClient } from "@/lib/supabase/server";
import type { Category, Post, Tag } from "@/types/post";

// Shown until NEXT_PUBLIC_SUPABASE_URL is set — lets the site render
// immediately after `npm run dev`, before Supabase is wired up.
const SAMPLE_POSTS: Post[] = [
  {
    id: "sample-1",
    slug: "prarthona-mane-chaoya-noy",
    title: "প্রার্থনা মানে চাওয়া নয়, মনোযোগ",
    excerpt:
      "ছোটবেলা থেকে শিখেছি প্রার্থনা মানেই কিছু চাওয়া। কিন্তু আজকাল মনে হয়, আসল বিষয়টা চাওয়া নয়…",
    content: `<p>ছোটবেলা থেকে যেভাবে প্রার্থনা করতে শিখেছি, তার পুরোটাই ছিল চাওয়া কেন্দ্রিক।</p>
<blockquote>মনোযোগই বোধহয় সবচেয়ে সৎ ধরনের প্রার্থনা।</blockquote>
<p>এখন যখন নামাজে দাঁড়াই, চেষ্টা করি চাওয়ার তালিকা সরিয়ে রেখে শুধু সেই মুহূর্তে থাকতে।</p>`,
    category: "thoughts",
    language: "bn",
    status: "published",
    cover_image_url: null,
    published_at: "2026-05-14T00:00:00Z",
    created_at: "2026-05-10T00:00:00Z",
    tags: [
      { id: "t1", name: "Spirituality", slug: "spirituality" },
      { id: "t2", name: "Mindfulness", slug: "mindfulness" },
    ],
  },
  {
    id: "sample-2",
    slug: "familiarity-vs-compatibility",
    title: "পরিচিতি আর মানানসই হওয়া—দুটো কি সত্যিই এক জিনিস?",
    excerpt:
      "দীর্ঘদিনের সম্পর্কে একধরনের স্বস্তি চলে আসে, যাকে আমরা প্রায়ই ভালোবাসা বলে ভুল করি…",
    content: `<p>দীর্ঘদিনের সম্পর্কে একধরনের স্বস্তি চলে আসে, যাকে আমরা প্রায়ই ভালোবাসা বা মানানসই হওয়া বলে ভুল করি।</p>`,
    category: "thoughts",
    language: "bn",
    status: "published",
    cover_image_url: null,
    published_at: "2026-05-01T00:00:00Z",
    created_at: "2026-04-28T00:00:00Z",
    tags: [{ id: "t3", name: "Psychology", slug: "psychology" }],
  },
  {
    id: "sample-3",
    slug: "slow-erosion-of-boredom",
    title: "The Slow Erosion of Boredom",
    excerpt:
      "Every idle minute now has somewhere to go — a feed, a notification, a task…",
    content: `<p>Every idle minute now has somewhere to go — a feed, a notification, a task. I've started to wonder what we quietly lose when boredom stops being an option.</p>`,
    category: "thoughts",
    language: "en",
    status: "published",
    cover_image_url: null,
    published_at: "2026-04-20T00:00:00Z",
    created_at: "2026-04-18T00:00:00Z",
    tags: [
      { id: "t4", name: "Technology", slug: "technology" },
      { id: "t5", name: "Philosophy", slug: "philosophy" },
    ],
  },
];

function usingSampleData() {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function getReadingStats(html: string) {
  const text = html.replace(/<[^>]*>/g, " ");
  const stats = readingTime(text);
  // reading-time's word count assumes space-separated words, which
  // undercounts Bangla; this still gives a reasonable minutes estimate.
  return {
    minutes: Math.max(1, Math.round(stats.minutes)),
    words: stats.words,
  };
}

export async function getPublishedPosts(
  category?: Category,
  sort: "newest" | "oldest" = "newest"
): Promise<Post[]> {
  let posts: Post[];

  if (usingSampleData()) {
    posts = category
      ? SAMPLE_POSTS.filter((p) => p.category === category)
      : SAMPLE_POSTS;
  } else {
    const supabase = await createClient();
    let query = supabase
      .from("posts")
      .select("*, tags:post_tags(tag:tags(*))")
      .eq("status", "published")
      .order("published_at", { ascending: sort === "oldest" });

    if (category) query = query.eq("category", category);

    const { data, error } = await query;
    if (error) throw error;

    posts = (data ?? []).map((row: any) => ({
      ...row,
      tags: (row.tags ?? []).map((t: any) => t.tag),
    }));
  }

  if (usingSampleData() && sort === "oldest") {
    posts = [...posts].reverse();
  }

  return posts;
}

export async function getTagsForCategory(category: Category): Promise<Tag[]> {
  const posts = await getPublishedPosts(category);
  const seen = new Map<string, Tag>();
  posts.forEach((p) => p.tags.forEach((t) => seen.set(t.slug, t)));
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPostBySlug(
  category: Category,
  slug: string
): Promise<Post | null> {
  const normalizedSlug = slug.normalize("NFC");

  if (usingSampleData()) {
    return (
      SAMPLE_POSTS.find(
        (p) => p.category === category && p.slug.normalize("NFC") === normalizedSlug
      ) ?? null
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, tags:post_tags(tag:tags(*))")
    .eq("category", category)
    .eq("slug", normalizedSlug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return { ...data, tags: (data.tags ?? []).map((t: any) => t.tag) };
}

/** Tag-overlap related posts, same category preferred. */
export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const all = await getPublishedPosts();
  const postTagSlugs = new Set(post.tags.map((t) => t.slug));

  return all
    .filter((p) => p.id !== post.id)
    .map((p) => {
      const sharedTags = p.tags.filter((t) => postTagSlugs.has(t.slug)).length;
      const sameCategory = p.category === post.category ? 1 : 0;
      return { post: p, score: sharedTags * 2 + sameCategory };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.post);
}

export async function getPostsByTag(tagSlug: string): Promise<{ tagName: string | null; posts: Post[] }> {
  if (usingSampleData()) {
    const posts = SAMPLE_POSTS.filter((p) => p.tags.some((t) => t.slug === tagSlug));
    const tagName = posts[0]?.tags.find((t) => t.slug === tagSlug)?.name ?? null;
    return { tagName, posts };
  }

  const all = await getPublishedPosts();
  const posts = all.filter((p) => p.tags.some((t) => t.slug === tagSlug));
  const tagName = posts[0]?.tags.find((t) => t.slug === tagSlug)?.name ?? null;
  return { tagName, posts };
}

export async function getAdjacentPosts(post: Post) {
  const siblings = await getPublishedPosts(post.category);
  const index = siblings.findIndex((p) => p.id === post.id);
  return {
    prev: index > 0 ? siblings[index - 1] : null,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null,
  };
}
