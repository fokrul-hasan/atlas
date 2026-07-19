import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { getPostForEdit } from "@/lib/admin-actions";
import { getAllTagNames } from "@/lib/posts";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, existingTags] = await Promise.all([getPostForEdit(id), getAllTagNames()]);
  if (!post) notFound();

  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 32 }}>Edit post</h1>
      <PostForm post={post} existingTags={existingTags} />
    </div>
  );
}
