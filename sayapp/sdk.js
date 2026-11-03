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
  var user = (tw && tw.initDataUnsafe && tw.initDataUnsafe.user) || { id: 0, first_name: 'Guest' };
  var cache = {};
  function call(body) {
    body.app = APP; body.initData = (tw && tw.initData) || '';
    return fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); }).catch(function () { return { ok: false }; });
  }
  window.SayApp = {
    app: APP,
    user: user,
    get: function (k) {
      if (k in cache) return Promise.resolve(cache[k]);
      return call({ action: 'get', key: String(k) }).then(function (r) { var v = r && r.ok ? r.value : null; cache[k] = v; return v; });
    },
    set: function (k, v) {
      cache[k] = v;
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
    hasAd: function () { return (adsReady || Promise.resolve()).then(function () { return true; }); },
    ad: function () { return (adsReady || Promise.resolve()).then(function () { return ADS && (ADS.ag || ADS.agx) ? playAd(ADS.ag) : houseAd(); }); },
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
  function madeLink(last) {
    var U = 'https://t.me/SayAppBuilderBot?start=src_app_' + APP, els = document.querySelectorAll('body *');
    // 2 nov 2026 (23h18, Jeremy): every app MUST say "Made with SayApp" (link to SayApp): a small tag is added when the app has none
    if (last === true && !document.getElementById('sayappM') && !/Made with SayApp/i.test((document.body && document.body.innerText) || '')) {
      var m = document.createElement('a'); m.id = 'sayappM'; m.href = U; m.textContent = '✦ Made with SayApp';
      m.style.cssText = 'position:fixed;right:6px;bottom:calc(env(safe-area-inset-bottom,0px) + 4px);z-index:2147483645;padding:2px 7px;border-radius:99px;background:rgba(10,10,20,.55);color:#fff;font:600 10px Inter,system-ui,sans-serif;text-decoration:none;opacity:.7;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)';
      m.addEventListener('click', function (ev) { ev.preventDefault(); try { tw.openTelegramLink(U); } catch (x) { location.href = U; } });
      document.body.appendChild(m);
    }
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      if (e.children.length === 0 && !e.getAttribute('data-sa') && /^\s*Made with SayApp\s*$/i.test(e.textContent || '')) {
        e.setAttribute('data-sa', '1'); e.style.cursor = 'pointer'; e.style.textDecoration = 'underline';
        e.addEventListener('click', function (ev) { ev.preventDefault(); try { tw.openTelegramLink(U); } catch (x) { location.href = U; } });
      }
    }
  }
  // 2 nov 2026 (18h37, Jeremy): the owner's ads (Adsgram block, Ads Galaxy id), set in SayApp > My apps > Manage > Earn money
  var ADS = null, adsReady = null;
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
  function houseAd() {
    return new Promise(function (done) {
      var h = SHOWCASE.indexOf(APP) >= 0 ? EXAMPLE : Math.random() < 0.6 ? HOUSE[0] : HOUSE[1 + Math.floor(Math.random() * (HOUSE.length - 1))], left = 5;
      css('#sayappH{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(5,5,12,.86);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);font-family:Inter,system-ui,-apple-system,sans-serif;animation:sayappF .25s ease}@keyframes sayappF{from{opacity:0}}#sayappH .k{width:100%;max-width:340px;border-radius:26px;overflow:hidden;background:#11111d;border:1px solid rgba(255,255,255,.1);box-shadow:0 30px 80px -20px #000;color:#fff;text-align:center;animation:sayappU .35s cubic-bezier(.2,.9,.3,1.2)}@keyframes sayappU{from{transform:translateY(30px) scale(.96);opacity:0}}#sayappH .v{height:190px;display:grid;place-items:center;font-size:84px;position:relative}#sayappH .v i{position:absolute;top:12px;left:12px;font:700 10px Inter,sans-serif;letter-spacing:.12em;background:rgba(0,0,0,.35);padding:4px 8px;border-radius:99px;font-style:normal}#sayappH .v s{position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:99px;display:grid;place-items:center;background:rgba(0,0,0,.4);font:700 13px Inter,sans-serif;text-decoration:none}#sayappH h3{margin:18px 18px 6px;font-size:21px}#sayappH p{margin:0 22px 18px;color:#a9a8c4;font-size:14px;line-height:1.45}#sayappH a{display:block;margin:0 18px 10px;padding:15px;border-radius:16px;color:#1a1000;font:800 16px Inter,sans-serif;text-decoration:none}#sayappH button{display:block;width:calc(100% - 36px);margin:0 18px 18px;padding:13px;border:0;border-radius:14px;background:rgba(255,255,255,.08);color:#fff;font:600 14px Inter,sans-serif}#sayappH button:disabled{opacity:.45}');
      var x = document.createElement('div'); x.id = 'sayappH';
      x.innerHTML = '<div class="k"><div class="v" style="background:linear-gradient(140deg,' + h.c1 + ',' + h.c2 + ')"><i>' + (h.ex ? (fr ? 'EXEMPLE · PUB RÉCOMPENSÉE' : 'EXAMPLE · REWARDED AD') : (fr ? 'PUB' : 'AD')) + '</i><s id="sayappHc">' + left + '</s>' + h.e + '</div><h3>' + (h.n.fr ? (fr ? h.n.fr : h.n.en) : h.n) + '</h3><p>' + (fr ? h.fr : h.en) + '</p><a href="#" style="background:linear-gradient(120deg,#ffd76a,#ff9f43)">▶️ ' + (h.b ? (fr ? h.b.fr : h.b.en) : (fr ? 'Jouer gratuitement' : 'Play for free')) + '</a><button disabled>' + (fr ? 'Récompense dans ' : 'Reward in ') + left + ' s</button></div>';
      document.body.appendChild(x);
      var b = x.querySelector('button'), cnt = document.getElementById('sayappHc');
      x.querySelector('a').onclick = function (e) { e.preventDefault(); try { tw.openTelegramLink(h.u); } catch (z) { location.href = h.u; } };
      var t = setInterval(function () {
        left--; cnt.textContent = left > 0 ? left : '✓';
        if (left > 0) { b.textContent = (fr ? 'Récompense dans ' : 'Reward in ') + left + ' s'; return; }
        clearInterval(t); b.disabled = false; b.textContent = fr ? '🎁 Récupérer ma récompense' : '🎁 Claim my reward';
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
    setTimeout(houseAd, 1500);
  }
  function openAd() {
    if (!ADS || !ADS.open) return;
    var k = 'sayapp_ad_' + APP, last = 0; try { last = Number(localStorage.getItem(k) || 0); } catch (e) {}
    if (Date.now() - last < 3600000) return;
    try { localStorage.setItem(k, String(Date.now())); } catch (e) {}
    setTimeout(function () { playAd(ADS.agi || ADS.ag); }, 1200);
  }
  function boot() { adsReady = call({ action: 'info' }).then(function (i) { ADS = (i && i.ads) || null; show(i); if (ADS && (ADS.ag || ADS.agx)) openAd(); else demoAd(i); return i; }); madeLink(); setTimeout(madeLink, 1500); setTimeout(function () { madeLink(true); }, 4000); }
  if (document.body) boot(); else document.addEventListener('DOMContentLoaded', boot);
})();
