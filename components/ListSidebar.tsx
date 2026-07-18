import Link from "next/link";
import type { Tag } from "@/types/post";

interface Props {
  tags: Tag[];
  currentSort: "newest" | "oldest";
  basePath: string; // "/thoughts" or "/playground"
}

export default function ListSidebar({ tags, currentSort, basePath }: Props) {
  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-muted)", marginBottom: 14 }}>
          Sort by
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Link
            href={`${basePath}?sort=newest`}
            style={{ fontSize: 14, color: currentSort === "newest" ? "var(--fg)" : "var(--fg-muted)", fontWeight: currentSort === "newest" ? 600 : 400 }}
          >
            Newest first
          </Link>
          <Link
            href={`${basePath}?sort=oldest`}
            style={{ fontSize: 14, color: currentSort === "oldest" ? "var(--fg)" : "var(--fg-muted)", fontWeight: currentSort === "oldest" ? 600 : 400 }}
          >
            Oldest first
          </Link>
        </div>
      </div>

      {tags.length > 0 && (
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--fg-muted)", marginBottom: 14 }}>
            Tags
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tags.map((tag) => (
              <Link key={tag.id} href={`/tag/${tag.slug}`} className="tag-chip" style={{ width: "fit-content" }}>
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
