// 26 oct 2026 (Jeremy): the "Bourse" mode of Meme Coin Tycoon, owner-only test for now (the server, edge function mct-bourse,
// only answers the testers of ds_config 'mct_bs_cfg'). A separate portfolio that starts at $100, real prices refreshed every 5 minutes
// (stocks, gold, oil, crypto), titles unlocked by the best value reached (they unlock new assets), a daily salary (x2 with a video),
// and a weekly ranking on % performance. Entry: a card at the top of the Market, opening a full-screen page.
(() => {
  const TESTERS = [7057960224];
  const tw = window.Telegram && Telegram.WebApp;
  const UID = Number((tw && tw.initDataUnsafe && tw.initDataUnsafe.user && tw.initDataUnsafe.user.id) || 0);
  if (!TESTERS.includes(UID)) return;
  const FN = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-bourse';
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return l === 'fr' ? 'fr' : 'en'; };
  const TX = {
    fr: {
      card: 'Bourse', cardS: 'Les vrais cours · bêta', open: 'Ouvrir', title: '📈 Bourse', value: 'Valeur du portefeuille', cash: 'Liquidités', week: 'Cette semaine',
      lv: ['🐷 Tirelire', '📘 Épargnant', '📈 Boursicoteur', '💼 Trader', '🏦 Banquier'], more: (a, n) => 'Encore ' + a + ' pour ' + n, max: 'Titre maximum atteint',
      sal: 'Salaire du jour', salGet: 'Récupérer', salX2: '▶ x2 avec une vidéo', tabs: ['Marché', 'Mes actifs', 'Classement'],
      locked: (n) => '🔒 ' + n, closed: 'fermé', buy: 'Acheter', sell: 'Vendre', sellAll: 'Tout vendre', all: 'Tout', fee: 'Frais 0,25 % par ordre · cours mis à jour toutes les 5 min',
      have: 'Tu possèdes', pl: 'Plus-value', none: 'Aucun actif. Achète ta première action dans l’onglet Marché.', hist: 'Derniers ordres',
      rank: 'Classement de la semaine (en %)', rankS: 'Gains en $BATON pour le top 10 à l’ouverture', nobody: 'Personne pour l’instant.',
      bought: (q, n) => '✅ Acheté : ' + q + ' ' + n, sold: (a) => '✅ Vendu pour ' + a, err: { cash: 'Pas assez de liquidités', locked: 'Débloque ce titre d’abord', stale: 'Cours trop ancien, réessaie dans un instant', none: 'Tu n’en as pas', small: 'Montant trop petit', soon: 'Bientôt disponible', x: 'Problème de connexion, réessaie' },
      lvup: 'Nouveau titre !', lvupS: 'De nouveaux actifs sont débloqués.', amount: 'Montant en $', upd: 'Mis à jour', ago: (m) => m < 1 ? 'à l’instant' : 'il y a ' + m + ' min', you: 'toi', noVid: 'Pas de vidéo pour le moment',
    },
    en: {
      card: 'Stock market', cardS: 'Real prices · beta', open: 'Open', title: '📈 Stock market', value: 'Portfolio value', cash: 'Cash', week: 'This week',
      lv: ['🐷 Piggy bank', '📘 Saver', '📈 Small investor', '💼 Trader', '🏦 Banker'], more: (a, n) => a + ' more to become ' + n, max: 'Top title reached',
      sal: 'Daily salary', salGet: 'Claim', salX2: '▶ x2 with a video', tabs: ['Market', 'My assets', 'Ranking'],
      locked: (n) => '🔒 ' + n, closed: 'closed', buy: 'Buy', sell: 'Sell', sellAll: 'Sell all', all: 'All', fee: '0.25% fee per order · prices updated every 5 min',
      have: 'You own', pl: 'Gain', none: 'No assets yet. Buy your first stock in the Market tab.', hist: 'Last orders',
      rank: 'Ranking of the week (in %)', rankS: '$BATON prizes for the top 10 at launch', nobody: 'Nobody yet.',
      bought: (q, n) => '✅ Bought: ' + q + ' ' + n, sold: (a) => '✅ Sold for ' + a, err: { cash: 'Not enough cash', locked: 'Unlock this title first', stale: 'Price too old, try again in a moment', none: 'You do not own any', small: 'Amount too small', soon: 'Coming soon', x: 'Connection problem, try again' },
      lvup: 'New title!', lvupS: 'New assets are unlocked.', amount: 'Amount in $', upd: 'Updated', ago: (m) => m < 1 ? 'just now' : m + ' min ago', you: 'you', noVid: 'No video right now',
    },
  };
  const L = () => TX[lg()];
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const loc = () => (lg() === 'fr' ? 'fr-FR' : 'en-US');
  const usd = (v, d) => { const n = Number(v || 0), dd = d != null ? d : Math.abs(n) >= 1000 ? 0 : 2; const s = n.toLocaleString(loc(), { minimumFractionDigits: dd, maximumFractionDigits: dd }); return lg() === 'fr' ? s + ' $' : '$' + s; };
  const px = (v) => { const n = Number(v || 0); return usd(n, n >= 1000 ? 0 : n >= 1 ? 2 : 4); };
  const qf = (v) => Number(v || 0).toLocaleString(loc(), { maximumSignificantDigits: 5 });
  const pc = (v) => { const n = Number(v || 0); return (n > 0 ? '+' : '') + n.toLocaleString(loc(), { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %'; };
  async function call(body) {
    try { const r = await fetch(FN, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: tw && tw.initData, ...body }) }); return await r.json(); }
    catch (e) { return { ok: false, error: 'x' }; }
  }
  let S = null, TAB = 0, SEL = null, lastLvl = null, busy = false;

  const st = document.createElement('style');
  st.textContent = ''
    + '#bsc{display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:1px solid #4ff0b7;background:linear-gradient(135deg,rgba(79,240,183,.16),rgba(79,240,183,.03));border-radius:16px;padding:10px 14px;margin:0 0 12px;color:inherit;cursor:pointer}'
    + '#bsc b{display:block}#bsc small{opacity:.85}#bsc .go{margin-left:auto;background:#4ff0b7;color:#0d2a22;font-weight:800;border-radius:10px;padding:6px 12px;white-space:nowrap}'
    + '#bsx{position:fixed;inset:0;z-index:9990;background:var(--night,#1a0638);overflow-y:auto;-webkit-overflow-scrolling:touch;padding:calc(10px + env(safe-area-inset-top)) max(14px,env(safe-area-inset-right)) calc(24px + env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left))}'
    + '#bsx .bw{max-width:520px;margin:0 auto;display:flex;flex-direction:column;gap:12px}'
    + '#bsx .bh{display:flex;align-items:center;justify-content:space-between}#bsx .bh b{font-size:20px}#bsx .bx{background:none;border:0;color:inherit;font-size:24px;opacity:.75;cursor:pointer;padding:4px 8px}'
    + '#bsx .hero{border-radius:20px;padding:16px;background:linear-gradient(160deg,rgba(79,240,183,.14),rgba(255,255,255,.03));border:1px solid rgba(79,240,183,.35)}'
    + '#bsx .hero small{opacity:.75;font-size:12px;text-transform:uppercase;letter-spacing:.8px}#bsx .tot{font-size:34px;font-weight:800;line-height:1.1;margin:2px 0 6px;font-variant-numeric:tabular-nums}'
    + '#bsx .hl{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:13px;opacity:.92}#bsx .up{color:#4ff0b7}#bsx .dn{color:#ff6b81}'
    + '#bsx .lvl{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:12px;font-size:13px}#bsx .chip{background:var(--gold,#ffd43b);color:var(--night,#1a0638);font-weight:800;border-radius:999px;padding:3px 10px;white-space:nowrap}'
    + '#bsx .bar{height:7px;border-radius:7px;background:rgba(255,255,255,.1);overflow:hidden;margin-top:6px}#bsx .bar i{display:block;height:100%;background:linear-gradient(90deg,#4ff0b7,var(--gold,#ffd43b))}'
    + '#bsx .sal{display:flex;align-items:center;gap:10px;flex-wrap:wrap;border-radius:16px;padding:10px 12px;border:1px solid var(--gold,#ffd43b);background:rgba(255,212,59,.08)}#bsx .sal b{flex:1;min-width:120px}'
    + '#bsx .b1,#bsx .b2{border:0;border-radius:12px;padding:9px 12px;font-weight:800;cursor:pointer;font-size:14px}#bsx .b1{background:var(--gold,#ffd43b);color:var(--night,#1a0638)}#bsx .b2{background:rgba(255,255,255,.08);color:inherit;border:1px solid rgba(255,255,255,.18)}'
    + '#bsx .tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;background:rgba(255,255,255,.05);border-radius:12px;padding:4px}#bsx .tabs button{border:0;background:none;color:inherit;opacity:.7;font-weight:800;padding:8px 4px;border-radius:9px;cursor:pointer;font-size:13px}#bsx .tabs button.on{background:rgba(255,255,255,.12);opacity:1}'
    + '#bsx .row{display:grid;grid-template-columns:34px minmax(0,1fr) 64px auto;align-items:center;gap:10px;padding:10px 4px;border-bottom:1px solid rgba(255,255,255,.07);cursor:pointer}#bsx .row:last-child{border-bottom:0}'
    + '#bsx .row .em{font-size:24px;text-align:center}#bsx .row .nm{min-width:0}#bsx .row .nm b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#bsx .row .nm small{opacity:.65;font-size:12px}'
    + '#bsx .row .pr{text-align:right;font-variant-numeric:tabular-nums}#bsx .row .pr b{display:block}#bsx .row .pr small{font-size:12px;font-weight:700}#bsx .row.lk{opacity:.45}'
    + '#bsx .tag{font-size:10px;font-weight:800;border-radius:6px;padding:1px 5px;margin-left:4px;background:rgba(255,255,255,.12);vertical-align:1px}'
    + '#bsx .muted{opacity:.7;font-size:13px;text-align:center;margin:6px 0}#bsx .panel{border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:4px 10px;background:rgba(255,255,255,.02)}'
    + '#bsx .hr{display:flex;justify-content:space-between;gap:8px;font-size:13px;padding:7px 2px;border-bottom:1px solid rgba(255,255,255,.06)}#bsx .hr:last-child{border-bottom:0}'
    + '#bsx .rk{display:grid;grid-template-columns:28px 1fr auto;gap:8px;padding:9px 4px;border-bottom:1px solid rgba(255,255,255,.06);align-items:center}#bsx .rk.me{color:var(--gold,#ffd43b)}'
    + '#bst{position:fixed;inset:0;z-index:9995;background:rgba(5,3,15,.78);display:flex;align-items:flex-end;justify-content:center}'
    + '#bst .tb2{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:var(--night,#1a0638);border:1px solid rgba(255,255,255,.14);border-radius:22px 22px 0 0;padding:16px 16px calc(20px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:10px}'
    + '#bst .th{display:flex;align-items:center;gap:10px}#bst .th .em{font-size:34px}#bst .th b{font-size:19px;display:block}#bst .big{font-size:26px;font-weight:800;font-variant-numeric:tabular-nums}'
    + '#bst input{box-sizing:border-box;width:100%;font:inherit;font-size:20px;font-weight:800;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:inherit}'
    + '#bst .chips{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}#bst .chips button{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.05);color:inherit;border-radius:10px;padding:8px 0;font-weight:800;cursor:pointer}'
    + '#bst .act{display:grid;grid-template-columns:1fr 1fr;gap:8px}#bst .act button{border:0;border-radius:14px;padding:13px;font-weight:800;font-size:16px;cursor:pointer}#bst .buy{background:#4ff0b7;color:#0d2a22}#bst .sel{background:#ff6b81;color:#2a0710}'
    + '#bst .act button:disabled{opacity:.4}#bst .sm{font-size:12px;opacity:.7;text-align:center}#bst .x{background:none;border:0;color:inherit;opacity:.7;font-weight:800;padding:6px;cursor:pointer}'
    + '#bsl{position:fixed;inset:0;z-index:9996;display:grid;place-items:center;background:rgba(5,3,15,.8);padding:20px}#bsl div{max-width:320px;text-align:center;background:var(--night,#1a0638);border:1px solid var(--gold,#ffd43b);border-radius:22px;padding:22px}#bsl b{display:block;font-size:24px;margin:6px 0}';
  document.head.appendChild(st);

  function spark(a, up, w, h) {
    const p = (a || []).map(Number).filter((x) => x > 0); w = w || 64; h = h || 26;
    if (p.length < 2) return '<svg width="' + w + '" height="' + h + '"></svg>';
    const mn = Math.min(...p), mx = Math.max(...p), r = mx - mn || 1;
    const pts = p.map((v, i) => (i * (w - 2) / (p.length - 1) + 1).toFixed(1) + ',' + (h - 2 - ((v - mn) / r) * (h - 4)).toFixed(1)).join(' ');
    const c = up ? '#4ff0b7' : '#ff6b81';
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true"><polyline fill="none" stroke="' + c + '" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" points="' + pts + '"/></svg>';
  }
  const asset = (s) => (S && S.assets || []).find((a) => a.sym === s);
  const pos = (s) => (S && S.pos || []).find((p) => p.sym === s);

  // ---------- entry card on the Market ----------
  function card() {
    const v = document.getElementById('view'); let c = document.getElementById('bsc'); let mk = false;
    try { mk = VIEW === 'market'; } catch (e) {}
    if (!v || !mk) { if (c) c.remove(); return; }
    if (c && c.isConnected) return;
    const T = L();
    c = document.createElement('button'); c.id = 'bsc'; c.type = 'button';
    c.innerHTML = '<span style="font-size:28px;line-height:1">📈</span><span><b>' + T.card + '</b><small>' + T.cardS + '</small></span><span class="go">' + T.open + '</span>';
    c.onclick = () => { hp(); open(); };
    const after = document.getElementById('bonc') || v.querySelector('h1');
    if (after) after.insertAdjacentElement('afterend', c); else v.prepend(c);
  }
  setInterval(card, 1000); card();

  // ---------- page ----------
  async function load() { const r = await call({ action: 'state' }); if (r && r.ok) { setS(r); return true; } tst(L().err[(r && r.error) || 'x'] || L().err.x); return false; }
  function setS(r) {
    if (lastLvl != null && r.lvl > lastLvl) lvlUp(r.lvl);
    lastLvl = r.lvl; S = r; draw();
  }
  let timer = null;
  async function open() {
    let x = document.getElementById('bsx');
    if (!x) { x = document.createElement('div'); x.id = 'bsx'; document.body.appendChild(x); }
    x.innerHTML = '<div class="bw"><div class="bh"><b>' + L().title + '</b><button class="bx" type="button" aria-label="Close">✕</button></div><p class="muted">…</p></div>';
    x.querySelector('.bx').onclick = close;
    try { tw.BackButton.show(); tw.BackButton.onClick(close); } catch (e) {}
    await load();
    clearInterval(timer); timer = setInterval(() => { if (document.getElementById('bsx') && !document.getElementById('bst')) load(); }, 60000);
  }
  function close() {
    const x = document.getElementById('bsx'); if (x) x.remove(); clearInterval(timer);
    try { tw.BackButton.offClick(close); tw.BackButton.hide(); } catch (e) {}
  }
  function draw() {
    const x = document.getElementById('bsx'); if (!x || !S) return;
    const T = L(), lv = S.lvl, nx = S.next != null ? Number(S.next) : null, base = Number(S.lv[lv] || 0);
    const prog = nx ? Math.max(0, Math.min(100, ((S.best - base) / (nx - base)) * 100)) : 100;
    const up = Number(S.week_pct) >= 0;
    const newest = (S.assets || []).reduce((m, a) => (a.at && a.at > m ? a.at : m), '');
    const mins = newest ? Math.floor((Date.now() - new Date(newest).getTime()) / 60000) : 0;
    let h = '<div class="bw"><div class="bh"><b>' + T.title + '</b><button class="bx" type="button" aria-label="Close">✕</button></div>'
      + '<div class="hero"><small>' + T.value + '</small><div class="tot">' + usd(S.value, 2) + '</div>'
      + '<div class="hl"><span>' + T.cash + ' : <b>' + usd(S.cash, 2) + '</b></span><span>' + T.week + ' : <b class="' + (up ? 'up' : 'dn') + '">' + pc(S.week_pct) + '</b></span></div>'
      + '<div class="lvl"><span class="chip">' + T.lv[lv] + '</span><span>' + (nx ? T.more(usd(Math.max(0, nx - S.best), 0), T.lv[lv + 1]) : T.max) + '</span></div>'
      + '<div class="bar"><i style="width:' + prog.toFixed(1) + '%"></i></div></div>';
    if (S.salary_ready) h += '<div class="sal"><b>💵 ' + T.sal + ' : +' + usd(S.salary, 0) + '</b><button class="b2" type="button" data-s="1">' + T.salGet + '</button><button class="b1" type="button" data-s="2">' + T.salX2 + '</button></div>';
    h += '<div class="tabs">' + T.tabs.map((t, i) => '<button type="button" data-t="' + i + '" class="' + (TAB === i ? 'on' : '') + '">' + t + '</button>').join('') + '</div>';
    if (TAB === 0) {
      h += '<div class="panel">' + S.assets.map((a) => {
        const u = Number(a.chg) >= 0;
        return '<div class="row' + (a.locked ? ' lk' : '') + '" data-a="' + ec(a.sym) + '"><span class="em">' + ec(a.em) + '</span>'
          + '<span class="nm"><b>' + ec(a.name) + (a.live ? '' : '<span class="tag">' + T.closed + '</span>') + '</b><small>' + (a.locked ? T.locked(T.lv[a.lvl]) : ec(a.sym)) + '</small></span>'
          + spark(a.spark, u) + '<span class="pr"><b>' + px(a.price) + '</b><small class="' + (u ? 'up' : 'dn') + '">' + pc(a.chg) + '</small></span></div>';
      }).join('') + '</div><p class="muted">' + T.upd + ' ' + T.ago(mins) + '</p>';
    } else if (TAB === 1) {
      if (!S.pos.length) h += '<p class="muted">' + T.none + '</p>';
      else h += '<div class="panel">' + S.pos.map((p) => {
        const a = asset(p.sym) || {}, g = Number(p.value) - Number(p.cost), u = g >= 0;
        return '<div class="row" data-a="' + ec(p.sym) + '"><span class="em">' + ec(a.em) + '</span><span class="nm"><b>' + ec(a.name) + '</b><small>' + qf(p.qty) + ' ' + ec(p.sym) + '</small></span>'
          + spark(a.spark, Number(a.chg) >= 0) + '<span class="pr"><b>' + usd(p.value, 2) + '</b><small class="' + (u ? 'up' : 'dn') + '">' + (u ? '+' : '') + usd(g, 2) + '</small></span></div>';
      }).join('') + '</div>';
      if (S.hist.length) h += '<p class="muted">' + T.hist + '</p><div class="panel">' + S.hist.map((t) => {
        const a = asset(t.sym) || {};
        return '<div class="hr"><span>' + (t.side === 'buy' ? '🟢 ' + T.buy : '🔴 ' + T.sell) + ' · ' + ec(a.em || '') + ' ' + ec(t.sym) + '</span><span>' + usd(t.amount, 2) + '</span></div>';
      }).join('') + '</div>';
    } else {
      h += '<p class="muted"><b>' + T.rank + '</b><br>' + T.rankS + '</p>';
      if (!S.rank.length) h += '<p class="muted">' + T.nobody + '</p>';
      else h += '<div class="panel">' + S.rank.map((r, i) => '<div class="rk' + (r.me ? ' me' : '') + '"><b>' + (['🥇', '🥈', '🥉'][i] || i + 1) + '</b><span>' + ec(r.name) + (r.me ? ' (' + T.you + ')' : '') + '</span><b class="' + (Number(r.pct) >= 0 ? 'up' : 'dn') + '">' + pc(r.pct) + '</b></div>').join('') + '</div>';
    }
    h += '</div>';
    const y = x.scrollTop; x.innerHTML = h; x.scrollTop = y;
    x.querySelector('.bx').onclick = close;
    x.querySelectorAll('[data-t]').forEach((b) => b.onclick = () => { hp(); TAB = Number(b.dataset.t); draw(); });
    x.querySelectorAll('[data-a]').forEach((r) => r.onclick = () => { const a = asset(r.dataset.a); if (!a) return; if (a.locked) { tst(T.err.locked); return; } hp(); trade(a.sym); });
    x.querySelectorAll('[data-s]').forEach((b) => b.onclick = () => salary(b.dataset.s === '2', b));
  }

  async function salary(dbl, btn) {
    if (busy) return; busy = true;
    try {
      if (dbl) {
        let ok = false;
        try { ok = window.mctRw ? await window.mctRw.watch(1, btn) : false; } catch (e) { ok = false; }
        if (!ok) { tst(L().noVid); return; }
      }
      const r = await call({ action: 'salary', double: dbl });
      if (r && r.ok) { hp('ok'); tst('💵 +' + usd(r.got, 0)); setS(r); } else tst(L().err[(r && r.error)] || L().err.x);
    } finally { busy = false; }
  }

  // ---------- buy / sell sheet ----------
  function trade(sym) {
    SEL = sym; let s = document.getElementById('bst'); if (!s) { s = document.createElement('div'); s.id = 'bst'; document.body.appendChild(s); }
    const T = L(), a = asset(sym), p = pos(sym), u = Number(a.chg) >= 0;
    const g = p ? Number(p.value) - Number(p.cost) : 0;
    s.innerHTML = '<div class="tb2"><div class="th"><span class="em">' + ec(a.em) + '</span><span><b>' + ec(a.name) + '</b><small style="opacity:.7">' + ec(a.sym) + (a.live ? '' : ' · ' + T.closed) + '</small></span></div>'
      + '<div><span class="big">' + px(a.price) + '</span> <b class="' + (u ? 'up' : 'dn') + '" style="color:' + (u ? '#4ff0b7' : '#ff6b81') + '">' + pc(a.chg) + '</b></div>'
      + '<div style="max-width:100%;overflow:hidden">' + spark(a.spark, u, 320, 80).replace('width="320"', 'width="100%"') + '</div>'
      + (p ? '<div class="sm" style="text-align:left;opacity:.9">' + T.have + ' : <b>' + qf(p.qty) + ' ' + ec(sym) + '</b> = ' + usd(p.value, 2) + ' · ' + T.pl + ' : <b style="color:' + (g >= 0 ? '#4ff0b7' : '#ff6b81') + '">' + (g >= 0 ? '+' : '') + usd(g, 2) + '</b></div>' : '')
      + '<label class="sm" for="bsamt" style="text-align:left">' + T.amount + ' · ' + T.cash + ' ' + usd(S.cash, 2) + '</label><input id="bsamt" type="number" inputmode="decimal" min="1" step="0.01" placeholder="0">'
      + '<div class="chips"><button type="button" data-p="0.1">10 %</button><button type="button" data-p="0.25">25 %</button><button type="button" data-p="0.5">50 %</button><button type="button" data-p="1">' + T.all + '</button></div>'
      + '<div class="act"><button class="buy" type="button" id="bsb">' + T.buy + '</button><button class="sel" type="button" id="bss"' + (p ? '' : ' disabled') + '>' + T.sell + '</button></div>'
      + (p ? '<button class="x" type="button" id="bsa">' + T.sellAll + ' (' + usd(p.value, 2) + ')</button>' : '')
      + '<p class="sm">' + T.fee + '</p></div>';
    const inp = s.querySelector('#bsamt');
    s.onclick = (e) => { if (e.target === s) s.remove(); };
    s.querySelectorAll('[data-p]').forEach((b) => b.onclick = () => { hp(); inp.value = (Math.floor(Number(S.cash) * Number(b.dataset.p) * 100) / 100).toFixed(2); });
    s.querySelector('#bsb').onclick = () => order('buy', Number(inp.value), false, inp.value && Number(inp.value) >= Number(S.cash) - 0.005);
    s.querySelector('#bss').onclick = () => order('sell', Number(inp.value), false);
    const sa = s.querySelector('#bsa'); if (sa) sa.onclick = () => order('sell', 0, true);
  }
  async function order(side, amt, all, allCash) {
    if (busy) return; const T = L();
    if (!all && !allCash && !(amt >= (side === 'buy' ? 1 : 0.01))) { tst(T.err.small); return; }
    busy = true;
    try {
      const r = await call({ action: side, sym: SEL, usd: amt, all: !!(all || allCash) });
      if (r && r.ok) {
        hp('ok'); const a = asset(SEL) || {};
        tst(side === 'buy' ? T.bought(qf(r.done.qty), a.name || SEL) : T.sold(usd(r.done.amount * (1 - Number(S.fee || 0)), 2)));
        const s = document.getElementById('bst'); if (s) s.remove();
        setS(r);
      } else tst(T.err[(r && r.error)] || T.err.x);
    } finally { busy = false; }
  }
  function lvlUp(l) {
    hp('ok'); const T = L(), d = document.createElement('div'); d.id = 'bsl';
    d.innerHTML = '<div><span style="font-size:54px">🎉</span><b>' + T.lvup + '</b><p style="font-size:20px;margin:6px 0">' + T.lv[l] + '</p><p style="opacity:.8">' + T.lvupS + '</p><button class="b1" type="button" style="margin-top:12px;border:0;border-radius:12px;padding:10px 18px;font-weight:800;background:var(--gold,#ffd43b);color:var(--night,#1a0638)">OK</button></div>';
    d.onclick = () => d.remove(); document.body.appendChild(d);
  }
  window.mctBourse = { open };
})();
