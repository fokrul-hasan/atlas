import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [thoughts, playground, recipes] = await Promise.all([
    getPublishedPosts("thoughts"),
    getPublishedPosts("playground"),
    getPublishedPosts("recipes"),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/thoughts`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/playground`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/recipes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const postPages: MetadataRoute.Sitemap = [...thoughts, ...playground, ...recipes].map((post) => ({
    url: `${SITE_URL}/${post.category}/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...postPages];
}
