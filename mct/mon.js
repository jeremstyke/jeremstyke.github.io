// 17 oct 2026 (Jeremy): Meme Coin Monsters, HIDDEN inside Meme Coin Tycoon, by @jeremstyke. Only Jeremy and Doriane see it
// (the server answers 'hidden' to everyone else, ds_config mmon_allow). A monster is born from a coin held for $100 or more
// (one monster per coin; the daily egg of a coin he already has makes it grow), and is tied to its coin: its strength follows the coin's price over 24 h, grows with the coins held,
// and a pump news boosts it. Feeding it BUYS its coin with cash (the price goes up, the coins are eaten), merge two of the same stage, fight other players' teams (automatic, 3 a day).
// Data: Supabase function mct-ton, actions mon_state, mon_hatch, mon_feed, mon_merge, mon_fight (SQL mmon_api).
(() => {
  const ALLOW = [7057960224, 8844440894];
  const me = (() => { try { return Number(Telegram.WebApp.initDataUnsafe.user.id); } catch (e) { return 0; } })();
  if (!ALLOW.includes(me)) return;
  const TX = {
    fr: { t: 'Meme Coin Monsters', sec: 'Mode secret · visible par toi seulement', eggs: 'Œufs du jour', egg: (t) => 'Faire éclore $' + t, eggx: (t) => '+50 XP pour $' + t, grew: (t) => '🥚 Ton monstre $' + t + ' grandit : +50 XP !', starter: '🥚 Œuf de départ', noegg: 'Garde au moins 100 $ d\'un coin pour recevoir son œuf (1 par jour et par coin).', team: 'Mes monstres', none: 'Aucun monstre pour l\'instant.',
      fight: (n, m) => '⚔️ Combattre (' + n + '/' + m + ')', nofight: 'Plus de combat aujourd\'hui, reviens demain !', feed: (t) => 'Nourrir en $' + t, meal: (u, q, t) => '1 repas : ' + u + ' $ = ' + q + ' ' + t, merge: '🔀 Fusionner', lvl: 'Niv.', power: 'Force', base: 'base', coin24: 'coin 24 h', held: 'coins gardés', news: 'news',
      feedq: (t, px) => 'Nourrir en $' + t + ' : combien de $ veux-tu dépenser ?\n1 ' + t + ' = ' + px + ' $. Ça achète du ' + t + ' (le prix monte) et ton monstre le mange (1 $ = 1 XP).', fedq: (q, t, u) => 'Ton monstre a mangé ' + q + ' ' + t + ' (' + u + ' $) !', fed: 'Miam ! +XP et le coin monte 📈', merged: '🔀 Fusion réussie : stade supérieur !', hatched: '🐣 Un monstre est né !', win: '🏆 Victoire !', lose: '😵 Défaite…', vs: 'contre', rew: (v) => '+' + v + ' $', board: 'Classement de la semaine', pts: 'pts',
      fd: { eat: 'Il va manger', go: (u, t) => '🍽️ Nourrir : ' + u + ' $ de ' + t, up: '⬆️ Assez pour passer au niveau suivant !', left: (n) => 'Encore ' + n + ' XP avant le niveau suivant' },
      dt: { h: 'Pourquoi cette force', val: (p) => '💰 Valeur du coin (' + p + ' $)', ch: '📈 Variation sur 24 h', held: (v) => '💎 Tes coins gardés (' + v + ' $)', news: '🚀 News de pump (2 h)', base: '⭐ Force de base (niveau et stade)', tot: '💪 Force totale', inf: (h, a) => 'En combat : ' + h + ' PV et ' + a + ' d\'attaque', tip: 'Plus le prix du coin monte, plus ton monstre est fort.' },
      fw: '⚔️ Combattre', atk: '👊 Attaque', spe: '💥 Spéciale', def: '🛡️ Défense', rc: (n) => 'recharge ' + n, miss: 'Raté !', crit: 'Critique !', heal: (v) => '+' + v + ' PV',
      wild: (t) => 'Monstre sauvage $' + t, ofp: (n) => 'Monstre de ' + n, turn: (n) => 'Tour ' + n, yours: 'À toi de jouer', back: '↩️ Retour',
      lg: { atk: (a, d) => a + ' attaque : -' + d, spe: (a, d) => a + ' lance son attaque spéciale : -' + d, def: (a, h) => a + ' se protège et récupère ' + h + ' PV', miss: (a) => a + ' rate son attaque spéciale' }, err: 'Erreur, réessaie.', nocoin: 'Pas assez d\'argent pour ce repas.', max: 'Ton monstre est au maximum !', close: 'Fermer', go: 'Voir le coin', coinbtn: (t) => 'Le monstre de $' + t, coinsub: (t, n) => (n ? n + ' monstre' + (n > 1 ? 's' : '') + ' · ' : '') + 'Nourris-le en ' + t + ' et fais-le combattre', pfbtn: '🐉 Mes monstres',
      rules: '📖 Les règles', rl: (f) => [
        '🥚 <b>Œufs</b> : garde au moins 100 $ d\'un coin et tu reçois son œuf chaque jour. Un seul monstre par coin : le premier œuf le fait naître, les suivants le font grandir (+50 XP par jour).',
        '🪙 <b>Nourrir</b> : tu choisis combien de $ dépenser. Ça achète du coin (son prix monte) et ton monstre le mange : 1 $ = 1 XP. Les coins achetés sont mangés, ceux que tu avais déjà ne bougent pas.',
        '⬆️ <b>Niveaux</b> : la barre jaune se remplit avec l\'XP. Après le niveau 10, ton monstre évolue au stade suivant (⭐ en plus, cornes puis couronne), jusqu\'au stade 5.',
        '💪 <b>Force</b> : elle dépend du niveau et du stade, puis de ton coin : sa valeur (plus son prix est haut, plus le monstre est fort, de x0,6 à x2), sa hausse sur 24 h (de x0,5 à x2), les coins que tu gardes (+1 % par 100 $, jusqu\'à +50 %) et une news de pump (+20 % pendant 2 h).',
        '⚔️ <b>Combats</b> : ' + f + ' par jour. Ton monstre affronte le monstre d\'un autre joueur de ta force, ou un monstre sauvage. À chaque tour tu choisis : 👊 Attaque, 💥 Attaque spéciale (presque 2 fois plus forte, peut rater, puis 2 tours de recharge) ou 🛡️ Défense (60 % de dégâts en moins et +10 % de PV). Le premier à 0 PV perd. Victoire : +300 $, défaite : +50 $.',
        '🏆 <b>Classement</b> : tes victoires de la semaine donnent des points.'] },
    en: { t: 'Meme Coin Monsters', sec: 'Secret mode · only you can see it', eggs: 'Today\'s eggs', egg: (t) => 'Hatch $' + t, eggx: (t) => '+50 XP for $' + t, grew: (t) => '🥚 Your $' + t + ' monster grows: +50 XP!', starter: '🥚 Starter egg', noegg: 'Hold at least $100 of a coin to get its egg (1 a day per coin).', team: 'My monsters', none: 'No monster yet.',
      fight: (n, m) => '⚔️ Fight (' + n + '/' + m + ')', nofight: 'No fight left today, come back tomorrow!', feed: (t) => 'Feed with $' + t, meal: (u, q, t) => '1 meal: $' + u + ' = ' + q + ' ' + t, merge: '🔀 Merge', lvl: 'Lv.', power: 'Power', base: 'base', coin24: 'coin 24 h', held: 'coins held', news: 'news',
      feedq: (t, px) => 'Feed with $' + t + ': how many $ do you want to spend?\n1 ' + t + ' = $' + px + '. It buys ' + t + ' (the price goes up) and your monster eats it ($1 = 1 XP).', fedq: (q, t, u) => 'Your monster ate ' + q + ' ' + t + ' ($' + u + ')!', fed: 'Yum! +XP and the coin goes up 📈', merged: '🔀 Merged: next stage!', hatched: '🐣 A monster is born!', win: '🏆 Victory!', lose: '😵 Defeat…', vs: 'vs', rew: (v) => '+$' + v, board: 'This week\'s ranking', pts: 'pts',
      fd: { eat: 'It will eat', go: (u, t) => '🍽️ Feed: $' + u + ' of ' + t, up: '⬆️ Enough to reach the next level!', left: (n) => n + ' XP to the next level' },
      dt: { h: 'Why this power', val: (p) => '💰 Coin value ($' + p + ')', ch: '📈 24 h change', held: (v) => '💎 Your coins held ($' + v + ')', news: '🚀 Pump news (2 h)', base: '⭐ Base power (level and stage)', tot: '💪 Total power', inf: (h, a) => 'In a fight: ' + h + ' HP and ' + a + ' attack', tip: 'The higher the coin price, the stronger your monster.' },
      fw: '⚔️ Fight', atk: '👊 Attack', spe: '💥 Special', def: '🛡️ Defend', rc: (n) => 'recharging ' + n, miss: 'Missed!', crit: 'Critical!', heal: (v) => '+' + v + ' HP',
      wild: (t) => 'Wild monster $' + t, ofp: (n) => n + '\'s monster', turn: (n) => 'Turn ' + n, yours: 'Your move', back: '↩️ Back',
      lg: { atk: (a, d) => a + ' attacks: -' + d, spe: (a, d) => a + ' uses its special attack: -' + d, def: (a, h) => a + ' defends and heals ' + h + ' HP', miss: (a) => a + ' misses its special attack' }, err: 'Error, try again.', nocoin: 'Not enough cash for this meal.', max: 'Your monster is at the maximum!', close: 'Close', go: 'See the coin', coinbtn: (t) => 'The monster of $' + t, coinsub: (t, n) => (n ? n + ' monster' + (n > 1 ? 's' : '') + ' · ' : '') + 'Feed it with ' + t + ' and make it fight', pfbtn: '🐉 My monsters',
      rules: '📖 Rules', rl: (f) => [
        '🥚 <b>Eggs</b>: hold at least $100 of a coin and you get its egg every day. One monster per coin: the first egg hatches it, the next ones make it grow (+50 XP a day).',
        '🪙 <b>Feeding</b>: you choose how many $ to spend. It buys the coin (its price goes up) and your monster eats it: $1 = 1 XP. The coins bought are eaten, the ones you already had stay.',
        '⬆️ <b>Levels</b>: the yellow bar fills with XP. After level 10, your monster evolves to the next stage (one more ⭐, horns then a crown), up to stage 5.',
        '💪 <b>Power</b>: it comes from level and stage, then from your coin: its value (the higher its price, the stronger the monster, x0.6 to x2), its 24 h change (x0.5 to x2), the coins you hold (+1% per $100, up to +50%) and a pump news (+20% for 2 h).',
        '⚔️ <b>Fights</b>: ' + f + ' a day. Your monster faces another player\'s monster of your strength, or a wild monster. Each turn you choose: 👊 Attack, 💥 Special attack (almost twice as strong, can miss, then 2 turns to recharge) or 🛡️ Defend (60% less damage and +10% HP). The first at 0 HP loses. Victory: +$300, defeat: +$50.',
        '🏆 <b>Ranking</b>: your wins of the week give points.'] },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l === 'fr' ? 'fr' : 'en']; };
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
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
    + '.mfo{position:fixed;inset:0;z-index:10060;background:rgba(5,3,15,.7);display:flex;align-items:flex-end;justify-content:center}'
    + '.mfs,.mfs *{box-sizing:border-box}.mfs{width:100%;max-width:520px;background:linear-gradient(180deg,#24164d,#140c2c 45%);border-radius:22px 22px 0 0;padding:10px 16px calc(18px + env(safe-area-inset-bottom));color:#fff;animation:mfu .22s ease-out}@keyframes mfu{from{transform:translateY(40px);opacity:.5}}'
    + '.mfs .grab{width:42px;height:5px;border-radius:9px;background:rgba(255,255,255,.25);margin:0 auto 12px}.mfh{display:flex;gap:12px;align-items:center}.mfa{width:58px;height:58px;flex:none}.mfa svg{width:100%;height:100%;overflow:visible;animation:mbob 2.4s ease-in-out infinite}'
    + '.mfh b{display:block;font-size:18px}.mfh small{display:block;font-size:12px;opacity:.7;margin-top:2px}'
    + '.mfv{display:flex;align-items:center;gap:6px;margin:14px 0 10px;padding:10px 14px;border-radius:16px;background:rgba(0,0,0,.3);border:1px solid rgba(255,212,59,.35)}.mfv span{font-size:26px;font-weight:800;color:#ffd43b}.mfv input{flex:1;min-width:0;background:none;border:0;outline:0;color:#fff;font-size:30px;font-weight:900}'
    + '.mfp{display:flex;gap:6px}.mfp button{flex:1;padding:10px 0;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#fff;font-weight:800;font-size:14px;cursor:pointer}.mfp button.on{background:#ffd43b;color:#1d0f00;border-color:#ffd43b}'
    + '.mfr{display:flex;gap:8px;margin:12px 0 4px}.mfr div{flex:1;padding:10px;border-radius:14px;background:rgba(255,255,255,.05);text-align:center}.mfr small{display:block;font-size:11px;opacity:.7}.mfr b{display:block;font-size:17px;margin-top:3px;white-space:nowrap}'
    + '.mfr .mco{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;font-size:11px;font-style:normal;vertical-align:middle;margin-right:5px;box-shadow:0 0 0 2px #ffd43b;animation:mspin 3s ease-in-out infinite}'
    + '.mfn{display:block;text-align:center;font-size:12px;color:#ffd43b;min-height:16px;margin:4px 0 8px}'
    + '.mfgo{display:block;width:100%;border:0;border-radius:16px;padding:15px;font-weight:900;font-size:16px;color:#1d0f00;background:linear-gradient(90deg,#ffd43b,#ffb300);box-shadow:0 5px 0 #b37d00;cursor:pointer}.mfgo:disabled{opacity:.45}'
    + '.mfc{text-align:center;opacity:.6;font-size:13px;padding:10px 4px 0;cursor:pointer}'
    + '#monm .mav{cursor:pointer}#monm .mdt{margin:10px 0 0;padding:10px 12px;border-radius:12px;background:rgba(0,0,0,.25);border:1px solid rgba(255,212,59,.25)}#monm .mdt small{display:block;font-size:11px;opacity:.7;margin:4px 0}'
    + '#monm .dr{display:flex;justify-content:space-between;gap:8px;font-size:13px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.06)}#monm .dr.tot{border:0;font-size:14px}#monm .dr.tot b{color:#ffd43b}'
    + '#monm .res{text-align:center;font-size:22px;font-weight:800;margin:12px 0 8px}#monm .mfw{flex:.7}'
    + '#monm .arena{position:relative;border-radius:18px;padding:12px;background:radial-gradient(ellipse at 50% 120%,rgba(125,255,107,.18),transparent 60%),linear-gradient(180deg,#24164d,#120a28);border:1px solid rgba(255,255,255,.1)}'
    + '#monm .bs{display:flex;align-items:center;gap:10px}#monm .bs.op{flex-direction:row}#monm .bs.me{flex-direction:row-reverse;text-align:right}'
    + '#monm .bi{flex:1;min-width:0}#monm .bi b{display:block;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#monm .bi small{display:block;font-size:11px;opacity:.7}'
    + '#monm .hb{height:9px;border-radius:9px;background:rgba(255,255,255,.12);overflow:hidden;margin:4px 0 2px}#monm .hb i{display:block;height:100%;transition:width .5s ease,background .5s}'
    + '#monm .bm{position:relative;width:96px;height:96px;flex:none;animation:mbob 2.4s ease-in-out infinite}#monm .bm .fl{display:block;width:100%;height:100%}#monm .bs.op .fl{transform:scaleX(-1)}#monm .bm svg{width:100%;height:100%;overflow:visible}'
    + '#monm .bs.lunge .bm svg{animation:blunge .4s ease}#monm .bs.lunge2 .bm svg{animation:blunge2 .5s ease}#monm .bs.hit .bm svg{animation:bhit .45s ease}#monm .bs.shield .bm svg{filter:drop-shadow(0 0 10px #2ee6ff)}'
    + '@keyframes blunge{50%{transform:translateX(26px) scale(1.08)}}@keyframes blunge2{30%{transform:translateX(-6px) scale(.95)}60%{transform:translateX(34px) scale(1.18)}}'
    + '@keyframes bhit{0%,100%{transform:none;filter:none}20%{transform:translateX(-7px);filter:brightness(2) saturate(0)}50%{transform:translateX(6px)}80%{transform:translateX(-3px)}}'
    + '#monm .fx{position:absolute;left:50%;top:-6px;transform:translateX(-50%);font-weight:900;font-size:16px;white-space:nowrap;opacity:0;pointer-events:none}'
    + '#monm .fx.dn{color:#ff5d6b;animation:bfx .9s ease forwards}#monm .fx.up{color:#7dff6b;animation:bfx .9s ease forwards}@keyframes bfx{0%{opacity:0;margin-top:10px}20%{opacity:1}100%{opacity:0;margin-top:-26px}}'
    + '#monm .blog{text-align:center;font-size:13px;min-height:36px;padding:8px 4px;opacity:.9}'
    + '#monm .bact{display:flex;gap:8px;margin:12px 0 0}#monm .bact button{flex:1;margin:0;padding:13px 4px;border:0;border-radius:14px;font-weight:800;font-size:14px;color:#fff;cursor:pointer;background:linear-gradient(135deg,#ff6b6b,#ff3d71)}'
    + '#monm .bact button[data-mv=spe]{background:linear-gradient(135deg,#ffb300,#ff6b00)}#monm .bact button[data-mv=def]{background:linear-gradient(135deg,#2ee6ff,#3b82f6)}#monm .bact button:disabled{opacity:.45}#monm .bact small{display:block;font-size:10px;font-weight:600}'
    + '#monm .bback{display:block;width:100%;margin:6px 0 0}'
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
  const xf = (v) => 'x' + Number(v || 1).toFixed(2).replace(/\.?0+$/, '');
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
    const chips = ['<span class="' + ((b.val || 1) >= 1 ? 'up' : 'dn') + '">💰 ' + xf(b.val) + '</span>', '<span>' + T.base + ' ' + m.power + '</span>'];
    if (b.ch) chips.push('<span class="' + (b.ch > 0 ? 'up' : 'dn') + '">📈 ' + T.coin24 + ' ' + pc(b.ch) + '</span>');
    if (b.heldb > 0) chips.push('<span class="up">💎 ' + T.held + ' +' + Math.round(b.heldb * 100) + ' %</span>');
    if (b.news) chips.push('<span class="up">🚀 ' + T.news + ' +20 %</span>');
    const D = T.dt;
    const row = (l, v, c) => '<div class="dr"><span>' + l + '</span><b' + (c ? ' class="' + c + '"' : '') + '>' + v + '</b></div>';
    const det = '<div class="mdt" id="mdt' + m.id + '" hidden><small>' + D.h + '</small>'
      + row(D.base, m.power)
      + row(ec(D.val(fp(Number(b.px || m.price || 0)))), xf(b.val), (b.val || 1) >= 1 ? 'up' : 'dn')
      + row(D.ch + ' (' + pc(b.ch || 0) + ')', xf(b.mult), (b.mult || 1) >= 1 ? 'up' : 'dn')
      + row(ec(D.held(Math.round(Number(b.held || m.held || 0)))), '+' + Math.round((b.heldb || 0) * 100) + ' %', 'up')
      + (b.news ? row(D.news, '+20 %', 'up') : '')
      + '<div class="dr tot"><span>' + D.tot + '</span><b>' + m.power + ' ' + xf(b.f) + ' = ' + m.epower + '</b></div>'
      + '<small>' + D.inf(Math.round(m.hp * (b.f || 1) * 1.6), Math.round(m.atk * (b.f || 1))) + '</small><small>💡 ' + D.tip + '</small></div>';
    return '<div class="mc"><div class="mh"><div class="mav" data-det="' + m.id + '">' + monSvg(m) + '</div>'
      + '<div class="mn"><b>$' + ec(m.tk) + ' ' + '⭐'.repeat(m.stage) + '</b><small>' + T.lvl + ' ' + m.lvl + '/10 · ' + ec(m.name || '') + '</small></div>'
      + '<div class="mp"><b>' + m.epower + '</b><small>' + T.power + '</small></div></div>'
      + '<div class="chips">' + chips.join('') + '</div>' + det
      + '<div class="xb"><i style="width:' + Math.min(100, (m.xp / m.need) * 100) + '%"></i></div>'
      // 17 oct 2026 (Jeremy): the feed button shows the coin itself, a small round coin that spins
      + '<div class="ma"><button class="ghost" data-feed="' + m.id + '"><i class="mco" style="background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.55),' + ec(m.color) + ' 45%,' + ec(m.color) + ')">' + ec(m.emoji) + '</i>' + T.feed(ec(m.tk)) + (Number(m.price) > 0 ? '<small class="mml">' + T.meal(MEAL, fq(qty(m, MEAL)), ec(m.tk)) + '</small>' : '') + '</button>' + '<button class="ghost mfw" data-fight="' + m.id + '"' + (S.fights > 0 ? '' : ' disabled') + '>' + T.fw + '</button>' + '</div></div>';
  }
  function render() {
    const T = L(), B = document.getElementById('monb'); if (!B || !S) return;
    B.removeAttribute('style');
    if (!S.ok) { B.innerHTML = '<p style="text-align:center;opacity:.7">' + ec(T.err) + '</p>'; return; }
    const fo = (a) => FOCUS ? [...a].sort((x, y) => (y.coin === FOCUS) - (x.coin === FOCUS)) : a;
    S.mons = fo(S.mons || []); S.eggs = fo(S.eggs || []);
    let h = '<button id="monfight"' + (S.fights > 0 && S.mons.length ? '' : ' disabled') + '>' + ec(S.fights > 0 ? T.fight(S.fights, S.fmax) : T.nofight) + '</button><div class="hint"><a href="#" id="mrlk">' + T.rules + '</a></div>';
    h += '<h4>' + T.eggs + '</h4><div class="eggs">';
    if (S.starter) h += '<button class="eg" data-starter="1">' + T.starter + '</button>';
    (S.eggs || []).forEach((e) => { h += '<button class="eg" data-egg="' + e.coin + '" data-tk="' + ec(e.tk) + '"' + (e.has ? ' data-has="1"' : '') + '>🥚 ' + ec(e.emoji) + ' ' + ec(e.has ? T.eggx(e.tk) : T.egg(e.tk)) + '</button>'; });
    if (!S.starter && !(S.eggs || []).length) h += '<small style="opacity:.6">' + T.noegg + '</small>';
    h += '</div><h4>' + T.team + ' (' + S.mons.length + ')</h4>' + (S.mons.length ? S.mons.map(card).join('') : '<small style="opacity:.6">' + T.none + '</small>');
    h += '<details class="mrl"><summary>' + T.rules + '</summary><ul>' + T.rl(S.fmax || 3).map((x) => '<li>' + x + '</li>').join('') + '</ul></details>';
    h += '<h4>' + T.board + '</h4>' + (S.board || []).map((r, i) => '<div class="br' + (r.me ? ' me' : '') + '"><span>' + (i + 1) + '. ' + ec(r.name) + '</span><span>' + r.pts + ' ' + T.pts + '</span></div>').join('');
    B.innerHTML = h;
    B.querySelector('#monfight').onclick = () => fight(0);
    B.querySelectorAll('[data-det]').forEach((x) => { x.onclick = () => { hp('light'); const d = document.getElementById('mdt' + x.dataset.det); if (d) d.hidden = !d.hidden; }; });
    B.querySelectorAll('[data-fight]').forEach((x) => { x.onclick = () => fight(Number(x.dataset.fight)); });
    B.querySelector('#mrlk').onclick = (e) => { e.preventDefault(); const d = B.querySelector('.mrl'); d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
    B.querySelectorAll('[data-egg],[data-starter]').forEach((x) => { x.onclick = () => act({ action: 'mon_hatch', coin: x.dataset.egg, starter: x.dataset.starter || '' }, x.dataset.has ? T.grew(x.dataset.tk) : T.hatched); });
    B.querySelectorAll('[data-feed]').forEach((x) => { x.onclick = () => feed(Number(x.dataset.feed)); });
  }
  async function load() { const r = await call({ action: 'mon_state' }); S = r || { ok: false }; render(); }
  async function act(body, okMsg) {
    if (busy) return; busy = true; hp();
    const r = await call(body); busy = false;
    if (r && r.ok) { tst(okMsg); if (r.cash != null) { try { setCash(r.cash); } catch (e) {} } S = r.state || S; render(); return r; }
    const T = L(); tst(r && (r.error === 'no_coin' || r.error === 'cash') ? T.nocoin : r && r.error === 'max' ? T.max : T.err); return null;
  }
  // 17 oct 2026 (Jeremy): feeding in a sheet of the game (no more browser prompt): amounts in one tap, coins and XP shown live
  function feed(id) {
    const T = L(), F = T.fd, m = S.mons.find((x) => x.id === id); if (!m) return;
    let cash = 0; try { cash = Number(ME.cash) || 0; } catch (e) {}
    const px = Number(m.price) || 0, need = Math.max(0, (m.need || 0) - (m.xp || 0));
    const presets = [10, 50, 100, 500].filter((v) => v <= cash || v === 10);
    let usd = Math.max(1, Math.min(MEAL, Math.floor(cash)));
    const d = document.createElement('div'); d.className = 'mfo';
    d.innerHTML = '<div class="mfs"><div class="grab"></div><div class="mfh"><span class="mfa">' + monSvg(m) + '</span><div><b>' + ec(T.feed(m.tk)) + '</b><small>1 ' + ec(m.tk) + ' = ' + fp(px) + ' $ · 💵 ' + Math.floor(cash) + ' $</small></div></div>'
      + '<div class="mfv"><span>$</span><input id="mfin" inputmode="decimal" value="' + usd + '"></div>'
      + '<div class="mfp">' + presets.map((v) => '<button data-u="' + v + '">' + v + ' $</button>').join('') + (cash > 0 ? '<button data-u="max">MAX</button>' : '') + '</div>'
      + '<div class="mfr"><div><small>' + F.eat + '</small><b id="mfq"></b></div><div><small>XP</small><b id="mfx"></b></div></div>'
      + '<small class="mfn" id="mfn"></small>'
      + '<button class="mfgo" id="mfgo"></button><div class="mfc" id="mfc">' + T.close + '</div></div>';
    document.body.appendChild(d);
    const inp = d.querySelector('#mfin');
    const upd = () => {
      usd = Math.max(0, Number(String(inp.value || '').replace(',', '.')) || 0);
      d.querySelector('#mfq').innerHTML = '<i class="mco" style="background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.55),' + ec(m.color) + ' 45%,' + ec(m.color) + ')">' + ec(m.emoji) + '</i>' + fq(qty(m, usd)) + ' ' + ec(m.tk);
      d.querySelector('#mfx').textContent = '+' + Math.floor(usd);
      d.querySelector('#mfn').textContent = usd > cash ? T.nocoin : need > 0 ? (usd >= need ? F.up : F.left(Math.ceil(need))) : '';
      const go = d.querySelector('#mfgo'); go.disabled = !(usd > 0 && usd <= cash); go.textContent = F.go(Math.floor(usd) || 0, m.tk);
      d.querySelectorAll('[data-u]').forEach((x) => x.classList.toggle('on', (x.dataset.u === 'max' ? Math.floor(cash) : Number(x.dataset.u)) === usd));
    };
    inp.oninput = upd;
    d.querySelectorAll('[data-u]').forEach((x) => { x.onclick = () => { hp('light'); inp.value = x.dataset.u === 'max' ? Math.floor(cash) : x.dataset.u; upd(); }; });
    const close = () => d.remove();
    d.onclick = (e) => { if (e.target === d || e.target.id === 'mfc') close(); };
    d.querySelector('#mfgo').onclick = () => { if (!(usd > 0 && usd <= cash)) return; close(); act({ action: 'mon_feed', id, usd }, m.emoji + ' ' + T.fedq(fq(qty(m, usd)), m.tk, usd) + ' ' + T.fed); };
    upd();
  }
  // 17 oct 2026 (Jeremy): real fights, turn by turn (no more fire / plant / water). The server plays the opponent (mon_fight, mon_move).
  let BT = null;
  const fname = (x, b, me) => me ? '$' + x.tk : (b.opn ? L().ofp(b.opn) : L().wild(x.tk));
  function side(x, b, me) {
    const pc = Math.max(0, Math.min(100, (x.hp / x.max) * 100));
    return '<div class="bs ' + (me ? 'me' : 'op') + '" id="bs' + (me ? 'm' : 'o') + '"><div class="bi"><b>' + ec(fname(x, b, me)) + ' ' + '⭐'.repeat(x.stage || 1) + '</b><small>' + L().lvl + ' ' + (x.lvl || 1) + '</small>'
      + '<div class="hb"><i style="width:' + pc + '%;background:' + (pc > 50 ? '#7dff6b' : pc > 20 ? '#ffd43b' : '#ff5d6b') + '"></i></div><small class="hpn">' + Math.round(x.hp) + ' / ' + Math.round(x.max) + '</small></div>'
      + '<div class="bm"><span class="fl">' + monSvg({ coin: x.coin, color: x.color, emoji: x.emoji, stage: x.stage }) + '</span><span class="fx"></span></div></div>';
  }
  function drawBattle(b) {
    const T = L(), B = document.getElementById('monb'); if (!B) return;
    const cd = (b.me && b.me.cd) || 0;
    B.innerHTML = '<div class="arena">' + side(b.op, b, false) + '<div class="blog" id="blog">' + ec(b.done ? '' : T.turn((b.turn || 0) + 1) + ' · ' + T.yours) + '</div>' + side(b.me, b, true) + '</div>'
      + (b.done ? '<div class="res">' + (b.win ? T.win : T.lose) + ' <span style="color:#7dff6b">' + T.rew(b.reward) + '</span></div><button class="ghost bback" id="bback">' + T.back + '</button>'
        : '<div class="bact"><button data-mv="atk">' + T.atk + '</button><button data-mv="spe"' + (cd > 0 ? ' disabled' : '') + '>' + T.spe + (cd > 0 ? '<small>' + T.rc(cd) + '</small>' : '') + '</button><button data-mv="def">' + T.def + '</button></div>');
    B.querySelectorAll('[data-mv]').forEach((x) => { x.onclick = () => move(x.dataset.mv); });
    const bb = B.querySelector('#bback'); if (bb) bb.onclick = () => { BT = null; load(); };
  }
  async function fight(id) {
    if (busy) return; busy = true; hp('medium');
    const r = await call({ action: 'mon_fight', id: id || '' }); busy = false;
    if (!r || !r.ok || !r.battle) { tst(L().err); return; }
    BT = r.battle; if (r.state) S = r.state; drawBattle(BT);
  }
  const wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
  async function move(mv) {
    if (busy || !BT) return; busy = true; hp('light');
    document.querySelectorAll('#monb [data-mv]').forEach((x) => { x.disabled = true; });
    const r = await call({ action: 'mon_move', fid: BT.fid, mv }); 
    if (!r || !r.ok || !r.battle) { busy = false; tst(L().err); drawBattle(BT); return; }
    const T = L(), nb = r.battle, cur = JSON.parse(JSON.stringify(BT));
    for (const e of nb.ev || []) {
      const me = e.w === 'me', att = document.getElementById(me ? 'bsm' : 'bso'), def = document.getElementById(me ? 'bso' : 'bsm');
      const an = me ? '$' + cur.me.tk : fname(cur.op, cur, false), lg = document.getElementById('blog');
      if (e.mv === 'def') {
        const t = me ? cur.me : cur.op; t.hp = Math.min(t.max, t.hp + (e.heal || 0));
        if (att) { att.classList.add('shield'); const f = att.querySelector('.fx'); if (f) { f.textContent = '🛡️ ' + T.heal(e.heal); f.className = 'fx up'; } }
        if (lg) lg.textContent = T.lg.def(an, e.heal); hp('light');
      } else {
        if (att) att.classList.add(e.mv === 'spe' ? 'lunge2' : 'lunge');
        await wait(260);
        const t = me ? cur.op : cur.me; t.hp = Math.max(0, t.hp - (e.dmg || 0));
        if (def) { if (!e.miss) def.classList.add('hit'); const f = def.querySelector('.fx'); if (f) { f.textContent = e.miss ? T.miss : '-' + e.dmg + (e.crit ? ' ' + T.crit : ''); f.className = 'fx ' + (e.miss ? 'up' : 'dn'); } }
        if (lg) lg.textContent = e.miss ? T.lg.miss(an) : T.lg[e.mv](an, e.dmg) + (e.crit ? ' (' + T.crit + ')' : '');
        hp(e.miss ? 'light' : e.crit ? 'heavy' : 'medium');
      }
      const upd = (id, x) => { const el = document.getElementById(id); if (!el) return; const pc = Math.max(0, Math.min(100, (x.hp / x.max) * 100)); const i = el.querySelector('.hb i'); if (i) { i.style.width = pc + '%'; i.style.background = pc > 50 ? '#7dff6b' : pc > 20 ? '#ffd43b' : '#ff5d6b'; } const n = el.querySelector('.hpn'); if (n) n.textContent = Math.round(x.hp) + ' / ' + Math.round(x.max); };
      upd('bsm', cur.me); upd('bso', cur.op);
      await wait(900);
      document.querySelectorAll('#monb .bs').forEach((x) => { x.classList.remove('lunge', 'lunge2', 'hit', 'shield'); const f = x.querySelector('.fx'); if (f) f.className = 'fx'; });
    }
    BT = nb; busy = false;
    if (nb.done) { hp(nb.win ? 'success' : 'error'); if (r.cash != null) { try { setCash(r.cash); } catch (e) {} } if (r.state) S = r.state; }
    drawBattle(BT);
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
