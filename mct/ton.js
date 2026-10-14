// 14 oct 2026: real TON for referrals: the card in Earn (status and TON wallet), served by the Supabase function mct-ton
const TONF = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-ton';
const TONT = {
  en: { h: '💎 Earn real TON', s: (u) => '$' + u + ' in TON for every friend who really plays', v: 'Valid friends', p: 'Pending', b: 'Balance', mn: (m) => 'paid from $' + m, paid: 'received', wait: 'being paid', w: 'Your TON wallet', ph: 'Paste your TON address (UQ... or EQ...)', save: 'Save', ok: 'Wallet saved ✅', bad: 'Invalid TON address', chg: 'Change', inv: '👥 Invite my friends', delay: (d) => 'Paid within ' + d + ' days', rule: 'A friend counts when he comes back to play another day within 7 days and makes 5 trades.', off: 'Budget of the month reached: TON rewards are back next month.', bh: '💎 Earn real TON with your friends', bs: '$0.05 in TON for every friend who plays · tap here' },
  fr: { h: '💎 Gagne de vrais TON', s: (u) => u + ' $ en TON par ami qui joue vraiment', v: 'Amis validés', p: 'En attente', b: 'Solde', mn: (m) => 'paiement dès ' + m + ' $', paid: 'reçu', wait: 'en cours de paiement', w: 'Ton portefeuille TON', ph: 'Colle ton adresse TON (UQ... ou EQ...)', save: 'OK', ok: 'Portefeuille enregistré ✅', bad: 'Adresse TON invalide', chg: 'Changer', inv: '👥 Inviter mes amis', delay: (d) => 'Paiement sous ' + d + ' jours', rule: 'Un ami compte quand il revient jouer un autre jour dans les 7 jours et fait 5 échanges.', off: 'Budget du mois atteint : les gains en TON reprennent le mois prochain.', bh: '💎 Gagne de vrais TON avec tes amis', bs: '0,05 $ en TON par ami qui joue · appuie ici' },
};
async function tonCall(body) {
  const r = await fetch(TONF, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: tw.initData, ...body }) });
  return r.json();
}
async function tonCard(edit) {
  const el = $('#tonc'); if (!el || !tw || !tw.initData) return;
  const L = TONT[LANG] || TONT.en, f2 = (n) => { const x = Number(n || 0).toFixed(2); return LANG === 'fr' ? x.replace('.', ',') : x; };
  let s; try { s = await tonCall({}); } catch (e) { return; }
  if (!s || !s.ok || !s.on || VIEW !== 'earn' || !$('#tonc')) return;
  const w = s.wallet, ed = edit || !w;
  const extra = (Number(s.waiting) ? ' · ' + L.wait + ' ' + f2(s.waiting) + ' $' : '') + (Number(s.paid) ? ' · ' + L.paid + ' ' + f2(s.paid) + ' $' : '');
  el.innerHTML = `<div class="msn" style="border-color:#2ee6ff;padding:14px 14px 10px">`
    + `<b style="font-size:16px">${L.h}</b><br><small style="color:var(--mute)">${L.s(f2(s.usd))}</small>`
    + `<div class="tiles" style="margin:10px 0"><div class="tile"><b>${s.valid}</b><small>✅ ${L.v}</small></div><div class="tile"><b>${s.pending}</b><small>⏳ ${L.p}</small></div>`
    + `<div class="tile wide"><b>${LANG === 'fr' ? f2(s.balance) + ' $' : '$' + f2(s.balance)}</b><small>💰 ${L.b} · ${L.mn(f2(s.min))}${extra}</small></div></div>`
    + (ed
      ? `<small style="color:var(--mute)">👛 ${L.w}</small><div style="display:flex;gap:8px;margin:6px 0 10px"><input id="tona" placeholder="${L.ph}" value="${esc(w || '')}" autocomplete="off" spellcheck="false" style="flex:1;min-width:0;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:inherit;font-size:14px"><button class="ghost sm" id="tons">${L.save}</button></div>`
      : `<div class="row" style="margin:0 0 10px"><div class="who"><b>👛 ${L.w}</b><small style="white-space:normal;word-break:break-all">${esc(w)}</small></div><button class="ghost sm" id="tonc2">${L.chg}</button></div>`)
    + (Number(s.budget_left) < Number(s.usd) ? `<p class="hint">${L.off}</p>` : '')
    + `<button class="btn" id="toni">${L.inv}</button><p class="hint" style="font-size:12px;margin-top:8px">${L.delay(s.delay)} · ${L.rule}</p></div>`;
  $('#toni').onclick = invite;
  if ($('#tonc2')) $('#tonc2').onclick = () => { haptic(); tonCard(true); };
  if ($('#tons')) $('#tons').onclick = async () => {
    const a = ($('#tona').value || '').trim(); if (!a) return;
    haptic(); $('#tons').disabled = true;
    let r; try { r = await tonCall({ action: 'wallet', addr: a }); } catch (e) { r = null; }
    if (!r || !r.ok) { haptic('err'); toast(L.bad); if ($('#tons')) $('#tons').disabled = false; return; }
    haptic('ok'); toast(L.ok); tonCard(false);
  };
}
// 14 oct 2026: on the market (home screen), a button to the TON card, shown while the TON rewards are on
let TONON = null;
async function tonBanner() {
  const anchor = document.getElementById('simpl'); if (!anchor || document.getElementById('tonb') || VIEW !== 'market' || !tw || !tw.initData) return;
  if (TONON === null) { TONON = false; try { const s = await tonCall({}); TONON = !!(s && s.ok && s.on); } catch (e) { TONON = null; return; } }
  if (!TONON || document.getElementById('tonb') || !document.getElementById('simpl')) return;
  const L = TONT[LANG] || TONT.en, b = document.createElement('button');
  b.id = 'tonb'; b.className = 'row'; b.style.cssText = 'border:1px solid #2ee6ff;border-radius:14px;width:100%;text-align:start;cursor:pointer';
  b.innerHTML = `<span class="med sm" style="--c:#2ee6ff">💎</span><div class="who"><b style="white-space:normal">${L.bh}</b><small style="white-space:normal">${L.bs}</small></div><span class="chip up">TON</span>`;
  b.onclick = () => { haptic(); go('earn'); setTimeout(() => { const c = document.getElementById('tonc'); if (c) c.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 700); };
  const at = document.getElementById('simpl'); at.parentNode.insertBefore(b, at);
}
// the screens are rebuilt each time they open: fill the card / add the button as soon as their place appears
function tonScan() { const el = document.getElementById('tonc'); if (el && !el.dataset.t) { el.dataset.t = '1'; tonCard(); } if (document.getElementById('simpl') && !document.getElementById('tonb')) tonBanner(); }
new MutationObserver(tonScan).observe(document.body, { childList: true, subtree: true });
tonScan();
