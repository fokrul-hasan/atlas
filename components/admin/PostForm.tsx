"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "./Editor";
import TagInput from "./TagInput";
import { savePost } from "@/lib/admin-actions";
import { createClient } from "@/lib/supabase/client";
import type { Post, Category, Language } from "@/types/post";

export default function PostForm({ post, existingTags }: { post?: Post; existingTags: string[] }) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [category, setCategory] = useState<Category>(post?.category ?? "thoughts");
  const [language, setLanguage] = useState<Language>(post?.language ?? "bn");
  const [tags, setTags] = useState<string[]>(post?.tags.map((t) => t.name) ?? []);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(post?.cover_image_url ?? null);
  const [saving, setSaving] = useState(false);

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `covers/${safeName}`;
    const { error } = await supabase.storage.from("post-images").upload(path, file);
    if (error) {
      alert("Upload failed: " + error.message);
      return;
    }
    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    setCoverImageUrl(data.publicUrl);
  }

  async function handleSave(status: "draft" | "published") {
    if (!title.trim()) {
      alert("Please add a title first.");
      return;
    }
    setSaving(true);
    try {
      await savePost({
        id: post?.id,
        title,
        excerpt,
        content,
        category,
        language,
        status,
        coverImageUrl,
        tagNames: tags,
      });
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      alert("Save failed: " + err.message);
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 720 }}>
      <input
        type="text"
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ ...inputStyle, fontSize: 28, fontFamily: "var(--font-fraunces)", padding: "8px 0", border: "none", borderBottom: "1px solid var(--border)", borderRadius: 0 }}
      />

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <label style={labelStyle}>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)} style={inputStyle}>
            <option value="thoughts">Thoughts</option>
            <option value="playground">Playground</option>
          </select>
        </label>
        <label style={labelStyle}>
          Language
          <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} style={inputStyle}>
            <option value="bn">Bangla</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>

      <label style={labelStyle}>
        Excerpt (shown on cards)
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </label>

      <label style={labelStyle}>
        Tags
        <TagInput value={tags} onChange={setTags} existingTags={existingTags} />
      </label>

      <label style={labelStyle}>
        Cover image
        <input type="file" accept="image/*" onChange={handleCoverUpload} />
        {coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImageUrl} alt="" style={{ marginTop: 10, maxWidth: 240, borderRadius: 6 }} />
        )}
      </label>

      <label style={labelStyle}>
        Content
        <Editor content={content} onChange={setContent} />
      </label>

      <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
        <button disabled={saving} onClick={() => handleSave("draft")} className="theme-toggle" style={{ padding: "12px 22px" }}>
          Save draft
        </button>
        <button
          disabled={saving}
          onClick={() => handleSave("published")}
          style={{
            padding: "12px 22px",
            borderRadius: 100,
            border: "none",
            background: "var(--accent-gradient)",
            color: "#fff",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          {post?.status === "published" ? "Update" : "Publish"}
        </button>
        <button type="button" onClick={() => router.push("/admin")} style={{ ...inputStyle, background: "none", border: "none", color: "var(--fg-muted)" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 6,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--fg)",
  fontSize: 15,
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  fontSize: 13,
  color: "var(--fg-muted)",
};
