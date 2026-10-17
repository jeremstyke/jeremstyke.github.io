// 17 oct 2026 (Jeremy): the clans of Meme Coin Tycoon, by @jeremstyke.
// A clan costs $5,000 (game money), 20 members max, the chief accepts each member. Creating a clan creates its coin: the coin's
// creator fees go to the clan. Every Monday half of what the clan earned in the week is shared equally between the members
// present for 3 days, the other half goes to the chief's pot (take, give, lock 7 days +10 % or 30 days +50 %).
// A new player brought by the clan link: +$5,000 for the clan after his 3 days of play; a player of the game who joins: +$1,000.
// Each new member gets $1,000 of the clan coin. The best clan of the week (value of its coin) wins $20,000 shared between its members, +$10,000 in the clan's earnings (shared like the rest) and a 🏆 badge. Clans are in beta.
// Where: a card at the top of the Leaders tab, a label on the page of a clan coin, links ?startapp=clan and ?startapp=cl_<id>.
// Data from the Supabase function mct-ton (actions mon_clan..., handled in SQL by mct_clan_api).
(() => {
  const TX = {
    fr: {
      card: '🛡️ Clans · BETA', cardx: 'Crée ou rejoins un clan : une cagnotte partagée chaque lundi', cardm: (n, p) => n + ' membres · cagnotte ' + p, see: 'Voir',
      t: '🛡️ Clans · BETA', close: 'Fermer', err: 'Problème, réessaie.', load: '⏳',
      how: ['💰 Le coin du clan est créé avec le clan : ses frais (achats et ventes) remplissent la cagnotte.', '👥 +5 000 $ pour le clan par nouveau joueur amené avec le lien du clan (après 3 jours de jeu), +1 000 $ par joueur du jeu qui rejoint.', '🗓️ Chaque lundi, 50 % des gains de la semaine sont partagés à parts égales entre les membres présents depuis 3 jours. Les 50 % restants vont dans la cagnotte du chef.', '🏆 Le meilleur clan de la semaine gagne 20 000 $ partagés entre ses membres, +10 000 $ dans les gains du clan et le badge 🏆.'],
      list: 'Clans', none: 'Aucun clan pour l\'instant : crée le premier !', ask: 'Demander', asked: 'Demande envoyée', full: 'Complet', members: (n) => n + '/20',
      create: '➕ Créer un clan · 5 000 $', name: 'Nom du clan (3 à 20 caractères)', ticker: 'Ticker du coin du clan (2 à 8 lettres)', logo: 'Logo et couleur', go: '🛡️ Créer mon clan',
      week: 'Gagné cette semaine', weekx: '50 % partagés lundi entre les membres', pot: 'Cagnotte du chef', coin: 'Coin du clan', seecoin: 'Voir le coin', rank: (r) => '#' + r + ' des clans',
      mem: 'Membres', chief: '👑 chef', wait3: '⏳ moins de 3 jours', invite: '📤 Inviter avec le lien du clan', invmsg: (n) => '🛡️ Rejoins mon clan ' + n + ' sur Meme Coin Tycoon : on partage les gains chaque lundi !',
      donate: '💝 Donner à la cagnotte', amount: 'Montant en $', leave: 'Quitter le clan', leaveq: 'Sûr ? Tu perds ta part de la semaine.',
      reqs: 'Demandes', accept: 'Accepter', refuse: 'Refuser', newp: 'nouveau joueur', nreq: 'Aucune demande.',
      chiefh: '👑 Gestion de la cagnotte', take: 'Prendre pour moi', give: 'Donner à', lock7: 'Bloquer 7 j (+10 %)', lock30: 'Bloquer 30 j (+50 %)', locks: 'Bloqué', until: 'jusqu\'au', kick: 'Exclure',
      pendn: (n) => n + ' recrue(s) en attente de leurs 3 jours (+5 000 $ chacune)', label: (n) => '🛡️ Coin du clan ' + n, joinbtn: 'Rejoindre', badge: '🏆 Clan de la semaine',
      e: { cash: 'Pas assez d\'argent.', name: 'Nom invalide (3 à 20 caractères).', name_taken: 'Ce nom est déjà pris.', ticker: 'Ticker invalide (2 à 8 lettres).', taken: 'Ce ticker existe déjà.', in_clan: 'Tu es déjà dans un clan.', full: 'Ce clan est complet.', too_many: 'Tu as déjà 3 demandes en cours.', amount: 'Montant invalide.' },
    },
    en: {
      card: '🛡️ Clans · BETA', cardx: 'Create or join a clan: a pot shared every Monday', cardm: (n, p) => n + ' members · pot ' + p, see: 'See',
      t: '🛡️ Clans · BETA', close: 'Close', err: 'Something went wrong, try again.', load: '⏳',
      how: ['💰 The clan coin is created with the clan: its fees (buys and sales) fill the pot.', '👥 +$5,000 for the clan per new player brought with the clan link (after 3 days of play), +$1,000 per player of the game who joins.', '🗓️ Every Monday, 50% of the week\'s earnings are shared equally between the members present for 3 days. The other 50% go to the chief\'s pot.', '🏆 The best clan of the week wins $20,000 shared between its members, +$10,000 in the clan\'s earnings and the 🏆 badge.'],
      list: 'Clans', none: 'No clan yet: create the first one!', ask: 'Ask to join', asked: 'Request sent', full: 'Full', members: (n) => n + '/20',
      create: '➕ Create a clan · $5,000', name: 'Clan name (3 to 20 characters)', ticker: 'Ticker of the clan coin (2 to 8 letters)', logo: 'Logo and color', go: '🛡️ Create my clan',
      week: 'Earned this week', weekx: '50% shared on Monday between the members', pot: 'Chief\'s pot', coin: 'Clan coin', seecoin: 'See the coin', rank: (r) => '#' + r + ' of the clans',
      mem: 'Members', chief: '👑 chief', wait3: '⏳ less than 3 days', invite: '📤 Invite with the clan link', invmsg: (n) => '🛡️ Join my clan ' + n + ' on Meme Coin Tycoon: we share the earnings every Monday!',
      donate: '💝 Give to the pot', amount: 'Amount in $', leave: 'Leave the clan', leaveq: 'Sure? You lose your share of the week.',
      reqs: 'Requests', accept: 'Accept', refuse: 'Refuse', newp: 'new player', nreq: 'No request.',
      chiefh: '👑 Pot management', take: 'Take for me', give: 'Give to', lock7: 'Lock 7 d (+10%)', lock30: 'Lock 30 d (+50%)', locks: 'Locked', until: 'until', kick: 'Remove',
      pendn: (n) => n + ' recruit(s) waiting for their 3 days (+$5,000 each)', label: (n) => '🛡️ Coin of the clan ' + n, joinbtn: 'Join', badge: '🏆 Clan of the week',
      e: { cash: 'Not enough money.', name: 'Invalid name (3 to 20 characters).', name_taken: 'This name is taken.', ticker: 'Invalid ticker (2 to 8 letters).', taken: 'This ticker already exists.', in_clan: 'You are already in a clan.', full: 'This clan is full.', too_many: 'You already have 3 pending requests.', amount: 'Invalid amount.' },
    },
  };
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return l === 'fr' ? 'fr' : 'en'; };
  const L = () => TX[lg()];
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const nf = (n) => Number(n || 0).toLocaleString(lg() === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: 0 });
  const usd = (n) => lg() === 'fr' ? nf(n) + ' $' : '$' + nf(n);
  const px = (p) => { p = Number(p || 0); return '$' + (p >= 1 ? p.toFixed(2) : p.toFixed(5)); };
  const day = (d) => { try { return new Date(d).toLocaleDateString(lg() === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' }); } catch (e) { return ''; } };
  const call = async (a, b) => { try { return await tonCall(Object.assign({ action: 'mon_' + a }, b || {})); } catch (e) { return null; } };
  const errOf = (r) => { const T = L(); return (r && r.error && T.e[r.error]) || T.err; };
  // 17 oct 2026 (Jeremy): plenty of logos and colors so the clans look different
  const EMO = ['🛡️', '⚔️', '🏰', '👑', '💎', '🔥', '⚡', '🚀', '🌙', '☀️', '⭐', '🌈', '💀', '👻', '👽', '🤖', '🎃', '😈', '🤡', '🥷', '🧙', '🧛', '🧟', '🦸', '🐸', '🐶', '🐱', '🦊', '🐺', '🦁', '🐯', '🐻', '🐼', '🐨', '🐮', '🐷', '🐵', '🦍', '🐲', '🐉', '🦄', '🐴', '🦅', '🦉', '🐧', '🦈', '🐬', '🐙', '🦂', '🐍', '🦖', '🐝', '🦋', '🐞', '🌵', '🌴', '🍀', '🌸', '🍄', '🌊', '❄️', '🌋', '🍕', '🍔', '🍩', '🍺', '🍷', '🎮', '🎲', '🎯', '🏆', '⚽', '🏀', '🎸', '🎧', '💰', '💵', '🪙', '📈', '🧠', '👁️', '💣', '🗡️', '🏹', '🔱', '⚓', '🎩', '🕶️', '💍', '🌍', '🛸'];
  const COL = ['#ffd43b', '#4ff0b7', '#2ee6ff', '#ff6b9d', '#b388ff', '#ff9a3c', '#7dff6b', '#ff5a5a', '#ffffff', '#9aa4b2', '#3d7bff', '#00c2a8', '#c56cff', '#ff3df2', '#ffb3c7', '#c9a227', '#8b5a2b', '#1e9e5a'];

  const st = document.createElement('style');
  st.textContent = '#clm{position:fixed;inset:0;z-index:9998;background:rgba(5,3,15,.78);display:flex;align-items:flex-end;justify-content:center}'
    + '#clm .cbx{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:16px 16px calc(20px + env(safe-area-inset-bottom))}'
    + '#clm .ctop{display:flex;align-items:center;justify-content:space-between;margin:0 0 10px}#clm .ctop b{font-size:18px}#clm .cx{background:none;border:0;color:inherit;font-size:22px;opacity:.7;cursor:pointer;padding:4px 8px}'
    + '#clm .cc{border:1px solid var(--line,rgba(255,255,255,.12));border-radius:16px;padding:12px 14px;margin:0 0 12px;background:rgba(255,255,255,.03)}'
    + '#clm .ch{display:flex;align-items:center;gap:12px}#clm .clogo{width:52px;height:52px;border-radius:16px;display:grid;place-items:center;font-size:30px;flex:none}'
    + '#clm small{display:block;font-size:12.5px;opacity:.8;line-height:1.4}#clm .crow{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 0;border-top:1px solid rgba(255,255,255,.07);font-size:14px}'
    + '#clm .crow:first-of-type{border-top:0}#clm .cb{border:0;border-radius:999px;padding:7px 12px;font-weight:800;font-size:12.5px;background:#ffd43b;color:#1a1200;cursor:pointer;white-space:nowrap}'
    + '#clm .cb.g{background:rgba(255,255,255,.1);color:inherit}#clm .cb.r{background:rgba(255,90,90,.18);color:#ff8a8a}#clm .cb:disabled{opacity:.5}'
    + '#clm input{width:100%;box-sizing:border-box;padding:11px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:inherit;font-size:15px;margin:4px 0 10px}'
    + '#clm .cgrid{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 8px}#clm #cfe{max-height:188px;overflow-y:auto;padding:2px}#clm .cgrid button{width:40px;height:40px;border-radius:12px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);font-size:20px;cursor:pointer}'
    + '#clm .cgrid button[aria-pressed=true]{border:2px solid #ffd43b}#clm .big{font-size:24px;font-weight:900}#clm ul{margin:6px 0 0;padding-left:18px;font-size:13px;line-height:1.5;opacity:.9}';
  document.head.appendChild(st);

  // the card at the top of the Leaders tab (under the card of the contests of the week)
  let ME = null;
  async function card() {
    let lb = false; try { lb = VIEW === 'leaders'; } catch (e) {}
    const v = document.getElementById('view'); if (!lb || !v || document.getElementById('clcard')) return;
    const h = v.querySelector('h1'); if (!h) return;
    const T = L(), d = document.createElement('button'); d.id = 'clcard'; d.type = 'button';
    d.style.cssText = 'display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:1px solid #4ff0b7;background:linear-gradient(135deg,rgba(79,240,183,.16),rgba(79,240,183,.03));border-radius:16px;padding:12px 14px;margin:0 0 12px;color:inherit';
    d.innerHTML = '<span style="font-size:30px;line-height:1" class="cle">🛡️</span><span style="flex:1"><b style="display:block" class="cln">' + ec(T.card) + '</b><small style="opacity:.8" class="clx">' + ec(T.cardx) + '</small></span><span style="background:#4ff0b7;color:#06291f;font-weight:800;border-radius:10px;padding:6px 12px">' + ec(T.see) + '</span>';
    d.onclick = () => { hp(); show(); };
    const rk = document.getElementById('rkcard');
    (rk || h).insertAdjacentElement('afterend', d);
    const r = await call('clanstate'); ME = r;
    if (r && r.clan && document.body.contains(d)) {
      d.querySelector('.cle').textContent = r.clan.emoji;
      d.querySelector('.cln').textContent = r.clan.name + (r.clan.badge ? ' 🏆' : '');
      d.querySelector('.clx').textContent = T.cardm(r.clan.n, usd(r.clan.treasury));
    }
  }
  function watch() { const v = document.getElementById('view'); if (!v) return false; new MutationObserver(() => card()).observe(v, { childList: true }); card(); return true; }
  if (!watch()) { let n = 0; const w = setInterval(() => { if (watch() || ++n > 80) clearInterval(w); }, 250); }

  function closeIt() { const d = document.getElementById('clm'); if (d) d.remove(); }
  function sheet() {
    let d = document.getElementById('clm');
    if (!d) {
      d = document.createElement('div'); d.id = 'clm';
      d.innerHTML = '<div class="cbx"><div class="ctop"><b>' + ec(L().t) + '</b><button class="cx" id="clx" aria-label="' + ec(L().close) + '">✕</button></div><div id="clb" style="text-align:center;padding:30px 0">⏳</div></div>';
      d.onclick = (e) => { if (e.target === d) closeIt(); };
      document.body.appendChild(d);
      d.querySelector('#clx').onclick = () => { hp(); closeIt(); };
    }
    return d.querySelector('#clb');
  }
  async function show(viewId) {
    const b = sheet(); b.style.cssText = 'text-align:center;padding:30px 0'; b.textContent = '⏳';
    const r = await call('clanstate'); ME = r;
    if (!r || !r.ok) { b.textContent = L().err; return; }
    b.style.cssText = '';
    if (r.clan && (!viewId || Number(viewId) === Number(r.clan.id))) return mine(b, r);
    if (viewId) return other(b, Number(viewId), r);
    return lobby(b, r);
  }
  const logo = (c) => '<div class="clogo" style="background:' + ec(c.color || '#ffd43b') + '33;border:1px solid ' + ec(c.color || '#ffd43b') + '">' + ec(c.emoji || '🛡️') + '</div>';

  // not in a clan: how it works, the list of clans, create one
  function lobby(b, r) {
    const T = L(), asked = (r.asked || []).map(Number);
    let h = '<div class="cc"><ul>' + T.how.map((x) => '<li>' + ec(x) + '</li>').join('') + '</ul></div>';
    h += '<div class="cc"><b>' + ec(T.list) + '</b>' + ((r.list || []).length ? (r.list || []).map((c) => '<div class="crow" data-v="' + c.id + '" style="cursor:pointer"><span style="display:flex;align-items:center;gap:8px;min-width:0"><span style="font-size:22px">' + ec(c.emoji) + '</span><span style="min-width:0"><b style="display:block">' + ec(c.name) + (c.badge ? ' 🏆' : '') + '</b><small>' + ec(T.members(c.n)) + ' · $' + ec(c.ticker || '') + ' · ' + usd(c.mcap) + '</small></span></span>'
      + (asked.includes(Number(c.id)) ? '<span style="font-size:12px;opacity:.7">' + ec(T.asked) + '</span>' : Number(c.n) >= 20 ? '<span style="font-size:12px;opacity:.7">' + ec(T.full) + '</span>' : '<button class="cb" data-ask="' + c.id + '">' + ec(T.ask) + '</button>') + '</div>').join('') : '<small style="margin-top:6px">' + ec(T.none) + '</small>') + '</div>';
    h += '<button class="btn" id="clnew" style="width:100%">' + ec(T.create) + '</button><div id="clform"></div>';
    b.innerHTML = h;
    b.querySelectorAll('[data-ask]').forEach((x) => x.onclick = async (e) => { e.stopPropagation(); hp(); x.disabled = true; const q = await call('clanrequest', { id: Number(x.dataset.ask) }); if (!q || !q.ok) { x.disabled = false; tst(errOf(q)); return; } tst('✅ ' + T.asked); show(); });
    b.querySelectorAll('[data-v]').forEach((x) => x.onclick = () => { hp(); show(x.dataset.v); });
    b.querySelector('#clnew').onclick = () => { hp(); form(b.querySelector('#clform')); b.querySelector('#clnew').remove(); };
  }
  function form(f) {
    const T = L(); let emo = EMO[1], col = COL[0];
    f.innerHTML = '<div class="cc"><small>' + ec(T.name) + '</small><input id="cfn" maxlength="20" autocomplete="off"><small>' + ec(T.ticker) + '</small><input id="cft" maxlength="8" autocomplete="off" style="text-transform:uppercase"><small>' + ec(T.logo) + '</small>'
      + '<div class="cgrid" id="cfe">' + EMO.map((e) => '<button type="button" data-e="' + e + '" aria-pressed="' + (e === emo) + '">' + e + '</button>').join('') + '</div>'
      + '<div class="cgrid" id="cfc">' + COL.map((c) => '<button type="button" data-c="' + c + '" aria-pressed="' + (c === col) + '" style="background:' + c + '"></button>').join('') + '</div>'
      + '<button class="btn" id="cfgo" style="width:100%;margin-top:6px">' + ec(T.go) + '</button></div>';
    f.querySelectorAll('[data-e]').forEach((x) => x.onclick = () => { emo = x.dataset.e; f.querySelectorAll('[data-e]').forEach((y) => y.setAttribute('aria-pressed', y === x)); });
    f.querySelectorAll('[data-c]').forEach((x) => x.onclick = () => { col = x.dataset.c; f.querySelectorAll('[data-c]').forEach((y) => y.setAttribute('aria-pressed', y === x)); });
    const nm = f.querySelector('#cfn'), tk = f.querySelector('#cft');
    nm.oninput = () => { if (!tk.dataset.t) tk.value = nm.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8); };
    tk.oninput = () => { tk.dataset.t = '1'; };
    f.querySelector('#cfgo').onclick = async (e) => {
      hp('medium'); const btn = e.currentTarget; btn.disabled = true;
      const r = await call('clancreate', { name: nm.value, ticker: tk.value, emoji: emo, color: col });
      btn.disabled = false;
      if (!r || !r.ok) { hp('err'); tst(errOf(r)); return; }
      hp('ok'); show();
    };
    nm.focus();
  }

  // another clan (from the list, a link or a coin page)
  async function other(b, id, st) {
    const T = L(), r = await call('clanview', { id });
    if (!r || !r.clan) { b.textContent = T.err; return; }
    const c = r.clan, inClan = !!(st && st.clan);
    let h = '<div class="cc"><div class="ch">' + logo(c) + '<div style="min-width:0"><b style="font-size:18px">' + ec(c.name) + '</b><small>' + (c.badge ? ec(T.badge) + ' · ' : '') + ec(T.rank(c.rank)) + ' · ' + ec(T.members(c.n)) + '</small></div></div></div>';
    if (c.coin) h += '<div class="cc"><div class="crow"><span>' + ec(T.coin) + ' <b>$' + ec(c.coin.ticker) + '</b><small>' + px(c.coin.price) + ' · ' + usd(c.coin.mcap) + '</small></span><button class="cb g" id="clsc">' + ec(T.seecoin) + '</button></div></div>';
    h += '<div class="cc"><b>' + ec(T.mem) + '</b>' + (c.members || []).map((m) => '<div class="crow"><span>' + ec(m.name) + (m.role === 'chief' ? ' <small style="display:inline">' + ec(T.chief) + '</small>' : '') + '</span></div>').join('') + '</div>';
    if (!inClan && !c.closed) h += r.asked ? '<p style="text-align:center;opacity:.8">' + ec(T.asked) + '</p>' : c.n >= 20 ? '<p style="text-align:center;opacity:.8">' + ec(T.full) + '</p>' : '<button class="btn" id="clask" style="width:100%">🛡️ ' + ec(T.ask) + '</button>';
    b.innerHTML = h;
    const sc = b.querySelector('#clsc'); if (sc) sc.onclick = () => { hp(); closeIt(); try { openCoin(c.coin.id); } catch (e) {} };
    const a = b.querySelector('#clask'); if (a) a.onclick = async () => { hp(); a.disabled = true; const q = await call('clanrequest', { id }); if (!q || !q.ok) { a.disabled = false; tst(errOf(q)); return; } tst('✅ ' + T.asked); show(id); };
  }

  // my clan
  function mine(b, r) {
    const T = L(), c = r.clan, chief = r.role === 'chief';
    let h = '<div class="cc"><div class="ch">' + logo(c) + '<div style="min-width:0;flex:1"><b style="font-size:18px">' + ec(c.name) + '</b><small>' + (c.badge ? ec(T.badge) + ' · ' : '') + ec(T.rank(c.rank)) + ' · ' + ec(T.members(c.n)) + '</small></div></div></div>';
    h += '<div class="cc"><div class="crow"><span>' + ec(T.week) + '<small>' + ec(T.weekx) + '</small></span><span class="big">' + usd(c.week) + '</span></div>'
      + '<div class="crow"><span>' + ec(T.pot) + '</span><span class="big">' + usd(c.treasury) + '</span></div>'
      + (c.coin ? '<div class="crow"><span>' + ec(T.coin) + ' <b>$' + ec(c.coin.ticker) + '</b><small>' + px(c.coin.price) + ' · ' + usd(c.coin.mcap) + '</small></span><button class="cb g" id="clsc">' + ec(T.seecoin) + '</button></div>' : '')
      + ((c.locks || []).length ? (c.locks || []).map((l) => '<div class="crow"><span>🔒 ' + ec(T.locks) + ' ' + usd(l.amount) + ' (+' + l.pct + ' %)</span><small style="display:inline">' + ec(T.until) + ' ' + ec(day(l.until)) + '</small></div>').join('') : '')
      + (Number(c.pending_new) ? '<small style="margin-top:6px">' + ec(T.pendn(c.pending_new)) + '</small>' : '') + '</div>';
    h += '<button class="btn" id="clinv" style="width:100%;margin:0 0 12px">' + ec(T.invite) + '</button>';
    if (chief) {
      h += '<div class="cc"><b>' + ec(T.reqs) + '</b>' + ((c.requests || []).length ? c.requests.map((q) => '<div class="crow"><span>' + ec(q.name) + (q.new ? ' <small style="display:inline;color:#4ff0b7">' + ec(T.newp) + '</small>' : '') + '</span><span style="display:flex;gap:6px"><button class="cb" data-acc="' + q.uid + '">' + ec(T.accept) + '</button><button class="cb g" data-ref="' + q.uid + '">' + ec(T.refuse) + '</button></span></div>').join('') : '<small style="margin-top:4px">' + ec(T.nreq) + '</small>') + '</div>';
      h += '<div class="cc"><b>' + ec(T.chiefh) + '</b><small>' + ec(T.amount) + '</small><input id="clamt" type="number" inputmode="decimal" min="1" placeholder="1000">'
        + '<div style="display:flex;flex-wrap:wrap;gap:6px"><button class="cb" data-pot="take">' + ec(T.take) + '</button><button class="cb g" data-pot="lock7">' + ec(T.lock7) + '</button><button class="cb g" data-pot="lock30">' + ec(T.lock30) + '</button></div>'
        + '<small style="margin-top:8px">' + ec(T.give) + '</small><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px">' + (c.members || []).filter((m) => m.role !== 'chief').map((m) => '<button class="cb g" data-give="' + m.uid + '">' + ec(m.name) + '</button>').join('') + '</div></div>';
    }
    h += '<div class="cc"><b>' + ec(T.mem) + '</b>' + (c.members || []).map((m) => '<div class="crow"><span>' + ec(m.name) + (m.role === 'chief' ? ' <small style="display:inline">' + ec(T.chief) + '</small>' : '') + (m.ok ? '' : ' <small style="display:inline;opacity:.6">' + ec(T.wait3) + '</small>') + '</span>' + (chief && m.role !== 'chief' ? '<button class="cb r" data-kick="' + m.uid + '">' + ec(T.kick) + '</button>' : '') + '</div>').join('') + '</div>';
    h += '<div class="cc"><small>' + ec(T.amount) + '</small><input id="cldon" type="number" inputmode="decimal" min="1" placeholder="500"><button class="cb" id="cldonb">' + ec(T.donate) + '</button></div>';
    h += '<button class="ghost" id="clleave" style="width:100%;opacity:.7">' + ec(T.leave) + '</button>';
    b.innerHTML = h;
    const sc = b.querySelector('#clsc'); if (sc) sc.onclick = () => { hp(); closeIt(); try { openCoin(c.coin.id); } catch (e) {} };
    b.querySelector('#clinv').onclick = () => { hp(); try { shareGame('clan', c.id, c.link, T.invmsg(c.emoji + ' ' + c.name)); } catch (e) { try { tw.openTelegramLink('https://t.me/share/url?url=' + encodeURIComponent(c.link) + '&text=' + encodeURIComponent(T.invmsg(c.name))); } catch (x) {} } };
    const act = async (a, body, btn) => { hp(); if (btn) btn.disabled = true; const q = await call(a, body); if (btn) btn.disabled = false; if (!q || !q.ok) { hp('err'); tst(errOf(q)); return false; } hp('ok'); show(); return true; };
    b.querySelectorAll('[data-acc]').forEach((x) => x.onclick = () => act('clanaccept', { uid: Number(x.dataset.acc) }, x));
    b.querySelectorAll('[data-ref]').forEach((x) => x.onclick = () => act('clanrefuse', { uid: Number(x.dataset.ref) }, x));
    b.querySelectorAll('[data-kick]').forEach((x) => x.onclick = () => act('clankick', { uid: Number(x.dataset.kick) }, x));
    const amt = () => Number((b.querySelector('#clamt') || {}).value || 0);
    b.querySelectorAll('[data-pot]').forEach((x) => x.onclick = () => { const p = x.dataset.pot; act(p === 'take' ? 'clantake' : 'clanlock', { amount: amt(), days: p === 'lock30' ? 30 : 7 }, x); });
    b.querySelectorAll('[data-give]').forEach((x) => x.onclick = () => act('clangive', { amount: amt(), uid: Number(x.dataset.give) }, x));
    b.querySelector('#cldonb').onclick = (e) => act('clandonate', { amount: Number(b.querySelector('#cldon').value || 0) }, e.currentTarget);
    b.querySelector('#clleave').onclick = async () => {
      let ok = true; try { ok = await new Promise((res) => tw.showConfirm(T.leaveq, res)); } catch (e) { ok = window.confirm(T.leaveq); }
      if (ok) { const q = await call('clanleave'); if (q && q.ok) { hp('ok'); show(); } else tst(errOf(q)); }
    };
  }

  // the page of a coin: "Coin of the clan X" when it is a clan coin
  async function coinLabel(el) {
    el.dataset.cl = '1';
    const r = await call('clanofcoin', { coin: Number(el.dataset.id) });
    if (!r || !r.clan || !document.body.contains(el)) return;
    const T = L(), d = document.createElement('div');
    d.style.cssText = 'margin-top:8px';
    d.innerHTML = '<button type="button" style="border:1px solid #4ff0b7;background:rgba(79,240,183,.12);color:#4ff0b7;font-weight:800;font-size:13px;border-radius:999px;padding:6px 14px;cursor:pointer">' + ec(r.clan.emoji) + ' ' + ec(T.label(r.clan.name)) + (r.mine ? '' : ' · ' + ec(T.joinbtn) + ' ›') + '</button>';
    d.querySelector('button').onclick = () => { hp(); show(r.clan.id); };
    el.insertAdjacentElement('beforebegin', d);
  }
  new MutationObserver(() => { document.querySelectorAll('#burnb:not([data-cl])').forEach(coinLabel); }).observe(document.body, { childList: true, subtree: true });

  window.mctClans = show;
  // links ?startapp=clan (the clans) and ?startapp=cl_<id> (a clan, to ask to join)
  const sp = String((window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.start_param) || '');
  const m = /^cl_(\d+)$/.exec(sp);
  if (sp === 'clan' || m) { let n = 0; const w = setInterval(() => { n++; let ok = false; try { ok = !!document.querySelector('nav.tb') && !!document.getElementById('view'); } catch (e) {} if (ok || n > 60) { clearInterval(w); if (ok) setTimeout(() => show(m ? m[1] : undefined), 600); } }, 250); }
})();
