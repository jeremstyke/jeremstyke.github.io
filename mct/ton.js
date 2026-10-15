// 14 oct 2026: Meme Coin Tycoon, real TON for referrals: a dedicated page (status, progress, TON wallet, how it works)
// and a banner to it at the top of the market (and in Earn). Served by the Supabase function mct-ton.
const TONF = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-ton';
const TONT = {
  en: { h: '💎 Earn real TON', s: (u) => '$' + u + ' in TON for every friend who really plays, plus $500 in the game for you and your friend', v: 'Valid friends', p: 'Pending', r: 'Received', b: 'Balance', mn: (m) => 'Paid from $' + m, togo: (x) => '$' + x + ' to go before your payment', ready: 'Ready: paid within 7 days 🎉', wait: 'Being paid', w: 'Your TON wallet', ph: 'Paste your TON address (UQ... or EQ...)', save: 'Save', ok: 'Wallet saved ✅', bad: 'Invalid TON address', chg: 'Change', nowal: 'Add your wallet to get paid 👇', inv: '👥 Invite my friends', invn: 'Every friend you invite with this button counts for your TON, and you both get $500 in the game.', how: 'How it works', st: (u, m, d) => ['👥 Invite your friends with your link: you both get $500 in the game right away 🎁', '🎮 They play: 5 trades and they play on 3 different days (within 30 days)', '💎 You earn $' + u + ' in real TON per friend', '👛 Paid to your TON wallet from $' + m + ', within ' + d + ' days'], rule: 'Fake or duplicate accounts are never paid. No limit per player.', off: 'Budget of the month reached: TON rewards are back next month.', back: '← Back', bh: '💎 Earn real TON with your friends', bs: '$0.05 in TON + $500 in the game per friend · tap here' },
  fr: { h: '💎 Gagne de vrais TON', s: (u) => u + ' $ en TON par ami qui joue vraiment, et 500 $ dans le jeu pour toi et ton ami', v: 'Amis validés', p: 'En attente', r: 'Reçu', b: 'Solde', mn: (m) => 'Paiement dès ' + m + ' $', togo: (x) => 'Encore ' + x + ' $ avant ton paiement', ready: 'Prêt : paiement sous 7 jours 🎉', wait: 'En cours de paiement', w: 'Ton portefeuille TON', ph: 'Colle ton adresse TON (UQ... ou EQ...)', save: 'OK', ok: 'Portefeuille enregistré ✅', bad: 'Adresse TON invalide', chg: 'Changer', nowal: 'Ajoute ton portefeuille pour être payé 👇', inv: '👥 Inviter mes amis', invn: 'Chaque ami invité avec ce bouton compte pour tes TON, et vous recevez 500 $ chacun dans le jeu.', how: 'Comment ça marche', st: (u, m, d) => ['👥 Invite tes amis avec ton lien : vous gagnez tous les deux 500 $ dans le jeu tout de suite 🎁', '🎮 Ils jouent : 5 échanges et ils jouent 3 jours différents (dans les 30 jours)', '💎 Tu gagnes ' + u + ' $ en vrais TON par ami', '👛 Paiement sur ton portefeuille TON dès ' + m + ' $, sous ' + d + ' jours'], rule: 'Les faux comptes et doublons ne sont jamais payés. Pas de limite par joueur.', off: 'Budget du mois atteint : les gains en TON reprennent le mois prochain.', back: '← Retour', bh: '💎 Gagne de vrais TON avec tes amis', bs: '0,05 $ en TON + 500 $ dans le jeu par ami · appuie ici' },
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
// 15 oct 2026: like Daily Score, a sheet instead of a separate page, with the same live total balance in every app (Meme Coin Tycoon,
// GramPedia, Daily Score) and its detail per program. The wallet and the payouts are in Earn by Jeremstyke.
const TOND = {
  fr: { tot: 'Mon solde total', mct: '🪙 Meme Coin Tycoon', gp: '📚 GramPedia', ds: '⚽ Daily Score', earn: '💰 Bonus Earn', tap: '💎 Diamant', other: '🏆 Concours et bonus', here: 'ici', paid: 'Déjà reçu', wait: 'En cours de paiement', pay: (m) => 'Payé chaque lundi dès ' + m + ' sur ton portefeuille TON', nowal: '👛 Ajoute ton portefeuille dans Earn pour être payé', wal: '✅ Portefeuille ajouté', addw: '👛 Ajouter mon portefeuille', c: '🏆 Tes amis comptent aussi pour le concours de la semaine sur Earn by Jeremstyke : 1 $, 0,50 $ et 0,25 $ en TON pour le top 3 chaque lundi, en plus de tes gains.', n: 'Ton portefeuille et tes paiements sont dans Earn by Jeremstyke.', my: '💰 Mes gains TON', close: 'Plus tard' },
  en: { tot: 'My total balance', mct: '🪙 Meme Coin Tycoon', gp: '📚 GramPedia', ds: '⚽ Daily Score', earn: '💰 Earn bonus', tap: '💎 Diamond', other: '🏆 Contest and bonuses', here: 'here', paid: 'Already received', wait: 'Being paid', pay: (m) => 'Paid every Monday from ' + m + ' to your TON wallet', nowal: '👛 Add your wallet in Earn to get paid', wal: '✅ Wallet added', addw: '👛 Add my wallet', c: '🏆 Your friends also count in the weekly contest on Earn by Jeremstyke: $1, $0.50 and $0.25 in TON for the top 3 every Monday, on top of your earnings.', n: 'Your wallet and your payouts are in Earn by Jeremstyke.', my: '💰 My TON earnings', close: 'Later' }
};
// 15 oct 2026: "Add my wallet" opens Earn by Jeremstyke right on the wallet field
function tonGoWal() { try { haptic(); } catch (e) {} try { tw.openTelegramLink('https://t.me/earnbyjeremstykebot?startapp=wallet_mct'); } catch (e) { window.open('https://t.me/earnbyjeremstykebot?startapp=wallet_mct', '_blank'); } }
function tonDet(a, here, D, M) {
  if (!a) return '';
  const det = a.detail || {}, keys = ['mct', 'gp', 'ds', 'earn', 'tap'].concat(['other'].filter((k) => Number(det[k]) > 0)).sort((x, y) => Number(det[y] || 0) - Number(det[x] || 0)); // 15 oct 2026: biggest first
  const row = (k) => `<div style="display:flex;justify-content:space-between;gap:8px;padding:6px 0;border-top:1px solid rgba(255,255,255,.08);font-size:14px${k === here ? ';font-weight:700' : ''}"><span>${D[k]}${k === here ? ' <small style="opacity:.6">(' + D.here + ')</small>' : ''}</span><b>${k === 'tap' && Number(det[k]) > 0 && Number(det[k]) < 0.01 ? (LANG === 'fr' ? Number(det[k]).toFixed(4).replace('.', ',') + ' $' : '$' + Number(det[k]).toFixed(4)) : M(det[k] || 0)}</b></div>`;
  return `<small style="display:block;font-size:12px;text-transform:uppercase;letter-spacing:.06em;opacity:.7">${D.tot}</small><div style="font-size:34px;font-weight:900;line-height:1.15;margin:2px 0 8px">${M(a.total)}</div>`
    + keys.map(row).join('')
    + (Number(a.paid) || Number(a.waiting) ? `<small style="display:block;margin-top:8px;opacity:.75">${Number(a.paid) ? '💸 ' + D.paid + ' ' + M(a.paid) : ''}${Number(a.paid) && Number(a.waiting) ? ' · ' : ''}${Number(a.waiting) ? '⏳ ' + D.wait + ' ' + M(a.waiting) : ''}</small>` : '')
    + `<small style="display:block;margin-top:8px;opacity:.75">${D.pay(M(a.min))}</small>${a.wallet ? '<small style="display:block;margin-top:4px;font-weight:600">' + D.wal + ' <a href="#" onclick="tonGoWal();return false" style="font-weight:400;opacity:.7;text-decoration:underline;color:inherit;margin-left:6px">' + (LANG === 'fr' ? 'Changer' : 'Change') + '</a></small>' : '<button class="btn" onclick="tonGoWal()" style="width:100%;margin-top:10px">' + D.addw + '</button>'}`;
}
// 15 oct 2026: the money waiting: friends who still have to play, with their progress (Meme Coin Tycoon: days /3 and trades /5,
// Daily Score: predictions /4, GramPedia: listing)
function tonPendHtml(p, pend, need, M) {
  if (!p || !p.n) return '';
  const prog = (f) => f.app === 'mct' ? '📅 ' + Math.min(f.dy, 3) + '/3 · 🔁 ' + Math.min(f.tr, 5) + '/5' : f.app === 'ds' ? '⚽ ' + Math.min(f.tr, 4) + '/4' : '📚 ' + (f.tr > 0 ? '⏳' : '0/1');
  const ic = { mct: '🪙', ds: '⚽', gp: '📚' };
  // 15 oct 2026: shown big, right under the total balance, to motivate (the list of friends opens below)
  return `<div style="margin:10px 0 8px;padding:10px 12px;border-radius:12px;background:rgba(255,212,59,.12);border:1px solid rgba(255,212,59,.5)"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><span style="font-size:14px;font-weight:700">⏳ ${pend}</span><b style="font-size:24px;color:#ffd43b;white-space:nowrap">+ ${M(p.usd)}</b></div><small style="display:block;opacity:.8;margin-top:2px">${need(p.n)}</small>`
    + `<details style="margin-top:6px"><summary style="cursor:pointer;font-size:13px;opacity:.85">👥 ${p.n} ▾</summary>`
    + (p.friends || []).map((f) => `<div style="display:flex;justify-content:space-between;gap:8px;padding:5px 0;font-size:13px;border-top:1px solid rgba(255,255,255,.06)"><span>${ic[f.app] || ''} ${esc(f.name)}</span><span style="opacity:.8;white-space:nowrap">${prog(f)}</span></div>`).join('')
    + (p.n > (p.friends || []).length ? `<small style="opacity:.6">+ ${p.n - p.friends.length}</small>` : '') + `</details></div>`;
}
// puts the waiting block right after the total (the first closing div of the balance card)
function tonPendIn(h, x) { const i = h.indexOf('</div>') + 6; return i > 5 ? h.slice(0, i) + x + h.slice(i) : h + x; }
const tonDet0 = tonDet;
tonDet = (a, here, D, M) => tonPendIn(tonDet0(a, here, D, M), a ? tonPendHtml(a.pending, LANG === 'fr' ? 'En attente' : 'Pending', (n) => LANG === 'fr' ? n + (n > 1 ? ' amis doivent' : ' ami doit') + ' encore jouer' : n + (n > 1 ? ' friends' : ' friend') + ' still to play', M) : '');
// 15 oct 2026: share outside Telegram (WhatsApp, Messenger, SMS...): the friend still opens the game in Telegram
function outCopy(v, ok) {
  let done = false;
  try { navigator.clipboard.writeText(v); done = true; } catch (x) {}
  if (!done) { try { const t = document.createElement('textarea'); t.value = v; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); } catch (x) {} }
  try { toast(ok); } catch (x) {}
}
function outWa(msg) { const u = 'https://wa.me/?text=' + encodeURIComponent(msg); try { (window.Telegram && Telegram.WebApp && Telegram.WebApp.initData ? Telegram.WebApp.openLink(u) : window.open(u, '_blank')); } catch (x) { window.open(u, '_blank'); } }
let TONSH_T = null;
function tonTiles(s, L) {
  const tile = (b, l) => `<div style="flex:1;min-width:0;padding:8px 4px;border-radius:12px;background:rgba(255,255,255,.07);text-align:center"><b style="display:block;font-size:17px">${b}</b><small style="display:block;font-size:11px;opacity:.7">${l}</small></div>`;
  return tile('✅ ' + Number(s.valid || 0), L.v) + tile('⏳ ' + Number(s.pending || 0), L.p);
}
async function tonPage() {
  if (!tw || !tw.initData) return;
  const L = tonL(), D = TOND[LANG === 'fr' ? 'fr' : 'en'];
  let s; try { s = await tonCall({}); } catch (e) { return; }
  if (!s || !s.ok) return;
  const old = document.getElementById('tonsheet'); if (old) old.remove();
  const d = document.createElement('div'); d.id = 'tonsheet';
  d.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.6);display:flex;align-items:flex-end;justify-content:center';
  const steps = L.st(tonF2(s.usd), tonF2(s.min), s.delay).map((x, i) => `<div style="display:flex;gap:10px;align-items:flex-start;margin:0 0 8px"><span style="flex:none;width:24px;height:24px;border-radius:50%;background:#2ee6ff;color:#062a33;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:13px">${i + 1}</span><span style="font-size:14px">${x}</span></div>`).join('');
  d.innerHTML = `<div style="width:100%;max-width:520px;max-height:88vh;overflow:auto;background:#151a23;color:#fff;border-radius:20px 20px 0 0;padding:18px 16px 24px;box-sizing:border-box"><b style="display:block;font-size:18px;margin-bottom:4px">${L.h}</b><p style="margin:0 0 12px;font-size:15px;font-weight:700">${L.s(tonF2(s.usd))}</p>`
    + `<div id="tondet" style="margin:0 0 12px;padding:14px;border-radius:16px;border:1px solid rgba(46,230,255,.45);background:rgba(46,230,255,.08)">${tonDet(s.all, 'mct', D, tonM)}</div>`
    + `<div id="tontl" style="display:flex;gap:6px;margin:0 0 14px">${tonTiles(s, L)}</div>` + '<details style="margin:0 0 10px"><summary style="cursor:pointer;font-size:14px;font-weight:700;margin-bottom:8px">' + L.how + ' ▾</summary>' + steps + '</details>'
    + (Number(s.budget_left) < Number(s.usd) ? `<p style="font-size:13px;opacity:.75">${L.off}</p>` : '')
    + `<div style="margin:6px 0 6px;font-size:13px;color:#ffd43b">${D.c}</div><div style="margin:0 0 12px;font-size:13px;opacity:.75">${D.n}</div>`
    + `<button class="btn" id="tonsi" style="width:100%">${L.inv}</button><div style="display:flex;gap:8px;margin-top:8px"><button class="ghost" id="tonwa" style="flex:1">📲 WhatsApp</button><button class="ghost" id="toncp" style="flex:1">📋 ${LANG === 'fr' ? 'Copier mon lien' : 'Copy my link'}</button></div><button class="ghost" id="tonse" style="width:100%;margin-top:8px">${D.my}</button><div id="tonsc" style="cursor:pointer;text-decoration:underline;text-align:center;margin-top:12px;opacity:.75">${D.close}</div></div>`;
  document.body.appendChild(d);
  const close = () => { d.remove(); clearInterval(TONSH_T); };
  d.onclick = (e) => { if (e.target === d || e.target.id === 'tonsc') close(); };
  d.querySelector('#tonsi').onclick = () => { close(); invite(); };
  const myLink = 'https://t.me/Memecointycoonbot?startapp=r_' + ((tw.initDataUnsafe && tw.initDataUnsafe.user && tw.initDataUnsafe.user.id) || '');
  const myMsg = LANG === 'fr' ? '🚀 Joue à Meme Coin Tycoon avec moi sur Telegram : on gagne 500 $ chacun pour commencer 👉 ' + myLink + '\n\n(Pas encore Telegram ? Installe-le, puis reclique sur ce lien.)' : '🚀 Play Meme Coin Tycoon with me on Telegram: we both get $500 to start 👉 ' + myLink + '\n\n(No Telegram yet? Install it, then tap this link again.)';
  d.querySelector('#tonwa').onclick = () => { try { haptic(); } catch (x) {} outWa(myMsg); };
  d.querySelector('#toncp').onclick = () => { try { haptic(); } catch (x) {} outCopy(myLink, LANG === 'fr' ? 'Lien copié ✅ Colle-le dans Messenger, WhatsApp, SMS…' : 'Link copied ✅ Paste it in Messenger, WhatsApp, SMS…'); };
  d.querySelector('#tonse').onclick = () => { haptic(); try { tw.openTelegramLink('https://t.me/earnbyjeremstykebot?startapp=mct'); } catch (e) { window.open('https://t.me/earnbyjeremstykebot?startapp=mct', '_blank'); } };
  // live: the balance is refreshed every 20 s while the sheet is open
  clearInterval(TONSH_T);
  TONSH_T = setInterval(async () => {
    if (!document.getElementById('tonsheet')) { clearInterval(TONSH_T); return; }
    let x; try { x = await tonCall({}); } catch (e) { return; }
    if (!x || !x.ok) return;
    const a = document.getElementById('tondet'), t = document.getElementById('tontl');
    if (a) a.innerHTML = tonDet(x.all, 'mct', D, tonM); if (t) t.innerHTML = tonTiles(x, L);
  }, 20000);
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
