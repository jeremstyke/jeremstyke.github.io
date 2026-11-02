// 2 nov 2026 (10h23, Jeremy): "The Last Click" of Meme Coin Tycoon, played like on Pass The Baton: the pinned post of the channel
// @memecointycoon opens the mini app with startapp=lc, this screen shows the pot and the timer, and each click comes after an
// Adsgram interstitial (none for Premium players). Game cash only. Server: edge function mct-lc (mct_lc_state, mct_lc_click).
(function () {
  var tw = window.Telegram && Telegram.WebApp;
  var sp = (tw && tw.initDataUnsafe && tw.initDataUnsafe.start_param) || '';
  if (sp !== 'lc') return;
  var FN = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-lc';
  var TX = {
    fr: { t: 'Le Dernier Clic', pot: 'Cagnotte', left: 'Temps restant', wait: 'En attente du premier clic', last: 'Dernier clic', nobody: 'personne', you: 'toi', mine: function (a, b) { return 'Tes clics : ' + a + '/' + b; }, btn: '⚡ Cliquer', btnWait: '⏳ …', rules: function (s) { return 'Chaque clic ajoute ' + s.add + ' $ à la cagnotte et remet le chrono à ' + Math.round(s.dur / 60) + ':00. Quand il tombe à zéro, le dernier qui a cliqué gagne toute la cagnotte (argent du jeu)' + (s.baton ? ' + ' + s.baton + ' $BATON sur Pass The Baton' : '') + '. Un clic toutes les ' + s.gap + ' s, au moins ' + s.min + ' joueurs, sinon la cagnotte passe à la partie suivante.'; }, ok: '⚡ C\'est toi le dernier ! Garde un œil sur le chrono.', over: 'Partie terminée', won: function (n, p) { return '🏆 ' + n + ' a gagné ' + p + ' $'; }, youWon: '🏆 C\'est toi ! Le cash est dans ton portefeuille.', roll: function (p) { return '🤷 Pas de gagnant (il faut au moins 2 joueurs) : les ' + p + ' $ passent à la partie suivante !'; }, next: 'Nouvelle partie dans', close: '🎮 Jouer à Meme Coin Tycoon', join: '📢 S\'abonner à Tycoon News' },
    en: { t: 'The Last Click', pot: 'Pot', left: 'Time left', wait: 'Waiting for the first click', last: 'Last click', nobody: 'nobody yet', you: 'you', mine: function (a, b) { return 'Your clicks: ' + a + '/' + b; }, btn: '⚡ Click', btnWait: '⏳ …', rules: function (s) { return 'Each click adds $' + s.add + ' to the pot and resets the timer to ' + Math.round(s.dur / 60) + ':00. When it reaches zero, the last one to click wins the whole pot (game cash)' + (s.baton ? ' + ' + s.baton + ' $BATON on Pass The Baton' : '') + '. One click every ' + s.gap + ' s, at least ' + s.min + ' players, otherwise the pot rolls over to the next round.'; }, ok: '⚡ You are the last one! Keep an eye on the timer.', over: 'Round over', won: function (n, p) { return '🏆 ' + n + ' won $' + p; }, youWon: '🏆 It\'s you! The cash is in your wallet.', roll: function (p) { return '🤷 No winner (at least 2 players needed): the $' + p + ' roll over to the next round!'; }, next: 'New round in', close: '🎮 Play Meme Coin Tycoon', join: '📢 Subscribe to Tycoon News' },
    id: { t: 'Klik Terakhir', pot: 'Hadiah', left: 'Sisa waktu', wait: 'Menunggu klik pertama', last: 'Klik terakhir', nobody: 'belum ada', you: 'kamu', mine: function (a, b) { return 'Klikmu: ' + a + '/' + b; }, btn: '⚡ Klik', btnWait: '⏳ …', rules: function (s) { return 'Setiap klik menambah $' + s.add + ' ke hadiah dan mengulang waktu ke ' + Math.round(s.dur / 60) + ':00. Saat waktu habis, yang terakhir klik memenangkan semua hadiah (uang game)' + (s.baton ? ' + ' + s.baton + ' $BATON di Pass The Baton' : '') + '. Satu klik setiap ' + s.gap + ' detik, minimal ' + s.min + ' pemain.'; }, ok: '⚡ Kamu yang terakhir! Awasi waktunya.', over: 'Ronde selesai', won: function (n, p) { return '🏆 ' + n + ' menang $' + p; }, youWon: '🏆 Kamu menang! Uangnya ada di dompetmu.', roll: function (p) { return '🤷 Tidak ada pemenang: $' + p + ' pindah ke ronde berikutnya!'; }, next: 'Ronde baru dalam', close: '🎮 Main Meme Coin Tycoon', join: '📢 Ikuti Tycoon News' }
  };
  var lang = function () { try { if (typeof LANG === 'string' && TX[LANG]) return LANG; } catch (e) {} var l = String((tw && tw.initDataUnsafe && tw.initDataUnsafe.user && tw.initDataUnsafe.user.language_code) || '').slice(0, 2); return TX[l] ? l : 'en'; };
  var L = function () { return TX[lang()]; };
  var fmt = function (n) { return Math.round(Number(n) || 0).toLocaleString(lang() === 'fr' ? 'fr-FR' : 'en-US'); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var hap = function (k) { try { var h = tw.HapticFeedback; if (k) h.notificationOccurred(k); else h.impactOccurred('medium'); } catch (e) {} };
  var toastEl = null;
  var toast = function (m) { try { if (!toastEl) { toastEl = document.createElement('div'); toastEl.style.cssText = 'position:fixed;left:16px;right:16px;bottom:calc(24px + env(safe-area-inset-bottom,0px));z-index:9600;padding:12px 14px;border-radius:14px;background:#1b1530;color:#fff;border:1px solid #7c5cff;font:600 14px/1.35 system-ui,sans-serif;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.45)'; document.body.appendChild(toastEl); } toastEl.textContent = m; toastEl.hidden = false; clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.hidden = true; }, 3500); } catch (e) {} };
  var call = function (action) { return fetch(FN, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: (tw && tw.initData) || '', action: action }) }).then(function (r) { return r.json(); }); };
  var css = document.createElement('style');
  css.textContent = '#mlcScr{position:fixed;inset:0;z-index:9500;background:radial-gradient(120% 70% at 50% 0%,#123a2a 0%,#08140f 60%);color:#effff6;display:flex;flex-direction:column;align-items:center;gap:18px;padding:calc(22px + env(safe-area-inset-top,0px)) max(18px,env(safe-area-inset-right,0px)) calc(24px + env(safe-area-inset-bottom,0px)) max(18px,env(safe-area-inset-left,0px));box-sizing:border-box;overflow-y:auto;text-align:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}'
    + '#mlcScr h1{margin:6px 0 0;font-size:28px;font-weight:900;letter-spacing:.5px}#mlcScr .lb{font-size:13px;opacity:.75;text-transform:uppercase;letter-spacing:1px}'
    + '#mlcScr .pot{font-size:44px;font-weight:900;color:#3ee6a0;font-variant-numeric:tabular-nums;line-height:1}#mlcScr .clk{font-size:64px;font-weight:900;font-variant-numeric:tabular-nums;line-height:1}#mlcScr .clk.hot{color:#ff5a5f}'
    + '#mlcScr .card{width:100%;max-width:420px;display:flex;flex-direction:column;gap:6px;padding:14px;border-radius:18px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);box-sizing:border-box}'
    + '#mlcBtn{width:100%;max-width:420px;min-height:64px;border:0;border-radius:20px;background:linear-gradient(180deg,#5cf2b4,#1fbf7a);color:#03251a;font-size:20px;font-weight:900;box-shadow:0 10px 30px rgba(31,191,122,.35)}#mlcBtn:disabled{opacity:.55}'
    + '#mlcScr .rules{max-width:420px;font-size:13px;line-height:1.5;opacity:.8;margin:0}#mlcScr .lnk{background:none;border:0;color:#3ee6a0;font-weight:700;font-size:15px;min-height:44px}';
  document.head.appendChild(css);
  var st = null, skew = 0, busy = false, scr = null, need = false;
  function el() { if (scr) return scr; scr = document.createElement('div'); scr.id = 'mlcScr'; scr.setAttribute('role', 'dialog'); scr.setAttribute('aria-label', L().t); document.body.appendChild(scr); return scr; }
  function mmss(ms) { var s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function draw() {
    var T = L(), s = el(); if (!st) { s.innerHTML = '<h1>⚡ ' + esc(T.t) + '</h1><div class="lb">…</div>'; return; }
    var now = Date.now() + skew;
    if (!st.live) {
      s.innerHTML = '<h1>⚡ ' + esc(T.t) + '</h1><div class="lb">' + esc(T.over) + '</div>'
        + '<div class="card"><b style="font-size:18px">' + esc(st.rollover ? T.roll(fmt(st.won)) : st.me_won ? T.youWon : T.won(st.winner || '?', fmt(st.won))) + '</b></div>'
        + '<div class="lb">' + esc(T.next) + '</div><div class="clk">' + mmss((st.next || now) - now) + '</div>'
        + '<button class="lnk" id="mlcGame">' + esc(T.close) + '</button>';
    } else {
      var left = st.ends ? st.ends - now : null, hot = left != null && left < 60000, full = st.mine >= st.max;
      s.innerHTML = '<h1>⚡ ' + esc(T.t) + '</h1>'
        + '<div><div class="lb">' + esc(T.pot) + '</div><div class="pot">$' + fmt(st.pot) + '</div></div>'
        + '<div><div class="lb">' + esc(st.ends ? T.left : T.wait) + '</div><div class="clk' + (hot ? ' hot' : '') + '">' + (st.ends ? mmss(left) : mmss((st.dur || 600) * 1000)) + '</div></div>'
        + '<div class="card"><span>' + esc(T.last) + ' : <b>' + esc(st.last_me ? T.you : (st.last || T.nobody)) + '</b></span><small style="opacity:.75">' + esc(T.mine(st.mine, st.max)) + '</small></div>'
        + (need ? '<button class="lnk" id="mlcJoin">' + esc(T.join) + '</button>' : '')
        + '<button id="mlcBtn" type="button"' + (busy || full ? ' disabled' : '') + '>' + esc(busy ? T.btnWait : T.btn) + '</button>'
        + '<p class="rules">' + esc(T.rules(st)) + '</p>'
        + '<button class="lnk" id="mlcGame">' + esc(T.close) + '</button>';
      var b = document.getElementById('mlcBtn'); if (b) b.onclick = click;
      var j = document.getElementById('mlcJoin'); if (j) j.onclick = function () { try { tw.openTelegramLink('https://t.me/memecointycoon'); } catch (e) {} };
    }
    var g = document.getElementById('mlcGame'); if (g) g.onclick = function () { hap(); if (scr) { scr.remove(); scr = null; } clearInterval(window.__mlcT); clearInterval(window.__mlcD); };
  }
  function load() { return call('state').then(function (r) { if (r && r.ok) { st = r; if (r.now) skew = r.now - Date.now(); draw(); } return r; }).catch(function () {}); }
  function click() {
    if (busy || !st || !st.live) return;
    busy = true; draw(); hap();
    var go = function () {
      call('click').then(function (r) {
        busy = false; if (r && r.state && r.state.ok) st = r.state;
        if (r && r.ok) { need = false; hap('success'); toast(L().ok); }
        else { if (r && r.error === 'join') need = true; hap('error'); toast((r && r.msg) || '…'); }
        draw();
      }).catch(function () { busy = false; draw(); });
    };
    if (window.MCTPREM) return go();  // Premium: no ad
    var show = function () { try { window.Adsgram.init({ blockId: 'int-55508' }).show().then(go, go); } catch (e) { go(); } };
    if (window.Adsgram) show();
    else { var s = document.createElement('script'); s.src = 'https://sad.adsgram.ai/js/sad.min.js'; s.onload = show; s.onerror = go; document.head.appendChild(s); }
  }
  function start() {
    if (!document.body) { setTimeout(start, 100); return; }
    draw(); load();
    window.__mlcT = setInterval(function () { if (!busy) load(); }, 3000);
    window.__mlcD = setInterval(draw, 1000);
  }
  start();
})();
