-- Optional Supabase schema (PostgreSQL) for production deployment.
-- Local MVP uses data/runtime-store.json; migrate seed via scripts when ready.

create type chain as enum ('cgv', 'lotte', 'megabox');
create type screen_type as enum (
  'standard', 'imax', 'dolby', 'screenx', '4dx', 'mx', 'superplex', 'suite', 'premium'
);
create type source_type as enum (
  'official', 'press', 'community', 'user_report', 'estimate', 'wiki'
);
create type confidence as enum ('high', 'medium', 'low', 'unknown');
create type measurement_status as enum ('pending', 'approved', 'rejected');

create table theaters (
  id text primary key,
  chain chain not null,
  name text not null,
  region text not null,
  city text not null,
  address text not null,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

create table screens (
  id text primary key,
  theater_id text not null references theaters (id) on delete cascade,
  name text not null,
  hall_number text,
  type screen_type not null default 'standard',
  seat_count integer,
  notes text,
  created_at timestamptz not null default now()
);

create table screen_measurements (
  id text primary key,
  screen_id text not null references screens (id) on delete cascade,
  width_m numeric(6,2),
  height_m numeric(6,2),
  width_scope_m numeric(6,2),
  height_scope_m numeric(6,2),
  seat_count integer,
  source source_type not null,
  source_label text not null,
  source_url text,
  confidence confidence not null default 'unknown',
  verified_at timestamptz not null default now(),
  status measurement_status not null default 'pending',
  note text,
  reporter_name text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  review_note text
);

create index screens_theater_idx on screens (theater_id);
create index measurements_screen_status_idx on screen_measurements (screen_id, status);
create index measurements_status_idx on screen_measurements (status);

alter table theaters enable row level security;
alter table screens enable row level security;
alter table screen_measurements enable row level security;

create policy "public read theaters" on theaters for select using (true);
create policy "public read screens" on screens for select using (true);
create policy "public read approved measurements"
  on screen_measurements for select
  using (status = 'approved');

-- Inserts for user reports should go through a service role / Edge Function with validation.
