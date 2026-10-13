// 13 oct 2026: "More by Jeremstyke" strip, shared by all my sites (one file, every site loads it)
(function () {
  if (window.__jerNet) return; window.__jerNet = 1;
  // never inside a Telegram mini app (the app has its own fixed layout)
  try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initData) return; } catch (e) {}
  var S = [
    ['home', '✨', 'Jeremstyke', 'All my free apps', 'https://jeremstyke.github.io/'],
    ['lifesim', '🎂', 'Life Sim', 'Life simulator game', 'https://jeremstyke.github.io/lifesim/'],
    ['chatpal', '🤖', 'ChatPal', 'Your AI best friend', 'https://jeremstyke.github.io/chatpal/'],
    ['dailyscore', '⚽', 'Daily Score', 'Football prediction game', 'https://dailyscoreapp.com/en/'],
    ['memecointycoon', '🐸', 'Meme Coin Tycoon', 'Memecoin trading game', 'https://jeremstyke.github.io/memecointycoon/'],
    ['whoknowsme', '💬', 'Who Knows Me Best?', 'Quiz for your friends', 'https://jeremstyke.github.io/whoknowsme/'],
    ['grampedia', '📚', 'GramPedia', 'Telegram directory', 'https://jeremstyke.github.io/grampedia/'],
    ['adspot', '📣', 'AdSpot', 'Free ads on Telegram', 'https://jeremstyke.github.io/adspot/']
  ];
  var ASK = { en: 'Any question? Contact @jeremstyke', fr: 'Une question ? Contacte @jeremstyke', es: '¿Alguna pregunta? Escribe a @jeremstyke', pt: 'Alguma dúvida? Fale com @jeremstyke', de: 'Eine Frage? Schreib @jeremstyke', it: 'Una domanda? Scrivi a @jeremstyke', ru: 'Есть вопрос? Пиши @jeremstyke', ar: 'لديك سؤال؟ تواصل مع @jeremstyke', tr: 'Bir sorun mu var? @jeremstyke ile iletişime geç', id: 'Ada pertanyaan? Hubungi @jeremstyke' };
  var lg = ((document.documentElement.lang || 'en') + '').slice(0, 2).toLowerCase();
  var h = location.hostname, p = location.pathname, cur = h.indexOf('dailyscoreapp') >= 0 ? 'dailyscore' : (p.split('/')[1] || 'home');
  if (h.indexOf('jeremstyke.github.io') < 0 && h.indexOf('dailyscoreapp') < 0) cur = '';
  var items = S.filter(function (s) { return s[0] !== cur; });
  var css = '.jn{max-width:1080px;margin:0 auto;padding:28px 20px 36px;font:inherit;color:inherit;box-sizing:border-box}.jn *{box-sizing:border-box}.jn h2{font-size:15px;margin:0 0 12px;opacity:.75;font-weight:800;letter-spacing:.02em;text-transform:uppercase}.jn .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px}.jn a{display:flex;gap:10px;align-items:center;padding:10px 12px;border-radius:14px;text-decoration:none;color:inherit;border:1px solid rgba(127,127,127,.28);background:rgba(127,127,127,.07)}.jn a:hover{background:rgba(127,127,127,.15)}.jn a:focus-visible{outline:2px solid currentColor;outline-offset:2px}.jn .e{font-size:22px;line-height:1}.jn b{display:block;font-size:14px}.jn small{display:block;font-size:12px;opacity:.7}.jn .ask{display:inline-flex;margin-top:12px;font-weight:800}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var sec = document.createElement('section'); sec.className = 'jn'; sec.setAttribute('aria-label', 'More free apps by Jeremstyke');
  sec.innerHTML = '<h2>More free apps by Jeremstyke</h2><div class="g">' + items.map(function (s) { return '<a href="' + s[4] + '"><span class="e" aria-hidden="true">' + s[1] + '</span><span><b>' + s[2] + '</b><small>' + s[3] + '</small></span></a>'; }).join('') + '</div><a class="ask" href="https://t.me/jeremstyke?direct"><span class="e" aria-hidden="true">💬</span><span>' + (ASK[lg] || ASK.en) + '</span></a>';
  // pages with their own scroll box (like Who Knows Me Best?) get the strip inside it
  var go = function () { var host = document.getElementById('jer-network') || document.getElementById('scroller'); (host || document.body).appendChild(sec); };
  if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
})();
