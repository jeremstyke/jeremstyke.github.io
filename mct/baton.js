// 22 oct 2026 (Jeremy): bridge from Meme Coin Tycoon to Baton (@PassTheBatonBot), without mixing the two games:
// only the daily mission "pass a baton on Baton" (checked by the server); tapping it opens Baton. No button in the header.
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
    if (typeof MSN_GO === 'object') MSN_GO.baton = () => { try { tw.openTelegramLink(URL); } catch (e) { location.href = URL; } };
  } catch (e) { console.error('baton bridge', e); }
})();
