// 22 oct 2026 (Jeremy): Meme Coin Tycoon promotes Baton (@PassTheBatonBot):
// the daily mission "pass a baton on Baton" (checked by the server) and, since 16h15, a full-screen Baton popup
// once every 24 hours (it replaces the Baton card at the top of the market). The link brings newcomers into Jeremy's crew
// on Baton (src_ links); src_mctpop tells us how many came from this popup.
(function () {
  try {
    const S = {
      en: { m_baton: '🏃 Pass a baton on Baton', bp_tag: 'NEW GAME', bp_h: 'Hold the baton, earn $BATON', bp_1: '💰 300 $BATON every hour while you hold it', bp_2: '⏳ Pass it before the timer ends: up to +5,000', bp_3: '🛒 Shop: 1 million $BATON = 1 $ in USDT', bp_b: '🏃 Play Baton', bp_x: 'Later' },
      fr: { m_baton: '🏃 Passe un bâton sur Baton', bp_tag: 'NOUVEAU JEU', bp_h: 'Tiens le bâton, gagne des $BATON', bp_1: '💰 300 $BATON par heure tant que tu le tiens', bp_2: '⏳ Passe-le avant la fin du chrono : jusqu\'à +5 000', bp_3: '🛒 Boutique : 1 million de $BATON = 1 $ en USDT', bp_b: '🏃 Jouer à Baton', bp_x: 'Plus tard' },
      ar: { m_baton: '🏃 مرّر عصا في Baton', bp_tag: 'لعبة جديدة', bp_h: 'احمل العصا واربح $BATON', bp_1: '💰 300 $BATON كل ساعة ما دامت معك', bp_2: '⏳ مرّرها قبل انتهاء الوقت: حتى +5 000', bp_3: '🛒 المتجر: مليون $BATON = 1 $ USDT', bp_b: '🏃 العب Baton', bp_x: 'لاحقًا' },
      id: { m_baton: '🏃 Oper tongkat di Baton', bp_tag: 'GAME BARU', bp_h: 'Pegang tongkat, dapatkan $BATON', bp_1: '💰 300 $BATON per jam selama kamu memegangnya', bp_2: '⏳ Oper sebelum waktu habis: hingga +5 000', bp_3: '🛒 Toko: 1 juta $BATON = 1 $ USDT', bp_b: '🏃 Main Baton', bp_x: 'Nanti' }
    };
    for (const k in S) if (typeof L === 'object' && L[k]) Object.assign(L[k], S[k]);
    const URL = 'https://t.me/PassTheBatonBot/play?startapp=src_mctpop';
    const open = () => { try { tw.openTelegramLink(URL); } catch (e) { location.href = URL; } };
    if (typeof MSN_GO === 'object') MSN_GO.baton = () => { try { tw.openTelegramLink('https://t.me/PassTheBatonBot/play?startapp=src_mct'); } catch (e) {} };
    const lang = () => { try { return (typeof LANG === 'string' && S[LANG]) ? LANG : 'en'; } catch (e) { return 'en'; } };
    const txt = (k) => (S[lang()] || S.en)[k] || S.en[k];
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const get = () => { try { return Number(localStorage.getItem('mct_bt_pop') || 0); } catch (e) { return Date.now(); } };
    const set = () => { try { localStorage.setItem('mct_bt_pop', String(Date.now())); } catch (e) {} };
    let tries = 0;
    function popup() {
      if (Date.now() - get() < 24 * 3600000 || document.getElementById('btpop')) return;
      // 22 oct 2026 (16h23, Jeremy): never for Premium players (prem.js sets window.MCTPREM once it knows)
      if (typeof window.MCTPREM === 'undefined' && tries++ < 20) { setTimeout(popup, 500); return; }
      if (window.MCTPREM) return;
      if (document.querySelector('#maint:not([hidden]), .maint:not([hidden])')) return;  // never over the maintenance screen
      set();
      const rtl = lang() === 'ar';
      const el = document.createElement('div'); el.id = 'btpop'; if (rtl) el.dir = 'rtl';
      el.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px max(16px,env(safe-area-inset-right,0px)) 24px max(16px,env(safe-area-inset-left,0px));background:rgba(3,8,20,.82);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)';
      el.innerHTML = '<div style="width:100%;max-width:360px;border-radius:26px;padding:26px 22px 18px;background:radial-gradient(90% 60% at 50% 0%,rgba(47,141,255,.38),transparent 70%),#0b1626;border:1px solid rgba(80,150,255,.35);box-shadow:0 20px 60px rgba(0,0,0,.6);color:#e9f1ff;text-align:center;font-family:inherit">' +
        '<div style="display:inline-block;padding:4px 10px;border-radius:99px;background:#ffc531;color:#08121f;font-weight:800;font-size:11px;letter-spacing:.08em">' + esc(txt('bp_tag')) + '</div>' +
        '<div style="font-size:56px;line-height:1;margin:14px 0 4px">🏃</div>' +
        '<div style="font-size:34px;font-weight:900;letter-spacing:.02em">BATON</div>' +
        '<div style="font-size:17px;font-weight:800;margin:6px 0 16px;color:#ffc531">' + esc(txt('bp_h')) + '</div>' +
        '<div style="display:flex;flex-direction:column;gap:8px;text-align:' + (rtl ? 'right' : 'left') + ';font-size:14px;line-height:1.35;margin-bottom:18px">' +
        ['bp_1', 'bp_2', 'bp_3'].map((k) => '<div style="padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.05)">' + esc(txt(k)) + '</div>').join('') + '</div>' +
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
