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
      card: '🛡️ Clans · BETA', cardx: 'Crée ou rejoins un clan : une cagnotte partagée chaque lundi', cardm: (n, p) => n + ' membres · cagnotte ' + p, see: 'Voir', tab: '🛡️ Clans', rkt: '🛡️ Classement des clans · BETA', rks: 'Chaque lundi, les 3 premiers clans (selon la valeur de leur coin) gagnent une récompense versée dans les gains du clan', rkp: ['20 000 $ au clan', '10 000 $ au clan', '5 000 $ au clan'], rkn: 'Aucun clan pour l\'instant : crée le premier !', rkb: '🛡️ Créer ou rejoindre un clan', rkm: (n) => n + '/20 membres',
      t: '🛡️ Clans · BETA', close: 'Fermer', err: 'Problème, réessaie.', load: '⏳',
      how: ['💰 Le coin du clan est créé avec le clan : ses frais (achats et ventes) remplissent la cagnotte.', '👥 +5 000 $ pour le clan par nouveau joueur amené avec le lien du clan (après 3 jours de jeu), +1 000 $ par joueur du jeu qui rejoint.', '🗓️ Chaque lundi, 50 % des gains de la semaine sont partagés à parts égales entre les membres présents depuis 3 jours. Les 50 % restants vont dans la cagnotte du chef.', '🏆 Chaque lundi, les 3 meilleurs clans gagnent dans les gains du clan : 1er 20 000 $ et le badge 🏆, 2e 10 000 $, 3e 5 000 $.'],
      list: 'Clans', none: 'Aucun clan pour l\'instant : crée le premier !', ask: 'Demander', asked: 'Demande envoyée', full: 'Complet', members: (n) => n + '/20',
      create: '➕ Créer un clan · 5 000 $', name: 'Nom du clan (3 à 20 caractères)', ticker: 'Ticker du coin du clan (2 à 8 lettres)', logo: 'Logo et couleur', chainl: '⛓️ Blockchain du coin (elle prend ses frais sur chaque échange)', feel: '💸 Frais créateur du coin (ils remplissent la cagnotte du clan)', go: '🛡️ Créer mon clan',
      week: '🔒 Gagné cette semaine', weekx: (w) => 'Bloqué jusqu\'à lundi (dans ' + w + '). Lundi, 50 % sont partagés entre les membres présents depuis 3 jours et 50 % vont dans la cagnotte du chef.', dd: (d, h) => d ? d + ' j ' + h + ' h' : h + ' h', potx: (n) => 'Se remplit chaque lundi. Prochain versement : environ ' + n + ' lundi', poth: ['💰 Prendre : l\'argent va dans ton cash', '🎁 Donner : à un membre de ton choix', '🔒 Bloquer 7 jours : revient dans la cagnotte avec +10 %', '🔒 Bloquer 30 jours : revient avec +50 %'], pot0: (n) => 'La cagnotte est vide pour l\'instant. Premier versement lundi : environ ' + n + '.', pot: 'Cagnotte du chef', coin: 'Coin du clan', seecoin: 'Voir le coin', rank: (r) => '#' + r + ' des clans',
      mem: 'Membres', chief: '👑 chef', wait3: '⏳ moins de 3 jours', invite: '📤 Inviter avec le lien du clan', invmsg: (n) => '🛡️ Rejoins mon clan ' + n + ' sur Meme Coin Tycoon : on partage les gains chaque lundi !',
      donate: '💝 Donner à la cagnotte', amount: 'Montant en $', leave: 'Quitter le clan', leaveq: 'Sûr ? Tu perds ta part de la semaine.',
      reqs: 'Demandes', accept: 'Accepter', refuse: 'Refuser', newp: 'nouveau joueur', nreq: 'Aucune demande.',
      chiefh: '👑 Gestion de la cagnotte', take: 'Prendre pour moi', give: 'Donner à', lock7: 'Bloquer 7 j (+10 %)', lock30: 'Bloquer 30 j (+50 %)', locks: 'Bloqué', until: 'jusqu\'au', kick: 'Exclure',
      help: '📺 Aider mon clan : +200 $', helpp: '💎 Aider mon clan : +200 $ (Premium)', helps: '1 vidéo par jour = +200 $ dans les gains de la semaine du clan', helpok: '🛡️ +200 $ pour ton clan !', helped: '✅ Clan aidé aujourd\'hui · reviens demain', skip: 'Vidéo pas terminée : pas de récompense cette fois.',
      chh: '⛓️ Blockchain du clan', chx: 'Le clan lance sa propre blockchain : les frais de chaque échange de ses coins (10 % max) vont dans les gains du clan, et la prime de lancement est payée par la cagnotte.', chcost: '⛓️ Créer la blockchain · 3 000 $ de la cagnotte', chname: 'Nom (3 à 20 lettres ou chiffres)', chfee: 'Frais sur chaque échange (10 % max)', chgrant: 'Prime de lancement pour chaque nouveau coin (0 à 10 000 $, payée par la cagnotte)', chgo: '⛓️ Lancer la blockchain du clan', chinfo: (f, g, n, e) => f + ' % de frais · prime ' + g + ' · ' + n + ' coin(s) · gagné ' + e, chfeeb: '💸 Changer les frais', chgrantb: '🎁 Changer la prime', chok: '⛓️ La blockchain du clan est lancée !', chsaved: '✅ Enregistré', chnote: 'Les créateurs choisissent ta blockchain quand ils lancent un coin : des frais bas et une prime attirent plus de coins.',
      lkf: { video: '📺 Vidéos', chain: '⛓️ Frais de la blockchain', fee: '🪙 Frais du coin', donate: '💝 Dons', take: '💰 Pris par le chef', give: '🎁 Donné par le chef', lock: '🔒 Bloqué', unlock: '🔓 Débloqué', week: '🗓️ Partages du lundi', create: '🛡️ Création', join: '👤 Arrivées', new: '🆕 Recrues', top: '🏆 Classement', grant: '🎁 Primes de lancement', chain_new: '⛓️ Blockchain créée' },
      lgf: 'Tout',
      lgb: '📒 Journal du clan', lgt: '📒 Journal du clan', back: '‹ Retour', lgn: 'Rien pour l\'instant.', lgw: '→ gains de la semaine', lgp: '→ cagnotte', lgo: '← cagnotte',
      lk: { video: (w) => '📺 ' + w + ' a regardé une vidéo pour le clan', chain: (n) => '⛓️ Frais de la blockchain du clan (' + n + ' échange' + (n > 1 ? 's' : '') + ')', grant: (w) => '🎁 Prime de lancement payée à ' + w, chain_new: () => '⛓️ Blockchain du clan créée', fee: (n) => '🪙 Frais du coin du clan (' + n + ' échange' + (n > 1 ? 's' : '') + ')', join: (w) => '👤 ' + w + ' a rejoint le clan', new: (w) => '🆕 ' + w + ' recruté avec le lien (3 jours de jeu)', top: () => '🏆 Récompense du classement des clans', donate: (w) => '💝 ' + w + ' a donné à la cagnotte', take: (w) => '💰 ' + w + ' a pris dans la cagnotte', give: (w) => '🎁 Cagnotte donnée à ' + w, lock: () => '🔒 Argent bloqué', unlock: () => '🔓 Argent débloqué avec son bonus', week: () => '🗓️ Partage du lundi', create: (w) => '🛡️ Clan créé par ' + w },
      lgs: (n, s, p) => n + ' membre(s) × ' + s + ', cagnotte +' + p,
      pendn: (n) => n + ' recrue(s) en attente de leurs 3 jours (+5 000 $ chacune)', label: (n) => '🛡️ Coin du clan ' + n, joinbtn: 'Rejoindre', badge: '🏆 Clan de la semaine', closed: '🔒 Fermé', lockb: '🔒 Fermer le clan aux demandes', unlockb: '🔓 Rouvrir le clan aux demandes', lockx: 'Clan fermé : on n\'y entre que sur invitation, avec le lien du clan.',
      e: { cash: 'Pas assez d\'argent.', name: 'Nom invalide (3 à 20 caractères).', name_taken: 'Ce nom est déjà pris.', ticker: 'Ticker invalide (2 à 8 lettres).', taken: 'Ce ticker existe déjà.', in_clan: 'Tu es déjà dans un clan.', full: 'Ce clan est complet.', too_many: 'Tu as déjà 3 demandes en cours.', amount: 'Montant invalide.', fee5: 'Les frais doivent être entre 0,1 % et 10 %.', chain_name: 'Nom invalide (3 à 20 lettres ou chiffres).', chain_taken: 'Ce nom de blockchain est déjà pris.', grant: 'La prime doit être entre 0 et 10 000 $.', has_chain: 'Le clan a déjà sa blockchain.', fee_wait: 'Tu ne peux augmenter les frais qu\'une fois par jour.', done: 'Déjà fait aujourd\'hui. Reviens demain !', pot: 'Pas assez dans la cagnotte. Elle se remplit chaque lundi avec 50 % des gains de la semaine.', closed: 'Ce clan est fermé aux demandes.' },
    },
    fa: {
      card: '🛡️ کلن‌ها · بتا', cardx: 'یک کلن بساز یا عضو شو: صندوقی که هر دوشنبه تقسیم می‌شود', cardm: (n, p) => n + ' عضو · صندوق ' + p, see: 'دیدن', tab: '🛡️ کلن‌ها', rkt: '🛡️ رتبه‌بندی کلن‌ها · بتا', rks: 'هر دوشنبه 3 کلن برتر (بر اساس ارزش کوینشان) جایزه‌ای در درآمد کلن می‌گیرند', rkp: ['20,000 دلار برای کلن', '10,000 دلار برای کلن', '5,000 دلار برای کلن'], rkn: 'هنوز کلنی نیست: اولی را بساز!', rkb: '🛡️ ساخت یا عضویت در کلن', rkm: (n) => n + '/20 عضو',
      t: '🛡️ کلن‌ها · بتا', close: 'بستن', err: 'مشکلی پیش آمد، دوباره امتحان کن.', load: '⏳',
      how: ['💰 کوین کلن با کلن ساخته می‌شود: کارمزدهایش (خرید و فروش) صندوق را پر می‌کند.', '👥 برای هر بازیکن جدیدی که با لینک کلن بیاید (پس از 3 روز بازی) +5,000 دلار برای کلن، و +1,000 دلار برای هر بازیکن بازی که عضو شود.', '🗓️ هر دوشنبه 50% درآمد هفته به‌طور مساوی بین اعضایی که 3 روز حاضر بوده‌اند تقسیم می‌شود. 50% دیگر به صندوق رئیس می‌رود.', '🏆 هر دوشنبه 3 کلن برتر در درآمد کلن می‌برند: اول 20,000 دلار و نشان 🏆، دوم 10,000 دلار، سوم 5,000 دلار.'],
      list: 'کلن‌ها', none: 'هنوز کلنی نیست: اولی را بساز!', ask: 'درخواست عضویت', asked: 'درخواست فرستاده شد', full: 'پر', members: (n) => n + '/20',
      create: '➕ ساخت کلن · 5,000 دلار', name: 'نام کلن (3 تا 20 کاراکتر)', ticker: 'نماد کوین کلن (2 تا 8 حرف)', logo: 'لوگو و رنگ', chainl: '⛓️ بلاکچین کوین (از هر معامله کارمزد می‌گیرد)', feel: '💸 کارمزد سازنده کوین (صندوق کلن را پر می‌کند)', go: '🛡️ ساخت کلن من',
      week: '🔒 درآمد این هفته', weekx: (w) => 'تا دوشنبه قفل است (' + w + ' دیگر). دوشنبه 50% بین اعضایی که 3 روز حاضر بوده‌اند تقسیم می‌شود و 50% به صندوق رئیس می‌رود.', dd: (d, h) => d ? d + ' روز ' + h + ' ساعت' : h + ' ساعت', potx: (n) => 'هر دوشنبه پر می‌شود. پرداخت بعدی: حدود ' + n + ' در دوشنبه', poth: ['💰 برداشت: پول به حساب نقدت می‌رود', '🎁 بخشش: به عضوی که انتخاب کنی', '🔒 قفل 7 روزه: با +10% به صندوق برمی‌گردد', '🔒 قفل 30 روزه: با +50% برمی‌گردد'], pot0: (n) => 'صندوق فعلاً خالی است. اولین پرداخت در دوشنبه: حدود ' + n + '.', pot: 'صندوق رئیس', coin: 'کوین کلن', seecoin: 'دیدن کوین', rank: (r) => '#' + r + ' کلن‌ها',
      mem: 'اعضا', chief: '👑 رئیس', wait3: '⏳ کمتر از 3 روز', invite: '📤 دعوت با لینک کلن', invmsg: (n) => '🛡️ به کلن من ' + n + ' در Meme Coin Tycoon بپیوند: هر دوشنبه درآمد را تقسیم می‌کنیم!',
      donate: '💝 کمک به صندوق', amount: 'مبلغ به دلار', leave: 'ترک کلن', leaveq: 'مطمئنی؟ سهم این هفته‌ات را از دست می‌دهی.',
      reqs: 'درخواست‌ها', accept: 'قبول', refuse: 'رد', newp: 'بازیکن جدید', nreq: 'درخواستی نیست.',
      chiefh: '👑 مدیریت صندوق', take: 'برداشت برای من', give: 'بخشش به', lock7: 'قفل 7 روز (+10%)', lock30: 'قفل 30 روز (+50%)', locks: 'قفل‌شده', until: 'تا', kick: 'اخراج',
      help: '📺 کمک به کلنم: +200 دلار', helpp: '💎 کمک به کلنم: +200 دلار (پریمیوم)', helps: 'روزی 1 ویدیو = +200 دلار در درآمد هفته کلن', helpok: '🛡️ +200 دلار برای کلنت!', helped: '✅ امروز به کلن کمک کردی · فردا برگرد', skip: 'ویدیو تمام نشد: این بار جایزه‌ای نیست.',
      chh: '⛓️ بلاکچین کلن', chx: 'کلن بلاکچین خودش را راه می‌اندازد: کارمزد هر معامله کوین‌هایش (حداکثر 10%) به درآمد کلن می‌رود و کمک راه‌اندازی از صندوق پرداخت می‌شود.', chcost: '⛓️ ساخت بلاکچین · 3,000 دلار از صندوق', chname: 'نام (3 تا 20 حرف یا عدد)', chfee: 'کارمزد هر معامله (حداکثر 10%)', chgrant: 'کمک راه‌اندازی برای هر کوین جدید (0 تا 10,000 دلار، از صندوق)', chgo: '⛓️ راه‌اندازی بلاکچین کلن', chinfo: (f, g, n, e) => f + '% کارمزد · کمک ' + g + ' · ' + n + ' کوین · درآمد ' + e, chfeeb: '💸 تغییر کارمزد', chgrantb: '🎁 تغییر کمک', chok: '⛓️ بلاکچین کلن فعال شد!', chsaved: '✅ ذخیره شد', chnote: 'سازندگان هنگام ساخت کوین بلاکچین را انتخاب می‌کنند: کارمزد کم و کمک، کوین بیشتری جذب می‌کند.',
      lkf: { video: '📺 ویدیوها', chain: '⛓️ کارمزد بلاکچین', fee: '🪙 کارمزد کوین', donate: '💝 کمک‌ها', take: '💰 برداشت رئیس', give: '🎁 بخشش رئیس', lock: '🔒 قفل‌شده', unlock: '🔓 آزادشده', week: '🗓️ تقسیم دوشنبه', create: '🛡️ ساخت', join: '👤 ورودها', new: '🆕 جذب‌شده‌ها', top: '🏆 رتبه‌بندی', grant: '🎁 کمک‌های راه‌اندازی', chain_new: '⛓️ ساخت بلاکچین' },
      lgf: 'همه',
      lgb: '📒 دفتر کلن', lgt: '📒 دفتر کلن', back: '› بازگشت', lgn: 'هنوز چیزی نیست.', lgw: '← درآمد هفته', lgp: '← صندوق', lgo: '→ صندوق',
      lk: { video: (w) => '📺 ' + w + ' برای کلن ویدیو دید', chain: (n) => '⛓️ کارمزد بلاکچین کلن (' + n + ' معامله)', grant: (w) => '🎁 کمک راه‌اندازی به ' + w + ' پرداخت شد', chain_new: () => '⛓️ بلاکچین کلن ساخته شد', fee: (n) => '🪙 کارمزد کوین کلن (' + n + ' معامله)', join: (w) => '👤 ' + w + ' به کلن پیوست', new: (w) => '🆕 ' + w + ' با لینک جذب شد (3 روز بازی)', top: () => '🏆 جایزه رتبه‌بندی کلن', donate: (w) => '💝 ' + w + ' به صندوق کمک کرد', take: (w) => '💰 ' + w + ' از صندوق برداشت', give: (w) => '🎁 صندوق به ' + w + ' بخشیده شد', lock: () => '🔒 پول قفل شد', unlock: () => '🔓 پول با جایزه‌اش آزاد شد', week: () => '🗓️ تقسیم دوشنبه', create: (w) => '🛡️ کلن توسط ' + w + ' ساخته شد' },
      lgs: (n, s, p) => n + ' عضو × ' + s + '، صندوق +' + p,
      pendn: (n) => n + ' جذب‌شده منتظر 3 روزشان (هر کدام +5,000 دلار)', label: (n) => '🛡️ کوین کلن ' + n, joinbtn: 'عضویت', badge: '🏆 کلن هفته', closed: '🔒 بسته', lockb: '🔒 بستن کلن به روی درخواست‌ها', unlockb: '🔓 باز کردن دوباره کلن به روی درخواست‌ها', lockx: 'کلن بسته: فقط با دعوت و لینک کلن.',
      e: { cash: 'پول کافی نیست.', name: 'نام نامعتبر (3 تا 20 کاراکتر).', name_taken: 'این نام گرفته شده.', ticker: 'نماد نامعتبر (2 تا 8 حرف).', taken: 'این نماد از قبل وجود دارد.', in_clan: 'تو از قبل در یک کلن هستی.', full: 'این کلن پر است.', too_many: 'از قبل 3 درخواست در انتظار داری.', amount: 'مبلغ نامعتبر.', fee5: 'کارمزد باید بین 0.1% و 10% باشد.', chain_name: 'نام نامعتبر (3 تا 20 حرف یا عدد).', chain_taken: 'این نام بلاکچین گرفته شده.', grant: 'کمک باید بین 0 و 10,000 دلار باشد.', has_chain: 'کلن از قبل بلاکچین دارد.', fee_wait: 'روزی یک بار می‌توانی کارمزد را بالا ببری.', done: 'امروز انجام شده. فردا برگرد!', pot: 'صندوق کافی نیست. هر دوشنبه با 50% درآمد هفته پر می‌شود.', closed: 'این کلن به روی درخواست‌ها بسته است.' },
    },
    ru: {
      card: '🛡️ Кланы · БЕТА', cardx: 'Создай клан или вступи в него: общий фонд делится каждый понедельник', cardm: (n, p) => 'участников: ' + n + ' · фонд ' + p, see: 'Смотреть', tab: '🛡️ Кланы', rkt: '🛡️ Рейтинг кланов · БЕТА', rks: 'Каждый понедельник топ-3 клана (по стоимости их монеты) получают приз в доход клана', rkp: ['$20,000 клану', '$10,000 клану', '$5,000 клану'], rkn: 'Кланов пока нет: создай первый!', rkb: '🛡️ Создать клан или вступить', rkm: (n) => n + '/20 участников',
      t: '🛡️ Кланы · БЕТА', close: 'Закрыть', err: 'Что-то пошло не так, попробуй ещё раз.', load: '⏳',
      how: ['💰 Монета клана создаётся вместе с кланом: её комиссии (покупки и продажи) пополняют фонд.', '👥 +$5,000 клану за каждого нового игрока по ссылке клана (после 3 дней игры), +$1,000 за каждого игрока игры, который вступает.', '🗓️ Каждый понедельник 50% дохода недели делится поровну между участниками, которые были в клане 3 дня. Остальные 50% идут в фонд главы.', '🏆 Каждый понедельник топ-3 клана получают в доход клана: 1-й $20,000 и значок 🏆, 2-й $10,000, 3-й $5,000.'],
      list: 'Кланы', none: 'Кланов пока нет: создай первый!', ask: 'Попроситься', asked: 'Запрос отправлен', full: 'Заполнен', members: (n) => n + '/20',
      create: '➕ Создать клан · $5,000', name: 'Название клана (3-20 символов)', ticker: 'Тикер монеты клана (2-8 букв)', logo: 'Логотип и цвет', chainl: '⛓️ Блокчейн монеты (берёт комиссию с каждой сделки)', feel: '💸 Комиссия создателя монеты (пополняет фонд клана)', go: '🛡️ Создать мой клан',
      week: '🔒 Заработано за неделю', weekx: (w) => 'Заблокировано до понедельника (через ' + w + '). В понедельник 50% делится между участниками, бывшими в клане 3 дня, и 50% идёт в фонд главы.', dd: (d, h) => d ? d + 'д ' + h + 'ч' : h + 'ч', potx: (n) => 'Пополняется каждый понедельник. Следующая выплата: около ' + n + ' в понедельник', poth: ['💰 Забрать: деньги идут тебе', '🎁 Отдать: участнику на выбор', '🔒 Заблокировать на 7 дней: вернётся в фонд с +10%', '🔒 Заблокировать на 30 дней: вернётся с +50%'], pot0: (n) => 'Фонд пока пуст. Первая выплата в понедельник: около ' + n + '.', pot: 'Фонд главы', coin: 'Монета клана', seecoin: 'Смотреть монету', rank: (r) => '#' + r + ' среди кланов',
      mem: 'Участники', chief: '👑 глава', wait3: '⏳ меньше 3 дней', invite: '📤 Пригласить по ссылке клана', invmsg: (n) => '🛡️ Вступай в мой клан ' + n + ' в Meme Coin Tycoon: мы делим доход каждый понедельник!',
      donate: '💝 Внести в фонд', amount: 'Сумма в $', leave: 'Покинуть клан', leaveq: 'Точно? Ты потеряешь свою долю за неделю.',
      reqs: 'Запросы', accept: 'Принять', refuse: 'Отклонить', newp: 'новый игрок', nreq: 'Запросов нет.',
      chiefh: '👑 Управление фондом', take: 'Забрать себе', give: 'Отдать', lock7: 'Блок 7 д (+10%)', lock30: 'Блок 30 д (+50%)', locks: 'Заблокировано', until: 'до', kick: 'Исключить',
      help: '📺 Помочь клану: +$200', helpp: '💎 Помочь клану: +$200 (Премиум)', helps: '1 видео в день = +$200 в доход клана за неделю', helpok: '🛡️ +$200 твоему клану!', helped: '✅ Сегодня ты помог клану · возвращайся завтра', skip: 'Видео не досмотрено: в этот раз без награды.',
      chh: '⛓️ Блокчейн клана', chx: 'Клан запускает свой блокчейн: комиссии с каждой сделки его монет (до 10%) идут в доход клана, а грант на запуск платится из фонда.', chcost: '⛓️ Создать блокчейн · $3,000 из фонда', chname: 'Название (3-20 букв или цифр)', chfee: 'Комиссия с каждой сделки (до 10%)', chgrant: 'Грант на запуск каждой новой монеты ($0-10,000, из фонда)', chgo: '⛓️ Запустить блокчейн клана', chinfo: (f, g, n, e) => f + '% комиссия · грант ' + g + ' · монет: ' + n + ' · заработано ' + e, chfeeb: '💸 Изменить комиссию', chgrantb: '🎁 Изменить грант', chok: '⛓️ Блокчейн клана запущен!', chsaved: '✅ Сохранено', chnote: 'Создатели выбирают блокчейн при запуске монеты: низкие комиссии и грант привлекают больше монет.',
      lkf: { video: '📺 Видео', chain: '⛓️ Комиссии блокчейна', fee: '🪙 Комиссии монеты', donate: '💝 Взносы', take: '💰 Забрал глава', give: '🎁 Отдал глава', lock: '🔒 Заблокировано', unlock: '🔓 Разблокировано', week: '🗓️ Раздел в понедельник', create: '🛡️ Создание', join: '👤 Вступления', new: '🆕 Новобранцы', top: '🏆 Рейтинг', grant: '🎁 Гранты на запуск', chain_new: '⛓️ Блокчейн создан' },
      lgf: 'Все',
      lgb: '📒 Журнал клана', lgt: '📒 Журнал клана', back: '‹ Назад', lgn: 'Пока пусто.', lgw: '→ доход недели', lgp: '→ фонд', lgo: '← фонд',
      lk: { video: (w) => '📺 ' + w + ' посмотрел видео для клана', chain: (n) => '⛓️ Комиссии блокчейна клана (сделок: ' + n + ')', grant: (w) => '🎁 Грант на запуск выплачен ' + w, chain_new: () => '⛓️ Блокчейн клана создан', fee: (n) => '🪙 Комиссии монеты клана (сделок: ' + n + ')', join: (w) => '👤 ' + w + ' вступил в клан', new: (w) => '🆕 ' + w + ' пришёл по ссылке (3 дня игры)', top: () => '🏆 Приз рейтинга кланов', donate: (w) => '💝 ' + w + ' внёс в фонд', take: (w) => '💰 ' + w + ' забрал из фонда', give: (w) => '🎁 Фонд отдан ' + w, lock: () => '🔒 Деньги заблокированы', unlock: () => '🔓 Деньги разблокированы с бонусом', week: () => '🗓️ Раздел в понедельник', create: (w) => '🛡️ Клан создал ' + w },
      lgs: (n, s, p) => 'участников: ' + n + ' × ' + s + ', фонд +' + p,
      pendn: (n) => 'новобранцев ждут 3 дней: ' + n + ' (+$5,000 за каждого)', label: (n) => '🛡️ Монета клана ' + n, joinbtn: 'Вступить', badge: '🏆 Клан недели', closed: '🔒 Закрыт', lockb: '🔒 Закрыть клан для запросов', unlockb: '🔓 Снова открыть клан для запросов', lockx: 'Закрытый клан: только по приглашению, по ссылке клана.',
      e: { cash: 'Недостаточно денег.', name: 'Неверное название (3-20 символов).', name_taken: 'Это название занято.', ticker: 'Неверный тикер (2-8 букв).', taken: 'Такой тикер уже есть.', in_clan: 'Ты уже в клане.', full: 'Этот клан заполнен.', too_many: 'У тебя уже 3 запроса в ожидании.', amount: 'Неверная сумма.', fee5: 'Комиссия должна быть от 0.1% до 10%.', chain_name: 'Неверное название (3-20 букв или цифр).', chain_taken: 'Это название блокчейна занято.', grant: 'Грант должен быть от $0 до $10,000.', has_chain: 'У клана уже есть блокчейн.', fee_wait: 'Повысить комиссию можно раз в день.', done: 'Сегодня уже сделано. Возвращайся завтра!', pot: 'В фонде недостаточно. Он пополняется каждый понедельник на 50% дохода недели.', closed: 'Этот клан закрыт для запросов.' },
    },
    en: {
      card: '🛡️ Clans · BETA', cardx: 'Create or join a clan: a pot shared every Monday', cardm: (n, p) => n + ' members · pot ' + p, see: 'See', tab: '🛡️ Clans', rkt: '🛡️ Clan ranking · BETA', rks: 'Every Monday, the top 3 clans (by value of their coin) win a prize paid into the clan\'s earnings', rkp: ['$20,000 to the clan', '$10,000 to the clan', '$5,000 to the clan'], rkn: 'No clan yet: create the first one!', rkb: '🛡️ Create or join a clan', rkm: (n) => n + '/20 members',
      t: '🛡️ Clans · BETA', close: 'Close', err: 'Something went wrong, try again.', load: '⏳',
      how: ['💰 The clan coin is created with the clan: its fees (buys and sales) fill the pot.', '👥 +$5,000 for the clan per new player brought with the clan link (after 3 days of play), +$1,000 per player of the game who joins.', '🗓️ Every Monday, 50% of the week\'s earnings are shared equally between the members present for 3 days. The other 50% go to the chief\'s pot.', '🏆 Every Monday, the top 3 clans win, in the clan\'s earnings: 1st $20,000 and the 🏆 badge, 2nd $10,000, 3rd $5,000.'],
      list: 'Clans', none: 'No clan yet: create the first one!', ask: 'Ask to join', asked: 'Request sent', full: 'Full', members: (n) => n + '/20',
      create: '➕ Create a clan · $5,000', name: 'Clan name (3 to 20 characters)', ticker: 'Ticker of the clan coin (2 to 8 letters)', logo: 'Logo and color', chainl: '⛓️ Blockchain of the coin (it takes its fee on every trade)', feel: '💸 Creator fee of the coin (it fills the clan pot)', go: '🛡️ Create my clan',
      week: '🔒 Earned this week', weekx: (w) => 'Locked until Monday (in ' + w + '). On Monday, 50% is shared between the members present for 3 days and 50% goes to the chief\'s pot.', dd: (d, h) => d ? d + 'd ' + h + 'h' : h + 'h', potx: (n) => 'Fills every Monday. Next payment: about ' + n + ' on Monday', poth: ['💰 Take: the money goes to your cash', '🎁 Give: to a member of your choice', '🔒 Lock 7 days: comes back to the pot with +10%', '🔒 Lock 30 days: comes back with +50%'], pot0: (n) => 'The pot is empty for now. First payment on Monday: about ' + n + '.', pot: 'Chief\'s pot', coin: 'Clan coin', seecoin: 'See the coin', rank: (r) => '#' + r + ' of the clans',
      mem: 'Members', chief: '👑 chief', wait3: '⏳ less than 3 days', invite: '📤 Invite with the clan link', invmsg: (n) => '🛡️ Join my clan ' + n + ' on Meme Coin Tycoon: we share the earnings every Monday!',
      donate: '💝 Give to the pot', amount: 'Amount in $', leave: 'Leave the clan', leaveq: 'Sure? You lose your share of the week.',
      reqs: 'Requests', accept: 'Accept', refuse: 'Refuse', newp: 'new player', nreq: 'No request.',
      chiefh: '👑 Pot management', take: 'Take for me', give: 'Give to', lock7: 'Lock 7 d (+10%)', lock30: 'Lock 30 d (+50%)', locks: 'Locked', until: 'until', kick: 'Remove',
      help: '📺 Help my clan: +$200', helpp: '💎 Help my clan: +$200 (Premium)', helps: '1 video a day = +$200 in the clan\'s earnings of the week', helpok: '🛡️ +$200 for your clan!', helped: '✅ Clan helped today · come back tomorrow', skip: 'The video was not finished: no reward this time.',
      chh: '⛓️ Clan blockchain', chx: 'The clan launches its own blockchain: the fees of every trade of its coins (10% max) go to the clan\'s earnings, and the launch grant is paid from the pot.', chcost: '⛓️ Create the blockchain · $3,000 from the pot', chname: 'Name (3 to 20 letters or digits)', chfee: 'Fee on every trade (10% max)', chgrant: 'Launch grant for each new coin ($0 to $10,000, paid from the pot)', chgo: '⛓️ Launch the clan blockchain', chinfo: (f, g, n, e) => f + '% fees · grant ' + g + ' · ' + n + ' coin(s) · earned ' + e, chfeeb: '💸 Change the fee', chgrantb: '🎁 Change the grant', chok: '⛓️ The clan blockchain is live!', chsaved: '✅ Saved', chnote: 'Creators pick your blockchain when they launch a coin: low fees and a grant attract more coins.',
      lkf: { video: '📺 Videos', chain: '⛓️ Blockchain fees', fee: '🪙 Coin fees', donate: '💝 Gifts', take: '💰 Taken by the chief', give: '🎁 Given by the chief', lock: '🔒 Locked', unlock: '🔓 Unlocked', week: '🗓️ Monday splits', create: '🛡️ Creation', join: '👤 Arrivals', new: '🆕 Recruits', top: '🏆 Ranking', grant: '🎁 Launch grants', chain_new: '⛓️ Blockchain created' },
      lgf: 'All',
      lgb: '📒 Clan log', lgt: '📒 Clan log', back: '‹ Back', lgn: 'Nothing yet.', lgw: '→ earnings of the week', lgp: '→ pot', lgo: '← pot',
      lk: { video: (w) => '📺 ' + w + ' watched a video for the clan', chain: (n) => '⛓️ Fees of the clan blockchain (' + n + ' trade' + (n > 1 ? 's' : '') + ')', grant: (w) => '🎁 Launch grant paid to ' + w, chain_new: () => '⛓️ Clan blockchain created', fee: (n) => '🪙 Fees of the clan coin (' + n + ' trade' + (n > 1 ? 's' : '') + ')', join: (w) => '👤 ' + w + ' joined the clan', new: (w) => '🆕 ' + w + ' recruited with the link (3 days of play)', top: () => '🏆 Clan ranking prize', donate: (w) => '💝 ' + w + ' gave to the pot', take: (w) => '💰 ' + w + ' took from the pot', give: (w) => '🎁 Pot given to ' + w, lock: () => '🔒 Money locked', unlock: () => '🔓 Money unlocked with its bonus', week: () => '🗓️ Monday split', create: (w) => '🛡️ Clan created by ' + w },
      lgs: (n, s, p) => n + ' member(s) × ' + s + ', pot +' + p,
      pendn: (n) => n + ' recruit(s) waiting for their 3 days (+$5,000 each)', label: (n) => '🛡️ Coin of the clan ' + n, joinbtn: 'Join', badge: '🏆 Clan of the week', closed: '🔒 Closed', lockb: '🔒 Close the clan to requests', unlockb: '🔓 Open the clan to requests again', lockx: 'Closed clan: invitation only, with the clan link.',
      e: { cash: 'Not enough money.', name: 'Invalid name (3 to 20 characters).', name_taken: 'This name is taken.', ticker: 'Invalid ticker (2 to 8 letters).', taken: 'This ticker already exists.', in_clan: 'You are already in a clan.', full: 'This clan is full.', too_many: 'You already have 3 pending requests.', amount: 'Invalid amount.', fee5: 'The fee must be between 0.1% and 10%.', chain_name: 'Invalid name (3 to 20 letters or digits).', chain_taken: 'This blockchain name is taken.', grant: 'The grant must be between $0 and $10,000.', has_chain: 'The clan already has its blockchain.', fee_wait: 'You can raise the fee once a day.', done: 'Already done today. Come back tomorrow!', pot: 'Not enough in the pot. It fills every Monday with 50% of the week\'s earnings.', closed: 'This clan is closed to requests.' },
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
  const EMO = ['🛡️', '⚔️', '🏰', '👑', '❤️', '🩷', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💖', '💔', '❤️‍🔥', '💎', '🔥', '⚡', '🚀', '🌙', '☀️', '⭐', '🌈', '💀', '👻', '👽', '🤖', '🎃', '😈', '🤡', '🥷', '🧙', '🧛', '🧟', '🦸', '🐸', '🐶', '🐱', '🦊', '🐺', '🦁', '🐯', '🐻', '🐼', '🐨', '🐮', '🐷', '🐵', '🦍', '🐲', '🐉', '🦄', '🐴', '🦅', '🦉', '🐧', '🦈', '🐬', '🐙', '🦂', '🐍', '🦖', '🐝', '🦋', '🐞', '🌵', '🌴', '🍀', '🌸', '🍄', '🌊', '❄️', '🌋', '🍕', '🍔', '🍩', '🍺', '🍷', '🎮', '🎲', '🎯', '🏆', '⚽', '🏀', '🎸', '🎧', '💰', '💵', '🪙', '📈', '🧠', '👁️', '💣', '🗡️', '🏹', '🔱', '⚓', '🎩', '🕶️', '💍', '🌍', '🛸'];
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
    + '#clm input,#clm .csel{width:100%;box-sizing:border-box;padding:11px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:inherit;font-size:15px;margin:4px 0 10px}#clm .csel option{background:#14161c;color:#fff}'
    + '#clm .cgrid{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 8px}#clm #cfe{max-height:188px;overflow-y:auto;padding:2px}#clm .cgrid button{width:40px;height:40px;border-radius:12px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);font-size:20px;cursor:pointer}'
    + '#clm .cgrid button[aria-pressed=true]{border:2px solid #ffd43b}#clm .big{font-size:24px;font-weight:900;white-space:nowrap;flex:none}#clm ul{margin:6px 0 0;padding-left:18px;font-size:13px;line-height:1.5;opacity:.9}';
  // 17 oct 2026: the game's toast must show above the clan page (it was hidden behind it, so errors were invisible)
  st.textContent += '#toast,.toast{z-index:10001!important}';
  // 18 oct 2026: the Leaders tabs with the Clans tab: they scroll sideways instead of squeezing
  st.textContent += '#view .seg:has([data-clb]){overflow-x:auto;scrollbar-width:none}#view .seg:has([data-clb])::-webkit-scrollbar{display:none}#view .seg:has([data-clb]) button{flex:1 0 auto;padding:8px 11px}';
  document.head.appendChild(st);

  // 18 oct 2026 (Jeremy): the clans are a tab of the Leaders page, next to the other rankings (no big card): the ranking of the
  // clans with the prizes of the top 3 (every Monday)
  let ME = null, CLB = false, CLD = null;
  function card() {
    let lb = false; try { lb = VIEW === 'leaders'; } catch (e) {}
    const v = document.getElementById('view'); if (!lb || !v) { CLB = false; return; }
    const seg = v.querySelector('.seg'); if (!seg) return;
    const T = L();
    let tb = seg.querySelector('[data-clb]');
    if (!tb) {
      tb = document.createElement('button'); tb.type = 'button'; tb.dataset.clb = '1'; tb.textContent = T.tab;
      seg.appendChild(tb);
      tb.onclick = () => { hp(); CLB = true; CLD = null; draw(v, seg); };
      // the other rankings: leave the clans
      seg.querySelectorAll('[data-lb]').forEach((b) => b.addEventListener('click', () => { CLB = false; }, true));
    }
    tb.setAttribute('aria-pressed', String(CLB));
    if (CLB) { seg.querySelectorAll('[data-lb]').forEach((b) => b.setAttribute('aria-pressed', 'false')); if (!v.querySelector('#clrk')) draw(v, seg); }
  }
  async function draw(v, seg) {
    const T = L();
    seg.querySelectorAll('[data-lb]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    const tb = seg.querySelector('[data-clb]'); if (tb) tb.setAttribute('aria-pressed', 'true');
    // everything under the tabs is replaced by the clan ranking
    let n = seg.nextSibling; while (n) { const x = n.nextSibling; n.remove(); n = x; }
    const box = document.createElement('div'); box.id = 'clrk';
    box.innerHTML = '<p class="hint">' + ec(T.rks) + '</p><div class="skel"></div><div class="skel"></div>';
    v.appendChild(box);
    const r = CLD || await call('clanstate'); CLD = r; ME = r;
    if (!CLB || !document.body.contains(box)) return;
    const xs = ((r && r.list) || []).slice(0, 20), med = ['🥇', '🥈', '🥉'];
    box.innerHTML = '<p class="hint">' + ec(T.rks) + '</p>' + (xs.length ? xs.map((c, i) => {
      const mine = r.clan && Number(r.clan.id) === Number(c.id);
      return '<button class="row' + (mine ? ' me' : '') + '" data-cl="' + c.id + '" style="width:100%"><div class="rank">' + (med[i] || i + 1) + '</div>'
        + '<span class="med sm" style="--c:' + ec(c.color || '#4ff0b7') + '">' + ec(c.emoji) + '</span>'
        + '<div class="who"><b>' + ec(c.name) + (c.badge ? ' 🏆' : '') + (c.locked ? ' 🔒' : '') + '</b><small>' + ec(T.rkm(c.n)) + ' · $' + ec(c.ticker || '') + '</small>'
        + (i < 3 ? '<small style="color:var(--gold,#ffd43b);font-weight:800;white-space:normal">🎁 ' + ec(T.rkp[i]) + '</small>' : '') + '</div>'
        + '<div class="px num"><b>' + usd(c.mcap) + '</b></div></button>';
    }).join('') : '<div class="empty"><p class="hint">' + ec(T.rkn) + '</p></div>')
      + '<button class="btn" id="clrkb" style="margin-top:12px">' + ec(r && r.clan ? r.clan.emoji + ' ' + r.clan.name : T.rkb) + '</button>';
    box.querySelectorAll('[data-cl]').forEach((x) => x.onclick = () => { hp(); show(x.dataset.cl); });
    box.querySelector('#clrkb').onclick = () => { hp(); show(); };
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
  let LINK = 0; // the clan of the invite link the game was opened with
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
      + (asked.includes(Number(c.id)) ? '<span style="font-size:12px;opacity:.7">' + ec(T.asked) + '</span>' : c.locked ? '<span style="font-size:12px;opacity:.7">' + ec(T.closed) + '</span>' : Number(c.n) >= 20 ? '<span style="font-size:12px;opacity:.7">' + ec(T.full) + '</span>' : '<button class="cb" data-ask="' + c.id + '">' + ec(T.ask) + '</button>') + '</div>').join('') : '<small style="margin-top:6px">' + ec(T.none) + '</small>') + '</div>';
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
      // 17 oct 2026 (Jeremy): the chief picks the blockchain and the creator fee of the clan coin, like for a normal coin
      + '<small>' + ec(T.chainl) + '</small><select id="cfch" class="csel"><option value="0">⏳</option></select>'
      + '<small>' + ec(T.feel) + '</small><select id="cff" class="csel">' + [2, 1.5, 1, 0.5, 0].map((x) => '<option value="' + x + '">' + String(x).replace('.', L() === TX.fr ? ',' : '.') + ' %</option>').join('') + '</select>'
      + '<button class="btn" id="cfgo" style="width:100%;margin-top:6px">' + ec(T.go) + '</button></div>';
    f.querySelectorAll('[data-e]').forEach((x) => x.onclick = () => { emo = x.dataset.e; f.querySelectorAll('[data-e]').forEach((y) => y.setAttribute('aria-pressed', y === x)); });
    f.querySelectorAll('[data-c]').forEach((x) => x.onclick = () => { col = x.dataset.c; f.querySelectorAll('[data-c]').forEach((y) => y.setAttribute('aria-pressed', y === x)); });
    const nm = f.querySelector('#cfn'), tk = f.querySelector('#cft'), ch = f.querySelector('#cfch'), fe = f.querySelector('#cff');
    try { api('chains').then((r) => { const xs = (r && r.list) || []; if (!xs.length) { ch.innerHTML = '<option value="0">Ethereum</option>'; return; } const d = (xs.find((x) => x.official) || xs[0]).id; ch.innerHTML = xs.map((x) => '<option value="' + x.id + '"' + (x.id === d ? ' selected' : '') + '>' + ec(x.emoji) + ' ' + ec(x.name) + ' · ' + x.fee + ' %' + (Number(x.grant_amt) > 0 ? ' · 🎁 ' + x.grant_amt + ' $' : '') + '</option>').join(''); }).catch(() => {}); } catch (e) {}
    nm.oninput = () => { if (!tk.dataset.t) tk.value = nm.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8); };
    tk.oninput = () => { tk.dataset.t = '1'; };
    f.querySelector('#cfgo').onclick = async (e) => {
      hp('medium'); const btn = e.currentTarget; btn.disabled = true;
      const r = await call('clancreate', { name: nm.value, ticker: tk.value, emoji: emo, color: col, chain: Number(ch.value) || 0, cfee: Number(fe.value) });
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
    // 17 oct 2026 (Jeremy): a closed clan only blocks the requests from the list: a player who comes with the invite link can still ask
    const inv = LINK === id;
    if (!inClan && !c.closed) h += c.locked && !inv ? '<p style="text-align:center;opacity:.8">' + ec(T.lockx) + '</p>' : r.asked ? '<p style="text-align:center;opacity:.8">' + ec(T.asked) + '</p>' : c.n >= 20 ? '<p style="text-align:center;opacity:.8">' + ec(T.full) + '</p>' : '<button class="btn" id="clask" style="width:100%">🛡️ ' + ec(T.ask) + '</button>';
    b.innerHTML = h;
    const sc = b.querySelector('#clsc'); if (sc) sc.onclick = () => { hp(); closeIt(); try { openCoin(c.coin.id); } catch (e) {} };
    const a = b.querySelector('#clask'); if (a) a.onclick = async () => { hp(); a.disabled = true; const q = await call('clanrequest', { id, link: inv }); if (!q || !q.ok) { a.disabled = false; tst(errOf(q)); return; } tst('✅ ' + T.asked); show(id); };
  }

  // 18 oct 2026 (Jeremy): time left until the Monday split (Sunday 23:10 UTC)
  function toMon() { const n = new Date(), t = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate() + ((7 - n.getUTCDay()) % 7), 23, 10)); if (t <= n) t.setUTCDate(t.getUTCDate() + 7); const m = Math.max(0, Math.round((t - n) / 36e5)); return L().dd(Math.floor(m / 24), m % 24); }
  // my clan
  function mine(b, r) {
    const T = L(), c = r.clan, chief = r.role === 'chief';
    let h = '<div class="cc"><div class="ch">' + logo(c) + '<div style="min-width:0;flex:1"><b style="font-size:18px">' + ec(c.name) + '</b><small>' + (c.badge ? ec(T.badge) + ' · ' : '') + ec(T.rank(c.rank)) + ' · ' + ec(T.members(c.n)) + '</small></div></div></div>';
    h += '<div class="cc"><div class="crow"><span>' + ec(T.week) + '<small>' + ec(T.weekx(toMon())) + '</small></span><span class="big">' + usd(c.week) + '</span></div>'
      + '<div class="crow"><span>' + ec(T.pot) + '<small>' + ec(T.potx(usd(Number(c.week || 0) * 0.5))) + '</small></span><span class="big">' + usd(c.treasury) + '</span></div>'
      + (c.coin ? '<div class="crow"><span>' + ec(T.coin) + ' <b>$' + ec(c.coin.ticker) + '</b><small>' + px(c.coin.price) + ' · ' + usd(c.coin.mcap) + '</small></span><button class="cb g" id="clsc">' + ec(T.seecoin) + '</button></div>' : '')
      + ((c.locks || []).length ? (c.locks || []).map((l) => '<div class="crow"><span>🔒 ' + ec(T.locks) + ' ' + usd(l.amount) + ' (+' + l.pct + ' %)</span><small style="display:inline">' + ec(T.until) + ' ' + ec(day(l.until)) + '</small></div>').join('') : '')
      + (Number(c.pending_new) ? '<small style="margin-top:6px">' + ec(T.pendn(c.pending_new)) + '</small>' : '')
      + '<button class="cb g" id="cllog" style="width:100%;margin-top:10px">' + ec(T.lgb) + '</button></div>';
    h += '<button class="btn" id="clinv" style="width:100%;margin:0 0 12px">' + ec(T.invite) + '</button>';
    // 18 oct 2026 (Jeremy): one video a day = +$200 for the clan (rw.js); Premium players do it without the video
    const pr = !!(window.mctRw && window.mctRw.prem());
    // 18 oct 2026: greyed out once used today (c.helped)
    h += '<button class="btn ghost" id="clhelp" style="width:100%;margin:0 0 4px"' + (c.helped ? ' disabled' : '') + '>' + ec(c.helped ? T.helped : pr ? T.helpp : T.help) + '</button><small style="display:block;text-align:center;margin:0 0 12px;opacity:.7">' + ec(T.helps) + '</small>';
    // 18 oct 2026 (Jeremy): the clan blockchain: its fees go to the clan, its launch grant comes from the pot
    if (c.chain) h += '<div class="cc"><b>' + ec(T.chh) + '</b><div class="crow"><span>' + ec(c.chain.emoji) + ' <b>' + ec(c.chain.name) + '</b><small>' + ec(T.chinfo(c.chain.fee, usd(c.chain.grant), c.chain.coins, usd(c.chain.earned))) + '</small></span></div>'
      // 19 oct 2026 (Jeremy): where the clan coin lives, and the chief can move it onto the clan blockchain (free)
      + (c.coin && c.coin.chain ? (c.coin.chain.id === c.chain.id ? '<small style="margin:6px 0;color:#4ff0b7">✅ $' + ec(c.coin.ticker) + ((typeof LANG !== 'undefined' && LANG === 'fr') ? ' est sur cette blockchain : ses frais vont au clan' : ' is on this blockchain: its fees go to the clan') + '</small>'
        : '<small style="margin:6px 0">🪙 $' + ec(c.coin.ticker) + ((typeof LANG !== 'undefined' && LANG === 'fr') ? ' est sur ' : ' is on ') + ec(c.coin.chain.emoji + ' ' + c.coin.chain.name) + '</small>' + (chief ? '<button class="cb" id="chmv" style="width:100%;margin:0 0 6px">' + ec(((typeof LANG !== 'undefined' && LANG === 'fr') ? '⛓️ Déplacer $' : '⛓️ Move $') + c.coin.ticker + ((typeof LANG !== 'undefined' && LANG === 'fr') ? ' sur ' : ' onto ') + c.chain.name + ((typeof LANG !== 'undefined' && LANG === 'fr') ? ' (gratuit)' : ' (free)')) + '</button>' : '')) : '')
      + (chief ? '<small>' + ec(T.chfee) + '</small><select id="chfe" class="csel">' + [0.5, 1, 1.5, 2, 2.5, 3, 4, 5].map((x) => '<option value="' + x + '"' + (Number(c.chain.fee) === x ? ' selected' : '') + '>' + x + ' %</option>').join('') + (([0.5, 1, 1.5, 2, 2.5, 3, 4, 5].indexOf(Number(c.chain.fee)) < 0) ? '<option value="' + c.chain.fee + '" selected>' + c.chain.fee + ' %</option>' : '') + '</select><button class="cb g" id="chfeb">' + ec(T.chfeeb) + '</button>'
        + '<small style="margin-top:8px">' + ec(T.chgrant) + '</small><input id="chgr" type="number" inputmode="numeric" min="0" max="10000" value="' + Number(c.chain.grant || 0) + '"><button class="cb g" id="chgrb">' + ec(T.chgrantb) + '</button>' : '')
      + '<small style="margin-top:8px">' + ec(T.chnote) + '</small></div>';
    else if (chief) h += '<div class="cc"><b>' + ec(T.chh) + '</b><small style="margin:4px 0 8px">' + ec(T.chx) + '</small><button class="cb g" id="chnew" style="width:100%">' + ec(T.chcost) + '</button><div id="chform"></div></div>';
    if (chief) {
      h += '<div class="cc"><b>' + ec(T.reqs) + '</b>' + ((c.requests || []).length ? c.requests.map((q) => '<div class="crow"><span>' + ec(q.name) + (q.new ? ' <small style="display:inline;color:#4ff0b7">' + ec(T.newp) + '</small>' : '') + '</span><span style="display:flex;gap:6px"><button class="cb" data-acc="' + q.uid + '">' + ec(T.accept) + '</button><button class="cb g" data-ref="' + q.uid + '">' + ec(T.refuse) + '</button></span></div>').join('') : '<small style="margin-top:4px">' + ec(T.nreq) + '</small>') + (c.locked ? '<small style="margin-top:6px">' + ec(T.lockx) + '</small>' : '') + '<button class="cb g" id="cllock" style="margin-top:8px">' + ec(c.locked ? T.unlockb : T.lockb) + '</button></div>';
      // 18 oct 2026 (Jeremy): explain what the pot is and what each button does
      h += '<div class="cc"><b>' + ec(T.chiefh) + '</b><ul style="margin:4px 0 8px">' + T.poth.map((x) => '<li>' + ec(x) + '</li>').join('') + '</ul>' + (Number(c.treasury) < 1 ? '<small style="color:#ffd43b;font-weight:700;margin:0 0 8px">' + ec(T.pot0(usd(Number(c.week || 0) * 0.5))) + '</small>' : '') + '<small>' + ec(T.amount) + '</small><input id="clamt" type="number" inputmode="decimal" min="1" placeholder="1000">'
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
    b.querySelector('#cllog').onclick = () => { hp(); journal(b, r); };
    b.querySelector('#clhelp').onclick = async (ev) => {
      const bt = ev.currentTarget; hp(); if (!window.mctRw || bt.disabled || c.helped) return; bt.disabled = true; const t0 = bt.textContent; bt.textContent = '⏳';
      const st = await window.mctRw.call('state'); if (st && st.ok && !st.clan) { c.helped = true; bt.textContent = T.helped; return; }
      const ok = await window.mctRw.watch(1, bt); if (!ok) { bt.disabled = false; bt.textContent = t0; return tst(T.skip); }
      const q = await call('rwclan'); bt.disabled = false; bt.textContent = t0;
      if (!q || !q.ok) { hp('err'); if (q && q.error === 'done') { bt.disabled = true; bt.textContent = T.helped; } return tst(errOf(q)); }
      hp('ok'); tst(T.helpok); bt.disabled = true; bt.textContent = T.helped; show();
    };
    const chn = b.querySelector('#chnew'); if (chn) chn.onclick = () => {
      hp(); chn.remove(); const f = b.querySelector('#chform');
      f.innerHTML = '<small style="margin-top:6px">' + ec(T.chname) + '</small><input id="chnm" maxlength="20" autocomplete="off"><small>' + ec(T.chfee) + '</small><select id="chf0" class="csel">' + [0.5, 1, 1.5, 2, 2.5, 3, 4, 5].map((x) => '<option value="' + x + '"' + (x === 1 ? ' selected' : '') + '>' + x + ' %</option>').join('') + '</select><small>' + ec(T.chgrant) + '</small><input id="chg0" type="number" inputmode="numeric" min="0" max="10000" value="0"><button class="btn" id="chgo" style="width:100%;margin-top:4px">' + ec(T.chgo) + '</button>';
      f.querySelector('#chgo').onclick = async (e) => {
        const bt = e.currentTarget; hp('medium'); bt.disabled = true;
        const q = await call('clanchain', { name: f.querySelector('#chnm').value, fee: Number(f.querySelector('#chf0').value), grant: Number(f.querySelector('#chg0').value || 0) });
        bt.disabled = false; if (!q || !q.ok) { hp('err'); return tst(errOf(q)); }
        hp('ok'); tst(T.chok); show();
      };
    };
    const chmv = b.querySelector('#chmv'); if (chmv) chmv.onclick = async () => { const ok = await act('clancoinchain', {}, chmv); if (ok) tst((typeof LANG !== 'undefined' && LANG === 'fr') ? '⛓️ Coin déplacé sur la blockchain du clan !' : '⛓️ Coin moved to the clan blockchain!'); };
    const chfb = b.querySelector('#chfeb'); if (chfb) chfb.onclick = async () => { const ok = await act('clanchainfee', { fee: Number(b.querySelector('#chfe').value) }, chfb); if (ok) tst(T.chsaved); };
    const chgb = b.querySelector('#chgrb'); if (chgb) chgb.onclick = async () => { const ok = await act('clanchaingrant', { grant: Number(b.querySelector('#chgr').value || 0) }, chgb); if (ok) tst(T.chsaved); };
    const lk = b.querySelector('#cllock'); if (lk) lk.onclick = () => act('clanlockjoin', {}, lk);
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

  // 18 oct 2026 (Jeremy): the money log of the clan: incomes (to the earnings of the week), Monday splits, pot moves
  async function journal(b, st) {
    const T = L(); b.innerHTML = '<button class="cb g" id="clbk">' + ec(T.back) + '</button><div style="text-align:center;padding:30px 0">⏳</div>';
    b.querySelector('#clbk').onclick = () => { hp(); show(); };
    const r = await call('clanledger');
    const rows = (r && r.rows) || [];
    const dst = { fee: T.lgw, join: T.lgw, new: T.lgw, top: T.lgw, video: T.lgw, chain: T.lgw, donate: T.lgp, unlock: T.lgp, take: T.lgo, give: T.lgo, lock: T.lgo, grant: T.lgo, chain_new: T.lgo };
    const when = (d) => { try { return new Date(d).toLocaleString(lg() === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
    const sg = (a) => (a > 0 ? '+' : a < 0 ? '−' : '') + usd(Math.abs(a));
    // 18 oct 2026 (Jeremy): a filter by type
    const lab0 = (k) => T.lkf[k] || k;
    const kinds = [...new Set(rows.map((x) => x.k))];
    const draw = (fk) => {
    b.innerHTML = '<div style="display:flex;align-items:center;gap:10px;margin:0 0 10px"><button class="cb g" id="clbk">' + ec(T.back) + '</button><b style="font-size:16px">' + ec(T.lgt) + '</b></div>'
      + (kinds.length > 1 ? '<select id="clf" class="csel">' + '<option value="">' + ec(T.lgf) + '</option>' + kinds.map((k) => '<option value="' + ec(k) + '"' + (k === fk ? ' selected' : '') + '>' + ec(lab0(k)) + '</option>').join('') + '</select>' : '')
      + '<div class="cc">' + (rows.length ? rows.filter((x) => !fk || x.k === fk).map((x) => {
        const a = Number(x.a || 0), f = T.lk[x.k], lab = f ? f(x.k === 'fee' || x.k === 'chain' ? Number(x.n || 1) : (x.who || '?')) : x.k;
        const sub = x.k === 'week' && x.w ? T.lgs(x.w[0], usd(Number(x.w[1])), usd(Number(x.w[2]))) : (dst[x.k] || '');
        return '<div class="crow"><span style="min-width:0">' + ec(lab) + '<small>' + ec(when(x.at)) + (sub ? ' · ' + ec(sub) : '') + (x.k === 'lock' && x.note ? ' · ' + ec(String(x.note).replace('days', lg() === 'fr' ? 'jours' : 'days')) : '') + '</small></span><b style="white-space:nowrap;color:' + (x.k === 'week' || x.k === 'create' ? 'inherit' : a >= 0 ? '#4ff0b7' : '#ff8a8a') + '">' + (x.k === 'create' ? '' : x.k === 'week' ? usd(a) : sg(a)) + '</b></div>';
      }).join('') : '<small>' + ec(T.lgn) + '</small>') + '</div>';
    b.querySelector('#clbk').onclick = () => { hp(); show(); };
    const sel = b.querySelector('#clf'); if (sel) sel.onchange = () => { hp(); draw(sel.value); };
    };
    draw('');
  }

  // the page of a coin: "Coin of the clan X" when it is a clan coin
  async function coinLabel(el) {
    el.dataset.cl = '1';
    const r = await call('clanofcoin', { coin: Number(el.dataset.id) });
    if (!r || !r.clan || !document.body.contains(el)) return;
    const T = L(), d = document.createElement('div');
    d.style.cssText = 'margin-top:8px';
    d.innerHTML = '<button type="button" style="border:1px solid #4ff0b7;background:rgba(79,240,183,.12);color:#4ff0b7;font-weight:800;font-size:13px;border-radius:999px;padding:6px 14px;cursor:pointer">' + ec(r.clan.emoji) + ' ' + ec(T.label(r.clan.name)) + (r.mine ? '' : r.clan.locked ? ' · 🔒' : ' · ' + ec(T.joinbtn) + ' ›') + '</button>';
    d.querySelector('button').onclick = () => { hp(); show(r.clan.id); };
    el.insertAdjacentElement('beforebegin', d);
  }
  new MutationObserver(() => { document.querySelectorAll('#burnb:not([data-cl])').forEach(coinLabel); }).observe(document.body, { childList: true, subtree: true });

  // 17 oct 2026 (Jeremy, 23h): a 🛡️ button at the top of the game, where the diamond was (the diamond is in the green earnings bar now)
  function topBtn() {
    if (document.getElementById('clantop')) return true;
    const f = document.getElementById('faqtop'); if (!f) return false;
    const b = document.createElement('button'); b.className = 'lng'; b.id = 'clantop'; b.setAttribute('aria-label', 'Clans'); b.textContent = '🛡️';
    b.style.cssText = 'padding:4px 8px;font-size:15px;line-height:1';
    b.onclick = () => { hp(); show(); };
    f.parentNode.insertBefore(b, f); return true;
  }
  if (!topBtn()) { let n = 0; const w = setInterval(() => { if (topBtn() || ++n > 80) clearInterval(w); }, 250); }

  window.mctClans = show;
  // links ?startapp=clan (the clans) and ?startapp=cl_<id> (a clan, to ask to join)
  const sp = String((window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.start_param) || '');
  const m = /^cl_(\d+)$/.exec(sp); if (m) LINK = Number(m[1]);
  if (sp === 'clan' || m) { let n = 0; const w = setInterval(() => { n++; let ok = false; try { ok = !!document.querySelector('nav.tb') && !!document.getElementById('view'); } catch (e) {} if (ok || n > 60) { clearInterval(w); if (ok) setTimeout(() => show(m ? m[1] : undefined), 600); } }, 250); }
})();
// 19 oct 2026 (Jeremy): the names of the new lines of the money journal (clan, creator fee and blockchain fee paid...) and of the
// "name taken" message when a coin is created, added to the texts of the game page.
(() => {
  const N = {
    fa: { led: { cfee_paid: '👤 کارمزد سازنده پرداخت شد', chainfee_paid: '⛓️ کارمزد بلاکچین پرداخت شد', clan: '🛡️ کلن', insure: '🛡️ بیمه ضرر', dividend: '💵 سود $MCT', game: '🎮 مینی‌گیم', recharge: '💵 شارژ' }, err: { name_taken: 'این نام را کوین دیگری گرفته. نام دیگری انتخاب کن.' } }, ru: { led: { cfee_paid: '👤 Комиссия создателя оплачена', chainfee_paid: '⛓️ Комиссия блокчейна оплачена', clan: '🛡️ Клан', insure: '🛡️ Страховка убытка', dividend: '💵 Дивиденд $MCT', game: '🎮 Мини-игра', recharge: '💵 Пополнение' }, err: { name_taken: 'Это название уже занято другой монетой. Выбери другое.' } }, en: { led: { cfee_paid: '👤 Creator fee paid', chainfee_paid: '⛓️ Blockchain fee paid', clan: '🛡️ Clan', insure: '🛡️ Loss insurance', dividend: '💵 $MCT dividend', game: '🎮 Mini-game', recharge: '💵 Recharge' }, err: { name_taken: 'This name is already taken by another coin. Pick another one.' } },
    fr: { led: { cfee_paid: '👤 Frais créateur payés', chainfee_paid: '⛓️ Frais de blockchain payés', clan: '🛡️ Clan', insure: '🛡️ Assurance perte', dividend: '💵 Dividende $MCT', game: '🎮 Mini-jeu', recharge: '💵 Recharge' }, err: { name_taken: 'Ce nom est déjà pris par un autre coin. Choisis-en un autre.' } },
    ar: { led: { cfee_paid: '👤 رسوم المنشئ المدفوعة', chainfee_paid: '⛓️ رسوم البلوكتشين المدفوعة', clan: '🛡️ العشيرة', insure: '🛡️ تأمين الخسارة', dividend: '💵 أرباح $MCT', game: '🎮 لعبة مصغرة', recharge: '💵 شحن' }, err: { name_taken: 'هذا الاسم مستخدم لعملة أخرى. اختر اسمًا آخر.' } },
    id: { led: { cfee_paid: '👤 Fee pembuat dibayar', chainfee_paid: '⛓️ Fee blockchain dibayar', clan: '🛡️ Klan', insure: '🛡️ Asuransi rugi', dividend: '💵 Dividen $MCT', game: '🎮 Mini-game', recharge: '💵 Isi ulang' }, err: { name_taken: 'Nama ini sudah dipakai koin lain. Pilih nama lain.' } },
  };
  let n = 0;
  const add = () => {
    let G = null; try { G = (0, eval)('typeof L !== "undefined" ? L : null'); } catch (e) {}
    if (!G || !G.en || !G.en.led_k) { if (++n < 20) setTimeout(add, 500); return; }
    Object.keys(N).forEach((l) => { if (!G[l]) return; if (G[l].led_k) Object.assign(G[l].led_k, N[l].led); if (G[l].err) Object.assign(G[l].err, N[l].err); });
  };
  add();
})();
