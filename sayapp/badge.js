// 2 nov 2026 (17h13, Jeremy): signature at the bottom of Meme Coin Tycoon and Pass The Baton.
// 10 nov 2026 (21h39, Jeremy): "Made with SayApp" removed everywhere, replaced by a link to Big Bang AI (tracked: src_<app>_badge).
// <script src="https://jeremstyke.github.io/sayapp/badge.js" data-src="mct"></script>
(function () {
  var cur = document.currentScript, src = (cur && cur.getAttribute('data-src')) || 'app';
  var URL = 'https://t.me/Bigbangaibot/App?startapp=src_' + src + '_badge';
  function put() {
    if (document.getElementById('bbaiMade')) return;
    var main = document.querySelector('main'); if (!main) return;
    var lg = ''; try { lg = Telegram.WebApp.initDataUnsafe.user.language_code || ''; } catch (x) {} lg = String(lg || navigator.language || 'en').slice(0, 2).toLowerCase();
    // 10 nov 2026 (Jeremy): "Made with Big Bang AI" at the bottom of his apps
    var TX = { fr: 'Fait avec Big Bang AI', es: 'Hecho con Big Bang AI', pt: 'Feito com Big Bang AI', ru: 'Сделано с Big Bang AI', uk: 'Зроблено з Big Bang AI', tr: 'Big Bang AI ile yapıldı', id: 'Dibuat dengan Big Bang AI', de: 'Gemacht mit Big Bang AI', it: 'Fatto con Big Bang AI', ar: 'صُنع باستخدام Big Bang AI', fa: 'ساخته شده با Big Bang AI', en: 'Made with Big Bang AI' };
    var s = document.createElement('style');
    s.textContent = '#bbaiMade{display:flex;justify-content:center;padding:18px 0 6px}#bbaiMade a{display:inline-flex;align-items:center;gap:7px;padding:8px 14px;border-radius:99px;background:rgba(47,128,255,.12);border:1px solid rgba(111,211,255,.28);color:rgba(255,255,255,.85);font:600 12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-decoration:none;text-align:center}#bbaiMade b{font-size:14px}';
    document.head.appendChild(s);
    var d = document.createElement('div'); d.id = 'bbaiMade';
    d.innerHTML = '<a href="' + URL + '"><b>🌌</b><span></span></a>';
    d.querySelector('span').textContent = TX[lg] || TX.en;
    d.firstChild.onclick = function (e) { e.preventDefault(); try { Telegram.WebApp.openTelegramLink(URL); } catch (x) { location.href = URL; } };
    var cs = getComputedStyle(main).overflowY;
    if (cs === 'auto' || cs === 'scroll') main.appendChild(d); else main.parentNode.insertBefore(d, main.nextSibling);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', put); else put();
})();
