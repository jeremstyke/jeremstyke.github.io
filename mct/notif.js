// 18 oct 2026 (Jeremy): every notification in the bot AND in the app. A 🔔 in the header with the unread count opens the player's
// inbox (everything the game sent him or queued for him: reminders, clans, dividend, TON, news). And the game asks Telegram, once,
// the permission for the bot to write to him (players who opened the mini app straight from a link never started the bot).
// Data from the Supabase function mct-ton (actions mon_notif and mon_notifread, mct_notif_api).
(() => {
  const TX = {
    en: { t: '🔔 Notifications', none: 'Nothing yet. Your rewards, clan news and reminders will show up here.', ask: '🔔 Get them in the bot too', asked: '✅ The bot can write to you', close: 'Close', now: 'now', m: (n) => n + ' min', h: (n) => n + ' h', d: (n) => n + ' d' },
    fr: { t: '🔔 Notifications', none: 'Rien pour l\'instant. Tes récompenses, ton clan et tes rappels s\'afficheront ici.', ask: '🔔 Les recevoir aussi dans le bot', asked: '✅ Le bot peut t\'écrire', close: 'Fermer', now: 'maintenant', m: (n) => n + ' min', h: (n) => n + ' h', d: (n) => n + ' j' },
    id: { t: '🔔 Notifikasi', none: 'Belum ada. Hadiah, kabar klan dan pengingatmu akan muncul di sini.', ask: '🔔 Terima juga di bot', asked: '✅ Bot bisa menulis kepadamu', close: 'Tutup', now: 'sekarang', m: (n) => n + ' mnt', h: (n) => n + ' j', d: (n) => n + ' h' },
    ar: { t: '🔔 الإشعارات', none: 'لا شيء بعد. ستظهر هنا مكافآتك وأخبار عشيرتك والتذكيرات.', ask: '🔔 استلمها في البوت أيضًا', asked: '✅ يمكن للبوت مراسلتك', close: 'إغلاق', now: 'الآن', m: (n) => n + ' د', h: (n) => n + ' س', d: (n) => n + ' ي' },
  };
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] ? l : 'en'; };
  const L = () => TX[lg()];
  const hp = () => { try { haptic(); } catch (e) {} };
  const call = async (a) => { try { return await tonCall({ action: a }); } catch (e) { return null; } };
  const tg = () => (window.Telegram && window.Telegram.WebApp) || {};
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  // the bot texts use a little HTML: keep bold and italics only, everything else is shown as text
  const rich = (s) => ec(s).replace(/&lt;(\/?)(b|i)&gt;/g, '<$1$2>').replace(/\n/g, '<br>');
  const ago = (t) => { const T = L(), s = (Date.now() - Date.parse(t)) / 1000; return s < 60 ? T.now : s < 3600 ? T.m(Math.floor(s / 60)) : s < 86400 ? T.h(Math.floor(s / 3600)) : T.d(Math.floor(s / 86400)); };
  let N = null, T0 = 0;

  const st = document.createElement('style');
  st.textContent = '.top .wallet .lng{white-space:nowrap}#ntb{position:relative}#ntb i{position:absolute;top:-4px;right:-4px;min-width:16px;height:16px;padding:0 4px;border-radius:99px;background:#ff4d6d;color:#fff;font-size:10px;font-style:normal;font-weight:800;line-height:16px;text-align:center;box-sizing:border-box}'
    + '#ntm{position:fixed;inset:0;z-index:90;background:rgba(5,3,15,.72);display:flex;align-items:flex-end;justify-content:center}#ntm>div{width:100%;max-width:520px;max-height:85vh;overflow:auto;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:18px 16px calc(20px + env(safe-area-inset-bottom))}'
    + '#ntm .n{border-bottom:1px solid var(--line,rgba(255,255,255,.1));padding:10px 0;font-size:13.5px;line-height:1.45}#ntm .n.u{border-left:3px solid #ffd43b;padding-left:9px}#ntm .n small{display:block;opacity:.6;font-size:11px;margin-top:3px}'
    + '#ntm .n button{margin-top:6px;border:0;border-radius:10px;padding:7px 10px;font-weight:700;font-size:12.5px;background:rgba(255,255,255,.1);color:inherit;cursor:pointer}'
    + '#ntm .wa{width:100%;border:0;border-radius:12px;padding:10px;font-weight:800;font-size:13.5px;background:#ffd43b;color:#1a1200;margin:0 0 10px;cursor:pointer}';
  document.head.appendChild(st);

  // what a notification button opens inside the game: a coin, the clans, a screen, or just the game
  function open(url) {
    const u = String(url || ''); let m;
    try {
      if ((m = /startapp=c_(\d+)/.exec(u))) return openCoin(Number(m[1]));
      if (/startapp=clan/.test(u) && window.mctClans) return window.mctClans();
      if ((m = /[?&]v=([a-z]+)/.exec(u))) return go(m[1]);
    } catch (e) {}
  }
  function badge() {
    const b = document.getElementById('ntb'); if (!b) return;
    const n = N ? Number(N.unread) || 0 : 0; b.innerHTML = '🔔' + (n ? '<i>' + (n > 9 ? '9+' : n) + '</i>' : '');
  }
  async function load(force) { if (!force && N && Date.now() - T0 < 60000) return N; const r = await call('mon_notif'); if (r && r.ok) { N = r; T0 = Date.now(); } badge(); return N; }
  const canWrite = () => { try { return !!(tg().initDataUnsafe.user || {}).allows_write_to_pm; } catch (e) { return false; } };
  let granted = false;
  function askWrite(cb) {
    const w = tg(); if (granted || canWrite() || typeof w.requestWriteAccess !== 'function') return cb && cb(true);
    try { w.requestWriteAccess((ok) => { granted = !!ok; if (cb) cb(!!ok); }); } catch (e) { if (cb) cb(false); }
  }
  async function sheet() {
    hp(); const T = L(); await load(true);
    const old = document.getElementById('ntm'); if (old) old.remove();
    const d = document.createElement('div'); d.id = 'ntm';
    const list = (N && N.list) || [];
    d.innerHTML = '<div><h2 style="margin:0 0 12px">' + ec(T.t) + '</h2>'
      + (canWrite() || granted ? '' : '<button type="button" class="wa" id="ntw">' + ec(T.ask) + '</button>')
      + (list.length ? list.map((x, i) => '<div class="n' + (x.read ? '' : ' u') + '">' + rich(x.text) + '<small>' + ec(ago(x.at)) + '</small>' + (x.btn ? '<button type="button" data-i="' + i + '">' + ec(x.btn) + '</button>' : '') + '</div>').join('') : '<p class="hint">' + ec(T.none) + '</p>')
      + '<button class="ghost" id="ntc" style="width:100%;margin-top:12px">' + ec(T.close) + '</button></div>';
    d.onclick = (ev) => { if (ev.target === d) d.remove(); };
    document.body.appendChild(d);
    d.querySelector('#ntc').onclick = () => { hp(); d.remove(); };
    const wb = d.querySelector('#ntw'); if (wb) wb.onclick = () => { hp(); askWrite((ok) => { if (ok) wb.outerHTML = '<p class="hint" style="margin:0 0 10px">' + ec(T.asked) + '</p>'; }); };
    d.querySelectorAll('[data-i]').forEach((b) => b.onclick = () => { hp(); d.remove(); open(list[Number(b.dataset.i)].url); });
    if (N && N.unread) { call('mon_notifread'); N.unread = 0; badge(); }
  }
  function mount() {
    if (document.getElementById('ntb')) return;
    const cash = document.getElementById('cash'); if (!cash || !cash.parentNode) return;
    const b = document.createElement('button'); b.className = 'lng'; b.id = 'ntb'; b.type = 'button'; b.setAttribute('aria-label', 'Notifications');
    b.onclick = sheet; cash.parentNode.insertBefore(b, cash); badge(); load();
    // room for the bell: the FAQ button keeps only its ❓ and the header buttons stay on one line
    const fq = document.getElementById('faqtop'); if (fq) fq.textContent = '❓';
  }
  // the permission to write is asked once, at a good moment: right after the player's first buy of the session
  const of = window.fetch;
  window.fetch = async function (u, o) {
    const r = await of.apply(this, arguments);
    try {
      if (!canWrite() && String(u).indexOf('/mct/api') >= 0 && o && typeof o.body === 'string' && /"action":"buy"/.test(o.body)) {
        let last = 0; try { last = Number(localStorage.getItem('mct_wa') || 0); } catch (e) {}
        if (Date.now() - last > 3 * 86400000) { try { localStorage.setItem('mct_wa', String(Date.now())); } catch (e) {} setTimeout(() => askWrite(), 2500); }
      }
    } catch (e) {}
    return r;
  };
  window.mctNotif = { load, open: sheet };
  setInterval(() => { mount(); if (N && Date.now() - T0 > 60000) load(); }, 1000);
})();
