import BlogCard from "@/components/BlogCard";
import ListSidebar from "@/components/ListSidebar";
import { getPublishedPosts, getTagsForCategory } from "@/lib/posts";

export const metadata = { title: "Thoughts — Fokrul Hasan" };

interface Props {
  searchParams: Promise<{ sort?: string }>;
}

export default async function ThoughtsPage({ searchParams }: Props) {
  const { sort } = await searchParams;
  const currentSort = sort === "oldest" ? "oldest" : "newest";

  const [posts, tags] = await Promise.all([
    getPublishedPosts("thoughts", currentSort),
    getTagsForCategory("thoughts"),
  ]);

  return (
    <main className="wrap" style={{ maxWidth: 1040 }}>
      <div className="section-head" style={{ borderTop: "none", marginTop: 0 }}>
        <h2>Thoughts</h2>
      </div>
      <div className="list-layout">
        <ListSidebar tags={tags} currentSort={currentSort} basePath="/thoughts" />
        <div className="blog-grid">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
