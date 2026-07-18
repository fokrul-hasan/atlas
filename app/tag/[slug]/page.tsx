import BlogCard from "@/components/BlogCard";
import { getPostsByTag } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const { tagName, posts } = await getPostsByTag(slug);

  return (
    <main className="wrap">
      <div className="section-head" style={{ borderTop: "none", marginTop: 0 }}>
        <h2>Tagged: {tagName ?? slug}</h2>
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
