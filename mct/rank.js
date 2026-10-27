// 16 oct 2026 (Jeremy): the three weekly rankings of Meme Coin Tycoon, each with real TON prizes on Monday ($1.00 / $0.50 / $0.25):
// 📈 best player (biggest trading gain since Monday, only trading counts), 👥 best sponsor (friends who really play), 💎 best tapper (the diamond).
// A card at the top of the Leaders tab opens them. Data from the Supabase function mct-ton (action 'ranks').
(() => {
  const TX = {
    id: { t: 'Kontes minggu ini', pl: '📈 Keuntungan', rf: '👥 Pengundang', dg: '💎 Pengetuk', ends: 'Berakhir dalam', prizes: 'Hadiah Senin dalam TON asli', you: 'kamu', rank: 'Peringkatmu',
      nobody: 'Belum ada: ambil posisi teratas!', err: 'Masalah koneksi, coba lagi.', close: 'Tutup',
      plx: 'Total keuntungan trading terbaik sejak Senin (untung dikurangi rugi). Hanya trading yang dihitung, bukan bonus, tambang atau stars. Minimal 3 transaksi.', plme: (g, n) => 'Minggumu: ' + g + ' · ' + n + ' transaksi',
      rfx: 'Paling banyak teman yang benar-benar bermain (3 hari berbeda).', rfb: '👥 Undang temanku', dgx: 'Paling banyak ketukan berlian minggu ini.', dgb: '💎 Ketuk berlian', plb: '🪙 Ke pasar',
      u: { pl: '', rf: 'teman', dg: 'ketukan' } },
    fa: { t: 'مسابقه‌های هفته', pl: '📈 سود', rf: '👥 دعوت‌کننده', dg: '💎 ضربه‌زن', ends: 'پایان تا', prizes: 'جوایز دوشنبه با TON واقعی', you: 'تو', rank: 'رتبه تو',
      nobody: 'هنوز کسی نیست: اول شو!', err: 'مشکل اتصال، دوباره امتحان کن.', close: 'بستن',
      plx: 'بیشترین سود کل معاملات از دوشنبه (سود منهای زیان). فقط معامله حساب می‌شود، نه جایزه، استخراج یا ستاره. حداقل 3 معامله.', plme: (g, n) => 'هفته تو: ' + g + ' · ' + n + ' معامله',
      rfx: 'بیشترین دوستانی که واقعاً بازی می‌کنند (3 روز مختلف).', rfb: '👥 دعوت از دوستانم', dgx: 'بیشترین ضربه روی الماس در این هفته.', dgb: '💎 ضربه به الماس', plb: '🪙 رفتن به بازار',
      u: { pl: '', rf: 'دوست', dg: 'ضربه' } },
    ru: { t: 'Конкурсы недели', pl: '📈 Прибыль', rf: '👥 Реферер', dg: '💎 Тапер', ends: 'До конца', prizes: 'Призы в понедельник в настоящих TON', you: 'ты', rank: 'Твоё место',
      nobody: 'Пока никого: займи первое место!', err: 'Проблема с соединением, попробуй ещё раз.', close: 'Закрыть',
      plx: 'Лучший общий торговый результат с понедельника (прибыль минус убытки). Считается только торговля, не бонусы, майнинг или звёзды. Минимум 3 сделки.', plme: (g, n) => 'Твоя неделя: ' + g + ' · ' + n + ' сделок',
      rfx: 'Больше всего друзей, которые реально играют (3 разных дня).', rfb: '👥 Пригласить друзей', dgx: 'Больше всего нажатий на алмаз за неделю.', dgb: '💎 Нажимать на алмаз', plb: '🪙 На рынок',
      u: { pl: '', rf: 'друзей', dg: 'нажатий' } },
    en: { t: 'Contests of the week', pl: '📈 Gains', rf: '👥 Sponsor', dg: '💎 Tapper', ends: 'Ends in', prizes: 'Monday prizes in real TON', you: 'you', rank: 'Your rank',
      nobody: 'Nobody yet: take the lead!', err: 'Connection problem, try again.', close: 'Close',
      plx: 'The best total trading gain since Monday (gains minus losses). Only trading counts, not bonuses, mining or stars. At least 3 trades.', plme: (g, n) => 'Your week: ' + g + ' · ' + n + ' trades',
      rfx: 'The most friends who really play (3 different days).', rfb: '👥 Invite my friends', dgx: 'The most taps on the diamond this week.', dgb: '💎 Tap the diamond', plb: '🪙 Go to the market',
      u: { pl: '', rf: 'friends', dg: 'taps' } },
    fr: { t: 'Concours de la semaine', pl: '📈 Gains', rf: '👥 Parrain', dg: '💎 Tapeur', ends: 'Fin dans', prizes: 'Gains du lundi en vrais TON', you: 'toi', rank: 'Ton rang',
      nobody: 'Personne pour l\'instant : prends la tête !', err: 'Problème de connexion, réessaie.', close: 'Fermer',
      plx: 'Le meilleur gain total en trading depuis lundi (gains moins pertes). Seul le trading compte, pas les bonus, le minage ou les étoiles. Au moins 3 trades.', plme: (g, n) => 'Ta semaine : ' + g + ' · ' + n + ' trades',
      rfx: 'Le plus d\'amis qui jouent vraiment (3 jours différents).', rfb: '👥 Inviter mes amis', dgx: 'Le plus de tapes sur le diamant cette semaine.', dgb: '💎 Taper le diamant', plb: '🪙 Aller au marché',
      u: { pl: '', rf: 'amis', dg: 'tapes' } },
    ar: { t: 'مسابقات الأسبوع', pl: '📈 الأرباح', rf: '👥 داعٍ', dg: '💎 ضاغط', ends: 'تنتهي خلال', prizes: 'جوائز يوم الاثنين بعملة TON حقيقية', you: 'أنت', rank: 'ترتيبك',
      nobody: 'لا أحد بعد: تصدّر الترتيب!', err: 'مشكلة في الاتصال، حاول مرة أخرى.', close: 'إغلاق',
      plx: 'أفضل ربح إجمالي من التداول منذ الاثنين (الأرباح ناقص الخسائر). التداول فقط يُحتسب (لا المكافآت ولا التعدين ولا النجوم). 3 صفقات على الأقل.', plme: (g, n) => 'أسبوعك: ' + g + ' · ' + n + ' صفقات',
      rfx: 'أكثر عدد من الأصدقاء الذين يلعبون فعلًا (3 أيام مختلفة).', rfb: '👥 ادعُ أصدقائي', dgx: 'أكثر عدد من الضغطات على الماسة هذا الأسبوع.', dgb: '💎 اضغط على الماسة', plb: '🪙 إلى السوق',
      u: { pl: '', rf: 'أصدقاء', dg: 'ضغطة' } },
  };
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] ? l : 'en'; };
  const L = () => TX[lg()];
  const hp = () => { try { haptic(); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const nf = (n) => Number(n || 0).toLocaleString(lg() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: 0 });
  const usd = (v) => { const x = Number(v || 0).toFixed(2); return lg() === 'fr' ? x.replace('.', ',') + ' $' : '$' + x; };
  const big = (v) => (Number(v) >= 0 ? '+' : '-') + (lg() === 'fr' ? nf(Math.abs(v)) + ' $' : '$' + nf(Math.abs(v)));
  let D = null, TAB = 'pl';

  const st = document.createElement('style');
  st.textContent = '#rkm{position:fixed;inset:0;z-index:9998;background:rgba(5,3,15,.78);display:flex;align-items:flex-end;justify-content:center}'
    + '#rkm .rbox{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:16px 16px calc(20px + env(safe-area-inset-bottom))}'
    + '#rkm .rtop{display:flex;align-items:center;justify-content:space-between;margin:0 0 10px}#rkm .rtop b{font-size:18px}#rkm .rx{background:none;border:0;color:inherit;font-size:22px;opacity:.7;cursor:pointer;padding:4px 8px}'
    + '#rkm .rtabs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:0 0 12px}#rkm .rtabs button{border:1px solid var(--line,rgba(255,255,255,.12));background:rgba(255,255,255,.04);color:inherit;border-radius:12px;padding:9px 4px;font-weight:700;font-size:14px;cursor:pointer}'
    + '#rkm .rtabs button.on{background:#ffd43b;color:#1a1200;border-color:#ffd43b}'
    + '#rkm .rc{border:1px solid var(--line,rgba(255,255,255,.12));border-radius:16px;padding:14px;margin:0 0 12px;background:rgba(255,255,255,.03)}'
    + '#rkm .rsm{font-size:13px;opacity:.8;margin:2px 0 8px}#rkm .rrow{display:flex;justify-content:space-between;gap:8px;font-size:14px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.06)}#rkm .rrow:last-child{border-bottom:0}'
    + '#rkm .rrow.me{color:#ffd43b;font-weight:700}#rkm .rpz{display:flex;gap:6px;margin:0 0 10px}#rkm .rpz span{flex:1;text-align:center;background:rgba(255,212,59,.12);border-radius:10px;padding:6px 2px;font-size:13px;font-weight:700}';
  document.head.appendChild(st);

  // 16 oct 2026 (Jeremy): no button at the top: a "contests of the week" card at the top of the Leaders tab opens the three contests
  const CARD = {
    id: { t: '🏆 Kontes minggu ini', x: '3 kontes, TON asli untuk dimenangkan setiap Senin', b: 'Lihat' },
    fa: { t: '🏆 مسابقه‌های هفته', x: '3 مسابقه، هر دوشنبه TON واقعی ببر', b: 'دیدن' }, ru: { t: '🏆 Конкурсы недели', x: '3 конкурса, настоящие TON каждый понедельник', b: 'Смотреть' }, en: { t: '🏆 Contests of the week', x: '3 contests, real TON to win every Monday', b: 'See' },
    fr: { t: '🏆 Concours de la semaine', x: '3 concours, de vrais TON à gagner chaque lundi', b: 'Voir' },
    ar: { t: '🏆 مسابقات الأسبوع', x: '3 مسابقات، عملات TON حقيقية كل يوم اثنين', b: 'عرض' },
  };
  function card() {
    const v = document.getElementById('view'); if (!v) return;
    let lb = false; try { lb = VIEW === 'leaders'; } catch (e) {}
    if (!lb || document.getElementById('rkcard')) return;
    const h = v.querySelector('h1'); if (!h) return;
    const C = CARD[lg()] || CARD.en;
    const d = document.createElement('button'); d.id = 'rkcard'; d.type = 'button';
    d.style.cssText = 'display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:1px solid var(--gold,#ffd43b);background:linear-gradient(135deg,rgba(255,212,59,.18),rgba(255,212,59,.04));border-radius:16px;padding:12px 14px;margin:0 0 12px;color:inherit';
    d.innerHTML = '<span style="font-size:30px;line-height:1">💰</span><span style="flex:1"><b style="display:block">' + ec(C.t) + '</b><small style="opacity:.8">' + ec(C.x) + '</small></span><span style="background:var(--gold,#ffd43b);color:#1a1200;font-weight:800;border-radius:10px;padding:6px 12px">' + ec(C.b) + '</span>';
    d.onclick = () => { hp(); show(); };
    h.insertAdjacentElement('afterend', d);
  }
  function watch() {
    const v = document.getElementById('view'); if (!v) return false;
    new MutationObserver(() => card()).observe(v, { childList: true });
    card(); return true;
  }
  if (!watch()) { let n = 0; const w = setInterval(() => { if (watch() || ++n > 80) clearInterval(w); }, 250); }

  function cd(end) { const x = Math.max(0, Math.floor((Date.parse(end) - Date.now()) / 1000)), d = Math.floor(x / 86400), p = (n) => String(n).padStart(2, '0'); return (d ? d + (lg() === 'fr' ? 'j ' : 'd ') : '') + p(Math.floor(x % 86400 / 3600)) + ':' + p(Math.floor(x % 3600 / 60)) + ':' + p(x % 60); }
  setInterval(() => { const e = document.getElementById('rkcd'); if (e) e.textContent = cd(e.dataset.end); }, 1000);

  const PZB = { en: 'Monday prizes in $BATON on Pass The Baton · 10,000 from 4th to 10th · 1,000 for every other ranked player', fr: 'Gains du lundi en $BATON sur Pass The Baton · 10 000 du 4e au 10e · 1 000 pour tous les autres classés', ru: 'Призы в понедельник в $BATON в Pass The Baton · 10 000 с 4-го по 10-е · 1 000 всем остальным в рейтинге', ar: 'جوائز الاثنين بـ $BATON في Pass The Baton · 10,000 من الرابع إلى العاشر · 1,000 لكل المصنّفين الآخرين', fa: 'جوایز دوشنبه با $BATON در Pass The Baton · ۱۰٬۰۰۰ برای نفر ۴ تا ۱۰ · ۱٬۰۰۰ برای بقیه رتبه‌ها', id: 'Hadiah Senin dalam $BATON di Pass The Baton · 10.000 untuk peringkat 4-10 · 1.000 untuk semua peserta lain' };
  function closeIt() { const d = document.getElementById('rkm'); if (d) d.remove(); }
  async function show(tab) {
    if (tab) TAB = tab;
    let d = document.getElementById('rkm');
    if (!d) {
      d = document.createElement('div'); d.id = 'rkm';
      d.innerHTML = '<div class="rbox"><div class="rtop"><b>🏆 ' + ec(L().t) + '</b><button class="rx" id="rkx" aria-label="' + ec(L().close) + '">✕</button></div><div id="rkb" style="text-align:center;padding:30px 0">⏳</div></div>';
      d.onclick = (e) => { if (e.target === d) closeIt(); };
      document.body.appendChild(d);
      d.querySelector('#rkx').onclick = () => { hp(); closeIt(); };
    }
    let r = null; try { r = await tonCall({ action: 'ranks' }); } catch (e) {}
    const b = document.getElementById('rkb'); if (!b) return;
    if (!r || !r.ok) { b.textContent = L().err; return; }
    D = r; paint();
  }

  function paint() {
    const b = document.getElementById('rkb'); if (!b || !D) return;
    const T = L(), c = TAB === 'pl' ? D.player : TAB === 'rf' ? D.ref : D.dia;
    const md = ['🥇', '🥈', '🥉'], pz = (c && c.prizes) || [];
    // 27 oct 2026 (Jeremy): from the week of 2 November, the gains contest pays $BATON on Pass The Baton (server mct_week_board unit 'BATON')
    const bt = !!(c && c.unit === 'BATON'), kb = (n) => (Number(n) >= 1000 ? Math.round(Number(n) / 1000) + 'K' : String(n)) + ' $BATON';
    const val = (n) => TAB === 'pl' ? big(n) : nf(n) + ' ' + T.u[TAB];
    // 16 oct 2026 (Jeremy): Jeremy shows with 👨‍💻 at his place, out of the ranking and the prizes (the medals stay with the players)
    const list = ((c && c.top) || []).slice(0, 10).map((x, i) => ({ x, lab: md[i] || (i + 1) + '.' }));
    if (c && c.dev) { let k = list.findIndex((y) => Number(y.x.n) < Number(c.dev.n)); if (k < 0) k = list.length; list.splice(k, 0, { x: { name: c.dev.name, n: c.dev.n, pid: c.dev.pid }, lab: '👨‍💻', dev: true }); }
    const rows = list.map(({ x, lab, dev }) => '<div class="rrow' + (x.me ? ' me' : '') + '"' + (x.pid ? ' data-pid="' + x.pid + '"' : '') + (dev ? ' style="opacity:.8;cursor:pointer"' : x.pid ? ' style="cursor:pointer"' : '') + '><span>' + lab + ' ' + ec(x.name) + (dev ? ' <small style="opacity:.7">dev</small>' : '') + (x.me ? ' (' + ec(T.you) + ')' : '') + '</span><span>' + ec(val(x.n)) + '</span></div>').join('')
      || '<p class="rsm" style="text-align:center;margin:8px 0">' + ec(T.nobody) + '</p>';
    let me = '';
    if (c && c.me && c.me.rank) me = '<p class="rsm" style="margin:8px 0 0">' + ec(T.rank) + ' : <b>#' + c.me.rank + '</b> · ' + ec(val(c.me.n)) + '</p>';
    else if (TAB === 'pl' && c && c.mine) me = '<p class="rsm" style="margin:8px 0 0">' + ec(T.plme(big(c.mine.gain), c.mine.trades)) + '</p>';
    const act = TAB === 'pl' ? '<button class="btn" id="rka">' + ec(T.plb) + '</button>' : TAB === 'rf' ? '<button class="btn" id="rka">' + ec(T.rfb) + '</button>' : '<button class="btn" id="rka">' + ec(T.dgb) + '</button>';
    b.style.cssText = '';
    b.innerHTML = '<div class="rtabs">' + ['pl', 'rf', 'dg'].map((k) => '<button data-rt="' + k + '" class="' + (k === TAB ? 'on' : '') + '">' + ec(T[k]) + '</button>').join('') + '</div>'
      + '<div class="rc"><p class="rsm">' + ec(TAB === 'pl' ? T.plx : TAB === 'rf' ? T.rfx : T.dgx) + '</p>'
      + (c && c.ends ? '<p class="rsm">' + ec(T.ends) + ' <b id="rkcd" data-end="' + ec(c.ends) + '">' + cd(c.ends) + '</b></p>' : '')
      + '<div class="rpz">' + pz.slice(0, 3).map((p, i) => '<span>' + md[i] + ' ' + (bt ? kb(p) : usd(p)) + '</span>').join('') + '</div><p class="rsm" style="margin:-4px 0 8px;font-size:12px">' + ec(bt ? (PZB[lg()] || PZB.en) : T.prizes) + '</p>'
      + rows + me + '</div>' + act;
    b.querySelectorAll('[data-rt]').forEach((x) => x.onclick = () => { hp(); TAB = x.dataset.rt; paint(); });
    // 16 oct 2026: a tap on a name opens that player's profile (profile.js)
    b.querySelectorAll('[data-pid]').forEach((x) => x.onclick = () => { if (typeof window.mctProfile !== 'function') return; hp(); closeIt(); window.mctProfile(x.dataset.pid); });
    document.getElementById('rka').onclick = () => {
      hp(); closeIt();
      if (TAB === 'dg') { const d = document.getElementById('diatop'); if (d) d.click(); }
      else if (TAB === 'rf') { try { tonPage(); } catch (e) {} }
      else { try { go('market'); } catch (e) {} }
    };
  }

  window.mctRanks = show; // 17 oct 2026: opened from the TON sheet too
  // a link ?startapp=src_rank... opens the rankings
  const sp = String((window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.start_param) || '');
  if (/rank/.test(sp)) { let n = 0; const w = setInterval(() => { n++; let ok = false; try { ok = !!document.querySelector('nav.tb') && !!document.getElementById('view'); } catch (e) {} if (ok || n > 60) { clearInterval(w); if (ok) show(); } }, 250); }
})();
