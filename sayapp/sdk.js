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
  // 5 nov 2026 (01h40, Jeremy): SayApp ad network creative, interstitial ('int') or rewarded ('rw'), in the player's language
  var NETAD = {
    sa: { u: 'https://t.me/SayAppBuilderBot?start=src_sayapp_ad', c1: '#7c4dff', c2: '#22d3ee', g: '#a78bfa', ic: ['🎮', '🪙', '🧠', '🚀', '🏆'], lg: '✦',
      t: { fr: ['Crée ta propre appli Telegram en 2 minutes', "Décris ton idée en une phrase. L'IA la construit et la met en ligne sur ton propre bot.", ['💰 Gagne de l\'argent : pubs et étoiles', '⚡ Sans coder, rien à installer'], '✨ Créer mon appli gratuitement'],
        en: ['Build your own Telegram app in 2 minutes', 'Describe your idea in one sentence. The AI builds it and puts it live on your own bot.', ['💰 Earn money: ads and Stars', '⚡ No code, nothing to install'], '✨ Build my app for free'],
        es: ['Crea tu propia app de Telegram en 2 minutos', 'Describe tu idea en una frase. La IA la crea y la publica en tu propio bot.', ['💰 Gana dinero: anuncios y Stars', '⚡ Sin programar, nada que instalar'], '✨ Crear mi app gratis'],
        pt: ['Crie seu próprio app do Telegram em 2 minutos', 'Descreva sua ideia em uma frase. A IA cria e coloca no ar no seu próprio bot.', ['💰 Ganhe dinheiro: anúncios e Stars', '⚡ Sem programar, nada para instalar'], '✨ Criar meu app grátis'],
        ru: ['Создай своё приложение Telegram за 2 минуты', 'Опиши идею одной фразой. ИИ создаст его и запустит в твоём боте.', ['💰 Зарабатывай: реклама и Stars', '⚡ Без кода и установки'], '✨ Создать приложение бесплатно'],
        id: ['Buat aplikasi Telegram-mu dalam 2 menit', 'Jelaskan idemu dalam satu kalimat. AI membuatnya dan menayangkannya di botmu sendiri.', ['💰 Hasilkan uang: iklan dan Stars', '⚡ Tanpa coding, tanpa instalasi'], '✨ Buat aplikasiku gratis'],
        tr: ['Kendi Telegram uygulamanı 2 dakikada yap', 'Fikrini tek cümleyle anlat. Yapay zekâ onu yapar ve kendi botunda yayına alır.', ['💰 Para kazan: reklamlar ve Stars', '⚡ Kod yok, kurulum yok'], '✨ Uygulamamı ücretsiz yap'] } },
    mct: { u: 'https://t.me/Memecointycoonbot?startapp=src_sayapp_ad', c1: '#16c784', c2: '#f5b70a', g: '#34d399', ic: ['📈', '🐸', '💎', '🚀', '🪙'], lg: '📈',
      t: { fr: ['Lance ton memecoin et deviens n°1', 'Crée ta crypto, fais-la grimper et domine le classement des tycoons.', ['🆓 Gratuit, sans vrai argent', '🏆 Classement mondial en direct', '🎁 Concours et bonus chaque jour'], '🚀 Jouer gratuitement'],
        en: ['Launch your memecoin and become #1', 'Create your coin, pump it and rule the tycoon leaderboard.', ['🆓 Free, no real money', '🏆 Live worldwide leaderboard', '🎁 Contests and daily bonuses'], '🚀 Play for free'],
        es: ['Lanza tu memecoin y sé el n.º 1', 'Crea tu moneda, hazla subir y domina la clasificación.', ['🆓 Gratis, sin dinero real', '🏆 Clasificación mundial en vivo', '🎁 Concursos y bonos diarios'], '🚀 Jugar gratis'],
        pt: ['Lance sua memecoin e seja o nº 1', 'Crie sua moeda, faça ela subir e domine o ranking.', ['🆓 Grátis, sem dinheiro real', '🏆 Ranking mundial ao vivo', '🎁 Concursos e bônus diários'], '🚀 Jogar grátis'],
        ru: ['Запусти свой мемкоин и стань №1', 'Создай монету, разгони её и возглавь рейтинг.', ['🆓 Бесплатно, без реальных денег', '🏆 Мировой рейтинг в реальном времени', '🎁 Конкурсы и ежедневные бонусы'], '🚀 Играть бесплатно'],
        id: ['Luncurkan memecoin-mu dan jadi #1', 'Buat koinmu, naikkan harganya, dan kuasai papan peringkat.', ['🆓 Gratis, tanpa uang sungguhan', '🏆 Peringkat dunia langsung', '🎁 Kontes dan bonus harian'], '🚀 Main gratis'],
        tr: ['Memecoin\'ini çıkar, 1 numara ol', 'Coinini yarat, yükselt ve sıralamaya hükmet.', ['🆓 Ücretsiz, gerçek para yok', '🏆 Canlı dünya sıralaması', '🎁 Yarışmalar ve günlük bonuslar'], '🚀 Ücretsiz oyna'] } },
    ptb: { u: 'https://t.me/PassTheBatonBot/play?startapp=src_sayapp_ad', c1: '#ff7a18', c2: '#2f8dff', g: '#fb923c', ic: ['🏃', '⚡', '🎁', '💵', '🔥'], lg: '🏃',
      t: { fr: ['Garde le bâton, gagne de vrais USDT', 'Attrape le bâton, tiens bon et passe-le à tes amis pour grimper.', ['🆓 Gratuit, 1 minute par jour', '💵 De vraies récompenses en USDT', '👥 Encore mieux avec tes amis'], '⚡ Jouer gratuitement'],
        en: ['Hold the baton, earn real USDT', 'Grab the baton, hold on and pass it to your friends to climb.', ['🆓 Free, 1 minute a day', '💵 Real rewards in USDT', '👥 Even better with friends'], '⚡ Play for free'],
        es: ['Guarda el testigo y gana USDT reales', 'Atrapa el testigo, resiste y pásalo a tus amigos para subir.', ['🆓 Gratis, 1 minuto al día', '💵 Recompensas reales en USDT', '👥 Mejor con tus amigos'], '⚡ Jugar gratis'],
        pt: ['Segure o bastão e ganhe USDT de verdade', 'Pegue o bastão, aguente firme e passe para seus amigos para subir.', ['🆓 Grátis, 1 minuto por dia', '💵 Recompensas reais em USDT', '👥 Melhor com amigos'], '⚡ Jogar grátis'],
        ru: ['Держи эстафету и зарабатывай USDT', 'Хватай палочку, держись и передавай друзьям, чтобы расти.', ['🆓 Бесплатно, 1 минута в день', '💵 Настоящие награды в USDT', '👥 С друзьями ещё лучше'], '⚡ Играть бесплатно'],
        id: ['Pegang tongkatnya, dapatkan USDT asli', 'Ambil tongkatnya, bertahan, dan oper ke temanmu untuk naik.', ['🆓 Gratis, 1 menit sehari', '💵 Hadiah asli dalam USDT', '👥 Lebih seru bersama teman'], '⚡ Main gratis'],
        tr: ['Bayrağı tut, gerçek USDT kazan', 'Bayrağı kap, dayan ve yükselmek için arkadaşlarına pasla.', ['🆓 Ücretsiz, günde 1 dakika', '💵 USDT ile gerçek ödüller', '👥 Arkadaşlarla daha güzel'], '⚡ Ücretsiz oyna'] } },
    // 7 nov 2026 (00h25, Jeremy): AI Football Predictor in the SayApp ad network (owner paid 0.02 $ per player, like Pass The Baton)
    afp: { u: 'https://t.me/ai_football_predictorbot?start=src_sayapp_ad', c1: '#00e08a', c2: '#2f8dff', g: '#34d399', ic: ['⚽', '📊', '🧠', '🎯', '🏆'], lg: '⚽',
      t: { fr: ['Les pronos foot calculés par une IA', 'Un modèle statistique analyse chaque match et ne garde que ses pronos les plus sûrs.', ['📊 Probabilités, xG et forme de chaque match', '✅ Historique public, victoires et défaites', '🆓 Gratuit'], '⚽ Voir les pronos du jour'],
        en: ['Football predictions made by an AI', 'A statistical model analyses every match and only keeps its most confident picks.', ['📊 Probabilities, xG and form for every match', '✅ Public track record, wins and losses', '🆓 Free'], "⚽ See today's picks"],
        es: ['Pronósticos de fútbol hechos por una IA', 'Un modelo estadístico analiza cada partido y solo conserva sus pronósticos más fiables.', ['📊 Probabilidades, xG y forma de cada partido', '✅ Historial público, aciertos y fallos', '🆓 Gratis'], '⚽ Ver los pronósticos de hoy'],
        pt: ['Palpites de futebol feitos por uma IA', 'Um modelo estatístico analisa cada jogo e só mantém os palpites mais confiáveis.', ['📊 Probabilidades, xG e forma de cada jogo', '✅ Histórico público, acertos e erros', '🆓 Grátis'], '⚽ Ver os palpites de hoje'],
        ru: ['Футбольные прогнозы от ИИ', 'Статистическая модель анализирует каждый матч и оставляет только самые надёжные прогнозы.', ['📊 Вероятности, xG и форма команд', '✅ Открытая история, победы и поражения', '🆓 Бесплатно'], '⚽ Прогнозы на сегодня'],
        id: ['Prediksi sepak bola buatan AI', 'Model statistik menganalisis setiap laga dan hanya menyimpan prediksi paling yakin.', ['📊 Probabilitas, xG, dan performa tiap laga', '✅ Riwayat publik, menang dan kalah', '🆓 Gratis'], '⚽ Lihat prediksi hari ini'],
        tr: ['Yapay zekâ ile futbol tahminleri', 'İstatistiksel bir model her maçı analiz eder ve yalnızca en güvendiği tahminleri tutar.', ['📊 Her maç için olasılıklar, xG ve form', '✅ Açık geçmiş, kazanılan ve kaybedilen', '🆓 Ücretsiz'], '⚽ Bugünün tahminleri'] } }
  };
  var NETUI = { fr: ['SPONSORISÉ', 'Ta récompense arrive dans', 'Récupère ta récompense', '🎁 Récupérer ma récompense', 'Fermer'], en: ['SPONSORED', 'Your reward is coming in', 'Claim your reward', '🎁 Claim my reward', 'Close'], es: ['PATROCINADO', 'Tu recompensa llega en', 'Recoge tu recompensa', '🎁 Recoger mi recompensa', 'Cerrar'], pt: ['PATROCINADO', 'Sua recompensa chega em', 'Pegue sua recompensa', '🎁 Pegar minha recompensa', 'Fechar'], ru: ['РЕКЛАМА', 'Награда через', 'Забери награду', '🎁 Забрать награду', 'Закрыть'], id: ['SPONSOR', 'Hadiahmu datang dalam', 'Ambil hadiahmu', '🎁 Ambil hadiahku', 'Tutup'], tr: ['SPONSORLU', 'Ödülün geliyor:', 'Ödülünü al', '🎁 Ödülümü al', 'Kapat'] };
  // 5 nov 2026 (13h35, Jeremy): the SayApp ad shows how many mini apps were created, instead of the free 48 h line
  var MADETX = { fr: '🔥 {n} mini apps déjà créées', en: '🔥 {n} mini apps already built', es: '🔥 {n} mini apps ya creadas', pt: '🔥 {n} mini apps já criadas', ru: '🔥 Уже создано мини-приложений: {n}', id: '🔥 {n} mini app sudah dibuat', tr: '🔥 {n} mini uygulama oluşturuldu' };
  function houseAd(mode) {
    return new Promise(function (done) {
      if (document.getElementById('sayappH')) return done(mode !== 'int');
      var rw = mode !== 'int', lg = String(user.language_code || navigator.language || 'en').slice(0, 2).toLowerCase(), r = Math.random();
      var A = r < 0.7 ? NETAD.sa : r < 0.8 ? NETAD.mct : r < 0.9 ? NETAD.ptb : NETAD.afp, L = A.t[lg] || A.t.en, U = NETUI[lg] || NETUI.en, left = rw ? 5 : 3, total = left;
      if (A === NETAD.sa) { try { if (INFO && INFO.made) LS('sa_made', INFO.made); var mn = Number((INFO && INFO.made) || LS('sa_made') || 0), MT = MADETX[lg] || MADETX.en; L = [L[0], L[1], (mn > 0 ? [MT.replace('{n}', mn.toLocaleString('en'))] : []).concat(L[2]), L[3]]; } catch (z) {} }
      var hu = A.u.replace('src_sayapp_ad', 'src_sax_' + String(APP).replace(/[^a-z0-9]/gi, ''));
      var e = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
      if (!document.getElementById('sayappHcss')) { var st = document.createElement('style'); st.id = 'sayappHcss'; st.textContent =
        '#sayappH{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:calc(16px + env(safe-area-inset-top,0px)) 16px calc(16px + env(safe-area-inset-bottom,0px));background:radial-gradient(120% 80% at 50% 0%,rgba(40,20,90,.55),rgba(3,3,10,.92));-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#fff;opacity:0;transition:opacity .25s}' +
        '#sayappH.on{opacity:1}#sayappH *{box-sizing:border-box}#sayappH .k{position:relative;width:100%;max-width:370px;border-radius:30px;padding:2px;background:linear-gradient(140deg,var(--c1),var(--c2),var(--c1));background-size:200% 200%;animation:sahB 4s linear infinite;box-shadow:0 30px 90px -20px var(--g);transform:translateY(16px) scale(.96);transition:transform .4s cubic-bezier(.2,.9,.3,1.25)}#sayappH.on .k{transform:none}' +
        '@keyframes sahB{0%{background-position:0% 50%}100%{background-position:200% 50%}}#sayappH .in{border-radius:28px;overflow:hidden;background:#0b0a18}' +
        '#sayappH .hero{position:relative;height:178px;display:grid;place-items:center;background:radial-gradient(90% 90% at 20% 10%,var(--c1),transparent 60%),radial-gradient(90% 90% at 90% 100%,var(--c2),transparent 60%),#120f26;overflow:hidden}' +
        '#sayappH .lg{width:88px;height:88px;border-radius:26px;display:grid;place-items:center;font-size:48px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25);box-shadow:0 18px 40px -10px rgba(0,0,0,.6);animation:sahP 2.4s ease-in-out infinite}@keyframes sahP{0%,100%{transform:scale(1) rotate(-3deg)}50%{transform:scale(1.07) rotate(3deg)}}' +
        '#sayappH .fl{position:absolute;font-size:24px;opacity:.9;animation:sahF 3.2s ease-in-out infinite}#sayappH .fl:nth-child(1){left:9%;top:22%}#sayappH .fl:nth-child(2){right:9%;top:42%;animation-delay:.5s}#sayappH .fl:nth-child(3){left:15%;bottom:14%;animation-delay:1s}#sayappH .fl:nth-child(4){right:14%;bottom:18%;animation-delay:1.5s}#sayappH .fl:nth-child(5){left:47%;top:7%;font-size:18px;animation-delay:2s}@keyframes sahF{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}' +
        '#sayappH .bd{position:absolute;top:12px;left:12px;padding:5px 10px;border-radius:99px;background:rgba(0,0,0,.4);font-size:10px;font-weight:800;letter-spacing:.12em}#sayappH .cd{position:absolute;top:10px;right:10px;width:36px;height:36px}#sayappH .cd svg{width:36px;height:36px;transform:rotate(-90deg)}#sayappH .cd b{position:absolute;inset:0;display:grid;place-items:center;font-size:13px;font-weight:800}' +
        '#sayappH .x{position:absolute;top:10px;right:10px;height:36px;padding:0 14px;border-radius:99px;border:0;background:rgba(0,0,0,.5);color:#fff;font-size:13px;font-weight:700;font-family:inherit;cursor:pointer}' +
        '#sayappH .bx{padding:18px 20px 20px}#sayappH h3{margin:0 0 8px;font-size:23px;line-height:1.15;letter-spacing:-.02em;font-weight:850;text-wrap:balance}#sayappH p{margin:0 0 14px;color:#c9c8ec;font-size:14px;line-height:1.45}' +
        '#sayappH ul{list-style:none;margin:0 0 16px;padding:0;display:grid;gap:7px}#sayappH li{padding:9px 12px;border-radius:12px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.07);font-size:13.5px;font-weight:650}' +
        '#sayappH .go{position:relative;display:block;width:100%;overflow:hidden;border:0;border-radius:16px;padding:16px;font-size:17px;font-weight:850;font-family:inherit;color:#fff;background:linear-gradient(120deg,var(--c1),var(--c2));box-shadow:0 14px 34px -12px var(--g);cursor:pointer;animation:sahG 2.2s ease-in-out infinite}' +
        '#sayappH .go:after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.45),transparent);transform:skewX(-20deg);animation:sahS 2.6s ease-in-out infinite}@keyframes sahS{0%,55%{left:-60%}100%{left:130%}}@keyframes sahG{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}' +
        '#sayappH .rw{margin:12px 0 0;border-radius:16px;background:rgba(255,215,90,.08);border:1px solid rgba(255,215,90,.25);padding:10px 12px}#sayappH .rw small{display:block;font-size:12.5px;color:#ffe08a;font-weight:700;margin-bottom:7px}#sayappH .pb{height:6px;border-radius:9px;background:rgba(255,255,255,.1);overflow:hidden}#sayappH .pb i{display:block;height:100%;width:0;background:linear-gradient(90deg,#ffd76a,#ff9f43);transition:width 1s linear}' +
        '#sayappH .cl{display:block;width:100%;margin-top:10px;padding:14px;border:0;border-radius:14px;font-size:15px;font-weight:800;font-family:inherit;color:#1a1000;background:linear-gradient(120deg,#ffd76a,#ff9f43);box-shadow:0 12px 30px -12px rgba(255,170,60,.9);cursor:pointer}#sayappH .cl[hidden]{display:none}';
        document.head.appendChild(st); }
      var x = document.createElement('div'); x.id = 'sayappH';
      x.style.setProperty('--c1', A.c1); x.style.setProperty('--c2', A.c2); x.style.setProperty('--g', A.g);
      x.innerHTML = '<div class="k" role="dialog" aria-label="' + e(L[0]) + '"><div class="in"><div class="hero">' + A.ic.map(function (i) { return '<span class="fl">' + i + '</span>'; }).join('') + '<div class="lg">' + A.lg + '</div><span class="bd">' + e(U[0]) + '</span>' +
        (rw ? '<span class="cd"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" fill="rgba(0,0,0,.45)" stroke="rgba(255,255,255,.15)" stroke-width="3"/><circle id="sahR" cx="18" cy="18" r="15" fill="none" stroke="#ffd76a" stroke-width="3" stroke-linecap="round" stroke-dasharray="94.25" stroke-dashoffset="94.25" style="transition:stroke-dashoffset 1s linear"/></svg><b id="sahN">' + left + '</b></span>' : '<button class="x" disabled>' + left + '</button>') +
        '</div><div class="bx"><h3>' + e(L[0]) + '</h3><p>' + e(L[1]) + '</p><ul>' + L[2].map(function (i) { return '<li>' + e(i) + '</li>'; }).join('') + '</ul><button class="go">' + e(L[3]) + '</button>' +
        (rw ? '<div class="rw"><small id="sahT">' + e(U[1]) + ' ' + left + ' s</small><div class="pb"><i id="sahP"></i></div></div><button class="cl" hidden>' + e(U[3]) + '</button>' : '') + '</div></div></div>';
      document.body.appendChild(x);
      requestAnimationFrame(function () { x.classList.add('on'); if (rw) { var p = document.getElementById('sahP'); if (p) p.style.width = (100 / total) + '%'; var c = document.getElementById('sahR'); if (c) c.style.strokeDashoffset = String(94.25 * (1 - 1 / total)); } });
      var finish = function (ok) { clearInterval(t); x.classList.remove('on'); setTimeout(function () { try { x.remove(); } catch (z) {} }, 250); done(ok); };
      x.querySelector('.go').onclick = function () { try { tw.HapticFeedback.impactOccurred('medium'); } catch (z) {} try { tw.openTelegramLink(hu); } catch (z) { location.href = hu; } if (!rw) finish(true); };
      var xb = x.querySelector('.x'), cb = x.querySelector('.cl');
      if (xb) xb.onclick = function () { if (!xb.disabled) finish(true); };
      if (cb) cb.onclick = function () { try { tw.HapticFeedback.notificationOccurred('success'); } catch (z) {} finish(true); };
      var t = setInterval(function () {
        left--;
        if (rw) {
          var n = document.getElementById('sahN'), tt = document.getElementById('sahT'), p = document.getElementById('sahP'), c = document.getElementById('sahR');
          if (p) p.style.width = Math.min(100, (total - left + 1) / total * 100) + '%'; if (c) c.style.strokeDashoffset = String(94.25 * Math.max(0, 1 - (total - left + 1) / total));
          if (left > 0) { if (n) n.textContent = left; if (tt) tt.textContent = U[1] + ' ' + left + ' s'; return; }
          clearInterval(t); if (n) n.textContent = '✓'; if (tt) tt.textContent = '✅ ' + U[2]; cb.hidden = false; try { tw.HapticFeedback.notificationOccurred('success'); } catch (z) {}
        } else {
          if (left > 0) { xb.textContent = left; return; }
          clearInterval(t); xb.disabled = false; xb.textContent = '✕ ' + U[4];
        }
      }, 1000);
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
