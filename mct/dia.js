// 16 oct 2026 (Jeremy): the diamond inside Meme Coin Tycoon. A small 💎 at the top, next to the FAQ: tap it and earn real TON,
// kept in the diamond until the player taps "Add to my balance" (16 oct 2026: not automatic any more), then paid every Monday from $0.10.
// The rate changes every day (3,500 to 10,000 taps per $0.01) and is announced every morning on @memecointycoon.
// +10 % for subscribers of @memecointycoon and +10 % for subscribers of @jeremstyke. A weekly contest of the best tappers.
// The server counts every tap, limits the speed and asks a human check (Supabase function mct-ton: dia, dia_tap, dia_check).
(() => {
  const TX = {
    en: {
      t: 'Diamond', mine: 'In my diamond', claim: (v) => '➕ Add ' + v + ' to my balance', claim0: '➕ Add to my balance', solde: (v) => '👛 My TON balance: ' + v, added: (v) => '✅ ' + v + ' added to your balance', none: 'Keep tapping: from $0.01 you can add it to your balance', today: 'Today', taps: 'taps', rate: (n) => 'Rate of the day: ' + n + ' taps = $0.01',
      lead: 'Tap the diamond, it moves every 50 taps', pay: 'Your earnings wait in the diamond: tap "Add to my balance" to get them. Your balance is paid every Monday from $0.10 to your TON wallet.',
      check: 'Quick check: tap the 💎', wrong: 'Wrong one, try again', paused: 'The diamond is resting until next month. Come back soon!', off: 'The diamond is closed for now.',
      bon: 'Subscriber bonus', bm: '📢 Meme Coin Tycoon channel', bj: '📢 Jeremstyke channel', join: 'Join', on: '✅ +10 %', recheck: '🔄 I joined',
      con: '🏆 Diamond contest of the week', ends: 'Ends in', you: 'you', nobody: 'Nobody yet: be the first!', rank: 'Your rank', prizes: 'Monday prizes in TON',
      wal: '👛 My TON wallet', err: 'Connection problem, try again.', close: 'Close',
    },
    fr: {
      t: 'Diamant', mine: 'Dans mon diamant', claim: (v) => '➕ Ajouter ' + v + ' à mon solde', claim0: '➕ Ajouter à mon solde', solde: (v) => '👛 Mon solde TON : ' + v, added: (v) => '✅ ' + v + ' ajouté à ton solde', none: 'Continue de taper : dès 0,01 $ tu peux l\'ajouter à ton solde', today: 'Aujourd\'hui', taps: 'tapes', rate: (n) => 'Taux du jour : ' + n + ' tapes = 0,01 $',
      lead: 'Tape le diamant, il bouge toutes les 50 tapes', pay: 'Tes gains restent dans le diamant : appuie sur "Ajouter à mon solde" pour les récupérer. Ton solde est payé chaque lundi dès 0,10 $ sur ton portefeuille TON.',
      check: 'Petite vérification : touche le 💎', wrong: 'Pas le bon, réessaie', paused: 'Le diamant se repose jusqu\'au mois prochain. Reviens bientôt !', off: 'Le diamant est fermé pour le moment.',
      bon: 'Bonus abonné', bm: '📢 Chaîne Meme Coin Tycoon', bj: '📢 Chaîne Jeremstyke', join: 'S\'abonner', on: '✅ +10 %', recheck: '🔄 Je suis abonné',
      con: '🏆 Concours du diamant de la semaine', ends: 'Fin dans', you: 'toi', nobody: 'Personne pour l\'instant : sois le premier !', rank: 'Ton rang', prizes: 'Gains du lundi en TON',
      wal: '👛 Mon portefeuille TON', err: 'Problème de connexion, réessaie.', close: 'Fermer',
    },
    ar: {
      t: 'الماسة', mine: 'في ماستي', claim: (v) => '➕ أضف ' + v + ' إلى رصيدي', claim0: '➕ أضف إلى رصيدي', solde: (v) => '👛 رصيد TON: ' + v, added: (v) => '✅ أُضيف ' + v + ' إلى رصيدك', none: 'واصل الضغط: ابتداءً من ‎0.01 $ يمكنك إضافتها إلى رصيدك', today: 'اليوم', taps: 'ضغطة', rate: (n) => 'سعر اليوم: ' + n + ' ضغطة = ‎0.01 $',
      lead: 'اضغط على الماسة، تتحرك كل 50 ضغطة', pay: 'أرباحك تبقى في الماسة: اضغط "أضف إلى رصيدي" لاستلامها. يُدفع رصيدك كل يوم اثنين ابتداءً من ‎0.10 $ إلى محفظة TON.',
      check: 'تحقق سريع: اضغط على 💎', wrong: 'ليست هي، حاول مرة أخرى', paused: 'الماسة في استراحة حتى الشهر القادم. عُد قريبًا!', off: 'الماسة مغلقة حاليًا.',
      bon: 'مكافأة المشترك', bm: '📢 قناة Meme Coin Tycoon', bj: '📢 قناة Jeremstyke', join: 'اشترك', on: '✅ ‎+10 %', recheck: '🔄 اشتركت',
      con: '🏆 مسابقة الماسة لهذا الأسبوع', ends: 'تنتهي خلال', you: 'أنت', nobody: 'لا أحد بعد: كن الأول!', rank: 'ترتيبك', prizes: 'جوائز يوم الاثنين بعملة TON',
      wal: '👛 محفظة TON', err: 'مشكلة في الاتصال، حاول مرة أخرى.', close: 'إغلاق',
    },
  };
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] ? l : 'en'; };
  const L = () => TX[lg()];
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const nf = (n) => Number(n || 0).toLocaleString(lg() === 'fr' ? 'fr-FR' : 'en-US');
  const usd = (v, d) => { const x = Number(v || 0).toFixed(d == null ? 2 : d); return lg() === 'fr' ? x.replace('.', ',') + ' $' : '$' + x; };
  const call = (b) => tonCall(b);
  // 16 oct 2026: "Add to my balance" goes through the function mct-fr (initData checked there)
  const claimCall = async () => (await fetch('https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-fr', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: Telegram.WebApp.initData, action: 'claim' }) })).json();
  const open = (u) => { try { Telegram.WebApp.openTelegramLink(u); } catch (e) { location.href = u; } };

  let S = null, Q = 0, BUSY = false, TIMER = null, CNT = 0, POS = { x: 50, y: 50 };

  const st = document.createElement('style');
  st.textContent = '#diatop{padding:4px 8px;font-size:15px;line-height:1}'
    + '#diam{position:fixed;inset:0;z-index:9998;background:rgba(5,3,15,.78);display:flex;align-items:flex-end;justify-content:center}'
    + '#diam .dbox{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:16px 16px calc(20px + env(safe-area-inset-bottom))}'
    + '#diam .dtop{display:flex;align-items:center;justify-content:space-between;margin:0 0 10px}#diam .dtop b{font-size:18px}#diam .dx{background:none;border:0;color:inherit;font-size:22px;opacity:.7;cursor:pointer;padding:4px 8px}'
    + '#diam .dc{border:1px solid var(--line,rgba(255,255,255,.12));border-radius:16px;padding:14px;margin:0 0 12px;background:rgba(255,255,255,.03)}'
    + '#diam .dl{font-size:12px;opacity:.7;text-transform:uppercase;letter-spacing:.04em}#diam .dbig{font-size:34px;font-weight:800;color:#2ee6ff;margin:2px 0}'
    + '#diam .dbar{height:8px;border-radius:9px;background:rgba(255,255,255,.1);overflow:hidden;margin:6px 0 4px}#diam .dbar i{display:block;height:100%;width:0;background:#2ee6ff;transition:width .15s}'
    + '#diam .dsm{font-size:13px;opacity:.8;margin:2px 0}#diam .dnote{font-size:12px;opacity:.7;margin:10px 0 0}'
    + '#darea{position:relative;height:230px;border-radius:16px;background:rgba(46,230,255,.06);overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;margin:10px 0 0}'
    + '#dgem{position:absolute;transform:translate(-50%,-50%);width:104px;height:104px;border-radius:50%;border:0;background:radial-gradient(circle at 35% 30%,#bff6ff,#2ee6ff 45%,#0b6c80);font-size:54px;cursor:pointer;box-shadow:0 10px 30px rgba(46,230,255,.35);transition:left .25s,top .25s}'
    + '#diam .drow{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:14px;padding:6px 0}#diam .drow.me{color:#ffd43b;font-weight:700}'
    + '#diam .dsub{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 0;font-size:14px}#diam .dsub button{width:auto;padding:6px 12px;margin:0;font-size:13px}#diam .dok{color:#7dff6b;font-weight:800}';
  document.head.appendChild(st);

  // the small 💎 at the top, right before the FAQ
  function addBtn() {
    if (document.getElementById('diatop')) return true;
    const f = document.getElementById('faqtop'); if (!f) return false;
    const b = document.createElement('button'); b.className = 'lng'; b.id = 'diatop'; b.setAttribute('aria-label', 'Diamond'); b.textContent = '💎';
    b.onclick = () => { hp(); show(); };
    f.parentNode.insertBefore(b, f); return true;
  }
  if (!addBtn()) { let n = 0; const w = setInterval(() => { if (addBtn() || ++n > 80) clearInterval(w); }, 250); }

  function cd(end) { const x = Math.max(0, Math.floor((Date.parse(end) - Date.now()) / 1000)), d = Math.floor(x / 86400), p = (n) => String(n).padStart(2, '0'); return (d ? d + (lg() === 'fr' ? 'j ' : 'd ') : '') + p(Math.floor(x % 86400 / 3600)) + ':' + p(Math.floor(x % 3600 / 60)) + ':' + p(x % 60); }
  setInterval(() => { const e = document.getElementById('dcd'); if (e && S && S.contest) e.textContent = cd(S.contest.ends); }, 1000);

  function closeIt() { const d = document.getElementById('diam'); if (d) d.remove(); flush(); }
  async function show() {
    let d = document.getElementById('diam');
    if (!d) {
      d = document.createElement('div'); d.id = 'diam';
      d.innerHTML = '<div class="dbox"><div class="dtop"><b>💎 ' + ec(L().t) + '</b><button class="dx" id="dx" aria-label="' + ec(L().close) + '">✕</button></div><div id="dbody" style="text-align:center;padding:30px 0">⏳</div></div>';
      d.onclick = (e) => { if (e.target === d) closeIt(); };
      document.body.appendChild(d);
      d.querySelector('#dx').onclick = () => { hp(); closeIt(); };
    }
    let r = null; try { r = await call({ action: 'dia' }); } catch (e) {}
    if (!r || !r.state) { const b = document.getElementById('dbody'); if (b) b.textContent = L().err; return; }
    S = r.state; paint();
  }

  function nums() {
    if (!S) return;
    const tpc = Number(S.tpc || 5000), pend = Number(S.pending_taps || 0) + Q;
    const bal = Number(S.balance || 0) + Q / tpc * 0.01;
    const u = document.getElementById('dusd'), b = document.getElementById('dbar'), n = document.getElementById('dtoday');
    if (u) u.textContent = usd(bal, bal < 1 ? 4 : 2);
    if (b) b.style.width = Math.min(100, (pend % tpc) / tpc * 100).toFixed(1) + '%';
    if (n) n.textContent = L().today + ' : ' + nf(Number(S.today || 0) + Q) + ' ' + L().taps;
    // what "Add to my balance" moves now: the diamond + the full cents tapped
    const pot = Number(S.claim || 0) - Math.floor(Number(S.pending_taps || 0) / tpc) * 0.01, can = Math.max(0, pot + Math.floor(pend / tpc) * 0.01);
    const cb = document.getElementById('dclaim'), so = document.getElementById('dsolde');
    if (cb) { cb.disabled = can < 0.009; cb.style.opacity = can < 0.009 ? '.45' : '1'; cb.textContent = can < 0.009 ? L().claim0 : L().claim(usd(can)); }
    if (so) so.textContent = L().solde(usd(S.solde, Number(S.solde || 0) < 1 ? 4 : 2));
  }

  function paint() {
    const b = document.getElementById('dbody'); if (!b || !S) return;
    const T = L(), c = S.contest || {}, md = ['🥇', '🥈', '🥉'], pz = c.prizes || [];
    if (!S.on) { b.innerHTML = '<p class="dsm">' + ec(T.off) + '</p>'; return; }
    const sub = (k, on, url) => '<div class="dsub"><span>' + ec(T[k]) + '</span>' + (on ? '<span class="dok">' + ec(T.on) + '</span>' : '<button class="btn" data-dj="' + url + '">' + ec(T.join) + ' +10 %</button>') + '</div>';
    const rows = (c.top || []).slice(0, 10).map((x, i) => '<div class="drow' + (x.me ? ' me' : '') + '"><span>' + (md[i] || (i + 1) + '.') + ' ' + ec(x.name) + (x.me ? ' (' + ec(T.you) + ')' : '') + '</span><span>' + nf(x.n) + ' ' + ec(T.taps) + (i < 3 && pz[i] ? ' · ' + usd(pz[i]) : '') + '</span></div>').join('')
      || '<p class="dsm">' + ec(T.nobody) + '</p>';
    b.style.cssText = '';
    b.innerHTML = '<div class="dc"><div class="dl">' + ec(T.mine) + '</div><div class="dbig" id="dusd"></div><div class="dbar"><i id="dbar"></i></div>'
      + '<button class="btn" id="dclaim" style="width:100%;margin:10px 0 6px"></button><div class="dsm" id="dsolde" style="font-weight:700;opacity:1"></div><div class="dsm" id="dtoday"></div><div class="dsm">' + ec(T.rate(nf(S.tpc))) + '</div><div id="darea"></div><p class="dnote">' + ec(T.pay) + '</p></div>'
      + (Number(S.sub_pct) > 0 ? '<div class="dc"><div class="dl">' + ec(T.bon) + '</div>' + sub('bm', S.sub_mct, 'https://t.me/memecointycoon') + sub('bj', S.sub_js, 'https://t.me/jeremstyke')
        + (S.sub_mct && S.sub_js ? '' : '<button class="btn ghost" id="drc" style="width:100%;margin:8px 0 0">' + ec(T.recheck) + '</button>') + '</div>' : '')
      + (c.on ? '<div class="dc"><div class="dl">' + ec(T.con) + '</div><div class="dsm">' + ec(T.ends) + ' <b id="dcd">' + cd(c.ends) + '</b> · ' + ec(T.prizes) + ' : ' + pz.map((p) => usd(p)).join(' / ') + '</div>' + rows
        + (c.me && c.me.rank ? '<div class="dsm" style="margin-top:6px">' + ec(T.rank) + ' : <b>#' + c.me.rank + '</b> · ' + nf(c.me.n) + ' ' + ec(T.taps) + '</div>' : '') + '</div>' : '')
      + '<button class="btn ghost" id="dwal" style="width:100%">' + ec(T.wal) + '</button>';
    b.querySelectorAll('[data-dj]').forEach((x) => x.onclick = () => { hp(); open(x.dataset.dj); });
    const rc = document.getElementById('drc'); if (rc) rc.onclick = () => { hp(); show(); };
    document.getElementById('dclaim').onclick = claim;
    document.getElementById('dwal').onclick = () => { hp(); closeIt(); try { tonPage(); } catch (e) {} };
    area();
  }

  let CLAIMING = false;
  async function claim() {
    const T = L(), cb = document.getElementById('dclaim');
    if (CLAIMING) return;
    if (!cb || cb.disabled) { tst(T.none); return; }
    CLAIMING = true; hp(); cb.disabled = true;
    if (TIMER) { clearTimeout(TIMER); TIMER = null; }
    let k = 0; while (BUSY && k++ < 40) await new Promise((ok) => setTimeout(ok, 100));
    await flush();
    let r = null; try { r = await claimCall(); } catch (e) {}
    CLAIMING = false;
    if (!r || !r.ok) { tst(T.err); nums(); return; }
    if (r.state) S = r.state;
    try { Telegram.WebApp.HapticFeedback.notificationOccurred('success'); } catch (e) {}
    tst(Number(r.added) > 0 ? T.added(usd(r.added)) : T.none);
    nums();
  }

  function area() {
    const el = document.getElementById('darea'); if (!el || !S) return;
    const T = L();
    el.innerHTML = S.paused ? '<div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:16px" class="dsm">' + ec(T.paused) + '</div>'
      : S.check ? '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px"><b>' + ec(T.check) + '</b><div style="display:flex;gap:12px">'
        + S.check.map((e, i) => '<button class="btn ghost" data-dck="' + (i + 1) + '" style="width:auto;font-size:30px;padding:8px 14px;margin:0">' + e + '</button>').join('') + '</div></div>'
      : '<button id="dgem" aria-label="Tap" style="left:' + POS.x + '%;top:' + POS.y + '%">💎</button><div style="position:absolute;left:12px;right:12px;bottom:10px;text-align:center;font-size:12px;opacity:.6;pointer-events:none">' + ec(T.lead) + '</div>';
    nums();
    const g = document.getElementById('dgem');
    if (g) g.onpointerdown = (ev) => {
      ev.preventDefault(); Q++; CNT++;
      g.style.transform = 'translate(-50%,-50%) scale(.9)'; setTimeout(() => { g.style.transform = 'translate(-50%,-50%)'; }, 70);
      if (CNT % 10 === 0) hp();
      if (CNT % 50 === 0) { POS = { x: 20 + Math.random() * 60, y: 22 + Math.random() * 56 }; g.style.left = POS.x + '%'; g.style.top = POS.y + '%'; }
      nums();
      if (!TIMER) TIMER = setTimeout(flush, 1000);
    };
    el.querySelectorAll('[data-dck]').forEach((b) => b.onclick = async () => {
      hp(); let r = null; try { r = await call({ action: 'dia_check', a: Number(b.dataset.dck) }); } catch (e) {}
      if (r && r.state) S = r.state; if (r && !r.ok) tst(T.wrong);
      area();
    });
  }

  async function flush() {
    TIMER = null; if (BUSY || !Q) return; BUSY = true;
    const n = Q; Q = 0; let r = null;
    try { r = await call({ action: 'dia_tap', n }); } catch (e) {}
    BUSY = false;
    if (r && r.state) S = r.state; else if (!r) Q += n;
    if (r && r.error === 'check') Q = 0;
    if (r && r.error === 'off') S.on = false;
    if ((r && r.state && (r.state.check || r.state.paused)) || (r && r.error === 'off')) { if (r.error === 'off') paint(); else area(); return; }
    nums();
    if (Q && !TIMER) TIMER = setTimeout(flush, 1000);
  }
  window.addEventListener('pagehide', flush);

  // a link ?startapp=src_dia... (the channel posts) opens the diamond
  const sp = String((window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.start_param) || '');
  if (/dia/.test(sp)) { let n = 0; const w = setInterval(() => { n++; let ok = false; try { ok = !!document.getElementById('diatop') && !!document.querySelector('nav.tb'); } catch (e) {} if (ok || n > 60) { clearInterval(w); if (ok) show(); } }, 250); }
})();
