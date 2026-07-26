import RecipeTile from "@/components/RecipeTile";
import ListSidebar from "@/components/ListSidebar";
import { getPublishedPosts, getTagsForCategory } from "@/lib/posts";

export const metadata = { title: "Recipes — Fokrul Hasan" };

interface Props {
  searchParams: Promise<{ sort?: string }>;
}

export default async function RecipesPage({ searchParams }: Props) {
  const { sort } = await searchParams;
  const currentSort = sort === "oldest" ? "oldest" : "newest";

  const [posts, tags] = await Promise.all([
    getPublishedPosts("recipes", currentSort),
    getTagsForCategory("recipes"),
  ]);

  return (
    <main className="wrap" style={{ maxWidth: 1040 }}>
      <div className="section-head" style={{ borderTop: "none", marginTop: 0 }}>
        <h2>Recipes</h2>
      </div>
      <div className="list-layout">
        <ListSidebar tags={tags} currentSort={currentSort} basePath="/recipes" />
        {posts.length === 0 ? (
          <p style={{ color: "var(--fg-muted)" }}>Nothing here yet.</p>
        ) : (
          <div className="playground-grid">
            {posts.map((post) => (
              <RecipeTile key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
