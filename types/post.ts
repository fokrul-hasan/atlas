export type Category = "thoughts" | "playground" | "recipes";
export type Language = "bn" | "en";
export type Status = "draft" | "published";

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string; // HTML from the rich text editor
  category: Category;
  language: Language;
  status: Status;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
  tags: Tag[];
}
