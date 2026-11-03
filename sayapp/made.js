// 3 nov 2026 (Jeremy): "Made with SayApp" at the bottom of Meme Coin Tycoon and Pass The Baton
(function () {
  var s = document.currentScript, src = (s && s.getAttribute('data-src')) || 'app';
  var st = document.createElement('style');
  st.textContent = '#sayMade{display:block;text-align:center;margin:20px 0 8px;font:600 12px Inter,system-ui,-apple-system,sans-serif;opacity:.55;color:inherit;text-decoration:none;letter-spacing:.02em}#sayMade b{font-weight:800}';
  document.head.appendChild(st);
  function el() {
    var a = document.createElement('a'); a.id = 'sayMade'; a.href = 'https://t.me/SayAppBuilderBot?start=src_' + src;
    a.innerHTML = '&#10022; Made with <b>SayApp</b>';
    a.onclick = function (e) { e.preventDefault(); try { Telegram.WebApp.openTelegramLink(a.href); } catch (x) { location.href = a.href; } };
    return a;
  }
  function put() {
    var m = document.querySelector('main'); if (!m) return;
    var a = document.getElementById('sayMade');
    if (a && a.parentNode === m && m.lastElementChild === a) return;
    if (a) a.remove();
    m.appendChild(a || el());
  }
  function start() {
    put();
    var m = document.querySelector('main'), t = 0;
    if (m && window.MutationObserver) new MutationObserver(function () { clearTimeout(t); t = setTimeout(put, 60); }).observe(m, { childList: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
