// 14 oct 2026: Meme Coin Tycoon, mining boost x2: a small window with two choices, pay 5 stars (the usual payment) or watch a
// rewarded ad (Adsgram block 53969). After the ad, the Supabase function mct-ton (action 'boost_ad') turns the boost on, with the
// same rules as the paid boost (1 hour, once a day). If no ad can be shown, the boost is given anyway.
(() => {
  const BLOCK = '53969';
  const F = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-ton';
  const TX = {
    en: { lb: '⚡ Boost x2', h: '⚡ Boost x2 for 1 hour', s: 'Double your mining for 1 hour. One boost a day.', pay: 'Pay 5 ⭐', ad: '📺 Watch an ad (free)', cancel: 'Cancel', short: 'Watch the ad to the end to get your boost.', err: 'Something went wrong, try again.' },
    fr: { lb: '⚡ Boost x2', h: '⚡ Boost x2 pendant 1 heure', s: 'Double ton minage pendant 1 heure. Un boost par jour.', pay: 'Payer 5 ⭐', ad: '📺 Regarder une pub (gratuit)', cancel: 'Annuler', short: 'Regarde la pub jusqu\'au bout pour avoir ton boost.', err: 'Une erreur est survenue, réessaie.' },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] || TX.en; };
  const hap = (k) => { try { haptic(k); } catch (e) {} };
  const say = (m) => { try { toast(m); } catch (e) {} };
  let pass = false, busy = false;
  if (!document.querySelector('script[src*="sad.adsgram.ai"]')) { const s = document.createElement('script'); s.src = 'https://sad.adsgram.ai/js/sad.min.js'; s.async = true; document.head.appendChild(s); }
  const css = document.createElement('style');
  css.textContent = '#bstw{position:fixed;inset:0;z-index:30;background:rgba(10,2,25,.6);display:flex;align-items:flex-end;justify-content:center}'
    + '#bstw .in{width:100%;max-width:560px;background:#2b0a57;border-radius:22px 22px 0 0;padding:20px 18px calc(22px + env(safe-area-inset-bottom));border-top:1px solid rgba(255,255,255,.12)}'
    + '#bstw h3{margin:0 0 4px;font-size:20px}#bstw p{margin:0 0 16px;color:#b4a3d8;font-size:14px}#bstw .ghost{display:block;width:100%;margin-top:10px;text-align:center}';
  document.head.appendChild(css);
  async function grant(ad) {
    let r = null;
    try { r = await fetch(F, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ app: 'mct', initData: tw.initData, action: 'boost_ad', ad }) }).then((x) => x.json()); } catch (e) {}
    if (r && r.ok) { hap('ok'); let ok = '⚡'; try { ok = t('boost_ok'); } catch (e) {} say(ok); try { if (VIEW === 'mine') mine(); } catch (e) {} return; }
    let m = L().err; try { if (r && r.error) m = errMsg(r); } catch (e) {} say(m);
  }
  function watch() {
    if (busy) return; busy = true;
    let ctl = null; try { ctl = window.Adsgram && window.Adsgram.init({ blockId: BLOCK }); } catch (e) {}
    if (!ctl) { busy = false; grant('none'); return; } // no ad possible: the boost is given anyway
    ctl.show().then((res) => { busy = false; if (res && res.done === false) { say(L().short); return; } grant('done'); })
      .catch((res) => { busy = false; if (res && res.done === false && res.error === false) { say(L().short); return; } grant('none'); });
  }
  function open(btn) {
    const T = L(), w = document.createElement('div'); w.id = 'bstw';
    w.innerHTML = `<div class="in"><h3>${T.h}</h3><p>${T.s}</p><button class="btn" id="bstad">${T.ad}</button><button class="ghost" id="bstpay">${T.pay}</button><button class="ghost" id="bstno" style="background:none;border:none;color:#b4a3d8">${T.cancel}</button></div>`;
    document.body.appendChild(w);
    const close = () => w.remove();
    w.onclick = (e) => { if (e.target === w) close(); };
    w.querySelector('#bstno').onclick = close;
    w.querySelector('#bstad').onclick = () => { hap(); close(); watch(); };
    w.querySelector('#bstpay').onclick = () => { hap(); close(); pass = true; btn.click(); }; // the usual 5-star payment of the game
  }
  // the game's boost button: it shows just "Boost x2" (not the price in stars, players thought it was stars only)
  // and opens the window with the two choices (Supporters keep their free boost as before)
  function relabel() {
    const b = document.getElementById('boost');
    if (b && !b.disabled && /⭐/.test(b.textContent || '')) { b.dataset.ad = '1'; b.textContent = L().lb; }
    else if (b && b.disabled && b.dataset.ad) delete b.dataset.ad;
  }
  new MutationObserver(relabel).observe(document.body, { childList: true, subtree: true, characterData: true });
  relabel();
  document.addEventListener('click', (e) => {
    const b = e.target && e.target.closest ? e.target.closest('#boost') : null;
    if (!b || b.disabled) return;
    if (pass) { pass = false; return; }
    if (b.dataset.ad !== '1' && !/⭐/.test(b.textContent || '')) return;
    let tg = ''; try { tg = tw.initData; } catch (er) {}
    if (!tg) return;
    e.preventDefault(); e.stopImmediatePropagation(); e.stopPropagation();
    hap(); open(b);
  }, true);
})();
