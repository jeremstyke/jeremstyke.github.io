// 17 oct 2026 (Jeremy): Meme Coin Monsters, HIDDEN inside Meme Coin Tycoon, by @jeremstyke. Only Jeremy and Doriane see it
// (the server answers 'hidden' to everyone else, ds_config mmon_allow). A monster is born from a coin held for $100 or more
// (one egg a day per coin), and is tied to its coin: its strength follows the coin's price over 24 h, grows with the coins held,
// and a pump news boosts it. Feeding it BUYS its coin with cash (the price goes up, the coins are eaten), merge two of the same stage, fight other players' teams (automatic, 3 a day).
// Data: Supabase function mct-ton, actions mon_state, mon_hatch, mon_feed, mon_merge, mon_fight (SQL mmon_api).
(() => {
  const ALLOW = [7057960224, 8844440894];
  const me = (() => { try { return Number(Telegram.WebApp.initDataUnsafe.user.id); } catch (e) { return 0; } })();
  if (!ALLOW.includes(me)) return;
  const TX = {
    fr: { t: 'Meme Coin Monsters', sec: 'Mode secret · visible par toi seulement', eggs: 'Œufs du jour', egg: (t) => 'Faire éclore $' + t, starter: '🥚 Œuf de départ', noegg: 'Garde au moins 100 $ d\'un coin pour recevoir son œuf (1 par jour et par coin).', team: 'Mes monstres', none: 'Aucun monstre pour l\'instant.',
      fight: (n, m) => '⚔️ Combattre (' + n + '/' + m + ')', nofight: 'Plus de combat aujourd\'hui, reviens demain !', feed: (t) => 'Nourrir en $' + t, meal: (u, q, t) => '1 repas : ' + u + ' $ = ' + q + ' ' + t, merge: '🔀 Fusionner', lvl: 'Niv.', power: 'Force', base: 'base', coin24: 'coin 24 h', held: 'coins gardés', news: 'news',
      feedq: (t, px) => 'Nourrir en $' + t + ' : combien de $ veux-tu dépenser ?\n1 ' + t + ' = ' + px + ' $. Ça achète du ' + t + ' (le prix monte) et ton monstre le mange (1 $ = 1 XP).', fedq: (q, t, u) => 'Ton monstre a mangé ' + q + ' ' + t + ' (' + u + ' $) !', fed: 'Miam ! +XP et le coin monte 📈', merged: '🔀 Fusion réussie : stade supérieur !', hatched: '🐣 Un monstre est né !', win: '🏆 Victoire !', lose: '😵 Défaite…', vs: 'contre', rew: (v) => '+' + v + ' $', board: 'Classement de la semaine', pts: 'pts',
      types: ['🔥 Feu', '🌿 Plante', '💧 Eau'], hint: '🔥 bat 🌿 · 🌿 bat 💧 · 💧 bat 🔥', err: 'Erreur, réessaie.', nocoin: 'Pas assez d\'argent pour ce repas.', max: 'Niveau max : fusionne-le avec un autre du même stade.', close: 'Fermer', go: 'Voir le coin', coinbtn: (t) => 'Le monstre de $' + t, coinsub: (t, n) => (n ? n + ' monstre' + (n > 1 ? 's' : '') + ' · ' : '') + 'Nourris-le en ' + t + ' et fais-le combattre', pfbtn: '🐉 Mes monstres',
      rules: '📖 Les règles', rl: (f) => [
        '🥚 <b>Œufs</b> : garde au moins 100 $ d\'un coin et tu reçois son œuf (1 par jour et par coin). Le monstre qui naît est celui de ce coin.',
        '🪙 <b>Nourrir</b> : tu choisis combien de $ dépenser. Ça achète du coin (son prix monte) et ton monstre le mange : 1 $ = 1 XP. Les coins achetés sont mangés, ceux que tu avais déjà ne bougent pas.',
        '⬆️ <b>Niveaux</b> : la barre jaune se remplit avec l\'XP, jusqu\'au niveau 10. Fusionne 2 monstres du même coin et du même stade pour passer au stade supérieur (⭐ en plus, cornes puis couronne).',
        '💪 <b>Force</b> : elle dépend du niveau et du stade, puis de ton coin : sa hausse sur 24 h (de x0,5 à x2), les coins que tu gardes (+1 % par 100 $, jusqu\'à +50 %) et une news de pump (+20 % pendant 2 h).',
        '⚔️ <b>Combats</b> : ' + f + ' par jour, contre l\'équipe d\'un joueur de ta force ou des monstres sauvages. 3 duels, 2 gagnés = victoire. Victoire : +300 $, défaite : +50 $.',
        '🔥 bat 🌿, 🌿 bat 💧, 💧 bat 🔥 : le bon type donne x1,5 en duel.',
        '🏆 <b>Classement</b> : tes victoires de la semaine donnent des points.'] },
    en: { t: 'Meme Coin Monsters', sec: 'Secret mode · only you can see it', eggs: 'Today\'s eggs', egg: (t) => 'Hatch $' + t, starter: '🥚 Starter egg', noegg: 'Hold at least $100 of a coin to get its egg (1 a day per coin).', team: 'My monsters', none: 'No monster yet.',
      fight: (n, m) => '⚔️ Fight (' + n + '/' + m + ')', nofight: 'No fight left today, come back tomorrow!', feed: (t) => 'Feed with $' + t, meal: (u, q, t) => '1 meal: $' + u + ' = ' + q + ' ' + t, merge: '🔀 Merge', lvl: 'Lv.', power: 'Power', base: 'base', coin24: 'coin 24 h', held: 'coins held', news: 'news',
      feedq: (t, px) => 'Feed with $' + t + ': how many $ do you want to spend?\n1 ' + t + ' = $' + px + '. It buys ' + t + ' (the price goes up) and your monster eats it ($1 = 1 XP).', fedq: (q, t, u) => 'Your monster ate ' + q + ' ' + t + ' ($' + u + ')!', fed: 'Yum! +XP and the coin goes up 📈', merged: '🔀 Merged: next stage!', hatched: '🐣 A monster is born!', win: '🏆 Victory!', lose: '😵 Defeat…', vs: 'vs', rew: (v) => '+$' + v, board: 'This week\'s ranking', pts: 'pts',
      types: ['🔥 Fire', '🌿 Plant', '💧 Water'], hint: '🔥 beats 🌿 · 🌿 beats 💧 · 💧 beats 🔥', err: 'Error, try again.', nocoin: 'Not enough cash for this meal.', max: 'Max level: merge it with another of the same stage.', close: 'Close', go: 'See the coin', coinbtn: (t) => 'The monster of $' + t, coinsub: (t, n) => (n ? n + ' monster' + (n > 1 ? 's' : '') + ' · ' : '') + 'Feed it with ' + t + ' and make it fight', pfbtn: '🐉 My monsters',
      rules: '📖 Rules', rl: (f) => [
        '🥚 <b>Eggs</b>: hold at least $100 of a coin and you get its egg (1 a day per coin). The monster that hatches is that coin\'s monster.',
        '🪙 <b>Feeding</b>: you choose how many $ to spend. It buys the coin (its price goes up) and your monster eats it: $1 = 1 XP. The coins bought are eaten, the ones you already had stay.',
        '⬆️ <b>Levels</b>: the yellow bar fills with XP, up to level 10. Merge 2 monsters of the same coin and stage to reach the next stage (one more ⭐, horns then a crown).',
        '💪 <b>Power</b>: it comes from level and stage, then from your coin: its 24 h change (x0.5 to x2), the coins you hold (+1% per $100, up to +50%) and a pump news (+20% for 2 h).',
        '⚔️ <b>Fights</b>: ' + f + ' a day, against a player team of your strength or wild monsters. 3 duels, win 2 = victory. Victory: +$300, defeat: +$50.',
        '🔥 beats 🌿, 🌿 beats 💧, 💧 beats 🔥: the right type gives x1.5 in a duel.',
        '🏆 <b>Ranking</b>: your wins of the week give points.'] },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l === 'fr' ? 'fr' : 'en']; };
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const TI = ['🔥', '🌿', '💧'];
  let S = null, busy = false;

  const st = document.createElement('style');
  st.textContent = '#monpf{display:block;width:100%;margin:8px 0;box-sizing:border-box;padding:11px 14px;border:1px dashed rgba(255,212,59,.6);border-radius:14px;background:rgba(255,212,59,.08);color:#ffd43b;font-weight:700;font-size:14px;cursor:pointer}'
    // 17 oct 2026 (Jeremy): on the coin page, very small, right under the news effect
    // 17 oct 2026 (Jeremy): the button on the coin page is a small card with the coin's monster
    + '#monco{display:flex;align-items:center;gap:10px;width:100%;margin:8px 0 0;padding:6px 12px 6px 6px;border:1px solid rgba(255,212,59,.35);border-radius:16px;background:linear-gradient(135deg,rgba(255,212,59,.12),rgba(255,255,255,.02));color:inherit;text-align:left;cursor:pointer;font:inherit}'
    + '#monco .mcv{width:42px;height:42px;flex:none;border-radius:12px;background:rgba(0,0,0,.25);display:grid;place-items:center;overflow:hidden}#monco .mcv svg{width:36px;height:36px;animation:mbob 2.6s ease-in-out infinite}'
    + '#monco .mct{flex:1;min-width:0}#monco .mct b{display:block;font-size:14px;color:#ffd43b}#monco .mct small{display:block;font-size:11px;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#monco .mca{font-size:20px;opacity:.6}'
    + '#monm{position:fixed;inset:0;z-index:10050;background:rgba(5,3,15,.8);display:flex;align-items:flex-end;justify-content:center}'
    + '#monm .mb{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:16px 16px calc(20px + env(safe-area-inset-bottom))}'
    + '#monm .mt{display:flex;align-items:center;justify-content:space-between}#monm .mt b{font-size:18px}#monm .mx{background:none;border:0;color:inherit;font-size:22px;opacity:.7;padding:4px 8px;cursor:pointer}'
    + '#monm .ms{font-size:12px;opacity:.6;margin:0 0 12px}#monm h4{margin:14px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.05em;opacity:.7}'
    + '#monm .eggs{display:flex;gap:8px;flex-wrap:wrap}#monm .eg{border:1px dashed rgba(255,212,59,.6);background:rgba(255,212,59,.08);color:inherit;border-radius:14px;padding:10px 12px;font-size:14px;cursor:pointer}'
    + '#monm .mc{border:1px solid var(--line,rgba(255,255,255,.12));border-radius:16px;padding:12px;margin:0 0 10px;background:rgba(255,255,255,.03)}'
    + '#monm .mh{display:flex;align-items:center;gap:10px}#monm .mav{width:64px;height:64px;flex:none;animation:mbob 2.6s ease-in-out infinite}#monm .mav svg{width:100%;height:100%;overflow:visible}'
    // 17 oct 2026 (Jeremy): the monster is a real creature made from its coin (colour, emoji on the belly, horns with the stage);
    // the round coin that spins is on the Feed button
    + '@keyframes mbob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}'
    + '#monm .mco{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;font-size:12px;font-style:normal;vertical-align:middle;margin-right:6px;box-shadow:inset 0 -2px 0 rgba(0,0,0,.25),0 0 0 2px #ffd43b;animation:mspin 3s ease-in-out infinite}'
    + '@keyframes mspin{0%{transform:rotateY(0)}40%{transform:rotateY(360deg)}100%{transform:rotateY(360deg)}}'
    + '#monm .mn{flex:1;min-width:0}#monm .mn b{font-size:16px}#monm .mn small{display:block;opacity:.7;font-size:12px}#monm .mp{text-align:right}#monm .mp b{font-size:20px;color:#ffd43b}#monm .mp small{display:block;font-size:11px;opacity:.6}'
    + '#monm .chips{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0 0}#monm .chips span{font-size:11px;padding:3px 8px;border-radius:999px;background:rgba(255,255,255,.07)}#monm .up{color:#7dff6b}#monm .dn{color:#ff6b81}'
    + '#monm .xb{height:6px;border-radius:6px;background:rgba(255,255,255,.08);overflow:hidden;margin:8px 0 0}#monm .xb i{display:block;height:100%;background:linear-gradient(90deg,#ffb300,#ffd43b)}'
    + '#monm .ma{display:flex;gap:8px;margin:10px 0 0}#monm .ma button{flex:1;margin:0;padding:9px;font-size:13px;font-weight:700}#monm .mml{display:block;font-size:11px;font-weight:400;opacity:.65;margin-top:2px}'
    + '#monfight{display:block;width:100%;margin:6px 0 4px;padding:14px;border:0;border-radius:14px;background:linear-gradient(135deg,#ff6b6b,#ff3d71);color:#fff;font-weight:800;font-size:16px;cursor:pointer}#monfight:disabled{opacity:.5}'
    + '#monm .duel{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px;border-radius:12px;background:rgba(255,255,255,.04);margin:6px 0;opacity:0;transform:translateY(8px);transition:all .35s}#monm .duel.on{opacity:1;transform:none}'
    + '#monm .duel .w{color:#7dff6b;font-weight:800}#monm .duel .l{color:#ff6b81;font-weight:800}#monm .res{text-align:center;font-size:22px;font-weight:800;margin:12px 0 4px}'
    + '#monm .mrl{margin:14px 0 0;border:1px solid var(--line,rgba(255,255,255,.12));border-radius:14px;padding:10px 12px;background:rgba(255,255,255,.03)}#monm .mrl summary{font-weight:700;cursor:pointer}#monm .mrl ul{margin:8px 0 0;padding-left:4px;list-style:none}#monm .mrl li{font-size:13px;line-height:1.45;margin:0 0 8px}#monm .hint a{color:#ffd43b}'
    + '#monm .br{display:flex;justify-content:space-between;font-size:14px;padding:5px 0}#monm .br.me{color:#ffd43b;font-weight:700}#monm .hint{font-size:12px;opacity:.6;text-align:center;margin:6px 0 0}';
  document.head.appendChild(st);

  // 17 oct 2026 (Jeremy): the way in is on each coin page, "🥚 The monster of $X" (no button at the top any more)
  let FOCUS = 0;
  function addCoinBtn() {
    let c = null; try { c = COIN && COIN.coin; } catch (e) {}
    const sh = document.getElementById('sheet');
    if (!c || !c.id || !sh || sh.querySelector('#monco')) return;
    const b = document.createElement('button'); b.id = 'monco'; b.type = 'button';
    const own = ((S && S.mons) || []).filter((x) => x.coin === Number(c.id));
    const st = own.reduce((a, x) => Math.max(a, x.stage), 1);
    b.innerHTML = '<span class="mcv">' + monSvg({ coin: c.id, color: c.color, emoji: c.emoji, stage: st }) + '</span><span class="mct"><b>' + ec(L().coinbtn(c.ticker || '?')) + '</b><small>' + ec(L().coinsub(c.ticker || '?', own.length)) + '</small></span><span class="mca">›</span>';
    b.onclick = () => { hp(); show(Number(c.id)); };
    const bd = sh.querySelector('.badges.hint'); // under the "News effect" line
    if (bd) bd.parentNode.insertBefore(b, bd.nextSibling); else { const host = sh.firstElementChild || sh; host.insertBefore(b, host.children[1] || null); }
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
  // 17 oct 2026 (Jeremy): show how many coins a meal costs and its $ value
  const MEAL = 10;
  const fq = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'k' : n >= 10 ? String(Math.round(n)) : n.toFixed(2)).replace('.0', '');
  const fp = (p) => (p >= 1 ? p.toFixed(2) : p >= 0.01 ? p.toFixed(4) : p.toPrecision(3));
  const qty = (m, usd) => (Number(m.price) > 0 ? usd / Number(m.price) : 0);
  // a monster drawn from its coin: body shape from the coin, its colour, its emoji on the belly, horns / crown grow with the stage
  function monSvg(m) {
    const k = Number(m.coin) || 1, c = String(m.color || '#ffd43b').replace(/[^#0-9a-fA-F]/g, '') || '#ffd43b', st = m.stage || 1;
    const shape = k % 3, eyes = 1 + (k % 2 === 0 ? 1 : 0) + (k % 5 === 0 ? 1 : 0), dk = 'rgba(0,0,0,.28)';
    let g = '';
    // feet
    g += '<ellipse cx="22" cy="58" rx="8" ry="4" fill="' + c + '"/><ellipse cx="42" cy="58" rx="8" ry="4" fill="' + c + '"/>';
    // horns (stage 2+) and crown (stage 3+)
    if (st >= 2) g += '<path d="M18 16 L12 2 L25 12Z" fill="#ffd43b"/><path d="M46 16 L52 2 L39 12Z" fill="#ffd43b"/>';
    if (shape === 2) g += '<path d="M8 30 L0 24 L6 36Z M56 30 L64 24 L58 36Z" fill="' + c + '"/>';
    else g += '<ellipse cx="7" cy="36" rx="5" ry="9" fill="' + c + '" transform="rotate(-25 7 36)"/><ellipse cx="57" cy="36" rx="5" ry="9" fill="' + c + '" transform="rotate(25 57 36)"/>';
    // body
    if (shape === 0) g += '<ellipse cx="32" cy="35" rx="25" ry="23" fill="' + c + '"/>';
    else if (shape === 1) g += '<rect x="9" y="10" width="46" height="48" rx="20" fill="' + c + '"/>';
    else g += '<path d="M32 8 L40 14 L50 12 L52 22 L60 30 L54 40 L56 52 L44 58 L32 56 L20 58 L8 52 L10 40 L4 30 L12 22 L14 12 L24 14Z" fill="' + c + '"/>';
    g += '<ellipse cx="24" cy="22" rx="10" ry="5" fill="rgba(255,255,255,.3)"/>';
    // belly with the coin
    g += '<circle cx="32" cy="43" r="10" fill="#ffd43b" stroke="' + dk + '" stroke-width="1.5"/><text x="32" y="47.5" font-size="12" text-anchor="middle">' + ec(m.emoji || '🪙') + '</text>';
    // eyes
    const xs = eyes === 1 ? [32] : eyes === 2 ? [24, 40] : [21, 32, 43];
    xs.forEach((x) => { g += '<circle cx="' + x + '" cy="24" r="6" fill="#fff"/><circle cx="' + (x + 1) + '" cy="25" r="3" fill="#140c2c"/><circle cx="' + (x + 2) + '" cy="23" r="1" fill="#fff"/>'; });
    // mouth with fangs
    g += '<path d="M24 32 Q32 38 40 32" stroke="#140c2c" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M27 33.5 L28.5 37 L30 34.6Z M34 34.6 L35.5 37 L37 33.5Z" fill="#fff"/>';
    if (st >= 3) g += '<path d="M22 6 L26 0 L32 5 L38 0 L42 6 L40 10 L24 10Z" fill="#ffd43b" stroke="#c99a00"/>';
    return '<svg viewBox="0 0 64 64">' + g + '</svg>';
  }
  function card(m) {
    const T = L(), b = m.boost || {}, mons = (S && S.mons) || [];
    const twin = mons.find((x) => x.id !== m.id && x.coin === m.coin && x.stage === m.stage);
    const chips = ['<span>' + T.types[m.type] + '</span>', '<span>' + T.base + ' ' + m.power + '</span>'];
    if (b.ch) chips.push('<span class="' + (b.ch > 0 ? 'up' : 'dn') + '">📈 ' + T.coin24 + ' ' + pc(b.ch) + '</span>');
    if (b.heldb > 0) chips.push('<span class="up">💎 ' + T.held + ' +' + Math.round(b.heldb * 100) + ' %</span>');
    if (b.news) chips.push('<span class="up">🚀 ' + T.news + ' +20 %</span>');
    return '<div class="mc"><div class="mh"><div class="mav">' + monSvg(m) + '</div>'
      + '<div class="mn"><b>$' + ec(m.tk) + ' ' + '⭐'.repeat(m.stage) + '</b><small>' + T.lvl + ' ' + m.lvl + '/10 · ' + ec(m.name || '') + '</small></div>'
      + '<div class="mp"><b>' + m.epower + '</b><small>' + T.power + '</small></div></div>'
      + '<div class="chips">' + chips.join('') + '</div>'
      + '<div class="xb"><i style="width:' + Math.min(100, (m.xp / m.need) * 100) + '%"></i></div>'
      // 17 oct 2026 (Jeremy): the feed button shows the coin itself, a small round coin that spins
      + '<div class="ma"><button class="ghost" data-feed="' + m.id + '"><i class="mco" style="background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.55),' + ec(m.color) + ' 45%,' + ec(m.color) + ')">' + ec(m.emoji) + '</i>' + T.feed(ec(m.tk)) + (Number(m.price) > 0 ? '<small class="mml">' + T.meal(MEAL, fq(qty(m, MEAL)), ec(m.tk)) + '</small>' : '') + '</button>' + (twin ? '<button class="ghost" data-merge="' + m.id + ',' + twin.id + '">' + T.merge + '</button>' : '') + '</div></div>';
  }
  function render() {
    const T = L(), B = document.getElementById('monb'); if (!B || !S) return;
    B.removeAttribute('style');
    if (!S.ok) { B.innerHTML = '<p style="text-align:center;opacity:.7">' + ec(T.err) + '</p>'; return; }
    const fo = (a) => FOCUS ? [...a].sort((x, y) => (y.coin === FOCUS) - (x.coin === FOCUS)) : a;
    S.mons = fo(S.mons || []); S.eggs = fo(S.eggs || []);
    let h = '<button id="monfight"' + (S.fights > 0 && S.mons.length ? '' : ' disabled') + '>' + ec(S.fights > 0 ? T.fight(S.fights, S.fmax) : T.nofight) + '</button><div class="hint">' + T.hint + ' · <a href="#" id="mrlk">' + T.rules + '</a></div><div id="mfr"></div>';
    h += '<h4>' + T.eggs + '</h4><div class="eggs">';
    if (S.starter) h += '<button class="eg" data-starter="1">' + T.starter + '</button>';
    (S.eggs || []).forEach((e) => { h += '<button class="eg" data-egg="' + e.coin + '">🥚 ' + ec(e.emoji) + ' ' + ec(T.egg(e.tk)) + '</button>'; });
    if (!S.starter && !(S.eggs || []).length) h += '<small style="opacity:.6">' + T.noegg + '</small>';
    h += '</div><h4>' + T.team + ' (' + S.mons.length + ')</h4>' + (S.mons.length ? S.mons.map(card).join('') : '<small style="opacity:.6">' + T.none + '</small>');
    h += '<details class="mrl"><summary>' + T.rules + '</summary><ul>' + T.rl(S.fmax || 3).map((x) => '<li>' + x + '</li>').join('') + '</ul></details>';
    h += '<h4>' + T.board + '</h4>' + (S.board || []).map((r, i) => '<div class="br' + (r.me ? ' me' : '') + '"><span>' + (i + 1) + '. ' + ec(r.name) + '</span><span>' + r.pts + ' ' + T.pts + '</span></div>').join('');
    B.innerHTML = h;
    B.querySelector('#monfight').onclick = fight;
    B.querySelector('#mrlk').onclick = (e) => { e.preventDefault(); const d = B.querySelector('.mrl'); d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
    B.querySelectorAll('[data-egg],[data-starter]').forEach((x) => { x.onclick = () => act({ action: 'mon_hatch', coin: x.dataset.egg, starter: x.dataset.starter || '' }, T.hatched); });
    B.querySelectorAll('[data-feed]').forEach((x) => { x.onclick = () => feed(Number(x.dataset.feed)); });
    B.querySelectorAll('[data-merge]').forEach((x) => { const [a, b] = x.dataset.merge.split(','); x.onclick = () => act({ action: 'mon_merge', a, b }, T.merged); });
  }
  async function load() { const r = await call({ action: 'mon_state' }); S = r || { ok: false }; render(); }
  async function act(body, okMsg) {
    if (busy) return; busy = true; hp();
    const r = await call(body); busy = false;
    if (r && r.ok) { tst(okMsg); if (r.cash != null) { try { setCash(r.cash); } catch (e) {} } S = r.state || S; render(); return r; }
    const T = L(); tst(r && (r.error === 'no_coin' || r.error === 'cash') ? T.nocoin : r && r.error === 'max' ? T.max : T.err); return null;
  }
  function feed(id) {
    const T = L(), m = S.mons.find((x) => x.id === id); if (!m) return;
    let cash = 0; try { cash = Number(ME.cash) || 0; } catch (e) {}
    const v = prompt(T.feedq(m.tk, fp(Number(m.price) || 0)) + '\n(💵 ' + Math.floor(cash) + ' $)', String(Math.max(1, Math.min(MEAL, Math.floor(cash)))));
    const usd = Number(String(v || '').replace(',', '.'));
    if (usd > 0) act({ action: 'mon_feed', id, usd }, m.emoji + ' ' + T.fedq(fq(qty(m, usd)), m.tk, usd) + ' ' + T.fed);
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
