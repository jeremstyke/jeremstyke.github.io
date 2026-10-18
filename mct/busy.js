// 18 oct 2026 (Jeremy): when too many players arrive at once and the server is slow or down, a nice "busy" screen
// instead of a frozen game: "So many players right now, please wait". It shows when a call of the game takes more than
// 7 s or fails (502, 503, 504, network), and goes away by itself as soon as a call works again. While it is shown,
// the page is reloaded after 30 s if the game never managed to load, and the server is checked again every 10 s. Loaded in <head>, before the game, so every call is watched.
(() => {
  const TX = {
    en: { h: 'So many players right now!', s: 'The game is very busy at the moment. Please wait a few seconds, it continues by itself.', b: '🔄 Try again', w: 'Your money and your coins are safe.' },
    fr: { h: 'Trop de joueurs en même temps !', s: 'Le jeu est très demandé en ce moment. Patiente quelques secondes, ça repart tout seul.', b: '🔄 Réessayer', w: 'Ton argent et tes coins sont en sécurité.' },
    id: { h: 'Pemain sedang sangat banyak!', s: 'Game sedang sangat ramai. Tunggu beberapa detik, nanti lanjut sendiri.', b: '🔄 Coba lagi', w: 'Uang dan koinmu aman.' },
    ar: { h: 'عدد كبير جدًا من اللاعبين الآن!', s: 'اللعبة مزدحمة جدًا حاليًا. انتظر بضع ثوانٍ، وستستمر تلقائيًا.', b: '🔄 أعد المحاولة', w: 'أموالك وعملاتك في أمان.' },
  };
  const lg = () => {
    let l = ''; try { l = LANG; } catch (e) {}
    if (!l) { try { l = localStorage.getItem('mct_lang') || ''; } catch (e) {} }
    if (!l) { try { l = (window.Telegram.WebApp.initDataUnsafe.user || {}).language_code || ''; } catch (e) {} }
    l = String(l || navigator.language || 'en');
    return /^fr/.test(l) ? 'fr' : /^ar/.test(l) ? 'ar' : /^(id|ms)/.test(l) ? 'id' : 'en';
  };
  const watched = (u) => { const s = String((u && u.url) || u || ''); return s.indexOf('/mct/api') >= 0 || s.indexOf('/functions/v1/mct-ton') >= 0; };

  let ov = null, okOnce = false, failAt = 0, reloadT = null, lastProbe = 0;
  const pending = new Map(); let seq = 0;
  function show() {
    if (ov || document.getElementById('mtov')) return; // the maintenance screen has priority
    if (!document.body) return;
    const T = TX[lg()];
    if (!document.getElementById('busyst')) {
      const st = document.createElement('style'); st.id = 'busyst';
      st.textContent = '#busyov{position:fixed;inset:0;z-index:9998;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(120% 70% at 50% 0%,#4a1691 0%,#1a0638 65%);color:#f7f1ff;text-align:center;font-family:"Bricolage Grotesque",system-ui,sans-serif;animation:busyin .3s ease}'
        + '@keyframes busyin{from{opacity:0}to{opacity:1}}'
        + '#busyov .bx{max-width:340px}#busyov .em{font-size:64px;line-height:1;display:inline-block;animation:busyb 1.4s ease-in-out infinite}'
        + '@keyframes busyb{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-10px) rotate(6deg)}}'
        + '#busyov h2{margin:18px 0 8px;font-size:22px;line-height:1.2}#busyov p{margin:0 0 6px;opacity:.85;font-size:15px;line-height:1.45}'
        + '#busyov .dots{display:flex;gap:7px;justify-content:center;margin:18px 0}#busyov .dots i{width:9px;height:9px;border-radius:50%;background:#ffd43b;animation:busyd 1.2s infinite ease-in-out}'
        + '#busyov .dots i:nth-child(2){animation-delay:.15s}#busyov .dots i:nth-child(3){animation-delay:.3s}'
        + '@keyframes busyd{0%,80%,100%{opacity:.25;transform:scale(.8)}40%{opacity:1;transform:scale(1.1)}}'
        + '#busyov button{margin-top:10px;padding:12px 22px;border:0;border-radius:14px;background:#ffd43b;color:#1a0638;font:inherit;font-weight:800;cursor:pointer}'
        + '#busyov small{display:block;margin-top:14px;opacity:.6;font-size:12.5px}';
      document.head.appendChild(st);
    }
    ov = document.createElement('div'); ov.id = 'busyov'; ov.setAttribute('role', 'alert');
    ov.innerHTML = '<div class="bx"><span class="em">🚦</span><h2></h2><p></p><div class="dots"><i></i><i></i><i></i></div><button type="button"></button><small></small></div>';
    ov.querySelector('h2').textContent = T.h; ov.querySelector('p').textContent = T.s;
    ov.querySelector('button').textContent = T.b; ov.querySelector('small').textContent = T.w;
    ov.querySelector('button').onclick = () => { try { window.Telegram.WebApp.HapticFeedback.impactOccurred('light'); } catch (e) {} location.reload(); };
    document.body.appendChild(ov);
    // the game never loaded: try again by itself every 30 s
    if (!okOnce && !reloadT) reloadT = setTimeout(() => location.reload(), 30000);
  }
  function hide() {
    if (reloadT) { clearTimeout(reloadT); reloadT = null; }
    if (!ov) return; const o = ov; ov = null;
    o.style.transition = 'opacity .3s'; o.style.opacity = '0'; setTimeout(() => o.remove(), 320);
  }
  const of = window.fetch;
  window.fetch = function (u, o) {
    if (!watched(u)) return of.apply(this, arguments);
    const id = ++seq; pending.set(id, Date.now());
    return of.apply(this, arguments).then((r) => {
      pending.delete(id);
      if (r.status === 502 || r.status === 503 || r.status === 504) { failAt = Date.now(); show(); }
      else { if (r.ok) okOnce = true; failAt = 0; if (![...pending.values()].some((t) => Date.now() - t > 7000)) hide(); }
      return r;
    }, (e) => { pending.delete(id); if (navigator.onLine !== false) { failAt = Date.now(); show(); } throw e; });
  };
  // a call that takes more than 7 s shows the screen; it goes away when the calls answer again
  setInterval(() => {
    const slow = [...pending.values()].some((t) => Date.now() - t > 7000);
    if (slow) show(); else if (ov && !failAt && !pending.size) hide();
    // after a failure, a light check every 10 s: as soon as the server answers again, the screen goes away
    if (ov && failAt && !pending.size && Date.now() - lastProbe > 10000) {
      lastProbe = Date.now();
      window.fetch('/mct/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"action":"ping"}' }).catch(() => {});
    }
  }, 1000);
  window.mctBusy = { show, hide };
})();
