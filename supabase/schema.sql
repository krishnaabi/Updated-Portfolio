-- Execute this SQL script in your Supabase SQL Editor to set up all required tables & storage policies.

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
  message text,
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
  img text,
  created_at timestamptz not null default now()
);

-- 5. Brands / Client Logos
create table if not exists public.portfolio_brands (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  logo text,
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

-- Enable Row Level Security (RLS)
alter table public.portfolio_content enable row level security;
alter table public.contact_messages enable row level security;
alter table public.portfolio_settings enable row level security;
alter table public.portfolio_testimonials enable row level security;
alter table public.portfolio_brands enable row level security;
alter table public.portfolio_milestones enable row level security;

-- Policies for public reading and creation
create policy "Public can read portfolio content" on public.portfolio_content for select using (true);
create policy "Public can write portfolio content" on public.portfolio_content for all using (true);

create policy "Public can insert contact messages" on public.contact_messages for insert with check (true);
create policy "Public can read contact messages" on public.contact_messages for select using (true);
create policy "Public can delete contact messages" on public.contact_messages for delete using (true);

create policy "Public can read settings" on public.portfolio_settings for select using (true);
create policy "Public can update settings" on public.portfolio_settings for all using (true);

create policy "Public can read testimonials" on public.portfolio_testimonials for select using (true);
create policy "Public can write testimonials" on public.portfolio_testimonials for all using (true);

create policy "Public can read brands" on public.portfolio_brands for select using (true);
create policy "Public can write brands" on public.portfolio_brands for all using (true);

create policy "Public can read milestones" on public.portfolio_milestones for select using (true);
create policy "Public can write milestones" on public.portfolio_milestones for all using (true);

-- Storage bucket setup for public uploaded images and files
insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do update set public = true;

create policy "Public Access to portfolio-images"
on storage.objects for select
using ( bucket_id = 'portfolio-images' );

create policy "Public Upload to portfolio-images"
on storage.objects for insert
with check ( bucket_id = 'portfolio-images' );

create policy "Public Update to portfolio-images"
on storage.objects for update
using ( bucket_id = 'portfolio-images' );

create policy "Public Delete to portfolio-images"
on storage.objects for delete
using ( bucket_id = 'portfolio-images' );
