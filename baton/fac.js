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
      mach: '⚙️ Machine', store: '🏬 Entrepôt', lv: 'niv.', max: 'MAX', cap: function (h) { var m = Math.round(Number(h) * 60); return Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) : '') + ' de stock'; },
      goal: '🎯 Prochain objectif', goalT: function (w, n) { return w + ' · encore ' + n + ' 📦'; }, goalOk: function (w) { return w + ' : c\'est prêt, améliore !'; },
      conv: '💱 Échanger contre des $BATON', convS: function (r, d, c) { return '1 📦 = ' + r + ' $BATON · aujourd\'hui ' + d + ' / ' + c; }, convB: function (n, b) { return 'Échanger ' + n + ' 📦 → +' + b + ' $BATON'; },
      friends: function (n) { return '👥 Ouvriers : +10 % de production par ami invité (' + n + '/10)'; }, tasks: function (n) { return '🎯 Chaque tâche sponsorisée = +' + n + ' 📦'; },
      ok: { collect: function (n) { return '📦 +' + n + ' caisses !'; }, lvl: function (l) { return '⚙️ Machine niveau ' + l + ' !'; }, store: '🏬 Entrepôt agrandi !', conv: function (b) { return '💱 +' + b + ' $BATON sur ton solde !'; }, boost: '⚡ Turbo activé pendant 1 h !' },
      err: { crates: 'Pas assez de caisses.', cap: 'Limite d\'échange du jour atteinte.', min: 'Minimum 100 caisses.', max: 'Niveau maximum.', limit: 'Plus de turbo aujourd\'hui.', active: 'Le turbo est déjà actif.', novid: 'Vidéo pas terminée.', net: 'Problème de connexion.' },
      belt: '🛤️ Tapis roulant', beltS: function (l) { return 'Caisses dorées plus souvent' + (l > 1 ? ', +' + (5 * (l - 1)) + ' par jour' : ''); }, truck: '🚚 Camion', truckS: function (a, b) { return '1 📦 = ' + a + ' $BATON' + (b ? ' → ' + b : ''); },
      streak: function (n) { return '🔥 ' + n + ' jour' + (n > 1 ? 's' : '') + ' d\'affilée' + (n > 1 ? ' · +' + ((n - 1) * 10) + ' % de production' : ''); }, streak0: '🔥 Récolte chaque jour : +10 % de production par jour d\'affilée (jusqu\'à +60 %)',
      week: '🏆 Classement de la semaine', weekS: function (a, b, c) { return 'Le plus de caisses gagne : 🥇 ' + a + ' · 🥈 ' + b + ' · 🥉 ' + c + ' $BATON, chaque lundi'; }, weekMe: function (r, m) { return 'Toi : ' + r + 'e · ' + m + ' 📦'; }, weekNone: 'Personne encore cette semaine : sois le premier !',
      usd: function (u) { return '≈ ' + u + ' $ en vrais USDT dans la boutique'; }, pass: function (n) { return '🏃 Chaque bâton passé = +' + n + ' 📦'; },
      adT: '📢 Tâche sponsorisée', adR: function (n) { return '+' + n + ' 📦 et des $BATON'; }, adGoal: '🎯 10 tâches dans la journée = +500 📦 de bonus dans l\'usine', adGo: 'Faire', adClaim: 'Récupérer', adOk: function (n) { return '📢 Tâche faite : +' + n + ' 📦 !'; }, adWait: '⏳ Prochaine tâche sponsorisée dans', adDone: '✅ Tes tâches sponsorisées du jour sont faites, reviens demain', adNone: '⏳ Pas de tâche disponible pour l\'instant, nouvel essai dans 30 s',
      chT: '🎯 Défis du jour', chM: { collect: function (t) { return 'Récolte ' + t + ' fois'; }, tap: function (t) { return 'Tape ' + t + ' fois l\'usine'; }, gold: function (t) { return 'Attrape ' + t + ' caisses dorées'; }, up: function (t) { return 'Fais ' + t + ' amélioration' + (t > 1 ? 's' : ''); }, conv: function (t) { return 'Échange tes caisses ' + t + ' fois'; }, boost: function (t) { return 'Active le turbo ' + t + ' fois'; } }, chGet: function (n) { return '+' + n + ' 📦'; }, chest: function (n) { return '🎁 Coffre des 3 défis : +' + n + ' 📦'; }, chestOk: '✅ Coffre ouvert, nouveaux défis demain', chestLock: function (k) { return '🔒 Coffre : ' + k + '/3 défis'; },
      troT: '🏅 Trophées', troM: { made: function (t) { return t + ' caisses produites'; }, lvl: function (t) { return 'Machine niv. ' + t; }, store: function (t) { return 'Entrepôt niv. ' + t; }, belt: function (t) { return 'Tapis niv. ' + t; }, truck: function (t) { return 'Camion niv. ' + t; }, streak_best: function (t) { return t + ' jours d\'affilée'; }, gold_total: function (t) { return t + ' caisses dorées'; } }, troN: function (a, b) { return a + ' / ' + b + ' débloqués'; },
      game: '🏃 Ouvrir Pass The Baton', close: 'Fermer', gold: function (n) { return '🎁 CAISSE DORÉE +' + n + ' 📦 !'; }, combo: function (n) { return '🔥 COMBO x' + n; }, goldHint: '🎁 Une caisse dorée ! Tape-la vite !' },
    en: { t: 'Baton Factory', crates: 'crates', made: 'Waiting', full: '⚠️ Warehouse full: collect now!', fullIn: function (h) { return 'Full in ' + h; },
      collect: function (n) { return '📦 Collect +' + n; }, nothing: '⏳ Producing…', perh: '/h', tap: function (n, m) { return '👆 Tap the factory: +1 📦 (' + n + '/' + m + ' today)'; }, tapDone: '👆 Your hands are tired, come back tomorrow!',
      boost: function (n) { return '📺 Turbo x2 for 1 h (' + n + ')'; }, boostOn: function (s) { return '⚡ TURBO x2 · ' + s; }, boostNone: 'No more turbo today',
      mach: '⚙️ Machine', store: '🏬 Warehouse', lv: 'lvl', max: 'MAX', cap: function (h) { var m = Math.round(Number(h) * 60); return Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) : '') + ' of stock'; },
      goal: '🎯 Next goal', goalT: function (w, n) { return w + ' · ' + n + ' 📦 to go'; }, goalOk: function (w) { return w + ': ready, upgrade it!'; },
      conv: '💱 Trade for $BATON', convS: function (r, d, c) { return '1 📦 = ' + r + ' $BATON · today ' + d + ' / ' + c; }, convB: function (n, b) { return 'Trade ' + n + ' 📦 → +' + b + ' $BATON'; },
      friends: function (n) { return '👥 Workers: +10% production per invited friend (' + n + '/10)'; }, tasks: function (n) { return '🎯 Each sponsored task = +' + n + ' 📦'; },
      ok: { collect: function (n) { return '📦 +' + n + ' crates!'; }, lvl: function (l) { return '⚙️ Machine level ' + l + '!'; }, store: '🏬 Warehouse bigger!', conv: function (b) { return '💱 +' + b + ' $BATON on your balance!'; }, boost: '⚡ Turbo on for 1 hour!' },
      err: { crates: 'Not enough crates.', cap: 'Daily trade limit reached.', min: 'At least 100 crates.', max: 'Max level.', limit: 'No more turbo today.', active: 'Turbo is already on.', novid: 'Video not finished.', net: 'Connection problem.' },
      belt: '🛤️ Conveyor belt', beltS: function (l) { return 'Golden crates more often' + (l > 1 ? ', +' + (5 * (l - 1)) + ' a day' : ''); }, truck: '🚚 Truck', truckS: function (a, b) { return '1 📦 = ' + a + ' $BATON' + (b ? ' → ' + b : ''); },
      streak: function (n) { return '🔥 ' + n + ' day' + (n > 1 ? 's' : '') + ' in a row' + (n > 1 ? ' · +' + ((n - 1) * 10) + '% production' : ''); }, streak0: '🔥 Collect every day: +10% production per day in a row (up to +60%)',
      week: '🏆 Weekly ranking', weekS: function (a, b, c) { return 'Most crates wins: 🥇 ' + a + ' · 🥈 ' + b + ' · 🥉 ' + c + ' $BATON, every Monday'; }, weekMe: function (r, m) { return 'You: #' + r + ' · ' + m + ' 📦'; }, weekNone: 'Nobody yet this week: be the first!',
      usd: function (u) { return '≈ $' + u + ' in real USDT in the shop'; }, pass: function (n) { return '🏃 Each baton passed = +' + n + ' 📦'; },
      adT: '📢 Sponsored task', adR: function (n) { return '+' + n + ' 📦 and $BATON'; }, adGoal: '🎯 10 tasks in a day = +500 📦 bonus in the factory', adGo: 'Do it', adClaim: 'Claim', adOk: function (n) { return '📢 Task done: +' + n + ' 📦!'; }, adWait: '⏳ Next sponsored task in', adDone: '✅ Your sponsored tasks of the day are done, come back tomorrow', adNone: '⏳ No task right now, trying again in 30 s',
      chT: '🎯 Daily challenges', chM: { collect: function (t) { return 'Collect ' + t + ' times'; }, tap: function (t) { return 'Tap the factory ' + t + ' times'; }, gold: function (t) { return 'Catch ' + t + ' golden crates'; }, up: function (t) { return 'Make ' + t + ' upgrade' + (t > 1 ? 's' : ''); }, conv: function (t) { return 'Trade your crates ' + t + ' time' + (t > 1 ? 's' : ''); }, boost: function (t) { return 'Turn on the turbo ' + t + ' time' + (t > 1 ? 's' : ''); } }, chGet: function (n) { return '+' + n + ' 📦'; }, chest: function (n) { return '🎁 3-challenge chest: +' + n + ' 📦'; }, chestOk: '✅ Chest opened, new challenges tomorrow', chestLock: function (k) { return '🔒 Chest: ' + k + '/3 challenges'; },
      troT: '🏅 Trophies', troM: { made: function (t) { return t + ' crates made'; }, lvl: function (t) { return 'Machine lvl ' + t; }, store: function (t) { return 'Warehouse lvl ' + t; }, belt: function (t) { return 'Belt lvl ' + t; }, truck: function (t) { return 'Truck lvl ' + t; }, streak_best: function (t) { return t + ' days in a row'; }, gold_total: function (t) { return t + ' golden crates'; } }, troN: function (a, b) { return a + ' / ' + b + ' unlocked'; },
      game: '🏃 Open Pass The Baton', close: 'Close', gold: function (n) { return '🎁 GOLDEN CRATE +' + n + ' 📦!'; }, combo: function (n) { return '🔥 COMBO x' + n; }, goldHint: '🎁 A golden crate! Tap it fast!' }
  };
  var css = document.createElement('style');
  // 1 nov 2026 (15h10, Jeremy): prettier factory: a real little landscape (clouds, hills, grass, brick building with a sawtooth roof,
  // lit windows, metal belt), night sky with stars during the turbo, glassy cards, gold title and 3D upgrade buttons.
  css.textContent = '#facScr{position:fixed;inset:0;z-index:9000;background:radial-gradient(120% 55% at 50% 0%,#4a3014 0%,#1d140b 55%,#120c07 100%);color:#fff7ea;overflow-y:auto;box-sizing:border-box;padding:calc(12px + env(safe-area-inset-top,0px)) max(14px,env(safe-area-inset-right,0px)) calc(24px + env(safe-area-inset-bottom,0px)) max(14px,env(safe-area-inset-left,0px));font-family:inherit;-webkit-user-select:none;user-select:none}'
    + '#facScr *{box-sizing:border-box}#facScr .w{max-width:440px;margin:0 auto;display:flex;flex-direction:column;gap:12px}'
    + '#facScr .hd{display:flex;align-items:center;gap:10px}#facScr h1{margin:0;font-size:21px;font-weight:900;flex:1;letter-spacing:.2px}'
    + '#facScr h1 span{background:linear-gradient(90deg,#ffe48a,#ffb43a 60%,#ff8a2f);-webkit-background-clip:text;background-clip:text;color:transparent}'
    + '#facScr .pill{display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:99px;background:linear-gradient(180deg,rgba(255,212,90,.22),rgba(255,154,47,.12));border:1px solid rgba(255,197,49,.5);box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 4px 14px rgba(0,0,0,.3);font-weight:900;font-size:18px;color:#ffd45a;font-variant-numeric:tabular-nums}'
    + '#facScr .pill.pop{animation:fpop .4s ease}@keyframes fpop{40%{transform:scale(1.18)}}'
    + '#facScr .x{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:inherit;width:38px;height:38px;border-radius:12px;font-size:16px}'
    + '#facScr .scene{position:relative;height:280px;border-radius:24px;overflow:hidden;background:linear-gradient(180deg,#3a82e6 0%,#79b4f6 50%,#cfe7ff 100%);box-shadow:0 12px 30px rgba(0,0,0,.45),inset 0 0 0 1.5px rgba(255,255,255,.18);cursor:pointer;touch-action:manipulation;transition:background .6s}'
    + '#facScr .scene.boost{background:linear-gradient(180deg,#140a33 0%,#3d1a6e 50%,#9b47c9 100%)}'
    + '#facScr .sun{position:absolute;top:18px;right:24px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#fff8c4,#ffd23f 70%);box-shadow:0 0 28px 6px rgba(255,214,70,.65)}'
    + '#facScr .sun:before{content:"";position:absolute;inset:-14px;border-radius:50%;background:repeating-conic-gradient(rgba(255,226,122,.45) 0 10deg,transparent 10deg 30deg);-webkit-mask:radial-gradient(circle,transparent 45%,#000 46%);mask:radial-gradient(circle,transparent 45%,#000 46%);animation:fspin 18s linear infinite}'
    + '#facScr .scene.boost .sun{background:radial-gradient(circle at 35% 35%,#fff,#e6d6ff 70%);box-shadow:0 0 30px 8px rgba(217,184,255,.55)}#facScr .scene.boost .sun:before{display:none}'
    + '#facScr .star{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff;opacity:0;transition:opacity .6s}#facScr .scene.boost .star{opacity:1;animation:ftw 1.6s ease-in-out infinite alternate}'
    + '#facScr .star:nth-child(odd){animation-delay:.7s}@keyframes ftw{to{opacity:.25;transform:scale(.6)}}'
    + '#facScr .cloud{position:absolute;width:64px;height:20px;border-radius:99px;background:rgba(255,255,255,.92);box-shadow:0 4px 0 rgba(160,190,230,.35);animation:fcloud 38s linear infinite}'
    + '#facScr .cloud:before,#facScr .cloud:after{content:"";position:absolute;border-radius:50%;background:inherit}#facScr .cloud:before{width:28px;height:28px;left:10px;top:-13px}#facScr .cloud:after{width:20px;height:20px;left:32px;top:-8px}'
    + '#facScr .cloud.c1{top:34px}#facScr .cloud.c2{top:72px;transform:scale(.7);animation-duration:52s;animation-delay:-26s;opacity:.85}#facScr .scene.boost .cloud{opacity:.18}'
    + '@keyframes fcloud{from{left:-90px}to{left:calc(100% + 90px)}}'
    + '#facScr .hills{position:absolute;left:-10%;right:-10%;bottom:54px;height:84px;background:radial-gradient(ellipse 34% 100% at 18% 100%,#4fae6a 98%,transparent 100%),radial-gradient(ellipse 40% 80% at 82% 100%,#3f9a5c 98%,transparent 100%),radial-gradient(ellipse 30% 60% at 52% 100%,#5cbd75 98%,transparent 100%)}'
    + '#facScr .scene.boost .hills{filter:brightness(.5) saturate(.7)}'
    + '#facScr .ground{position:absolute;left:0;right:0;bottom:0;height:60px;background:linear-gradient(180deg,#6fc96c 0 7px,#4e9d4c 7px 9px,#a8804a 9px,#7a5629 100%)}#facScr .scene.boost .ground{filter:brightness(.6)}'
    + '#facScr .bld{position:absolute;left:50%;bottom:58px;width:156px;height:96px;margin-left:-78px;border-radius:4px 4px 0 0;background-color:#c9552f;background-image:repeating-linear-gradient(0deg,rgba(0,0,0,.13) 0 2px,transparent 2px 12px),repeating-linear-gradient(90deg,rgba(0,0,0,.07) 0 2px,transparent 2px 24px);box-shadow:inset 0 -10px 0 rgba(0,0,0,.16),inset 6px 0 0 rgba(255,255,255,.08),0 6px 14px rgba(0,0,0,.25);transition:transform .08s,height .4s}'
    + '#facScr .bld:before{content:"";position:absolute;left:-6px;right:-6px;top:-18px;height:18px;background:linear-gradient(135deg,#8c391e 50%,transparent 50%) 0 0/26px 18px repeat-x;filter:drop-shadow(0 -1px 0 #b24a27)}'
    + '#facScr .bld:after{content:"";position:absolute;left:-6px;right:-6px;top:-2px;height:5px;background:#6e2c15;border-radius:2px}'
    + '#facScr .bld .win{position:absolute;top:22px;width:26px;height:22px;border-radius:3px;background:linear-gradient(90deg,transparent 46%,#7a3418 46% 54%,transparent 54%),linear-gradient(180deg,transparent 46%,#7a3418 46% 54%,transparent 54%),linear-gradient(180deg,#fff0a8,#ffc531);box-shadow:0 0 12px rgba(255,212,90,.85),inset 0 0 0 2px #7a3418}'
    + '#facScr .scene.boost .bld .win{box-shadow:0 0 18px rgba(255,212,90,1),inset 0 0 0 2px #7a3418;animation:fwin 1.2s ease-in-out infinite alternate}@keyframes fwin{to{filter:brightness(1.25)}}'
    + '#facScr .bld .door{position:absolute;bottom:0;left:50%;margin-left:-17px;width:34px;height:42px;background:repeating-linear-gradient(0deg,#4a2410 0 5px,#5b2d14 5px 7px);border-radius:5px 5px 0 0;box-shadow:inset 0 0 0 2px #2e150a}'
    + '#facScr .chim{position:absolute;bottom:140px;left:50%;margin-left:30px;width:22px;height:48px;background:repeating-linear-gradient(0deg,rgba(0,0,0,.14) 0 2px,transparent 2px 10px),#9a4022;border-radius:2px 2px 0 0;box-shadow:inset 0 6px 0 #6e2c15}'
    + '#facScr .smoke{position:absolute;left:50%;margin-left:32px;bottom:186px;width:18px;height:18px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#fff,#d7dde6);opacity:0;animation:fsmk 2.6s linear infinite}'
    + '#facScr .smoke.s2{animation-delay:.87s}#facScr .smoke.s3{animation-delay:1.73s}#facScr .scene.boost .smoke{animation-duration:1.2s;background:radial-gradient(circle at 40% 40%,#fff,#e0c4ff)}'
    + '@keyframes fsmk{0%{opacity:.9;transform:translate(0,0) scale(.6)}100%{opacity:0;transform:translate(28px,-74px) scale(2.4)}}'
    + '#facScr .gear{position:absolute;bottom:92px;left:50%;margin-left:-66px;font-size:30px;filter:drop-shadow(0 2px 2px rgba(0,0,0,.35));animation:fspin 3s linear infinite;z-index:2}#facScr .scene.boost .gear{animation-duration:1s}'
    + '@keyframes fspin{to{transform:rotate(360deg)}}'
    + '#facScr .belt{position:absolute;left:0;right:0;bottom:24px;height:24px;background:repeating-linear-gradient(90deg,#2b2f36 0 12px,#3d434d 12px 24px);background-size:24px 100%;animation:fbelt 1s linear infinite;border-top:3px solid #6b7380;border-bottom:3px solid #1b1e23;box-shadow:0 4px 0 rgba(0,0,0,.22)}'
    + '@keyframes fbelt{to{background-position:24px 0}}'
    + '#facScr .crate{position:absolute;bottom:38px;left:-30px;font-size:24px;filter:drop-shadow(0 3px 2px rgba(0,0,0,.35));animation:fmove 6s linear infinite}'
    + '@keyframes fmove{to{transform:translateX(calc(100vw + 60px))}}'
    + '#facScr .hint{position:absolute;left:50%;top:12px;transform:translateX(-50%);max-width:calc(100% - 110px);padding:5px 12px;border-radius:99px;background:rgba(10,14,30,.45);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);text-align:center;font-size:12.5px;font-weight:800;line-height:1.3;z-index:4;pointer-events:none}'
    + '#facScr .fl{position:absolute;font-weight:900;font-size:21px;color:#ffe27a;text-shadow:0 2px 0 #8a4a10,0 3px 8px rgba(0,0,0,.5);pointer-events:none;animation:ffl .9s ease-out forwards;z-index:5}'
    + '@keyframes ffl{to{transform:translateY(-64px) scale(1.15);opacity:0}}'
    + '#facScr .card{padding:15px;border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.085),rgba(255,255,255,.03));border:1px solid rgba(255,214,140,.16);box-shadow:0 10px 26px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.08);display:flex;flex-direction:column;gap:9px}'
    + '#facScr .lb{font-size:11.5px;color:#ffcf7a;opacity:.85;text-transform:uppercase;letter-spacing:1.2px;font-weight:800}'
    + '#facScr #fPend{color:#ffe27a;text-shadow:0 2px 10px rgba(255,197,49,.25);font-variant-numeric:tabular-nums}'
    + '#facScr .bar{height:11px;border-radius:99px;background:rgba(0,0,0,.35);box-shadow:inset 0 1px 2px rgba(0,0,0,.4);overflow:hidden}#facScr .bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#ffe27a,#ffc531 50%,#ff8a2f);background-size:200% 100%;border-radius:99px;transition:width .5s;animation:fshine 2.4s linear infinite}@keyframes fshine{to{background-position:-200% 0}}'
    + '#facScr .btn{width:100%;min-height:56px;border:0;border-radius:17px;font-size:18px;font-weight:900;background:linear-gradient(180deg,#ffe07a,#ffb43a 55%,#ff9a2f);color:#2a1300;box-shadow:0 6px 0 #b8641c,0 10px 20px rgba(255,140,40,.25),inset 0 2px 0 rgba(255,255,255,.45)}#facScr .btn:active{transform:translateY(3px);box-shadow:0 3px 0 #b8641c,inset 0 2px 0 rgba(255,255,255,.45)}#facScr .btn:disabled{opacity:.45;box-shadow:none}'
    + '#facScr .btn.full{animation:fpulse 1s ease-in-out infinite}@keyframes fpulse{50%{transform:scale(1.03)}}'
    + '#facScr .ghost{width:100%;min-height:46px;border-radius:14px;border:1.5px solid rgba(255,197,49,.5);background:rgba(255,197,49,.08);color:#ffd45a;font-weight:800;font-size:15px}#facScr .ghost:disabled{opacity:.45}#facScr .ghost.on{border-color:#c26fe0;color:#e2a6ff;background:linear-gradient(90deg,rgba(194,111,224,.22),rgba(110,60,220,.14));box-shadow:0 0 18px rgba(194,111,224,.3)}'
    + '#facScr .row{display:flex;align-items:center;gap:10px}#facScr .row .who{flex:1;min-width:0}#facScr .row b{display:block}#facScr .row small{opacity:.75;font-size:13px}'
    + '#facScr .card .row+.row{padding-top:11px;border-top:1px solid rgba(255,255,255,.08)}'
    + '#facScr .up{border:0;border-radius:13px;padding:11px 12px;font-weight:900;background:linear-gradient(180deg,#ffe07a,#ffb43a);color:#2a1300;white-space:nowrap;min-width:92px;box-shadow:0 4px 0 #b8641c,inset 0 1px 0 rgba(255,255,255,.5)}#facScr .up:active{transform:translateY(2px);box-shadow:0 2px 0 #b8641c}#facScr .up:disabled{opacity:.38;box-shadow:none}'
    + '#facScr .goal{border-color:rgba(62,230,160,.4);background:linear-gradient(180deg,rgba(62,230,160,.12),rgba(62,230,160,.04))}#facScr .goal .lb{color:#7ff0c0}#facScr .goal .bar i{background:linear-gradient(90deg,#3ee6a0,#b8f06a,#ffc531);background-size:200% 100%}'
    + '#facScr .fconv{text-align:start;width:auto;border-color:rgba(120,180,255,.3);background:linear-gradient(180deg,rgba(90,150,255,.12),rgba(90,150,255,.03))}'
    + '#facScr .note{font-size:13px;opacity:.8;line-height:1.6;padding:2px 4px}'
    + '#facScr .gold{position:absolute;bottom:44px;font-size:34px;filter:drop-shadow(0 0 10px #ffd45a) drop-shadow(0 0 4px #fff);animation:fgold 7s linear forwards,fbob .5s ease-in-out infinite alternate;z-index:3;cursor:pointer}'
    + '@keyframes fgold{from{left:-40px}to{left:calc(100% + 40px)}}@keyframes fbob{to{margin-bottom:10px}}'
    + '#facScr .combo{position:absolute;right:12px;top:62px;font-weight:900;font-size:22px;color:#ffd45a;text-shadow:0 2px 0 #8a4a10,0 3px 8px rgba(0,0,0,.5);transform:rotate(-6deg);pointer-events:none;z-index:4}'
    + '#facScr .combo.hit{animation:fpop .25s ease}'
    + '#facScr .lvb{position:absolute;top:-40px;left:50%;transform:translateX(-50%);background:linear-gradient(180deg,#ffe07a,#ffb43a);color:#2a1300;font-weight:900;font-size:12px;padding:3px 10px;border-radius:99px;white-space:nowrap;box-shadow:0 3px 0 #b8641c;z-index:1}'
    + '#facScr .bld .win.r2{top:52px}#facScr .bld .win.r3{top:82px}'
    + '#facScr .strk{align-self:flex-start;font-size:12.5px;font-weight:800;padding:5px 11px;border-radius:99px;background:linear-gradient(90deg,rgba(255,120,40,.22),rgba(255,197,49,.12));border:1px solid rgba(255,140,50,.45);color:#ffc48a}#facScr .strk.off{opacity:.75;font-weight:700}'
    + '#facScr .wk{border-color:rgba(255,197,49,.35);background:linear-gradient(180deg,rgba(255,197,49,.10),rgba(255,197,49,.02))}#facScr .wk .lb{color:#ffd45a}'
    + '#facScr .wkr{display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:12px;background:rgba(0,0,0,.18);font-size:14px}#facScr .wkr b{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:800}#facScr .wkr span{font-variant-numeric:tabular-nums;opacity:.9}#facScr .wkr.me{outline:1.5px solid #ffc531}'
    + '#facScr .usd{font-size:12.5px;color:#9fd0ff}'
    // 1 nov 2026 (19h59, Jeremy): more "factory": steel plates with rivets, hazard stripes, stencil titles, gauges with ticks, a scoreboard for the ranking
    + '#facScr{background:repeating-linear-gradient(45deg,rgba(255,255,255,.018) 0 2px,transparent 2px 9px),radial-gradient(120% 50% at 50% 0%,#3b3326 0%,#1b1a18 55%,#121212 100%)}'
    + '#facScr h1,#facScr .lb,#facScr .card>b,#facScr .row b,#facScr .btn,#facScr .up,#facScr .wkr b{font-family:"Russo One",system-ui,sans-serif;font-weight:400;letter-spacing:.3px}'
    + '#facScr h1{font-size:19px;text-transform:uppercase;letter-spacing:.8px;white-space:nowrap}'
    + '#facScr .card{position:relative;border-radius:14px;border:2px solid #4a4f58;background:radial-gradient(circle at 10px 10px,#8a919c 0 2.5px,#3a3f47 3px,transparent 3.5px),radial-gradient(circle at calc(100% - 10px) 10px,#8a919c 0 2.5px,#3a3f47 3px,transparent 3.5px),radial-gradient(circle at 10px calc(100% - 10px),#8a919c 0 2.5px,#3a3f47 3px,transparent 3.5px),radial-gradient(circle at calc(100% - 10px) calc(100% - 10px),#8a919c 0 2.5px,#3a3f47 3px,transparent 3.5px),linear-gradient(180deg,#34383f,#25282d);box-shadow:inset 0 1px 0 rgba(255,255,255,.12),inset 0 -3px 0 rgba(0,0,0,.35),0 8px 20px rgba(0,0,0,.45);padding:18px 18px 16px}'
    + '#facScr .card:before{content:"";position:absolute;left:24px;right:24px;top:-2px;height:5px;border-radius:0 0 4px 4px;background:repeating-linear-gradient(-45deg,#ffc531 0 8px,#1c1c1c 8px 16px);opacity:.9}'
    + '#facScr .lb{font-size:12px;letter-spacing:2px;color:#ffc531;opacity:1;text-shadow:0 1px 0 #000}'
    + '#facScr .row{padding:10px 12px;border-radius:10px;background:linear-gradient(180deg,#1e2125,#24282d);box-shadow:inset 0 2px 4px rgba(0,0,0,.5),inset 0 -1px 0 rgba(255,255,255,.05)}'
    + '#facScr .card .row+.row{border-top:0;padding-top:10px;margin-top:2px}'
    + '#facScr .w>.card:nth-child(3)>.row:first-child{background:none;box-shadow:none;padding:0}'
    + '#facScr .bar{width:100%;display:block;height:14px;border-radius:4px;background:#15171a;border:1px solid #4a4f58;box-shadow:inset 0 2px 3px rgba(0,0,0,.6);position:relative}'
    + '#facScr .bar:after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 9.5%,rgba(0,0,0,.45) 9.5% 10%);pointer-events:none}'
    + '#facScr .bar i{border-radius:3px;background:repeating-linear-gradient(-45deg,rgba(0,0,0,.14) 0 6px,transparent 6px 12px),linear-gradient(90deg,#ffe27a,#ffc531 55%,#ff8a2f)}'
    + '#facScr .btn{border-radius:12px;text-transform:uppercase;letter-spacing:.8px;font-size:17px;background:repeating-linear-gradient(-45deg,rgba(0,0,0,.06) 0 10px,transparent 10px 20px),linear-gradient(180deg,#ffd84f,#ffb21f);border:2px solid #7a4a0c;box-shadow:0 5px 0 #6b3f0a,0 10px 18px rgba(0,0,0,.4),inset 0 2px 0 rgba(255,255,255,.5)}'
    + '#facScr .btn:active{box-shadow:0 2px 0 #6b3f0a,inset 0 2px 0 rgba(255,255,255,.5)}'
    + '#facScr .ghost{border-radius:12px;border:2px solid #5a606a;background:linear-gradient(180deg,#2c3036,#212429);color:#ffd45a;box-shadow:0 3px 0 #15171a}'
    + '#facScr .up{border-radius:10px;border:2px solid #7a4a0c;background:linear-gradient(180deg,#ffd84f,#ffb21f);box-shadow:0 4px 0 #6b3f0a;font-size:14px}'
    + '#facScr .up:disabled{background:linear-gradient(180deg,#4a4f58,#3a3f47);border-color:#2a2e34;color:#aab0ba;box-shadow:0 3px 0 #1c1f23;opacity:1}'
    + '#facScr .goal{border-color:#2f6b55}#facScr .goal:before{background:repeating-linear-gradient(-45deg,#3ee6a0 0 8px,#1c1c1c 8px 16px)}#facScr .goal .lb{color:#3ee6a0}'
    + '#facScr .wk{border-color:#6b5a2a}'
    + '#facScr .wkr{background:#0d0f11;border:1px solid #2c3036;border-radius:8px;box-shadow:inset 0 0 12px rgba(255,140,0,.06)}#facScr .wkr span{font-family:"Share Tech Mono",ui-monospace,monospace;color:#ffb21f;font-size:16px;text-shadow:0 0 6px rgba(255,170,0,.5)}'
    + '#facScr .wkr.me{outline:2px solid #ffc531;outline-offset:-1px}'
    + '#facScr .fconv{border-color:#3d5a7a}#facScr .fconv:before{background:repeating-linear-gradient(-45deg,#5aa8ff 0 8px,#1c1c1c 8px 16px)}'
    + '#facScr .strk{border-radius:8px;background:#1a1410;border:1px solid #8a4a1a;color:#ffb070}'
    + '#facScr .pill{border-radius:10px;background:#0d0f11;border:2px solid #4a4f58;font-family:"Share Tech Mono",ui-monospace,monospace;font-size:20px;color:#ffc531;text-shadow:0 0 8px rgba(255,197,49,.45)}'
    + '#facScr #fPend{font-family:"Share Tech Mono",ui-monospace,monospace;font-size:30px!important;color:#ffd45a;text-shadow:0 0 10px rgba(255,197,49,.35)}'
    + '#facScr #fRate{font-family:"Share Tech Mono",ui-monospace,monospace;padding:4px 10px;border-radius:8px;background:#0d0f11;border:1px solid #3a3f47}'
    + '#facScr .note{padding:12px 14px;border-radius:12px;border:1px dashed #4a4f58;background:rgba(0,0,0,.2)}'
    + '#facScr .x{border-radius:10px;background:#2c3036;border:2px solid #4a4f58}'
    // 1 nov 2026 (20h11, Jeremy): daily challenges and trophies
    + '#facScr .fch{border-color:#7a3a8a}#facScr .fch:before{background:repeating-linear-gradient(-45deg,#d07bff 0 8px,#1c1c1c 8px 16px)}#facScr .fch .lb{color:#e2a6ff}'
    + '#facScr .chr{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border-radius:10px;background:linear-gradient(180deg,#1e2125,#24282d);box-shadow:inset 0 2px 4px rgba(0,0,0,.5)}#facScr .chr .top{display:flex;align-items:center;gap:10px}#facScr .chr .top span{flex:1;min-width:0;font-size:14px;font-weight:700}#facScr .chr small{font-family:"Share Tech Mono",ui-monospace,monospace;opacity:.85}'
    + '#facScr .chr .bar{height:9px}#facScr .chr .bar i{background:linear-gradient(90deg,#b45cff,#e2a6ff)}#facScr .chr.done{opacity:.6}'
    + '#facScr .ftro{border-color:#6b5a2a}#facScr .trg{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px}'
    + '#facScr .trt{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 6px;border-radius:10px;text-align:center;background:#1a1c20;border:1px solid #2c3036;font-size:11.5px;line-height:1.25;min-width:0}#facScr .trt i{font-style:normal;font-size:24px;filter:grayscale(1) brightness(.6)}#facScr .trt small{font-family:"Share Tech Mono",ui-monospace,monospace;opacity:.7;font-size:11px}'
    + '#facScr .trt.got i{filter:none}#facScr .trt.got{border-color:#6b5a2a;background:linear-gradient(180deg,#2a2416,#1a1c20)}#facScr .trt.can{border:2px solid #ffc531;box-shadow:0 0 14px rgba(255,197,49,.35);cursor:pointer;animation:fpulse 1.4s ease-in-out infinite}#facScr .trt.can i{filter:none}#facScr .trt b{font-family:"Russo One",system-ui,sans-serif;font-weight:400;color:#ffc531;font-size:12px}'
    + '#facScr .fad{border-color:#8a6a1a}#facScr .fad:before{background:repeating-linear-gradient(-45deg,#ff8a2f 0 8px,#1c1c1c 8px 16px)}#facScr .fad .lb{color:#ffb070}#facScr .fad{padding:16px 10px 14px}#facScr .fad .lb,#facScr .fad>small{padding:0 6px}#facScr .fad adsgram-task{display:block;width:100%;max-width:100%;min-width:0;box-sizing:border-box;font-size:13px}#facScr .fad .ftb{display:inline-block;padding:6px 10px;border-radius:10px;background:linear-gradient(180deg,#ffd84f,#ffb21f);color:#2a1300;font-weight:800;font-size:13px;white-space:nowrap;border:2px solid #7a4a0c}#facScr .fad small{opacity:.85;font-size:13px}#facScr .fad small b{font-family:"Share Tech Mono",ui-monospace,monospace;color:#ffc531}'
    + '#facScr .cf{position:fixed;top:-30px;font-size:22px;pointer-events:none;animation:fcf 1.8s ease-in forwards;z-index:9001}@keyframes fcf{to{transform:translateY(110vh) rotate(540deg)}}';
  document.head.appendChild(css);
  try { if (!document.getElementById('facFont')) { var fl = document.createElement('link'); fl.id = 'facFont'; fl.rel = 'stylesheet'; fl.href = 'https://fonts.googleapis.com/css2?family=Russo+One&family=Share+Tech+Mono&display=swap'; document.head.appendChild(fl); } } catch (e) {}  // 1 nov 2026: factory fonts
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
    scr.innerHTML = '<div class="w"><div class="hd"><h1>🏭 <span>' + L.t + '</span></h1><div class="pill" id="fPill">📦 <span id="fCr">0</span></div><button class="x" id="fX" aria-label="' + L.close + '">✕</button></div>'
      + '<div class="scene" id="fScene" role="button" aria-label="tap"><div class="sun"></div>'
      + '<i class="star" style="left:10%;top:14%"></i><i class="star" style="left:24%;top:30%"></i><i class="star" style="left:40%;top:10%"></i><i class="star" style="left:58%;top:24%"></i><i class="star" style="left:70%;top:8%"></i><i class="star" style="left:88%;top:36%"></i>'
      + '<div class="cloud c1"></div><div class="cloud c2"></div><div class="hills"></div><div class="ground"></div><div class="hint" id="fHint"></div>'
      + '<div class="smoke"></div><div class="smoke s2"></div><div class="smoke s3"></div><div class="chim"></div>'
      + '<div class="bld" id="fBld"><div class="lvb" id="fLvb"></div><div class="win" style="left:16px"></div><div class="win" style="left:62px"></div><div class="win" style="right:16px"></div><div id="fWins"></div><div class="door"></div></div><div class="combo" id="fCombo"></div>'
      + '<div class="gear">⚙️</div><div class="belt" id="fBelt"></div><div id="fCrates"></div></div>'
      + '<div class="card"><div class="row"><div class="who"><div class="lb">' + L.made + '</div><b style="font-size:24px" id="fPend">+0 📦</b></div><b style="color:#ffc531;font-size:17px" id="fRate"></b></div><div class="strk" id="fStk"></div>'
      + '<div class="bar"><i id="fBar"></i></div><small style="opacity:.8" id="fFull"></small>'
      + '<button class="btn" id="fC"></button><button class="ghost" id="fB"></button></div>'
      + '<div class="card goal"><div class="lb">' + L.goal + '</div><b id="fGoal"></b><div class="bar"><i id="fGoalBar"></i></div></div>'
      + '<div class="card fad"><div class="lb">' + L.adT + '</div><div id="fAd"></div><small style="opacity:.75">' + L.adGoal + '</small></div>'
      + '<div class="card fch"><div class="lb">' + L.chT + '</div><div id="fChL" style="display:flex;flex-direction:column;gap:7px"></div><button class="ghost" id="fChB"></button></div>'
      + '<div class="card"><div class="row"><div class="who"><b id="fML"></b><small id="fMS"></small></div><button class="up" id="fL"></button></div>'
      + '<div class="row"><div class="who"><b id="fSL"></b><small id="fSS"></small></div><button class="up" id="fS"></button></div>'
      + '<div class="row"><div class="who"><b id="fBL"></b><small id="fBS"></small></div><button class="up" id="fBU"></button></div>'
      + '<div class="row"><div class="who"><b id="fTL"></b><small id="fTS"></small></div><button class="up" id="fTU"></button></div></div>'
      + '<div class="card wk"><div class="lb">' + L.week + '</div><small style="opacity:.8" id="fWS"></small><div id="fWL" style="display:flex;flex-direction:column;gap:6px"></div><small id="fWM" style="font-weight:800"></small></div>'
      + '<div class="card fconv"><b>' + L.conv + '</b><small style="opacity:.8" id="fVS"></small><small class="usd" id="fUS"></small><button class="ghost" id="fV"></button></div>'
      + '<div class="card ftro"><div class="lb">' + L.troT + '</div><small style="opacity:.8" id="fTN"></small><div class="trg" id="fTG"></div></div>'
      + '<div class="note" id="fNote"></div>'
      + '<button class="ghost" id="fG" style="border-color:rgba(255,255,255,.2);color:inherit;background:none">' + L.game + '</button></div>';
    ['Lvb', 'Wins', 'Combo', 'Pill', 'Cr', 'Scene', 'Hint', 'Bld', 'Belt', 'Crates', 'Pend', 'Rate', 'Bar', 'Full', 'C', 'B', 'Goal', 'GoalBar', 'ML', 'MS', 'L', 'SL', 'SS', 'S', 'VS', 'V', 'Note', 'G', 'X', 'Stk', 'BL', 'BS', 'BU', 'TL', 'TS', 'TU', 'WS', 'WL', 'WM', 'US', 'ChL', 'ChB', 'TN', 'TG', 'Ad'].forEach(function (k) { E[k.toLowerCase()] = document.getElementById('f' + k); });
    E.x.onclick = close; E.g.onclick = close;
    E.c.onclick = function () { act('collect', null, function (r) { pop(); jingle([523, 659, 784]); return T().ok.collect(nf(r.got)); }); };
    E.b.onclick = boost;
    E.l.onclick = function () { act('up_lvl', null, function (r) { confetti(); jingle([523, 659, 784, 1047]); beltKey = ''; return T().ok.lvl(r.lvl); }); };
    E.s.onclick = function () { act('up_store', null, function () { confetti(); jingle([523, 659, 784, 1047]); return T().ok.store; }); };
    // 1 nov 2026 (19h33, Jeremy): two more upgrades, the conveyor belt and the truck
    // 1 nov 2026 (20h11, Jeremy): daily challenges, chest and trophies
    E.chl.onclick = function (ev) { var b = ev.target.closest('[data-ch]'); if (!b) return; act('ch_claim', { id: b.getAttribute('data-ch') }, function (r) { pop(); jingle([523, 659, 784]); return T().ok.collect(nf(r.ch_got)); }); };
    E.chb.onclick = function () { act('ch_chest', null, function (r) { confetti(); pop(); jingle([523, 659, 784, 1047, 1319]); return T().ok.collect(nf(r.ch_got)); }); };
    E.tg.onclick = function (ev) { var b = ev.target.closest('[data-tro]'); if (!b) return; act('tro_claim', { id: b.getAttribute('data-tro') }, function (r) { confetti(); pop(); jingle([659, 880, 1100, 1320]); return '🏅 ' + T().ok.collect(nf(r.tro_got)); }); };
    E.bu.onclick = function () { act('up_belt', null, function () { confetti(); jingle([523, 659, 784, 1047]); return T().belt + ' ' + T().lv + ' ' + st.belt + ' !'; }); };
    E.tu.onclick = function () { act('up_truck', null, function () { confetti(); jingle([523, 659, 784, 1047]); return T().truck + ' ' + T().lv + ' ' + st.truck + ' !'; }); };
    E.v.onclick = function () {
      var left = Math.max(0, st.day_cap - st.conv_today), n = Math.min(Math.floor(st.crates), Math.ceil(left / st.conv));
      act('convert', { n: n }, function (r) { try { B().refresh(); } catch (e) {} return T().ok.conv(nf(r.baton)); });
    };
    E.scene.addEventListener('pointerdown', tap);
    adBuild();
  }
  // 1 nov 2026 (20h19, Jeremy): the Adsgram sponsored task inside the factory too (same block as the Tasks tab, same limits: 10 a day, one every 30 s);
  // each one gives crates (server: bt_ads_reward, fac_task_crates) on top of the usual $BATON
  var adUntil = 0, adLast = 0;
  function adBuild() {
    var b = B(), L = T(); if (!E.ad || !b || !b.S) return;
    // 1 nov 2026 (22h27, Jeremy): once the factory has its own Adsgram block (fac_ad_block), its task is independent from the Tasks tab: its own limits, paid in crates
    var S = b.S, own = !!(st && st.ad_block), until = own ? (Number(st.ad_next) || 0) : Math.max(Number(S.adtNext) || 0, (function () { try { return Number(localStorage.getItem('bt_adt_pause')) || 0; } catch (e) { return 0; } })());
    var blk = own ? String(st.ad_block) : 'task-55373', crt = own ? st.ad_crates : (st ? st.task_crates : 100);
    if (own ? Number(st.ad_left) === 0 : S.adtLeft === 0) { adUntil = 0; E.ad.innerHTML = '<small>' + L.adDone + '</small>'; return; }
    if (until > Date.now()) { adUntil = until; E.ad.innerHTML = '<small>' + L.adWait + ' <b id="fAdCd"></b></small>'; return; }
    adUntil = 0;
    var mk = function () {
      if (!E.ad) return;
      E.ad.innerHTML = '<adsgram-task data-block-id="' + blk + '"><span slot="reward">' + (own ? '+' + nf(crt) + ' 📦' : L.adR(nf(crt))) + '</span><div slot="button" class="ftb">' + L.adGo + '</div><div slot="claim" class="ftb">' + L.adClaim + '</div><div slot="done" class="ftb">✓</div></adsgram-task>';
      var tk = E.ad.querySelector('adsgram-task');
      ['onBannerNotFound', 'onError', 'onTooLongSession'].forEach(function (ev) { tk.addEventListener(ev, function () { if (E.ad) E.ad.innerHTML = '<small>' + T().adNone + '</small>'; setTimeout(adBuild, 30000); }); });
      var gift = function () {
        if (Date.now() - adLast < 3000) return; adLast = Date.now(); hap('success'); toast(T().adOk(nf(crt))); jingle([523, 659, 784]);
        if (!own) try { localStorage.setItem('bt_adt_pause', String(Date.now() + 60000)); } catch (e) {}
        if (own) { load('adtask').then(function () { draw(); setTimeout(adBuild, 2500); }); return; }  // 1 nov 2026 (22h28): no reward URL for the factory block, the app reports it
        setTimeout(function () { try { B().refresh(); } catch (e) {} load().then(draw); }, 3000); setTimeout(adBuild, 4000);
      };
      tk.addEventListener('reward', gift); tk.addEventListener('onReward', gift);
    };
    if (window.customElements && customElements.get('adsgram-task')) mk();
    else { if (!document.querySelector('script[src*="sad.adsgram.ai"]')) { var s = document.createElement('script'); s.src = 'https://sad.adsgram.ai/js/sad.min.js'; document.head.appendChild(s); } var n = 0, w = setInterval(function () { if (window.customElements && customElements.get('adsgram-task')) { clearInterval(w); mk(); } else if (++n > 40) { clearInterval(w); if (E.ad) E.ad.innerHTML = '<small>' + T().adNone + '</small>'; setTimeout(adBuild, 30000); } }, 250); }
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
    if (adUntil) { var cd = document.getElementById('fAdCd'), sl = Math.max(0, Math.ceil((adUntil - Date.now()) / 1000)); if (cd) cd.textContent = Math.floor(sl / 60) + ':' + String(sl % 60).padStart(2, '0'); if (sl <= 0) adBuild(); }
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
    if (st.belt_cost != null) g.push({ w: L.belt + ' ' + L.lv + ' ' + (st.belt + 1), c: st.belt_cost });
    if (st.truck_cost != null) g.push({ w: L.truck + ' ' + L.lv + ' ' + (st.truck + 1), c: st.truck_cost });
    g.sort(function (a, b) { return a.c - b.c; });
    if (g.length) { var gg = g[0]; E.goal.textContent = crates >= gg.c ? L.goalOk(gg.w) : L.goalT(gg.w, nf(gg.c - crates)); E.goalbar.style.width = Math.min(100, crates / gg.c * 100).toFixed(1) + '%'; }
    else { E.goal.textContent = L.max; E.goalbar.style.width = '100%'; }
    E.ml.textContent = L.mach + ' · ' + L.lv + ' ' + st.lvl; E.ms.textContent = nf(st.rate) + L.perh + (st.lvl_cost != null ? ' → ' + nf(st.lvl_next_rate) + L.perh : '');
    E.l.textContent = st.lvl_cost != null ? nf(st.lvl_cost) + ' 📦' : L.max; E.l.disabled = busy || st.lvl_cost == null || crates < st.lvl_cost;
    E.sl.textContent = L.store + ' · ' + L.lv + ' ' + st.store; E.ss.textContent = L.cap(st.cap_h) + (st.store_cost != null ? ' → ' + L.cap(Number(st.cap_h) + 0.5) /* 16h44: +30 min per storage level */ : '');
    E.s.textContent = st.store_cost != null ? nf(st.store_cost) + ' 📦' : L.max; E.s.disabled = busy || st.store_cost == null || crates < st.store_cost;
    if (E.bl && st.belt != null) {
      E.bl.textContent = L.belt + ' · ' + L.lv + ' ' + st.belt; E.bs.textContent = L.beltS(st.belt);
      E.bu.textContent = st.belt_cost != null ? nf(st.belt_cost) + ' 📦' : L.max; E.bu.disabled = busy || st.belt_cost == null || crates < st.belt_cost;
      E.tl.textContent = L.truck + ' · ' + L.lv + ' ' + st.truck; E.ts.textContent = L.truckS(st.conv, st.truck_cost != null ? st.conv_next : null);
      E.tu.textContent = st.truck_cost != null ? nf(st.truck_cost) + ' 📦' : L.max; E.tu.disabled = busy || st.truck_cost == null || crates < st.truck_cost;
      var sk = Number(st.streak) || 0; E.stk.textContent = sk > 0 ? L.streak(sk) : L.streak0; E.stk.classList.toggle('off', sk === 0);
      var pz = st.week_prizes || [20000, 10000, 5000]; E.ws.textContent = L.weekS(nf(pz[0]), nf(pz[1]), nf(pz[2]));
      var wl = st.week || [], esc = function (x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
      var wh = wl.length ? wl.map(function (w, i) { return '<div class="wkr' + (w.me ? ' me' : '') + '">' + (['🥇', '🥈', '🥉', '4.', '5.'][i] || '') + ' <b>' + esc(w.n) + '</b><span>' + nf(w.m) + ' 📦</span></div>'; }).join('') : '<small style="opacity:.75">' + L.weekNone + '</small>';
      if (E.wl.innerHTML !== wh) E.wl.innerHTML = wh;
      E.wm.textContent = st.week_me ? L.weekMe(st.week_rank, nf(st.week_me)) : '';
      var chs = st.ch || [], chh = chs.map(function (c) { var done = Number(c.v) >= Number(c.t), f = L.chM[c.m] ? L.chM[c.m](c.t) : c.id;
        return '<div class="chr' + (c.got ? ' done' : '') + '"><div class="top"><span>' + (c.got ? '✅ ' : '') + esc(f) + '</span>' + (c.got ? '' : done ? '<button class="up" data-ch="' + esc(c.id) + '">' + L.chGet(nf(c.rw)) + '</button>' : '<small>' + nf(c.v) + '/' + nf(c.t) + ' · +' + nf(c.rw) + ' 📦</small>') + '</div>' + (c.got ? '' : '<div class="bar"><i style="width:' + Math.min(100, Number(c.v) / Number(c.t) * 100).toFixed(0) + '%"></i></div>') + '</div>'; }).join('');
      if (E.chl.innerHTML !== chh) E.chl.innerHTML = chh;
      E.chb.textContent = st.ch_chest ? L.chestOk : (st.ch_n >= 3 ? L.chest(nf(st.ch_chest_rw)) : L.chestLock(st.ch_n || 0)); E.chb.disabled = busy || !!st.ch_chest || (st.ch_n || 0) < 3; E.chb.classList.toggle('on', !st.ch_chest && st.ch_n >= 3);
      var tros = st.tro || [], ng = 0, trh = tros.map(function (t) { var can = !t.got && Number(t.v) >= Number(t.t); if (t.got) ng++; var nm = L.troM[t.k] ? L.troM[t.k](nf(t.t)) : t.id;
        return '<div class="trt' + (t.got ? ' got' : can ? ' can' : '') + '"' + (can ? ' data-tro="' + esc(t.id) + '"' : '') + '><i>' + (t.got || can ? '🏅' : '🔒') + '</i>' + esc(nm) + (can ? '<b>+' + nf(t.r) + ' 📦</b>' : t.got ? '' : '<small>' + nf(t.v) + '/' + nf(t.t) + '</small>') + '</div>'; }).join('');
      if (E.tg.innerHTML !== trh) E.tg.innerHTML = trh; E.tn.textContent = L.troN(ng, tros.length);
    }
    var convLeft = Math.max(0, st.day_cap - st.conv_today), convN = Math.min(Math.floor(st.crates), Math.ceil(convLeft / st.conv));
    E.vs.textContent = L.convS(st.conv, nf(st.conv_today), nf(st.day_cap));
    E.v.textContent = L.convB(nf(convN), nf(Math.min(Math.floor(convN * st.conv), convLeft)));
    if (E.us) { var bb = Math.min(Math.floor(convN * st.conv), convLeft); E.us.textContent = bb > 0 ? L.usd((bb * (Number(st.usd_per_m) || 1) / 1e6).toFixed(4)) : ''; } E.v.disabled = busy || convN < st.min_conv || convLeft <= 0;
    E.note.innerHTML = L.friends(st.friends) + '<br>' + L.tasks(st.task_crates) + '<br>' + L.pass(20);
  }
  function act(a, extra, okMsg) {
    if (busy) return; busy = true; hap(); draw();
    var run = function () {
      load(a, extra).then(function (r) {
        busy = false;
        if (!r) toast(T().err.net);
        else if (r.ok === false) { hap('error'); toast(T().err[r.error] || T().err.net); }
        else {
          hap('success'); toast(typeof okMsg === 'function' ? okMsg(r) : okMsg);
          // 1 nov 2026 (16h57, Jeremy): the interstitial comes after a harvest or a trade (no more at opening), 4 min at least between two
          if (a === 'collect' || a === 'convert') setTimeout(function () { try { if (window.btInt) window.btInt(); } catch (e) {} }, 1500);
        }
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
    scr.innerHTML = '<div class="w"><div class="hd"><h1>🏭 <span>' + T().t + '</span></h1></div><div style="text-align:center;padding:60px;font-size:40px">🏭</div></div>';
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
