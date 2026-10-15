// 14 oct 2026: Meme Coin Tycoon, mining boost x2: a small window with two choices, pay 5 stars (the usual payment) or watch a
// rewarded ad (Adsgram block 53969). After the ad, the Supabase function mct-ton (action 'boost_ad') turns the boost on, with the
// same rules as the paid boost (1 hour, once a day). If no ad can be shown, the boost is given anyway.
(() => {
  const BLOCK = '53969';
  const F = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-ton';
  const TX = {
    en: { lb: '⚡ Boost x2', h: '⚡ Boost x2 for 1 hour', s: 'Double your mining for 1 hour. One boost a day.', pay: 'Pay 5 ⭐', ad: '📺 Watch an ad (free)', cancel: 'Cancel', short: 'Watch the ad to the end to get your boost.', err: 'Something went wrong, try again.' },
    fr: { lb: '⚡ Boost x2', h: '⚡ Boost x2 pendant 1 heure', s: 'Double ton minage pendant 1 heure. Un boost par jour.', pay: 'Payer 5 ⭐', ad: '📺 Regarder une pub (gratuit)', cancel: 'Annuler', short: 'Regarde la pub jusqu\'au bout pour avoir ton boost.', err: 'Une erreur est survenue, réessaie.' },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] || TX.en; };
  const hap = (k) => { try { haptic(k); } catch (e) {} };
  const say = (m) => { try { toast(m); } catch (e) {} };
  let pass = false, busy = false;
  if (!document.querySelector('script[src*="sad.adsgram.ai"]')) { const s = document.createElement('script'); s.src = 'https://sad.adsgram.ai/js/sad.min.js'; s.async = true; document.head.appendChild(s); }
  const css = document.createElement('style');
  css.textContent = '#bstw{position:fixed;inset:0;z-index:30;background:rgba(10,2,25,.6);display:flex;align-items:flex-end;justify-content:center}'
    + '#bstw .in{width:100%;max-width:560px;background:#2b0a57;border-radius:22px 22px 0 0;padding:20px 18px calc(22px + env(safe-area-inset-bottom));border-top:1px solid rgba(255,255,255,.12)}'
    + '#bstw h3{margin:0 0 4px;font-size:20px}#bstw p{margin:0 0 16px;color:#b4a3d8;font-size:14px}#bstw .ghost{display:block;width:100%;margin-top:10px;text-align:center}';
  document.head.appendChild(css);
  async function grant(ad) {
    let r = null;
    try { r = await fetch(F, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ app: 'mct', initData: tw.initData, action: 'boost_ad', ad }) }).then((x) => x.json()); } catch (e) {}
    if (r && r.ok) { hap('ok'); let ok = '⚡'; try { ok = t('boost_ok'); } catch (e) {} say(ok); try { if (VIEW === 'mine') mine(); } catch (e) {} return; }
    let m = L().err; try { if (r && r.error) m = errMsg(r); } catch (e) {} say(m);
  }
  function watch() {
    if (busy) return; busy = true;
    let ctl = null; try { ctl = window.Adsgram && window.Adsgram.init({ blockId: BLOCK }); } catch (e) {}
    if (!ctl) { busy = false; grant('none'); return; } // no ad possible: the boost is given anyway
    ctl.show().then((res) => { busy = false; if (res && res.done === false) { say(L().short); return; } grant('done'); })
      .catch((res) => { busy = false; if (res && res.done === false && res.error === false) { say(L().short); return; } grant('none'); });
  }
  function open(btn) {
    const T = L(), w = document.createElement('div'); w.id = 'bstw';
    w.innerHTML = `<div class="in"><h3>${T.h}</h3><p>${T.s}</p><button class="btn" id="bstad">${T.ad}</button><button class="ghost" id="bstpay">${T.pay}</button><button class="ghost" id="bstno" style="background:none;border:none;color:#b4a3d8">${T.cancel}</button></div>`;
    document.body.appendChild(w);
    const close = () => w.remove();
    w.onclick = (e) => { if (e.target === w) close(); };
    w.querySelector('#bstno').onclick = close;
    w.querySelector('#bstad').onclick = () => { hap(); close(); watch(); };
    w.querySelector('#bstpay').onclick = () => { hap(); close(); pass = true; btn.click(); }; // the usual 5-star payment of the game
  }
  // the game's boost button: it shows just "Boost x2" (not the price in stars, players thought it was stars only)
  // and opens the window with the two choices (Supporters keep their free boost as before)
  function relabel() {
    const b = document.getElementById('boost');
    if (b && !b.disabled && !/💎/.test(b.textContent || '') && b.textContent !== L().lb) { b.dataset.ad = '1'; b.textContent = L().lb; }
    else if (b && b.disabled && b.dataset.ad) delete b.dataset.ad;
  }
  new MutationObserver(relabel).observe(document.body, { childList: true, subtree: true, characterData: true });
  relabel();
  document.addEventListener('click', (e) => {
    const b = e.target && e.target.closest ? e.target.closest('#boost') : null;
    if (!b || b.disabled) return;
    if (pass) { pass = false; return; }
    if (/💎/.test(b.textContent || '')) return; // Supporter: his free boost, as before
    let tg = ''; try { tg = tw.initData; } catch (er) {}
    if (!tg) return;
    e.preventDefault(); e.stopImmediatePropagation(); e.stopPropagation();
    hap(); open(b);
  }, true);
})();

