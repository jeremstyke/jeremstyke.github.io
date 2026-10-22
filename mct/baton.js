// 22 oct 2026 (Jeremy): Meme Coin Tycoon promotes Baton (@PassTheBatonBot) at full speed (12h20):
// the daily mission "pass a baton on Baton" (checked by the server) and, at the top of the market right under the scoop card,
// a Baton card that opens Baton. The link brings newcomers into Jeremy's crew on Baton (src_ links).
(function () {
  try {
    const S = {
      en: { m_baton: '🏃 Pass a baton on Baton', bt_h: '🏃 NEW · Baton: free mining', bt_s: 'Mine $BATON every 4 h, pass the baton (up to x5), airdrop planned. Pass one today: +$100 here', bt_b: 'Play' },
      fr: { m_baton: '🏃 Passe un bâton sur Baton', bt_h: '🏃 NOUVEAU · Baton : minage gratuit', bt_s: 'Mine des $BATON toutes les 4 h, passe le bâton (jusqu\'à x5), airdrop prévu. Passes-en un aujourd\'hui : +100 $ ici', bt_b: 'Jouer' },
      ar: { m_baton: '🏃 مرّر عصا في Baton', bt_h: '🏃 جديد · Baton: تعدين مجاني', bt_s: 'عدّن $BATON كل 4 ساعات، وإيردروب مخطط له. مرّر عصا اليوم: +$100 هنا', bt_b: 'العب' },
      id: { m_baton: '🏃 Oper tongkat di Baton', bt_h: '🏃 BARU · Baton: tambang gratis', bt_s: 'Tambang $BATON tiap 4 jam, airdrop direncanakan. Oper tongkat hari ini: +$100 di sini', bt_b: 'Main' }
    };
    for (const k in S) if (L[k]) Object.assign(L[k], S[k]);
    const URL = 'https://t.me/PassTheBatonBot/play?startapp=src_mct';
    const open = () => { try { tw.openTelegramLink(URL); } catch (e) { location.href = URL; } };
    if (typeof MSN_GO === 'object') MSN_GO.baton = open;
    const txt = (k) => { try { return t(k); } catch (e) { return (S[(typeof LANG === 'string' && S[LANG]) ? LANG : 'en'] || S.en)[k]; } };
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    function card() {
      let v = ''; try { v = VIEW; } catch (e) {}
      if (v !== 'market' || document.getElementById('btcard')) return;
      const view = document.getElementById('view'), h1 = view && view.querySelector('h1'); if (!h1) return;
      const el = document.createElement('div');
      el.className = 'msn'; el.id = 'btcard';
      el.style.cssText = 'border-color:#2f8dff;display:flex;align-items:center;gap:10px;padding:12px 14px;margin-bottom:10px';
      el.innerHTML = '<div style="flex:1;min-width:0"><b style="font-size:16px">' + esc(txt('bt_h')) + '</b><br><small style="color:var(--mute);font-size:12px">' + esc(txt('bt_s')) + '</small></div><button class="msn-b go" id="btgo">' + esc(txt('bt_b')) + '</button>';
      const sc = document.getElementById('scoopc');
      (sc && sc.parentNode === h1.parentNode ? sc : h1).insertAdjacentElement('afterend', el);
      el.querySelector('#btgo').onclick = () => { try { if (typeof haptic === 'function') haptic(); } catch (e) {} open(); };
    }
    const view = document.getElementById('view');
    if (view) new MutationObserver(card).observe(view, { childList: true, subtree: true });
    card();
  } catch (e) { console.error('baton bridge', e); }
})();
