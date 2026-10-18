// 18 oct 2026 (Jeremy): more rewarded videos in Meme Coin Tycoon (Ads Galaxy, game id 135), all paid in game dollars except the diamond:
// 1. the diamond: one video = the taps count x2 for 30 seconds (once every 3 minutes);
// 2. the daily bonus: one video doubles it, right after it is claimed;
// 3. the mining harvest: 2 videos in a row (about 30 s) double it, right after it is collected;
// 4. the clan: one video a day adds +$200 to the clan's earnings of the week (button in the clan page, clan.js uses window.mctRw);
// 5. short of cash: one video a day gives +$300 (an extra choice in the "Out of cash?" sheet).
// Premium players get every reward without the video. When Ads Galaxy has no video to show, the reward is given anyway.
// The server checks every limit (Supabase function mct-ton, actions mon_rw<kind>, handled by mct_rw_api).
(() => {
  const AGX = 135;
  const TX = {
    en: {
      vid: '📺 Watch a video', vid2: '📺 Watch 2 videos (about 30 s)', prem: '💎 Take it (Premium, no video)', no: 'No thanks', next: '📺 One more video…',
      bT: 'Double your bonus!', bX: (a) => 'Watch a short video and get ' + a + ' more.', bOk: (a) => '🎁 +' + a + ' added!',
      mT: 'Double your harvest!', mX: (q) => 'Watch 2 short videos and get ' + q + ' more.', mOk: (q) => '⛏️ +' + q + ' added to your coins!',
      cO: '📺 +$300 with a video', cOs: 'Once a day', cOk: '💵 +$300 added!',
      dB: '📺 Taps x2 for 30 s', dBp: '💎 Taps x2 for 30 s (Premium)', dOn: (s) => '⚡ x2 for ' + s + ' more seconds', dW: (s) => '📺 Taps x2 again in ' + s, dOk: '⚡ Your taps count double for 30 seconds!',
      kOk: '🛡️ +$200 for your clan!',
      skip: 'The video was not finished: no reward this time.', late: 'Too late for this one.', done: 'Already taken today. Come back tomorrow!', wait: 'Not yet: one x2 every 3 minutes.', rich: 'Only when you are short of cash.', err: 'Something went wrong, try again.',
    },
    fr: {
      vid: '📺 Regarder une vidéo', vid2: '📺 Regarder 2 vidéos (environ 30 s)', prem: '💎 Prendre (Premium, sans vidéo)', no: 'Non merci', next: '📺 Encore une vidéo…',
      bT: 'Double ton bonus !', bX: (a) => 'Regarde une courte vidéo et reçois encore ' + a + '.', bOk: (a) => '🎁 +' + a + ' ajoutés !',
      mT: 'Double ta récolte !', mX: (q) => 'Regarde 2 courtes vidéos et reçois encore ' + q + '.', mOk: (q) => '⛏️ +' + q + ' ajoutés à tes coins !',
      cO: '📺 +300 $ avec une vidéo', cOs: '1 fois par jour', cOk: '💵 +300 $ ajoutés !',
      dB: '📺 Tapes x2 pendant 30 s', dBp: '💎 Tapes x2 pendant 30 s (Premium)', dOn: (s) => '⚡ x2 encore ' + s + ' secondes', dW: (s) => '📺 Tapes x2 de nouveau dans ' + s, dOk: '⚡ Tes tapes comptent double pendant 30 secondes !',
      kOk: '🛡️ +200 $ pour ton clan !',
      skip: 'Vidéo pas terminée : pas de récompense cette fois.', late: 'Trop tard pour celle-ci.', done: 'Déjà pris aujourd\'hui. Reviens demain !', wait: 'Pas encore : un x2 toutes les 3 minutes.', rich: 'Seulement quand tu manques de cash.', err: 'Une erreur est survenue, réessaie.',
    },
    id: {
      vid: '📺 Tonton video', vid2: '📺 Tonton 2 video (sekitar 30 dtk)', prem: '💎 Ambil (Premium, tanpa video)', no: 'Tidak, terima kasih', next: '📺 Satu video lagi…',
      bT: 'Gandakan bonusmu!', bX: (a) => 'Tonton video singkat dan dapatkan ' + a + ' lagi.', bOk: (a) => '🎁 +' + a + ' ditambahkan!',
      mT: 'Gandakan hasil tambangmu!', mX: (q) => 'Tonton 2 video singkat dan dapatkan ' + q + ' lagi.', mOk: (q) => '⛏️ +' + q + ' ditambahkan ke koinmu!',
      cO: '📺 +$300 dengan video', cOs: '1 kali sehari', cOk: '💵 +$300 ditambahkan!',
      dB: '📺 Ketukan x2 selama 30 dtk', dBp: '💎 Ketukan x2 selama 30 dtk (Premium)', dOn: (s) => '⚡ x2 masih ' + s + ' detik', dW: (s) => '📺 Ketukan x2 lagi dalam ' + s, dOk: '⚡ Ketukanmu dihitung dua kali selama 30 detik!',
      kOk: '🛡️ +$200 untuk klanmu!',
      skip: 'Video tidak selesai: tidak ada hadiah kali ini.', late: 'Terlambat untuk yang ini.', done: 'Sudah diambil hari ini. Kembali besok!', wait: 'Belum: satu x2 setiap 3 menit.', rich: 'Hanya saat uangmu habis.', err: 'Terjadi kesalahan, coba lagi.',
    },
    ar: {
      vid: '📺 شاهد فيديو', vid2: '📺 شاهد فيديوهين (حوالي 30 ث)', prem: '💎 خذها (بريميوم، بدون فيديو)', no: 'لا شكرًا', next: '📺 فيديو آخر…',
      bT: 'ضاعف مكافأتك!', bX: (a) => 'شاهد فيديو قصيرًا واحصل على ' + a + ' إضافية.', bOk: (a) => '🎁 أُضيفت +' + a + '!',
      mT: 'ضاعف حصادك!', mX: (q) => 'شاهد فيديوهين قصيرين واحصل على ' + q + ' إضافية.', mOk: (q) => '⛏️ أُضيفت +' + q + ' إلى عملاتك!',
      cO: '📺 +300$ مع فيديو', cOs: 'مرة يوميًا', cOk: '💵 أُضيفت +300$!',
      dB: '📺 نقرات x2 لمدة 30 ث', dBp: '💎 نقرات x2 لمدة 30 ث (بريميوم)', dOn: (s) => '⚡ x2 لمدة ' + s + ' ثانية', dW: (s) => '📺 x2 مجددًا بعد ' + s, dOk: '⚡ نقراتك تُحسب مضاعفة لمدة 30 ثانية!',
      kOk: '🛡️ +200$ لعشيرتك!',
      skip: 'لم يكتمل الفيديو: لا مكافأة هذه المرة.', late: 'فات الأوان.', done: 'تم أخذها اليوم. عد غدًا!', wait: 'ليس بعد: x2 كل 3 دقائق.', rich: 'فقط عندما ينقصك المال.', err: 'حدث خطأ، حاول مرة أخرى.',
    },
  };
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] ? l : 'en'; };
  const L = () => TX[lg()];
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const mo = (n) => { try { return money(n); } catch (e) { return '$' + Number(n).toFixed(2); } };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const prem = () => !!window.MCTPREM;
  const call = async (k, b) => { try { return await tonCall(Object.assign({ action: 'mon_rw' + k }, b || {})); } catch (e) { return null; } };
  const errOf = (r) => { const T = L(); return (r && r.error && T[r.error]) || T.err; };

  // the Ads Galaxy SDK, loaded only when a video is asked for
  let ld = null;
  const sdk = () => ld || (ld = new Promise((ok, ko) => {
    if (window.showAdsGalaxy) return ok();
    const s = document.createElement('script'); s.src = 'https://app.adsgalaxy.online/sdk.js?id=' + AGX;
    s.onload = ok; s.onerror = () => { ld = null; ko(new Error('load')); }; document.head.appendChild(s);
  }));
  // 'ok' = watched (or Premium), 'skip' = closed before the end, 'none' = no video to show (the reward is given anyway, Jeremy 18 oct 2026)
  async function watch() {
    if (prem()) return 'ok';
    try { await sdk(); const r = await window.showAdsGalaxy({ miniappId: AGX }); return r && r.reward_eligible ? 'ok' : 'skip'; } catch (e) { return 'none'; }
  }
  async function watchN(n, btn) {
    for (let i = 0; i < n; i++) {
      if (i && btn) btn.textContent = L().next;
      const w = await watch(); if (w === 'skip') return false;
      if (prem()) return true;
    }
    return true;
  }
  window.mctRw = { watch: watchN, call, prem, L };

  // a small sheet from the bottom of the screen (same look as the other video offers)
  function close() { const d = document.getElementById('rwm'); if (d) d.remove(); }
  function sheet(e, t, x, btn) {
    close();
    const d = document.createElement('div'); d.id = 'rwm';
    d.style.cssText = 'position:fixed;inset:0;z-index:60;background:rgba(5,3,15,.72);display:flex;align-items:flex-end;justify-content:center';
    d.innerHTML = '<div style="width:100%;max-width:520px;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:22px 18px calc(24px + env(safe-area-inset-bottom));text-align:center">'
      + '<div style="font-size:46px;line-height:1">' + e + '</div><h2 style="margin:8px 0 6px">' + ec(t) + '</h2><p class="hint" style="margin:0 0 16px">' + ec(x) + '</p>'
      + '<button class="btn" id="rwy" style="width:100%">' + ec(prem() ? L().prem : btn) + '</button><button class="ghost" id="rwn" style="width:100%;margin-top:10px">' + ec(L().no) + '</button></div>';
    d.onclick = (ev) => { if (ev.target === d) close(); };
    document.body.appendChild(d);
    d.querySelector('#rwn').onclick = () => { hp(); close(); };
    return d;
  }
  const setCash = (c) => { try { if (c != null) document.getElementById('cash').textContent = money(c); } catch (e) {} };

  // 2. the daily bonus, and 3. the mining harvest: offered right after the game's answer
  async function offerBonus() {
    const st = await call('state'); if (!st || !st.bonus) return;
    const T = L(), a = mo(st.bonus), d = sheet('🎁', T.bT, T.bX(a), T.vid);
    d.querySelector('#rwy').onclick = async (ev) => {
      const b = ev.currentTarget; b.disabled = true; b.textContent = '⏳';
      if (!(await watchN(1, b))) { close(); return tst(T.skip); }
      const r = await call('bonus'); close();
      if (!r || !r.ok) { hp('err'); return tst(errOf(r)); }
      hp('ok'); setCash(r.cash); tst(T.bOk(mo(r.amount)));
    };
  }
  async function offerMine() {
    const st = await call('state'); if (!st || !st.mine) return;
    const T = L(), q = Number(st.mine.qty).toLocaleString(lg() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: 6 }) + ' $' + st.mine.ticker;
    const d = sheet('⛏️', T.mT, T.mX(q + ' (≈ ' + mo(st.mine.val) + ')'), T.vid2);
    d.querySelector('#rwy').onclick = async (ev) => {
      const b = ev.currentTarget; b.disabled = true; b.textContent = '⏳';
      if (!(await watchN(2, b))) { close(); return tst(T.skip); }
      const r = await call('mine'); close();
      if (!r || !r.ok) { hp('err'); return tst(errOf(r)); }
      hp('ok'); tst(T.mOk(q)); try { if (VIEW === 'mine') mine(); } catch (e) {}
    };
  }
  const of = window.fetch;
  window.fetch = async function (u, o) {
    const r = await of.apply(this, arguments);
    try {
      if (String(u).indexOf('/mct/api') >= 0 && o && typeof o.body === 'string') {
        const bd = o.body;
        if (bd.indexOf('"action":"bonus"') >= 0) r.clone().json().then((j) => { if (j && j.ok) setTimeout(offerBonus, 1800); }).catch(() => {});
        if (bd.indexOf('"action":"mine"') >= 0 && bd.indexOf('"act":"claim"') >= 0) r.clone().json().then((j) => { if (j && j.got_qty > 0) setTimeout(offerMine, 1500); }).catch(() => {});
      }
    } catch (e) {}
    return r;
  };

  // 5. short of cash: one more choice in the "Out of cash?" sheet of the game
  async function cashOpt(sh) {
    if (sh.dataset.rw) return; sh.dataset.rw = '1';
    const st = await call('state'); if (!st || !st.cash || !document.body.contains(sh)) return;
    const T = L(), b = document.createElement('button'); b.className = 'cso'; b.type = 'button';
    b.innerHTML = '<span class="e">' + (prem() ? '💎' : '📺') + '</span><span class="w"><b>' + ec(T.cO.replace(/^\S+ /, '')) + '</b><small>' + ec(T.cOs) + '</small></span><span class="go">›</span>';
    const lt = sh.querySelector('.later'); sh.insertBefore(b, lt);
    b.onclick = async () => {
      hp(); b.disabled = true; try { lt.click(); } catch (e) {}
      const st2 = await call('state'); if (st2 && st2.ok && !st2.cash) return tst(T.done);
      if (!(await watchN(1))) return tst(T.skip);
      const r = await call('cash');
      if (!r || !r.ok) { hp('err'); return tst(errOf(r)); }
      hp('ok'); setCash(r.cash); tst(T.cOk);
    };
  }

  // 1. the diamond: a button under the tapping area
  let DIA = { x2: 0, wait: 0, t: 0 };
  const left = (end) => Math.max(0, Math.round((end - Date.now()) / 1000));
  const mmss = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  function diaDraw() {
    const b = document.getElementById('drw'); if (!b) return;
    const T = L(), x = left(DIA.x2), w = left(DIA.wait);
    if (x > 0) { b.disabled = true; b.textContent = T.dOn(x); b.style.background = 'linear-gradient(90deg,#ffd43b,#ff9a3c)'; b.style.color = '#1a1200'; }
    else if (w > 0) { b.disabled = true; b.textContent = T.dW(mmss(w)); b.style.background = ''; b.style.color = ''; }
    else { b.disabled = false; b.textContent = prem() ? T.dBp : T.dB; b.style.background = ''; b.style.color = ''; }
  }
  async function diaBtn(area) {
    const b = document.createElement('button'); b.id = 'drw'; b.type = 'button'; b.className = 'btn ghost';
    b.style.cssText = 'width:100%;margin:8px 0 0'; area.insertAdjacentElement('afterend', b);
    if (Date.now() - DIA.t > 20000) { const st = await call('state'); if (st && st.ok) DIA = { x2: Date.now() + st.dia_x2 * 1000, wait: Date.now() + st.dia_wait * 1000, t: Date.now() }; }
    diaDraw();
    const sync = async () => { const st = await call('state'); if (st && st.ok) DIA = { x2: Date.now() + st.dia_x2 * 1000, wait: Date.now() + st.dia_wait * 1000, t: Date.now() }; return st; };
    b.onclick = async () => {
      const T = L(); hp(); b.disabled = true; b.textContent = '⏳';
      // 18 oct 2026 (Jeremy): check before the video, so nobody watches a video for nothing
      const st = await sync(); if (st && st.ok && (st.dia_wait > 0 || st.dia_x2 > 0)) { diaDraw(); return tst(T.wait); }
      if (!(await watchN(1, b))) { diaDraw(); return tst(T.skip); }
      const r = await call('dia');
      if (!r || !r.ok) { hp('err'); await sync(); diaDraw(); return tst(errOf(r)); }
      DIA = { x2: Date.now() + 30000, wait: Date.now() + 180000, t: Date.now() };
      hp('ok'); tst(T.dOk); diaDraw();
    };
  }

  // one light loop: the diamond button and the cash sheet appear when their screens are open
  setInterval(() => {
    const a = document.getElementById('darea'); if (a && !document.getElementById('drw')) diaBtn(a); else diaDraw();
    const sh = document.getElementById('cssh'); if (sh) cashOpt(sh);
  }, 700);
})();
