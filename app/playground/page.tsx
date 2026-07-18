import PlaygroundTile from "@/components/PlaygroundTile";
import ListSidebar from "@/components/ListSidebar";
import { getPublishedPosts, getTagsForCategory } from "@/lib/posts";

export const metadata = { title: "Playground — Fokrul Hasan" };

interface Props {
  searchParams: Promise<{ sort?: string }>;
}

export default async function PlaygroundPage({ searchParams }: Props) {
  const { sort } = await searchParams;
  const currentSort = sort === "oldest" ? "oldest" : "newest";

  const [posts, tags] = await Promise.all([
    getPublishedPosts("playground", currentSort),
    getTagsForCategory("playground"),
  ]);

  return (
    <main className="wrap" style={{ maxWidth: 1040 }}>
      <div className="section-head" style={{ borderTop: "none", marginTop: 0 }}>
        <h2>Playground</h2>
      </div>
      <div className="list-layout">
        <ListSidebar tags={tags} currentSort={currentSort} basePath="/playground" />
        {posts.length === 0 ? (
          <p style={{ color: "var(--fg-muted)" }}>Nothing here yet.</p>
        ) : (
          <div className="playground-grid">
            {posts.map((post) => (
              <PlaygroundTile key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
