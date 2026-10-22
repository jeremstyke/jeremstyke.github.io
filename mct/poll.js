// 22 oct 2026 (Jeremy): in-game poll before refocusing Meme Coin Tycoon on buying / selling, coin creation and blockchains.
// A compact card above the daily missions until the player votes (+$200 once); the answers are counted by the server
// (mct-ton function, actions 'mon_poll' / 'mon_pollvote', handled in SQL by mct_poll_api).
(function () {
  try {
    const TXT = {
      en: { card: '🗳️ Poll: help us make the game simpler', h: '🗳️ We are simplifying the game', p: 'The core stays: buy, sell, create coins and blockchains, mining, real cryptos, the diamond. Tick what you want to KEEP on top of that:', send: 'Send', thx: 'Thanks! Results so far', votes: (n) => n + ' votes', close: 'Close',
        o: { clans: 'Clans', duels: 'Duels', vault: 'Vault (lock a coin)', wars: 'Clan wars', burn: 'Coin burn (stars)', banner: 'Ad banner (stars)', insure: 'Insurance (video)', scoop: 'News scoop (video)', premium: 'Premium' } },
      fr: { card: '🗳️ Sondage : aide-nous à simplifier le jeu', h: '🗳️ On simplifie le jeu', p: 'Le cœur reste : acheter, vendre, créer des coins et des blockchains, le minage, les vraies cryptos, le diamant. Coche ce que tu veux GARDER en plus :', send: 'Envoyer', thx: 'Merci ! Résultats pour l\'instant', votes: (n) => n + ' votes', close: 'Fermer',
        o: { clans: 'Clans', duels: 'Duels', vault: 'Coffre (bloquer un coin)', wars: 'Guerres de clans', burn: 'Brûlage de coin (étoiles)', banner: 'Bannière pub (étoiles)', insure: 'Assurance (vidéo)', scoop: 'Scoop des news (vidéo)', premium: 'Premium' } },
      id: { card: '🗳️ Polling: bantu kami menyederhanakan game', h: '🗳️ Kami menyederhanakan game', p: 'Inti game tetap: beli, jual, buat koin dan blockchain, menambang, kripto asli, berlian. Centang yang ingin kamu PERTAHANKAN:', send: 'Kirim', thx: 'Terima kasih! Hasil sementara', votes: (n) => n + ' suara', close: 'Tutup',
        o: { clans: 'Klan', duels: 'Duel', vault: 'Brankas (kunci koin)', wars: 'Perang klan', burn: 'Bakar koin (bintang)', banner: 'Banner iklan (bintang)', insure: 'Asuransi (video)', scoop: 'Bocoran berita (video)', premium: 'Premium' } },
      ar: { card: '🗳️ استطلاع: ساعدنا في تبسيط اللعبة', h: '🗳️ نحن نبسّط اللعبة', p: 'الأساس باقٍ: الشراء، البيع، إنشاء العملات والبلوكتشين، التعدين، العملات الحقيقية، الماسة. اختر ما تريد الإبقاء عليه أيضًا:', send: 'إرسال', thx: 'شكرًا! النتائج حتى الآن', votes: (n) => n + ' صوت', close: 'إغلاق',
        o: { clans: 'العشائر', duels: 'المبارزات', vault: 'الخزنة (قفل عملة)', wars: 'حروب العشائر', burn: 'حرق عملة (نجوم)', banner: 'لافتة إعلانية (نجوم)', insure: 'التأمين (فيديو)', scoop: 'سبق الأخبار (فيديو)', premium: 'بريميوم' } }
    };
    const T = () => TXT[(typeof LANG === 'string' && TXT[LANG]) ? LANG : 'en'];
    const call = async (action, extra) => (await fetch('https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-ton', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.assign({ app: 'mct', initData: (window.Telegram && Telegram.WebApp.initData) || '', action }, extra || {})) })).json();
    let ST = null, LOADING = false;
    try { if (localStorage.getItem('mct_poll_done') === '1') ST = { voted: true }; } catch (e) {}

    function overlay(html) {
      let o = document.getElementById('pollov');
      if (!o) { o = document.createElement('div'); o.id = 'pollov'; o.style.cssText = 'position:fixed;inset:0;z-index:9000;background:rgba(5,2,15,.75);display:flex;align-items:flex-end;justify-content:center'; document.body.appendChild(o); o.onclick = (e) => { if (e.target === o) o.remove(); }; }
      o.innerHTML = '<div style="width:100%;max-width:520px;max-height:88vh;overflow:auto;background:#241048;color:#fff;border-radius:22px 22px 0 0;padding:20px 18px calc(20px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:10px">' + html + '</div>';
      return o;
    }
    function results(s) {
      const t = T(), tot = Math.max(1, s.total || 0);
      const rows = (s.opts || []).map((k) => [k, (s.res && s.res[k]) || 0]).sort((a, b) => b[1] - a[1])
        .map(([k, n]) => { const p = Math.round(100 * n / tot); return '<div style="display:flex;flex-direction:column;gap:4px"><div style="display:flex;justify-content:space-between;font-size:14px"><span>' + t.o[k] + '</span><b>' + p + ' %</b></div><div style="height:6px;border-radius:6px;background:rgba(255,255,255,.1)"><i style="display:block;height:100%;width:' + p + '%;border-radius:6px;background:#ffd43b"></i></div></div>'; }).join('');
      const o = overlay('<h3 style="margin:0;font-size:20px">' + t.thx + '</h3><small style="opacity:.7">' + t.votes(s.total || 0) + '</small>' + rows + '<button id="pollx" style="margin-top:6px;padding:12px;border:0;border-radius:14px;background:rgba(255,255,255,.12);color:#fff;font-weight:700">' + t.close + '</button>');
      o.querySelector('#pollx').onclick = () => o.remove();
    }
    function form() {
      const t = T(), opts = (ST && ST.opts) || ['clans', 'duels', 'vault', 'wars', 'burn', 'insure', 'scoop'];
      const o = overlay('<h3 style="margin:0;font-size:20px">' + t.h + '</h3><p style="margin:0;opacity:.85;font-size:14px;line-height:1.4">' + t.p + '</p>' +
        opts.map((k) => '<label style="display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:12px;background:rgba(255,255,255,.06);font-size:15px"><input type="checkbox" value="' + k + '" style="width:20px;height:20px">' + t.o[k] + '</label>').join('') +
        '<button id="polls" style="margin-top:6px;padding:13px;border:0;border-radius:14px;background:#ffd43b;color:#1a0638;font-weight:800;font-size:16px">' + t.send + ' · +$' + ((ST && ST.reward) || 200) + '</button>');
      o.querySelector('#polls').onclick = async (e) => {
        const b = e.currentTarget; b.disabled = true;
        const picks = [...o.querySelectorAll('input:checked')].map((x) => x.value);
        try {
          const r = await call('mon_pollvote', { picks });
          if (!r || !r.ok) { b.disabled = false; return; }
          ST = r; try { localStorage.setItem('mct_poll_done', '1'); } catch (er) {}
          try { if (r.cash != null && typeof setCash === 'function') setCash(r.cash); } catch (er) {}
          try { if (typeof haptic === 'function') haptic('ok'); } catch (er) {}
          const c = document.getElementById('pollcard'); if (c) c.remove();
          results(r);
        } catch (er) { b.disabled = false; }
      };
    }
    function card() {
      if (ST && ST.voted) return;
      const m = document.getElementById('msn');
      if (!m || document.getElementById('pollcard')) return;
      const t = T(), d = document.createElement('button');
      d.id = 'pollcard';
      d.style.cssText = 'width:100%;display:flex;justify-content:space-between;align-items:center;gap:8px;margin:0 0 10px;padding:11px 14px;border:1px solid rgba(255,212,59,.35);border-radius:14px;background:rgba(255,212,59,.08);color:#fff;font-weight:700;font-size:14px;text-align:start';
      d.innerHTML = '<span>' + t.card + '</span><b style="color:#ffd43b;white-space:nowrap">+$' + ((ST && ST.reward) || 200) + '</b>';
      d.onclick = () => { try { if (typeof haptic === 'function') haptic(); } catch (e) {} form(); };
      m.parentNode.insertBefore(d, m);
    }
    async function load() {
      if (ST || LOADING) return; LOADING = true;
      try { const r = await call('mon_poll'); if (r && r.ok) { ST = r; if (r.voted) { try { localStorage.setItem('mct_poll_done', '1'); } catch (e) {} } } } catch (e) {}
      LOADING = false; card();
    }
    const view = document.getElementById('view');
    if (view) new MutationObserver(() => { if (document.getElementById('msn') && !document.getElementById('pollcard')) { if (ST) card(); else load(); } }).observe(view, { childList: true, subtree: true });
    load();
  } catch (e) { console.error('poll', e); }
})();
