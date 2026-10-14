// 14 oct 2026: Meme Coin Tycoon, Adsgram Task (task-53965): +$50 in the game each time, 3 times a day at most.
// Fixed just above the bottom menu, on every screen (hidden on a coin's page, which has its own trade bar). Adsgram calls the reward URL (Supabase function mct-adreward),
// which credits the player and enforces the daily limit; here we only show it and refresh the balance.
(() => {
  const BLOCK = 'task-53965', MAX = 3, USD = 50;
  const TX = {
    en: { r: '+$' + USD + ' cash', h: (n) => '🎁 Bonus task: +$' + USD + ' (' + n + '/' + MAX + ' today)', ok: '🎁 +$' + USD + ' added!', go: 'Go', claim: 'Claim', done: 'Done' },
    fr: { r: '+' + USD + ' $ de cash', h: (n) => '🎁 Tâche bonus : +' + USD + ' $ (' + n + '/' + MAX + ' aujourd\'hui)', ok: '🎁 +' + USD + ' $ ajoutés !', go: 'Go', claim: 'Récupérer', done: 'Fait' },
  };
  const L = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] || TX.en; };
  const day = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' });
  const cnt = () => { try { const c = JSON.parse(localStorage.getItem('mct_task') || '{}'); return c.d === day() ? c.n || 0 : 0; } catch (e) { return 0; } };
  const inc = () => { try { localStorage.setItem('mct_task', JSON.stringify({ d: day(), n: cnt() + 1 })); } catch (e) {} };
  let box = null, dead = false, last = 0;
  if (!document.querySelector('script[src*="sad.adsgram.ai"]')) { const s = document.createElement('script'); s.src = 'https://sad.adsgram.ai/js/sad.min.js'; s.async = true; document.head.appendChild(s); }
  const css = document.createElement('style');
  css.textContent = '#mcttask{position:fixed;left:10px;right:10px;max-width:540px;margin:0 auto;bottom:calc(var(--tab,68px) + env(safe-area-inset-bottom) + 6px);z-index:10;padding:8px 10px;border:1px solid rgba(255,212,59,.55);border-radius:14px;background:rgba(42,11,90,.97);box-shadow:0 6px 20px rgba(0,0,0,.35)}'
    + '#mcttask .h{font-weight:800;font-size:12px;margin:0 0 4px;color:#ffd43b}#mcttask adsgram-task{display:block}'
    + '#mcttask .tb{display:inline-block;padding:6px 12px;border-radius:99px;background:#ffd43b;color:#1a0638;font-weight:800;font-size:13px}body.hastask main{padding-bottom:96px}';
  document.head.appendChild(css);
  function build() {
    const T = L();
    box = document.createElement('div'); box.id = 'mcttask';
    box.innerHTML = '<div class="h"></div><adsgram-task data-block-id="' + BLOCK + '"><span slot="reward">' + T.r + '</span><div slot="button" class="tb">' + T.go + '</div><div slot="claim" class="tb">' + T.claim + '</div><div slot="done" class="tb">✓ ' + T.done + '</div></adsgram-task>';
    const tk = box.querySelector('adsgram-task');
    const gone = () => { dead = true; if (box) box.remove(); box = null; document.body.classList.remove('hastask'); setTimeout(() => { dead = false; }, 10 * 60000); };
    tk.addEventListener('onBannerNotFound', gone);
    tk.addEventListener('onError', gone);
    tk.addEventListener('onTooLongSession', gone);
    const gift = () => {
      if (Date.now() - last < 3000) return; last = Date.now();
      inc(); try { haptic('ok'); } catch (e) {}
      try { toast(L().ok); } catch (e) {}
      [3000, 10000].forEach((ms) => setTimeout(() => { try { loadMe(); } catch (e) {} }, ms));
      if (cnt() >= MAX) setTimeout(place, 2500);
      else head();
    };
    tk.addEventListener('reward', gift);
    tk.addEventListener('onReward', gift);
  }
  function head() { if (box) { const h = box.querySelector('.h'); if (h) h.textContent = L().h(cnt()); } }
  // one fixed block above the menu; hidden on a coin's page and once the 3 tasks of the day are done
  function place() {
    let tg = null; try { tg = window.Telegram && Telegram.WebApp && Telegram.WebApp.initData; } catch (e) {}
    let coin = false; try { coin = !!COIN; } catch (e) {}
    const show = !!tg && !dead && cnt() < MAX && !coin && !!document.querySelector('nav.tb');
    if (show && !box) { build(); head(); document.body.appendChild(box); }
    if (box) { const d = show ? 'block' : 'none'; if (box.style.display !== d) box.style.display = d; }
    document.body.classList.toggle('hastask', show && !!box);
  }
  let q = 0; new MutationObserver(() => { if (!q) q = requestAnimationFrame(() => { q = 0; place(); }); }).observe(document.body, { childList: true, subtree: true });
  place();
})();
