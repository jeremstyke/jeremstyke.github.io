// 16 oct 2026 (Jeremy): friends in Meme Coin Tycoon. A card "👥 My friends" in the Leaders tab opens the ranking between friends,
// with a 🎁 gift (game cash) to send to each friend once a day, and a button to add a friend (Telegram share of the link r_<id>).
// The sponsor and the friends invited are friends automatically; a link r_<id> opened by a player who already plays, or the button on a
// profile, sends a friend request (16 oct 2026: the other player accepts or refuses it in this sheet).
// Data from the Supabase function mct-fr.
(() => {
  const FN = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-fr';
  const TX = {
    id: { card: '👥 Temanku', cardx: 'Peringkat antar teman, dan hadiah untuk dikirim setiap hari', see: 'Lihat', t: '👥 Temanku', you: 'kamu', dev: 'dev',
      add: '➕ Tambah teman', share: 'Main Meme Coin Tycoon bareng aku: trading memecoin dan menangkan TON asli 🚀', gift: (n) => '🎁 ' + n, sent: '✅ Terkirim', none: 'Belum ada teman. Tambahkan temanmu: kamu bisa lihat siapa yang paling jago trading dan saling kirim hadiah setiap hari 🎁',
      okg: (n) => '🎁 Hadiah terkirim: ' + n + '!', full: 'Teman ini sudah menerima cukup hadiah hari ini.', already: 'Sudah dikirim hari ini.', err: 'Masalah koneksi, coba lagi.', added: (n) => '👥 ' + n + ' sekarang temanmu!', padd: '➕ Tambah sebagai teman', isf: '👥 Teman', pend: '⏳ Permintaan terkirim', rsent: (n) => '📩 Permintaan terkirim ke ' + n, reqs: '📩 Permintaan pertemanan', acc: '✅ Terima', ref: 'Ditolak', refb: 'Tolak', on: 'main hari ini', gifts: 'Hadiah diterima hari ini', close: 'Tutup' },
    en: { card: '👥 My friends', cardx: 'Your ranking between friends, and a gift to send every day', see: 'See', t: '👥 My friends', you: 'you', dev: 'dev',
      add: '➕ Add a friend', share: 'Play Meme Coin Tycoon with me: trade memecoins and win real TON 🚀', gift: (n) => '🎁 ' + n, sent: '✅ Sent', none: 'No friend yet. Add your friends: you will see who trades best and you can send each other a gift every day 🎁',
      okg: (n) => '🎁 Gift sent: ' + n + '!', full: 'This friend has received enough gifts today.', already: 'Already sent today.', err: 'Connection problem, try again.', added: (n) => '👥 ' + n + ' is now your friend!', padd: '➕ Add as friend', isf: '👥 Friend', pend: '⏳ Request sent', rsent: (n) => '📩 Request sent to ' + n, reqs: '📩 Friend requests', acc: '✅ Accept', ref: 'Refused', refb: 'Refuse', on: 'played today', gifts: 'Gifts received today', close: 'Close' },
    fr: { card: '👥 Mes amis', cardx: 'Ton classement entre amis, et un cadeau à envoyer chaque jour', see: 'Voir', t: '👥 Mes amis', you: 'toi', dev: 'dev',
      add: '➕ Ajouter un ami', share: 'Joue à Meme Coin Tycoon avec moi : trade des memecoins et gagne de vrais TON 🚀', gift: (n) => '🎁 ' + n, sent: '✅ Envoyé', none: 'Pas encore d\'ami. Ajoute tes amis : tu verras qui trade le mieux et vous pourrez vous envoyer un cadeau chaque jour 🎁',
      okg: (n) => '🎁 Cadeau envoyé : ' + n + ' !', full: 'Cet ami a déjà reçu assez de cadeaux aujourd\'hui.', already: 'Déjà envoyé aujourd\'hui.', err: 'Problème de connexion, réessaie.', added: (n) => '👥 ' + n + ' est maintenant ton ami !', padd: '➕ Ajouter en ami', isf: '👥 Ami', pend: '⏳ Demande envoyée', rsent: (n) => '📩 Demande envoyée à ' + n, reqs: '📩 Demandes d\'ami', acc: '✅ Accepter', ref: 'Demande refusée', refb: 'Refuser', on: 'a joué aujourd\'hui', gifts: 'Cadeaux reçus aujourd\'hui', close: 'Fermer' },
    ar: { card: '👥 أصدقائي', cardx: 'ترتيبك بين أصدقائك، وهدية ترسلها كل يوم', see: 'عرض', t: '👥 أصدقائي', you: 'أنت', dev: 'dev',
      add: '➕ أضف صديقًا', share: 'العب Meme Coin Tycoon معي: تداول عملات الميم واربح TON حقيقية 🚀', gift: (n) => '🎁 ' + n, sent: '✅ أُرسلت', none: 'لا أصدقاء بعد. أضف أصدقاءك لترى من يتداول أفضل وتتبادلوا هدية كل يوم 🎁',
      okg: (n) => '🎁 أُرسلت الهدية: ' + n + '!', full: 'تلقى هذا الصديق ما يكفي من الهدايا اليوم.', already: 'أُرسلت اليوم.', err: 'مشكلة في الاتصال، حاول مرة أخرى.', added: (n) => '👥 ' + n + ' أصبح صديقك!', padd: '➕ أضف كصديق', isf: '👥 صديق', pend: '⏳ تم إرسال الطلب', rsent: (n) => '📩 تم إرسال الطلب إلى ' + n, reqs: '📩 طلبات الصداقة', acc: '✅ قبول', ref: 'تم الرفض', refb: 'رفض', on: 'لعب اليوم', gifts: 'الهدايا المستلمة اليوم', close: 'إغلاق' },
  };
  const tw = window.Telegram && Telegram.WebApp;
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] ? l : 'en'; };
  const L = () => TX[lg()];
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const nf = (n) => Number(n || 0).toLocaleString(lg() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: 0 });
  const big = (v) => lg() === 'fr' ? nf(v) + ' $' : '$' + nf(v);
  const me = () => Number((tw && tw.initDataUnsafe && tw.initDataUnsafe.user && tw.initDataUnsafe.user.id) || 0);
  const COL = ['#ffd43b', '#4ff0b7', '#ff5d8f', '#2ee6ff', '#b18cff', '#ff9f43'];
  const av = (p) => p.photo
    ? '<img src="' + ec(p.photo) + '" alt="" style="width:34px;height:34px;border-radius:50%;object-fit:cover;flex:none;background:#2b0a57">'
    : '<span style="width:34px;height:34px;border-radius:50%;flex:none;display:inline-grid;place-items:center;font-weight:800;font-size:16px;color:#1a0638;background:' + COL[Number(String(p.pid || 0).slice(-3)) % COL.length] + '">' + ec(String(p.name || '?').trim().charAt(0).toUpperCase() || '?') + '</span>';
  async function call(body) {
    const r = await fetch(FN, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: tw && tw.initData, ...body }) });
    return r.json();
  }
  let D = null;

  const st = document.createElement('style');
  st.textContent = '#frm{position:fixed;inset:0;z-index:9998;background:rgba(5,3,15,.78);display:flex;align-items:flex-end;justify-content:center}'
    + '#frm .fbox{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:16px 16px calc(20px + env(safe-area-inset-bottom))}'
    + '#frm .ftop{display:flex;align-items:center;justify-content:space-between;margin:0 0 10px}#frm .ftop b{font-size:18px}#frm .fx{background:none;border:0;color:inherit;font-size:22px;opacity:.7;cursor:pointer;padding:4px 8px}'
    + '#frm .frow{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.06)}#frm .frow:last-child{border-bottom:0}#frm .frow.me{color:#ffd43b}'
    + '#frm .fn{flex:1;min-width:0;cursor:pointer}#frm .fn b{display:block;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#frm .fn small{opacity:.75;font-size:12px}'
    + '#frm .fg{flex:none;border:0;border-radius:10px;padding:8px 10px;font-weight:800;font-size:13px;background:var(--gold,#ffd43b);color:#1a1200;cursor:pointer}#frm .fg[disabled]{background:rgba(255,255,255,.1);color:inherit;opacity:.7}'
    + '#frm .fk{width:26px;text-align:center;font-weight:800;flex:none}#frm .fsm{font-size:13px;opacity:.8;margin:6px 0 10px}#frm .fc{border:1px solid var(--line,rgba(255,255,255,.12));border-radius:16px;padding:6px 14px;margin:0 0 12px;background:rgba(255,255,255,.03)}';
  document.head.appendChild(st);

  // the card at the top of the Leaders tab (after the contests card)
  function card() {
    const v = document.getElementById('view'); if (!v) return;
    let lb = false; try { lb = VIEW === 'leaders'; } catch (e) {}
    if (!lb || document.getElementById('frcard')) return;
    const h = document.getElementById('rkcard') || v.querySelector('h1'); if (!h) return;
    const T = L();
    const d = document.createElement('button'); d.id = 'frcard'; d.type = 'button';
    d.style.cssText = 'display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:1px solid #4ff0b7;background:linear-gradient(135deg,rgba(79,240,183,.18),rgba(79,240,183,.04));border-radius:16px;padding:12px 14px;margin:0 0 12px;color:inherit';
    d.innerHTML = '<span style="font-size:30px;line-height:1">👥</span><span style="flex:1"><b style="display:block">' + ec(T.card) + '</b><small style="opacity:.8">' + ec(T.cardx) + '</small></span><span style="background:#4ff0b7;color:#06281c;font-weight:800;border-radius:10px;padding:6px 12px">' + ec(T.see) + '</span>';
    d.onclick = () => { hp(); show(); };
    h.insertAdjacentElement('afterend', d);
  }
  function watch() {
    const v = document.getElementById('view'); if (!v) return false;
    new MutationObserver(() => setTimeout(card, 0)).observe(v, { childList: true });
    card(); return true;
  }
  if (!watch()) { let n = 0; const w = setInterval(() => { if (watch() || ++n > 80) clearInterval(w); }, 250); }

  function closeIt() { const d = document.getElementById('frm'); if (d) d.remove(); }
  async function show() {
    let d = document.getElementById('frm');
    if (!d) {
      d = document.createElement('div'); d.id = 'frm';
      d.innerHTML = '<div class="fbox"><div class="ftop"><b>' + ec(L().t) + '</b><button class="fx" id="frx" aria-label="' + ec(L().close) + '">✕</button></div><div id="frb" style="text-align:center;padding:30px 0">⏳</div></div>';
      d.onclick = (e) => { if (e.target === d) closeIt(); };
      document.body.appendChild(d);
      d.querySelector('#frx').onclick = () => { hp(); closeIt(); };
    }
    let r = null; try { r = await call({ action: 'list' }); } catch (e) {}
    const b = document.getElementById('frb'); if (!b) return;
    if (!r || !r.ok) { b.textContent = L().err; return; }
    D = r; paint();
  }
  function paint() {
    const b = document.getElementById('frb'); if (!b || !D) return;
    const T = L(), list = D.list || [], gift = big(D.gift || 500);
    const others = list.filter((x) => !x.me);
    const rows = list.map((x, i) => '<div class="frow' + (x.me ? ' me' : '') + '"><span class="fk">' + (['🥇', '🥈', '🥉'][i] || (i + 1)) + '</span>' + av(x)
      + '<span class="fn" data-pid="' + x.pid + '"><b>' + ec(x.name) + (x.dev ? ' <small>👨‍💻 ' + ec(T.dev) + '</small>' : '') + (x.me ? ' (' + ec(T.you) + ')' : '') + '</b><small>' + big(x.worth) + (x.active && !x.me ? ' · 🟢 ' + ec(T.on) : '') + '</small></span>'
      + (x.me ? '' : '<button class="fg" data-g="' + x.pid + '"' + (x.gifted ? ' disabled' : '') + '>' + ec(x.gifted ? T.sent : T.gift(gift)) + '</button>') + '</div>').join('');
    // 16 oct 2026: friend requests received, to accept or refuse
    const rin = (D.requests && D.requests.in) || [];
    const rq = rin.length ? '<div class="fc" style="border-color:#ffd43b"><p class="fsm" style="margin:8px 0 2px"><b>' + ec(T.reqs) + ' (' + rin.length + ')</b></p>' + rin.map((x) => '<div class="frow">' + av(x) + '<span class="fn" data-pid="' + x.pid + '"><b>' + ec(x.name) + '</b></span><button class="fg" data-acc="' + x.pid + '">' + ec(T.acc) + '</button><button class="fg" data-ref="' + x.pid + '" style="background:rgba(255,255,255,.1);color:inherit" aria-label="' + ec(T.refb) + '">✕</button></div>').join('') + '</div>' : '';
    b.style.cssText = '';
    b.innerHTML = rq + (others.length ? '<div class="fc">' + rows + '</div>' : '<p class="fsm" style="text-align:center;margin:10px 0 16px">' + ec(T.none) + '</p>')
      + (Number(D.received) ? '<p class="fsm">🎁 ' + ec(T.gifts) + ' : <b>' + D.received + '</b></p>' : '')
      + '<button class="btn" id="fradd">' + ec(T.add) + '</button>';
    b.querySelectorAll('[data-pid]').forEach((x) => x.onclick = () => { if (typeof window.mctProfile !== 'function') return; hp(); closeIt(); window.mctProfile(x.dataset.pid); });
    b.querySelectorAll('[data-acc],[data-ref]').forEach((x) => x.onclick = async () => {
      const yes = !!x.dataset.acc, id = x.dataset.acc || x.dataset.ref; hp('medium');
      x.parentNode.querySelectorAll('button').forEach((y) => { y.disabled = true; });
      let r = null; try { r = await call({ action: 'answer', id, yes }); } catch (e) {}
      if (!r || !r.ok) { tst(T.err); x.parentNode.querySelectorAll('button').forEach((y) => { y.disabled = false; }); return; }
      tst(yes ? T.added(r.name || '') : T.ref); show();
    });
    b.querySelectorAll('[data-g]').forEach((x) => x.onclick = async () => {
      if (x.disabled) return; hp('medium'); x.disabled = true;
      let r = null; try { r = await call({ action: 'gift', id: x.dataset.g }); } catch (e) {}
      if (r && r.ok) { x.textContent = T.sent; tst(T.okg(big(r.amount))); const f = (D.list || []).find((y) => String(y.pid) === x.dataset.g); if (f) f.gifted = true; }
      else { tst(r && r.error === 'full' ? T.full : r && r.error === 'already' ? T.already : T.err); if (!(r && r.error === 'already')) x.disabled = false; }
    });
    document.getElementById('fradd').onclick = () => {
      hp(); const link = 'https://t.me/Memecointycoonbot?startapp=r_' + me();
      const u = 'https://t.me/share/url?url=' + encodeURIComponent(link) + '&text=' + encodeURIComponent(T.share);
      try { tw.openTelegramLink(u); } catch (e) { window.open(u, '_blank'); }
    };
  }
  window.mctFriends = show;
  // 19 oct 2026 (Jeremy): send a gift back in one tap from a notification (notif.js)
  window.mctGift = (id) => call({ action: 'gift', id: String(id) }).catch(() => null);

  // 16 oct 2026 (Jeremy): "Add as friend" right on the profile of another player (leaderboard, contests, friends list)
  let PID = 0;
  // the profile sheet (profile.js) loads through tonCall({action:'profile'}): keep the pid of the player shown (0 for me or an AI)
  const oc = window.tonCall;
  if (typeof oc === 'function') window.tonCall = async (body) => {
    if (body && body.action === 'profile') PID = 0;
    const r = await oc(body);
    if (body && body.action === 'profile' && r && r.ok) PID = r.me || r.ai ? 0 : Number(r.pid) || 0;
    return r;
  };
  async function friendIds() {
    if (!D) { try { const r = await call({ action: 'list' }); if (r && r.ok) D = r; } catch (e) {} }
    return new Set(((D && D.list) || []).map((f) => Number(f.pid)));
  }
  async function profBtn() {
    const b = document.getElementById('pfb'), h = b && b.querySelector('.phead');
    if (!h || document.getElementById('pfadd') || !PID || PID === me()) return;
    const pid = PID, T = L(), x = document.createElement('button');
    x.id = 'pfadd'; x.className = 'btn'; x.style.cssText = 'width:100%;margin:10px 0 12px'; x.disabled = true; x.textContent = '⏳';
    h.after(x);
    const isF = (await friendIds()).has(pid), sent = ((D && D.requests && D.requests.out) || []).map(Number).includes(pid);
    if (PID !== pid) return;
    if (isF) { x.className = 'btn ghost'; x.textContent = T.isf; return; }
    if (sent) { x.className = 'btn ghost'; x.textContent = T.pend; return; }
    x.disabled = false; x.textContent = T.padd;
    x.onclick = async () => {
      hp('medium'); x.disabled = true;
      let r = null; try { r = await call({ action: 'req', id: pid }); } catch (e) {}
      if (r && r.ok) { x.className = 'btn ghost'; x.textContent = r.friend ? T.isf : T.pend; D = null; tst(r.friend ? T.added(r.name || '') : T.rsent(r.name || '')); }
      else { x.disabled = false; tst(T.err); }
    };
  }
  new MutationObserver(() => { if (document.querySelector('#pfb .phead') && !document.getElementById('pfadd')) profBtn(); }).observe(document.body, { childList: true, subtree: true });

  // a link r_<id> opened by a player who already plays: that player becomes a friend (a new player is linked by the referral itself)
  const sp = String((tw && tw.initDataUnsafe && tw.initDataUnsafe.start_param) || '');
  const m = /^r_(\d+)/.exec(sp);
  if (m && Number(m[1]) !== me()) setTimeout(async () => {
    let r = null; try { r = await call({ action: 'add', id: m[1] }); } catch (e) {}
    if (r && r.ok) tst(r.friend ? L().added(r.name) : L().rsent(r.name)); // 16 oct 2026: a request, the other player accepts
  }, 4000);
  if (/friends/.test(sp)) { let n = 0; const w = setInterval(() => { n++; let ok = false; try { ok = !!document.querySelector('nav.tb'); } catch (e) {} if (ok || n > 60) { clearInterval(w); if (ok) show(); } }, 250); }
})();

