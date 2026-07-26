// ---------------------------------------------------------------------------
// Supabase config — fill these in after you create a project and run
// supabase/schema.sql in its SQL editor (Dashboard -> Project Settings -> API
// for the URL and the "anon public" key). See README.md for the full setup.
// ---------------------------------------------------------------------------
const SUPABASE_URL = "https://lrwwiqtfxalgzvhqxjhz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_wd8ffERg_lBJdC4UiSMbsA_7ydTVUu9";

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

  const mapIcon = svg(`<path d="M12 21s7-6.2 7-11.6C19 5.3 15.9 2 12 2S5 5.3 5 9.4C5 14.8 12 21 12 21Z" fill="currentColor"/><circle cx="12" cy="9.3" r="2.7" fill="var(--naver-soft)"/>`);
  const pencilIcon = svg(`<path d="M3 21l1-4.2L14.5 6.2a1.2 1.2 0 0 1 1.7 0l1.6 1.6a1.2 1.2 0 0 1 0 1.7L7.2 20l-4.2 1z" fill="currentColor"/>`);
  const heartIcon = svg(`<path d="M12 21s-7.2-4.4-9.6-8.9C.7 8.7 2.1 5.2 5.5 4.4c2-.5 4 .3 5 2.1 1-1.8 3-2.6 5-2.1 3.4.8 4.8 4.3 3.1 7.7C19.2 16.6 12 21 12 21z" fill="currentColor"/>`);
  const carIcon = svg(`<path d="M18.92 6.75c-.2-.6-.76-1-1.42-1h-11c-.66 0-1.21.4-1.42 1L3 12.7v7.6c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-7.6l-2.08-5.95zM6.5 16.5A1.5 1.5 0 1 1 6.5 13.5a1.5 1.5 0 0 1 0 3zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM5 11.5l1.5-4.5h11l1.5 4.5H5z" fill="currentColor"/>`);
  const voteIcon = (main, hole) => svg(`<path d="M8 4.2h8l1.8 4.6H6.2L8 4.2z" fill="${main}"/><rect x="4" y="9" width="16" height="10.8" rx="2" fill="${main}"/><path d="M8.4 14l2.3 2.1 4.3-4.4" stroke="${hole}" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);

  function uid() { return (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
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
  function naverRouteUrl(fromName, toName) {
    return `https://map.naver.com/p/directions/${encodeURIComponent(fromName)}/${encodeURIComponent(toName)}/-/car`;
  }
  function normalizeUrl(u) {
    const t = (u || "").trim();
    if (!t) return "";
    return /^https?:\/\//i.test(t) ? t : "https://" + t;
  }

  // ---- remote state (mirrors the Supabase tables) --------------------------
  let days = [];        // [{day_index, date_label, weekday, theme, map_url}]
  let items = [];       // [{id, day_index, kind, sort_order, time, category, name, meta, map_url, distance_m}]
  let candidates = [];  // [{id, item_id, name, meta, map_url}]
  let votes = [];        // [{candidate_id, voter_id}]

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
  function freshDraft() { return { time: "", name: "", meta: "", mapUrl: "", distance: "", voteMode: false, candidateNames: [] }; }
  let formState = [0, 1, 2, 3].map(() => ({ open: null, category: "food", editId: null, insertAt: null, draft: freshDraft() }));
  let voteDrafts = {}; // itemId -> current text in that vote-card's "add candidate" input
  let candidateEditState = [0, 1, 2, 3].map(() => null); // per-day: {id, name, mapUrl} while editing a candidate, else null
  let pendingDelete = null;

  const navEl = document.getElementById("daynav");
  const daysEl = document.getElementById("days");
  const overlayEl = document.getElementById("overlayRoot");
  const syncDot = document.getElementById("syncDot");
  const headerEl = document.querySelector("header.trip");
  document.getElementById("ddayBadge").textContent = dDayLabel(TRIP_START);

  // The header is fixed, so a spacer of its expanded height stands in for it in
  // the flow. Keeping that height constant means shrinking the header on scroll
  // never shifts the content underneath.
  const spacerEl = document.getElementById("headerSpacer");
  function sizeHeaderSpacer() {
    const wasCompact = headerEl.classList.contains("compact");
    headerEl.style.transition = "none";
    headerEl.classList.remove("compact");
    const expanded = headerEl.offsetHeight;
    if (wasCompact) headerEl.classList.add("compact");
    headerEl.offsetHeight; // flush before restoring the transition
    headerEl.style.transition = "";
    spacerEl.style.height = expanded + "px";
  }

  // Shrink the header to a compact bar once the page is scrolled.
  function syncHeader() {
    headerEl.classList.toggle("compact", (window.scrollY || document.documentElement.scrollTop) > 24);
  }
  window.addEventListener("scroll", syncHeader, { passive: true });
  window.addEventListener("resize", sizeHeaderSpacer);
  sizeHeaderSpacer();
  syncHeader();

  // Once the trip is underway, open the page on today's day instead of day 1.
  let jumpedToToday = false;
  function jumpToToday() {
    if (jumpedToToday || !days.length) return;
    const start = new Date(TRIP_START + "T00:00:00");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const idx = Math.round((today - start) / 86400000);
    jumpedToToday = true;
    if (idx <= 0 || idx >= days.length) return; // before the trip, or already over
    const el = document.getElementById(`day-${idx + 1}`);
    if (!el) return;
    el.scrollIntoView({ block: "start" });
    syncHeader(); // programmatic scrolls don't always fire a scroll event
  }

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
    const distEl = form.querySelector('[data-role="f-distance"]'); if (distEl) fs.draft.distance = distEl.value;
  }

  function stopFormHtml(di, fs) {
    const d = fs.draft;
    const voteMode = !!d.voteMode;
    const catChips = Object.entries(CATEGORIES).map(([key, c]) => {
      const sel = fs.category === key;
      const main = sel ? "#fff" : c.fg, hole = sel ? c.fg : "#fff";
      return `<button type="button" class="chip${sel ? " selected" : ""}" style="${sel ? `background:${c.fg};` : ""}" data-action="pick-cat" data-day="${di}" data-cat="${key}">${c.icon(main, hole)}${c.label}</button>`;
    }).join("");
    const toggleChip = `<button type="button" class="chip${voteMode ? " selected" : ""}" style="${voteMode ? "background:#7a3fb0;" : ""}" data-action="toggle-vote-mode" data-day="${di}">${voteIcon(voteMode ? "#fff" : "#7a3fb0", voteMode ? "#7a3fb0" : "#fff")} 여러 후보로 투표받기</button>`;
    const label = fs.editId ? "저장" : (voteMode ? "투표 카드 만들기" : "추가");

    const timeInput = `<input type="text" inputmode="numeric" pattern="^([01][0-9]|2[0-3]):[0-5][0-9]$" maxlength="5" placeholder="시간 입력 예: 14:30" value="${esc(d.time)}" data-role="f-time" aria-label="시간 (24시간제)">`;

    let bodyHtml;
    if (voteMode) {
      const names = d.candidateNames || [];
      const nameChips = names.map((n, idx) => `<span class="chip" style="cursor:default;">${esc(n)}<button type="button" data-action="remove-draft-candidate" data-day="${di}" data-idx="${idx}" style="border:none;background:none;color:inherit;font-weight:900;margin-left:2px;cursor:pointer;">×</button></span>`).join("");
      bodyHtml = `<div class="form-grid">${timeInput}</div>
        <input type="text" placeholder="투표 제목 (예: 점심 뭐 먹지?)" maxlength="40" value="${esc(d.name)}" data-role="f-name">
        <div class="form-divider"></div>
        ${names.length ? `<div class="chip-row">${nameChips}</div>` : ""}
        <div class="form-grid">
          <input type="text" placeholder="후보 장소 이름 입력 후 추가" maxlength="40" data-role="f-candidate">
          <button type="button" class="btn-inline-add" data-action="add-draft-candidate" data-day="${di}">추가</button>
        </div>`;
    } else {
      bodyHtml = `<div class="form-grid">
          <input type="text" placeholder="장소 이름" maxlength="40" value="${esc(d.name)}" data-role="f-name">
        </div>
        <input type="text" placeholder="메모 · 예: 서귀포, 실내" maxlength="60" value="${esc(d.meta)}" data-role="f-meta">
        <input type="text" placeholder="네이버지도 링크 (선택) · 비워두면 이름으로 자동 검색" value="${esc(d.mapUrl)}" data-role="f-maplink">
        <div class="form-divider"></div>
        <div class="form-grid">
          ${timeInput}
          <input type="text" inputmode="numeric" placeholder="다음 장소까지 거리(m) · 예: 357" maxlength="6" value="${esc(d.distance)}" data-role="f-distance">
        </div>`;
    }

    return `<div class="add-form" data-day="${di}">
      <div class="chip-row">${catChips}</div>
      <div class="chip-row">${toggleChip}</div>
      ${bodyHtml}
      <div class="form-actions">
        <button type="button" class="btn-cancel" data-action="cancel-form" data-day="${di}">취소</button>
        <button type="button" class="btn-primary" data-action="submit-stop" data-day="${di}">${label}</button>
      </div>
    </div>`;
  }

  function voteCardHtml(di, item, editing) {
    const cat = CATEGORIES[item.category] || CATEGORIES.etc;
    const timeHtml = item.time ? `<span class="hm">${item.time}</span>` : `<span class="dash">·</span>`;
    const cands = candidatesForItem(item.id);
    const rows = cands.map((c) => {
      if (editing && editing.id === c.id) {
        return `<li class="poll-item poll-item-edit" data-kind="candidate" data-day="${di}" data-id="${c.id}">
          <div class="poll-edit-fields">
            <input type="text" placeholder="후보 이름" maxlength="40" value="${esc(editing.name)}" data-role="f-cand-name">
            <input type="text" placeholder="네이버지도 공유 링크 (선택, 비워두면 이름으로 검색)" value="${esc(editing.mapUrl)}" data-role="f-cand-link">
          </div>
          <div class="poll-edit-actions">
            <button type="button" class="btn-cancel" data-action="cancel-candidate-edit" data-day="${di}">취소</button>
            <button type="button" class="btn-primary" data-action="save-candidate-edit" data-day="${di}" data-id="${c.id}">저장</button>
          </div>
        </li>`;
      }
      const vs = votesForCandidate(c.id);
      const votedByMe = vs.some((v) => v.voter_id === VOTER_ID);
      const mapHref = c.map_url && c.map_url.trim() ? esc(normalizeUrl(c.map_url)) : `https://map.naver.com/p/search/${encodeURIComponent(c.name)}`;
      return `<li class="poll-item${votedByMe ? " voted" : ""}" data-kind="candidate" data-day="${di}" data-id="${c.id}">
        <span class="poll-name">${esc(c.name)}</span>
        <a class="maplink-icon small" target="_blank" rel="noopener" href="${mapHref}" aria-label="네이버지도">${mapIcon}</a>
        <button type="button" class="poll-vote-btn" data-action="toggle-vote" data-id="${c.id}">${heartIcon}<span>${vs.length}</span></button>
        <button type="button" class="icon-btn" data-action="edit-candidate" data-day="${di}" data-id="${c.id}" aria-label="수정">${pencilIcon}</button>
      </li>`;
    }).join("");
    const draftVal = voteDrafts[item.id] || "";
    return `<div class="vote-card" data-kind="item" data-day="${di}" data-id="${item.id}">
      <div class="item-main">
        <div class="time-block">${timeHtml}</div>
        <span class="badge" style="background:${cat.bg}">${cat.icon(cat.fg, cat.bg)}</span>
        <div class="title-block">
          ${item.name ? `<p class="name">${esc(item.name)}</p>` : ""}
          <span class="vote-label">${voteIcon("var(--accent-ink)", "var(--accent-soft)")}후보 투표중</span>
        </div>
        <button class="icon-btn" data-action="edit-item" data-day="${di}" data-id="${item.id}" aria-label="수정">${pencilIcon}</button>
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

      const showAddForm = fs.open && !fs.editId;
      const pieces = [];
      dayItems.forEach((item, idx) => {
        if (showAddForm && fs.insertAt === idx) {
          pieces.push('<div class="reveal">' + stopFormHtml(di, fs) + '</div>');
        }

        if (fs.editId === item.id && (item.kind === "stop" || item.kind === "vote")) {
          pieces.push('<div class="reveal">' + stopFormHtml(di, fs) + '</div>');
        } else if (item.kind === "vote") {
          pieces.push(voteCardHtml(di, item, candidateEditState[di]));
        } else if (item.kind === "transit") {
          // Rows from an earlier version of the app. Nothing creates these any
          // more (travel is now the automatic distance connector below), but
          // old rows are still shown read-only so existing data doesn't break.
          pieces.push(`<div class="transit-card" data-kind="item" data-day="${di}" data-id="${item.id}">
            <div class="item-main">
              <span class="badge transit-badge">${carIcon}</span>
              <div class="title-block"><p class="transit-text">${item.duration ? item.duration + "분 이동" : "이동"}</p></div>
            </div>
          </div>`);
        } else {
          const cat = CATEGORIES[item.category] || CATEGORIES.etc;
          const timeHtml = item.time ? `<span class="hm">${item.time}</span>` : `<span class="dash">·</span>`;
          const mapHref = item.map_url && item.map_url.trim() ? esc(normalizeUrl(item.map_url)) : `https://map.naver.com/p/search/${encodeURIComponent(item.name)}`;
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
          const next = dayItems[idx + 1];
          if (item.kind === "stop" && next && next.kind === "stop" && item.distance_m) {
            const routeHref = naverRouteUrl(item.name, next.name);
            pieces.push(`<div class="transit-connector">
              <a class="distance-chip" target="_blank" rel="noopener" href="${routeHref}">${carIcon}<span>${item.distance_m}m</span></a>
              <button type="button" class="insert-plus" data-action="open-stop" data-day="${di}" data-at="${idx + 1}" aria-label="여기에 추가">＋</button>
            </div>`);
          } else {
            pieces.push(`<div class="insert-row-plain">
              <button type="button" class="insert-plus" data-action="open-stop" data-day="${di}" data-at="${idx + 1}" aria-label="여기에 추가">＋</button>
            </div>`);
          }
        }
      });

      if (showAddForm && fs.insertAt === n) {
        pieces.push('<div class="reveal">' + stopFormHtml(di, fs) + '</div>');
      }

      const emptyHtml = (n === 0 && !showAddForm) ? `<div class="empty-card"><p>아직 일정이 없어요</p><span>+ 버튼으로 장소를 추가해보세요</span></div>` : "";
      const actionsHtml = (!fs.open) ? `<div class="add-plus-row">
        <button type="button" class="insert-plus large" data-action="open-stop" data-day="${di}" data-at="${n}" aria-label="장소 추가">＋</button>
      </div>` : "";

      return `<section class="day" id="day-${di + 1}">
        <div class="day-head">
          <div class="top-row"><span class="n">day ${di + 1}</span><span class="d">${day.date_label} / ${day.weekday}</span></div>
          ${day.theme ? `<p class="theme">${esc(day.theme)}</p>` : ""}
        </div>
        <div class="day-body">
          ${pieces.join("")}
          ${emptyHtml}${actionsHtml}
        </div>
      </section>`;
    }).join("");

    const openReveals = () => daysEl.querySelectorAll(".reveal").forEach((el) => el.classList.add("open"));
    requestAnimationFrame(() => requestAnimationFrame(openReveals));
    setTimeout(openReveals, 80); // safety net if rAF is throttled (e.g. a backgrounded tab)
  }

  // Collapse the open form in a day with the same easing it opened with, then
  // apply the state change and re-render. Without this the form would vanish
  // instantly on cancel/submit while opening was animated.
  // Swap just the open form's markup instead of re-rendering every day. A full
  // render() would rebuild the whole list, replay the open animation and drop
  // the caret — which reads as the form "reloading" on every chip click.
  function refreshForm(di, focusRole) {
    const form = daysEl.querySelector(`.add-form[data-day="${di}"]`);
    if (!form) { render(); return; }

    const active = document.activeElement;
    const keepRole = focusRole || (active && active.dataset ? active.dataset.role : null);
    let caret = null;
    if (!focusRole && active && typeof active.selectionStart === "number") caret = active.selectionStart;

    const holder = document.createElement("div");
    holder.innerHTML = stopFormHtml(di, formState[di]);
    const fresh = holder.firstElementChild;
    form.replaceWith(fresh);

    if (keepRole) {
      const el = fresh.querySelector(`[data-role="${keepRole}"]`);
      if (el) {
        el.focus();
        if (caret != null && el.setSelectionRange) {
          try { el.setSelectionRange(caret, caret); } catch (err) { /* type doesn't support it */ }
        }
      }
    }
  }

  const REVEAL_MS = 320;
  function collapseThenRender(di, mutate) {
    const reveal = daysEl.querySelector(`#day-${di + 1} .reveal`);
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reveal || reduced) { mutate(); render(); return; }
    reveal.classList.remove("open");
    setTimeout(() => { mutate(); render(); }, REVEAL_MS);
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
      jumpToToday();
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
  async function updateCandidate(id, fields) {
    const { error } = await supabase.from("candidates").update(fields).eq("id", id);
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
    if (e.target.closest(".icon-btn, .maplink-icon, .poll-vote-btn, .distance-chip, .insert-plus, input, button, a")) return;
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
      formState[di] = { open: "stop", category: "food", editId: null, insertAt: at, draft: freshDraft() }; render();
    }
    else if (action === "cancel-form") { collapseThenRender(di, () => { fs.open = null; fs.editId = null; }); }
    else if (action === "pick-cat") { captureDraft(di); fs.category = btn.dataset.cat; refreshForm(di); }
    else if (action === "toggle-vote-mode") { captureDraft(di); fs.draft.voteMode = !fs.draft.voteMode; refreshForm(di); }
    else if (action === "add-draft-candidate") {
      const form = btn.closest(".add-form");
      const input = form.querySelector('[data-role="f-candidate"]');
      const val = input.value.trim();
      if (!val) { input.focus(); return; }
      captureDraft(di);
      fs.draft.candidateNames = fs.draft.candidateNames || [];
      fs.draft.candidateNames.push(val);
      refreshForm(di, "f-candidate");
    }
    else if (action === "remove-draft-candidate") {
      captureDraft(di);
      fs.draft.candidateNames.splice(Number(btn.dataset.idx), 1);
      refreshForm(di);
    }
    else if (action === "edit-item") {
      const item = items.find((it) => it.id === btn.dataset.id);
      if (!item) return;
      if (item.kind === "stop") {
        formState[di] = {
          open: "stop", category: item.category, editId: item.id, insertAt: null,
          draft: {
            time: item.time || "", name: item.name || "", meta: item.meta || "", mapUrl: item.map_url || "",
            distance: item.distance_m != null ? String(item.distance_m) : "", voteMode: false, candidateNames: []
          }
        };
      } else if (item.kind === "vote") {
        formState[di] = {
          open: "stop", category: item.category, editId: item.id, insertAt: null,
          draft: { time: item.time || "", name: item.name || "", meta: "", mapUrl: "", distance: "", voteMode: true, candidateNames: [] }
        };
      } else {
        return; // legacy transit cards aren't edited inline
      }
      render();
    }
    else if (action === "submit-stop") {
      const form = btn.closest(".add-form");
      const timeRaw = form.querySelector('[data-role="f-time"]').value;
      const time = /^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(timeRaw) ? timeRaw : "";

      if (fs.draft.voteMode) {
        const titleEl = form.querySelector('[data-role="f-name"]');
        const title = titleEl ? titleEl.value.trim() : "";
        const names = fs.draft.candidateNames || [];
        if (fs.editId) {
          const voteItemId = fs.editId;
          (async () => {
            await updateItem(voteItemId, { time, category: fs.category, name: title });
            for (const nm of names) await supabase.from("candidates").insert({ item_id: voteItemId, name: nm });
          })();
        } else {
          (async () => {
            const { data, error } = await supabase.from("items").insert({ day_index: di, kind: "vote", sort_order: computeSortOrder(di, fs.insertAt), time, category: fs.category, name: title }).select().single();
            if (error) { console.error(error); return; }
            for (const nm of names) await supabase.from("candidates").insert({ item_id: data.id, name: nm });
          })();
        }
        collapseThenRender(di, () => { fs.open = null; fs.editId = null; });
        return;
      }

      const name = form.querySelector('[data-role="f-name"]').value.trim();
      if (!name) { form.querySelector('[data-role="f-name"]').focus(); return; }
      const meta = form.querySelector('[data-role="f-meta"]').value.trim();
      const mapUrl = normalizeUrl(form.querySelector('[data-role="f-maplink"]').value);
      const distRaw = form.querySelector('[data-role="f-distance"]').value.trim();
      const distance_m = distRaw ? Number(distRaw) : null;
      if (fs.editId) {
        updateItem(fs.editId, { time, category: fs.category, name, meta, map_url: mapUrl, distance_m });
      } else {
        addItem(di, "stop", { time, category: fs.category, name, meta, map_url: mapUrl, distance_m }, fs.insertAt);
      }
      collapseThenRender(di, () => { fs.open = null; fs.editId = null; });
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
    else if (action === "edit-candidate") {
      const c = candidates.find((x) => x.id === btn.dataset.id);
      if (!c) return;
      candidateEditState[di] = { id: c.id, name: c.name || "", mapUrl: c.map_url || "" };
      render();
    }
    else if (action === "cancel-candidate-edit") { candidateEditState[di] = null; render(); }
    else if (action === "save-candidate-edit") {
      const li = btn.closest(".poll-item-edit");
      const nameEl = li.querySelector('[data-role="f-cand-name"]');
      const name = nameEl.value.trim();
      if (!name) { nameEl.focus(); return; }
      const mapUrl = normalizeUrl(li.querySelector('[data-role="f-cand-link"]').value);
      updateCandidate(btn.dataset.id, { name, map_url: mapUrl });
      candidateEditState[di] = null;
      render();
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
