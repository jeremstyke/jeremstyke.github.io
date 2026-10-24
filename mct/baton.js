
// 22 oct 2026 (23h35, Jeremy): the game is renamed "Pass The Baton" in the popup, the mission and the TON sheet notice.
// 22 oct 2026 (Jeremy): Meme Coin Tycoon promotes Baton (@PassTheBatonBot):
// the daily mission "pass a baton on Baton" (checked by the server) and, since 16h15, a full-screen Baton popup
// once every 24 hours (it replaces the Baton card at the top of the market). The link brings newcomers into Jeremy's crew
// on Baton (src_ links); src_mctpop tells us how many came from this popup.
(function () {
  try {
    const S = {
      en: { m_baton: '🏃 Pass a baton on Pass The Baton', bp_tag: 'NEW GAME', bp_h: 'Earn real money with Pass The Baton', bp_1: '💰 300 $BATON every hour while you hold it', bp_2: '⏳ Pass it before the timer ends: up to +10,000', bp_3: '💵 Real money: 1 million $BATON = 1 $ in USDT, sent to your wallet', bp_b: '🏃 Play Pass The Baton', bp_n: '⚠️ On Meme Coin Tycoon, the TON referral program, the diamond and the TON payouts end on Sunday 1 November. Commissions already earned will be paid from $0.01. The weekly contests go on, now paid in $MCT (1,000 / 500 / 250).', bp_x: 'Later' },
      fr: { m_baton: '🏃 Passe un bâton sur Pass The Baton', bp_tag: 'NOUVEAU JEU', bp_h: 'Gagne de l\'argent réel avec Pass The Baton', bp_1: '💰 300 $BATON par heure tant que tu le tiens', bp_2: '⏳ Passe-le avant la fin du chrono : jusqu\'à +10 000', bp_3: '💵 De l\'argent réel : 1 million de $BATON = 1 $ en USDT, versé sur ton wallet', bp_b: '🏃 Jouer à Pass The Baton', bp_n: '⚠️ Sur Meme Coin Tycoon, le parrainage TON, le diamant et les versements en TON s\'arrêtent le dimanche 1er novembre. Les commissions déjà gagnées seront payées dès 0,01 $. Les concours de la semaine continuent, payés en $MCT (1 000 / 500 / 250).', bp_x: 'Plus tard' },
      ar: { m_baton: '🏃 مرّر عصا في Pass The Baton', bp_tag: 'لعبة جديدة', bp_h: 'اربح مالًا حقيقيًا مع Pass The Baton', bp_1: '💰 300 $BATON كل ساعة ما دامت معك', bp_2: '⏳ مرّرها قبل انتهاء الوقت: حتى +10 000', bp_3: '💵 مال حقيقي: مليون $BATON = 1 $ USDT تُرسل إلى محفظتك', bp_b: '🏃 العب Pass The Baton', bp_n: '⚠️ في Meme Coin Tycoon، تنتهي الإحالة TON والماسة ودفعات TON يوم الأحد 1 نوفمبر. العمولات المكتسبة ستُدفع ابتداءً من 0.01 $. تستمر المسابقات الأسبوعية بجوائز $MCT (1000 / 500 / 250).', bp_x: 'لاحقًا' },
      id: { m_baton: '🏃 Oper tongkat di Pass The Baton', bp_tag: 'GAME BARU', bp_h: 'Dapatkan uang sungguhan dengan Pass The Baton', bp_1: '💰 300 $BATON per jam selama kamu memegangnya', bp_2: '⏳ Oper sebelum waktu habis: hingga +10 000', bp_3: '💵 Uang sungguhan: 1 juta $BATON = 1 $ USDT, dikirim ke dompetmu', bp_b: '🏃 Main Pass The Baton', bp_n: '⚠️ Di Meme Coin Tycoon, referral TON, berlian, dan pembayaran TON berakhir Minggu 1 November. Komisi yang sudah didapat dibayar mulai $0.01. Kontes mingguan tetap ada, dibayar dalam $MCT (1.000 / 500 / 250).', bp_x: 'Nanti' }
    };
    for (const k in S) if (typeof L === 'object' && L[k]) Object.assign(L[k], S[k]);
    const URL = 'https://t.me/PassTheBatonBot/play?startapp=src_mctpop';
    const open = () => { try { tw.openTelegramLink(URL); } catch (e) { location.href = URL; } };
    if (typeof MSN_GO === 'object') MSN_GO.baton = () => { try { tw.openTelegramLink('https://t.me/PassTheBatonBot/play?startapp=src_mct'); } catch (e) {} };
    const lang = () => { try { return (typeof LANG === 'string' && S[LANG]) ? LANG : 'en'; } catch (e) { return 'en'; } };
    const txt = (k) => (S[lang()] || S.en)[k] || S.en[k];
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const get = () => { try { return Number(localStorage.getItem('mct_bt_pop10') || 0); } catch (e) { return Date.now(); } };
    const set = () => { try { localStorage.setItem('mct_bt_pop10', String(Date.now())); } catch (e) {} };
    let tries = 0;
    // 22 oct 2026 (18h45, Jeremy): at opening, when the Baton popup is not shown, an Adsgram interstitial (block int-55508). Never for Premium.
    function adInt() {
      try {
        const go = () => { try { window.Adsgram.init({ blockId: 'int-55508' }).show().catch(() => {}); } catch (e) {} };
        if (window.Adsgram) return go();
        if (!document.querySelector('script[src*="sad.adsgram.ai"]')) { const s = document.createElement('script'); s.src = 'https://sad.adsgram.ai/js/sad.min.js'; document.head.appendChild(s); }
        let n = 0; const w = setInterval(() => { if (window.Adsgram) { clearInterval(w); go(); } else if (++n > 20) clearInterval(w); }, 300);
      } catch (e) {}
    }
    // 22 oct 2026 (18h49, Jeremy): the interstitial comes after the first buy or sell of the session instead of at opening,
    // at most once every 30 minutes, never in a new player's first 3 days, never for Premium
    try {
      const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
      if (!ls('mct_first_seen')) ls('mct_first_seen', ls('mct_bt_pop10') || ls('mct_bt_pop') ? '1' : String(Date.now()));  // players already here count as old
      let done = true;  // 21h16 (Jeremy): the interstitial is back at opening, no more after the first trade
      const of = window.fetch;
      window.fetch = async function (u, o) {
        const r = await of.apply(this, arguments);
        try {
          if (!done && String(u).indexOf('/mct/api') >= 0 && o && typeof o.body === 'string' && /"action":"(buy|sell)"/.test(o.body)) {
            r.clone().json().then((j) => {
              if (done || !j || j.error || j.ok === false || window.MCTPREM) return;
              // 18h51 (Jeremy): no rule for new players, the only exclusion is Premium
              if (Date.now() - Number(ls('mct_int_at') || 0) < 30 * 60000) return;
              done = true; ls('mct_int_at', String(Date.now())); setTimeout(adInt, 1200);  // let the trade's toast show first
            }).catch(() => {});
          }
        } catch (e) {}
        return r;
      };
    } catch (e) {}
    function popup() {
      if (document.getElementById('btpop')) return;
      // 22 oct 2026 (16h23, Jeremy): never for Premium players (prem.js sets window.MCTPREM once it knows)
      if (typeof window.MCTPREM === 'undefined' && tries++ < 20) { setTimeout(popup, 500); return; }
      // 22 oct 2026 (18h06, Jeremy): the new "real money" text is shown once to everyone (new key), and to Jeremy too so he can see it
      let own = false; try { own = String(ME.uid) === '7057960224'; } catch (e) {}
      if (window.MCTPREM && !own) return;
      // 18h43: Jeremy sees each new version once (his own key), everyone else once every 24 h
      if (document.querySelector('#maint:not([hidden]), .maint:not([hidden])')) return;  // never over the maintenance screen (no popup, no ad)
      const K = own ? 'mct_bt_pop11o' : 'mct_bt_pop10';
      let seen = 0; try { seen = Number(localStorage.getItem(K) || 0); } catch (e) { seen = Date.now(); }
      if (seen) {  /* 24 oct 2026 (10h19, Jeremy): one hour at least between two opening interstitials */
        let last = 0; try { last = Number(localStorage.getItem('mct_int_open') || 0); } catch (e) {}
        if (!last) { try { localStorage.setItem('mct_int_open', String(Date.now())); } catch (e) {} return; }  /* never on the first visit */
        if (!window.MCTPREM && Date.now() - last >= 3600000) { try { localStorage.setItem('mct_int_open', String(Date.now())); } catch (e) {} adInt(); }
        return;
      }  // 21h16 (Jeremy): the Baton popup only once ever, then an Adsgram interstitial at each opening (never for Premium)
      try { localStorage.setItem(K, String(Date.now())); } catch (e) {}
      if (document.querySelector('#maint:not([hidden]), .maint:not([hidden])')) return;  // never over the maintenance screen
      set();
      const rtl = lang() === 'ar';
      const el = document.createElement('div'); el.id = 'btpop'; if (rtl) el.dir = 'rtl';
      el.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px max(16px,env(safe-area-inset-right,0px)) 24px max(16px,env(safe-area-inset-left,0px));background:rgba(3,8,20,.82);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)';
      el.innerHTML = '<div style="width:100%;max-width:360px;border-radius:26px;padding:26px 22px 18px;background:radial-gradient(90% 60% at 50% 0%,rgba(47,141,255,.38),transparent 70%),#0b1626;border:1px solid rgba(80,150,255,.35);box-shadow:0 20px 60px rgba(0,0,0,.6);color:#e9f1ff;text-align:center;font-family:inherit">' +
        '<div style="display:inline-block;padding:4px 10px;border-radius:99px;background:#ffc531;color:#08121f;font-weight:800;font-size:11px;letter-spacing:.08em">' + esc(txt('bp_tag')) + '</div>' +
        '<div style="font-size:56px;line-height:1;margin:14px 0 4px">🏃</div>' +
        '<div style="font-size:34px;font-weight:900;letter-spacing:.02em;line-height:1.05"><span style="display:block;font-size:13px;letter-spacing:.32em;color:#8fc0ff">PASS THE</span>BATON</div>' +
        '<div style="font-size:17px;font-weight:800;margin:6px 0 16px;color:#ffc531">' + esc(txt('bp_h')) + '</div>' +
        '<div style="display:flex;flex-direction:column;gap:8px;text-align:' + (rtl ? 'right' : 'left') + ';font-size:14px;line-height:1.35;margin-bottom:18px">' +
        ['bp_1', 'bp_2', 'bp_3'].map((k) => '<div style="padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.05)">' + esc(txt(k)) + '</div>').join('') + '</div>' +
        '<div style="margin:-6px 0 14px;padding:10px 12px;border-radius:14px;border:1px solid rgba(255,197,49,.45);background:rgba(255,197,49,.08);font-size:13px;line-height:1.4;text-align:start">' + esc(txt('bp_n')) + '</div>' +
        '<button id="btpop_go" style="width:100%;min-height:52px;border:0;border-radius:16px;background:linear-gradient(180deg,#3f9bff,#1f6fe0);color:#fff;font-weight:800;font-size:17px;cursor:pointer">' + esc(txt('bp_b')) + '</button>' +
        '<button id="btpop_x" style="margin-top:8px;width:100%;min-height:40px;border:0;background:none;color:rgba(233,241,255,.6);font-size:14px;cursor:pointer">' + esc(txt('bp_x')) + '</button></div>';
      document.body.appendChild(el);
      const close = () => el.remove();
      el.querySelector('#btpop_x').onclick = close;
      el.addEventListener('click', (e) => { if (e.target === el) close(); });
      el.querySelector('#btpop_go').onclick = () => { try { if (typeof haptic === 'function') haptic(); } catch (e) {} close(); open(); };
    }
    setTimeout(popup, 2500);  // after the app has drawn its first screen
  } catch (e) { console.error('baton bridge', e); }
})();

