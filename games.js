// 24 oct 2026 (Jeremy): print of the phone (screen, system, graphics chip...), the same for every Telegram account opened on that phone.
// Added as ?jfp= to each game's API calls; the server only blocks a 3rd account with the SAME IP AND the SAME phone in a game.
(function () {
  if (window.JSFP) return;
  var cs1 = document.currentScript;
  if (((cs1 && cs1.dataset && cs1.dataset.from) || window.JER_FROM) === 'mct') return;  // MCT sends its own print
  var p = [];
  try {
    var s = window.screen || {}, n = navigator, tw = window.Telegram && window.Telegram.WebApp;
    p.push(n.userAgent || '', n.platform || '', Math.max(s.width || 0, s.height || 0) + 'x' + Math.min(s.width || 0, s.height || 0), s.colorDepth || '', window.devicePixelRatio || '',
      n.hardwareConcurrency || '', n.deviceMemory || '', n.maxTouchPoints || '', (Intl.DateTimeFormat().resolvedOptions().timeZone) || '', (n.languages || [n.language]).join(','), (tw && tw.platform) || '');
    try { var c = document.createElement('canvas').getContext('webgl'); var d = c && c.getExtension('WEBGL_debug_renderer_info'); if (c) p.push(d ? c.getParameter(d.UNMASKED_RENDERER_WEBGL) : c.getParameter(c.RENDERER), c.getParameter(c.MAX_TEXTURE_SIZE)); } catch (e) {}
  } catch (e) {}
  var str = p.join('|'), h1 = 0x811c9dc5, h2 = 0x01000193;
  for (var i = 0; i < str.length; i++) { var k = str.charCodeAt(i); h1 = Math.imul(h1 ^ k, 16777619); h2 = Math.imul(h2 ^ k, 2246822519); }
  window.JSFP = ((h1 >>> 0).toString(16) + (h2 >>> 0).toString(16)).slice(0, 16);
  var of = window.fetch; if (!of) return;
  window.fetch = function (u, o) {
    try {
      if (typeof u === 'string' && /txvrlvcxfnylnrpdrxtt\.supabase\.co\/functions\/v1\/|pote-ia-bot-en-production\.up\.railway\.app\/(?!mct)|^\/ds\//.test(u) && u.indexOf('jfp=') < 0)
        u = u + (u.indexOf('?') < 0 ? '?' : '&') + 'jfp=' + window.JSFP;
    } catch (e) {}
    return of.call(window, u, o);
  };
})();
// 24 oct 2026 (Jeremy): the same "Compte bloqué" screen in every game, current and future, because each of them loads this file.
// The reason comes from the server (ban_reason_pub): dup = 3rd account on the same IP in a game, cheat, insults_cheat, insults.
// Each game can also call window.JSBan() itself when its API answers 'banned'.
(function () {
  if (window.JSBan) return;
  var cs0 = document.currentScript;
  if (((cs0 && cs0.dataset && cs0.dataset.from) || window.JER_FROM) === 'mct') return;  // MCT has its own screen (with the wallet form)
  var TW = window.Telegram && window.Telegram.WebApp;
  var shown = false;
  function render(reason) {
    if (shown) return; shown = true;
    var lc = String((TW && TW.initDataUnsafe && TW.initDataUnsafe.user && TW.initDataUnsafe.user.language_code) || navigator.language || 'en');
    var F = /^fr/i.test(lc);
    var txt = reason === 'dup' ? (F ? '🤖 L\'IA a détecté plusieurs comptes sur la même IP et le même téléphone.<br>2 comptes maximum par IP.' : '🤖 The AI detected several accounts on the same IP and the same phone.<br>2 accounts per IP at most.')
      : (F ? (reason === 'cheat' ? '🤖 Détecté par notre IA anti-triche.<br>Motif : triche.<br>Même téléphone et même adresse IP sur plusieurs comptes.' : reason === 'insults_cheat' ? 'Motif : insultes et triche.<br>Même téléphone et même adresse IP sur plusieurs comptes.' : 'Motif : insultes.')
          : (reason === 'cheat' ? '🤖 Detected by our anti-cheat AI.<br>Reason: cheating.<br>Same phone and same IP address on several accounts.' : reason === 'insults_cheat' ? 'Reason: insults and cheating.<br>Same phone and same IP address on several accounts.' : 'Reason: insults.'))
        + '<br>' + (F ? 'Les sommes gagnées ont été payées si tu avais ajouté ton wallet. Sinon, ajoute-le dans Meme Coin Tycoon.' : 'What you earned has been paid if you had added your wallet. If not, add it in Meme Coin Tycoon.');
    var el = document.createElement('div'); el.id = 'jsban';
    el.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:24px max(16px,env(safe-area-inset-right,0px)) 24px max(16px,env(safe-area-inset-left,0px));background:#0b0716;color:#f3eefe;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-align:center';
    el.innerHTML = '<div style="width:100%;max-width:380px"><div style="font-size:54px">🚫</div><h2 style="margin:10px 0 6px;font-size:22px">' + (F ? 'Compte bloqué' : 'Account blocked') + '</h2><p style="margin:0;font-size:15px;line-height:1.45;opacity:.85">' + txt + '</p></div>';
    var put = function () { document.body.appendChild(el); var t = document.querySelector('.jgt'); if (t) t.remove(); };
    if (document.body) put(); else document.addEventListener('DOMContentLoaded', put);
  }
  function check(cb) {
    var id = TW && TW.initDataUnsafe && TW.initDataUnsafe.user && TW.initDataUnsafe.user.id;
    if (!id) { cb && cb(null); return; }
    fetch('https://txvrlvcxfnylnrpdrxtt.supabase.co/rest/v1/rpc/ban_reason_pub', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: 'sb_publishable_7aA-njoU5fU2ialO0ExwQQ_REHjAEIe' }, body: JSON.stringify({ p_uid: id }) })
      .then(function (r) { return r.ok ? r.json() : null; }).then(function (x) { cb && cb(x); }).catch(function () { cb && cb(null); });
  }
  // called by a game when its API says 'banned': the screen shows at once, the reason is fetched
  window.JSBan = function (reason) { if (reason) return render(reason); check(function (x) { render(x || 'insults'); }); };
  // and checked by itself at every opening, so a future game needs nothing more than this script
  if (TW && TW.initData) check(function (x) { if (x) render(x); });
})();
// 24 oct 2026 (Jeremy): "My other games", shared by every Jeremstyke mini app. One file: a new game is added here once and shows up in all of them.
// Each game loads it with <script src="https://jeremstyke.github.io/games.js" data-from="rr"></script> (rr, mct, bt, ds...).
// A small 🎮 tab on the right edge opens a sheet with the other games; the links carry src_xg_<from> so each game sees where its players come from.
(function () {
  if (window.__jerGames) return; window.__jerGames = 1;
  var TW = window.Telegram && window.Telegram.WebApp;
  if (!TW || !TW.initData) return;  // only inside a Telegram mini app
  var cs = document.currentScript;
  var FROM = String((cs && cs.dataset && cs.dataset.from) || window.JER_FROM || 'x').replace(/[^a-z0-9]/gi, '').slice(0, 8);
  var G = [
    { id: 'mct', e: '🐸', n: 'Meme Coin Tycoon', u: 'https://t.me/Memecointycoonbot?startapp=src_xg_', c: '#ffd43b',
      d: { en: 'Launch your memecoin and become #1', fr: 'Lance ton memecoin et deviens n°1', es: 'Lanza tu memecoin y sé el n.º 1', pt: 'Lance sua memecoin e seja o nº 1', ru: 'Запусти свой мемкоин и стань №1', uk: 'Запусти свій мемкоїн і стань №1', tr: 'Memecoin\'ini çıkar, 1 numara ol', id: 'Luncurkan memecoin-mu dan jadi #1', ar: 'أطلق عملتك الميم وكن الأول', fa: 'میم‌کوین خودت را بساز و اول شو', de: 'Starte deinen Memecoin und werde Nr. 1', it: 'Lancia il tuo memecoin e diventa il n. 1' } },
    { id: 'bt', e: '🏃', n: 'Pass The Baton', u: 'https://t.me/PassTheBatonBot/play?startapp=src_xg_', c: '#2f8dff',
      d: { en: 'Hold the baton, earn real USDT', fr: 'Garde le bâton, gagne de vrais USDT', es: 'Guarda el testigo y gana USDT reales', pt: 'Segure o bastão e ganhe USDT de verdade', ru: 'Держи эстафету и зарабатывай USDT', uk: 'Тримай естафету й заробляй USDT', tr: 'Bayrağı tut, gerçek USDT kazan', id: 'Pegang tongkat, dapatkan USDT asli', ar: 'احتفظ بالعصا واربح USDT حقيقية', fa: 'باتوم را نگه دار و USDT واقعی بگیر', de: 'Halte den Staffelstab, verdiene echte USDT', it: 'Tieni il testimone e guadagna USDT veri' } },
    { id: 'rr', e: '⛏️', n: 'Rig Rush', u: 'https://t.me/RigRushBot/Play?startapp=src_xg_', c: '#39ff9f',
      d: { en: 'Mine RIGZ, build your rig, airdrop', fr: 'Mine des RIGZ, monte ton rig, airdrop', es: 'Mina RIGZ, mejora tu rig, airdrop', pt: 'Minere RIGZ, monte seu rig, airdrop', ru: 'Майни RIGZ, прокачивай риг, airdrop', uk: 'Майни RIGZ, прокачуй риг, airdrop', tr: 'RIGZ kaz, rig\'ini kur, airdrop', id: 'Tambang RIGZ, bangun rig-mu, airdrop', ar: 'عدّن RIGZ وطوّر جهازك، airdrop', fa: 'RIGZ استخراج کن، ریگ بساز، ایردراپ', de: 'Schürfe RIGZ, bau dein Rig, Airdrop', it: 'Mina RIGZ, potenzia il rig, airdrop' } },
    { id: 'ds', e: '⚽', n: 'Daily Score', u: 'https://t.me/DailyScorefootbot/play?startapp=src_xg_', c: '#7bd88f',
      d: { en: 'Predict the score of the match of the day', fr: 'Pronostique le score du match du jour', es: 'Predice el marcador del partido del día', pt: 'Palpite o placar do jogo do dia', ru: 'Угадай счёт матча дня', uk: 'Вгадай рахунок матчу дня', tr: 'Günün maçının skorunu tahmin et', id: 'Tebak skor pertandingan hari ini', ar: 'توقّع نتيجة مباراة اليوم', fa: 'نتیجه بازی روز را پیش‌بینی کن', de: 'Tippe das Ergebnis des Spiels des Tages', it: 'Pronostica il risultato della partita del giorno' } }
  ];
  // 24 oct 2026 (Jeremy): my channels too, under the games
  var C = [
    { u: 'jeremstyke', e: '📢', d: { en: 'Telegram business tips and news of my games', fr: 'Business Telegram et actus de mes jeux', es: 'Negocios en Telegram y novedades de mis juegos', pt: 'Negócios no Telegram e novidades dos meus jogos', ru: 'Бизнес в Telegram и новости моих игр', uk: 'Бізнес у Telegram і новини моїх ігор', tr: 'Telegram iş ipuçları ve oyun haberleri', id: 'Bisnis Telegram dan kabar game saya', ar: 'أعمال تيليجرام وأخبار ألعابي', fa: 'کسب‌وکار تلگرام و اخبار بازی‌هایم', de: 'Telegram-Business und News zu meinen Spielen', it: 'Business su Telegram e novità dei miei giochi' } }
  ];
  var CT = { en: ['My channel', 'Join'], fr: ['Ma chaîne', 'Rejoindre'], es: ['Mi canal', 'Unirme'], pt: ['Meu canal', 'Entrar'], ru: ['Мой канал', 'Вступить'], uk: ['Мій канал', 'Приєднатися'], tr: ['Kanalım', 'Katıl'], id: ['Kanal saya', 'Gabung'], ar: ['قناتي', 'انضم'], fa: ['کانال من', 'عضویت'], de: ['Mein Kanal', 'Beitreten'], it: ['Il mio canale', 'Unisciti'] };
  var PT = { en: ['Payout proofs', 'Every payout to players, with its blockchain transaction', 'See'], fr: ['Preuves de paiement', 'Tous les paiements aux joueurs, avec leur transaction sur la blockchain', 'Voir'], es: ['Pruebas de pago', 'Todos los pagos a jugadores, con su transacción en la blockchain', 'Ver'], pt: ['Provas de pagamento', 'Todos os pagamentos aos jogadores, com a transação na blockchain', 'Ver'], ru: ['Доказательства выплат', 'Все выплаты игрокам с транзакциями в блокчейне', 'Открыть'], uk: ['Докази виплат', 'Усі виплати гравцям із транзакціями в блокчейні', 'Відкрити'], tr: ['Ödeme kanıtları', 'Oyunculara yapılan tüm ödemeler, blokzincir işlemleriyle', 'Gör'], id: ['Bukti pembayaran', 'Semua pembayaran ke pemain, dengan transaksi blockchain-nya', 'Lihat'], ar: ['إثباتات الدفع', 'كل المدفوعات للاعبين مع معاملاتها على البلوكشين', 'عرض'], fa: ['اثبات پرداخت‌ها', 'همه پرداخت‌ها به بازیکنان با تراکنش بلاکچین', 'دیدن'], de: ['Auszahlungsnachweise', 'Alle Auszahlungen an Spieler, mit Blockchain-Transaktion', 'Ansehen'], it: ['Prove di pagamento', 'Tutti i pagamenti ai giocatori, con la transazione sulla blockchain', 'Vedi'] };
  var T = { en: ['My other games', 'Free · by @jeremstyke', 'Play'], fr: ['Mes autres jeux', 'Gratuits · by @jeremstyke', 'Jouer'], es: ['Mis otros juegos', 'Gratis · by @jeremstyke', 'Jugar'], pt: ['Meus outros jogos', 'Grátis · by @jeremstyke', 'Jogar'], ru: ['Мои другие игры', 'Бесплатно · by @jeremstyke', 'Играть'], uk: ['Мої інші ігри', 'Безкоштовно · by @jeremstyke', 'Грати'], tr: ['Diğer oyunlarım', 'Ücretsiz · by @jeremstyke', 'Oyna'], id: ['Game saya lainnya', 'Gratis · by @jeremstyke', 'Main'], ar: ['ألعابي الأخرى', 'مجانية · by @jeremstyke', 'العب'], fa: ['بازی‌های دیگر من', 'رایگان · by @jeremstyke', 'بازی'], de: ['Meine anderen Spiele', 'Kostenlos · by @jeremstyke', 'Spielen'], it: ['I miei altri giochi', 'Gratis · by @jeremstyke', 'Gioca'] };
  var lc = String((TW.initDataUnsafe && TW.initDataUnsafe.user && TW.initDataUnsafe.user.language_code) || navigator.language || 'en').toLowerCase();
  var L = /^(be|kk)/.test(lc) ? 'ru' : /^ms/.test(lc) ? 'id' : lc.slice(0, 2); if (!T[L]) L = 'en';
  var list = G.filter(function (g) { return g.id !== FROM; });
  if (!list.length) return;
  var seenKey = 'jg_seen', seen = '';
  try { seen = localStorage.getItem(seenKey) || ''; } catch (e) {}
  var fresh = list.some(function (g) { return seen.split(',').indexOf(g.id) < 0; });
  var css = '.jgt{position:fixed;right:0;top:44%;z-index:9990;width:38px;height:46px;border-radius:14px 0 0 14px;border:1px solid rgba(255,255,255,.18);border-right:0;background:rgba(18,16,40,.82);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;font-size:21px;display:grid;place-items:center;cursor:pointer;padding:0 0 0 2px;box-shadow:-4px 6px 18px rgba(0,0,0,.35);-webkit-tap-highlight-color:transparent}'
    + '.jgt i{position:absolute;top:6px;left:6px;width:9px;height:9px;border-radius:50%;background:#ff4d6d;box-shadow:0 0 0 2px rgba(18,16,40,.9);animation:jgp 1.6s infinite}'
    + '@keyframes jgp{50%{transform:scale(1.35)}}'
    + '.jgs{position:fixed;inset:0;z-index:9991;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}'
    + '.jgs[hidden]{display:none}'
    + '.jgb{width:100%;max-width:480px;background:#14122a;color:#f3f1ff;border-radius:22px 22px 0 0;padding:18px 16px calc(18px + env(safe-area-inset-bottom,0px));box-shadow:0 -10px 40px rgba(0,0,0,.4);animation:jgu .22s ease-out}'
    + '@keyframes jgu{from{transform:translateY(40px);opacity:0}}'
    + '.jgb h3{margin:0;font-size:19px;font-weight:800;text-align:center}.jgb p{margin:2px 0 14px;text-align:center;font-size:12px;opacity:.6}'
    + '.jgr{display:flex;align-items:center;gap:12px;padding:11px 12px;margin-top:8px;border-radius:16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);cursor:pointer;text-decoration:none;color:inherit}'
    + '.jgr .e{width:44px;height:44px;flex:none;border-radius:13px;display:grid;place-items:center;font-size:24px}'
    + '.jgr .t{flex:1;min-width:0}.jgr b{display:block;font-size:15px}.jgr small{display:block;font-size:12.5px;opacity:.7;line-height:1.3}'
    + '.jgr .go{flex:none;font-weight:800;font-size:13px;padding:8px 12px;border-radius:11px;color:#111}'
    + '.jgb h4{margin:16px 0 0;font-size:13px;font-weight:800;opacity:.6;text-transform:uppercase;letter-spacing:.06em}.jgb{max-height:88vh;overflow-y:auto}'
    + '.jgr .nw{display:inline-block;margin-left:6px;font-size:10px;font-weight:800;padding:1px 6px;border-radius:6px;background:#ff4d6d;color:#fff;vertical-align:2px}';
  function hexA(c, a) { var n = parseInt(c.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function open(u) { try { TW.HapticFeedback && TW.HapticFeedback.impactOccurred('light'); } catch (e) {} try { if (/^https:\/\/t\.me\//.test(u)) TW.openTelegramLink(u); else TW.openLink(u); } catch (e) { location.href = u; } }
  function mount() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var tab = document.createElement('button'); tab.className = 'jgt'; tab.type = 'button'; tab.setAttribute('aria-label', T[L][0]);
    tab.innerHTML = '🎮' + (fresh ? '<i></i>' : '');
    var sh = document.createElement('div'); sh.className = 'jgs'; sh.hidden = true; sh.setAttribute('dir', /^(ar|fa)$/.test(L) ? 'rtl' : 'ltr');
    sh.innerHTML = '<div class="jgb" role="dialog" aria-label="' + T[L][0] + '"><h3>🎮 ' + T[L][0] + '</h3><p>' + T[L][1] + '</p>'
      + list.map(function (g) { var isNew = seen.split(',').indexOf(g.id) < 0; return '<a class="jgr" data-u="' + g.u + FROM + '"><span class="e" style="background:' + hexA(g.c, .16) + '">' + g.e + '</span><span class="t"><b>' + g.n + (isNew ? '<span class="nw">NEW</span>' : '') + '</b><small>' + (g.d[L] || g.d.en) + '</small></span><span class="go" style="background:' + g.c + '">' + T[L][2] + '</span></a>'; }).join('')
      + '<h4>📢 ' + (CT[L] || CT.en)[0] + '</h4>'
      + C.map(function (c) { return '<a class="jgr" data-u="https://t.me/' + c.u + '"><span class="e" style="background:rgba(34,158,217,.18)">' + c.e + '</span><span class="t"><b>@' + c.u + '</b><small>' + (c.d[L] || c.d.en) + '</small></span><span class="go" style="background:#2aa3e0;color:#fff">' + (CT[L] || CT.en)[1] + '</span></a>'; }).join('')
      // 24 oct 2026 (Jeremy): the public payout proofs page of all his games
      + '<h4>✅ ' + (PT[L] || PT.en)[0] + '</h4>'
      + '<a class="jgr" data-u="https://jeremstyke.github.io/payouts/"><span class="e" style="background:rgba(61,220,151,.16)">🧾</span><span class="t"><b>' + (PT[L] || PT.en)[0] + '</b><small>' + (PT[L] || PT.en)[1] + '</small></span><span class="go" style="background:#3ddc97">' + (PT[L] || PT.en)[2] + '</span></a>'
      + '</div>';
    tab.onclick = function () { try { TW.HapticFeedback && TW.HapticFeedback.selectionChanged(); } catch (e) {} sh.hidden = false; var i = tab.querySelector('i'); if (i) i.remove(); try { localStorage.setItem(seenKey, list.map(function (g) { return g.id; }).concat(seen.split(',')).filter(Boolean).join(',')); } catch (e) {} };
    sh.onclick = function (e) { if (e.target === sh) sh.hidden = true; var a = e.target.closest && e.target.closest('.jgr'); if (a) { sh.hidden = true; open(a.getAttribute('data-u')); } };
    document.body.appendChild(tab); document.body.appendChild(sh);
    window.JerGames = { open: function () { tab.onclick(); } };
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
