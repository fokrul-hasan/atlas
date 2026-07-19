import BlogCard from "@/components/BlogCard";
import { getPostsByTag } from "@/lib/posts";
import { safeDecode } from "@/lib/slug";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = safeDecode(slug);
  const { tagName, posts } = await getPostsByTag(decodedSlug);

  return (
    <main className="wrap">
      <div className="section-head" style={{ borderTop: "none", marginTop: 0 }}>
        <h2>Tagged: {tagName ?? decodedSlug}</h2>
      </div>
      {posts.length === 0 ? (
        <p style={{ color: "var(--fg-muted)" }}>No posts with this tag yet.</p>
      ) : (
        <div className="blog-grid">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}
