import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types/post";
import { getReadingStats } from "@/lib/posts";

export default function BlogCard({ post }: { post: Post }) {
  const { minutes } = getReadingStats(post.content);
  const isBangla = post.language === "bn";

  return (
    <Link href={`/${post.category}/${post.slug}`} className="blog-card">
      <div className="blog-cover">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt=""
            width={400}
            height={300}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          "Cover image"
        )}
      </div>
      {post.tags[0] && <div className="blog-tag">{post.tags[0].name}</div>}
      <h3 className={isBangla ? "bn" : undefined}>{post.title}</h3>
      {post.excerpt && (
        <p className={`blog-excerpt${isBangla ? " bn" : ""}`}>{post.excerpt}</p>
      )}
      <div className="blog-meta">
        <span className="time">{minutes} min read</span>
        <span className="read-more">Read more →</span>
      </div>
    </Link>
  );
}
