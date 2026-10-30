// 30 oct 2026 (17h31, Jeremy): a "⋯ More" tab in the menu of Meme Coin Tycoon, to declutter the game. It opens a sheet with
// the side options: my friends, invite, recharge, Premium, money log, blockchains, official channel, code of the day, FAQ, contact.
// The Portfolio keeps the essentials (net worth, recharge, the stock market, coins, holdings, staking); the friends card of the
// Leaders tab moves here too. The game's own functions are used (go, api, t, rchBuy, shareGame, mctFriends, mctPremium).
(() => {
  const TX = {
    fr: { more: 'Plus', title: 'Plus d\'options', fr: '👥 Mes amis', frs: 'Classement entre amis et cadeau du jour', inv: 'Ton lien d\'invitation', rch: 'Jusqu\'à +16 000 $ · 1er achat doublé', pr: '💎 Premium', prs: 'Sans vidéo, +1 000 $ par jour et plus', faq: '❓ Aide et FAQ', faqs: 'Toutes les règles du jeu', ct: '💬 Me contacter', cts: 'Une question, un souci', close: 'Fermer', st: (d, s) => 'Jour ' + d + '/7' },
    en: { more: 'More', title: 'More options', fr: '👥 My friends', frs: 'Ranking between friends and daily gift', inv: 'Your invite link', rch: 'Up to +$16,000 · first purchase doubled', pr: '💎 Premium', prs: 'No videos, +$1,000 a day and more', faq: '❓ Help and FAQ', faqs: 'All the rules of the game', ct: '💬 Contact me', cts: 'A question, a problem', close: 'Close' },
    id: { more: 'Lainnya', title: 'Opsi lainnya', fr: '👥 Temanku', frs: 'Peringkat antar teman dan hadiah harian', inv: 'Link undanganmu', rch: 'Hingga +$16,000 · pembelian pertama x2', pr: '💎 Premium', prs: 'Tanpa video, +$1,000 per hari dan lainnya', faq: '❓ Bantuan dan FAQ', faqs: 'Semua aturan game', ct: '💬 Hubungi aku', cts: 'Pertanyaan, masalah', close: 'Tutup' },
    ru: { more: 'Ещё', title: 'Другие опции', fr: '👥 Мои друзья', frs: 'Рейтинг среди друзей и подарок дня', inv: 'Твоя ссылка-приглашение', rch: 'До +$16,000 · первая покупка x2', pr: '💎 Премиум', prs: 'Без видео, +$1,000 в день и другое', faq: '❓ Помощь и FAQ', faqs: 'Все правила игры', ct: '💬 Связаться со мной', cts: 'Вопрос, проблема', close: 'Закрыть' },
    ar: { more: 'المزيد', title: 'خيارات أخرى', fr: '👥 أصدقائي', frs: 'الترتيب بين الأصدقاء وهدية اليوم', inv: 'رابط دعوتك', rch: 'حتى ‎+$16,000 · أول شراء مضاعف', pr: '💎 بريميوم', prs: 'بدون فيديو، ‎+$1,000 يوميًا والمزيد', faq: '❓ المساعدة والأسئلة', faqs: 'كل قواعد اللعبة', ct: '💬 تواصل معي', cts: 'سؤال أو مشكلة', close: 'إغلاق' },
    fa: { more: 'بیشتر', title: 'گزینه‌های بیشتر', fr: '👥 دوستان من', frs: 'رتبه‌بندی بین دوستان و هدیه روزانه', inv: 'لینک دعوت تو', rch: 'تا ‎+$16,000 · اولین خرید دو برابر', pr: '💎 پریمیوم', prs: 'بدون ویدیو، روزی ‎+$1,000 و بیشتر', faq: '❓ راهنما و سوالات', faqs: 'همه قوانین بازی', ct: '💬 تماس با من', cts: 'سوال یا مشکل', close: 'بستن' },
  };
  const G = (n) => { try { return (0, eval)('typeof ' + n + ' !== "undefined" ? ' + n + ' : undefined'); } catch (e) { return undefined; } };
  const lg = () => { const l = G('LANG') || 'en'; return TX[l] ? l : 'en'; };
  const L = () => TX[lg()];
  const tt = (k, ...a) => { const f = G('t'); try { return f ? f(k, ...a) : k; } catch (e) { return k; } };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const hp = (x) => { const h = G('haptic'); try { if (h) h(x); } catch (e) {} };
  const tst = (m) => { const f = G('toast'); try { if (f) f(m); } catch (e) {} };
  const tw = window.Telegram && Telegram.WebApp;
  const openTg = (u) => { try { tw.openTelegramLink(u); } catch (e) { window.open(u); } };
  const openUrl = (u) => { try { tw.openLink(u); } catch (e) { window.open(u); } };

  const st = document.createElement('style');
  st.textContent = 'nav.tb button{min-width:52px}#frcard{display:none!important}'
    + '#mrm{position:fixed;inset:0;z-index:60;background:rgba(5,3,15,.72);display:flex;align-items:flex-end;justify-content:center}'
    + '#mrm .mb{width:100%;max-width:520px;max-height:86vh;overflow:auto;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:18px 16px calc(20px + env(safe-area-inset-bottom))}'
    + '#mrm h2{margin:0 0 12px;text-align:center}'
    + '#mrm .mo{display:flex;align-items:center;gap:12px;width:100%;text-align:left;color:inherit;padding:12px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid var(--line,rgba(255,255,255,.1));margin-bottom:8px}'
    + '#mrm .mo b{display:block;font-size:15px}#mrm .mo small{display:block;color:var(--mute,#9a8fb8);font-size:12px;margin-top:2px;white-space:normal}'
    + '#mrm .mo .w{flex:1;min-width:0}#mrm .mo .go{color:var(--mute,#9a8fb8);font-size:20px}'
    + '#mrm .cd{display:flex;gap:8px;margin:-2px 0 8px}#mrm .cd input{flex:1;min-width:0}'
    + '#mrm #msn{display:block!important;margin:0 0 10px}#mrm #msn:empty{display:none!important}';
  document.head.appendChild(st);

  // 31 oct 2026 (0h42, Jeremy): the daily missions are back, at the top of this sheet (still hidden on the market). The game's own
  // renderMissions draws them in #msn: while the sheet is open, the hidden #msn of the market is renamed so the sheet gets them.
  function close() { const d = document.getElementById('mrm'); if (d) d.remove(); const o = document.getElementById('msn_mk'); if (o) o.id = 'msn'; }
  async function missions() {
    const old = document.querySelector('#view #msn'); if (old) old.id = 'msn_mk';
    let ms = null; try { ms = await G('api')('missions'); } catch (e) {}
    if (!document.getElementById('mrm') || !ms) return;
    try { G('renderMissions')(ms); } catch (e) {}
  }
  function sheet() {
    hp(); close();
    const T = L(), ME = G('ME') || {};
    const row = (k, b, s) => '<button class="mo" type="button" data-k="' + k + '"><span class="w"><b>' + ec(b) + '</b>' + (s ? '<small>' + ec(s) + '</small>' : '') + '</span><span class="go">›</span></button>';
    const d = document.createElement('div'); d.id = 'mrm';
    d.innerHTML = '<div class="mb"><h2>' + ec(T.title) + '</h2><div id="msn"></div>'
      + row('rch', tt('rch_t'), T.rch)
      + row('prem', T.pr, T.prs)
      + row('fr', T.fr, T.frs)
      + (ME.uid ? row('inv', tt('inv_h'), tt('inv_tile') + (ME.refs ? ' · ' + ME.refs : '')) : '')
      + row('led', tt('led_btn'), tt('led_sub'))
      + row('chn', tt('chains_btn'), tt('chains_sub'))
      + (ME.joined ? '' : row('join', tt('join_h'), tt('join_s')))
      + row('code', tt('code_h'), tt('code_s'))
      + '<div class="cd field" id="mrcd" hidden><input id="mrci" maxlength="12" autocapitalize="characters" autocomplete="off" placeholder="' + ec(tt('code_ph')) + '"><button class="ghost sm" id="mrcb">' + ec(tt('code_b')) + '</button></div>'
      + row('faq', T.faq, T.faqs)
      + row('ct', T.ct, T.cts)
      + '<button class="ghost" id="mrx" style="width:100%;margin-top:6px">' + ec(T.close) + '</button></div>';
    d.onclick = (e) => { if (e.target === d) { close(); return; } const mr = e.target.closest('[data-mk]'); if (mr && !e.target.closest('[data-mc]') && !mr.querySelector('.msn-ok')) setTimeout(close, 0); };
    document.body.appendChild(d); missions();
    d.querySelector('#mrx').onclick = () => { hp(); close(); };
    d.querySelectorAll('[data-k]').forEach((b) => b.onclick = () => act(b.dataset.k, b));
    const cb = d.querySelector('#mrcb');
    cb.onclick = async () => {
      const inp = d.querySelector('#mrci'), v0 = inp.value.trim(); if (!v0) return; hp(); cb.disabled = true;
      let r = null; try { r = await G('api')('code', { code: v0 }); } catch (e) {}
      cb.disabled = false;
      if (!r || !r.ok) { hp('err'); if (r && r.error === 'not_member') openTg('https://t.me/memecointycoon'); const em = G('errMsg'); tst(em ? em(r || {}) : '⚠️'); return; }
      hp('ok'); try { G('setCash')(r.cash); } catch (e) {} tst(tt('code_ok', r.amount)); inp.value = '';
    };
  }
  async function act(k, b) {
    hp(); const ME = G('ME') || {}, go = G('go');
    if (k === 'rch') { close(); const f = G('rchBuy'); if (f) f(); return; }
    if (k === 'prem') { close(); if (window.mctPremium) window.mctPremium(); return; }
    if (k === 'fr') { close(); if (window.mctFriends) window.mctFriends(); return; }
    if (k === 'inv') { close(); const sg = G('shareGame'); if (sg) sg('invite', 0, 'https://t.me/Memecointycoonbot?startapp=r_' + ME.uid, tt('inv_msg')); return; }
    if (k === 'led') { close(); if (go) go('ledger'); return; }
    if (k === 'chn') { close(); if (go) go('chains'); return; }
    if (k === 'faq') { openUrl('https://jeremstyke.github.io/memecointycoon/faq/'); return; }
    if (k === 'ct') { openTg('https://t.me/jeremstyke?direct'); return; }
    if (k === 'code') { const c = document.getElementById('mrcd'); if (c) { c.hidden = !c.hidden; if (!c.hidden) { const i = c.querySelector('input'); if (i) i.focus(); } } return; }
    if (k === 'join') {
      // same as the old row of the Portfolio: open the channel, then "I joined" checks it and gives the bonus
      if (!b.dataset.opened) { b.dataset.opened = '1'; openTg('https://t.me/memecointycoon'); setTimeout(() => { const w = b.querySelector('b'); if (w) w.textContent = tt('join_check'); }, 800); return; }
      b.disabled = true; let r = null; try { r = await G('api')('join_bonus'); } catch (e) {} b.disabled = false;
      if (!r || !r.ok) { hp('err'); const em = G('errMsg'); tst(em ? em(r || {}) : '⚠️'); return; }
      hp('ok'); try { G('setCash')(r.cash); } catch (e) {} tst(tt('join_ok')); try { ME.joined = true; } catch (e) {} b.remove();
    }
  }
  window.mctMore = sheet;

  // the tab in the menu (no data-v: it opens a sheet, it is not a page of the game)
  function tab() {
    const nav = document.querySelector('nav.tb'); if (!nav || document.getElementById('mrb')) return;
    const b = document.createElement('button'); b.id = 'mrb'; b.type = 'button';
    b.innerHTML = '<span>⋯</span><i>' + ec(L().more) + '</i>';
    b.addEventListener('click', (e) => { e.stopImmediatePropagation(); e.preventDefault(); sheet(); }, true);
    nav.appendChild(b);
  }

  // the Portfolio keeps the essentials: the recharge tile stays (full width), the rest moved to "More"
  function clean() {
    let v = ''; try { v = G('VIEW'); } catch (e) {}
    if (v !== 'portfolio') return;
    const view = document.getElementById('view'); if (!view) return;
    ['inv', 'ledb', 'chn'].forEach((id) => { const x = view.querySelector('#' + id); if (x) x.remove(); });
    const r = view.querySelector('#rch'); if (r && !r.classList.contains('wide')) r.classList.add('wide');
    const bh = tt('bonus_h'), h = Array.from(view.querySelectorAll('h2')).find((x) => x.textContent === bh);
    if (h) {
      let n = h.nextElementSibling; h.remove();
      while (n && (n.classList.contains('row') || n.classList.contains('field'))) { const nx = n.nextElementSibling; n.remove(); n = nx; }
    }
  }
  // the red dot of the missions (a reward waiting) goes on the "More" tab instead of the market tab
  setInterval(() => {
    let w = 0; try { w = Number(G('MSN_W')) || 0; } catch (e) {}
    const mk = document.querySelector('nav.tb button[data-v="market"]'); if (mk) mk.classList.remove('dot');
    const mb = document.getElementById('mrb'); if (mb) mb.classList.toggle('dot', w > 0);
  }, 1000);
  let q = 0;
  new MutationObserver(() => { if (!q) q = requestAnimationFrame(() => { q = 0; tab(); clean(); }); }).observe(document.body, { childList: true, subtree: true });
  tab(); clean();
})();
