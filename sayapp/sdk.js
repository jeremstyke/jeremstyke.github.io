// SayApp SDK (2 nov 2026, Jeremy): the small data layer every app made with SayApp uses.
// <script src="https://jeremstyke.github.io/sayapp/sdk.js" data-app="APP_ID"></script>
// SayApp.user                 the Telegram user (id, first_name...)
// await SayApp.get(key)        a value saved for this user (null if none)
// await SayApp.set(key, value) saves a value for this user (any JSON, 20 KB max)
// await SayApp.top(key, n)     leaderboard of the numeric value `key` over all users: [{name, value, me}]
// await SayApp.submit(data)    sends a form / an answer to the owner of the app
// SayApp.haptic('ok'|'error'|'tap')
(function () {
  var API = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/sayapp?api=1';
  var cur = document.currentScript;
  var APP = (cur && cur.getAttribute('data-app')) || (function () { var m = location.pathname.match(/\/a\/([a-z0-9]+)/); return m ? m[1] : ''; })();
  var tw = window.Telegram && window.Telegram.WebApp;
  try { tw.ready(); tw.expand(); tw.disableVerticalSwipes && tw.disableVerticalSwipes(); } catch (e) {}  // 2 nov 2026: a swipe down does not close the app
  // 2 nov 2026 (20h01, Jeremy): full screen on phones for the apps built for it (data-full="1": templates and new apps); --sa-top = the height under Telegram's buttons
  try { if (cur && cur.getAttribute('data-full') === '1' && tw.requestFullscreen && /^(android|ios)$/.test(tw.platform)) tw.requestFullscreen(); } catch (e) {}
  (function () { var s = document.createElement('style'); s.textContent = ':root{--sa-top:calc(var(--tg-safe-area-inset-top,0px) + var(--tg-content-safe-area-inset-top,0px))}'; (document.head || document.documentElement).appendChild(s); })();
  // 3 nov 2026 (23h10, Jeremy): the app also works as a normal website (outside Telegram): a guest id, saves kept in this browser
  var WEB = !(tw && tw.initData), LS = function (k, v) { try { if (v === undefined) { var x = localStorage.getItem(k); return x == null ? null : JSON.parse(x); } localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } };
  var gid = WEB ? (LS('sa_gid') || (function () { var g = 100000000 + Math.floor(Math.random() * 800000000); LS('sa_gid', g); return g; })()) : 0;
  var user = (tw && tw.initDataUnsafe && tw.initDataUnsafe.user) || { id: gid, first_name: 'Guest' };
  var cache = {};
  function call(body) {
    body.app = APP; body.initData = (tw && tw.initData) || '';
    return fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); }).catch(function () { return { ok: false }; });
  }
  window.SayApp = {
    app: APP,
    user: user,
    web: WEB,
    get: function (k) {
      if (k in cache) return Promise.resolve(cache[k]);
      if (WEB) { cache[k] = LS('sa_' + APP + '_' + k); return Promise.resolve(cache[k]); }
      return call({ action: 'get', key: String(k) }).then(function (r) { var v = r && r.ok ? r.value : null; cache[k] = v; return v; });
    },
    set: function (k, v) {
      cache[k] = v;
      if (WEB) { LS('sa_' + APP + '_' + k, v); return Promise.resolve(true); }
      return call({ action: 'set', key: String(k), value: v }).then(function (r) { return !!(r && r.ok); });
    },
    top: function (k, n) {
      return call({ action: 'top', key: String(k), n: n || 10 }).then(function (r) { return (r && r.ok && r.rows) || []; });
    },
    submit: function (data) {
      return call({ action: 'submit', data: data }).then(function (r) { return !!(r && r.ok); });
    },
    // 2 nov 2026 (17h43, Jeremy): built-in game engine of the SayApp templates (state, take, pass_link, pass_random, top)
    game: function (a, d) { var b = { action: 'g_' + a }; if (d) for (var k in d) b[k] = d[k]; return call(b); },
    // 2 nov 2026 (18h37, Jeremy): await SayApp.ad() plays a rewarded video of the owner's own ad network; true if watched
    // 2 nov 2026 (19h45, Jeremy): await SayApp.hasAd() is true when the owner saved an ad code (so a "Watch an ad" button can show only then)
    // 2 nov 2026 (20h06, Jeremy): await SayApp.buy(item, title, stars) opens a Telegram Stars payment (Pro apps on their own bot), true once paid;
    // await SayApp.purchases() lists what this player bought [{item, stars, at}]
    buy: function (item, title, stars) {
      return call({ action: 'buy', item: item, title: title, stars: stars }).then(function (r) {
        if (!r || !r.ok) { try { tw.showAlert(r && r.error === 'pro' ? (fr ? 'Les achats seront disponibles quand cette appli sera lancée sur son bot.' : 'Purchases will be available once this app is launched on its bot.') : (fr ? 'Paiement indisponible, réessaie.' : 'Payment unavailable, try again.')); } catch (e) {} return false; }
        return new Promise(function (ok) { try { tw.openInvoice(r.link, function (st) { if (st === 'paid') { try { tw.HapticFeedback.notificationOccurred('success'); } catch (e) {} } ok(st === 'paid'); }); } catch (e) { ok(false); } });
      });
    },
    purchases: function () { return call({ action: 'purchases' }).then(function (r) { return (r && r.ok && r.rows) || []; }); },
    // 2 nov 2026 (20h30, Jeremy): without the owner's own ad code, a SayApp rewarded ad (promo of Meme Coin Tycoon / Pass The Baton) plays instead,
    // so every owner sees the "watch an ad" feature working; his own Adsgram / Ads Galaxy codes replace it as soon as they are saved
    // 3 nov 2026 (07h, Jeremy): real products are paid with the owner's own payment link (Stars are for digital items only)
    pay: function (label, amount) { return (adsReady || Promise.resolve()).then(function () { if (ADS && ADS.pay) { try { tw.openLink(ADS.pay); } catch (e) { window.open(ADS.pay); } return true; } return payDemo(label, amount); }); },
    hasPay: function () { return (adsReady || Promise.resolve()).then(function () { return !!(ADS && ADS.pay); }); },
    hasAd: function () { return (adsReady || Promise.resolve()).then(function () { return true; }); },
    // 4 nov 2026 (23h45, Jeremy): interstitial of the owner (between two games), at most once every 2 minutes, nothing without his ad code
    interstitial: function () { return (adsReady || Promise.resolve()).then(function () { var own = !!(ADS && (ADS.agi || ADS.ag || ADS.agx)), hs = !!(ADS && ADS.h && ADS.hi !== false) && (!own || Math.random() < 0.5); if (!own && !hs) return false; var k = 'sayapp_it_' + APP, last = 0; try { last = Number(sessionStorage.getItem(k) || 0); } catch (e) {} if (Date.now() - last < 120000) return false; try { sessionStorage.setItem(k, String(Date.now())); } catch (e) {} if (hs) return houseDue(false) ? houseAd('int') : false; return playAd(ADS.agi || ADS.ag); }).catch(function () { return false; }); },
    ad: function () { return (adsReady || Promise.resolve()).then(function () { return ADS && (ADS.ag || ADS.agx) ? playAd(ADS.ag) : ADS && ADS.h && ADS.hr !== false ? houseAd('rw') : true; }); },  // 5 nov 2026 (01h20, Jeremy): SayApp ad network (opt-in) when the owner has no code  // 4 nov 2026 (23h43, Jeremy): without the owner's own ad code, the reward is given right away, no SayApp promo
    haptic: function (k) {
      try { var h = tw.HapticFeedback; if (k === 'ok') h.notificationOccurred('success'); else if (k === 'error') h.notificationOccurred('error'); else h.impactOccurred('light'); } catch (e) {}
    }
  };

  // 2 nov 2026 (14h19, Jeremy): free demos show a "SayApp demo" banner and expire after 7 days (Pro apps: nothing)
  var fr = /^fr/.test(String(user.language_code || navigator.language || ''));
  var BOT = 'https://t.me/SayAppBuilderBot?start=demo_' + APP;
  function go() { try { tw.openTelegramLink(BOT); } catch (e) { location.href = BOT; } }
  function css(t) { var s = document.createElement('style'); s.textContent = t; document.head.appendChild(s); }
  function show(info) {
    if (!info || !info.ok || (info.pro && !info.over)) return;
    var F = 'font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;';
    if (info.expired) {
      css('#sayappX{position:fixed;inset:0;z-index:2147483647;background:#07070d;color:#f4f3ff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;' + F + '}#sayappX b{display:grid;place-items:center;width:64px;height:64px;border-radius:20px;background:linear-gradient(120deg,#8b5cff,#2fd6ff);font-size:30px;margin-bottom:18px}#sayappX h2{margin:0 0 8px;font-size:22px}#sayappX p{margin:0 0 22px;color:#a09fbd;max-width:300px;line-height:1.5}#sayappX button{border:0;padding:15px 22px;border-radius:14px;background:linear-gradient(120deg,#ffd76a,#ff9f43);color:#2a1700;font:700 15px Inter,system-ui,sans-serif}');
      var x = document.createElement('div'); x.id = 'sayappX';
      x.innerHTML = info.paused ? '<b>✦</b><h2>' + (fr ? 'Appli en pause' : 'App paused') + '</h2><p>' + (fr ? 'Le mois gratuit de cette appli est terminé. Son créateur peut la réactiver avec SayApp Pro.' : 'The free month of this app is over. Its creator can bring it back with SayApp Pro.') + '</p><button>' + (fr ? '✦ Ouvrir SayApp' : '✦ Open SayApp') + '</button>' : info.over ? '<b>✦</b><h2>' + (fr ? 'Appli en pause' : 'App paused') + '</h2><p>' + (fr ? 'Cette appli a trop de joueurs pour sa formule. Son créateur doit passer à la formule supérieure dans SayApp pour la relancer.' : 'This app has too many players for its plan. Its creator must upgrade in SayApp to restart it.') + '</p><button>' + (fr ? '✦ Ouvrir SayApp' : '✦ Open SayApp') + '</button>' : info.banned ? '<b>✦</b><h2>' + (fr ? 'Appli suspendue' : 'App suspended') + '</h2><p>' + (fr ? 'Cette appli a été suspendue car elle ne respecte pas les règles de SayApp.' : 'This app has been suspended because it breaks the SayApp rules.') + '</p><button>' + (fr ? '✦ Ouvrir SayApp' : '✦ Open SayApp') + '</button>' : '<b>✦</b><h2>' + (fr ? 'Démo expirée' : 'Demo expired') + '</h2><p>' + (fr ? 'Cette démo SayApp a expiré. Son créateur peut la remettre en ligne pour toujours avec SayApp Pro.' : 'This SayApp demo has expired. Its creator can put it back online for good with SayApp Pro.') + '</p><button>' + (fr ? '✦ Ouvrir SayApp' : '✦ Open SayApp') + '</button>';
      x.querySelector('button').onclick = go; document.body.appendChild(x); return;
    }
    css('#sayappB{position:fixed;left:50%;transform:translateX(-50%);top:calc(var(--sa-top,0px) + 6px);z-index:2147483646;height:30px;padding:0 5px 0 12px;display:flex;align-items:center;gap:6px;white-space:nowrap;background:rgba(12,12,24,.62);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.14);border-radius:99px;box-shadow:0 8px 24px -10px rgba(0,0,0,.6);color:#fff;font:600 11.5px Inter,system-ui,sans-serif;cursor:pointer;animation:sayappIn .5s cubic-bezier(.2,.9,.3,1.3)}#sayappB u{text-decoration:none;background:linear-gradient(120deg,#8b5cff,#2fd6ff);padding:4px 9px;border-radius:99px}#sayappB u#sayappS{background:rgba(255,255,255,.14)}@keyframes sayappIn{from{opacity:0;transform:translate(-50%,-12px)}}html{scroll-padding-top:calc(var(--sa-top,0px) + 42px)}body{margin-top:calc(var(--sa-top,0px) + 42px)!important}');
    var bn = document.createElement('div'); bn.id = 'sayappB';
    bn.innerHTML = '✦ ' + (info.trial ? 'Made with SayApp' : fr ? 'Démo SayApp' + (info.left ? ' · ' + info.left + ' j' : '') : 'SayApp demo' + (info.left ? ' · ' + info.left + 'd left' : '')) + ' <u>' + (fr ? 'Créer la mienne' : 'Make mine') + '</u> <u id="sayappS">📤 ' + (fr ? 'Partager' : 'Share') + '</u>';
    bn.onclick = go; document.body.appendChild(bn);
    // 2 nov 2026 (19h58, Jeremy): anyone can share a demo with friends (it opens through SayApp: startapp=demo_<app>)
    document.getElementById('sayappS').onclick = function (ev) { ev.stopPropagation(); var u = info.bot ? 'https://t.me/' + info.bot + '?start=share' : 'https://t.me/SayAppBuilderBot?startapp=demo_' + APP; var t = (fr ? '▶️ Teste cette appli, faite avec SayApp 👇' : '▶️ Try this app, made with SayApp 👇'); var s = 'https://t.me/share/url?url=' + encodeURIComponent(u) + '&text=' + encodeURIComponent(t); try { tw.openTelegramLink(s); } catch (x) { location.href = s; } };
    // 2 nov 2026 (16h51, Jeremy): a discreet way to report an app
    var rp = document.createElement('i'); rp.textContent = '⚑'; rp.title = fr ? 'Signaler' : 'Report';
    rp.style.cssText = 'font-style:normal;margin-left:6px;opacity:.75;padding:2px 6px;border-radius:99px;background:rgba(0,0,0,.18)';
    rp.onclick = function (e) {
      e.stopPropagation();
      var send = function () { call({ action: 'report', reason: 'reported from the app' }).then(function () { try { tw.showAlert(fr ? 'Merci, l\'appli a été signalée.' : 'Thanks, the app has been reported.'); } catch (x) {} }); };
      try { tw.showPopup({ title: fr ? 'Signaler cette appli ?' : 'Report this app?', message: fr ? 'Arnaque, contenu choquant ou trompeur : on vérifie chaque signalement.' : 'Scam, shocking or misleading content: every report is checked.', buttons: [{ id: 'y', type: 'destructive', text: fr ? 'Signaler' : 'Report' }, { type: 'cancel' }] }, function (id) { if (id === 'y') send(); }); } catch (x) { send(); }
    };
    bn.appendChild(rp);
  }
  // 2 nov 2026 (18h19, Jeremy): every "Made with SayApp" in an app opens @SayAppBuilderBot with a source (src_app_<id>)
  // 4 nov 2026 (02h32, Jeremy): outside Telegram the app is not playable: a nice card over the blurred app sends people to the bot in Telegram
  // (not in the SayApp studio preview, which loads the app in an iframe)
  var GATE = {"fr": ["Cette appli se joue dans Telegram", "Ouvre-la dans Telegram pour jouer, garder ta progression et apparaître au classement.", "▶  Jouer dans Telegram", "Gratuit · aucun téléchargement"], "en": ["This app plays in Telegram", "Open it in Telegram to play, keep your progress and get on the leaderboard.", "▶  Play in Telegram", "Free · nothing to download"], "es": ["Esta app se juega en Telegram", "Ábrela en Telegram para jugar, guardar tu progreso y salir en la clasificación.", "▶  Jugar en Telegram", "Gratis · sin descargas"], "pt": ["Este app roda no Telegram", "Abra no Telegram para jogar, salvar seu progresso e entrar no ranking.", "▶  Jogar no Telegram", "Grátis · nada para baixar"], "ru": ["Это приложение работает в Telegram", "Открой его в Telegram, чтобы играть, сохранять прогресс и попасть в рейтинг.", "▶  Играть в Telegram", "Бесплатно · ничего скачивать не нужно"], "id": ["Aplikasi ini dimainkan di Telegram", "Buka di Telegram untuk bermain, menyimpan progres, dan masuk papan peringkat.", "▶  Main di Telegram", "Gratis · tanpa unduhan"], "tr": ["Bu uygulama Telegram'da oynanır", "Oynamak, ilerlemeni kaydetmek ve sıralamaya girmek için Telegram'da aç.", "▶  Telegram'da oyna", "Ücretsiz · indirme yok"]};
  function webBar(i) {
    if (!WEB || window.top !== window.self) return;
    var U = i && i.bot ? 'https://t.me/' + i.bot + '?start=src_web' : 'https://t.me/SayAppBuilderBot?start=demo_' + APP, g = document.getElementById('saGate');
    if (g) { g.querySelector('.saGo').href = U; return; }
    var L = GATE[String(navigator.language || 'en').slice(0, 2).toLowerCase()] || GATE.en, nm = (document.title || '').trim() || 'Mini App';
    var ic = document.querySelector('link[rel~="apple-touch-icon"],link[rel~="icon"]'), lg = ic && ic.href && !/^data:,?$/.test(ic.href) ? ic.href : '';
    css('#saGate{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px max(16px,env(safe-area-inset-right,0px)) 24px max(16px,env(safe-area-inset-left,0px));background:rgba(6,8,16,.55);-webkit-backdrop-filter:blur(18px) saturate(1.2);backdrop-filter:blur(18px) saturate(1.2);font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#f4f5fb;animation:saGi .35s ease}' +
      '@keyframes saGi{from{opacity:0}to{opacity:1}}#saGate .saC{width:100%;max-width:360px;padding:28px 22px 20px;border-radius:26px;text-align:center;background:linear-gradient(180deg,rgba(28,30,48,.92),rgba(14,15,26,.94));border:1px solid rgba(255,255,255,.1);box-shadow:0 30px 80px -20px rgba(0,0,0,.7)}' +
      '#saGate .saI{width:84px;height:84px;margin:0 auto 16px;border-radius:24px;display:grid;place-items:center;overflow:hidden;background:linear-gradient(135deg,#8b5cff,#2fd6ff);font-size:38px;font-weight:800;color:#fff;box-shadow:0 12px 30px -8px rgba(47,214,255,.45)}#saGate .saI img{width:100%;height:100%;object-fit:cover}' +
      '#saGate h1{margin:0 0 4px;font-size:22px;line-height:1.2;font-weight:800;letter-spacing:-.01em;text-wrap:balance}#saGate .saS{margin:0 0 6px;font-size:13px;font-weight:700;color:#5fc8ff;text-transform:uppercase;letter-spacing:.06em}#saGate p{margin:0 0 20px;font-size:14.5px;line-height:1.5;color:rgba(244,245,251,.72)}' +
      '#saGate .saGo{display:flex;align-items:center;justify-content:center;gap:8px;height:52px;border-radius:16px;background:linear-gradient(120deg,#2aabee,#229ed9);color:#fff;font-size:16px;font-weight:800;text-decoration:none;box-shadow:0 10px 26px -8px rgba(42,171,238,.6)}#saGate .saGo:active{transform:scale(.98)}#saGate small{display:block;margin-top:10px;font-size:12px;color:rgba(244,245,251,.5)}' +
      'html.saGated,html.saGated body{overflow:hidden!important}');
    g = document.createElement('div'); g.id = 'saGate'; g.setAttribute('role', 'dialog'); g.setAttribute('aria-modal', 'true');
    var c = document.createElement('div'); c.className = 'saC';
    var ii = document.createElement('div'); ii.className = 'saI';
    if (lg) { var im = document.createElement('img'); im.alt = ''; im.src = lg; im.onerror = function () { ii.textContent = nm.charAt(0).toUpperCase(); }; ii.appendChild(im); } else ii.textContent = nm.charAt(0).toUpperCase();
    var h = document.createElement('h1'); h.textContent = nm;
    var sb = document.createElement('div'); sb.className = 'saS'; sb.textContent = L[0];
    var p = document.createElement('p'); p.textContent = L[1];
    var go = document.createElement('a'); go.className = 'saGo'; go.href = U; go.rel = 'noopener'; go.textContent = L[2];
    var sm = document.createElement('small'); sm.textContent = L[3];
    var mw = document.createElement('a'); mw.className = 'saMade'; mw.style.marginTop = '18px'; mw.href = 'https://t.me/SayAppBuilderBot?start=src_web_' + APP; mw.rel = 'noopener'; mw.innerHTML = '<b>&#10022;</b>Made with SayApp';
    c.appendChild(ii); c.appendChild(h); c.appendChild(sb); c.appendChild(p); c.appendChild(go); c.appendChild(sm); c.appendChild(mw); g.appendChild(c);
    document.documentElement.className += ' saGated'; document.body.appendChild(g);
  }
  // 4 nov 2026 (02h39, Jeremy): under the first "Made with SayApp" of every app: SayApp only builds apps, the publisher runs its rewards and payments
  var DIS = {"fr": "SayApp sert uniquement à créer des applications. Les récompenses, gains et paiements de cette appli sont gérés par son éditeur, pas par SayApp.", "en": "SayApp is only a tool to build apps. The rewards, earnings and payments of this app are managed by its publisher, not by SayApp.", "es": "SayApp solo sirve para crear aplicaciones. Las recompensas, ganancias y pagos de esta app los gestiona su editor, no SayApp.", "pt": "O SayApp serve apenas para criar aplicativos. As recompensas, ganhos e pagamentos deste app são geridos pelo seu editor, não pelo SayApp.", "ru": "SayApp служит только для создания приложений. Награды, заработок и выплаты этого приложения управляются его издателем, а не SayApp.", "id": "SayApp hanya alat untuk membuat aplikasi. Hadiah, penghasilan, dan pembayaran aplikasi ini dikelola oleh penerbitnya, bukan oleh SayApp.", "tr": "SayApp yalnızca uygulama oluşturmaya yarar. Bu uygulamanın ödülleri, kazançları ve ödemeleri SayApp tarafından değil, yayıncısı tarafından yönetilir.", "de": "SayApp dient nur zum Erstellen von Apps. Belohnungen, Gewinne und Zahlungen dieser App verwaltet ihr Herausgeber, nicht SayApp.", "it": "SayApp serve solo a creare app. Premi, guadagni e pagamenti di questa app sono gestiti dal suo editore, non da SayApp.", "ar": "SayApp مجرد أداة لإنشاء التطبيقات. المكافآت والأرباح والمدفوعات في هذا التطبيق يديرها ناشره، وليس SayApp."};
  function addDis(el, a) {
    if (!el || document.getElementById('saDis') || (el.closest && el.closest('#saGate'))) return;
    var lg = String(user.language_code || navigator.language || 'en').slice(0, 2).toLowerCase(), nt = document.createElement('div');
    nt.id = 'saDis'; nt.textContent = DIS[lg] || DIS.en;
    var c = ''; try { c = getComputedStyle(a).color; } catch (x) {}
    nt.style.cssText = 'display:block;max-width:320px;margin:8px auto 0;padding:0 12px;text-align:center;opacity:.6;font:500 10.5px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-transform:none;letter-spacing:0' + (c ? ';color:' + c : '');
    el.parentNode.insertBefore(nt, el.nextSibling);
  }
  function madeLink(last) {
    // 3 nov 2026 (22h11, Jeremy): a nice "Made with SayApp" pill in every app, like Meme Coin Tycoon and Pass The Baton (light or dark look from the app's background)
    var U = 'https://t.me/SayAppBuilderBot?start=src_app_' + APP, els = document.querySelectorAll('body *'), found = !!document.querySelector('.saMade');
    if (!document.getElementById('saMadeCss')) {
      var lt = false;
      try { var bg = getComputedStyle(document.body).backgroundColor; if (!bg || /rgba\(0, 0, 0, 0\)|transparent/.test(bg)) bg = getComputedStyle(document.documentElement).backgroundColor; var mm = String(bg).match(/\d+(\.\d+)?/g); if (mm && mm.length >= 3 && !(mm.length > 3 && +mm[3] === 0)) lt = (0.299 * mm[0] + 0.587 * mm[1] + 0.114 * mm[2]) / 255 > 0.6; } catch (x) {}
      var st = document.createElement('style'); st.id = 'saMadeCss';
      st.textContent = '.saMade{display:inline-flex!important;align-items:center;gap:6px;margin:0 auto;padding:7px 13px!important;border-radius:99px!important;background:' + (lt ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.07)') + '!important;border:1px solid ' + (lt ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.12)') + '!important;color:' + (lt ? 'rgba(0,0,0,.72)' : 'rgba(255,255,255,.8)') + '!important;font:600 12px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif!important;text-decoration:none!important;letter-spacing:.01em;cursor:pointer;white-space:nowrap;opacity:1!important;text-transform:none!important}.saMade b{display:inline-grid;place-items:center;width:16px;height:16px;border-radius:5px;background:linear-gradient(120deg,#8b5cff,#2fd6ff);color:#fff;font-size:10px;font-weight:700}.saMadeW{display:flex!important;justify-content:center;opacity:1!important}#sayappMade{display:flex;justify-content:center;padding:18px 0 calc(env(safe-area-inset-bottom,0px) + 12px)}';
      document.head.appendChild(st);
    }
    var go = function (ev) { ev.preventDefault(); ev.stopPropagation(); try { tw.openTelegramLink(U); } catch (x) { location.href = U; } };
    var pill = function (a) { a.className = (a.className ? a.className + ' ' : '') + 'saMade'; a.innerHTML = '<b>&#10022;</b>Made with SayApp'; a.addEventListener('click', go); return a; };
    // every text "Made with SayApp" written by the AI (alone, after a <br>, or at the end of a line like "Virtual points, Made with SayApp") becomes the pill
    var SEP = '[' + String.fromCharCode(32, 9, 10, 183, 8226, 124, 45, 8211) + ']+', RX = new RegExp('[' + String.fromCharCode(10022) + ']?' + String.fromCharCode(92) + 's*Made with SayApp', 'i'), nodes = [], wk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), n;
    while ((n = wk.nextNode())) { if (RX.test(n.nodeValue || '') && n.parentNode && !(n.parentNode.closest && n.parentNode.closest('.saMade,script,style'))) nodes.push(n); }
    for (var i = 0; i < nodes.length; i++) {
      var t = nodes[i], p = t.parentNode, v = t.nodeValue, m = v.match(RX), bf = v.slice(0, m.index).replace(new RegExp(SEP + '$'), ''), af = v.slice(m.index + m[0].length).replace(new RegExp('^' + SEP), '');
      found = true;
      if (!bf && !af && (p.tagName === 'A' || p.tagName === 'BUTTON') && p.childNodes.length === 1) { pill(p); if (p.tagName === 'A') p.href = U; addDis(p, p); continue; }
      var alone = !bf && !af && p.childNodes.length === 1, w = document.createElement('span'), a = document.createElement('a');
      w.className = 'saMadeW'; a.href = U; w.appendChild(pill(a));
      if (alone) { p.replaceChild(w, t); try { if (parseFloat(getComputedStyle(p).opacity) < 0.9) p.style.opacity = '1'; } catch (x) {} addDis(w, a); continue; }
      // mixed text: the text stays where it was, the pill goes just after the element (so a faded footer does not fade it)
      t.nodeValue = (bf + (bf && af ? ' ' : '') + af) || ' ';
      var br = t.previousSibling; if (!af && br && br.nodeName === 'BR') br.parentNode.removeChild(br);
      w.style.margin = '8px auto 0'; p.parentNode.insertBefore(w, p.nextSibling); addDis(w, a);
    }
    var old = document.getElementById('sayappM'); if (old) old.remove();
    if (last === true && !found && !document.getElementById('sayappMade')) {
      var d = document.createElement('div'); d.id = 'sayappMade'; var a2 = document.createElement('a'); a2.href = U; d.appendChild(pill(a2)); d.style.flexDirection = 'column'; d.style.alignItems = 'center'; var dn = document.createElement('i'); d.appendChild(dn);
      var main = document.querySelector('main'), cs = main ? getComputedStyle(main).overflowY : '';
      if (main && (cs === 'auto' || cs === 'scroll')) main.appendChild(d); else document.body.appendChild(d);
      addDis(dn, a2); dn.remove();
    }
  }
  // 2 nov 2026 (18h37, Jeremy): the owner's ads (Adsgram block, Ads Galaxy id), set in SayApp > My apps > Manage > Earn money
  var ADS = null, adsReady = null, INFO = null;
  // 3 nov 2026 (07h, Jeremy): without a payment link: an example card in demos, a short notice in a live app
  function payDemo(label, amount) {
    if (INFO && (INFO.bot || INFO.trial) && SHOWCASE.indexOf(APP) < 0) { try { tw.showAlert(fr ? 'Le paiement en ligne n\'est pas encore activé. Ta commande est bien envoyée.' : 'Online payment is not set up yet. Your order has been sent.'); } catch (e) {} return Promise.resolve(false); }
    return new Promise(function (done) {
      css('#sayappP{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(5,5,12,.86);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);font-family:Inter,system-ui,-apple-system,sans-serif}#sayappP .k{width:100%;max-width:340px;border-radius:26px;overflow:hidden;background:#11111d;border:1px solid rgba(255,255,255,.1);color:#fff;text-align:center}#sayappP .v{height:150px;display:grid;place-items:center;font-size:70px;position:relative;background:linear-gradient(140deg,#2f80ff,#7c5cff)}#sayappP .v i{position:absolute;top:12px;left:12px;font:700 10px Inter,sans-serif;letter-spacing:.12em;background:rgba(0,0,0,.35);padding:4px 8px;border-radius:99px;font-style:normal}#sayappP h3{margin:18px 18px 6px;font-size:21px}#sayappP b{display:block;margin:0 18px 8px;font-size:15px;color:#ffd76a}#sayappP p{margin:0 22px 18px;color:#a9a8c4;font-size:14px;line-height:1.45}#sayappP a{display:block;margin:0 18px 10px;padding:15px;border-radius:16px;color:#1a1000;font:800 16px Inter,sans-serif;text-decoration:none;background:linear-gradient(120deg,#ffd76a,#ff9f43)}#sayappP button{display:block;width:calc(100% - 36px);margin:0 18px 18px;padding:13px;border:0;border-radius:14px;background:rgba(255,255,255,.08);color:#fff;font:600 14px Inter,sans-serif}');
      var x = document.createElement('div'); x.id = 'sayappP';
      var t = String(label || '').slice(0, 60) + (amount ? ' · ' + String(amount).slice(0, 30) : '');
      x.innerHTML = '<div class="k"><div class="v"><i>' + (fr ? 'EXEMPLE · PAIEMENT' : 'EXAMPLE · PAYMENT') + '</i>💳</div><h3>' + (fr ? 'Ici, ton client paie' : 'Your customer pays here') + '</h3>' + (t ? '<b></b>' : '') + '<p>' + (fr ? 'Sur ton appli, ce bouton ouvre ton propre lien de paiement (PayPal, Stripe, SumUp…) et l\'argent arrive directement chez toi.' : 'In your app, this button opens your own payment link (PayPal, Stripe, SumUp…) and the money goes straight to you.') + '</p><a href="#">✨ ' + (fr ? 'Créer mon appli' : 'Build my app') + '</a><button>' + (fr ? 'Fermer' : 'Close') + '</button></div>';
      if (t) x.querySelector('b').textContent = t;
      document.body.appendChild(x);
      x.querySelector('a').onclick = function (e) { e.preventDefault(); var u = 'https://t.me/SayAppBuilderBot?start=src_demo_pay_' + APP; try { tw.openTelegramLink(u); } catch (z) { location.href = u; } };
      x.querySelector('button').onclick = function () { x.remove(); done(false); };
    });
  }
  function loadJs(src, test) { return new Promise(function (ok, ko) { if (test()) return ok(); var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s); setTimeout(function () { if (test()) ok(); else ko(new Error('timeout')); }, 7000); }); }
  function adsgram(block) { return loadJs('https://sad.adsgram.ai/js/sad.min.js', function () { return !!window.Adsgram; }).then(function () { return window.Adsgram.init({ blockId: String(block) }).show(); }).then(function () { return true; }, function (e) { return !!(e && e.done); }); }
  function galaxy(id) { return loadJs('https://app.adsgalaxy.online/sdk.js?id=' + encodeURIComponent(id), function () { return !!window.showAdsGalaxy; }).then(function () { return window.showAdsGalaxy(); }).then(function () { return true; }, function () { return false; }); }
  function playAd(block) { if (!ADS) return Promise.resolve(false); return (block ? adsgram(block) : Promise.resolve(false)).then(function (ok) { return ok || !ADS.agx ? ok : galaxy(ADS.agx); }); }
  // 2 nov 2026 (20h31, Jeremy): SayApp itself first (3 chances out of 5), then his two games
  var HOUSE = [
    { e: '✦', c1: '#8b5cff', c2: '#2fd6ff', n: 'SayApp', fr: 'Crée ta propre mini app Telegram en 2 minutes, juste en la décrivant, lancée sur ton propre bot.', en: 'Build your own Telegram mini app in 2 minutes, just by describing it, launched on your own bot.', u: 'https://t.me/SayAppBuilderBot?start=src_sayapp_ad', b: { fr: 'Créer mon appli', en: 'Build my app' } },
    { e: '📈', c1: '#1fd18b', c2: '#0b7a52', n: 'Meme Coin Tycoon', fr: 'Trade des memecoins, deviens le plus riche du classement.', en: 'Trade memecoins, become the richest player on the board.', u: 'https://t.me/Memecointycoonbot?startapp=src_sayapp_ad' },
    { e: '🏃', c1: '#ffb23f', c2: '#ff6a2b', n: 'Pass The Baton', fr: 'Garde le bâton, gagne des points, passe-le à tes amis.', en: 'Hold the baton, earn points, pass it to your friends.', u: 'https://t.me/PassTheBatonBot/play?startapp=src_sayapp_ad' }
  ];
  // 3 nov 2026 (05h45, Jeremy): in the SayApp showcase demos, a rewarded ad shows an "example" card: in your app, your own ad plays here and you keep the money
  var SHOWCASE = ['82fu9ah9', 'cvp8z59g', '5htgziz2', 'kwegehkb', 'fa6grndr', 'd6nxcii3'];
  var EXAMPLE = { e: '💰', c1: '#16c784', c2: '#0a7d55', ex: 1, n: { fr: 'Ici, c\'est TA pub qui passe', en: 'Your own ad plays here' }, fr: 'Exemple de pub récompensée. Sur ton appli, tes joueurs regardent tes propres pubs (Adsgram, Ads Galaxy) pour gagner leur bonus x2, et c\'est toi qui gagnes l\'argent.', en: 'Example of a rewarded ad. In your app, players watch your own ads (Adsgram, Ads Galaxy) to get their x2 bonus, and you keep the money.', u: 'https://t.me/SayAppBuilderBot?start=src_demo_' + APP, b: { fr: 'Créer mon appli', en: 'Build my app' } };
  function houseAd(mode) {
    return new Promise(function (done) {
      if (document.getElementById('sayappH')) return done(mode !== 'int');
      var net = !!(ADS && ADS.h), h = !net && SHOWCASE.indexOf(APP) >= 0 ? EXAMPLE : Math.random() < (net ? 0.8 : 0.6) ? HOUSE[0] : HOUSE[1 + Math.floor(Math.random() * (HOUSE.length - 1))], left = mode === 'rw' || !mode ? 5 : 3, rw = mode === 'rw' || !mode;
      var hu = net ? h.u.replace('src_sayapp_ad', 'src_sax_' + String(APP).replace(/[^a-z0-9]/gi, '')) : h.u;
      css('#sayappH{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(5,5,12,.86);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);font-family:Inter,system-ui,-apple-system,sans-serif;animation:sayappF .25s ease}@keyframes sayappF{from{opacity:0}}#sayappH .k{width:100%;max-width:340px;border-radius:26px;overflow:hidden;background:#11111d;border:1px solid rgba(255,255,255,.1);box-shadow:0 30px 80px -20px #000;color:#fff;text-align:center;animation:sayappU .35s cubic-bezier(.2,.9,.3,1.2)}@keyframes sayappU{from{transform:translateY(30px) scale(.96);opacity:0}}#sayappH .v{height:190px;display:grid;place-items:center;font-size:84px;position:relative}#sayappH .v i{position:absolute;top:12px;left:12px;font:700 10px Inter,sans-serif;letter-spacing:.12em;background:rgba(0,0,0,.35);padding:4px 8px;border-radius:99px;font-style:normal}#sayappH .v s{position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:99px;display:grid;place-items:center;background:rgba(0,0,0,.4);font:700 13px Inter,sans-serif;text-decoration:none}#sayappH h3{margin:18px 18px 6px;font-size:21px}#sayappH p{margin:0 22px 18px;color:#a9a8c4;font-size:14px;line-height:1.45}#sayappH a{display:block;margin:0 18px 10px;padding:15px;border-radius:16px;color:#1a1000;font:800 16px Inter,sans-serif;text-decoration:none}#sayappH button{display:block;width:calc(100% - 36px);margin:0 18px 18px;padding:13px;border:0;border-radius:14px;background:rgba(255,255,255,.08);color:#fff;font:600 14px Inter,sans-serif}#sayappH button:disabled{opacity:.45}');
      var x = document.createElement('div'); x.id = 'sayappH';
      x.innerHTML = '<div class="k"><div class="v" style="background:linear-gradient(140deg,' + h.c1 + ',' + h.c2 + ')"><i>' + (h.ex ? (fr ? 'EXEMPLE · PUB RÉCOMPENSÉE' : 'EXAMPLE · REWARDED AD') : (fr ? 'PUB' : 'AD')) + '</i><s id="sayappHc">' + left + '</s>' + h.e + '</div><h3>' + (h.n.fr ? (fr ? h.n.fr : h.n.en) : h.n) + '</h3><p>' + (fr ? h.fr : h.en) + '</p><a href="#" style="background:linear-gradient(120deg,#ffd76a,#ff9f43)">▶️ ' + (h.b ? (fr ? h.b.fr : h.b.en) : (fr ? 'Jouer gratuitement' : 'Play for free')) + '</a><button disabled>' + (rw ? (fr ? 'Récompense dans ' : 'Reward in ') : (fr ? 'Fermer dans ' : 'Close in ')) + left + ' s</button></div>';
      document.body.appendChild(x);
      var b = x.querySelector('button'), cnt = document.getElementById('sayappHc');
      x.querySelector('a').onclick = function (e) { e.preventDefault(); try { tw.openTelegramLink(hu); } catch (z) { location.href = hu; } };
      var t = setInterval(function () {
        left--; cnt.textContent = left > 0 ? left : '✓';
        if (left > 0) { b.textContent = (rw ? (fr ? 'Récompense dans ' : 'Reward in ') : (fr ? 'Fermer dans ' : 'Close in ')) + left + ' s'; return; }
        clearInterval(t); b.disabled = false; b.textContent = rw ? (fr ? '🎁 Récupérer ma récompense' : '🎁 Claim my reward') : (fr ? '✕ Fermer' : '✕ Close');
      }, 1000);
      b.onclick = function () { x.remove(); done(true); };
    });
  }
  // 2 nov 2026 (20h35, Jeremy): free demos show one SayApp ad (SayApp, Meme Coin Tycoon, Pass The Baton) at opening, at most once an hour per player
  function demoAd(i) {
    if (!i || !i.ok || i.pro || i.trial || i.expired || i.banned || window.top !== window) return;  // 2 nov 2026 (22h26): no SayApp ad at opening during the free month
    var k = 'sayapp_hd_' + APP, last = 0; try { last = Number(localStorage.getItem(k) || 0); } catch (e) {}
    if (Date.now() - last < 3600000) return;
    try { localStorage.setItem(k, String(Date.now())); } catch (e) {}
    return;  // 4 nov 2026 (23h43, Jeremy): no more SayApp promo at the opening of client apps
  }
  // 5 nov 2026 (01h20, Jeremy): SayApp ad network (opt-in in Manage): a promo of SayApp, Meme Coin Tycoon or Pass The Baton at opening, once an hour per player
  // the owner picks the delay between two SayApp interstitials (ADS.hd minutes: 0 = each opening, 60, 360, 1440)
  function houseDue(open) {
    var hd = ADS && ADS.hd != null ? Number(ADS.hd) : 60, k = 'sayapp_ho_' + APP, last = 0; try { last = Number(localStorage.getItem(k) || 0); } catch (e) {}
    if (Date.now() - last < (hd > 0 ? hd * 60000 : open ? 0 : 120000)) return false;
    try { localStorage.setItem(k, String(Date.now())); } catch (e) {}
    return true;
  }
  function houseOpen() {
    if (window.top !== window || !houseDue(true)) return;
    setTimeout(function () { houseAd('int'); }, 1200);
  }
  function openAd() {
    if (!ADS || !ADS.open) return;
    var k = 'sayapp_ad_' + APP, last = 0; try { last = Number(localStorage.getItem(k) || 0); } catch (e) {}
    if (Date.now() - last < 3600000) return;
    try { localStorage.setItem(k, String(Date.now())); } catch (e) {}
    setTimeout(function () { playAd(ADS.agi || ADS.ag); }, 1200);
  }
  function boot() { webBar(null); adsReady = call({ action: 'info' }).then(function (i) { ADS = (i && i.ads) || null; INFO = i; show(i); webBar(i); if (ADS && ADS.h && ADS.hi !== false && (!(ADS.open && (ADS.ag || ADS.agx)) || Math.random() < 0.5)) houseOpen(); else if (ADS && (ADS.ag || ADS.agx)) openAd(); else demoAd(i); return i; }); madeLink(); setTimeout(madeLink, 1500); setTimeout(function () { madeLink(true); }, 4000); }
  if (document.body) boot(); else document.addEventListener('DOMContentLoaded', boot);
})();
