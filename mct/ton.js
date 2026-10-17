// 14 oct 2026: Meme Coin Tycoon, real TON for referrals: a dedicated page (status, progress, TON wallet, how it works)
// and a banner to it at the top of the market (and in Earn). Served by the Supabase function mct-ton.
const TONF = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-ton';
const TONT = {
  id: { h: '💎 Dapatkan TON asli', s: (u) => '$' + u + ' dalam TON untuk setiap teman yang benar-benar bermain, plus $500 di game untukmu dan temanmu', v: 'Teman valid', p: 'Tertunda', r: 'Diterima', b: 'Saldo', mn: (m) => 'Dibayar mulai $' + m, togo: (x) => 'Kurang $' + x + ' sebelum pembayaranmu', ready: 'Siap: dibayar dalam 7 hari 🎉', wait: 'Sedang dibayar', w: 'Dompet TON-mu', ph: 'Tempel alamat TON-mu (UQ... atau EQ...)', save: 'Simpan', ok: 'Dompet tersimpan ✅', bad: 'Alamat TON tidak valid', chg: 'Ganti', nowal: 'Tambahkan dompetmu untuk dibayar 👇', inv: '👥 Undang temanku', invn: 'Setiap teman yang kamu undang dengan tombol ini dihitung untuk TON-mu, dan kalian berdua dapat $500 di game.', how: 'Cara kerjanya', st: (u, m, d) => ['👥 Undang temanmu dengan link-mu: kalian berdua langsung dapat $500 di game 🎁', '🎮 Mereka bermain: 5 transaksi dan bermain di 3 hari berbeda (dalam 30 hari)', '💎 Kamu dapat $' + u + ' dalam TON asli per teman', '👛 Dibayar ke dompet TON-mu mulai $' + m + ', dalam ' + d + ' hari'], rule: 'Akun palsu atau ganda tidak pernah dibayar. Tanpa batas per pemain.', off: 'Anggaran bulan ini tercapai: hadiah TON kembali bulan depan.', back: '← Kembali', bh: '💵 Dapatkan TON asli', bs: '$0.05 dalam TON + $500 di game per teman · ketuk di sini' },
  en: { h: '💎 Earn real TON', s: (u) => '$' + u + ' in TON for every friend who really plays, plus $500 in the game for you and your friend', v: 'Valid friends', p: 'Pending', r: 'Received', b: 'Balance', mn: (m) => 'Paid from $' + m, togo: (x) => '$' + x + ' to go before your payment', ready: 'Ready: paid within 7 days 🎉', wait: 'Being paid', w: 'Your TON wallet', ph: 'Paste your TON address (UQ... or EQ...)', save: 'Save', ok: 'Wallet saved ✅', bad: 'Invalid TON address', chg: 'Change', nowal: 'Add your wallet to get paid 👇', inv: '👥 Invite my friends', invn: 'Every friend you invite with this button counts for your TON, and you both get $500 in the game.', how: 'How it works', st: (u, m, d) => ['👥 Invite your friends with your link: you both get $500 in the game right away 🎁', '🎮 They play: 5 trades and they play on 3 different days (within 30 days)', '💎 You earn $' + u + ' in real TON per friend', '👛 Paid to your TON wallet from $' + m + ', within ' + d + ' days'], rule: 'Fake or duplicate accounts are never paid. No limit per player.', off: 'Budget of the month reached: TON rewards are back next month.', back: '← Back', bh: '💵 Earn real TON', bs: '$0.05 in TON + $500 in the game per friend · tap here' },
  fr: { h: '💎 Gagne de vrais TON', s: (u) => u + ' $ en TON par ami qui joue vraiment, et 500 $ dans le jeu pour toi et ton ami', v: 'Amis validés', p: 'En attente', r: 'Reçu', b: 'Solde', mn: (m) => 'Paiement dès ' + m + ' $', togo: (x) => 'Encore ' + x + ' $ avant ton paiement', ready: 'Prêt : paiement sous 7 jours 🎉', wait: 'En cours de paiement', w: 'Ton portefeuille TON', ph: 'Colle ton adresse TON (UQ... ou EQ...)', save: 'OK', ok: 'Portefeuille enregistré ✅', bad: 'Adresse TON invalide', chg: 'Changer', nowal: 'Ajoute ton portefeuille pour être payé 👇', inv: '👥 Inviter mes amis', invn: 'Chaque ami invité avec ce bouton compte pour tes TON, et vous recevez 500 $ chacun dans le jeu.', how: 'Comment ça marche', st: (u, m, d) => ['👥 Invite tes amis avec ton lien : vous gagnez tous les deux 500 $ dans le jeu tout de suite 🎁', '🎮 Ils jouent : 5 échanges et ils jouent 3 jours différents (dans les 30 jours)', '💎 Tu gagnes ' + u + ' $ en vrais TON par ami', '👛 Paiement sur ton portefeuille TON dès ' + m + ' $, sous ' + d + ' jours'], rule: 'Les faux comptes et doublons ne sont jamais payés. Pas de limite par joueur.', off: 'Budget du mois atteint : les gains en TON reprennent le mois prochain.', back: '← Retour', bh: '💵 Gagne de vrais TON', bs: '0,05 $ en TON + 500 $ dans le jeu par ami · appuie ici' },
};
const tonL = () => TONT[LANG] || TONT.en;
const tonF2 = (n) => { const x = Number(n || 0).toFixed(2); return LANG === 'fr' ? x.replace('.', ',') : x; };
const tonM = (n) => LANG === 'fr' ? tonF2(n) + ' $' : '$' + tonF2(n);
async function tonCall(body) {
  const r = await fetch(TONF, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: tw.initData, ...body }) });
  return r.json();
}
let TONON = null; // one status call per session, shared by every caller
// 15 oct 2026: the last status, for the amounts shown on the home banner
let TONLAST = null;
const tonMini = (s) => '✅ ' + tonM(s.balance) + (LANG === 'fr' ? ' validé' : ' validated') + ' · ⏳ ' + tonM(Number(s.pending || 0) * Number(s.usd || 0)) + (LANG === 'fr' ? ' en attente' : ' pending') + ' · 💸 ' + tonM(Number(s.paid || 0) + Number(s.waiting || 0)) + (LANG === 'fr' ? ' payé' : ' paid');
function tonOn() {
  if (!TONON) TONON = tonCall({}).then((s) => { TONLAST = s; return !!(s && s.ok && s.on); }).catch(() => { TONON = null; return false; });
  return TONON;
}
function tonBack() { try { tw.BackButton.hide(); tw.BackButton.offClick(tonBack); } catch (e) {} if (VIEW === 'ton') go('market'); }
// the dedicated page
// 15 oct 2026: like Daily Score, a sheet instead of a separate page, with the same live total balance in every app (Meme Coin Tycoon,
// GramPedia, Daily Score) and its detail per program. The wallet and the payouts are in Earn by Jeremstyke.
const TOND = {
  fr: { tot: 'Mon solde total', mct: '🪙 Meme Coin Tycoon', gp: '📚 GramPedia', ds: '⚽ Daily Score', earn: '💰 Bonus Earn', tap: '💎 Diamant', other: '🏆 Concours et bonus', here: 'ici', paid: 'Déjà reçu', wait: 'En cours de paiement', pay: (m) => 'Payé chaque lundi dès ' + m + ' sur ton portefeuille TON', nowal: '👛 Ajoute ton portefeuille dans Earn pour être payé', wal: '✅ Portefeuille ajouté', addw: '👛 Ajouter mon portefeuille', c: '🏆 Tes amis comptent aussi pour le concours de la semaine sur Earn by Jeremstyke : 1 $, 0,50 $ et 0,25 $ en TON pour le top 3 chaque lundi, en plus de tes gains.', n: 'Ton portefeuille et tes paiements sont dans Earn by Jeremstyke.', my: '💰 Mes gains TON', close: 'Plus tard' },
  id: { tot: 'Total saldoku', mct: '🪙 Meme Coin Tycoon', gp: '📚 GramPedia', ds: '⚽ Daily Score', earn: '💰 Bonus Earn', tap: '💎 Berlian', other: '🏆 Kontes dan bonus', here: 'di sini', paid: 'Sudah diterima', wait: 'Sedang dibayar', pay: (m) => 'Dibayar setiap Senin mulai ' + m + ' ke dompet TON-mu', nowal: '👛 Tambahkan dompetmu di Earn untuk dibayar', wal: '✅ Dompet ditambahkan', addw: '👛 Tambahkan dompetku', c: '🏆 Temanmu juga dihitung di kontes mingguan Earn by Jeremstyke: $1, $0.50 dan $0.25 dalam TON untuk 3 teratas setiap Senin, di luar penghasilanmu.', n: 'Dompet dan pembayaranmu ada di Earn by Jeremstyke.', my: '💰 Penghasilan TON-ku', close: 'Nanti' },
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
// 15 oct 2026 (v2): the game shows only its own program: its earnings, its friends waiting, and the TON wallet, added right here
// (one wallet per person, shared by all the apps). The other referral programs are in Earn by Jeremstyke.
function gameDet(s, app, D, M, fr) {
  const a = s.all || {}, P = a.pending || {}, fl = (P.friends || []).filter((f) => f.app === app), pn = Number(s.pending || 0);
  const t = fr ? { mine: 'Mes gains Meme Coin Tycoon', pend: 'En attente', need: (n) => n + (n > 1 ? ' amis doivent' : ' ami doit') + ' encore jouer', paid: 'Déjà reçu', wait: 'En cours de paiement', pay: (m) => 'Payé chaque lundi sur ton portefeuille TON, dès ' + m + '', ok: '✅ Portefeuille ajouté', chg: 'Changer', add: '👛 Ajouter mon portefeuille', ph: 'Colle ton adresse TON (UQ... ou EQ...)', h1: 'Pas d\'adresse TON ? C\'est gratuit et ça prend 1 minute :', h2: 'Ouvre <b>@wallet</b> dans Telegram', h3: 'Touche <b>Recevoir</b>, puis <b>TON</b>', h4: 'Copie l\'adresse et colle-la ici', ow: 'Ouvrir @wallet', sync: '👛 Ton portefeuille TON, payé chaque lundi dès 0,10 $.' }
    : (typeof LANG !== 'undefined' && LANG === 'id') ? { mine: 'Penghasilan Meme Coin Tycoon-ku', pend: 'Tertunda', need: (n) => n + ' teman masih harus bermain', paid: 'Sudah diterima', wait: 'Sedang dibayar', pay: (m) => 'Dibayar setiap Senin ke dompet TON-mu, mulai ' + m + '', ok: '✅ Dompet ditambahkan', chg: 'Ganti', add: '👛 Tambahkan dompetku', ph: 'Tempel alamat TON-mu (UQ... atau EQ...)', h1: 'Belum punya alamat TON? Gratis dan hanya 1 menit:', h2: 'Buka <b>@wallet</b> di Telegram', h3: 'Ketuk <b>Terima</b>, lalu <b>TON</b>', h4: 'Salin alamatnya dan tempel di sini', ow: 'Buka @wallet', sync: '👛 Dompet TON-mu, dibayar setiap Senin mulai $0.10.' } // 16 oct 2026: Indonesian
    : { mine: 'My Meme Coin Tycoon earnings', pend: 'Pending', need: (n) => n + (n > 1 ? ' friends' : ' friend') + ' still to play', paid: 'Already received', wait: 'Being paid', pay: (m) => 'Paid every Monday to your TON wallet, from ' + m + '', ok: '✅ Wallet added', chg: 'Change', add: '👛 Add my wallet', ph: 'Paste your TON address (UQ... or EQ...)', h1: 'No TON address? It\'s free and takes 1 minute:', h2: 'Open <b>@wallet</b> in Telegram', h3: 'Tap <b>Receive</b>, then <b>TON</b>', h4: 'Copy the address and paste it here', ow: 'Open @wallet', sync: '👛 Your TON wallet, paid every Monday from $0.10.' };
  // 15 oct 2026: validated, pending and paid shown at once, without a tap
  const box = (l, v, c) => `<div style="flex:1;min-width:0;padding:10px 4px;border-radius:14px;background:rgba(0,0,0,.2);text-align:center"><small style="display:block;font-size:11px;opacity:.8">${l}</small><b style="display:block;font-size:18px;font-weight:900;color:${c};white-space:nowrap">${v}</b></div>`;
  const prog = (f) => f.app === 'mct' ? '📅 ' + Math.min(f.dy, 3) + '/3 · 🔁 ' + Math.min(f.tr, 5) + '/5' : f.app === 'ds' ? '⚽ ' + Math.min(f.tr, 4) + '/4' : '📚 ' + (f.tr > 0 ? '⏳' : '0/1');
  let h = `<small style="display:block;font-size:12px;text-transform:uppercase;letter-spacing:.06em;opacity:.7">${t.mine}</small>`
    + `<div style="display:flex;gap:6px;margin:8px 0 4px">${box('✅ ' + (fr ? 'Validé' : 'Validated'), M(s.balance), '#4ff0b7')}${box('⏳ ' + t.pend, M(pn * Number(s.usd || 0)), '#ffd43b')}${box('💸 ' + (fr ? 'Payé' : 'Paid'), M(Number(s.paid || 0) + Number(s.waiting || 0)), '#9fe9ff')}</div>`;
  if (pn) h += `<details style="margin-top:6px"><summary style="cursor:pointer;font-size:13px;opacity:.85">👥 ${t.need(pn)} ▾</summary>` + fl.map((f) => `<div style="display:flex;justify-content:space-between;gap:8px;padding:5px 0;font-size:13px;border-top:1px solid rgba(255,255,255,.06)"><span>${esc(f.name)}</span><span style="opacity:.8;white-space:nowrap">${prog(f)}</span></div>`).join('') + `</details>`;
  h += `<small style="display:block;margin-top:8px;opacity:.75">${t.pay(M(a.min || s.min))}</small>`;
  h += a.wallet ? `<div style="margin-top:8px;font-size:14px;font-weight:700">${t.ok} <a href="#" onclick="gameWalShow();return false" style="font-weight:400;opacity:.7;text-decoration:underline;color:inherit;margin-left:6px">${t.chg}</a></div>`
    : `<button class="btn" onclick="gameWalShow()" style="width:100%;margin-top:10px">${t.add}</button>`;
  h += `<div id="gamewf" style="display:none;margin-top:10px"><div style="display:flex;gap:8px"><input id="gamewa" placeholder="${t.ph}" autocomplete="off" spellcheck="false" style="flex:1;min-width:0;padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:inherit;font-size:14px"><button class="btn" onclick="gameWalSave()" style="width:auto;margin:0;padding:12px 16px">OK</button></div>`
    + `<div style="margin-top:8px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.06);font-size:13px;line-height:1.5"><b>${t.h1}</b><br>1. ${t.h2}<br>2. ${t.h3}<br>3. ${t.h4}<button class="ghost" onclick="gameOpen('https://t.me/wallet')" style="width:100%;margin-top:8px">👛 ${t.ow}</button></div><small style="display:block;margin-top:6px;opacity:.7">${t.sync}</small></div>`;
  return h;
}
function gameWalShow() { const f = document.getElementById('gamewf'); if (!f) return; f.style.display = ''; const i = document.getElementById('gamewa'); if (i) { i.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => { try { i.focus(); } catch (e) {} }, 400); } }
const gameWalOpen = () => { const f = document.getElementById('gamewf'); return !!(f && f.style.display !== 'none'); };
function gameOpen(u) { try { tw.openTelegramLink(u); } catch (e) { window.open(u, '_blank'); } }
async function gameWalSave() {
  const i = document.getElementById('gamewa'), v = ((i && i.value) || '').trim(); if (!v) return;
  try { haptic(); } catch (e) {}
  let r; try { r = await tonCall({ action: 'wallet', addr: v }); } catch (e) { r = null; }
  if (!r || !r.ok) { toast(LANG === 'fr' ? 'Adresse TON invalide' : 'Invalid TON address'); return; }
  toast(LANG === 'fr' ? 'Portefeuille enregistré ✅' : 'Wallet saved ✅'); tonPage();
}
// the Meme Coin Tycoon referral contest of the week (top 3 win TON on Monday)
// 16 oct 2026: live countdown to the end of the weekly contest (Sunday 23:59, Paris time)
function cdTxt(end, dl) { const t = Math.max(0, Math.floor((Date.parse(end) - Date.now()) / 1000)), d = Math.floor(t / 86400), p = (n) => String(n).padStart(2, '0'); return (d ? d + dl + ' ' : '') + p(Math.floor(t % 86400 / 3600)) + ':' + p(Math.floor(t % 3600 / 60)) + ':' + p(t % 60); }
function cdBox(end, fr) { return `<div style="margin:6px 0 8px;padding:8px 10px;border-radius:10px;background:rgba(0,0,0,.28);text-align:center"><div style="font-size:12px;opacity:.75">⏳ ${fr ? 'Fin du concours dans' : 'Contest ends in'}</div><div style="font-size:22px;font-weight:900;font-variant-numeric:tabular-nums" data-cdend="${end}" data-cdl="${fr ? 'j' : 'd'}">${cdTxt(end, fr ? 'j' : 'd')}</div><div style="font-size:11px;opacity:.6">${fr ? 'Dimanche 23h59, heure de Paris' : 'Sunday 23:59, Paris time'}</div></div>`; }
setInterval(() => { document.querySelectorAll('[data-cdend]').forEach((e) => { e.textContent = cdTxt(e.dataset.cdend, e.dataset.cdl || 'd'); }); }, 1000);
function mctContestHtml(c, fr, M) {
  if (!c || !c.on) return '';
  const md = ['🥇', '🥈', '🥉'], pz = c.prizes || [], top = (c.top || []).slice(0, 3);
  const left = Math.max(0, Math.round((Date.parse(c.ends) - Date.now()) / 36e5)), lt = left > 48 ? Math.round(left / 24) + (fr ? ' j' : ' d') : left + ' h';
  const rows = top.map((x, i) => `<div style="display:flex;justify-content:space-between;gap:8px;padding:5px 0;font-size:13px;border-top:1px solid rgba(255,255,255,.08)${x.me ? ';color:#ffd43b;font-weight:700' : ''}"><span>${md[i]} ${esc(x.name)}</span><span>${x.n} ${fr ? 'ami' + (x.n > 1 ? 's' : '') : 'friend' + (x.n > 1 ? 's' : '')} · ${M(pz[i] || 0)}</span></div>`).join('')
    || `<div style="font-size:13px;opacity:.8">${fr ? 'Personne pour l\'instant : sois le premier !' : 'Nobody yet: be the first!'}</div>`;
  const me = c.me && c.me.rank ? `<div style="font-size:13px;margin-top:6px">${fr ? 'Ta place' : 'Your rank'} : <b>#${c.me.rank}</b> · ${c.me.n} ${fr ? 'ami(s)' : 'friend(s)'}</div>` : '';
  return `<div style="margin:6px 0 12px;padding:12px;border-radius:14px;border:1px solid rgba(255,212,59,.45);background:rgba(255,212,59,.08)"><b style="display:block;font-size:15px;margin-bottom:4px">🏆 ${fr ? 'Concours de parrainage de la semaine' : 'Referral contest of the week'}</b><div style="font-size:13px;opacity:.85;margin-bottom:6px">${fr ? 'Les 3 meilleurs parrains gagnent ' : 'The top 3 inviters win '}<b>${pz.map((x) => M(x)).join(' / ')}</b> ${fr ? 'en TON lundi, en plus de leurs gains.' : 'in TON on Monday, on top of their earnings.'}</div>${cdBox(c.ends, fr)}${rows}${me}</div>`;
}
let TONSH_T = null;
function tonTiles(s, L) {
  const tile = (b, l) => `<div><b>${b}</b><small>${l}</small></div>`;
  return tile('✅ ' + Number(s.valid || 0), L.v) + tile('⏳ ' + Number(s.pending || 0), L.p);
}
// 15 oct 2026: the look of the TON sheet
(() => {
  const st = document.createElement('style');
  st.textContent = '.tsx{width:100%;max-width:520px;max-height:90vh;overflow:auto;background:linear-gradient(180deg,#1d2142 0%,#121522 40%);color:#fff;border-radius:24px 24px 0 0;padding:10px 16px 26px;box-sizing:border-box;box-shadow:0 -10px 40px rgba(0,0,0,.5);animation:tsxUp .25s ease-out}'
    + '@keyframes tsxUp{from{transform:translateY(40px);opacity:.4}to{transform:none;opacity:1}}'
    + '.tsx .grab{width:42px;height:5px;border-radius:9px;background:rgba(255,255,255,.25);margin:0 auto 14px}'
    + '.tsx .hero{display:flex;gap:12px;align-items:center;margin:0 0 10px}'
    + '.tsx .hero .ic{flex:none;width:54px;height:54px;border-radius:18px;display:grid;place-items:center;font-size:30px;background:radial-gradient(circle at 30% 25%,#bff6ff,#2ee6ff 55%,#0b6c80);box-shadow:0 6px 22px rgba(46,230,255,.4)}'
    + '.tsx .hero b{display:block;font-size:21px;font-weight:900;letter-spacing:-.01em}'
    + '.tsx .hero span{display:inline-block;margin-top:4px;font-size:12px;font-weight:800;color:#062a33;background:linear-gradient(90deg,#2ee6ff,#4ff0b7);padding:3px 10px;border-radius:999px}'
    + '.tsx .sub{font-size:13px;opacity:.75;margin:0 0 14px;line-height:1.45}'
    + '.tsx .earn{margin:0 0 14px;padding:16px;border-radius:20px;background:linear-gradient(145deg,rgba(46,230,255,.16),rgba(124,92,255,.14));border:1px solid rgba(46,230,255,.35);box-shadow:0 10px 30px rgba(46,230,255,.12)}'
    + '.tsx .cta{display:block;width:100%;border:0;border-radius:16px;padding:15px;font-weight:900;font-size:16px;color:#062a33;background:linear-gradient(90deg,#2ee6ff,#4ff0b7);box-shadow:0 6px 0 #0b8f86;cursor:pointer}'
    + '.tsx .cta:active{transform:translateY(3px);box-shadow:0 3px 0 #0b8f86}'
    + '.tsx .row{display:flex;gap:8px;margin:12px 0 16px}'
    + '.tsx .sec{flex:1;border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:11px 6px;font-weight:700;font-size:14px;color:#fff;background:rgba(255,255,255,.06);cursor:pointer}'
    + '.tsx .tiles{display:flex;gap:8px;margin:0 0 14px}'
    + '.tsx .tiles>div{flex:1;padding:12px 6px;border-radius:16px;background:rgba(255,255,255,.06);text-align:center}'
    + '.tsx .tiles b{display:block;font-size:22px;font-weight:900}.tsx .tiles small{font-size:11px;opacity:.7}'
    + '.tsx details.how{margin:0 0 10px;padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.04)}'
    + '.tsx details.how summary{cursor:pointer;font-weight:800;font-size:14px;list-style:none}.tsx details.how summary::-webkit-details-marker{display:none}'
    + '.tsx .more{display:block;width:100%;border:0;background:none;color:#9fe9ff;font-weight:700;font-size:14px;padding:12px;cursor:pointer}'
    + '.tsx .close{text-align:center;opacity:.6;font-size:13px;cursor:pointer;padding:4px}';
  document.head.appendChild(st);
})();
function earnAllHtml(s) {
  const u = tonM(s.usd || 0.05), m = tonM(s.min || 0.1), K = (a, b, c) => tonM(a) + ', ' + tonM(b) + (LANG === 'fr' ? ' et ' : ' and ') + tonM(c);
  const T = ({
    fr: { h: '💵 Tout ce que tu peux gagner', f: '👥 Parrainage : ' + u + ' par ami qui joue 3 jours (+ 500 $ chacun dans le jeu)', d: '💎 Tape le diamant : de l\'argent à chaque tape', cg: '🏆 Concours des gains : ', cp: '🏆 Concours des parrains : ', cd: '🏆 Concours du diamant : ', wk: ' chaque lundi', js: '📣 Abonne-toi à @jeremstyke : 0,01 $ tout de suite, puis tous les 30 jours', mc: '📣 Abonne-toi à @memecointycoon : 0,01 $ tout de suite, puis tous les 30 jours', jb: 'S\'abonner', ok: 'tu es abonné 👍', cb: 'Classements', ds: '⚽ Daily Score : mon autre jeu, un prono foot gratuit par jour', db: 'Jouer', pay: '💸 Payé chaque lundi en TON, dès ' + m },
    id: { h: '💵 Semua yang bisa kamu dapatkan', f: '👥 Undang teman: ' + u + ' per teman yang bermain 3 hari (+ $500 di game)', d: '💎 Ketuk berlian: uang di setiap ketukan', cg: '🏆 Kontes keuntungan: ', cp: '🏆 Kontes pengundang: ', cd: '🏆 Kontes berlian: ', wk: ' tiap Senin', js: '📣 Langganan @jeremstyke: $0.01 langsung, lalu tiap 30 hari', mc: '📣 Langganan @memecointycoon: $0.01 langsung, lalu tiap 30 hari', jb: 'Langganan', ok: 'kamu sudah berlangganan 👍', cb: 'Peringkat', ds: '⚽ Daily Score: game saya yang lain, satu prediksi bola gratis tiap hari', db: 'Main', pay: '💸 Dibayar tiap Senin dalam TON, mulai ' + m },
  })[LANG] || { h: '💵 Everything you can earn', f: '👥 Referral: ' + u + ' per friend who plays 3 days (+ $500 each in the game)', d: '💎 Tap the diamond: money on every tap', cg: '🏆 Gains contest: ', cp: '🏆 Sponsor contest: ', cd: '🏆 Diamond contest: ', wk: ' every Monday', js: '📣 Subscribe to @jeremstyke: $0.01 right away, then every 30 days', mc: '📣 Subscribe to @memecointycoon: $0.01 right away, then every 30 days', jb: 'Subscribe', ok: 'you are subscribed 👍', cb: 'Rankings', ds: '⚽ Daily Score: my other game, one free football prediction a day', db: 'Play', pay: '💸 Paid every Monday in TON, from ' + m };
  const row = (t, btn, id) => `<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-top:1px solid rgba(255,255,255,.07);font-size:13.5px;line-height:1.35"><span style="flex:1">${t}</span>${btn ? `<button id="${id}" style="flex:none;border:0;border-radius:999px;padding:6px 12px;font-weight:800;font-size:12px;background:#7dff6b;color:#10200f;cursor:pointer">${btn}</button>` : ''}</div>`;
  return `<div style="margin:0 0 14px;padding:12px 14px;border-radius:16px;border:1px solid rgba(125,255,107,.45);background:rgba(125,255,107,.07)"><b style="display:block;font-size:15px;margin-bottom:4px">${T.h}</b>`
    + row(T.f) + row(T.d) + row(T.cg + K(1, 0.5, 0.25) + T.wk) + row(T.cp + K(1, 0.5, 0.25) + T.wk) + row(T.cd + K(1, 0.5, 0.25) + T.wk, T.cb, 'tonrk')
    // 17 oct 2026: already subscribed: it says so (no button)
    + (s.sub ? row('✅ ' + T.js.replace(/^📣 /, '') + ' · ' + T.ok) : row(T.js, T.jb, 'tonjs'))
    + (s.subm ? row('✅ ' + T.mc.replace(/^📣 /, '') + ' · ' + T.ok) : row(T.mc, T.jb, 'tonmc')) + row(T.pay) + `</div>`;
}
async function tonPage() {
  if (!tw || !tw.initData) return;
  const L = tonL(), D = TOND[LANG] || TOND.en; // 16 oct 2026: + Indonesian
  let s; try { s = await tonCall({}); } catch (e) { return; }
  if (!s || !s.ok) return;
  const old = document.getElementById('tonsheet'); if (old) old.remove();
  const d = document.createElement('div'); d.id = 'tonsheet';
  d.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.6);display:flex;align-items:flex-end;justify-content:center';
  const steps = L.st(tonF2(s.usd), tonF2(s.min), s.delay).map((x, i) => `<div style="display:flex;gap:10px;align-items:flex-start;margin:0 0 8px"><span style="flex:none;width:24px;height:24px;border-radius:50%;background:#2ee6ff;color:#062a33;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:13px">${i + 1}</span><span style="font-size:14px">${x}</span></div>`).join('');
  // 15 oct 2026: a nicer sheet: the earnings card first, then the big invite button, the friends, the contest, how it works
  d.innerHTML = `<div class="tsx"><div class="grab"></div>`
    + `<div class="hero"><div class="ic">💎</div><div><b>${L.h.replace(/^💎 /, '')}</b><span>${LANG === 'fr' ? tonF2(s.usd) + ' $ / ami' : '$' + tonF2(s.usd) + ' / friend'}</span></div></div>`
    + `<p class="sub">${L.s(tonF2(s.usd))}</p>`
    + `<div class="earn" id="tondet">${gameDet(s, 'mct', D, tonM, LANG === 'fr')}</div>`
    // 17 oct 2026 (Jeremy): everything that can be earned, in the sheet: friends, diamond, the 3 paid contests, @jeremstyke and Daily Score
    + earnAllHtml(s)
    + `<button class="cta" id="tonsi">${L.inv}</button><div class="row"><button class="sec" id="tonwa">📲 WhatsApp</button><button class="sec" id="toncp">📋 ${LANG === 'fr' ? 'Copier mon lien' : 'Copy my link'}</button></div>`
    + `<div class="tiles" id="tontl">${tonTiles(s, L)}</div>`
    + (Number(s.budget_left) < Number(s.usd) ? `<p style="font-size:13px;opacity:.75">${L.off}</p>` : '')
    + mctContestHtml(s.contest, LANG === 'fr', tonM)
    + `<details class="how"><summary>📖 ${L.how} ▾</summary><div style="margin-top:10px">${steps}</div></details>`
    + `<div class="close" id="tonsc">${D.close}</div></div>`; // 16 oct 2026 (Jeremy): no more Earn by Jeremstyke promotion inside the game
  document.body.appendChild(d);
  const close = () => { d.remove(); clearInterval(TONSH_T); };
  d.onclick = (e) => { if (e.target === d || e.target.id === 'tonsc') close(); };
  d.querySelector('#tonsi').onclick = () => { close(); invite(); };
  const trk = d.querySelector('#tonrk'); if (trk) trk.onclick = () => { try { haptic(); } catch (x) {} close(); if (typeof window.mctRanks === 'function') window.mctRanks(); };
  const tmc = d.querySelector('#tonmc'); if (tmc) tmc.onclick = () => { try { haptic(); } catch (x) {} gameOpen('https://t.me/memecointycoon'); };
  const tjs = d.querySelector('#tonjs'); if (tjs) tjs.onclick = () => { try { haptic(); } catch (x) {} gameOpen('https://t.me/jeremstyke'); };
  if (d.querySelector('#tonds')) d.querySelector('#tonds').onclick = () => { try { haptic(); } catch (x) {} gameOpen('https://t.me/DailyScorefootbot/play?startapp=src_mctsheet'); };
  const myLink = 'https://t.me/Memecointycoonbot?startapp=r_' + ((tw.initDataUnsafe && tw.initDataUnsafe.user && tw.initDataUnsafe.user.id) || '');
  const myMsg = LANG === 'fr' ? '🚀 Joue à Meme Coin Tycoon avec moi sur Telegram : on gagne 500 $ chacun pour commencer 👉 ' + myLink + '\n\n(Pas encore Telegram ? Installe-le, puis reclique sur ce lien.)' : '🚀 Play Meme Coin Tycoon with me on Telegram: we both get $500 to start 👉 ' + myLink + '\n\n(No Telegram yet? Install it, then tap this link again.)';
  d.querySelector('#tonwa').onclick = () => { try { haptic(); } catch (x) {} outWa(myMsg); };
  d.querySelector('#toncp').onclick = () => { try { haptic(); } catch (x) {} outCopy(myLink, LANG === 'fr' ? 'Lien copié ✅ Colle-le dans Messenger, WhatsApp, SMS…' : 'Link copied ✅ Paste it in Messenger, WhatsApp, SMS…'); };
  // live: the balance is refreshed every 20 s while the sheet is open
  clearInterval(TONSH_T);
  TONSH_T = setInterval(async () => {
    if (!document.getElementById('tonsheet')) { clearInterval(TONSH_T); return; }
    let x; try { x = await tonCall({}); } catch (e) { return; }
    if (!x || !x.ok) return;
    const a = document.getElementById('tondet'), t = document.getElementById('tontl');
    if (gameWalOpen()) return; if (a) a.innerHTML = gameDet(x, 'mct', D, tonM, LANG === 'fr'); if (t) t.innerHTML = tonTiles(x, L);
  }, 20000);
}
// the banner to the page (market: at the top, Earn: in its slot)
function tonButton() {
  const L = tonL(), b = document.createElement('button');
  b.className = 'row tonbtn'; b.style.cssText = 'border:1px solid #2ee6ff;border-radius:14px;width:100%;text-align:start;cursor:pointer;margin-bottom:10px';
  // 17 oct 2026 (Jeremy): like Daily Score, the banner shows the player's real earnings and everything he can earn (TON, paid on Monday)
  const u = tonM((TONLAST && TONLAST.usd) || 0.05), W = ({
    fr: ['👥 Ami qui joue 3 jours : ' + u + ' + 500 $ dans le jeu', '💎 Tape le diamant : de l\'argent à chaque tape', '🏆 3 concours chaque semaine : 1 $, 0,50 $ et 0,25 $ le lundi'],
    id: ['👥 Teman yang bermain 3 hari: ' + u + ' + $500 di game', '💎 Ketuk berlian: uang di setiap ketukan', '🏆 3 kontes tiap minggu: $1, $0.50 dan $0.25 setiap Senin'],
    ar: ['👥 صديق يلعب 3 أيام: ' + u + ' + 500 $ في اللعبة', '💎 اضغط على الماسة: مال مع كل ضغطة', '🏆 3 مسابقات أسبوعيًا: 1 $ و0.50 $ و0.25 $ كل اثنين'],
  })[LANG] || ['👥 Friend who plays 3 days: ' + u + ' + $500 in the game', '💎 Tap the diamond: money on every tap', '🏆 3 contests every week: $1, $0.50 and $0.25 on Monday'];
  b.style.borderColor = '#7dff6b'; b.style.background = 'linear-gradient(135deg,rgba(125,255,107,.12),rgba(46,230,255,.06))';
  b.innerHTML = `<span class="med sm" style="--c:#7dff6b">💵</span><div class="who"><b style="white-space:normal">${L.bh}</b><small style="white-space:normal;font-weight:700">${TONLAST && TONLAST.ok ? tonMini(TONLAST) : L.bs}</small><small class="tonways" style="white-space:normal;display:block;margin-top:4px;line-height:1.5">${W.join('<br>')}</small><span class="tondia" style="display:inline-block;margin-top:6px;padding:4px 10px;border-radius:999px;background:rgba(46,230,255,.15);border:1px solid rgba(46,230,255,.5);color:#2ee6ff;font-size:12px;font-weight:800">💎 ${({ fr: 'Tape le diamant', id: 'Ketuk berlian', ar: 'اضغط على الماسة' })[LANG] || 'Tap the diamond'} ›</span></div><span class="chip up">TON</span>`;
  // 17 oct 2026: a "Tap the diamond" link inside the banner opens the diamond, the rest of the banner the TON page
  b.onclick = (e) => { haptic(); const d = document.getElementById('diatop'); if (d && e && e.target && e.target.closest && e.target.closest('.tondia')) { d.click(); return; } tonPage(); };
  return b;
}
// 17 oct 2026: the market banner can be folded into a slim line (the choice is kept on the phone)
function tonFold(b) {
  if (!document.getElementById('tonfst')) {
    const st = document.createElement('style'); st.id = 'tonfst';
    st.textContent = '#tonb{position:relative;padding-right:40px}#tonb .tonfold{position:absolute;top:6px;right:8px;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.08);font-size:14px;line-height:1}'
      + '#tonb.min{padding-top:6px;padding-bottom:6px}#tonb.min .who small,#tonb.min .tonways,#tonb.min .tondia,#tonb.min .chip{display:none!important}#tonb.min .med{transform:scale(.8)}#tonb.min .tonfold{top:50%;margin-top:-13px}';
    document.head.appendChild(st);
  }
  let min = false; try { min = localStorage.getItem('mct_tonb_min') === '1'; } catch (e) {}
  const f = document.createElement('span'); f.className = 'tonfold'; f.setAttribute('aria-label', 'fold');
  const set = (m) => { b.classList.toggle('min', m); f.textContent = m ? '▾' : '▴'; };
  set(min); b.appendChild(f);
  const go = b.onclick;
  b.onclick = (e) => {
    if (e && e.target && e.target.closest && e.target.closest('.tonfold')) {
      try { haptic(); } catch (x) {}
      min = !b.classList.contains('min'); set(min); try { localStorage.setItem('mct_tonb_min', min ? '1' : '0'); } catch (x) {}
      return;
    }
    go(e);
  };
}
async function tonPlace() {
  if (!tw || !tw.initData) return;
  const sp = document.getElementById('simpl'), ec = document.getElementById('tonc');
  usdtBar();
  if (!(ec && !ec.dataset.t)) return;
  if (!(await tonOn())) return;
  const sp2 = document.getElementById('simpl');
  // 17 oct 2026 (Jeremy, 18h): no more banner at the top of the market: the earnings bar sits at the bottom, above the menu (usdtBar)
  const ec2 = document.getElementById('tonc');
  if (ec2 && !ec2.dataset.t) { ec2.dataset.t = '1'; ec2.appendChild(tonButton()); }
}
// 17 oct 2026 (Jeremy): like Daily Score, a bar at the bottom (above the menu) with the player's real earnings and everything he can earn,
// and a link to Daily Score (where predictions also pay real TON). A tap on the bar opens the TON page.
let USDTB = null;
// 17 oct 2026 (18h20): smaller, one line like Daily Score: my gains + everything that can be earned (scrolling), and 2 small buttons
const usdtGain = () => TONLAST && TONLAST.ok ? (LANG === 'fr' ? 'Mes gains : ' : 'My earnings: ') + tonM(Number(TONLAST.balance || 0) + Number(TONLAST.paid || 0) + Number(TONLAST.waiting || 0)) : tonL().bh.replace(/^💵 /, '');
async function usdtBar() {
  if (!tw || !tw.initData) return;
  if (USDTB && document.body.contains(USDTB)) { const m = USDTB.querySelector('.ubm'); if (m && m.textContent !== usdtGain()) m.textContent = usdtGain(); return; }
  if (USDTB === false) return;
  USDTB = false;
  if (!(await tonOn())) { USDTB = null; return; }
  if (!document.getElementById('usdtst')) {
    const st = document.createElement('style'); st.id = 'usdtst';
    st.textContent = 'body.ub{padding-bottom:calc(var(--tab) + 24px + 64px + env(safe-area-inset-bottom))!important}'
      + '#usdtb{position:fixed;left:0;right:0;bottom:calc(var(--tab) + env(safe-area-inset-bottom));z-index:9;max-width:520px;margin:0 auto;padding:0 10px 5px;box-sizing:border-box}'
      + '#usdtb .ubi{display:flex;align-items:center;gap:8px;height:54px;padding:0 8px 0 12px;border-radius:14px;border:1px solid rgba(125,255,107,.5);background:linear-gradient(135deg,rgba(24,40,30,.97),rgba(18,22,44,.97));box-shadow:0 -4px 14px rgba(0,0,0,.3);cursor:pointer;box-sizing:border-box}'
      + '#usdtb .ubt{flex:1;min-width:0;overflow:hidden}#usdtb b{display:block;font-size:14px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      + '#usdtb .ubw{display:block;overflow:hidden;white-space:nowrap;font-size:12.5px;line-height:1.4;opacity:.9}#usdtb .ubw span{display:inline-block;padding-left:100%;animation:ubscroll 70s linear infinite}'
      + '@keyframes ubscroll{from{transform:translateX(0)}to{transform:translateX(-100%)}}'
      + '#diatop{display:none!important}' // 17 oct 2026: the diamond is opened from the earnings bar now
      + '#usdtb .ubx{flex:none;width:36px;height:36px;border:0;border-radius:50%;font-size:18px;background:rgba(125,255,107,.18);cursor:pointer;padding:0}';
    document.head.appendChild(st);
  }
  const u = tonM((TONLAST && TONLAST.usd) || 0.05);
  const ways = ({
    fr: '👥 Parrainage : ' + u + ' par ami qui joue 3 jours (+ 500 $ chacun dans le jeu) · 💎 Tape le diamant : de l\'argent à chaque tape · 🏆 Concours des gains : 1 $, 0,50 $ et 0,25 $ · 🏆 Concours des parrains : 1 $, 0,50 $ et 0,25 $ · 🏆 Concours du diamant : 1 $, 0,50 $ et 0,25 $ (les 3 payés chaque lundi) · 📣 Abonné à @jeremstyke et à @memecointycoon : 0,01 $ chacun tout de suite, puis tous les 30 jours · 💸 Payé en TON chaque lundi',
    id: '👥 Undang teman: ' + u + ' per teman yang bermain 3 hari (+ $500 di game) · 💎 Ketuk berlian: uang di setiap ketukan · 🏆 Kontes keuntungan: $1, $0.50, $0.25 · 🏆 Kontes pengundang: $1, $0.50, $0.25 · 🏆 Kontes berlian: $1, $0.50, $0.25 (dibayar tiap Senin) · 📣 Langganan @jeremstyke dan @memecointycoon: masing-masing $0.01 langsung, lalu tiap 30 hari · 💸 Dibayar dalam TON tiap Senin',
    ar: '👥 الإحالة: ' + u + ' عن كل صديق يلعب 3 أيام (+ 500 $ في اللعبة) · 💎 اضغط على الماسة: مال مع كل ضغطة · 🏆 مسابقة الأرباح: 1 $ و0.50 $ و0.25 $ · 🏆 مسابقة الداعين: 1 $ و0.50 $ و0.25 $ · 🏆 مسابقة الماسة: 1 $ و0.50 $ و0.25 $ (تُدفع كل اثنين) · 📣 اشترك في @jeremstyke و@memecointycoon: 0.01 $ لكل منهما فورًا ثم كل 30 يومًا · 💸 الدفع بعملة TON كل اثنين',
  })[LANG] || '👥 Referral: ' + u + ' per friend who plays 3 days (+ $500 each in the game) · 💎 Tap the diamond: money on every tap · 🏆 Gains contest: $1, $0.50 and $0.25 · 🏆 Sponsor contest: $1, $0.50 and $0.25 · 🏆 Diamond contest: $1, $0.50 and $0.25 (all 3 paid every Monday) · 📣 Subscribed to @jeremstyke and @memecointycoon: $0.01 each right away, then every 30 days · 💸 Paid in TON every Monday';
  const d = document.createElement('div'); d.id = 'usdtb';
  // 17 oct 2026 (Jeremy, 23h): the diamond moves from the top bar to this bar (the clans take its place at the top)
  d.innerHTML = '<div class="ubi"><span style="font-size:22px">💵</span><div class="ubt"><b class="ubm"></b><span class="ubw"><span></span></span></div><button class="ubx ubd" type="button" aria-label="Diamond" style="background:rgba(46,230,255,.18);border:1px solid rgba(46,230,255,.5)">💎</button></div>';
  d.querySelector('.ubm').textContent = usdtGain(); d.querySelector('.ubw span').textContent = ways;
  d.querySelector('.ubi').onclick = (e) => {
    try { haptic(); } catch (x) {}
    if (e && e.target && e.target.closest && e.target.closest('.ubd')) { const g = document.getElementById('diatop'); if (g) g.click(); return; }
    tonPage();
  };
  document.body.appendChild(d); document.body.classList.add('ub'); USDTB = d;
}
// the screens are rebuilt each time they open: add the banner as soon as its place appears
new MutationObserver(() => { tonPlace(); }).observe(document.body, { childList: true, subtree: true });
tonPlace();
// 17 oct 2026 (Jeremy): burn a coin from its page: +5 % on the price for every holder, once per coin per 24 h,
// 50 Stars (or free once a week with Premium). Announced on @memecointycoon. The page has an empty #burnb (data-id = the coin).
const BURNT = {
  fr: { go: 'Brûler', free: 'gratuit (Premium)', wait: (h) => 'Déjà brûlé aujourd\'hui · prochain brûlage dans ' + h + ' h', prem: '💎 Gratuit 1 fois par semaine avec Premium', x: 'Détruit 5 % des coins en circulation : le prix monte de 5 % pour tous ceux qui en ont.', done: '🔥 Coin brûlé : +5 % !', paid: '🔥 Paiement reçu, le coin brûle…', err: 'Problème, réessaie.' },
  id: { go: 'Bakar', free: 'gratis (Premium)', wait: (h) => 'Sudah dibakar hari ini · berikutnya dalam ' + h + ' jam', prem: '💎 Gratis 1x seminggu dengan Premium', x: 'Menghancurkan 5% koin yang beredar: harga naik 5% untuk semua pemegang.', done: '🔥 Koin dibakar: +5%!', paid: '🔥 Pembayaran diterima, koin dibakar…', err: 'Ada masalah, coba lagi.' },
  ar: { go: 'احرق', free: 'مجانًا (بريميوم)', wait: (h) => 'تم الحرق اليوم · الحرق التالي خلال ' + h + ' س', prem: '💎 مجانًا مرة أسبوعيًا مع بريميوم', x: 'يدمّر 5% من العملات المتداولة: يرتفع السعر 5% لكل من يملكها.', done: '🔥 تم حرق العملة: +5%!', paid: '🔥 تم الدفع، العملة تحترق…', err: 'حدثت مشكلة، حاول مجددًا.' },
  en: { go: 'Burn', free: 'free (Premium)', wait: (h) => 'Already burned today · next burn in ' + h + ' h', prem: '💎 Free once a week with Premium', x: 'Destroys 5% of the coins in circulation: the price rises 5% for every holder.', done: '🔥 Coin burned: +5%!', paid: '🔥 Payment received, the coin is burning…', err: 'Something went wrong, try again.' },
};
(() => {
  const st = document.createElement('style');
  st.textContent = '#burnb{margin-top:10px}#burnb .brn{border:0;border-radius:999px;padding:9px 16px;font-weight:800;font-size:14px;color:#fff;background:linear-gradient(90deg,#ff5a1f,#ff9a3c);box-shadow:0 4px 14px rgba(255,90,31,.35);cursor:pointer}'
    + '#burnb .brn:disabled{opacity:.6}#burnb .brn.off{display:inline-block;background:rgba(255,120,40,.12);color:#ff9a4d;box-shadow:none;font-size:12.5px;padding:6px 12px}#burnb small{display:block;font-size:11.5px;opacity:.75;margin-top:5px}';
  document.head.appendChild(st);
})();
async function burnFill(el) {
  el.dataset.done = '1';
  const id = Number(el.dataset.id), T = BURNT[LANG] || BURNT.en;
  let i = null; try { i = await tonCall({ action: 'burn_info', id }); } catch (e) {}
  if (!i || !i.ok) { el.innerHTML = ''; return; }
  if (i.next_at) { const h = Math.max(1, Math.ceil((Date.parse(i.next_at) - Date.now()) / 36e5)); el.innerHTML = '<span class="brn off">🔥 ' + T.wait(h) + '</span>'; return; }
  el.innerHTML = '<button class="brn" type="button">🔥 ' + T.go + ' +5 % · ' + (i.free ? T.free : i.stars + ' ⭐') + '</button><small>' + T.x + (i.free || i.prem ? '' : '<br><a href="#" class="brp" style="color:#ffd43b;font-weight:800;text-decoration:underline">' + T.prem + ' ›</a>') + '</small>';
  // 17 oct 2026 (Jeremy): the Premium line opens the Premium page
  const bp = el.querySelector('.brp'); if (bp) bp.onclick = (ev) => { ev.preventDefault(); try { haptic(); } catch (e) {} if (typeof window.mctPremium === 'function') window.mctPremium(); };
  const b = el.querySelector('button');
  b.onclick = async () => {
    try { haptic(); } catch (e) {}
    b.disabled = true;
    let r = null; try { r = await tonCall({ action: 'burn', id, lang: LANG }); } catch (e) {}
    const again = () => { try { openCoin(id); } catch (e) {} };
    if (r && r.ok && r.link) {
      try { tw.openInvoice(r.link, (s) => { if (s === 'paid') { try { toast(T.paid); } catch (e) {} setTimeout(again, 2500); } else b.disabled = false; }); } catch (e) { b.disabled = false; }
      return;
    }
    if (r && r.ok) { try { toast(T.done); } catch (e) {} again(); return; }
    b.disabled = false;
    try { toast(r && r.error === 'wait' ? T.wait(Math.max(1, Math.ceil((Date.parse(r.next_at) - Date.now()) / 36e5))) : T.err); } catch (e) {}
  };
}
new MutationObserver(() => { document.querySelectorAll('#burnb:not([data-done])').forEach(burnFill); }).observe(document.body, { childList: true, subtree: true });
// 17 oct 2026 (Jeremy): on the page of his own coin, the creator is pushed to get his friends to buy it: he earns his creator fee
// on every buy and every sale, and each buy raises the price. Empty #crsh in the page (data-t = ticker, data-f = creator fee %).
const CRSHT = {
  fr: { h: (t) => '📣 Fais acheter $' + t + ' à tes amis', s: (t, f) => 'Tu touches ' + f + ' % sur chaque achat et chaque vente de $' + t + ', et chaque achat fait monter le prix.', b: '📤 Partager mon coin', m: (t) => '🚀 Achète mon coin $' + t + ' sur Meme Coin Tycoon avant qu\'il décolle !' },
  id: { h: (t) => '📣 Ajak temanmu membeli $' + t, s: (t, f) => 'Kamu dapat ' + f + '% dari setiap beli dan jual $' + t + ', dan setiap pembelian menaikkan harga.', b: '📤 Bagikan koinku', m: (t) => '🚀 Beli koinku $' + t + ' di Meme Coin Tycoon sebelum terbang!' },
  ar: { h: (t) => '📣 اجعل أصدقاءك يشترون $' + t, s: (t, f) => 'تحصل على ' + f + '% من كل شراء وبيع لـ $' + t + '، وكل شراء يرفع السعر.', b: '📤 شارك عملتي', m: (t) => '🚀 اشترِ عملتي $' + t + ' في Meme Coin Tycoon قبل أن تنطلق!' },
  en: { h: (t) => '📣 Get your friends to buy $' + t, s: (t, f) => 'You earn ' + f + '% on every buy and every sale of $' + t + ', and every buy pushes the price up.', b: '📤 Share my coin', m: (t) => '🚀 Buy my coin $' + t + ' on Meme Coin Tycoon before it takes off!' },
};
function crshFill(el) {
  el.dataset.done = '1';
  const T = CRSHT[LANG] || CRSHT.en, tk = el.dataset.t || '', f = String(el.dataset.f || '0.5').replace('.', LANG === 'fr' ? ',' : '.');
  el.style.cssText = 'margin:12px 0 0;padding:12px 14px;border-radius:14px;border:1px solid #ffd43b;background:rgba(255,212,59,.08);text-align:center';
  el.innerHTML = '<b style="display:block;font-size:15px">' + T.h(tk) + '</b><small style="display:block;opacity:.85;margin:4px 0 10px;line-height:1.4">' + T.s(tk, f) + '</small><button class="btn" type="button" style="width:100%">' + T.b + '</button>';
  el.querySelector('button').onclick = () => {
    try { haptic(); } catch (e) {}
    let url = 'https://t.me/Memecointycoonbot?startapp=c_' + el.dataset.id;
    try { if (COIN && COIN.share) url = COIN.share; } catch (e) {}
    try { shareGame('coin', Number(el.dataset.id), url, T.m(tk)); } catch (e) { try { tw.openTelegramLink('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(T.m(tk))); } catch (x) {} }
  };
}
new MutationObserver(() => { document.querySelectorAll('#crsh:not([data-done])').forEach(crshFill); }).observe(document.body, { childList: true, subtree: true });
