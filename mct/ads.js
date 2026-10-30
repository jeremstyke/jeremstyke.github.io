// 16 oct 2026: Meme Coin Tycoon rewarded videos (Ads Galaxy, game id 135). Three places where the player really wants something:
// 1. the mining boost x2: a free video instead of 5 stars (once a day, the stars stay possible);
// 2. the scoop: the next news (which coin, up or down) before everyone (1 a day since 17 oct 2026, was 2), a card at the top of the market and the news;
//    once unlocked, it stays visible for free until that news comes out; after the 2 free videos, 5 stars;
// 3. the insurance: right after a losing sale, a video gives back 50 % of the loss (3 a day, within 10 minutes).
// The server checks every limit (Supabase function mct-ton: boost_ad, scoop, insure).
(() => {
  const AGX = 135;
  const TX = {
    id: {
      bT: 'Boost x2 selama 1 jam', bX: 'Tambangmu menghasilkan dua kali lipat selama 1 jam.', bAd: '📺 Tonton video (gratis, 1 per hari)', bPay: '⭐ Bayar 5 stars', bOk: '⚡ Boost x2 aktif!',
      bLim: 'Boost gratismu hari ini sudah dipakai. Bayar dengan stars atau kembali besok.', bLim2: 'Hanya 1 boost gratis per hari, dan hari ini sudah dipakai. Untuk boost lagi sekarang: 5 stars. Boost gratismu kembali besok.', later: 'Nanti',
      noad: 'Tidak ada video, coba lagi nanti.', err: 'Terjadi kesalahan, coba lagi.', no: 'Tidak, terima kasih', ok: 'OK',
      iT: '🛟 Asuransi', iX: (l, b) => 'Kamu rugi ' + l + ' dari penjualan ini. Tonton video dan dapatkan kembali ' + b + ' (50 %).', iAd: (b) => '📺 Dapatkan kembali ' + b,
      iOk: (r) => '🛟 ' + r + ' ditambahkan ke uangmu!', iLim: 'Kamu sudah memakai 3 asuransi hari ini.', iLate: 'Terlambat: asuransi hanya berlaku 10 menit setelah penjualan.',
      sT: '📰 Bocoran', sX: 'Lihat berita berikutnya sebelum orang lain', sB: '📺 Tonton', sUp: (t) => '$' + t + ' akan dapat kabar baik sebentar lagi 🚀', sDn: (t) => '$' + t + ' akan dapat kabar buruk sebentar lagi 📉',
      sAllUp: 'Seluruh pasar akan pump sebentar lagi 🚀', sAllDn: 'Seluruh pasar akan turun sebentar lagi 📉', sNote: 'Tidak ada yang tahu pastinya kapan: 30 menit lagi atau besok. Giliranmu!',
      sOpen: '👀 Lihat', sPayT: 'Kamu sudah memakai bocoran gratis hari ini. Buka yang ini dengan 5 stars, atau kembali besok.', sPay: '⭐ Buka dengan 5 stars', sGo: (t) => 'Buka $' + t, sLim: 'Kamu sudah melihat bocoranmu hari ini. Kembali besok!',
    },
    fa: {
      bT: 'بوست x2 برای 1 ساعت', bX: 'استخراجت برای 1 ساعت دو برابر درآمد دارد.', bAd: '📺 یک ویدیو ببین (رایگان، روزی 1 بار)', bPay: '⭐ پرداخت 5 ستاره', bOk: '⚡ بوست x2 روشن شد!',
      bLim: 'بوست رایگان امروزت را استفاده کردی. با ستاره بپرداز یا فردا برگرد.', bLim2: 'فقط روزی 1 بوست رایگان، و امروز استفاده‌اش کردی. برای بوست دوباره همین حالا: 5 ستاره. بوست رایگانت فردا برمی‌گردد.', later: 'بعداً',
      noad: 'ویدیویی در دسترس نیست، بعدا دوباره امتحان کن.', err: 'مشکلی پیش آمد، دوباره امتحان کن.', no: 'نه، ممنون', ok: 'باشه',
      iT: '🛟 بیمه', iX: (l, b) => 'در این فروش ' + l + ' ضرر کردی. یک ویدیو ببین و ' + b + ' (50 %) پس بگیر.', iAd: (b) => '📺 پس گرفتن ' + b,
      iOk: (r) => '🛟 ' + r + ' به پولت اضافه شد!', iLim: 'امروز 3 بیمه‌ات را استفاده کردی.', iLate: 'دیر شد: بیمه تا 10 دقیقه بعد از فروش معتبر است.',
      sT: '📰 خبر ویژه', sX: 'خبر بعدی را زودتر از همه ببین', sB: '📺 تماشا', sUp: (t) => '$' + t + ' به‌زودی خبر خوب می‌گیرد 🚀', sDn: (t) => '$' + t + ' به‌زودی خبر بد می‌گیرد 📉',
      sAllUp: 'کل بازار به‌زودی پامپ می‌شود 🚀', sAllDn: 'کل بازار به‌زودی افت می‌کند 📉', sNote: 'کسی دقیقاً نمی‌داند کی: 30 دقیقه دیگر یا فردا. نوبت توست!',
      sOpen: '👀 دیدن', sPayT: 'خبر ویژه رایگان امروز را دیدی. این یکی را با 5 ستاره باز کن، یا فردا برگرد.', sPay: '⭐ باز کردن با 5 ستاره', sGo: (t) => 'باز کردن $' + t, sLim: 'خبر ویژه امروزت را دیدی. فردا برگرد!',
    },
    ru: {
      bT: 'Буст x2 на 1 час', bX: 'Твой майнинг приносит вдвое больше 1 час.', bAd: '📺 Посмотреть видео (бесплатно, 1 раз в день)', bPay: '⭐ Оплатить 5 звёзд', bOk: '⚡ Буст x2 включён!',
      bLim: 'Бесплатный буст сегодня уже использован. Оплати звёздами или возвращайся завтра.', bLim2: 'Только 1 бесплатный буст в день, и сегодняшний уже использован. Чтобы бустануть сейчас: 5 звёзд. Бесплатный буст вернётся завтра.', later: 'Позже',
      noad: 'Нет доступного видео, попробуй позже.', err: 'Что-то пошло не так, попробуй ещё раз.', no: 'Нет, спасибо', ok: 'OK',
      iT: '🛟 Страховка', iX: (l, b) => 'Ты потерял ' + l + ' на этой продаже. Посмотри видео и верни ' + b + ' (50 %).', iAd: (b) => '📺 Вернуть ' + b,
      iOk: (r) => '🛟 ' + r + ' добавлено к деньгам!', iLim: 'Ты использовал 3 страховки сегодня.', iLate: 'Поздно: страховка действует 10 минут после продажи.',
      sT: '📰 Инсайд', sX: 'Узнай следующую новость раньше всех', sB: '📺 Смотреть', sUp: (t) => '$' + t + ' скоро получит хорошую новость 🚀', sDn: (t) => '$' + t + ' скоро получит плохую новость 📉',
      sAllUp: 'Весь рынок скоро вырастет 🚀', sAllDn: 'Весь рынок скоро просядет 📉', sNote: 'Никто не знает точно когда: через 30 минут или завтра. Твой ход!',
      sOpen: '👀 Смотреть', sPayT: 'Бесплатный инсайд сегодня уже использован. Открой этот за 5 звёзд или возвращайся завтра.', sPay: '⭐ Открыть за 5 звёзд', sGo: (t) => 'Открыть $' + t, sLim: 'Ты уже видел инсайд сегодня. Возвращайся завтра!',
    },
    en: {
      bT: 'Boost x2 for 1 hour', bX: 'Your mining earns double for 1 hour.', bAd: '📺 Watch a video (free, 1 a day)', bPay: '⭐ Pay 5 stars', bOk: '⚡ Boost x2 on!',
      bLim: 'You used your free boost today. Pay with stars or come back tomorrow.', bLim2: 'Only 1 free boost a day, and you already used today\'s. To boost again now: 5 stars. Your free boost comes back tomorrow.', later: 'Later',
      noad: 'No video available, try again later.', err: 'Something went wrong, try again.', no: 'No thanks', ok: 'OK',
      iT: '🛟 Insurance', iX: (l, b) => 'You lost ' + l + ' on this sale. Watch a video and get back ' + b + ' (50 %).', iAd: (b) => '📺 Get back ' + b,
      iOk: (r) => '🛟 ' + r + ' added to your cash!', iLim: 'You used your 3 insurances today.', iLate: 'Too late: the insurance lasts 10 minutes after the sale.',
      sT: '📰 Scoop', sX: 'See the next news before everyone', sB: '📺 Watch', sUp: (t) => '$' + t + ' will get good news soon 🚀', sDn: (t) => '$' + t + ' will get bad news soon 📉',
      sAllUp: 'The whole market will pump soon 🚀', sAllDn: 'The whole market will dip soon 📉', sNote: 'Nobody knows exactly when: in 30 minutes or tomorrow. Your move!',
      sOpen: '👀 See', sPayT: 'You used your free scoop today. Unlock this one for 5 stars, or come back tomorrow.', sPay: '⭐ Unlock for 5 stars', sGo: (t) => 'Open $' + t, sLim: 'You saw your scoop today. Come back tomorrow!',
    },
    fr: {
      bT: 'Boost x2 pendant 1 heure', bX: 'Ton minage rapporte le double pendant 1 heure.', bAd: '📺 Regarder une vidéo (gratuit, 1 par jour)', bPay: '⭐ Payer 5 étoiles', bOk: '⚡ Boost x2 activé !',
      bLim: 'Tu as utilisé ton boost gratuit du jour. Paie en étoiles ou reviens demain.', bLim2: 'Il n\'y a qu\'un boost gratuit par jour, et tu as déjà utilisé celui d\'aujourd\'hui. Pour rebooster maintenant : 5 étoiles. Ton boost gratuit revient demain.', later: 'Plus tard',
      noad: 'Pas de vidéo disponible, réessaie plus tard.', err: 'Une erreur est survenue, réessaie.', no: 'Non merci', ok: 'OK',
      iT: '🛟 Assurance', iX: (l, b) => 'Tu as perdu ' + l + ' sur cette vente. Regarde une vidéo et récupère ' + b + ' (50 %).', iAd: (b) => '📺 Récupérer ' + b,
      iOk: (r) => '🛟 ' + r + ' ajoutés à ton cash !', iLim: 'Tu as utilisé tes 3 assurances du jour.', iLate: 'Trop tard : l\'assurance dure 10 minutes après la vente.',
      sT: '📰 Scoop', sX: 'Découvre la prochaine news avant tout le monde', sB: '📺 Voir', sUp: (t) => '$' + t + ' va bientôt avoir une bonne news 🚀', sDn: (t) => '$' + t + ' va bientôt avoir une mauvaise news 📉',
      sAllUp: 'Tout le marché va bientôt monter 🚀', sAllDn: 'Tout le marché va bientôt baisser 📉', sNote: 'Personne ne sait exactement quand : dans 30 minutes ou demain. À toi de jouer !',
      sOpen: '👀 Voir', sPayT: 'Tu as utilisé ton scoop gratuit du jour. Débloque celui-ci pour 5 étoiles, ou reviens demain.', sPay: '⭐ Débloquer pour 5 étoiles', sGo: (t) => 'Voir $' + t, sLim: 'Tu as vu ton scoop du jour. Reviens demain !',
    },
  };
  // 19 oct 2026 (Jeremy): Premium players skip the videos (watch() returns at once), so they must not be told to watch one
  const PX = {
    fr: { iX: (l, b) => 'Tu as perdu ' + l + ' sur cette vente. 💎 Premium : récupère ' + b + ' (50 %) sans vidéo.', iAd: (b) => '🛟 Récupérer ' + b, bAd: '💎 Activer (Premium, sans vidéo)', sB: '👀 Voir' },
    fa: { iX: (l, b) => 'در این فروش ' + l + ' ضرر کردی. 💎 پریمیوم: ' + b + ' (50 %) را بدون ویدیو پس بگیر.', iAd: (b) => '🛟 پس گرفتن ' + b, bAd: '💎 روشن کردن (پریمیوم، بدون ویدیو)', sB: '👀 دیدن' }, ru: { iX: (l, b) => 'Ты потерял ' + l + ' на этой продаже. 💎 Премиум: верни ' + b + ' (50 %) без видео.', iAd: (b) => '🛟 Вернуть ' + b, bAd: '💎 Включить (Премиум, без видео)', sB: '👀 Смотреть' }, en: { iX: (l, b) => 'You lost ' + l + ' on this sale. 💎 Premium: get back ' + b + ' (50 %) with no video.', iAd: (b) => '🛟 Get back ' + b, bAd: '💎 Turn on (Premium, no video)', sB: '👀 See' },
    id: { iX: (l, b) => 'Kamu rugi ' + l + ' dari penjualan ini. 💎 Premium: dapatkan kembali ' + b + ' (50 %) tanpa video.', iAd: (b) => '🛟 Dapatkan kembali ' + b, bAd: '💎 Aktifkan (Premium, tanpa video)', sB: '👀 Lihat' },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} const t = TX[l] || TX.en; return window.MCTPREM ? Object.assign({}, t, PX[l] || PX.en) : t; };
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const mo = (n) => { try { return money(n); } catch (e) { return '$' + Number(n).toFixed(2); } };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // the Ads Galaxy SDK, loaded only when a video is asked for
  let ld = null;
  const sdk = () => ld || (ld = new Promise((ok, ko) => {
    if (window.showAdsGalaxy) return ok();
    const s = document.createElement('script'); s.src = 'https://app.adsgalaxy.online/sdk.js?id=' + AGX;
    s.onload = ok; s.onerror = () => { ld = null; ko(new Error('load')); }; document.head.appendChild(s);
    // 20 oct 2026 (Jeremy): Ads Galaxy down (its site does not answer): give up after 6 s instead of waiting forever ("no video available, try again later")
    setTimeout(() => { if (!window.showAdsGalaxy) { ld = null; ko(new Error('timeout')); } }, 6000);
  }));
  // 20 oct 2026 (Jeremy): Adsgram first (rewarded block 55185), Ads Galaxy as backup
  let agl = null;
  const agSdk = () => agl || (agl = new Promise((ok, ko) => {
    if (window.Adsgram) return ok();
    const s = document.createElement('script'); s.src = 'https://sad.adsgram.ai/js/sad.min.js';
    s.onload = ok; s.onerror = () => { agl = null; ko(new Error('load')); }; document.head.appendChild(s);
    setTimeout(() => { if (!window.Adsgram) { agl = null; ko(new Error('timeout')); } }, 6000);
  }));
  // 28 oct 2026 (21h31, Jeremy): about 1 video out of 5 on Monetag (rewarded interstitial, zone 12143182), drawn at random over all players;
  // Adsgram as before for the others, or when Monetag has no ad
  async function mtgWatch() {
    const fn = 'show_12143182';
    try {
      if (!window[fn]) await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://libtl.com/sdk.js'; s.setAttribute('data-zone', '12143182'); s.setAttribute('data-sdk', fn); s.onload = res; s.onerror = rej; document.head.appendChild(s); setTimeout(() => rej(new Error('timeout')), 8000); });
      await window[fn](); return true;
    } catch (e) { return false; }
  }
  async function agWatch() {
    if (false && await mtgWatch()) return 'ok';  // 29 oct 2026 (23h15, Jeremy): no more Monetag, Adsgram only
    // 27 oct 2026 (Jeremy): a player watched the whole video and was told "no video available": a video that was shown now always counts
    // (the free boost is once a day and checked by the server); only "Adsgram had no video at all" fails
    try { await agSdk(); await window.Adsgram.init({ blockId: '55242' }).show(); return 'ok'; }
    catch (e) { return (!e || !('done' in Object(e)) || e.state === 'load' || /no ad|no banner/i.test(String(e.description || ''))) ? 'none' : 'ok'; }  // 25 oct 2026 (11h30): 'none' (then Ads Galaxy) only when Adsgram had no video
  }
  async function watch() {
    if (window.MCTPREM) return true; // 17 oct 2026: Premium players skip the videos (prem.js)
    // 25 oct 2026 (3h45, Jeremy): Adsgram first (block 55242), Ads Galaxy (game 135) as backup when Adsgram has no video
    // 26 oct 2026 (18h25, Jeremy): no more Ads Galaxy backup, it played right after the Adsgram video. Adsgram only.
    return (await agWatch()) === 'ok';
  }

  // a small sheet from the bottom of the screen
  function close() { const d = document.getElementById('adm'); if (d) d.remove(); }
  function modal(html) {
    close();
    const d = document.createElement('div'); d.id = 'adm';
    d.style.cssText = 'position:fixed;inset:0;z-index:60;background:rgba(5,3,15,.72);display:flex;align-items:flex-end;justify-content:center';
    d.innerHTML = `<div style="width:100%;max-width:520px;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:22px 18px calc(24px + env(safe-area-inset-bottom));text-align:center">${html}</div>`;
    d.onclick = (e) => { if (e.target === d) close(); };
    document.body.appendChild(d); return d;
  }
  const head = (e, t, x) => `<div style="font-size:46px;line-height:1">${e}</div><h2 style="margin:8px 0 6px">${ec(String(t).replace(/^\S+ /, ''))}</h2><p class="hint" style="margin:0 0 16px">${ec(x)}</p>`;
  const busy = (b) => { b.disabled = true; b.textContent = '⏳'; };

  // 1. the boost x2: the button first offers a free video (once a day) or 5 stars
  document.addEventListener('click', async (e) => {
    const b = e.target && e.target.closest && e.target.closest('#boost');
    if (!b || b.disabled || /💎/.test(b.textContent || '')) return; // supporters keep their free boost
    e.stopImmediatePropagation(); e.preventDefault(); hp();
    const T = L();
    // 16 oct 2026 (Jeremy): once today's free video is used, the button goes straight to the 5 stars
    let pk = null; try { pk = await tonCall({ action: 'boost_ad', ad: 'none' }); } catch (x) {}
    if (pk && Number(pk.left) === 0) {
      const d0 = modal(head('⚡', T.bT, T.bLim2) + `<button class="btn" id="adp">${ec(T.bPay)}</button><button class="ghost" id="adn" style="width:100%;margin-top:10px">${ec(T.later)}</button>`);
      d0.querySelector('#adn').onclick = () => close();
      d0.querySelector('#adp').onclick = () => { close(); if (typeof b.onclick === 'function') b.onclick.call(b); };
      return;
    }
    const d = modal(head('⚡', T.bT, T.bX) + `<button class="btn" id="adw">${ec(T.bAd)}</button><button class="ghost" id="adp" style="width:100%;margin-top:10px">${ec(T.bPay)}</button>`);
    d.querySelector('#adp').onclick = () => { close(); if (typeof b.onclick === 'function') b.onclick.call(b); };
    d.querySelector('#adw').onclick = async (ev) => {
      busy(ev.currentTarget);
      if (!(await watch())) { close(); return tst(T.noad); }
      let r = null; try { r = await tonCall({ action: 'boost_ad', ad: 'done' }); } catch (x) {}
      close();
      if (!r || !r.ok) { hp('err'); return tst(r && r.error === 'limit' ? T.bLim : T.err); }
      hp('ok'); tst(T.bOk); try { if (VIEW === 'mine') mine(); } catch (x) {}
    };
  }, true);

  // 3. the insurance: the server marks a real loss (loss_id) in the answer to a sale
  const of = window.fetch;
  window.fetch = async function (u, o) {
    const r = await of.apply(this, arguments);
    try {
      if (String(u).indexOf('/mct/api') >= 0 && o && typeof o.body === 'string' && o.body.indexOf('"action":"sell"') >= 0) {
        r.clone().json().then((j) => { if (j && j.ok && j.loss_id) setTimeout(() => insure(j.loss_id, -Number(j.pnl)), 3200); }).catch(() => {});
      }
    } catch (e) {}
    return r;
  };
  function insure(id, loss) {
    const T = L(), back = Math.round(loss * 50) / 100;
    const d = modal(head('🛟', T.iT, T.iX(mo(loss), mo(back))) + `<button class="btn" id="adw">${ec(T.iAd(mo(back)))}</button><button class="ghost" id="adn" style="width:100%;margin-top:10px">${ec(T.no)}</button>`);
    hp();
    d.querySelector('#adn').onclick = () => close();
    d.querySelector('#adw').onclick = async (ev) => {
      busy(ev.currentTarget);
      if (!(await watch())) { close(); return tst(T.noad); }
      let r = null; try { r = await tonCall({ action: 'insure', id }); } catch (x) {}
      close();
      if (!r || !r.ok) { hp('err'); return tst(r && r.error === 'limit' ? T.iLim : r && r.error === 'late' ? T.iLate : T.err); }
      hp('ok'); tst(T.iOk(mo(r.refund)));
      try { if (r.cash != null) document.getElementById('cash').textContent = money(r.cash); } catch (x) {}
    };
  }

  // 2. the scoop: a card at the top of the market and of the news
  function card() {
    let v = ''; try { v = VIEW; } catch (e) {}
    if (v !== 'market' && v !== 'news') return;
    const view = document.getElementById('view'); if (!view || document.getElementById('scoopc')) return;
    const h1 = view.querySelector('h1'); if (!h1) return;
    const T = L(), el = document.createElement('div');
    el.className = 'msn'; el.id = 'scoopc';
    el.style.cssText = 'border-color:#ff9f43;display:flex;align-items:center;gap:10px;padding:12px 14px';
    el.innerHTML = `<div style="flex:1;min-width:0"><b style="font-size:16px">${ec(T.sT)}</b><br><small style="color:var(--mute);font-size:12px">${ec(T.sX)}</small></div><button class="msn-b go" id="scb">${ec(T.sB)}</button>`;
    h1.parentNode.insertBefore(el, h1.nextSibling);
    el.querySelector('#scb').onclick = scoop;
    // 17 oct 2026: the card can be folded into one line (title + button), the choice is kept on the phone
    if (!document.getElementById('scfst')) { const st = document.createElement('style'); st.id = 'scfst'; st.textContent = '#scoopc.min{padding:6px 12px!important}#scoopc.min small,#scoopc.min br{display:none}#scoopc.min b{font-size:14px!important}#scoopc .scf{flex:none;width:26px;height:26px;border:0;border-radius:50%;background:rgba(255,255,255,.08);color:inherit;font-size:14px;line-height:1;padding:0;margin:0}'; document.head.appendChild(st); }
    const f = document.createElement('button'); f.type = 'button'; f.className = 'scf'; f.setAttribute('aria-label', 'fold');
    const setF = (m) => { el.classList.toggle('min', m); f.textContent = m ? '▾' : '▴'; };
    let fm = false; try { fm = localStorage.getItem('mct_scoop_min') === '1'; } catch (e) {}
    setF(fm); el.appendChild(f);
    f.onclick = () => { hp(); fm = !el.classList.contains('min'); setF(fm); try { localStorage.setItem('mct_scoop_min', fm ? '1' : '0'); } catch (e) {} };
    // 16 oct 2026: an already unlocked scoop is shown right in the card, without a new video, until that news comes out
    peek().then((r) => { if (!r || !document.body.contains(el)) return; if (r.ok) { el.querySelector('small').textContent = sMsg(r); el.querySelector('#scb').textContent = T.sOpen; } else if (r.left === 0) el.querySelector('#scb').textContent = '⭐ 5'; });
  }
  let PK = null, PKT = 0;
  function peek(force) {
    if (force || !PK || Date.now() - PKT > 60000) { PKT = Date.now(); PK = tonCall({ action: 'scoop_peek' }).catch(() => null); }
    return PK;
  }
  const sMsg = (r) => { const T = L(); return r.all ? (r.up ? T.sAllUp : T.sAllDn) : (r.up ? T.sUp(r.ticker) : T.sDn(r.ticker)); };
  function show(r) {
    const T = L();
    const d = modal(head(r.all ? '🌍' : (r.emoji || '📰'), T.sT, sMsg(r)) + `<p class="hint" style="margin:-6px 0 16px;font-size:12px">${ec(T.sNote)}</p>`
      + (r.all ? `<button class="btn" id="sok">${ec(T.ok)}</button>` : `<button class="btn" id="sgo">${ec(T.sGo(r.ticker))}</button><button class="ghost" id="sok" style="width:100%;margin-top:10px">${ec(T.ok)}</button>`));
    d.querySelector('#sok').onclick = () => close();
    const g = d.querySelector('#sgo'); if (g) g.onclick = () => { close(); try { openCoin(r.coin); } catch (x) {} };
  }
  // 16 oct 2026: after the 2 free videos of the day, the scoop costs 5 stars (invoice by the game server, unlocked by the payment)
  function paySheet(b) {
    const T = L();
    const d = modal(head('📰', T.sT, T.sPayT) + `<button class="btn" id="spy">${ec(T.sPay)}</button><button class="ghost" id="sno" style="width:100%;margin-top:10px">${ec(T.no)}</button>`);
    d.querySelector('#sno').onclick = () => close();
    d.querySelector('#spy').onclick = async (ev) => {
      busy(ev.currentTarget);
      let r = null; try { r = await api('scoop_pay'); } catch (x) {}
      close();
      if (!r || !r.link) { hp('err'); return tst(T.err); }
      try {
        tw.openInvoice(r.link, (st) => {
          if (st !== 'paid') return;
          hp('ok');
          setTimeout(async () => { const v = await peek(true); if (v && v.ok) { if (b) b.textContent = T.sOpen; const c = document.getElementById('scoopc'); if (c) c.querySelector('small').textContent = sMsg(v); show(v); } }, 1800);
        });
      } catch (x) { tst(T.err); }
    };
  }
  async function scoop(ev) {
    const T = L(), b = ev.currentTarget; hp(); busy(b);
    const back = (t) => { b.disabled = false; b.textContent = t || T.sB; };
    const pk = await peek(true);
    if (pk && pk.ok) { back(T.sOpen); hp('ok'); return show(pk); }
    if (pk && pk.left === 0) { back('⭐ 5'); return paySheet(b); }
    if (!(await watch())) { back(); return tst(T.noad); }
    let r = null; try { r = await tonCall({ action: 'scoop' }); } catch (x) {}
    if (r && r.error === 'limit') { back('⭐ 5'); return paySheet(b); }
    if (!r || !r.ok) { back(); hp('err'); return tst(T.err); }
    PK = Promise.resolve(r); PKT = Date.now(); back(T.sOpen); hp('ok');
    const c = document.getElementById('scoopc'); if (c) c.querySelector('small').textContent = sMsg(r);
    show(r);
  }
  let q = 0;
  new MutationObserver(() => { if (!q) q = requestAnimationFrame(() => { q = 0; card(); }); }).observe(document.body, { childList: true, subtree: true });
  card();
})();

