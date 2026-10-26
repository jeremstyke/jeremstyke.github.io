// 26 oct 2026 (23h05, Jeremy): a "🏃 Earn $BATON by playing" card on the Market, right under the daily missions, so the players
// know that their trades and stock market orders here earn $BATON on Pass The Baton (tasks 6, 16 and 17 of Baton).
// The link opens the Tasks tab of Baton directly (start_param containing "tasks").
(() => {
  const tw = window.Telegram && Telegram.WebApp;
  const URL = 'https://t.me/PassTheBatonBot/play?startapp=src_mcttasks';
  const TX = {
    en: { h: '🏃 Earn $BATON by playing here', s: '1 trade a day: +3,000 · 1 stock order: +3,000 · 1st share: +5,000', n: 'On Pass The Baton, 1 million $BATON = $1 in USDT', b: 'See' },
    fr: { h: '🏃 Gagne des $BATON en jouant ici', s: '1 échange par jour : +3 000 · 1 ordre en bourse : +3 000 · 1re action : +5 000', n: 'Sur Pass The Baton, 1 million de $BATON = 1 $ en USDT', b: 'Voir' },
    ru: { h: '🏃 Зарабатывай $BATON, играя здесь', s: '1 сделка в день: +3 000 · 1 ордер на бирже: +3 000 · 1-я акция: +5 000', n: 'В Pass The Baton 1 миллион $BATON = 1 $ в USDT', b: 'Открыть' },
    ar: { h: '🏃 اربح $BATON باللعب هنا', s: 'صفقة واحدة يوميًا: ‎+3,000 · أمر واحد في البورصة: ‎+3,000 · أول سهم: ‎+5,000', n: 'في Pass The Baton، مليون $BATON = 1 $ بعملة USDT', b: 'عرض' },
    fa: { h: '🏃 با بازی اینجا $BATON بگیر', s: '۱ معامله در روز: ‎+3,000 · ۱ سفارش بورس: ‎+3,000 · اولین سهم: ‎+5,000', n: 'در Pass The Baton، یک میلیون $BATON = ۱ دلار USDT', b: 'دیدن' },
    id: { h: '🏃 Dapatkan $BATON dengan bermain di sini', s: '1 trade per hari: +3.000 · 1 order saham: +3.000 · saham pertama: +5.000', n: 'Di Pass The Baton, 1 juta $BATON = $1 dalam USDT', b: 'Lihat' },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] || TX.en; };
  const view = () => { try { return VIEW; } catch (e) { return ''; } };

  const st = document.createElement('style');
  st.textContent = '#btcard{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;text-align:left;color:inherit;cursor:pointer;margin:10px 0 4px;padding:12px 14px;border-radius:14px;border:1px solid rgba(255,212,59,.35);background:linear-gradient(135deg,rgba(255,212,59,.12),rgba(255,212,59,.03));font:inherit}'
    + '#btcard .t{flex:1;min-width:0}#btcard b{display:block;font-size:14px}#btcard small{display:block;opacity:.85;font-size:12px;margin-top:2px;line-height:1.35}#btcard small.n{opacity:.6;font-size:11px}'
    + '#btcard .bb{flex:0 0 auto;font-weight:800;font-size:13px;padding:7px 12px;border-radius:10px;background:#ffd43b;color:#2a2205}';
  document.head.appendChild(st);

  function card() {
    let c = document.getElementById('btcard');
    if (view() !== 'market') { if (c) c.remove(); return; }
    const m = document.getElementById('msn'); if (!m || !m.firstElementChild) return;  // under the missions, once they are shown
    const T = L(), k = T.h;
    if (!c || !c.isConnected || c.previousElementSibling !== m) {
      if (c) c.remove();
      c = document.createElement('button'); c.id = 'btcard'; c.type = 'button';
      c.onclick = () => { try { haptic(); } catch (e) {} try { tw.openTelegramLink(URL); } catch (e) { location.href = URL; } };
      m.insertAdjacentElement('afterend', c);
    }
    if (c.dataset.k !== k) { c.dataset.k = k; c.innerHTML = '<span class="t"><b>' + T.h + '</b><small>' + T.s + '</small><small class="n">' + T.n + '</small></span><span class="bb">' + T.b + '</span>'; }
  }
  setInterval(card, 1000); card();
})();