// 22 oct 2026 (Jeremy, 17h49): the TON referral program and the diamond stop on Sunday 1 November 2026; a notice in both sheets
// (the TON referral sheet #tonsheet and the diamond #diam), with a button to Baton where USDT can still be earned
(function () {
  try {
    const N = {
      en: ['⏳ The referral program and the diamond stop on Sunday 1 November. Commissions already earned are paid from $0.01.', '🏃 Keep earning USDT on Pass The Baton', 'Play'],
      fr: ['⏳ Le parrainage et le diamant s\'arrêtent le dimanche 1er novembre. Les commissions déjà gagnées sont payées dès 0,01 $.', '🏃 Continue de gagner des USDT sur Pass The Baton', 'Jouer'],
      ar: ['⏳ برنامج الإحالة والماسة يتوقفان يوم الأحد 1 نوفمبر. العمولات المكتسبة تُدفع ابتداءً من 0.01 $.', '🏃 واصل ربح USDT على Pass The Baton', 'العب'],
      id: ['⏳ Program referral dan berlian berhenti hari Minggu 1 November. Komisi yang sudah didapat dibayar mulai $0.01.', '🏃 Terus dapatkan USDT di Pass The Baton', 'Main'],
      ru: ['⏳ Реферальная программа и алмаз закрываются в воскресенье, 1 ноября. Заработанные комиссии выплатим от $0.01.', '🏃 Продолжай зарабатывать USDT в Pass The Baton', 'Играть'],
      fa: ['⏳ برنامه دعوت و الماس یکشنبه ۱ نوامبر تمام می‌شوند. کمیسیون‌های به‌دست‌آمده از ۰٫۰۱ دلار پرداخت می‌شوند.', '🏃 در Pass The Baton همچنان USDT بگیر', 'بازی']
    };
    const lg = () => { try { return (typeof LANG === 'string' && N[LANG]) ? LANG : 'en'; } catch (e) { return 'en'; } };
    const esc2 = (x) => String(x).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    function note() {
      const x = N[lg()];
      const el = document.createElement('div'); el.className = 'btend';
      el.style.cssText = 'margin:8px 0 12px;padding:12px 14px;border-radius:14px;border:1px solid rgba(80,160,255,.6);background:linear-gradient(135deg,rgba(47,141,255,.28),rgba(30,90,200,.12));text-align:start;color:#e9f1ff';
      el.innerHTML = '<div style="font-weight:800;font-size:14px;line-height:1.35">' + esc2(x[0]) + '</div><div style="display:flex;align-items:center;gap:10px;margin-top:8px"><span style="flex:1;font-size:13px">' + esc2(x[1]) + '</span><button type="button" style="border:0;border-radius:999px;padding:8px 14px;font-weight:800;background:#2f8dff;color:#fff;cursor:pointer">' + esc2(x[2]) + '</button></div>';
      el.querySelector('button').onclick = (e) => { e.stopPropagation(); try { if (typeof haptic === 'function') haptic(); } catch (er) {} try { tw.openTelegramLink('https://t.me/PassTheBatonBot/play?startapp=src_mctend'); } catch (er) {} };
      return el;
    }
    // 22 oct 2026 (20h24, Jeremy): no more $0.01 for subscribing to the 2 channels (new subscribers): the app's texts lose the "$0.01" part
    let stT = 0;
    function strip() {
      if (Date.now() - stT < 800) { clearTimeout(window.__stT); window.__stT = setTimeout(strip, 850); return; } stT = Date.now();
      try {
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
        while ((n = w.nextNode())) {
          const t = n.nodeValue; if (!t || !/0[.,]01/.test(t) || t.indexOf('📣') < 0) continue;
          let v = t.replace(/\s*·\s*📣[^·]*0[.,]01[^·]*?(?=\s*·|$)/g, '');
          if (/^\s*📣/.test(v) && /0[.,]01/.test(v)) v = v.indexOf(' · ') >= 0 ? v.slice(v.indexOf(' · ') + 3) : v.replace(/\s*[:：].*$/, '');
          if (v !== t) n.nodeValue = v;
        }
      } catch (e) {}
    }
    function put() {
      strip();
      const ts = document.querySelector('#tonsheet .tsx');
      if (ts && !ts.querySelector('.btend')) { const g = ts.querySelector('.grab'); g ? g.insertAdjacentElement('afterend', note()) : ts.prepend(note()); }
      const db = document.querySelector('#diam .dbox');
      if (db && !db.querySelector('.btend')) { const t = db.querySelector('.dtop'); const nn = note(); t ? t.insertAdjacentElement('afterend', nn) : db.prepend(nn);
        // 24 oct 2026 (Jeremy): the diamond comes back in its own mini app in a few days
        const D = { en: '💎 Tap the diamond is coming back in its own mini app in a few days. Stay tuned!', fr: '💎 Le diamant revient dans sa propre mini app dans quelques jours. Reste connecté !', es: '💎 El diamante vuelve en su propia mini app en unos días. ¡Atento!', ar: '💎 الماسة ستعود في تطبيق مصغّر خاص بها خلال أيام قليلة. ترقّبوا!', id: '💎 Berlian akan kembali di mini app khusus dalam beberapa hari. Nantikan!', ru: '💎 Алмаз вернётся в отдельном мини-приложении через несколько дней. Следи за новостями!', fa: '💎 الماس چند روز دیگر در مینی‌اپ مخصوص خودش برمی‌گردد. منتظر باش!' };
        const de = document.createElement('div'); de.className = 'btdia'; de.textContent = D[lg()] || D.en;
        de.style.cssText = 'margin:0 0 12px;padding:12px 14px;border-radius:14px;border:1px solid rgba(124,196,255,.6);background:rgba(124,196,255,.12);font-size:14px;font-weight:800;line-height:1.4;color:#eaf6ff';
        nn.insertAdjacentElement('afterend', de); }
      // 22 oct 2026 (22h13, Jeremy): the payout waiting to be sent is shown as such (the app counted it with "paid"), so players know it is on its way
      if (ts && !ts.querySelector('.btwait')) {
        let wt = 0; try { wt = Number((TONLAST && TONLAST.waiting) || 0); } catch (e) {}
        if (wt > 0) {
          let m = lg() === 'fr' ? wt.toFixed(3).replace('.', ',') + ' $' : '$' + wt.toFixed(3); try { if (typeof tonM === 'function') m = tonM(wt); } catch (e) {}
          const W = { fr: '⏳ ' + m + ' en cours d\'envoi vers ton wallet. Le bot te prévient dès que c\'est parti.', es: '⏳ ' + m + ' en camino a tu wallet. El bot te avisa en cuanto salga.', ru: '⏳ ' + m + ' отправляется на твой кошелёк. Бот сообщит, как только платёж уйдёт.', ar: '⏳ ' + m + ' في الطريق إلى محفظتك. سيخبرك البوت فور إرسالها.', id: '⏳ ' + m + ' sedang dikirim ke dompetmu. Bot akan memberi tahu begitu terkirim.', fa: '⏳ ' + m + ' در راه کیف پولت است. ربات به محض ارسال خبرت می‌کند.' };
          const el = document.createElement('div'); el.className = 'btwait';
          el.style.cssText = 'margin:0 0 12px;padding:10px 14px;border-radius:14px;border:1px solid rgba(255,212,59,.5);background:rgba(255,212,59,.1);font-size:13px;font-weight:700;line-height:1.35;color:#ffe9a3;text-align:start';
          el.textContent = W[lg()] || ('⏳ ' + m + ' on its way to your wallet. The bot tells you as soon as it is sent.');
          const en = ts.querySelector('.btend'); en ? en.insertAdjacentElement('afterend', el) : ts.prepend(el);
        }
      }
    }
    new MutationObserver(put).observe(document.body, { childList: true, subtree: true });
  } catch (e) { console.error('baton end notice', e); }
})();

