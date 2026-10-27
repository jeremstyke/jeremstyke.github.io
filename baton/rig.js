// 26 oct 2026 (23h50, Jeremy): "⛏️ Rig", Rig Rush reborn as a tab of Pass The Baton. Preview: the tab only shows for the
// testers of bt_rig_cfg (the server answers 'off' to everyone else). All the rules are on the server (bt_rig_*):
// 4 h sessions, the hours holding a baton mine x2, a rewarded video doubles a finished session (Adsgram 55429, mode 'rig'),
// machines and parts paid in $BATON (they pay back in 30+ days), a free chest every day.
(() => {
  // 27 oct 2026: the game's code is inside a closure; it shares what the Rig needs through window.BT (baton/index.html)
  const B = () => window.BT || {};
  const api = (a, b) => B().api(a, b), go = (p) => B().go(p), hap = (k) => B().hap && B().hap(k), toast = (t) => B().toast && B().toast(t);
  const refresh = () => B().refresh && B().refresh(), errMsg = (r) => (B().errMsg ? B().errMsg(r) : '⚠️');
  const X = {
    fr: { tab: 'Rig', h: 'Mon rig', rate: (n) => n + ' $BATON / h', start: '⛏️ Lancer le minage (4 h)', running: 'Minage en cours', left: (t) => 'Encore ' + t,
      done: '✅ Session terminée', claim: (n) => 'Récupérer +' + n, x2: (n) => '📺 x2 avec une vidéo : +' + n, mined: 'Miné',
      held: '🏃 Tu tiens le bâton : ton rig mine x2 !', nohold: '🏃 Tiens le bâton pendant la session : ton rig mine x2', heldh: (h) => '🏃 ' + h + ' h avec le bâton (x2)',
      parts: 'Composants', lvl: (l, m) => 'Niv. ' + l + '/' + m, up: (c) => '⬆ ' + c, max: 'MAX',
      mach: 'Machine suivante', machNeed: (n) => 'Tous les composants au niveau ' + n + ' pour débloquer', machB: (c) => 'Passer à ' + c, machMax: '🏆 Tu as la meilleure machine',
      chest: '🎁 Coffre du jour', chestB: 'Ouvrir', chestDone: '🎁 Coffre ouvert, reviens demain', chestOk: (n) => '🎁 +' + n + ' $BATON !',
      upOk: '⚡ Amélioré !', noPts: 'Pas assez de $BATON', claimOk: (n) => '⛏️ +' + n + ' $BATON !', vidNo: 'Vidéo indisponible, réessaie plus tard',
      tot: (n, s) => 'Total miné : ' + n + ' $BATON · ' + s + ' sessions', preview: '👀 Aperçu : visible seulement par toi',
      M: ['Vieux PC', 'PC Gamer', 'Rig GPU', 'Rack serveur', 'Ferme de minage', 'Datacenter'], P: ['Processeur', 'Carte graphique', 'RAM', 'Refroidissement'] },
    en: { tab: 'Rig', h: 'My rig', rate: (n) => n + ' $BATON / h', start: '⛏️ Start mining (4 h)', running: 'Mining', left: (t) => t + ' left',
      done: '✅ Session over', claim: (n) => 'Collect +' + n, x2: (n) => '📺 x2 with a video: +' + n, mined: 'Mined',
      held: '🏃 You hold the baton: your rig mines x2!', nohold: '🏃 Hold the baton during the session: your rig mines x2', heldh: (h) => '🏃 ' + h + ' h with the baton (x2)',
      parts: 'Parts', lvl: (l, m) => 'Lvl ' + l + '/' + m, up: (c) => '⬆ ' + c, max: 'MAX',
      mach: 'Next machine', machNeed: (n) => 'All parts at level ' + n + ' to unlock', machB: (c) => 'Upgrade to ' + c, machMax: '🏆 You have the best machine',
      chest: '🎁 Daily chest', chestB: 'Open', chestDone: '🎁 Chest opened, come back tomorrow', chestOk: (n) => '🎁 +' + n + ' $BATON!',
      upOk: '⚡ Upgraded!', noPts: 'Not enough $BATON', claimOk: (n) => '⛏️ +' + n + ' $BATON!', vidNo: 'No video right now, try again later',
      tot: (n, s) => 'Total mined: ' + n + ' $BATON · ' + s + ' sessions', preview: '👀 Preview: only you can see it',
      M: ['Old PC', 'Gaming PC', 'GPU Rig', 'Server rack', 'Mining farm', 'Datacenter'], P: ['CPU', 'Graphics card', 'RAM', 'Cooling'] },
  };
  const ME = ['🖥️', '💻', '🎛️', '🗄️', '🏭', '🌐'], PE = ['⚙️', '🎮', '🧠', '❄️'];
  const Lg = () => { let l = 'en'; try { l = B().lang || 'en'; } catch (e) {} return X[l] || (String(l).startsWith('fr') ? X.fr : X.en); };
  const nf = (n) => Math.round(Number(n) || 0).toLocaleString('fr-FR').replace(/ | /g, ' ');
  const hp = (k) => { try { hap(k); } catch (e) {} };
  const say = (t) => { try { toast(t); } catch (e) {} };
  let R = null, at = 0, busy = false, timer = null;

  const st = document.createElement('style');
  st.textContent = `
#p-rig{--mx:#3ee6a0;--mx2:#1d8f63}
#p-rig .rg-top{display:flex;align-items:center;gap:12px;margin:4px 0 14px}
#p-rig .rg-ic{font-size:40px;width:64px;height:64px;display:grid;place-items:center;border-radius:18px;background:radial-gradient(circle at 50% 35%,rgba(62,230,160,.25),rgba(62,230,160,.04));border:1px solid rgba(62,230,160,.35);box-shadow:0 0 24px rgba(62,230,160,.18) inset}
#p-rig h2{font-family:var(--display);font-size:26px;letter-spacing:.5px;margin:0;line-height:1}
#p-rig .rg-rate{font-family:var(--mono);color:var(--mx);font-size:14px;margin-top:4px}
#p-rig .rg-pv{font-size:12px;color:var(--mute);margin:0 0 10px}
#p-rig .rg-scr{position:relative;border-radius:18px;padding:18px 16px;background:#06120d;border:1px solid rgba(62,230,160,.3);overflow:hidden;font-family:var(--mono)}
#p-rig .rg-scr::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(62,230,160,.05) 0 1px,transparent 1px 3px);pointer-events:none}
#p-rig .rg-lab{color:var(--mute);font-size:12px;text-transform:uppercase;letter-spacing:1.5px}
#p-rig .rg-big{font-size:38px;color:var(--mx);text-shadow:0 0 14px rgba(62,230,160,.55);margin:4px 0 10px;font-variant-numeric:tabular-nums}
#p-rig .rg-bar{height:10px;border-radius:6px;background:rgba(62,230,160,.12);overflow:hidden}
#p-rig .rg-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--mx2),var(--mx));box-shadow:0 0 12px var(--mx);transition:width .9s linear}
#p-rig .rg-sub{display:flex;justify-content:space-between;gap:10px;margin-top:8px;font-size:12px;color:var(--mute)}
#p-rig .rg-scr.on .rg-big{animation:rgp 1.6s ease-in-out infinite}
@keyframes rgp{50%{text-shadow:0 0 24px rgba(62,230,160,.9)}}
#p-rig .rg-hold{margin:10px 0 0;font-size:13px;padding:9px 12px;border-radius:12px;background:rgba(255,197,49,.08);border:1px solid rgba(255,197,49,.25);color:var(--chalk)}
#p-rig .rg-hold.on{background:rgba(255,197,49,.18);border-color:var(--baton);color:var(--baton);font-weight:800}
#p-rig .rg-btn{display:block;width:100%;margin-top:12px;padding:14px;border-radius:14px;font-weight:800;font-size:16px;background:var(--mx);color:#04140c}
#p-rig .rg-btn.alt{background:transparent;border:1px solid var(--baton);color:var(--baton)}
#p-rig .rg-btn:disabled{opacity:.5}
#p-rig h3{font-family:var(--display);font-size:20px;margin:22px 0 10px;letter-spacing:.5px}
#p-rig .rg-row{display:flex;align-items:center;gap:12px;padding:12px;border-radius:14px;background:var(--lane);margin-bottom:8px}
#p-rig .rg-row .e{font-size:24px;width:36px;text-align:center}
#p-rig .rg-row .w{flex:1;min-width:0}
#p-rig .rg-row b{display:block;font-size:14px}
#p-rig .rg-pips{display:flex;gap:3px;margin-top:5px}
#p-rig .rg-pips i{width:16px;height:6px;border-radius:3px;background:rgba(233,241,255,.12)}
#p-rig .rg-pips i.on{background:var(--mx);box-shadow:0 0 6px rgba(62,230,160,.6)}
#p-rig .rg-up{flex:none;padding:8px 10px;border-radius:10px;background:rgba(62,230,160,.14);color:var(--mx);font-weight:800;font-size:13px;font-family:var(--mono)}
#p-rig .rg-up.no{opacity:.45}
#p-rig .rg-card{padding:14px;border-radius:14px;background:var(--lane);margin-bottom:8px}
#p-rig .rg-card small{display:block;color:var(--mute);font-size:12px;margin-top:3px}
#p-rig .rg-tot{text-align:center;color:var(--mute);font-size:12px;margin:16px 0 8px}
.tabs button[data-p="rig"] .rgt{font-size:20px;line-height:1}
nav.tabs{grid-template-columns:repeat(6,minmax(0,1fr))!important}nav.tabs button{font-size:10px}`;
  document.head.appendChild(st);

  const fmtT = (s) => { s = Math.max(0, Math.floor(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ' h ' : '') + String(m).padStart(2, '0') + ' min ' + String(x).padStart(2, '0') + ' s'; };
  const tnow = () => R ? Number(R.now) + (Date.now() - at) / 1000 : Date.now() / 1000;
  function live() {  // what the running session has mined so far (x2 while the baton is held)
    if (!R || !R.sess_start) return 0;
    const t = Math.min(tnow(), Number(R.sess_end)), dt = Math.max(0, t - Number(R.now));
    return Number(R.mined) + Number(R.sess_rate) * dt / 3600 * (R.holding ? 2 : 1);
  }

  function draw() {
    const p = document.getElementById('p-rig'); if (!p || p.hidden || !R) return;
    const T = Lg(), m = Number(R.machine), parts = R.parts || [], pm = Number(R.part_max);
    const run = R.sess_start && tnow() < Number(R.sess_end), fin = R.sess_start && !run;
    const tot = Number(R.sess_h) * 3600, el = R.sess_start ? Math.min(tot, tnow() - Number(R.sess_start)) : 0;
    const got = Math.floor(live());
    let h = '<p class="rg-pv">' + T.preview + '</p>'
      + '<div class="rg-top"><div class="rg-ic">' + ME[m - 1] + '</div><div><h2>' + T.M[m - 1] + '</h2><div class="rg-rate">⛏️ ' + T.rate(nf(R.rate)) + '</div></div></div>'
      + '<div class="rg-scr' + (run ? ' on' : '') + '"><div class="rg-lab">' + (run ? T.running : fin ? T.done : T.mined) + '</div>'
      + '<div class="rg-big" id="rgBig">' + nf(got) + '</div>'
      + '<div class="rg-bar"><i id="rgBar" style="width:' + (R.sess_start ? Math.round(100 * el / tot) : 0) + '%"></i></div>'
      + '<div class="rg-sub"><span id="rgLeft">' + (run ? T.left(fmtT(Number(R.sess_end) - tnow())) : '') + '</span><span>' + (Number(R.held_h) > 0 ? T.heldh(R.held_h) : '') + '</span></div></div>'
      + '<div class="rg-hold' + (R.holding ? ' on' : '') + '">' + (R.holding ? T.held : T.nohold) + '</div>';
    if (fin) h += '<button class="rg-btn" id="rgClaim">' + T.claim(nf(got)) + '</button><button class="rg-btn alt" id="rgVid">' + T.x2(nf(got * 2)) + '</button>';
    else if (!run) h += '<button class="rg-btn" id="rgStart">' + T.start + '</button>';
    h += '<h3>' + T.parts + '</h3>' + parts.map((l, i) => {
      const c = R.part_costs && R.part_costs[i], can = c != null && Number(R.pts) >= Number(c);
      return '<div class="rg-row"><span class="e">' + PE[i] + '</span><div class="w"><b>' + T.P[i] + '</b><small style="color:var(--mute);font-size:12px">' + T.lvl(l, pm) + '</small><div class="rg-pips">'
        + Array.from({ length: pm }, (_, k) => '<i' + (k < l ? ' class="on"' : '') + '></i>').join('') + '</div></div>'
        + (c == null ? '<span class="rg-up no">' + T.max + '</span>' : '<button class="rg-up' + (can ? '' : ' no') + '" data-rgp="' + (i + 1) + '">' + T.up(nf(c)) + '</button>') + '</div>';
    }).join('');
    h += '<h3>' + T.mach + '</h3>';
    if (m >= Number(R.max_machine)) h += '<div class="rg-card"><b>' + T.machMax + '</b></div>';
    else {
      const ok = parts.every((l) => l >= Number(R.need_parts)), can = ok && Number(R.pts) >= Number(R.machine_cost);
      h += '<div class="rg-row"><span class="e">' + ME[m] + '</span><div class="w"><b>' + T.M[m] + '</b><small style="color:var(--mute);font-size:12px">⛏️ ' + T.rate(nf(R.next_rate)) + (ok ? '' : ' · ' + T.machNeed(R.need_parts)) + '</small></div>'
        + '<button class="rg-up' + (can ? '' : ' no') + '" data-rgp="0">' + T.up(nf(R.machine_cost)) + '</button></div>';
    }
    h += '<h3>' + T.chest + '</h3>' + (R.chest ? '<button class="rg-btn alt" id="rgChest">🎁 ' + T.chestB + '</button>' : '<div class="rg-card"><small>' + T.chestDone + '</small></div>');
    h += '<p class="rg-tot">' + T.tot(nf(R.total), R.sessions) + '</p>';
    p.innerHTML = h;
    const on = (id, f) => { const b = document.getElementById(id); if (b) b.onclick = () => f(b); };
    on('rgStart', (b) => act(b, 'rig_start', {}, (r) => r.claimed > 0 ? T.claimOk(nf(r.claimed)) : null));
    on('rgClaim', (b) => act(b, 'rig_claim', {}, (r) => T.claimOk(nf(r.amount))));
    on('rgChest', (b) => act(b, 'rig_chest', {}, (r) => T.chestOk(nf(r.amount))));
    on('rgVid', vid);
    p.querySelectorAll('[data-rgp]').forEach((b) => b.onclick = () => act(b, 'rig_up', { part: b.dataset.rgp }, () => T.upOk));
  }
  function tick() {  // the counter, the bar and the countdown move every second without asking the server
    const p = document.getElementById('p-rig'); if (!p || p.hidden || !R || !R.sess_start) return;
    const big = document.getElementById('rgBig'), bar = document.getElementById('rgBar'), lf = document.getElementById('rgLeft');
    const tot = Number(R.sess_h) * 3600, el = Math.min(tot, tnow() - Number(R.sess_start));
    if (big) big.textContent = nf(Math.floor(live()));
    if (bar) bar.style.width = Math.round(100 * el / tot) + '%';
    if (lf && tnow() < Number(R.sess_end)) lf.textContent = Lg().left(fmtT(Number(R.sess_end) - tnow()));
    if (tnow() >= Number(R.sess_end) && !document.getElementById('rgClaim')) load();  // the session just ended
  }
  async function load() {
    if (busy) return; busy = true;
    try { const r = await api('rig'); if (r && r.ok) { R = r; at = Date.now(); draw(); } } catch (e) {}
    busy = false;
  }
  async function act(b, action, body, msg) {
    hp(); b.disabled = true;
    const r = await api(action, body);
    if (!r || !r.ok) { hp('err'); say(r && r.error === 'pts' ? Lg().noPts : (typeof errMsg === 'function' ? errMsg(r) : '⚠️')); b.disabled = false; return; }
    hp('ok'); const t = msg(r); if (t) say(t);
    if (r.rig) { R = r.rig; at = Date.now(); draw(); } else load();
    try { if (typeof refresh === 'function') refresh(); } catch (e) {}
  }
  async function vid(b) {  // same rewarded block as the rest of Baton; the server pays x2 through the reward URL (mode 'rig')
    hp(); b.disabled = true;
    try {
      await api('vid', { mode: 'rig' });
      if (!window.Adsgram) await new Promise((ok, ko) => { const s = document.createElement('script'); s.src = 'https://sad.adsgram.ai/js/sad.min.js'; s.onload = ok; s.onerror = ko; document.head.appendChild(s); });
      await window.Adsgram.init({ blockId: '55429' }).show();
      hp('ok'); [1500, 4000, 8000].forEach((ms) => setTimeout(load, ms));
    } catch (e) { say(Lg().vidNo); b.disabled = false; }
  }

  // the tab: only when the server says this player may see the Rig
  async function boot() {
    const r = await api('rig'); if (!r || !r.ok) return;
    R = r; at = Date.now();
    const home = document.getElementById('p-home'), nav = document.querySelector('nav.tabs');
    if (!home || !nav || document.getElementById('p-rig')) return;
    const sec = document.createElement('section'); sec.className = 'panel'; sec.id = 'p-rig'; sec.hidden = true;
    home.parentNode.appendChild(sec);
    const b = document.createElement('button'); b.dataset.p = 'rig'; b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912"/><path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393"/><path d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z"/><path d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319"/></svg><span>' + Lg().tab + '</span>';  // 27 oct 2026: same line icon as the other tabs
    const tasks = nav.querySelector('[data-p="tasks"]'); tasks ? nav.insertBefore(b, tasks) : nav.appendChild(b);
    b.onclick = () => { hp(); go('rig'); draw(); load(); };
    nav.addEventListener('click', (e) => { if (!e.target.closest('[data-p="rig"]')) b.removeAttribute('aria-current'); });
    timer = setInterval(tick, 1000);
    let sp = ''; try { const tg = B().tg; sp = String((tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || ''); } catch (e) {}
    if (sp === 'rig') { go('rig'); draw(); }
  }
  let n = 0; const w = setInterval(() => {
    n++; let ok = false; try { ok = !!window.BT && !!B().S; } catch (e) {}
    if (ok || n > 80) { clearInterval(w); if (ok) boot(); }
  }, 250);
})();
