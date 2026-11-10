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
    var TX = { fr: 'Essaie Big Bang AI, l’IA gratuite dans Telegram', es: 'Prueba Big Bang AI, la IA gratis en Telegram', pt: 'Experimente o Big Bang AI, a IA grátis no Telegram', ru: 'Попробуй Big Bang AI, бесплатный ИИ в Telegram', uk: 'Спробуй Big Bang AI, безкоштовний ШІ в Telegram', tr: 'Big Bang AI’yi dene, Telegram’da ücretsiz yapay zeka', id: 'Coba Big Bang AI, AI gratis di Telegram', de: 'Teste Big Bang AI, die kostenlose KI in Telegram', it: 'Prova Big Bang AI, l’IA gratuita su Telegram', ar: 'جرّب Big Bang AI، الذكاء الاصطناعي المجاني في Telegram', fa: 'Big Bang AI را امتحان کن، هوش مصنوعی رایگان در Telegram', en: 'Try Big Bang AI, the free AI in Telegram' };
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
