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
    fa: {
      rT: '💵 شارژ', rS: 'ویدیو روزی یک بار، به‌علاوه روزی یک بسته ستاره (حداکثر 10,000 دلار در هفته). پول خریده‌شده در رتبه‌بندی حساب نمی‌شود.', rC: (a) => 'فقط ' + a + ' دلار در این هفته مانده', rC0: 'سقف هفتگی پر شد · دوشنبه برمی‌گردد', rV: '📺 +500 دلار با یک ویدیو', rVp: '💎 +500 دلار (پریمیوم)', rVs: 'رایگان · روزی یک بار، زیر 1,000 دلار', rVr: 'فقط وقتی کمتر از 1,000 دلار داری', rVd: 'امروز گرفته شده', rP: (a) => '+' + a + ' دلار', rD: 'شروع', rDw: 'بسته امروز گرفته شده · فردا برگرد', rM: 'معامله خوب', rL: '+33 % بیشتر', rX: '🔥 بهترین ارزش', rOk: (a) => '💵 +' + a + ' دلار اضافه شد!',
      vid: '📺 دیدن ویدیو', vid2: '📺 دیدن یک ویدیو', prem: '💎 بگیر (پریمیوم، بدون ویدیو)', no: 'نه، ممنون', next: '📺 یک ویدیوی دیگر…',
      bT: 'جایزه‌ات را دو برابر کن!', bX: (a) => 'یک ویدیوی کوتاه ببین و ' + a + ' بیشتر بگیر.', bOk: (a) => '🎁 +' + a + ' اضافه شد!',
      mT: 'برداشتت را دو برابر کن!', mX: (q) => 'یک ویدیوی کوتاه ببین و ' + q + ' بیشتر بگیر.', mOk: (q) => '⛏️ +' + q + ' به کوین‌هایت اضافه شد!',
      cO: '📺 +300 دلار با یک ویدیو', cOs: 'روزی یک بار', cOk: '💵 +300 دلار اضافه شد!',
      dB: '📺 ضربه x2 برای 30 ثانیه', dBp: '💎 ضربه x2 برای 30 ثانیه (پریمیوم)', dOn: (s) => '⚡ x2 برای ' + s + ' ثانیه دیگر', dW: (s) => '📺 ضربه x2 دوباره تا ' + s, dOk: '⚡ ضربه‌هایت 30 ثانیه دو برابر حساب می‌شوند!',
      kOk: '🛡️ +200 دلار برای کلنت!',
      skip: 'ویدیو تمام نشد: این بار جایزه‌ای نیست.', late: 'برای این یکی دیر شد.', done: 'امروز گرفته شده. فردا برگرد!', wait: 'هنوز نه: هر 3 دقیقه یک x2.', rich: 'فقط وقتی پول کم داری.', err: 'مشکلی پیش آمد، دوباره امتحان کن.',
    },
    ru: {
      rT: '💵 Пополнение', rS: 'Видео раз в день плюс один пак звёзд в день (до $10,000 в неделю). Купленные деньги не учитываются в рейтингах.', rC: (a) => 'На этой неделе осталось $' + a, rC0: 'Недельный лимит исчерпан · снова в понедельник', rV: '📺 +$500 за видео', rVp: '💎 +$500 (Премиум)', rVs: 'Бесплатно · раз в день, при балансе меньше $1,000', rVr: 'Только если у тебя меньше $1,000', rVd: 'Сегодня уже получено', rP: (a) => '+$' + a, rD: 'Стартовый', rDw: 'Пак сегодня уже куплен · возвращайся завтра', rM: 'Выгодно', rL: '+33 % больше', rX: '🔥 Лучшая цена', rOk: (a) => '💵 +$' + a + ' добавлено!',
      vid: '📺 Посмотреть видео', vid2: '📺 Посмотреть видео', prem: '💎 Забрать (Премиум, без видео)', no: 'Нет, спасибо', next: '📺 Ещё одно видео…',
      bT: 'Удвой свой бонус!', bX: (a) => 'Посмотри короткое видео и получи ещё ' + a + '.', bOk: (a) => '🎁 +' + a + ' добавлено!',
      mT: 'Удвой добычу!', mX: (q) => 'Посмотри 1 короткое видео и получи ещё ' + q + '.', mOk: (q) => '⛏️ +' + q + ' добавлено к монетам!',
      cO: '📺 +$300 за видео', cOs: 'Раз в день', cOk: '💵 +$300 добавлено!',
      dB: '📺 Нажатия x2 на 30 с', dBp: '💎 Нажатия x2 на 30 с (Премиум)', dOn: (s) => '⚡ x2 ещё ' + s + ' с', dW: (s) => '📺 Нажатия x2 снова через ' + s, dOk: '⚡ Твои нажатия считаются вдвойне 30 секунд!',
      kOk: '🛡️ +$200 твоему клану!',
      skip: 'Видео не досмотрено: в этот раз без награды.', late: 'Для этого уже поздно.', done: 'Сегодня уже получено. Возвращайся завтра!', wait: 'Пока нет: один x2 каждые 3 минуты.', rich: 'Только когда не хватает денег.', err: 'Что-то пошло не так, попробуй ещё раз.',
    },
    en: {
      rT: '💵 Recharge', rS: 'The video once a day, plus one Stars pack a day ($10,000 a week at most). Bought cash does not count in the rankings.', rC: (a) => 'Only $' + a + ' left this week', rC0: 'Weekly limit reached · back on Monday', rV: '📺 +$500 with a video', rVp: '💎 +$500 (Premium)', rVs: 'Free · once a day, under $1,000', rVr: 'Only when you have less than $1,000', rVd: 'Already taken today', rP: (a) => '+$' + a, rD: 'Starter', rDw: 'Pack taken today · come back tomorrow', rM: 'Good deal', rL: '+33 % more', rX: '🔥 Best value', rOk: (a) => '💵 +$' + a + ' added!',
      vid: '📺 Watch a video', vid2: '📺 Watch a video', prem: '💎 Take it (Premium, no video)', no: 'No thanks', next: '📺 One more video…',
      bT: 'Double your bonus!', bX: (a) => 'Watch a short video and get ' + a + ' more.', bOk: (a) => '🎁 +' + a + ' added!',
      mT: 'Double your harvest!', mX: (q) => 'Watch 1 short video and get ' + q + ' more.', mOk: (q) => '⛏️ +' + q + ' added to your coins!',
      cO: '📺 +$300 with a video', cOs: 'Once a day', cOk: '💵 +$300 added!',
      dB: '📺 Taps x2 for 30 s', dBp: '💎 Taps x2 for 30 s (Premium)', dOn: (s) => '⚡ x2 for ' + s + ' more seconds', dW: (s) => '📺 Taps x2 again in ' + s, dOk: '⚡ Your taps count double for 30 seconds!',
      kOk: '🛡️ +$200 for your clan!',
      skip: 'The video was not finished: no reward this time.', late: 'Too late for this one.', done: 'Already taken today. Come back tomorrow!', wait: 'Not yet: one x2 every 3 minutes.', rich: 'Only when you are short of cash.', err: 'Something went wrong, try again.',
    },
    fr: {
      rT: '💵 Recharger', rS: 'La vidéo 1 fois par jour, plus 1 pack d\'étoiles par jour (10 000 $ par semaine au maximum). Le cash acheté ne compte pas au classement.', rC: (a) => 'Plus que ' + a + ' $ cette semaine', rC0: 'Limite de la semaine atteinte · retour lundi', rV: '📺 +500 $ avec une vidéo', rVp: '💎 +500 $ (Premium)', rVs: 'Gratuit · 1 fois par jour, sous 1 000 $', rVr: 'Seulement quand tu as moins de 1 000 $', rVd: 'Déjà pris aujourd\'hui', rP: (a) => '+' + a + ' $', rD: 'Le petit pack', rDw: 'Pack déjà pris aujourd\'hui · reviens demain', rM: 'Bonne affaire', rL: '+33 % en plus', rX: '🔥 Le meilleur prix', rOk: (a) => '💵 +' + a + ' $ ajoutés !',
      vid: '📺 Regarder une vidéo', vid2: '📺 Regarder une vidéo', prem: '💎 Prendre (Premium, sans vidéo)', no: 'Non merci', next: '📺 Encore une vidéo…',
      bT: 'Double ton bonus !', bX: (a) => 'Regarde une courte vidéo et reçois encore ' + a + '.', bOk: (a) => '🎁 +' + a + ' ajoutés !',
      mT: 'Double ta récolte !', mX: (q) => 'Regarde 1 courte vidéo et reçois encore ' + q + '.', mOk: (q) => '⛏️ +' + q + ' ajoutés à tes coins !',
      cO: '📺 +300 $ avec une vidéo', cOs: '1 fois par jour', cOk: '💵 +300 $ ajoutés !',
      dB: '📺 Tapes x2 pendant 30 s', dBp: '💎 Tapes x2 pendant 30 s (Premium)', dOn: (s) => '⚡ x2 encore ' + s + ' secondes', dW: (s) => '📺 Tapes x2 de nouveau dans ' + s, dOk: '⚡ Tes tapes comptent double pendant 30 secondes !',
      kOk: '🛡️ +200 $ pour ton clan !',
      skip: 'Vidéo pas terminée : pas de récompense cette fois.', late: 'Trop tard pour celle-ci.', done: 'Déjà pris aujourd\'hui. Reviens demain !', wait: 'Pas encore : un x2 toutes les 3 minutes.', rich: 'Seulement quand tu manques de cash.', err: 'Une erreur est survenue, réessaie.',
    },
    id: {
      rT: '💵 Isi ulang', rS: 'Video 1 kali sehari, plus 1 paket bintang per hari (maks. $10,000 per minggu). Uang yang dibeli tidak dihitung di peringkat.', rC: (a) => 'Tersisa $' + a + ' minggu ini', rC0: 'Batas mingguan tercapai · kembali Senin', rV: '📺 +$500 dengan video', rVp: '💎 +$500 (Premium)', rVs: 'Gratis · 1 kali sehari, di bawah $1,000', rVr: 'Hanya saat uangmu kurang dari $1,000', rVd: 'Sudah diambil hari ini', rP: (a) => '+$' + a, rD: 'Paket kecil', rDw: 'Paket sudah diambil hari ini · kembali besok', rM: 'Hemat', rL: '+33 % lebih', rX: '🔥 Harga terbaik', rOk: (a) => '💵 +$' + a + ' ditambahkan!',
      vid: '📺 Tonton video', vid2: '📺 Tonton video', prem: '💎 Ambil (Premium, tanpa video)', no: 'Tidak, terima kasih', next: '📺 Satu video lagi…',
      bT: 'Gandakan bonusmu!', bX: (a) => 'Tonton video singkat dan dapatkan ' + a + ' lagi.', bOk: (a) => '🎁 +' + a + ' ditambahkan!',
      mT: 'Gandakan hasil tambangmu!', mX: (q) => 'Tonton 1 video singkat dan dapatkan ' + q + ' lagi.', mOk: (q) => '⛏️ +' + q + ' ditambahkan ke koinmu!',
      cO: '📺 +$300 dengan video', cOs: '1 kali sehari', cOk: '💵 +$300 ditambahkan!',
      dB: '📺 Ketukan x2 selama 30 dtk', dBp: '💎 Ketukan x2 selama 30 dtk (Premium)', dOn: (s) => '⚡ x2 masih ' + s + ' detik', dW: (s) => '📺 Ketukan x2 lagi dalam ' + s, dOk: '⚡ Ketukanmu dihitung dua kali selama 30 detik!',
      kOk: '🛡️ +$200 untuk klanmu!',
      skip: 'Video tidak selesai: tidak ada hadiah kali ini.', late: 'Terlambat untuk yang ini.', done: 'Sudah diambil hari ini. Kembali besok!', wait: 'Belum: satu x2 setiap 3 menit.', rich: 'Hanya saat uangmu habis.', err: 'Terjadi kesalahan, coba lagi.',
    },
    ar: {
      rT: '💵 شحن', rS: 'الفيديو مرة يوميًا، وحزمة نجوم واحدة يوميًا (10000$ أسبوعيًا كحد أقصى). المال المشترى لا يُحسب في الترتيب.', rC: (a) => 'متبقٍ ' + a + '$ هذا الأسبوع', rC0: 'تم بلوغ حد الأسبوع · عد يوم الاثنين', rV: '📺 +500$ مع فيديو', rVp: '💎 +500$ (بريميوم)', rVs: 'مجانًا · مرة يوميًا، تحت 1000$', rVr: 'فقط عندما يكون لديك أقل من 1000$', rVd: 'تم أخذها اليوم', rP: (a) => '+' + a + '$', rD: 'الحزمة الصغيرة', rDw: 'تم أخذ حزمة اليوم · عد غدًا', rM: 'صفقة جيدة', rL: '+33 % أكثر', rX: '🔥 أفضل سعر', rOk: (a) => '💵 أُضيفت +' + a + '$!',
      vid: '📺 شاهد فيديو', vid2: '📺 شاهد فيديو', prem: '💎 خذها (بريميوم، بدون فيديو)', no: 'لا شكرًا', next: '📺 فيديو آخر…',
      bT: 'ضاعف مكافأتك!', bX: (a) => 'شاهد فيديو قصيرًا واحصل على ' + a + ' إضافية.', bOk: (a) => '🎁 أُضيفت +' + a + '!',
      mT: 'ضاعف حصادك!', mX: (q) => 'شاهد فيديو قصيرًا واحصل على ' + q + ' إضافية.', mOk: (q) => '⛏️ أُضيفت +' + q + ' إلى عملاتك!',
      cO: '📺 +300$ مع فيديو', cOs: 'مرة يوميًا', cOk: '💵 أُضيفت +300$!',
      dB: '📺 نقرات x2 لمدة 30 ث', dBp: '💎 نقرات x2 لمدة 30 ث (بريميوم)', dOn: (s) => '⚡ x2 لمدة ' + s + ' ثانية', dW: (s) => '📺 x2 مجددًا بعد ' + s, dOk: '⚡ نقراتك تُحسب مضاعفة لمدة 30 ثانية!',
      kOk: '🛡️ +200$ لعشيرتك!',
      skip: 'لم يكتمل الفيديو: لا مكافأة هذه المرة.', late: 'فات الأوان.', done: 'تم أخذها اليوم. عد غدًا!', wait: 'ليس بعد: x2 كل 3 دقائق.', rich: 'فقط عندما ينقصك المال.', err: 'حدث خطأ، حاول مرة أخرى.',
    },
  };
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] ? l : 'en'; };
  const L = () => TX[lg()];
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  // 20 oct 2026 (Jeremy): no video available = no reward (it pushes to Premium, and it is rare): the player is told so, once
  const NV = { en: 'No video available, try again later.', fr: 'Pas de vidéo disponible, réessaie plus tard.', es: 'No hay vídeo disponible, inténtalo más tarde.', id: 'Tidak ada video, coba lagi nanti.', ru: 'Нет доступного видео, попробуй позже.', ar: 'لا يوجد فيديو متاح، حاول لاحقًا.', fa: 'ویدیویی در دسترس نیست، بعدا دوباره امتحان کن.' };
  let noneAt = 0;
  const tst = (m) => { if (Date.now() - noneAt < 3000) { noneAt = 0; m = NV[lg()] || NV.en; } try { toast(m); } catch (e) {} };
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
    // 20 oct 2026 (Jeremy): Ads Galaxy down (its site does not answer): after 6 s without the SDK: "no video available"
    setTimeout(() => { if (!window.showAdsGalaxy) { ld = null; ko(new Error('timeout')); } }, 6000);
  }));
  // 'ok' = watched (or Premium), 'skip' = closed before the end, 'none' = no video to show (no reward since 20 oct 2026, Jeremy: it pushes to Premium)
  // 20 oct 2026 (Jeremy): Adsgram first (rewarded block 55185), Ads Galaxy as backup. 'ok' | 'skip' | 'none'
  let agl = null;
  const agSdk = () => agl || (agl = new Promise((ok, ko) => {
    if (window.Adsgram) return ok();
    const s = document.createElement('script'); s.src = 'https://sad.adsgram.ai/js/sad.min.js';
    s.onload = ok; s.onerror = () => { agl = null; ko(new Error('load')); }; document.head.appendChild(s);
    setTimeout(() => { if (!window.Adsgram) { agl = null; ko(new Error('timeout')); } }, 6000);
  }));
  async function agWatch() {
    // 27 oct 2026 (Jeremy): a player watched the whole video and got no reward: a video that was shown now always counts
    try { await agSdk(); await window.Adsgram.init({ blockId: '55242' }).show(); return 'ok'; }
    catch (e) { return (!e || !('done' in Object(e)) || e.state === 'load' || /no ad|no banner/i.test(String(e.description || ''))) ? 'none' : 'ok'; }  // 25 oct 2026 (11h30): 'none' (then Ads Galaxy) only when Adsgram had no video
  }
  async function watch() {
    if (prem()) return 'ok';
    // 25 oct 2026 (3h45, Jeremy): Adsgram first (block 55242), Ads Galaxy (game 135) as backup when Adsgram has no video
    // 26 oct 2026 (18h25, Jeremy): no more Ads Galaxy backup, it played right after the Adsgram video. Adsgram only.
    return await agWatch();
  }
  async function watchN(n, btn) {
    for (let i = 0; i < n; i++) {
      if (i && btn) btn.textContent = L().next;
      const w = await watch(); if (w === 'skip') return false;
      if (w === 'none') { noneAt = Date.now(); window.mctRwNoneAt = noneAt; return false; } // 20 oct 2026 (Jeremy): no video = no reward
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
      if (!(await watchN(1, b))) { close(); return tst(T.skip); }  // 27 oct 2026 (Jeremy): 1 video (the 2nd one in a row was often refused by Adsgram)
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

  // 18 oct 2026 (Jeremy): everything in one recharge window (the game's rchBuy now opens it): the video (+$500, once a day, under $1,000,
  // free for Premium) and ONE Stars pack a day: 10 ⭐ $1,000, 25 ⭐ $3,000, 50 ⭐ $7,000, $10,000 a week at most (10h15, mct_recharge_pack)
  const PACKS = [['s', 10, 1000, 'rD'], ['m', 25, 3000, 'rM'], ['l', 50, 7000, 'rX']];
  const nfmt = (n) => Number(n).toLocaleString(lg() === 'fr' ? 'fr-FR' : 'en-US');
  async function pay(pack, after) {
    let r = null; try { r = await api('recharge', { pack }); } catch (e) {}
    if (!r || !r.link) { hp('err'); try { tst(errMsg(r || {})); } catch (e) { tst(L().err); } return; }
    try {
      tw.openInvoice(r.link, async (st) => {
        if (st !== 'paid') return;
        hp('ok'); await new Promise((ok) => setTimeout(ok, 1800));
        try { await loadMe(); setCash(ME.cash); } catch (e) {}
        if (after) after();
      });
    } catch (e) { tst(L().err); }
  }
  async function rechargeSheet(after) {
    hp(); close();
    const T = L(), [st, ri] = await Promise.all([call('state'), (async () => { try { return await api('rch_info'); } catch (e) { return null; } })()]);
    let cash = 0; try { cash = Number(ME.cash); } catch (e) {}
    const vidOk = !!(st && st.cash), vidWhy = vidOk ? T.rVs : cash >= 1000 ? T.rVr : T.rVd;
    const dayOk = !(ri && Number(ri.next) > Date.now()), left = ri && ri.week_left != null ? Number(ri.week_left) : 1e9;
    const why = (p) => !dayOk ? T.rDw : left <= 0 ? T.rC0 : p[2] > left ? T.rC(nfmt(left)) : T[p[3]];
    const row = (k, e, b, sm, on, tag) => '<button class="cso" data-r="' + k + '"' + (on ? '' : ' disabled style="opacity:.5"') + '><span class="e">' + e + '</span><span class="w"><b>' + ec(b) + '</b><small>' + ec(sm) + '</small></span>'
      + (tag ? '<span class="go" style="font-size:11px;font-weight:800;white-space:nowrap">' + ec(tag) + '</span>' : '<span class="go">›</span>') + '</button>';
    const d = document.createElement('div'); d.id = 'rwm';
    d.style.cssText = 'position:fixed;inset:0;z-index:60;background:rgba(5,3,15,.72);display:flex;align-items:flex-end;justify-content:center';
    d.innerHTML = '<div style="width:100%;max-width:520px;max-height:88vh;overflow:auto;background:var(--night,#140c2c);border:1px solid var(--line,rgba(255,255,255,.12));border-radius:22px 22px 0 0;padding:20px 16px calc(22px + env(safe-area-inset-bottom))">'
      + '<h2 style="margin:0 0 4px;text-align:center">' + ec(T.rT) + '</h2><p class="hint" style="margin:0 0 14px;text-align:center">' + ec(T.rS) + '</p>'
      + row('v', prem() ? '💎' : '📺', (prem() ? T.rVp : T.rV).replace(/^\S+ /, ''), vidWhy, vidOk)
      + PACKS.map((p) => row(p[0], '⭐', T.rP(nfmt(p[2])) + ' · ' + p[1] + ' ⭐', why(p), dayOk && p[2] <= left)).join('')
      + '<button class="ghost" id="rwn" style="width:100%;margin-top:10px">' + ec(T.no) + '</button></div>';
    d.onclick = (ev) => { if (ev.target === d) close(); };
    document.body.appendChild(d);
    d.querySelector('#rwn').onclick = () => { hp(); close(); };
    d.querySelectorAll('[data-r]').forEach((b) => b.onclick = async () => {
      if (b.disabled) return; const k = b.dataset.r; hp();
      if (k === 'v') {
        b.disabled = true; close();
        if (!(await watchN(1))) return tst(T.skip);
        const r = await call('cash');
        if (!r || !r.ok) { hp('err'); return tst(errOf(r)); }
        hp('ok'); setCash(r.cash); try { ME.cash = r.cash; } catch (e) {} tst(T.rOk(nfmt(r.amount))); if (after) after(); return;
      }
      close(); pay(k, after);
    });
  }
  try { window.rchBuy = rechargeSheet; } catch (e) {}
  window.mctRw.recharge = rechargeSheet;

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

  // 18 oct 2026 (Jeremy): anti multi-accounts. Once per opening, a print of the connection (public IP) and of the phone (screen, system,
  // graphics chip, drawing), sent to mct_fp_log (action mon_fp), which keeps only scrambled hashes. Nothing is shown to the player.
  setTimeout(async () => {
    try {
      let ip = '';
      try { const ac = new AbortController(); setTimeout(() => ac.abort(), 4000); ip = ((await (await fetch('https://api.ipify.org?format=json', { signal: ac.signal })).json()) || {}).ip || ''; } catch (e) {}
      let gl = '';
      try { const g = document.createElement('canvas').getContext('webgl'), d = g && g.getExtension('WEBGL_debug_renderer_info'); gl = g ? String(d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER)) : ''; } catch (e) {}
      let cv = '';
      try {
        const c = document.createElement('canvas'); c.width = 220; c.height = 40; const x = c.getContext('2d');
        x.textBaseline = 'top'; x.font = '16px Arial'; x.fillStyle = '#f60'; x.fillRect(0, 0, 110, 22); x.fillStyle = '#069'; x.fillText('Meme Coin Tycoon 🏛️ ✓', 2, 2);
        const u = c.toDataURL(); let h = 0; for (let i = 0; i < u.length; i++) h = (h * 31 + u.charCodeAt(i)) | 0; cv = String(h);
      } catch (e) {}
      const tg = (window.Telegram && window.Telegram.WebApp) || {};
      let tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}
      const fp = [screen.width + 'x' + screen.height, window.devicePixelRatio, tz, navigator.platform, navigator.hardwareConcurrency, navigator.deviceMemory, (navigator.languages || []).join(','), tg.platform, gl, cv].join('|');
      await tonCall({ action: 'mon_fp', ip, fp, ua: navigator.userAgent });
    } catch (e) {}
  }, 5000);

  // one light loop: the diamond button and the cash sheet appear when their screens are open
  setInterval(() => {
    const a = document.getElementById('darea'); if (a && !document.getElementById('drw')) diaBtn(a); else diaDraw();
  }, 700);
})();
