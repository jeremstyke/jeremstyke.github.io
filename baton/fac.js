/* 31 oct 2026 (11h01, Jeremy): Baton Factory, an idle factory in Pass The Baton (only for the testers for now: bt_state facOn).
   A 🏭 button in the menu opens it full screen. The factory makes crates every hour into a warehouse that fills up; the crates buy
   upgrades (machine, warehouse) or turn into $BATON (daily cap). A rewarded video = x2 for 1 h; every sponsored task = bonus crates. */
(function () {
  var TX = {
    fr: { t: 'Baton Factory', crates: 'caisses', stock: 'Ton stock', made: 'Production en cours', full: '⚠️ Entrepôt plein : récolte !', fullIn: function (h) { return 'Entrepôt plein dans ' + h; },
      collect: function (n) { return '📦 Récolter +' + n + ' caisses'; }, nothing: '📦 Production en cours…', perh: '/h',
      boost: function (n) { return '📺 x2 pendant 1 h (' + n + ' restants)'; }, boostOn: function (s) { return '⚡ x2 ACTIF · ' + s; }, boostNone: 'Plus de x2 aujourd\'hui', wait: 'Vidéo en cours…',
      mach: '⚙️ Machine', store: '🏬 Entrepôt', lv: 'niv.', max: 'MAX', up: 'Améliorer', cap: function (h) { return h + ' h de stock'; },
      conv: '💱 Convertir en $BATON', convS: function (r, d, c) { return '1 caisse = ' + r + ' $BATON · aujourd\'hui ' + d + ' / ' + c + ' $BATON'; }, convB: function (n, b) { return 'Convertir ' + n + ' → +' + b + ' $BATON'; },
      friends: function (n) { return '👥 Ouvriers : +10 % par ami invité (' + n + '/10)'; }, tasks: function (n) { return '🎯 Chaque tâche sponsorisée = +' + n + ' caisses'; },
      ok: { collect: function (n) { return '📦 +' + n + ' caisses !'; }, lvl: '⚙️ Machine améliorée !', store: '🏬 Entrepôt agrandi !', conv: function (b) { return '💱 +' + b + ' $BATON sur ton solde !'; }, boost: '⚡ x2 activé pendant 1 h !' },
      err: { crates: 'Pas assez de caisses.', cap: 'Limite du jour atteinte, reviens demain.', min: 'Minimum 100 caisses.', max: 'Niveau maximum.', limit: 'Plus de x2 aujourd\'hui.', active: 'Le x2 est déjà actif.', novid: 'Vidéo pas terminée.', net: 'Problème de connexion.' },
      close: 'Fermer' },
    en: { t: 'Baton Factory', crates: 'crates', stock: 'Your stock', made: 'In production', full: '⚠️ Warehouse full: collect!', fullIn: function (h) { return 'Warehouse full in ' + h; },
      collect: function (n) { return '📦 Collect +' + n + ' crates'; }, nothing: '📦 Producing…', perh: '/h',
      boost: function (n) { return '📺 x2 for 1 h (' + n + ' left)'; }, boostOn: function (s) { return '⚡ x2 ACTIVE · ' + s; }, boostNone: 'No more x2 today', wait: 'Video playing…',
      mach: '⚙️ Machine', store: '🏬 Warehouse', lv: 'lvl', max: 'MAX', up: 'Upgrade', cap: function (h) { return h + ' h of stock'; },
      conv: '💱 Turn into $BATON', convS: function (r, d, c) { return '1 crate = ' + r + ' $BATON · today ' + d + ' / ' + c + ' $BATON'; }, convB: function (n, b) { return 'Convert ' + n + ' → +' + b + ' $BATON'; },
      friends: function (n) { return '👥 Workers: +10% per invited friend (' + n + '/10)'; }, tasks: function (n) { return '🎯 Each sponsored task = +' + n + ' crates'; },
      ok: { collect: function (n) { return '📦 +' + n + ' crates!'; }, lvl: '⚙️ Machine upgraded!', store: '🏬 Warehouse bigger!', conv: function (b) { return '💱 +' + b + ' $BATON on your balance!'; }, boost: '⚡ x2 on for 1 hour!' },
      err: { crates: 'Not enough crates.', cap: 'Daily limit reached, come back tomorrow.', min: 'At least 100 crates.', max: 'Max level.', limit: 'No more x2 today.', active: 'x2 is already on.', novid: 'Video not finished.', net: 'Connection problem.' },
      close: 'Close' }
  };
  var css = document.createElement('style');
  css.textContent = '#facScr{position:fixed;inset:0;z-index:9000;background:radial-gradient(120% 70% at 50% 0%,#3b2a12 0%,#15100a 62%);color:#fff7ea;overflow-y:auto;box-sizing:border-box;padding:calc(16px + env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) calc(24px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));font-family:inherit}'
    + '#facScr .w{max-width:440px;margin:0 auto;display:flex;flex-direction:column;gap:12px}'
    + '#facScr .hd{display:flex;align-items:center;justify-content:space-between}#facScr h1{margin:0;font-size:24px;font-weight:900}'
    + '#facScr .x{background:rgba(255,255,255,.1);border:0;color:inherit;width:40px;height:40px;border-radius:12px;font-size:18px}'
    + '#facScr .card{padding:14px;border-radius:18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);display:flex;flex-direction:column;gap:8px}'
    + '#facScr .lb{font-size:12px;opacity:.7;text-transform:uppercase;letter-spacing:1px}#facScr .big{font-size:40px;font-weight:900;color:#ffc531;font-variant-numeric:tabular-nums;line-height:1}'
    + '#facScr .fac{font-size:64px;text-align:center;line-height:1;filter:drop-shadow(0 6px 18px rgba(255,197,49,.35))}#facScr .fac.on{animation:facb 1.2s ease-in-out infinite}@keyframes facb{50%{transform:translateY(-4px) scale(1.04)}}'
    + '#facScr .bar{height:10px;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden}#facScr .bar i{display:block;height:100%;background:linear-gradient(90deg,#ffc531,#ff8a2f);border-radius:99px}'
    + '#facScr .btn{width:100%;min-height:52px;border:0;border-radius:16px;font-size:17px;font-weight:900;background:linear-gradient(180deg,#ffd45a,#ff9a2f);color:#2a1300}#facScr .btn:disabled{opacity:.5}'
    + '#facScr .ghost{width:100%;min-height:46px;border-radius:14px;border:1.5px solid rgba(255,197,49,.55);background:rgba(255,197,49,.08);color:#ffd45a;font-weight:800;font-size:15px}#facScr .ghost:disabled{opacity:.5}#facScr .ghost.on{border-color:#3ee6a0;color:#3ee6a0;background:rgba(62,230,160,.1)}'
    + '#facScr .row{display:flex;align-items:center;gap:10px}#facScr .row .who{flex:1;min-width:0}#facScr .row b{display:block}#facScr .row small{opacity:.75;font-size:13px}'
    + '#facScr .up{border:0;border-radius:12px;padding:10px 12px;font-weight:800;background:#ffc531;color:#2a1300;white-space:nowrap}#facScr .up:disabled{opacity:.45}'
    + '#facScr .note{font-size:13px;opacity:.8;line-height:1.5}'
    + 'nav button#facNav{position:relative}';
  document.head.appendChild(css);
  var st = null, t0 = 0, skew = 0, busy = false, scr = null, timer = null;
  function B() { return window.BT; }
  function T() { var b = B(); return TX[b && b.lang === 'fr' ? 'fr' : 'en']; }
  function nf(n) { var b = B(); return Math.floor(Number(n) || 0).toLocaleString(b && b.lang === 'fr' ? 'fr-FR' : 'en-US'); }
  function hm(ms) { var m = Math.max(0, Math.ceil(ms / 60000)); return Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0'); }
  function ms2(ms) { var s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function now() { return Date.now() + skew; }
  function pend() {
    if (!st) return 0;
    var n = now(), end = Math.min(n, st.full_at), from = t0 + skew;
    if (end <= from) return Number(st.pending) || 0;
    var h = (end - from) / 3600000, bh = 0;
    if (st.boost_until) bh = Math.max(0, (Math.min(end, st.boost_until) - from) / 3600000);
    return (Number(st.pending) || 0) + Number(st.rate) * (h + bh);
  }
  function load(act, extra) {
    var b = B(); if (!b) return Promise.resolve(null);
    return b.api('fac', Object.assign({ act: act || 'state' }, extra || {})).then(function (r) {
      if (r && r.lvl != null) { st = r; t0 = Date.now(); if (r.now) skew = r.now - Date.now(); }
      return r;
    }).catch(function () { return null; });
  }
  function toast(m) { try { B().toast(m); } catch (e) {} }
  function hap(k) { try { B().hap(k); } catch (e) {} }
  function draw() {
    if (!scr || !st) return;
    var L = T(), p = Math.floor(pend()), full = now() >= st.full_at, boostOn = st.boost_until && st.boost_until > now();
    var pct = Math.min(100, Math.max(0, (now() - (st.collect_at)) / (st.full_at - st.collect_at) * 100));
    var convLeft = Math.max(0, st.day_cap - st.conv_today), convN = Math.min(Math.floor(st.crates), Math.ceil(convLeft / st.conv));
    var html = '<div class="w"><div class="hd"><h1>🏭 ' + L.t + '</h1><button class="x" id="facX" aria-label="' + L.close + '">✕</button></div>'
      + '<div class="fac' + (full ? '' : ' on') + '">🏭</div>'
      + '<div class="card"><div class="lb">' + L.stock + '</div><div class="big">' + nf(st.crates) + ' <span style="font-size:18px">📦 ' + L.crates + '</span></div></div>'
      + '<div class="card"><div class="row"><div class="who"><div class="lb">' + L.made + '</div><b style="font-size:22px">+' + nf(p) + ' 📦</b></div><b style="color:#ffc531">' + nf(st.rate * (boostOn ? 2 : 1)) + L.perh + (boostOn ? ' ⚡' : '') + '</b></div>'
      + '<div class="bar"><i style="width:' + pct.toFixed(1) + '%"></i></div><small style="opacity:.8">' + (full ? L.full : L.fullIn(hm(st.full_at - now()))) + '</small>'
      + '<button class="btn" id="facC"' + (busy || p < 1 ? ' disabled' : '') + '>' + (p >= 1 ? L.collect(nf(p)) : L.nothing) + '</button>'
      + '<button class="ghost' + (boostOn ? ' on' : '') + '" id="facB"' + (busy || boostOn || st.boost_left <= 0 ? ' disabled' : '') + '>' + (boostOn ? L.boostOn(ms2(st.boost_until - now())) : st.boost_left > 0 ? L.boost(st.boost_left) : L.boostNone) + '</button></div>'
      + '<div class="card"><div class="row"><div class="who"><b>' + L.mach + ' · ' + L.lv + ' ' + st.lvl + '</b><small>' + nf(st.rate) + L.perh + (st.lvl_cost != null ? ' → ' + nf(st.lvl_next_rate) + L.perh : '') + '</small></div>'
      + (st.lvl_cost != null ? '<button class="up" id="facL"' + (busy || st.crates < st.lvl_cost ? ' disabled' : '') + '>' + nf(st.lvl_cost) + ' 📦</button>' : '<b style="color:#3ee6a0">' + L.max + '</b>') + '</div>'
      + '<div class="row"><div class="who"><b>' + L.store + ' · ' + L.lv + ' ' + st.store + '</b><small>' + L.cap(st.cap_h) + (st.store_cost != null ? ' → ' + L.cap(st.cap_h + 2) : '') + '</small></div>'
      + (st.store_cost != null ? '<button class="up" id="facS"' + (busy || st.crates < st.store_cost ? ' disabled' : '') + '>' + nf(st.store_cost) + ' 📦</button>' : '<b style="color:#3ee6a0">' + L.max + '</b>') + '</div></div>'
      + '<div class="card"><b>' + L.conv + '</b><small style="opacity:.8">' + L.convS(st.conv, nf(st.conv_today), nf(st.day_cap)) + '</small>'
      + '<button class="ghost" id="facV"' + (busy || convN < st.min_conv || convLeft <= 0 ? ' disabled' : '') + '>' + L.convB(nf(convN), nf(Math.min(convN * st.conv, convLeft))) + '</button></div>'
      + '<div class="note">' + L.friends(st.friends) + '<br>' + L.tasks(st.task_crates) + '</div></div>';
    if (scr.dataset.h !== html) { scr.dataset.h = html; scr.innerHTML = html; bind(); }
  }
  function act(a, extra, okMsg) {
    if (busy) return; busy = true; hap(); draw();
    load(a, extra).then(function (r) {
      busy = false;
      if (!r) toast(T().err.net);
      else if (r.ok === false) { hap('error'); toast(T().err[r.error] || T().err.net); }
      else { hap('success'); toast(typeof okMsg === 'function' ? okMsg(r) : okMsg); }
      draw();
    });
  }
  function boost() {
    var b = B(); if (busy || !b) return; busy = true; draw(); hap();
    b.api('vid', { mode: 'factory' }).then(function (v) {
      if (v && v.error === 'wait') { busy = false; draw(); toast('⏳ ' + Math.max(1, Math.ceil(((Number(v.next) || 0) - Date.now()) / 1000)) + ' s'); return; }
      return window.__showRw().then(function () {
        var n = 0, w = setInterval(function () {
          n++;
          load().then(function () {
            if (st && st.boost_until && st.boost_until > now()) { clearInterval(w); busy = false; hap('success'); toast(T().ok.boost); draw(); }
            else if (n >= 10) { clearInterval(w); busy = false; draw(); }
          });
        }, 2000);
      }, function () { busy = false; draw(); toast(T().err.novid); });
    }).catch(function () { busy = false; draw(); });
  }
  function bind() {
    var g = function (id) { return document.getElementById(id); };
    if (g('facX')) g('facX').onclick = close;
    if (g('facC')) g('facC').onclick = function () { act('collect', null, function (r) { return T().ok.collect(nf(r.got)); }); };
    if (g('facB')) g('facB').onclick = boost;
    if (g('facL')) g('facL').onclick = function () { act('up_lvl', null, T().ok.lvl); };
    if (g('facS')) g('facS').onclick = function () { act('up_store', null, T().ok.store); };
    if (g('facV')) g('facV').onclick = function () {
      var left = Math.max(0, st.day_cap - st.conv_today), n = Math.min(Math.floor(st.crates), Math.ceil(left / st.conv));
      act('convert', { n: n }, function (r) { try { B().refresh(); } catch (e) {} return T().ok.conv(nf(r.baton)); });
    };
  }
  function open() {
    hap(); if (scr) return;
    scr = document.createElement('div'); scr.id = 'facScr'; scr.setAttribute('role', 'dialog');
    scr.innerHTML = '<div class="w"><div class="hd"><h1>🏭 ' + T().t + '</h1></div><div style="text-align:center;padding:40px">⏳</div></div>';
    document.body.appendChild(scr);
    load().then(draw);
    timer = setInterval(draw, 1000);
  }
  function close() { hap(); clearInterval(timer); if (scr) { scr.remove(); scr = null; } }
  window.btFactory = open;
  // the 🏭 button in the menu, only when the server says the factory is on for this player
  setInterval(function () {
    var b = B(); if (!b || !b.S) return;
    var nav = document.querySelector('nav.tabs') || document.querySelector('nav'), btn = document.getElementById('facNav');
    if (!b.S.facOn) { if (btn) btn.remove(); return; }
    if (!nav || btn) return;
    btn = document.createElement('button'); btn.id = 'facNav'; btn.type = 'button';
    btn.innerHTML = '<span aria-hidden="true" style="font-size:20px;line-height:1">🏭</span><span>' + (b.lang === 'fr' ? 'Usine' : 'Factory') + '</span>';
    var ref = nav.querySelector('button'); if (ref) btn.className = ref.className.replace(/\bon\b/, '').trim();
    btn.addEventListener('click', function (e) { e.preventDefault(); e.stopImmediatePropagation(); open(); }, true);
    nav.appendChild(btn);
  }, 1000);
})();
