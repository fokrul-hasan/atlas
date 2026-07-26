import Link from "next/link";
import type { Post } from "@/types/post";

export default function RecipeTile({ post }: { post: Post }) {
  const isBangla = post.language === "bn";

  return (
    <Link href={`/recipes/${post.slug}`} className="playground-tile">
      <div className="playground-cover">
        {post.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          "Cover image"
        )}
      </div>
      {post.tags[0] && <div className="playground-kind">{post.tags[0].name}</div>}
      <h3 className={isBangla ? "bn" : undefined}>{post.title}</h3>
    </Link>
  );
}