// 14 oct 2026: selling a coin, profit or loss compared to what the coins cost. In the sell panel: what the player paid for his coins,
// what they are worth now, and the difference. After a sale: the profit or loss of that sale (the server sends cost and pnl).
(() => {
  const PX = {
    en: { paid: 'You paid', now: 'worth now', p: 'Profit', l: 'Loss', sale: (w, m, pc) => '📊 ' + w + ' on this sale: ' + m + ' (' + pc + ')' },
    fr: { paid: 'Tu as payé', now: 'valeur actuelle', p: 'Bénéfice', l: 'Perte', sale: (w, m, pc) => '📊 ' + w + ' sur cette vente : ' + m + ' (' + pc + ')' },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return PX[l] || PX.en; };
  const mo = (n) => { try { return money(n); } catch (e) { return '$' + Number(n).toFixed(2); } };
  const sm = (n) => (n >= 0 ? '+' : '') + mo(n);
  const pc = (a, b) => (a >= 0 ? '+' : '') + (a / b * 100).toFixed(1) + '%';
  function sellInfo() {
    const es = document.getElementById('es'), box0 = document.getElementById('plbox');
    if (!es || !document.getElementById('dosell')) { if (box0) box0.remove(); return; }
    let h = null; try { h = COIN && COIN.hold; } catch (e) {}
    if (!h || !(Number(h.cost) > 0)) { if (box0) box0.remove(); return; }
    const T = L(), cb = Number(h.cost), v = Number(h.value), d = v - cb;
    const html = T.paid + ' <b>' + mo(cb) + '</b> · ' + T.now + ' <b>' + mo(v) + '</b><br><b class="' + (d >= 0 ? 'up' : 'down') + '">' + (d >= 0 ? T.p : T.l) + ' ' + sm(d) + ' (' + pc(d, cb) + ')</b>';
    let box = box0;
    if (!box) { box = document.createElement('div'); box.id = 'plbox'; box.className = 'est num'; box.style.marginTop = '4px'; es.parentNode.insertBefore(box, es.nextSibling); }
    if (box.innerHTML !== html) box.innerHTML = html;
  }
  let q = 0; new MutationObserver(() => { if (!q) q = requestAnimationFrame(() => { q = 0; sellInfo(); }); }).observe(document.body, { childList: true, subtree: true });
  const of = window.fetch;
  window.fetch = async function (u, o) {
    const r = await of.apply(this, arguments);
    try {
      if (String(u).indexOf('/mct/api') >= 0 && o && typeof o.body === 'string' && o.body.indexOf('"action":"sell"') >= 0) {
        r.clone().json().then((j) => {
          if (!j || !j.ok || !(Number(j.cost) > 0)) return;
          const T = L(), d = Number(j.pnl);
          setTimeout(() => { try { toast(T.sale(d >= 0 ? T.p : T.l, sm(d), pc(d, Number(j.cost)))); } catch (e) {} }, 2700);
        }).catch(() => {});
      }
    } catch (e) {}
    return r;
  };
})();

