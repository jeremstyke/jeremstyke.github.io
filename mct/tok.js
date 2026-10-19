// 18 oct 2026 (Jeremy): $MCT, the official virtual coin of Meme Coin Tycoon. A card at the top of the market: price, what the player
// holds and his badge, the reserve of free $MCT (1,000,000, halved under 500,000 and 250,000), a video for +10 $MCT (3 a day,
// Premium without the video, rw.js) and how to earn it. Data from the Supabase function mct-ton (actions mon_tok<kind>, mct_tok_api).
(() => {
  const TX = {
    fa: {
      t: '🏛️ $MCT · کوین رسمی', sub: 'کوین بازی: هرچه بازی بزرگ‌تر شود، ارزشش بیشتر می‌شود', you: 'داری', res: (a, b) => '$MCT رایگان باقی‌مانده: ' + a + ' / ' + b, pot: (a) => '💵 صندوق هفته: ' + a + ' (2 % از هر خرید و فروش)، تقسیم در دوشنبه', badge: '🏛️ کوین رسمی بازی · کارمزد 2 % روی هر معامله، هر دوشنبه به دارندگان برمی‌گردد',
      vid: (q, n) => '📺 +' + q + ' $MCT (' + n + '/3)', vidp: (q, n) => '💎 +' + q + ' $MCT (' + n + '/3)', vid0: '📺 فردا برگرد', see: 'دیدن کوین', how: '❓ چطور $MCT به دست بیاورم', ok: (q) => '🏛️ +' + q + ' $MCT اضافه شد!', skip: 'ویدیو تمام نشد: این بار جایزه‌ای نیست.', done: 'امروز 3 بار گرفته شده. فردا برگرد!', empty: 'ذخیره خالی است: $MCT حالا فقط خریدنی است.', err: 'مشکلی پیش آمد، دوباره امتحان کن.',
      tiers: ['', '🥉 برنز', '🥈 نقره', '🥇 طلا'],
      list: (e, d) => [].concat(e.trade ? ['📅 جایزه روزانه: هر روز +' + e.daily + ' $MCT', '📈 هر معامله ' + e.trade_min + ' دلار یا بیشتر: +' + e.trade + ' $MCT (روزی ' + e.trade_max + ')', '🎯 هر مأموریت: +' + e.mission + ' $MCT، صندوق: +' + e.chest + ' $MCT'] : [], ['📺 یک ویدیو: +' + e.video + ' $MCT (روزی 3)', '🔥 روز هفتم روزهای پیاپی: +' + e.streak + ' $MCT', '👥 هر دوستی که واقعاً بازی کند: +' + e.ref + ' $MCT', '🛡️ 3 کلن برتر هفته: +' + e.clan.join(' / ') + ' $MCT برای هر عضو', '💎 3 نفر برتر مسابقه الماس: +' + e.dia.join(' / ') + ' $MCT', '💎 الماس: +1 $MCT هر 100 ضربه (حداکثر 200 در روز)', '⛏️ با دستگاهت استخراجش کن (50 % بازده معمول)', '💵 هر دوشنبه: کارمزدهای 2 % هفته بین دارندگان ' + d.min + ' $MCT یا بیشتر تقسیم می‌شود، هرچه بیشتر داشته باشی سهمت بیشتر است', '🥉 1,000 برنز · 🥈 10,000 نقره (+5 % استخراج) · 🥇 100,000 طلا (+10 % استخراج)', '⭐ هر ستاره‌ای که در بازی خرج شود $MCT را بالا می‌برد', '📉 جوایز رایگان وقتی ذخیره زیر 500,000 و سپس 250,000 برود نصف می‌شوند']),
    },
    ru: {
      t: '🏛️ $MCT · официальная монета', sub: 'Монета игры: чем больше растёт игра, тем дороже она стоит', you: 'У тебя', res: (a, b) => 'Осталось бесплатных $MCT: ' + a + ' / ' + b, pot: (a) => '💵 Фонд недели: ' + a + ' (2 % с каждой покупки и продажи), делится в понедельник', badge: '🏛️ Официальная монета игры · комиссия 2 % с каждой сделки возвращается держателям каждый понедельник',
      vid: (q, n) => '📺 +' + q + ' $MCT (' + n + '/3)', vidp: (q, n) => '💎 +' + q + ' $MCT (' + n + '/3)', vid0: '📺 Возвращайся завтра', see: 'Смотреть монету', how: '❓ Как заработать $MCT', ok: (q) => '🏛️ +' + q + ' $MCT добавлено!', skip: 'Видео не досмотрено: в этот раз без награды.', done: 'Уже получено 3 раза сегодня. Возвращайся завтра!', empty: 'Резерв пуст: $MCT теперь можно только купить.', err: 'Что-то пошло не так, попробуй ещё раз.',
      tiers: ['', '🥉 Бронза', '🥈 Серебро', '🥇 Золото'],
      list: (e, d) => [].concat(e.trade ? ['📅 Ежедневный бонус: +' + e.daily + ' $MCT каждый день', '📈 Каждая сделка от $' + e.trade_min + ': +' + e.trade + ' $MCT (' + e.trade_max + ' в день)', '🎯 Каждое задание: +' + e.mission + ' $MCT, сундук: +' + e.chest + ' $MCT'] : [], ['📺 Видео: +' + e.video + ' $MCT (3 в день)', '🔥 7-й день серии: +' + e.streak + ' $MCT', '👥 Каждый друг, который реально играет: +' + e.ref + ' $MCT', '🛡️ Топ-3 кланов недели: +' + e.clan.join(' / ') + ' $MCT каждому участнику', '💎 Топ-3 конкурса алмаза: +' + e.dia.join(' / ') + ' $MCT', '💎 Алмаз: +1 $MCT за каждые 100 нажатий (до 200 в день)', '⛏️ Майни её своим майнером (50 % обычной добычи)', '💵 Каждый понедельник комиссии 2 % за неделю делятся между держателями от ' + d.min + ' $MCT, чем больше держишь, тем больше доля', '🥉 1,000 Бронза · 🥈 10,000 Серебро (+5 % майнинга) · 🥇 100,000 Золото (+10 % майнинга)', '⭐ Каждая звезда, потраченная в игре, поднимает $MCT', '📉 Бесплатные награды делятся пополам, когда резерв падает ниже 500,000, затем 250,000']),
    },
    en: {
      t: '🏛️ $MCT · the official coin', sub: 'The coin of the game: the more the game grows, the more it is worth', you: 'You hold', res: (a, b) => 'Free $MCT left: ' + a + ' / ' + b, pot: (a) => '💵 Pot of the week: ' + a + ' (2 % of every buy and sale), shared on Monday', badge: '🏛️ The official coin of the game · 2 % fee on every trade, paid back to the holders every Monday',
      vid: (q, n) => '📺 +' + q + ' $MCT (' + n + '/3)', vidp: (q, n) => '💎 +' + q + ' $MCT (' + n + '/3)', vid0: '📺 Come back tomorrow', see: 'See the coin', how: '❓ How to earn $MCT', ok: (q) => '🏛️ +' + q + ' $MCT added!', skip: 'The video was not finished: no reward this time.', done: 'Already taken 3 times today. Come back tomorrow!', empty: 'The reserve is empty: $MCT is only bought now.', err: 'Something went wrong, try again.',
      tiers: ['', '🥉 Bronze', '🥈 Silver', '🥇 Gold'],
      list: (e, d) => [].concat(e.trade ? ['📅 Your daily bonus: +' + e.daily + ' $MCT every day', '📈 Each trade of $' + e.trade_min + ' or more: +' + e.trade + ' $MCT (' + e.trade_max + ' a day)', '🎯 Each mission done: +' + e.mission + ' $MCT, the chest: +' + e.chest + ' $MCT'] : [], ['📺 A video: +' + e.video + ' $MCT (3 a day)', '🔥 Day 7 of your streak: +' + e.streak + ' $MCT', '👥 Each friend who really plays: +' + e.ref + ' $MCT', '🛡️ Top 3 clans of the week: +' + e.clan.join(' / ') + ' $MCT for each member', '💎 Top 3 of the diamond contest: +' + e.dia.join(' / ') + ' $MCT', '⛏️ Mine it with your rig (50 % of the normal yield)', '💵 Every Monday: the 2 % fees of the week are shared between the holders of ' + d.min + ' $MCT or more, the more you hold the bigger your share', '🥉 1,000 Bronze · 🥈 10,000 Silver (+5 % mining) · 🥇 100,000 Gold (+10 % mining)', '⭐ Every Star spent in the game pushes $MCT up', '📉 The free rewards are halved when the reserve goes under 500,000, then 250,000']),
    },
    fr: {
      t: '🏛️ $MCT · le coin officiel', sub: 'Le coin du jeu : plus le jeu grandit, plus il vaut cher', you: 'Tu as', res: (a, b) => '$MCT gratuits restants : ' + a + ' / ' + b, pot: (a) => '💵 Cagnotte de la semaine : ' + a + ' (2 % de chaque achat et vente), partagée lundi', badge: '🏛️ Le coin officiel du jeu · 2 % de frais sur chaque achat et vente, reversés aux détenteurs chaque lundi',
      vid: (q, n) => '📺 +' + q + ' $MCT (' + n + '/3)', vidp: (q, n) => '💎 +' + q + ' $MCT (' + n + '/3)', vid0: '📺 Reviens demain', see: 'Voir le coin', how: '❓ Comment gagner des $MCT', ok: (q) => '🏛️ +' + q + ' $MCT ajoutés !', skip: 'Vidéo pas terminée : pas de récompense cette fois.', done: 'Déjà pris 3 fois aujourd\'hui. Reviens demain !', empty: 'La réserve est vide : $MCT s\'achète maintenant.', err: 'Une erreur est survenue, réessaie.',
      tiers: ['', '🥉 Bronze', '🥈 Argent', '🥇 Or'],
      list: (e, d) => [].concat(e.trade ? ['📅 Ton bonus du jour : +' + e.daily + ' $MCT chaque jour', '📈 Chaque trade de ' + e.trade_min + ' $ ou plus : +' + e.trade + ' $MCT (' + e.trade_max + ' par jour)', '🎯 Chaque mission réussie : +' + e.mission + ' $MCT, le coffre : +' + e.chest + ' $MCT'] : [], ['📺 Une vidéo : +' + e.video + ' $MCT (3 par jour)', '🔥 7e jour de ta série : +' + e.streak + ' $MCT', '👥 Chaque ami qui joue vraiment : +' + e.ref + ' $MCT', '🛡️ Top 3 des clans de la semaine : +' + e.clan.join(' / ') + ' $MCT par membre', '💎 Top 3 du concours du diamant : +' + e.dia.join(' / ') + ' $MCT', '⛏️ Mine-le avec ton rig (50 % du rendement normal)', '💵 Chaque lundi : les 2 % de frais de la semaine sont partagés entre ceux qui ont ' + d.min + ' $MCT ou plus, plus tu en as, plus ta part est grosse', '🥉 1 000 Bronze · 🥈 10 000 Argent (+5 % de minage) · 🥇 100 000 Or (+10 % de minage)', '⭐ Chaque étoile dépensée dans le jeu fait monter $MCT', '📉 Les récompenses gratuites sont divisées par 2 quand la réserve passe sous 500 000, puis sous 250 000']),
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
  let S = null;

  // 18 oct 2026 (Jeremy, 2h35): no big card, a thin one-line bar at the top of the market; a tap opens a sheet with the details
  const st = document.createElement('style');
  st.textContent = '.tokc{display:flex;align-items:center;gap:8px;width:100%;box-sizing:border-box;border:1px solid rgba(255,212,59,.4);background:rgba(255,212,59,.08);border-radius:12px;padding:7px 10px;margin:0 0 10px;color:inherit;font:inherit;font-size:13px;cursor:pointer;text-align:left}'
    + '.tokc .ti{font-size:16px;flex:none}.tokc b{flex:none}.tokc .tm{opacity:.75;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}.tokc .tg{flex:none;font-weight:800;font-size:12px;padding:3px 8px;border-radius:99px;background:#ffd43b;color:#1a1200}.tokc .ta{flex:none;opacity:.6}'
    + '#tokm{position:fixed;inset:0;z-index:90;background:rgba(5,3,15,.72);display:flex;align-items:flex-end;justify-content:center}#tokm>div{width:100%;max-width:520px;max-height:85vh;overflow:auto;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:18px 16px calc(20px + env(safe-area-inset-bottom))}'
    + '#tokm .th{display:flex;align-items:center;gap:10px}#tokm .tp{margin-left:auto;text-align:right;white-space:nowrap;flex:none}#tokm small{display:block;font-size:12px;opacity:.8;line-height:1.35}'
    + '#tokm .tr{height:6px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden;margin:10px 0 4px}#tokm .tr i{display:block;height:100%;background:linear-gradient(90deg,#ffd43b,#ff9a3c)}'
    + '#tokm .tb{display:flex;gap:8px;margin-top:12px}#tokm .tb button{flex:1;border:0;border-radius:12px;padding:10px 6px;font-weight:800;font-size:13px;cursor:pointer}#tokm .tv{background:#ffd43b;color:#1a1200}#tokm .ts{background:rgba(255,255,255,.1);color:inherit}#tokm .tb button:disabled{opacity:.55}'
    + '#tokm ul{margin:12px 0 0;padding-left:18px;font-size:12.5px;line-height:1.5;opacity:.9}';
  document.head.appendChild(st);

  // the bar
  function draw(c) {
    if (!S || !c) return;
    const T = L(), can = S.vid_left > 0 && S.reserve > 0, ch = S.px24 ? (Number(S.px) / Number(S.px24) - 1) * 100 : 0;
    // in the market: price, change and what the player holds; on the coin page: how to earn
    c.innerHTML = c.dataset.m === 'mk'
      ? '<span class="ti">🏛️</span><b>$MCT ' + usd(S.px) + '</b><small style="color:' + (ch >= 0 ? '#4ff0b7' : '#ff8a8a') + ';font-weight:800;flex:none">' + (ch >= 0 ? '+' : '') + ch.toFixed(1) + '%</small>'
        + '<span class="tm">· ' + ec(T.you) + ' ' + nf(S.held) + '</span>' + (can ? '<span class="tg">📺 +' + nf(S.vid) + '</span>' : '') + '<span class="ta">›</span>'
      : '<span class="ti">🏛️</span><span class="tm" style="opacity:1">' + ec(T.how) + '</span>' + (can ? '<span class="tg">📺 +' + nf(S.vid) + '</span>' : '') + '<span class="ta">›</span>';
    c.onclick = () => { hp(); sheet(c); };
  }
  // the sheet with everything
  function sheet(c) {
    const old = document.getElementById('tokm'); if (old) old.remove();
    if (!S) return;
    const T = L(), ch = S.px24 ? (Number(S.px) / Number(S.px24) - 1) * 100 : 0, pr = !!window.MCTPREM;
    const pct = Math.max(0, Math.min(100, Number(S.reserve) / Number(S.reserve0) * 100));
    const d = document.createElement('div'); d.id = 'tokm';
    d.innerHTML = '<div><div class="th"><span style="font-size:30px">🏛️</span><div style="min-width:0"><b style="font-size:16px">' + ec(T.t) + '</b><small>' + ec(T.sub) + '</small></div>'
      + '<div class="tp"><b style="font-size:16px">' + usd(S.px) + '</b><small style="color:' + (ch >= 0 ? '#4ff0b7' : '#ff8a8a') + ';font-weight:800">' + (ch >= 0 ? '+' : '') + ch.toFixed(1) + ' %</small></div></div>'
      + '<small style="margin-top:10px">' + ec(T.you) + ' <b>' + nf(S.held, 2) + ' $MCT</b> (≈ ' + usd(S.value) + ')' + (S.tier ? ' · <b>' + ec(T.tiers[S.tier]) + '</b>' : '') + '</small>'
      + '<div class="tr"><i style="width:' + pct.toFixed(1) + '%"></i></div><small>' + ec(T.res(nf(S.reserve), nf(S.reserve0))) + '</small>'
      + '<small style="margin-top:8px;font-weight:700">' + ec(T.pot(usd(S.div))) + '</small>'
      + '<div class="tb"><button type="button" class="tv" id="tokv"' + (S.vid_left > 0 && S.reserve > 0 ? '' : ' disabled') + '>' + ec(S.vid_left > 0 ? (pr ? T.vidp : T.vid)(nf(S.vid, 2), S.vid_left) : T.vid0) + '</button></div>'
      + '<b style="display:block;margin-top:14px;font-size:13px">' + ec(T.how) + '</b><ul>' + T.list(S.earn, { div: Number(S.div), min: nf(S.div_min) }).map((x) => '<li>' + ec(x) + '</li>').join('') + '</ul></div>';
    d.onclick = (ev) => { if (ev.target === d) d.remove(); };
    document.body.appendChild(d);
    d.querySelector('#tokv').onclick = async (ev) => {
      const b = ev.currentTarget; hp(); b.disabled = true; b.textContent = '⏳';
      // 18 oct 2026 (Jeremy): check before the video, so nobody watches a video for nothing
      await load(true); if (!S || !(S.vid_left > 0) || !(S.reserve > 0)) { tst(S && S.reserve > 0 ? T.done : T.empty); draw(c); sheet(c); return; }
      const ok = window.mctRw ? await window.mctRw.watch(1, b) : true;
      if (!ok) { tst(T.skip); draw(c); sheet(c); return; }
      const r = await call('vid');
      if (!r || !r.ok) { hp('err'); tst((r && r.error && T[r.error]) || T.err); } else { hp('ok'); tst(T.ok(nf(r.qty, 2))); }
      await load(true); draw(c); if (document.getElementById('tokm')) sheet(c);
    };
  }
  // 18 oct 2026: asked again at most once a minute (the market is drawn again often; the base was overloaded)
  let T0 = 0;
  async function load(force) { if (!force && S && Date.now() - T0 < 60000) return S; const r = await call('state'); if (r && r.ok) { S = r; T0 = Date.now(); } return S; }
  // 18 oct 2026 (Jeremy): $MCT is listed with the other coins (first in Hot and Top, mct_market), a thin bar at the top of the
  // market (2h51: kept) and on the $MCT coin page; a tap opens the sheet with the video and how to earn
  async function card() {
    let cid = null, mk = false; try { cid = COIN && COIN.coin && COIN.coin.id; } catch (e) {} try { mk = VIEW === 'market'; } catch (e) {}
    const sh = document.getElementById('sheet'), open = sh && sh.classList.contains('open');
    if (cid === 102 && sh) { const bd = sh.querySelector('.badges.hint'); if (bd && bd.textContent !== L().badge) bd.textContent = L().badge; }
    let c = null;
    if (open && cid === 102 && !sh.querySelector('#tokcc')) {
      // 18 oct 2026 (Jeremy, 2h53): just above the chart
      const ch = sh.querySelector('#ch'); if (!ch) return;
      c = document.createElement('button'); c.type = 'button'; c.id = 'tokcc'; c.className = 'tokc'; c.dataset.m = 'coin'; c.style.margin = '10px 16px 6px'; c.style.width = 'calc(100% - 32px)'; ch.insertAdjacentElement('beforebegin', c);
    } else if (mk) {
      const v = document.getElementById('view'); if (!v || v.querySelector('#tokc')) return;
      const h = v.querySelector('h1'); if (!h) return;
      c = document.createElement('button'); c.type = 'button'; c.id = 'tokc'; c.className = 'tokc'; c.dataset.m = 'mk'; h.insertAdjacentElement('afterend', c);
    }
    if (!c) return;
    if (S) draw(c);
    await load(); if (document.body.contains(c)) draw(c);
  }
  window.mctTok = { load, state: () => S };
  setInterval(card, 600);
})();
