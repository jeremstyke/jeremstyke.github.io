// 2 nov 2026 (10h49, Jeremy): in the player's own Meme Coin Tycoon profile, how many $BATON he earned on Pass The Baton thanks to
// Meme Coin Tycoon (trades, sponsored tasks, stock market prizes, invites, The Last Click). Server: edge function mct-lc, action 'baton'.
(function () {
  var tw = window.Telegram && Telegram.WebApp;
  var FN = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-lc';
  var TX = {
    fr: { t: '🏃 $BATON gagnés grâce à Meme Coin Tycoon', r: 'Total sur Pass The Baton', wait: 'Ils t\'attendent sur Pass The Baton', go: '🏃 Ouvrir Pass The Baton' },
    en: { t: '🏃 $BATON earned with Meme Coin Tycoon', r: 'Total on Pass The Baton', wait: 'They are waiting for you on Pass The Baton', go: '🏃 Open Pass The Baton' },
    id: { t: '🏃 $BATON dari Meme Coin Tycoon', r: 'Total di Pass The Baton', wait: 'Menunggumu di Pass The Baton', go: '🏃 Buka Pass The Baton' },
    ru: { t: '🏃 $BATON, заработанные в Meme Coin Tycoon', r: 'Всего в Pass The Baton', wait: 'Ждут тебя в Pass The Baton', go: '🏃 Открыть Pass The Baton' }
  };
  var L = function () { var l = 'en'; try { if (typeof LANG === 'string') l = LANG; else l = String(tw.initDataUnsafe.user.language_code || 'en'); } catch (e) {} l = String(l).slice(0, 2); return TX[l] || TX.en; };
  var loc = function () { try { return (typeof LANG === 'string' && LANG === 'fr') ? 'fr-FR' : 'en-US'; } catch (e) { return 'en-US'; } };
  var data = null, at = 0, busy = false;
  function get() {
    if (busy || (data && Date.now() - at < 60000)) return Promise.resolve(data);
    busy = true;
    return fetch(FN, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: (tw && tw.initData) || '', action: 'baton' }) })
      .then(function (r) { return r.json(); }).then(function (r) { busy = false; if (r && r.ok) { data = r; at = Date.now(); } return data; })
      .catch(function () { busy = false; return data; });
  }
  function put() {
    var b = document.getElementById('pfb'); if (!b || document.getElementById('pfBt')) return;
    if (!document.getElementById('pfn')) return;  // only the player's own profile (it has the "change nickname" button)
    var grid = b.querySelector('.pgrid'); if (!grid) return;
    var box = document.createElement('div'); box.className = 'pc'; box.id = 'pfBt';
    box.innerHTML = '<div class="pl"></div><div class="prow"><span></span><b>…</b></div>';
    grid.insertAdjacentElement('afterend', box);
    var T = L(); box.querySelector('.pl').textContent = T.t; box.querySelector('.prow span').textContent = T.r;
    get().then(function (d) {
      var x = document.getElementById('pfBt'); if (!x || !d) return;
      x.querySelector('.prow b').textContent = Math.round(Number(d.total) || 0).toLocaleString(loc()) + ' $BATON';
      var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'btn ghost'; btn.style.cssText = 'width:100%;margin-top:8px';
      btn.textContent = d.has_bt ? T.go : T.wait;
      btn.onclick = function () { try { tw.openTelegramLink('https://t.me/PassTheBatonBot?startapp=src_mctpf'); } catch (e) {} };
      x.appendChild(btn);
    });
  }
  new MutationObserver(function () { try { put(); } catch (e) {} }).observe(document.documentElement, { childList: true, subtree: true });
})();
