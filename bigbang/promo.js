/* Big Bang AI interstitial (10 nov 2026, Jeremy): replaces the SayApp promo in Meme Coin Tycoon and Pass The Baton.
   10 nov 2026 (Jeremy): "l'interstitiel de pub c'est pour l'app pas la chaine": it promotes the Big Bang AI app, not the channel.
   Usage: BigBangPromo.show({ src: 'mct', lang: 'fr' }) -> Promise resolved when closed. */
(function () {
  if (window.BigBangPromo) return;
  var LOGO = 'https://bigbang-ai-production.up.railway.app/logo.jpg';
  var T = {
    en: { b: 'Big Bang AI', h: "The free AI of Telegram", p: "Write, translate, code, learn and build your own mini apps, right in Telegram.", l: ["⚡ Free and unlimited AI in Simple mode", "🌐 Answers from the live web", "🧩 Build your own mini app in one sentence"], c: "🚀 Open Big Bang AI", x: "Close" },
    fr: { b: 'Big Bang AI', h: "L'IA gratuite de Telegram", p: "Écrire, traduire, coder, apprendre et créer tes propres mini-apps, directement dans Telegram.", l: ["⚡ IA gratuite et illimitée en mode Simple", "🌐 Réponses tirées du web en direct", "🧩 Crée ta propre mini-app en une phrase"], c: "🚀 Ouvrir Big Bang AI", x: "Fermer" },
    es: { b: 'Big Bang AI', h: "La IA gratis de Telegram", p: "Escribe, traduce, programa, aprende y crea tus propias mini apps, dentro de Telegram.", l: ["⚡ IA gratis e ilimitada en modo Simple", "🌐 Respuestas desde la web en vivo", "🧩 Crea tu propia mini app con una frase"], c: "🚀 Abrir Big Bang AI", x: "Cerrar" },
    pt: { b: 'Big Bang AI', h: "A IA grátis do Telegram", p: "Escreva, traduza, programe, aprenda e crie seus próprios mini apps, dentro do Telegram.", l: ["⚡ IA grátis e ilimitada no modo Simple", "🌐 Respostas da web ao vivo", "🧩 Crie seu próprio mini app com uma frase"], c: "🚀 Abrir Big Bang AI", x: "Fechar" },
    ru: { b: 'Big Bang AI', h: "Бесплатный ИИ в Telegram", p: "Пиши, переводи, программируй, учись и создавай свои мини-приложения прямо в Telegram.", l: ["⚡ Бесплатный и безлимитный ИИ в режиме Simple", "🌐 Ответы из интернета в реальном времени", "🧩 Создай своё мини-приложение одной фразой"], c: "🚀 Открыть Big Bang AI", x: "Закрыть" },
    id: { b: 'Big Bang AI', h: "AI gratis di Telegram", p: "Menulis, menerjemahkan, coding, belajar, dan membuat mini app sendiri, langsung di Telegram.", l: ["⚡ AI gratis tanpa batas di mode Simple", "🌐 Jawaban dari web secara langsung", "🧩 Buat mini app sendiri dengan satu kalimat"], c: "🚀 Buka Big Bang AI", x: "Tutup" },
    tr: { b: 'Big Bang AI', h: "Telegram'ın ücretsiz yapay zekâsı", p: "Yaz, çevir, kodla, öğren ve kendi mini uygulamalarını yap, doğrudan Telegram'da.", l: ["⚡ Simple modda ücretsiz ve sınırsız yapay zekâ", "🌐 Canlı webden yanıtlar", "🧩 Tek cümleyle kendi mini uygulamanı yap"], c: "🚀 Big Bang AI'yi aç", x: "Kapat" },
    ar: { b: 'Big Bang AI', h: "الذكاء الاصطناعي المجاني في Telegram", p: "اكتب وترجم وبرمج وتعلّم وأنشئ تطبيقاتك المصغّرة، مباشرة في Telegram.", l: ["⚡ ذكاء اصطناعي مجاني وغير محدود في وضع Simple", "🌐 إجابات من الويب مباشرة", "🧩 أنشئ تطبيقك المصغّر بجملة واحدة"], c: "🚀 افتح Big Bang AI", x: "إغلاق" },
  };
  var CSS = '#bbpr{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:calc(18px + env(safe-area-inset-top,0px)) 18px calc(18px + env(safe-area-inset-bottom,0px));background:rgba(2,2,10,.82);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font:15px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#fff;opacity:0;transition:opacity .3s}' +
    '#bbpr.on{opacity:1}#bbpr .k{position:relative;width:100%;max-width:380px;border-radius:30px;overflow:hidden;background:#05040f;border:1px solid rgba(160,140,255,.22);box-shadow:0 40px 90px -25px rgba(255,120,60,.45),0 0 0 1px rgba(255,255,255,.03) inset;transform:translateY(16px) scale(.96);transition:transform .45s cubic-bezier(.2,.9,.3,1.15)}#bbpr.on .k{transform:none}' +
    '#bbpr .sky{position:relative;height:178px;overflow:hidden;background:radial-gradient(60% 80% at 50% 62%,#2a0f4d 0,#05040f 75%)}' +
    '#bbpr .burst{position:absolute;left:50%;top:62%;width:440px;height:440px;margin:-220px 0 0 -220px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 6%,rgba(255,170,80,.55) 8%,transparent 11% 22%,rgba(140,110,255,.5) 24%,transparent 27% 40%,rgba(80,200,255,.45) 42%,transparent 45% 58%,rgba(255,110,170,.5) 60%,transparent 63% 76%,rgba(255,210,120,.5) 78%,transparent 81% 100%);-webkit-mask:radial-gradient(circle,#000 0,transparent 62%);mask:radial-gradient(circle,#000 0,transparent 62%);animation:bbspin 18s linear infinite}' +
    '#bbpr .glow{position:absolute;left:50%;top:62%;width:120px;height:120px;margin:-60px 0 0 -60px;border-radius:50%;background:radial-gradient(circle,rgba(255,230,180,.95) 0,rgba(255,140,60,.55) 35%,transparent 70%);animation:bbpulse 2.6s ease-in-out infinite}' +
    '#bbpr .st{position:absolute;width:2px;height:2px;border-radius:50%;background:#fff;opacity:.8;animation:bbtw 3s ease-in-out infinite}' +
    '#bbpr .lg{position:absolute;left:50%;top:62%;width:76px;height:76px;margin:-38px 0 0 -38px;border-radius:24px;object-fit:cover;box-shadow:0 0 0 3px rgba(255,255,255,.12),0 14px 40px rgba(255,140,60,.55);background:#140b2a}' +
    '#bbpr .bd{position:absolute;left:16px;top:14px;padding:6px 11px;border-radius:99px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.14);font-size:12px;font-weight:750}' +
    '@keyframes bbspin{to{transform:rotate(360deg)}}@keyframes bbpulse{0%,100%{transform:scale(.9);opacity:.85}50%{transform:scale(1.15);opacity:1}}@keyframes bbtw{0%,100%{opacity:.2}50%{opacity:1}}' +
    '#bbpr .t{padding:6px 22px 20px}#bbpr h2{margin:0 0 8px;font-size:24px;line-height:1.15;letter-spacing:-.02em;font-weight:850;text-align:center}#bbpr p{margin:0 0 14px;color:#c9c6ea;text-align:center}' +
    '#bbpr ul{list-style:none;margin:0 0 12px;padding:0;display:grid;gap:7px}#bbpr li{padding:9px 12px;border-radius:13px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.06);font-weight:600;font-size:14px}' +
    '#bbpr .bn{margin:0 0 14px;padding:10px 12px;border-radius:13px;background:linear-gradient(120deg,rgba(255,170,80,.18),rgba(255,110,170,.14));border:1px solid rgba(255,170,80,.35);font-weight:700;font-size:13.5px;color:#ffe2c4}' +
    '#bbpr .go{display:block;width:100%;border:0;border-radius:17px;padding:16px;font-size:17px;font-weight:800;line-height:1.2;font-family:inherit;color:#1a0c00;background:linear-gradient(120deg,#ffd27a,#ff8a4c 55%,#ff5fa2);box-shadow:0 16px 36px -12px rgba(255,120,70,.85);cursor:pointer;animation:bbbtn 2.4s ease-in-out infinite}@keyframes bbbtn{0%,100%{transform:scale(1)}50%{transform:scale(1.025)}}' +
    '#bbpr .op{display:block;width:100%;margin-top:10px;border:0;background:none;color:#b7b2ff;font:600 14px/1.3 inherit;font-family:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer}' +
    '#bbpr .x{position:absolute;top:12px;right:12px;z-index:2;min-width:34px;height:34px;padding:0 10px;border-radius:99px;border:0;background:rgba(0,0,0,.45);color:#fff;font-size:13px;font-weight:700;line-height:34px;font-family:inherit;cursor:pointer}#bbpr .x[disabled]{opacity:.6;cursor:default}' +
    '@media (prefers-reduced-motion:reduce){#bbpr .burst,#bbpr .glow,#bbpr .st,#bbpr .go{animation:none}}';
  function open(u) { try { var tw = window.Telegram && window.Telegram.WebApp; if (tw && tw.openTelegramLink) tw.openTelegramLink(u); else window.open(u, '_blank'); } catch (e) { try { window.open(u, '_blank'); } catch (e2) {} } }
  function show(o) {
    o = o || {};
    return new Promise(function (done) {
      try {
        if (document.getElementById('bbpr')) return done(false);
        try { if (Date.now() >= 1794956340000 && Date.now() - Number(localStorage.getItem('bbpr_opened') || 0) < 7 * 864e5) return done(null); } catch (e) {}  // 10 nov 2026 (Jeremy): until 17 nov 2026, only Big Bang AI interstitials (never skipped)  // already opened Big Bang AI from here this week: the game shows its normal ad
        var lg = String(o.lang || (navigator.language || 'en')).slice(0, 2).toLowerCase(), t = T[lg] || T.en;
        var src = String(o.src || 'promo').replace(/[^a-z0-9_]/gi, '').slice(0, 30);
        var appUrl = 'https://t.me/Bigbangaibot/App?startapp=src_' + src + '_int';
        if (!document.getElementById('bbprc')) { var st = document.createElement('style'); st.id = 'bbprc'; st.textContent = CSS; document.head.appendChild(st); }
        var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
        var stars = ''; for (var i = 0; i < 26; i++) stars += '<i class="st" style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 100).toFixed(1) + '%;animation-delay:' + (Math.random() * 3).toFixed(2) + 's"></i>';
        var w = document.createElement('div'); w.id = 'bbpr'; if (lg === 'ar') w.dir = 'rtl';
        w.innerHTML = '<div class="k" role="dialog" aria-label="Big Bang AI"><button class="x" disabled>3</button>' +
          '<div class="sky">' + stars + '<div class="burst"></div><div class="glow"></div><img class="lg" alt="" src="' + LOGO + '"><span class="bd">📰 ' + esc(t.b) + '</span></div>' +
          '<div class="t"><h2>' + esc(t.h) + '</h2><p>' + esc(t.p) + '</p><ul>' + t.l.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
          '<button class="go">' + esc(t.c) + '</button></div></div>';
        document.body.appendChild(w);
        requestAnimationFrame(function () { w.classList.add('on'); });
        var x = w.querySelector('.x'), left = 3, closed = false;
        var close = function (r) { if (closed) return; closed = true; clearInterval(iv); w.classList.remove('on'); setTimeout(function () { try { w.remove(); } catch (e) {} }, 300); done(r); };
        var iv = setInterval(function () { left--; if (left > 0) { x.textContent = String(left); return; } clearInterval(iv); x.disabled = false; x.textContent = '✕ ' + t.x; }, 1000);
        x.onclick = function () { if (!x.disabled) close(false); };
        w.querySelector('.go').onclick = function () { try { localStorage.setItem('bbpr_opened', String(Date.now())); } catch (e) {} open(appUrl); close(true); };
      } catch (e) { done(false); }
    });
  }
  window.BigBangPromo = { show: show };
})();
