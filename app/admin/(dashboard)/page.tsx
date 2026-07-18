import Link from "next/link";
import { listAllPostsForAdmin } from "@/lib/admin-actions";
import DeletePostButton from "@/components/admin/DeletePostButton";

export default async function AdminDashboardPage() {
  const posts = await listAllPostsForAdmin();

  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 32 }}>Your posts</h1>

      {posts.length === 0 && (
        <p style={{ color: "var(--fg-muted)" }}>
          No posts yet — <Link href="/admin/posts/new" className="cta-link">write your first one →</Link>
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column" }}>
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "18px 0",
              borderBottom: "1px solid var(--border)",
              gap: 16,
            }}
          >
            <div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: post.status === "published" ? "var(--accent)" : "var(--fg-muted)",
                  }}
                >
                  {post.status}
                </span>
                <span style={{ fontSize: 12, color: "var(--fg-muted)" }}>{post.category}</span>
              </div>
              <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 19 }}>{post.title}</div>
            </div>
            <div style={{ display: "flex", gap: 14, flexShrink: 0 }}>
              <Link href={`/admin/posts/${post.id}`} className="cta-link" style={{ fontSize: 14 }}>
                Edit
              </Link>
              <DeletePostButton id={post.id} category={post.category} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
