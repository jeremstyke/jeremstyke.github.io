/* PostPay interstitial (12 nov 2026, Jeremy): replaces the Big Bang AI interstitial in all his games.
   "Gagner de l'argent avec votre chaîne ou acheter des posts sur d'autres chaînes".
   Usage: PostPayPromo.show({ src: 'mct', lang: 'fr' }) -> Promise resolved when closed (true if a button was tapped).
   window.BigBangPromo is kept as an alias so every old call shows PostPay. */
(function () {
  if (window.PostPayPromo) return;
  var BOT = 'Postpayadsbot';
  var T = {
    en: { b: 'PostPay', h: 'Your Telegram channel can pay you', p: 'Advertisers pay in USDT to post on your channel. You set the price, you approve each ad, the money goes straight to your wallet.', n: '+9 USDT received', ns: 'Ad on your channel', l: ['💰 You keep 90% of every ad', '⚡ Add your channel in 1 tap', '🔒 Paid directly, we never touch your money'], c: '💸 Earn with my channel', a: '📢 Buy posts on other channels', x: 'Close' },
    fr: { b: 'PostPay', h: 'Ta chaîne Telegram peut te payer', p: 'Des annonceurs paient en USDT pour publier sur ta chaîne. Tu fixes ton prix, tu acceptes chaque pub, l\'argent arrive directement sur ton wallet.', n: '+9 USDT reçus', ns: 'Pub sur ta chaîne', l: ['💰 Tu gardes 90 % de chaque pub', '⚡ Ta chaîne ajoutée en 1 clic', '🔒 Paiement direct, on ne touche jamais ton argent'], c: '💸 Gagner avec ma chaîne', a: '📢 Acheter des posts sur d\'autres chaînes', x: 'Fermer' },
    es: { b: 'PostPay', h: 'Tu canal de Telegram puede pagarte', p: 'Los anunciantes pagan en USDT por publicar en tu canal. Tú pones el precio, apruebas cada anuncio y el dinero llega directo a tu wallet.', n: '+9 USDT recibidos', ns: 'Anuncio en tu canal', l: ['💰 Te quedas el 90 % de cada anuncio', '⚡ Añade tu canal en 1 toque', '🔒 Pago directo, nunca tocamos tu dinero'], c: '💸 Ganar con mi canal', a: '📢 Comprar posts en otros canales', x: 'Cerrar' },
    pt: { b: 'PostPay', h: 'Seu canal do Telegram pode te pagar', p: 'Anunciantes pagam em USDT para postar no seu canal. Você define o preço, aprova cada anúncio e o dinheiro cai direto na sua carteira.', n: '+9 USDT recebidos', ns: 'Anúncio no seu canal', l: ['💰 Você fica com 90 % de cada anúncio', '⚡ Adicione seu canal em 1 toque', '🔒 Pagamento direto, nunca tocamos no seu dinheiro'], c: '💸 Ganhar com meu canal', a: '📢 Comprar posts em outros canais', x: 'Fechar' },
    ru: { b: 'PostPay', h: 'Твой Telegram-канал может платить тебе', p: 'Рекламодатели платят в USDT за пост в твоём канале. Ты ставишь цену, одобряешь каждую рекламу, деньги приходят прямо на кошелёк.', n: '+9 USDT получено', ns: 'Реклама в твоём канале', l: ['💰 Тебе 90 % с каждой рекламы', '⚡ Канал добавляется в 1 касание', '🔒 Прямая оплата, мы не трогаем твои деньги'], c: '💸 Зарабатывать на канале', a: '📢 Купить посты в других каналах', x: 'Закрыть' },
    id: { b: 'PostPay', h: 'Kanal Telegram-mu bisa membayarmu', p: 'Pengiklan membayar USDT untuk posting di kanalmu. Kamu tentukan harga, setujui tiap iklan, uang langsung masuk ke wallet-mu.', n: '+9 USDT diterima', ns: 'Iklan di kanalmu', l: ['💰 Kamu dapat 90 % dari tiap iklan', '⚡ Tambah kanal dalam 1 ketuk', '🔒 Bayar langsung, kami tak menyentuh uangmu'], c: '💸 Hasilkan dari kanalku', a: '📢 Beli post di kanal lain', x: 'Tutup' },
    tr: { b: 'PostPay', h: 'Telegram kanalın sana kazandırabilir', p: 'Reklamverenler kanalında paylaşım için USDT öder. Fiyatı sen belirlersin, her reklamı onaylarsın, para doğrudan cüzdanına gelir.', n: '+9 USDT alındı', ns: 'Kanalında reklam', l: ['💰 Her reklamın %90\'ı senin', '⚡ Kanalını 1 dokunuşla ekle', '🔒 Doğrudan ödeme, paranıza dokunmayız'], c: '💸 Kanalımla kazan', a: '📢 Diğer kanallarda post satın al', x: 'Kapat' },
    ar: { b: 'PostPay', h: 'قناتك على Telegram يمكن أن تدفع لك', p: 'يدفع المعلنون بـ USDT للنشر في قناتك. أنت تحدد السعر وتوافق على كل إعلان، والمال يصل مباشرة إلى محفظتك.', n: '+9 USDT تم استلامها', ns: 'إعلان في قناتك', l: ['💰 لك 90 % من كل إعلان', '⚡ أضف قناتك بلمسة واحدة', '🔒 دفع مباشر، لا نلمس أموالك أبدًا'], c: '💸 اربح من قناتي', a: '📢 اشترِ منشورات في قنوات أخرى', x: 'إغلاق' },
  };
  var CSS = '#pppr{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:calc(18px + env(safe-area-inset-top,0px)) 18px calc(18px + env(safe-area-inset-bottom,0px));background:rgba(3,8,22,.84);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font:15px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,system-ui,sans-serif;color:#fff;opacity:0;transition:opacity .3s}' +
    '#pppr.on{opacity:1}#pppr .k{position:relative;width:100%;max-width:380px;border-radius:30px;overflow:hidden;background:#070d1f;border:1px solid rgba(96,165,250,.25);box-shadow:0 40px 90px -25px rgba(37,99,235,.6);transform:translateY(16px) scale(.96);transition:transform .45s cubic-bezier(.2,.9,.3,1.15)}#pppr.on .k{transform:none}' +
    '#pppr .top{position:relative;height:186px;overflow:hidden;background:radial-gradient(120% 140% at 0% 0%,#2563eb 0%,#1e3a8a 45%,#070d1f 100%)}' +
    '#pppr .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:22px 22px;-webkit-mask:linear-gradient(#000,transparent);mask:linear-gradient(#000,transparent)}' +
    '#pppr .brand{position:absolute;left:16px;top:14px;display:flex;align-items:center;gap:8px;font-weight:800;font-size:15px}#pppr .lg{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#60a5fa,#2563eb);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:16px;box-shadow:0 4px 14px rgba(37,99,235,.6)}' +
    '#pppr .post{position:absolute;left:18px;top:56px;width:210px;border-radius:16px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);padding:10px 12px;animation:ppfloat 4s ease-in-out infinite}' +
    '#pppr .post i{display:block;height:8px;border-radius:6px;background:rgba(255,255,255,.22);margin:4px 0}#pppr .post i.s{width:62%}#pppr .post b{display:block;margin-top:8px;text-align:center;font-size:12px;font-weight:800;padding:7px;border-radius:9px;background:rgba(96,165,250,.3);color:#dbeafe}' +
    '#pppr .nt{position:absolute;right:14px;top:112px;display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:16px;background:rgba(255,255,255,.96);color:#0b1020;box-shadow:0 14px 30px rgba(0,0,0,.35);animation:ppnt 3.2s cubic-bezier(.2,.9,.3,1.2) infinite}' +
    '#pppr .nt .ic{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;font-size:16px}#pppr .nt b{display:block;font-size:13.5px;color:#16a34a}#pppr .nt span{display:block;font-size:11px;color:#64748b;font-weight:600}' +
    '#pppr .coin{position:absolute;bottom:-20px;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#7ee2b8,#26a17b 60%,#13795b);box-shadow:0 0 12px rgba(38,161,123,.6);color:#fff;font-size:12px;font-weight:900;display:flex;align-items:center;justify-content:center;animation:ppcoin 3.6s linear infinite}' +
    '@keyframes ppfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}@keyframes ppnt{0%{transform:translateY(16px) scale(.9);opacity:0}12%,80%{transform:none;opacity:1}100%{transform:translateY(-8px);opacity:0}}@keyframes ppcoin{0%{transform:translateY(0) rotate(0);opacity:0}10%{opacity:1}100%{transform:translateY(-220px) rotate(360deg);opacity:0}}' +
    '#pppr .t{padding:16px 22px 20px}#pppr h2{margin:0 0 8px;font-size:23px;line-height:1.15;letter-spacing:-.02em;font-weight:850;text-align:center}#pppr p{margin:0 0 14px;color:#b8c6e6;text-align:center;font-size:14px}' +
    '#pppr ul{list-style:none;margin:0 0 14px;padding:0;display:grid;gap:7px}#pppr li{padding:9px 12px;border-radius:13px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07);font-weight:600;font-size:13.5px}' +
    '#pppr .go{display:block;width:100%;border:0;border-radius:17px;padding:16px;font-size:16.5px;font-weight:800;line-height:1.2;font-family:inherit;color:#fff;background:linear-gradient(120deg,#3b82f6,#2563eb 55%,#1d4ed8);box-shadow:0 16px 36px -12px rgba(37,99,235,.9);cursor:pointer;animation:ppbtn 2.4s ease-in-out infinite}@keyframes ppbtn{0%,100%{transform:scale(1)}50%{transform:scale(1.025)}}' +
    '#pppr .ad{display:block;width:100%;margin-top:9px;border:1px solid rgba(96,165,250,.35);border-radius:15px;padding:13px;background:rgba(37,99,235,.12);color:#cfe0ff;font:700 14.5px/1.2 inherit;font-family:inherit;cursor:pointer}' +
    '#pppr .x{position:absolute;top:12px;right:12px;z-index:2;min-width:34px;height:34px;padding:0 10px;border-radius:99px;border:0;background:rgba(0,0,0,.4);color:#fff;font-size:13px;font-weight:700;line-height:34px;font-family:inherit;cursor:pointer}#pppr .x[disabled]{opacity:.6;cursor:default}' +
    '@media (prefers-reduced-motion:reduce){#pppr .post,#pppr .nt,#pppr .coin,#pppr .go{animation:none}}';
  function open(u) { try { var tw = window.Telegram && window.Telegram.WebApp; if (tw && tw.openTelegramLink) tw.openTelegramLink(u); else window.open(u, '_blank'); } catch (e) { try { window.open(u, '_blank'); } catch (e2) {} } }
  function show(o) {
    o = o || {};
    return new Promise(function (done) {
      try {
        if (document.getElementById('pppr')) return done(false);
        var lg = String(o.lang || (navigator.language || 'en')).slice(0, 2).toLowerCase(), t = T[lg] || T.en;
        var src = String(o.src || 'promo').replace(/[^a-z0-9_]/gi, '').slice(0, 30);
        var owner = 'https://t.me/' + BOT + '?start=src_' + src + '_int';
        var buyer = 'https://t.me/' + BOT + '?start=src_' + src + '_intad';
        if (!document.getElementById('ppprc')) { var st = document.createElement('style'); st.id = 'ppprc'; st.textContent = CSS; document.head.appendChild(st); }
        var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
        var coins = ''; for (var i = 0; i < 7; i++) coins += '<i class="coin" style="left:' + (8 + i * 13) + '%;animation-delay:' + (i * 0.5).toFixed(1) + 's">$</i>';
        var w = document.createElement('div'); w.id = 'pppr'; if (lg === 'ar') w.dir = 'rtl';
        w.innerHTML = '<div class="k" role="dialog" aria-label="PostPay"><button class="x" disabled>3</button>' +
          '<div class="top"><div class="grid"></div>' + coins + '<div class="brand"><span class="lg">P</span>' + esc(t.b) + '</div>' +
          '<div class="post"><i></i><i></i><i class="s"></i><b>Sponsored</b></div>' +
          '<div class="nt"><span class="ic">💰</span><div><b>' + esc(t.n) + '</b><span>' + esc(t.ns) + '</span></div></div></div>' +
          '<div class="t"><h2>' + esc(t.h) + '</h2><p>' + esc(t.p) + '</p><ul>' + t.l.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
          '<button class="go">' + esc(t.c) + '</button><button class="ad">' + esc(t.a) + '</button></div></div>';
        document.body.appendChild(w);
        requestAnimationFrame(function () { w.classList.add('on'); });
        var x = w.querySelector('.x'), left = 3, closed = false;
        var close = function (r) { if (closed) return; closed = true; clearInterval(iv); w.classList.remove('on'); setTimeout(function () { try { w.remove(); } catch (e) {} }, 300); done(r); };
        var iv = setInterval(function () { left--; if (left > 0) { x.textContent = String(left); return; } clearInterval(iv); x.disabled = false; x.textContent = '✕ ' + t.x; }, 1000);
        x.onclick = function () { if (!x.disabled) close(false); };
        w.querySelector('.go').onclick = function () { open(owner); close(true); };
        w.querySelector('.ad').onclick = function () { open(buyer); close(true); };
      } catch (e) { done(false); }
    });
  }
  window.PostPayPromo = { show: show };
  window.BigBangPromo = window.PostPayPromo;
})();
