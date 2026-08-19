-- Execute this SQL script in your Supabase SQL Editor to set up all required tables & storage policies.
-- Safe to run repeatedly (uses IF NOT EXISTS and DROP POLICY IF EXISTS).

-- 1. Portfolio Content (Work, Playground, Journal)
create table if not exists public.portfolio_content (
  id text primary key default gen_random_uuid()::text,
  content_type text not null check (content_type in ('work','playground','journal')),
  title text not null,
  category text,
  description text,
  content_body text,
  destination_url text,
  image_url text,
  featured boolean default false,
  tags text,
  tools text,
  read_time text,
  platform text,
  journal_type text,
  published boolean not null default true,
  display_order integer default 0,
  created_at timestamptz not null default now()
);

-- 2. Contact Messages
create table if not exists public.contact_messages (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  email text not null,
  project_type text,
  budget text,
  timeline text,
  message text,
  read boolean default false,
  created_at timestamptz not null default now()
);

-- 3. Settings (Site options, hero images, resume link, stats)
create table if not exists public.portfolio_settings (
  id text primary key default 'global',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- 4. Testimonials
create table if not exists public.portfolio_testimonials (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  role text,
  quote text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- 5. Brands / Client Logos
create table if not exists public.portfolio_brands (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  logo_url text,
  url text default '#',
  created_at timestamptz not null default now()
);

-- 6. Milestones (Keynotes, Launches, Recognitions)
create table if not exists public.portfolio_milestones (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  category text,
  year text,
  event_location text,
  summary text,
  spec1_label text,
  spec1_value text,
  spec2_label text,
  spec2_value text,
  spec3_label text,
  spec3_value text,
  url text,
  button_text text,
  image text,
  display_order integer default 0,
  created_at timestamptz not null default now()
);

-- 7. Toolkit / Tools
create table if not exists public.portfolio_tools (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  category text,
  icon_type text default 'figma',
  custom_icon_url text,
  display_order integer default 0,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.portfolio_content enable row level security;
alter table public.contact_messages enable row level security;
alter table public.portfolio_settings enable row level security;
alter table public.portfolio_testimonials enable row level security;
alter table public.portfolio_brands enable row level security;
alter table public.portfolio_milestones enable row level security;
alter table public.portfolio_tools enable row level security;

-- ─── TABLE POLICIES (DROP IF EXISTS to avoid duplicate policy errors) ───

-- Portfolio Content Policies
drop policy if exists "Public can read portfolio content" on public.portfolio_content;
drop policy if exists "Public can write portfolio content" on public.portfolio_content;
create policy "Public can read portfolio content" on public.portfolio_content for select using (true);
create policy "Public can write portfolio content" on public.portfolio_content for all using (true);

-- Contact Messages Policies
drop policy if exists "Public can insert contact messages" on public.contact_messages;
drop policy if exists "Public can read contact messages" on public.contact_messages;
drop policy if exists "Public can delete contact messages" on public.contact_messages;
create policy "Public can insert contact messages" on public.contact_messages for insert with check (true);
create policy "Public can read contact messages" on public.contact_messages for select using (true);
create policy "Public can delete contact messages" on public.contact_messages for delete using (true);

-- Settings Policies
drop policy if exists "Public can read settings" on public.portfolio_settings;
drop policy if exists "Public can update settings" on public.portfolio_settings;
create policy "Public can read settings" on public.portfolio_settings for select using (true);
create policy "Public can update settings" on public.portfolio_settings for all using (true);

-- Testimonials Policies
drop policy if exists "Public can read testimonials" on public.portfolio_testimonials;
drop policy if exists "Public can write testimonials" on public.portfolio_testimonials;
create policy "Public can read testimonials" on public.portfolio_testimonials for select using (true);
create policy "Public can write testimonials" on public.portfolio_testimonials for all using (true);

-- Brands Policies
drop policy if exists "Public can read brands" on public.portfolio_brands;
drop policy if exists "Public can write brands" on public.portfolio_brands;
create policy "Public can read brands" on public.portfolio_brands for select using (true);
create policy "Public can write brands" on public.portfolio_brands for all using (true);

-- Milestones Policies
drop policy if exists "Public can read milestones" on public.portfolio_milestones;
drop policy if exists "Public can write milestones" on public.portfolio_milestones;
create policy "Public can read milestones" on public.portfolio_milestones for select using (true);
create policy "Public can write milestones" on public.portfolio_milestones for all using (true);

-- Tools Policies
drop policy if exists "Public can read tools" on public.portfolio_tools;
drop policy if exists "Public can write tools" on public.portfolio_tools;
create policy "Public can read tools" on public.portfolio_tools for select using (true);
create policy "Public can write tools" on public.portfolio_tools for all using (true);

-- ─── STORAGE BUCKET & POLICIES ───
do $$
begin
  insert into storage.buckets (id, name, public)
  values ('portfolio-images', 'portfolio-images', true)
  on conflict (id) do update set public = true;
exception when others then
  null;
end $$;

do $$
begin
  drop policy if exists "Public Access to portfolio-images" on storage.objects;
  drop policy if exists "Public Upload to portfolio-images" on storage.objects;
  drop policy if exists "Public Update to portfolio-images" on storage.objects;
  drop policy if exists "Public Delete to portfolio-images" on storage.objects;

  create policy "Public Access to portfolio-images" on storage.objects for select using ( bucket_id = 'portfolio-images' );
  create policy "Public Upload to portfolio-images" on storage.objects for insert with check ( bucket_id = 'portfolio-images' );
  create policy "Public Update to portfolio-images" on storage.objects for update using ( bucket_id = 'portfolio-images' );
  create policy "Public Delete to portfolio-images" on storage.objects for delete using ( bucket_id = 'portfolio-images' );
exception when others then
  null;
end $$;