// 14 oct 2026: portfolio, what the player paid for each coin under its line; coin page, the "News effect" badge opens the news post on @memecointycoon
(() => {
  const PX = { en: { paid: 'paid' }, fr: { paid: 'payé' } };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return PX[l] || PX.en; };
  const mo = (n) => { try { return money(n); } catch (e) { return '$' + Number(n).toFixed(2); } };
  const COST = {}; // coin id -> what the player paid for the coins he still holds
  const of = window.fetch;
  window.fetch = async function (u, o) {
    const r = await of.apply(this, arguments);
    try {
      if (String(u).indexOf('/mct/api') >= 0 && o && typeof o.body === 'string' && o.body.indexOf('"action":"portfolio"') >= 0) {
        r.clone().json().then((j) => { (j && j.holdings || []).forEach((h) => { COST[h.id] = Number(h.cost) || 0; }); paint(); }).catch(() => {});
      }
    } catch (e) {}
    return r;
  };
  function paint() {
    let v = ''; try { v = VIEW; } catch (e) {}
    if (v === 'portfolio') document.querySelectorAll('button.row[data-c]').forEach((b) => {
      const c = COST[b.dataset.c], s = b.querySelector('.who small'); if (!s || !(c > 0) || s.dataset.paid) return;
      s.dataset.paid = '1'; s.textContent += ' · ' + L().paid + ' ' + mo(c);
    });
    const bd = document.querySelector('#sheet .badges');
    if (bd && /📰/.test(bd.textContent || '') && !bd.dataset.nl) {
      bd.dataset.nl = '1'; bd.style.cursor = 'pointer'; bd.style.textDecoration = 'underline';
      bd.onclick = async () => {
        try { haptic(); } catch (e) {}
        let id = 0; try { id = COIN && COIN.coin && COIN.coin.id; } catch (e) {}
        // the news behind the effect: its post on the channel, or (news not posted, 4 posts a day at most) its text right here
        let j = null; try { j = await of('https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-ton', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'news_link', coin: id }) }).then((x) => x.json()); } catch (e) {}
        const go = (u) => { try { tw.openTelegramLink(u); } catch (e) { window.open(u, '_blank'); } };
        if (j && j.url) { go(j.url); return; }
        if (j && j.title) {
          let fr = false; try { fr = LANG === 'fr'; } catch (e) {}
          const ti = String((fr && j.title_fr) || j.title), pc = Number(j.pct), msg = ti + (pc ? ' (' + (pc > 0 ? '+' : '') + pc + ' %)' : '');
          try { tw.showPopup({ title: fr ? '📰 Actu' : '📰 News', message: msg.slice(0, 250), buttons: [{ id: 'ch', type: 'default', text: '@memecointycoon' }, { type: 'close' }] }, (b) => { if (b === 'ch') go('https://t.me/memecointycoon'); }); } catch (e) { try { toast(msg); } catch (er) {} }
          return;
        }
        go('https://t.me/memecointycoon');
      };
    }
  }
  let q = 0; new MutationObserver(() => { if (!q) q = requestAnimationFrame(() => { q = 0; paint(); }); }).observe(document.body, { childList: true, subtree: true });
})();

// 14 oct 2026: vault (staking), the vault only takes whole coins: a clear message when the player holds less than 1 coin
(() => {
  const PX = { en: (q, tk) => '🔒 The vault needs at least 1 whole $' + tk + ' (you have ' + q + ').', fr: (q, tk) => '🔒 Le coffre demande au moins 1 $' + tk + ' entier (tu en as ' + q + ').' };
  const of = window.fetch;
  window.fetch = async function (u, o) {
    const r = await of.apply(this, arguments);
    try {
      if (String(u).indexOf('/mct/api') >= 0 && o && typeof o.body === 'string' && o.body.indexOf('"action":"stake"') >= 0) {
        r.clone().json().then((j) => {
          if (!j || j.ok || j.error !== 'amount') return;
          let h = null, tk = ''; try { h = COIN && COIN.hold; tk = COIN.coin.ticker; } catch (e) {}
          if (!h || Number(h.qty) >= 1) return;
          let l = 'en'; try { l = LANG; } catch (e) {}
          const q = (Math.floor(Number(h.qty) * 100) / 100).toString().replace('.', l === 'fr' ? ',' : '.');
          setTimeout(() => { try { toast((PX[l] || PX.en)(q, tk)); } catch (e) {} }, 60);
        }).catch(() => {});
      }
    } catch (e) {}
    return r;
  };
})();

