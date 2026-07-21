-- Chakra Nepal MTB Hub - Full Schema
-- Enable extensions
create extension if not exists postgis;
create extension if not exists pgcrypto;

-- profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  role text default 'rider' check (role in ('rider','shop_owner','guide','organizer','admin')),
  is_verified boolean default false,
  strava_id text,
  created_at timestamptz default now()
);

-- trails
create table trails (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  location_text text,
  geom geometry(LineString, 4326),
  distance_km float,
  elevation_gain_m int,
  elevation_loss_m int,
  difficulty text check (difficulty in ('green','blue','black','double_black')),
  trail_type text check (trail_type in ('xc','enduro','downhill','gravel','road')),
  best_season text[],
  bike_setup text,
  gpx_url text,
  created_by uuid references profiles(id),
  status text default 'pending' check (status in ('pending','verified','archived')),
  avg_rating float default 0,
  created_at timestamptz default now()
);

create table trail_media (id uuid primary key default gen_random_uuid(), trail_id uuid references trails(id) on delete cascade, type text, url text, user_id uuid references profiles(id), created_at timestamptz default now());
create table trail_reviews (id uuid primary key default gen_random_uuid(), trail_id uuid references trails(id) on delete cascade, user_id uuid references profiles(id), rating int check (rating between 1 and 5), condition text, comment text, created_at timestamptz default now());
create table trail_conditions (id uuid primary key default gen_random_uuid(), trail_id uuid references trails(id) on delete cascade, user_id uuid references profiles(id), status text, note text, created_at timestamptz default now());

create table events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  event_type text check (event_type in ('race','enduro','festival','charity','group_ride','training')),
  start_at timestamptz,
  end_at timestamptz,
  location_text text,
  geom geometry(Point, 4326),
  difficulty text,
  distance_km float,
  elevation_gain_m int,
  route_trail_id uuid references trails(id),
  organizer_id uuid references profiles(id),
  max_participants int,
  registration_fee int,
  status text default 'active',
  created_at timestamptz default now()
);
create table event_participants (id uuid primary key default gen_random_uuid(), event_id uuid references events(id) on delete cascade, user_id uuid references profiles(id), status text default 'registered', ticket_code text, created_at timestamptz default now(), unique(event_id, user_id));
create table event_media (id uuid primary key default gen_random_uuid(), event_id uuid references events(id) on delete cascade, url text, user_id uuid references profiles(id), created_at timestamptz default now());

create table groups (id uuid primary key default gen_random_uuid(), slug text unique, name text, description text, location text, avatar_url text, owner_id uuid references profiles(id), created_at timestamptz default now());
create table group_members (group_id uuid references groups(id) on delete cascade, user_id uuid references profiles(id) on delete cascade, role text default 'member', primary key(group_id, user_id));

create table posts (id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id), group_id uuid references groups(id), content text, ride_distance float, ride_elevation int, trail_id uuid references trails(id), event_id uuid references events(id), created_at timestamptz default now());
create table post_media (id uuid primary key default gen_random_uuid(), post_id uuid references posts(id) on delete cascade, url text);
create table comments (id uuid primary key default gen_random_uuid(), post_id uuid references posts(id) on delete cascade, user_id uuid references profiles(id), content text, created_at timestamptz default now());
create table likes (user_id uuid references profiles(id), post_id uuid references posts(id) on delete cascade, primary key(user_id, post_id));
create table follows (follower_id uuid references profiles(id), following_id uuid references profiles(id), primary key(follower_id, following_id));

create table shops (id uuid primary key default gen_random_uuid(), slug text unique, name text, type text check (type in ('shop','workshop','rental','coach','guide')), description text, location_text text, geom geometry(Point, 4326), address text, phone text, whatsapp text, hours jsonb, services jsonb, owner_id uuid references profiles(id), is_verified boolean default false, created_at timestamptz default now());
create table shop_reviews (id uuid primary key default gen_random_uuid(), shop_id uuid references shops(id) on delete cascade, user_id uuid references profiles(id), rating int, comment text, created_at timestamptz default now());

create table tour_operators (id uuid primary key default gen_random_uuid(), shop_id uuid references shops(id), description text, website text, created_at timestamptz default now());
create table tours (id uuid primary key default gen_random_uuid(), operator_id uuid references tour_operators(id) on delete cascade, title text, slug text unique, days int, difficulty text, price int, itinerary jsonb, includes jsonb, gallery jsonb, created_at timestamptz default now());

create table listings (id uuid primary key default gen_random_uuid(), title text, category text check (category in ('bike','component','accessory','rental')), condition text, price int, negotiable boolean default true, description text, location_text text, seller_id uuid references profiles(id), status text default 'active', created_at timestamptz default now());

create table achievements (id uuid primary key default gen_random_uuid(), key text unique, title text, description text, icon text);
create table user_achievements (user_id uuid references profiles(id), achievement_id uuid references achievements(id), unlocked_at timestamptz default now(), primary key(user_id, achievement_id));
create table notifications (id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id), type text, title text, link text, is_read boolean default false, created_at timestamptz default now());

-- RLS enable
alter table profiles enable row level security;
alter table trails enable row level security;
-- Add policies in production: public read for verified, owner write.
-- Example:
-- create policy "public read verified trails" on trails for select using (status = 'verified' or auth.uid() = created_by);
