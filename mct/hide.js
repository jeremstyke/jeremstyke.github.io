// 22 oct 2026 (Jeremy): the game is refocused on buying / selling, coin creation and blockchains.
// Hidden here: the thin $MCT bar at the top of the market (price, value, "📺 +10 $MCT" video). $MCT itself stays in the coin list
// and on its own coin page. To bring the bar back, remove this file from the page (mct_app).
(function () {
  try {
    const st = document.createElement('style');
    st.textContent = '#tokc{display:none!important}';
    document.head.appendChild(st);
  } catch (e) { console.error('hide', e); }
})();
