// 26 oct 2026 (22h50, Jeremy): the "🏦 Exchange" of Meme Coin Tycoon (idea of a player): a filter in the Market, next to Hot / New /
// Top..., that lists only the memecoins that proved themselves (3 days old, still traded, 10+ holders besides the creator).
// Data: edge function mct-bourse, action 'exch' (SQL mct_exch_list). New listings are announced on @memecointycoon (mct_exch_refresh).
// A link whose start_param contains "exch" (t.me/Memecointycoonbot?startapp=src_exch) opens the Exchange directly.
(() => {
  const tw = window.Telegram && Telegram.WebApp;
  const FN = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-bourse';
  const TX = {
    en: { seg: '🏦 Exchange', note: 'Only the coins that proved themselves are listed here: 3 days old, still traded, 10+ holders.', none: 'No coin is listed yet. Make yours grow!', holders: (n) => n + ' holders', fresh: 'NEW' },
    fr: { seg: '🏦 Exchange', note: 'Seuls les coins qui ont fait leurs preuves sont listés ici : 3 jours d’existence, toujours échangés, 10 holders ou plus.', none: 'Aucun coin listé pour l’instant. Fais grandir le tien !', holders: (n) => n + ' holders', fresh: 'NOUVEAU' },
    ru: { seg: '🏦 Биржа', note: 'Здесь только монеты, которые доказали себя: 3 дня, ими торгуют, 10+ держателей.', none: 'Пока нет монет в листинге. Развивай свою!', holders: (n) => n + ' держателей', fresh: 'НОВОЕ' },
    ar: { seg: '🏦 البورصة', note: 'هنا فقط العملات التي أثبتت نفسها: عمرها 3 أيام، ما زال يُتداول بها، و10 حاملين أو أكثر.', none: 'لا توجد عملة مدرجة بعد. نمِّ عملتك!', holders: (n) => n + ' حامل', fresh: 'جديد' },
    fa: { seg: '🏦 صرافی', note: 'فقط کوین‌هایی که خودشان را ثابت کرده‌اند اینجا لیست می‌شوند: ۳ روزه، هنوز معامله می‌شوند، ۱۰+ دارنده.', none: 'هنوز هیچ کوینی لیست نشده. کوین خودت را رشد بده!', holders: (n) => n + ' دارنده', fresh: 'جدید' },
    id: { seg: '🏦 Bursa', note: 'Hanya koin yang sudah terbukti yang terdaftar di sini: berumur 3 hari, masih diperdagangkan, 10+ holder.', none: 'Belum ada koin yang terdaftar. Kembangkan koinmu!', holders: (n) => n + ' holder', fresh: 'BARU' },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] || TX.en; };
  const view = () => { try { return VIEW; } catch (e) { return ''; } };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  let ON = false, DATA = null, at = 0, loading = false;

  const st = document.createElement('style');
  // 26 oct 2026 (22h52, Jeremy): with 6 filters the bar was too tight (labels stuck together): now it scrolls sideways, each filter with its own room
  st.textContent = '#view .seg{overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;gap:2px}#view .seg::-webkit-scrollbar{display:none}#view .seg button{flex:0 0 auto;padding:8px 13px}'
    + '.exnew{font-size:10px;font-weight:800;border-radius:6px;padding:1px 5px;margin-left:4px;background:#4ff0b7;color:#0d2a22;vertical-align:2px}';
  document.head.appendChild(st);

  async function load() {
    if (loading) return; loading = true;
    try { const r = await (await fetch(FN, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: tw && tw.initData, action: 'exch' }) })).json(); if (r && r.ok) { DATA = r.coins || []; at = Date.now(); } } catch (e) {}
    loading = false; if (ON) draw();
  }
  function draw() {
    const l = document.getElementById('list'); if (!l || view() !== 'market' || !ON) return;
    const T = L();
    if (!DATA) { l.innerHTML = '<div data-exl="1"><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>'; return; }
    let h = '<div data-exl="1"><p class="hint">' + T.note + '</p>';
    if (!DATA.length) h += '<div class="empty"><p class="hint">' + T.none + '</p></div>';
    h += DATA.map((c) => {
      let k = { txt: '', cls: 'up' }; try { k = chg(c.price, c.p24); } catch (e) {}
      let md = '<span class="med" style="--c:' + ec(c.color || '#ffd43b') + '">' + ec(c.emoji || '🪙') + '</span>'; try { md = medal(c); } catch (e) {}
      let pr = '$' + Number(c.price || 0).toPrecision(4); try { pr = fp(c.price); } catch (e) {}
      return '<button class="row" data-exc="' + Number(c.id) + '">' + md + '<div class="who"><b>$' + ec(c.ticker) + (c.fresh ? '<span class="exnew">' + T.fresh + '</span>' : '') + '</b><small>' + ec(c.name) + ' · ' + T.holders(c.holders) + '</small></div>'
        + '<div class="px num"><b>' + pr + '</b><span class="chip ' + k.cls + '">' + k.txt + '</span></div></button>';
    }).join('') + '</div>';
    l.innerHTML = h;
    l.querySelectorAll('[data-exc]').forEach((b) => b.onclick = () => { try { haptic(); } catch (e) {} try { openCoin(b.dataset.exc); } catch (e) {} });
  }
  // the other filters (Hot, New...) switch the Exchange off
  document.addEventListener('click', (e) => { const b = e.target && e.target.closest && e.target.closest('.seg [data-s]'); if (b) ON = false; }, true);
  function seg() {
    if (view() !== 'market') return;
    const g = document.querySelector('#view .seg'); if (!g) return;
    let b = g.querySelector('[data-ex]');
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.dataset.ex = '1'; b.textContent = L().seg;
      b.onclick = () => { try { haptic(); } catch (e) {} ON = true; seg(); draw(); load(); };
      const top = g.querySelector('[data-s="top"]'); if (top) top.insertAdjacentElement('afterend', b); else g.appendChild(b);
    }
    if (ON) {
      g.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      if (!b.dataset.sc) { b.dataset.sc = '1'; try { b.scrollIntoView({ block: 'nearest', inline: 'center' }); } catch (e) {} }
      const l = document.getElementById('list');
      if (l && !l.querySelector('[data-exl]')) { draw(); if (Date.now() - at > 60000) load(); }
    } else b.setAttribute('aria-pressed', 'false');
  }
  setInterval(seg, 700); seg();

  // deep link: start_param containing "exch"
  (() => {
    let sp = ''; try { sp = String((tw && tw.initDataUnsafe && tw.initDataUnsafe.start_param) || ''); } catch (e) {}
    if (!/exch/i.test(sp)) return;
    let n = 0; const w = setInterval(() => {
      n++; let ok = false; try { ok = !!document.querySelector('#view .seg') && typeof go === 'function' && VIEW === 'market'; } catch (e) {}
      if (ok || n > 60) { clearInterval(w); if (ok) { ON = true; seg(); draw(); load(); } }
    }, 250);
  })();
})();
