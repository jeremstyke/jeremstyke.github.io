// 22 oct 2026 (Jeremy): the game is refocused on buying / selling, coin creation and blockchains. Hidden here:
// - the thin $MCT bar at the top of the market (price, value, "📺 +10 $MCT" video); $MCT stays in the coin list and on its own page;
// - the clans (tab of the Leaders page, button, clan sheet, clan ranking): clans are closed, their coins and blockchains
//   now belong to their former chiefs (server side: ds_config 'mct_clans_off');
// - the duels (⚔️ buttons in the friends list and on a player's profile): MCT Duel is closed (ds_config 'mct_duels_off');
// - 11h45: less at the top of the market: the 🎓 guide banner and the ✨ "simpler game" card. Only the scoop card stays at the top
//   (11h58: no News button there; the news stay under the daily missions, with "All the news").
// - 30 oct 2026 (17h12, Jeremy): the daily missions (#msn) and the partner mission (#agtask) on the market (home); 17h13: the "🚀 $X took +160 %, sell now" card (#selb); 17h23: the "$BATON won" card of the Portfolio (#bsbt), replaced by a weekly message in the bot (mct_bt_week_msg).
// - 17h58: the partner mission everywhere (also in the "Out of cash?" sheet: #agtask3).
// To bring something back, remove its selector here (and switch the server flag off).
(function () {
  try {
    const st = document.createElement('style');
    st.textContent = '#tokc,[data-clb],#clrk,#clantop,#clm,button.fd[data-d],#pfduel,#stb,#simpl,#msn,#agtask,#agtask3,.agtk,#selb,#bsbt{display:none!important}';
    document.head.appendChild(st);
  } catch (e) { console.error('hide', e); }
})();
