// 1 nov 2026 (00h20, Jeremy): buy sponsored tasks inside Pass The Baton (no more @Batoncheckbot): a small "Promote" button at the top
// of Tasks opens a sheet: what to promote (subscribers for a channel / group, or visits for a mini app, bot or website), the link,
// the pack, paid in Stars (invoice of @PassTheBatonBot, bt_promo on the server), then "My campaigns".
// 00h14: no more "1 million $BATON = 1 $ in USDT · Shop" line under the balance.
// 00h46: the button sits right under the "Tasks" title (a full-width row), and any quantity can be bought, 50 by 50.
(function () {
  try {
    var tw = window.Telegram && Telegram.WebApp; if (!(tw && tw.initData)) return;
    var API = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/baton';
    var fr = /^fr/i.test((tw.initDataUnsafe && tw.initDataUnsafe.user && tw.initDataUnsafe.user.language_code) || '');
    var T = fr ? {
      btn: '📣 Promouvoir ta chaîne, appli ou site web', h: '📣 Fais ta promo dans Pass The Baton',
      intro: 'Ta tâche s\'affiche chez tous les joueurs. Paiement en ⭐ Stars, tout est automatique.',
      sub: '📢 Des abonnés', subS: 'Pour ta chaîne ou ton groupe public : de vrais abonnés, payés seulement s\'ils restent',
      click: '🎮 Des visites', clickS: 'Pour ta mini app, ton bot ou ton site : chaque joueur l\'ouvre 30 s',
      mine: '📊 Mes campagnes', none: 'Pas encore de campagne.', back: '‹ Retour', close: 'Fermer', next: 'Continuer',
      askSub: 'Le @nom ou le lien de ta chaîne ou ton groupe public', phSub: '@machaine ou t.me/machaine',
      askApp: 'Le @nom de ton bot ou le lien de ta mini app', phApp: '@MonBot ou t.me/MonBot/app', askBot: 'Le @nom de ton bot', phBot: '@MonBot',
      askWeb: 'L\'adresse de ton site', phWeb: 'https://monsite.com', mApp: '📱 Mini app', mBot: '🤖 Bot', mWeb: '🌐 Site web',
      admCh: 'Pour vérifier tes abonnés, ajoute @PassTheBatonBot comme admin de ta chaîne (décoche tous les droits : il ne publie jamais rien), puis appuie sur Vérifier.',
      admGr: 'Pour vérifier tes abonnés, ajoute @PassTheBatonBot à ton groupe (il ne publie jamais rien), puis appuie sur Vérifier.',
      addCh: '➕ Ajouter le bot à ma chaîne', addGr: '➕ Ajouter le bot à mon groupe', check: '✅ Vérifier', notYet: 'Le bot n\'est pas encore admin. Ajoute-le puis réessaie.',
      pick: 'Ta campagne', pay: function (n) { return 'Payer ' + n + ' ⭐'; }, u: { sub: 'abonnés', click: 'visites' }, deliv: 'Livraison progressive selon les joueurs actifs.',
      live: '🚀 C\'est parti ! Ta campagne est en ligne.', free: '🎁 Gratuit pour toi : campagne en ligne.',
      st: { live: '🟢 en cours', done: '✅ terminée', stopped: '⛔ arrêtée' }, kept: 'restés', err: { bad_sub: 'Chaîne ou groupe introuvable : il doit être public avec un @nom.', bad_click: 'Envoie le @nom de ton bot (il finit par « bot ») ou son lien t.me.', bad_web: 'L\'adresse doit commencer par https://', other: 'Oups, réessaie.' }
    } : {
      btn: '📣 Promote your channel, app or website', h: '📣 Promote in Pass The Baton',
      intro: 'Your task shows to every player. Paid in ⭐ Stars, fully automatic.',
      sub: '📢 Subscribers', subS: 'For your public channel or group: real subscribers, paid only if they stay',
      click: '🎮 Visits', clickS: 'For your mini app, bot or website: each player opens it 30 s',
      mine: '📊 My campaigns', none: 'No campaign yet.', back: '‹ Back', close: 'Close', next: 'Continue',
      askSub: 'The @name or link of your public channel or group', phSub: '@mychannel or t.me/mychannel',
      askApp: 'Your bot\'s @username or your mini app link', phApp: '@MyBot or t.me/MyBot/app', askBot: 'Your bot\'s @username', phBot: '@MyBot',
      askWeb: 'Your website address', phWeb: 'https://mysite.com', mApp: '📱 Mini app', mBot: '🤖 Bot', mWeb: '🌐 Website',
      admCh: 'To check your subscribers, add @PassTheBatonBot as an admin of your channel (untick every right: it never posts anything), then tap Check.',
      admGr: 'To check your subscribers, add @PassTheBatonBot to your group (it never posts anything), then tap Check.',
      addCh: '➕ Add the bot to my channel', addGr: '➕ Add the bot to my group', check: '✅ Check', notYet: 'The bot is not an admin yet. Add it and try again.',
      pick: 'Your campaign', pay: function (n) { return 'Pay ' + n + ' ⭐'; }, u: { sub: 'subscribers', click: 'visits' }, deliv: 'Delivered gradually by active players.',
      live: '🚀 Live! Your campaign is running.', free: '🎁 Free for you: campaign live.',
      st: { live: '🟢 running', done: '✅ done', stopped: '⛔ stopped' }, kept: 'stayed', err: { bad_sub: 'Channel or group not found: it must be public with an @name.', bad_click: 'Send your bot\'s @username (it ends with "bot") or its t.me link.', bad_web: 'The address must start with https://', other: 'Oops, try again.' }
    };
    var nf = function (n) { return Number(n || 0).toLocaleString(fr ? 'fr-FR' : 'en-US'); };
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var hap = function () { try { tw.HapticFeedback.impactOccurred('light'); } catch (e) {} };
    var say = function (t) { try { tw.showAlert(t); } catch (e) {} };
    function call(action, body) {
      return fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ initData: tw.initData, action: action }, body || {})) })
        .then(function (r) { return r.json(); }).catch(function () { return { ok: false, error: 'other' }; });
    }
    var s = document.createElement('style');
    s.textContent = '[data-t="conv"]{display:none!important}#spTasks{display:none!important}'
      /* 1 nov 2026 (1h02, Jeremy): the partner tasks (paid by clients) at the top of Tasks, right under the Promote button */
      + '#p-tasks>#spTasks2{order:0;margin-top:12px}'
      /* 1 nov 2026 (5h56, Jeremy): no more green "goal of the day" banner (5 tasks = 5,000 $BATON) in Tasks */
      + '#tkGoalBox{display:none!important}'
      + '#p-tasks>#prBtn{order:0;display:flex;justify-content:space-between;align-items:center;gap:10px;width:100%;box-sizing:border-box;margin-top:10px;padding:12px 14px;border-radius:16px;border:1px solid rgba(255,197,49,.35);background:rgba(255,197,49,.08);color:#ffd75a;font:inherit;font-weight:800;font-size:13.5px;text-align:left;cursor:pointer}'
      + '#prS .stp{display:flex;align-items:center;justify-content:center;gap:14px;margin:6px 0}#prS .stp button{width:48px;height:48px;border-radius:14px;border:1px solid rgba(255,197,49,.45);background:rgba(255,197,49,.10);color:#ffd75a;font:inherit;font-size:24px;font-weight:900;cursor:pointer}#prS .stp b{min-width:110px;text-align:center;font-size:26px}#prS .stp small{display:block;font-size:12px;opacity:.7;font-weight:700}'
      + '#prS{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.62);display:flex;align-items:flex-end;justify-content:center}'
      + '#prS .pb{width:100%;max-width:480px;max-height:86vh;overflow-y:auto;background:#1f1230;color:#fff3e6;border:1px solid rgba(255,197,49,.35);border-bottom:0;border-radius:22px 22px 0 0;padding:18px 16px calc(18px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:10px;box-sizing:border-box}'
      + '#prS h3{margin:0;font-size:18px}#prS p{margin:0;font-size:13.5px;line-height:1.45;opacity:.85}'
      + '#prS .ch{display:flex;flex-direction:column;gap:3px;text-align:left;padding:13px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:inherit;font:inherit;cursor:pointer}#prS .ch b{font-size:15px}#prS .ch span{font-size:12.5px;opacity:.75}'
      + '#prS input{width:100%;box-sizing:border-box;padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(0,0,0,.25);color:inherit;font:inherit;font-size:15px}'
      + '#prS .go{padding:12px;border-radius:12px;border:0;background:#ffc531;color:#1a1300;font:inherit;font-weight:900;font-size:15px;cursor:pointer}#prS .go[disabled]{opacity:.5}'
      + '#prS .ghost{padding:10px;border-radius:12px;border:0;background:rgba(255,255,255,.08);color:inherit;font:inherit;font-weight:800;font-size:14px;cursor:pointer}'
      + '#prS .seg{display:flex;gap:6px}#prS .seg button{flex:1;padding:9px 4px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:transparent;color:inherit;font:inherit;font-weight:800;font-size:13px}#prS .seg button.on{background:#ffc531;color:#1a1300;border-color:#ffc531}'
      + '#prS .pk{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,197,49,.35);background:rgba(255,197,49,.08);color:inherit;font:inherit;font-weight:800;font-size:14.5px;cursor:pointer}#prS .pk em{font-style:normal;color:#ffd75a}'
      + '#prS .cm{padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.05);font-size:13px;line-height:1.4}#prS .cm b{font-size:14px}'
      + '#prS .bar{height:6px;border-radius:9px;background:rgba(255,255,255,.1);overflow:hidden;margin-top:6px}#prS .bar i{display:block;height:100%;background:#ffc531}'
      + '#prS .er{color:#ff8a8a;font-size:13px;font-weight:700}';
    document.head.appendChild(s);
    var sheet = null, box = null, cfg = null;
    function open() {
      if (!sheet) {
        sheet = document.createElement('div'); sheet.id = 'prS'; sheet.innerHTML = '<div class="pb"></div>';
        sheet.onclick = function (e) { if (e.target === sheet) sheet.hidden = true; };
        document.body.appendChild(sheet); box = sheet.querySelector('.pb');
      }
      sheet.hidden = false; home();
    }
    function foot(back) { return (back ? '<button class="ghost" data-a="back">' + T.back + '</button>' : '') + '<button class="ghost" data-a="close">' + T.close + '</button>'; }
    function wire(back) {
      box.querySelectorAll('[data-a="close"]').forEach(function (b) { b.onclick = function () { sheet.hidden = true; }; });
      box.querySelectorAll('[data-a="back"]').forEach(function (b) { b.onclick = function () { hap(); (back || home)(); }; });
    }
    function home() {
      box.innerHTML = '<h3>' + T.h + '</h3><p>' + T.intro + '</p>'
        + '<button class="ch" data-k="sub"><b>' + T.sub + '</b><span>' + T.subS + '</span></button>'
        + '<button class="ch" data-k="click"><b>' + T.click + '</b><span>' + T.clickS + '</span></button>'
        + '<h3 style="font-size:15px;margin-top:6px">' + T.mine + '</h3><div id="prMine"><p>…</p></div>' + foot(false);
      wire();
      box.querySelectorAll('[data-k]').forEach(function (b) { b.onclick = function () { hap(); target(b.dataset.k, 'app'); }; });
      call('promo').then(function (r) {
        if (!r || !r.ok) return; cfg = r;
        var el = document.getElementById('prMine'); if (!el) return;
        el.innerHTML = (r.mine && r.mine.length) ? r.mine.map(function (c) {
          var pct = c.qty ? Math.min(100, Math.round(100 * c.n / c.qty)) : 0;
          return '<div class="cm"><b>' + esc(c.title) + '</b> · ' + (T.st[c.status] || c.status) + '<br>' + nf(c.n) + ' / ' + nf(c.qty) + ' ' + T.u[c.kind] + (c.kind === 'sub' && c.kept ? ' · ' + nf(c.kept) + ' ' + T.kept : '') + '<div class="bar"><i style="width:' + pct + '%"></i></div></div>';
        }).join('') : '<p>' + T.none + '</p>';
      });
    }
    function target(kind, mode) {
      var ask = kind === 'sub' ? T.askSub : mode === 'web' ? T.askWeb : mode === 'bot' ? T.askBot : T.askApp;
      var ph = kind === 'sub' ? T.phSub : mode === 'web' ? T.phWeb : mode === 'bot' ? T.phBot : T.phApp;
      box.innerHTML = '<h3>' + (kind === 'sub' ? T.sub : T.click) + '</h3>'
        + (kind === 'click' ? '<div class="seg"><button data-m="app">' + T.mApp + '</button><button data-m="bot">' + T.mBot + '</button><button data-m="web">' + T.mWeb + '</button></div>' : '')
        + '<p>' + ask + '</p><input id="prIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + esc(ph) + '"><div class="er" id="prEr"></div>'
        + '<button class="go" id="prGo">' + T.next + '</button>' + foot(true);
      wire();
      box.querySelectorAll('[data-m]').forEach(function (b) { b.classList.toggle('on', b.dataset.m === mode); b.onclick = function () { hap(); target(kind, b.dataset.m); }; });
      var go = document.getElementById('prGo'), inp = document.getElementById('prIn');
      go.onclick = function () {
        var v = inp.value.trim(); if (!v) return; hap(); go.disabled = true;
        call('promo_new', { kind: kind, mode: mode, target: v }).then(function (r) {
          go.disabled = false;
          if (!r || !r.ok) { document.getElementById('prEr').textContent = T.err[(r && r.error) || 'other'] || T.err.other; return; }
          if (r.admin) packs(kind, r); else admin(r);
        });
      };
    }
    function admin(o) {
      var ch = o.type === 'channel';
      box.innerHTML = '<h3>' + esc(o.title) + '</h3><p>' + (ch ? T.admCh : T.admGr) + '</p>'
        + '<button class="go" id="prAdd">' + (ch ? T.addCh : T.addGr) + '</button><button class="ghost" id="prChk">' + T.check + '</button><div class="er" id="prEr"></div>' + foot(true);
      wire(function () { target('sub', 'app'); });
      document.getElementById('prAdd').onclick = function () { hap(); var u = ch ? 'https://t.me/PassTheBatonBot?startchannel=check&admin=invite_users' : 'https://t.me/PassTheBatonBot?startgroup=check'; try { tw.openTelegramLink(u); } catch (e) { location.href = u; } };
      var c = document.getElementById('prChk');
      c.onclick = function () { hap(); c.disabled = true; call('promo_check', { id: o.id }).then(function (r) { c.disabled = false; if (r && r.ok && r.admin) packs('sub', r); else document.getElementById('prEr').textContent = T.notYet; }); };
    }
    function packs(kind, o) {
      var show = function (c) {
        var rate = Number((c && c[kind + '_rate']) || (kind === 'sub' ? 3 : 0.75)), max = Number((c && c.max) || 5000), q = 50;
        box.innerHTML = '<h3>' + esc(o.title) + '</h3><p>' + T.pick + ' · ' + T.deliv + '</p>'
          + '<div class="stp"><b id="prQ"></b></div>'  /* 1 nov 2026 (1h01, Jeremy): no + / - buttons at all */
          + '<button class="go" id="prPay"></button><div class="er" id="prEr"></div>' + foot(true);
        wire(function () { target(kind, 'app'); });
        var paint = function () {
          document.getElementById('prQ').innerHTML = nf(q) + '<small>' + T.u[kind] + '</small>';
          document.getElementById('prPay').textContent = T.pay(nf(Math.ceil(q * rate)));
        };
        box.querySelectorAll('[data-d]').forEach(function (b) { b.onclick = function () { hap(); q = Math.min(max, Math.max(50, q + 50 * Number(b.dataset.d))); paint(); }; });
        paint();
        // 00h51 (Jeremy): 50 at most for now (not enough players): just "50", no + / - buttons
        if (max <= 50) box.querySelectorAll('[data-d]').forEach(function (b) { b.style.display = 'none'; });
        var pay = document.getElementById('prPay');
        pay.onclick = function () {
          hap(); pay.disabled = true;
          call('promo_pay', { id: o.id, qty: q }).then(function (r) {
            pay.disabled = false;
            if (r && r.ok && r.free) { say(T.free); home(); return; }
            if (!r || !r.ok || !r.link) { document.getElementById('prEr').textContent = T.err.other; return; }
            tw.openInvoice(r.link, function (st) { if (st === 'paid') { say(T.live); home(); } });
          });
        };
      };
      if (cfg) show(cfg); else call('promo').then(function (r) { cfg = r; show(r); });
    }
    // the button at the top of Tasks
    setInterval(function () {
      var pt = document.getElementById('p-tasks'); if (!pt || document.getElementById('prBtn')) return;
      var sc = pt.querySelector('.score'); if (!sc) return;  // right under the "Tasks" title
      var b = document.createElement('button'); b.id = 'prBtn'; b.type = 'button'; b.innerHTML = '<span>' + T.btn + '</span><span>›</span>';
      b.onclick = function () { hap(); open(); };
      sc.insertAdjacentElement('afterend', b);
    }, 800);
    // 1 nov 2026 (5h58, Jeremy): the goal of the day, discreetly, right under the title of the sponsored tasks block: "10 tasks today = +5,000 $BATON · 3/10"
    var ms = document.createElement('style'); ms.textContent = '.tkMini{font-size:12px;font-weight:700;opacity:.75;margin:-2px 0 8px}'; document.head.appendChild(ms);
    setInterval(function () {
      var B = window.BT, S = B && B.S, box = document.getElementById('adtask'); if (!S || S.tkGoal == null || !box) return;
      var hd = box.querySelector('.adh'); if (!hd) return;
      /* 2 nov 2026 (13h01, Jeremy): the next reward waiting: the 10th task, then the 25th (tkGoal2) */
      var g = Number(S.tkGoal) || 10, n = Number(S.tkDone) || 0, g2 = Number(S.tkGoal2) || 0, tg = n < g ? g : (g2 > n ? g2 : 0), k = tg - n, b = nf(tg === g ? (S.tkBonus || 5000) : (S.tkBonus2 || 10000));
      var t = tg ? (fr ? '🎁 Prochaine récompense : encore ' + k + ' tâche' + (k > 1 ? 's' : '') + ' → +' + b + ' $BATON · ' + n + '/' + tg : '🎁 Next reward: ' + k + ' more task' + (k > 1 ? 's' : '') + ' → +' + b + ' $BATON · ' + n + '/' + tg)
                 : (fr ? '✅ Tous les bonus du jour sont gagnés !' : '✅ All the bonuses of the day are won!');
      var m = hd.nextElementSibling; if (!m || !m.classList.contains('tkMini')) { m = document.createElement('div'); m.className = 'tkMini'; hd.insertAdjacentElement('afterend', m); }
      if (m.textContent !== t) m.textContent = t;
    }, 1000);
    // opened from the bot ("My campaigns", "New campaign"): startapp=promo
    if (((tw.initDataUnsafe && tw.initDataUnsafe.start_param) || '') === 'promo') setTimeout(open, 1500);
  } catch (e) {}
})();
