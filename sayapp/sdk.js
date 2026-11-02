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
    if (!info || !info.ok || info.pro) return;
    var F = 'font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;';
    if (info.expired) {
      css('#sayappX{position:fixed;inset:0;z-index:2147483647;background:#07070d;color:#f4f3ff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;' + F + '}#sayappX b{display:grid;place-items:center;width:64px;height:64px;border-radius:20px;background:linear-gradient(120deg,#8b5cff,#2fd6ff);font-size:30px;margin-bottom:18px}#sayappX h2{margin:0 0 8px;font-size:22px}#sayappX p{margin:0 0 22px;color:#a09fbd;max-width:300px;line-height:1.5}#sayappX button{border:0;padding:15px 22px;border-radius:14px;background:linear-gradient(120deg,#ffd76a,#ff9f43);color:#2a1700;font:700 15px Inter,system-ui,sans-serif}');
      var x = document.createElement('div'); x.id = 'sayappX';
      x.innerHTML = info.banned ? '<b>✦</b><h2>' + (fr ? 'Appli suspendue' : 'App suspended') + '</h2><p>' + (fr ? 'Cette appli a été suspendue car elle ne respecte pas les règles de SayApp.' : 'This app has been suspended because it breaks the SayApp rules.') + '</p><button>' + (fr ? '✦ Ouvrir SayApp' : '✦ Open SayApp') + '</button>' : '<b>✦</b><h2>' + (fr ? 'Démo expirée' : 'Demo expired') + '</h2><p>' + (fr ? 'Cette démo SayApp a expiré. Son créateur peut la remettre en ligne pour toujours avec SayApp Pro.' : 'This SayApp demo has expired. Its creator can put it back online for good with SayApp Pro.') + '</p><button>' + (fr ? '✦ Ouvrir SayApp' : '✦ Open SayApp') + '</button>';
      x.querySelector('button').onclick = go; document.body.appendChild(x); return;
    }
    css('#sayappB{position:fixed;left:0;right:0;top:0;z-index:2147483646;height:30px;display:flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(120deg,#8b5cff,#2fd6ff);color:#fff;font:600 12px Inter,system-ui,sans-serif;cursor:pointer}#sayappB u{text-decoration:none;background:rgba(255,255,255,.22);padding:2px 8px;border-radius:99px}html{scroll-padding-top:30px}body{margin-top:30px!important}');
    var bn = document.createElement('div'); bn.id = 'sayappB';
    bn.innerHTML = '✦ ' + (fr ? 'Démo SayApp' + (info.left ? ' · ' + info.left + ' j' : '') : 'SayApp demo' + (info.left ? ' · ' + info.left + 'd left' : '')) + ' <u>' + (fr ? 'Créer la mienne' : 'Make mine') + '</u>';
    bn.onclick = go; document.body.appendChild(bn);
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
  function boot() { call({ action: 'info' }).then(show); }
  if (document.body) boot(); else document.addEventListener('DOMContentLoaded', boot);
})();
