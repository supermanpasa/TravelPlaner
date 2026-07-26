-- Seeds the trip with the itinerary from "제주도 3박 4일 여행 일정.txt".
-- Run this ONCE, after schema.sql, in the Supabase SQL editor.
--
-- Rule used while converting the text file:
--   - A slot with a specific place name but a trailing "?" (uncertain/tentative)
--     became a normal place card with a "확정 필요" memo.
--   - A slot with NO name yet ("점심식사 ?", "카페 ?") or several named
--     alternatives ("A / B / C") became a 투표(vote) card, so candidates can be
--     added and voted on. Where the text file already listed options (nearby
--     cafes, "선택" alternatives), those were added as starting candidates.

update days set theme = '제주 도착 및 저녁'         where day_index = 0;
update days set theme = '동화마을과 자연 탐방'       where day_index = 1;
update days set theme = '해변과 문화 체험'           where day_index = 2;
update days set theme = '마무리 및 출발'             where day_index = 3;

do $$
declare
  vid uuid;
begin
  -- ---------------- Day 1 (7.29 수) ----------------
  insert into items (day_index, kind, sort_order, time, category, name) values
    (0, 'stop', 1, '11:30', 'flight', '청주공항 도착');
  insert into items (day_index, kind, sort_order, time, category, name) values
    (0, 'stop', 2, '15:15', 'flight', '제주공항 도착');
  insert into items (day_index, kind, sort_order, time, category, name, meta) values
    (0, 'stop', 3, '16:30', 'food', '이재모피자 픽업', '확정 필요');
  insert into items (day_index, kind, sort_order, time, category, name) values
    (0, 'stop', 4, '17:30', 'stay', '숙소 도착');

  insert into items (day_index, kind, sort_order, time, category)
    values (0, 'vote', 5, '18:00', 'food');

  insert into items (day_index, kind, sort_order, time, category, name) values
    (0, 'stop', 6, '', 'etc', '개인정비 · 휴식');
  insert into items (day_index, kind, sort_order, time, category, name, meta) values
    (0, 'stop', 7, '', 'shop', '조식용 빵 · 시리얼 구매', '편의점/마트');

  -- ---------------- Day 2 (7.30 목, 구좌쪽) ----------------
  insert into items (day_index, kind, sort_order, time, category, name) values
    (1, 'stop', 1, '09:00', 'etc', '기상 · 조식 · 출발');
  insert into items (day_index, kind, sort_order, time, category, name) values
    (1, 'stop', 2, '09:30', 'sight', '제주 동화마을 (지브리전)');

  insert into items (day_index, kind, sort_order, time, category)
    values (1, 'vote', 3, '11:30', 'food');

  insert into items (day_index, kind, sort_order, time, category)
    values (1, 'vote', 4, '11:30', 'cafe') returning id into vid;
  insert into candidates (item_id, name) values
    (vid, '블루보틀'), (vid, '송당의 아침식빵'), (vid, '카페 글렌코');

  insert into items (day_index, kind, sort_order, time, category)
    values (1, 'vote', 5, '14:00', 'sight') returning id into vid;
  insert into candidates (item_id, name) values
    (vid, '제주 레일바이크'), (vid, '비밀의 숲 산책'), (vid, '비자림 산책');

  insert into items (day_index, kind, sort_order, time, category)
    values (1, 'vote', 6, '15:30', 'etc');

  insert into items (day_index, kind, sort_order, time, category)
    values (1, 'vote', 7, '17:30', 'food') returning id into vid;
  insert into candidates (item_id, name) values
    (vid, '올레 야시장 (야식·간식)');

  -- ---------------- Day 3 (7.31 금) ----------------
  insert into items (day_index, kind, sort_order, time, category, name) values
    (2, 'stop', 1, '09:00', 'etc', '기상 · 조식 · 출발');
  insert into items (day_index, kind, sort_order, time, category, name, meta) values
    (2, 'stop', 2, '09:30', 'sight', '표선해수욕장 바다구경', '지안 모래놀이 도구 · 놀이옷 준비');
  insert into items (day_index, kind, sort_order, time, category, name, meta) values
    (2, 'stop', 3, '10:30', 'stay', '숙소에서 짐 정리', '점심 식당으로 이동');

  insert into items (day_index, kind, sort_order, time, category)
    values (2, 'vote', 4, '11:30', 'food');
  insert into items (day_index, kind, sort_order, time, category)
    values (2, 'vote', 5, '11:30', 'cafe');

  insert into items (day_index, kind, sort_order, time, category)
    values (2, 'vote', 6, '14:00', 'sight') returning id into vid;
  insert into candidates (item_id, name) values
    (vid, '휴애리'), (vid, '본태박물관 + 방주교회'), (vid, '오설록 티뮤지엄 · 사계해안');

  insert into items (day_index, kind, sort_order, time, category)
    values (2, 'vote', 7, '17:30', 'food');

  insert into items (day_index, kind, sort_order, time, category, name) values
    (2, 'stop', 8, '', 'etc', '짐 정리');

  -- ---------------- Day 4 (8.1 토) ----------------
  insert into items (day_index, kind, sort_order, time, category, name) values
    (3, 'stop', 1, '09:00', 'stay', '조식 · 체크아웃');
  insert into items (day_index, kind, sort_order, time, category, name, meta) values
    (3, 'stop', 2, '09:30', 'sight', '감귤박물관', '확정 필요');

  insert into items (day_index, kind, sort_order, time, category)
    values (3, 'vote', 3, '11:00', 'food');

  insert into items (day_index, kind, sort_order, time, category, name) values
    (3, 'stop', 4, '12:30', 'flight', '렌트카 반납 · 공항 도착');
  insert into items (day_index, kind, sort_order, time, category, name) values
    (3, 'stop', 5, '14:50', 'flight', '비행기 이륙');
end $$;
