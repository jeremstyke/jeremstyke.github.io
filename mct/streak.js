// 16 oct 2026 (Jeremy): Meme Coin Tycoon, by @jeremstyke. The daily streak always visible at the top, next to the cash: "🔥 3".
// When today's bonus is waiting, the badge turns gold with 🎁 and opens the bonus (the old 🎁 button); otherwise a tap tells the day
// of the streak (cycle of 7 days, day 7 = $1,000). Before, the streak was only at the bottom of the portfolio.
(() => {
  const TX = {
    en: { st: (d) => '🔥 Streak: day ' + d + '/7 ✓ · come back tomorrow · day 7 = $1,000', go: (d) => '🔥 Day ' + d + '/7 waiting: claim your 🎁 now!', zero: '🔥 Claim your 🎁 every day: day 7 = $1,000' },
    fr: { st: (d) => '🔥 Série : jour ' + d + '/7 ✓ · reviens demain · jour 7 = 1 000 $', go: (d) => '🔥 Jour ' + d + '/7 qui t\'attend : récupère ton 🎁 !', zero: '🔥 Récupère ton 🎁 chaque jour : jour 7 = 1 000 $' },
    ar: { st: (d) => '🔥 السلسلة: اليوم ' + d + '/7 ✓ · عُد غدًا · اليوم 7 = $1,000', go: (d) => '🔥 اليوم ' + d + '/7 بانتظارك: اجمع 🎁 الآن!', zero: '🔥 اجمع 🎁 كل يوم: اليوم 7 = $1,000' },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] || TX.en; };
  const me = () => { try { return typeof ME !== 'undefined' ? ME : null; } catch (e) { return null; } };

  const st = document.createElement('style');
  st.textContent = '#strk{display:inline-flex;align-items:center;gap:3px;height:32px;padding:0 7px;border-radius:16px;border:1px solid rgba(255,122,26,.55);background:rgba(255,122,26,.14);color:#ffb26b;font-weight:900;font-size:14px;line-height:1;cursor:pointer;white-space:nowrap}'
    + '#strk.go{background:var(--gold,#ffd43b);border-color:var(--gold,#ffd43b);color:var(--night,#1a0638);animation:pulse 2.4s ease-in-out infinite}'
    + 'header.top #gift{display:none!important}'
    + 'header.top .wallet{gap:4px}header.top #faqtop{padding:6px 7px}'
    + '@media (max-width:370px){header.top{padding-left:12px;padding-right:12px}header.top .cash{padding:7px 9px}}'; // room for the badge on small phones
  document.head.appendChild(st);

  function paint() {
    const g = document.getElementById('gift'); if (!g) return false;
    const fq = document.getElementById('faqtop'); if (fq && fq.textContent !== '❓') fq.textContent = '❓'; // "❓ FAQ" -> "❓" to make room
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
    const m = me(); if (!m) { b.hidden = true; return true; }
    const s = Number(m.streak || 0), claim = !!m.bonus;
    const d = m.today ? ((s - 1) % 7) + 1 : s ? (s % 7) + 1 : 1; // the day shown: done today, or the one waiting
    const txt = (claim ? '🎁' : '') + '🔥' + (claim ? d : (s ? ((s - 1) % 7) + 1 : 0));
    b.hidden = false;
    if (b.textContent !== txt) b.textContent = txt;
    b.classList.toggle('go', claim);
    b.title = claim ? L().go(d) : '';
    return true;
  }
  // ME is reloaded by the game (bonus claimed, new day...): a light check every second
  let n = 0; const w = setInterval(() => { if (paint() || ++n > 80) { clearInterval(w); setInterval(paint, 1000); } }, 250);
})();
