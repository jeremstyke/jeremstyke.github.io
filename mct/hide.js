// 22 oct 2026 (Jeremy): the game is refocused on buying / selling, coin creation and blockchains. Hidden here:
// - the thin $MCT bar at the top of the market (price, value, "📺 +10 $MCT" video); $MCT stays in the coin list and on its own page;
// - the clans (tab of the Leaders page, button, clan sheet, clan ranking): clans are closed, their coins and blockchains
//   now belong to their former chiefs (server side: ds_config 'mct_clans_off');
// - the duels (⚔️ buttons in the friends list and on a player's profile): MCT Duel is closed (ds_config 'mct_duels_off');
// - 11h45: less at the top of the market: the 🎓 guide banner, the ✨ "simpler game" card and the scoop card (the scoop stays
//   on the News page). The market keeps: the channel card (only until joined), the daily missions, the news, then the coins.
// To bring something back, remove its selector here (and switch the server flag off).
(function () {
  try {
    const st = document.createElement('style');
    st.textContent = '#tokc,[data-clb],#clrk,#clantop,#clm,button.fd[data-d],#pfduel,#stb,#simpl{display:none!important}';
    document.head.appendChild(st);
    const off = () => { let v = ''; try { v = VIEW; } catch (e) {} if (v !== 'market') return; const s = document.getElementById('scoopc'); if (s) s.style.display = 'none'; };
    const view = document.getElementById('view');
    if (view) new MutationObserver(off).observe(view, { childList: true, subtree: true });
    off();
  } catch (e) { console.error('hide', e); }
})();