// 14 oct 2026: mining, one "Upgrade the rig" button instead of CPU / GPU / cooling. The server upgrades the cheapest part each time
// (mct_rig), so nothing changes for the players' current levels. Daily bonus: the +$100 for the channel subscribers, said clearly.
(() => {
  const PX = {
    en: { rig: 'Rig', lv: 'Level', up: 'Upgrade the rig', pw: 'mining power', run: 'runs', h: 'h', max: 'Max level reached', bd: (r) => '🎁 Daily bonus: +' + r, bs: (s) => '📰 Channel subscriber: +' + s, bn: '📰 Join @memecointycoon: +$100 every day' },
    fr: { rig: 'Rig', lv: 'Niveau', up: 'Améliorer le rig', pw: 'puissance', run: 'autonomie', h: 'h', max: 'Niveau maximum atteint', bd: (r) => '🎁 Bonus du jour : +' + r, bs: (s) => '📰 Abonné à la chaîne : +' + s, bn: '📰 Abonne-toi à @memecointycoon : +100 $ chaque jour' },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return PX[l] || PX.en; };
  const mo = (n) => { try { return money(n); } catch (e) { return '$' + Number(n).toFixed(2); } };
  function rig() {
    let v = '', m = null; try { v = VIEW; m = MINE; } catch (e) {}
    if (v !== 'mine' || !m) return;
    const rows = [...document.querySelectorAll('#view .up2')].filter((r) => !r.id);
    if (!rows.length && document.getElementById('rig1')) return;
    rows.forEach((r) => { r.style.display = 'none'; });
    const T = L(), lv = (m.cpu || 0) + (m.gpu || 0) + (m.cool || 0);
    const opts = [['cpu', m.cpu_cost], ['gpu', m.gpu_cost], ['cool', m.cool_cost]].filter((o) => o[1] != null).sort((a, b) => a[1] - b[1]);
    const nx = opts[0];
    let per = ''; try { per = t('per_h'); } catch (e) { per = '/h'; }
    const next = !nx ? T.max : nx[0] === 'cool' ? '🧊 ' + T.run + ' ' + m.caph + ' ' + T.h + ' → ' + m.cool_next + ' ' + T.h : '⚡ ' + T.pw + ' ' + mo(m.hash) + per + ' → ' + mo(nx[0] === 'cpu' ? m.cpu_next : m.gpu_next) + per;
    const html = `<span class="med sm" style="--c:#ffd43b">${m.tier_e || '⛏️'}</span><div class="who"><b>${T.rig} · ${T.lv} ${lv}/30</b><small>${next}</small></div>${nx ? `<button class="ghost num" id="rigup">⬆️ ${mo(nx[1])}</button>` : ''}`;
    let box = document.getElementById('rig1');
    if (!box) { box = document.createElement('div'); box.id = 'rig1'; box.className = 'up2'; const ref = rows[0]; if (!ref) return; ref.parentNode.insertBefore(box, ref); }
    if (box.dataset.h !== html) {
      box.dataset.h = html; box.innerHTML = html;
      const b = document.getElementById('rigup');
      if (b) { b.setAttribute('aria-label', T.up); b.onclick = () => { try { haptic(); } catch (e) {} b.disabled = true; try { mine('cpu'); } catch (e) {} }; }
    }
  }
  let q = 0; new MutationObserver(() => { if (!q) q = requestAnimationFrame(() => { q = 0; rig(); }); }).observe(document.body, { childList: true, subtree: true });
  const of = window.fetch;
  window.fetch = async function (u, o) {
    const r = await of.apply(this, arguments);
    try {
      if (String(u).indexOf('/mct/api') >= 0 && o && typeof o.body === 'string' && o.body.indexOf('"action":"bonus"') >= 0) {
        r.clone().json().then((j) => {
          if (!j || !j.ok) return;
          const T = L(), lines = [T.bd(mo(j.reward || 0)), j.sub ? T.bs(mo(j.sub)) : T.bn];
          setTimeout(() => { try { toast(lines.join('\n')); const el = document.getElementById('toast'); if (el) el.style.whiteSpace = 'pre-line'; } catch (e) {} }, 60);
        }).catch(() => {});
      }
    } catch (e) {}
    return r;
  };
})();

// 15 oct 2026: counts each invite or coin link the player shares (for Jeremy's stats), on top of the game's own share
(() => {
  const of = window.fetch;
  window.fetch = async function (u, o) {
    const r = await of.apply(this, arguments);
    try {
      if (String(u).indexOf('/mct/api') >= 0 && o && typeof o.body === 'string' && o.body.indexOf('"action":"share"') >= 0) {
        let k = ''; try { k = JSON.parse(o.body).kind || ''; } catch (e) {}
        of('https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-ton', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ app: 'mct', initData: tw.initData, action: 'track', prog: String(k).slice(0, 20), kind: 'share' }) }).catch(() => {});
      }
    } catch (e) {}
    return r;
  };
})();
