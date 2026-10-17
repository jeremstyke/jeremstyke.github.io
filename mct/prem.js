// 17 oct 2026 (Jeremy): Meme Coin Tycoon Premium, by @jeremstyke. 100 ⭐ a month (Telegram subscription, cancel anytime):
// unlimited news (scoop), 10 mining boosts a day, zero videos, +$1,000 free every day, 1 free coin promotion a day,
// 2 streak saves a month and the 💎 badge. A Premium player is also a Supporter for the same time (badge, saves, free boosts).
// Where it shows: a button on the player's own profile, a line under every limit (videos, scoop, boost), a tile in "Low on cash?",
// and the Supporter rows of the game become "💎 Premium". Data from the Supabase function mct-ton ('prem', 'prem_link',
// 'prem_rch', 'prem_promo'); the payment is received by the game bot.
(() => {
  const TX = {
    en: { t: 'Premium', price: '50 ⭐ / month', launch: '🚀 Launch offer', sub: 'Cancel anytime in Telegram', go: '💎 Get Premium · 50 ⭐ / month', wk: 'Try 7 days · 20 ⭐ (no renewal)', on: (d) => '💎 Premium until ' + d, act: '✅ Your Premium is on', mng: 'To cancel: Telegram > Settings > My Stars.',
      b: ['📰 Unlimited news (scoop)', '⚡ 10 mining boosts x2 a day', '📺 Zero videos: insurance, boost and scoop in one tap', '💵 +$1,000 free every day', '💎 +20 % on the diamond (real TON)', '📣 1 free coin promotion a day (3 h at the top)', '🔥 2 streak saves a month', '💎 Premium badge everywhere'],
      rch: '💵 Get my free $1,000', rchd: '💵 Free $1,000 already taken today', rchok: '💵 +$1,000 added!', promo: '📣 Promote for free (Premium)', promok: '📣 Your coin is at the top of the market for 3 hours!', used: 'Free promotion already used today.', busy: 'Too many coins promoted right now, try again later.',
      thx: '💎 Thank you! Premium is on.', err: 'Something went wrong, try again.', up: '💎 Unlimited and no videos with Premium', upb: '💎 10 free boosts a day, no video, with Premium', tile: '💎 Premium', tiles: '+$1,000 free every day', left: (n) => n + ' free boosts left today', close: 'Close' },
    fr: { t: 'Premium', price: '50 ⭐ / mois', launch: '🚀 Offre de lancement', sub: 'Résiliable à tout moment dans Telegram', go: '💎 Passer Premium · 50 ⭐ / mois', wk: 'Essayer 7 jours · 20 ⭐ (sans renouvellement)', on: (d) => '💎 Premium jusqu\'au ' + d, act: '✅ Ton Premium est actif', mng: 'Pour résilier : Telegram > Réglages > Mes étoiles.',
      b: ['📰 News (scoop) illimitées', '⚡ 10 boosts de minage x2 par jour', '📺 Zéro vidéo : assurance, boost et scoop en un clic', '💵 +1 000 $ gratuits chaque jour', '💎 +20 % sur le diamant (vrais TON)', '📣 1 promotion de coin gratuite par jour (3 h en tête)', '🔥 2 sauvetages de série par mois', '💎 Badge Premium partout'],
      rch: '💵 Récupérer mes 1 000 $ gratuits', rchd: '💵 1 000 $ gratuits déjà pris aujourd\'hui', rchok: '💵 +1 000 $ ajoutés !', promo: '📣 Promouvoir gratuitement (Premium)', promok: '📣 Ton coin est en tête du marché pendant 3 heures !', used: 'Promotion gratuite déjà utilisée aujourd\'hui.', busy: 'Trop de coins sont mis en avant, réessaie plus tard.',
      thx: '💎 Merci ! Ton Premium est actif.', err: 'Une erreur est survenue, réessaie.', up: '💎 Illimité et sans vidéo avec Premium', upb: '💎 10 boosts gratuits par jour, sans vidéo, avec Premium', tile: '💎 Premium', tiles: '+1 000 $ gratuits chaque jour', left: (n) => n + ' boosts gratuits restants aujourd\'hui', close: 'Fermer' },
    id: { t: 'Premium', price: '50 ⭐ / bulan', launch: '🚀 Harga peluncuran', sub: 'Bisa dibatalkan kapan saja di Telegram', go: '💎 Ambil Premium · 50 ⭐ / bulan', wk: 'Coba 7 hari · 20 ⭐ (tanpa perpanjangan)', on: (d) => '💎 Premium sampai ' + d, act: '✅ Premium-mu aktif', mng: 'Untuk membatalkan: Telegram > Pengaturan > Stars Saya.',
      b: ['📰 Berita (bocoran) tanpa batas', '⚡ 10 boost tambang x2 per hari', '📺 Tanpa video: asuransi, boost dan bocoran sekali ketuk', '💵 +$1,000 gratis setiap hari', '💎 +20 % di berlian (TON asli)', '📣 1 promosi koin gratis per hari (3 jam teratas)', '🔥 2 penyelamat streak per bulan', '💎 Lencana Premium di mana-mana'],
      rch: '💵 Ambil $1,000 gratisku', rchd: '💵 $1,000 gratis sudah diambil hari ini', rchok: '💵 +$1,000 ditambahkan!', promo: '📣 Promosikan gratis (Premium)', promok: '📣 Koinmu teratas di pasar selama 3 jam!', used: 'Promosi gratis sudah dipakai hari ini.', busy: 'Terlalu banyak koin dipromosikan, coba lagi nanti.',
      thx: '💎 Terima kasih! Premium-mu aktif.', err: 'Terjadi kesalahan, coba lagi.', up: '💎 Tanpa batas dan tanpa video dengan Premium', upb: '💎 10 boost gratis per hari, tanpa video, dengan Premium', tile: '💎 Premium', tiles: '+$1,000 gratis setiap hari', left: (n) => 'Sisa ' + n + ' boost gratis hari ini', close: 'Tutup' },
    ar: { t: 'بريميوم', price: '50 ⭐ / شهر', launch: '🚀 عرض الإطلاق', sub: 'يمكن الإلغاء في أي وقت من تيليجرام', go: '💎 اشترك في بريميوم · 50 ⭐ / شهر', wk: 'جرّب 7 أيام · 20 ⭐ (بدون تجديد)', on: (d) => '💎 بريميوم حتى ' + d, act: '✅ بريميوم مفعّل', mng: 'للإلغاء: تيليجرام > الإعدادات > نجومي.',
      b: ['📰 أخبار بلا حدود', '⚡ 10 تعزيزات تعدين x2 يوميًا', '📺 بدون فيديو: التأمين والتعزيز والسبق بضغطة', '💵 1000$ مجانًا كل يوم', '💎 +20 % على الماسة (TON حقيقي)', '📣 ترويج عملة مجاني يوميًا (3 ساعات في القمة)', '🔥 حفظان للسلسلة شهريًا', '💎 شارة بريميوم في كل مكان'],
      rch: '💵 احصل على 1000$ المجانية', rchd: '💵 تم أخذ 1000$ المجانية اليوم', rchok: '💵 أُضيفت 1000$!', promo: '📣 روّج مجانًا (بريميوم)', promok: '📣 عملتك في قمة السوق لمدة 3 ساعات!', used: 'تم استخدام الترويج المجاني اليوم.', busy: 'عملات كثيرة مروّجة الآن، حاول لاحقًا.',
      thx: '💎 شكرًا! بريميوم مفعّل.', err: 'حدث خطأ، حاول مرة أخرى.', up: '💎 بلا حدود وبدون فيديو مع بريميوم', upb: '💎 10 تعزيزات مجانية يوميًا بدون فيديو مع بريميوم', tile: '💎 بريميوم', tiles: '1000$ مجانًا كل يوم', left: (n) => 'متبقٍ ' + n + ' تعزيزات مجانية اليوم', close: 'إغلاق' },
  };
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] ? l : 'en'; };
  const L = () => TX[lg()];
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const day = (d) => { try { return new Date(d).toLocaleDateString(lg() === 'en' ? 'en-GB' : lg() === 'id' ? 'id-ID' : lg() === 'ar' ? 'ar' : 'fr-FR', { day: 'numeric', month: 'short' }); } catch (e) { return ''; } };
  const call = (b) => tonCall(b);
  let S = null;
  async function state(force) {
    if (S && !force) return S;
    try { const r = await call({ action: 'prem' }); if (r && r.ok) S = r; } catch (e) {}
    window.MCTPREM = !!(S && S.on);
    return S;
  }
  async function refreshMe() { try { await loadMe(); setCash(ME.cash); } catch (e) {} }

  const st = document.createElement('style');
  st.textContent = '#prm{position:fixed;inset:0;z-index:9998;background:rgba(5,3,15,.78);display:flex;align-items:flex-end;justify-content:center}'
    + '#prm .pbx{position:relative;width:100%;max-width:520px;max-height:92vh;overflow:auto;background:var(--night,#140c2c);border:1px solid #ffd43b;border-radius:22px 22px 0 0;padding:14px 14px calc(14px + env(safe-area-inset-bottom));text-align:center}'
    // 17 oct 2026: compact sheet, it must fit a small phone without scrolling (header on one line, perks in 2 columns, ✕ in the corner)
    + '#prm .phd{display:flex;align-items:center;justify-content:center;gap:10px;margin:2px 26px 0}#prm .phd span{font-size:34px;line-height:1}#prm .phd div{text-align:left}'
    + '#prm h2{margin:0;font-size:20px;line-height:1.1}#prm .pr{font-size:16px;font-weight:900;color:#ffd43b;margin:2px 0 0}#prm .phd .plc{display:inline-block;margin-top:4px;padding:3px 9px;border-radius:999px;background:#ff5d8f;color:#fff;font-size:11px;line-height:1.3;font-weight:800}#prm .pcx{position:absolute;top:8px;right:8px;width:32px;height:32px;margin:0;padding:0;border:0;border-radius:50%;background:rgba(255,255,255,.08);color:inherit;font-size:16px}'
    + '#prm ul{list-style:none;padding:0;margin:10px 0;text-align:left;display:grid;grid-template-columns:1fr 1fr;gap:6px}#prm li{padding:7px 8px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(255,255,255,.03);font-size:12.5px;line-height:1.25}'
    + '#prm .btn,#prm .ghost{padding-top:11px;padding-bottom:11px;font-size:15px}'
    + '#prm small{display:block;opacity:.7;margin-top:6px;font-size:12px}.pmup{display:block;width:100%;margin-top:10px;background:none;border:1px dashed #ffd43b;color:#ffd43b;border-radius:12px;padding:9px;font-weight:800;font-size:13px}'
    + '#pfprem{display:block;width:100%;margin:0 0 12px;background:linear-gradient(135deg,#ffd43b,#f59f00);color:#1a0638;border:0;border-radius:14px;padding:12px;font-weight:900}';
  document.head.appendChild(st);

  function closeIt() { const d = document.getElementById('prm'); if (d) d.remove(); }
  async function show() {
    hp(); closeIt();
    const d = document.createElement('div'); d.id = 'prm';
    d.innerHTML = '<div class="pbx">⏳</div>'; d.onclick = (e) => { if (e.target === d) closeIt(); };
    document.body.appendChild(d);
    const s = await state(true), T = L(), b = d.querySelector('.pbx'); if (!b) return;
    const on = s && s.on;
    b.innerHTML = '<button class="pcx" id="pcl" aria-label="' + ec(T.close) + '">✕</button><div class="phd"><span>💎</span><div><h2>' + ec(T.t) + '</h2><div class="pr">' + ec(on ? T.act : T.price) + '</div>' + (on ? '' : '<span class="plc">' + ec(T.launch) + '</span>') + '</div></div>'
      + '<small style="margin-top:4px">' + ec(on ? T.on(day(s.until)) : T.sub) + '</small>'
      + '<ul>' + T.b.map((x) => '<li>' + ec(x) + '</li>').join('') + '</ul>'
      + (on ? '<button class="btn" id="prch"' + (s.rch ? '' : ' disabled style="opacity:.5"') + '>' + ec(s.rch ? T.rch : T.rchd) + '</button><small>' + ec(T.left(s.boosts)) + '</small><small>' + ec(T.mng) + '</small>'
        : '<button class="btn" id="pgo">' + ec(T.go) + '</button><button class="ghost" id="pwk" style="width:100%;margin-top:8px;border:1px solid #ffd43b;color:#ffd43b">' + ec(T.wk) + '</button>');
    b.querySelector('#pcl').onclick = () => { hp(); closeIt(); };
    const g = b.querySelector('#pgo'); if (g) g.onclick = buy;
    // 17 oct 2026: the 7-day pass, 30 ⭐ paid once (no renewal), to try Premium for cheap
    const w = b.querySelector('#pwk'); if (w) w.onclick = (ev) => buy(ev, 'week');
    const r = b.querySelector('#prch'); if (r) r.onclick = () => freeRch(r);
  }
  async function buy(ev, plan) {
    const T = L(), btn = ev && ev.currentTarget; hp('medium');
    if (btn) { btn.disabled = true; btn.textContent = '⏳'; }
    let r = null; try { r = await call({ action: 'prem_link', lang: lg(), plan: plan === 'week' ? 'week' : 'month' }); } catch (e) {}
    if (!r || !r.link) { tst(T.err); if (btn) { btn.disabled = false; btn.textContent = plan === 'week' ? T.wk : T.go; } return; }
    try {
      tw.openInvoice(r.link, async (st2) => {
        if (btn) { btn.disabled = false; btn.textContent = plan === 'week' ? T.wk : T.go; }
        if (st2 !== 'paid') return;
        hp('ok'); tst(T.thx);
        // the bot activates Premium as soon as Telegram confirms the payment: check again a few times
        for (const w of [2500, 5000, 9000]) { await new Promise((ok) => setTimeout(ok, w)); const s = await state(true); if (s && s.on) { await refreshMe(); show(); break; } }
      });
    } catch (e) { tst(T.err); }
  }
  async function freeRch(btn) {
    const T = L(); hp('medium'); if (btn) btn.disabled = true;
    let r = null; try { r = await call({ action: 'prem_rch' }); } catch (e) {}
    if (r && r.ok) { hp('ok'); tst(T.rchok); if (S) S.rch = false; await refreshMe(); if (btn) btn.textContent = T.rchd; return true; }
    if (btn) btn.disabled = false; tst(r && r.error === 'wait' ? T.rchd : T.err); return false;
  }
  window.mctPremium = show;

  // 1. the free daily recharge replaces the paid one (10 ⭐) for Premium players: every recharge button of the game
  document.addEventListener('click', async (e) => {
    const b = e.target && e.target.closest && e.target.closest('#cbr,#rch,#er');
    if (!b || !S || !S.on || !S.rch) return;
    e.stopImmediatePropagation(); e.preventDefault();
    await freeRch(null);
  }, true);
  // 2. the free promotion of the day on a coin page
  document.addEventListener('click', async (e) => {
    const b = e.target && e.target.closest && e.target.closest('#prom');
    if (!b || b.disabled || !S || !S.on || !S.promo) return;
    e.stopImmediatePropagation(); e.preventDefault(); hp('medium');
    let id = 0; try { id = COIN.coin.id; } catch (x) {}
    const T = L(); let r = null; try { r = await call({ action: 'prem_promo', id }); } catch (x) {}
    if (r && r.ok) { hp('ok'); tst(T.promok); S.promo = false; try { openCoin(id); } catch (x) {} return; }
    if (r && r.error === 'used') { S.promo = false; tst(T.used); return; }
    tst(r && r.error === 'promo_busy' ? T.busy : T.err);
  }, true);

  // 3. what shows on the screens
  function paint() {
    const T = L(), on = !!(S && S.on);
    // own profile (it has the "change my nickname" buttons): Premium button
    const ped = document.querySelector('#pfb .ped');
    if (ped && !document.getElementById('pfprem')) {
      const x = document.createElement('button'); x.id = 'pfprem'; x.type = 'button';
      x.textContent = on ? T.on(day(S.until)) : T.go.split(' · ')[0]; x.onclick = show; // 17 oct 2026: no price here, the sheet shows both offers (month and 7 days)
      ped.parentNode.insertBefore(x, ped);
    }
    // the coin page: the promotion button says it is free today
    const pm = document.getElementById('prom');
    if (pm && on && S.promo && !pm.disabled && pm.dataset.pr !== '1') { pm.dataset.pr = '1'; pm.textContent = T.promo; }
    // the old Supporter rows (portfolio, earn page) become the Premium row
    ['sup', 'esup'].forEach((id) => {
      const r = document.getElementById(id); if (!r || r.dataset.pr === '1') return;
      r.dataset.pr = '1'; const b = r.querySelector('b'), sm = r.querySelector('small');
      if (b) b.textContent = '💎 ' + T.t; if (sm) sm.textContent = on ? T.on(day(S.until)) : T.tiles;
      r.addEventListener('click', (ev) => { ev.stopImmediatePropagation(); ev.preventDefault(); show(); }, true);
    });
    // "Low on cash?": a Premium tile for the others
    const cb = document.getElementById('cashbox'), tl = cb && cb.querySelector('.tiles');
    if (tl && !on && !document.getElementById('cbp')) {
      const x = document.createElement('button'); x.className = 'tile'; x.id = 'cbp';
      x.innerHTML = '<b>' + ec(T.tile) + '</b><small>' + ec(T.tiles) + '</small>'; x.onclick = show; tl.appendChild(x);
    }
    // under the limits (videos, scoop, boost): "Unlimited and no videos with Premium"
    const am = document.querySelector('#adm > div');
    if (am && !on && !am.querySelector('.pmup') && am.querySelector('#adw,#adp,#spy')) {
      const x = document.createElement('button'); x.className = 'pmup'; x.type = 'button'; // 17 oct 2026 (Jeremy): the boost is not unlimited with Premium, it is 10 free boosts a day
      x.textContent = /⚡/.test(am.textContent) ? (T.upb || T.up) : T.up;
      x.onclick = () => { const d = document.getElementById('adm'); if (d) d.remove(); show(); };
      am.appendChild(x);
    }
  }
  let q = 0;
  new MutationObserver(() => { if (!q) q = requestAnimationFrame(() => { q = 0; paint(); }); }).observe(document.body, { childList: true, subtree: true });
  state().then(paint);
  // a link ?startapp=premium (bot messages, channel posts) opens the Premium page
  const sp = String((window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.start_param) || '');
  if (/premium/.test(sp)) { let n = 0; const w = setInterval(() => { n++; let ok = false; try { ok = !!document.querySelector('nav.tb'); } catch (e) {} if (ok || n > 60) { clearInterval(w); if (ok) show(); } }, 250); }
})();
