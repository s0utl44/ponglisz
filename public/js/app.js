/* Ponglisz – adaptacyjna nauka angielskiego dla Jany i Dominika.
   Wszystko działa w przeglądarce; postępy są w localStorage (osobno dla każdej osoby). */
(function () {
  'use strict';

  // ---------- konfiguracja ----------
  const PROFILES = {
    jana: {
      name: 'Jana', emoji: '🌋', tagline: 'Geologia · ekologia · nauki ścisłe',
      decks: ['geology', 'ecology', 'science', 'kitchen', 'interior', 'utilities', 'homeq', 'general', 'phrases', 'wroclaw', 'snow', 'cooking']
    },
    dominik: {
      name: 'Dominik', emoji: '🏠', tagline: 'Nieruchomości · sprzedaż · prawo i finanse',
      decks: ['realestate', 'sales', 'legal', 'kitchen', 'interior', 'utilities', 'homeq', 'general', 'phrases', 'wroclaw', 'snow', 'cooking']
    }
  };
  // Długości lekcji
  const SIZES = {
    quick: { label: '⚡ Szybka lekcja', time: '~3 min', maxNew: 3, maxDue: 4, gram: 1 },
    normal: { label: '📘 Lekcja', time: '~10 min', maxNew: null, maxDue: 24, gram: 4 },
    long: { label: '🎓 Długa lekcja', time: '~20 min', maxNew: 'plus', maxDue: 40, gram: 8, intro: true },
    // przygotowanie do odcinka Suits: kolejne 25 słów z odcinka + powtórki z tego odcinka
    episode: { label: '🎬 Przygotowanie do odcinka', time: '~15 min', maxNew: 25, maxDue: 12, gram: 0 }
  };
  const SUITS_PER_SESSION = 25;
  const LEVELS = { 1: 'A2', 2: 'B1', 3: 'B1+', 4: 'B2' };
  const LEVEL_DESC = {
    1: 'Podstawy – odświeżamy fundamenty',
    2: 'Średni niższy – swobodne codzienne rozmowy',
    3: 'Średni – praca, raporty, negocjacje',
    4: 'Średnio zaawansowany+ – język specjalistyczny i formalny'
  };
  // Poziomy jako minerały (Jana) i etapy budowy (Dominik)
  const MINERALS = {
    1: { key: 'quartz', pl: 'Kwarc', en: 'Quartz', sub: 'Krzemionka · SiO₂' },
    2: { key: 'fluorite', pl: 'Fluoryt', en: 'Fluorite', sub: 'Halogenek · CaF₂' },
    3: { key: 'amethyst', pl: 'Ametyst', en: 'Amethyst', sub: 'Odmiana kwarcu · SiO₂' },
    4: { key: 'ruby', pl: 'Rubin', en: 'Ruby', sub: 'Odmiana korundu · Al₂O₃' }
  };
  const STAGES = {
    1: { pl: 'Fundamenty', en: 'Foundations' },
    2: { pl: 'Stan surowy', en: 'Shell & core' },
    3: { pl: 'Stan deweloperski', en: 'Fit-out' },
    4: { pl: 'Pod klucz', en: 'Turnkey' }
  };
  const BOX_DAYS = [0, 1, 2, 4, 7, 14, 30, 60]; // odstępy powtórek (dni) dla kolejnych „pudełek”
  const MASTER_BOX = 4;
  const DAY = 864e5;
  const PACE_MIN = 4, PACE_MAX = 20;

  // ---------- pomocnicze ----------
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const h = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const chunk = (a, n) => { const out = []; for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n)); return out; };
  const pct = x => Math.round(x * 100) + '%';
  const today = (d) => (d || new Date()).toLocaleDateString('sv');
  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function lev(a, b) {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  const norm = s => String(s).toLowerCase().replace(/[’‘`]/g, "'").replace(/[.,!?;:"()]/g, '').replace(/\s+/g, ' ').trim();
  const stripTo = s => s.replace(/^to /, '');

  // ---------- mowa ----------
  let voice = null;
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices();
    voice = vs.find(v => /en[-_]GB/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
  }
  if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text) {
    if (!('speechSynthesis' in window) || !text) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = voice ? voice.lang : 'en-GB';
      if (voice) u.voice = voice;
      u.rate = 0.92;
      speechSynthesis.speak(u);
    } catch (e) { /* brak syntezy mowy */ }
  }
  const sayBtn = (t, cls) => `<button class="speak ${cls || ''}" data-say="${h(t)}" title="Posłuchaj wymowy" aria-label="Posłuchaj">🔊</button>`;

  // ---------- stan ----------
  let cur = null;   // id profilu
  let S = null;     // stan profilu
  let SESSION = null;
  let KEYH = null;  // bieżąca obsługa klawiatury

  const KEY = id => 'ponglisz:v1:' + id;
  function defaultState() {
    return { level: 1, pace: 8, placed: false, cards: {}, grammar: {}, reading: {}, recent: [], days: {}, xp: 0, sessions: 0, log: [] };
  }
  function load(id) {
    try {
      const raw = localStorage.getItem(KEY(id));
      if (raw) return Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) { /* uszkodzone dane – zaczynamy od nowa */ }
    return defaultState();
  }
  function save() {
    S.updatedAt = Date.now();
    try { localStorage.setItem(KEY(cur), JSON.stringify(S)); } catch (e) { /* brak miejsca / tryb prywatny */ }
    setDirty(cur, true);
    schedulePush();
  }

  // ---------- synchronizacja z chmurą (Cloudflare D1) ----------
  const SYNC = { on: false, me: null, rev: {}, force: {}, timer: null, busy: false, again: false, last: null, error: false };
  // Flaga „są niewysłane zmiany” przetrwa zamknięcie karty – wyślemy je przy następnym otwarciu.
  const isDirty = pid => { try { return localStorage.getItem('ponglisz:dirty:' + pid) === '1'; } catch (e) { return false; } };
  const setDirty = (pid, v) => { try { if (v) localStorage.setItem('ponglisz:dirty:' + pid, '1'); else localStorage.removeItem('ponglisz:dirty:' + pid); } catch (e) { /* ignorujemy */ } };

  // Łączy postępy z dwóch urządzeń: niczego nie gubi, a ustawienia bierze z nowszej wersji.
  function mergeState(a, b) {
    if (!b) return a;
    if (!a) return Object.assign(defaultState(), b);
    const newer = (a.updatedAt || 0) >= (b.updatedAt || 0) ? a : b;
    const m = Object.assign(defaultState(), newer);
    m.cards = {};
    new Set(Object.keys(a.cards || {}).concat(Object.keys(b.cards || {}))).forEach(id => {
      const x = (a.cards || {})[id], y = (b.cards || {})[id];
      m.cards[id] = !x ? y : !y ? x : ((x.l || 0) > (y.l || 0) || ((x.l || 0) === (y.l || 0) && x.s >= y.s)) ? x : y;
    });
    m.days = {};
    new Set(Object.keys(a.days || {}).concat(Object.keys(b.days || {}))).forEach(k => {
      const x = (a.days || {})[k], y = (b.days || {})[k];
      m.days[k] = !x ? y : !y ? x : (x.t >= y.t ? x : y);
    });
    m.grammar = {};
    new Set(Object.keys(a.grammar || {}).concat(Object.keys(b.grammar || {}))).forEach(id => {
      const x = (a.grammar || {})[id] || {}, y = (b.grammar || {})[id] || {};
      m.grammar[id] = { a: Math.max(x.a || 0, y.a || 0), c: Math.max(x.c || 0, y.c || 0), best: Math.max(x.best || 0, y.best || 0), last: (newer === a ? x : y).last };
    });
    m.reading = {};
    new Set(Object.keys(a.reading || {}).concat(Object.keys(b.reading || {}))).forEach(id => {
      const x = (a.reading || {})[id] || {}, y = (b.reading || {})[id] || {};
      m.reading[id] = { best: Math.max(x.best || 0, y.best || 0), last: (newer === a ? x : y).last };
    });
    m.xp = Math.max(a.xp || 0, b.xp || 0);
    m.sessions = Math.max(a.sessions || 0, b.sessions || 0);
    m.placed = !!(a.placed || b.placed);
    const seen = new Set();
    m.log = (a.log || []).concat(b.log || []).filter(x => { const k = JSON.stringify(x); if (seen.has(k)) return false; seen.add(k); return true; })
      .sort((x, y) => (x.d < y.d ? -1 : x.d > y.d ? 1 : 0));
    m.updatedAt = Math.max(a.updatedAt || 0, b.updatedAt || 0);
    return m;
  }

  function setSyncStatus() {
    const el = $('#syncstat');
    if (!el) return;
    if (!SYNC.on) { el.textContent = 'Postępy zapisują się w tej przeglądarce · kopię zrobisz w Ustawieniach'; return; }
    el.textContent = SYNC.error
      ? '⚠️ Brak połączenia – postępy zapisane na tym urządzeniu, wyślę je później'
      : SYNC.last ? `☁️ Postępy zsynchronizowane (${SYNC.last.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })})` : '☁️ Synchronizacja…';
  }

  function schedulePush() {
    if (!SYNC.on) return;
    clearTimeout(SYNC.timer);
    SYNC.timer = setTimeout(() => syncNow(cur), 8000);
  }

  // Pobiera stan z chmury, łączy z lokalnym i – jeśli są lokalne zmiany – odsyła wynik.
  async function syncNow(pid) {
    if (!SYNC.on || !pid) return false;
    if (SYNC.busy) { SYNC.again = pid; return false; }
    SYNC.busy = true;
    clearTimeout(SYNC.timer);
    let changed = false;
    try {
      for (let attempt = 0; attempt < 4; attempt++) {
        const r = await fetch('/api/progress?p=' + pid, { cache: 'no-store' });
        if (!r.ok) throw new Error('get ' + r.status);
        const remote = await r.json();
        const local = pid === cur ? S : load(pid);
        // po imporcie / wyzerowaniu lokalny stan ma zastąpić ten w chmurze, a nie się z nim łączyć
        const merged = SYNC.force[pid] ? local : mergeState(local, remote.state);
        const before = JSON.stringify(local);
        if (JSON.stringify(merged) !== before) changed = true;
        if (pid === cur) S = merged;
        try { localStorage.setItem(KEY(pid), JSON.stringify(merged)); } catch (e) { /* ignorujemy */ }
        SYNC.rev[pid] = remote.rev;
        if (remote.state && !isDirty(pid)) break;
        const pushedAt = merged.updatedAt || 0;
        const p = await fetch('/api/progress?p=' + pid, {
          method: 'PUT', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ baseRev: remote.rev, state: merged })
        });
        if (p.status === 409) continue;
        if (!p.ok) throw new Error('put ' + p.status);
        SYNC.rev[pid] = (await p.json()).rev;
        // jeśli w trakcie wysyłania doszły nowe odpowiedzi, zostawiamy flagę – pójdą w następnej turze
        const nowLocal = pid === cur ? S : load(pid);
        SYNC.force[pid] = false;
        if ((nowLocal.updatedAt || 0) <= pushedAt) setDirty(pid, false); else schedulePush();
        break;
      }
      SYNC.last = new Date(); SYNC.error = false;
    } catch (e) {
      SYNC.error = true;
    } finally {
      SYNC.busy = false;
      setSyncStatus();
      if (SYNC.again) { const p = SYNC.again; SYNC.again = false; syncNow(p); }
    }
    return changed;
  }

  // Szybkie wysłanie przy zamykaniu karty / przełączaniu aplikacji na telefonie.
  function flushOnHide() {
    if (!SYNC.on || !cur || !isDirty(cur) || SYNC.rev[cur] == null) return;
    try {
      fetch('/api/progress?p=' + cur, {
        method: 'PUT', keepalive: true, headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ baseRev: SYNC.rev[cur], state: S })
      }).then(r => { if (r.ok) return r.json().then(j => { SYNC.rev[cur] = j.rev; setDirty(cur, false); }); }).catch(() => {});
    } catch (e) { /* ignorujemy */ }
  }

  async function syncInit() {
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') return null;
    try {
      const r = await fetch('/api/me', { cache: 'no-store' });
      if (!r.ok) return null;
      SYNC.me = await r.json();
      SYNC.on = !!SYNC.me.sync;
      const who = $('#who');
      if (SYNC.me.email && who) {
        who.innerHTML = ` · zalogowano jako <b>${h(SYNC.me.email)}</b> · <a href="/cdn-cgi/access/logout">Wyloguj</a>`;
        who.hidden = false;
      }
      setSyncStatus();
      return SYNC.me;
    } catch (e) { return null; }
  }

  // ---------- dane ----------
  function deckItems(deckId) {
    const d = DECKS[deckId];
    if (!d._items) {
      d._items = d.items.map(([en, pl, lvl, ex, tag, ctx]) => ({ id: deckId + ':' + en, en, pl, lvl, ex, tag, ctx, deck: deckId, phrase: d.kind === 'phrase' }));
    }
    return d._items;
  }
  const profileDecks = () => PROFILES[cur].decks;
  const profileItems = () => profileDecks().flatMap(deckItems);
  // ---------- Suits ----------
  const SUITS_LIST = window.SUITS || [];
  const suitsDeck = ep => 'suits-s1e' + String(ep).padStart(2, '0');
  const epState = ep => (S.suits && S.suits[ep]) || {};
  const setEp = (ep, patch) => { S.suits = S.suits || {}; S.suits[ep] = Object.assign({}, S.suits[ep], patch); };
  // odcinki „aktywne”: przygotowane albo obejrzane – ich słowa mieszają się z codziennym treningiem
  const activeEps = () => SUITS_LIST.map(e => e.ep).filter(ep => epState(ep).prep || epState(ep).watched);
  const suitsItems = onlyActive => (onlyActive ? activeEps() : SUITS_LIST.map(e => e.ep)).flatMap(ep => DECKS[suitsDeck(ep)] ? deckItems(suitsDeck(ep)) : []);
  const readingsFor = () => (READINGS[cur] || []).concat(READINGS.shared || []).sort((a, b) => a.lvl - b.lvl);
  const GRAMMAR_BY_ID = {};
  GRAMMAR.forEach(t => { GRAMMAR_BY_ID[t.id] = t; });

  const cardOf = item => S.cards[item.id];
  const boxOf = item => (S.cards[item.id] || { b: -1 }).b;

  function gapOf(item) {
    if (!item.ex || item.phrase) return null;
    const core = stripTo(item.en);
    const m = item.ex.match(new RegExp('\\b' + escRe(core) + '\\b', 'i'));
    if (!m) return null;
    return { before: item.ex.slice(0, m.index), after: item.ex.slice(m.index + m[0].length), word: m[0] };
  }

  // ---------- statystyki ----------
  function logAnswer(ok) {
    S.recent.push(ok ? 1 : 0);
    if (S.recent.length > 60) S.recent.shift();
    const k = today();
    const d = S.days[k] || (S.days[k] = { c: 0, t: 0 });
    d.t++;
    if (ok) { d.c++; S.xp += 10; }
  }
  function recentAcc(n) {
    const r = S.recent.slice(-(n || 40));
    return r.length ? r.reduce((a, b) => a + b, 0) / r.length : 0;
  }
  function streak() {
    let n = 0;
    const d = new Date();
    if (!S.days[today(d)]) d.setDate(d.getDate() - 1);
    while (S.days[today(d)] && S.days[today(d)].t > 0) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function gMastery(id) {
    const g = S.grammar[id];
    if (!g) return 0;
    const rolling = g.a >= 8 ? g.c / g.a : 0;
    return Math.max(g.best || 0, rolling);
  }
  function levelProgress(lvl) {
    lvl = lvl || S.level;
    const items = profileItems().filter(i => i.lvl === lvl);
    const w = items.length ? items.filter(i => boxOf(i) >= 2).length / items.length : 1;
    const topics = GRAMMAR.filter(t => t.lvl === lvl);
    const g = topics.length ? topics.reduce((a, t) => a + Math.min(1, gMastery(t.id) / 0.8), 0) / topics.length : 1;
    return 0.7 * w + 0.3 * g;
  }
  function deckStats(deckId) {
    const items = deckItems(deckId);
    let seen = 0, mastered = 0;
    items.forEach(i => { const b = boxOf(i); if (b >= 0) seen++; if (b >= MASTER_BOX) mastered++; });
    return { total: items.length, seen, mastered };
  }
  function dueCount(deck) {
    const now = Date.now();
    return profileItems().filter(i => (!deck || i.deck === deck) && S.cards[i.id] && S.cards[i.id].d <= now).length;
  }

  // ---------- planowanie powtórek ----------
  function gradeCard(item, ok, fast, known) {
    const c = S.cards[item.id] || (S.cards[item.id] = { b: 0, d: 0, s: 0, c: 0, w: 0 });
    c.s++; c.l = Date.now();
    if (ok) {
      c.c++;
      let nb = c.b + 1 + (fast && c.b >= 1 ? 1 : 0);
      if (known) nb = Math.max(nb, 3);
      c.b = Math.min(BOX_DAYS.length - 1, nb);
    } else {
      c.w++;
      c.b = Math.max(0, c.b - 2);
    }
    c.d = Date.now() + (c.b === 0 ? 10 * 60e3 : BOX_DAYS[c.b] * DAY - 4 * 3600e3);
  }

  // Wybór słówek z różnych talii – talie dziedzinowe mają większą wagę.
  function pickBalanced(pool, n) {
    if (n <= 0 || !pool.length) return [];
    const byDeck = {};
    shuffle(pool).sort((a, b) => a.lvl - b.lvl).forEach(i => { (byDeck[i.deck] = byDeck[i.deck] || []).push(i); });
    const taken = {};
    const out = [];
    while (out.length < n) {
      let best = null, bestScore = -1;
      Object.keys(byDeck).forEach(d => {
        if (!byDeck[d].length) return;
        const score = (DECKS[d].weight || 1) / ((taken[d] || 0) + 1);
        if (score > bestScore) { bestScore = score; best = d; }
      });
      if (!best) break;
      out.push(byDeck[best].shift());
      taken[best] = (taken[best] || 0) + 1;
    }
    return out;
  }

  function pickGrammarTasks(n) {
    const unlocked = GRAMMAR.filter(t => t.lvl <= S.level);
    if (!unlocked.length) return [];
    const weakest = unlocked.map(t => ({ t, m: gMastery(t.id) + Math.random() * 0.15 })).sort((a, b) => a.m - b.m).slice(0, 2).map(x => x.t);
    const out = [];
    const used = new Set();
    let k = 0, guard = 0;
    while (out.length < n && guard++ < 50) {
      const t = weakest[k++ % weakest.length];
      const ex = shuffle(t.ex).find(e => !used.has(e));
      if (!ex) continue;
      used.add(ex);
      out.push({ t: 'gram', topic: t.id, ex });
    }
    return out;
  }

  function suitsQuizTask() {
    const pool = activeEps().flatMap(ep => (SUITS_LIST.find(e => e.ep === ep) || { quiz: [] }).quiz.map(q => ({ ep, q })));
    if (!pool.length) return null;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return { t: 'squiz', ep: pick.ep, ex: pick.q };
  }

  function buildSession(deck, size) {
    const sz = SIZES[size] || SIZES.normal;
    const now = Date.now();
    const items = deck ? deckItems(deck) : profileItems();
    // powtórki w zwykłym treningu obejmują też słowa z Suits; nowe słowa z Suits – tylko z przerobionych/obejrzanych odcinków
    const reviewPool = deck ? items : items.concat(suitsItems(false));
    const due = shuffle(reviewPool.filter(i => S.cards[i.id] && S.cards[i.id].d <= now))
      .sort((a, b) => S.cards[a.id].b - S.cards[b.id].b).slice(0, sz.maxDue);
    const unseen = (deck ? items : items.concat(suitsItems(true))).filter(i => !S.cards[i.id]);

    let fresh, challenge = [];
    if (size === 'episode') {
      fresh = unseen.slice(0, SUITS_PER_SESSION); // w kolejności z pakietu (tak jak w odcinku)
    } else {
      let nNew = S.pace;
      if (due.length > 16) nNew = Math.max(3, Math.round(nNew / 2)); // dużo powtórek – mniej nowości
      if (sz.maxNew === 'plus') nNew = Math.min(PACE_MAX + 4, S.pace * 2);
      else if (sz.maxNew) nNew = Math.min(nNew, sz.maxNew);
      // Słowa o 2+ poziomy niższe niż obecny traktujemy jako znane – nie przeklikujemy ich,
      // pojawiają się tylko w zdaniach. Wyjątek: trening wybranej talii.
      const tooEasy = i => !deck && !DECKS[i.deck].detail && i.lvl <= S.level - 2;
      const curLvl = unseen.filter(i => i.lvl === S.level);
      const lower = unseen.filter(i => i.lvl < S.level && !tooEasy(i));
      const nLow = Math.min(lower.length, Math.round(nNew * 0.25));
      fresh = pickBalanced(lower, nLow).concat(pickBalanced(curLvl, nNew - nLow));
      if (fresh.length < nNew) {
        fresh = fresh.concat(pickBalanced(unseen.filter(i => i.lvl <= S.level && !tooEasy(i) && !fresh.includes(i)), nNew - fresh.length));
      }
      // Wyzwanie: gdy idzie bardzo dobrze, dorzucamy słowa z wyższego poziomu.
      if (size !== 'quick' && S.level < 4 && S.recent.length >= 20 && recentAcc() >= 0.85) {
        challenge = pickBalanced(unseen.filter(i => i.lvl === S.level + 1), 2);
      }
      if (!fresh.length && !due.length) fresh = pickBalanced(unseen.filter(i => !tooEasy(i)), nNew);
      fresh = fresh.concat(challenge);
    }

    const tasks = [];
    const rev = due.slice();
    let gram = deck ? [] : pickGrammarTasks(sz.gram);
    // długa lekcja: krótkie przypomnienie zasad przed zadaniami z gramatyki
    if (sz.intro && gram.length) gram = [{ t: 'gramIntro', topic: gram[0].topic }].concat(gram);
    chunk(fresh, 3).forEach(g => {
      g.forEach(i => tasks.push({ t: 'learn', item: i, challenge: challenge.includes(i) }));
      rev.splice(0, 2).forEach(i => tasks.push({ t: 'quiz', item: i }));
      shuffle(g).forEach(i => tasks.push({ t: 'quiz', item: i, first: true }));
      if (gram.length) tasks.push(gram.shift());
    });
    rev.forEach((i, k) => {
      tasks.push({ t: 'quiz', item: i });
      if (k % 4 === 3 && gram.length) tasks.push(gram.shift());
    });
    gram.forEach(g => tasks.push(g));
    // pytanie z quizu do obejrzanego / przygotowanego odcinka Suits
    const sq = !deck && size !== 'quick' ? suitsQuizTask() : null;
    if (sq) tasks.splice(Math.floor(tasks.length / 2), 0, sq);

    return { pid: cur, tasks, idx: 0, ok: 0, n: 0, wrong: [], requeued: new Set(), deck, size: size || 'normal', newCount: fresh.length, revCount: due.length, xp0: S.xp };
  }

  // ---------- adaptacja ----------
  function adapt(acc, n) {
    const msgs = [];
    if (n >= 8) {
      if (acc >= 0.9 && S.pace < PACE_MAX) {
        S.pace = Math.min(PACE_MAX, S.pace + 2);
        msgs.push({ k: 'up', t: `Świetny wynik! Przyspieszam – teraz <b>${S.pace}</b> nowych słów na sesję.` });
      } else if (acc < 0.6 && S.pace > PACE_MIN) {
        S.pace = Math.max(PACE_MIN, S.pace - 2);
        msgs.push({ k: 'down', t: `Zwalniam trochę (<b>${S.pace}</b> nowych słów na sesję), żeby lepiej utrwalić materiał.` });
      }
    }
    const ra = recentAcc(40), lp = levelProgress();
    if (S.level < 4 && S.recent.length >= 30 && ra >= 0.85 && lp >= 0.5) {
      S.level++;
      S.recent = S.recent.slice(-10);
      S.log.push({ d: today(), lvl: S.level });
      msgs.push({ k: 'level', t: `🎉 <b>Awans na poziom ${LEVELS[S.level]}!</b> Od teraz pojawią się trudniejsze słowa, ćwiczenia gramatyczne i teksty.` });
    } else if (S.level > 1 && S.recent.length >= 30 && ra < 0.5) {
      S.level--;
      S.recent = S.recent.slice(-10);
      S.log.push({ d: today(), lvl: S.level });
      msgs.push({ k: 'down', t: `Wracamy na chwilę do poziomu <b>${LEVELS[S.level]}</b>, żeby wzmocnić podstawy. To normalne – zaraz pójdzie w górę.` });
    }
    return msgs;
  }

  // ---------- motyw (ciemny / jasny) ----------
  function getTheme() { try { return localStorage.getItem('ponglisz:theme') || 'dark'; } catch (e) { return 'dark'; } }
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('ponglisz:theme', t); } catch (e) { /* ignorujemy */ }
    $$('.theme-toggle button').forEach(b => b.classList.toggle('on', b.dataset.theme === t));
  }
  const themeToggle = () => `<div class="theme-toggle" role="group" aria-label="Motyw">
      <button type="button" data-theme="dark" class="${getTheme() === 'dark' ? 'on' : ''}" aria-label="Ciemny motyw" title="Ciemny">☾</button>
      <button type="button" data-theme="light" class="${getTheme() === 'light' ? 'on' : ''}" aria-label="Jasny motyw" title="Jasny">☀</button>
    </div>`;

  // ---------- animacje (głównie kurs Jany) ----------
  const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Liczby „odliczają się” od zera do wartości docelowej.
  function countUp(root) {
    $$('[data-count]', root).forEach(el => {
      const to = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '';
      if (reduceMotion() || !isFinite(to) || to === 0) { el.textContent = (isFinite(to) ? to : el.textContent) + suffix; return; }
      const t0 = performance.now(), dur = 900 + Math.min(700, to * 4);
      const step = now => {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(to * e) + suffix;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  // Reakcja na odpowiedź: odłamki kryształu przy dobrej, potrząśnięcie kartą przy złej.
  function answerFx(ok, el) {
    if (cur !== 'jana' || reduceMotion()) return;
    if (ok && el) {
      const r = el.getBoundingClientRect();
      ART.burst(r.left + r.width / 2, r.top + r.height / 2, MINERALS[S.level].key, 20);
    } else if (!ok) {
      const t = $('.task');
      if (t) { t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake'); }
    }
  }
  // Pełnoekranowe odsłonięcie nowego minerału po awansie.
  function levelReveal() {
    if (cur !== 'jana') return;
    const m = MINERALS[S.level];
    const ov = document.createElement('div');
    ov.className = 'reveal';
    ov.innerHTML = `${ART.particles(40, 'var(--accent)')}<div class="reveal-in">
      <div class="reveal-crystal">${ART.crystal(m.key, { grow: true })}</div>
      <span class="eyebrow">Awans na poziom ${LEVELS[S.level]}</span>
      <h2>${m.pl}</h2><p>${m.en} · ${m.sub}</p>
      <button class="btn" type="button">Odbieram ✨</button></div>`;
    document.body.appendChild(ov);
    const close = () => { ov.classList.add('out'); setTimeout(() => ov.remove(), 400); };
    $('button', ov).onclick = close;
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    setTimeout(() => { const r = $('.reveal-crystal', ov).getBoundingClientRect(); ART.burst(r.left + r.width / 2, r.top + r.height / 2, m.key, 34); }, 900);
  }

  // ---------- routing ----------
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }

  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    const pid = parts[0];
    const view = parts[1] || 'home';
    const arg = parts[2] ? decodeURIComponent(parts[2]) : undefined;
    KEYH = null;
    if (!PROFILES[pid]) {
      document.body.dataset.profile = '';
      document.body.classList.add('split-mode');
      renderHeader(null);
      return renderChooser();
    }
    document.body.classList.remove('split-mode');
    if (pid !== cur) {
      cur = pid; S = load(pid);
      try { localStorage.setItem('ponglisz:last', pid); } catch (e) { /* ignorujemy */ }
      pullAndRefresh(pid);
    }
    document.body.dataset.profile = pid;
    renderHeader(view);
    (VIEWS[view] || VIEWS.home)(arg);
    window.scrollTo(0, 0);
  }

  // Po pobraniu nowszych postępów z chmury odświeżamy widok – ale nie w trakcie ćwiczeń.
  function pullAndRefresh(pid) {
    if (!SYNC.on) return;
    syncNow(pid).then(changed => {
      const view = location.hash.replace(/^#\/?/, '').split('/')[1] || 'home';
      if (changed && pid === cur && ['home', 'words', 'settings'].includes(view)) route();
    });
  }

  function renderHeader(view) {
    const nav = $('#subnav');
    if (!view) { $('#ptabs').innerHTML = ''; nav.innerHTML = ''; nav.hidden = true; return; }
    const p = PROFILES[cur];
    const badge = cur === 'jana' ? MINERALS[S.level].pl : STAGES[S.level].pl;
    $('#ptabs').innerHTML = `<a class="who-pill" href="#/" title="Zmień kurs">
        <b>${p.name}</b><span>${LEVELS[S.level]} · ${badge}</span><i>⇄</i></a>${themeToggle()}`;
    nav.hidden = false;
    const items = [['home', 'Postępy'], ['train', 'Trening'], ['words', 'Słownictwo'], ['grammar', 'Gramatyka'], ['read', 'Czytanie'], ['suits', 'Suits'], ['settings', 'Ustawienia']];
    nav.innerHTML = items.map(([v, l]) => `<a href="#/${cur}/${v}" class="${v === view ? 'active' : ''}">${l}</a>`).join('');
  }

  // ---------- ekran startowy: podzielony na pół, z suwakiem ----------
  function renderChooser() {
    const j = load('jana'), d = load('dominik');
    const jm = MINERALS[j.level];
    const mastered = st => Object.values(st.cards || {}).filter(c => c.b >= MASTER_BOX).length;
    const streakOf = st => { let n = 0; const dd = new Date(); if (!st.days[today(dd)]) dd.setDate(dd.getDate() - 1); while (st.days[today(dd)] && st.days[today(dd)].t > 0) { n++; dd.setDate(dd.getDate() - 1); } return n; };
    $('#view').innerHTML = `
      <section class="split" id="split" aria-label="Wybór kursu">
        <a class="pane pane-jana" href="#/jana/home" data-p="jana">
          ${ART.particles(26, 'rgba(200,180,255,.9)')}
          <div class="pane-content">
            <div class="pane-mineral" data-mineral="${jm.key}" id="paneMineral">${ART.crystal(jm.key, { grow: true })}</div>
            <span class="eyebrow">Kurs geologiczny</span>
            <h2 class="jana-title">Jana</h2>
            <p class="pane-sub">${jm.en} · ${jm.pl} · poziom ${LEVELS[j.level]}</p>
            <p class="pane-meta">${mastered(j)} słów opanowanych · ${streakOf(j)} dni z rzędu</p>
          </div>
        </a>
        <a class="pane pane-dominik" href="#/dominik/home" data-p="dominik">
          ${ART.scene('DOMINIK', 'pane-scene')}
          <p class="pane-tag">Nieruchomości, sprzedaż, umowy – angielski, w którym zamyka się transakcje.</p>
          <div class="pane-band">
            <div><small>⌂ Poziom</small><b>${LEVELS[d.level]}</b><em>${STAGES[d.level].pl}</em></div>
            <div><small>▦ Słowa</small><b>${mastered(d)}</b><em>opanowane</em></div>
            <div><small>◷ Seria</small><b>${streakOf(d)}</b><em>dni z rzędu</em></div>
          </div>
        </a>
        <div class="split-handle" id="handle" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"
             aria-label="Przesuń w prawo, aby otworzyć kurs Jany, w lewo – kurs Dominika"><span class="knob">‹ ›</span></div>
        <div class="split-hint"><span>przeciągnij</span></div>
        <a class="split-logo" href="#/">PONGLISZ</a>
        <div class="split-theme">${themeToggle()}</div>
      </section>`;
    ART.upgradePhotos($('#split'));
    setupSplit();
    // kryształ delikatnie podąża za kursorem
    const pm = $('#paneMineral');
    if (pm && !reduceMotion()) {
      $('#split').addEventListener('mousemove', e => {
        const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
        pm.style.transform = `translate(${x * -18}px, ${y * -12}px) rotate(${x * 4}deg)`;
      });
    }
  }

  function setupSplit() {
    const el = $('#split'), handle = $('#handle');
    let pos = 50, drag = null;
    const vertical = () => window.innerWidth < window.innerHeight * 0.9;
    const layout = () => el.classList.toggle('vertical', vertical());
    layout();
    const setPos = v => { pos = Math.max(0, Math.min(100, v)); el.style.setProperty('--pos', pos + '%'); handle.setAttribute('aria-valuenow', Math.round(pos)); };
    const open = pid => {
      el.classList.remove('dragging');
      el.classList.add('opening');
      setPos(pid === 'jana' ? 100 : 0);
      setTimeout(() => go('#/' + pid + '/home'), 520);
    };
    el.addEventListener('pointerdown', e => {
      if (e.target.closest('.split-theme, .split-logo')) return;
      drag = { x: e.clientX, y: e.clientY, pos, moved: false };
      el.classList.add('dragging');
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignorujemy */ }
    });
    el.addEventListener('pointermove', e => {
      if (!drag) return;
      const r = el.getBoundingClientRect();
      const delta = vertical() ? (e.clientY - drag.y) / r.height : (e.clientX - drag.x) / r.width;
      if (Math.abs(delta) > 0.012) drag.moved = true;
      setPos(drag.pos + delta * 100);
    });
    const end = e => {
      if (!drag) return;
      const d = drag; drag = null;
      el.classList.remove('dragging');
      if (!d.moved) {
        const r = el.getBoundingClientRect();
        const frac = vertical() ? (e.clientY - r.top) / r.height : (e.clientX - r.left) / r.width;
        if (e.target.closest('.split-handle')) return setPos(50);
        return open(frac * 100 < pos ? 'jana' : 'dominik');
      }
      if (pos > 64) open('jana'); else if (pos < 36) open('dominik'); else setPos(50);
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', () => { drag = null; el.classList.remove('dragging'); setPos(50); });
    // linki w panelach obsługujemy sami (kliknięcie myszą robi to pointerup); klawiatura – Enter na panelu
    $$('.pane', el).forEach(a => a.addEventListener('click', e => { e.preventDefault(); if (e.detail === 0) open(a.dataset.p); }));
    handle.addEventListener('keydown', e => {
      const fwd = vertical() ? ['ArrowDown'] : ['ArrowRight'], back = vertical() ? ['ArrowUp'] : ['ArrowLeft'];
      if (fwd.includes(e.key)) { e.preventDefault(); setPos(pos + 10); }
      if (back.includes(e.key)) { e.preventDefault(); setPos(pos - 10); }
      if (e.key === 'Enter') { if (pos > 55) open('jana'); else if (pos < 45) open('dominik'); }
    });
    window.addEventListener('resize', layout);
  }

  // ---------- widoki ----------
  const VIEWS = {};

  VIEWS.home = function () {
    const p = PROFILES[cur];
    const due = dueCount();
    const lp = levelProgress();
    const ra = recentAcc(40);
    const st = streak();
    const td = S.days[today()] || { c: 0, t: 0 };
    const allDecks = profileDecks().concat(SUITS_LIST.map(e => suitsDeck(e.ep)).filter(d => DECKS[d]));
    const totalMastered = allDecks.reduce((a, d) => a + deckStats(d).mastered, 0);
    const totalSeen = allDecks.reduce((a, d) => a + deckStats(d).seen, 0);
    const newCount = Math.min(S.pace, profileItems().filter(i => !S.cards[i.id]).length);
    const nextTopic = GRAMMAR.filter(t => t.lvl <= S.level).sort((a, b) => gMastery(a.id) - gMastery(b.id) || a.lvl - b.lvl)[0];
    const readings = readingsFor();
    const nextRead = readings.find(r => r.lvl <= S.level && !(S.reading[r.id] && S.reading[r.id].best >= 0.75)) || readings.find(r => r.lvl === Math.min(4, S.level + 1));

    // ostatnie 14 dni
    const days = [];
    for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push({ k: today(d), d }); }
    const maxT = Math.max(10, ...days.map(x => (S.days[x.k] || { t: 0 }).t));
    const bars = days.map(x => {
      const v = S.days[x.k] || { c: 0, t: 0 };
      const hgt = Math.round(v.t / maxT * 100);
      const acc = v.t ? v.c / v.t : 0;
      const label = x.d.toLocaleDateString('pl-PL', { weekday: 'short' }).slice(0, 2);
      return `<div class="bcol" style="--d:${(days.indexOf(x) * 0.04).toFixed(2)}s" title="${x.k}: ${v.t} odpowiedzi, ${v.t ? pct(acc) : '–'} poprawnych">
        <div class="btrack"><div class="bfill" style="height:${hgt}%"><div class="bok" style="height:${Math.round(acc * 100)}%"></div></div></div>
        <span>${label}</span></div>`;
    }).join('');

    const suitsStats = SUITS_LIST.reduce((a, e) => { const st = deckStats(suitsDeck(e.ep)); a.total += st.total; a.seen += st.seen; a.mastered += st.mastered; return a; }, { total: 0, seen: 0, mastered: 0 });
    const suitsRow = SUITS_LIST.length ? `<div class="deckrow">
        <div class="dr-head"><span>⚖️ <b>Suits – sezon 1</b></span><span class="muted small">${suitsStats.mastered} opanowane · ${suitsStats.seen}/${suitsStats.total} poznane</span></div>
        <div class="stack"><span class="m" style="width:${suitsStats.mastered / suitsStats.total * 100}%"></span><span class="s" style="width:${(suitsStats.seen - suitsStats.mastered) / suitsStats.total * 100}%"></span></div>
        <div class="dr-act"><a href="#/${cur}/suits" class="link">odcinki i przygotowanie</a></div>
      </div>` : '';
    const deckRows = profileDecks().map(d => {
      const s = deckStats(d), D = DECKS[d];
      const dd = dueCount(d);
      return `<div class="deckrow">
        <div class="dr-head"><span>${D.icon} <b>${D.title}</b></span><span class="muted small">${s.mastered} opanowane · ${s.seen}/${s.total} poznane${dd ? ` · <b class="due">${dd} do powtórki</b>` : ''}</span></div>
        <div class="stack"><span class="m" style="width:${s.mastered / s.total * 100}%"></span><span class="s" style="width:${(s.seen - s.mastered) / s.total * 100}%"></span></div>
        <div class="dr-act"><a href="#/${cur}/words/${d}" class="link">lista słów</a> · <button class="link" data-train="${d}">trenuj tylko tę talię</button></div>
      </div>`;
    }).join('');

    const gramRows = GRAMMAR.filter(t => t.lvl <= S.level).map(t => {
      const m = gMastery(t.id);
      return `<a class="grow" href="#/${cur}/grammar/${t.id}"><span>${m >= 0.8 ? '✅' : m > 0 ? '🟡' : '⚪'} ${h(t.title)}</span><span class="mini"><span style="width:${Math.round(m * 100)}%"></span></span></a>`;
    }).join('');

    const criteria = S.level < 4
      ? `Awans, gdy postęp poziomu ≥ 50% (teraz <b>${pct(lp)}</b>) i skuteczność ≥ 85% (teraz <b>${S.recent.length ? pct(ra) : '–'}</b>${S.recent.length < 30 ? `, jeszcze ${30 - S.recent.length} odpowiedzi` : ''}).`
      : 'Najwyższy poziom kursu – powtórki pilnują, żeby nic nie uciekło.';
    const lvlFill = Math.min(100, Math.round(lp / 0.5 * 100));
    const note = `Czeka ${due} powtórek · ${newCount} nowych słów w pełnej lekcji`;
    const hero = cur === 'jana' ? heroJana({ lvlFill, criteria, note }) : heroDominik({ lvlFill, criteria, note, totalMastered, st });
    $('#view').innerHTML = hero + `
      <section class="stats">
        <div class="stat card"><b data-count="${st}">${st}</b><span>🔥 dni z rzędu</span></div>
        <div class="stat card"><b data-count="${td.t}">${td.t}</b><span>odpowiedzi dziś</span></div>
        <div class="stat card"><b ${S.recent.length ? `data-count="${Math.round(ra * 100)}" data-suffix="%"` : ''}>${S.recent.length ? pct(ra) : '–'}</b><span>skuteczność (ost. 40)</span></div>
        <div class="stat card"><b>${totalMastered}<small>/${totalSeen}</small></b><span>słów opanowanych / poznanych</span></div>
        <div class="stat card"><b data-count="${S.pace}">${S.pace}</b><span>nowych słów na sesję</span></div>
        <div class="stat card"><b data-count="${S.xp}">${S.xp}</b><span>XP</span></div>
      </section>

      <section class="card">
        <h2>Ostatnie 14 dni</h2>
        <div class="chart">${bars}</div>
        <p class="small muted legend"><span class="lg a"></span> poprawne <span class="lg b"></span> wszystkie odpowiedzi</p>
      </section>

      <section class="grid2">
        <div class="card">
          <h2>Słownictwo</h2>
          ${deckRows}${suitsRow}
          <p class="small muted legend"><span class="lg a"></span> opanowane <span class="lg b"></span> w trakcie nauki</p>
        </div>
        <div class="card">
          <h2>Gramatyka</h2>
          ${nextTopic ? `<p>Polecany temat: <a href="#/${cur}/grammar/${nextTopic.id}"><b>${h(nextTopic.title)}</b></a></p>` : ''}
          <div class="glist">${gramRows}</div>
          <p class="small muted">Kolejne tematy odblokują się po awansie. Wszystkie znajdziesz w zakładce Gramatyka.</p>
          ${nextRead ? `<h2 class="mt">Czytanie</h2><p>Następny tekst: <a href="#/${cur}/read/${nextRead.id}"><b>${h(nextRead.title)}</b></a> <span class="pill sm">${LEVELS[nextRead.lvl]}</span></p>` : ''}
        </div>
      </section>`;

    bindLessonButtons();
    ART.upgradePhotos($('#view'));
    if (cur === 'jana') { countUp($('#view')); bindMineralPreview(); }
    $$('[data-train]').forEach(b => { b.onclick = () => startSession(b.dataset.train); });
  };

  function lessonButtons(extraNote, style) {
    const stones = { quick: 'agate', normal: 'amethyst', long: 'granite' };
    const cls = k => style === 'stone' ? `stone-btn tex-${stones[k]}`
      : style === 'glass' ? (k === 'normal' ? 'solid-btn' : 'glass-btn')
      : style === 'dom' ? (k === 'normal' ? 'dom-btn dom-main' : 'dom-btn')
      : `btn ${k === 'normal' ? '' : 'ghost'}`;
    return `<div class="lessons ${style || ''}">${Object.keys(SIZES).map(k => `<button class="${cls(k)} lesson-btn" data-size="${k}">${SIZES[k].label.replace(/^\S+ /, '')}<small>${SIZES[k].time}</small></button>`).join('')}</div>${extraNote || ''}`;
  }

  // Klik w kropkę minerału: podgląd innego kamienia (zablokowane – z informacją, kiedy się odblokują).
  function bindMineralPreview() {
    let timer = null;
    const show = l => {
      const m = MINERALS[l], box = $('#hjCrystal');
      if (!box) return;
      box.dataset.mineral = m.key;
      box.innerHTML = ART.crystal(m.key, { grow: true });
      box.classList.toggle('preview-locked', l > S.level);
      $('#hjName').textContent = m.pl;
      $('#hjSub').textContent = `${m.en} · ${m.sub}`;
      $('#hjEyebrow').textContent = l === S.level ? `Poziom ${LEVELS[S.level]} · Twój minerał` : l < S.level ? `Poziom ${LEVELS[l]} · zdobyty` : `Poziom ${LEVELS[l]} · do odblokowania`;
      $('#hjPreview').textContent = l > S.level ? `Odblokujesz go po awansie na poziom ${LEVELS[l]}.` : '';
      $$('.mdot').forEach(d => d.classList.toggle('on', +d.dataset.lvl === l));
      ART.upgradePhotos($('.hero-jana'));
      clearTimeout(timer);
      if (l !== S.level) timer = setTimeout(() => show(S.level), 6000);
    };
    $$('.mdot').forEach(d => { d.onclick = () => show(+d.dataset.lvl); });
  }

  function heroJana(o) {
    const m = MINERALS[S.level];
    const strata = [1, 2, 3, 4].map(l => {
      const fill = l < S.level ? 100 : l === S.level ? o.lvlFill : 0;
      return `<div class="stratum ${l === S.level ? 'cur' : ''} m-${MINERALS[l].key}" title="${LEVELS[l]} – ${MINERALS[l].pl}">
        <span class="fill" style="width:${fill}%"></span><em>${LEVELS[l]}</em><i>${MINERALS[l].pl}</i></div>`;
    }).join('');
    const dots = [1, 2, 3, 4].map(l => `<button type="button" class="mdot ${l === S.level ? 'on' : ''} ${l > S.level ? 'locked' : ''}" data-lvl="${l}" title="${MINERALS[l].pl}" aria-label="Pokaż minerał ${MINERALS[l].pl}">${ART.crystal(MINERALS[l].key, { small: true })}</button>`).join('');
    return `
      <section class="hero-jana">
        ${ART.particles(30, 'var(--accent)')}
        <div class="hj-art">
          <div class="hj-crystal" data-mineral="${m.key}" id="hjCrystal">${ART.crystal(m.key, { grow: true })}</div>
          <p class="hj-preview small muted" id="hjPreview"></p>
          <div class="hj-dots">${dots}</div>
        </div>
        <div class="hj-text">
          <span class="eyebrow" id="hjEyebrow">Poziom ${LEVELS[S.level]} · Twój minerał</span>
          <h1 class="hj-name" id="hjName">${m.pl}</h1>
          <p class="hj-sub" id="hjSub">${m.en} · ${m.sub}</p>
          <p class="hj-hello">Cześć, Jana! ${LEVEL_DESC[S.level]}.</p>
          <div class="strata" aria-label="Postęp poziomów">${strata}</div>
          <p class="small muted">${o.criteria}</p>
          ${lessonButtons(`<p class="small muted">${o.note}</p>`, 'stone')}
          ${!S.placed ? `<a class="text-link" href="#/${cur}/test">Test poziomujący (5 min) →</a>` : ''}
        </div>
      </section>`;
  }

  function heroDominik(o) {
    const stages = [1, 2, 3, 4].map(l => `<li class="${l < S.level ? 'done' : l === S.level ? 'cur' : ''}"><span>${LEVELS[l]}</span>${STAGES[l].pl}</li>`).join('');
    return `
      <section class="hero-dom">
        ${ART.scene('DOMINIK', 'hero-scene')}
        <div class="hd-top glass">Poziom ${LEVELS[S.level]} · ${STAGES[S.level].pl}</div>
        ${!S.placed ? `<a class="hd-test glass" href="#/${cur}/test">Test poziomujący ↗</a>` : ''}
        <p class="hd-tag">Cześć, Dominik! Angielski do pracy w nieruchomościach – od pierwszej rozmowy z klientem po akt notarialny.</p>
        <div class="hd-lessons">${lessonButtons('', 'glass')}</div>
      </section>
      <section class="hd-band">
        <div class="hd-plan">${ART.blueprint()}</div>
        <div class="hd-stats">
          <div class="hd-nums">
            <div><small>⌂ Poziom</small><b>${LEVELS[S.level]}</b></div>
            <div><small>▦ Słowa</small><b>${o.totalMastered}</b></div>
            <div><small>◷ Seria</small><b>${o.st}<sup>dni</sup></b></div>
          </div>
          <div class="hd-progress"><span style="width:${o.lvlFill}%"></span></div>
          <ol class="hd-stages">${stages}</ol>
          <p class="small muted">${o.criteria} ${o.note}.</p>
        </div>
      </section>`;
  }
  function bindLessonButtons() {
    $$('[data-size]').forEach(b => { b.onclick = () => startSession(null, b.dataset.size); });
  }

  function startSession(deck, size) {
    SESSION = buildSession(deck, size);
    if (!SESSION.tasks.length) {
      SESSION = null;
      $('#view').innerHTML = `<section class="card center"><h2>Wszystko powtórzone! 🎉</h2><p>W tej talii nie ma teraz nic do nauki. Wróć później albo wybierz inną talię.</p><a class="btn" href="#/${cur}/home">Wróć</a></section>`;
      return;
    }
    if (location.hash !== `#/${cur}/train`) go(`#/${cur}/train`); else renderTask();
  }

  VIEWS.train = function () {
    if (SESSION && SESSION.pid === cur && !SESSION.finished) return renderTask();
    const due = dueCount();
    $('#view').innerHTML = `
      <section class="card center">
        <h1>⚡ Trening</h1>
        <p>Sesja miesza <b>powtórki</b> (${due} czeka), <b>nowe słowa</b> (${S.pace}) oraz krótkie zadania z <b>gramatyki</b>.</p>
        <p class="muted small">Im lepiej Ci idzie, tym trudniejsze są ćwiczenia: od wyboru tłumaczenia, przez uzupełnianie zdań, po samodzielne wpisywanie. Skróty: klawisze <kbd>1</kbd>–<kbd>4</kbd> wybierają odpowiedź, <kbd>Enter</kbd> przechodzi dalej.</p>
        ${lessonButtons('', cur === 'jana' ? 'stone' : 'dom')}
        <p class="muted small"><b>Szybka</b> – 3 nowe słowa, kilka powtórek i jedno pytanie z gramatyki, idealna do tramwaju. <b>Długa</b> – więcej słów, mini-lekcja gramatyki i więcej ćwiczeń.</p>
      </section>`;
    bindLessonButtons();
  };

  // ---------- sesja ----------
  function renderTask() {
    const s = SESSION;
    if (s.idx >= s.tasks.length) return renderSessionEnd();
    const task = s.tasks[s.idx];
    task.t0 = Date.now();
    const progress = Math.round(s.idx / s.tasks.length * 100);
    $('#view').innerHTML = `
      <div class="sess-top">
        <div class="bar"><span style="width:${progress}%"></span></div>
        <span class="muted small">${s.idx + 1} / ${s.tasks.length}</span>
        <button class="link" id="quit">Zakończ</button>
      </div>
      <section class="card task" id="task"></section>`;
    $('#quit').onclick = () => { s.tasks.length = s.idx; renderSessionEnd(); };
    const box = $('#task');
    if (task.t === 'learn') return renderLearn(box, task);
    if (task.t === 'gram') return renderGramTask(box, task);
    if (task.t === 'gramIntro') return renderGramIntro(box, task);
    if (task.t === 'squiz') return renderSuitsQuiz(box, task);
    return renderQuiz(box, task);
  }
  function nextTask() { SESSION.idx++; renderTask(); }

  function deckLabel(item) {
    const D = DECKS[item.deck];
    const tag = item.tag ? ` · <span class="tagchip">${h(item.tag)}</span>` : '';
    return `<div class="deck-label">${D.icon} ${h(D.title)}${D.group === 'suits' ? '' : ` · <span class="pill sm">${LEVELS[item.lvl]}</span>`}${tag}</div>`;
  }

  function renderLearn(box, task) {
    const it = task.item;
    box.innerHTML = `
      <div class="badge new">Nowe ${it.phrase ? 'wyrażenie' : 'słowo'}${task.challenge ? ' · wyzwanie ⚡' : ''}</div>
      ${deckLabel(it)}
      <div class="word">${h(it.en)} ${sayBtn(it.en)}</div>
      <div class="tr">${h(it.pl)}</div>
      ${it.ex ? `<div class="example">„${h(it.ex)}” ${sayBtn(it.ex, 'sm')}</div>` : ''}
      ${it.ctx ? `<div class="ctx muted small">🎬 W odcinku: ${h(it.ctx)}</div>` : ''}
      <div class="actions">
        <button class="btn ghost" id="known">Już to znam</button>
        <button class="btn" id="go">Dalej ↵</button>
      </div>`;
    speak(it.en);
    $('#known').onclick = () => {
      const q = SESSION.tasks.find((t, i) => i > SESSION.idx && t.t === 'quiz' && t.item === it);
      if (q) q.known = true;
      nextTask();
    };
    $('#go').onclick = nextTask;
    KEYH = e => { if (e.key === 'Enter') nextTask(); };
  }

  function pickMode(item, task) {
    if (task.retry || (task.first && !task.known)) return 'mc-en';
    let b = Math.max(0, boxOf(item)) + (task.known ? 2 : 0) + (S.level >= 4 ? 2 : S.level >= 3 ? 1 : 0);
    if (item.phrase) return b <= 1 ? 'mc-en' : b === 2 ? 'mc-pl' : 'order';
    const g = gapOf(item);
    if (b <= 1) return 'mc-en';
    if (b === 2) return 'mc-pl';
    if (b === 3) return g ? 'gap' : 'mc-pl';
    return g && Math.random() < 0.35 ? 'gap' : 'type';
  }

  function distractors(item, n, key) {
    const val = key(item);
    const pool = deckItems(item.deck).filter(i => i !== item && norm(key(i)) !== norm(val));
    const near = shuffle(pool.filter(i => Math.abs(i.lvl - item.lvl) <= 1));
    const far = shuffle(pool.filter(i => Math.abs(i.lvl - item.lvl) > 1));
    const out = [];
    for (const i of near.concat(far)) {
      if (out.length >= n) break;
      if (!out.some(o => norm(key(o)) === norm(key(i)))) out.push(i);
    }
    return out;
  }

  function renderQuiz(box, task) {
    const it = task.item;
    const mode = pickMode(it, task);
    const head = `${task.retry ? '<div class="badge retry">Jeszcze raz</div>' : ''}${deckLabel(it)}`;
    const done = (ok, extra) => quizAnswered(task, ok, extra);

    if (mode === 'mc-en' || mode === 'mc-pl' || mode === 'gap') {
      let prompt, key, correctText;
      if (mode === 'mc-en') {
        key = i => i.pl;
        prompt = `<div class="qlabel">Co to znaczy?</div><div class="word">${h(it.en)} ${sayBtn(it.en)}</div>`;
        speak(it.en);
      } else if (mode === 'mc-pl') {
        key = i => i.en;
        prompt = `<div class="qlabel">Jak to powiedzieć po angielsku?</div><div class="word pl">${h(it.pl)}</div>`;
      } else {
        const g = gapOf(it);
        key = i => stripTo(i.en);
        prompt = `<div class="qlabel">Uzupełnij zdanie <span class="muted">(${h(it.pl)})</span></div>
          <div class="sentence">${h(g.before)}<span class="blank">_____</span>${h(g.after)}</div>`;
      }
      const opts = shuffle([it].concat(distractors(it, 3, key)));
      correctText = key(it);
      mc(box, {
        html: head + prompt,
        options: opts.map(key),
        correct: opts.indexOf(it),
        onAnswer: ok => done(ok, { answer: correctText })
      });
    } else if (mode === 'type') {
      const answers = answerVariants(it.en);
      typed(box, {
        html: head + `<div class="qlabel">Wpisz po angielsku</div><div class="word pl">${h(it.pl)}</div>` +
          (it.ex ? `<div class="hintline muted small">Podpowiedź z kontekstu: „${h(it.ex.replace(new RegExp('\\b' + escRe(stripTo(it.en)) + '\\b', 'ig'), '…'))}”</div>` : ''),
        answers,
        onAnswer: (ok, r) => done(ok, { answer: it.en, typo: r && r.typo, hinted: r && r.hinted })
      });
    } else if (mode === 'order') {
      orderEx(box, {
        html: head + `<div class="qlabel">Ułóż zdanie po angielsku</div><div class="word pl">${h(it.pl)}</div>`,
        phrase: it.en,
        onAnswer: ok => done(ok, { answer: it.en })
      });
    }
  }

  // „to be crawling with sth” → akceptujemy też wersję bez „sth”, bez nawiasów itd.
  function answerVariants(en) {
    const out = new Set();
    en.split(/\s*\/\s*/).forEach(v => {
      out.add(v);
      const c = v.replace(/\([^)]*\)/g, ' ').replace(/\b(sth|sb|someone|something|somebody|one's|X|Y)\b/g, ' ').replace(/\s+/g, ' ').trim();
      if (c) out.add(c);
    });
    return Array.from(out);
  }

  function quizAnswered(task, ok, extra) {
    const s = SESSION, it = task.item;
    if (!task.retry) {
      const elapsed = Date.now() - task.t0;
      const fast = elapsed < 6000 && !(extra && extra.hinted);
      s.n++; if (ok) s.ok++;
      logAnswer(ok);
      gradeCard(it, ok, fast, task.known);
      save();
    }
    if (!ok && !s.requeued.has(it.id)) {
      s.requeued.add(it.id);
      s.wrong.push(it);
      s.tasks.push({ t: 'quiz', item: it, retry: true });
    }
    const exHtml = it.ex ? `<div class="example">„${h(it.ex)}” ${sayBtn(it.ex, 'sm')}</div>` : '';
    const msg = ok
      ? (extra && extra.typo ? `Prawie idealnie – poprawna pisownia: <b>${h(extra.answer)}</b>` : `<b>${h(it.en)}</b> – ${h(it.pl)}`)
      : `Poprawnie: <b>${h(it.en)}</b> – ${h(it.pl)}`;
    feedback(ok, msg + exHtml, nextTask);
    if (!ok || it.phrase) speak(it.en);
  }

  function renderGramIntro(box, task) {
    const topic = GRAMMAR_BY_ID[task.topic];
    box.innerHTML = `<div class="badge gram">🧩 Mini-lekcja gramatyki</div>
      <h2>${h(topic.title)}</h2><div class="lesson">${topic.intro}</div>
      <div class="actions"><button class="btn" id="go">Rozumiem – ćwiczymy ↵</button></div>`;
    $('#go').onclick = nextTask;
    KEYH = e => { if (e.key === 'Enter') nextTask(); };
  }

  function renderSuitsQuiz(box, task) {
    const e = SUITS_LIST.find(x => x.ep === task.ep);
    const idx = shuffle(task.ex.o.map((_, i) => i));
    mc(box, {
      html: `<div class="badge gram">⚖️ Suits · S01E${String(task.ep).padStart(2, '0')} ${h(e.title)}</div><div class="sentence">${task.ex.q}</div>`,
      options: idx.map(i => task.ex.o[i]),
      correct: idx.indexOf(task.ex.a),
      onAnswer: ok => {
        SESSION.n++; if (ok) SESSION.ok++;
        logAnswer(ok); save();
        feedback(ok, ok ? '' : `Poprawnie: <b>${h(task.ex.o[task.ex.a])}</b>`, nextTask);
      }
    });
  }

  function renderGramTask(box, task) {
    const topic = GRAMMAR_BY_ID[task.topic];
    const head = `<div class="badge gram">🧩 Gramatyka · ${h(topic.title)}</div>`;
    gramQuestion(box, head, task.ex, (ok, ans) => {
      const s = SESSION;
      s.n++; if (ok) s.ok++;
      logAnswer(ok);
      const g = S.grammar[topic.id] || (S.grammar[topic.id] = { a: 0, c: 0, best: 0 });
      g.a++; if (ok) g.c++;
      save();
      feedback(ok, gramFeedback(ok, task.ex, ans, topic), nextTask);
    });
  }

  function gramFeedback(ok, ex, ans, topic) {
    return `${ok ? '' : `Poprawnie: <b>${h(ans)}</b>. `}${ex.e ? h(ex.e) : ''}
      ${topic && !ok ? `<div class="small"><a href="#/${cur}/grammar/${topic.id}" target="_self">Przypomnij sobie zasady →</a></div>` : ''}`;
  }

  function fmtQ(q) { return h(q).replace(/_{3,}/g, '<span class="blank">___</span>'); }

  function gramQuestion(box, head, ex, cb) {
    if (ex.o) {
      const idx = shuffle(ex.o.map((_, i) => i));
      mc(box, {
        html: head + `<div class="sentence">${fmtQ(ex.q)}</div>`,
        options: idx.map(i => ex.o[i]),
        correct: idx.indexOf(ex.a),
        onAnswer: ok => cb(ok, ex.o[ex.a])
      });
    } else {
      typed(box, {
        html: head + `<div class="sentence">${fmtQ(ex.q)}</div>`,
        answers: ex.a,
        loose: false,
        onAnswer: ok => cb(ok, ex.a[0])
      });
    }
  }

  function renderSessionEnd() {
    const s = SESSION;
    if (!s.finished) {
      s.finished = true;
      s.acc = s.n ? s.ok / s.n : 0;
      s.msgs = s.n ? adapt(s.acc, s.n) : [];
      if (s.n && s.deck && DECKS[s.deck] && DECKS[s.deck].group === 'suits') setEp(DECKS[s.deck].episode, { prep: true });
      if (s.n) S.sessions++;
      save();
    }
    const xp = S.xp - s.xp0;
    const grade = s.acc >= 0.9 ? 'Rewelacja! 🌟' : s.acc >= 0.75 ? 'Bardzo dobrze! 💪' : s.acc >= 0.6 ? 'Nieźle – tak trzymaj! 👍' : 'Dobra robota, że ćwiczysz – powtórki zrobią swoje. 🌱';
    $('#view').innerHTML = `
      <section class="card center session-end">
        <div class="end-art">${cur === 'jana' ? ART.crystal(MINERALS[S.level].key, { grow: true }) : ART.blueprint()}</div>
        <h1>${s.n ? grade : 'Sesja zakończona'}</h1>
        ${s.n ? `<div class="result-ring" style="--p:${Math.round(s.acc * 100)}"><b data-count="${Math.round(s.acc * 100)}" data-suffix="%">${pct(s.acc)}</b><small>${s.ok}/${s.n}</small></div>
        <p class="muted">+${xp} XP · nowe słowa: ${s.newCount} · powtórki: ${s.revCount}</p>` : '<p class="muted">Nie udzielono odpowiedzi.</p>'}
        ${s.msgs.map(m => `<div class="adapt ${m.k}">${m.t}</div>`).join('')}
        ${s.wrong.length ? `<div class="wrong-list"><h3>Do zapamiętania</h3>${s.wrong.map(i => `<div class="wl"><span>${h(i.en)} ${sayBtn(i.en, 'sm')}</span><span class="muted">${h(i.pl)}</span></div>`).join('')}</div>` : ''}
        <div class="actions center">
          <button class="btn" id="again">Kolejna sesja</button>
          <a class="btn ghost" href="#/${cur}/home">Postępy</a>
        </div>
      </section>`;
    $('#again').onclick = () => startSession(s.deck, s.size);
    if (cur === 'jana') {
      countUp($('#view'));
      if (s.n && s.acc >= 0.6) setTimeout(() => { const r = $('.result-ring'); if (r) { const b = r.getBoundingClientRect(); ART.burst(b.left + b.width / 2, b.top + b.height / 2, MINERALS[S.level].key, 28); } }, 700);
      if (!s.revealed && s.msgs.some(m => m.k === 'level')) { s.revealed = true; setTimeout(levelReveal, 1200); }
    }
    KEYH = null;
  }

  // ---------- typy zadań ----------
  function mc(box, o) {
    box.innerHTML = o.html + `<div class="opts">${o.options.map((t, i) => `<button class="opt" data-i="${i}"><kbd>${i + 1}</kbd><span>${h(t)}</span></button>`).join('')}</div><div id="fb"></div>`;
    let done = false;
    const pick = i => {
      if (done) return; done = true;
      const ok = i === o.correct;
      answerFx(ok, $$('.opt', box)[o.correct]);
      $$('.opt', box).forEach((b, j) => {
        b.disabled = true;
        if (j === o.correct) b.classList.add('right');
        else if (j === i) b.classList.add('wrong');
      });
      o.onAnswer(ok, i);
    };
    $$('.opt', box).forEach(b => { b.onclick = () => pick(+b.dataset.i); });
    KEYH = e => { const n = parseInt(e.key, 10); if (n >= 1 && n <= o.options.length) pick(n - 1); };
  }

  function checkTyped(val, answers) {
    const v = stripTo(norm(val));
    for (const a of answers) {
      const t = stripTo(norm(a));
      if (v === t) return { ok: true };
    }
    for (const a of answers) {
      const t = stripTo(norm(a));
      const d = lev(v, t);
      if ((t.length >= 4 && d <= 1) || (t.length >= 9 && d <= 2)) return { ok: true, typo: true };
    }
    return { ok: false };
  }

  function typed(box, o) {
    box.innerHTML = o.html + `
      <form class="typed" autocomplete="off">
        <input id="ans" type="text" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Wpisz odpowiedź…" aria-label="Odpowiedź">
        <button class="btn" type="submit">Sprawdź</button>
      </form>
      <div class="row-gap"><button class="link" id="hint" type="button">💡 Podpowiedź</button><button class="link" id="idk" type="button">Nie wiem</button></div>
      <div id="fb"></div>`;
    const inp = $('#ans', box);
    let done = false, hinted = 0;
    setTimeout(() => inp.focus(), 30);
    const submit = (val, giveUp) => {
      if (done) return; done = true;
      inp.disabled = true;
      $$('.typed button, #hint, #idk', box).forEach(b => { b.disabled = true; });
      const r = giveUp ? { ok: false } : checkTyped(val, o.answers);
      r.hinted = hinted > 0;
      inp.classList.add(r.ok ? 'right' : 'wrong');
      answerFx(r.ok, inp);
      o.onAnswer(r.ok, r);
    };
    $('form', box).onsubmit = e => { e.preventDefault(); if (inp.value.trim()) submit(inp.value); };
    $('#hint', box).onclick = () => {
      hinted++;
      const a = o.answers[0];
      inp.value = a.slice(0, Math.min(a.length - 1, hinted * 2));
      inp.focus();
    };
    $('#idk', box).onclick = () => submit('', true);
    KEYH = null;
  }

  function orderEx(box, o) {
    const tokens = o.phrase.split(' ');
    let pool = tokens.map((t, i) => ({ t, i }));
    let tries = 0;
    do { pool = shuffle(pool); } while (tokens.length > 1 && pool.every((x, k) => x.i === k) && tries++ < 10);
    const built = [];
    let done = false;
    box.innerHTML = o.html + `<div class="built" id="built"></div><div class="pool" id="pool"></div>
      <div class="actions"><button class="btn ghost" id="clr" type="button">Wyczyść</button><button class="btn" id="chk" type="button">Sprawdź</button></div><div id="fb"></div>`;
    const draw = () => {
      $('#built', box).innerHTML = built.length ? built.map((x, k) => `<button class="tok on" data-k="${k}">${h(x.t)}</button>`).join('') : '<span class="muted small">Klikaj słowa poniżej w odpowiedniej kolejności…</span>';
      $('#pool', box).innerHTML = pool.map((x, k) => `<button class="tok" data-k="${k}">${h(x.t)}</button>`).join('');
      $$('#pool .tok', box).forEach(b => { b.onclick = () => { if (done) return; built.push(pool.splice(+b.dataset.k, 1)[0]); draw(); }; });
      $$('#built .tok', box).forEach(b => { b.onclick = () => { if (done) return; pool.push(built.splice(+b.dataset.k, 1)[0]); draw(); }; });
    };
    draw();
    $('#clr', box).onclick = () => { if (done) return; pool = pool.concat(built.splice(0)); draw(); };
    $('#chk', box).onclick = () => {
      if (done || pool.length) return;
      done = true;
      const ok = norm(built.map(x => x.t).join(' ')) === norm(o.phrase);
      $('#built', box).classList.add(ok ? 'right' : 'wrong');
      answerFx(ok, $('#built', box));
      $$('.actions button', box).forEach(b => { b.disabled = true; });
      o.onAnswer(ok);
    };
    KEYH = e => { if (e.key === 'Enter') $('#chk', box).click(); };
  }

  function feedback(ok, html, onNext) {
    const fb = $('#fb');
    let used = false;
    const go2 = () => { if (used) return; used = true; onNext(); };
    fb.innerHTML = `<div class="fb ${ok ? 'ok' : 'bad'}"><div class="fb-title">${ok ? '✓ Dobrze!' : '✗ Nie tym razem'}</div><div>${html || ''}</div></div>
      <div class="actions"><button class="btn" id="nx">Dalej ↵</button></div>`;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    $('#nx').onclick = go2;
    KEYH = e => { if (e.key === 'Enter') { e.preventDefault(); go2(); } };
  }

  // ---------- słownictwo ----------
  VIEWS.words = function (deckArg) {
    const decks = profileDecks().slice();
    if (deckArg && DECKS[deckArg] && DECKS[deckArg].group === 'suits') decks.push(deckArg);
    const deck = decks.includes(deckArg) ? deckArg : decks[0];
    const items = deckItems(deck);
    const chips = decks.map(d => `<a class="chip ${d === deck ? 'active' : ''}" href="#/${cur}/words/${d}">${DECKS[d].icon} ${DECKS[d].title}</a>`).join('');
    $('#view').innerHTML = `
      <section class="card">
        <div class="chips">${chips}</div>
        <div class="toolbar">
          <input id="q" type="search" placeholder="Szukaj (po angielsku lub polsku)…" aria-label="Szukaj">
          <select id="lv" aria-label="Poziom"><option value="">Wszystkie poziomy</option>${[1, 2, 3, 4].map(l => `<option value="${l}">${LEVELS[l]}</option>`).join('')}</select>
          <select id="stf" aria-label="Status"><option value="">Każdy status</option><option value="new">Nowe</option><option value="learn">W nauce</option><option value="ok">Opanowane</option></select>
          <button class="btn" id="tr">⚡ Trenuj tę talię</button>
        </div>
        <div id="list" class="wlist"></div>
      </section>`;
    const draw = () => {
      const q = norm($('#q').value), lv = +$('#lv').value, sf = $('#stf').value;
      const rows = items.filter(i => {
        if (lv && i.lvl !== lv) return false;
        const b = boxOf(i), st = b < 0 ? 'new' : b >= MASTER_BOX ? 'ok' : 'learn';
        if (sf && st !== sf) return false;
        return !q || norm(i.en).includes(q) || norm(i.pl).includes(q);
      }).map(i => {
        const b = boxOf(i), st = b < 0 ? ['new', 'nowe'] : b >= MASTER_BOX ? ['ok', 'opanowane'] : ['learn', 'w nauce'];
        return `<div class="wrow">
          <div class="wmain"><b>${h(i.en)}</b> ${sayBtn(i.en, 'sm')}<span class="pl">${h(i.pl)}</span></div>
          ${i.ex ? `<div class="wex muted small">${h(i.ex)} ${sayBtn(i.ex, 'xs')}</div>` : ''}
          <div class="wmeta"><span class="pill sm">${LEVELS[i.lvl]}</span><span class="st ${st[0]}">${st[1]}</span></div>
        </div>`;
      });
      $('#list').innerHTML = rows.length ? rows.join('') : '<p class="muted center">Brak wyników.</p>';
    };
    ['input', 'change'].forEach(ev => { $('#q').addEventListener(ev, draw); });
    $('#lv').onchange = draw; $('#stf').onchange = draw;
    $('#tr').onclick = () => startSession(deck);
    draw();
  };

  // ---------- gramatyka ----------
  let GQ = null;
  VIEWS.grammar = function (id) {
    const topic = GRAMMAR_BY_ID[id];
    if (!topic) {
      const groups = [1, 2, 3, 4].map(l => {
        const ts = GRAMMAR.filter(t => t.lvl === l);
        return `<div class="glevel ${l > S.level ? 'locked' : ''}">
          <h3>${LEVELS[l]} <span class="muted small">${LEVEL_DESC[l]}${l > S.level ? ' · 🔒 powyżej Twojego poziomu (możesz zajrzeć)' : ''}</span></h3>
          <div class="gcards">${ts.map(t => {
            const m = gMastery(t.id);
            return `<a class="gcard" href="#/${cur}/grammar/${t.id}"><span>${m >= 0.8 ? '✅' : m > 0 ? '🟡' : '⚪'} ${h(t.title)}</span><span class="mini"><span style="width:${Math.round(m * 100)}%"></span></span><small class="muted">${m ? 'opanowanie ' + pct(m) : 'jeszcze nie ćwiczone'}</small></a>`;
          }).join('')}</div></div>`;
      }).join('');
      $('#view').innerHTML = `<section class="card"><h1>🧩 Gramatyka</h1><p class="muted">Krótkie wyjaśnienia po polsku i test na każdy temat. Temat jest opanowany przy wyniku ≥ 80%.</p>${groups}</section>`;
      return;
    }
    const g = S.grammar[topic.id];
    $('#view').innerHTML = `
      <section class="card">
        <a class="link" href="#/${cur}/grammar">← wszystkie tematy</a>
        <h1>${h(topic.title)} <span class="pill">${LEVELS[topic.lvl]}</span></h1>
        <div class="lesson">${topic.intro}</div>
        <div class="actions"><button class="btn big" id="quiz">Sprawdź się (${topic.ex.length} pytań)</button></div>
        ${g && g.best ? `<p class="muted small center">Najlepszy wynik: ${pct(g.best)}</p>` : ''}
      </section>
      <section class="card task" id="gq" hidden></section>`;
    $$('.lesson i', $('#view')).forEach(el => {
      if (el.textContent.length > 6) { el.classList.add('sayable'); el.title = 'Kliknij, aby posłuchać'; el.onclick = () => speak(el.textContent); }
    });
    $('#quiz').onclick = () => {
      GQ = { topic, list: shuffle(topic.ex), idx: 0, ok: 0 };
      $('#gq').hidden = false;
      gqNext();
      $('#gq').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  };

  function gqNext() {
    const box = $('#gq');
    if (!box) return;
    if (GQ.idx >= GQ.list.length) {
      const score = GQ.ok / GQ.list.length;
      const g = S.grammar[GQ.topic.id] || (S.grammar[GQ.topic.id] = { a: 0, c: 0, best: 0 });
      g.best = Math.max(g.best || 0, score); g.last = score;
      save();
      box.innerHTML = `<div class="center"><h2>Wynik: ${GQ.ok}/${GQ.list.length} (${pct(score)})</h2>
        <p>${score >= 0.8 ? 'Temat opanowany! ✅' : 'Przeczytaj jeszcze raz wyjaśnienie i spróbuj ponownie – trening dnia też będzie podsuwał ten temat.'}</p>
        <div class="actions center"><button class="btn" id="again">Jeszcze raz</button><a class="btn ghost" href="#/${cur}/grammar">Inne tematy</a></div></div>`;
      $('#again').onclick = () => { GQ = { topic: GQ.topic, list: shuffle(GQ.topic.ex), idx: 0, ok: 0 }; gqNext(); };
      KEYH = null;
      return;
    }
    const ex = GQ.list[GQ.idx];
    const head = `<div class="row-between small muted"><span>Pytanie ${GQ.idx + 1} / ${GQ.list.length}</span><span>✓ ${GQ.ok}</span></div>`;
    gramQuestion(box, head, ex, (ok, ans) => {
      if (ok) GQ.ok++;
      logAnswer(ok);
      const g = S.grammar[GQ.topic.id] || (S.grammar[GQ.topic.id] = { a: 0, c: 0, best: 0 });
      g.a++; if (ok) g.c++;
      save();
      feedback(ok, gramFeedback(ok, ex, ans, null), () => { GQ.idx++; gqNext(); });
    });
  }

  // ---------- czytanie ----------
  VIEWS.read = function (id) {
    const list = readingsFor();
    const r = list.find(x => x.id === id);
    if (!r) {
      $('#view').innerHTML = `<section class="card"><h1>📖 Czytanie</h1>
        <p class="muted">Teksty z Twojej dziedziny oraz z życia (Wrocław, snowboard, gotowanie) – od prostych po specjalistyczne. Najedź lub kliknij podkreślone słowo, aby zobaczyć tłumaczenie.</p>
        <div class="rlist">${list.map(x => {
          const rs = S.reading[x.id];
          return `<a class="rcard ${x.lvl > S.level ? 'locked' : ''}" href="#/${cur}/read/${x.id}">
            <span class="pill">${LEVELS[x.lvl]}</span><b>${h(x.title)}</b>
            <span class="muted small">${rs ? 'najlepszy wynik: ' + pct(rs.best) : x.lvl > S.level ? 'trudniejszy – spróbuj, jeśli masz ochotę' : 'nieprzeczytany'}</span></a>`;
        }).join('')}</div></section>`;
      return;
    }
    // podświetlanie słów ze słowniczka
    let html = h(r.text);
    const keys = Object.keys(r.gloss).sort((a, b) => b.length - a.length);
    const marks = [];
    keys.forEach(k => {
      const re = new RegExp('\\b(' + escRe(h(k)) + ')\\b', 'i');
      html = html.replace(re, m => { marks.push(`<span class="gloss" tabindex="0" data-tr="${h(r.gloss[k])}">${m}</span>`); return `\u0000${marks.length - 1}\u0000`; });
    });
    html = html.replace(/\u0000(\d+)\u0000/g, (_, n) => marks[+n]);
    const paras = html.split(/\n\s*\n/).map(p => `<p>${p}</p>`).join('');
    $('#view').innerHTML = `
      <section class="card">
        <a class="link" href="#/${cur}/read">← wszystkie teksty</a>
        <h1>${h(r.title)} <span class="pill">${LEVELS[r.lvl]}</span></h1>
        <div class="row-gap"><button class="btn ghost sm" id="listen">🔊 Odsłuchaj tekst</button><button class="btn ghost sm" id="stop">⏹ Stop</button></div>
        <article class="reading">${paras}</article>
        <details class="glossary"><summary>Słowniczek (${keys.length})</summary>${keys.map(k => `<div class="wl"><span>${h(k)} ${sayBtn(k, 'xs')}</span><span class="muted">${h(r.gloss[k])}</span></div>`).join('')}</details>
      </section>
      <section class="card">
        <h2>Pytania do tekstu</h2>
        <div id="rq"></div>
        <div class="actions"><button class="btn" id="check">Sprawdź odpowiedzi</button></div>
        <div id="rres"></div>
      </section>`;
    $('#listen').onclick = () => speak(r.text);
    $('#stop').onclick = () => { try { speechSynthesis.cancel(); } catch (e) { /* brak */ } };
    $$('.gloss').forEach(el => { el.onclick = () => el.classList.toggle('show'); });
    $('#rq').innerHTML = r.q.map((q, qi) => `
      <fieldset class="rqq"><legend>${qi + 1}. ${h(q.q)}</legend>
      ${q.o.map((o, oi) => `<label><input type="radio" name="q${qi}" value="${oi}"> ${h(o)}</label>`).join('')}</fieldset>`).join('');
    $('#check').onclick = () => {
      let ok = 0;
      r.q.forEach((q, qi) => {
        const sel = $(`input[name=q${qi}]:checked`);
        const fs = $$('.rqq')[qi];
        $$('label', fs).forEach((l, oi) => { l.classList.toggle('right', oi === q.a); l.classList.toggle('wrong', !!sel && +sel.value === oi && oi !== q.a); });
        const good = sel && +sel.value === q.a;
        if (good) ok++;
        logAnswer(!!good);
      });
      const score = ok / r.q.length;
      const rs = S.reading[r.id] || (S.reading[r.id] = { best: 0 });
      rs.best = Math.max(rs.best, score); rs.last = score;
      save();
      $('#rres').innerHTML = `<div class="fb ${score >= 0.75 ? 'ok' : 'bad'}"><b>${ok}/${r.q.length}</b> – ${score === 1 ? 'perfekcyjnie!' : score >= 0.75 ? 'bardzo dobrze!' : 'przeczytaj tekst jeszcze raz, korzystając ze słowniczka.'}</div>`;
      $('#check').disabled = true;
    };
  };

  // ---------- Suits: przygotowanie do odcinków ----------
  VIEWS.suits = function (arg) {
    if (!SUITS_LIST.length) { $('#view').innerHTML = '<section class="card"><p>Brak materiałów do Suits.</p></section>'; return; }
    const ep = parseInt(arg, 10);
    if (!ep) return suitsList();
    const e = SUITS_LIST.find(x => x.ep === ep);
    if (!e) return suitsList();
    const deck = suitsDeck(ep), st = deckStats(deck), es = epState(ep);
    const left = st.total - st.seen;
    const dueHere = dueCount(deck);
    const code = 'S01E' + String(ep).padStart(2, '0');
    const prev = SUITS_LIST.find(x => x.ep === ep - 1), next = SUITS_LIST.find(x => x.ep === ep + 1);
    $('#view').innerHTML = `
      <section class="card suits-ep">
        <a class="link" href="#/${cur}/suits">← wszystkie odcinki</a>
        <div class="se-head">
          <div>
            <span class="eyebrow">Suits · sezon 1 · odcinek ${ep}</span>
            <h1>${code} · ${h(e.title)}</h1>
          </div>
          <button class="btn ${es.watched ? '' : 'ghost'}" id="watched">${es.watched ? '✓ Obejrzany' : 'Oznacz jako obejrzany'}</button>
        </div>
        <div class="se-progress">
          <div class="stack"><span class="m" style="width:${st.mastered / st.total * 100}%"></span><span class="s" style="width:${(st.seen - st.mastered) / st.total * 100}%"></span></div>
          <p class="small muted">${st.seen}/${st.total} słów poznanych · ${st.mastered} opanowanych${dueHere ? ` · <b class="due">${dueHere} do powtórki</b>` : ''}${es.quiz != null ? ` · quiz: ${pct(es.quiz)}` : ''}</p>
        </div>
        <div class="actions se-actions">
          ${left ? `<button class="btn big" id="prep">🎬 Przygotuj się do odcinka<small>${Math.min(left, SUITS_PER_SESSION)} nowych słów${left > SUITS_PER_SESSION ? ` (zostało ${left})` : ''}</small></button>` : ''}
          ${st.seen ? `<button class="btn ghost" id="rev">🔁 Powtórz słówka z odcinka</button>` : ''}
          <a class="btn ghost" href="#quiz" id="toquiz">📝 Quiz</a>
          <a class="btn ghost" href="#/${cur}/words/${deck}">📚 Lista słów</a>
        </div>
        <div class="se-body">
          <h2>O czym jest odcinek</h2><div class="lesson">${e.about}</div>
          ${e.cast ? `<details><summary>Postaci – kto jest kim</summary><div class="lesson">${e.cast}</div></details>` : ''}
          ${e.review ? `<h2>Powtórka – usłyszysz to znowu</h2><div class="lesson">${e.review}</div>` : ''}
          <details><summary>Gramatyka w akcji</summary><div class="lesson">${e.grammar}</div></details>
          <details><summary>Odniesienia kulturowe (żeby załapać żarty)</summary><div class="lesson">${e.culture}</div></details>
          <details><summary>Zadanie po obejrzeniu</summary><div class="lesson">${e.task}</div></details>
        </div>
      </section>
      <section class="card" id="quizbox">
        <h2>Quiz – sprawdź się ${es.watched ? 'po odcinku' : 'przed odcinkiem'}</h2>
        <div id="sq">${e.quiz.map((q, qi) => `<fieldset class="rqq"><legend>${qi + 1}. ${q.q}</legend>
          ${q.o.map((o, oi) => `<label><input type="radio" name="sq${qi}" value="${oi}"> ${h(o)}</label>`).join('')}</fieldset>`).join('')}</div>
        <div class="actions"><button class="btn" id="sqcheck">Sprawdź odpowiedzi</button></div>
        <div id="sqres"></div>
      </section>
      <nav class="se-nav">
        ${prev ? `<a class="btn ghost" href="#/${cur}/suits/${prev.ep}">← S01E${String(prev.ep).padStart(2, '0')}</a>` : '<span></span>'}
        ${next ? `<a class="btn ghost" href="#/${cur}/suits/${next.ep}">S01E${String(next.ep).padStart(2, '0')} →</a>` : ''}
      </nav>`;
    $$('.se-body i, #sq legend i').forEach(el => { if (el.textContent.length > 6) { el.classList.add('sayable'); el.onclick = () => speak(el.textContent); } });
    $('#watched').onclick = () => { setEp(ep, { watched: !es.watched }); save(); VIEWS.suits(String(ep)); };
    if ($('#prep')) $('#prep').onclick = () => startSession(deck, 'episode');
    if ($('#rev')) $('#rev').onclick = () => {
      // powtórka: wszystkie poznane słowa z odcinka, najsłabsze najpierw
      const items = deckItems(deck).filter(i => S.cards[i.id]).sort((a, b) => S.cards[a.id].b - S.cards[b.id].b).slice(0, 20);
      SESSION = { pid: cur, tasks: shuffle(items).map(i => ({ t: 'quiz', item: i })), idx: 0, ok: 0, n: 0, wrong: [], requeued: new Set(), deck, size: 'episode', newCount: 0, revCount: items.length, xp0: S.xp };
      go(`#/${cur}/train`);
    };
    $('#toquiz').onclick = ev => { ev.preventDefault(); $('#quizbox').scrollIntoView({ behavior: 'smooth' }); };
    $('#sqcheck').onclick = () => {
      let ok = 0;
      e.quiz.forEach((q, qi) => {
        const sel = $(`input[name=sq${qi}]:checked`);
        const fs = $$('#sq .rqq')[qi];
        $$('label', fs).forEach((l, oi) => { l.classList.toggle('right', oi === q.a); l.classList.toggle('wrong', !!sel && +sel.value === oi && oi !== q.a); });
        const good = !!sel && +sel.value === q.a;
        if (good) ok++;
        logAnswer(good);
      });
      const score = ok / e.quiz.length;
      setEp(ep, { quiz: Math.max(es.quiz || 0, score) });
      save();
      $('#sqres').innerHTML = `<div class="fb ${score >= 0.7 ? 'ok' : 'bad'}"><b>${ok}/${e.quiz.length}</b> – ${score >= 0.9 ? 'świetnie, możesz oglądać! 🍿' : score >= 0.7 ? 'dobrze – przejrzyj jeszcze błędne.' : 'warto najpierw przejść słówka z odcinka.'}</div>`;
      $('#sqcheck').disabled = true;
      if (cur === 'jana' && score >= 0.7) { const r = $('#sqres').getBoundingClientRect(); ART.burst(r.left + r.width / 2, r.top + 20, MINERALS[S.level].key, 24); }
    };
  };

  function suitsList() {
    const nextEp = (SUITS_LIST.find(e => !epState(e.ep).watched) || {}).ep;
    $('#view').innerHTML = `
      <section class="card suits-list">
        <span class="eyebrow">Przygotowanie do odcinków</span>
        <h1>⚖️ Suits – sezon 1</h1>
        <p class="muted">Przed odcinkiem przejdź słówka i idiomy z niego (po ${SUITS_PER_SESSION} na raz), zrób quiz, a potem oglądaj.
          Poznane słowa wracają w codziennym treningu, a odpowiedzi liczą się do postępów. Oznacz odcinek jako obejrzany – jego słowa zaczną się mieszać z resztą kursu.</p>
        <div class="ep-grid">${SUITS_LIST.map(e => {
          const st = deckStats(suitsDeck(e.ep)), es = epState(e.ep);
          const code = 'S01E' + String(e.ep).padStart(2, '0');
          return `<a class="ep-card ${e.ep === nextEp ? 'next' : ''} ${es.watched ? 'watched' : ''}" href="#/${cur}/suits/${e.ep}">
            <span class="ep-code">${code}</span>
            <b>${h(e.title)}</b>
            <span class="mini"><span style="width:${Math.round(st.seen / st.total * 100)}%"></span></span>
            <small>${es.watched ? '✓ obejrzany' : e.ep === nextEp ? '▶ następny' : ''} ${st.seen}/${st.total} słów${es.quiz != null ? ` · quiz ${pct(es.quiz)}` : ''}</small>
          </a>`;
        }).join('')}</div>
      </section>`;
  }

  // ---------- test poziomujący ----------
  let PT = null;
  VIEWS.test = function () {
    // Na każdy poziom: 4 pytania z gramatyki (wybór), 1 do wpisania i 3 słowa (polski → angielski).
    PT = { qs: [], idx: 0, score: { 1: 0, 2: 0, 3: 0, 4: 0 } };
    [1, 2, 3, 4].forEach(l => {
      const topics = GRAMMAR.filter(t => t.lvl === l);
      shuffle(topics.flatMap(t => t.ex.filter(e => e.o))).slice(0, 4).forEach(ex => PT.qs.push({ lvl: l, ex }));
      shuffle(topics.flatMap(t => t.ex.filter(e => !e.o))).slice(0, 1).forEach(ex => PT.qs.push({ lvl: l, ex }));
      shuffle(profileItems().filter(i => i.lvl === l && !i.phrase)).slice(0, 3).forEach(it => PT.qs.push({ lvl: l, item: it }));
    });
    $('#view').innerHTML = `
      <section class="card center">
        <h1>🎯 Test poziomujący</h1>
        <p>${PT.qs.length} pytań – od łatwych do trudnych. Nie zgaduj na siłę: jeśli nie wiesz, kliknij „Nie wiem”.</p>
        <p class="muted small">Na podstawie wyniku ustawię Twój poziom startowy. Zawsze możesz go zmienić w Ustawieniach.</p>
        <button class="btn big" id="go">Start</button>
      </section>
      <section class="card task" id="pt" hidden></section>`;
    $('#go').onclick = () => { $('#go').closest('section').hidden = true; $('#pt').hidden = false; ptNext(); };
  };

  function ptNext() {
    const box = $('#pt');
    if (!box) return;
    if (PT.idx >= PT.qs.length) return ptFinish(box);
    const q = PT.qs[PT.idx];
    const head = `<div class="row-between small muted"><span>Pytanie ${PT.idx + 1} / ${PT.qs.length}</span><span class="pill sm">${LEVELS[q.lvl]}</span></div>`;
    let ex = q.ex;
    const answered = ok => { if (ok) PT.score[q.lvl]++; setTimeout(() => { PT.idx++; ptNext(); }, 450); };
    if (!q.item && !ex.o) {
      typed(box, { html: head + `<div class="sentence">${fmtQ(ex.q)}</div>`, answers: ex.a, onAnswer: ok => setTimeout(() => answered(ok), 500) });
      return;
    }
    if (q.item) {
      const it = q.item;
      const opts = shuffle([it].concat(distractors(it, 4, i => i.en)));
      ex = { q: `Jak po angielsku: „${it.pl}”?`, o: opts.map(i => i.en).concat(['Nie wiem']), a: opts.indexOf(it) };
    } else {
      ex = { q: ex.q, o: ex.o.concat(['Nie wiem']), a: ex.a };
    }
    // „Nie wiem” zawsze na końcu
    const idx = shuffle(ex.o.slice(0, -1).map((_, i) => i)).concat([ex.o.length - 1]);
    mc(box, {
      html: head + `<div class="sentence">${fmtQ(ex.q)}</div>`,
      options: idx.map(i => ex.o[i]),
      correct: idx.indexOf(ex.a),
      onAnswer: ok => { answered(ok); }
    });
  }

  function ptFinish(box) {
    let lvl = 1;
    for (const l of [1, 2, 3]) {
      if (PT.score[l] >= 6) lvl = l + 1; else break; // próg: 6 z 8 (75%)
    }
    S.level = lvl; S.placed = true;
    S.pace = lvl >= 3 ? 12 : 10;
    S.log.push({ d: today(), lvl, placement: true });
    // słowa z poziomów poniżej, które test potwierdził, trafiają od razu do dalszych powtórek
    PT.qs.forEach(q => { if (q.item && q.lvl < lvl) gradeCard(q.item, true, false, true); });
    save();
    box.innerHTML = `<div class="center">
      <h2>Twój poziom startowy: ${LEVELS[lvl]}</h2>
      <p>${LEVEL_DESC[lvl]}</p>
      <div class="ptres">${[1, 2, 3, 4].map(l => `<div><span class="pill sm">${LEVELS[l]}</span> ${PT.score[l]}/8</div>`).join('')}</div>
      <p class="muted small">Żeby przejść poziom, potrzeba 6 z 8 poprawnych. Podstawowe słówka z dużo niższych poziomów nie będą już przeklikiwane – zobaczysz je tylko w zdaniach.</p>
      <div class="actions center"><button class="btn big" id="go2">⚡ Zacznij trening</button></div></div>`;
    $('#go2').onclick = () => startSession(null, 'normal');
    KEYH = null;
  }

  // ---------- ustawienia ----------
  VIEWS.settings = function () {
    const p = PROFILES[cur];
    $('#view').innerHTML = `
      <section class="card">
        <h1>⚙️ Ustawienia – ${p.name}</h1>
        <div class="form">
          <label>Poziom
            <select id="lvl">${[1, 2, 3, 4].map(l => `<option value="${l}" ${l === S.level ? 'selected' : ''}>${LEVELS[l]} – ${LEVEL_DESC[l]}</option>`).join('')}</select>
            <small class="muted">Zmienia się sam w zależności od wyników, ale możesz go ustawić ręcznie.</small>
          </label>
          <label>Nowe słowa na sesję: <b id="pv">${S.pace}</b>
            <input type="range" id="pace" min="${PACE_MIN}" max="${PACE_MAX}" step="1" value="${S.pace}">
            <small class="muted">Też dostosowuje się automatycznie: przy ≥ 90% poprawnych przyspiesza, przy &lt; 60% zwalnia.</small>
          </label>
        </div>
        <h2 class="mt">Synchronizacja i kopia</h2>
        ${SYNC.on
          ? `<p class="small">☁️ Postępy synchronizują się automatycznie między komputerem i telefonem${SYNC.me && SYNC.me.email ? ` (konto <b>${h(SYNC.me.email)}</b>)` : ''}. <button class="link" id="syncnow">Synchronizuj teraz</button></p>`
          : '<p class="muted small">Postępy są zapisane w tej przeglądarce. Aby przenieść je na inne urządzenie, wyeksportuj plik i zaimportuj go tam.</p>'}
        <div class="row-gap">
          <button class="btn ghost" id="exp">⬇️ Eksportuj</button>
          <label class="btn ghost file">⬆️ Importuj<input type="file" id="imp" accept="application/json,.json" hidden></label>
          <a class="btn ghost" href="#/${cur}/test">🎯 Powtórz test poziomujący</a>
        </div>
        <h2 class="mt">Strefa ryzyka</h2>
        <button class="btn danger" id="reset">Wyzeruj postępy (${p.name})</button>
        <div id="msg"></div>
      </section>`;
    if ($('#syncnow')) $('#syncnow').onclick = () => { setDirty(cur, true); syncNow(cur).then(() => flash(SYNC.error ? 'Brak połączenia z serwerem.' : 'Zsynchronizowano ✔', SYNC.error)); };
    $('#lvl').onchange = e => { S.level = +e.target.value; S.log.push({ d: today(), lvl: S.level, manual: true }); save(); flash('Zapisano poziom.'); };
    $('#pace').oninput = e => { $('#pv').textContent = e.target.value; };
    $('#pace').onchange = e => { S.pace = +e.target.value; save(); flash('Zapisano tempo.'); };
    $('#exp').onclick = () => {
      const blob = new Blob([JSON.stringify({ app: 'ponglisz', v: 1, profile: cur, exported: new Date().toISOString(), state: S }, null, 1)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `ponglisz-${cur}-${today()}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    $('#imp').onchange = e => {
      const f = e.target.files[0];
      if (!f) return;
      f.text().then(txt => {
        const data = JSON.parse(txt);
        if (!data || data.app !== 'ponglisz' || !data.state) throw new Error('format');
        if (data.profile !== cur && !confirm(`Ten plik należy do profilu „${(PROFILES[data.profile] || {}).name || data.profile}”. Wczytać go mimo to do profilu ${p.name}?`)) return;
        S = Object.assign(defaultState(), data.state);
        save();
        SYNC.force[cur] = true; syncNow(cur);
        flash('Zaimportowano postępy ✔');
      }).catch(() => flash('Nie udało się wczytać pliku – to nie jest kopia Ponglisz.', true));
    };
    $('#reset').onclick = () => {
      if (!confirm(`Na pewno usunąć wszystkie postępy profilu ${p.name}? Tego nie da się cofnąć (chyba że masz eksport).`)) return;
      S = defaultState(); save(); SESSION = null;
      SYNC.force[cur] = true; syncNow(cur); flash('Postępy wyzerowane.');
    };
    function flash(t, bad) { $('#msg').innerHTML = `<div class="fb ${bad ? 'bad' : 'ok'}">${h(t)}</div>`; }
  };

  // ---------- globalne zdarzenia ----------
  document.addEventListener('click', e => {
    const t = e.target.closest('.theme-toggle button');
    if (t) { e.preventDefault(); e.stopPropagation(); setTheme(t.dataset.theme); return; }
    const b = e.target.closest('[data-say]');
    if (b) { e.preventDefault(); speak(b.dataset.say); }
  });
  document.addEventListener('keydown', e => {
    if (!KEYH) return;
    const tg = e.target.tagName;
    if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT') return;
    if (tg === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    KEYH(e);
  });
  window.addEventListener('hashchange', route);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushOnHide();
    else if (cur) pullAndRefresh(cur);
  });

  // start
  ART.applyTextures();
  setTheme(getTheme());
  // zawsze startujemy od ekranu z suwakiem
  route();
  syncInit().then(me => {
    if (!me || !SYNC.on) return;
    if (cur) pullAndRefresh(cur);
    Object.keys(PROFILES).filter(p => p !== cur).forEach(p => syncNow(p));
  });
})();
