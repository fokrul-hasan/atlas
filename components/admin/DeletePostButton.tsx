"use client";

import { useTransition } from "react";
import { deletePost } from "@/lib/admin-actions";
import type { Category } from "@/types/post";

export default function DeletePostButton({ id, category }: { id: string; category: Category }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this post? This can't be undone.")) return;
    startTransition(() => deletePost(id, category));
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      style={{ background: "none", border: "none", color: "var(--fg-muted)", cursor: "pointer", fontSize: 14 }}
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
