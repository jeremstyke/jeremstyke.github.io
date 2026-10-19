// 18 oct 2026 (Jeremy): every notification in the bot AND in the app. Outside the game, the bot's messages are the phone's own
// notifications (iOS / Android, through Telegram). Inside the game, a new notification slides down from the top like on a phone
// (icon, title, text), tap to open it, swipe up or wait to dismiss. The unread ones show up when the game opens (the 3 latest).
// And the game asks Telegram, once, the permission for the bot to write to the player (players who opened the mini app straight
// from a link never started the bot, so they would get no phone notification at all).
// Data from the Supabase function mct-ton (actions mon_notif and mon_notifread, mct_notif_api).
(() => {
  const TX = { en: { now: 'now', m: 'min', h: 'h', d: 'd' }, fr: { now: 'maintenant', m: 'min', h: 'h', d: 'j' }, id: { now: 'sekarang', m: 'mnt', h: 'j', d: 'h' }, ar: { now: 'الآن', m: 'د', h: 'س', d: 'ي' } };
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] ? l : 'en'; };
  const call = async (a) => { try { return await tonCall({ action: a }); } catch (e) { return null; } };
  const tg = () => (window.Telegram && window.Telegram.WebApp) || {};
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  // the bot texts use a little HTML: keep bold and italics only, everything else is shown as text
  const rich = (s) => ec(s).replace(/&lt;(\/?)(b|i)&gt;/g, '<$1$2>').replace(/\n+/g, ' ');
  const ago = (t) => { const T = TX[lg()], s = t ? (Date.now() - Date.parse(t)) / 1000 : 0; return !(s >= 60) ? T.now : s < 3600 ? Math.floor(s / 60) + ' ' + T.m : s < 86400 ? Math.floor(s / 3600) + ' ' + T.h : Math.floor(s / 86400) + ' ' + T.d; };
  const buzz = () => { try { tg().HapticFeedback.notificationOccurred('success'); } catch (e) {} };

  const st = document.createElement('style');
  st.textContent = '#nbn{position:fixed;left:8px;right:8px;top:calc(8px + env(safe-area-inset-top));z-index:95;max-width:520px;margin:0 auto;display:flex;gap:10px;align-items:flex-start;'
    + 'padding:11px 12px;border-radius:18px;background:rgba(32,22,58,.96);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.12);box-shadow:0 10px 30px rgba(0,0,0,.45);'
    + 'transform:translateY(-140%);transition:transform .35s cubic-bezier(.2,.9,.3,1.2);cursor:pointer;touch-action:none}#nbn.on{transform:translateY(0)}'
    + '#nbn .ic{flex:none;width:38px;height:38px;border-radius:10px;display:grid;place-items:center;font-size:21px;background:linear-gradient(140deg,#ffd43b,#ff9a3c)}'
    + '#nbn .tx{min-width:0;flex:1}#nbn .hd{display:flex;justify-content:space-between;font-size:12px;opacity:.7;margin-bottom:2px}#nbn .hd b{font-weight:700;opacity:1}'
    + '#nbn .bd{font-size:13.5px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}';
  document.head.appendChild(st);

  // what a notification opens inside the game: a coin, the clans, a screen, or just the game
  function open(url) {
    const u = String(url || ''); let m;
    try {
      if ((m = /startapp=c_(\d+)/.exec(u))) return openCoin(Number(m[1]));
      if (/startapp=clan/.test(u) && window.mctClans) return window.mctClans();
      if ((m = /[?&]v=([a-z]+)/.exec(u))) return go(m[1]);
    } catch (e) {}
  }
  // the first emoji of the text becomes the icon, like an app icon on a phone notification
  const icon = (t) => { const m = /^\s*(\p{Extended_Pictographic}\uFE0F?)/u.exec(String(t || '')); return m ? m[1] : '🏛️'; };
  const strip = (t) => String(t || '').replace(/^\s*\p{Extended_Pictographic}\uFE0F?\s*/u, '');

  const Q = []; let busy = false, seen = 0;
  function next() {
    if (busy || !Q.length) return;
    busy = true; const x = Q.shift();
    const d = document.createElement('div'); d.id = 'nbn'; d.setAttribute('role', 'status');
    d.innerHTML = '<span class="ic">' + ec(icon(x.text)) + '</span><span class="tx"><span class="hd"><b>Meme Coin Tycoon</b><span>' + ec(ago(x.at)) + '</span></span><span class="bd">' + rich(strip(x.text)) + '</span></span>';
    document.body.appendChild(d); buzz();
    requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('on')));
    let done = false, y0 = null;
    const close = () => { if (done) return; done = true; d.classList.remove('on'); setTimeout(() => { d.remove(); busy = false; setTimeout(next, 400); }, 380); };
    const t = setTimeout(close, 6000);
    d.onclick = () => { clearTimeout(t); close(); open(x.url); };
    // swipe up to dismiss, like on a phone
    d.addEventListener('touchstart', (e) => { y0 = e.touches[0].clientY; }, { passive: true });
    d.addEventListener('touchmove', (e) => { if (y0 != null && e.touches[0].clientY - y0 < -25) { clearTimeout(t); y0 = null; close(); } }, { passive: true });
  }
  // 19 oct 2026 (Jeremy): a small floating bell keeps every notification: a red dot with the number of new ones,
  // a tap opens the list (the 40 latest), a tap on one opens what it is about. Hidden under a coin page (the sheet covers it).
  const BX = { en: { h: '🔔 Notifications', none: 'No notifications yet.', close: 'Close' }, fr: { h: '🔔 Notifications', none: 'Aucune notification pour l\'instant.', close: 'Fermer' },
    id: { h: '🔔 Notifikasi', none: 'Belum ada notifikasi.', close: 'Tutup' }, ar: { h: '🔔 الإشعارات', none: 'لا توجد إشعارات بعد.', close: 'إغلاق' } };
  const bst = document.createElement('style');
  bst.textContent = '#nbell{position:fixed;right:12px;bottom:calc(var(--tab,68px) + 72px + env(safe-area-inset-bottom));z-index:12;width:46px;height:46px;border-radius:50%;border:1.5px solid rgba(255,212,59,.35);'
    + 'background:rgba(40,20,80,.18);box-shadow:none;display:grid;place-items:center;font-size:22px;cursor:pointer;padding:0;color:inherit;opacity:.45;transition:opacity .3s}'
    // 19 oct 2026 (Jeremy): see-through bell so the bottom line of a page stays readable; full only when something is new
    + '#nbell.on{opacity:1;background:rgba(40,20,80,.55);border-color:rgba(255,212,59,.75)}'
    + '#nbell.ring{animation:nbr 1s ease-in-out 2}@keyframes nbr{0%,100%{transform:rotate(0)}20%{transform:rotate(-18deg)}40%{transform:rotate(14deg)}60%{transform:rotate(-8deg)}80%{transform:rotate(4deg)}}'
    + '#nbell b{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 5px;box-sizing:border-box;border-radius:10px;background:#ff3b5c;color:#fff;font-size:12px;line-height:20px;text-align:center;font-weight:800}'
    + '#nbl{position:fixed;inset:0;z-index:96;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center}'
    + '#nbl .pn{width:100%;max-width:520px;max-height:78vh;overflow:auto;background:#1d1238;border-radius:22px 22px 0 0;padding:14px 14px calc(18px + env(safe-area-inset-bottom));box-sizing:border-box}'
    + '#nbl .ph{display:flex;justify-content:space-between;align-items:center;margin:0 2px 10px}#nbl .ph b{font-size:18px}#nbl .ph button{border:0;background:rgba(255,255,255,.1);color:inherit;border-radius:999px;padding:6px 12px;font:inherit;font-size:13px}'
    + '#nbl .it{display:flex;gap:10px;padding:10px 6px;border-top:1px solid rgba(255,255,255,.07);cursor:pointer}#nbl .it .ic{flex:none;width:34px;height:34px;border-radius:10px;display:grid;place-items:center;font-size:19px;background:rgba(255,212,59,.15)}'
    + '#nbl .it .tx{flex:1;min-width:0;font-size:13.5px;line-height:1.35}#nbl .it small{display:block;opacity:.6;font-size:11.5px;margin-top:2px}#nbl .it.nw .ic{background:linear-gradient(140deg,#ffd43b,#ff9a3c)}#nbl .it.nw .tx{font-weight:600}';
  document.head.appendChild(bst);
  const bell = (() => {
    let list = [], seenB = -1, el = null;
    try { const v = localStorage.getItem('mct_bell'); if (v !== null) seenB = Number(v) || 0; } catch (e) {}
    const save = () => { try { localStorage.setItem('mct_bell', String(seenB)); } catch (e) {} };
    function draw() {
      if (!document.body) return;
      if (!el) { el = document.createElement('button'); el.id = 'nbell'; el.type = 'button'; el.setAttribute('aria-label', 'Notifications'); el.onclick = panel; document.body.appendChild(el); }
      const n = list.filter((x) => x.id > seenB).length;
      el.innerHTML = '🔔' + (n ? '<b>' + (n > 9 ? '9+' : n) + '</b>' : ''); el.classList.toggle('on', !!n);
    }
    function panel() {
      try { tg().HapticFeedback.impactOccurred('light'); } catch (e) {}
      const T = BX[lg()] || BX.en, nw = seenB;
      const d = document.createElement('div'); d.id = 'nbl';
      d.innerHTML = '<div class="pn" role="dialog" aria-modal="true"><div class="ph"><b>' + ec(T.h) + '</b><button type="button">' + ec(T.close) + '</button></div>'
        + (list.length ? list.map((x, i) => '<div class="it' + (x.id > nw ? ' nw' : '') + '" data-i="' + i + '"><span class="ic">' + ec(icon(x.text)) + '</span><span class="tx">' + rich(strip(x.text)) + '<small>' + ec(ago(x.at)) + '</small></span></div>').join('')
          : '<p style="opacity:.7;text-align:center;margin:24px 0">' + ec(T.none) + '</p>') + '</div>';
      const close = () => d.remove();
      d.onclick = (e) => { if (e.target === d) close(); };
      d.querySelector('.ph button').onclick = close;
      d.querySelectorAll('[data-i]').forEach((it) => it.onclick = () => { const x = list[Number(it.dataset.i)]; close(); if (x) open(x.url); });
      document.body.appendChild(d);
      if (list.length) { seenB = Math.max(seenB, list[0].id); save(); draw(); call('mon_notifread'); }
    }
    return {
      update(l) {
        const before = list.filter((x) => x.id > seenB).length;
        list = l.slice(0, 40);
        // the first time, only the notifications not read yet count as new
        if (seenB < 0) { const rd = list.filter((x) => x.read).map((x) => x.id); seenB = rd.length ? Math.max(...rd) : 0; save(); }
        draw();
        if (el && list.filter((x) => x.id > seenB).length > before) { el.classList.remove('ring'); void el.offsetWidth; el.classList.add('ring'); }
      },
    };
  })();
  async function check() {
    const r = await call('mon_notif'); if (!r || !r.ok) return;
    bell.update(r.list || []);
    const fresh = (r.list || []).filter((x) => !x.read && x.id > seen);
    if (!fresh.length) return;
    seen = Math.max(seen, ...fresh.map((x) => x.id));
    // at most the 3 latest at once, oldest first; then they count as read (they stay in the bot's chat)
    fresh.slice(0, 3).reverse().forEach((x) => Q.push(x));
    call('mon_notifread'); next();
  }

  const canWrite = () => { try { return !!(tg().initDataUnsafe.user || {}).allows_write_to_pm; } catch (e) { return false; } };
  function askWrite() { const w = tg(); if (canWrite() || typeof w.requestWriteAccess !== 'function') return; try { w.requestWriteAccess(() => {}); } catch (e) {} }
  // the permission to write is asked at a good moment: right after a buy, at most once every 3 days
  const of = window.fetch;
  window.fetch = async function (u, o) {
    const r = await of.apply(this, arguments);
    try {
      if (!canWrite() && String(u).indexOf('/mct/api') >= 0 && o && typeof o.body === 'string' && /"action":"buy"/.test(o.body)) {
        let last = 0; try { last = Number(localStorage.getItem('mct_wa') || 0); } catch (e) {}
        if (Date.now() - last > 3 * 86400000) { try { localStorage.setItem('mct_wa', String(Date.now())); } catch (e) {} setTimeout(askWrite, 2500); }
      }
    } catch (e) {}
    return r;
  };
  window.mctNotif = { check, show: (text, url) => { Q.push({ text, url }); next(); } };
  // first look 4 s after opening (the game is drawn), then every 5 min while the game is open
  // (18 oct 2026: every 30 s was too heavy for the base when many players arrived at once)
  setTimeout(check, 4000);
  setInterval(() => { if (!document.hidden) check(); }, 300000);
})();
