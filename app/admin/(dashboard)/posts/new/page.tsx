import PostForm from "@/components/admin/PostForm";
import { getAllTagNames } from "@/lib/posts";

export default async function NewPostPage() {
  const existingTags = await getAllTagNames();

  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 32 }}>New post</h1>
      <PostForm existingTags={existingTags} />
    </div>
  );
}