// 23 oct 2026 (Jeremy): a banned player sees a "suspended" screen; if he still had money earned before the ban, he can add his TON wallet to get it
(function () {
  try {
    const fr = () => { try { return typeof LANG === 'string' && LANG === 'fr'; } catch (e) { return false; } };
    const esc3 = (x) => String(x == null ? '' : x).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    let shown = false;
    function banScreen(b) {
      b = b || {};
      let el = document.getElementById('banscr'); if (!el) { el = document.createElement('div'); el.id = 'banscr'; document.body.appendChild(el); }
      el.style.cssText = 'position:fixed;inset:0;z-index:1000000;display:flex;align-items:center;justify-content:center;padding:24px max(16px,env(safe-area-inset-right,0px)) 24px max(16px,env(safe-area-inset-left,0px));background:#0b0716;color:#f3eefe;font-family:inherit;text-align:center';
      const F = fr(), usd = Number(b.usd || 0), wait = Number(b.waiting || 0);
      let money = '';
      // 23 oct 2026 (Jeremy): what he was already paid, with the wallet on Tonviewer as proof
      const pt = Number(b.paid_ton || 0), pu = Number(b.paid_usd || 0);
      const paid = pt > 0 ? '<p style="margin:14px 0 0;font-size:15px;line-height:1.45">✅ ' + (F ? 'Déjà payé : ' + pt.toFixed(3).replace('.', ',') + ' TON (' + pu.toFixed(2).replace('.', ',') + ' $)' : 'Already paid: ' + pt.toFixed(3) + ' TON ($' + pu.toFixed(2) + ')')
        + '<br><a href="https://tonviewer.com/' + encodeURIComponent(b.paid_addr || '') + '" onclick="try{Telegram.WebApp.openLink(this.href);return false}catch(e){}" style="color:#7cc4ff">🔎 ' + (F ? 'Voir les paiements sur Tonviewer' : 'See the payments on Tonviewer') + '</a></p>' : '';
      if (wait > 0) money = '<p style="margin:14px 0 0;font-size:15px;line-height:1.45">' + (F ? '⏳ ' + wait.toFixed(2).replace('.', ',') + ' $ en cours d\'envoi sur ton wallet TON.' : '⏳ $' + wait.toFixed(2) + ' is on its way to your TON wallet.') + '</p>';
      else if (usd > 0) money = '<p style="margin:14px 0 8px;font-size:15px;line-height:1.45">' + (F ? '💰 ' + usd.toFixed(2).replace('.', ',') + ' $ à recevoir : ajoute ton wallet TON ci-dessous.' : '💰 $' + usd.toFixed(2) + ' to receive: add your TON wallet below.') + '</p>'
        + '<input id="banaddr" placeholder="UQ…" autocomplete="off" autocapitalize="off" spellcheck="false" value="' + esc3(b.wallet || '') + '" style="width:100%;box-sizing:border-box;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:inherit;font-size:14px">'
        + '<button id="bango" style="margin-top:10px;width:100%;min-height:48px;border:0;border-radius:14px;background:#2f8dff;color:#fff;font-weight:800;font-size:16px">' + (F ? 'Recevoir mon argent' : 'Get my money') + '</button><p id="banmsg" style="margin:8px 0 0;font-size:13px;opacity:.8"></p>';
      el.innerHTML = '<div style="width:100%;max-width:380px"><div style="font-size:54px">🚫</div><h2 style="margin:10px 0 6px;font-size:22px">' + (F ? 'Compte bloqué' : 'Account blocked') /* 24 oct 2026 (Jeremy): "bloqué", not "suspendu" */ + '</h2>'
        + '<p style="margin:0;font-size:15px;line-height:1.45;opacity:.85">' + /* 24 oct 2026 (Jeremy): the reason comes from the server (ban_status.reason) */ (b.reason === 'dup' ? (F ? '🤖 L\'IA a détecté plusieurs comptes sur la même IP et le même téléphone.<br>2 comptes maximum par IP.' : '🤖 The AI detected several accounts on the same IP and the same phone.<br>2 accounts per IP at most.') : ((F ? (b.reason === 'cheat' ? '🤖 Détecté par notre IA anti-triche.<br>Motif : triche.<br>Même téléphone et même adresse IP sur plusieurs comptes.' : b.reason === 'insults_cheat' ? 'Motif : insultes et triche.<br>Même téléphone et même adresse IP sur plusieurs comptes.' : 'Motif : insultes.') : (b.reason === 'cheat' ? '🤖 Detected by our anti-cheat AI.<br>Reason: cheating.<br>Same phone and same IP address on several accounts.' : b.reason === 'insults_cheat' ? 'Reason: insults and cheating.<br>Same phone and same IP address on several accounts.' : 'Reason: insults.')) + '<br>' + (F ? 'Les sommes gagnées ont été payées si tu avais ajouté ton wallet. Sinon, ajoute-le.' : 'What you earned has been paid if you had added your wallet. If not, add it.'))) + '</p>' + paid + money + '</div>';
      const go = el.querySelector('#bango');
      if (go) go.onclick = async () => {
        const addr = (el.querySelector('#banaddr').value || '').trim(); const m = el.querySelector('#banmsg'); go.disabled = true;
        try {
          const r = await window.__banFetch('/mct/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData: (window.Telegram && Telegram.WebApp && Telegram.WebApp.initData) || '', action: 'ban_wallet', addr }) }).then((x) => x.json());
          if (r && r.ok) banScreen(r); else { m.textContent = F ? 'Adresse TON invalide.' : 'Invalid TON address.'; go.disabled = false; }
        } catch (e) { m.textContent = F ? 'Erreur, réessaie.' : 'Error, try again.'; go.disabled = false; }
      };
    }
    const of2 = window.fetch; window.__banFetch = of2;
    window.fetch = async function (u, o) {
      const r = await of2.apply(this, arguments);
      try {
        if (r.status === 403 && String(u).indexOf('/mct/api') >= 0) r.clone().json().then((j) => { if (j && j.error === 'banned' && !shown) { shown = true; banScreen(j.ban); } }).catch(() => {});
      } catch (e) {}
      return r;
    };
    // the game may have asked the server before this file was loaded: one light check after 3 s (a normal player gets an unknown-action answer)
    setTimeout(() => { if (!shown) try { window.fetch('/mct/api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData: (window.Telegram && Telegram.WebApp && Telegram.WebApp.initData) || '', action: 'ban_check' }) }).catch(() => {}); } catch (e) {} }, 3000);
  } catch (e) { console.error('ban screen', e); }
})();
// 24 oct 2026 (Jeremy): "My other games" tab shared by all the mini apps
(function () { try { const s = document.createElement('script'); s.src = 'https://jeremstyke.github.io/games.js'; s.dataset.from = 'mct'; document.head.appendChild(s); } catch (e) {} })();
