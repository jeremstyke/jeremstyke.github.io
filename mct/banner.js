// 16 oct 2026 (Jeremy): a banner above the menu of Meme Coin Tycoon, sold to the players in Stars: 25 ⭐ for 24 h, 50 ⭐ for 24 h shown
// twice as often and first, 100 ⭐ for 7 days. Image + text (60 characters) + link; Jeremy checks each ad after payment (refunded if refused).
// 3 ads at most at the same time, they take turns every 8 seconds. Supabase function mct-ton: 'ads', 'ad_new', 'ad_hit'.
(() => {
  const TX = {
    en: { ad: 'Ad', go: 'Open ›', book: 'Book', yours: '📢 Your ad here, seen by all', from: (s) => 'from ' + s + ' ⭐', title: '📢 Advertise in Meme Coin Tycoon', intro: 'Your banner above the menu of the game, seen by every player. Checked before going live, refunded if refused.',
      p_day: '24 hours', p_boost: '24 hours · shown 2x more and first', p_week: '7 days', img: '🖼 Choose an image', txt: 'Your text (60 characters max)', link: 'Your link (https://t.me/... or https://...)', pay: (s) => 'Pay ' + s + ' ⭐',
      preview: 'Preview', mine: 'My ads', st: { paid: '⏳ Being checked', live: '✅ On', queued: '🕒 Waiting for a free slot', refused: '❌ Refused, refunded', done: '✔️ Finished' }, vw: 'views', ck: 'clicks',
      e_text: 'Text: 3 to 60 characters.', e_link: 'The link must start with https://', e_photo: 'Choose an image.', e_wait: 'Too many tries, wait a bit.', e_invoice: 'Payment not available, try again.', err: 'Connection problem, try again.',
      paid: '✅ Paid! Your ad goes live as soon as it is checked.', close: 'Close' },
    fr: { ad: 'Pub', go: 'Voir ›', book: 'Réserver', yours: '📢 Ta pub ici, vue par tous', from: (s) => 'dès ' + s + ' ⭐', title: '📢 Ta pub dans Meme Coin Tycoon', intro: 'Ta bannière au-dessus du menu du jeu, vue par tous les joueurs. Vérifiée avant d\'être en ligne, remboursée si refusée.',
      p_day: '24 heures', p_boost: '24 heures · affichée 2x plus et en premier', p_week: '7 jours', img: '🖼 Choisir une image', txt: 'Ton texte (60 caractères max)', link: 'Ton lien (https://t.me/... ou https://...)', pay: (s) => 'Payer ' + s + ' ⭐',
      preview: 'Aperçu', mine: 'Mes pubs', st: { paid: '⏳ En vérification', live: '✅ En ligne', queued: '🕒 En attente d\'une place libre', refused: '❌ Refusée, remboursée', done: '✔️ Terminée' }, vw: 'vues', ck: 'clics',
      e_text: 'Texte : 3 à 60 caractères.', e_link: 'Le lien doit commencer par https://', e_photo: 'Choisis une image.', e_wait: 'Trop d\'essais, attends un peu.', e_invoice: 'Paiement indisponible, réessaie.', err: 'Problème de connexion, réessaie.',
      paid: '✅ Payé ! Ta pub sera en ligne dès qu\'elle aura été vérifiée.', close: 'Fermer' },
    ar: { ad: 'إعلان', go: 'افتح ›', book: 'احجز', yours: '📢 إعلانك هنا، يراه الجميع', from: (s) => 'من ' + s + ' ⭐', title: '📢 أعلن في Meme Coin Tycoon', intro: 'لافتتك فوق قائمة اللعبة، يراها كل اللاعبين. تُراجع قبل النشر، ويُعاد المبلغ إذا رُفضت.',
      p_day: '24 ساعة', p_boost: '24 ساعة · تظهر ضعف المرات وفي البداية', p_week: '7 أيام', img: '🖼 اختر صورة', txt: 'نصك (60 حرفًا كحد أقصى)', link: 'رابطك (https://t.me/... أو https://...)', pay: (s) => 'ادفع ' + s + ' ⭐',
      preview: 'معاينة', mine: 'إعلاناتي', st: { paid: '⏳ قيد المراجعة', live: '✅ منشور', queued: '🕒 بانتظار مكان', refused: '❌ مرفوض، تم الاسترداد', done: '✔️ انتهى' }, vw: 'مشاهدات', ck: 'نقرات',
      e_text: 'النص: من 3 إلى 60 حرفًا.', e_link: 'يجب أن يبدأ الرابط بـ https://', e_photo: 'اختر صورة.', e_wait: 'محاولات كثيرة، انتظر قليلًا.', e_invoice: 'الدفع غير متاح، حاول مرة أخرى.', err: 'مشكلة في الاتصال، حاول مرة أخرى.',
      paid: '✅ تم الدفع! سيُنشر إعلانك بعد مراجعته.', close: 'إغلاق' },
  };
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] ? l : 'en'; };
  const L = () => TX[lg()];
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const nf = (n) => Number(n || 0).toLocaleString(lg() === 'fr' ? 'fr-FR' : 'en-US');
  const tw = window.Telegram && Telegram.WebApp;
  let A = null, LIST = [], I = 0, SEEN = {}, PLAN = 'day', IMG = null;

  const st = document.createElement('style');
  // 16 oct 2026 (Jeremy): stuck to the menu, full width and bright (like the game shop banners), the + of the menu fits in the menu
  st.textContent = 'body{padding-bottom:calc(var(--tab,68px) + 84px + env(safe-area-inset-bottom)) !important}'
    + '.toast{bottom:calc(var(--tab,68px) + 72px + env(safe-area-inset-bottom)) !important}nav.tb .plus{margin-top:0 !important;width:48px !important;height:48px !important;font-size:28px !important}'
    + '#adbar{position:fixed;left:0;right:0;bottom:calc(var(--tab,68px) + env(safe-area-inset-bottom));z-index:9;height:58px;display:flex;align-items:center;gap:10px;padding:7px 10px;background:linear-gradient(100deg,#ff4d00,#ff8a00 55%,#ffb800);color:#fff;box-shadow:0 -4px 18px rgba(255,120,0,.35);cursor:pointer;overflow:hidden}'
    + '#adbar:after{content:"";position:absolute;top:0;bottom:0;width:60px;left:-80px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);transform:skewX(-20deg);animation:adsh 4s ease-in-out infinite}@keyframes adsh{0%,60%{left:-80px}100%{left:110%}}'
    + '#adbar img{width:44px;height:44px;border-radius:10px;object-fit:cover;flex:none;box-shadow:0 2px 8px rgba(0,0,0,.25);background:#fff}#adbar .adt{flex:1;min-width:0;font-size:14px;line-height:1.2;font-weight:800;text-shadow:0 1px 2px rgba(0,0,0,.25);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}'
    + '#adbar .adl{position:absolute;top:3px;right:8px;font-size:9px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;opacity:.85}#adbar .adc{flex:none;font-size:13px;font-weight:800;background:#fff;color:#ff4d00;border-radius:999px;padding:7px 12px;margin-top:6px}'
    + '#adbar .adp{flex:none;font-size:15px;font-weight:800;background:rgba(0,0,0,.18);color:#fff;border-radius:999px;width:26px;height:26px;display:grid;place-items:center;margin-top:6px}'
    + '#adm2{position:fixed;inset:0;z-index:9998;background:rgba(5,3,15,.78);display:flex;align-items:flex-end;justify-content:center}'
    + '#adm2 .abox{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:16px 16px calc(20px + env(safe-area-inset-bottom))}'
    + '#adm2 .ax{float:right;background:none;border:0;color:inherit;font-size:22px;opacity:.7;cursor:pointer;padding:4px 8px}#adm2 h2{margin:4px 0 6px;font-size:19px}#adm2 .an{font-size:13px;opacity:.8;margin:0 0 12px}'
    + '#adm2 .apl{display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:1px solid var(--line,rgba(255,255,255,.15));background:rgba(255,255,255,.04);color:inherit;border-radius:14px;padding:11px 12px;margin:0 0 8px;font-size:14px}'
    + '#adm2 .apl.on{border-color:var(--gold,#ffd43b);background:rgba(255,212,59,.12)}#adm2 .apl b{flex:none;min-width:58px;font-size:16px}'
    + '#adm2 input{width:100%;box-sizing:border-box;border-radius:12px;border:1px solid var(--line,rgba(255,255,255,.2));background:rgba(255,255,255,.06);color:inherit;padding:11px 12px;font-size:15px;margin:0 0 8px}'
    + '#adm2 .apv{display:flex;align-items:center;gap:10px;border-radius:14px;background:rgba(43,10,87,.96);border:1px solid var(--line,rgba(255,255,255,.12));padding:6px;margin:0 0 12px;min-height:54px}#adm2 .apv img,#adm2 .apv .ai0{width:42px;height:42px;border-radius:9px;object-fit:cover;flex:none;background:rgba(255,255,255,.08)}'
    + '#adm2 .al{font-size:12px;opacity:.7;text-transform:uppercase;letter-spacing:.04em;margin:14px 0 6px}#adm2 .amr{display:flex;justify-content:space-between;gap:8px;font-size:13px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06)}';
  document.head.appendChild(st);

  function bar() {
    let b = document.getElementById('adbar');
    if (!A || !A.on) { if (b) b.remove(); return; }
    if (!b) { b = document.createElement('div'); b.id = 'adbar'; document.body.appendChild(b); }
    const T = L(), ad = LIST.length ? LIST[I % LIST.length] : null;
    if (!ad) {
      const p = A.plans && A.plans.day ? A.plans.day.stars : 25;
      b.innerHTML = '<span style="font-size:30px;width:44px;text-align:center;flex:none">📢</span><div class="adt">' + ec(T.yours.replace(/^📢 /, '')) + '<br><small style="opacity:.9;font-weight:700">' + ec(T.from(p)) + '</small></div><span class="adc">' + ec(T.book) + '</span>';
      b.onclick = () => { hp(); buy(); };
      return;
    }
    b.innerHTML = (ad.img ? '<img src="' + ec(ad.img) + '" alt="">' : '') + '<div class="adt">' + ec(ad.txt) + '</div><span class="adl">' + ec(T.ad) + '</span><span class="adc">' + ec(T.go) + '</span><span class="adp" data-buy="1">+</span>';
    b.onclick = (e) => {
      if (e.target && e.target.dataset && e.target.dataset.buy) { hp(); buy(); return; }
      hp(); tonCall({ action: 'ad_hit', id: ad.id, kind: 'click' }).catch(() => null);
      try { if (/^https:\/\/t\.me\//.test(ad.link)) tw.openTelegramLink(ad.link); else tw.openLink(ad.link); } catch (x) { window.open(ad.link, '_blank'); }
    };
    if (!SEEN[ad.id]) { SEEN[ad.id] = 1; tonCall({ action: 'ad_hit', id: ad.id, kind: 'view' }).catch(() => null); }
  }
  async function load() {
    let r = null; try { r = await tonCall({ action: 'ads' }); } catch (e) {}
    if (!r || !r.plans) return;
    A = r; LIST = [];
    (r.ads || []).forEach((a) => { for (let k = 0; k < Math.max(1, Number(a.w) || 1); k++) LIST.push(a); });
    // the boosted ads (shown twice) are spread out, not one after the other
    if (LIST.length > 2) { const o = [], b2 = LIST.filter((a, i) => LIST.indexOf(a) !== i), b1 = LIST.filter((a, i) => LIST.indexOf(a) === i); b1.forEach((a, i) => { o.push(a); if (b2[i]) o.push(b2[i]); }); LIST = o.concat(b2.slice(b1.length)); }
    bar();
  }
  let tries = 0; (function boot() { if (typeof tonCall === 'function' && tw && tw.initData && document.querySelector('nav.tb')) { load(); setInterval(load, 300000); setInterval(() => { if (LIST.length > 1 && !document.hidden) { I++; bar(); } }, 8000); } else if (++tries < 60) setTimeout(boot, 250); })();

  function closeIt() { const d = document.getElementById('adm2'); if (d) d.remove(); }
  function buy() {
    if (!A) return;
    closeIt(); IMG = null;
    const T = L(), d = document.createElement('div'); d.id = 'adm2';
    d.onclick = (e) => { if (e.target === d) closeIt(); };
    const plan = (k) => { const p = A.plans[k]; return '<button class="apl' + (k === PLAN ? ' on' : '') + '" data-plan="' + k + '"><b>' + p.stars + ' ⭐</b><span>' + ec(T['p_' + k]) + '</span></button>'; };
    const mine = (A.mine || []).map((m) => '<div class="amr"><span>' + ec(m.txt) + '</span><span style="flex:none;text-align:right">' + ec(T.st[m.status] || m.status) + (m.views || m.clicks ? '<br><small style="opacity:.7">' + nf(m.views) + ' ' + ec(T.vw) + ' · ' + nf(m.clicks) + ' ' + ec(T.ck) + '</small>' : '') + '</span></div>').join('');
    d.innerHTML = '<div class="abox"><button class="ax" id="adx" aria-label="' + ec(T.close) + '">✕</button><h2>' + ec(T.title) + '</h2><p class="an">' + ec(T.intro) + '</p>'
      + ['day', 'boost', 'week'].map(plan).join('')
      + '<button class="btn ghost" id="adi" style="margin:8px 0">' + ec(T.img) + '</button>'
      + '<input id="adt" maxlength="60" placeholder="' + ec(T.txt) + '"><input id="adk" maxlength="200" placeholder="' + ec(T.link) + '" inputmode="url">'
      + '<div class="al">' + ec(T.preview) + '</div><div class="apv"><span class="ai0" id="adpi"></span><div class="adt" id="adpt" style="flex:1;font-size:13px;font-weight:600;opacity:.9">' + ec(T.txt) + '</div></div>'
      + '<button class="btn" id="adpay">' + ec(T.pay(A.plans[PLAN].stars)) + '</button>'
      + (mine ? '<div class="al">' + ec(T.mine) + '</div>' + mine : '') + '</div>';
    document.body.appendChild(d);
    d.querySelector('#adx').onclick = () => { hp(); closeIt(); };
    d.querySelectorAll('[data-plan]').forEach((b) => b.onclick = () => { hp(); PLAN = b.dataset.plan; d.querySelectorAll('[data-plan]').forEach((x) => x.classList.toggle('on', x === b)); d.querySelector('#adpay').textContent = T.pay(A.plans[PLAN].stars); });
    const ti = d.querySelector('#adt'); ti.oninput = () => { d.querySelector('#adpt').textContent = ti.value || T.txt; };
    d.querySelector('#adi').onclick = () => {
      hp(); const f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*';
      f.onchange = () => {
        const file = f.files && f.files[0]; if (!file) return;
        const img = new Image(), url = URL.createObjectURL(file);
        img.onload = () => {
          const s = Math.min(img.width, img.height), c = document.createElement('canvas'); c.width = c.height = 256;
          c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 256, 256);
          URL.revokeObjectURL(url); IMG = c.toDataURL('image/jpeg', 0.85);
          const pi = d.querySelector('#adpi'); if (pi) pi.outerHTML = '<img id="adpi" src="' + IMG + '" alt="">';
        };
        img.onerror = () => tst(T.e_photo); img.src = url;
      };
      f.click();
    };
    d.querySelector('#adpay').onclick = async (e) => {
      const btn = e.currentTarget, txt = ti.value.trim(), link = d.querySelector('#adk').value.trim();
      if (!IMG) { tst(T.e_photo); return; }
      if (txt.length < 3 || txt.length > 60) { tst(T.e_text); return; }
      if (!/^https:\/\/\S+\.\S+/.test(link)) { tst(T.e_link); return; }
      hp(); btn.disabled = true; btn.textContent = '⏳';
      let r = null; try { r = await tonCall({ action: 'ad_new', plan: PLAN, txt, link, data: IMG }); } catch (x) {}
      btn.disabled = false; btn.textContent = T.pay(A.plans[PLAN].stars);
      if (!r || !r.ok || !r.link) { tst(T['e_' + ((r && r.error) || '')] || T.err); return; }
      try {
        tw.openInvoice(r.link, (s) => { if (s === 'paid') { hp('ok'); closeIt(); tst(T.paid); setTimeout(load, 3000); } });
      } catch (x) { try { tw.openTelegramLink(r.link); } catch (y) {} }
    };
  }
  window.mctAdBuy = buy;
})();
