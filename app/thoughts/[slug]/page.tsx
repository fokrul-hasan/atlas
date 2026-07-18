import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ShareButton from "@/components/ShareButton";
import BlogCard from "@/components/BlogCard";
import {
  getPostBySlug,
  getReadingStats,
  getRelatedPosts,
  getAdjacentPosts,
} from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug("thoughts", slug);
  if (!post) return {};

  return {
    title: `${post.title} — Fokrul Hasan`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
    },
  };
}

export default async function ThoughtPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug("thoughts", slug);
  if (!post) notFound();

  const { minutes, words } = getReadingStats(post.content);
  const related = await getRelatedPosts(post);
  const { prev, next } = await getAdjacentPosts(post);
  const isBangla = post.language === "bn";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.published_at,
    author: { "@type": "Person", name: "Fokrul Hasan" },
  };

  return (
    <main className="wrap">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/thoughts" className="back-link">← Back to Thoughts</Link>

      <article>
        {post.tags[0] && <div className="article-tag">{post.tags[0].name}</div>}
        <h1 className={isBangla ? "bn" : undefined}>{post.title}</h1>
        <div className="article-meta">
          {post.published_at && (
            <span>
              {new Date(post.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
          <span className="dot">·</span>
          <span>{minutes} min read</span>
          <span className="dot">·</span>
          <span>{words} words</span>
        </div>

        <div className="article-cover">
          {post.cover_image_url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover_image_url} alt="" className="article-cover-blur-bg" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover_image_url} alt="" className="article-cover-fg" />
            </>
          ) : (
            "Cover image"
          )}
        </div>

        <ShareButton title={post.title} />

        <div
          className={`article-body${isBangla ? " bn" : ""}`}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags.length > 0 && (
          <div className="article-tags">
            {post.tags.map((tag) => (
              <Link key={tag.id} href={`/tag/${tag.slug}`} className="tag-chip">
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {(prev || next) && (
          <nav className="prev-next">
            {prev ? (
              <Link href={`/thoughts/${prev.slug}`} className="prev-item">
                <span className="dir">← Previous</span>
                <span className={`ptitle${prev.language === "bn" ? " bn" : ""}`}>{prev.title}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/thoughts/${next.slug}`} className="next-item">
                <span className="dir">Next →</span>
                <span className={`ptitle${next.language === "bn" ? " bn" : ""}`}>{next.title}</span>
              </Link>
            ) : <span />}
          </nav>
        )}
      </article>

      {related.length > 0 && (
        <section className="related">
          <h2>Related</h2>
          <div className="blog-grid">
            {related.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
