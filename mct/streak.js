// 16 oct 2026 (Jeremy): Meme Coin Tycoon, by @jeremstyke. The daily streak at the top, in place of the old 🎁 button: "🎁🔥4".
// Shown ONLY when today's bonus is waiting (a tap opens the bonus); hidden the rest of the time so the top stays light.
// Cycle of 7 days, day 7 = $1,000. Before, the streak was only at the bottom of the portfolio.
(() => {
  const TX = {
    en: { st: (d) => '🔥 Streak: day ' + d + '/7 ✓ · come back tomorrow · day 7 = $1,000', go: (d) => '🔥 Day ' + d + '/7 waiting: claim your 🎁 now!', zero: '🔥 Claim your 🎁 every day: day 7 = $1,000' },
    fr: { st: (d) => '🔥 Série : jour ' + d + '/7 ✓ · reviens demain · jour 7 = 1 000 $', go: (d) => '🔥 Jour ' + d + '/7 qui t\'attend : récupère ton 🎁 !', zero: '🔥 Récupère ton 🎁 chaque jour : jour 7 = 1 000 $' },
    ar: { st: (d) => '🔥 السلسلة: اليوم ' + d + '/7 ✓ · عُد غدًا · اليوم 7 = $1,000', go: (d) => '🔥 اليوم ' + d + '/7 بانتظارك: اجمع 🎁 الآن!', zero: '🔥 اجمع 🎁 كل يوم: اليوم 7 = $1,000' },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] || TX.en; };
  const me = () => { try { return typeof ME !== 'undefined' ? ME : null; } catch (e) { return null; } };

  const st = document.createElement('style');
  // same size as the old 🎁 button, with a small "🔥4" chip on its corner (the top stays as light as before)
  st.textContent = '#strk{position:relative;width:38px;height:38px;border-radius:50%;border:0;background:var(--gold,#ffd43b);color:var(--night,#1a0638);font-size:18px;line-height:1;cursor:pointer;box-shadow:0 0 0 4px rgba(255,212,59,.18);animation:pulse 2.4s ease-in-out infinite}'
    + '#strk i{position:absolute;right:-7px;bottom:-5px;font-style:normal;font-size:10px;font-weight:900;padding:2px 4px;border-radius:9px;background:#ff7a1a;color:#fff;white-space:nowrap;box-shadow:0 0 0 2px var(--night,#1a0638)}'
    + 'header.top #gift{display:none!important}';
  document.head.appendChild(st);

  function paint() {
    const g = document.getElementById('gift'); if (!g) return false;
    let b = document.getElementById('strk');
    if (!b) {
      b = document.createElement('button'); b.id = 'strk'; b.type = 'button'; b.setAttribute('aria-label', 'Streak');
      b.onclick = () => {
        try { haptic(); } catch (e) {}
        const m = me(), T = L();
        if (m && m.bonus) { g.click(); return; }
        const s = Number((m && m.streak) || 0);
        try { toast(s ? T.st(((s - 1) % 7) + 1) : T.zero); } catch (e) {}
      };
      g.parentNode.insertBefore(b, g);
    }
    const m = me(); if (!m || !m.bonus) { b.hidden = true; return true; } // only when today's bonus is waiting
    const s = Number(m.streak || 0), claim = true;
    const d = m.today ? ((s - 1) % 7) + 1 : s ? (s % 7) + 1 : 1; // the day shown: done today, or the one waiting
    const txt = '🎁<i>🔥' + d + '</i>';
    b.hidden = false;
    if (b.innerHTML !== txt) b.innerHTML = txt;
    b.title = claim ? L().go(d) : '';
    return true;
  }
  // ME is reloaded by the game (bonus claimed, new day...): a light check every second
  let n = 0; const w = setInterval(() => { if (paint() || ++n > 80) { clearInterval(w); setInterval(paint, 1000); } }, 250);
})();
