// 16 oct 2026 (Jeremy): Meme Coin Tycoon, by @jeremstyke. The daily bonus and its streak.
// 17 oct 2026 (Jeremy): nothing in the top menu any more (it made it heavy): the old 🎁 button is hidden, and when today's bonus is
// waiting, a small card shows at the top of the Market: "🎁 Daily bonus · 🔥 Day 4/7 · Claim" (a tap opens the bonus).
// Cycle of 7 days, day 7 = $1,000. The card goes away once the bonus is claimed.
(() => {
  const TX = {
    id: { h: 'Bonus harian', d: (d) => '🔥 Hari ' + d + '/7 · hari ke-7 = $1,000', b: 'Ambil' },
    fa: { h: 'جایزه روزانه', d: (d) => '🔥 روز ' + d + '/7 · روز هفتم = 1,000 دلار', b: 'دریافت' }, ru: { h: 'Ежедневный бонус', d: (d) => '🔥 День ' + d + '/7 · 7-й день = $1,000', b: 'Забрать' }, en: { h: 'Daily bonus', d: (d) => '🔥 Day ' + d + '/7 · day 7 = $1,000', b: 'Claim' },
    fr: { h: 'Bonus du jour', d: (d) => '🔥 Jour ' + d + '/7 · jour 7 = 1 000 $', b: 'Récupérer' },
    ar: { h: 'المكافأة اليومية', d: (d) => '🔥 اليوم ' + d + '/7 · اليوم 7 = $1,000', b: 'اجمع' },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] || TX.en; };
  const me = () => { try { return typeof ME !== 'undefined' ? ME : null; } catch (e) { return null; } };
  const view = () => { try { return VIEW; } catch (e) { return ''; } };

  const st = document.createElement('style');
  st.textContent = 'header.top #gift{display:none!important}'
    + '#bonc{display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:1px solid var(--gold,#ffd43b);background:linear-gradient(135deg,rgba(255,212,59,.18),rgba(255,212,59,.04));border-radius:16px;padding:10px 14px;margin:0 0 12px;color:inherit;cursor:pointer}'
    + '#bonc b{display:block}#bonc small{opacity:.85}#bonc .go{margin-left:auto;background:var(--gold,#ffd43b);color:var(--night,#1a0638);font-weight:800;border-radius:10px;padding:6px 12px;white-space:nowrap}';
  document.head.appendChild(st);

  function paint() {
    const g = document.getElementById('gift'), v = document.getElementById('view');
    let c = document.getElementById('bonc');
    const m = me();
    if (!g || !v || !m || !m.bonus || view() !== 'market') { if (c) c.remove(); return; }
    const s = Number(m.streak || 0), d = m.today ? ((s - 1) % 7) + 1 : s ? (s % 7) + 1 : 1, T = L();
    const html = '<span style="font-size:28px;line-height:1">🎁</span><span><b>' + T.h + '</b><small>' + T.d(d) + '</small></span><span class="go">' + T.b + '</span>';
    if (!c) {
      c = document.createElement('button'); c.id = 'bonc'; c.type = 'button';
      c.onclick = () => { try { haptic(); } catch (e) {} g.click(); };
      const h = v.querySelector('h1'); if (h) h.insertAdjacentElement('afterend', c); else v.prepend(c);
    }
    const k = d + '|' + (typeof LANG !== 'undefined' ? LANG : ''); if (c.dataset.k !== k) { c.dataset.k = k; c.innerHTML = html; }
  }
  // the market is rebuilt often and ME is reloaded by the game (bonus claimed, new day): a light check every second
  setInterval(paint, 1000); paint();
})();
