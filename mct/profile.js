// 16 oct 2026 (Jeremy): player profiles in Meme Coin Tycoon. At the top left, instead of "Tycoon": the player's photo, name and rank;
// a tap opens his profile (stats, badges, coins he created, real TON earned). A tap on a name in the Leaders tab opens that player's profile.
// The player can change his nickname and his photo: Jeremy accepts or refuses each change first (Supabase function mct-ton).
(() => {
  const TX = {
    en: { me: 'My profile', worth: 'Net worth', rank: 'Rank', trades: 'Trades', days: 'Days played', sale: 'Best sale', coins: 'Coins created', refs: 'Friends invited', taps: 'Diamond taps',
      since: 'Playing since', badges: 'Badges', none: 'No badge yet: trade, create a coin, invite friends!', mycoins: 'Coins created', ton: '💰 Real TON', earned: 'Earned in total', paid: 'Already paid', next: 'Next Monday',
      nowal: 'Add your TON wallet in the 💎 TON page to get paid.', hasTon: '✅ Already paid in real TON', nick: '✏️ Change my nickname', photo: '📷 Change my photo', ph: 'New nickname (2 to 16 characters)', send: 'Send',
      pend: '⏳ Waiting for approval', pendN: (n) => '⏳ Nickname "' + n + '" waiting for approval', pendP: '⏳ New photo waiting for approval', sent: '✅ Sent! You will get a message once it is checked.',
      e_nick: '2 to 16 characters, no links or @.', e_taken: 'This nickname is already taken.', e_wait: 'One change per hour, try again later.', e_photo: 'This photo could not be sent.', err: 'Connection problem, try again.', close: 'Close', dev: 'creator of the game', x: 'since launch',
      b: { trade: '🎯 First trade', creator: '🪙 Creator', x10: '🚀 Coin x10', week: '🔥 7 days played', sponsor: '👥 Sponsor', sponsor5: '🤝 Super sponsor', tapper: '💎 Tapper', winner: '🏆 Contest winner', paid: '💸 Paid in TON', whale: '🐋 Whale', supporter: '💎 Supporter', crown: '👑 Crown' } },
    fr: { me: 'Mon profil', worth: 'Fortune', rank: 'Rang', trades: 'Trades', days: 'Jours joués', sale: 'Plus grosse vente', coins: 'Coins créés', refs: 'Amis invités', taps: 'Tapes diamant',
      since: 'Joue depuis le', badges: 'Badges', none: 'Pas encore de badge : trade, crée un coin, invite des amis !', mycoins: 'Coins créés', ton: '💰 Vrais TON', earned: 'Gagné au total', paid: 'Déjà payé', next: 'Lundi prochain',
      nowal: 'Ajoute ton portefeuille TON dans la page 💎 TON pour être payé.', hasTon: '✅ Déjà payé en vrais TON', nick: '✏️ Changer de pseudo', photo: '📷 Changer de photo', ph: 'Nouveau pseudo (2 à 16 caractères)', send: 'Envoyer',
      pend: '⏳ En attente de validation', pendN: (n) => '⏳ Pseudo « ' + n + ' » en attente de validation', pendP: '⏳ Nouvelle photo en attente de validation', sent: '✅ Envoyé ! Tu recevras un message une fois vérifié.',
      e_nick: '2 à 16 caractères, sans lien ni @.', e_taken: 'Ce pseudo est déjà pris.', e_wait: 'Un changement par heure, réessaie plus tard.', e_photo: 'Cette photo n\'a pas pu être envoyée.', err: 'Problème de connexion, réessaie.', close: 'Fermer', dev: 'créateur du jeu', x: 'depuis le lancement',
      b: { trade: '🎯 Premier trade', creator: '🪙 Créateur', x10: '🚀 Coin x10', week: '🔥 7 jours de jeu', sponsor: '👥 Parrain', sponsor5: '🤝 Super parrain', tapper: '💎 Tapeur', winner: '🏆 Gagnant de concours', paid: '💸 Payé en TON', whale: '🐋 Baleine', supporter: '💎 Supporter', crown: '👑 Couronne' } },
    ar: { me: 'ملفي', worth: 'الثروة', rank: 'الترتيب', trades: 'الصفقات', days: 'أيام اللعب', sale: 'أكبر بيع', coins: 'العملات المُنشأة', refs: 'الأصدقاء المدعوون', taps: 'ضغطات الماسة',
      since: 'يلعب منذ', badges: 'الشارات', none: 'لا شارة بعد: تداول، أنشئ عملة، ادعُ أصدقاءك!', mycoins: 'العملات المُنشأة', ton: '💰 عملات TON حقيقية', earned: 'المجموع المكتسب', paid: 'مدفوع سابقًا', next: 'الاثنين القادم',
      nowal: 'أضف محفظة TON في صفحة 💎 TON لتحصل على الدفع.', hasTon: '✅ حصل على دفعات TON حقيقية', nick: '✏️ تغيير الاسم', photo: '📷 تغيير الصورة', ph: 'اسم جديد (من 2 إلى 16 حرفًا)', send: 'إرسال',
      pend: '⏳ بانتظار الموافقة', pendN: (n) => '⏳ الاسم «' + n + '» بانتظار الموافقة', pendP: '⏳ الصورة الجديدة بانتظار الموافقة', sent: '✅ تم الإرسال! ستصلك رسالة بعد المراجعة.',
      e_nick: 'من 2 إلى 16 حرفًا، بدون روابط أو @.', e_taken: 'هذا الاسم مستخدم.', e_wait: 'تغيير واحد كل ساعة، حاول لاحقًا.', e_photo: 'تعذر إرسال الصورة.', err: 'مشكلة في الاتصال، حاول مرة أخرى.', close: 'إغلاق', dev: 'صانع اللعبة', x: 'منذ الإطلاق',
      b: { trade: '🎯 أول صفقة', creator: '🪙 منشئ', x10: '🚀 عملة x10', week: '🔥 7 أيام لعب', sponsor: '👥 داعٍ', sponsor5: '🤝 داعٍ ممتاز', tapper: '💎 ضاغط', winner: '🏆 فائز بمسابقة', paid: '💸 دُفع له TON', whale: '🐋 حوت', supporter: '💎 داعم', crown: '👑 تاج' } },
  };
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] ? l : 'en'; };
  const L = () => TX[lg()];
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const nf = (n) => Number(n || 0).toLocaleString(lg() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: 0 });
  const usd = (v, d) => { const x = Number(v || 0).toFixed(d == null ? 2 : d); return lg() === 'fr' ? x.replace('.', ',') + ' $' : '$' + x; };
  const big = (v) => lg() === 'fr' ? nf(v) + ' $' : '$' + nf(v);
  const day = (s) => { try { return new Date(s).toLocaleDateString(lg() === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short' }); } catch (e) { return ''; } };
  const COL = ['#ffd43b', '#4ff0b7', '#ff5d8f', '#2ee6ff', '#b18cff', '#ff9f43'];
  const av = (p, sz) => p && p.photo
    ? '<img src="' + ec(p.photo) + '" alt="" style="width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;object-fit:cover;flex:none;background:#2b0a57">'
    : '<span style="width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;flex:none;display:inline-grid;place-items:center;font-weight:800;font-size:' + Math.round(sz * 0.48) + 'px;color:#1a0638;background:' + COL[Number(String((p && p.pid) || 0).slice(-3)) % COL.length] + '">' + ec(String((p && p.name) || '?').trim().charAt(0).toUpperCase() || '?') + '</span>';
  let ME_P = null;

  const st = document.createElement('style');
  st.textContent = '.brand.pf{cursor:pointer;gap:8px;min-width:0}.brand.pf b{max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:15px}.brand.pf small{font-size:12px;opacity:.75;font-weight:600}'
    + '#pfm{position:fixed;inset:0;z-index:9998;background:rgba(5,3,15,.78);display:flex;align-items:flex-end;justify-content:center}'
    + '#pfm .pbox{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:16px 16px calc(20px + env(safe-area-inset-bottom))}'
    + '#pfm .px{position:sticky;top:0;float:right;background:none;border:0;color:inherit;font-size:22px;opacity:.7;cursor:pointer;padding:4px 8px}'
    + '#pfm .phead{display:flex;align-items:center;gap:14px;margin:4px 0 14px}#pfm .phead h2{margin:0;font-size:21px;word-break:break-word}#pfm .phead small{display:block;opacity:.75;font-size:13px}'
    + '#pfm .pgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 12px}#pfm .pst{background:rgba(255,255,255,.04);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:14px;padding:10px 12px}#pfm .pst small{display:block;opacity:.7;font-size:12px}#pfm .pst b{font-size:17px}'
    + '#pfm .pc{border:1px solid var(--line,rgba(255,255,255,.12));border-radius:16px;padding:12px 14px;margin:0 0 12px;background:rgba(255,255,255,.03)}#pfm .pl{font-size:12px;opacity:.7;text-transform:uppercase;letter-spacing:.04em;margin:0 0 8px}'
    + '#pfm .pbd{display:flex;flex-wrap:wrap;gap:6px}#pfm .pbd span{background:rgba(255,212,59,.12);border:1px solid rgba(255,212,59,.35);border-radius:999px;padding:5px 10px;font-size:13px;font-weight:700}'
    + '#pfm .pco{display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:0;border-bottom:1px solid rgba(255,255,255,.06);background:none;color:inherit;padding:8px 0;font-size:14px}#pfm .pco:last-child{border-bottom:0}'
    + '#pfm .prow{display:flex;justify-content:space-between;font-size:14px;padding:5px 0}#pfm .ped{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 12px}#pfm .ped button{margin:0;padding:10px 6px;font-size:14px}'
    + '#pfm input{width:100%;box-sizing:border-box;border-radius:12px;border:1px solid var(--line,rgba(255,255,255,.2));background:rgba(255,255,255,.06);color:inherit;padding:11px 12px;font-size:15px;margin:0 0 8px}'
    + '#pfm .pnote{font-size:13px;opacity:.85;margin:0 0 10px}';
  document.head.appendChild(st);

  // at the top left: photo, name and rank instead of "Tycoon"
  function brand() {
    const b = document.querySelector('header.top .brand'); if (!b || !ME_P) return;
    b.classList.add('pf');
    b.innerHTML = av(ME_P, 30) + '<b>' + ec(ME_P.name) + '</b><small>' + (ME_P.dev ? '👨‍💻' : ME_P.rank ? '#' + ME_P.rank : '') + '</small>';
    b.onclick = () => { hp(); show(0); };
  }
  async function loadMe() {
    let r = null; try { r = await tonCall({ action: 'profile' }); } catch (e) {}
    if (r && r.ok) { ME_P = r; brand(); }
    return r;
  }
  let tries = 0; (function boot() { if (typeof tonCall === 'function' && window.Telegram && Telegram.WebApp && Telegram.WebApp.initData) loadMe(); else if (++tries < 40) setTimeout(boot, 250); })();
  setInterval(() => { if (!document.hidden) loadMe(); }, 120000);

  function closeIt() { const d = document.getElementById('pfm'); if (d) d.remove(); }
  async function show(pid) {
    let d = document.getElementById('pfm');
    if (!d) {
      d = document.createElement('div'); d.id = 'pfm';
      d.innerHTML = '<div class="pbox"><button class="px" id="pfx" aria-label="' + ec(L().close) + '">✕</button><div id="pfb" style="text-align:center;padding:30px 0">⏳</div></div>';
      d.onclick = (e) => { if (e.target === d) closeIt(); };
      document.body.appendChild(d);
      d.querySelector('#pfx').onclick = () => { hp(); closeIt(); };
    }
    let r = null; try { r = await tonCall(pid ? { action: 'profile', pid } : { action: 'profile' }); } catch (e) {}
    const b = document.getElementById('pfb'); if (!b) return;
    if (!r || !r.ok) { b.textContent = L().err; return; }
    if (r.me) { ME_P = r; brand(); }
    paint(r);
  }

  function paint(p) {
    const b = document.getElementById('pfb'); if (!b) return;
    const T = L();
    const stat = (k, v) => '<div class="pst"><small>' + ec(T[k]) + '</small><b>' + ec(v) + '</b></div>';
    let h = '<div class="phead">' + av(p, 64) + '<div><h2>' + ec(p.name) + '</h2><small>' + (p.dev ? '👨‍💻 ' + ec(T.dev) : p.ai ? '🤖 AI' : p.rank ? '🏆 #' + p.rank + ' / ' + nf(p.total) : '') + '</small><small>' + ec(T.since) + ' ' + ec(day(p.since)) + '</small></div></div>';
    if (p.me) {
      h += (p.nick_pending ? '<p class="pnote">' + ec(T.pendN(p.nick_pending)) + '</p>' : '') + (p.photo_pending ? '<p class="pnote">' + ec(T.pendP) + '</p>' : '');
      h += '<div class="ped"><button class="btn ghost" id="pfn">' + ec(T.nick) + '</button><button class="btn ghost" id="pfp">' + ec(T.photo) + '</button></div><div id="pfedit"></div>';
    }
    h += '<div class="pgrid">' + stat('worth', big(p.worth)) + stat('trades', nf(p.trades)) + stat('days', nf(p.days)) + stat('sale', big(p.best_sale)) + stat('coins', nf(p.coins_n)) + stat('refs', nf(p.refs)) + stat('taps', nf(p.taps)) + stat('rank', p.dev ? '👨‍💻' : p.rank ? '#' + p.rank : '-') + '</div>';
    h += '<div class="pc"><div class="pl">' + ec(T.badges) + '</div>' + ((p.badges || []).length ? '<div class="pbd">' + p.badges.map((k) => '<span>' + ec(T.b[k] || k) + '</span>').join('') + '</div>' : '<p class="pnote" style="margin:0">' + ec(T.none) + '</p>') + '</div>';
    if ((p.coins || []).length) h += '<div class="pc"><div class="pl">' + ec(T.mycoins) + ' (' + p.coins_n + ')</div>' + p.coins.map((c) => '<button class="pco" data-coin="' + c.id + '"><span style="font-size:20px">' + ec(c.emoji || '🪙') + '</span><b style="flex:1">$' + ec(c.ticker) + (c.rug ? ' 🚨' : '') + '</b><span style="opacity:.8">×' + ec(String(c.x).replace('.', lg() === 'fr' ? ',' : '.')) + ' <small>' + ec(T.x) + '</small></span></button>').join('') + '</div>';
    if (p.me && p.ton) h += '<div class="pc"><div class="pl">' + ec(T.ton) + '</div><div class="prow"><span>' + ec(T.earned) + '</span><b>' + usd(p.ton.earned, 4) + '</b></div><div class="prow"><span>' + ec(T.paid) + '</span><b>' + usd(p.ton.paid) + '</b></div><div class="prow"><span>' + ec(T.next) + '</span><b>' + usd(p.ton.next, 4) + '</b></div>' + (p.ton.wallet ? '' : '<p class="pnote" style="margin:6px 0 0">' + ec(T.nowal) + '</p>') + '</div>';
    else if (p.has_ton) h += '<p class="pnote" style="text-align:center">' + ec(T.hasTon) + '</p>';
    b.style.cssText = ''; b.innerHTML = h;
    b.querySelectorAll('[data-coin]').forEach((x) => x.onclick = () => { hp(); closeIt(); try { openCoin(x.dataset.coin); } catch (e) {} });
    const n = document.getElementById('pfn');
    if (n) n.onclick = () => {
      hp(); const ed = document.getElementById('pfedit');
      ed.innerHTML = '<input id="pfi" maxlength="16" placeholder="' + ec(T.ph) + '" value="' + ec(p.nick_pending || '') + '"><button class="btn" id="pfs" style="margin:0 0 12px">' + ec(T.send) + '</button>';
      const i = document.getElementById('pfi'); try { i.focus(); } catch (e) {}
      document.getElementById('pfs').onclick = async () => {
        const v = i.value.trim(); if (v.length < 2) { tst(T.e_nick); return; }
        let r = null; try { r = await tonCall({ action: 'prof_nick', nick: v }); } catch (e) {}
        if (r && r.ok) { hp('ok'); tst(T.sent); show(0); } else tst(T['e_' + ((r && r.error) || '')] || T.err);
      };
    };
    const ph = document.getElementById('pfp');
    if (ph) ph.onclick = () => {
      hp(); const f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*';
      f.onchange = () => { const file = f.files && f.files[0]; if (file) upload(file); };
      f.click();
    };
  }

  // the photo is cut to a 256 x 256 square in the phone, then sent (JPEG)
  function upload(file) {
    const T = L(), img = new Image(), url = URL.createObjectURL(file);
    img.onload = async () => {
      const s = Math.min(img.width, img.height), c = document.createElement('canvas'); c.width = c.height = 256;
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 256, 256);
      URL.revokeObjectURL(url);
      let r = null; try { r = await tonCall({ action: 'prof_photo', data: c.toDataURL('image/jpeg', 0.85) }); } catch (e) {}
      if (r && r.ok) { hp('ok'); tst(T.sent); show(0); } else tst(T['e_' + ((r && r.error) || '')] || T.e_photo);
    };
    img.onerror = () => tst(T.e_photo);
    img.src = url;
  }

  // a tap on a player in the Leaders tab (players ranking) opens his profile
  let IDS = null, IDT = 0;
  async function bindLeaders() {
    // the players ranking is the one whose tab is pressed (does not depend on the game's variables)
    const v = document.getElementById('view'); if (!v || !v.querySelector('[data-lb="players"][aria-pressed="true"]')) return;
    const rows = [...v.querySelectorAll(':scope > .row')]; if (!rows.length || rows[0].dataset.pf) return;
    rows.forEach((r) => { r.dataset.pf = '1'; });
    if (!IDS || Date.now() - IDT > 60000) { try { const r = await tonCall({ action: 'lb_ids' }); IDS = (r && r.ids) || []; IDT = Date.now(); } catch (e) { IDS = []; } }
    // same order as the ranking (the creator shows at his place without a rank, 50 ranked players at most)
    let rk = 0; const ids = IDS.filter((id) => Number(id) === 7057960224 ? rk < 50 : rk < 50 && ++rk);
    rows.forEach((r, i) => {
      const own = r.previousElementSibling && r.previousElementSibling.classList.contains('hint') && /⋯/.test(r.previousElementSibling.textContent || '');
      const id = own ? 0 : ids[i]; if (!own && !id) return;
      r.style.cursor = 'pointer'; r.onclick = () => { hp(); show(id); };
    });
  }
  window.mctProfile = (pid) => show(pid || 0); // used by the contests (rank.js)
  (function watch() { const v = document.getElementById('view'); if (!v) { setTimeout(watch, 250); return; } new MutationObserver(() => bindLeaders()).observe(v, { childList: true }); })();
})();
