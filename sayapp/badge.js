// 2 nov 2026 (17h13, Jeremy): signature at the bottom of Meme Coin Tycoon and Pass The Baton (21h34: "by @jeremstyke", link to t.me/jeremstyke).
// <script src="https://jeremstyke.github.io/sayapp/badge.js" data-src="mct"></script>
(function () {
  var cur = document.currentScript, src = (cur && cur.getAttribute('data-src')) || 'app';
  var URL = 'https://t.me/SayAppBuilderBot?start=src_' + src;  // 3 nov 2026 (08h55, Jeremy): "Made with SayApp" at the bottom of the 2 apps
  function put() {
    if (document.getElementById('sayappMade')) return;
    var main = document.querySelector('main'); if (!main) return;
    var s = document.createElement('style');
    s.textContent = '#sayappMade{display:flex;justify-content:center;padding:18px 0 6px}#sayappMade a{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:99px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.78);font:600 12px/1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-decoration:none;letter-spacing:.01em}#sayappMade b{display:inline-grid;place-items:center;width:16px;height:16px;border-radius:5px;background:linear-gradient(120deg,#8b5cff,#2fd6ff);color:#fff;font-size:10px}';
    document.head.appendChild(s);
    var d = document.createElement('div'); d.id = 'sayappMade';
    d.innerHTML = '<a href="' + URL + '"><b>&#10022;</b>Made with SayApp</a>';
    d.firstChild.onclick = function (e) { e.preventDefault(); try { Telegram.WebApp.openTelegramLink(URL); } catch (x) { location.href = URL; } };
    // 4 nov 2026 (02h26, Jeremy): apps with real rewards or payments say that SayApp only builds apps, the publisher runs the rewards and payments
    var lg = ''; try { lg = Telegram.WebApp.initDataUnsafe.user.language_code || ''; } catch (x) {} lg = String(lg || navigator.language || 'en').slice(0, 2).toLowerCase();
    var NT = { fr: 'SayApp sert uniquement à créer des applications. Les récompenses, gains et paiements de cette appli sont gérés par son éditeur, pas par SayApp.', en: 'SayApp is only a tool to build apps. The rewards, earnings and payments of this app are managed by its publisher, not by SayApp.', es: 'SayApp solo sirve para crear aplicaciones. Las recompensas, ganancias y pagos de esta app los gestiona su editor, no SayApp.', pt: 'O SayApp serve apenas para criar aplicativos. As recompensas, ganhos e pagamentos deste app são geridos pelo seu editor, não pelo SayApp.', ru: 'SayApp служит только для создания приложений. Награды, заработок и выплаты этого приложения управляются его издателем, а не SayApp.', id: 'SayApp hanya alat untuk membuat aplikasi. Hadiah, penghasilan, dan pembayaran aplikasi ini dikelola oleh penerbitnya, bukan oleh SayApp.', tr: 'SayApp yalnızca uygulama oluşturmaya yarar. Bu uygulamanın ödülleri, kazançları ve ödemeleri SayApp tarafından değil, yayıncısı tarafından yönetilir.', de: 'SayApp dient nur zum Erstellen von Apps. Belohnungen, Gewinne und Zahlungen dieser App verwaltet ihr Herausgeber, nicht SayApp.', it: 'SayApp serve solo a creare app. Premi, guadagni e pagamenti di questa app sono gestiti dal suo editore, non da SayApp.', ar: 'SayApp مجرد أداة لإنشاء التطبيقات. المكافآت والأرباح والمدفوعات في هذا التطبيق يديرها ناشره، وليس SayApp.' };
    var nt = document.createElement('div'); nt.textContent = NT[lg] || NT.en;
    nt.style.cssText = 'max-width:320px;margin:8px auto 0;text-align:center;color:rgba(255,255,255,.45);font:500 10.5px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
    d.style.flexDirection = 'column'; d.style.alignItems = 'center'; d.appendChild(nt);
    var cs = getComputedStyle(main).overflowY;
    if (cs === 'auto' || cs === 'scroll') main.appendChild(d); else main.parentNode.insertBefore(d, main.nextSibling);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', put); else put();
})();
