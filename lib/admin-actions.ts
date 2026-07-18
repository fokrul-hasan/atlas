"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/slug";
import type { Category, Language, Status } from "@/types/post";

export async function listAllPostsForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, tags:post_tags(tag:tags(*))")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    ...row,
    tags: (row.tags ?? []).map((t: any) => t.tag),
  }));
}

export async function getPostForEdit(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, tags:post_tags(tag:tags(*))")
    .eq("id", id)
    .single();

  if (error) return null;
  return { ...data, tags: (data.tags ?? []).map((t: any) => t.tag) };
}

/** Finds existing tags by name (case-insensitive) or creates new ones. */
async function resolveTagIds(tagNames: string[]): Promise<string[]> {
  const supabase = await createClient();
  const cleaned = [...new Set(tagNames.map((t) => t.trim()).filter(Boolean))];
  if (cleaned.length === 0) return [];

  const ids: string[] = [];
  for (const name of cleaned) {
    const { data: existing } = await supabase
      .from("tags")
      .select("id")
      .ilike("name", name)
      .maybeSingle();

    if (existing) {
      ids.push(existing.id);
    } else {
      const slug = generateSlug(name);
      const { data: created, error } = await supabase
        .from("tags")
        .insert({ name, slug })
        .select("id")
        .single();
      if (error) throw error;
      ids.push(created.id);
    }
  }
  return ids;
}

interface SavePostInput {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  language: Language;
  status: Status;
  coverImageUrl: string | null;
  tagNames: string[];
}

export async function savePost(input: SavePostInput) {
  const supabase = await createClient();
  const tagIds = await resolveTagIds(input.tagNames);

  const payload = {
    title: input.title,
    excerpt: input.excerpt || null,
    content: input.content,
    category: input.category,
    language: input.language,
    status: input.status,
    cover_image_url: input.coverImageUrl,
    published_at: input.status === "published" ? new Date().toISOString() : null,
  };

  let postId = input.id;

  if (postId) {
    const { error } = await supabase.from("posts").update(payload).eq("id", postId);
    if (error) throw error;
    await supabase.from("post_tags").delete().eq("post_id", postId);
  } else {
    const slug = generateSlug(input.title);
    const { data, error } = await supabase
      .from("posts")
      .insert({ ...payload, slug })
      .select("id")
      .single();
    if (error) throw error;
    postId = data.id;
  }

  if (tagIds.length > 0) {
    const rows = tagIds.map((tag_id) => ({ post_id: postId, tag_id }));
    const { error } = await supabase.from("post_tags").insert(rows);
    if (error) throw error;
  }

  revalidatePath("/admin");
  revalidatePath(`/${input.category}`);
  return { id: postId };
}

export async function deletePost(id: string, category: Category) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin");
  revalidatePath(`/${category}`);
}
