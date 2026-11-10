/* Big Bang AI News interstitial (10 nov 2026, Jeremy): replaces the SayApp promo in Meme Coin Tycoon, Pass The Baton and Rig Rush.
   Usage: BigBangPromo.show({ src: 'mct', lang: 'fr' }) -> Promise resolved when closed. */
(function () {
  if (window.BigBangPromo) return;
  var LOGO = 'https://bigbang-ai-production.up.railway.app/logo.jpg';
  var T = {
    en: { b: 'Big Bang AI News', h: 'The free AI of Telegram has its channel', p: 'Tips, new features and the best mini apps made with Big Bang AI, every day.', l: ['⚡ Free and unlimited AI, right in Telegram', '🌐 Answers from the live web', '🧩 Build your own mini app in one sentence'], c: '📰 Join the channel', o: 'or open Big Bang AI', x: 'Close', bonus: { mct: '🎁 In this game: +$2,000 every day and +10% mining while you are in the channel', rr: '🎁 In this game: +5% mining while you are in the channel', ptb: '🎁 Join task in this game: one of the best paid' } },
    fr: { b: 'Big Bang AI News', h: "L'IA gratuite de Telegram a sa chaîne", p: 'Astuces, nouveautés et les meilleures mini-apps créées avec Big Bang AI, chaque jour.', l: ['⚡ IA gratuite et illimitée, directement dans Telegram', '🌐 Réponses tirées du web en direct', '🧩 Crée ta propre mini-app en une phrase'], c: '📰 Rejoindre la chaîne', o: 'ou ouvrir Big Bang AI', x: 'Fermer', bonus: { mct: '🎁 Dans ce jeu : +2 000 $ chaque jour et +10 % de minage tant que tu es dans la chaîne', rr: '🎁 Dans ce jeu : +5 % de minage tant que tu es dans la chaîne', ptb: "🎁 Tâche dans ce jeu : l'une des mieux payées" } },
    es: { b: 'Big Bang AI News', h: 'La IA gratis de Telegram tiene su canal', p: 'Trucos, novedades y las mejores mini apps hechas con Big Bang AI, cada día.', l: ['⚡ IA gratis e ilimitada, dentro de Telegram', '🌐 Respuestas desde la web en vivo', '🧩 Crea tu propia mini app con una frase'], c: '📰 Unirme al canal', o: 'o abrir Big Bang AI', x: 'Cerrar', bonus: { mct: '🎁 En este juego: +$2,000 cada día y +10% de minería mientras estés en el canal', rr: '🎁 En este juego: +5% de minería mientras estés en el canal', ptb: '🎁 Tarea en este juego: de las mejor pagadas' } },
    pt: { b: 'Big Bang AI News', h: 'A IA grátis do Telegram tem seu canal', p: 'Dicas, novidades e os melhores mini apps feitos com Big Bang AI, todo dia.', l: ['⚡ IA grátis e ilimitada, dentro do Telegram', '🌐 Respostas da web ao vivo', '🧩 Crie seu próprio mini app com uma frase'], c: '📰 Entrar no canal', o: 'ou abrir Big Bang AI', x: 'Fechar', bonus: { mct: '🎁 Neste jogo: +$2,000 por dia e +10% de mineração enquanto estiver no canal', rr: '🎁 Neste jogo: +5% de mineração enquanto estiver no canal', ptb: '🎁 Tarefa neste jogo: uma das mais bem pagas' } },
    ru: { b: 'Big Bang AI News', h: 'У бесплатного ИИ Telegram есть свой канал', p: 'Советы, новинки и лучшие мини-приложения, созданные с Big Bang AI, каждый день.', l: ['⚡ Бесплатный безлимитный ИИ прямо в Telegram', '🌐 Ответы из интернета в реальном времени', '🧩 Создай своё мини-приложение одной фразой'], c: '📰 Подписаться на канал', o: 'или открыть Big Bang AI', x: 'Закрыть', bonus: { mct: '🎁 В этой игре: +$2,000 каждый день и +10% майнинга, пока ты в канале', rr: '🎁 В этой игре: +5% майнинга, пока ты в канале', ptb: '🎁 Задание в этой игре: одно из самых выгодных' } },
    id: { b: 'Big Bang AI News', h: 'AI gratis di Telegram kini punya channel', p: 'Tips, fitur baru, dan mini app terbaik buatan Big Bang AI, setiap hari.', l: ['⚡ AI gratis tanpa batas, langsung di Telegram', '🌐 Jawaban dari web secara langsung', '🧩 Buat mini app sendiri dengan satu kalimat'], c: '📰 Gabung channel', o: 'atau buka Big Bang AI', x: 'Tutup', bonus: { mct: '🎁 Di game ini: +$2,000 setiap hari dan +10% mining selama kamu di channel', rr: '🎁 Di game ini: +5% mining selama kamu di channel', ptb: '🎁 Tugas di game ini: salah satu bayaran tertinggi' } },
    tr: { b: 'Big Bang AI News', h: "Telegram'ın ücretsiz yapay zekâsının kanalı", p: 'İpuçları, yenilikler ve Big Bang AI ile yapılan en iyi mini uygulamalar, her gün.', l: ["⚡ Ücretsiz ve sınırsız yapay zekâ, Telegram'da", '🌐 Canlı webden yanıtlar', '🧩 Tek cümleyle kendi mini uygulamanı yap'], c: '📰 Kanala katıl', o: "ya da Big Bang AI'ı aç", x: 'Kapat', bonus: { mct: '🎁 Bu oyunda: kanalda olduğun sürece her gün +$2,000 ve +%10 madencilik', rr: '🎁 Bu oyunda: kanalda olduğun sürece +%5 madencilik', ptb: '🎁 Bu oyundaki görev: en çok kazandıranlardan' } },
    ar: { b: 'Big Bang AI News', h: 'للذكاء الاصطناعي المجاني في تيليجرام قناته', p: 'نصائح وميزات جديدة وأفضل التطبيقات المصغرة المصنوعة بـ Big Bang AI كل يوم.', l: ['⚡ ذكاء اصطناعي مجاني وغير محدود داخل تيليجرام', '🌐 إجابات من الويب مباشرة', '🧩 أنشئ تطبيقك المصغر بجملة واحدة'], c: '📰 انضم إلى القناة', o: 'أو افتح Big Bang AI', x: 'إغلاق', bonus: { mct: '🎁 في هذه اللعبة: +2,000$ يوميًا و+10% تعدين ما دمت في القناة', rr: '🎁 في هذه اللعبة: +5% تعدين ما دمت في القناة', ptb: '🎁 مهمة في هذه اللعبة: من الأعلى أجرًا' } }
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
        try { if (Date.now() - Number(localStorage.getItem('bbpr_joined') || 0) < 7 * 864e5) return done(null); } catch (e) {}  // already sent to the channel this week: the game shows its normal ad
        var lg = String(o.lang || (navigator.language || 'en')).slice(0, 2).toLowerCase(), t = T[lg] || T.en;
        var src = String(o.src || 'promo').replace(/[^a-z0-9_]/gi, '').slice(0, 30);
        var appUrl = 'https://t.me/Bigbangaibot/App?startapp=src_' + src + '_int';
        if (!document.getElementById('bbprc')) { var st = document.createElement('style'); st.id = 'bbprc'; st.textContent = CSS; document.head.appendChild(st); }
        var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
        var stars = ''; for (var i = 0; i < 26; i++) stars += '<i class="st" style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 100).toFixed(1) + '%;animation-delay:' + (Math.random() * 3).toFixed(2) + 's"></i>';
        var w = document.createElement('div'); w.id = 'bbpr'; if (lg === 'ar') w.dir = 'rtl';
        w.innerHTML = '<div class="k" role="dialog" aria-label="Big Bang AI News"><button class="x" disabled>3</button>' +
          '<div class="sky">' + stars + '<div class="burst"></div><div class="glow"></div><img class="lg" alt="" src="' + LOGO + '"><span class="bd">📰 ' + esc(t.b) + '</span></div>' +
          '<div class="t"><h2>' + esc(t.h) + '</h2><p>' + esc(t.p) + '</p><ul>' + t.l.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
          (t.bonus[src] ? '<div class="bn">' + esc(t.bonus[src]) + '</div>' : '') +
          '<button class="go">' + esc(t.c) + '</button><button class="op">' + esc(t.o) + '</button></div></div>';
        document.body.appendChild(w);
        requestAnimationFrame(function () { w.classList.add('on'); });
        var x = w.querySelector('.x'), left = 3, closed = false;
        var close = function (r) { if (closed) return; closed = true; clearInterval(iv); w.classList.remove('on'); setTimeout(function () { try { w.remove(); } catch (e) {} }, 300); done(r); };
        var iv = setInterval(function () { left--; if (left > 0) { x.textContent = String(left); return; } clearInterval(iv); x.disabled = false; x.textContent = '✕ ' + t.x; }, 1000);
        x.onclick = function () { if (!x.disabled) close(false); };
        w.querySelector('.go').onclick = function () { try { localStorage.setItem('bbpr_joined', String(Date.now())); } catch (e) {} open('https://t.me/bigbangainews'); close(true); };
        w.querySelector('.op').onclick = function () { open(appUrl); close(true); };
      } catch (e) { done(false); }
    });
  }
  window.BigBangPromo = { show: show };
})();
