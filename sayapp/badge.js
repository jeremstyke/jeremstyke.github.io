// 2 nov 2026 (17h13, Jeremy): signature at the bottom of Meme Coin Tycoon and Pass The Baton (21h34: "by @jeremstyke", link to t.me/jeremstyke).
// <script src="https://jeremstyke.github.io/sayapp/badge.js" data-src="mct"></script>
(function () {
  var cur = document.currentScript, src = (cur && cur.getAttribute('data-src')) || 'app';
  var URL = 'https://t.me/jeremstyke';  // 2 nov 2026 (21h34, Jeremy): back to "by @jeremstyke"
  function put() {
    if (document.getElementById('sayappMade')) return;
    var main = document.querySelector('main'); if (!main) return;
    var s = document.createElement('style');
    s.textContent = '#sayappMade{display:flex;justify-content:center;padding:18px 0 6px}#sayappMade a{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:99px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.78);font:600 12px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-decoration:none;letter-spacing:.01em}#sayappMade b{display:inline-grid;place-items:center;width:16px;height:16px;border-radius:5px;background:linear-gradient(120deg,#8b5cff,#2fd6ff);color:#fff;font-size:10px}';
    document.head.appendChild(s);
    var d = document.createElement('div'); d.id = 'sayappMade';
    d.innerHTML = '<a href="' + URL + '">by @jeremstyke</a>';
    d.firstChild.onclick = function (e) { e.preventDefault(); try { Telegram.WebApp.openTelegramLink(URL); } catch (x) { location.href = URL; } };
    var cs = getComputedStyle(main).overflowY;
    if (cs === 'auto' || cs === 'scroll') main.appendChild(d); else main.parentNode.insertBefore(d, main.nextSibling);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', put); else put();
})();
