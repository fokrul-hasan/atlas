-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  excerpt text,
  content text not null,
  category text not null check (category in ('thoughts', 'playground')),
  language text not null default 'en' check (language in ('bn', 'en')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  cover_image_url text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (category, slug)
);

create table if not exists post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Row Level Security: anyone can read published posts,
-- only an authenticated user (you, via the admin dashboard) can write.
alter table posts enable row level security;
alter table tags enable row level security;
alter table post_tags enable row level security;

create policy "Public can read published posts"
  on posts for select
  using (status = 'published');

create policy "Authenticated users can manage posts"
  on posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Public can read tags"
  on tags for select
  using (true);

create policy "Authenticated users can manage tags"
  on tags for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Public can read post_tags"
  on post_tags for select
  using (true);

create policy "Authenticated users can manage post_tags"
  on post_tags for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage bucket for cover images / inline post images
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

create policy "Public can view post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "Authenticated users can upload post images"
  on storage.objects for insert
  with check (bucket_id = 'post-images' and auth.role() = 'authenticated');
