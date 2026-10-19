// 18 oct 2026 (Jeremy): when too many players arrive at once and the server is slow or down, a nice "busy" screen
// instead of a frozen game: "So many players right now, please wait". It shows when a call of the game takes more than
// 4 s (later for a player whose connection is always slow: a small pill instead) or fails (502, 503, 504, network), and goes away by itself as soon as a call works again. Each showing is counted. While it is shown,
// the page is reloaded after 30 s if the game never managed to load, and the server is checked again every 10 s. Loaded in <head>, before the game, so every call is watched.
(() => {
  const TX = {
    en: { h: 'So many players right now!', s: 'The game is very busy at the moment. Please wait a few seconds, it continues by itself.', b: '🔄 Try again', w: 'Your money and your coins are safe.' },
    fr: { h: 'Trop de joueurs en même temps !', s: 'Le jeu est très demandé en ce moment. Patiente quelques secondes, ça repart tout seul.', b: '🔄 Réessayer', w: 'Ton argent et tes coins sont en sécurité.' },
    id: { h: 'Pemain sedang sangat banyak!', s: 'Game sedang sangat ramai. Tunggu beberapa detik, nanti lanjut sendiri.', b: '🔄 Coba lagi', w: 'Uang dan koinmu aman.' },
    ar: { h: 'عدد كبير جدًا من اللاعبين الآن!', s: 'اللعبة مزدحمة جدًا حاليًا. انتظر بضع ثوانٍ، وستستمر تلقائيًا.', b: '🔄 أعد المحاولة', w: 'أموالك وعملاتك في أمان.' },
  };
  // 19 oct 2026 (Jeremy): when the problem is the player's own connection, the screen says so (and not "so many players")
  const TXN = {
    en: { h: 'Your connection is slow', s: 'Your network is having trouble reaching the game. It continues by itself as soon as it gets better.', b: '🔄 Try again', w: 'Your money and your coins are safe.' },
    fr: { h: 'Ta connexion est lente', s: 'Ton réseau a du mal à joindre le jeu. Ça repart tout seul dès qu\'il va mieux.', b: '🔄 Réessayer', w: 'Ton argent et tes coins sont en sécurité.' },
    id: { h: 'Koneksimu lambat', s: 'Jaringanmu kesulitan menjangkau game. Akan lanjut sendiri saat membaik.', b: '🔄 Coba lagi', w: 'Uang dan koinmu aman.' },
    ar: { h: 'اتصالك بطيء', s: 'شبكتك تواجه صعوبة في الوصول إلى اللعبة. ستستمر تلقائيًا عندما يتحسن الاتصال.', b: '🔄 أعد المحاولة', w: 'أموالك وعملاتك في أمان.' },
  };
  const lg = () => {
    let l = ''; try { l = LANG; } catch (e) {}
    if (!l) { try { l = localStorage.getItem('mct_lang') || ''; } catch (e) {} }
    if (!l) { try { l = (window.Telegram.WebApp.initDataUnsafe.user || {}).language_code || ''; } catch (e) {} }
    l = String(l || navigator.language || 'en');
    return /^fr/.test(l) ? 'fr' : /^ar/.test(l) ? 'ar' : /^(id|ms)/.test(l) ? 'id' : 'en';
  };
  const watched = (u) => { const s = String((u && u.url) || u || ''); return s.indexOf('/mct/api') >= 0 || s.indexOf('/functions/v1/mct-ton') >= 0; };

  let ov = null, okOnce = false, failAt = 0, reloadT = null, lastProbe = 0, demo = false;
  const pending = new Map(); let seq = 0;
  // each showing is counted (mct_busy_log, action mon_busy): when, how long and why; kept in the phone until it can be sent
  const TONF = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-ton';
  let shownAt = 0, shownKind = '';
  function report() {
    let q = []; try { q = JSON.parse(localStorage.getItem('mct_busyq') || '[]'); } catch (e) {}
    let id = ''; try { id = window.Telegram.WebApp.initData || ''; } catch (e) {}
    if (!q.length || !id) return;
    try { localStorage.removeItem('mct_busyq'); } catch (e) {}
    q.slice(-10).forEach((x) => { of(TONF, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.assign({ initData: id, action: 'mon_busy' }, x)) }).catch(() => {}); });
  }
  function note(secs) {
    try { const q = JSON.parse(localStorage.getItem('mct_busyq') || '[]'); q.push({ at: shownAt, secs, kind: shownKind }); localStorage.setItem('mct_busyq', JSON.stringify(q.slice(-10))); } catch (e) {}
  }
  function show(kind) {
    if (ov || document.getElementById('mtov')) return; // the maintenance screen has priority
    if (!document.body) return;
    shownAt = Date.now(); shownKind = kind === 'down' ? 'down' : kind === 'net' ? 'net' : 'slow'; if (!demo) note(0);
    const T = (kind === 'net' ? TXN : TX)[lg()];
    if (!document.getElementById('busyst')) {
      const st = document.createElement('style'); st.id = 'busyst';
      st.textContent = '#busyov{position:fixed;inset:0;z-index:9998;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(120% 70% at 50% 0%,#4a1691 0%,#1a0638 65%);color:#f7f1ff;text-align:center;font-family:"Bricolage Grotesque",system-ui,sans-serif;animation:busyin .3s ease}'
        + '@keyframes busyin{from{opacity:0}to{opacity:1}}'
        + '#busyov .bx{max-width:340px}#busyov .em{font-size:64px;line-height:1;display:inline-block;animation:busyb 1.4s ease-in-out infinite}'
        + '@keyframes busyb{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-10px) rotate(6deg)}}'
        + '#busyov h2{margin:18px 0 8px;font-size:22px;line-height:1.2}#busyov p{margin:0 0 6px;opacity:.85;font-size:15px;line-height:1.45}'
        + '#busyov .dots{display:flex;gap:7px;justify-content:center;margin:18px 0}#busyov .dots i{width:9px;height:9px;border-radius:50%;background:#ffd43b;animation:busyd 1.2s infinite ease-in-out}'
        + '#busyov .dots i:nth-child(2){animation-delay:.15s}#busyov .dots i:nth-child(3){animation-delay:.3s}'
        + '@keyframes busyd{0%,80%,100%{opacity:.25;transform:scale(.8)}40%{opacity:1;transform:scale(1.1)}}'
        + '#busyov button{margin-top:10px;padding:12px 22px;border:0;border-radius:14px;background:#ffd43b;color:#1a0638;font:inherit;font-weight:800;cursor:pointer}'
        + '#busyov small{display:block;margin-top:14px;opacity:.6;font-size:12.5px}';
      document.head.appendChild(st);
    }
    ov = document.createElement('div'); ov.id = 'busyov'; ov.setAttribute('role', 'alert');
    ov.innerHTML = '<div class="bx"><span class="em">🚦</span><h2></h2><p></p><div class="dots"><i></i><i></i><i></i></div><button type="button"></button><small></small></div>';
    if (kind === 'net') ov.querySelector('.em').textContent = '📶';
    ov.querySelector('h2').textContent = T.h; ov.querySelector('p').textContent = T.s;
    ov.querySelector('button').textContent = T.b; ov.querySelector('small').textContent = T.w;
    ov.querySelector('button').onclick = () => { try { window.Telegram.WebApp.HapticFeedback.impactOccurred('light'); } catch (e) {} location.reload(); };
    document.body.appendChild(ov);
    // the game never loaded: try again by itself every 30 s
    if (!okOnce && !reloadT) reloadT = setTimeout(() => location.reload(), 30000);
  }
  function hide() {
    if (reloadT) { clearTimeout(reloadT); reloadT = null; }
    if (!ov) return; const o = ov; ov = null;
    // the last line of the queue is this showing: its length is now known
    try { const q = JSON.parse(localStorage.getItem('mct_busyq') || '[]'); if (q.length && q[q.length - 1].at === shownAt) { q[q.length - 1].secs = Math.round((Date.now() - shownAt) / 1000); localStorage.setItem('mct_busyq', JSON.stringify(q)); } } catch (e) {}
    setTimeout(report, 2000);
    o.style.transition = 'opacity .3s'; o.style.opacity = '0'; setTimeout(() => o.remove(), 320);
  }
  // 18 oct 2026 (Jeremy): only when the player is really stuck: the calls made while the game loads (first 15 s) or right after
  // he touched something (1.5 s). A slow call in the background (notifications, refreshes) never covers the screen.
  const T0 = Date.now(); let lastTap = 0;
  ['pointerdown', 'touchstart', 'click'].forEach((ev) => document.addEventListener(ev, () => { lastTap = Date.now(); }, true));
  const isUser = () => Date.now() - T0 < 15000 || Date.now() - lastTap < 1500;
  // 18 oct 2026 (Jeremy): the speed of each player's own connection. A player whose calls are always slow (far country, VPN)
  // gets a later limit and a small "slow connection" pill that does not block the screen; the big screen stays for real
  // problems (server down, or a usually fast player suddenly stuck). Baseline = the 25 % fastest of his last 30 calls.
  const durs = [];
  const base = () => { if (durs.length < 6) return 0; const a = durs.slice().sort((x, y) => x - y); return a[Math.floor(a.length * 0.25)]; };
  const slowConn = () => base() > 1500;
  const thr = () => slowConn() ? Math.max(4000, Math.min(15000, base() * 4)) : 4000;
  const stuck = () => { const l = thr(); return [...pending.values()].some((p) => p.user && Date.now() - p.t > l); };
  const PX = { en: '⏳ Slow connection…', fr: '⏳ Connexion lente…', id: '⏳ Koneksi lambat…', ar: '⏳ اتصال بطيء…' };
  let pillEl = null;
  function pill(on) {
    if (!on) { if (pillEl) { pillEl.remove(); pillEl = null; } return; }
    if (pillEl || ov || !document.body) return;
    pillEl = document.createElement('div'); pillEl.id = 'busypill'; pillEl.setAttribute('role', 'status');
    pillEl.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);top:calc(10px + env(safe-area-inset-top));z-index:9997;padding:7px 14px;border-radius:999px;background:rgba(26,6,56,.92);border:1px solid rgba(255,212,59,.45);color:#f7f1ff;font:600 13px "Bricolage Grotesque",system-ui,sans-serif;pointer-events:none;box-shadow:0 6px 18px rgba(0,0,0,.35)';
    pillEl.textContent = PX[lg()] || PX.en;
    document.body.appendChild(pillEl);
  }
  const of = window.fetch;
  // 18 oct 2026 (Jeremy): the game opening sent 10 to 15 calls at the very same moment, and they queued on the server. Now, during
  // the first 10 s, the calls of the screen the player sees (me, market, news, missions, steps) go first; the calls of the extra
  // parts (profile, ads, premium, notifications, clan, videos...) wait until those have answered, then go 2 at a time.
  // A call made right after a tap never waits.
  const MAIN = /"action":"(me|market|news|missions|steps|ping|lang)"/;
  const gate = []; let mainOn = 0, extraOn = 0, mainEnd = 0;
  const bootOver = () => Date.now() - T0 > 10000;
  const pump = () => {
    while (gate.length && (bootOver() || (mainOn === 0 && extraOn < 2 && Date.now() - T0 > 800 && Date.now() - mainEnd > 400))) { extraOn++; gate.shift()(); }
    if (gate.length) setTimeout(pump, 250);
  };
  window.fetch = function (u, o) {
    if (!watched(u)) return of.apply(this, arguments);
    const self = this, args = arguments, user = isUser();
    let body = ''; try { body = (o && typeof o.body === 'string') ? o.body : ''; } catch (e) {}
    const isMain = String((u && u.url) || u || '').indexOf('/mct/api') >= 0 && MAIN.test(body);
    const tapped = Date.now() - lastTap < 1500;
    if (isMain || tapped || bootOver()) { if (isMain) mainOn++; return send(self, args, user, () => { if (isMain) { mainOn--; mainEnd = Date.now(); setTimeout(pump, 450); } }); }
    return new Promise((ok) => { gate.push(ok); pump(); }).then(() => send(self, args, user, () => { extraOn--; pump(); }));
  };
  function send(self, args, user, done) {
    const id = ++seq, pending_t = Date.now(); pending.set(id, { t: pending_t, user });
    const p = of.apply(self, args);
    p.then(done, done);
    return p.then((r) => {
      pending.delete(id);
      if (r.status === 502 || r.status === 503 || r.status === 504) { if (user) { failAt = Date.now(); show('down'); } }
      else {
        if (r.ok) { okOnce = true; durs.push(Date.now() - pending_t); if (durs.length > 30) durs.shift(); }
        failAt = 0; if (!stuck()) { hide(); pill(false); }
      }
      return r;
    }, (e) => { pending.delete(id); if (user && navigator.onLine !== false) { failAt = Date.now(); judge('down'); } throw e; });
  }
  // 19 oct 2026 (Jeremy): before the big screen, a tiny file from GitHub (a fast network, not our server) is read: if it does not come
  // within 2.5 s either, the player's own connection is the problem, and the screen says so (📶) instead of "so many players" (🚦)
  // the test starts as soon as a call of the player takes more than 1.5 s, so the answer is ready when the 4 s are reached
  let judging = false, probeAt = 0, netBad = null, probing = false;
  function probe() {
    if (probing || Date.now() - probeAt < 10000) return; probing = true;
    const t0 = Date.now(); let done = false;
    const fin = (bad) => { if (done) return; done = true; probing = false; probeAt = Date.now(); netBad = bad; };
    setTimeout(() => fin(true), 2500);
    of('https://jeremstyke.github.io/mct/_chk.txt?t=' + t0, { cache: 'no-store' }).then((r) => fin(!r.ok), () => fin(true));
  }
  function judge(kind) {
    if (judging || ov) return;
    if (netBad !== null && Date.now() - probeAt < 10000) { show(netBad ? 'net' : kind); return; }
    judging = true; probe();
    const w = setInterval(() => { if (probing) return; clearInterval(w); judging = false; if (kind === 'slow' && !stuck()) return; show(netBad ? 'net' : kind); }, 200);
  }
  // a call of the player that takes more than 4 s shows the screen; it goes away when the calls answer again
  setInterval(() => {
    // 19 oct 2026 (Jeremy): after a rewarded video the game sometimes could not scroll any more: the Ads Galaxy SDK blocks the page
    // (body overflow hidden) while its video is shown and does not always give it back (app put in the background, other ad networks).
    // As soon as no video is on the screen, the page can scroll again.
    try { const bd = document.body, hl = document.documentElement; if (bd && !document.querySelector('.agx-rewarded-overlay,[data-agx-loading]')) { if (bd.style.overflow === 'hidden') bd.style.overflow = ''; if (hl.style.overflow === 'hidden') hl.style.overflow = ''; } } catch (e) {}
    if ([...pending.values()].some((q) => q.user && Date.now() - q.t > 1500)) probe();
    if (stuck()) { if (slowConn() && !ov) pill(true); else if (!ov) judge('slow'); }
    else { pill(false); if (ov && !demo && !failAt) hide(); }
    // after a failure, a light check every 10 s: as soon as the server answers again, the screen goes away
    if (ov && failAt && !pending.size && Date.now() - lastProbe > 10000) {
      lastProbe = Date.now();
      window.fetch('/mct/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"action":"ping"}' }).catch(() => {});
    }
  }, 1000);
  setTimeout(() => { if (okOnce && !ov) report(); }, 15000);
  // 18 oct 2026 (Jeremy): a link ?startapp=busytest shows the screen for 30 s, to see it (not counted, never reloads the page)
  try {
    if ((window.Telegram.WebApp.initDataUnsafe || {}).start_param === 'busytest') {
      setTimeout(() => { demo = true; okOnce = true; show('slow'); setTimeout(() => { demo = false; hide(); }, 30000); }, 2500);
    }
  } catch (e) {}
  window.mctBusy = { show, hide };
})();
