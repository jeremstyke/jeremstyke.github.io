/* SayApp promo interstitial (5 nov 2026, Jeremy): shown on Meme Coin Tycoon and Pass The Baton, one opening out of two.
   Usage: SayAppPromo.show({ src: 'mct', lang: 'fr' }) -> Promise resolved when closed. */
(function () {
  if (window.SayAppPromo) return;
  var T = {
    fr: { b: 'FAIT AVEC SAYAPP', h: 'Crée ta propre appli Telegram en 2 minutes', p: "Décris ton idée en une phrase. L'IA la construit, en ligne sur ton propre bot.", l: ['🆓 Gratuit pendant 48 h pour essayer', '💰 Gagne de l\'argent : pubs et étoiles', '🚫 Sans coder, rien à installer'], g: 'Ce jeu a été créé avec SayApp', c: '✨ Créer mon appli gratuitement', x: 'Fermer' },
    en: { b: 'MADE WITH SAYAPP', h: 'Build your own Telegram app in 2 minutes', p: 'Describe your idea in one sentence. The AI builds it, live on your own bot.', l: ['🆓 Free for 48 h to try it', '💰 Earn money: ads and Stars', '🚫 No code, nothing to install'], g: 'This game was built with SayApp', c: '✨ Build my app for free', x: 'Close' },
    es: { b: 'HECHO CON SAYAPP', h: 'Crea tu propia app de Telegram en 2 minutos', p: 'Describe tu idea en una frase. La IA la crea, en línea en tu propio bot.', l: ['🆓 Gratis 48 h para probarla', '💰 Gana dinero: anuncios y Stars', '🚫 Sin programar, nada que instalar'], g: 'Este juego se creó con SayApp', c: '✨ Crear mi app gratis', x: 'Cerrar' },
    pt: { b: 'FEITO COM SAYAPP', h: 'Crie seu próprio app do Telegram em 2 minutos', p: 'Descreva sua ideia em uma frase. A IA cria, no ar no seu próprio bot.', l: ['🆓 Grátis por 48 h para testar', '💰 Ganhe dinheiro: anúncios e Stars', '🚫 Sem programar, nada para instalar'], g: 'Este jogo foi criado com o SayApp', c: '✨ Criar meu app grátis', x: 'Fechar' },
    ru: { b: 'СДЕЛАНО В SAYAPP', h: 'Создай своё приложение Telegram за 2 минуты', p: 'Опиши идею одной фразой. ИИ создаст его и запустит в твоём боте.', l: ['🆓 48 ч бесплатно, чтобы попробовать', '💰 Зарабатывай: реклама и Stars', '🚫 Без кода, ничего не нужно устанавливать'], g: 'Эта игра создана в SayApp', c: '✨ Создать приложение бесплатно', x: 'Закрыть' },
    id: { b: 'DIBUAT DENGAN SAYAPP', h: 'Buat aplikasi Telegram-mu sendiri dalam 2 menit', p: 'Jelaskan idemu dalam satu kalimat. AI membuatnya, langsung online di botmu sendiri.', l: ['🆓 Gratis 48 jam untuk dicoba', '💰 Hasilkan uang: iklan dan Stars', '🚫 Tanpa coding, tanpa instalasi'], g: 'Game ini dibuat dengan SayApp', c: '✨ Buat aplikasiku gratis', x: 'Tutup' },
    tr: { b: 'SAYAPP İLE YAPILDI', h: 'Kendi Telegram uygulamanı 2 dakikada oluştur', p: 'Fikrini tek cümleyle anlat. Yapay zekâ onu kendi botunda yayına alır.', l: ['🆓 Denemek için 48 saat ücretsiz', '💰 Para kazan: reklamlar ve Stars', '🚫 Kod yok, kurulum yok'], g: 'Bu oyun SayApp ile yapıldı', c: '✨ Uygulamamı ücretsiz oluştur', x: 'Kapat' }
  };
  var CSS = '#sapr{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:calc(18px + env(safe-area-inset-top,0px)) 18px calc(18px + env(safe-area-inset-bottom,0px));background:rgba(4,4,12,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font:15px/1.45 Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#fff;opacity:0;transition:opacity .25s}' +
    '#sapr.on{opacity:1}#sapr .k{position:relative;width:100%;max-width:380px;border-radius:28px;overflow:hidden;background:radial-gradient(120% 70% at 0% 0%,#5b2bd6 0,transparent 55%),radial-gradient(120% 70% at 100% 100%,#0e7fb8 0,transparent 55%),#0c0b1d;border:1px solid rgba(255,255,255,.12);box-shadow:0 30px 80px -20px rgba(139,92,255,.6);transform:translateY(14px) scale(.97);transition:transform .35s cubic-bezier(.2,.9,.3,1.2)}' +
    '#sapr.on .k{transform:none}#sapr .t{padding:22px 22px 20px}#sapr .bd{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:99px;background:rgba(255,255,255,.1);font-size:11px;font-weight:800;letter-spacing:.08em}#sapr .bd i{display:inline-grid;place-items:center;width:16px;height:16px;border-radius:5px;background:linear-gradient(120deg,#8b5cff,#2fd6ff);font-style:normal;font-size:10px}' +
    '#sapr .ic{display:flex;gap:10px;margin:18px 0 16px}#sapr .ic span{flex:1 1 0;min-width:0;aspect-ratio:1;max-width:64px;font-size:26px!important;border-radius:18px;display:grid;place-items:center;font-size:28px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);animation:saprf 3s ease-in-out infinite}#sapr .ic span:nth-child(2){animation-delay:.3s}#sapr .ic span:nth-child(3){animation-delay:.6s}#sapr .ic span:nth-child(4){animation-delay:.9s}#sapr .ic span:nth-child(5){animation-delay:1.2s}' +
    '@keyframes saprf{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}#sapr h2{margin:0 0 8px;font-size:25px;line-height:1.15;letter-spacing:-.02em;font-weight:850}#sapr p{margin:0 0 14px;color:#cfd0f5}#sapr ul{list-style:none;margin:0 0 16px;padding:0;display:grid;gap:7px}#sapr li{padding:9px 12px;border-radius:12px;background:rgba(255,255,255,.06);font-weight:650;font-size:14px}' +
    '#sapr .g{margin:0 0 14px;font-size:12px;color:#a9a8d6;text-align:center}#sapr .go{display:block;width:100%;border:0;border-radius:16px;padding:16px;font-size:17px;font-weight:800;line-height:1.2;font-family:inherit;color:#fff;background:linear-gradient(120deg,#8b5cff,#2fd6ff);box-shadow:0 14px 34px -12px rgba(47,214,255,.8);cursor:pointer;animation:saprp 2.2s ease-in-out infinite}@keyframes saprp{0%,100%{transform:scale(1)}50%{transform:scale(1.025)}}' +
    '#sapr .x{position:absolute;top:12px;right:12px;min-width:34px;height:34px;padding:0 10px;border-radius:99px;border:0;background:rgba(0,0,0,.35);color:#fff;font-size:13px;font-weight:700;line-height:34px;font-family:inherit;cursor:pointer}#sapr .x[disabled]{opacity:.6;cursor:default}';
  function show(o) {
    o = o || {};
    return new Promise(function (done) {
      try {
        if (document.getElementById('sapr')) return done(false);
        var lg = String(o.lang || (navigator.language || 'en')).slice(0, 2).toLowerCase(), t = T[lg] || T.en;
        var url = 'https://t.me/SayAppBuilderBot?start=src_' + String(o.src || 'promo').replace(/[^a-z0-9_]/gi, '').slice(0, 30) + '_int';
        if (!document.getElementById('saprc')) { var st = document.createElement('style'); st.id = 'saprc'; st.textContent = CSS; document.head.appendChild(st); }
        var w = document.createElement('div'); w.id = 'sapr';
        var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
        w.innerHTML = '<div class="k" role="dialog" aria-label="SayApp"><button class="x" disabled>3</button><div class="t"><span class="bd"><i>&#10022;</i>' + esc(t.b) + '</span>' +
          '<div class="ic"><span>🎮</span><span>🪙</span><span>🧠</span><span>🚀</span><span>🏆</span></div>' +
          '<h2>' + esc(t.h) + '</h2><p>' + esc(t.p) + '</p><ul>' + t.l.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
          '<div class="g">' + esc(t.g) + '</div><button class="go">' + esc(t.c) + '</button></div></div>';
        document.body.appendChild(w);
        requestAnimationFrame(function () { w.classList.add('on'); });
        var x = w.querySelector('.x'), left = 3, closed = false;
        var close = function (r) { if (closed) return; closed = true; w.classList.remove('on'); setTimeout(function () { try { w.remove(); } catch (e) {} }, 250); done(r); };
        var iv = setInterval(function () { left--; if (left > 0) { x.textContent = String(left); return; } clearInterval(iv); x.disabled = false; x.textContent = '✕ ' + t.x; }, 1000);
        x.onclick = function () { if (!x.disabled) close(false); };
        w.querySelector('.go').onclick = function () {
          try { var tw = window.Telegram && window.Telegram.WebApp; if (tw && tw.openTelegramLink) tw.openTelegramLink(url); else window.open(url, '_blank'); } catch (e) { try { window.open(url, '_blank'); } catch (e2) {} }
          clearInterval(iv); close(true);
        };
      } catch (e) { done(false); }
    });
  }
  window.SayAppPromo = { show: show };
})();
