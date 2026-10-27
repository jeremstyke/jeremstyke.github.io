// 26 oct 2026 (Jeremy): the "Bourse" of Meme Coin Tycoon, owner-only test for now (edge function mct-bourse answers only the testers
// of ds_config 'mct_bs_cfg'). It uses the game's own cash. 18h35: no longer in the Market; it opens from a card at the top of the
// Portfolio ("📈 Invest in the stock market") as a full page, with the real logos of the brands and cryptos. Real prices refreshed every 5 minutes (stocks, gold, oil, crypto), 0.25% fee per order.
// Link with Pass The Baton: every evening at 20:00 (Paris), shares held for at least 20 h pay a dividend in $BATON on Baton.
// 27 oct 2026 (Jeremy): 250 assets (prices from st_assets), search, sector chips, "show more", and a weekly ranking of the Bourse:
// the 3 best of the week win 100,000 / 50,000 / 25,000 $BATON on Pass The Baton (mct_bs_week_award, Sunday 23:55 Paris).
// The Portfolio card loads only the player's shares ('mine'); the curve of an asset is loaded when its sheet opens ('spark').
(() => {
  // 26 oct 2026 (19h11, Jeremy): open to every player (no more testers list; the server switch is ds_config 'mct_bs_cfg'.open)
  const tw = window.Telegram && Telegram.WebApp;
  const FN = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/mct-bourse';
  const BATON = 'https://t.me/PassTheBatonBot/play?startapp=src_mctbs';
  const lg = () => { let l = 'en'; try { l = LANG; } catch (e) {} return TX[l] ? l : 'en'; };  // 26 oct 2026 (19h22): the 6 languages of the game
  const TX = {
    fr: {
      note: 'Les vrais cours, mis à jour toutes les 5 min · frais 0,25 % par ordre',
      divH: '🏃 Tes actions rapportent des $BATON', divS: (p, c) => 'Chaque soir à 20h : 1 $BATON par ' + p + ' $ d’actions gardées au moins 20 h (max ' + c + ' par jour), versés sur Pass The Baton.',
      divT: (n) => 'Ce soir : +' + n + ' $BATON', divT0: 'Achète une action pour toucher ton premier dividende', divW: (n) => 'Demain : +' + n + ' $BATON', divL: (n) => 'Déjà reçus : ' + n + ' $BATON', divB: 'Ouvrir Baton',
      mine: 'Mes actions', all: 'Tous les actifs', kind: { stock: 'Action', crypto: 'Crypto', mat: 'Matière première' }, closed: 'fermé',
      buy: 'Acheter', sell: 'Vendre', sellAll: 'Tout vendre', max: 'Max', amount: 'Montant en $', cash: 'Ton cash', have: 'Tu possèdes', pl: 'Plus-value',
      bought: (q, n) => '✅ Acheté : ' + q + ' ' + n, sold: (a) => '✅ Vendu : +' + a,
      pfH: '📈 Investir en bourse', pfE: '250 actions : Apple, Tesla, Nvidia, l’or… aux vrais cours, avec ton cash du jeu. 🏆 Top 3 de la semaine : des $BATON.', pfB: 'Investir', title: '📈 Bourse', tot: 'Tes actions', back: '← Portefeuille', pfV: (v, g) => 'Valeur : ' + v + ' · ' + g,
      err: { cash: 'Pas assez de cash', stale: 'Cours trop ancien, réessaie dans un instant', none: 'Tu n’en as pas', small: 'Montant trop petit', soon: 'Bientôt disponible', x: 'Problème de connexion, réessaie' },
    },
    en: {
      note: 'Real prices, updated every 5 min · 0.25% fee per order',
      divH: '🏃 Your shares earn $BATON', divS: (p, c) => 'Every evening at 20:00 (Paris): 1 $BATON per $' + p + ' of shares held for at least 20 h (max ' + c + ' a day), paid on Pass The Baton.',
      divT: (n) => 'Tonight: +' + n + ' $BATON', divT0: 'Buy a share to get your first dividend', divW: (n) => 'Tomorrow: +' + n + ' $BATON', divL: (n) => 'Received so far: ' + n + ' $BATON', divB: 'Open Baton',
      mine: 'My shares', all: 'All assets', kind: { stock: 'Stock', crypto: 'Crypto', mat: 'Commodity' }, closed: 'closed',
      buy: 'Buy', sell: 'Sell', sellAll: 'Sell all', max: 'Max', amount: 'Amount in $', cash: 'Your cash', have: 'You own', pl: 'Gain',
      bought: (q, n) => '✅ Bought: ' + q + ' ' + n, sold: (a) => '✅ Sold: +' + a,
      pfH: '📈 Invest in the stock market', pfE: '250 stocks: Apple, Tesla, Nvidia, gold… at real prices, with your game cash. 🏆 Top 3 of the week: $BATON.', pfB: 'Invest', title: '📈 Stock market', tot: 'Your shares', back: '← Portfolio', pfV: (v, g) => 'Value: ' + v + ' · ' + g,
      err: { cash: 'Not enough cash', stale: 'Price too old, try again in a moment', none: 'You do not own any', small: 'Amount too small', soon: 'Coming soon', x: 'Connection problem, try again' },
    },
    ru: {
      note: 'Реальные котировки, обновление каждые 5 мин · комиссия 0,25% за сделку',
      divH: '🏃 Твои акции приносят $BATON', divS: (p, c) => 'Каждый вечер в 20:00 (Париж): 1 $BATON за каждые $' + p + ' в акциях, которые ты держишь не меньше 20 ч (макс. ' + c + ' в день), на Pass The Baton.',
      divT: (n) => 'Сегодня вечером: +' + n + ' $BATON', divT0: 'Купи акцию, чтобы получить первый дивиденд', divW: (n) => 'Завтра: +' + n + ' $BATON', divL: (n) => 'Уже получено: ' + n + ' $BATON', divB: 'Открыть Baton',
      mine: 'Мои акции', all: 'Все активы', kind: { stock: 'Акция', crypto: 'Крипто', mat: 'Сырьё' }, closed: 'закрыто',
      buy: 'Купить', sell: 'Продать', sellAll: 'Продать всё', max: 'Макс', amount: 'Сумма в $', cash: 'Твои деньги', have: 'У тебя', pl: 'Прибыль',
      bought: (q, n) => '✅ Куплено: ' + q + ' ' + n, sold: (a) => '✅ Продано: +' + a,
      pfH: '📈 Инвестировать на бирже', pfE: '250 акций: Apple, Tesla, Nvidia, золото… по реальным ценам, на игровые деньги. 🏆 Топ-3 недели: $BATON.', pfB: 'Инвестировать', title: '📈 Биржа', tot: 'Твои акции', back: '← Портфель', pfV: (v, g) => 'Стоимость: ' + v + ' · ' + g,
      err: { cash: 'Не хватает денег', stale: 'Цена устарела, попробуй через минуту', none: 'У тебя их нет', small: 'Слишком маленькая сумма', soon: 'Скоро', x: 'Проблема с соединением, попробуй ещё раз' },
    },
    ar: {
      note: 'أسعار حقيقية، تُحدَّث كل 5 دقائق · رسوم 0.25% على كل أمر',
      divH: '🏃 أسهمك تكسب $BATON', divS: (p, c) => 'كل مساء الساعة 20:00 (باريس): 1 $BATON لكل $' + p + ' من الأسهم المحتفظ بها 20 ساعة على الأقل (حد أقصى ' + c + ' يوميًا)، على Pass The Baton.',
      divT: (n) => 'الليلة: +' + n + ' $BATON', divT0: 'اشترِ سهمًا لتحصل على أول توزيع أرباح', divW: (n) => 'غدًا: +' + n + ' $BATON', divL: (n) => 'استلمت حتى الآن: ' + n + ' $BATON', divB: 'افتح Baton',
      mine: 'أسهمي', all: 'كل الأصول', kind: { stock: 'سهم', crypto: 'عملة رقمية', mat: 'سلعة' }, closed: 'مغلق',
      buy: 'شراء', sell: 'بيع', sellAll: 'بيع الكل', max: 'الكل', amount: 'المبلغ بالدولار', cash: 'رصيدك', have: 'تملك', pl: 'الربح',
      bought: (q, n) => '✅ تم الشراء: ' + q + ' ' + n, sold: (a) => '✅ تم البيع: +' + a,
      pfH: '📈 استثمر في البورصة', pfE: '250 سهمًا: Apple وTesla وNvidia والذهب… بأسعار حقيقية، برصيدك في اللعبة. 🏆 أفضل 3 في الأسبوع: $BATON.', pfB: 'استثمر', title: '📈 البورصة', tot: 'أسهمك', back: '→ المحفظة', pfV: (v, g) => 'القيمة: ' + v + ' · ' + g,
      err: { cash: 'رصيدك غير كافٍ', stale: 'السعر قديم، حاول بعد لحظة', none: 'لا تملك منه شيئًا', small: 'المبلغ صغير جدًا', soon: 'قريبًا', x: 'مشكلة في الاتصال، حاول مجددًا' },
    },
    fa: {
      note: 'قیمت‌های واقعی، به‌روزرسانی هر ۵ دقیقه · کارمزد ۰٫۲۵٪ برای هر سفارش',
      divH: '🏃 سهام تو $BATON می‌سازد', divS: (p, c) => 'هر شب ساعت ۲۰:۰۰ (پاریس): ۱ $BATON به ازای هر ' + p + ' دلار سهامی که حداقل ۲۰ ساعت نگه داشته‌ای (حداکثر ' + c + ' در روز)، در Pass The Baton.',
      divT: (n) => 'امشب: +' + n + ' $BATON', divT0: 'یک سهم بخر تا اولین سود را بگیری', divW: (n) => 'فردا: +' + n + ' $BATON', divL: (n) => 'دریافت‌شده تا حالا: ' + n + ' $BATON', divB: 'باز کردن Baton',
      mine: 'سهام من', all: 'همه دارایی‌ها', kind: { stock: 'سهم', crypto: 'رمزارز', mat: 'کالا' }, closed: 'بسته',
      buy: 'خرید', sell: 'فروش', sellAll: 'فروش همه', max: 'همه', amount: 'مبلغ به دلار', cash: 'پول تو', have: 'داری', pl: 'سود',
      bought: (q, n) => '✅ خریده شد: ' + q + ' ' + n, sold: (a) => '✅ فروخته شد: +' + a,
      pfH: '📈 سرمایه‌گذاری در بورس', pfE: '۲۵۰ سهم: Apple، Tesla، Nvidia، طلا… با قیمت واقعی، با پول بازی. 🏆 ۳ نفر برتر هفته: $BATON.', pfB: 'سرمایه‌گذاری', title: '📈 بورس', tot: 'سهام تو', back: '→ پرتفوی', pfV: (v, g) => 'ارزش: ' + v + ' · ' + g,
      err: { cash: 'پول کافی نداری', stale: 'قیمت قدیمی است، کمی بعد دوباره امتحان کن', none: 'از این سهم نداری', small: 'مبلغ خیلی کم است', soon: 'به‌زودی', x: 'مشکل اتصال، دوباره امتحان کن' },
    },
    id: {
      note: 'Harga asli, diperbarui setiap 5 menit · biaya 0,25% per order',
      divH: '🏃 Sahammu menghasilkan $BATON', divS: (p, c) => 'Setiap malam pukul 20:00 (Paris): 1 $BATON per $' + p + ' saham yang kamu simpan minimal 20 jam (maks ' + c + ' per hari), di Pass The Baton.',
      divT: (n) => 'Malam ini: +' + n + ' $BATON', divT0: 'Beli saham untuk dapat dividen pertamamu', divW: (n) => 'Besok: +' + n + ' $BATON', divL: (n) => 'Sudah diterima: ' + n + ' $BATON', divB: 'Buka Baton',
      mine: 'Sahamku', all: 'Semua aset', kind: { stock: 'Saham', crypto: 'Kripto', mat: 'Komoditas' }, closed: 'tutup',
      buy: 'Beli', sell: 'Jual', sellAll: 'Jual semua', max: 'Maks', amount: 'Jumlah dalam $', cash: 'Uangmu', have: 'Kamu punya', pl: 'Untung',
      bought: (q, n) => '✅ Dibeli: ' + q + ' ' + n, sold: (a) => '✅ Dijual: +' + a,
      pfH: '📈 Investasi di bursa saham', pfE: '250 saham: Apple, Tesla, Nvidia, emas… dengan harga asli, pakai uang game-mu. 🏆 Top 3 minggu ini: $BATON.', pfB: 'Investasi', title: '📈 Bursa saham', tot: 'Sahammu', back: '← Portofolio', pfV: (v, g) => 'Nilai: ' + v + ' · ' + g,
      err: { cash: 'Uangmu tidak cukup', stale: 'Harga sudah lama, coba lagi sebentar', none: 'Kamu tidak punya', small: 'Jumlah terlalu kecil', soon: 'Segera hadir', x: 'Masalah koneksi, coba lagi' },
    },
  };
  const L = () => TX[lg()];

  // 27 oct 2026: the texts of the search, the sectors and the weekly ranking
  const TX2 = {
    fr: { tMk: '📈 Marché', tRk: '🏆 Classement', search: 'Chercher une entreprise ou un code…', all2: 'Tout', gain: '📈 En hausse', lose: '📉 En baisse', more: (n) => 'Voir plus (' + n + ')', none: 'Rien trouvé.',
      S: { tech: '💻 Tech', finance: '🏦 Finance', health: '💊 Santé', consumer: '🛍️ Conso', energy: '⚡ Énergie', industry: '🏭 Industrie', auto: '🚗 Auto', media: '🎬 Médias', crypto: '🪙 Crypto', intl: '🌍 Monde', etf: '📊 ETF', mat: '🥇 Matières' },
      prize: (a, b, c, t) => '🏆 Chaque semaine, les 3 meilleurs investisseurs gagnent <b>' + a + '</b>, <b>' + b + '</b> et <b>' + c + ' $BATON</b> sur Pass The Baton. Fin dans ' + t + '.',
      rule: (n, m) => 'Classement au % gagné sur tes actions cette semaine. Pour y entrer : ' + n + ' ordres cette semaine et ' + m + ' investis.',
      rMe: (r, p) => 'Toi : #' + r + ' (' + p + ')', rNot: (k, n) => 'Tes ordres cette semaine : ' + k + '/' + n, rNone: 'Personne pour l’instant : passe 3 ordres pour entrer au classement !', d: 'j', prize2: (a, b) => '4e au 10e : <b>' + a + '</b> chacun · tous les autres classés : <b>' + b + ' $BATON</b>.' },
    en: { tMk: '📈 Market', tRk: '🏆 Ranking', search: 'Search a company or a ticker…', all2: 'All', gain: '📈 Gainers', lose: '📉 Losers', more: (n) => 'Show more (' + n + ')', none: 'Nothing found.',
      S: { tech: '💻 Tech', finance: '🏦 Finance', health: '💊 Health', consumer: '🛍️ Consumer', energy: '⚡ Energy', industry: '🏭 Industry', auto: '🚗 Auto', media: '🎬 Media', crypto: '🪙 Crypto', intl: '🌍 World', etf: '📊 ETF', mat: '🥇 Commodities' },
      prize: (a, b, c, t) => '🏆 Every week, the 3 best investors win <b>' + a + '</b>, <b>' + b + '</b> and <b>' + c + ' $BATON</b> on Pass The Baton. Ends in ' + t + '.',
      rule: (n, m) => 'Ranked by the % earned on your shares this week. To enter: ' + n + ' orders this week and ' + m + ' invested.',
      rMe: (r, p) => 'You: #' + r + ' (' + p + ')', rNot: (k, n) => 'Your orders this week: ' + k + '/' + n, rNone: 'Nobody yet: make 3 orders to enter the ranking!', d: 'd', prize2: (a, b) => '4th to 10th: <b>' + a + '</b> each · every other ranked player: <b>' + b + ' $BATON</b>.' },
    ru: { tMk: '📈 Рынок', tRk: '🏆 Рейтинг', search: 'Поиск компании или тикера…', all2: 'Все', gain: '📈 Растут', lose: '📉 Падают', more: (n) => 'Показать ещё (' + n + ')', none: 'Ничего не найдено.',
      S: { tech: '💻 Техно', finance: '🏦 Финансы', health: '💊 Здоровье', consumer: '🛍️ Потребит.', energy: '⚡ Энергия', industry: '🏭 Индустрия', auto: '🚗 Авто', media: '🎬 Медиа', crypto: '🪙 Крипто', intl: '🌍 Мир', etf: '📊 ETF', mat: '🥇 Сырьё' },
      prize: (a, b, c, t) => '🏆 Каждую неделю 3 лучших инвестора получают <b>' + a + '</b>, <b>' + b + '</b> и <b>' + c + ' $BATON</b> в Pass The Baton. Конец через ' + t + '.',
      rule: (n, m) => 'Рейтинг по % прибыли на акциях за неделю. Чтобы попасть: ' + n + ' сделки за неделю и ' + m + ' вложено.',
      rMe: (r, p) => 'Ты: #' + r + ' (' + p + ')', rNot: (k, n) => 'Твои сделки за неделю: ' + k + '/' + n, rNone: 'Пока никого: сделай 3 сделки, чтобы попасть в рейтинг!', d: 'д', prize2: (a, b) => '4-10 места: по <b>' + a + '</b> · все остальные в рейтинге: <b>' + b + ' $BATON</b>.' },
    ar: { tMk: '📈 السوق', tRk: '🏆 الترتيب', search: 'ابحث عن شركة أو رمز…', all2: 'الكل', gain: '📈 الأكثر ارتفاعًا', lose: '📉 الأكثر انخفاضًا', more: (n) => 'عرض المزيد (' + n + ')', none: 'لا نتائج.',
      S: { tech: '💻 تقنية', finance: '🏦 مالية', health: '💊 صحة', consumer: '🛍️ استهلاك', energy: '⚡ طاقة', industry: '🏭 صناعة', auto: '🚗 سيارات', media: '🎬 إعلام', crypto: '🪙 كريبتو', intl: '🌍 العالم', etf: '📊 صناديق', mat: '🥇 سلع' },
      prize: (a, b, c, t) => '🏆 كل أسبوع يفوز أفضل 3 مستثمرين بـ <b>' + a + '</b> و<b>' + b + '</b> و<b>' + c + ' $BATON</b> في Pass The Baton. ينتهي بعد ' + t + '.',
      rule: (n, m) => 'الترتيب حسب نسبة الربح على أسهمك هذا الأسبوع. للدخول: ' + n + ' أوامر هذا الأسبوع و' + m + ' مستثمرة.',
      rMe: (r, p) => 'أنت: #' + r + ' (' + p + ')', rNot: (k, n) => 'أوامرك هذا الأسبوع: ' + k + '/' + n, rNone: 'لا أحد بعد: نفّذ 3 أوامر لدخول الترتيب!', d: 'ي', prize2: (a, b) => 'من الرابع إلى العاشر: <b>' + a + '</b> لكل واحد · كل المصنّفين الآخرين: <b>' + b + ' $BATON</b>.' },
    fa: { tMk: '📈 بازار', tRk: '🏆 رتبه‌بندی', search: 'جستجوی شرکت یا نماد…', all2: 'همه', gain: '📈 در حال رشد', lose: '📉 در حال افت', more: (n) => 'بیشتر (' + n + ')', none: 'چیزی پیدا نشد.',
      S: { tech: '💻 فناوری', finance: '🏦 مالی', health: '💊 سلامت', consumer: '🛍️ مصرفی', energy: '⚡ انرژی', industry: '🏭 صنعت', auto: '🚗 خودرو', media: '🎬 رسانه', crypto: '🪙 کریپتو', intl: '🌍 جهان', etf: '📊 صندوق', mat: '🥇 کالا' },
      prize: (a, b, c, t) => '🏆 هر هفته ۳ سرمایه‌گذار برتر <b>' + a + '</b>، <b>' + b + '</b> و <b>' + c + ' $BATON</b> در Pass The Baton می‌برند. پایان تا ' + t + '.',
      rule: (n, m) => 'رتبه بر اساس درصد سود سهام تو در این هفته. برای ورود: ' + n + ' سفارش در این هفته و ' + m + ' سرمایه‌گذاری.',
      rMe: (r, p) => 'تو: #' + r + ' (' + p + ')', rNot: (k, n) => 'سفارش‌های این هفته: ' + k + '/' + n, rNone: 'هنوز کسی نیست: ۳ سفارش ثبت کن تا وارد رتبه‌بندی شوی!', d: 'روز', prize2: (a, b) => 'نفر ۴ تا ۱۰: هر کدام <b>' + a + '</b> · بقیه رتبه‌ها: <b>' + b + ' $BATON</b>.' },
    id: { tMk: '📈 Pasar', tRk: '🏆 Peringkat', search: 'Cari perusahaan atau kode…', all2: 'Semua', gain: '📈 Naik', lose: '📉 Turun', more: (n) => 'Lihat lagi (' + n + ')', none: 'Tidak ditemukan.',
      S: { tech: '💻 Teknologi', finance: '🏦 Keuangan', health: '💊 Kesehatan', consumer: '🛍️ Konsumen', energy: '⚡ Energi', industry: '🏭 Industri', auto: '🚗 Otomotif', media: '🎬 Media', crypto: '🪙 Kripto', intl: '🌍 Dunia', etf: '📊 ETF', mat: '🥇 Komoditas' },
      prize: (a, b, c, t) => '🏆 Setiap minggu, 3 investor terbaik memenangkan <b>' + a + '</b>, <b>' + b + '</b> dan <b>' + c + ' $BATON</b> di Pass The Baton. Berakhir dalam ' + t + '.',
      rule: (n, m) => 'Peringkat berdasarkan % untung sahammu minggu ini. Untuk masuk: ' + n + ' order minggu ini dan ' + m + ' diinvestasikan.',
      rMe: (r, p) => 'Kamu: #' + r + ' (' + p + ')', rNot: (k, n) => 'Ordermu minggu ini: ' + k + '/' + n, rNone: 'Belum ada: buat 3 order untuk masuk peringkat!', d: 'h', prize2: (a, b) => 'Peringkat 4 sampai 10: masing-masing <b>' + a + '</b> · semua peserta lain: <b>' + b + ' $BATON</b>.' },
  };
  const L2 = () => TX2[lg()] || TX2.en;
  const SECS = ['tech', 'finance', 'health', 'consumer', 'energy', 'industry', 'auto', 'media', 'crypto', 'intl', 'etf', 'mat'];
  // gold and oil have a translated name (the others are brand names)
  const NM = { GOLD: { fr: 'Or', en: 'Gold', ru: 'Золото', ar: 'الذهب', fa: 'طلا', id: 'Emas' }, OIL: { fr: 'Pétrole', en: 'Oil', ru: 'Нефть', ar: 'النفط', fa: 'نفت', id: 'Minyak' } };
  const nm = (a) => (a && NM[a.sym] && NM[a.sym][lg()]) || (a && a.name) || '';
  const COL = { AAPL: '#c9d1d9', TSLA: '#ff5d5d', BTC: '#f7931a', GOLD: '#ffd43b', NVDA: '#76d13d', ETH: '#8c9eff', OIL: '#b8875a', AMZN: '#ff9f43', MSFT: '#2ee6ff', TON: '#2f9bff', SOL: '#b18cff', SPY: '#4ff0b7' };
  const hp = (k) => { try { haptic(k); } catch (e) {} };
  const tst = (m) => { try { toast(m); } catch (e) {} };
  const ec = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const nf = (n, d) => Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const usd = (n) => { n = Number(n || 0); const s = n < 0 ? '-' : ''; n = Math.abs(n); return s + '$' + nf(n, n >= 1000 ? 0 : 2); };
  const px = (n) => { n = Number(n || 0); return '$' + nf(n, n >= 1000 ? 0 : n >= 1 ? 2 : 4); };
  const qf = (v) => Number(v || 0).toLocaleString('en-US', { maximumSignificantDigits: 5 });
  const pc = (v) => { const n = Number(v || 0); return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'; };
  const kpi = (n) => Number(n || 0).toLocaleString(lg() === 'fr' ? 'fr-FR' : 'en-US');
  async function call(body) {
    try { const r = await fetch(FN, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ initData: tw && tw.initData, ...body }) }); return await r.json(); }
    catch (e) { return { ok: false, error: 'x' }; }
  }
  const cashUp = (c) => { try { setCash(c); } catch (e) {} };
  const DIV_ON = false;  // 26 oct 2026 (18h41, Jeremy): the $BATON dividends are off for now (cron mct_bs_dividends unscheduled)
  let S = null, SEL = null, busy = false, loading = false, lastLoad = 0;
  let MINE = null, mineAt = 0, Q = '', SEC = 'all', SHOWN = 40, TAB = 'mk', RK = null, rkAt = 0;
  const SPK = {};
  const asset = (s) => (S && S.assets || []).find((a) => a.sym === s);
  const pos = (s) => (S && S.pos || []).find((p) => p.sym === s);
  const view = () => { try { return VIEW; } catch (e) { return ''; } };

  const st = document.createElement('style');
  st.textContent = ''
    + '.bsdiv{border:1px solid #4ff0b7;background:linear-gradient(135deg,rgba(79,240,183,.14),rgba(79,240,183,.03));border-radius:16px;padding:12px 14px;margin:0 0 12px;display:flex;flex-direction:column;gap:6px}'
    + '.bsdiv b{font-size:15px}.bsdiv small{color:var(--mute);font-size:12px;line-height:1.35}.bsdiv .bl{display:flex;align-items:center;gap:10px;flex-wrap:wrap}'
    + '.bsdiv .bn{font-weight:800;color:#4ff0b7;flex:1;min-width:140px}.bsdiv .bb{border:0;border-radius:10px;padding:7px 12px;font-weight:800;background:#4ff0b7;color:#0d2a22;cursor:pointer;white-space:nowrap}'
    + '.bsh{margin:14px 2px 4px;font-size:12px;letter-spacing:.8px;text-transform:uppercase;color:var(--mute);font-weight:800}'
    + '.bsk{font-size:10px;font-weight:800;border-radius:6px;padding:1px 5px;margin-left:4px;background:rgba(255,255,255,.12);vertical-align:2px}'
    + '.med.bslg{background:#fff!important;overflow:hidden;padding:5px;box-sizing:border-box}.med.bslg img{width:100%;height:100%;object-fit:contain;display:block}'
    + '#bsx{position:fixed;inset:0;z-index:9990;background:var(--night,#1a0638);overflow-y:auto;-webkit-overflow-scrolling:touch;padding:calc(10px + env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) calc(28px + env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));box-sizing:border-box}'
    + '#bsx .bw{max-width:520px;margin:0 auto}#bsx .bk{background:none;border:0;color:var(--mute);font-weight:800;padding:6px 0;cursor:pointer;font-size:14px}'
    + '#bsx .hero{display:flex;justify-content:space-between;gap:12px;align-items:flex-end;margin:6px 0 14px}#bsx .hero small{color:var(--mute);font-size:12px;display:block}#bsx .hero b{font-size:28px}'
    + '#bst{position:fixed;inset:0;z-index:9995;background:rgba(5,3,15,.78);display:flex;align-items:flex-end;justify-content:center}'
    + '#bst .tb2{width:100%;max-width:520px;max-height:92vh;overflow:auto;background:var(--night,#1a0638);border:1px solid var(--line,rgba(255,255,255,.14));border-radius:22px 22px 0 0;padding:16px 16px calc(20px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:10px;box-sizing:border-box}'
    + '#bst .th{display:flex;align-items:center;gap:10px}#bst .th b{font-size:19px;display:block}#bst .th small{color:var(--mute)}#bst .big{font-size:26px;font-weight:800}'
    + '#bst input{box-sizing:border-box;width:100%;font:inherit;font-size:20px;font-weight:800;padding:10px 12px;border-radius:12px;border:1px solid var(--line,rgba(255,255,255,.2));background:rgba(255,255,255,.06);color:inherit}'
    + '#bst .chips{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}#bst .chips button{border:1px solid var(--line,rgba(255,255,255,.18));background:rgba(255,255,255,.05);color:inherit;border-radius:10px;padding:8px 0;font-weight:800;cursor:pointer}'
    + '#bst .act{display:grid;grid-template-columns:1fr 1fr;gap:8px}#bst .act button{border:0;border-radius:14px;padding:13px;font-weight:800;font-size:16px;cursor:pointer}#bst .buy{background:#4ff0b7;color:#0d2a22}#bst .sel{background:#ff5d8f;color:#2a0710}'
    + '#bsx .bsq{box-sizing:border-box;width:100%;font:inherit;font-size:15px;padding:11px 13px;border-radius:12px;border:1px solid var(--line,rgba(255,255,255,.18));background:rgba(255,255,255,.06);color:inherit;outline:none;margin:4px 0 8px}'
    + '#bsx .bsc{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 0 8px;padding-bottom:2px}#bsx .bsc::-webkit-scrollbar{display:none}'
    + '#bsx .bsc button{flex:0 0 auto;border:1px solid var(--line,rgba(255,255,255,.18));background:rgba(255,255,255,.05);color:inherit;border-radius:99px;padding:6px 11px;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap}'
    + '#bsx .bsc button[aria-pressed="true"]{background:#4ff0b7;color:#0d2a22;border-color:#4ff0b7}'
    + '#bsx .bstab{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:0 0 12px}#bsx .bstab button{border:1px solid var(--line,rgba(255,255,255,.18));background:rgba(255,255,255,.05);color:inherit;border-radius:12px;padding:10px 0;font-weight:800;cursor:pointer}'
    + '#bsx .bstab button[aria-pressed="true"]{background:#4ff0b7;color:#0d2a22;border-color:#4ff0b7}'
    + '#bsx .bsmore{display:block;width:100%;border:1px dashed var(--line,rgba(255,255,255,.25));background:none;color:var(--mute);border-radius:12px;padding:11px;font-weight:800;cursor:pointer;margin-top:4px}'
    + '#bsx .bsprz{border:1px solid rgba(255,212,59,.45);background:linear-gradient(135deg,rgba(255,212,59,.14),rgba(255,212,59,.03));border-radius:14px;padding:11px 13px;font-size:13px;line-height:1.45;margin:0 0 10px}#bsx .bsprz b{color:#ffd43b}'
    + '#bsx .row{box-sizing:border-box;max-width:100%}'
    + '#bsx .bsrk{width:30px;text-align:center;font-weight:800;color:var(--mute);flex:none}#bsx .row.bsme{outline:1px solid #4ff0b7}'
    + '#bst .act button:disabled{opacity:.4}#bst .sm{font-size:12px;color:var(--mute);text-align:center}#bst .x{background:none;border:0;color:inherit;opacity:.8;font-weight:800;padding:6px;cursor:pointer}';
  document.head.appendChild(st);

  function spark(a, up) {
    const p = (a || []).map(Number).filter((x) => x > 0), w = 320, h = 80;
    if (p.length < 2) return '';
    const mn = Math.min(...p), mx = Math.max(...p), r = mx - mn || 1;
    const pts = p.map((v, i) => (i * (w - 2) / (p.length - 1) + 1).toFixed(1) + ',' + (h - 3 - ((v - mn) / r) * (h - 6)).toFixed(1)).join(' ');
    return '<svg width="100%" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true"><polyline fill="none" stroke="' + (up ? '#4ff0b7' : '#ff5d8f') + '" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" points="' + pts + '"/></svg>';
  }
  // the real logo (brand or crypto) on a white disc; the emoji if there is none (gold, oil) or if the image does not load
  const med = (a) => a.logo
    ? '<span class="med bslg"><img src="' + ec(a.logo) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="var p=this.parentNode;p.classList.remove(\'bslg\');p.style.setProperty(\'--c\',\'' + (COL[a.sym] || '#ffd43b') + '\');p.textContent=\'' + ec(a.em) + '\'"></span>'
    : '<span class="med" style="--c:' + (COL[a.sym] || '#ffd43b') + '">' + ec(a.em) + '</span>';

  // ---------- the Bourse page, opened from the Portfolio ----------
  async function load(fresh) {
    if (loading || (!fresh && S && Date.now() - lastLoad < 60000)) return;
    loading = true; const r = await call({ action: 'state' }); loading = false; lastLoad = Date.now();
    if (r && r.ok) { S = r; cashUp(r.cash); if (document.getElementById('bsx')) draw(); } else if (document.getElementById('bsx')) tst(L().err[(r && r.error) || 'x'] || L().err.x);
  }
  let timer = null;
  function open() {
    let x = document.getElementById('bsx');
    if (!x) { x = document.createElement('div'); x.id = 'bsx'; document.body.appendChild(x); }
    if (S) draw(); else x.innerHTML = '<div class="bw"><button class="bk" type="button">' + L().back + '</button><h1>' + L().title + '</h1><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>';
    const bk = x.querySelector('.bk'); if (bk) bk.onclick = close;
    try { tw.BackButton.show(); tw.BackButton.onClick(close); } catch (e) {}
    load(true); loadRank(true);
    clearInterval(timer); timer = setInterval(() => { if (!document.getElementById('bst') && !(document.activeElement && document.activeElement.id === 'bsq')) { load(true); if (TAB === 'rk') loadRank(true); } }, 60000);
  }
  function close() {
    const x = document.getElementById('bsx'); if (x) x.remove(); clearInterval(timer);
    try { tw.BackButton.offClick(close); tw.BackButton.hide(); } catch (e) {}
  }
  function row(a, right) {
    return '<button class="row" data-bsa="' + ec(a.sym) + '">' + med(a) + '<div class="who"><b>' + ec(nm(a)) + (a.live ? '' : '<span class="bsk">' + L().closed + '</span>') + '</b><small>' + right.sub + '</small></div>'
      + '<div class="px num"><b>' + right.top + '</b><span class="chip ' + (right.up ? 'up' : 'down') + '">' + right.chip + '</span></div></button>';
  }
  const secLab = (a) => (a.sec && L2().S[a.sec]) || L().kind[a.kind] || '';
  function filtered() {
    let l = S.assets.slice();
    if (Q) { const q = Q.toLowerCase(); l = l.filter((a) => a.sym.toLowerCase().includes(q) || String(nm(a)).toLowerCase().includes(q)); }
    else if (SEC === 'gain') l.sort((a, b) => Number(b.chg || 0) - Number(a.chg || 0));
    else if (SEC === 'lose') l.sort((a, b) => Number(a.chg || 0) - Number(b.chg || 0));
    else if (SEC !== 'all') l = l.filter((a) => a.sec === SEC);
    return l;
  }
  function drawList() {
    const el = document.getElementById('bsl'); if (!el || !S) return;
    const T2 = L2(), l = filtered(), sh = l.slice(0, SHOWN);
    el.innerHTML = (sh.length ? sh.map((a) => row(a, { sub: ec(a.sym) + ' · ' + ec(secLab(a)), top: px(a.price), up: Number(a.chg) >= 0, chip: pc(a.chg) })).join('') : '<p class="hint">' + T2.none + '</p>')
      + (l.length > SHOWN ? '<button class="bsmore" type="button" id="bsmo">' + T2.more(l.length - SHOWN) + '</button>' : '');
    el.querySelectorAll('[data-bsa]').forEach((b) => b.onclick = () => { hp(); trade(b.dataset.bsa); });
    const mo = document.getElementById('bsmo'); if (mo) mo.onclick = () => { hp(); SHOWN += 40; drawList(); };
  }
  function rankHtml() {
    const T2 = L2(), r = RK;
    if (!r) return '<div class="skel"></div><div class="skel"></div>';
    const pz = r.prizes || [100000, 50000, 25000], left = Math.max(0, Number(r.end || 0) - Date.now() / 1000), dd = Math.floor(left / 86400), hh = Math.floor(left % 86400 / 3600);
    let h = '<div class="bsprz">' + T2.prize(kpi(pz[0]), kpi(pz[1]), kpi(pz[2]), (dd ? dd + ' ' + T2.d + ' ' : '') + hh + ' h') + (pz.length > 3 || r.rest ? '<br>' + T2.prize2(kpi(pz[3] || 10000), kpi(r.rest || 1000)) : '') + '<br><small style="color:var(--mute)">' + T2.rule(r.need || 3, usd(r.min_inv || 100)) + '</small></div>';
    h += '<p class="hint" style="margin:0 0 8px;font-weight:800">' + (r.me ? T2.rMe(r.me.rank, pc(r.me.pct)) : T2.rNot(Math.min(r.mine || 0, r.need || 3), r.need || 3)) + '</p>';
    const top = r.top || [];
    h += top.length ? top.map((x) => '<div class="row' + (x.me ? ' bsme' : '') + '"><span class="bsrk">' + (['🥇', '🥈', '🥉'][x.rank - 1] || x.rank) + '</span><div class="who"><b>' + ec(x.name) + '</b><small>' + (Number(x.gain) >= 0 ? '+' : '') + usd(x.gain) + '</small></div><div class="px num"><span class="chip ' + (Number(x.pct) >= 0 ? 'up' : 'down') + '">' + pc(x.pct) + '</span></div></div>').join('') : '<p class="hint">' + T2.rNone + '</p>';
    return h;
  }
  function draw() {
    const x = document.getElementById('bsx'); if (!x || !S || S.lite) return;
    const T = L(), T2 = L2(), d = S.div || {};
    const tot = S.pos.reduce((m, p) => m + Number(p.value), 0), g = S.pos.reduce((m, p) => m + Number(p.value) - Number(p.cost), 0);
    let h = '<div class="bw"><button class="bk" type="button">' + T.back + '</button><h1>' + T.title + '</h1>'
      + '<div class="hero"><span><small>' + T.tot + '</small><b class="num">' + usd(tot) + '</b>' + (S.pos.length ? ' <span class="chip ' + (g >= 0 ? 'up' : 'down') + '">' + (g >= 0 ? '+' : '') + usd(g) + '</span>' : '') + '</span>'
      + '<span style="text-align:right"><small>' + T.cash + '</small><b class="num" style="font-size:18px">' + usd(S.cash) + '</b></span></div>'
      + '<div class="bstab"><button type="button" data-bstab="mk" aria-pressed="' + (TAB === 'mk') + '">' + T2.tMk + '</button><button type="button" data-bstab="rk" aria-pressed="' + (TAB === 'rk') + '">' + T2.tRk + '</button></div>';
    if (TAB === 'rk') {
      h += rankHtml() + '</div>';
    } else {
      if (DIV_ON && !S.banned) {  // 26 oct 2026 (18h41, Jeremy): no link with Pass The Baton for now (no dividend card)
        const line = Number(d.ready) > 0 ? T.divT(kpi(d.ready)) : Number(d.next) > 0 ? T.divW(kpi(d.next)) : T.divT0;
        h += '<div class="bsdiv"><b>' + T.divH + '</b><small>' + T.divS(d.per || 10, kpi(d.cap || 1000)) + '</small>'
          + '<div class="bl"><span class="bn">' + line + (Number(d.total) > 0 ? '<br><small>' + T.divL(kpi(d.total)) + '</small>' : '') + '</span><button class="bb" type="button" id="bsbt">' + T.divB + '</button></div></div>';
      }
      if (S.pos.length) {
        h += '<div class="bsh">' + T.mine + '</div>' + S.pos.map((p) => {
          const a = asset(p.sym) || { sym: p.sym, name: p.sym, em: '📈' }, pg = Number(p.value) - Number(p.cost);
          return row(a, { sub: qf(p.qty) + ' ' + ec(p.sym), top: usd(p.value), up: pg >= 0, chip: (pg >= 0 ? '+' : '') + usd(pg) });
        }).join('');
      }
      const secs = ['all', 'gain', 'lose'].concat(SECS.filter((k) => S.assets.some((a) => a.sec === k)));
      h += '<div class="bsh">' + T.all + ' · ' + S.assets.length + '</div>'
        + '<input class="bsq" id="bsq" type="search" autocomplete="off" placeholder="' + ec(T2.search) + '" value="' + ec(Q) + '">'
        + '<div class="bsc">' + secs.map((k) => '<button type="button" data-bssec="' + k + '" aria-pressed="' + (!Q && SEC === k) + '">' + (k === 'all' ? T2.all2 : k === 'gain' ? T2.gain : k === 'lose' ? T2.lose : T2.S[k]) + '</button>').join('') + '</div>'
        + '<div id="bsl"></div><p class="hint" style="margin-top:12px">' + T.note + '</p></div>';
    }
    const y = x.scrollTop; x.innerHTML = h; x.scrollTop = y;
    x.querySelector('.bk').onclick = close;
    x.querySelectorAll('.bstab [data-bstab]').forEach((b) => b.onclick = () => { hp(); TAB = b.dataset.bstab; x.scrollTop = 0; draw(); if (TAB === 'rk') loadRank(false); });
    x.querySelectorAll('.row[data-bsa]').forEach((b) => b.onclick = () => { hp(); trade(b.dataset.bsa); });
    x.querySelectorAll('[data-bssec]').forEach((b) => b.onclick = () => { hp(); SEC = b.dataset.bssec; Q = ''; SHOWN = 40; draw(); });
    const q = document.getElementById('bsq');
    if (q) q.oninput = () => { Q = q.value.trim(); SHOWN = 40; x.querySelectorAll('[data-bssec]').forEach((b) => b.setAttribute('aria-pressed', String(!Q && SEC === b.dataset.bssec))); drawList(); };
    drawList();
    const bt = document.getElementById('bsbt');
    if (bt) bt.onclick = () => { hp(); try { tw.openTelegramLink(BATON); } catch (e) { location.href = BATON; } };
  }

  async function loadMine() {
    if (S && Date.now() - lastLoad < 60000) return;
    if (loading || Date.now() - mineAt < 60000) return;
    mineAt = Date.now(); const r = await call({ action: 'mine' });
    if (r && r.ok) { MINE = r; cashUp(r.cash); }
  }
  async function loadRank(fresh) {
    if (!fresh && RK && Date.now() - rkAt < 60000) return;
    rkAt = Date.now(); const r = await call({ action: 'rank' });
    if (r && r.ok) { RK = r; if (TAB === 'rk' && document.getElementById('bsx')) draw(); }
  }
  // ---------- the card at the top of the Portfolio: "📈 Invest in the stock market" ----------
  function pfCard() {
    let c = document.getElementById('bspf');
    if (view() !== 'portfolio') { if (c) c.remove(); return; }
    const v = document.getElementById('view'); if (!v) return;
    loadMine();
    const D = S || MINE;
    const T = L(), tot = D ? D.pos.reduce((a, p) => a + Number(p.value), 0) : 0, g = D ? D.pos.reduce((a, p) => a + Number(p.value) - Number(p.cost), 0) : 0;
    const d = (D && D.div) || {};
    const sub = D && D.pos.length ? T.pfV(usd(tot), '<span style="color:' + (g >= 0 ? '#4ff0b7' : '#ff5d8f') + '">' + (g >= 0 ? '+' : '') + usd(g) + '</span>') + (DIV_ON && Number(d.next) > 0 && !D.banned ? ' · 🏃 +' + kpi(d.ready > 0 ? d.ready : d.next) + ' $BATON' : '') : T.pfE;
    const k = sub + lg();
    const h2 = v.querySelector('h2');  // 26 oct 2026 (18h46, Jeremy): right above "Your coins" (the first section title of the Portfolio)
    if (!h2) return;
    if (!c || !c.isConnected) {
      c = document.createElement('button'); c.id = 'bspf'; c.type = 'button'; c.className = 'bsdiv';
      c.style.cssText = 'width:100%;text-align:left;color:inherit;cursor:pointer;flex-direction:row;align-items:center';
      c.onclick = () => { hp(); open(); };
      c.style.marginTop = '14px';
      h2.insertAdjacentElement('beforebegin', c);
    }
    if (c.dataset.k !== k) { c.dataset.k = k; c.innerHTML = '<span style="flex:1;min-width:0"><b style="display:block">' + T.pfH + '</b><small>' + sub + '</small></span><span class="bb">' + T.pfB + '</span>'; }
  }
  setInterval(pfCard, 1000);

  // 27 oct 2026 (19h36, Jeremy): the Portfolio shows the $BATON won on Meme Coin Tycoon (missions, contests, referrals: server mct_bs_mine 'bt'),
  // with a link to Pass The Baton where they are
  const BTL = {
    en: ['$BATON won: real money in USDT', '🎯 Partner mission +1,000 · 👥 Invited friend +10,000 · 🏆 Weekly contests up to 400,000. They go to Pass The Baton', 'Win $BATON: real money in USDT', '🎯 Partner mission +1,000 · 👥 Invited friend +10,000 · 🏆 Weekly contests up to 400,000. They go to Pass The Baton', 'Open'],
    fr: ['$BATON gagnés : de l\'argent réel en USDT', '🎯 Mission partenaire +1 000 · 👥 Ami invité +10 000 · 🏆 Concours de la semaine jusqu\'à 400 000. Ils arrivent sur Pass The Baton', 'Gagne des $BATON : de l\'argent réel en USDT', '🎯 Mission partenaire +1 000 · 👥 Ami invité +10 000 · 🏆 Concours de la semaine jusqu\'à 400 000. Ils arrivent sur Pass The Baton', 'Ouvrir'],
    ru: ['$BATON выиграно: реальные деньги в USDT', '🎯 Миссия партнёра +1 000 · 👥 Приглашённый друг +10 000 · 🏆 Конкурсы недели до 400 000. Они идут в Pass The Baton', 'Выигрывай $BATON: реальные деньги в USDT', '🎯 Миссия партнёра +1 000 · 👥 Приглашённый друг +10 000 · 🏆 Конкурсы недели до 400 000. Они идут в Pass The Baton', 'Открыть'],
    ar: ['$BATON مربوحة: مال حقيقي بـ USDT', '🎯 مهمة شريك \u200e+1,000 · 👥 صديق مدعو \u200e+10,000 · 🏆 مسابقات الأسبوع حتى 400,000. تذهب إلى Pass The Baton', 'اربح $BATON: مال حقيقي بـ USDT', '🎯 مهمة شريك \u200e+1,000 · 👥 صديق مدعو \u200e+10,000 · 🏆 مسابقات الأسبوع حتى 400,000. تذهب إلى Pass The Baton', 'افتح'],
    fa: ['$BATON برده‌شده: پول واقعی به USDT', '🎯 مأموریت شریک \u200e+1,000 · 👥 دوست دعوت‌شده \u200e+10,000 · 🏆 مسابقه‌های هفته تا 400,000. به Pass The Baton می‌روند', '$BATON ببر: پول واقعی به USDT', '🎯 مأموریت شریک \u200e+1,000 · 👥 دوست دعوت‌شده \u200e+10,000 · 🏆 مسابقه‌های هفته تا 400,000. به Pass The Baton می‌روند', 'باز کن'],
    id: ['$BATON dimenangkan: uang sungguhan dalam USDT', '🎯 Misi partner +1.000 · 👥 Teman diundang +10.000 · 🏆 Kontes mingguan hingga 400.000. Masuk ke Pass The Baton', 'Menangkan $BATON: uang sungguhan dalam USDT', '🎯 Misi partner +1.000 · 👥 Teman diundang +10.000 · 🏆 Kontes mingguan hingga 400.000. Masuk ke Pass The Baton', 'Buka'],
  };
  let BT = null, btAt = 0;
  async function btLoad() {
    if (Date.now() - btAt < 15000) return;  // 27 oct 2026 (21h06): refreshed often, a Task's $BATON show up within seconds
    btAt = Date.now(); const r = await call({ action: 'mine' });
    if (r && r.bt != null) BT = Number(r.bt);
  }
  let btView = '';
  document.addEventListener('visibilitychange', () => { if (!document.hidden) btAt = 0; });
  function btCard() {
    let c = document.getElementById('bsbt');
    if (btView !== view()) { btView = view(); if (btView === 'portfolio') btAt = 0; }  // fresh total each time the Portfolio opens
    if (view() !== 'portfolio') { if (c) c.remove(); return; }
    const v = document.getElementById('view'); if (!v) return;
    btLoad();
    if (BT == null) return;
    const X = BTL[lg()] || BTL.en, k = BT + lg();
    const pf = document.getElementById('bspf'), h2 = v.querySelector('h2');
    if (!pf && !h2) return;
    if (!c || !c.isConnected) {
      c = document.createElement('button'); c.id = 'bsbt'; c.type = 'button'; c.className = 'bsdiv';
      c.style.cssText = 'width:100%;text-align:left;color:inherit;cursor:pointer;flex-direction:row;align-items:center;margin-top:10px;background:linear-gradient(135deg,rgba(47,141,255,.30),rgba(30,90,200,.14));border-color:rgba(80,160,255,.6)';
      c.onclick = () => { hp(); const u = 'https://t.me/PassTheBatonBot/play?startapp=src_mctpf'; try { tw.openTelegramLink(u); } catch (e) { location.href = u; } };
      if (pf) pf.insertAdjacentElement('afterend', c); else h2.insertAdjacentElement('beforebegin', c);
    }
    if (c.dataset.k !== k) {
      c.dataset.k = k;
      c.innerHTML = '<span style="flex:1;min-width:0"><b style="display:block">🏃 ' + (BT > 0 ? kpi(BT) + ' ' + X[0] : X[2]) + '</b><small>' + (BT > 0 ? X[1] : X[3]) + '</small></span><span class="bb">' + X[4] + ' ›</span>';
    }
  }
  setInterval(btCard, 1000);

  // 26 oct 2026 (19h22, Jeremy): a link whose start_param contains "bourse" (t.me/Memecointycoonbot?startapp=src_bourse_...) opens the
  // Bourse page directly, once the game is ready (Portfolio behind it, so the back button lands there)
  (() => {
    let sp = ''; try { sp = String((tw && tw.initDataUnsafe && tw.initDataUnsafe.start_param) || ''); } catch (e) {}
    if (!/bourse/i.test(sp)) return;
    let n = 0; const w = setInterval(() => {
      n++; let ok = false; try { ok = !!document.querySelector('nav.tb') && !!document.getElementById('view') && typeof go === 'function' && ME && ME.uid && VIEW !== 'welcome'; } catch (e) {}  // a brand new player finishes the welcome screen first
      if (ok || n > 60) { clearInterval(w); if (ok) { try { go('portfolio'); } catch (e) {} setTimeout(open, 400); } }
    }, 250);
  })();

  // ---------- buy / sell sheet ----------
  function trade(sym) {
    SEL = sym; let s = document.getElementById('bst'); if (!s) { s = document.createElement('div'); s.id = 'bst'; document.body.appendChild(s); }
    const T = L(), a = asset(sym), p = pos(sym), u = Number(a.chg) >= 0, g = p ? Number(p.value) - Number(p.cost) : 0;
    s.innerHTML = '<div class="tb2"><div class="th">' + med(a) + '<span><b>' + ec(nm(a)) + '</b><small>' + ec(a.sym) + ' · ' + T.kind[a.kind] + (a.live ? '' : ' · ' + T.closed) + '</small></span></div>'
      + '<div><span class="big num">' + px(a.price) + '</span> <span class="chip ' + (u ? 'up' : 'down') + '">' + pc(a.chg) + '</span></div>'
      + '<div id="bssp">' + spark(a.spark || SPK[sym], u) + '</div>'
      + (p ? '<div class="sm" style="text-align:left">' + T.have + ' : <b>' + qf(p.qty) + ' ' + ec(sym) + '</b> = ' + usd(p.value) + ' · ' + T.pl + ' : <b style="color:' + (g >= 0 ? '#4ff0b7' : '#ff5d8f') + '">' + (g >= 0 ? '+' : '') + usd(g) + '</b></div>' : '')
      + '<label class="sm" for="bsamt" style="text-align:left">' + T.amount + ' · ' + T.cash + ' ' + usd(S.cash) + '</label><input id="bsamt" type="number" inputmode="decimal" min="1" step="0.01" placeholder="0">'
      + '<div class="chips"><button type="button" data-p="0.1">10%</button><button type="button" data-p="0.25">25%</button><button type="button" data-p="0.5">50%</button><button type="button" data-p="1">' + T.max + '</button></div>'
      + '<div class="act"><button class="buy" type="button" id="bsb">' + T.buy + '</button><button class="sel" type="button" id="bss"' + (p ? '' : ' disabled') + '>' + T.sell + '</button></div>'
      + (p ? '<button class="x" type="button" id="bsa">' + T.sellAll + ' (' + usd(p.value) + ')</button>' : '')
      + '<p class="sm">' + T.note + '</p></div>';
    if (!a.spark && !SPK[sym]) call({ action: 'spark', sym }).then((r) => { if (r && r.ok && Array.isArray(r.spark)) { SPK[sym] = r.spark; const e = document.getElementById('bssp'); if (e && SEL === sym) e.innerHTML = spark(r.spark, u); } });
    const inp = s.querySelector('#bsamt');
    s.onclick = (e) => { if (e.target === s) s.remove(); };
    s.querySelectorAll('[data-p]').forEach((b) => b.onclick = () => { hp(); inp.value = (Math.floor(Number(S.cash) * Number(b.dataset.p) * 100) / 100).toFixed(2); });
    s.querySelector('#bsb').onclick = () => order('buy', Number(inp.value), inp.value !== '' && Number(inp.value) >= Number(S.cash) - 0.005);
    s.querySelector('#bss').onclick = () => order('sell', Number(inp.value), false);
    const sa = s.querySelector('#bsa'); if (sa) sa.onclick = () => order('sell', 0, true);
  }
  async function order(side, amt, all) {
    if (busy) return; const T = L();
    if (!all && !(amt >= (side === 'buy' ? 1 : 0.01))) { tst(T.err.small); return; }
    busy = true;
    try {
      const r = await call({ action: side, sym: SEL, usd: amt, all: !!all });
      if (r && r.ok) {
        hp('ok'); const a = asset(SEL) || {};
        tst(side === 'buy' ? T.bought(qf(r.done.qty), nm(a) || SEL) : T.sold(usd(r.done.net)));
        const s = document.getElementById('bst'); if (s) s.remove();
        S = r; lastLoad = Date.now(); cashUp(r.cash); RK = null; draw(); loadRank(true);
      } else { hp('err'); tst(T.err[(r && r.error)] || T.err.x); }
    } finally { busy = false; }
  }

  // 27 oct 2026 (Jeremy): mission of the day "Buy a share in the Bourse" (server mct_bonus_missions 'bourse', $1,000 + 10 $MCT):
  // its label in every language, and its GO opens the Bourse page
  try {
    const LL = (0, eval)('typeof L !== "undefined" ? L : null');
    const lb = { en: '📈 Buy a share in the Stock market', fr: '📈 Achète une action en Bourse', ru: '📈 Купи акцию на бирже', ar: '📈 اشترِ سهمًا في البورصة', fa: '📈 یک سهم در بورس بخر', id: '📈 Beli satu saham di bursa', es: '📈 Compra una acción en la Bolsa' };
    if (LL) Object.keys(LL).forEach((k) => { if (LL[k] && typeof LL[k] === 'object') LL[k].m_bourse = lb[k] || lb.en; });
    const GO = (0, eval)('typeof MSN_GO !== "undefined" ? MSN_GO : null');
    if (GO) GO.bourse = () => { try { go('portfolio'); } catch (e) {} setTimeout(open, 300); };
    // 27 oct 2026 (13h43, Jeremy): a friend who really plays also pays +10,000 $BATON on Pass The Baton (server mct_tok_ref): shown on the invite texts
    const RB = { en: ' · +10,000 $BATON per friend', fr: ' · +10 000 $BATON par ami', ru: ' · +10 000 $BATON за друга', ar: ' · ‎+10,000 $BATON لكل صديق', fa: ' · ‎+10,000 $BATON برای هر دوست', id: ' · +10.000 $BATON per teman', es: ' · +10.000 $BATON por amigo' };
    if (LL) Object.keys(LL).forEach((k) => {
      const o = LL[k]; if (!o || typeof o !== 'object' || o._rb) return; o._rb = true; const sx = RB[k] || RB.en;
      if (typeof o.inv_t === 'function') { const f = o.inv_t; o.inv_t = (...a) => f(...a) + sx; }
      ['inv_tile', 'cs_inv_s'].forEach((key) => { if (typeof o[key] === 'string') o[key] += sx; });
    });
  } catch (e) {}
})();
