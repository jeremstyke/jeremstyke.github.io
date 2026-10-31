/* 31 oct 2026 (Jeremy): Baton Factory, an idle factory on the Pass The Baton bot, its own mini app opened with startapp=factory
   (only when the server says it is on for this player: bt_state facOn). 12h27: made fun to play: a living factory (smoke, gear,
   conveyor belt that speeds up with the machine), tap the factory to make crates by hand (+1 each, batched to the server, daily limit),
   floating numbers, a "next goal" card and confetti on every upgrade. 12h44: more fun: a golden crate 🎁 shows up on the belt
   now and then (tap it fast for a random bonus), tap combos, little sounds, and the building grows with the machine level. The crates buy upgrades or turn into $BATON (daily cap);
   a rewarded video = x2 for 1 h; every sponsored task of Pass The Baton = bonus crates. */
(function () {
  var TX = {
    fr: { t: 'Baton Factory', crates: 'caisses', made: 'En attente', full: '⚠️ Entrepôt plein : récolte vite !', fullIn: function (h) { return 'Plein dans ' + h; },
      collect: function (n) { return '📦 Récolter +' + n; }, nothing: '⏳ Ça produit…', perh: '/h', tap: function (n, m) { return '👆 Tape l\'usine : +1 📦 (' + n + '/' + m + ' aujourd\'hui)'; }, tapDone: '👆 Tes mains sont fatiguées, reviens demain !',
      boost: function (n) { return '📺 Turbo x2 pendant 1 h (' + n + ')'; }, boostOn: function (s) { return '⚡ TURBO x2 · ' + s; }, boostNone: 'Plus de turbo aujourd\'hui',
      mach: '⚙️ Machine', store: '🏬 Entrepôt', lv: 'niv.', max: 'MAX', cap: function (h) { return h + ' h de stock'; },
      goal: '🎯 Prochain objectif', goalT: function (w, n) { return w + ' · encore ' + n + ' 📦'; }, goalOk: function (w) { return w + ' : c\'est prêt, améliore !'; },
      conv: '💱 Échanger contre des $BATON', convS: function (r, d, c) { return '1 📦 = ' + r + ' $BATON · aujourd\'hui ' + d + ' / ' + c; }, convB: function (n, b) { return 'Échanger ' + n + ' 📦 → +' + b + ' $BATON'; },
      friends: function (n) { return '👥 Ouvriers : +10 % de production par ami invité (' + n + '/10)'; }, tasks: function (n) { return '🎯 Chaque tâche sponsorisée = +' + n + ' 📦'; },
      ok: { collect: function (n) { return '📦 +' + n + ' caisses !'; }, lvl: function (l) { return '⚙️ Machine niveau ' + l + ' !'; }, store: '🏬 Entrepôt agrandi !', conv: function (b) { return '💱 +' + b + ' $BATON sur ton solde !'; }, boost: '⚡ Turbo activé pendant 1 h !' },
      err: { crates: 'Pas assez de caisses.', cap: 'Limite d\'échange du jour atteinte.', min: 'Minimum 100 caisses.', max: 'Niveau maximum.', limit: 'Plus de turbo aujourd\'hui.', active: 'Le turbo est déjà actif.', novid: 'Vidéo pas terminée.', net: 'Problème de connexion.' },
      game: '🏃 Ouvrir Pass The Baton', close: 'Fermer', gold: function (n) { return '🎁 CAISSE DORÉE +' + n + ' 📦 !'; }, combo: function (n) { return '🔥 COMBO x' + n; }, goldHint: '🎁 Une caisse dorée ! Tape-la vite !' },
    en: { t: 'Baton Factory', crates: 'crates', made: 'Waiting', full: '⚠️ Warehouse full: collect now!', fullIn: function (h) { return 'Full in ' + h; },
      collect: function (n) { return '📦 Collect +' + n; }, nothing: '⏳ Producing…', perh: '/h', tap: function (n, m) { return '👆 Tap the factory: +1 📦 (' + n + '/' + m + ' today)'; }, tapDone: '👆 Your hands are tired, come back tomorrow!',
      boost: function (n) { return '📺 Turbo x2 for 1 h (' + n + ')'; }, boostOn: function (s) { return '⚡ TURBO x2 · ' + s; }, boostNone: 'No more turbo today',
      mach: '⚙️ Machine', store: '🏬 Warehouse', lv: 'lvl', max: 'MAX', cap: function (h) { return h + ' h of stock'; },
      goal: '🎯 Next goal', goalT: function (w, n) { return w + ' · ' + n + ' 📦 to go'; }, goalOk: function (w) { return w + ': ready, upgrade it!'; },
      conv: '💱 Trade for $BATON', convS: function (r, d, c) { return '1 📦 = ' + r + ' $BATON · today ' + d + ' / ' + c; }, convB: function (n, b) { return 'Trade ' + n + ' 📦 → +' + b + ' $BATON'; },
      friends: function (n) { return '👥 Workers: +10% production per invited friend (' + n + '/10)'; }, tasks: function (n) { return '🎯 Each sponsored task = +' + n + ' 📦'; },
      ok: { collect: function (n) { return '📦 +' + n + ' crates!'; }, lvl: function (l) { return '⚙️ Machine level ' + l + '!'; }, store: '🏬 Warehouse bigger!', conv: function (b) { return '💱 +' + b + ' $BATON on your balance!'; }, boost: '⚡ Turbo on for 1 hour!' },
      err: { crates: 'Not enough crates.', cap: 'Daily trade limit reached.', min: 'At least 100 crates.', max: 'Max level.', limit: 'No more turbo today.', active: 'Turbo is already on.', novid: 'Video not finished.', net: 'Connection problem.' },
      game: '🏃 Open Pass The Baton', close: 'Close', gold: function (n) { return '🎁 GOLDEN CRATE +' + n + ' 📦!'; }, combo: function (n) { return '🔥 COMBO x' + n; }, goldHint: '🎁 A golden crate! Tap it fast!' }
  };
  var css = document.createElement('style');
  css.textContent = '#facScr{position:fixed;inset:0;z-index:9000;background:linear-gradient(180deg,#2a1d0c 0%,#15100a 55%);color:#fff7ea;overflow-y:auto;box-sizing:border-box;padding:calc(12px + env(safe-area-inset-top,0px)) max(14px,env(safe-area-inset-right,0px)) calc(24px + env(safe-area-inset-bottom,0px)) max(14px,env(safe-area-inset-left,0px));font-family:inherit;-webkit-user-select:none;user-select:none}'
    + '#facScr *{box-sizing:border-box}#facScr .w{max-width:440px;margin:0 auto;display:flex;flex-direction:column;gap:12px}'
    + '#facScr .hd{display:flex;align-items:center;gap:10px}#facScr h1{margin:0;font-size:20px;font-weight:900;flex:1}'
    + '#facScr .pill{display:flex;align-items:center;gap:6px;padding:8px 12px;border-radius:99px;background:rgba(255,197,49,.14);border:1px solid rgba(255,197,49,.4);font-weight:900;font-size:18px;color:#ffd45a;font-variant-numeric:tabular-nums}'
    + '#facScr .pill.pop{animation:fpop .4s ease}@keyframes fpop{40%{transform:scale(1.18)}}'
    + '#facScr .x{background:rgba(255,255,255,.1);border:0;color:inherit;width:38px;height:38px;border-radius:12px;font-size:17px}'
    + '#facScr .scene{position:relative;height:270px;border-radius:22px;overflow:hidden;background:linear-gradient(180deg,#4a7bd1 0%,#8fb8f0 60%,#c9a46a 60%,#a27d47 100%);border:2px solid rgba(255,255,255,.12);cursor:pointer;touch-action:manipulation}'
    + '#facScr .scene.boost{background:linear-gradient(180deg,#5b2a8a 0%,#c26fe0 60%,#c9a46a 60%,#a27d47 100%)}'
    + '#facScr .sun{position:absolute;top:16px;right:22px;width:34px;height:34px;border-radius:50%;background:#ffe27a;box-shadow:0 0 24px #ffe27a}'
    + '#facScr .bld{position:absolute;left:50%;bottom:58px;width:150px;height:96px;margin-left:-75px;background:#c2532f;border-radius:6px 6px 0 0;box-shadow:inset 0 -10px 0 rgba(0,0,0,.18);transition:transform .08s}'
    + '#facScr .bld:before{content:"";position:absolute;left:-8px;right:-8px;top:-14px;height:16px;background:#8f3b20;border-radius:4px}'
    + '#facScr .bld .win{position:absolute;top:22px;width:26px;height:22px;background:#ffd45a;border-radius:3px;box-shadow:0 0 10px rgba(255,212,90,.8)}'
    + '#facScr .bld .door{position:absolute;bottom:0;left:50%;margin-left:-16px;width:32px;height:40px;background:#5b2a14;border-radius:4px 4px 0 0}'
    + '#facScr .chim{position:absolute;bottom:140px;left:50%;margin-left:28px;width:22px;height:46px;background:#8f3b20;border-radius:3px 3px 0 0}'
    + '#facScr .smoke{position:absolute;left:50%;margin-left:30px;bottom:186px;width:18px;height:18px;border-radius:50%;background:rgba(255,255,255,.85);opacity:0;animation:fsmk 2.4s linear infinite}'
    + '#facScr .smoke.s2{animation-delay:.8s}#facScr .smoke.s3{animation-delay:1.6s}#facScr .scene.boost .smoke{animation-duration:1.2s}'
    + '@keyframes fsmk{0%{opacity:.9;transform:translate(0,0) scale(.6)}100%{opacity:0;transform:translate(26px,-70px) scale(2.2)}}'
    + '#facScr .gear{position:absolute;bottom:92px;left:50%;margin-left:-62px;font-size:30px;animation:fspin 3s linear infinite}#facScr .scene.boost .gear{animation-duration:1s}'
    + '@keyframes fspin{to{transform:rotate(360deg)}}'
    + '#facScr .belt{position:absolute;left:0;right:0;bottom:26px;height:26px;background:repeating-linear-gradient(90deg,#333 0 14px,#444 14px 28px);animation:fbelt 1s linear infinite;border-top:3px solid #222;border-bottom:3px solid #222}'
    + '@keyframes fbelt{to{background-position:28px 0}}'
    + '#facScr .crate{position:absolute;bottom:40px;left:-30px;font-size:24px;animation:fmove 6s linear infinite}'
    + '@keyframes fmove{to{transform:translateX(calc(100vw + 60px))}}'
    + '#facScr .hint{position:absolute;left:0;right:0;bottom:4px;text-align:center;font-size:13px;font-weight:800;text-shadow:0 1px 3px rgba(0,0,0,.6)}'
    + '#facScr .fl{position:absolute;font-weight:900;font-size:20px;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,.6);pointer-events:none;animation:ffl .9s ease-out forwards}'
    + '@keyframes ffl{to{transform:translateY(-60px);opacity:0}}'
    + '#facScr .card{padding:14px;border-radius:18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);display:flex;flex-direction:column;gap:8px}'
    + '#facScr .lb{font-size:12px;opacity:.7;text-transform:uppercase;letter-spacing:1px}'
    + '#facScr .bar{height:10px;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden}#facScr .bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#ffc531,#ff8a2f);border-radius:99px;transition:width .5s}'
    + '#facScr .btn{width:100%;min-height:54px;border:0;border-radius:16px;font-size:18px;font-weight:900;background:linear-gradient(180deg,#ffd45a,#ff9a2f);color:#2a1300;box-shadow:0 6px 0 #b8641c}#facScr .btn:active{transform:translateY(3px);box-shadow:0 3px 0 #b8641c}#facScr .btn:disabled{opacity:.5;box-shadow:none}'
    + '#facScr .btn.full{animation:fpulse 1s ease-in-out infinite}@keyframes fpulse{50%{transform:scale(1.03)}}'
    + '#facScr .ghost{width:100%;min-height:46px;border-radius:14px;border:1.5px solid rgba(255,197,49,.55);background:rgba(255,197,49,.08);color:#ffd45a;font-weight:800;font-size:15px}#facScr .ghost:disabled{opacity:.5}#facScr .ghost.on{border-color:#c26fe0;color:#e2a6ff;background:rgba(194,111,224,.14)}'
    + '#facScr .row{display:flex;align-items:center;gap:10px}#facScr .row .who{flex:1;min-width:0}#facScr .row b{display:block}#facScr .row small{opacity:.75;font-size:13px}'
    + '#facScr .up{border:0;border-radius:12px;padding:10px 12px;font-weight:900;background:#ffc531;color:#2a1300;white-space:nowrap;min-width:88px}#facScr .up:disabled{opacity:.4}'
    + '#facScr .goal{border-color:rgba(62,230,160,.45);background:rgba(62,230,160,.07)}#facScr .goal .bar i{background:linear-gradient(90deg,#3ee6a0,#ffc531)}'
    + '#facScr .note{font-size:13px;opacity:.8;line-height:1.55}'
    + '#facScr .gold{position:absolute;bottom:46px;font-size:34px;filter:drop-shadow(0 0 10px #ffd45a) drop-shadow(0 0 4px #fff);animation:fgold 7s linear forwards,fbob .5s ease-in-out infinite alternate;z-index:3;cursor:pointer}'
    + '@keyframes fgold{from{left:-40px}to{left:calc(100% + 40px)}}@keyframes fbob{to{margin-bottom:10px}}'
    + '#facScr .combo{position:absolute;right:12px;top:36px;font-weight:900;font-size:22px;color:#ffd45a;text-shadow:0 2px 6px rgba(0,0,0,.6);transform:rotate(-6deg);pointer-events:none}'
    + '#facScr .combo.hit{animation:fpop .25s ease}'
    + '#facScr .lvb{position:absolute;top:-34px;left:50%;transform:translateX(-50%);background:#ffc531;color:#2a1300;font-weight:900;font-size:12px;padding:2px 8px;border-radius:99px;white-space:nowrap}'
    + '#facScr .bld .win.r2{top:52px}#facScr .bld .win.r3{top:82px}'
    + '#facScr .cf{position:fixed;top:-30px;font-size:22px;pointer-events:none;animation:fcf 1.8s ease-in forwards;z-index:9001}@keyframes fcf{to{transform:translateY(110vh) rotate(540deg)}}';
  document.head.appendChild(css);
  var st = null, t0 = 0, skew = 0, busy = false, scr = null, timer = null, taps = 0, tapT = null, tapLeft = 0, E = {}, combo = 0, lastTap = 0, nextGold = 0, goldOn = false, AC = null;
  // little sounds made on the fly (no file): started on the first tap
  function snd(f, d, type, vol) { try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); var o = AC.createOscillator(), g = AC.createGain(); o.type = type || 'square'; o.frequency.value = f; g.gain.setValueAtTime(vol || .05, AC.currentTime); g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + (d || .08)); o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + (d || .08)); } catch (e) {} }
  function jingle(notes) { notes.forEach(function (f, i) { setTimeout(function () { snd(f, .12, 'triangle', .07); }, i * 90); }); }
  function B() { return window.BT; }
  function T() { var b = B(); return TX[b && b.lang === 'fr' ? 'fr' : 'en']; }
  function nf(n) { var b = B(); return Math.floor(Number(n) || 0).toLocaleString(b && b.lang === 'fr' ? 'fr-FR' : 'en-US'); }
  function hm(ms) { var m = Math.max(0, Math.ceil(ms / 60000)); return Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0'); }
  function ms2(ms) { var s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function now() { return Date.now() + skew; }
  function toast(m) { try { B().toast(m); } catch (e) {} }
  function hap(k) { try { B().hap(k); } catch (e) {} }
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
      if (r && r.lvl != null) { st = r; t0 = Date.now(); if (r.now) skew = r.now - Date.now(); tapLeft = Number(r.tap_left) || 0; }
      return r;
    }).catch(function () { return null; });
  }
  function confetti() { for (var i = 0; i < 26; i++) { var c = document.createElement('div'); c.className = 'cf'; c.textContent = ['📦', '⚙️', '✨', '🎉'][i % 4]; c.style.left = Math.random() * 100 + 'vw'; c.style.animationDelay = Math.random() * .5 + 's'; document.body.appendChild(c); setTimeout(function (x) { x.remove(); }, 2600, c); } }
  function floatAt(x, y, txt) { if (!E.scene) return; var r = E.scene.getBoundingClientRect(), f = document.createElement('div'); f.className = 'fl'; f.textContent = txt; f.style.left = (x - r.left - 14) + 'px'; f.style.top = (y - r.top - 20) + 'px'; E.scene.appendChild(f); setTimeout(function () { f.remove(); }, 950); }
  function pop() { if (!E.pill) return; E.pill.classList.remove('pop'); void E.pill.offsetWidth; E.pill.classList.add('pop'); }
  // the static screen, built once (the numbers are updated in place so the animations never restart)
  function build() {
    var L = T();
    scr.innerHTML = '<div class="w"><div class="hd"><h1>🏭 ' + L.t + '</h1><div class="pill" id="fPill">📦 <span id="fCr">0</span></div><button class="x" id="fX" aria-label="' + L.close + '">✕</button></div>'
      + '<div class="scene" id="fScene" role="button" aria-label="tap"><div class="sun"></div><div class="hint" id="fHint"></div>'
      + '<div class="smoke"></div><div class="smoke s2"></div><div class="smoke s3"></div><div class="chim"></div>'
      + '<div class="bld" id="fBld"><div class="lvb" id="fLvb"></div><div class="win" style="left:16px"></div><div class="win" style="left:62px"></div><div class="win" style="right:16px"></div><div id="fWins"></div><div class="door"></div></div><div class="combo" id="fCombo"></div>'
      + '<div class="gear">⚙️</div><div class="belt" id="fBelt"></div><div id="fCrates"></div></div>'
      + '<div class="card"><div class="row"><div class="who"><div class="lb">' + L.made + '</div><b style="font-size:24px" id="fPend">+0 📦</b></div><b style="color:#ffc531;font-size:17px" id="fRate"></b></div>'
      + '<div class="bar"><i id="fBar"></i></div><small style="opacity:.8" id="fFull"></small>'
      + '<button class="btn" id="fC"></button><button class="ghost" id="fB"></button></div>'
      + '<div class="card goal"><div class="lb">' + L.goal + '</div><b id="fGoal"></b><div class="bar"><i id="fGoalBar"></i></div></div>'
      + '<div class="card"><div class="row"><div class="who"><b id="fML"></b><small id="fMS"></small></div><button class="up" id="fL"></button></div>'
      + '<div class="row"><div class="who"><b id="fSL"></b><small id="fSS"></small></div><button class="up" id="fS"></button></div></div>'
      + '<div class="card"><b>' + L.conv + '</b><small style="opacity:.8" id="fVS"></small><button class="ghost" id="fV"></button></div>'
      + '<div class="note" id="fNote"></div>'
      + '<button class="ghost" id="fG" style="border-color:rgba(255,255,255,.2);color:inherit;background:none">' + L.game + '</button></div>';
    ['Lvb', 'Wins', 'Combo', 'Pill', 'Cr', 'Scene', 'Hint', 'Bld', 'Belt', 'Crates', 'Pend', 'Rate', 'Bar', 'Full', 'C', 'B', 'Goal', 'GoalBar', 'ML', 'MS', 'L', 'SL', 'SS', 'S', 'VS', 'V', 'Note', 'G', 'X'].forEach(function (k) { E[k.toLowerCase()] = document.getElementById('f' + k); });
    E.x.onclick = close; E.g.onclick = close;
    E.c.onclick = function () { act('collect', null, function (r) { pop(); jingle([523, 659, 784]); return T().ok.collect(nf(r.got)); }); };
    E.b.onclick = boost;
    E.l.onclick = function () { act('up_lvl', null, function (r) { confetti(); jingle([523, 659, 784, 1047]); beltKey = ''; return T().ok.lvl(r.lvl); }); };
    E.s.onclick = function () { act('up_store', null, function () { confetti(); jingle([523, 659, 784, 1047]); return T().ok.store; }); };
    E.v.onclick = function () {
      var left = Math.max(0, st.day_cap - st.conv_today), n = Math.min(Math.floor(st.crates), Math.ceil(left / st.conv));
      act('convert', { n: n }, function (r) { try { B().refresh(); } catch (e) {} return T().ok.conv(nf(r.baton)); });
    };
    E.scene.addEventListener('pointerdown', tap);
  }
  // the crates on the belt: more of them, faster, with a better machine
  var beltKey = '';
  function belt() {
    var lv = st.lvl || 1, boost = st.boost_until && st.boost_until > now(), k = lv + '|' + boost; if (beltKey === k) return; beltKey = k;
    var n = Math.min(6, 2 + Math.floor(lv / 3)), dur = Math.max(2.5, 7 - lv * 0.25) / (boost ? 2 : 1), h = '';
    for (var i = 0; i < n; i++) h += '<div class="crate" style="animation-duration:' + dur.toFixed(2) + 's;animation-delay:-' + (dur / n * i).toFixed(2) + 's">📦</div>';
    E.crates.innerHTML = h; E.belt.style.animationDuration = (0.9 / (boost ? 2 : 1)) + 's';
    // the building grows with the machine: one more floor every 4 levels (up to 3)
    var fl = Math.min(3, 1 + Math.floor((lv - 1) / 4)), hh = 66 + 30 * fl;
    E.bld.style.height = hh + 'px'; E.lvb.textContent = (B() && B().lang === 'fr' ? 'Niv. ' : 'Lvl ') + lv;
    var w = ''; for (var j = 2; j <= fl; j++) w += '<div class="win r' + j + '" style="left:16px"></div><div class="win r' + j + '" style="left:62px"></div><div class="win r' + j + '" style="right:16px"></div>';
    E.wins.innerHTML = w;
    var chim = scr.querySelector('.chim'); if (chim) chim.style.bottom = (58 + hh - 14) + 'px';
    scr.querySelectorAll('.smoke').forEach(function (x) { x.style.bottom = (58 + hh + 32) + 'px'; });
  }
  function spawnGold() {
    goldOn = true; nextGold = 0;
    var g = document.createElement('div'); g.className = 'gold'; g.textContent = '🎁'; E.scene.appendChild(g);
    E.hint.textContent = T().goldHint; snd(880, .15, 'triangle', .06);
    var gone = setTimeout(function () { g.remove(); goldOn = false; }, 7000);
    g.addEventListener('pointerdown', function (ev) {
      ev.stopPropagation(); clearTimeout(gone); var r = g.getBoundingClientRect(); g.remove(); hap('success');
      load('gold').then(function (x) {
        goldOn = false;
        if (x && x.gold) { floatAt(r.left + 10, r.top, T().gold(x.gold)); jingle([660, 880, 1100, 1320]); confetti(); pop(); }
        draw();
      });
    });
  }
  function tap(e) {
    if (!st) return;
    if (tapLeft - taps <= 0) { toast(T().tapDone); return; }
    taps++; hap();
    var tn = Date.now(); combo = tn - lastTap < 650 ? combo + 1 : 1; lastTap = tn;
    snd(320 + Math.min(combo, 30) * 18, .06);
    floatAt(e.clientX, e.clientY, '+1 📦');
    if (combo >= 5) { E.combo.textContent = T().combo(combo); E.combo.classList.remove('hit'); void E.combo.offsetWidth; E.combo.classList.add('hit'); }
    E.bld.style.transform = 'scale(.94,1.04)'; setTimeout(function () { E.bld.style.transform = ''; }, 80);
    E.cr.textContent = nf(Math.floor(st.crates) + taps);
    if (!tapT) tapT = setTimeout(flush, 1200);
    draw();
  }
  function flush() {
    tapT = null; if (!taps) return;
    var n = Math.min(taps, 25); taps -= n;
    load('tap', { n: n }).then(function (r) {
      if (r && r.ok === false && r.error === 'fast') taps += n;
      if (taps && !tapT) tapT = setTimeout(flush, 1100);
      draw();
    });
  }
  function draw() {
    if (!scr || !st || !E.cr) return;
    var L = T(), p = Math.floor(pend()), full = now() >= st.full_at, boostOn = st.boost_until && st.boost_until > now(), crates = Math.floor(st.crates) + taps;
    E.cr.textContent = nf(crates);
    E.scene.classList.toggle('boost', !!boostOn);
    belt();
    if (Date.now() - lastTap > 1500 && E.combo.textContent) E.combo.textContent = '';
    // the golden crate: once the server allows it, at a random moment, it rides the belt for 7 seconds
    if (!goldOn && st.gold_left > 0) {
      if (!nextGold) nextGold = Date.now() + Math.max(st.gold_in * 1000, 8000 + Math.random() * 25000);
      if (Date.now() >= nextGold) spawnGold();
    }
    var tl = Math.max(0, tapLeft - taps);
    E.hint.textContent = tl > 0 ? L.tap(st.tap_day - tl, st.tap_day) : L.tapDone;
    E.pend.textContent = '+' + nf(p) + ' 📦';
    E.rate.textContent = nf(st.rate * (boostOn ? 2 : 1)) + L.perh + (boostOn ? ' ⚡' : '');
    E.bar.style.width = Math.min(100, Math.max(0, (now() - st.collect_at) / (st.full_at - st.collect_at) * 100)).toFixed(1) + '%';
    E.full.textContent = full ? L.full : L.fullIn(hm(st.full_at - now()));
    E.c.textContent = p >= 1 ? L.collect(nf(p)) : L.nothing; E.c.disabled = busy || p < 1; E.c.classList.toggle('full', full && p >= 1);
    E.b.textContent = boostOn ? L.boostOn(ms2(st.boost_until - now())) : st.boost_left > 0 ? L.boost(st.boost_left) : L.boostNone;
    E.b.disabled = busy || !!boostOn || st.boost_left <= 0; E.b.classList.toggle('on', !!boostOn);
    // the next goal: the cheapest upgrade left
    var g = [];
    if (st.lvl_cost != null) g.push({ w: L.mach + ' ' + L.lv + ' ' + (st.lvl + 1), c: st.lvl_cost });
    if (st.store_cost != null) g.push({ w: L.store + ' ' + L.lv + ' ' + (st.store + 1), c: st.store_cost });
    g.sort(function (a, b) { return a.c - b.c; });
    if (g.length) { var gg = g[0]; E.goal.textContent = crates >= gg.c ? L.goalOk(gg.w) : L.goalT(gg.w, nf(gg.c - crates)); E.goalbar.style.width = Math.min(100, crates / gg.c * 100).toFixed(1) + '%'; }
    else { E.goal.textContent = L.max; E.goalbar.style.width = '100%'; }
    E.ml.textContent = L.mach + ' · ' + L.lv + ' ' + st.lvl; E.ms.textContent = nf(st.rate) + L.perh + (st.lvl_cost != null ? ' → ' + nf(st.lvl_next_rate) + L.perh : '');
    E.l.textContent = st.lvl_cost != null ? nf(st.lvl_cost) + ' 📦' : L.max; E.l.disabled = busy || st.lvl_cost == null || crates < st.lvl_cost;
    E.sl.textContent = L.store + ' · ' + L.lv + ' ' + st.store; E.ss.textContent = L.cap(st.cap_h) + (st.store_cost != null ? ' → ' + L.cap(st.cap_h + 2) : '');
    E.s.textContent = st.store_cost != null ? nf(st.store_cost) + ' 📦' : L.max; E.s.disabled = busy || st.store_cost == null || crates < st.store_cost;
    var convLeft = Math.max(0, st.day_cap - st.conv_today), convN = Math.min(Math.floor(st.crates), Math.ceil(convLeft / st.conv));
    E.vs.textContent = L.convS(st.conv, nf(st.conv_today), nf(st.day_cap));
    E.v.textContent = L.convB(nf(convN), nf(Math.min(convN * st.conv, convLeft))); E.v.disabled = busy || convN < st.min_conv || convLeft <= 0;
    E.note.innerHTML = L.friends(st.friends) + '<br>' + L.tasks(st.task_crates);
  }
  function act(a, extra, okMsg) {
    if (busy) return; busy = true; hap(); draw();
    var run = function () {
      load(a, extra).then(function (r) {
        busy = false;
        if (!r) toast(T().err.net);
        else if (r.ok === false) { hap('error'); toast(T().err[r.error] || T().err.net); }
        else { hap('success'); toast(typeof okMsg === 'function' ? okMsg(r) : okMsg); }
        draw();
      });
    };
    // taps waiting to be sent go first, so the crates count is right
    if (taps) { clearTimeout(tapT); tapT = null; var n = Math.min(taps, 25); taps -= n; load('tap', { n: n }).then(run); } else run();
  }
  function boost() {
    var b = B(); if (busy || !b) return; busy = true; draw(); hap();
    b.api('vid', { mode: 'factory' }).then(function (v) {
      if (v && v.error === 'wait') { busy = false; draw(); toast('⏳ ' + Math.max(1, Math.ceil(((Number(v.next) || 0) - Date.now()) / 1000)) + ' s'); return; }
      return window.__showRw().then(function () {
        var n = 0, w = setInterval(function () {
          n++;
          load().then(function () {
            if (st && st.boost_until && st.boost_until > now()) { clearInterval(w); busy = false; hap('success'); confetti(); toast(T().ok.boost); draw(); }
            else if (n >= 10) { clearInterval(w); busy = false; draw(); }
          });
        }, 2000);
      }, function () { busy = false; draw(); toast(T().err.novid); });
    }).catch(function () { busy = false; draw(); });
  }
  function open() {
    hap(); if (scr) return;
    scr = document.createElement('div'); scr.id = 'facScr'; scr.setAttribute('role', 'dialog');
    scr.innerHTML = '<div class="w"><div class="hd"><h1>🏭 ' + T().t + '</h1></div><div style="text-align:center;padding:60px;font-size:40px">🏭</div></div>';
    document.body.appendChild(scr);
    load().then(function () { if (!scr) return; build(); draw(); });
    timer = setInterval(draw, 1000);
  }
  function close() { hap(); clearInterval(timer); if (taps) flush(); if (scr) { scr.remove(); scr = null; E = {}; beltKey = ''; } }
  // 31 oct 2026 (12h56, Jeremy): a "Factory" entry in the app, on the home screen (only where the server says facOn).
  // 16h20: made more visible: a golden card with the crates waiting to be collected. 16h28: toned down and moved under the baton cards (Pass The Baton stays first).
  // 16h33: prettier and more fun, same size: smoking factory, a tiny conveyor belt with crates, a fill bar, a "full" badge
  var cardT = 0;
  setInterval(function () {
    var b = B(); if (!b || !b.S) return;
    var c = document.getElementById('facBtn');
    if (!c) {
      var mine = document.getElementById('chainCard') || document.getElementById('batonCard'); if (!mine) return;
      var s = document.createElement('style');
      s.textContent = '#facBtn{position:relative;overflow:hidden;display:flex;align-items:center;gap:12px;width:100%;padding:12px 14px 18px;margin:0 0 14px;border-radius:18px;border:1.5px solid rgba(255,197,49,.4);background:linear-gradient(120deg,rgba(74,123,209,.22),rgba(255,197,49,.10) 60%,rgba(255,130,47,.14));color:inherit;text-align:left;cursor:pointer;transition:transform .12s}'
        + '#facBtn:active{transform:scale(.97)}'
        + '#facBtn .ic{position:relative;font-size:30px;line-height:1;flex:none;animation:fcBob 1.6s ease-in-out infinite}'
        + '#facBtn .ic i{position:absolute;left:4px;top:-4px;width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.55);animation:fcSmoke 2.2s linear infinite;font-style:normal}'
        + '#facBtn .ic i+i{left:12px;animation-delay:1.1s}'
        + '@keyframes fcBob{50%{transform:translateY(-2px) rotate(-3deg)}}'
        + '@keyframes fcSmoke{from{transform:translate(0,0) scale(.6);opacity:.8}to{transform:translate(6px,-22px) scale(1.6);opacity:0}}'
        + '#facBtn .tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}'
        + '#facBtn .tx b{font-size:15px;display:flex;align-items:center;gap:6px}#facBtn .tx small{font-size:12px;opacity:.85}'
        + '#facBtn .bar{height:5px;border-radius:9px;background:rgba(255,255,255,.12);overflow:hidden}#facBtn .bar u{display:block;height:100%;width:0;border-radius:9px;background:linear-gradient(90deg,#ffe27a,#ffc531,#f08a1c);transition:width .6s}'
        + '#facBtn .full{display:none;font-size:10px;font-weight:900;color:#2a1300;background:#ffc531;border-radius:99px;padding:1px 7px;animation:fcPulse 1s ease-in-out infinite}'
        + '#facBtn.isFull .full{display:inline-block}@keyframes fcPulse{50%{transform:scale(1.12)}}'
        + '#facBtn .go{flex:none;background:#ffc531;color:#2a1300;font-weight:900;font-size:13px;border-radius:12px;padding:7px 12px;box-shadow:0 3px 0 #b8741a}'
        + '#facBtn .belt{position:absolute;left:0;right:0;bottom:0;height:9px;background:repeating-linear-gradient(90deg,rgba(0,0,0,.35) 0 6px,rgba(255,255,255,.08) 6px 12px);background-size:24px 9px;animation:fcBelt .8s linear infinite}'
        + '@keyframes fcBelt{to{background-position:24px 0}}'
        + '#facBtn .cr{position:absolute;bottom:3px;font-size:11px;line-height:1;animation:fcRide 6s linear infinite}#facBtn .cr+.cr{animation-delay:-3s}'
        + '@keyframes fcRide{from{left:-16px}to{left:calc(100% + 16px)}}';
      document.head.appendChild(s);
      c = document.createElement('button'); c.id = 'facBtn'; c.type = 'button';
      c.innerHTML = '<span class="ic">🏭<i></i><i></i></span><span class="tx"><b>Baton Factory <span class="full"></span></b><small id="facBtnS"></small><span class="bar"><u></u></span></span><span class="go"></span>'
        + '<span class="belt"></span><span class="cr">📦</span><span class="cr">📦</span>';
      c.onclick = function () { hap(); open(); };
      mine.insertAdjacentElement('afterend', c);
    }
    c.hidden = !b.S.facOn;
    if (!b.S.facOn) return;
    var fr = b.lang === 'fr';
    c.querySelector('.go').textContent = fr ? 'Jouer ›' : 'Play ›';
    c.querySelector('.full').textContent = fr ? 'PLEINE !' : 'FULL!';
    if (!scr && Date.now() - cardT > 60000) { cardT = Date.now(); load(); }
    var p = Math.floor(pend()), sm = document.getElementById('facBtnS');
    var cap = st ? Number(st.rate) * Number(st.cap_h) : 0, full = !!st && now() >= Number(st.full_at);
    c.classList.toggle('isFull', full);
    c.querySelector('.bar u').style.width = (full ? 100 : cap > 0 ? Math.min(100, p / cap * 100) : 0) + '%';
    if (sm) sm.textContent = !st ? (fr ? 'Ton usine à caisses' : 'Your crate factory') : p >= 1 ? '📦 ' + nf(p) + (fr ? ' caisses à récolter' : ' crates to collect') : (fr ? '📦 Ton usine produit…' : '📦 Your factory is producing…');
  }, 1000);
  window.btFactory = open;
  // Baton Factory is its own mini app on the Pass The Baton bot: t.me/PassTheBatonBot/play?startapp=factory
  var tw = window.Telegram && Telegram.WebApp, sp = (tw && tw.initDataUnsafe && tw.initDataUnsafe.start_param) || '';
  if (sp === 'factory') {
    var go = setInterval(function () {
      var b = B(); if (!b || !b.S) return; clearInterval(go);
      if (b.S.facOn) open(); else toast(b.lang === 'fr' ? '🏭 Baton Factory arrive bientôt !' : '🏭 Baton Factory is coming soon!');
    }, 300);
  }
})();
