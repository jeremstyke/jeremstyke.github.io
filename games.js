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
  function open(u) { try { TW.HapticFeedback && TW.HapticFeedback.impactOccurred('light'); } catch (e) {} try { TW.openTelegramLink(u); } catch (e) { location.href = u; } }
  function mount() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var tab = document.createElement('button'); tab.className = 'jgt'; tab.type = 'button'; tab.setAttribute('aria-label', T[L][0]);
    tab.innerHTML = '🎮' + (fresh ? '<i></i>' : '');
    var sh = document.createElement('div'); sh.className = 'jgs'; sh.hidden = true; sh.setAttribute('dir', /^(ar|fa)$/.test(L) ? 'rtl' : 'ltr');
    sh.innerHTML = '<div class="jgb" role="dialog" aria-label="' + T[L][0] + '"><h3>🎮 ' + T[L][0] + '</h3><p>' + T[L][1] + '</p>'
      + list.map(function (g) { var isNew = seen.split(',').indexOf(g.id) < 0; return '<a class="jgr" data-u="' + g.u + FROM + '"><span class="e" style="background:' + hexA(g.c, .16) + '">' + g.e + '</span><span class="t"><b>' + g.n + (isNew ? '<span class="nw">NEW</span>' : '') + '</b><small>' + (g.d[L] || g.d.en) + '</small></span><span class="go" style="background:' + g.c + '">' + T[L][2] + '</span></a>'; }).join('')
      + '<h4>📢 ' + (CT[L] || CT.en)[0] + '</h4>'
      + C.map(function (c) { return '<a class="jgr" data-u="https://t.me/' + c.u + '"><span class="e" style="background:rgba(34,158,217,.18)">' + c.e + '</span><span class="t"><b>@' + c.u + '</b><small>' + (c.d[L] || c.d.en) + '</small></span><span class="go" style="background:#2aa3e0;color:#fff">' + (CT[L] || CT.en)[1] + '</span></a>'; }).join('')
      + '</div>';
    tab.onclick = function () { try { TW.HapticFeedback && TW.HapticFeedback.selectionChanged(); } catch (e) {} sh.hidden = false; var i = tab.querySelector('i'); if (i) i.remove(); try { localStorage.setItem(seenKey, list.map(function (g) { return g.id; }).concat(seen.split(',')).filter(Boolean).join(',')); } catch (e) {} };
    sh.onclick = function (e) { if (e.target === sh) sh.hidden = true; var a = e.target.closest && e.target.closest('.jgr'); if (a) { sh.hidden = true; open(a.getAttribute('data-u')); } };
    document.body.appendChild(tab); document.body.appendChild(sh);
    window.JerGames = { open: function () { tab.onclick(); } };
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
