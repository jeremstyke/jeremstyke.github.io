// 17 oct 2026 (Jeremy): Meme Coin Monsters, HIDDEN inside Meme Coin Tycoon, by @jeremstyke. Only Jeremy and Doriane see it
// (the server answers 'hidden' to everyone else, ds_config mmon_allow). A monster is born from a coin held for $100 or more
// (one egg a day per coin), and is tied to its coin: its strength follows the coin's price over 24 h, grows with the coins held,
// and a pump news boosts it. Feed it with its coin, merge two of the same stage, fight other players' teams (automatic, 3 a day).
// Data: Supabase function mct-ton, actions mon_state, mon_hatch, mon_feed, mon_merge, mon_fight (SQL mmon_api).
(() => {
  const ALLOW = [7057960224, 8844440894];
  const me = (() => { try { return Number(Telegram.WebApp.initDataUnsafe.user.id); } catch (e) { return 0; } })();
  if (!ALLOW.includes(me)) return;
  const TX = {
    fr: { t: 'Meme Coin Monsters', sec: 'Mode secret · visible par toi seulement', eggs: 'Œufs du jour', egg: (t) => 'Faire éclore $' + t, starter: '🥚 Œuf de départ', noegg: 'Garde au moins 100 $ d\'un coin pour recevoir son œuf (1 par jour et par coin).', team: 'Mes monstres', none: 'Aucun monstre pour l\'instant.',
      fight: (n, m) => '⚔️ Combattre (' + n + '/' + m + ')', nofight: 'Plus de combat aujourd\'hui, reviens demain !', feed: '🍖 Nourrir', merge: '🔀 Fusionner', lvl: 'Niv.', power: 'Force', base: 'base', coin24: 'coin 24 h', held: 'coins gardés', news: 'news',
      feedq: 'Combien de $ de ce coin lui donner ? (les coins sont mangés)', fed: '🍖 Miam ! +XP', merged: '🔀 Fusion réussie : stade supérieur !', hatched: '🐣 Un monstre est né !', win: '🏆 Victoire !', lose: '😵 Défaite…', vs: 'contre', rew: (v) => '+' + v + ' $', board: 'Classement de la semaine', pts: 'pts',
      types: ['🔥 Feu', '🌿 Plante', '💧 Eau'], hint: '🔥 bat 🌿 · 🌿 bat 💧 · 💧 bat 🔥', err: 'Erreur, réessaie.', nocoin: 'Tu n\'as plus de ce coin.', max: 'Niveau max : fusionne-le avec un autre du même stade.', close: 'Fermer', go: 'Voir le coin', coinbtn: (t) => '🥚 Le monstre de $' + t, pfbtn: '🐉 Mes monstres' },
    en: { t: 'Meme Coin Monsters', sec: 'Secret mode · only you can see it', eggs: 'Today\'s eggs', egg: (t) => 'Hatch $' + t, starter: '🥚 Starter egg', noegg: 'Hold at least $100 of a coin to get its egg (1 a day per coin).', team: 'My monsters', none: 'No monster yet.',
      fight: (n, m) => '⚔️ Fight (' + n + '/' + m + ')', nofight: 'No fight left today, come back tomorrow!', feed: '🍖 Feed', merge: '🔀 Merge', lvl: 'Lv.', power: 'Power', base: 'base', coin24: 'coin 24 h', held: 'coins held', news: 'news',
      feedq: 'How many $ of this coin to feed it? (the coins are eaten)', fed: '🍖 Yum! +XP', merged: '🔀 Merged: next stage!', hatched: '🐣 A monster is born!', win: '🏆 Victory!', lose: '😵 Defeat…', vs: 'vs', rew: (v) => '+$' + v, board: 'This week\'s ranking', pts: 'pts',
      types: ['🔥 Fire', '🌿 Plant', '💧 Water'], hint: '🔥 beats 🌿 · 🌿 beats 💧 · 💧 beats 🔥', err: 'Error, try again.', nocoin: 'You have none of this coin left.', max: 'Max level: merge it with another of the same stage.', close: 'Close', go: 'See the coin', coinbtn: (t) => '🥚 The monster of $' + t, pfbtn: '🐉 My monsters' },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l === 'fr' ? 'fr' : 'en']; };
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const TI = ['🔥', '🌿', '💧'];
  let S = null, busy = false;

  const st = document.createElement('style');
  st.textContent = '#monpf,#monco{display:block;width:100%;margin:8px 0;box-sizing:border-box;padding:11px 14px;border:1px dashed rgba(255,212,59,.6);border-radius:14px;background:rgba(255,212,59,.08);color:#ffd43b;font-weight:700;font-size:14px;cursor:pointer}'
    + '#monm{position:fixed;inset:0;z-index:10050;background:rgba(5,3,15,.8);display:flex;align-items:flex-end;justify-content:center}'
    + '#monm .mb{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:16px 16px calc(20px + env(safe-area-inset-bottom))}'
    + '#monm .mt{display:flex;align-items:center;justify-content:space-between}#monm .mt b{font-size:18px}#monm .mx{background:none;border:0;color:inherit;font-size:22px;opacity:.7;padding:4px 8px;cursor:pointer}'
    + '#monm .ms{font-size:12px;opacity:.6;margin:0 0 12px}#monm h4{margin:14px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.05em;opacity:.7}'
    + '#monm .eggs{display:flex;gap:8px;flex-wrap:wrap}#monm .eg{border:1px dashed rgba(255,212,59,.6);background:rgba(255,212,59,.08);color:inherit;border-radius:14px;padding:10px 12px;font-size:14px;cursor:pointer}'
    + '#monm .mc{border:1px solid var(--line,rgba(255,255,255,.12));border-radius:16px;padding:12px;margin:0 0 10px;background:rgba(255,255,255,.03)}'
    + '#monm .mh{display:flex;align-items:center;gap:10px}#monm .mav{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;font-size:30px;flex:none}'
    + '#monm .mn{flex:1;min-width:0}#monm .mn b{font-size:16px}#monm .mn small{display:block;opacity:.7;font-size:12px}#monm .mp{text-align:right}#monm .mp b{font-size:20px;color:#ffd43b}#monm .mp small{display:block;font-size:11px;opacity:.6}'
    + '#monm .chips{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0 0}#monm .chips span{font-size:11px;padding:3px 8px;border-radius:999px;background:rgba(255,255,255,.07)}#monm .up{color:#7dff6b}#monm .dn{color:#ff6b81}'
    + '#monm .xb{height:6px;border-radius:6px;background:rgba(255,255,255,.08);overflow:hidden;margin:8px 0 0}#monm .xb i{display:block;height:100%;background:linear-gradient(90deg,#ffb300,#ffd43b)}'
    + '#monm .ma{display:flex;gap:8px;margin:10px 0 0}#monm .ma button{flex:1;margin:0;padding:9px;font-size:13px}'
    + '#monfight{display:block;width:100%;margin:6px 0 4px;padding:14px;border:0;border-radius:14px;background:linear-gradient(135deg,#ff6b6b,#ff3d71);color:#fff;font-weight:800;font-size:16px;cursor:pointer}#monfight:disabled{opacity:.5}'
    + '#monm .duel{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px;border-radius:12px;background:rgba(255,255,255,.04);margin:6px 0;opacity:0;transform:translateY(8px);transition:all .35s}#monm .duel.on{opacity:1;transform:none}'
    + '#monm .duel .w{color:#7dff6b;font-weight:800}#monm .duel .l{color:#ff6b81;font-weight:800}#monm .res{text-align:center;font-size:22px;font-weight:800;margin:12px 0 4px}'
    + '#monm .br{display:flex;justify-content:space-between;font-size:14px;padding:5px 0}#monm .br.me{color:#ffd43b;font-weight:700}#monm .hint{font-size:12px;opacity:.6;text-align:center;margin:6px 0 0}';
  document.head.appendChild(st);

  // 17 oct 2026 (Jeremy): the way in is on each coin page, "🥚 The monster of $X" (no button at the top any more)
  let FOCUS = 0;
  function addCoinBtn() {
    let c = null; try { c = COIN && COIN.coin; } catch (e) {}
    const sh = document.getElementById('sheet');
    if (!c || !c.id || !sh || sh.querySelector('#monco')) return;
    const host = sh.firstElementChild || sh;
    const b = document.createElement('button'); b.id = 'monco'; b.type = 'button';
    b.textContent = L().coinbtn(c.ticker || '?');
    b.onclick = () => { hp(); show(Number(c.id)); };
    host.insertBefore(b, host.children[1] || null);
  }
  // 17 oct 2026 (Jeremy): also a line "🐉 My monsters" on the player's own profile (under the nickname / photo buttons)
  function addProfileBtn() {
    const ped = document.querySelector('#pfm .ped');
    if (!ped || document.getElementById('monpf')) return;
    const b = document.createElement('button'); b.id = 'monpf'; b.type = 'button';
    b.textContent = L().pfbtn;
    b.onclick = () => { hp(); show(0); };
    ped.parentNode.insertBefore(b, ped.nextSibling);
  }
  let MQ = 0;
  new MutationObserver(() => { if (!MQ) MQ = requestAnimationFrame(() => { MQ = 0; addCoinBtn(); addProfileBtn(); }); }).observe(document.body, { childList: true, subtree: true });

  const call = async (b) => { try { return await tonCall(b); } catch (e) { return null; } };
  const pc = (v) => (v > 0 ? '+' : '') + Math.round(v) + ' %';
  function card(m) {
    const T = L(), b = m.boost || {}, mons = (S && S.mons) || [];
    const twin = mons.find((x) => x.id !== m.id && x.coin === m.coin && x.stage === m.stage);
    const chips = ['<span>' + T.types[m.type] + '</span>', '<span>' + T.base + ' ' + m.power + '</span>'];
    if (b.ch) chips.push('<span class="' + (b.ch > 0 ? 'up' : 'dn') + '">📈 ' + T.coin24 + ' ' + pc(b.ch) + '</span>');
    if (b.heldb > 0) chips.push('<span class="up">💎 ' + T.held + ' +' + Math.round(b.heldb * 100) + ' %</span>');
    if (b.news) chips.push('<span class="up">🚀 ' + T.news + ' +20 %</span>');
    return '<div class="mc"><div class="mh"><div class="mav" style="background:' + ec(m.color) + '33;border:1px solid ' + ec(m.color) + '88">' + ec(m.emoji) + '</div>'
      + '<div class="mn"><b>$' + ec(m.tk) + ' ' + '⭐'.repeat(m.stage) + '</b><small>' + T.lvl + ' ' + m.lvl + '/10 · ' + ec(m.name || '') + '</small></div>'
      + '<div class="mp"><b>' + m.epower + '</b><small>' + T.power + '</small></div></div>'
      + '<div class="chips">' + chips.join('') + '</div>'
      + '<div class="xb"><i style="width:' + Math.min(100, (m.xp / m.need) * 100) + '%"></i></div>'
      + '<div class="ma"><button class="ghost" data-feed="' + m.id + '">' + T.feed + '</button>' + (twin ? '<button class="ghost" data-merge="' + m.id + ',' + twin.id + '">' + T.merge + '</button>' : '') + '</div></div>';
  }
  function render() {
    const T = L(), B = document.getElementById('monb'); if (!B || !S) return;
    B.removeAttribute('style');
    if (!S.ok) { B.innerHTML = '<p style="text-align:center;opacity:.7">' + ec(T.err) + '</p>'; return; }
    const fo = (a) => FOCUS ? [...a].sort((x, y) => (y.coin === FOCUS) - (x.coin === FOCUS)) : a;
    S.mons = fo(S.mons || []); S.eggs = fo(S.eggs || []);
    let h = '<button id="monfight"' + (S.fights > 0 && S.mons.length ? '' : ' disabled') + '>' + ec(S.fights > 0 ? T.fight(S.fights, S.fmax) : T.nofight) + '</button><div class="hint">' + T.hint + '</div><div id="mfr"></div>';
    h += '<h4>' + T.eggs + '</h4><div class="eggs">';
    if (S.starter) h += '<button class="eg" data-starter="1">' + T.starter + '</button>';
    (S.eggs || []).forEach((e) => { h += '<button class="eg" data-egg="' + e.coin + '">🥚 ' + ec(e.emoji) + ' ' + ec(T.egg(e.tk)) + '</button>'; });
    if (!S.starter && !(S.eggs || []).length) h += '<small style="opacity:.6">' + T.noegg + '</small>';
    h += '</div><h4>' + T.team + ' (' + S.mons.length + ')</h4>' + (S.mons.length ? S.mons.map(card).join('') : '<small style="opacity:.6">' + T.none + '</small>');
    h += '<h4>' + T.board + '</h4>' + (S.board || []).map((r, i) => '<div class="br' + (r.me ? ' me' : '') + '"><span>' + (i + 1) + '. ' + ec(r.name) + '</span><span>' + r.pts + ' ' + T.pts + '</span></div>').join('');
    B.innerHTML = h;
    B.querySelector('#monfight').onclick = fight;
    B.querySelectorAll('[data-egg],[data-starter]').forEach((x) => { x.onclick = () => act({ action: 'mon_hatch', coin: x.dataset.egg, starter: x.dataset.starter || '' }, T.hatched); });
    B.querySelectorAll('[data-feed]').forEach((x) => { x.onclick = () => feed(Number(x.dataset.feed)); });
    B.querySelectorAll('[data-merge]').forEach((x) => { const [a, b] = x.dataset.merge.split(','); x.onclick = () => act({ action: 'mon_merge', a, b }, T.merged); });
  }
  async function load() { const r = await call({ action: 'mon_state' }); S = r || { ok: false }; render(); }
  async function act(body, okMsg) {
    if (busy) return; busy = true; hp();
    const r = await call(body); busy = false;
    if (r && r.ok) { tst(okMsg); S = r.state || S; render(); return r; }
    const T = L(); tst(r && r.error === 'no_coin' ? T.nocoin : r && r.error === 'max' ? T.max : T.err); return null;
  }
  function feed(id) {
    const T = L(), m = S.mons.find((x) => x.id === id); if (!m) return;
    const v = prompt(T.feedq + '\n($' + m.tk + ': ' + Math.round(m.held) + ' $)', String(Math.min(100, Math.floor(m.held))));
    const usd = Number(String(v || '').replace(',', '.'));
    if (usd > 0) act({ action: 'mon_feed', id, usd }, T.fed);
  }
  async function fight() {
    if (busy) return; busy = true; hp('medium');
    const T = L(), btn = document.getElementById('monfight'); if (btn) btn.disabled = true;
    const r = await call({ action: 'mon_fight' }); busy = false;
    const F = document.getElementById('mfr'); if (!F) return;
    if (!r || !r.ok) { tst(T.err); if (btn) btn.disabled = false; return; }
    F.innerHTML = '<div style="text-align:center;opacity:.7;font-size:13px;margin:8px 0">' + T.vs + ' <b>' + ec(r.opp) + '</b></div>'
      + r.duels.map((d) => '<div class="duel"><span>' + ec(d.me.emoji) + ' $' + ec(d.me.tk) + ' ' + TI[d.me.type] + ' <b>' + d.me.p + '</b></span><span class="' + (d.win ? 'w' : 'l') + '">' + (d.win ? '✔' : '✖') + '</span><span><b>' + d.op.p + '</b> ' + TI[d.op.type] + ' ' + ec(d.op.emoji) + ' $' + ec(d.op.tk) + '</span></div>').join('')
      + '<div class="res" style="opacity:0">' + (r.win ? T.win : T.lose) + ' <span style="color:#7dff6b">' + T.rew(r.reward) + '</span></div>';
    const ds = F.querySelectorAll('.duel');
    ds.forEach((x, i) => setTimeout(() => { x.classList.add('on'); hp('light'); }, 500 + i * 700));
    setTimeout(() => { const z = F.querySelector('.res'); if (z) z.style.opacity = 1; hp(r.win ? 'success' : 'error'); try { setCash(r.cash); } catch (e) {} }, 500 + ds.length * 700);
    setTimeout(() => { S = r.state || S; const keep = F.innerHTML; render(); const F2 = document.getElementById('mfr'); if (F2) { F2.innerHTML = keep; F2.querySelectorAll('.duel').forEach((x) => x.classList.add('on')); const z = F2.querySelector('.res'); if (z) z.style.opacity = 1; } }, 900 + ds.length * 700);
  }
  function show(focus) {
    FOCUS = Number(focus) || 0;
    const T = L(); let d = document.getElementById('monm'); if (d) d.remove();
    d = document.createElement('div'); d.id = 'monm';
    d.innerHTML = '<div class="mb"><div class="mt"><b>🐉 ' + ec(T.t) + '</b><button class="mx" aria-label="' + ec(T.close) + '">✕</button></div><div class="ms">🔒 ' + ec(T.sec) + '</div><div id="monb" style="text-align:center;padding:30px 0">⏳</div></div>';
    d.onclick = (e) => { if (e.target === d) d.remove(); };
    d.querySelector('.mx').onclick = () => d.remove();
    document.body.appendChild(d);
    load();
  }
  window.mctMonsters = show;
})();
