// 22 oct 2026 (Jeremy): the game is refocused on buying / selling, coin creation and blockchains. Hidden here:
// - the thin $MCT bar at the top of the market (price, value, "📺 +10 $MCT" video); $MCT stays in the coin list and on its own page;
// - the clans (tab of the Leaders page, button, clan sheet, clan ranking): clans are closed, their coins and blockchains
//   now belong to their former chiefs (server side: ds_config 'mct_clans_off');
// - the duels (⚔️ buttons in the friends list and on a player's profile): MCT Duel is closed (ds_config 'mct_duels_off');
// - 11h45: less at the top of the market: the 🎓 guide banner and the ✨ "simpler game" card (11h50: the scoop card stays).
// 11h58: a "📰 News" button at the top of the market, right under the scoop card, opens the News page.
// To bring something back, remove its selector here (and switch the server flag off).
(function () {
  try {
    const st = document.createElement('style');
    st.textContent = '#tokc,[data-clb],#clrk,#clantop,#clm,button.fd[data-d],#pfduel,#stb,#simpl{display:none!important}'
      + '#newsb{display:flex;align-items:center;justify-content:space-between;width:100%;box-sizing:border-box;margin:0 0 10px;padding:11px 14px;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:rgba(255,255,255,.05);color:inherit;font-weight:800;font-size:15px;cursor:pointer}';
    document.head.appendChild(st);
    const TX = { en: ['📰 News', 'All the news ›'], fr: ['📰 News', 'Toutes les news ›'], ar: ['📰 الأخبار', 'كل الأخبار ›'], id: ['📰 Berita', 'Semua berita ›'] };
    function btn() {
      let v = ''; try { v = VIEW; } catch (e) {}
      if (v !== 'market' || document.getElementById('newsb')) return;
      const view = document.getElementById('view'); if (!view) return;
      const h1 = view.querySelector('h1'); if (!h1) return;
      let lg = 'en'; try { lg = (typeof LANG === 'string' && TX[LANG]) ? LANG : 'en'; } catch (e) {}
      const b = document.createElement('button'); b.type = 'button'; b.id = 'newsb';
      b.innerHTML = '<span>' + TX[lg][0] + '</span><small style="opacity:.7;font-weight:700;font-size:12px">' + TX[lg][1] + '</small>';
      b.onclick = () => { try { if (typeof haptic === 'function') haptic(); } catch (e) {} try { go('news'); } catch (e) {} };
      const sc = document.getElementById('scoopc');
      (sc && sc.parentNode === h1.parentNode ? sc : h1).insertAdjacentElement('afterend', b);
    }
    const view = document.getElementById('view');
    if (view) new MutationObserver(btn).observe(view, { childList: true, subtree: true });
    btn();
  } catch (e) { console.error('hide', e); }
})();
