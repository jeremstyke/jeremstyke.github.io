// 22 oct 2026 (Jeremy): bridge from Meme Coin Tycoon to Baton (@PassTheBatonBot), without mixing the two games:
// a small 🏃 button in the header that opens Baton, and the daily mission "pass a baton on Baton" (checked by the server).
(function () {
  try {
    const S = {
      en: { m_baton: '🏃 Pass a baton on Baton' },
      fr: { m_baton: '🏃 Passe un bâton sur Baton' },
      ar: { m_baton: '🏃 مرّر عصا في Baton' },
      id: { m_baton: '🏃 Oper tongkat di Baton' }
    };
    for (const k in S) if (L[k]) Object.assign(L[k], S[k]);
    const URL = 'https://t.me/PassTheBatonBot/play?startapp=src_mct';
    const open = () => { try { tw.openTelegramLink(URL); } catch (e) { location.href = URL; } };
    if (typeof MSN_GO === 'object') MSN_GO.baton = open;
    const f = document.getElementById('faqtop');
    if (f && !document.getElementById('btntop')) {
      const b = document.createElement('button');
      b.className = 'lng'; b.id = 'btntop'; b.textContent = '🏃'; b.setAttribute('aria-label', 'Baton');
      b.onclick = () => { try { haptic(); } catch (e) {} open(); };
      f.parentNode.insertBefore(b, f);
    }
  } catch (e) { console.error('baton bridge', e); }
})();
