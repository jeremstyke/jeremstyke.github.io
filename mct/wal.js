// 16 oct 2026 (Jeremy): Meme Coin Tycoon, by @jeremstyke. The TON wallet is linked in one tap, right in the game, with TON Connect
// (Wallet in Telegram, Tonkeeper...). Replaces the old link to Earn by Jeremstyke and the field to paste an address.
// The diamond panel shows a big "Add my wallet" button while the player has no wallet.
(function () {
  const TCU = 'https://unpkg.com/@tonconnect/ui@2.0.9/dist/tonconnect-ui.min.js';
  const MAN = 'https://jeremstyke.github.io/mct/tonconnect-manifest.json';
  const fr = () => (typeof LANG !== 'undefined' ? LANG : 'en') === 'fr';
  let UI = null, LOADING = null, SENT = '', HAS = null, WANT = false;

  // raw address "0:hex" -> user-friendly non-bounceable (UQ...)
  function friendly(raw) {
    const m = /^(-?\d+):([0-9a-fA-F]{64})$/.exec(String(raw || ''));
    if (!m) return String(raw || '');
    const b = new Uint8Array(36);
    b[0] = 0x51; b[1] = Number(m[1]) & 0xff;
    for (let i = 0; i < 32; i++) b[2 + i] = parseInt(m[2].substr(i * 2, 2), 16);
    let c = 0;
    for (let i = 0; i < 34; i++) { c ^= b[i] << 8; for (let k = 0; k < 8; k++) c = c & 0x8000 ? ((c << 1) ^ 0x1021) & 0xffff : (c << 1) & 0xffff; }
    b[34] = c >> 8; b[35] = c & 0xff;
    let s = ''; b.forEach((x) => { s += String.fromCharCode(x); });
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_');
  }
  function load() {
    if (UI) return Promise.resolve(UI);
    if (LOADING) return LOADING;
    LOADING = new Promise((ok, ko) => {
      const go = () => {
        try {
          let root = document.getElementById('mcttc');
          if (!root) { root = document.createElement('div'); root.id = 'mcttc'; root.style.display = 'none'; document.body.appendChild(root); }
          UI = new TON_CONNECT_UI.TonConnectUI({ manifestUrl: MAN, buttonRootId: 'mcttc', actionsConfiguration: { twaReturnUrl: 'https://t.me/Memecointycoonbot' } });
          UI.onStatusChange((w) => { if (WANT && w && w.account && w.account.address) save(w.account.address); });
          ok(UI);
        } catch (e) { LOADING = null; ko(e); }
      };
      if (window.TON_CONNECT_UI) return go();
      const s = document.createElement('script'); s.src = TCU; s.onload = go; s.onerror = () => { LOADING = null; ko(new Error('load')); };
      document.head.appendChild(s);
    });
    return LOADING;
  }
  async function save(raw) {
    const a = friendly(raw);
    if (!a || SENT === a) return;
    SENT = a; WANT = false;
    let r; try { r = await tonCall({ action: 'wallet', addr: a }); } catch (e) { r = null; }
    if (!r || !r.ok) { SENT = ''; try { toast(fr() ? 'Oups, réessaie' : 'Oops, try again'); } catch (e) {} return; }
    HAS = true;
    try { tw.HapticFeedback.notificationOccurred('success'); } catch (e) {}
    try { toast(fr() ? 'Portefeuille enregistré ✅' : 'Wallet saved ✅'); } catch (e) {}
    const b = document.getElementById('dwalx'); if (b) b.remove();
    if (document.getElementById('tonsheet')) { try { tonPage(); } catch (e) {} }
  }
  // one tap: opens the wallet list (Wallet in Telegram first), the address is saved as soon as it is confirmed
  async function connect(change) {
    try { haptic(); } catch (e) {}
    let ui; try { ui = await load(); } catch (e) { try { toast(fr() ? 'Connexion impossible, réessaie' : 'Could not connect, try again'); } catch (x) {} return; }
    WANT = true; SENT = '';
    if (ui.connected && ui.wallet && ui.wallet.account) {
      if (!change) return save(ui.wallet.account.address);
      try { await ui.disconnect(); } catch (e) {}
    }
    try { await ui.openModal(); } catch (e) {}
  }
  window.mctWal = connect;
  window.tonGoWal = () => connect(HAS === true);
  window.gameWalShow = () => connect(HAS === true);

  async function status() {
    if (HAS !== null) return HAS;
    try { const s = await tonCall({}); if (s && s.ok) HAS = !!((s.all && s.all.wallet) || s.wallet); } catch (e) {}
    return HAS;
  }
  // diamond panel: a big button on top while there is no wallet, so the earnings can be paid
  async function dia() {
    const w = document.getElementById('dwal');
    if (!w || document.getElementById('dwalx')) return;
    if ((await status()) !== false || document.getElementById('dwalx')) return;
    const c = document.createElement('div'); c.id = 'dwalx'; c.className = 'dc';
    c.style.cssText = 'border:1px solid rgba(255,212,59,.6);background:rgba(255,212,59,.12)';
    c.innerHTML = '<div class="dsm" style="margin-bottom:8px;font-weight:700">' + (fr() ? '💰 Tes gains t\'attendent : ajoute ton portefeuille pour être payé chaque lundi.' : '💰 Your earnings are waiting: add your wallet to get paid every Monday.') + '</div>'
      + '<button class="btn" style="width:100%;margin:0">' + (fr() ? '👛 Ajouter mon portefeuille' : '👛 Add my wallet') + '</button>';
    c.querySelector('button').onclick = () => connect(false);
    const top = w.parentNode.querySelector('.dc');
    if (top && top.nextSibling) top.parentNode.insertBefore(c, top.nextSibling); else w.parentNode.insertBefore(c, w);
  }
  new MutationObserver(() => { if (document.getElementById('dwal') && !document.getElementById('dwalx')) dia(); }).observe(document.body, { childList: true, subtree: true });
  setTimeout(() => { try { if (tw && tw.initData) load().catch(() => {}); } catch (e) {} }, 3000);
})();
