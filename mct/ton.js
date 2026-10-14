// 14 oct 2026: Meme Coin Tycoon, real TON for referrals: a dedicated page (status, progress, TON wallet, how it works)
// and a banner to it at the top of the market (and in Earn). Served by the Supabase function mct-ton.
const TONF = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-ton';
const TONT = {
  en: { h: '💎 Earn real TON', s: (u) => '$' + u + ' in TON for every friend who really plays', v: 'Valid friends', p: 'Pending', r: 'Received', b: 'Balance', mn: (m) => 'Paid from $' + m, togo: (x) => '$' + x + ' to go before your payment', ready: 'Ready: paid within 7 days 🎉', wait: 'Being paid', w: 'Your TON wallet', ph: 'Paste your TON address (UQ... or EQ...)', save: 'Save', ok: 'Wallet saved ✅', bad: 'Invalid TON address', chg: 'Change', nowal: 'Add your wallet to get paid 👇', inv: '👥 Invite my friends', how: 'How it works', st: (u, m, d) => ['👥 Invite your friends with your link', '🎮 They play: 5 trades and they come back another day (within 7 days)', '💎 You earn $' + u + ' in TON per friend', '👛 Paid to your TON wallet from $' + m + ', within ' + d + ' days'], rule: 'Fake or duplicate accounts are never paid. No limit per player.', off: 'Budget of the month reached: TON rewards are back next month.', back: '← Back', bh: '💎 Earn real TON with your friends', bs: '$0.05 in TON for every friend who plays · tap here' },
  fr: { h: '💎 Gagne de vrais TON', s: (u) => u + ' $ en TON par ami qui joue vraiment', v: 'Amis validés', p: 'En attente', r: 'Reçu', b: 'Solde', mn: (m) => 'Paiement dès ' + m + ' $', togo: (x) => 'Encore ' + x + ' $ avant ton paiement', ready: 'Prêt : paiement sous 7 jours 🎉', wait: 'En cours de paiement', w: 'Ton portefeuille TON', ph: 'Colle ton adresse TON (UQ... ou EQ...)', save: 'OK', ok: 'Portefeuille enregistré ✅', bad: 'Adresse TON invalide', chg: 'Changer', nowal: 'Ajoute ton portefeuille pour être payé 👇', inv: '👥 Inviter mes amis', how: 'Comment ça marche', st: (u, m, d) => ['👥 Invite tes amis avec ton lien', '🎮 Ils jouent : 5 échanges et ils reviennent un autre jour (dans les 7 jours)', '💎 Tu gagnes ' + u + ' $ en TON par ami', '👛 Paiement sur ton portefeuille TON dès ' + m + ' $, sous ' + d + ' jours'], rule: 'Les faux comptes et doublons ne sont jamais payés. Pas de limite par joueur.', off: 'Budget du mois atteint : les gains en TON reprennent le mois prochain.', back: '← Retour', bh: '💎 Gagne de vrais TON avec tes amis', bs: '0,05 $ en TON par ami qui joue · appuie ici' },
};
const tonL = () => TONT[LANG] || TONT.en;
const tonF2 = (n) => { const x = Number(n || 0).toFixed(2); return LANG === 'fr' ? x.replace('.', ',') : x; };
const tonM = (n) => LANG === 'fr' ? tonF2(n) + ' $' : '$' + tonF2(n);
async function tonCall(body) {
  const r = await fetch(TONF, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: tw.initData, ...body }) });
  return r.json();
}
let TONON = null; // one status call per session, shared by every caller
function tonOn() {
  if (!TONON) TONON = tonCall({}).then((s) => !!(s && s.ok && s.on)).catch(() => { TONON = null; return false; });
  return TONON;
}
function tonBack() { try { tw.BackButton.hide(); tw.BackButton.offClick(tonBack); } catch (e) {} if (VIEW === 'ton') go('market'); }
// the dedicated page
async function tonPage(edit) {
  if (!tw || !tw.initData) return;
  const L = tonL(), v = $('#view');
  if (VIEW !== 'ton') {
    VIEW = 'ton'; try { clearInterval(MINE_T); } catch (e) {}
    document.querySelectorAll('nav.tb button').forEach((b) => b.removeAttribute('aria-current'));
    window.scrollTo(0, 0);
    try { tw.BackButton.show(); tw.BackButton.onClick(tonBack); } catch (e) {}
    v.innerHTML = `<button class="ghost sm" id="tonbk" style="margin-bottom:8px">${L.back}</button><h1>${L.h}</h1><div class="skel"></div><div class="skel"></div>`;
    $('#tonbk').onclick = () => { haptic(); tonBack(); };
  }
  let s; try { s = await tonCall({}); } catch (e) { return; }
  if (!s || !s.ok || VIEW !== 'ton') return;
  const w = s.wallet, ed = edit || !w, bal = Number(s.balance), mn = Number(s.min), pct = Math.min(100, Math.round(bal / mn * 100));
  const steps = L.st(tonF2(s.usd), tonF2(s.min), s.delay).map((x, i) => `<div class="row" style="margin:0 0 6px"><span class="med sm" style="--c:#2ee6ff">${i + 1}</span><div class="who"><small style="white-space:normal;font-size:14px;color:inherit">${x}</small></div></div>`).join('');
  v.innerHTML = `<button class="ghost sm" id="tonbk" style="margin-bottom:8px">${L.back}</button><h1>${L.h}</h1><p class="hint" style="margin-top:-6px">${L.s(tonF2(s.usd))}</p>`
    + `<div class="msn" style="border-color:#2ee6ff;padding:18px 16px;text-align:center"><small style="color:var(--mute);font-size:12px;text-transform:uppercase;letter-spacing:.06em">${L.b}</small>`
    + `<div class="num" style="font-size:38px;font-weight:900;line-height:1.15;margin:4px 0 10px">${tonM(bal)}</div>`
    + `<div style="height:10px;border-radius:10px;background:rgba(255,255,255,.1);overflow:hidden"><div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#2ee6ff,#4ff0b7)"></div></div>`
    + `<small style="display:block;margin-top:8px;color:var(--mute)">${bal >= mn ? (w ? L.ready : L.nowal) : L.togo(tonF2(mn - bal)) + ' · ' + L.mn(tonF2(mn))}</small></div>`
    + `<div class="tiles" style="margin:12px 0"><div class="tile"><b>${s.valid}</b><small>✅ ${L.v}</small></div><div class="tile"><b>${s.pending}</b><small>⏳ ${L.p}</small></div>`
    + `<div class="tile wide"><b>${tonM(Number(s.paid))}</b><small>💸 ${L.r}${Number(s.waiting) ? ' · ' + L.wait + ' ' + tonM(s.waiting) : ''}</small></div></div>`
    + `<button class="btn" id="toni" style="margin-bottom:14px">${L.inv}</button>`
    + `<h2>👛 ${L.w}</h2>`
    + (ed
      ? `<div style="display:flex;gap:8px;margin:6px 0 14px"><input id="tona" placeholder="${L.ph}" value="${esc(w || '')}" autocomplete="off" spellcheck="false" style="flex:1;min-width:0;padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:inherit;font-size:14px"><button class="ghost sm" id="tons">${L.save}</button></div>`
      : `<div class="row" style="margin:6px 0 14px"><div class="who"><small style="white-space:normal;word-break:break-all;font-size:13px;color:inherit">${esc(w)}</small></div><button class="ghost sm" id="tonc2">${L.chg}</button></div>`)
    + (Number(s.budget_left) < Number(s.usd) ? `<p class="hint">${L.off}</p>` : '')
    + `<h2>${L.how}</h2>${steps}<p class="hint" style="font-size:12px;margin-top:10px">${L.rule}</p>`;
  $('#tonbk').onclick = () => { haptic(); tonBack(); };
  $('#toni').onclick = invite;
  if ($('#tonc2')) $('#tonc2').onclick = () => { haptic(); tonPage(true); };
  if ($('#tons')) $('#tons').onclick = async () => {
    const a = ($('#tona').value || '').trim(); if (!a) return;
    haptic(); $('#tons').disabled = true;
    let r; try { r = await tonCall({ action: 'wallet', addr: a }); } catch (e) { r = null; }
    if (!r || !r.ok) { haptic('err'); toast(L.bad); if ($('#tons')) $('#tons').disabled = false; return; }
    haptic('ok'); toast(L.ok); tonPage(false);
  };
}
// the banner to the page (market: at the top, Earn: in its slot)
function tonButton() {
  const L = tonL(), b = document.createElement('button');
  b.className = 'row tonbtn'; b.style.cssText = 'border:1px solid #2ee6ff;border-radius:14px;width:100%;text-align:start;cursor:pointer;margin-bottom:10px';
  b.innerHTML = `<span class="med sm" style="--c:#2ee6ff">💎</span><div class="who"><b style="white-space:normal">${L.bh}</b><small style="white-space:normal">${L.bs}</small></div><span class="chip up">TON</span>`;
  b.onclick = () => { haptic(); tonPage(); };
  return b;
}
async function tonPlace() {
  if (!tw || !tw.initData) return;
  const sp = document.getElementById('simpl'), ec = document.getElementById('tonc');
  if (!(sp && VIEW === 'market' && !document.getElementById('tonb')) && !(ec && !ec.dataset.t)) return;
  if (!(await tonOn())) return;
  const sp2 = document.getElementById('simpl');
  if (sp2 && VIEW === 'market' && !document.getElementById('tonb')) { const b = tonButton(); b.id = 'tonb'; sp2.parentNode.insertBefore(b, sp2); }
  const ec2 = document.getElementById('tonc');
  if (ec2 && !ec2.dataset.t) { ec2.dataset.t = '1'; ec2.appendChild(tonButton()); }
}
// the screens are rebuilt each time they open: add the banner as soon as its place appears
new MutationObserver(() => { tonPlace(); }).observe(document.body, { childList: true, subtree: true });
tonPlace();
