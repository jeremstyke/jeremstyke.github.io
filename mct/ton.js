// 14 oct 2026: real TON for referrals: the card in Earn (status and TON wallet), served by the Supabase function mct-ton
const TONF = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-ton';
const TONT = {
  en: { h: '💎 Earn real TON', s: (u) => '$' + u + ' in TON for every friend who really plays', v: 'Valid friends', p: 'Pending', b: 'Balance', mn: (m) => 'paid from $' + m, paid: 'received', wait: 'being paid', w: 'Your TON wallet', ph: 'Paste your TON address (UQ... or EQ...)', save: 'Save', ok: 'Wallet saved ✅', bad: 'Invalid TON address', chg: 'Change', inv: '👥 Invite my friends', delay: (d) => 'Paid within ' + d + ' days', rule: 'A friend counts when he comes back to play another day within 7 days and makes 5 trades.', off: 'Budget of the month reached: TON rewards are back next month.' },
  fr: { h: '💎 Gagne de vrais TON', s: (u) => u + ' $ en TON par ami qui joue vraiment', v: 'Amis validés', p: 'En attente', b: 'Solde', mn: (m) => 'paiement dès ' + m + ' $', paid: 'reçu', wait: 'en cours de paiement', w: 'Ton portefeuille TON', ph: 'Colle ton adresse TON (UQ... ou EQ...)', save: 'OK', ok: 'Portefeuille enregistré ✅', bad: 'Adresse TON invalide', chg: 'Changer', inv: '👥 Inviter mes amis', delay: (d) => 'Paiement sous ' + d + ' jours', rule: 'Un ami compte quand il revient jouer un autre jour dans les 7 jours et fait 5 échanges.', off: 'Budget du mois atteint : les gains en TON reprennent le mois prochain.' },
};
async function tonCall(body) {
  const r = await fetch(TONF, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: tw.initData, ...body }) });
  return r.json();
}
async function tonCard(edit) {
  const el = $('#tonc'); if (!el || !tw || !tw.initData) return;
  const L = TONT[LANG] || TONT.en, f2 = (n) => Number(n || 0).toFixed(2);
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
// the Earn screen is rebuilt each time it opens: fill the card as soon as its empty slot appears
new MutationObserver(() => { const el = document.getElementById('tonc'); if (el && !el.dataset.t) { el.dataset.t = '1'; tonCard(); } }).observe(document.body, { childList: true, subtree: true });
{ const el = document.getElementById('tonc'); if (el && !el.dataset.t) { el.dataset.t = '1'; tonCard(); } }
