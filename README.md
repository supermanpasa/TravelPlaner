# 제주 여행 일정

3박4일 제주 여행 일정을 정리하고, 링크 하나로 친구들과 공유해서 같이 장소를 추가하고 후보 투표를 할 수 있는 페이지입니다. Supabase를 데이터 저장소로 써서, 누가 무언가를 추가/투표하면 **그 순간 그 페이지를 열어둔 모든 사람에게 실시간으로 반영**됩니다.

## 왜 Supabase가 필요한가

이 페이지는 순수 정적 파일(HTML/JS)이라 자체적으로는 아무 것도 저장하지 못합니다. 여러 사람이 같이 보고 수정하려면 다들 같은 곳에 데이터를 저장해야 하는데, 그 저장소 역할을 Supabase(무료 플랜으로 충분)가 합니다.

데이터는 "여행 전체를 통째로 하나의 문서"로 저장하지 않습니다. 장소 하나, 투표 하나가 각각 별도의 행(row)입니다. 그래서 두 사람이 동시에 서로 다른 걸 편집해도 한쪽이 다른 쪽을 덮어쓰는 일이 생기지 않습니다 — 애초에 "전체 저장" 자체가 없기 때문입니다. 투표 수도 숫자를 직접 써넣는 게 아니라 "누가 투표했는지"를 한 줄씩 쌓아서 세는 방식이라, 여러 명이 동시에 눌러도 정확히 더해집니다.

## 1. Supabase 프로젝트 만들기

1. [supabase.com](https://supabase.com) 접속 → 회원가입/로그인 (GitHub 계정으로 바로 가능) → **New project** 클릭.
2. 조직(Organization)이 없으면 만들고, 프로젝트 이름(아무거나, 예: `jeju-trip`), DB 비밀번호(자동생성 추천), 리전(Northeast Asia / Seoul 있으면 그걸로)을 정하고 **Create new project**. 1~2분 정도 프로비저닝을 기다립니다.
3. 왼쪽 메뉴 **SQL Editor** → **New query** 에서 [`supabase/schema.sql`](supabase/schema.sql) 파일 내용을 전부 복사해 붙여넣고 우측 상단 **Run**. 테이블 4개(`days`, `items`, `candidates`, `candidate_votes`)와 빈 4일치 날짜가 생성됩니다.
4. 이어서 새 쿼리를 하나 더 열고 [`supabase/seed_itinerary.sql`](supabase/seed_itinerary.sql) 내용을 붙여넣고 **Run**. 지금까지 짜둔 3박4일 일정이 그대로 채워집니다 (이름/시간 없이 "?"였던 항목들은 투표 카드로, 후보가 여러 개였던 항목은 후보까지 미리 넣어뒀어요). **이 파일은 한 번만 실행하세요** — 다시 실행하면 같은 일정이 중복으로 또 들어갑니다.
5. 왼쪽 메뉴 **Project Settings**(톱니바퀴) → **API** 로 이동해서 다음 두 값을 복사해둡니다.
   - **Project URL** (예: `https://xxxxxxxx.supabase.co`)
   - **anon public** key (`eyJ...`로 시작하는 긴 문자열)

## 2. 코드에 연결하기

[`app.js`](app.js) 맨 위 두 줄을 방금 복사한 값으로 바꿉니다.

```js
const SUPABASE_URL = "https://xxxxxxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGc...";
```

`anon public` key는 브라우저에 그대로 노출되는 키라서 GitHub에 올려도 괜찮습니다(설계상 공개용입니다). 다만 이 프로젝트는 로그인이 없는 "링크만 있으면 누구나 수정 가능"한 구조라서, 링크를 아는 사람은 누구든 일정을 추가/수정/삭제할 수 있습니다 — 신뢰할 수 있는 사람들끼리만 링크를 공유하세요.

## 3. GitHub에 올리고 Pages로 배포하기

1. [github.com](https://github.com) 에서 로그인 후 오른쪽 위 **+** → **New repository**. 이름은 아무거나(예: `jeju-trip`), Public/Private 아무거나, 나머지 옵션(README 추가 등)은 체크하지 않고 **Create repository**.
2. 만들어진 저장소 페이지에 나오는 주소를 복사해두고(예: `https://github.com/아이디/jeju-trip.git`), 이 프로젝트 폴더에서 아래 명령을 순서대로 실행합니다.

```bash
git init
git add .
git commit -m "Jeju trip planner"
git branch -M main
git remote add origin https://github.com/<아이디>/<저장소이름>.git
git push -u origin main
```

3. GitHub 저장소 페이지 → **Settings** 탭 → 왼쪽 메뉴 **Pages** → **Build and deployment**의 Source를 **Deploy from a branch**로, Branch를 `main` / `/ (root)`로 선택하고 **Save**.
4. 1분 정도 기다리면 같은 Pages 화면에 `https://<아이디>.github.io/<저장소이름>/` 주소가 뜹니다. 이 링크가 앞으로 친구들과 공유할 최종 주소예요.

로컬 `file://`로 더블클릭해서 열면 브라우저 보안 정책 때문에 스크립트가 안 도는 경우가 있으니, 확인은 항상 이 GitHub Pages 주소(또는 VS Code Live Server 같은 로컬 서버)로 하는 걸 권장해요.

## 기능

- 장소 카드(시간·카테고리 아이콘·이름·네이버지도 아이콘이 한 줄 정렬)
- 장소 추가 폼 안의 "🗳️ 여러 후보로 투표받기" 토글을 켜면 그 슬롯에 여러 후보 이름을 넣을 수 있고, 각 후보에 하트를 눌러 투표할 수 있습니다 (실시간으로 모두에게 반영). 별도의 "투표 추가" 버튼은 없고, 장소 추가 흐름 안에 포함돼 있어요.
- 카드와 카드 사이는 아이콘 "＋" 버튼만 있어서 원하는 위치에 바로 끼워넣을 수 있습니다.
- 연속된 두 장소 카드 사이에는 자동으로 "차로 이동 · 000m" 칩이 생기고, 누르면 두 장소 사이 네이버지도 자동차 길찾기가 바로 열립니다. 거리(m)는 장소 추가/수정 폼의 "다음 장소까지 거리" 칸에 직접 입력한 값이 표시돼요 (네이버지도 API 실시간 조회는 아니고, 눌렀을 때 실제 네이버지도에서 확인하는 방식).
- 카드를 길게 누르면(약 0.5초) 삭제 확인 팝업 — 실수 삭제 방지
- 상단 D-day 배지(오늘 날짜 기준 자동 계산), 실시간 연결 상태를 보여주는 작은 점(초록 = 정상 연결)

## 폴더 구조

```
index.html                    페이지 뼈대 + 스타일
app.js                        Supabase 연동, 렌더링, 상호작용 로직 (SUPABASE_URL/KEY는 여기)
fonts/                        Wanted Sans 폰트 파일
supabase/schema.sql              테이블 생성 SQL (처음 1번)
supabase/seed_itinerary.sql      현재 짜둔 3박4일 일정 채우기 SQL (처음 1번)
supabase/migration_2_distance.sql  이미 schema.sql을 실행한 프로젝트라면 1번만 추가 실행 (거리 칼럼 추가)
```
