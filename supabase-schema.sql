create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name varchar(120) not null,
  slug varchar(140) unique not null,
  description text,
  created_at timestamp with time zone default now()
);

create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  title varchar(220) not null,
  slug varchar(240) unique not null,
  short_description text,
  full_story_text text,
  story_summary text,
  cover_image_url text,
  audio_url text,
  subtitle_file_url text,
  language varchar(20) default 'sw',
  subtitle_language varchar(20) default 'en',
  duration_seconds integer,
  category_id uuid references categories(id) on delete set null,
  status varchar(40) default 'draft',
  featured boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists story_sources (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references stories(id) on delete cascade,
  source_title varchar(220) not null,
  source_url text,
  publisher varchar(180),
  notes text,
  created_at timestamp with time zone default now()
);

create table if not exists story_timeline_events (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references stories(id) on delete cascade,
  year_label varchar(120) not null,
  event_title varchar(220) not null,
  description text,
  sort_order integer default 1,
  created_at timestamp with time zone default now()
);

insert into categories (name, slug, description)
values
  ('Historical Events', 'historical-events', 'Matukio makubwa yaliyobadili historia ya dunia.'),
  ('True Crime', 'true-crime', 'Visa halisi vya uhalifu vilivyoacha alama kwenye historia.'),
  ('Disasters', 'disasters', 'Majanga ya asili, ajali kubwa, na misiba iliyotikisa dunia.'),
  ('Influential People', 'influential-people', 'Watu waliobadili mwelekeo wa historia.'),
  ('Mysteries', 'mysteries', 'Siri na matukio yasiyoeleweka mpaka leo.')
on conflict (slug) do nothing;

alter table categories enable row level security;
alter table stories enable row level security;
alter table story_sources enable row level security;
alter table story_timeline_events enable row level security;

create policy if not exists "public read categories"
on categories for select
using (true);

create policy if not exists "public read stories"
on stories for select
using (status = 'published' or status = 'draft');

create policy if not exists "public insert stories"
on stories for insert
with check (true);

create policy if not exists "public update stories"
on stories for update
using (true)
with check (true);

create policy if not exists "public delete stories"
on stories for delete
using (true);

create policy if not exists "public read story sources"
on story_sources for select
using (true);

create policy if not exists "public insert story sources"
on story_sources for insert
with check (true);

create policy if not exists "public update story sources"
on story_sources for update
using (true)
with check (true);

create policy if not exists "public delete story sources"
on story_sources for delete
using (true);

create policy if not exists "public read story timeline"
on story_timeline_events for select
using (true);

create policy if not exists "public insert story timeline"
on story_timeline_events for insert
with check (true);

create policy if not exists "public update story timeline"
on story_timeline_events for update
using (true)
with check (true);

create policy if not exists "public delete story timeline"
on story_timeline_events for delete
using (true);

insert into storage.buckets (id, name, public)
values
  ('story-covers', 'story-covers', true),
  ('story-audio', 'story-audio', true),
  ('story-subtitles', 'story-subtitles', true)
on conflict (id) do nothing;

create policy if not exists "public read story covers"
on storage.objects for select
using (bucket_id = 'story-covers');

create policy if not exists "public upload story covers"
on storage.objects for insert
with check (bucket_id = 'story-covers');

create policy if not exists "public read story audio"
on storage.objects for select
using (bucket_id = 'story-audio');

create policy if not exists "public upload story audio"
on storage.objects for insert
with check (bucket_id = 'story-audio');

create policy if not exists "public read story subtitles"
on storage.objects for select
using (bucket_id = 'story-subtitles');

create policy if not exists "public upload story subtitles"
on storage.objects for insert
with check (bucket_id = 'story-subtitles');
