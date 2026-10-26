// 26 oct 2026 (Jeremy): the "Bourse" of Meme Coin Tycoon, owner-only test for now (edge function mct-bourse answers only the testers
// of ds_config 'mct_bs_cfg'). It uses the game's own cash. 18h35: no longer in the Market; it opens from a card at the top of the
// Portfolio ("📈 Invest in the stock market") as a full page, with the real logos of the brands and cryptos. Real prices refreshed every 5 minutes (stocks, gold, oil, crypto), 0.25% fee per order.
// Link with Pass The Baton: every evening at 20:00 (Paris), shares held for at least 20 h pay a dividend in $BATON on Baton.
(() => {
  // 26 oct 2026 (19h11, Jeremy): open to every player (no more testers list; the server switch is ds_config 'mct_bs_cfg'.open)
  const tw = window.Telegram && Telegram.WebApp;
  const FN = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-bourse';
  const BATON = 'https://t.me/PassTheBatonBot/play?startapp=src_mctbs';
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return l === 'fr' ? 'fr' : 'en'; };
  const TX = {
    fr: {
      note: 'Les vrais cours, mis à jour toutes les 5 min · frais 0,25 % par ordre',
      divH: '🏃 Tes actions rapportent des $BATON', divS: (p, c) => 'Chaque soir à 20h : 1 $BATON par ' + p + ' $ d’actions gardées au moins 20 h (max ' + c + ' par jour), versés sur Pass The Baton.',
      divT: (n) => 'Ce soir : +' + n + ' $BATON', divT0: 'Achète une action pour toucher ton premier dividende', divW: (n) => 'Demain : +' + n + ' $BATON', divL: (n) => 'Déjà reçus : ' + n + ' $BATON', divB: 'Ouvrir Baton',
      mine: 'Mes actions', all: 'Tous les actifs', kind: { stock: 'Action', crypto: 'Crypto', mat: 'Matière première' }, closed: 'fermé',
      buy: 'Acheter', sell: 'Vendre', sellAll: 'Tout vendre', max: 'Max', amount: 'Montant en $', cash: 'Ton cash', have: 'Tu possèdes', pl: 'Plus-value',
      bought: (q, n) => '✅ Acheté : ' + q + ' ' + n, sold: (a) => '✅ Vendu : +' + a,
      pfH: '📈 Investir en bourse', pfE: 'Apple, Tesla, Bitcoin, l’or… aux vrais cours, avec ton cash du jeu.', pfB: 'Investir', title: '📈 Bourse', tot: 'Tes actions', back: '← Portefeuille', pfV: (v, g) => 'Valeur : ' + v + ' · ' + g,
      err: { cash: 'Pas assez de cash', stale: 'Cours trop ancien, réessaie dans un instant', none: 'Tu n’en as pas', small: 'Montant trop petit', soon: 'Bientôt disponible', x: 'Problème de connexion, réessaie' },
    },
    en: {
      note: 'Real prices, updated every 5 min · 0.25% fee per order',
      divH: '🏃 Your shares earn $BATON', divS: (p, c) => 'Every evening at 20:00 (Paris): 1 $BATON per $' + p + ' of shares held for at least 20 h (max ' + c + ' a day), paid on Pass The Baton.',
      divT: (n) => 'Tonight: +' + n + ' $BATON', divT0: 'Buy a share to get your first dividend', divW: (n) => 'Tomorrow: +' + n + ' $BATON', divL: (n) => 'Received so far: ' + n + ' $BATON', divB: 'Open Baton',
      mine: 'My shares', all: 'All assets', kind: { stock: 'Stock', crypto: 'Crypto', mat: 'Commodity' }, closed: 'closed',
      buy: 'Buy', sell: 'Sell', sellAll: 'Sell all', max: 'Max', amount: 'Amount in $', cash: 'Your cash', have: 'You own', pl: 'Gain',
      bought: (q, n) => '✅ Bought: ' + q + ' ' + n, sold: (a) => '✅ Sold: +' + a,
      pfH: '📈 Invest in the stock market', pfE: 'Apple, Tesla, Bitcoin, gold… at real prices, with your game cash.', pfB: 'Invest', title: '📈 Stock market', tot: 'Your shares', back: '← Portfolio', pfV: (v, g) => 'Value: ' + v + ' · ' + g,
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
  const DIV_ON = false;  // 26 oct 2026 (18h41, Jeremy): the $BATON dividends are off for now (cron mct_bs_dividends unscheduled)
  let S = null, SEL = null, busy = false, loading = false, lastLoad = 0;
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
    + '.med.bslg{background:#fff!important;overflow:hidden;padding:5px;box-sizing:border-box}.med.bslg img{width:100%;height:100%;object-fit:contain;display:block}'
    + '#bsx{position:fixed;inset:0;z-index:9990;background:var(--night,#1a0638);overflow-y:auto;-webkit-overflow-scrolling:touch;padding:calc(10px + env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) calc(28px + env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));box-sizing:border-box}'
    + '#bsx .bw{max-width:520px;margin:0 auto}#bsx .bk{background:none;border:0;color:var(--mute);font-weight:800;padding:6px 0;cursor:pointer;font-size:14px}'
    + '#bsx .hero{display:flex;justify-content:space-between;gap:12px;align-items:flex-end;margin:6px 0 14px}#bsx .hero small{color:var(--mute);font-size:12px;display:block}#bsx .hero b{font-size:28px}'
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
  // the real logo (brand or crypto) on a white disc; the emoji if there is none (gold, oil) or if the image does not load
  const med = (a) => a.logo
    ? '<span class="med bslg"><img src="' + ec(a.logo) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="var p=this.parentNode;p.classList.remove(\'bslg\');p.style.setProperty(\'--c\',\'' + (COL[a.sym] || '#ffd43b') + '\');p.textContent=\'' + ec(a.em) + '\'"></span>'
    : '<span class="med" style="--c:' + (COL[a.sym] || '#ffd43b') + '">' + ec(a.em) + '</span>';

  // ---------- the Bourse page, opened from the Portfolio ----------
  async function load(fresh) {
    if (loading || (!fresh && S && Date.now() - lastLoad < 60000)) return;
    loading = true; const r = await call({ action: 'state' }); loading = false; lastLoad = Date.now();
    if (r && r.ok) { S = r; cashUp(r.cash); if (document.getElementById('bsx')) draw(); } else if (document.getElementById('bsx')) tst(L().err[(r && r.error) || 'x'] || L().err.x);
  }
  let timer = null;
  function open() {
    let x = document.getElementById('bsx');
    if (!x) { x = document.createElement('div'); x.id = 'bsx'; document.body.appendChild(x); }
    if (S) draw(); else x.innerHTML = '<div class="bw"><button class="bk" type="button">' + L().back + '</button><h1>' + L().title + '</h1><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>';
    const bk = x.querySelector('.bk'); if (bk) bk.onclick = close;
    try { tw.BackButton.show(); tw.BackButton.onClick(close); } catch (e) {}
    load(true);
    clearInterval(timer); timer = setInterval(() => { if (!document.getElementById('bst')) load(true); }, 60000);
  }
  function close() {
    const x = document.getElementById('bsx'); if (x) x.remove(); clearInterval(timer);
    try { tw.BackButton.offClick(close); tw.BackButton.hide(); } catch (e) {}
  }
  function row(a, right) {
    return '<button class="row" data-bsa="' + ec(a.sym) + '">' + med(a) + '<div class="who"><b>' + ec(a.name) + (a.live ? '' : '<span class="bsk">' + L().closed + '</span>') + '</b><small>' + right.sub + '</small></div>'
      + '<div class="px num"><b>' + right.top + '</b><span class="chip ' + (right.up ? 'up' : 'down') + '">' + right.chip + '</span></div></button>';
  }
  function draw() {
    const x = document.getElementById('bsx'); if (!x || !S) return;
    const T = L(), d = S.div || {};
    const tot = S.pos.reduce((m, p) => m + Number(p.value), 0), g = S.pos.reduce((m, p) => m + Number(p.value) - Number(p.cost), 0);
    let h = '<div class="bw"><button class="bk" type="button">' + T.back + '</button><h1>' + T.title + '</h1>'
      + '<div class="hero"><span><small>' + T.tot + '</small><b class="num">' + usd(tot) + '</b>' + (S.pos.length ? ' <span class="chip ' + (g >= 0 ? 'up' : 'down') + '">' + (g >= 0 ? '+' : '') + usd(g) + '</span>' : '') + '</span>'
      + '<span style="text-align:right"><small>' + T.cash + '</small><b class="num" style="font-size:18px">' + usd(S.cash) + '</b></span></div>';
    if (DIV_ON && !S.banned) {  // 26 oct 2026 (18h41, Jeremy): no link with Pass The Baton for now (no dividend card)
      const line = Number(d.ready) > 0 ? T.divT(kpi(d.ready)) : Number(d.next) > 0 ? T.divW(kpi(d.next)) : T.divT0;
      h += '<div class="bsdiv"><b>' + T.divH + '</b><small>' + T.divS(d.per || 10, kpi(d.cap || 1000)) + '</small>'
        + '<div class="bl"><span class="bn">' + line + (Number(d.total) > 0 ? '<br><small>' + T.divL(kpi(d.total)) + '</small>' : '') + '</span><button class="bb" type="button" id="bsbt">' + T.divB + '</button></div></div>';
    }
    if (S.pos.length) {
      h += '<div class="bsh">' + T.mine + '</div>' + S.pos.map((p) => {
        const a = asset(p.sym) || { sym: p.sym, name: p.sym, em: '📈' }, pg = Number(p.value) - Number(p.cost);
        return row(a, { sub: qf(p.qty) + ' ' + ec(p.sym), top: usd(p.value), up: pg >= 0, chip: (pg >= 0 ? '+' : '') + usd(pg) });
      }).join('');
    }
    h += '<div class="bsh">' + T.all + '</div>' + S.assets.map((a) => row(a, { sub: ec(a.sym) + ' · ' + T.kind[a.kind], top: px(a.price), up: Number(a.chg) >= 0, chip: pc(a.chg) })).join('')
      + '<p class="hint" style="margin-top:12px">' + T.note + '</p></div>';
    const y = x.scrollTop; x.innerHTML = h; x.scrollTop = y;
    x.querySelector('.bk').onclick = close;
    x.querySelectorAll('[data-bsa]').forEach((b) => b.onclick = () => { hp(); trade(b.dataset.bsa); });
    const bt = document.getElementById('bsbt');
    if (bt) bt.onclick = () => { hp(); try { tw.openTelegramLink(BATON); } catch (e) { location.href = BATON; } };
  }

  // ---------- the card at the top of the Portfolio: "📈 Invest in the stock market" ----------
  function pfCard() {
    let c = document.getElementById('bspf');
    if (view() !== 'portfolio') { if (c) c.remove(); return; }
    const v = document.getElementById('view'); if (!v) return;
    load(false);
    const T = L(), tot = S ? S.pos.reduce((a, p) => a + Number(p.value), 0) : 0, g = S ? S.pos.reduce((a, p) => a + Number(p.value) - Number(p.cost), 0) : 0;
    const d = (S && S.div) || {};
    const sub = S && S.pos.length ? T.pfV(usd(tot), '<span style="color:' + (g >= 0 ? '#4ff0b7' : '#ff5d8f') + '">' + (g >= 0 ? '+' : '') + usd(g) + '</span>') + (DIV_ON && Number(d.next) > 0 && !S.banned ? ' · 🏃 +' + kpi(d.ready > 0 ? d.ready : d.next) + ' $BATON' : '') : T.pfE;
    const k = sub + lg();
    const h2 = v.querySelector('h2');  // 26 oct 2026 (18h46, Jeremy): right above "Your coins" (the first section title of the Portfolio)
    if (!h2) return;
    if (!c || !c.isConnected) {
      c = document.createElement('button'); c.id = 'bspf'; c.type = 'button'; c.className = 'bsdiv';
      c.style.cssText = 'width:100%;text-align:left;color:inherit;cursor:pointer;flex-direction:row;align-items:center';
      c.onclick = () => { hp(); open(); };
      c.style.marginTop = '14px';
      h2.insertAdjacentElement('beforebegin', c);
    }
    if (c.dataset.k !== k) { c.dataset.k = k; c.innerHTML = '<span style="flex:1;min-width:0"><b style="display:block">' + T.pfH + '</b><small>' + sub + '</small></span><span class="bb">' + T.pfB + '</span>'; }
  }
  setInterval(pfCard, 1000);

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
        S = r; lastLoad = Date.now(); cashUp(r.cash); draw();
      } else { hp('err'); tst(T.err[(r && r.error)] || T.err.x); }
    } finally { busy = false; }
  }
})();
