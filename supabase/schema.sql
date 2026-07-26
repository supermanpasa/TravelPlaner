-- Jeju trip planner schema
-- Run this once in the Supabase project's SQL editor (Dashboard -> SQL Editor -> New query).
--
-- Design notes:
--  - There is no single "trip blob" row anywhere. Every edit (add a place, vote, move
--    something) is a targeted insert/update/delete on ONE row. That is what prevents the
--    "my save overwrote everyone else's changes" bug: nobody ever writes back a whole
--    document, so two people editing different things can never clobber each other.
--  - `items.sort_order` is a float, not an index. Inserting a card between two existing
--    cards just picks the midpoint of their sort_order values, so it never has to touch
--    (and never races on) any other row.
--  - Votes are their own rows (`candidate_votes`), one per (candidate, voter). A vote is
--    "insert a row" / "delete a row", never "write a count" - so concurrent votes from
--    different people always add up correctly instead of racing on a shared counter.

create extension if not exists pgcrypto;

create table if not exists days (
  day_index  int primary key,
  date_label text not null,
  weekday    text not null,
  theme      text not null default '',
  map_url    text not null default ''
);

create table if not exists items (
  id          uuid primary key default gen_random_uuid(),
  day_index   int not null references days(day_index) on delete cascade,
  kind        text not null check (kind in ('stop', 'transit', 'vote')),
  sort_order  double precision not null,
  time        text default '',
  category    text default 'etc',
  name        text default '',
  meta        text default '',
  map_url     text default '',
  mode        text default 'car',
  duration    int,
  distance_m  int,
  created_at  timestamptz not null default now()
);

create table if not exists candidates (
  id          uuid primary key default gen_random_uuid(),
  item_id     uuid not null references items(id) on delete cascade,
  name        text not null,
  meta        text default '',
  map_url     text default '',
  created_at  timestamptz not null default now()
);

create table if not exists candidate_votes (
  candidate_id uuid not null references candidates(id) on delete cascade,
  voter_id     text not null,
  created_at   timestamptz not null default now(),
  primary key (candidate_id, voter_id)
);

-- Seed the 4 fixed trip days (safe to re-run).
insert into days (day_index, date_label, weekday, map_url) values
  (0, '7.29', '수', ''),
  (1, '7.30', '목', ''),
  (2, '7.31', '금', ''),
  (3, '8.1',  '토', '')
on conflict (day_index) do nothing;

-- Realtime: let the client subscribe to row-level changes on these tables.
alter publication supabase_realtime add table days, items, candidates, candidate_votes;

-- RLS: this is a no-login, share-the-link planner for a small trusted group (like a
-- Google Form), so every anonymous visitor can read/write. Anyone with the link can also
-- edit or delete anything -- that's the tradeoff for having no accounts. If that's ever a
-- problem, add Supabase Auth and tighten these policies to check auth.uid().
alter table days             enable row level security;
alter table items            enable row level security;
alter table candidates       enable row level security;
alter table candidate_votes  enable row level security;

create policy "days_all"            on days             for all using (true) with check (true);
create policy "items_all"           on items            for all using (true) with check (true);
create policy "candidates_all"      on candidates       for all using (true) with check (true);
create policy "candidate_votes_all" on candidate_votes  for all using (true) with check (true);
