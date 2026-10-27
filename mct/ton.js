// 14 oct 2026: Meme Coin Tycoon, real TON for referrals: a dedicated page (status, progress, TON wallet, how it works)
// and a banner to it at the top of the market (and in Earn). Served by the Supabase function mct-ton.
// 19 oct 2026 (Jeremy): Persian and Russian (i18n.js) merged into L here, before the other modules add their own words to every language
try { const LL0 = (0, eval)('typeof L !== "undefined" ? L : null'); if (LL0 && window.MCT_I18N) Object.keys(window.MCT_I18N).forEach((k) => { if (!LL0[k]) LL0[k] = Object.assign({}, LL0.en || {}, window.MCT_I18N[k]); }); } catch (e) {}
const TONF = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-ton';
const TONT = {
  id: { h: '💎 Dapatkan TON asli', s: (u) => '$' + u + ' dalam TON untuk setiap teman yang benar-benar bermain, plus $500 di game untukmu dan temanmu', v: 'Teman valid', p: 'Tertunda', r: 'Diterima', b: 'Saldo', mn: (m) => 'Dibayar mulai $' + m, togo: (x) => 'Kurang $' + x + ' sebelum pembayaranmu', ready: 'Siap: dibayar dalam 24 jam 🎉', wait: 'Sedang dibayar', w: 'Dompet TON-mu', ph: 'Tempel alamat TON-mu (UQ... atau EQ...)', save: 'Simpan', ok: 'Dompet tersimpan ✅', bad: 'Alamat TON tidak valid', chg: 'Ganti', nowal: 'Tambahkan dompetmu untuk dibayar 👇', inv: '👥 Undang temanku', invn: 'Setiap teman yang kamu undang dengan tombol ini dihitung untuk TON-mu, dan kalian berdua dapat $500 di game.', how: 'Cara kerjanya', st: (u, m, d) => ['👥 Undang temanmu dengan link-mu: kalian berdua langsung dapat $500 di game 🎁', '🎮 Mereka bermain: 5 transaksi dan bermain di 3 hari berbeda (dalam 30 hari), atau 5 duel di MCT Duel', '💎 Kamu dapat $' + u + ' dalam TON asli per teman', '👛 Dibayar ke dompet TON-mu mulai $' + m + ', dalam ' + d + ' hari'], rule: 'Akun palsu atau ganda tidak pernah dibayar. Tanpa batas per pemain.', off: 'Anggaran bulan ini tercapai: hadiah TON kembali bulan depan.', back: '← Kembali', bh: '💵 Dapatkan TON asli', bs: '$0.05 dalam TON + $500 di game per teman · ketuk di sini' },
  fa: { h: '💎 TON واقعی به دست بیاور', s: (u) => u + ' دلار TON برای هر دوستی که واقعاً بازی کند، به‌علاوه 500 دلار در بازی برای تو و دوستت', v: 'دوستان تأییدشده', p: 'در انتظار', r: 'دریافت‌شده', b: 'موجودی', mn: (m) => 'پرداخت از ' + m + ' دلار', togo: (x) => x + ' دلار مانده تا پرداخت', ready: 'آماده: ظرف 24 ساعت پرداخت می‌شود 🎉', wait: 'در حال پرداخت', w: 'کیف پول TON تو', ph: 'آدرس TON را بچسبان (UQ... یا EQ...)', save: 'ذخیره', ok: 'کیف پول ذخیره شد ✅', bad: 'آدرس TON نامعتبر', chg: 'تغییر', nowal: 'کیف پولت را اضافه کن تا پرداخت بگیری 👇', inv: '👥 دعوت از دوستانم', invn: 'هر دوستی که با این دکمه دعوت کنی برای TON تو حساب می‌شود و هر دو 500 دلار در بازی می‌گیرید.', how: 'چطور کار می‌کند', st: (u, m, d) => ['👥 دوستانت را با لینکت دعوت کن: هر دو بلافاصله 500 دلار در بازی می‌گیرید 🎁', '🎮 آن‌ها بازی می‌کنند: 5 معامله و 3 روز مختلف بازی (ظرف 30 روز)، یا ۵ دوئل در MCT Duel', '💎 برای هر دوست ' + u + ' دلار TON واقعی می‌گیری', '👛 از ' + m + ' دلار به کیف پول TON تو پرداخت می‌شود، ظرف ' + d + ' روز'], rule: 'حساب‌های جعلی یا تکراری هرگز پرداخت نمی‌شوند. بدون سقف برای هر بازیکن.', off: 'بودجه ماه تمام شد: جوایز TON ماه بعد برمی‌گردند.', back: '→ بازگشت', bh: '💵 TON واقعی به دست بیاور', bs: '0.05 دلار TON + 500 دلار در بازی برای هر دوست · اینجا بزن' },
  ru: { h: '💎 Зарабатывай настоящие TON', s: (u) => '$' + u + ' в TON за каждого друга, который реально играет, плюс $500 в игре тебе и другу', v: 'Подтверждённые друзья', p: 'В ожидании', r: 'Получено', b: 'Баланс', mn: (m) => 'Выплата от $' + m, togo: (x) => 'До выплаты осталось $' + x, ready: 'Готово: выплата в течение 24 часов 🎉', wait: 'Выплачивается', w: 'Твой кошелёк TON', ph: 'Вставь адрес TON (UQ... или EQ...)', save: 'Сохранить', ok: 'Кошелёк сохранён ✅', bad: 'Неверный адрес TON', chg: 'Изменить', nowal: 'Добавь кошелёк, чтобы получать выплаты 👇', inv: '👥 Пригласить друзей', invn: 'Каждый друг, приглашённый этой кнопкой, засчитывается для твоих TON, и вы оба получаете $500 в игре.', how: 'Как это работает', st: (u, m, d) => ['👥 Пригласи друзей по своей ссылке: вы оба сразу получаете $500 в игре 🎁', '🎮 Они играют: 5 сделок и 3 разных дня (в течение 30 дней) или 5 дуэлей в MCT Duel', '💎 Ты получаешь $' + u + ' в настоящих TON за каждого друга', '👛 Выплата на кошелёк TON от $' + m + ', в течение ' + d + ' дней'], rule: 'Фейковые и повторные аккаунты никогда не оплачиваются. Без лимита на игрока.', off: 'Бюджет месяца исчерпан: награды TON вернутся в следующем месяце.', back: '← Назад', bh: '💵 Зарабатывай настоящие TON', bs: '$0.05 в TON + $500 в игре за друга · нажми здесь' },
  en: { h: '💎 Earn real TON', s: (u) => '$' + u + ' in TON for every friend who really plays, plus $500 in the game for you and your friend', v: 'Valid friends', p: 'Pending', r: 'Received', b: 'Balance', mn: (m) => 'Paid from $' + m, togo: (x) => '$' + x + ' to go before your payment', ready: 'Ready: paid within 24 hours 🎉', wait: 'Being paid', w: 'Your TON wallet', ph: 'Paste your TON address (UQ... or EQ...)', save: 'Save', ok: 'Wallet saved ✅', bad: 'Invalid TON address', chg: 'Change', nowal: 'Add your wallet to get paid 👇', inv: '👥 Invite my friends', invn: 'Every friend you invite with this button counts for your TON, and you both get $500 in the game.', how: 'How it works', st: (u, m, d) => ['👥 Invite your friends with your link: you both get $500 in the game right away 🎁', '🎮 They play: 5 trades and they play on 3 different days (within 30 days), or 5 duels in MCT Duel', '💎 You earn $' + u + ' in real TON per friend', '👛 Paid to your TON wallet from $' + m + ', within ' + d + ' days'], rule: 'Fake or duplicate accounts are never paid. No limit per player.', off: 'Budget of the month reached: TON rewards are back next month.', back: '← Back', bh: '💵 Earn real TON', bs: '$0.05 in TON + $500 in the game per friend · tap here' },
  fr: { h: '💎 Gagne de vrais TON', s: (u) => u + ' $ en TON par ami qui joue vraiment, et 500 $ dans le jeu pour toi et ton ami', v: 'Amis validés', p: 'En attente', r: 'Reçu', b: 'Solde', mn: (m) => 'Paiement dès ' + m + ' $', togo: (x) => 'Encore ' + x + ' $ avant ton paiement', ready: 'Prêt : paiement sous 24 h 🎉', wait: 'En cours de paiement', w: 'Ton portefeuille TON', ph: 'Colle ton adresse TON (UQ... ou EQ...)', save: 'OK', ok: 'Portefeuille enregistré ✅', bad: 'Adresse TON invalide', chg: 'Changer', nowal: 'Ajoute ton portefeuille pour être payé 👇', inv: '👥 Inviter mes amis', invn: 'Chaque ami invité avec ce bouton compte pour tes TON, et vous recevez 500 $ chacun dans le jeu.', how: 'Comment ça marche', st: (u, m, d) => ['👥 Invite tes amis avec ton lien : vous gagnez tous les deux 500 $ dans le jeu tout de suite 🎁', '🎮 Ils jouent : 5 échanges et ils jouent 3 jours différents (dans les 30 jours), ou 5 duels dans MCT Duel', '💎 Tu gagnes ' + u + ' $ en vrais TON par ami', '👛 Paiement sur ton portefeuille TON dès ' + m + ' $, sous ' + d + ' jours'], rule: 'Les faux comptes et doublons ne sont jamais payés. Pas de limite par joueur.', off: 'Budget du mois atteint : les gains en TON reprennent le mois prochain.', back: '← Retour', bh: '💵 Gagne de vrais TON', bs: '0,05 $ en TON + 500 $ dans le jeu par ami · appuie ici' },
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
// 27 oct 2026 (21h48, Jeremy): from Sunday 1 November (Paris) the green earnings bar becomes a $BATON bar, like Daily Score
function BTNOW() { return Date.now() >= 1793487600000; }
function tonOn() {
  if (!TONON) TONON = tonCall({}).then((s) => { TONLAST = s; return !!(s && s.ok && s.on); }).catch(() => { TONON = null; return false; });
  return TONON;
}
function tonBack() { try { tw.BackButton.hide(); tw.BackButton.offClick(tonBack); } catch (e) {} if (VIEW === 'ton') go('market'); }
// the dedicated page
// 15 oct 2026: like Daily Score, a sheet instead of a separate page, with the same live total balance in every app (Meme Coin Tycoon,
// GramPedia, Daily Score) and its detail per program. The wallet and the payouts are in Earn by Jeremstyke.
const TOND = {
  fr: { tot: 'Mon solde total', mct: '🪙 Meme Coin Tycoon', gp: '📚 GramPedia', ds: '⚽ Daily Score', earn: '💰 Bonus Earn', tap: '💎 Diamant', other: '🏆 Concours et bonus', here: 'ici', paid: 'Déjà reçu', wait: 'En cours de paiement', pay: (m) => 'Payé chaque jour dès ' + m + ' sur ton portefeuille TON', nowal: '👛 Ajoute ton portefeuille dans Earn pour être payé', wal: '✅ Portefeuille ajouté', addw: '👛 Ajouter mon portefeuille', c: '🏆 Tes amis comptent aussi pour le concours de la semaine sur Earn by Jeremstyke : 1 $, 0,50 $ et 0,25 $ en TON pour le top 3 chaque lundi, en plus de tes gains.', n: 'Ton portefeuille et tes paiements sont dans Earn by Jeremstyke.', my: '💰 Mes gains TON', close: 'Plus tard' },
  id: { tot: 'Total saldoku', mct: '🪙 Meme Coin Tycoon', gp: '📚 GramPedia', ds: '⚽ Daily Score', earn: '💰 Bonus Earn', tap: '💎 Berlian', other: '🏆 Kontes dan bonus', here: 'di sini', paid: 'Sudah diterima', wait: 'Sedang dibayar', pay: (m) => 'Dibayar setiap hari mulai ' + m + ' ke dompet TON-mu', nowal: '👛 Tambahkan dompetmu di Earn untuk dibayar', wal: '✅ Dompet ditambahkan', addw: '👛 Tambahkan dompetku', c: '🏆 Temanmu juga dihitung di kontes mingguan Earn by Jeremstyke: $1, $0.50 dan $0.25 dalam TON untuk 3 teratas setiap Senin, di luar penghasilanmu.', n: 'Dompet dan pembayaranmu ada di Earn by Jeremstyke.', my: '💰 Penghasilan TON-ku', close: 'Nanti' },
  en: { tot: 'My total balance', mct: '🪙 Meme Coin Tycoon', gp: '📚 GramPedia', ds: '⚽ Daily Score', earn: '💰 Earn bonus', tap: '💎 Diamond', other: '🏆 Contest and bonuses', here: 'here', paid: 'Already received', wait: 'Being paid', pay: (m) => 'Paid every day from ' + m + ' to your TON wallet', nowal: '👛 Add your wallet in Earn to get paid', wal: '✅ Wallet added', addw: '👛 Add my wallet', c: '🏆 Your friends also count in the weekly contest on Earn by Jeremstyke: $1, $0.50 and $0.25 in TON for the top 3 every Monday, on top of your earnings.', n: 'Your wallet and your payouts are in Earn by Jeremstyke.', my: '💰 My TON earnings', close: 'Later' }
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
  const t = fr ? { mine: 'Mes gains Meme Coin Tycoon', pend: 'En attente', need: (n) => n + (n > 1 ? ' amis doivent' : ' ami doit') + ' encore jouer', paid: 'Déjà reçu', wait: 'En cours de paiement', pay: (m) => 'Payé chaque jour sur ton portefeuille TON, dès ' + m + '', ok: '✅ Portefeuille ajouté', chg: 'Changer', add: '👛 Ajouter mon portefeuille', ph: 'Colle ton adresse TON (UQ... ou EQ...)', h1: 'Pas d\'adresse TON ? C\'est gratuit et ça prend 1 minute :', h2: 'Ouvre <b>@wallet</b> dans Telegram', h3: 'Touche <b>Recevoir</b>, puis <b>TON</b>', h4: 'Copie l\'adresse et colle-la ici', ow: 'Ouvrir @wallet', sync: '👛 Ton portefeuille TON, payé chaque jour dès 0,10 $.' }
    : (typeof LANG !== 'undefined' && LANG === 'id') ? { mine: 'Penghasilan Meme Coin Tycoon-ku', pend: 'Tertunda', need: (n) => n + ' teman masih harus bermain', paid: 'Sudah diterima', wait: 'Sedang dibayar', pay: (m) => 'Dibayar setiap hari ke dompet TON-mu, mulai ' + m + '', ok: '✅ Dompet ditambahkan', chg: 'Ganti', add: '👛 Tambahkan dompetku', ph: 'Tempel alamat TON-mu (UQ... atau EQ...)', h1: 'Belum punya alamat TON? Gratis dan hanya 1 menit:', h2: 'Buka <b>@wallet</b> di Telegram', h3: 'Ketuk <b>Terima</b>, lalu <b>TON</b>', h4: 'Salin alamatnya dan tempel di sini', ow: 'Buka @wallet', sync: '👛 Dompet TON-mu, dibayar setiap hari mulai $0.10.' } // 16 oct 2026: Indonesian
    : { mine: 'My Meme Coin Tycoon earnings', pend: 'Pending', need: (n) => n + (n > 1 ? ' friends' : ' friend') + ' still to play', paid: 'Already received', wait: 'Being paid', pay: (m) => 'Paid every day to your TON wallet, from ' + m + '', ok: '✅ Wallet added', chg: 'Change', add: '👛 Add my wallet', ph: 'Paste your TON address (UQ... or EQ...)', h1: 'No TON address? It\'s free and takes 1 minute:', h2: 'Open <b>@wallet</b> in Telegram', h3: 'Tap <b>Receive</b>, then <b>TON</b>', h4: 'Copy the address and paste it here', ow: 'Open @wallet', sync: '👛 Your TON wallet, paid every day from $0.10.' };
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
  const me = c.me && c.me.rank ? `<div style="font-size:13px;margin-top:6px">${fr ? 'Ta place' : 'Your rank'} : <b>#${c.me.rank}</b> · ${c.me.n} ${fr ? 'ami(s)' : 'friend(s)'}</div>` : c.me && c.me.need > 0 ? `<div style="font-size:13px;margin-top:6px">${fr ? 'Tu as ' + c.me.n + ' ami(s) validé(s) : encore ' + c.me.need + ' pour entrer au classement' : 'You have ' + c.me.n + ' validated friend(s): ' + c.me.need + ' more to enter the ranking'}</div>` : ''; // 19 oct 2026 (Jeremy): the minimum is shown, and what is missing
  return `<div style="margin:6px 0 12px;padding:12px;border-radius:14px;border:1px solid rgba(255,212,59,.45);background:rgba(255,212,59,.08)"><b style="display:block;font-size:15px;margin-bottom:4px">🏆 ${fr ? 'Concours de parrainage de la semaine' : 'Referral contest of the week'}</b><div style="font-size:13px;opacity:.85;margin-bottom:6px">${fr ? 'Les 3 meilleurs parrains gagnent ' : 'The top 3 inviters win '}<b>${pz.map((x) => M(x)).join(' / ')}</b> ${fr ? 'en TON lundi, en plus de leurs gains.' : 'in TON on Monday, on top of their earnings.'}</div><div style="font-size:12px;opacity:.8;margin-bottom:6px">✅ ${fr ? 'Minimum ' + (c.min || 2) + ' amis validés dans la semaine pour être classé et gagner' : 'At least ' + (c.min || 2) + ' validated friends this week to be ranked and win'}</div>${cdBox(c.ends, fr)}${rows}${me}</div>`;
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
// 19 oct 2026 (Jeremy): special week ($0.10 per friend instead of $0.05): the game says it is for this week only
const tonPromo = (s) => s && s.promo_until && Date.parse(s.promo_until) > Date.now() ? (({ fr: '🔥 Cette semaine seulement (jusqu\'à dimanche minuit), puis 0,05 $', ar: '🔥 هذا الأسبوع فقط (حتى منتصف ليل الأحد)، ثم 0.05 $', id: '🔥 Hanya minggu ini (sampai Minggu tengah malam), lalu $0.05' })[LANG] || '🔥 This week only (until Sunday midnight), then $0.05') : '';
// 19 oct 2026 (Jeremy): a player caught cheating (s.banned) sees that he is excluded from payments
const tonBan = (s) => s && s.banned ? '<div style="margin:0 0 12px;padding:11px 13px;border-radius:14px;background:rgba(255,59,92,.14);border:1px solid rgba(255,59,92,.55);color:#ff8fa3;font-weight:700;font-size:13.5px;line-height:1.4">' + (({ fr: '🚫 Tu es exclu des paiements : notre anti-triche a détecté un bot ou un autoclicker. Tu ne recevras plus aucun paiement de notre part (amis, diamant, concours).', ar: '🚫 أنت مستبعد من المدفوعات: اكتشف نظام مكافحة الغش لدينا روبوتًا أو نقرًا آليًا. لن تتلقى أي دفعات منا بعد الآن (الأصدقاء، الماسة، المسابقات).', id: '🚫 Kamu dikeluarkan dari pembayaran: sistem anti-curang kami mendeteksi bot atau autoclicker. Kamu tidak akan menerima pembayaran lagi dari kami (teman, berlian, kontes).' })[LANG] || '🚫 You are excluded from payments: our anti-cheat detected a bot or an autoclicker. You will not receive any more payments from us (friends, diamond, contests).') + '</div>' : '';
// 21 oct 2026 (Jeremy): the public payment proofs (every TON payout, checkable on Tonviewer; Adsgram asked for them), opened inside the game
const MCTPRF = { fr: ['💸 Preuves de paiement : tous les paiements envoyés', 'Voir'], fa: ['💸 اثبات پرداخت: همه پرداخت‌های ارسال‌شده', 'دیدن'], ru: ['💸 Доказательства выплат: все отправленные выплаты', 'Смотреть'], id: ['💸 Bukti pembayaran: semua pembayaran terkirim', 'Lihat'], ar: ['💸 إثباتات الدفع: كل المدفوعات المرسلة', 'عرض'], es: ['💸 Pruebas de pago: todos los pagos enviados', 'Ver'] };
window.mctProofs = function () {
  try { haptic(); } catch (e) {}
  const d = document.createElement('div'); d.style.cssText = 'position:fixed;inset:0;z-index:100000;background:#1a0638;display:flex;flex-direction:column';
  d.innerHTML = '<div style="display:flex;justify-content:flex-end;padding:8px 10px"><button style="border:0;border-radius:999px;padding:8px 14px;font-weight:800;background:#fff;color:#111;cursor:pointer">✕</button></div><iframe src="/mct/proofs" style="flex:1;border:0;width:100%"></iframe>';
  d.querySelector('button').onclick = () => d.remove(); document.body.appendChild(d);
};
// 21 oct 2026 (Jeremy): links t.me/Memecointycoonbot?startapp=proofs (channel posts) open the payment proofs right away
try { const sp0 = String((window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.start_param) || ''); if (sp0 === 'proofs') setTimeout(() => window.mctProofs(), 2500); } catch (e) {}
function earnAllHtml(s) {
  const u = tonM(s.usd || 0.05), m = tonM(s.min || 0.1), K = (a, b, c) => tonM(a) + ', ' + tonM(b) + (LANG === 'fr' ? ' et ' : ' and ') + tonM(c);
  const T = ({
    fr: { h: '💵 Tout ce que tu peux gagner', f: '👥 Parrainage : ' + u + ' par ami qui joue 3 jours (+ 500 $ chacun dans le jeu)', d: '💎 Tape le diamant : de l\'argent à chaque tape', cg: '🏆 Concours des gains : ', cp: '🏆 Concours des parrains : ', cd: '🏆 Concours du diamant : ', wk: ' chaque lundi', js: '📣 Abonne-toi à @jeremstyke : 0,01 $ tout de suite, puis tous les 30 jours', mc: '📣 Abonne-toi à @memecointycoon : 0,01 $ tout de suite, puis tous les 30 jours', jb: 'S\'abonner', ok: 'tu es abonné 👍', cb: 'Classements', ds: '⚽ Daily Score : mon autre jeu, un prono foot gratuit par jour', db: 'Jouer', pay: '💸 Payé chaque jour en TON, dès ' + m },
    fa: { h: '💵 همه چیزهایی که می‌توانی به دست بیاوری', f: '👥 دعوت: ' + u + ' برای هر دوستی که 3 روز بازی کند (+ 500 دلار برای هر کدام در بازی)', d: '💎 به الماس ضربه بزن: پول با هر ضربه', cg: '🏆 مسابقه سود: ', cp: '🏆 مسابقه دعوت‌کنندگان: ', cd: '🏆 مسابقه الماس: ', wk: ' هر دوشنبه', js: '📣 در @jeremstyke عضو شو: 0.01 دلار همین حالا، بعد هر 30 روز', mc: '📣 در @memecointycoon عضو شو: 0.01 دلار همین حالا، بعد هر 30 روز', jb: 'عضویت', ok: 'عضو هستی 👍', cb: 'رتبه‌بندی', ds: '⚽ Daily Score: بازی دیگر من، روزی یک پیش‌بینی فوتبال رایگان', db: 'بازی', pay: '💸 هر روز با TON پرداخت می‌شود، از ' + m },
    ru: { h: '💵 Всё, что можно заработать', f: '👥 Рефералы: ' + u + ' за друга, который играет 3 дня (+ $500 каждому в игре)', d: '💎 Нажимай на алмаз: деньги за каждое нажатие', cg: '🏆 Конкурс прибыли: ', cp: '🏆 Конкурс рефереров: ', cd: '🏆 Конкурс алмаза: ', wk: ' каждый понедельник', js: '📣 Подпишись на @jeremstyke: $0.01 сразу, потом каждые 30 дней', mc: '📣 Подпишись на @memecointycoon: $0.01 сразу, потом каждые 30 дней', jb: 'Подписаться', ok: 'ты подписан 👍', cb: 'Рейтинги', ds: '⚽ Daily Score: моя другая игра, один бесплатный футбольный прогноз в день', db: 'Играть', pay: '💸 Выплаты каждый день в TON, от ' + m },
    id: { h: '💵 Semua yang bisa kamu dapatkan', f: '👥 Undang teman: ' + u + ' per teman yang bermain 3 hari (+ $500 di game)', d: '💎 Ketuk berlian: uang di setiap ketukan', cg: '🏆 Kontes keuntungan: ', cp: '🏆 Kontes pengundang: ', cd: '🏆 Kontes berlian: ', wk: ' tiap Senin', js: '📣 Langganan @jeremstyke: $0.01 langsung, lalu tiap 30 hari', mc: '📣 Langganan @memecointycoon: $0.01 langsung, lalu tiap 30 hari', jb: 'Langganan', ok: 'kamu sudah berlangganan 👍', cb: 'Peringkat', ds: '⚽ Daily Score: game saya yang lain, satu prediksi bola gratis tiap hari', db: 'Main', pay: '💸 Dibayar tiap hari dalam TON, mulai ' + m },
  })[LANG] || { h: '💵 Everything you can earn', f: '👥 Referral: ' + u + ' per friend who plays 3 days (+ $500 each in the game)', d: '💎 Tap the diamond: money on every tap', cg: '🏆 Gains contest: ', cp: '🏆 Sponsor contest: ', cd: '🏆 Diamond contest: ', wk: ' every Monday', js: '📣 Subscribe to @jeremstyke: $0.01 right away, then every 30 days', mc: '📣 Subscribe to @memecointycoon: $0.01 right away, then every 30 days', jb: 'Subscribe', ok: 'you are subscribed 👍', cb: 'Rankings', ds: '⚽ Daily Score: my other game, one free football prediction a day', db: 'Play', pay: '💸 Paid every day in TON, from ' + m };
  const row = (t, btn, id) => `<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-top:1px solid rgba(255,255,255,.07);font-size:13.5px;line-height:1.35"><span style="flex:1">${t}</span>${btn ? `<button id="${id}" style="flex:none;border:0;border-radius:999px;padding:6px 12px;font-weight:800;font-size:12px;background:#7dff6b;color:#10200f;cursor:pointer">${btn}</button>` : ''}</div>`;
  return tonBan(s) + `<div style="margin:0 0 14px;padding:12px 14px;border-radius:16px;border:1px solid rgba(125,255,107,.45);background:rgba(125,255,107,.07)"><b style="display:block;font-size:15px;margin-bottom:4px">${T.h}</b>`
    + row(T.f + (tonPromo(s) ? '<br><b style="color:#ffd43b">' + tonPromo(s) + '</b>' : '')) + row(T.d) + row(T.cg + K(1, 0.5, 0.25) + T.wk) + row(T.cp + K(1, 0.5, 0.25) + T.wk) + row(T.cd + K(1, 0.5, 0.25) + T.wk, T.cb, 'tonrk')
    // 17 oct 2026: already subscribed: it says so (no button)
    + (s.sub ? row('✅ ' + T.js.replace(/^📣 /, '') + ' · ' + T.ok) : row(T.js, T.jb, 'tonjs'))
    + (s.subm ? row('✅ ' + T.mc.replace(/^📣 /, '') + ' · ' + T.ok) : row(T.mc, T.jb, 'tonmc')) + row(T.pay) + row((MCTPRF[LANG] || ['💸 Payment proofs: every payout sent', 'See'])[0], (MCTPRF[LANG] || ['', 'See'])[1], 'tonpf') + `</div>`;
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
  d.innerHTML = `<div class="tsx"><div class="grab"></div>` + tonBan(s)
    + `<div class="hero"><div class="ic">💎</div><div><b>${L.h.replace(/^💎 /, '')}</b><span>${LANG === 'fr' ? tonF2(s.usd) + ' $ / ami' : '$' + tonF2(s.usd) + ' / friend'}</span>${tonPromo(s) ? '<small style="display:block;margin-top:6px;color:#ffd43b;font-weight:700;font-size:12.5px;line-height:1.3">' + tonPromo(s) + '</small>' : ''}</div></div>`
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
  const tpf = d.querySelector('#tonpf'); if (tpf) tpf.onclick = () => { window.mctProofs(); };
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
// 18 oct 2026 (Jeremy): the bar follows the player's language (it kept the language it was built in when he changed it)
const usdtGain = () => BTNOW() ? (({ fr: 'Mes gains : ', id: 'Penghasilanku: ', ar: 'أرباحي: ' })[LANG] || 'My earnings: ') + Number((TONLAST && TONLAST.bt) || 0).toLocaleString(LANG === 'fr' ? 'fr-FR' : 'en-US') + ' $BATON' : TONLAST && TONLAST.ok ? (({ fr: 'Mes gains : ', id: 'Penghasilanku: ', ar: 'أرباحي: ' })[LANG] || 'My earnings: ') + tonM(Number(TONLAST.balance || 0) + Number(TONLAST.paid || 0) + Number(TONLAST.waiting || 0)) : tonL().bh.replace(/^💵 /, '');
function usdtWays() {
  if (BTNOW()) return ({
    fr: '🎯 Mission partenaire : +1 000 $BATON · 👥 Ami invité : +10 000 $BATON · 🏆 Concours de la semaine : jusqu\'à 400 000 $BATON · 💵 1 million de $BATON = 1 $ en USDT sur Pass The Baton · Touche ici pour les récupérer',
    id: '🎯 Misi partner: +1.000 $BATON · 👥 Teman diundang: +10.000 $BATON · 🏆 Kontes mingguan: hingga 400.000 $BATON · 💵 1 juta $BATON = $1 dalam USDT di Pass The Baton · Ketuk di sini untuk mengambilnya',
    ar: '🎯 مهمة الشريك: \u200e+1,000 $BATON · 👥 صديق مدعو: \u200e+10,000 $BATON · 🏆 مسابقة الأسبوع: حتى 400,000 $BATON · 💵 مليون $BATON = 1 $ USDT على Pass The Baton · اضغط هنا لاستلامها',
  })[LANG] || '🎯 Partner mission: +1,000 $BATON · 👥 Invited friend: +10,000 $BATON · 🏆 Weekly contest: up to 400,000 $BATON · 💵 1 million $BATON = $1 in USDT on Pass The Baton · Tap here to collect them';
  const u = tonM((TONLAST && TONLAST.usd) || 0.05);
  // 19 oct 2026 (Jeremy): a player caught cheating sees, in the scrolling bar, that he is excluded from payments
  if (TONLAST && TONLAST.banned) return ({ fr: '🚫 Tu es exclu des paiements : notre anti-triche a détecté un bot ou un autoclicker. Tu ne recevras plus aucun paiement de notre part (amis, diamant, concours).', ar: '🚫 أنت مستبعد من المدفوعات: اكتشف نظام مكافحة الغش لدينا روبوتًا أو نقرًا آليًا. لن تتلقى أي دفعات منا بعد الآن (الأصدقاء، الماسة، المسابقات).', id: '🚫 Kamu dikeluarkan dari pembayaran: sistem anti-curang kami mendeteksi bot atau autoclicker. Kamu tidak akan menerima pembayaran lagi dari kami (teman, berlian, kontes).' })[LANG] || '🚫 You are excluded from payments: our anti-cheat detected a bot or an autoclicker. You will not receive any more payments from us (friends, diamond, contests).';
  return ({
    fr: '👥 Parrainage : ' + u + ' par ami qui joue 3 jours (+ 500 $ chacun dans le jeu) · 💎 Tape le diamant : de l\'argent à chaque tape · 🏆 Concours des gains : 1 $, 0,50 $ et 0,25 $ · 🏆 Concours des parrains : 1 $, 0,50 $ et 0,25 $ · 🏆 Concours du diamant : 1 $, 0,50 $ et 0,25 $ (les 3 payés chaque lundi) · 📣 Abonné à @jeremstyke et à @memecointycoon : 0,01 $ chacun tout de suite, puis tous les 30 jours · 💸 Payé en TON chaque jour',
    id: '👥 Undang teman: ' + u + ' per teman yang bermain 3 hari (+ $500 di game) · 💎 Ketuk berlian: uang di setiap ketukan · 🏆 Kontes keuntungan: $1, $0.50, $0.25 · 🏆 Kontes pengundang: $1, $0.50, $0.25 · 🏆 Kontes berlian: $1, $0.50, $0.25 (dibayar tiap Senin) · 📣 Langganan @jeremstyke dan @memecointycoon: masing-masing $0.01 langsung, lalu tiap 30 hari · 💸 Dibayar dalam TON tiap hari',
    ar: '👥 الإحالة: ' + u + ' عن كل صديق يلعب 3 أيام (+ 500 $ في اللعبة) · 💎 اضغط على الماسة: مال مع كل ضغطة · 🏆 مسابقة الأرباح: 1 $ و0.50 $ و0.25 $ · 🏆 مسابقة الداعين: 1 $ و0.50 $ و0.25 $ · 🏆 مسابقة الماسة: 1 $ و0.50 $ و0.25 $ (تُدفع كل اثنين) · 📣 اشترك في @jeremstyke و@memecointycoon: 0.01 $ لكل منهما فورًا ثم كل 30 يومًا · 💸 الدفع بعملة TON كل يوم',
  })[LANG] || '👥 Referral: ' + u + ' per friend who plays 3 days (+ $500 each in the game) · 💎 Tap the diamond: money on every tap · 🏆 Gains contest: $1, $0.50 and $0.25 · 🏆 Sponsor contest: $1, $0.50 and $0.25 · 🏆 Diamond contest: $1, $0.50 and $0.25 (all 3 paid every Monday) · 📣 Subscribed to @jeremstyke and @memecointycoon: $0.01 each right away, then every 30 days · 💸 Paid in TON every day';
}
// 18 oct 2026 (Jeremy): the top diamond button is hidden from the very start (it used to show a few seconds at launch,
// until the earnings bar was ready); it comes back only if the earnings bar cannot show
(() => { try { const st = document.createElement('style'); st.id = 'diahide'; st.textContent = '#diatop{display:none!important}'; document.head.appendChild(st); } catch (e) {} })();
const diaShow = () => { const h = document.getElementById('diahide'); if (h) h.remove(); };
async function usdtBar() {
  if (!tw || !tw.initData) return diaShow();
  if (USDTB && document.body.contains(USDTB)) {
    const m = USDTB.querySelector('.ubm'); if (m && m.textContent !== usdtGain()) m.textContent = usdtGain();
    if (USDTB.dataset.l !== LANG) { USDTB.dataset.l = LANG; const w = USDTB.querySelector('.ubw span'); if (w) w.textContent = usdtWays(); }
    return;
  }
  if (USDTB === false) return;
  USDTB = false;
  if (!(await tonOn()) && !(BTNOW() && TONLAST && TONLAST.ok)) { USDTB = null; diaShow(); return; }
  if (!document.getElementById('usdtst')) {
    const st = document.createElement('style'); st.id = 'usdtst';
    st.textContent = 'body.ub{padding-bottom:calc(var(--tab) + 24px + 64px + env(safe-area-inset-bottom))!important}'
      + '#usdtb{position:fixed;left:0;right:0;bottom:calc(var(--tab) + env(safe-area-inset-bottom));z-index:9;max-width:520px;margin:0 auto;padding:0 10px 5px;box-sizing:border-box}'
      + '#usdtb .ubi{display:flex;align-items:center;gap:8px;height:54px;padding:0 8px 0 12px;border-radius:14px;border:1px solid rgba(125,255,107,.5);background:linear-gradient(135deg,rgba(24,40,30,.97),rgba(18,22,44,.97));box-shadow:0 -4px 14px rgba(0,0,0,.3);cursor:pointer;box-sizing:border-box}'
      + '#usdtb .ubt{flex:1;min-width:0;overflow:hidden}#usdtb b{display:block;font-size:14px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      + '#usdtb .ubw{display:block;overflow:hidden;white-space:nowrap;font-size:12.5px;line-height:1.4;opacity:.9}#usdtb .ubw span{display:inline-block;padding-left:100%;animation:ubscroll 70s linear infinite}'
      + '#usdtb.ban .ubi{border-color:rgba(255,59,92,.65);background:linear-gradient(135deg,rgba(60,16,26,.97),rgba(18,22,44,.97))}#usdtb.ban .ubw{color:#ff8fa3;font-weight:700}#usdtb.ban .ubw span{animation-duration:30s}'
      + '@keyframes ubscroll{from{transform:translateX(0)}to{transform:translateX(-100%)}}'
      + '#diatop{display:none!important}' // 17 oct 2026: the diamond is opened from the earnings bar now
      + '#usdtb .ubx{flex:none;width:36px;height:36px;border:0;border-radius:50%;font-size:18px;background:rgba(125,255,107,.18);cursor:pointer;padding:0}';
    document.head.appendChild(st);
  }
  const d = document.createElement('div'); d.id = 'usdtb';
  // 17 oct 2026 (Jeremy, 23h): the diamond moves from the top bar to this bar (the clans take its place at the top)
  d.innerHTML = '<div class="ubi"><span style="font-size:22px">💵</span><div class="ubt"><b class="ubm"></b><span class="ubw"><span></span></span></div><button class="ubx ubd" type="button" aria-label="Diamond" style="background:rgba(46,230,255,.18);border:1px solid rgba(46,230,255,.5)">💎</button></div>';
  if (BTNOW()) d.innerHTML = '<div class="ubi" style="border-color:rgba(80,160,255,.6);background:linear-gradient(135deg,rgba(20,40,90,.97),rgba(18,22,44,.97))"><span style="font-size:22px">🏃</span><div class="ubt"><b class="ubm"></b><span class="ubw"><span></span></span></div><span class="ubx" style="display:grid;place-items:center;background:rgba(47,141,255,.25);border:1px solid rgba(80,160,255,.6)">›</span></div>';
  d.querySelector('.ubm').textContent = usdtGain(); d.querySelector('.ubw span').textContent = usdtWays(); d.dataset.l = LANG; if (TONLAST && TONLAST.banned && !BTNOW()) d.classList.add('ban');
  d.querySelector('.ubi').onclick = (e) => {
    try { haptic(); } catch (x) {}
    if (e && e.target && e.target.closest && e.target.closest('.ubd')) { const g = document.getElementById('diatop'); if (g) g.click(); return; }
    if (BTNOW()) { const u = 'https://t.me/PassTheBatonBot/play?startapp=src_mctbar'; try { tw.openTelegramLink(u); } catch (x) { location.href = u; } return; }
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
  fa: { go: 'سوزاندن', free: 'رایگان (پریمیوم)', wait: (h) => 'امروز سوزانده شده · سوزاندن بعدی تا ' + h + ' ساعت', prem: '💎 با پریمیوم هفته‌ای یک بار رایگان', x: '5% از کوین‌های در گردش را از بین می‌برد: قیمت برای همه دارندگان 5% بالا می‌رود.', done: '🔥 کوین سوزانده شد: +5%!', paid: '🔥 پرداخت دریافت شد، کوین در حال سوختن است…', err: 'مشکلی پیش آمد، دوباره امتحان کن.' },
  ru: { go: 'Сжечь', free: 'бесплатно (Премиум)', wait: (h) => 'Уже сожжено сегодня · следующее сжигание через ' + h + ' ч', prem: '💎 Бесплатно раз в неделю с Премиум', x: 'Уничтожает 5% монет в обороте: цена растёт на 5% для всех держателей.', done: '🔥 Монета сожжена: +5%!', paid: '🔥 Оплата получена, монета сгорает…', err: 'Что-то пошло не так, попробуй ещё раз.' },
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
  fa: { h: (t) => '📣 کاری کن دوستانت $' + t + ' بخرند', s: (t, f) => 'از هر خرید و فروش $' + t + ' ' + f + '% می‌گیری، و هر خرید قیمت را بالا می‌برد.', b: '📤 اشتراک کوین من', m: (t) => '🚀 کوین من $' + t + ' را در Meme Coin Tycoon بخر قبل از اینکه اوج بگیرد!' },
  ru: { h: (t) => '📣 Пусть друзья купят $' + t, s: (t, f) => 'Ты получаешь ' + f + '% с каждой покупки и продажи $' + t + ', а каждая покупка поднимает цену.', b: '📤 Поделиться монетой', m: (t) => '🚀 Купи мою монету $' + t + ' в Meme Coin Tycoon, пока она не взлетела!' },
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
// 19 oct 2026 (Jeremy): the position card and the sale estimate showed the value at the current price, before the price impact
// of the sale, the 2 % burn, the blockchain fee and the creator fee: a player could see a gain and lose money when selling.
// Both now show what the sale would really bring (same formula as the server, mct_sell), and the real result against the cost.
(() => {
  const TX = ({
    fr: { net: (m) => 'Tu recevras ≈ ' + m + ' après frais', res: 'résultat', pos: 'si tu vends tout maintenant, frais inclus' },
    fa: { net: (m) => 'حدود ' + m + ' پس از کارمزد دریافت می‌کنی', res: 'نتیجه', pos: 'اگر همین حالا همه را بفروشی، با کارمزد' },
    ru: { net: (m) => 'Ты получишь ≈ ' + m + ' после комиссий', res: 'итог', pos: 'если продать всё сейчас, с учётом комиссий' },
    id: { net: (m) => 'Kamu akan menerima ≈ ' + m + ' setelah fee', res: 'hasil', pos: 'jika kamu jual semua sekarang, termasuk fee' },
    ar: { net: (m) => 'ستحصل على ≈ ' + m + ' بعد الرسوم', res: 'النتيجة', pos: 'إذا بعت الكل الآن، شاملة الرسوم' },
  });
  const tx = () => TX[LANG] || { net: (m) => 'You will get ≈ ' + m + ' after fees', res: 'result', pos: 'if you sell everything now, fees included' };
  const netOf = (c, q) => {
    if (!(q > 0)) return 0;
    let g;
    if (c.real) g = q * c.price * (c.id === 102 ? 0.98 : 0.995);
    else { const sold = soldOf(c), hy = c.hype || 1, qs = Math.min(q, sold) * 0.98; g = (P0 * qs + A * (2 * sold * qs - qs * qs) / 2) * hy; }
    if (c.chain && c.chain.fee) g -= g * Number(c.chain.fee) / 100;
    if (!c.real && !c.mine) g -= g * Number(c.cfee ?? 0.5) / 100;
    return Math.max(0, g);
  };
  const qOfGross = (c, hold, v) => {
    if (c.real) return Math.min(hold.qty, v / (c.price * (c.id === 102 ? 0.98 : 0.995)));
    const sold = soldOf(c), hy = c.hype || 1, bb = P0 + A * sold, d = bb * bb - 2 * A * v / hy;
    return d <= 0 ? hold.qty : Math.min(hold.qty, (bb - Math.sqrt(d)) / A / 0.98);
  };
  let busy = false;
  const fix = () => {
    busy = false;
    let cc, hold;
    try { if (typeof COIN === 'undefined' || !COIN || !COIN.coin || !COIN.hold) return; cc = COIN.coin; hold = COIN.hold; } catch (e) { return; }
    if (!(Number(hold.qty) > 0)) return;
    const cost = Number(hold.cost || 0);
    // the position card: real value if everything is sold now
    const pos = document.querySelector('.pos.num');
    if (pos && pos.children[0] && pos.children[0].textContent.indexOf('$' + cc.ticker) >= 0) {
      const box = pos.children[1], b = box && box.querySelector('b'), dv = box && box.querySelector('div');
      if (b && dv) {
        const net = netOf(cc, Number(hold.qty)), t1 = money(net), t2 = smoney(net - cost), cl = net >= cost ? 'up' : 'down';
        if (b.textContent !== t1) b.textContent = t1;
        if (dv.textContent !== t2) dv.textContent = t2;
        if (dv.className !== cl) dv.className = cl;
        let n = box.querySelector('.netn');
        if (!n) { n = document.createElement('small'); n.className = 'netn'; n.style.cssText = 'display:block;font-size:11px;opacity:.65;margin-top:2px'; box.appendChild(n); }
        if (n.textContent !== tx().pos) n.textContent = tx().pos;
      }
    }
    // the sale estimate: what the player will really get, and the result
    const es = document.getElementById('es'), sa = document.getElementById('sa');
    if (es && sa && document.getElementById('dosell')) {
      const v = parseFloat(String(sa.value).replace(',', '.')) || 0, q = v > 0 ? qOfGross(cc, hold, v) : 0;
      let w = document.getElementById('esnet');
      if (!w) { w = document.createElement('div'); w.id = 'esnet'; w.className = 'num'; w.style.cssText = 'font-size:13px;font-weight:700;margin:-4px 0 10px;text-align:center'; es.after(w); }
      if (!(q > 0)) { if (w.textContent) w.textContent = ''; return; }
      const net = netOf(cc, q), part = cost * q / Number(hold.qty), r = net - part;
      const txt = tx().net(money(net)) + ' · ' + tx().res + ' ' + smoney(r);
      if (w.textContent !== txt) w.textContent = txt;
      const col = r >= 0 ? '#7dff6b' : '#ff6b81'; if (w.style.color !== col) w.style.color = col;
    }
  };
  new MutationObserver(() => { if (!busy) { busy = true; requestAnimationFrame(fix); } }).observe(document.body, { childList: true, subtree: true, characterData: true });
  document.addEventListener('input', (e) => { if (e.target && e.target.id === 'sa') { busy = true; requestAnimationFrame(fix); } }, true);
})();
// 19 oct 2026 (Jeremy): the portfolio ("Net worth", each coin, gains / losses) counted the coins at the current price. Now each coin is
// counted at what selling it now would really bring, computed by the server exactly like a sale (mct-fr 'liq' = mct_liq): one request more
// when the portfolio opens, sent at the same time as the others.
(() => {
  if (typeof api !== 'function' || api.__liq) return;
  const orig = api;
  const liq = async () => (await fetch('https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-fr', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: (tw && tw.initData) || '', action: 'liq' }) })).json();
  const w = async function (action, extra) {
    if (action !== 'portfolio') return orig(action, extra);
    const [r, l] = await Promise.all([orig(action, extra), liq().catch(() => null)]);
    try {
      const v = l && l.ok && l.v;
      if (r && v && typeof v === 'object' && Array.isArray(r.holdings)) {
        r.holdings.forEach((h) => { if (v[h.id] != null && isFinite(Number(v[h.id]))) h.value = Number(v[h.id]); });
        r.holdings.sort((a, b) => b.value - a.value);
      }
    } catch (e) {}
    return r;
  };
  w.__liq = 1;
  try { window.api = w; } catch (e) {}
})();
// 19 oct 2026 (Jeremy): welcome pack, 1 Star once per player: $5,000 of cash + mining boost x2 for 24 h. A small card above the
// earnings bar on the market. Shown once to each new player: closed with the cross or bought = never shown again (Jeremy, 19 oct 2026). The invoice comes from mct-fr 'welcome' (TONLAST.welcome = still possible).
(() => {
  const TX = ({
    fr: { t: 'Pack de bienvenue', s: '+5 000 $ et boost de minage x2 pendant 24 h', b: '1 ⭐', ok: '🎁 Pack activé : +5 000 $ et boost 24 h !', err: 'Achat impossible pour le moment.' },
    fa: { t: 'بسته خوش‌آمد', s: '+5,000 دلار و بوست استخراج x2 برای 24 ساعت', b: '1 ⭐', ok: '🎁 بسته فعال شد: +5,000 دلار و بوست 24 ساعته!', err: 'خرید فعلاً در دسترس نیست.' },
    ru: { t: 'Приветственный набор', s: '+$5,000 и буст майнинга x2 на 24 ч', b: '1 ⭐', ok: '🎁 Набор активирован: +$5,000 и буст на 24 ч!', err: 'Покупка сейчас недоступна.' },
    id: { t: 'Paket sambutan', s: '+$5.000 dan boost tambang x2 selama 24 jam', b: '1 ⭐', ok: '🎁 Paket aktif: +$5.000 dan boost 24 jam!', err: 'Pembelian tidak tersedia saat ini.' },
    ar: { t: 'باقة الترحيب', s: '+5,000 $ وتعزيز التعدين x2 لمدة 24 ساعة', b: '1 ⭐', ok: '🎁 تم تفعيل الباقة: +5,000 $ وتعزيز 24 ساعة!', err: 'الشراء غير متاح حاليًا.' },
  });
  const tx = () => TX[LANG] || { t: 'Welcome pack', s: '+$5,000 and mining boost x2 for 24 h', b: '1 ⭐', ok: '🎁 Pack activated: +$5,000 and 24 h boost!', err: 'Purchase not available right now.' };
  const day = () => new Date().toISOString().slice(0, 10);
  let hid = false; try { hid = !!localStorage.getItem('mct_wel_x'); } catch (e) {}
  let el = null, busy = false;
  const st = document.createElement('style');
  st.textContent = '#welc{position:fixed;left:0;right:0;bottom:calc(var(--tab,68px) + 64px + env(safe-area-inset-bottom));z-index:9;max-width:520px;margin:0 auto;padding:0 10px;box-sizing:border-box}'
    + '#welc .wi{display:flex;align-items:center;gap:10px;padding:9px 10px 9px 12px;border-radius:14px;border:1px solid rgba(255,212,59,.6);background:linear-gradient(135deg,rgba(60,40,10,.97),rgba(30,18,50,.97));box-shadow:0 -4px 14px rgba(0,0,0,.3)}'
    + '#welc .wt{flex:1;min-width:0;line-height:1.3}#welc b{display:block;font-size:14px}#welc small{display:block;font-size:12px;opacity:.85}'
    + '#welc .wb{flex:none;border:0;border-radius:999px;padding:8px 14px;font-weight:800;font-size:14px;background:linear-gradient(90deg,#ffd43b,#ff9a3c);color:#2a1700;cursor:pointer}'
    + '#welc .wx{flex:none;border:0;background:transparent;color:inherit;opacity:.6;font-size:16px;padding:4px;cursor:pointer}'
    // the page and the bell move up so the card hides nothing
    + 'body.wel{padding-bottom:calc(var(--tab,68px) + 150px + env(safe-area-inset-bottom))!important}body.wel #nbell{bottom:calc(var(--tab,68px) + 136px + env(safe-area-inset-bottom))}';
  document.head.appendChild(st);
  const show = () => {
    let want = false;
    try { want = !hid && TONLAST && TONLAST.ok && TONLAST.welcome && typeof VIEW !== 'undefined' && VIEW === 'market' && !document.getElementById('nbl'); } catch (e) {}
    document.body.classList.toggle('wel', !!want);
    if (!want) { if (el) { el.remove(); el = null; } return; }
    if (el && document.body.contains(el)) return;
    const T = tx();
    el = document.createElement('div'); el.id = 'welc';
    el.innerHTML = '<div class="wi"><span style="font-size:24px">🎁</span><div class="wt"><b></b><small></small></div><button class="wb" type="button"></button><button class="wx" type="button" aria-label="close">✕</button></div>';
    el.querySelector('b').textContent = T.t; el.querySelector('small').textContent = T.s; el.querySelector('.wb').textContent = T.b;
    el.querySelector('.wx').onclick = () => {
      hid = true; try { localStorage.setItem('mct_wel_x', day()); } catch (e) {} if (TONLAST) TONLAST.welcome = false; show();
      // 19 oct 2026 (Jeremy): closed = never offered again, on any phone (the server remembers it)
      fetch('https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-fr', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: (tw && tw.initData) || '', action: 'welcome_close' }) }).catch(() => {});
    };
    el.querySelector('.wb').onclick = async () => {
      if (busy) return; busy = true;
      try { haptic(); } catch (e) {}
      let r = null;
      try { r = await (await fetch('https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-fr', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: (tw && tw.initData) || '', action: 'welcome' }) })).json(); } catch (e) {}
      // 19 oct 2026: the button stays locked while the invoice is open (a double tap opened 2 invoices and a player paid twice)
      const wb = el && el.querySelector('.wb'), unlock = () => { busy = false; if (wb) { wb.disabled = false; wb.style.opacity = ''; } };
      if (wb) { wb.disabled = true; wb.style.opacity = '.5'; }
      if (!r || !r.ok || !r.link) { unlock(); try { toast(tx().err); } catch (e) {} if (r && r.error === 'done' && TONLAST) { TONLAST.welcome = false; show(); } return; }
      try {
        tw.openInvoice(r.link, (s) => {
          if (s !== 'paid' && s !== 'pending') { unlock(); return; }
          if (TONLAST) TONLAST.welcome = false; show();
          try { toast(tx().ok); } catch (e) {}
          setTimeout(() => { try { if (typeof loadMe === 'function') loadMe(); } catch (e) {} }, 2500);
        });
      } catch (e) { try { tw.openTelegramLink(r.link); } catch (x) {} }
    };
    document.body.appendChild(el);
  };
  setInterval(show, 1500);
})();
// 19 oct 2026 (Jeremy): the crypto quiz channel. Its buttons A B C D open the game with startapp=qz_<id>_<n>: the answer is recorded by the
// server (mct-fr 'quiz', read from the signed start_param) and the result shows here, with the points and the daily and weekly ranks.
(() => {
  let sp = ''; try { sp = String((tw && tw.initDataUnsafe && tw.initDataUnsafe.start_param) || ''); } catch (e) {}
  if (!/^qz_\d+_\d$/.test(sp)) return;
  try { if (sessionStorage.getItem('mct_qz') === sp) return; sessionStorage.setItem('mct_qz', sp); } catch (e) {}
  const es = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const st = document.createElement('style');
  st.textContent = '#qzr{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box}'
    + '#qzr .qb{width:100%;max-width:420px;max-height:88vh;overflow:auto;background:#1d1238;border-radius:20px;padding:18px 16px;box-sizing:border-box;box-shadow:0 10px 30px rgba(0,0,0,.5)}'
    + '#qzr .qh{font-size:22px;font-weight:800;margin:0 0 8px}#qzr .qq{font-weight:700;margin:0 0 10px;line-height:1.35}#qzr .qa{font-size:14px;line-height:1.45;margin:0 0 6px}'
    + '#qzr .qe{font-size:13.5px;line-height:1.45;opacity:.85;margin:10px 0;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.06)}'
    + '#qzr .qs{display:flex;gap:8px;margin:10px 0 14px}#qzr .qs div{flex:1;text-align:center;padding:8px 6px;border-radius:12px;background:rgba(255,212,59,.1);border:1px solid rgba(255,212,59,.35);font-size:12.5px}#qzr .qs b{display:block;font-size:16px}'
    + '#qzr button{display:block;width:100%;border:0;border-radius:14px;padding:12px;font-weight:800;font-size:15px;cursor:pointer;margin-top:8px}#qzr .q1{background:linear-gradient(90deg,#ffd43b,#ff9a3c);color:#2a1700}#qzr .q2{background:rgba(255,255,255,.08);color:inherit}';
  document.head.appendChild(st);
  const d = document.createElement('div'); d.id = 'qzr';
  d.innerHTML = '<div class="qb"><div class="qh">🧠 …</div></div>';
  const put = () => { if (document.body) document.body.appendChild(d); else setTimeout(put, 100); };
  put();
  const close = () => d.remove();
  d.onclick = (e) => { if (e.target === d) close(); };
  fetch('https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-fr', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: (tw && tw.initData) || '', action: 'quiz' }) })
    .then((r) => r.json()).catch(() => null).then((r) => {
      const b = d.querySelector('.qb');
      if (!r || !r.ok) { b.innerHTML = '<div class="qh">🧠 Quiz</div><p class="qa">This quiz is not available any more.</p><button class="q2" type="button">OK</button>'; b.querySelector('button').onclick = close; return; }
      try { tw.HapticFeedback.notificationOccurred(r.right ? 'success' : 'error'); } catch (e) {}
      const rk = (x) => x && x.rank ? '#' + x.rank : '-', pt = (x) => x && x.pts != null ? x.pts + ' pts' : '0 pts';
      const ch = String(r.chat || '').replace(/^@/, '');
      b.innerHTML = '<div class="qh">' + (r.again ? '🧠 Already answered' : r.right ? '✅ Right! +' + r.pts + ' points' : '❌ Not quite' + (r.pts ? ' · +' + r.pts + ' point' : '')) + '</div>'
        + '<p class="qq">' + es(r.q) + '</p>'
        + (r.right ? '' : '<p class="qa">Your answer: ' + es(r.mine) + '</p>')
        + '<p class="qa">Right answer: <b>' + es(r.letter) + '. ' + es(r.answer) + '</b></p>'
        + (r.expl ? '<div class="qe">💡 ' + es(r.expl) + '</div>' : '')
        + '<div class="qs"><div>Today<b>' + pt(r.day) + '</b>' + rk(r.day) + '</div><div>This week<b>' + pt(r.week) + '</b>' + rk(r.week) + '</div></div>'
        + (ch ? '<button class="q1" type="button" id="qzb">🧠 Next quiz on the channel</button>' : '')
        + '<button class="q2" type="button" id="qzp">🎮 Play Meme Coin Tycoon</button>';
      // back to the channel: the game closes, so the player lands on the channel (19 oct 2026, Jeremy)
      const nb = b.querySelector('#qzb'); if (nb) nb.onclick = () => { try { tw.openTelegramLink('https://t.me/' + ch); } catch (e) {} close(); setTimeout(() => { try { tw.close(); } catch (e) {} }, 300); };
      b.querySelector('#qzp').onclick = close;
    });
})();
// 20 oct 2026 (Jeremy): players did not understand that a mission is done by tapping it. Each unfinished mission now shows a "GO"
// button, the header says "tap a mission to do it", and the trade missions scroll to the coins with a hint
(() => {
  try {
    const TX = {
      en: ['Tap a mission to do it', 'Tap a coin to trade it'],
      fr: ['Touche une mission pour la faire', 'Touche un coin pour le trader'],
      id: ['Ketuk misi untuk mengerjakannya', 'Ketuk koin untuk trading'],
      ar: ['اضغط على مهمة لتنفيذها', 'اضغط على عملة لتداولها'],
      es: ['Toca una misión para hacerla', 'Toca una moneda para operarla'],
      fa: ['برای انجام یک ماموریت روی آن بزن', 'برای معامله روی یک کوین بزن'],
      ru: ['Нажми на задание, чтобы выполнить его', 'Нажми на монету, чтобы торговать']
    };
    const tx = (i) => { let lg = 'en'; try { lg = (0, eval)('typeof LANG !== "undefined" ? LANG : "en"'); } catch (e) {} return (TX[lg] || TX.en)[i]; };
    const GO = (0, eval)('typeof MSN_GO !== "undefined" ? MSN_GO : null');
    const toCoins = () => { const m = document.getElementById('msn'); if (m) { const y = m.getBoundingClientRect().bottom + window.scrollY - 70; window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' }); } try { (0, eval)('toast')(tx(1)); } catch (e) {} };
    if (GO) { GO.trade5 = toCoins; GO.vol2k = toCoins; }
    const st = document.createElement('style');
    st.textContent = '.msn-go{flex:none;margin-right:6px;padding:7px 12px;border-radius:999px;font-weight:900;font-size:13px;background:#2ee6ff;color:#0b0b1a;border:0;box-shadow:0 3px 0 #1a9fb3;animation:msnp 1.6s ease-in-out infinite}.msn-r[data-mk]{cursor:pointer}.msn-hint{display:block;padding:0 14px 6px;font-size:12px;color:#2ee6ff;font-weight:700}@keyframes msnp{50%{transform:scale(1.06)}}';
    document.head.appendChild(st);
    const orig = (0, eval)('typeof renderMissions === "function" ? renderMissions : null');
    if (!orig) return;
    window.renderMissions = function (ms) {
      orig(ms);
      try {
        const el = document.getElementById('msn'); if (!el || !ms || !ms.missions) return;
        let todo = 0;
        el.querySelectorAll('.msn-r[data-mk]').forEach((r) => {
          const m = ms.missions.find((x) => x.k === r.dataset.mk);
          if (!m || m.done || m.claimed || r.querySelector('.msn-go')) return;
          todo++;
          const b = document.createElement('span'); b.className = 'msn-go'; b.textContent = 'GO ›';
          const rb = r.querySelector('[data-mc]'); if (rb) r.insertBefore(b, rb); else r.appendChild(b);
        });
        const h = document.getElementById('msnh');
        if (todo && h && !el.querySelector('.msn-hint')) { const s = document.createElement('small'); s.className = 'msn-hint'; s.textContent = '👉 ' + tx(0); h.insertAdjacentElement('afterend', s); }
      } catch (e) {}
    };
  } catch (e) {}
})();
// 19 oct 2026 (Jeremy): the one-time mission "Join Crypto Quiz Daily" (+$200, server mct_bonus_missions 'quizch'): its label in every
// language and its "go" action (open the channel)
(() => {
  try {
    const LL = (0, eval)('typeof L !== "undefined" ? L : null');
    const lab = { en: '🧠 Join Crypto Quiz Daily', fr: '🧠 Rejoins Crypto Quiz Daily', id: '🧠 Gabung Crypto Quiz Daily', ar: '🧠 انضم إلى Crypto Quiz Daily', es: '🧠 Únete a Crypto Quiz Daily', fa: '🧠 به Crypto Quiz Daily بپیوند', ru: '🧠 Вступай в Crypto Quiz Daily' };
    if (LL) Object.keys(LL).forEach((k) => { if (LL[k] && typeof LL[k] === 'object') LL[k].m_quizch = lab[k] || lab.en; });
    const GO = (0, eval)('typeof MSN_GO !== "undefined" ? MSN_GO : null');
    if (GO) GO.quizch = () => { try { tw.openTelegramLink('https://t.me/cryptoquizzdaily'); } catch (e) { location.href = 'https://t.me/cryptoquizzdaily'; } };
    // 19 oct 2026 (Jeremy): replaced by the one-time mission "Join Jeremstyke" (+$500, server 'joinjs')
    const lj = { en: '📣 Join Jeremstyke', fr: '📣 Rejoins Jeremstyke', id: '📣 Gabung Jeremstyke', ar: '📣 انضم إلى Jeremstyke', es: '📣 Únete a Jeremstyke', fa: '📣 به Jeremstyke بپیوند', ru: '📣 Подпишись на Jeremstyke' };
    if (LL) Object.keys(LL).forEach((k) => { if (LL[k] && typeof LL[k] === 'object') LL[k].m_joinjs = lj[k] || lj.en; });
    if (GO) GO.joinjs = () => { try { tw.openTelegramLink('https://t.me/jeremstyke'); } catch (e) { location.href = 'https://t.me/jeremstyke'; } };
    // 19 oct 2026 (Jeremy): special mission of the day "Make your prediction on Daily Score" (server 'dsprono', checked in the base)
    const ld = { en: '⚽ Make your prediction on Daily Score', fr: '⚽ Fais ton prono sur Daily Score', id: '⚽ Buat tebakanmu di Daily Score', ar: '⚽ قدّم توقعك على Daily Score', es: '⚽ Haz tu pronóstico en Daily Score', fa: '⚽ پیش‌بینی‌ات را در Daily Score ثبت کن', ru: '⚽ Сделай прогноз в Daily Score' };
    if (LL) Object.keys(LL).forEach((k) => { if (LL[k] && typeof LL[k] === 'object') LL[k].m_dsprono = ld[k] || ld.en; });
    if (GO) GO.dsprono = () => { const u = 'https://t.me/DailyScorefootbot/play?startapp=src_mctmsn'; try { tw.openTelegramLink(u); } catch (e) { location.href = u; } };
    // 20 oct 2026 (Jeremy): special mission of the day "Play a duel in MCT Duel" (server 'duel', checked in the base)
    const lw = { en: '⚔️ Play a duel in MCT Duel', fr: '⚔️ Joue un duel sur MCT Duel', id: '⚔️ Main satu duel di MCT Duel', ar: '⚔️ العب مبارزة في MCT Duel', es: '⚔️ Juega un duelo en MCT Duel', fa: '⚔️ یک دوئل در MCT Duel بازی کن', ru: '⚔️ Сыграй дуэль в MCT Duel' };
    if (LL) Object.keys(LL).forEach((k) => { if (LL[k] && typeof LL[k] === 'object') LL[k].m_duel = lw[k] || lw.en; });
    if (GO) GO.duel = () => { const u = 'https://t.me/Memecointycoonbot/Mctduel?startapp=src_mctmsn'; try { tw.openTelegramLink(u); } catch (e) { location.href = u; } };
    // 19 oct 2026 (Jeremy): 24 h without launching a coin after a rug pull (server error 'rugwait')
    const lr = { en: '⚠️ You rugged a coin: you can launch a new one 24 h after.', fr: '⚠️ Tu as rug un coin : tu pourras en lancer un nouveau 24 h après.', id: '⚠️ Kamu melakukan rug pull: kamu bisa meluncurkan koin baru 24 jam setelahnya.', ar: '⚠️ قمت بسحب البساط من عملة: يمكنك إطلاق عملة جديدة بعد 24 ساعة.', fa: '⚠️ تو روی یک کوین راگ‌پول کردی: ۲۴ ساعت بعد می‌توانی کوین جدید بسازی.', ru: '⚠️ Ты сделал rug pull: новую монету можно запустить через 24 ч.' };
    if (LL) Object.keys(LL).forEach((k) => { if (LL[k] && typeof LL[k] === 'object' && LL[k].err && typeof LL[k].err === 'object') LL[k].err.rugwait = lr[k] || lr.en; });
  } catch (e) {}
})();
