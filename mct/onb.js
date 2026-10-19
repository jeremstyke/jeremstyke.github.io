// 18 oct 2026 (Jeremy): the first 3 days of a new player. 3 players out of 4 did not come back the next day: the market showed 7 cards
// before the coins. Now, on day 1 the market only shows one goal at a time (buy a first coin, then sell it with a gain), the other
// cards come back day by day (day 2 mining, day 3 clans and $MCT), and once the player has played he sees what waits for him tomorrow.
// Data from the Supabase function mct-ton (action mon_onb, mct_onb_state). Players older than 3 days see nothing new.
(() => {
  const TX = {
    fa: {
      tmct: '🆕 🏛️ $MCT برایت باز می‌شود', u3m: '🆕 امروز باز شد: 🏛️ $MCT', u3ms: 'کوین رسمی بازی: دارندگانش هر دوشنبه سود تقسیم می‌کنند. وقتی آمدی کمی از آن گرفتی.', u3mb: '🏛️ دیدن $MCT',
      g1: '🎯 هدف امروزت: اولین میم‌کوینت را بخر', g1s: 'یک کوین در فهرست 🔥 داغ پایین بزن، بعد خرید. 100 دلار برای شروع کافی است.', g1b: '👇 دیدن کوین‌ها',
      g2: '📈 آفرین! حالا با سود بفروشش', g2s: 'قیمت‌ها مدام تغییر می‌کنند. دارایی‌ات را باز کن: وقتی کوینت سبز شد، بفروش و سود بگیر.', g2b: '💼 دارایی من',
      g3: '✅ بازی را یاد گرفتی!', tm: '📅 فردا برگرد:', tb: (d, a) => '🎁 جایزه روزانه روز ' + d + ': +' + a, tbn: (d, a) => '🎁 جایزه امروز (روز ' + d + '): +' + a + '، همین حالا بگیر!', tc: '📈 کوین‌هایت جابه‌جا شده‌اند', tmine: '🆕 ⛏️ استخراج برایت باز می‌شود', tclan: '🆕 🛡️ کلن‌ها و 🏛️ $MCT برایت باز می‌شوند', tharv: '⛏️ آنچه دستگاهت استخراج کرده را جمع کن',
      u2: '🆕 امروز باز شد: ⛏️ استخراج', u2s: 'دستگاهت حتی وقتی نیستی کوین استخراج می‌کند. همین حالا روشنش کن، فردا جمع کن.', u2b: '⛏️ روشن کردن دستگاه',
      u3: '🆕 امروز باز شد: 🛡️ کلن‌ها و 🏛️ $MCT', u3s: 'به یک کلن بپیوند: هر هفته 3 کلن برتر تا 20,000 دلار می‌برند. و $MCT، کوین رسمی، هر دوشنبه به دارندگانش سود می‌دهد.', u3b: '🛡️ دیدن کلن‌ها',
    },
    ru: {
      tmct: '🆕 Тебе открывается 🏛️ $MCT', u3m: '🆕 Открыто сегодня: 🏛️ $MCT', u3ms: 'Официальная монета игры: держатели делят дивиденд каждый понедельник. Немного ты уже получил при входе.', u3mb: '🏛️ Смотреть $MCT',
      g1: '🎯 Цель на сегодня: купи первый мемкоин', g1s: 'Нажми на монету в списке 🔥 Горячие ниже, потом Купить. Для старта хватит $100.', g1b: '👇 Смотреть монеты',
      g2: '📈 Отлично! Теперь продай с прибылью', g2s: 'Цены всё время меняются. Открой портфель: когда монета зелёная, продай и забери прибыль.', g2b: '💼 Мой портфель',
      g3: '✅ Ты разобрался в игре!', tm: '📅 Возвращайся завтра:', tb: (d, a) => '🎁 Бонус дня ' + d + ': +' + a, tbn: (d, a) => '🎁 Бонус сегодня (день ' + d + '): +' + a + ', забирай!', tc: '📈 Твои монеты изменятся в цене', tmine: '🆕 Тебе открывается ⛏️ майнинг', tclan: '🆕 Тебе открываются 🛡️ кланы и 🏛️ $MCT', tharv: '⛏️ Собери то, что намайнил майнер',
      u2: '🆕 Открыто сегодня: ⛏️ майнинг', u2s: 'Майнер добывает монеты, даже когда тебя нет. Запусти сейчас, собери завтра.', u2b: '⛏️ Запустить майнер',
      u3: '🆕 Открыто сегодня: 🛡️ кланы и 🏛️ $MCT', u3s: 'Вступи в клан: каждую неделю топ-3 выигрывают до $20,000. А $MCT, официальная монета, платит держателям каждый понедельник.', u3b: '🛡️ Смотреть кланы',
    },
    en: {
      tmct: '🆕 You unlock 🏛️ $MCT', u3m: '🆕 Unlocked today: 🏛️ $MCT', u3ms: 'The official coin of the game: its holders share a dividend every Monday. You already got some when you arrived.', u3mb: '🏛️ See $MCT',
      g1: '🎯 Your goal today: buy your first memecoin', g1s: 'Tap a coin in the 🔥 Hot list below, then Buy. $100 is enough to start.', g1b: '👇 See the coins',
      g2: '📈 Well done! Now sell it with a gain', g2s: 'Prices move all the time. Open your portfolio: when your coin is green, sell it to cash in.', g2b: '💼 My portfolio',
      g3: '✅ You got the game!', tm: '📅 Come back tomorrow:', tb: (d, a) => '🎁 Daily bonus day ' + d + ': +' + a, tbn: (d, a) => '🎁 Today\'s bonus (day ' + d + '): +' + a + ', take it now!', tc: '📈 Your coins will have moved', tmine: '🆕 You unlock ⛏️ mining', tclan: '🆕 You unlock 🛡️ clans and 🏛️ $MCT', tharv: '⛏️ Collect what your rig mined',
      u2: '🆕 Unlocked today: ⛏️ mining', u2s: 'Your rig mines coins even when you are away. Start it now, collect tomorrow.', u2b: '⛏️ Start my rig',
      u3: '🆕 Unlocked today: 🛡️ clans and 🏛️ $MCT', u3s: 'Join a clan: every week the top 3 win up to $20,000. And $MCT, the official coin, pays its holders every Monday.', u3b: '🛡️ See the clans',
    },
    fr: {
      tmct: '🆕 Tu débloques 🏛️ $MCT', u3m: '🆕 Débloqué aujourd\'hui : 🏛️ $MCT', u3ms: 'Le coin officiel du jeu : ceux qui en ont se partagent un dividende chaque lundi. Tu en as déjà reçu à ton arrivée.', u3mb: '🏛️ Voir $MCT',
      g1: '🎯 Ton objectif du jour : achète ton premier memecoin', g1s: 'Touche un coin de la liste 🔥 Hot ci-dessous, puis Acheter. 100 $ suffisent pour commencer.', g1b: '👇 Voir les coins',
      g2: '📈 Bien joué ! Maintenant, revends avec un gain', g2s: 'Les prix bougent tout le temps. Ouvre ton portefeuille : quand ton coin est en vert, vends-le pour encaisser.', g2b: '💼 Mon portefeuille',
      g3: '✅ Tu as compris le jeu !', tm: '📅 Reviens demain :', tb: (d, a) => '🎁 Bonus du jour ' + d + ' : +' + a, tbn: (d, a) => '🎁 Bonus d\'aujourd\'hui (jour ' + d + ') : +' + a + ', prends-le maintenant !', tc: '📈 Tes coins auront bougé', tmine: '🆕 Tu débloques le ⛏️ minage', tclan: '🆕 Tu débloques les 🛡️ clans et 🏛️ $MCT', tharv: '⛏️ Récupère ce que ton rig a miné',
      u2: '🆕 Débloqué aujourd\'hui : le ⛏️ minage', u2s: 'Ton rig mine des coins même quand tu n\'es pas là. Lance-le maintenant, récolte demain.', u2b: '⛏️ Lancer mon rig',
      u3: '🆕 Débloqué aujourd\'hui : les 🛡️ clans et 🏛️ $MCT', u3s: 'Rejoins un clan : chaque semaine, les 3 meilleurs gagnent jusqu\'à 20 000 $. Et $MCT, le coin officiel, rapporte un dividende chaque lundi.', u3b: '🛡️ Voir les clans',
    },
    id: {
      tmct: '🆕 Kamu membuka 🏛️ $MCT', u3m: '🆕 Terbuka hari ini: 🏛️ $MCT', u3ms: 'Koin resmi game ini: pemegangnya berbagi dividen setiap Senin. Kamu sudah dapat saat bergabung.', u3mb: '🏛️ Lihat $MCT',
      g1: '🎯 Target hari ini: beli memecoin pertamamu', g1s: 'Ketuk koin di daftar 🔥 Hot di bawah, lalu Beli. $100 cukup untuk mulai.', g1b: '👇 Lihat koin',
      g2: '📈 Bagus! Sekarang jual dengan untung', g2s: 'Harga bergerak terus. Buka portofoliomu: saat koinmu hijau, jual untuk mencairkan.', g2b: '💼 Portofolioku',
      g3: '✅ Kamu sudah paham gamenya!', tm: '📅 Kembali besok:', tb: (d, a) => '🎁 Bonus harian hari ' + d + ': +' + a, tbn: (d, a) => '🎁 Bonus hari ini (hari ' + d + '): +' + a + ', ambil sekarang!', tc: '📈 Koinmu akan bergerak', tmine: '🆕 Kamu membuka ⛏️ tambang', tclan: '🆕 Kamu membuka 🛡️ klan dan 🏛️ $MCT', tharv: '⛏️ Ambil hasil tambang rig-mu',
      u2: '🆕 Terbuka hari ini: ⛏️ tambang', u2s: 'Rig-mu menambang koin bahkan saat kamu pergi. Nyalakan sekarang, panen besok.', u2b: '⛏️ Nyalakan rig',
      u3: '🆕 Terbuka hari ini: 🛡️ klan dan 🏛️ $MCT', u3s: 'Gabung klan: setiap minggu 3 teratas menang hingga $20,000. Dan $MCT, koin resmi, membayar pemegangnya setiap Senin.', u3b: '🛡️ Lihat klan',
    },
    ar: {
      tmct: '🆕 تفتح 🏛️ $MCT', u3m: '🆕 فُتح اليوم: 🏛️ $MCT', u3ms: 'العملة الرسمية للعبة: يتقاسم حاملوها أرباحًا كل اثنين. لقد حصلت على بعضها عند وصولك.', u3mb: '🏛️ شاهد $MCT',
      g1: '🎯 هدفك اليوم: اشترِ أول عملة ميم', g1s: 'اضغط على عملة من قائمة 🔥 الرائج أدناه، ثم اشترِ. 100$ تكفي للبدء.', g1b: '👇 شاهد العملات',
      g2: '📈 أحسنت! الآن بِعها بربح', g2s: 'الأسعار تتحرك باستمرار. افتح محفظتك: عندما تكون عملتك خضراء، بِعها لتحصد الربح.', g2b: '💼 محفظتي',
      g3: '✅ فهمت اللعبة!', tm: '📅 عد غدًا:', tb: (d, a) => '🎁 المكافأة اليومية اليوم ' + d + ': +' + a, tbn: (d, a) => '🎁 مكافأة اليوم (اليوم ' + d + '): +' + a + '، خذها الآن!', tc: '📈 ستكون عملاتك قد تحركت', tmine: '🆕 تفتح ⛏️ التعدين', tclan: '🆕 تفتح 🛡️ العشائر و🏛️ $MCT', tharv: '⛏️ اجمع ما عدّنه جهازك',
      u2: '🆕 فُتح اليوم: ⛏️ التعدين', u2s: 'جهازك يعدّن العملات حتى في غيابك. شغّله الآن واحصد غدًا.', u2b: '⛏️ شغّل جهازي',
      u3: '🆕 فُتح اليوم: 🛡️ العشائر و🏛️ $MCT', u3s: 'انضم إلى عشيرة: كل أسبوع يربح الثلاثة الأوائل حتى 20000$. و$MCT، العملة الرسمية، توزّع أرباحًا كل اثنين.', u3b: '🛡️ شاهد العشائر',
    },
  };
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] ? l : 'en'; };
  const L = () => TX[lg()];
  const hp = () => { try { haptic(); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const usd = (n) => { try { return money(n); } catch (e) { return '$' + n; } };
  const call = async () => { try { return await tonCall({ action: 'mon_onb' }); } catch (e) { return null; } };
  let S = null, T0 = 0, busy = false;

  // what a new player does not see yet: day 1 only the goal, the daily bonus, the channel bonus and the coins
  const st = document.createElement('style');
  st.textContent = 'body.onb1 #tokc,body.onb1 #scoopc,body.onb1 #stb,body.onb1 #simpl,body.onb1 #msn,body.onb2 #simpl,body.onb2 #scoopc,body.onb3 #simpl{display:none!important}'
    + '#onb{border:2px solid var(--gold,#ffd43b);background:linear-gradient(150deg,rgba(255,212,59,.16),rgba(255,154,60,.04) 70%);border-radius:18px;padding:14px;margin:0 0 12px}'
    + '#onb b.h{display:block;font-size:16px;line-height:1.3}#onb p{margin:6px 0 0;font-size:13px;opacity:.85;line-height:1.4}#onb ul{margin:8px 0 0;padding-left:0;list-style:none;font-size:13.5px;line-height:1.6}'
    + '#onb button.go{margin-top:10px;width:100%;border:0;border-radius:12px;padding:11px;font-weight:800;font-size:14px;background:#ffd43b;color:#1a1200;cursor:pointer}';
  document.head.appendChild(st);

  function tomorrowList(T) {
    const a = [];
    a.push(S.bonus_today ? T.tb(S.tomorrow_day, usd(S.tomorrow)) : T.tbn(S.tomorrow_day, usd(S.tomorrow)));
    if (S.holds) a.push(T.tc);
    if (S.day === 1) a.push(T.tmine);
    else if (S.day === 2) a.push(S.mining ? T.tharv : T.tmine, S.clan ? T.tmct : T.tclan); // 18 oct 2026: arrived through a clan link, already in a clan
    else if (S.mining) a.push(T.tharv);
    return '<b class="h" style="margin-top:10px;font-size:14px">' + ec(T.tm) + '</b><ul>' + a.map((x) => '<li>' + ec(x) + '</li>').join('') + '</ul>';
  }
  function draw(c) {
    const T = L(); let h = '', btn = null;
    if (S.day === 1 && !S.buys) { h = '<b class="h">' + ec(T.g1) + '</b><p>' + ec(T.g1s) + '</p>'; btn = ['g1b', () => { const l = document.getElementById('list'); if (l) l.scrollIntoView({ behavior: 'smooth', block: 'start' }); }]; }
    else if (S.day === 1 && !S.sells) { h = '<b class="h">' + ec(T.g2) + '</b><p>' + ec(T.g2s) + '</p>'; btn = ['g2b', () => { try { go('portfolio'); } catch (e) {} }]; }
    else if (S.day === 1) h = '<b class="h">' + ec(T.g3) + '</b>' + tomorrowList(T);
    else if (S.day === 2 && !S.mining) { h = '<b class="h">' + ec(T.u2) + '</b><p>' + ec(T.u2s) + '</p>'; btn = ['u2b', () => { try { go('mine'); } catch (e) {} }]; }
    else if (S.day === 2) h = tomorrowList(T).replace('margin-top:10px;', '');
    else if (S.day === 3 && S.clan) { h = '<b class="h">' + ec(T.u3m) + '</b><p>' + ec(T.u3ms) + '</p>'; btn = ['u3mb', () => { try { openCoin(102); } catch (e) {} }]; }
    else if (S.day === 3) { h = '<b class="h">' + ec(T.u3) + '</b><p>' + ec(T.u3s) + '</p>'; btn = ['u3b', () => { try { if (window.mctClans) window.mctClans(); else go('leaders'); } catch (e) {} }]; }
    if (!h) { c.remove(); return; }
    c.innerHTML = h + (btn ? '<button type="button" class="go">' + ec(T[btn[0]]) + '</button>' : '');
    if (btn) c.querySelector('button.go').onclick = () => { hp(); btn[1](); };
  }
  async function tick() {
    let mk = false; try { mk = VIEW === 'market'; } catch (e) {}
    if (!mk || busy) return;
    const v = document.getElementById('view'); if (!v || v.querySelector('#onb')) return;
    const h1 = v.querySelector('h1'); if (!h1) return;
    busy = true;
    try {
      // the state is asked again after a minute, or right away once the player bought or sold (the market is drawn again then)
      if (!S || Date.now() - T0 > 60000 || tick.dirty) { const r = await call(); if (r && r.ok) { S = r; T0 = Date.now(); } tick.dirty = false; }
    } finally { busy = false; }
    if (!S || S.day > 3) { document.body.classList.remove('onb1', 'onb2', 'onb3'); return; }
    document.body.classList.remove('onb1', 'onb2', 'onb3'); document.body.classList.add('onb' + S.day);
    if (v.querySelector('#onb') || !document.body.contains(h1)) return;
    const c = document.createElement('div'); c.id = 'onb'; h1.insertAdjacentElement('afterend', c); draw(c);
  }
  // a buy or a sale changes the goal: ask the state again on the next market screen
  const of = window.fetch;
  window.fetch = async function (u, o) {
    const r = await of.apply(this, arguments);
    try { if (String(u).indexOf('/mct/api') >= 0 && o && typeof o.body === 'string' && /"action":"(buy|sell)"/.test(o.body)) tick.dirty = true; } catch (e) {}
    return r;
  };
  window.mctOnb = { state: () => S };
  setInterval(tick, 600);
})();
