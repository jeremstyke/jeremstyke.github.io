// 16 oct 2026 (Jeremy): the diamond inside Meme Coin Tycoon. A small 💎 at the top, next to the FAQ: tap it and earn real TON,
// kept in the diamond until the player taps "Add to my balance" (16 oct 2026: not automatic any more), then paid every Monday from $0.10.
// The rate changes every day (3,500 to 10,000 taps per $0.01) and is announced every morning on @memecointycoon.
// +10 % for subscribers of @memecointycoon and +10 % for subscribers of @jeremstyke. A weekly contest of the best tappers.
// The server counts every tap, limits the speed and asks a human check (Supabase function mct-ton: dia, dia_tap, dia_check).
(() => {
  const TX = {
    id: {
      t: 'Berlian', mine: 'Di berlianku', claim: (v) => '➕ Tambahkan ' + v + ' ke saldoku', claim0: '➕ Tambahkan ke saldoku', solde: (v) => '👛 Saldo TON-ku: ' + v, added: (v) => '✅ ' + v + ' ditambahkan ke saldomu', none: 'Belum ada apa-apa di berlianmu, terus ketuk!', today: 'Hari ini', taps: 'ketukan', rate: (n) => 'Kurs hari ini: ' + n + ' ketukan = $0.01',
      lead: 'Ketuk berliannya, ia pindah setiap 50 ketukan', pay: 'Penghasilanmu menunggu di berlian: ketuk "Tambahkan ke saldoku" untuk mengambilnya. Saldomu dibayar setiap hari mulai $0.10 ke dompet TON-mu.',
      check: 'Cek singkat: ketuk 💎', wrong: 'Salah, coba lagi', paused: 'Berlian sedang istirahat sampai bulan depan. Sampai jumpa!', off: 'Berlian ditutup untuk sementara.',
      bon: 'Bonus pelanggan', bm: '📢 Channel Meme Coin Tycoon', bj: '📢 Channel Jeremstyke', bq: '🧠 Channel Crypto Quiz Daily', join: 'Gabung', on: '✅ +10 %', recheck: '🔄 Sudah gabung',
      con: '🏆 Kontes berlian minggu ini', ends: 'Berakhir dalam', you: 'kamu', nobody: 'Belum ada: jadilah yang pertama!', rank: 'Peringkatmu', prizes: 'Hadiah Senin dalam TON',
      wal: '👛 Dompet TON-ku', err: 'Masalah koneksi, coba lagi.', close: 'Tutup',
    },
    en: {
      t: 'Diamond', mine: 'In my diamond', claim: (v) => '➕ Add ' + v + ' to my balance', claim0: '➕ Add to my balance', solde: (v) => '👛 My TON balance: ' + v, added: (v) => '✅ ' + v + ' added to your balance', none: 'Nothing in your diamond yet, keep tapping!', today: 'Today', taps: 'taps', rate: (n) => 'Rate of the day: ' + n + ' taps = $0.01',
      lead: 'Tap the diamond, it moves every 50 taps', pay: 'Your earnings wait in the diamond: tap "Add to my balance" to get them. Your balance is paid every day from $0.10 to your TON wallet.',
      check: 'Quick check: tap the 💎', wrong: 'Wrong one, try again', paused: 'The diamond is resting until next month. Come back soon!', off: 'The diamond is closed for now.',
      bon: 'Subscriber bonus', bm: '📢 Meme Coin Tycoon channel', bj: '📢 Jeremstyke channel', bq: '🧠 Crypto Quiz Daily channel', join: 'Join', on: '✅ +10 %', recheck: '🔄 I joined',
      con: '🏆 Diamond contest of the week', ends: 'Ends in', you: 'you', nobody: 'Nobody yet: be the first!', rank: 'Your rank', prizes: 'Monday prizes in TON',
      wal: '👛 My TON wallet', err: 'Connection problem, try again.', close: 'Close',
    },
    fr: {
      t: 'Diamant', mine: 'Dans mon diamant', claim: (v) => '➕ Ajouter ' + v + ' à mon solde', claim0: '➕ Ajouter à mon solde', solde: (v) => '👛 Mon solde TON : ' + v, added: (v) => '✅ ' + v + ' ajouté à ton solde', none: 'Rien dans ton diamant pour l\'instant, continue de taper !', today: 'Aujourd\'hui', taps: 'tapes', rate: (n) => 'Taux du jour : ' + n + ' tapes = 0,01 $',
      lead: 'Tape le diamant, il bouge toutes les 50 tapes', pay: 'Tes gains restent dans le diamant : appuie sur "Ajouter à mon solde" pour les récupérer. Ton solde est payé chaque jour dès 0,10 $ sur ton portefeuille TON.',
      check: 'Petite vérification : touche le 💎', wrong: 'Pas le bon, réessaie', paused: 'Le diamant se repose jusqu\'au mois prochain. Reviens bientôt !', off: 'Le diamant est fermé pour le moment.',
      bon: 'Bonus abonné', bm: '📢 Chaîne Meme Coin Tycoon', bj: '📢 Chaîne Jeremstyke', bq: '🧠 Chaîne Crypto Quiz Daily', join: 'S\'abonner', on: '✅ +10 %', recheck: '🔄 Je suis abonné',
      con: '🏆 Concours du diamant de la semaine', ends: 'Fin dans', you: 'toi', nobody: 'Personne pour l\'instant : sois le premier !', rank: 'Ton rang', prizes: 'Gains du lundi en TON',
      wal: '👛 Mon portefeuille TON', err: 'Problème de connexion, réessaie.', close: 'Fermer',
    },
    ar: {
      t: 'الماسة', mine: 'في ماستي', claim: (v) => '➕ أضف ' + v + ' إلى رصيدي', claim0: '➕ أضف إلى رصيدي', solde: (v) => '👛 رصيد TON: ' + v, added: (v) => '✅ أُضيف ' + v + ' إلى رصيدك', none: 'لا شيء في ماستك بعد، واصل الضغط!', today: 'اليوم', taps: 'ضغطة', rate: (n) => 'سعر اليوم: ' + n + ' ضغطة = ‎0.01 $',
      lead: 'اضغط على الماسة، تتحرك كل 50 ضغطة', pay: 'أرباحك تبقى في الماسة: اضغط "أضف إلى رصيدي" لاستلامها. يُدفع رصيدك كل يوم ابتداءً من ‎0.10 $ إلى محفظة TON.',
      check: 'تحقق سريع: اضغط على 💎', wrong: 'ليست هي، حاول مرة أخرى', paused: 'الماسة في استراحة حتى الشهر القادم. عُد قريبًا!', off: 'الماسة مغلقة حاليًا.',
      bon: 'مكافأة المشترك', bm: '📢 قناة Meme Coin Tycoon', bj: '📢 قناة Jeremstyke', bq: '🧠 قناة Crypto Quiz Daily', join: 'اشترك', on: '✅ ‎+10 %', recheck: '🔄 اشتركت',
      con: '🏆 مسابقة الماسة لهذا الأسبوع', ends: 'تنتهي خلال', you: 'أنت', nobody: 'لا أحد بعد: كن الأول!', rank: 'ترتيبك', prizes: 'جوائز يوم الاثنين بعملة TON',
      wal: '👛 محفظة TON', err: 'مشكلة في الاتصال، حاول مرة أخرى.', close: 'إغلاق',
    },
  };
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] ? l : 'en'; };
  const L = () => TX[lg()];
  // 19 oct 2026 (Jeremy): anti-cheat messages (pause after a wrong check, daily cap, money under review)
  const AX = {
    id: { wait: (s) => 'Salah. Tunggu ' + s + ' detik sebelum mencoba lagi.', cap: 'Batas harian tercapai (20.000 ketukan). Kembali besok!', review: 'Berlianmu sedang diperiksa. Uangmu aman, tunggu sebentar.' },
    en: { wait: (s) => 'Wrong one. Wait ' + s + ' s before trying again.', cap: 'Daily limit reached (20,000 taps). Come back tomorrow!', review: 'Your diamond is being checked. Your money is safe, please wait.' },
    fr: { wait: (s) => 'Pas le bon. Attends ' + s + ' s avant de réessayer.', cap: 'Limite du jour atteinte (20 000 tapes). Reviens demain !', review: 'Ton diamant est en cours de vérification. Ton argent est en sécurité, patiente un peu.' },
    ar: { wait: (s) => 'ليست هي. انتظر ' + s + ' ث قبل المحاولة مجددًا.', cap: 'تم بلوغ الحد اليومي (20,000 ضغطة). عُد غدًا!', review: 'ماستك قيد المراجعة. أموالك في أمان، انتظر قليلًا.' }
  };
  AX.id.ban = 'Kamu dikeluarkan dari pembayaran karena curang (bot atau autoclicker).'; AX.en.ban = 'You are excluded from payments for cheating (bot or autoclicker).';
  AX.fr.ban = 'Tu es exclu des paiements pour triche (bot ou autoclicker).'; AX.ar.ban = 'أنت مستبعد من المدفوعات بسبب الغش (روبوت أو نقر آلي).';
  const AXL = () => AX[lg()] || AX.en;
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const nf = (n) => Number(n || 0).toLocaleString(lg() === 'fr' ? 'fr-FR' : 'en-US');
  const usd = (v, d) => { const x = Number(v || 0).toFixed(d == null ? 2 : d); return lg() === 'fr' ? x.replace('.', ',') + ' $' : '$' + x; };
  const call = (b) => tonCall(b);
  // 16 oct 2026: "Add to my balance" goes through the function mct-fr (initData checked there)
  const claimCall = async () => (await fetch('https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-fr', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: Telegram.WebApp.initData, action: 'claim' }) })).json();
  const open = (u) => { try { Telegram.WebApp.openTelegramLink(u); } catch (e) { location.href = u; } };

  let S = null, Q = 0, BUSY = false, TIMER = null, CNT = 0, POS = { x: 50, y: 50 };

  const st = document.createElement('style');
  st.textContent = '#diatop{padding:4px 8px;font-size:15px;line-height:1}'
    + '#diam{position:fixed;inset:0;z-index:9998;background:rgba(5,3,15,.78);display:flex;align-items:flex-end;justify-content:center}'
    + '#diam .dbox{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:16px 16px calc(20px + env(safe-area-inset-bottom))}'
    + '#diam .dtop{display:flex;align-items:center;justify-content:space-between;margin:0 0 10px}#diam .dtop b{font-size:18px}#diam .dx{background:none;border:0;color:inherit;font-size:22px;opacity:.7;cursor:pointer;padding:4px 8px}'
    + '#diam .dc{border:1px solid var(--line,rgba(255,255,255,.12));border-radius:16px;padding:14px;margin:0 0 12px;background:rgba(255,255,255,.03)}'
    + '#diam .dl{font-size:12px;opacity:.7;text-transform:uppercase;letter-spacing:.04em}#diam .dbig{font-size:34px;font-weight:800;color:#2ee6ff;margin:2px 0}'
    + '#diam .dbar{height:8px;border-radius:9px;background:rgba(255,255,255,.1);overflow:hidden;margin:6px 0 4px}#diam .dbar i{display:block;height:100%;width:0;background:#2ee6ff;transition:width .15s}'
    + '#diam .dsm{font-size:13px;opacity:.8;margin:2px 0}#diam .dnote{font-size:12px;opacity:.7;margin:10px 0 0}'
    + '#darea{position:relative;height:230px;border-radius:16px;background:rgba(46,230,255,.06);overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;margin:10px 0 0}'
    + '#dgem{position:absolute;transform:translate(-50%,-50%);width:104px;height:104px;border-radius:50%;border:0;background:radial-gradient(circle at 35% 30%,#bff6ff,#2ee6ff 45%,#0b6c80);font-size:54px;cursor:pointer;box-shadow:0 10px 30px rgba(46,230,255,.35);transition:left .25s,top .25s}'
    + '#diam .drow{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:14px;padding:6px 0}#diam .drow.me{color:#ffd43b;font-weight:700}'
    + '#diam .dsub{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 0;font-size:14px}#diam .dsub button{width:auto;padding:6px 12px;margin:0;font-size:13px}#diam .dok{color:#7dff6b;font-weight:800}'
    // 17 oct 2026: the "Add to my balance" button in the colours of the diamond (it was the plain game button)
    + '#dclaim{display:block;width:100%;margin:12px 0 8px;padding:13px 14px;border:0;border-radius:14px;background:linear-gradient(135deg,#7ff3ff,#2ee6ff 45%,#0aa9c7);color:#03202a;font-weight:800;font-size:15px;cursor:pointer;box-shadow:0 6px 18px rgba(46,230,255,.3);transition:transform .1s}'
    + '#dclaim:active{transform:scale(.98)}#dclaim:disabled{opacity:.6}#dclaim.dz{background:transparent;color:#2ee6ff;border:1px solid rgba(46,230,255,.45);box-shadow:none}'
    // 17 oct 2026: the main card of the diamond, prettier (glow, big amount, balance and stats as chips)
    + '#diam .dhero{text-align:center;border-color:rgba(46,230,255,.35);background:radial-gradient(120% 80% at 50% 0%,rgba(46,230,255,.22),rgba(46,230,255,.03) 65%),rgba(255,255,255,.02);box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}'
    + '#diam .dhero .dbig{display:flex;align-items:center;justify-content:center;gap:8px;font-size:40px;margin:6px 0 4px;text-shadow:0 0 22px rgba(46,230,255,.55)}#diam .dgi{font-size:30px;filter:drop-shadow(0 0 8px rgba(46,230,255,.7))}'
    + '#diam .dhero .dbar{height:10px;margin:8px 4px 4px;background:rgba(255,255,255,.08)}#diam .dhero .dbar i{background:linear-gradient(90deg,#0aa9c7,#2ee6ff,#bff6ff);box-shadow:0 0 10px rgba(46,230,255,.8)}'
    + '#dsolde{display:inline-block;margin:2px 0 8px;padding:7px 14px;border-radius:999px;background:rgba(255,212,59,.12);border:1px solid rgba(255,212,59,.35);color:#ffd43b;font-weight:800;font-size:14px}'
    + '#diam .dmeta{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:0 0 4px}#diam .dmeta span{font-size:12px;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.06);opacity:.9}'
    + '#diam .dhero #darea{text-align:left}#diam .dhero .dnote{text-align:left}';
  document.head.appendChild(st);

  // the small 💎 at the top, right before the FAQ
  function addBtn() {
    if (document.getElementById('diatop')) return true;
    const f = document.getElementById('faqtop'); if (!f) return false;
    const b = document.createElement('button'); b.className = 'lng'; b.id = 'diatop'; b.setAttribute('aria-label', 'Diamond'); b.textContent = '💎';
    b.onclick = () => { hp(); show(); };
    f.parentNode.insertBefore(b, f); return true;
  }
  if (!addBtn()) { let n = 0; const w = setInterval(() => { if (addBtn() || ++n > 80) clearInterval(w); }, 250); }

  function cd(end) { const x = Math.max(0, Math.floor((Date.parse(end) - Date.now()) / 1000)), d = Math.floor(x / 86400), p = (n) => String(n).padStart(2, '0'); return (d ? d + (lg() === 'fr' ? 'j ' : 'd ') : '') + p(Math.floor(x % 86400 / 3600)) + ':' + p(Math.floor(x % 3600 / 60)) + ':' + p(x % 60); }
  setInterval(() => { const e = document.getElementById('dcd'); if (e && S && S.contest) e.textContent = cd(S.contest.ends); }, 1000);

  function closeIt() { const d = document.getElementById('diam'); if (d) d.remove(); flush(); }
  async function show() {
    let d = document.getElementById('diam');
    if (!d) {
      d = document.createElement('div'); d.id = 'diam';
      d.innerHTML = '<div class="dbox"><div class="dtop"><b>💎 ' + ec(L().t) + '</b><button class="dx" id="dx" aria-label="' + ec(L().close) + '">✕</button></div><div id="dbody" style="text-align:center;padding:30px 0">⏳</div></div>';
      d.onclick = (e) => { if (e.target === d) closeIt(); };
      document.body.appendChild(d);
      d.querySelector('#dx').onclick = () => { hp(); closeIt(); };
    }
    let r = null; try { r = await call({ action: 'dia' }); } catch (e) {}
    if (!r || !r.state) { const b = document.getElementById('dbody'); if (b) b.textContent = L().err; return; }
    S = r.state; paint();
  }

  function nums() {
    if (!S) return;
    const tpc = Number(S.tpc || 5000), pend = Number(S.pending_taps || 0) + Q;
    const bal = Number(S.balance || 0) + Q / tpc * 0.01;
    const u = document.getElementById('dusd'), b = document.getElementById('dbar'), n = document.getElementById('dtoday');
    if (u) u.textContent = usd(bal, bal < 1 ? 4 : 2);
    if (b) b.style.width = Math.min(100, (pend % tpc) / tpc * 100).toFixed(1) + '%';
    if (n) n.textContent = L().today + ' : ' + nf(Number(S.today || 0) + Q) + ' ' + L().taps;
    // what "Add to my balance" moves now: the diamond + the taps, by steps of $0.0001 (17 oct 2026: at any time, not only full cents)
    const unit = Math.max(1, Math.floor(tpc / 100));
    const pot = Number(S.claim || 0) - Math.floor(Number(S.pending_taps || 0) / unit) * 0.0001, can = Math.max(0, pot + Math.floor(pend / unit) * 0.0001);
    const cb = document.getElementById('dclaim'), so = document.getElementById('dsolde');
    if (cb && !CLAIMING) { const e = can < 0.00009; cb.classList.toggle('dz', e); cb.textContent = e ? L().claim0 : L().claim(usd(can, can < 1 ? 4 : 2)); }
    if (so) so.textContent = L().solde(usd(S.solde, Number(S.solde || 0) < 1 ? 4 : 2));
  }

  function paint() {
    const b = document.getElementById('dbody'); if (!b || !S) return;
    const T = L(), c = S.contest || {}, md = ['🥇', '🥈', '🥉'], pz = c.prizes || [];
    if (!S.on) { b.innerHTML = '<p class="dsm">' + ec(T.off) + '</p>'; return; }
    // 19 oct 2026 (Jeremy): + the quiz channel, +5 % (S.qz_pct)
    const sub = (k, on, url, pc) => '<div class="dsub"><span>' + ec(T[k]) + '</span>' + (on ? '<span class="dok">' + ec(pc ? '✅ +' + pc + ' %' : T.on) + '</span>' : '<button class="btn" data-dj="' + url + '">' + ec(T.join) + ' +' + (pc || 10) + ' %</button>') + '</div>';
    const rows = (c.top || []).slice(0, 10).map((x, i) => '<div class="drow' + (x.me ? ' me' : '') + '"' + (x.pid ? ' data-pid="' + Number(x.pid) + '" style="cursor:pointer"' : '') + '><span>' + (md[i] || (i + 1) + '.') + ' ' + ec(x.name) + (x.me ? ' (' + ec(T.you) + ')' : '') + '</span><span>' + nf(x.n) + ' ' + ec(T.taps) + (i < 3 && pz[i] ? ' · ' + usd(pz[i]) : '') + '</span></div>').join('')
      || '<p class="dsm">' + ec(T.nobody) + '</p>';
    b.style.cssText = '';
    b.innerHTML = '<div class="dc dhero"><div class="dl">' + ec(T.mine) + '</div><div class="dbig"><span class="dgi">💎</span><span id="dusd"></span></div><div class="dbar"><i id="dbar"></i></div>'
      + (S && S.banned ? '<div style="margin:8px 0;padding:10px 12px;border-radius:12px;background:rgba(255,59,92,.14);border:1px solid rgba(255,59,92,.55);color:#ff8fa3;font-weight:700;font-size:13px">🚫 ' + ec(AXL().ban) + '</div>' : '') + '<button id="dclaim" type="button"></button><div id="dsolde"></div><div class="dmeta"><span id="dtoday"></span><span>' + ec(T.rate(nf(S.tpc))) + '</span></div><div id="darea"></div><p class="dnote">' + ec(T.pay) + '</p></div>'
      + (Number(S.sub_pct) > 0 ? '<div class="dc"><div class="dl">' + ec(T.bon) + '</div>' + sub('bm', S.sub_mct, 'https://t.me/memecointycoon') + sub('bj', S.sub_js, 'https://t.me/jeremstyke')
        + (S.qz_chat && Number(S.qz_pct) > 0 ? sub('bq', S.sub_qz, 'https://t.me/' + String(S.qz_chat).replace(/^@/, ''), Number(S.qz_pct)) : '')
        + (S.sub_mct && S.sub_js && (S.sub_qz || !S.qz_chat) ? '' : '<button class="btn ghost" id="drc" style="width:100%;margin:8px 0 0">' + ec(T.recheck) + '</button>') + '</div>' : '')
      + (c.on ? '<div class="dc"><div class="dl">' + ec(T.con) + '</div><div class="dsm">' + ec(T.ends) + ' <b id="dcd">' + cd(c.ends) + '</b> · ' + ec(T.prizes) + ' : ' + pz.map((p) => usd(p)).join(' / ') + '</div>' + rows
        + (c.me && c.me.rank ? '<div class="dsm" style="margin-top:6px">' + ec(T.rank) + ' : <b>#' + c.me.rank + '</b> · ' + nf(c.me.n) + ' ' + ec(T.taps) + '</div>' : '') + '</div>' : '')
      + '<button class="btn ghost" id="dwal" style="width:100%">' + ec(T.wal) + '</button>';
    b.querySelectorAll('[data-dj]').forEach((x) => x.onclick = () => { hp(); open(x.dataset.dj); });
    // 17 oct 2026: tap a tapper to see his profile (and add him as a friend)
    b.querySelectorAll('.drow[data-pid]').forEach((x) => x.onclick = () => { if (typeof window.mctProfile !== 'function') return; hp(); closeIt(); window.mctProfile(x.dataset.pid); });
    const rc = document.getElementById('drc'); if (rc) rc.onclick = () => { hp(); show(); };
    document.getElementById('dclaim').onclick = claim;
    document.getElementById('dwal').onclick = () => { hp(); closeIt(); try { tonPage(); } catch (e) {} };
    area();
  }

  let CLAIMING = false;
  async function claim() {
    const T = L(), cb = document.getElementById('dclaim');
    if (CLAIMING) return;
    if (!cb || cb.disabled) return;
    CLAIMING = true; hp(); cb.disabled = true;
    if (TIMER) { clearTimeout(TIMER); TIMER = null; }
    let k = 0; while (BUSY && k++ < 40) await new Promise((ok) => setTimeout(ok, 100));
    await flush();
    let r = null; try { r = await claimCall(); } catch (e) {}
    CLAIMING = false;
    if (r && r.error === 'banned') { tst('🚫 ' + AXL().ban); cb.disabled = false; nums(); return; }
    if (r && r.error === 'review') { tst(AXL().review); cb.disabled = false; nums(); return; }
    if (!r || !r.ok) { tst(T.err); cb.disabled = false; nums(); return; }
    if (r.state) S = r.state;
    try { Telegram.WebApp.HapticFeedback.notificationOccurred('success'); } catch (e) {}
    tst(Number(r.added) > 0 ? T.added(usd(r.added, Number(r.added) < 1 ? 4 : 2)) : T.none);
    cb.disabled = false; nums();
  }

  function area() {
    const el = document.getElementById('darea'); if (!el || !S) return;
    const T = L();
    el.innerHTML = S.paused ? '<div style="position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:16px" class="dsm">' + ec(T.paused) + '</div>'
      : S.check ? '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px"><b>' + ec(T.check) + '</b><div style="display:flex;gap:12px">'
        + S.check.map((e, i) => '<button class="btn ghost" data-dck="' + (i + 1) + '" style="width:auto;font-size:30px;padding:8px 14px;margin:0">' + e + '</button>').join('') + '</div></div>'
      : '<button id="dgem" aria-label="Tap" style="left:' + POS.x + '%;top:' + POS.y + '%">💎</button><div style="position:absolute;left:12px;right:12px;bottom:10px;text-align:center;font-size:12px;opacity:.6;pointer-events:none">' + ec(T.lead) + '</div>';
    nums();
    const g = document.getElementById('dgem');
    if (g) g.onpointerdown = (ev) => {
      ev.preventDefault(); Q++; CNT++;
      g.style.transform = 'translate(-50%,-50%) scale(.9)'; setTimeout(() => { g.style.transform = 'translate(-50%,-50%)'; }, 70);
      if (CNT % 10 === 0) hp();
      if (CNT % 50 === 0) { POS = { x: 20 + Math.random() * 60, y: 22 + Math.random() * 56 }; g.style.left = POS.x + '%'; g.style.top = POS.y + '%'; }
      nums();
      if (!TIMER) TIMER = setTimeout(flush, 1000);
    };
    el.querySelectorAll('[data-dck]').forEach((b) => b.onclick = async () => {
      hp(); let r = null; try { r = await call({ action: 'dia_check', a: Number(b.dataset.dck) }); } catch (e) {}
      if (r && r.state) S = r.state; if (r && !r.ok) tst(r.wait ? AXL().wait(r.wait) : T.wrong);
      area();
    });
  }

  async function flush() {
    TIMER = null; if (BUSY || !Q) return; BUSY = true;
    const n = Q; Q = 0; let r = null;
    try { r = await call({ action: 'dia_tap', n }); } catch (e) {}
    BUSY = false;
    if (r && r.state) S = r.state; else if (!r) Q += n;
    if (r && r.error === 'check') Q = 0;
    if (r && (r.error === 'locked' || r.error === 'cap')) { Q = 0; tst(r.error === 'cap' ? AXL().cap : AXL().wait(r.wait || 30)); }
    if (r && r.error === 'off') S.on = false;
    if ((r && r.state && (r.state.check || r.state.paused)) || (r && r.error === 'off')) { if (r.error === 'off') paint(); else area(); return; }
    nums();
    if (Q && !TIMER) TIMER = setTimeout(flush, 1000);
  }
  window.addEventListener('pagehide', flush);

  // a link ?startapp=src_dia... (the channel posts) opens the diamond
  const sp = String((window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.start_param) || '');
  if (/dia/.test(sp)) { let n = 0; const w = setInterval(() => { n++; let ok = false; try { ok = !!document.getElementById('diatop') && !!document.querySelector('nav.tb'); } catch (e) {} if (ok || n > 60) { clearInterval(w); if (ok) show(); } }, 250); }
})();
