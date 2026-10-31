// 1 nov 2026 (00h45, Jeremy): Rig Rush and Daily Score are closed. A player who got $BATON from these closings is told once, at opening,
// where they come from: Rig Rush (his RIGZ converted, 1 RIGZ = 1,000 $BATON, + 5,000 gift) and / or Daily Score (10,000 thank-you gift).
(function () {
  try {
    var tw = window.Telegram && Telegram.WebApp; if (!(tw && tw.initData)) return;
    var fr = /^fr/i.test((tw.initDataUnsafe && tw.initDataUnsafe.user && tw.initDataUnsafe.user.language_code) || '');
    var nf = function (n) { return Math.round(Number(n || 0)).toLocaleString(fr ? 'fr-FR' : 'en-US'); };
    var nf2 = function (n) { return Number(n || 0).toLocaleString(fr ? 'fr-FR' : 'en-US', { maximumFractionDigits: 2 }); };
    setTimeout(function () {
      fetch('https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/baton', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ initData: tw.initData, action: 'closegift' }) })
        .then(function (r) { return r.json(); }).then(function (r) {
          if (!r || !r.ok || !r.items || !r.items.length) return;
          var tot = 0, rows = r.items.map(function (x) {
            if (x.k === 'rr') {
              tot += Number(x.baton) + Number(x.bonus);
              return '<div class="cgr"><b>💻 ' + (fr ? 'Rig Rush ferme' : 'Rig Rush is closing') + '</b><span>'
                + (Number(x.rigz) > 0 ? (fr ? 'Tes ' + nf2(x.rigz) + ' RIGZ convertis : +' + nf(x.baton) + ' $BATON (1 RIGZ = 1 000 $BATON)' : 'Your ' + nf2(x.rigz) + ' RIGZ converted: +' + nf(x.baton) + ' $BATON (1 RIGZ = 1,000 $BATON)') + '<br>' : '')
                + (Number(x.bonus) > 0 ? (fr ? 'Cadeau de fermeture : +' + nf(x.bonus) + ' $BATON' : 'Closing gift: +' + nf(x.bonus) + ' $BATON') : '') + '</span></div>';
            }
            tot += Number(x.baton);
            return '<div class="cgr"><b>⚽ ' + (fr ? 'Daily Score ferme' : 'Daily Score is closing') + '</b><span>' + (fr ? 'Merci d\'avoir joué : +' + nf(x.baton) + ' $BATON offerts' : 'Thanks for playing: +' + nf(x.baton) + ' $BATON gift') + '</span></div>';
          }).join('');
          var s = document.createElement('style');
          s.textContent = '#cgS{position:fixed;inset:0;z-index:95;background:rgba(0,0,0,.66);display:flex;align-items:center;justify-content:center;padding:20px}'
            + '#cgS .cb{width:100%;max-width:380px;background:#1f1230;color:#fff3e6;border:1px solid rgba(255,197,49,.45);border-radius:22px;padding:22px 18px;display:flex;flex-direction:column;gap:10px;text-align:center;box-sizing:border-box}'
            + '#cgS h3{margin:0;font-size:20px}#cgS .tot{font-size:30px;font-weight:900;color:#ffc531}#cgS p{margin:0;font-size:13.5px;opacity:.85;line-height:1.45}'
            + '#cgS .cgr{display:flex;flex-direction:column;gap:3px;text-align:left;padding:11px 12px;border-radius:14px;background:rgba(255,255,255,.06)}#cgS .cgr b{font-size:14.5px}#cgS .cgr span{font-size:13px;opacity:.85;line-height:1.45}'
            + '#cgS button{margin-top:4px;padding:13px;border:0;border-radius:14px;background:#ffc531;color:#1a1300;font:inherit;font-weight:900;font-size:16px;cursor:pointer}';
          document.head.appendChild(s);
          var d = document.createElement('div'); d.id = 'cgS';
          d.innerHTML = '<div class="cb"><h3>🎁 ' + (fr ? 'Des $BATON pour toi' : '$BATON for you') + '</h3><div class="tot">+' + nf(tot) + ' $BATON</div>'
            + '<p>' + (fr ? 'Ces jeux ferment : tout ce que tu y avais est maintenant ici, sur Pass The Baton.' : 'These games are closing: everything you had there is now here, on Pass The Baton.') + '</p>'
            + rows + '<p>' + (fr ? '🛒 Échange tes $BATON contre de vrais USDT dans la boutique.' : '🛒 Trade your $BATON for real USDT in the shop.') + '</p>'
            + '<button type="button">' + (fr ? 'Super, merci !' : 'Great, thanks!') + '</button></div>';
          d.querySelector('button').onclick = function () { try { tw.HapticFeedback.notificationOccurred('success'); } catch (e) {} d.remove(); };
          document.body.appendChild(d);
        }).catch(function () {});
    }, 2500);
  } catch (e) {}
})();
