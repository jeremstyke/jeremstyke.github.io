// 16 oct 2026: Meme Coin Tycoon rewarded videos (Ads Galaxy, game id 135). Three places where the player really wants something:
// 1. the mining boost x2: a free video instead of 5 stars (6 a day, the stars stay possible);
// 2. the scoop: the next news (which coin, up or down) before everyone (2 a day), a card at the top of the market and the news;
// 3. the insurance: right after a losing sale, a video gives back 50 % of the loss (3 a day, within 10 minutes).
// The server checks every limit (Supabase function mct-ton: boost_ad, scoop, insure).
(() => {
  const AGX = 135;
  const TX = {
    en: {
      bT: 'Boost x2 for 1 hour', bX: 'Your mining earns double for 1 hour.', bAd: '📺 Watch a video (free)', bPay: '⭐ Pay 5 stars', bOk: '⚡ Boost x2 on!',
      bLim: 'You used your 6 free boosts today. Pay with stars or come back tomorrow.',
      noad: 'No video available right now, try again in a moment.', err: 'Something went wrong, try again.', no: 'No thanks', ok: 'OK',
      iT: '🛟 Insurance', iX: (l, b) => 'You lost ' + l + ' on this sale. Watch a video and get back ' + b + ' (50 %).', iAd: (b) => '📺 Get back ' + b,
      iOk: (r) => '🛟 ' + r + ' added to your cash!', iLim: 'You used your 3 insurances today.', iLate: 'Too late: the insurance lasts 10 minutes after the sale.',
      sT: '📰 Scoop', sX: 'See the next news before everyone', sB: '📺 Watch', sUp: (t) => '$' + t + ' will get good news soon 🚀', sDn: (t) => '$' + t + ' will get bad news soon 📉',
      sAllUp: 'The whole market will pump soon 🚀', sAllDn: 'The whole market will dip soon 📉', sNote: 'Nobody knows exactly when: in 30 minutes or tomorrow. Your move!',
      sGo: (t) => 'Open $' + t, sLim: 'You saw your 2 scoops today. Come back tomorrow!',
    },
    fr: {
      bT: 'Boost x2 pendant 1 heure', bX: 'Ton minage rapporte le double pendant 1 heure.', bAd: '📺 Regarder une vidéo (gratuit)', bPay: '⭐ Payer 5 étoiles', bOk: '⚡ Boost x2 activé !',
      bLim: 'Tu as utilisé tes 6 boosts gratuits du jour. Paie en étoiles ou reviens demain.',
      noad: 'Pas de vidéo disponible pour le moment, réessaie dans un instant.', err: 'Une erreur est survenue, réessaie.', no: 'Non merci', ok: 'OK',
      iT: '🛟 Assurance', iX: (l, b) => 'Tu as perdu ' + l + ' sur cette vente. Regarde une vidéo et récupère ' + b + ' (50 %).', iAd: (b) => '📺 Récupérer ' + b,
      iOk: (r) => '🛟 ' + r + ' ajoutés à ton cash !', iLim: 'Tu as utilisé tes 3 assurances du jour.', iLate: 'Trop tard : l\'assurance dure 10 minutes après la vente.',
      sT: '📰 Scoop', sX: 'Découvre la prochaine news avant tout le monde', sB: '📺 Voir', sUp: (t) => '$' + t + ' va bientôt avoir une bonne news 🚀', sDn: (t) => '$' + t + ' va bientôt avoir une mauvaise news 📉',
      sAllUp: 'Tout le marché va bientôt monter 🚀', sAllDn: 'Tout le marché va bientôt baisser 📉', sNote: 'Personne ne sait exactement quand : dans 30 minutes ou demain. À toi de jouer !',
      sGo: (t) => 'Voir $' + t, sLim: 'Tu as vu tes 2 scoops du jour. Reviens demain !',
    },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] || TX.en; };
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const mo = (n) => { try { return money(n); } catch (e) { return '$' + Number(n).toFixed(2); } };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // the Ads Galaxy SDK, loaded only when a video is asked for
  let ld = null;
  const sdk = () => ld || (ld = new Promise((ok, ko) => {
    if (window.showAdsGalaxy) return ok();
    const s = document.createElement('script'); s.src = 'https://app.adsgalaxy.online/sdk.js?id=' + AGX;
    s.onload = ok; s.onerror = () => { ld = null; ko(new Error('load')); }; document.head.appendChild(s);
  }));
  async function watch() {
    try { await sdk(); const r = await window.showAdsGalaxy({ miniappId: AGX }); return !!(r && r.reward_eligible); } catch (e) { return false; }
  }

  // a small sheet from the bottom of the screen
  function close() { const d = document.getElementById('adm'); if (d) d.remove(); }
  function modal(html) {
    close();
    const d = document.createElement('div'); d.id = 'adm';
    d.style.cssText = 'position:fixed;inset:0;z-index:60;background:rgba(5,3,15,.72);display:flex;align-items:flex-end;justify-content:center';
    d.innerHTML = `<div style="width:100%;max-width:520px;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:22px 18px calc(24px + env(safe-area-inset-bottom));text-align:center">${html}</div>`;
    d.onclick = (e) => { if (e.target === d) close(); };
    document.body.appendChild(d); return d;
  }
  const head = (e, t, x) => `<div style="font-size:46px;line-height:1">${e}</div><h2 style="margin:8px 0 6px">${ec(String(t).replace(/^\S+ /, ''))}</h2><p class="hint" style="margin:0 0 16px">${ec(x)}</p>`;
  const busy = (b) => { b.disabled = true; b.textContent = '⏳'; };

  // 1. the boost x2: the paid button (5 stars) first offers a free video
  document.addEventListener('click', (e) => {
    const b = e.target && e.target.closest && e.target.closest('#boost');
    if (!b || b.disabled || !/⭐/.test(b.textContent || '')) return;
    e.stopImmediatePropagation(); e.preventDefault(); hp();
    const T = L();
    const d = modal(head('⚡', T.bT, T.bX) + `<button class="btn" id="adw">${ec(T.bAd)}</button><button class="ghost" id="adp" style="width:100%;margin-top:10px">${ec(T.bPay)}</button>`);
    d.querySelector('#adp').onclick = () => { close(); if (typeof b.onclick === 'function') b.onclick.call(b); };
    d.querySelector('#adw').onclick = async (ev) => {
      busy(ev.currentTarget);
      if (!(await watch())) { close(); return tst(T.noad); }
      let r = null; try { r = await tonCall({ action: 'boost_ad', ad: 'done' }); } catch (x) {}
      close();
      if (!r || !r.ok) { hp('err'); return tst(r && r.error === 'limit' ? T.bLim : T.err); }
      hp('ok'); tst(T.bOk); try { if (VIEW === 'mine') mine(); } catch (x) {}
    };
  }, true);

  // 3. the insurance: the server marks a real loss (loss_id) in the answer to a sale
  const of = window.fetch;
  window.fetch = async function (u, o) {
    const r = await of.apply(this, arguments);
    try {
      if (String(u).indexOf('/mct/api') >= 0 && o && typeof o.body === 'string' && o.body.indexOf('"action":"sell"') >= 0) {
        r.clone().json().then((j) => { if (j && j.ok && j.loss_id) setTimeout(() => insure(j.loss_id, -Number(j.pnl)), 3200); }).catch(() => {});
      }
    } catch (e) {}
    return r;
  };
  function insure(id, loss) {
    const T = L(), back = Math.round(loss * 50) / 100;
    const d = modal(head('🛟', T.iT, T.iX(mo(loss), mo(back))) + `<button class="btn" id="adw">${ec(T.iAd(mo(back)))}</button><button class="ghost" id="adn" style="width:100%;margin-top:10px">${ec(T.no)}</button>`);
    hp();
    d.querySelector('#adn').onclick = () => close();
    d.querySelector('#adw').onclick = async (ev) => {
      busy(ev.currentTarget);
      if (!(await watch())) { close(); return tst(T.noad); }
      let r = null; try { r = await tonCall({ action: 'insure', id }); } catch (x) {}
      close();
      if (!r || !r.ok) { hp('err'); return tst(r && r.error === 'limit' ? T.iLim : r && r.error === 'late' ? T.iLate : T.err); }
      hp('ok'); tst(T.iOk(mo(r.refund)));
      try { if (r.cash != null) document.getElementById('cash').textContent = money(r.cash); } catch (x) {}
    };
  }

  // 2. the scoop: a card at the top of the market and of the news
  function card() {
    let v = ''; try { v = VIEW; } catch (e) {}
    if (v !== 'market' && v !== 'news') return;
    const view = document.getElementById('view'); if (!view || document.getElementById('scoopc')) return;
    const h1 = view.querySelector('h1'); if (!h1) return;
    const T = L(), el = document.createElement('div');
    el.className = 'msn'; el.id = 'scoopc';
    el.style.cssText = 'border-color:#ff9f43;display:flex;align-items:center;gap:10px;padding:12px 14px';
    el.innerHTML = `<div style="flex:1;min-width:0"><b style="font-size:16px">${ec(T.sT)}</b><br><small style="color:var(--mute);font-size:12px">${ec(T.sX)}</small></div><button class="msn-b go" id="scb">${ec(T.sB)}</button>`;
    h1.parentNode.insertBefore(el, h1.nextSibling);
    el.querySelector('#scb').onclick = scoop;
  }
  async function scoop(ev) {
    const T = L(), b = ev.currentTarget; hp(); busy(b);
    const back = () => { b.disabled = false; b.textContent = T.sB; };
    if (!(await watch())) { back(); return tst(T.noad); }
    let r = null; try { r = await tonCall({ action: 'scoop' }); } catch (x) {}
    back();
    if (!r || !r.ok) { hp('err'); return tst(r && r.error === 'limit' ? T.sLim : T.err); }
    hp('ok');
    const msg = r.all ? (r.up ? T.sAllUp : T.sAllDn) : (r.up ? T.sUp(r.ticker) : T.sDn(r.ticker));
    const d = modal(head(r.all ? '🌍' : (r.emoji || '📰'), T.sT, msg) + `<p class="hint" style="margin:-6px 0 16px;font-size:12px">${ec(T.sNote)}</p>`
      + (r.all ? `<button class="btn" id="sok">${ec(T.ok)}</button>` : `<button class="btn" id="sgo">${ec(T.sGo(r.ticker))}</button><button class="ghost" id="sok" style="width:100%;margin-top:10px">${ec(T.ok)}</button>`));
    d.querySelector('#sok').onclick = () => close();
    const g = d.querySelector('#sgo'); if (g) g.onclick = () => { close(); try { openCoin(r.coin); } catch (x) {} };
  }
  let q = 0;
  new MutationObserver(() => { if (!q) q = requestAnimationFrame(() => { q = 0; card(); }); }).observe(document.body, { childList: true, subtree: true });
  card();
})();
