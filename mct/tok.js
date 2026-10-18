// 18 oct 2026 (Jeremy): $MCT, the official virtual coin of Meme Coin Tycoon. A card at the top of the market: price, what the player
// holds and his badge, the reserve of free $MCT (1,000,000, halved under 500,000 and 250,000), a video for +10 $MCT (3 a day,
// Premium without the video, rw.js) and how to earn it. Data from the Supabase function mct-ton (actions mon_tok<kind>, mct_tok_api).
(() => {
  const TX = {
    en: {
      t: '🏛️ $MCT · the official coin', sub: 'The coin of the game: the more the game grows, the more it is worth', you: 'You hold', res: (a, b) => 'Free $MCT left: ' + a + ' / ' + b,
      vid: (q, n) => '📺 +' + q + ' $MCT (' + n + '/3)', vidp: (q, n) => '💎 +' + q + ' $MCT (' + n + '/3)', vid0: '📺 Come back tomorrow', see: 'See the coin', how: '❓ How to earn $MCT', ok: (q) => '🏛️ +' + q + ' $MCT added!', skip: 'The video was not finished: no reward this time.', done: 'Already taken 3 times today. Come back tomorrow!', empty: 'The reserve is empty: $MCT is only bought now.', err: 'Something went wrong, try again.',
      tiers: ['', '🥉 Bronze', '🥈 Silver', '🥇 Gold'],
      list: (e, d) => ['📺 A video: +' + e.video + ' $MCT (3 a day)', '🔥 Day 7 of your streak: +' + e.streak + ' $MCT', '👥 Each friend who really plays: +' + e.ref + ' $MCT', '🛡️ Top 3 clans of the week: +' + e.clan.join(' / ') + ' $MCT for each member', '💎 Top 3 of the diamond contest: +' + e.dia.join(' / ') + ' $MCT', '⛏️ Mine it with your rig (50 % of the normal yield)', '💵 Every Monday: $' + d.div.toLocaleString('en-US') + ' shared between the holders of ' + d.min + ' $MCT or more', '🥉 1,000 Bronze · 🥈 10,000 Silver (+5 % mining) · 🥇 100,000 Gold (+10 % mining)', '⭐ Every Star spent in the game pushes $MCT up', '📉 The free rewards are halved when the reserve goes under 500,000, then 250,000'],
    },
    fr: {
      t: '🏛️ $MCT · le coin officiel', sub: 'Le coin du jeu : plus le jeu grandit, plus il vaut cher', you: 'Tu as', res: (a, b) => '$MCT gratuits restants : ' + a + ' / ' + b,
      vid: (q, n) => '📺 +' + q + ' $MCT (' + n + '/3)', vidp: (q, n) => '💎 +' + q + ' $MCT (' + n + '/3)', vid0: '📺 Reviens demain', see: 'Voir le coin', how: '❓ Comment gagner des $MCT', ok: (q) => '🏛️ +' + q + ' $MCT ajoutés !', skip: 'Vidéo pas terminée : pas de récompense cette fois.', done: 'Déjà pris 3 fois aujourd\'hui. Reviens demain !', empty: 'La réserve est vide : $MCT s\'achète maintenant.', err: 'Une erreur est survenue, réessaie.',
      tiers: ['', '🥉 Bronze', '🥈 Argent', '🥇 Or'],
      list: (e, d) => ['📺 Une vidéo : +' + e.video + ' $MCT (3 par jour)', '🔥 7e jour de ta série : +' + e.streak + ' $MCT', '👥 Chaque ami qui joue vraiment : +' + e.ref + ' $MCT', '🛡️ Top 3 des clans de la semaine : +' + e.clan.join(' / ') + ' $MCT par membre', '💎 Top 3 du concours du diamant : +' + e.dia.join(' / ') + ' $MCT', '⛏️ Mine-le avec ton rig (50 % du rendement normal)', '💵 Chaque lundi : ' + d.div.toLocaleString('fr-FR') + ' $ partagés entre ceux qui ont ' + d.min + ' $MCT ou plus', '🥉 1 000 Bronze · 🥈 10 000 Argent (+5 % de minage) · 🥇 100 000 Or (+10 % de minage)', '⭐ Chaque étoile dépensée dans le jeu fait monter $MCT', '📉 Les récompenses gratuites sont divisées par 2 quand la réserve passe sous 500 000, puis sous 250 000'],
    },
  };
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] ? l : 'en'; };
  const L = () => TX[lg()];
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const nf = (n, d) => Number(n || 0).toLocaleString(lg() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: d == null ? 0 : d });
  const usd = (n) => { try { return money(n); } catch (e) { return '$' + nf(n, 2); } };
  const call = async (k, b) => { try { return await tonCall(Object.assign({ action: 'mon_tok' + k }, b || {})); } catch (e) { return null; } };
  let S = null, OPEN = false;

  const st = document.createElement('style');
  st.textContent = '#tokc{border:1px solid rgba(255,212,59,.55);background:linear-gradient(150deg,rgba(255,212,59,.16),rgba(255,154,60,.04) 70%);border-radius:18px;padding:12px 14px;margin:0 0 12px}'
    + '#tokc .th{display:flex;align-items:center;gap:10px}#tokc .ti{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-size:22px;background:radial-gradient(circle at 32% 28%,rgba(255,255,255,.55),transparent 42%),radial-gradient(circle at 50% 60%,#ffd43b,#b07d00);flex:none}'
    + '#tokc b.tn{display:block;font-size:15px}#tokc small{display:block;font-size:12px;opacity:.8;line-height:1.35}#tokc .tp{margin-left:auto;text-align:right;flex:none}#tokc .tp b{display:block;font-size:16px}'
    + '#tokc .tr{height:6px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden;margin:8px 0 4px}#tokc .tr i{display:block;height:100%;background:linear-gradient(90deg,#ffd43b,#ff9a3c)}'
    + '#tokc .tb{display:flex;gap:8px;margin-top:10px}#tokc .tb button{flex:1;border:0;border-radius:12px;padding:9px 6px;font-weight:800;font-size:13px;cursor:pointer}#tokc .tv{background:#ffd43b;color:#1a1200}#tokc .ts{background:rgba(255,255,255,.1);color:inherit}#tokc .tb button:disabled{opacity:.55}'
    + '#tokc .thw{background:none;border:0;color:inherit;opacity:.85;font-size:12.5px;font-weight:700;padding:8px 0 0;cursor:pointer}#tokc ul{margin:6px 0 0;padding-left:18px;font-size:12.5px;line-height:1.5;opacity:.9}';
  document.head.appendChild(st);

  function draw(c) {
    if (!S || !c) return;
    const T = L(), ch = S.px24 ? (Number(S.px) / Number(S.px24) - 1) * 100 : 0, pr = !!window.MCTPREM;
    const pct = Math.max(0, Math.min(100, Number(S.reserve) / Number(S.reserve0) * 100));
    c.innerHTML = '<div class="th"><span class="ti">🏛️</span><div style="min-width:0"><b class="tn">' + ec(T.t) + '</b><small>' + ec(T.sub) + '</small></div>'
      + '<div class="tp"><b>' + usd(S.px) + '</b><small style="color:' + (ch >= 0 ? '#4ff0b7' : '#ff8a8a') + ';font-weight:800">' + (ch >= 0 ? '+' : '') + ch.toFixed(1) + ' %</small></div></div>'
      + '<small style="margin-top:8px">' + ec(T.you) + ' <b>' + nf(S.held, 2) + ' $MCT</b> (≈ ' + usd(S.value) + ')' + (S.tier ? ' · <b>' + ec(T.tiers[S.tier]) + '</b>' : '') + '</small>'
      + '<div class="tr"><i style="width:' + pct.toFixed(1) + '%"></i></div><small>' + ec(T.res(nf(S.reserve), nf(S.reserve0))) + '</small>'
      + '<div class="tb"><button type="button" class="tv" id="tokv"' + (S.vid_left > 0 && S.reserve > 0 ? '' : ' disabled') + '>' + ec(S.vid_left > 0 ? (pr ? T.vidp : T.vid)(nf(S.vid, 2), S.vid_left) : T.vid0) + '</button><button type="button" class="ts" id="toks">' + ec(T.see) + '</button></div>'
      + '<button type="button" class="thw" id="tokh">' + ec(T.how) + '</button>' + (OPEN ? '<ul>' + T.list(S.earn, { div: Number(S.div), min: nf(S.div_min) }).map((x) => '<li>' + ec(x) + '</li>').join('') + '</ul>' : '');
    c.querySelector('#toks').onclick = () => { hp(); try { openCoin(S.id); } catch (e) {} };
    c.querySelector('#tokh').onclick = () => { hp(); OPEN = !OPEN; draw(c); };
    c.querySelector('#tokv').onclick = async (ev) => {
      const b = ev.currentTarget; hp(); b.disabled = true; b.textContent = '⏳';
      // 18 oct 2026 (Jeremy): check before the video, so nobody watches a video for nothing
      await load(); if (!S || !(S.vid_left > 0) || !(S.reserve > 0)) { tst(S && S.reserve > 0 ? T.done : T.empty); draw(c); return; }
      const ok = window.mctRw ? await window.mctRw.watch(1, b) : true;
      if (!ok) { tst(T.skip); draw(c); return; }
      const r = await call('vid');
      if (!r || !r.ok) { hp('err'); tst((r && r.error && T[r.error]) || T.err); } else { hp('ok'); tst(T.ok(nf(r.qty, 2))); }
      await load(); draw(c);
    };
  }
  async function load() { const r = await call('state'); if (r && r.ok) S = r; return S; }
  async function card() {
    let mk = false; try { mk = VIEW === 'market'; } catch (e) {}
    const v = document.getElementById('view'); if (!mk || !v || document.getElementById('tokc')) return;
    const h = v.querySelector('h1'); if (!h) return;
    const c = document.createElement('div'); c.id = 'tokc'; h.insertAdjacentElement('afterend', c);
    if (S) draw(c);
    await load(); if (document.body.contains(c)) draw(c);
  }
  window.mctTok = { load, state: () => S };
  setInterval(card, 600);
})();
