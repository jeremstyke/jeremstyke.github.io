// 14 oct 2026: Meme Coin Tycoon, real USDT for referrals: a dedicated page (status, progress, TON wallet, how it works)
// and a banner to it at the top of the market (and in Earn). Served by the Supabase function mct-ton.
const TONF = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-ton';
const TONT = {
  id: { h: '💎 Dapatkan USDT asli', s: (u) => '$' + u + ' dalam USDT untuk setiap teman yang benar-benar bermain, plus $500 di game untukmu dan temanmu', v: 'Teman valid', p: 'Tertunda', r: 'Diterima', b: 'Saldo', mn: (m) => 'Dibayar mulai $' + m, togo: (x) => 'Kurang $' + x + ' sebelum pembayaranmu', ready: 'Siap: dibayar dalam 7 hari 🎉', wait: 'Sedang dibayar', w: 'Dompet TON-mu', ph: 'Tempel alamat TON-mu (UQ... atau EQ...)', save: 'Simpan', ok: 'Dompet tersimpan ✅', bad: 'Alamat TON tidak valid', chg: 'Ganti', nowal: 'Tambahkan dompetmu untuk dibayar 👇', inv: '👥 Undang temanku', invn: 'Setiap teman yang kamu undang dengan tombol ini dihitung untuk TON-mu, dan kalian berdua dapat $500 di game.', how: 'Cara kerjanya', st: (u, m, d) => ['👥 Undang temanmu dengan link-mu: kalian berdua langsung dapat $500 di game 🎁', '🎮 Mereka bermain: 5 transaksi dan bermain di 3 hari berbeda (dalam 30 hari)', '💎 Kamu dapat $' + u + ' dalam USDT asli per teman', '👛 Dibayar ke dompet TON-mu mulai $' + m + ', dalam ' + d + ' hari'], rule: 'Akun palsu atau ganda tidak pernah dibayar. Tanpa batas per pemain.', off: 'Anggaran bulan ini tercapai: hadiah TON kembali bulan depan.', back: '← Kembali', bh: '💵 Dapatkan USDT asli', bs: '$0.05 dalam USDT + $500 di game per teman · ketuk di sini' },
  en: { h: '💎 Earn real USDT', s: (u) => '$' + u + ' in USDT for every friend who really plays, plus $500 in the game for you and your friend', v: 'Valid friends', p: 'Pending', r: 'Received', b: 'Balance', mn: (m) => 'Paid from $' + m, togo: (x) => '$' + x + ' to go before your payment', ready: 'Ready: paid within 7 days 🎉', wait: 'Being paid', w: 'Your TON wallet', ph: 'Paste your TON address (UQ... or EQ...)', save: 'Save', ok: 'Wallet saved ✅', bad: 'Invalid TON address', chg: 'Change', nowal: 'Add your wallet to get paid 👇', inv: '👥 Invite my friends', invn: 'Every friend you invite with this button counts for your TON, and you both get $500 in the game.', how: 'How it works', st: (u, m, d) => ['👥 Invite your friends with your link: you both get $500 in the game right away 🎁', '🎮 They play: 5 trades and they play on 3 different days (within 30 days)', '💎 You earn $' + u + ' in real USDT per friend', '👛 Paid to your TON wallet from $' + m + ', within ' + d + ' days'], rule: 'Fake or duplicate accounts are never paid. No limit per player.', off: 'Budget of the month reached: TON rewards are back next month.', back: '← Back', bh: '💵 Earn real USDT', bs: '$0.05 in USDT + $500 in the game per friend · tap here' },
  fr: { h: '💎 Gagne de vrais USDT', s: (u) => u + ' $ en USDT par ami qui joue vraiment, et 500 $ dans le jeu pour toi et ton ami', v: 'Amis validés', p: 'En attente', r: 'Reçu', b: 'Solde', mn: (m) => 'Paiement dès ' + m + ' $', togo: (x) => 'Encore ' + x + ' $ avant ton paiement', ready: 'Prêt : paiement sous 7 jours 🎉', wait: 'En cours de paiement', w: 'Ton portefeuille TON', ph: 'Colle ton adresse TON (UQ... ou EQ...)', save: 'OK', ok: 'Portefeuille enregistré ✅', bad: 'Adresse TON invalide', chg: 'Changer', nowal: 'Ajoute ton portefeuille pour être payé 👇', inv: '👥 Inviter mes amis', invn: 'Chaque ami invité avec ce bouton compte pour tes TON, et vous recevez 500 $ chacun dans le jeu.', how: 'Comment ça marche', st: (u, m, d) => ['👥 Invite tes amis avec ton lien : vous gagnez tous les deux 500 $ dans le jeu tout de suite 🎁', '🎮 Ils jouent : 5 échanges et ils jouent 3 jours différents (dans les 30 jours)', '💎 Tu gagnes ' + u + ' $ en vrais USDT par ami', '👛 Paiement sur ton portefeuille TON dès ' + m + ' $, sous ' + d + ' jours'], rule: 'Les faux comptes et doublons ne sont jamais payés. Pas de limite par joueur.', off: 'Budget du mois atteint : les gains en USDT reprennent le mois prochain.', back: '← Retour', bh: '💵 Gagne de vrais USDT', bs: '0,05 $ en USDT + 500 $ dans le jeu par ami · appuie ici' },
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
  fr: { tot: 'Mon solde total', mct: '🪙 Meme Coin Tycoon', gp: '📚 GramPedia', ds: '⚽ Daily Score', earn: '💰 Bonus Earn', tap: '💎 Diamant', other: '🏆 Concours et bonus', here: 'ici', paid: 'Déjà reçu', wait: 'En cours de paiement', pay: (m) => 'Payé chaque lundi dès ' + m + ' sur ton portefeuille TON', nowal: '👛 Ajoute ton portefeuille dans Earn pour être payé', wal: '✅ Portefeuille ajouté', addw: '👛 Ajouter mon portefeuille', c: '🏆 Tes amis comptent aussi pour le concours de la semaine sur Earn by Jeremstyke : 1 $, 0,50 $ et 0,25 $ en USDT pour le top 3 chaque lundi, en plus de tes gains.', n: 'Ton portefeuille et tes paiements sont dans Earn by Jeremstyke.', my: '💰 Mes gains TON', close: 'Plus tard' },
  id: { tot: 'Total saldoku', mct: '🪙 Meme Coin Tycoon', gp: '📚 GramPedia', ds: '⚽ Daily Score', earn: '💰 Bonus Earn', tap: '💎 Berlian', other: '🏆 Kontes dan bonus', here: 'di sini', paid: 'Sudah diterima', wait: 'Sedang dibayar', pay: (m) => 'Dibayar setiap Senin mulai ' + m + ' ke dompet TON-mu', nowal: '👛 Tambahkan dompetmu di Earn untuk dibayar', wal: '✅ Dompet ditambahkan', addw: '👛 Tambahkan dompetku', c: '🏆 Temanmu juga dihitung di kontes mingguan Earn by Jeremstyke: $1, $0.50 dan $0.25 dalam USDT untuk 3 teratas setiap Senin, di luar penghasilanmu.', n: 'Dompet dan pembayaranmu ada di Earn by Jeremstyke.', my: '💰 Penghasilan TON-ku', close: 'Nanti' },
  en: { tot: 'My total balance', mct: '🪙 Meme Coin Tycoon', gp: '📚 GramPedia', ds: '⚽ Daily Score', earn: '💰 Earn bonus', tap: '💎 Diamond', other: '🏆 Contest and bonuses', here: 'here', paid: 'Already received', wait: 'Being paid', pay: (m) => 'Paid every Monday from ' + m + ' to your TON wallet', nowal: '👛 Add your wallet in Earn to get paid', wal: '✅ Wallet added', addw: '👛 Add my wallet', c: '🏆 Your friends also count in the weekly contest on Earn by Jeremstyke: $1, $0.50 and $0.25 in USDT for the top 3 every Monday, on top of your earnings.', n: 'Your wallet and your payouts are in Earn by Jeremstyke.', my: '💰 My TON earnings', close: 'Later' }
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
  return `<div style="margin:6px 0 12px;padding:12px;border-radius:14px;border:1px solid rgba(255,212,59,.45);background:rgba(255,212,59,.08)"><b style="display:block;font-size:15px;margin-bottom:4px">🏆 ${fr ? 'Concours de parrainage de la semaine' : 'Referral contest of the week'}</b><div style="font-size:13px;opacity:.85;margin-bottom:6px">${fr ? 'Les 3 meilleurs parrains gagnent ' : 'The top 3 inviters win '}<b>${pz.map((x) => M(x)).join(' / ')}</b> ${fr ? 'en USDT lundi, en plus de leurs gains.' : 'in USDT on Monday, on top of their earnings.'}</div>${cdBox(c.ends, fr)}${rows}${me}</div>`;
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
    // 17 oct 2026 (Jeremy): the other ways to earn, in the sheet: subscribe to @jeremstyke and Daily Score
    + `<div class="row"><button class="sec" id="tonjs" style="color:#7dff6b">📣 ${({ fr: '@jeremstyke : +0,01 $ / 30 j', id: '@jeremstyke: +$0.01 / 30 hari', ar: '@jeremstyke: +0.01 $ / 30 يومًا' })[LANG] || '@jeremstyke: +$0.01 / 30 days'}</button><button class="sec" id="tonds" style="color:#7dff6b">⚽ ${({ fr: 'Daily Score : pronos payés', id: 'Daily Score: prediksi dibayar', ar: 'Daily Score: توقعات مدفوعة' })[LANG] || 'Daily Score: paid predictions'}</button></div>`
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
  d.querySelector('#tonjs').onclick = () => { try { haptic(); } catch (x) {} gameOpen('https://t.me/jeremstyke'); };
  d.querySelector('#tonds').onclick = () => { try { haptic(); } catch (x) {} gameOpen('https://t.me/DailyScorefootbot/play?startapp=src_mctsheet'); };
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
  // 17 oct 2026 (Jeremy): like Daily Score, the banner shows the player's real earnings and everything he can earn (USDT, paid on Monday)
  const u = tonM((TONLAST && TONLAST.usd) || 0.05), W = ({
    fr: ['👥 Ami qui joue 3 jours : ' + u + ' + 500 $ dans le jeu', '💎 Tape le diamant : de l\'argent à chaque tape', '🏆 3 concours chaque semaine : 1 $, 0,50 $ et 0,25 $ le lundi'],
    id: ['👥 Teman yang bermain 3 hari: ' + u + ' + $500 di game', '💎 Ketuk berlian: uang di setiap ketukan', '🏆 3 kontes tiap minggu: $1, $0.50 dan $0.25 setiap Senin'],
    ar: ['👥 صديق يلعب 3 أيام: ' + u + ' + 500 $ في اللعبة', '💎 اضغط على الماسة: مال مع كل ضغطة', '🏆 3 مسابقات أسبوعيًا: 1 $ و0.50 $ و0.25 $ كل اثنين'],
  })[LANG] || ['👥 Friend who plays 3 days: ' + u + ' + $500 in the game', '💎 Tap the diamond: money on every tap', '🏆 3 contests every week: $1, $0.50 and $0.25 on Monday'];
  b.style.borderColor = '#7dff6b'; b.style.background = 'linear-gradient(135deg,rgba(125,255,107,.12),rgba(46,230,255,.06))';
  b.innerHTML = `<span class="med sm" style="--c:#7dff6b">💵</span><div class="who"><b style="white-space:normal">${L.bh}</b><small style="white-space:normal;font-weight:700">${TONLAST && TONLAST.ok ? tonMini(TONLAST) : L.bs}</small><small class="tonways" style="white-space:normal;display:block;margin-top:4px;line-height:1.5">${W.join('<br>')}</small><span class="tondia" style="display:inline-block;margin-top:6px;padding:4px 10px;border-radius:999px;background:rgba(46,230,255,.15);border:1px solid rgba(46,230,255,.5);color:#2ee6ff;font-size:12px;font-weight:800">💎 ${({ fr: 'Tape le diamant', id: 'Ketuk berlian', ar: 'اضغط على الماسة' })[LANG] || 'Tap the diamond'} ›</span></div><span class="chip up">USDT</span>`;
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
// and a link to Daily Score (where predictions also pay real USDT). A tap on the bar opens the USDT page.
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
      + '#usdtb .ubw{display:block;overflow:hidden;white-space:nowrap;font-size:12.5px;line-height:1.4;opacity:.9}#usdtb .ubw span{display:inline-block;padding-left:100%;animation:ubscroll 34s linear infinite}'
      + '@keyframes ubscroll{from{transform:translateX(0)}to{transform:translateX(-100%)}}'
      + '#usdtb .ubx{flex:none;width:36px;height:36px;border:0;border-radius:50%;font-size:18px;background:rgba(125,255,107,.18);cursor:pointer;padding:0}';
    document.head.appendChild(st);
  }
  const u = tonM((TONLAST && TONLAST.usd) || 0.05);
  const ways = ({
    fr: '👥 Ami qui joue 3 jours : ' + u + ' · 💎 Tape le diamant : de l\'argent à chaque tape · 🏆 Concours des gains : 1 $, 0,50 $ et 0,25 $ · 🏆 Concours des parrains : 1 $, 0,50 $ et 0,25 $ · 🏆 Concours du diamant : 1 $, 0,50 $ et 0,25 $ (les 3 payés chaque lundi) · 📣 Abonné à @jeremstyke : 0,01 $ tous les 30 jours · ⚽ Daily Score : tes pronos payés aussi · 💸 Payé en USDT chaque lundi',
    id: '👥 Teman yang bermain 3 hari: ' + u + ' · 💎 Ketuk berlian: uang di setiap ketukan · 🏆 Kontes keuntungan: $1, $0.50, $0.25 · 🏆 Kontes pengundang: $1, $0.50, $0.25 · 🏆 Kontes berlian: $1, $0.50, $0.25 (dibayar tiap Senin) · 📣 Langganan @jeremstyke: $0.01 tiap 30 hari · ⚽ Daily Score: prediksimu juga dibayar · 💸 Dibayar dalam USDT tiap Senin',
    ar: '👥 صديق يلعب 3 أيام: ' + u + ' · 💎 اضغط على الماسة: مال مع كل ضغطة · 🏆 مسابقة الأرباح: 1 $ و0.50 $ و0.25 $ · 🏆 مسابقة الداعين: 1 $ و0.50 $ و0.25 $ · 🏆 مسابقة الماسة: 1 $ و0.50 $ و0.25 $ (تُدفع كل اثنين) · 📣 اشترك في @jeremstyke: 0.01 $ كل 30 يومًا · ⚽ Daily Score: توقعاتك مدفوعة أيضًا · 💸 الدفع بعملة USDT كل اثنين',
  })[LANG] || '👥 Friend who plays 3 days: ' + u + ' · 💎 Tap the diamond: money on every tap · 🏆 Gains contest: $1, $0.50 and $0.25 · 🏆 Sponsor contest: $1, $0.50 and $0.25 · 🏆 Diamond contest: $1, $0.50 and $0.25 (all 3 paid every Monday) · 📣 Subscribed to @jeremstyke: $0.01 every 30 days · ⚽ Daily Score: your predictions pay too · 💸 Paid in USDT every Monday';
  const d = document.createElement('div'); d.id = 'usdtb';
  d.innerHTML = '<div class="ubi"><span style="font-size:22px">💵</span><div class="ubt"><b class="ubm"></b><span class="ubw"><span></span></span></div><span style="font-size:18px;opacity:.6">›</span></div>';
  d.querySelector('.ubm').textContent = usdtGain(); d.querySelector('.ubw span').textContent = ways;
  d.querySelector('.ubi').onclick = (e) => {
    try { haptic(); } catch (x) {}
    tonPage();
  };
  document.body.appendChild(d); document.body.classList.add('ub'); USDTB = d;
}
// the screens are rebuilt each time they open: add the banner as soon as its place appears
new MutationObserver(() => { tonPlace(); }).observe(document.body, { childList: true, subtree: true });
tonPlace();
