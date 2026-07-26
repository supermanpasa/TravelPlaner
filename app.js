// ---------------------------------------------------------------------------
// Supabase config — fill these in after you create a project and run
// supabase/schema.sql in its SQL editor (Dashboard -> Project Settings -> API
// for the URL and the "anon public" key). See README.md for the full setup.
// ---------------------------------------------------------------------------
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";

const TRIP_START = "2026-07-29";

(function () {
  if (SUPABASE_URL.includes("YOUR-PROJECT") || SUPABASE_ANON_KEY.includes("YOUR-ANON")) {
    document.getElementById("days").innerHTML = "";
    const warn = document.createElement("div");
    warn.className = "config-warning";
    warn.innerHTML = "아직 Supabase 연결 정보가 비어 있어요.<br><br>" +
      "1) supabase.com에서 새 프로젝트를 만들고<br>" +
      "2) SQL Editor에서 <code>supabase/schema.sql</code> 내용을 실행한 뒤<br>" +
      "3) Project Settings → API 에서 Project URL과 anon public key를 복사해<br>" +
      "&nbsp;&nbsp;&nbsp;<code>app.js</code> 맨 위 <code>SUPABASE_URL</code> / <code>SUPABASE_ANON_KEY</code>에 붙여넣어 주세요.<br><br>" +
      "자세한 순서는 README.md를 참고하세요.";
    document.getElementById("days").after(warn);
    return;
  }

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  function svg(inner) { return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`; }

  const CATEGORIES = {
    flight: { label: "항공편", bg: "#dcecff", fg: "#1670b8",
      icon: (main) => svg(`<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="${main}"/>`) },
    stay:   { label: "숙소", bg: "#e1e5fa", fg: "#3d4db3",
      icon: (main) => svg(`<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="${main}"/>`) },
    food:   { label: "맛집", bg: "#ffe1cf", fg: "#c1470f",
      icon: (main) => svg(`<path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" fill="${main}"/>`) },
    cafe:   { label: "카페", bg: "#f0e2cd", fg: "#8a5a2b",
      icon: (main) => svg(`<rect x="5.5" y="9" width="10.5" height="10" rx="3.2" fill="${main}"/><rect x="4" y="20" width="13.5" height="1.8" rx="0.9" fill="${main}"/><path d="M16.2 11.2h1a1.9 1.9 0 0 1 0 3.8h-1" fill="none" stroke="${main}" stroke-width="1.7" stroke-linecap="round"/><path d="M8.6 4.3c0 1-1 1-1 2s1 1 1 2M12.4 4.3c0 1-1 1-1 2s1 1 1 2" stroke="${main}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`) },
    sight:  { label: "관광", bg: "#d8eef2", fg: "#127689",
      icon: (main, hole) => svg(`<rect x="9.3" y="4.6" width="5.4" height="2.6" rx="1.3" fill="${main}"/><rect x="3" y="7" width="18" height="12.3" rx="3.6" fill="${main}"/><circle cx="12" cy="13.3" r="3.5" fill="${hole}"/><circle cx="12" cy="13.3" r="1.3" fill="${main}"/>`) },
    shop:   { label: "쇼핑", bg: "#f2e0f0", fg: "#953a9e",
      icon: (main) => svg(`<path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2z" fill="${main}"/>`) },
    etc:    { label: "기타", bg: "#eae8e2", fg: "#67625a",
      icon: (main, hole) => svg(`<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${main}"/><circle cx="12" cy="9.2" r="2.6" fill="${hole}"/>`) }
  };

  const MODES = {
    car:  { label: "자동차",
      icon: (main) => svg(`<path d="M18.92 6.75c-.2-.6-.76-1-1.42-1h-11c-.66 0-1.21.4-1.42 1L3 12.7v7.6c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-7.6l-2.08-5.95zM6.5 16.5A1.5 1.5 0 1 1 6.5 13.5a1.5 1.5 0 0 1 0 3zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM5 11.5l1.5-4.5h11l1.5 4.5H5z" fill="${main}"/>`) },
    walk: { label: "도보",
      icon: (main) => svg(`<ellipse cx="8.6" cy="6.4" rx="1.7" ry="2.3" fill="${main}" transform="rotate(-18 8.6 6.4)"/><ellipse cx="15.2" cy="11.6" rx="1.7" ry="2.3" fill="${main}" transform="rotate(18 15.2 11.6)"/><ellipse cx="8.6" cy="17.6" rx="1.7" ry="2.3" fill="${main}" transform="rotate(-18 8.6 17.6)"/>`) },
    bus:  { label: "대중교통",
      icon: (main, hole) => svg(`<rect x="4.5" y="4.2" width="15" height="13.6" rx="3.4" fill="${main}"/><rect x="6.4" y="6.3" width="11.2" height="4.2" rx="1.1" fill="${hole}"/><circle cx="8" cy="19.3" r="1.4" fill="${main}"/><circle cx="16" cy="19.3" r="1.4" fill="${main}"/>`) }
  };

  const mapIcon = svg(`<path d="M12 21s7-6.2 7-11.6C19 5.3 15.9 2 12 2S5 5.3 5 9.4C5 14.8 12 21 12 21Z" fill="currentColor"/><circle cx="12" cy="9.3" r="2.7" fill="var(--naver)"/>`);
  const daymapIcon = svg(`<path d="M9 3.4 3 5.8v14.8l6-2.4 6 2.4 6-2.4V3.4l-6 2.4-6-2.4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 3.4v14.8M15 5.8v14.8" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="11" r="2" fill="currentColor"/>`);
  const pencilIcon = svg(`<path d="M3 21l1-4.2L14.5 6.2a1.2 1.2 0 0 1 1.7 0l1.6 1.6a1.2 1.2 0 0 1 0 1.7L7.2 20l-4.2 1z" fill="currentColor"/>`);
  const heartIcon = svg(`<path d="M12 21s-7.2-4.4-9.6-8.9C.7 8.7 2.1 5.2 5.5 4.4c2-.5 4 .3 5 2.1 1-1.8 3-2.6 5-2.1 3.4.8 4.8 4.3 3.1 7.7C19.2 16.6 12 21 12 21z" fill="currentColor"/>`);

  function uid() { return (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function formatTime(t) {
    if (!t) return null;
    const [hh, mm] = t.split(":").map(Number);
    const period = hh < 12 ? "오전" : "오후";
    let h12 = hh % 12; if (h12 === 0) h12 = 12;
    return { period, hm: `${h12}:${String(mm).padStart(2, "0")}` };
  }
  function dDayLabel(startStr) {
    const start = new Date(startStr + "T00:00:00");
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const diff = Math.round((start - now) / 86400000);
    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return "D-DAY";
    return `D+${-diff}`;
  }
  function getVoterId() {
    let v = localStorage.getItem("jeju-voter-id");
    if (!v) { v = uid(); localStorage.setItem("jeju-voter-id", v); }
    return v;
  }
  const VOTER_ID = getVoterId();

  // ---- remote state (mirrors the Supabase tables) --------------------------
  let days = [];         // [{day_index, date_label, weekday, map_url}]
  let items = [];        // [{id, day_index, kind, sort_order, time, category, name, meta, map_url, mode, duration}]
  let candidates = [];    // [{id, item_id, name, meta, map_url}]
  let votes = [];         // [{candidate_id, voter_id}]

  function itemsForDay(di) { return items.filter((it) => it.day_index === di).sort((a, b) => a.sort_order - b.sort_order); }
  function candidatesForItem(itemId) { return candidates.filter((c) => c.item_id === itemId); }
  function votesForCandidate(cid) { return votes.filter((v) => v.candidate_id === cid); }

  function computeSortOrder(di, insertAt) {
    const list = itemsForDay(di);
    if (list.length === 0) return 1;
    if (insertAt <= 0) return list[0].sort_order - 1;
    if (insertAt >= list.length) return list[list.length - 1].sort_order + 1;
    return (list[insertAt - 1].sort_order + list[insertAt].sort_order) / 2;
  }

  // ---- local, per-day UI state (not synced — just "what form is open") ----
  function freshDraft() { return { time: "", name: "", meta: "", mapUrl: "", duration: "" }; }
  let formState = [0, 1, 2, 3].map(() => ({ open: null, category: "food", mode: "car", editId: null, insertAt: null, draft: freshDraft() }));
  let dayMapEdit = [0, 1, 2, 3].map(() => false);
  let voteDrafts = {}; // itemId -> current text in that vote-card's "add candidate" input
  let pendingDelete = null;

  const navEl = document.getElementById("daynav");
  const daysEl = document.getElementById("days");
  const overlayEl = document.getElementById("overlayRoot");
  const syncDot = document.getElementById("syncDot");
  document.getElementById("ddayBadge").textContent = dDayLabel(TRIP_START);

  function setSync(state) { syncDot.className = "sync-dot" + (state === "live" ? " live" : state === "err" ? " err" : ""); }

  // ---------------------------------------------------------------- render --
  function captureDraft(di) {
    const form = daysEl.querySelector(`.add-form[data-day="${di}"]`);
    if (!form) return;
    const fs = formState[di];
    const timeEl = form.querySelector('[data-role="f-time"]'); if (timeEl) fs.draft.time = timeEl.value;
    const nameEl = form.querySelector('[data-role="f-name"]'); if (nameEl) fs.draft.name = nameEl.value;
    const metaEl = form.querySelector('[data-role="f-meta"]'); if (metaEl) fs.draft.meta = metaEl.value;
    const linkEl = form.querySelector('[data-role="f-maplink"]'); if (linkEl) fs.draft.mapUrl = linkEl.value;
    const durEl = form.querySelector('[data-role="f-duration"]'); if (durEl) fs.draft.duration = durEl.value;
  }

  function stopFormHtml(di, fs) {
    const d = fs.draft;
    const chips = Object.entries(CATEGORIES).map(([key, c]) => {
      const sel = fs.category === key;
      const main = sel ? "#fff" : c.fg, hole = sel ? c.fg : "#fff";
      return `<button type="button" class="chip${sel ? " selected" : ""}" style="${sel ? `background:${c.fg};` : ""}" data-action="pick-cat" data-day="${di}" data-cat="${key}">${c.icon(main, hole)}${c.label}</button>`;
    }).join("");
    const label = fs.editId ? "저장" : "추가";
    return `<div class="add-form" data-day="${di}">
      <div class="chip-row">${chips}</div>
      <div class="form-grid">
        <input type="text" inputmode="numeric" pattern="^([01][0-9]|2[0-3]):[0-5][0-9]$" maxlength="5" placeholder="14:30" value="${esc(d.time)}" data-role="f-time" aria-label="시간 (24시간제, 예: 14:30)">
        <input type="text" placeholder="장소 이름" maxlength="40" value="${esc(d.name)}" data-role="f-name">
      </div>
      <input type="text" placeholder="메모 (예: 서귀포 · 실내)" maxlength="60" value="${esc(d.meta)}" data-role="f-meta">
      <input type="text" placeholder="네이버지도 링크 (선택, 비워두면 이름으로 자동 검색)" value="${esc(d.mapUrl)}" data-role="f-maplink">
      <div class="form-actions">
        <button type="button" class="btn-cancel" data-action="cancel-form" data-day="${di}">취소</button>
        <button type="button" class="btn-primary" data-action="submit-stop" data-day="${di}">${label}</button>
      </div>
    </div>`;
  }

  function transitFormHtml(di, fs) {
    const d = fs.draft;
    const chips = Object.entries(MODES).map(([key, m]) => {
      const sel = fs.mode === key;
      const main = sel ? "#fff" : "#5c6b81", hole = sel ? "#3d4db3" : "#fff";
      return `<button type="button" class="chip${sel ? " selected" : ""}" style="${sel ? "background:#3d4db3;" : ""}" data-action="pick-mode" data-day="${di}" data-mode="${key}">${m.icon(main, hole)}${m.label}</button>`;
    }).join("");
    const label = fs.editId ? "저장" : "추가";
    return `<div class="add-form" data-day="${di}">
      <div class="chip-row">${chips}</div>
      <div class="form-grid">
        <input type="number" min="1" max="600" placeholder="이동 시간 (분)" value="${esc(d.duration)}" data-role="f-duration">
      </div>
      <div class="form-actions">
        <button type="button" class="btn-cancel" data-action="cancel-form" data-day="${di}">취소</button>
        <button type="button" class="btn-primary" data-action="submit-transit" data-day="${di}">${label}</button>
      </div>
    </div>`;
  }

  function voteFormHtml(di, fs) {
    const d = fs.draft;
    const chips = Object.entries(CATEGORIES).map(([key, c]) => {
      const sel = fs.category === key;
      const main = sel ? "#fff" : c.fg, hole = sel ? c.fg : "#fff";
      return `<button type="button" class="chip${sel ? " selected" : ""}" style="${sel ? `background:${c.fg};` : ""}" data-action="pick-cat" data-day="${di}" data-cat="${key}">${c.icon(main, hole)}${c.label}</button>`;
    }).join("");
    const names = (fs.draft.candidateNames || []);
    const nameChips = names.map((n, idx) => `<span class="chip" style="cursor:default;">${esc(n)}<button type="button" data-action="remove-draft-candidate" data-day="${di}" data-idx="${idx}" style="border:none;background:none;color:inherit;font-weight:900;margin-left:2px;cursor:pointer;">×</button></span>`).join("");
    return `<div class="add-form" data-day="${di}">
      <div class="chip-row">${chips}</div>
      <div class="form-grid">
        <input type="text" inputmode="numeric" pattern="^([01][0-9]|2[0-3]):[0-5][0-9]$" maxlength="5" placeholder="14:30 (선택)" value="${esc(d.time)}" data-role="f-time">
      </div>
      ${names.length ? `<div class="chip-row">${nameChips}</div>` : ""}
      <div class="form-grid">
        <input type="text" placeholder="후보 장소 이름 입력 후 추가" maxlength="40" data-role="f-candidate">
        <button type="button" class="btn-cancel" style="flex:0 0 auto;" data-action="add-draft-candidate" data-day="${di}">추가</button>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-cancel" data-action="cancel-form" data-day="${di}">취소</button>
        <button type="button" class="btn-primary" data-action="submit-vote" data-day="${di}">투표 카드 만들기</button>
      </div>
    </div>`;
  }

  function daymapSectionHtml(di, day) {
    if (dayMapEdit[di]) {
      const val = day.map_url || "";
      const removeBtn = val ? `<button type="button" class="btn-text-danger" data-action="remove-daymap" data-day="${di}">링크 삭제</button>` : "";
      return `<div class="daymap-form" data-day="${di}">
        <input type="text" placeholder="이 날짜의 네이버지도 모음 링크" value="${esc(val)}" data-role="f-daymap">
        <div class="form-actions">
          ${removeBtn}
          <button type="button" class="btn-cancel" data-action="cancel-daymap" data-day="${di}">취소</button>
          <button type="button" class="btn-primary" data-action="save-daymap" data-day="${di}">저장</button>
        </div>
      </div>`;
    }
    if (day.map_url) {
      return `<div class="daymap-wrap">
        <a class="daymap-card" href="${esc(day.map_url)}" target="_blank" rel="noopener">
          <span class="daymap-icon">${daymapIcon}</span>
          <span class="title-block">
            <p class="daymap-title">Day ${di + 1} 지도 모아보기</p>
            <p class="daymap-sub">네이버지도에서 전체 장소 보기</p>
          </span>
          <span class="daymap-arrow">›</span>
        </a>
        <button type="button" class="icon-btn daymap-edit" data-action="open-daymap" data-day="${di}" aria-label="지도 링크 수정">${pencilIcon}</button>
      </div>`;
    }
    return `<button type="button" class="daymap-add" data-action="open-daymap" data-day="${di}">＋ 지도 모음 링크 추가</button>`;
  }

  function voteCardHtml(di, item) {
    const cat = CATEGORIES[item.category] || CATEGORIES.etc;
    const t = formatTime(item.time);
    const timeHtml = t ? `<span class="period">${t.period}</span><span class="hm">${t.hm}</span>` : `<span class="dash">·</span>`;
    const cands = candidatesForItem(item.id);
    const rows = cands.map((c) => {
      const vs = votesForCandidate(c.id);
      const votedByMe = vs.some((v) => v.voter_id === VOTER_ID);
      const mapHref = c.map_url && c.map_url.trim() ? esc(c.map_url.trim()) : `https://map.naver.com/p/search/${encodeURIComponent(c.name)}`;
      return `<li class="poll-item${votedByMe ? " voted" : ""}" data-kind="candidate" data-day="${di}" data-id="${c.id}">
        <span class="poll-name">${esc(c.name)}</span>
        <a class="maplink-icon small" target="_blank" rel="noopener" href="${mapHref}" aria-label="네이버지도">${mapIcon}</a>
        <button type="button" class="poll-vote-btn" data-action="toggle-vote" data-id="${c.id}">${heartIcon}<span>${vs.length}</span></button>
      </li>`;
    }).join("");
    const draftVal = voteDrafts[item.id] || "";
    return `<div class="vote-card" data-kind="item" data-day="${di}" data-id="${item.id}">
      <div class="item-main">
        <div class="time-block">${timeHtml}</div>
        <span class="badge" style="background:${cat.bg}">${cat.icon(cat.fg, cat.bg)}</span>
        <div class="title-block"><span class="vote-label">🗳️ 후보 투표중</span></div>
      </div>
      <ul class="vote-candidates">${rows || `<li style="padding:4px 2px;color:var(--text-faint);font-size:12.5px;">아직 후보가 없어요</li>`}</ul>
      <div class="poll-add-row">
        <input type="text" placeholder="후보 장소 제안하기" maxlength="40" value="${esc(draftVal)}" data-role="f-vote-candidate" data-item="${item.id}">
        <button type="button" data-action="add-candidate" data-day="${di}" data-item="${item.id}">추가</button>
      </div>
    </div>`;
  }

  function render() {
    navEl.innerHTML = days.map((d, i) => `<a href="#day-${i + 1}">day ${i + 1} · ${d.date_label}</a>`).join("");

    daysEl.innerHTML = days.map((day, di) => {
      const fs = formState[di];
      const dayItems = itemsForDay(di);
      const n = dayItems.length;

      const pieces = [];
      dayItems.forEach((item, idx) => {
        if (fs.editId === item.id && item.kind !== "vote") {
          pieces.push(item.kind === "transit" ? transitFormHtml(di, fs) : stopFormHtml(di, fs));
        } else if (item.kind === "transit") {
          const mode = MODES[item.mode] || MODES.car;
          pieces.push(`<div class="transit-card" data-kind="item" data-day="${di}" data-id="${item.id}">
            <div class="item-main">
              <span class="badge transit-badge">${mode.icon("#5c6b81", "var(--surface-sunken)")}</span>
              <div class="title-block"><p class="transit-text">${mode.label}로 ${item.duration}분 이동</p></div>
              <button class="icon-btn" data-action="edit-item" data-day="${di}" data-id="${item.id}" aria-label="수정">${pencilIcon}</button>
            </div>
          </div>`);
        } else if (item.kind === "vote") {
          pieces.push(voteCardHtml(di, item));
        } else {
          const cat = CATEGORIES[item.category] || CATEGORIES.etc;
          const t = formatTime(item.time);
          const timeHtml = t ? `<span class="period">${t.period}</span><span class="hm">${t.hm}</span>` : `<span class="dash">·</span>`;
          const mapHref = item.map_url && item.map_url.trim() ? esc(item.map_url.trim()) : `https://map.naver.com/p/search/${encodeURIComponent(item.name)}`;
          pieces.push(`<div class="stop-card" data-kind="item" data-day="${di}" data-id="${item.id}">
            <div class="item-main">
              <div class="time-block">${timeHtml}</div>
              <span class="badge" style="background:${cat.bg}">${cat.icon(cat.fg, cat.bg)}</span>
              <div class="title-block">
                <p class="name">${esc(item.name)}</p>
                ${item.meta ? `<p class="meta-row">${esc(item.meta)}</p>` : ""}
              </div>
              <a class="maplink-icon" target="_blank" rel="noopener" href="${mapHref}" aria-label="네이버지도">${mapIcon}</a>
              <button class="icon-btn" data-action="edit-item" data-day="${di}" data-id="${item.id}" aria-label="수정">${pencilIcon}</button>
            </div>
          </div>`);
        }
        if (!fs.open && idx < n - 1) {
          pieces.push(`<div class="insert-row">
            <button type="button" class="insert-chip" data-action="open-stop" data-day="${di}" data-at="${idx + 1}">＋ 장소</button>
            <button type="button" class="insert-chip" data-action="open-transit" data-day="${di}" data-at="${idx + 1}">＋ 이동시간</button>
            <button type="button" class="insert-chip" data-action="open-vote" data-day="${di}" data-at="${idx + 1}">＋ 투표</button>
          </div>`);
        }
      });

      const showAddForm = fs.open && !fs.editId;
      const formHtml = showAddForm ? (fs.open === "transit" ? transitFormHtml(di, fs) : fs.open === "vote" ? voteFormHtml(di, fs) : stopFormHtml(di, fs)) : "";
      const emptyHtml = (n === 0 && !showAddForm) ? `<div class="empty-card"><p>아직 일정이 없어요</p><span>+ 버튼으로 장소를 추가해보세요</span></div>` : "";
      const actionsHtml = (!fs.open) ? `<div class="actions-row">
        <button type="button" class="ghost-btn" data-action="open-stop" data-day="${di}" data-at="${n}">＋ 장소</button>
        <button type="button" class="ghost-btn" data-action="open-transit" data-day="${di}" data-at="${n}">＋ 이동시간</button>
        <button type="button" class="ghost-btn" data-action="open-vote" data-day="${di}" data-at="${n}">＋ 후보 투표</button>
      </div>` : "";

      return `<section class="day" id="day-${di + 1}">
        <div class="day-head">
          <div class="top-row"><span class="n">day ${di + 1}</span><span class="d">${day.date_label} / ${day.weekday}</span></div>
          ${day.theme ? `<p class="theme">${esc(day.theme)}</p>` : ""}
        </div>
        <div class="day-body">
          ${daymapSectionHtml(di, day)}
          ${pieces.join("")}
          ${emptyHtml}${formHtml}${actionsHtml}
        </div>
      </section>`;
    }).join("");
  }

  function renderOverlay() {
    if (!pendingDelete) { overlayEl.innerHTML = ""; return; }
    const title = pendingDelete.kind === "candidate" ? "이 후보를 삭제할까요?" : "이 일정을 삭제할까요?";
    overlayEl.innerHTML = `<div class="overlay-backdrop" data-action="cancel-delete">
      <div class="overlay-card">
        <p class="overlay-title">${title}</p>
        <p class="overlay-desc">삭제하면 모두에게 반영되고 되돌릴 수 없어요.</p>
        <div class="overlay-actions">
          <button type="button" class="btn-cancel" data-action="cancel-delete">취소</button>
          <button type="button" class="btn-danger" data-action="confirm-delete">삭제</button>
        </div>
      </div>
    </div>`;
  }

  // ------------------------------------------------------------ data layer --
  async function fetchAll() {
    try {
      const [daysRes, itemsRes, candRes, voteRes] = await Promise.all([
        supabase.from("days").select("*").order("day_index"),
        supabase.from("items").select("*"),
        supabase.from("candidates").select("*"),
        supabase.from("candidate_votes").select("*"),
      ]);
      if (daysRes.error) throw daysRes.error;
      if (itemsRes.error) throw itemsRes.error;
      if (candRes.error) throw candRes.error;
      if (voteRes.error) throw voteRes.error;
      days = daysRes.data;
      items = itemsRes.data;
      candidates = candRes.data;
      votes = voteRes.data;
      setSync("live");
      render();
    } catch (err) {
      console.error("fetchAll failed", err);
      setSync("err");
    }
  }

  let refetchTimer = null;
  function scheduleRefetch() {
    if (refetchTimer) clearTimeout(refetchTimer);
    refetchTimer = setTimeout(fetchAll, 150);
  }

  function subscribeRealtime() {
    supabase.channel("trip-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "items" }, scheduleRefetch)
      .on("postgres_changes", { event: "*", schema: "public", table: "candidates" }, scheduleRefetch)
      .on("postgres_changes", { event: "*", schema: "public", table: "candidate_votes" }, scheduleRefetch)
      .on("postgres_changes", { event: "*", schema: "public", table: "days" }, scheduleRefetch)
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setSync("live");
        else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") setSync("err");
      });
  }

  // ------------------------------------------------------------- mutations --
  async function addItem(di, kind, fields, insertAt) {
    const sort_order = computeSortOrder(di, insertAt);
    const { error } = await supabase.from("items").insert({ day_index: di, kind, sort_order, ...fields });
    if (error) console.error(error);
  }
  async function updateItem(id, fields) {
    const { error } = await supabase.from("items").update(fields).eq("id", id);
    if (error) console.error(error);
  }
  async function deleteItem(id) {
    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) console.error(error);
  }
  async function addCandidate(itemId, name) {
    const { error } = await supabase.from("candidates").insert({ item_id: itemId, name });
    if (error) console.error(error);
  }
  async function deleteCandidate(id) {
    const { error } = await supabase.from("candidates").delete().eq("id", id);
    if (error) console.error(error);
  }
  async function toggleVote(candidateId) {
    const already = votes.some((v) => v.candidate_id === candidateId && v.voter_id === VOTER_ID);
    if (already) {
      const { error } = await supabase.from("candidate_votes").delete().eq("candidate_id", candidateId).eq("voter_id", VOTER_ID);
      if (error) console.error(error);
    } else {
      const { error } = await supabase.from("candidate_votes").insert({ candidate_id: candidateId, voter_id: VOTER_ID });
      if (error) console.error(error);
    }
  }
  async function saveDayMap(di, url) {
    const { error } = await supabase.from("days").update({ map_url: url }).eq("day_index", di);
    if (error) console.error(error);
  }

  // ------------------------------------------------------------ interaction --
  daysEl.addEventListener("input", (e) => {
    if (e.target.matches('[data-role="f-time"]')) {
      let v = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
      if (v.length >= 3) v = v.slice(0, 2) + ":" + v.slice(2);
      e.target.value = v;
    }
    if (e.target.matches('[data-role="f-vote-candidate"]')) {
      voteDrafts[e.target.dataset.item] = e.target.value;
    }
  });

  // long-press on a card to delete (there is no visible delete button)
  let pressTimer = null, pressTarget = null, pressStartX = 0, pressStartY = 0;
  function clearPress() {
    if (pressTimer) clearTimeout(pressTimer);
    pressTimer = null;
    if (pressTarget) pressTarget.classList.remove("pressing");
    pressTarget = null;
  }
  daysEl.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".icon-btn, .maplink-icon, .poll-vote-btn, input, button, a")) return;
    const card = e.target.closest(".poll-item, .stop-card, .transit-card, .vote-card");
    if (!card) return;
    pressTarget = card;
    pressStartX = e.clientX; pressStartY = e.clientY;
    card.classList.add("pressing");
    pressTimer = setTimeout(() => {
      pendingDelete = { kind: card.dataset.kind === "candidate" ? "candidate" : "item", di: Number(card.dataset.day), id: card.dataset.id };
      clearPress();
      renderOverlay();
    }, 550);
  });
  daysEl.addEventListener("pointermove", (e) => {
    if (!pressTimer) return;
    if (Math.abs(e.clientX - pressStartX) > 8 || Math.abs(e.clientY - pressStartY) > 8) clearPress();
  });
  daysEl.addEventListener("pointerup", clearPress);
  daysEl.addEventListener("pointercancel", clearPress);
  daysEl.addEventListener("pointerleave", clearPress, true);

  daysEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const di = btn.dataset.day !== undefined ? Number(btn.dataset.day) : null;
    const fs = di !== null ? formState[di] : null;

    if (action === "open-stop") {
      const at = btn.dataset.at !== undefined ? Number(btn.dataset.at) : itemsForDay(di).length;
      formState[di] = { open: "stop", category: "food", mode: "car", editId: null, insertAt: at, draft: freshDraft() }; render();
    }
    else if (action === "open-transit") {
      const at = btn.dataset.at !== undefined ? Number(btn.dataset.at) : itemsForDay(di).length;
      formState[di] = { open: "transit", category: "food", mode: "car", editId: null, insertAt: at, draft: freshDraft() }; render();
    }
    else if (action === "open-vote") {
      const at = btn.dataset.at !== undefined ? Number(btn.dataset.at) : itemsForDay(di).length;
      formState[di] = { open: "vote", category: "food", mode: "car", editId: null, insertAt: at, draft: { ...freshDraft(), candidateNames: [] } }; render();
    }
    else if (action === "cancel-form") { fs.open = null; fs.editId = null; render(); }
    else if (action === "pick-cat") { captureDraft(di); fs.category = btn.dataset.cat; render(); }
    else if (action === "pick-mode") { captureDraft(di); fs.mode = btn.dataset.mode; render(); }
    else if (action === "add-draft-candidate") {
      const form = btn.closest(".add-form");
      const input = form.querySelector('[data-role="f-candidate"]');
      const val = input.value.trim();
      if (!val) { input.focus(); return; }
      fs.draft.candidateNames = fs.draft.candidateNames || [];
      fs.draft.candidateNames.push(val);
      render();
    }
    else if (action === "remove-draft-candidate") {
      fs.draft.candidateNames.splice(Number(btn.dataset.idx), 1);
      render();
    }
    else if (action === "edit-item") {
      const item = items.find((it) => it.id === btn.dataset.id);
      if (!item) return;
      if (item.kind === "transit") {
        formState[di] = { open: "transit", category: "food", mode: item.mode, editId: item.id, insertAt: null, draft: { ...freshDraft(), duration: String(item.duration || "") } };
      } else if (item.kind === "stop") {
        formState[di] = { open: "stop", category: item.category, mode: "car", editId: item.id, insertAt: null, draft: { time: item.time || "", name: item.name || "", meta: item.meta || "", mapUrl: item.map_url || "", duration: "" } };
      } else {
        return; // vote-card fields are edited inline (time/category) — reuse edit-item for future extension
      }
      render();
    }
    else if (action === "submit-stop") {
      const form = btn.closest(".add-form");
      const name = form.querySelector('[data-role="f-name"]').value.trim();
      if (!name) { form.querySelector('[data-role="f-name"]').focus(); return; }
      const timeRaw = form.querySelector('[data-role="f-time"]').value;
      const time = /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(timeRaw) ? timeRaw : "";
      const meta = form.querySelector('[data-role="f-meta"]').value.trim();
      const mapUrl = form.querySelector('[data-role="f-maplink"]').value.trim();
      if (fs.editId) {
        updateItem(fs.editId, { time, category: fs.category, name, meta, map_url: mapUrl });
      } else {
        addItem(di, "stop", { time, category: fs.category, name, meta, map_url: mapUrl }, fs.insertAt);
      }
      fs.open = null; fs.editId = null; render();
    }
    else if (action === "submit-transit") {
      const form = btn.closest(".add-form");
      const duration = Number(form.querySelector('[data-role="f-duration"]').value);
      if (!duration || duration <= 0) { form.querySelector('[data-role="f-duration"]').focus(); return; }
      if (fs.editId) {
        updateItem(fs.editId, { mode: fs.mode, duration });
      } else {
        addItem(di, "transit", { mode: fs.mode, duration }, fs.insertAt);
      }
      fs.open = null; fs.editId = null; render();
    }
    else if (action === "submit-vote") {
      const form = btn.closest(".add-form");
      const timeRaw = form.querySelector('[data-role="f-time"]').value;
      const time = /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(timeRaw) ? timeRaw : "";
      const names = fs.draft.candidateNames || [];
      (async () => {
        const { data, error } = await supabase.from("items").insert({ day_index: di, kind: "vote", sort_order: computeSortOrder(di, fs.insertAt), time, category: fs.category }).select().single();
        if (error) { console.error(error); return; }
        for (const n of names) await supabase.from("candidates").insert({ item_id: data.id, name: n });
      })();
      fs.open = null; fs.editId = null; render();
    }
    else if (action === "add-candidate") {
      const itemId = btn.dataset.item;
      const input = daysEl.querySelector(`[data-role="f-vote-candidate"][data-item="${itemId}"]`);
      const name = input.value.trim();
      if (!name) { input.focus(); return; }
      addCandidate(itemId, name);
      delete voteDrafts[itemId];
    }
    else if (action === "toggle-vote") { toggleVote(btn.dataset.id); }
    else if (action === "open-daymap") { dayMapEdit[di] = true; render(); }
    else if (action === "cancel-daymap") { dayMapEdit[di] = false; render(); }
    else if (action === "remove-daymap") { saveDayMap(di, ""); dayMapEdit[di] = false; render(); }
    else if (action === "save-daymap") {
      const form = btn.closest(".daymap-form");
      saveDayMap(di, form.querySelector('[data-role="f-daymap"]').value.trim());
      dayMapEdit[di] = false; render();
    }
  });

  overlayEl.addEventListener("click", (e) => {
    const action = e.target.dataset ? e.target.dataset.action : null;
    if (action === "cancel-delete") { pendingDelete = null; renderOverlay(); return; }
    if (action === "confirm-delete") {
      const { kind, id } = pendingDelete;
      if (kind === "candidate") deleteCandidate(id); else deleteItem(id);
      pendingDelete = null;
      renderOverlay();
    }
  });

  setSync("");
  fetchAll();
  subscribeRealtime();
})();