// 25 oct 2026 (20h, Jeremy): Adsgram Task block task-56017 on the market, right under the daily missions.
// The player does the partner task, Adsgram calls the reward URL (Supabase function mct-adreward) and he gets in-game cash
// (mct_ad_reward, amount in ds_config mct_adreward_usd). Hidden when Adsgram has no task to show.
// 26 oct 2026 (23h30, Jeremy): the tasks are what earns the most: $600 (was $300, more than a video, less than the 1,000 ⭐ pack),
// and the block also shows in the "Out of cash?" sheet.
(() => {
  const BLOCK = 'task-56017';
  const TT = {
    fr: { h: '🤝 Mission partenaire', r: '+100 $', go: 'Go', claim: 'Récupérer', done: 'Fait ✅', wait: 'Prochaine mission dans', ok: '💵 +100 $ ajoutés à ton cash !' },
    id: { h: '🤝 Misi partner', r: '+$100', go: 'Mulai', claim: 'Klaim', done: 'Selesai ✅', wait: 'Misi berikutnya dalam', ok: '💵 +$100 ditambahkan ke uangmu!' },
    ru: { h: '🤝 Задание партнёра', r: '+$100', go: 'Go', claim: 'Забрать', done: 'Готово ✅', wait: 'Следующее задание через', ok: '💵 +$100 к твоим деньгам!' },
    ar: { h: '🤝 مهمة شريك', r: '+$100', go: 'ابدأ', claim: 'استلم', done: 'تم ✅', wait: 'المهمة التالية بعد', ok: '💵 تمت إضافة $100 إلى أموالك!' },
    fa: { h: '🤝 مأموریت همکار', r: '+100 دلار', go: 'برو', claim: 'دریافت', done: 'انجام شد ✅', wait: 'مأموریت بعدی تا', ok: '💵 100 دلار به پولت اضافه شد!' },
    en: { h: '🤝 Partner mission', r: '+$100', go: 'Go', claim: 'Claim', done: 'Done ✅', wait: 'Next mission in', ok: '💵 +$100 added to your cash!' },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TT[l] || TT.en; };
  // 28 oct 2026 (18h, Jeremy): 5 partner missions a day at most: once done, the block says so instead of offering more
  const AGF = { fr: (m) => '✅ Tes ' + m + ' missions du jour sont faites, reviens demain', en: (m) => '✅ Your ' + m + ' missions of the day are done, come back tomorrow', id: (m) => '✅ ' + m + ' misi hari ini selesai, kembali besok', ru: (m) => '✅ Все ' + m + ' заданий на сегодня выполнены, возвращайся завтра', ar: (m) => '✅ أنجزت مهامك الـ' + m + ' لهذا اليوم، عد غدًا', fa: (m) => '✅ ' + m + ' مأموریت امروزت انجام شد، فردا برگرد' };
  const agtFull = (m) => { let l = 'en'; try { l = LANG; } catch (e) {} return (AGF[l] || AGF.en)(m); };
  let sdk = null, gone = false;
  const load = () => sdk || (sdk = new Promise((ok, ko) => {
    if (window.Adsgram) return ok();
    const s = document.createElement('script'); s.src = 'https://sad.adsgram.ai/js/sad.min.js';
    s.onload = ok; s.onerror = () => { sdk = null; ko(new Error('load')); }; document.head.appendChild(s);
  }));
  function block(id, after) {
    const T = L(), w = document.createElement('div');
    w.id = id; w.className = 'msn'; w.hidden = true;
    w.style.cssText = 'padding:12px 14px';
    // 28 oct 2026 (12h36, Jeremy): 5 minutes between two partner missions (the server refuses earlier ones): a countdown in the meantime
    const until = (() => { try { return Number(localStorage.getItem('mct_agt_until') || 0); } catch (e) { return 0; } })();
    if (until > Date.now()) {
      w.innerHTML = '<b style="display:block;font-size:15px;margin-bottom:6px">' + T.h + '</b><div style="color:#8fa197;font-weight:700">⏳ ' + (T.wait || 'Next mission in') + ' <span class="agc"></span></div>';
      after.parentNode.insertBefore(w, after.nextSibling); w.hidden = false;
      const c = w.querySelector('.agc');
      const tick = () => { const s = Math.max(0, Math.ceil((until - Date.now()) / 1000)); if (c) c.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); if (s <= 0 || !document.body.contains(w)) { clearInterval(iv); w.remove(); } };
      const iv = setInterval(tick, 1000); tick();
      return;
    }
    w.innerHTML = '<b style="display:block;font-size:15px;margin-bottom:8px">' + T.h + '</b>'
      + '<adsgram-task data-block-id="' + BLOCK + '" style="--adsgram-task-font-size:15px;--adsgram-task-icon-size:40px;--adsgram-task-button-width:84px;display:block">'
      + '<span slot="reward" style="color:#3ddc97;font-weight:800">' + T.r + '</span>'
      + '<div slot="button" style="background:#3ddc97;color:#06150e;font-weight:800;border-radius:10px;padding:8px 0;text-align:center">' + T.go + '</div>'
      + '<div slot="claim" style="background:#ff9f43;color:#1a0d00;font-weight:800;border-radius:10px;padding:8px 0;text-align:center">' + T.claim + '</div>'
      + '<div slot="done" style="color:#8fa197;font-weight:700;text-align:center">' + T.done + '</div>'
      + '</adsgram-task>';
    after.parentNode.insertBefore(w, after.nextSibling);
    // 28 oct 2026 (18h, Jeremy): the server says how many partner missions are left today and when the next one comes (limit and countdown)
    try { tonCall({ action: 'mon_agt' }).then((g) => {
      if (!g || !g.ok || !document.body.contains(w)) return;
      const mx = Number(g.max || 5), dn = Number(g.done || 0);
      if (dn >= mx) { w.innerHTML = '<b style="display:block;font-size:15px;margin-bottom:6px">' + T.h + '</b><div style="color:#8fa197;font-weight:700">' + agtFull(mx) + '</div>'; w.hidden = false; return; }
      if (Number(g.next) > Date.now() + 2000) { try { localStorage.setItem('mct_agt_until', String(g.next)); } catch (e) {} w.remove(); put(); return; }
      const hb = w.querySelector('b'); if (hb) hb.textContent = T.h + ' · ' + dn + '/' + mx;
    }).catch(() => {}); } catch (e) {}
    const el = w.querySelector('adsgram-task');
    el.addEventListener('onBannerNotFound', () => { gone = true; document.querySelectorAll('.agtk').forEach((x) => x.remove()); w.remove(); });  // no task for this player: nothing shown until the app reopens
    el.addEventListener('onError', () => { w.remove(); });
    el.addEventListener('reward', () => {
      try { localStorage.setItem('mct_agt_until', String(Date.now() + 30000)); } catch (e) {}  // 30 oct 2026 (19h12): next one in 30 seconds (was 5 minutes)
      try { haptic('ok'); } catch (e) {}
      try { toast(T.ok); } catch (e) {}
      setTimeout(() => { try { if (VIEW === 'market') market(); else if (typeof loadMe === 'function') loadMe(); } catch (e) {} }, 2500);  // the cash comes from the server (reward URL)
    });
    w.classList.add('agtk');
    load().then(() => { if (document.body.contains(w)) w.hidden = false; }).catch(() => w.remove());
  }
  function put() {
    if (gone) return;
    let v = ''; try { v = VIEW; } catch (e) {}
    // the market, right under the daily missions
    if (v === 'market' && !document.getElementById('agtask')) { const msn = document.getElementById('msn'); if (msn && msn.parentNode) block('agtask', msn); }
    // 26 oct 2026 (23h43, Jeremy): no more partner mission in the Portfolio
    // the "Out of cash?" sheet, under its title
    const sh = document.getElementById('cssh');
    if (sh && !document.getElementById('agtask3')) { const hd = sh.querySelector('.hd'); if (hd) { block('agtask3', hd); const w = document.getElementById('agtask3'); if (w) w.style.margin = '0 0 10px'; } }
  }
  let q = 0;
  new MutationObserver(() => { if (!q) q = requestAnimationFrame(() => { q = 0; put(); }); }).observe(document.body, { childList: true, subtree: true });
  put();
})();
