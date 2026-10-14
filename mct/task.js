// 14 oct 2026: Meme Coin Tycoon, Adsgram Task (task-53965): +$50 in the game each time, 3 times a day at most.
// Shown on the market (under the TON banner) and in the Earn screen. Adsgram calls the reward URL (Supabase function mct-adreward),
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
  css.textContent = '#mcttask{margin:0 0 10px;padding:10px 12px;border:1px solid rgba(255,212,59,.45);border-radius:14px;background:rgba(255,212,59,.07)}#mcttask .h{font-weight:800;font-size:14px;margin:0 0 6px}'
    + '#mcttask adsgram-task{display:block}#mcttask .tb{display:inline-block;padding:7px 14px;border-radius:99px;background:#ffd43b;color:#1a0638;font-weight:800;font-size:13px}';
  document.head.appendChild(css);
  function build() {
    const T = L();
    box = document.createElement('div'); box.id = 'mcttask';
    box.innerHTML = '<div class="h"></div><adsgram-task data-block-id="' + BLOCK + '"><span slot="reward">' + T.r + '</span><div slot="button" class="tb">' + T.go + '</div><div slot="claim" class="tb">' + T.claim + '</div><div slot="done" class="tb">✓ ' + T.done + '</div></adsgram-task>';
    const tk = box.querySelector('adsgram-task');
    const gone = () => { dead = true; if (box) box.remove(); setTimeout(() => { dead = false; box = null; }, 10 * 60000); };
    tk.addEventListener('onBannerNotFound', gone);
    tk.addEventListener('onError', gone);
    tk.addEventListener('onTooLongSession', gone);
    const gift = () => {
      if (Date.now() - last < 3000) return; last = Date.now();
      inc(); try { haptic('ok'); } catch (e) {}
      try { toast(L().ok); } catch (e) {}
      [3000, 10000].forEach((ms) => setTimeout(() => { try { loadMe(); } catch (e) {} }, ms));
      if (cnt() >= MAX && box) setTimeout(() => { if (box) box.remove(); }, 2500);
      else head();
    };
    tk.addEventListener('reward', gift);
    tk.addEventListener('onReward', gift);
  }
  function head() { if (box) { const h = box.querySelector('.h'); if (h) h.textContent = L().h(cnt()); } }
  // the screens are rebuilt each time they open: put the task back in its place
  function place() {
    if (dead || cnt() >= MAX) return;
    let tg = null; try { tg = window.Telegram && Telegram.WebApp && Telegram.WebApp.initData; } catch (e) {}
    if (!tg) return;
    const ec = document.getElementById('tonc'), tb = document.getElementById('tonb'), sp = document.getElementById('simpl');
    const anchor = ec || tb || sp; if (!anchor) return;
    if (box && box.isConnected && box.previousElementSibling === anchor) return;
    if (box && box.isConnected && anchor === sp && box.nextElementSibling === sp) return;
    if (!box) build();
    head();
    if (anchor === sp) sp.parentNode.insertBefore(box, sp); else anchor.parentNode.insertBefore(box, anchor.nextSibling);
  }
  new MutationObserver(() => place()).observe(document.body, { childList: true, subtree: true });
  place();
})();
