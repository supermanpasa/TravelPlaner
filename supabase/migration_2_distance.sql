-- One-time migration for projects that already ran schema.sql before the
-- "이동 거리를 카드 사이에 자동으로 보여주기" change. Run this once in the
-- SQL Editor. Safe to run even if the column already exists.
alter table items add column if not exists distance_m int;
