"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { createClient } from "@/lib/supabase/client";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  ImageIcon,
} from "lucide-react";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

export default function Editor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExt,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing…" }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "article-body",
        style: "min-height: 320px; outline: none;",
      },
      transformPastedHTML(html) {
        // Strip inline styles (font-family, color, etc.) from anything pasted
        // in from Google Docs, Word, other sites — keeps only structural
        // formatting (bold, headings, lists) so it matches the site's fonts.
        return html.replace(/\sstyle="[^"]*"/gi, "").replace(/\sface="[^"]*"/gi, "");
      },
    },
  });

  async function handleImageUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;

      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const path = safeName;
      const { error } = await supabase.storage.from("post-images").upload(path, file);
      if (error) {
        alert("Image upload failed: " + error.message);
        return;
      }
      const { data } = supabase.storage.from("post-images").getPublicUrl(path);
      editor.chain().focus().setImage({ src: data.publicUrl }).run();
    };
    input.click();
  }

  function handleLink() {
    if (!editor) return;
    const url = window.prompt("Link URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }

  if (!editor) return null;

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: 10,
          borderBottom: "1px solid var(--border)",
          flexWrap: "wrap",
          background: "var(--surface)",
        }}
      >
        <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <BoldIcon size={16} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <ItalicIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={16} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("link")} onClick={handleLink}>
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton active={false} onClick={handleImageUpload}>
          <ImageIcon size={16} />
        </ToolbarButton>
      </div>
      <div style={{ padding: "16px 20px" }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: 8,
        borderRadius: 6,
        border: "1px solid transparent",
        background: active ? "var(--accent-soft)" : "transparent",
        color: active ? "var(--accent)" : "var(--fg-muted)",
        cursor: "pointer",
        display: "flex",
      }}
    >
      {children}
    </button>
  );
}
