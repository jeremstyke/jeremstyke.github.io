// 26 oct 2026 (Jeremy): the "Bourse" of Meme Coin Tycoon, owner-only test for now (edge function mct-bourse answers only the testers
// of ds_config 'mct_bs_cfg'). 18h20: it lives INSIDE the Market, as a "📈 Bourse" filter next to Hot / New / Top..., and uses the
// game's own cash. Real prices refreshed every 5 minutes (stocks, gold, oil, crypto), 0.25% fee per order.
// Link with Pass The Baton: every evening at 20:00 (Paris), shares held for at least 20 h pay a dividend in $BATON on Baton.
(() => {
  const TESTERS = [7057960224];
  const tw = window.Telegram && Telegram.WebApp;
  const UID = Number((tw && tw.initDataUnsafe && tw.initDataUnsafe.user && tw.initDataUnsafe.user.id) || 0);
  if (!TESTERS.includes(UID)) return;
  const FN = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-bourse';
  const BATON = 'https://t.me/PassTheBatonBot/play?startapp=src_mctbs';
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return l === 'fr' ? 'fr' : 'en'; };
  const TX = {
    fr: {
      seg: '📈 Bourse', note: 'Les vrais cours, mis à jour toutes les 5 min · frais 0,25 % par ordre',
      divH: '🏃 Tes actions rapportent des $BATON', divS: (p, c) => 'Chaque soir à 20h : 1 $BATON par ' + p + ' $ d’actions gardées au moins 20 h (max ' + c + ' par jour), versés sur Pass The Baton.',
      divT: (n) => 'Ce soir : +' + n + ' $BATON', divT0: 'Achète une action pour toucher ton premier dividende', divW: (n) => 'Demain : +' + n + ' $BATON', divL: (n) => 'Déjà reçus : ' + n + ' $BATON', divB: 'Ouvrir Baton',
      mine: 'Mes actions', all: 'Tous les actifs', kind: { stock: 'Action', crypto: 'Crypto', mat: 'Matière première' }, closed: 'fermé',
      buy: 'Acheter', sell: 'Vendre', sellAll: 'Tout vendre', max: 'Max', amount: 'Montant en $', cash: 'Ton cash', have: 'Tu possèdes', pl: 'Plus-value',
      bought: (q, n) => '✅ Acheté : ' + q + ' ' + n, sold: (a) => '✅ Vendu : +' + a,
      err: { cash: 'Pas assez de cash', stale: 'Cours trop ancien, réessaie dans un instant', none: 'Tu n’en as pas', small: 'Montant trop petit', soon: 'Bientôt disponible', x: 'Problème de connexion, réessaie' },
    },
    en: {
      seg: '📈 Stocks', note: 'Real prices, updated every 5 min · 0.25% fee per order',
      divH: '🏃 Your shares earn $BATON', divS: (p, c) => 'Every evening at 20:00 (Paris): 1 $BATON per $' + p + ' of shares held for at least 20 h (max ' + c + ' a day), paid on Pass The Baton.',
      divT: (n) => 'Tonight: +' + n + ' $BATON', divT0: 'Buy a share to get your first dividend', divW: (n) => 'Tomorrow: +' + n + ' $BATON', divL: (n) => 'Received so far: ' + n + ' $BATON', divB: 'Open Baton',
      mine: 'My shares', all: 'All assets', kind: { stock: 'Stock', crypto: 'Crypto', mat: 'Commodity' }, closed: 'closed',
      buy: 'Buy', sell: 'Sell', sellAll: 'Sell all', max: 'Max', amount: 'Amount in $', cash: 'Your cash', have: 'You own', pl: 'Gain',
      bought: (q, n) => '✅ Bought: ' + q + ' ' + n, sold: (a) => '✅ Sold: +' + a,
      err: { cash: 'Not enough cash', stale: 'Price too old, try again in a moment', none: 'You do not own any', small: 'Amount too small', soon: 'Coming soon', x: 'Connection problem, try again' },
    },
  };
  const L = () => TX[lg()];
  const COL = { AAPL: '#c9d1d9', TSLA: '#ff5d5d', BTC: '#f7931a', GOLD: '#ffd43b', NVDA: '#76d13d', ETH: '#8c9eff', OIL: '#b8875a', AMZN: '#ff9f43', MSFT: '#2ee6ff', TON: '#2f9bff', SOL: '#b18cff', SPY: '#4ff0b7' };
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const nf = (n, d) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const usd = (n) => { n = Number(n || 0); const s = n < 0 ? '-' : ''; n = Math.abs(n); return s + '$' + nf(n, n >= 1000 ? 0 : 2); };
  const px = (n) => { n = Number(n || 0); return '$' + nf(n, n >= 1000 ? 0 : n >= 1 ? 2 : 4); };
  const qf = (v) => Number(v || 0).toLocaleString('en-US', { maximumSignificantDigits: 5 });
  const pc = (v) => { const n = Number(v || 0); return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'; };
  const kpi = (n) => Number(n || 0).toLocaleString(lg() === 'fr' ? 'fr-FR' : 'en-US');
  async function call(body) {
    try { const r = await fetch(FN, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: tw && tw.initData, ...body }) }); return await r.json(); }
    catch (e) { return { ok: false, error: 'x' }; }
  }
  const cashUp = (c) => { try { setCash(c); } catch (e) {} };
  let S = null, ON = false, SEL = null, busy = false, loading = false, lastLoad = 0;
  const asset = (s) => (S && S.assets || []).find((a) => a.sym === s);
  const pos = (s) => (S && S.pos || []).find((p) => p.sym === s);
  const view = () => { try { return VIEW; } catch (e) { return ''; } };

  const st = document.createElement('style');
  st.textContent = ''
    + '.bsdiv{border:1px solid #4ff0b7;background:linear-gradient(135deg,rgba(79,240,183,.14),rgba(79,240,183,.03));border-radius:16px;padding:12px 14px;margin:0 0 12px;display:flex;flex-direction:column;gap:6px}'
    + '.bsdiv b{font-size:15px}.bsdiv small{color:var(--mute);font-size:12px;line-height:1.35}.bsdiv .bl{display:flex;align-items:center;gap:10px;flex-wrap:wrap}'
    + '.bsdiv .bn{font-weight:800;color:#4ff0b7;flex:1;min-width:140px}.bsdiv .bb{border:0;border-radius:10px;padding:7px 12px;font-weight:800;background:#4ff0b7;color:#0d2a22;cursor:pointer;white-space:nowrap}'
    + '.bsh{margin:14px 2px 4px;font-size:12px;letter-spacing:.8px;text-transform:uppercase;color:var(--mute);font-weight:800}'
    + '.bsk{font-size:10px;font-weight:800;border-radius:6px;padding:1px 5px;margin-left:4px;background:rgba(255,255,255,.12);vertical-align:2px}'
    + '#bst{position:fixed;inset:0;z-index:9995;background:rgba(5,3,15,.78);display:flex;align-items:flex-end;justify-content:center}'
    + '#bst .tb2{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:var(--night,#1a0638);border:1px solid var(--line,rgba(255,255,255,.14));border-radius:22px 22px 0 0;padding:16px 16px calc(20px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:10px;box-sizing:border-box}'
    + '#bst .th{display:flex;align-items:center;gap:10px}#bst .th b{font-size:19px;display:block}#bst .th small{color:var(--mute)}#bst .big{font-size:26px;font-weight:800}'
    + '#bst input{box-sizing:border-box;width:100%;font:inherit;font-size:20px;font-weight:800;padding:10px 12px;border-radius:12px;border:1px solid var(--line,rgba(255,255,255,.2));background:rgba(255,255,255,.06);color:inherit}'
    + '#bst .chips{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}#bst .chips button{border:1px solid var(--line,rgba(255,255,255,.18));background:rgba(255,255,255,.05);color:inherit;border-radius:10px;padding:8px 0;font-weight:800;cursor:pointer}'
    + '#bst .act{display:grid;grid-template-columns:1fr 1fr;gap:8px}#bst .act button{border:0;border-radius:14px;padding:13px;font-weight:800;font-size:16px;cursor:pointer}#bst .buy{background:#4ff0b7;color:#0d2a22}#bst .sel{background:#ff5d8f;color:#2a0710}'
    + '#bst .act button:disabled{opacity:.4}#bst .sm{font-size:12px;color:var(--mute);text-align:center}#bst .x{background:none;border:0;color:inherit;opacity:.8;font-weight:800;padding:6px;cursor:pointer}';
  document.head.appendChild(st);

  function spark(a, up) {
    const p = (a || []).map(Number).filter((x) => x > 0), w = 320, h = 80;
    if (p.length < 2) return '';
    const mn = Math.min(...p), mx = Math.max(...p), r = mx - mn || 1;
    const pts = p.map((v, i) => (i * (w - 2) / (p.length - 1) + 1).toFixed(1) + ',' + (h - 3 - ((v - mn) / r) * (h - 6)).toFixed(1)).join(' ');
    return '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true"><polyline fill="none" stroke="' + (up ? '#4ff0b7' : '#ff5d8f') + '" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" points="' + pts + '"/></svg>';
  }
  const med = (a) => '<span class="med" style="--c:' + (COL[a.sym] || '#ffd43b') + '">' + ec(a.em) + '</span>';

  // ---------- the "📈 Bourse" filter in the Market ----------
  document.addEventListener('click', (e) => { const b = e.target && e.target.closest && e.target.closest('.seg [data-s]'); if (b) ON = false; }, true);
  function seg() {
    if (view() !== 'market') return;
    const g = document.querySelector('#view .seg'); if (!g) return;
    let b = g.querySelector('[data-bs]');
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.dataset.bs = '1'; b.textContent = L().seg;
      b.onclick = () => { hp(); ON = true; paint(true); };
      g.appendChild(b);
    }
    if (ON) {
      g.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const l = document.getElementById('list');
      if (l && !l.querySelector('[data-bsl]')) paint(false);
    } else b.setAttribute('aria-pressed', 'false');
  }
  setInterval(seg, 700); seg();

  async function paint(fresh) {
    const l = document.getElementById('list'); if (!l) return;
    if (S) draw(); else l.innerHTML = '<div data-bsl="1"><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>';
    if ((fresh || Date.now() - lastLoad > 60000) && !loading) {
      loading = true;
      const r = await call({ action: 'state' }); loading = false; lastLoad = Date.now();
      if (r && r.ok) { S = r; cashUp(r.cash); if (ON && view() === 'market') draw(); } else tst(L().err[(r && r.error) || 'x'] || L().err.x);
    }
  }
  function row(a, right) {
    return '<button class="row" data-bsa="' + ec(a.sym) + '">' + med(a) + '<div class="who"><b>' + ec(a.name) + (a.live ? '' : '<span class="bsk">' + L().closed + '</span>') + '</b><small>' + right.sub + '</small></div>'
      + '<div class="px num"><b>' + right.top + '</b><span class="chip ' + (right.up ? 'up' : 'down') + '">' + right.chip + '</span></div></button>';
  }
  function draw() {
    const l = document.getElementById('list'); if (!l || !S) return;
    const T = L(), d = S.div || {};
    let h = '<div data-bsl="1"><p class="hint">' + T.note + '</p>';
    if (!S.banned) {
      const line = Number(d.ready) > 0 ? T.divT(kpi(d.ready)) : Number(d.next) > 0 ? T.divW(kpi(d.next)) : T.divT0;
      h += '<div class="bsdiv"><b>' + T.divH + '</b><small>' + T.divS(d.per || 10, kpi(d.cap || 1000)) + '</small>'
        + '<div class="bl"><span class="bn">' + line + (Number(d.total) > 0 ? '<br><small>' + T.divL(kpi(d.total)) + '</small>' : '') + '</span><button class="bb" type="button" id="bsbt">' + T.divB + '</button></div></div>';
    }
    if (S.pos.length) {
      h += '<div class="bsh">' + T.mine + '</div>' + S.pos.map((p) => {
        const a = asset(p.sym) || { sym: p.sym, name: p.sym, em: '📈' }, g = Number(p.value) - Number(p.cost);
        return row(a, { sub: qf(p.qty) + ' ' + ec(p.sym), top: usd(p.value), up: g >= 0, chip: (g >= 0 ? '+' : '') + usd(g) });
      }).join('');
    }
    h += '<div class="bsh">' + T.all + '</div>' + S.assets.map((a) => row(a, { sub: ec(a.sym) + ' · ' + T.kind[a.kind], top: px(a.price), up: Number(a.chg) >= 0, chip: pc(a.chg) })).join('') + '</div>';
    l.innerHTML = h;
    l.querySelectorAll('[data-bsa]').forEach((b) => b.onclick = () => { hp(); trade(b.dataset.bsa); });
    const bt = document.getElementById('bsbt');
    if (bt) bt.onclick = () => { hp(); try { tw.openTelegramLink(BATON); } catch (e) { location.href = BATON; } };
  }

  // ---------- buy / sell sheet ----------
  function trade(sym) {
    SEL = sym; let s = document.getElementById('bst'); if (!s) { s = document.createElement('div'); s.id = 'bst'; document.body.appendChild(s); }
    const T = L(), a = asset(sym), p = pos(sym), u = Number(a.chg) >= 0, g = p ? Number(p.value) - Number(p.cost) : 0;
    s.innerHTML = '<div class="tb2"><div class="th">' + med(a) + '<span><b>' + ec(a.name) + '</b><small>' + ec(a.sym) + ' · ' + T.kind[a.kind] + (a.live ? '' : ' · ' + T.closed) + '</small></span></div>'
      + '<div><span class="big num">' + px(a.price) + '</span> <span class="chip ' + (u ? 'up' : 'down') + '">' + pc(a.chg) + '</span></div>'
      + spark(a.spark, u)
      + (p ? '<div class="sm" style="text-align:left">' + T.have + ' : <b>' + qf(p.qty) + ' ' + ec(sym) + '</b> = ' + usd(p.value) + ' · ' + T.pl + ' : <b style="color:' + (g >= 0 ? '#4ff0b7' : '#ff5d8f') + '">' + (g >= 0 ? '+' : '') + usd(g) + '</b></div>' : '')
      + '<label class="sm" for="bsamt" style="text-align:left">' + T.amount + ' · ' + T.cash + ' ' + usd(S.cash) + '</label><input id="bsamt" type="number" inputmode="decimal" min="1" step="0.01" placeholder="0">'
      + '<div class="chips"><button type="button" data-p="0.1">10%</button><button type="button" data-p="0.25">25%</button><button type="button" data-p="0.5">50%</button><button type="button" data-p="1">' + T.max + '</button></div>'
      + '<div class="act"><button class="buy" type="button" id="bsb">' + T.buy + '</button><button class="sel" type="button" id="bss"' + (p ? '' : ' disabled') + '>' + T.sell + '</button></div>'
      + (p ? '<button class="x" type="button" id="bsa">' + T.sellAll + ' (' + usd(p.value) + ')</button>' : '')
      + '<p class="sm">' + T.note + '</p></div>';
    const inp = s.querySelector('#bsamt');
    s.onclick = (e) => { if (e.target === s) s.remove(); };
    s.querySelectorAll('[data-p]').forEach((b) => b.onclick = () => { hp(); inp.value = (Math.floor(Number(S.cash) * Number(b.dataset.p) * 100) / 100).toFixed(2); });
    s.querySelector('#bsb').onclick = () => order('buy', Number(inp.value), inp.value !== '' && Number(inp.value) >= Number(S.cash) - 0.005);
    s.querySelector('#bss').onclick = () => order('sell', Number(inp.value), false);
    const sa = s.querySelector('#bsa'); if (sa) sa.onclick = () => order('sell', 0, true);
  }
  async function order(side, amt, all) {
    if (busy) return; const T = L();
    if (!all && !(amt >= (side === 'buy' ? 1 : 0.01))) { tst(T.err.small); return; }
    busy = true;
    try {
      const r = await call({ action: side, sym: SEL, usd: amt, all: !!all });
      if (r && r.ok) {
        hp('ok'); const a = asset(SEL) || {};
        tst(side === 'buy' ? T.bought(qf(r.done.qty), a.name || SEL) : T.sold(usd(r.done.net)));
        const s = document.getElementById('bst'); if (s) s.remove();
        S = r; lastLoad = Date.now(); cashUp(r.cash); if (ON && view() === 'market') draw();
      } else { hp('err'); tst(T.err[(r && r.error)] || T.err.x); }
    } finally { busy = false; }
  }
})();
