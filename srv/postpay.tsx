// Code du bot PostPay, charge au demarrage par le service Railway "marketplace" (petit chargeur qui lit ce fichier sur GitHub).
// 14 nov 2026 (Jeremy): pour changer le bot, modifier ce fichier puis redemarrer le service.
// Telegram Ads Marketplace
// Les chaînes fixent leur prix, les annonceurs achètent une pub, paiement USDT non-custodial sur TON
// (90 % directement au diffuseur, 10 % directement à la plateforme, dans la même transaction).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Address, beginCell, Cell } from "@ton/core";

// ---------- Config ----------
const BOT_TOKEN = process.env.BOT_TOKEN!;
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || "/data";
const PUBLIC_URL = (process.env.PUBLIC_URL || "").replace(/\/$/, "");
const PLATFORM_WALLET = process.env.PLATFORM_WALLET || "";
const FEE_PCT = Number(process.env.FEE_PCT || 10);
const REF_PCT = 0; // parrainage désactivé (12 nov 2026)
const PP_KEY = process.env.PP_KEY || "";
const OWNER_USERNAME = (process.env.OWNER_USERNAME || "jeremju").toLowerCase();
const TC = "https://toncenter.com/api/v3";
const TC_KEY = process.env.TONCENTER_KEY || "";
const USDT_MASTER = "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs";
const AD_HOURS = 24;
const PAY_WINDOW_H = 3;
const BANNED = ["double your", "doublez", "x2 your", "guaranteed profit", "profit garanti", "seed phrase", "phrase secrète", "private key", "clé privée", "airdrop claim", "claim your airdrop", "free usdt", "usdt gratuit", "porn", "escort", "casino gratuit"];
// Prix max par pub selon le nombre d'abonnés
const TIERS: [number, number][] = [[500, 5], [1000, 10], [5000, 25], [10000, 50], [50000, 150], [100000, 300], [500000, 1000], [Infinity, 5000]];
const maxPrice = (members: number) => TIERS.find(([m]) => (members || 0) < m)![1];
const PAIDS = ["paid", "posted", "done", "removed_early"]; // a paid ad, even removed too early
const GAP_H = 4; // minimum entre 2 pubs sur une même chaîne
const THEMES = ["crypto", "business", "finance", "tech", "gaming", "sports", "news", "entertainment", "lifestyle", "education", "other"];
const LANGS = ["en", "fr", "es", "pt", "ru", "tr", "id", "hi", "ar", "fa", "other"]; // 14 nov 2026 (Jeremy): same 10 languages as the site and the app

if (!BOT_TOKEN) { console.error("BOT_TOKEN manquant"); process.exit(1); }
let BOT_USERNAME = process.env.BOT_USERNAME || "";
let BOT_NAME = "Telegram Ads Marketplace";

// ---------- Stockage ----------
fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_FILE = path.join(DATA_DIR, "db.json");
let db: any = { users: {}, channels: {}, orders: {}, nextOrder: 1, updateOffset: 0, usedTx: {} };
try { db = { ...db, ...JSON.parse(fs.readFileSync(DB_FILE, "utf8")) }; } catch {}
let saveTimer: any = null;
const save = () => { clearTimeout(saveTimer); saveTimer = setTimeout(() => fs.writeFileSync(DB_FILE, JSON.stringify(db)), 300); };

// ---------- Telegram ----------
async function tg(method: string, params: any = {}) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params),
  });
  const data: any = await res.json();
  if (!data.ok) throw new Error(`Telegram ${method}: ${data.description}`);
  return data.result;
}
// 13 nov 2026 (Jeremy): photo sent from the mini app (data URL), posted with the ad text as caption
async function tgPhoto(chat_id: any, dataUrl: string, caption: string) {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(dataUrl || "");
  if (!m) throw new Error("photo");
  const bin = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
  if (bin.length > 4_500_000) throw new Error("photo");
  const fd = new FormData();
  fd.append("chat_id", String(chat_id)); fd.append("caption", caption);
  fd.append("photo", new Blob([bin], { type: m[1] }), "ad." + m[1].split("/")[1]);
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method: "POST", body: fd });
  const data: any = await res.json();
  if (!data.ok) throw new Error(`Telegram sendPhoto: ${data.description}`);
  return data.result;
}
async function say(chat_id: any, text: string, kb?: any, _sponsor = true) {
  return tg("sendMessage", { chat_id, text, parse_mode: "HTML", disable_web_page_preview: true, reply_markup: kb ? { inline_keyboard: kb } : undefined });
}
const isOwner = (u: any) => (u?.username || "").toLowerCase() === OWNER_USERNAME;
async function notifyOwner(text: string) {
  const o = Object.values<any>(db.users).find(isOwner);
  if (o) try { await say(o.id, text, undefined, false); } catch {}
}
const esc = (s: any) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------- TON ----------
const tcHeaders = () => (TC_KEY ? { "X-API-Key": TC_KEY } : {});
async function tcGet(p: string) {
  const r = await fetch(`${TC}${p}`, { headers: tcHeaders() as any });
  if (!r.ok) throw new Error(`toncenter ${r.status}`);
  return r.json();
}
function parseAddr(s: string): Address | null { try { return Address.parse(String(s).trim()); } catch { return null; } }
const friendly = (a: Address) => a.toString({ urlSafe: true, bounceable: false });
const toUnits = (usdt: number) => BigInt(Math.round(usdt * 1e6)); // USDT : 6 décimales
function commentOf(b64: string | null): string {
  if (!b64) return "";
  try { const s = Cell.fromBase64(b64).beginParse(); if (s.remainingBits >= 32 && s.loadUint(32) === 0) return s.loadStringTail(); } catch {}
  return "";
}
function split(price: number) {
  const total = toUnits(price);
  const fee = PLATFORM_WALLET ? (total * BigInt(FEE_PCT)) / 100n : 0n;
  return { total, fee, pub: total - fee };
}
// Répartition complète d'une commande : diffuseur, parrains (10 % de la commission chacun), plateforme
function planOf(o: any) {
  const s = split(o.price);
  const refs: any[] = [];
  if (s.fee > 0n && REF_PCT > 0) {
    const pubOwner = db.channels[o.ch]?.owner;
    for (const uid of [db.users[o.adv]?.ref, db.users[pubOwner]?.ref]) {
      const r = uid && db.users[uid];
      if (!r || !r.wallet || refs.some(x => x.uid === r.id) || r.id === o.adv || r.id === pubOwner) continue;
      refs.push({ uid: r.id, wallet: r.wallet, amount: (s.fee * BigInt(REF_PCT)) / 100n });
    }
  }
  const platform = s.fee - refs.reduce((a, r) => a + r.amount, 0n);
  return { total: s.total, fee: s.fee, pub: s.pub, platform, refs };
}
function jettonTransferBody(amount: bigint, to: Address, responseTo: Address, comment: string) {
  const fwd = beginCell().storeUint(0, 32).storeStringTail(comment).endCell();
  return beginCell().storeUint(0xf8a7ea5, 32).storeUint(Date.now(), 64).storeCoins(amount)
    .storeAddress(to).storeAddress(responseTo).storeBit(0).storeCoins(1n).storeBit(1).storeRef(fwd).endCell();
}
async function usdtWalletOf(owner: Address) {
  const r: any = await tcGet(`/jetton/wallets?owner_address=${encodeURIComponent(owner.toRawString())}&jetton_address=${USDT_MASTER}&limit=1`);
  const w = r.jetton_wallets?.[0];
  return w ? { address: Address.parse(w.address), balance: BigInt(w.balance) } : null;
}
// Cherche un transfert USDT entrant vers `owner` avec le commentaire `comment` et au moins `min`
async function findTransfer(owner: string, comment: string, min: bigint, since: number) {
  const r: any = await tcGet(`/jetton/transfers?owner_address=${encodeURIComponent(Address.parse(owner).toRawString())}&jetton_master=${USDT_MASTER}&direction=in&limit=50&sort=desc`);
  for (const t of r.jetton_transfers || []) {
    if ((t.transaction_now || 0) < since - 600) continue;
    if (t.transaction_aborted) continue;
    if (commentOf(t.forward_payload) !== comment) continue;
    if (BigInt(t.amount) < min) continue;
    if (db.usedTx[t.transaction_hash]) continue;
    return t;
  }
  return null;
}

// Hash de transaction en hexadécimal (lien de preuve sur tonviewer)
const txHex = (h: string) => /^[0-9a-f]{64}$/i.test(h || "") ? h.toLowerCase() : Buffer.from(String(h || ""), "base64").toString("hex");

// ---------- Utilisateurs ----------
function getUser(from: any, src?: string) {
  const id = String(from.id);
  let u = db.users[id];
  const isNew = !u;
  if (!u) { u = db.users[id] = { id, created: new Date().toISOString(), src: src || null, state: null, wallet: null }; }
  if (!u.lang) u.lang = String(from.language_code || "").startsWith("fr") ? "fr" : "en";
  u.username = from.username || null;
  u.first_name = from.first_name || "";
  save();
  return { u, isNew };
}
const L = (u: any) => (u?.lang === "fr" ? "fr" : "en");

// ---------- Textes ----------
const THEME_LABEL: any = {
  en: { crypto: "🪙 Crypto", business: "💼 Business", finance: "💰 Finance", tech: "💻 Tech", gaming: "🎮 Gaming", sports: "⚽ Sports", news: "📰 News", entertainment: "🎬 Entertainment", lifestyle: "🌴 Lifestyle", education: "📚 Education", other: "✨ Other" },
  fr: { crypto: "🪙 Crypto", business: "💼 Business", finance: "💰 Finance", tech: "💻 Tech", gaming: "🎮 Jeux", sports: "⚽ Sport", news: "📰 Actu", entertainment: "🎬 Divertissement", lifestyle: "🌴 Lifestyle", education: "📚 Éducation", other: "✨ Autre" },
};
const LANG_LABEL: any = { en: "🇬🇧 English", fr: "🇫🇷 Français", es: "🇪🇸 Español", pt: "🇧🇷 Português", ru: "🇷🇺 Русский", tr: "🇹🇷 Türkçe", id: "🇮🇩 Indonesia", hi: "🇮🇳 हिन्दी", ar: "🇸🇦 العربية", fa: "🇮🇷 فارسی", other: "🌍 Other" };

const TX: any = {
  en: {
    home: (bot: string) => `<b>📢 ${esc(bot)}</b>
The marketplace to <b>buy and sell ads</b> in Telegram channels.

<b>Advertisers:</b> browse channels, pick one, pay in USDT. The ad is posted automatically with your own button.
<b>Channel owners:</b> list your channel, set your price, approve each ad, get paid in USDT straight to your wallet.

Payments go directly to the channel owner's wallet. We never hold your money.`,
    browse: "🛒 Browse channels", list: "📢 List my channel", myChannels: "📋 My channels", myOrders: "📦 My orders", lang: "🇫🇷 Français",
    askPrice: (t: string, m: number, max: number) => `✅ <b>${esc(t)}</b> is connected! (👥 ${m} subscribers)\n\nWhat's your <b>price per ad</b> in USDT? (ad stays 24h)\nYou receive ${100 - FEE_PCT}% of it.\n\n📊 Max for your channel size: <b>${max} USDT</b>\n<i>${TIERS.map(([a, p], i) => `${a === Infinity ? "500k+" : "< " + (a >= 1000 ? a / 1000 + "k" : a)}: ${p}`).join(" · ")}</i>\n\nExample: <code>${Math.min(20, max)}</code>`,
    badPrice: (max: number) => `Send a number between 0.50 and <b>${max}</b> (max for your channel size), e.g. <code>${Math.min(20, max)}</code>`,
    priceCapped: (t: string, p: number) => `📉 <b>${esc(t)}</b> lost subscribers: its price was lowered to <b>${p} USDT</b> (max for its size).`,
    askTheme: "Which <b>theme</b> is your channel about?",
    askLang: "Which <b>language</b> is your channel in?",
    askWallet: "👛 Connect your <b>TON wallet</b> in 1 tap to receive USDT payments (button below).\nOr paste your address (UQ... or EQ...).",
    connectWallet: "🔗 Connect my wallet",
    walletSaved: (w: string) => `✅ Wallet connected:\n<code>${w}</code>`,
    walletMenu: (w: string) => w ? `👛 <b>Your wallet</b>\n<code>${w}</code>\n\nPayments for your channel ads arrive here.` : "👛 No wallet connected yet. Connect it in 1 tap to receive USDT.",
    changeWallet: "🔄 Change wallet",
    noWallet: "❓ No wallet? Create one in 2 min",
    walletGuide: "👛 <b>Create a TON wallet in 2 minutes</b>\n\n1️⃣ Install <b>Tonkeeper</b> (App Store or Google Play), it's free.\n2️⃣ Tap \"Create new wallet\".\n3️⃣ Write down your 24 secret words on paper and keep them safe. Never share them with anyone, not even us.\n4️⃣ Come back here, tap \"🔗 Connect my wallet\" and pick Tonkeeper.\n\n💡 You can also use Telegram's Wallet: open @wallet, go to <b>TON Space</b> and activate it.\n\nThe USDT you earn will arrive there directly.",
    wallet: "👛 Wallet", earnings: "💰 My earnings",
    earnMenu: (ch: string, n: number, hasW: boolean) => `💰 <b>My earnings</b>\n\n📢 <b>${ch} USDT</b> received (${n} ads)\n\nYou get ${100 - FEE_PCT}% of the price of each ad, sent straight to your wallet when the advertiser pays. PostPay never holds your money.${hasW ? "" : "\n\n⚠️ Connect your wallet to get paid."}`,
    copyLink: "📋 Copy my link", share: "📤 Share",
    shareText: "Buy and sell ads in Telegram channels, paid in USDT 👇",
    refEarned: (a: string, t: string) => `🤝 You earned <b>${a} USDT</b> from a referral (ad on ${esc(t)}). Sent to your wallet.`,
    badWallet: "This is not a valid TON address. Send an address starting with UQ or EQ.",
    askPerDay: `📅 How many <b>ads per 24h</b> do you accept? (at least ${GAP_H}h between 2 ads)`,
    editPerDay: "📅 Ads/day",
    manage: "⚙️ Set up my channel",
    quickListed: (t: string, p: number, n: number, m: number, w: boolean, ok = false) => `${ok ? `✅ <b>${esc(t)}</b> is live on PostPay!` : `⏳ <b>${esc(t)}</b> is added! It will be checked by our team <b>within 48h</b>, then shown in the catalog.`} (👥 ${m} subscribers)\n\n💰 ${p} USDT per ad · 📅 ${n} ads per day max\n\nChange the price, number of ads, theme and language in the app.${w ? "" : "\n\n⚠️ Connect your wallet to get paid."}`,
    slotBusy: (w: string) => w ? `⏳ Your channel already has an ad. Next slot in <b>${w}</b> (${GAP_H}h minimum between 2 ads). Approve again then.` : "⏳ Another ad is already waiting for payment on this channel. Try again later.",
    listed: (t: string, p: number, n: number) => `🎉 <b>${esc(t)}</b> is listed at <b>${p} USDT</b> per ad, max <b>${n}</b> ad(s) per 24h.\n\nYou'll get a message for each ad request: you approve or refuse. Once paid, the ad is posted automatically and removed after 24h.`,
    notAdmin: (t: string) => `⚠️ I was added to <b>${esc(t)}</b> but I need <b>admin rights with "Post messages"</b> to publish ads.`,
    noChannels: "You have no listed channel yet. Tap <b>List my channel</b> on /start.",
    chList: "📋 <b>Your channels</b>",
    editPrice: "💰 Price", unlist: "⏸ Unlist", relist: "▶️ Relist",
    unlisted: "⏸ Channel unlisted.", relisted: "▶️ Channel listed again.",
    orderStart: (t: string, p: number) => `🛒 Ad on <b>${esc(t)}</b> for <b>${p} USDT</b> (24h).\n\n<b>Step 1/3</b>: send me your ad now: text, or a photo/video with caption. It will be posted exactly as you send it.`,
    banned: "❌ This ad contains forbidden content (scams, adult, etc.). Send another one.",
    askBtnText: "<b>Step 2/3</b>: what should the <b>button</b> under your ad say?\nExample: <code>Join now</code>, <code>Open the app</code>, <code>Visit website</code>",
    badBtnText: "Button text must be 1 to 40 characters.",
    askBtnUrl: "<b>Step 3/3</b>: send the <b>link</b> for the button (https://... or t.me/...).",
    badUrl: "Send a valid link starting with https:// or t.me/",
    sentForApproval: "📨 Your ad was sent to the channel owner for approval. You'll get a message with the payment button once approved.",
    approved: (t: string, p: number) => `✅ <b>${esc(t)}</b> approved your ad!\n\nPay <b>${p} USDT</b> to publish it. Payment goes directly to the channel owner's wallet.\n<i>You need about 0.1 TON for network fees. Payment link valid ${PAY_WINDOW_H}h.</i>`,
    payBtn: "💳 Pay in USDT",
    rejected: (t: string) => `❌ <b>${esc(t)}</b> declined your ad. You can choose another channel.`,
    posted: (t: string, link: string) => `🚀 Your ad is live on <b>${esc(t)}</b>!\n${link}\n\nIt stays 24h. You'll get the results at the end.`,
    results: (t: string, c: number, p: number) => `📊 <b>Results</b> for your ad on <b>${esc(t)}</b>:\n👆 ${c} clicks\n💰 ${c ? (p / c).toFixed(3) : "-"} USDT per click`,
    expired: "⌛ Payment time expired for this ad. Request it again from the catalog.",
    failedPost: "⚠️ Payment received but the ad could not be posted. The channel owner and the admin have been notified to fix it or refund you.",
    myOrdersTitle: "📦 <b>Your recent orders</b>",
    noOrders: "No orders yet.",
    pending: "You already have an ad in progress. Finish it or send /cancel.",
    cancelled: "Cancelled.",
    help: "Commands:\n/start - menu\n/channels - your channels\n/orders - your orders\n/earnings - my earnings\n/wallet - your wallet\n/cancel - cancel current step\n/language - Français / English\n\nQuestions: https://t.me/jeremstyke?direct",
    // diffuseur
    req: (t: string, p: number, you: string) => `📥 <b>New ad request</b> for <b>${esc(t)}</b>\n💰 ${p} USDT (you receive ${you} USDT)\n\nThe ad is just above. Approve to let the advertiser pay.\n⚠️ Once posted, the ad must stay 24h: a channel that deletes an ad early is removed from PostPay.`,
    approve: "✅ Approve", reject: "❌ Refuse",
    youApproved: "✅ Approved. The ad will be posted automatically as soon as payment arrives.",
    youRejected: "❌ Refused.",
    pubPaid: (t: string, a: string) => `💰 <b>${a} USDT</b> received in your wallet for an ad on <b>${esc(t)}</b>. The ad is posted for 24h.`,
    pubResults: (t: string, c: number) => `📊 The ad on <b>${esc(t)}</b> ended: ${c} clicks.`,
  },
  fr: {
    home: (bot: string) => `<b>📢 ${esc(bot)}</b>
La marketplace pour <b>acheter et vendre de la pub</b> dans les chaînes Telegram.

<b>Annonceurs :</b> parcourez les chaînes, choisissez, payez en USDT. La pub est publiée automatiquement avec votre bouton.
<b>Propriétaires de chaînes :</b> inscrivez votre chaîne, fixez votre prix, validez chaque pub, recevez les USDT directement sur votre wallet.

Les paiements vont directement sur le wallet du propriétaire de la chaîne. Nous ne gardons jamais votre argent.`,
    browse: "🛒 Voir les chaînes", list: "📢 Inscrire ma chaîne", myChannels: "📋 Mes chaînes", myOrders: "📦 Mes commandes", lang: "🇬🇧 English",
    askPrice: (t: string, m: number, max: number) => `✅ <b>${esc(t)}</b> est connectée ! (👥 ${m} abonnés)\n\nQuel est votre <b>prix par pub</b> en USDT ? (pub gardée 24 h)\nVous en recevez ${100 - FEE_PCT} %.\n\n📊 Maximum pour votre taille de chaîne : <b>${max} USDT</b>\n<i>${TIERS.map(([a, p]) => `${a === Infinity ? "500k+" : "< " + (a >= 1000 ? a / 1000 + "k" : a)} : ${p}`).join(" · ")}</i>\n\nExemple : <code>${Math.min(20, max)}</code>`,
    badPrice: (max: number) => `Envoyez un nombre entre 0,50 et <b>${max}</b> (maximum pour votre taille de chaîne), par exemple <code>${Math.min(20, max)}</code>`,
    priceCapped: (t: string, p: number) => `📉 <b>${esc(t)}</b> a perdu des abonnés : son prix est passé à <b>${p} USDT</b> (maximum pour sa taille).`,
    askTheme: "Quel est le <b>thème</b> de votre chaîne ?",
    askLang: "Dans quelle <b>langue</b> est votre chaîne ?",
    askWallet: "👛 Connectez votre <b>wallet TON</b> en 1 clic pour recevoir les paiements en USDT (bouton ci-dessous).\nOu collez votre adresse (UQ... ou EQ...).",
    connectWallet: "🔗 Connecter mon wallet",
    walletSaved: (w: string) => `✅ Wallet connecté :\n<code>${w}</code>`,
    walletMenu: (w: string) => w ? `👛 <b>Votre wallet</b>\n<code>${w}</code>\n\nLes paiements des pubs sur vos chaînes arrivent ici.` : "👛 Aucun wallet connecté. Connectez-le en 1 clic pour recevoir des USDT.",
    changeWallet: "🔄 Changer de wallet",
    noWallet: "❓ Pas de wallet ? Crée-le en 2 min",
    walletGuide: "👛 <b>Créer un wallet TON en 2 minutes</b>\n\n1️⃣ Installe <b>Tonkeeper</b> (App Store ou Google Play), c'est gratuit.\n2️⃣ Appuie sur « Créer un nouveau wallet ».\n3️⃣ Note tes 24 mots secrets sur papier et garde-les bien. Ne les donne jamais à personne, même pas à nous.\n4️⃣ Reviens ici, appuie sur « 🔗 Connecter mon wallet » et choisis Tonkeeper.\n\n💡 Tu peux aussi utiliser le Wallet de Telegram : ouvre @wallet, va dans <b>TON Space</b> et active-le.\n\nLes USDT que tu gagnes arriveront directement dessus.",
    wallet: "👛 Wallet", earnings: "💰 Mes gains",
    earnMenu: (ch: string, n: number, hasW: boolean) => `💰 <b>Mes gains</b>\n\n📢 <b>${ch} USDT</b> reçus (${n} pubs)\n\nVous recevez ${100 - FEE_PCT} % du prix de chaque pub, envoyés directement sur votre wallet quand l'annonceur paie. PostPay ne garde jamais votre argent.${hasW ? "" : "\n\n⚠️ Connectez votre wallet pour être payé."}`,
    copyLink: "📋 Copier mon lien", share: "📤 Partager",
    shareText: "Achetez et vendez de la pub dans les chaînes Telegram, payée en USDT 👇",
    refEarned: (a: string, t: string) => `🤝 Vous avez gagné <b>${a} USDT</b> grâce à un filleul (pub sur ${esc(t)}). Envoyés sur votre wallet.`,
    badWallet: "Ce n'est pas une adresse TON valide. Envoyez une adresse qui commence par UQ ou EQ.",
    askPerDay: `📅 Combien de <b>pubs par 24 h</b> acceptez-vous ? (${GAP_H} h minimum entre 2 pubs)`,
    editPerDay: "📅 Pubs/jour",
    manage: "⚙️ Régler ma chaîne",
    quickListed: (t: string, p: number, n: number, m: number, w: boolean, ok = false) => `${ok ? `✅ <b>${esc(t)}</b> est en ligne sur PostPay !` : `⏳ <b>${esc(t)}</b> est ajoutée ! Elle sera vérifiée par notre équipe <b>sous 48 h</b>, puis affichée dans le catalogue.`} (👥 ${m} abonnés)\n\n💰 ${p} USDT la pub · 📅 ${n} pubs par jour max\n\nChange le prix, le nombre de pubs, le thème et la langue dans l'appli.${w ? "" : "\n\n⚠️ Connecte ton wallet pour être payé."}`,
    slotBusy: (w: string) => w ? `⏳ Votre chaîne a déjà une pub. Prochain créneau dans <b>${w}</b> (${GAP_H} h minimum entre 2 pubs). Acceptez à nouveau à ce moment-là.` : "⏳ Une autre pub attend déjà son paiement sur cette chaîne. Réessayez plus tard.",
    listed: (t: string, p: number, n: number) => `🎉 <b>${esc(t)}</b> est en ligne à <b>${p} USDT</b> la pub, <b>${n}</b> pub(s) max par 24 h.\n\nVous recevrez un message à chaque demande de pub : vous acceptez ou refusez. Une fois payée, la pub est publiée automatiquement puis retirée après 24 h.`,
    notAdmin: (t: string) => `⚠️ J'ai été ajouté à <b>${esc(t)}</b> mais il me faut les <b>droits admin avec "Publier des messages"</b> pour publier les pubs.`,
    noChannels: "Vous n'avez encore aucune chaîne inscrite. Appuyez sur <b>Inscrire ma chaîne</b> dans /start.",
    chList: "📋 <b>Vos chaînes</b>",
    editPrice: "💰 Prix", unlist: "⏸ Retirer", relist: "▶️ Remettre",
    unlisted: "⏸ Chaîne retirée du catalogue.", relisted: "▶️ Chaîne remise dans le catalogue.",
    orderStart: (t: string, p: number) => `🛒 Pub sur <b>${esc(t)}</b> pour <b>${p} USDT</b> (24 h).\n\n<b>Étape 1/3</b> : envoyez-moi votre pub maintenant : un texte, ou une photo/vidéo avec légende. Elle sera publiée exactement comme vous l'envoyez.`,
    banned: "❌ Cette pub contient du contenu interdit (arnaques, adulte, etc.). Envoyez-en une autre.",
    askBtnText: "<b>Étape 2/3</b> : quel texte pour le <b>bouton</b> sous votre pub ?\nExemple : <code>Rejoindre</code>, <code>Ouvrir l'appli</code>, <code>Voir le site</code>",
    badBtnText: "Le texte du bouton doit faire entre 1 et 40 caractères.",
    askBtnUrl: "<b>Étape 3/3</b> : envoyez le <b>lien</b> du bouton (https://... ou t.me/...).",
    badUrl: "Envoyez un lien valide qui commence par https:// ou t.me/",
    sentForApproval: "📨 Votre pub a été envoyée au propriétaire de la chaîne pour validation. Vous recevrez le bouton de paiement dès qu'elle sera acceptée.",
    approved: (t: string, p: number) => `✅ <b>${esc(t)}</b> a accepté votre pub !\n\nPayez <b>${p} USDT</b> pour la publier. Le paiement va directement sur le wallet du propriétaire de la chaîne.\n<i>Il faut environ 0,1 TON pour les frais de réseau. Lien de paiement valable ${PAY_WINDOW_H} h.</i>`,
    payBtn: "💳 Payer en USDT",
    rejected: (t: string) => `❌ <b>${esc(t)}</b> a refusé votre pub. Vous pouvez choisir une autre chaîne.`,
    posted: (t: string, link: string) => `🚀 Votre pub est en ligne sur <b>${esc(t)}</b> !\n${link}\n\nElle reste 24 h. Vous recevrez les résultats à la fin.`,
    results: (t: string, c: number, p: number) => `📊 <b>Résultats</b> de votre pub sur <b>${esc(t)}</b> :\n👆 ${c} clics\n💰 ${c ? (p / c).toFixed(3) : "-"} USDT par clic`,
    expired: "⌛ Le délai de paiement de cette pub est dépassé. Refaites la demande depuis le catalogue.",
    failedPost: "⚠️ Paiement reçu mais la pub n'a pas pu être publiée. Le propriétaire de la chaîne et l'admin ont été prévenus pour corriger ou vous rembourser.",
    myOrdersTitle: "📦 <b>Vos dernières commandes</b>",
    noOrders: "Aucune commande pour l'instant.",
    pending: "Vous avez déjà une pub en cours. Terminez-la ou envoyez /cancel.",
    cancelled: "Annulé.",
    help: "Commandes :\n/start - menu\n/channels - vos chaînes\n/orders - vos commandes\n/earnings - mes gains\n/wallet - votre wallet\n/cancel - annuler l'étape en cours\n/language - Français / English\n\nQuestions : https://t.me/jeremstyke?direct",
    req: (t: string, p: number, you: string) => `📥 <b>Nouvelle demande de pub</b> pour <b>${esc(t)}</b>\n💰 ${p} USDT (vous recevez ${you} USDT)\n\nLa pub est juste au-dessus. Acceptez pour que l'annonceur puisse payer.\n⚠️ Une fois publiée, la pub doit rester 24 h : une chaîne qui supprime une pub avant est retirée de PostPay.`,
    approve: "✅ Accepter", reject: "❌ Refuser",
    youApproved: "✅ Acceptée. La pub sera publiée automatiquement dès réception du paiement.",
    youRejected: "❌ Refusée.",
    pubPaid: (t: string, a: string) => `💰 <b>${a} USDT</b> reçus sur votre wallet pour une pub sur <b>${esc(t)}</b>. La pub est publiée pour 24 h.`,
    pubResults: (t: string, c: number) => `📊 La pub sur <b>${esc(t)}</b> est terminée : ${c} clics.`,
  },
};
const STATUS: any = {
  en: { await_msg: "✍️ writing", await_btn_text: "✍️ writing", await_btn_url: "✍️ writing", pending: "⏳ waiting approval", approved: "💳 waiting payment", posted: "🚀 live", done: "✅ done", rejected: "❌ refused", expired: "⌛ expired", failed: "⚠️ failed", cancelled: "🚫 cancelled", removed_early: "🗑 removed before 24h" },
  fr: { await_msg: "✍️ en rédaction", await_btn_text: "✍️ en rédaction", await_btn_url: "✍️ en rédaction", pending: "⏳ en attente de validation", approved: "💳 en attente de paiement", posted: "🚀 en ligne", done: "✅ terminée", rejected: "❌ refusée", expired: "⌛ expirée", failed: "⚠️ échec", cancelled: "🚫 annulée", removed_early: "🗑 retirée avant 24 h" },
};

const appUrl = (q = "") => `${PUBLIC_URL}/app${q}`;
// 13 nov 2026 (Jeremy): everything is managed in the mini app; the bot only notifies and opens it
const appBtn = (u: any, q = "") => ({ text: L(u) === "fr" ? "📢 Ouvrir PostPay" : "📢 Open PostPay", web_app: { url: appUrl(q) } });
function homeKb(u: any) {
  return [[appBtn(u)]];
}
const goApp = (u: any) => say(u.id, L(u) === "fr"
  ? "📢 <b>Tout se passe dans l'appli PostPay</b> : acheter une pub, ajouter ta chaîne, accepter les demandes, payer et suivre tes gains."
  : "📢 <b>Everything happens in the PostPay app</b>: buy an ad, add your channel, approve requests, pay and track your earnings.", homeKb(u), false);
const perDayKb = (ch: string, k: string) => [[1, 2, 3, 4, 5].map(n => ({ text: String(n), callback_data: `${k}:${ch}:${n}` }))];
const walletKb = (u: any) => [[{ text: TX[L(u)].connectWallet, web_app: { url: appUrl("?wallet=1") } }]];
const refLink = (u: any) => `https://t.me/${BOT_USERNAME}?start=ref_${u.id}`;
async function showWallet(u: any) {
  const t = TX[L(u)];
  return say(u.id, t.walletMenu(u.wallet), u.wallet ? [[{ text: t.changeWallet, web_app: { url: appUrl("?wallet=1") } }]] : walletKb(u), false);
}
async function showEarnings(u: any) {
  const t = TX[L(u)];
  let ch = 0n, n = 0;
  for (const o of Object.values<any>(db.orders)) {
    if (db.channels[o.ch]?.owner !== u.id || !PAIDS.includes(o.status)) continue;
    ch += o.plan ? BigInt(o.plan.pub) : split(o.price).pub; n++;
  }
  const kb: any[] = [[{ text: L(u) === "fr" ? "📊 Voir dans l'appli" : "📊 Open in the app", web_app: { url: appUrl("?tab=earn") } }]];
  if (!u.wallet) kb.push(...walletKb(u));
  return say(u.id, t.earnMenu(fmt(ch), n, !!u.wallet), kb, false);
}
const fmt = (n: bigint) => (Number(n) / 1e6).toFixed(2).replace(/\.00$/, "");

// ---------- Disponibilité des chaînes ----------
// Renvoie { ok, at } : ok si on peut commander maintenant, sinon at = heure du prochain créneau (0 = réservé)
function slotOf(c: any, ignore?: string) {
  const now = Date.now();
  const mine = Object.values<any>(db.orders).filter(o => o.ch === c.id && o.id !== ignore);
  if (mine.some(o => o.status === "approved" || o.status === "paid")) return { ok: false, at: 0 };
  const posted = mine.filter(o => o.postedAt && now - o.postedAt < 24 * 3600e3).map(o => o.postedAt).sort((a, b) => a - b);
  let at = 0;
  if (posted.length) at = posted[posted.length - 1] + GAP_H * 3600e3;
  const per = c.perDay || 1;
  if (posted.length >= per) at = Math.max(at, posted[posted.length - per] + 24 * 3600e3);
  return at > now ? { ok: false, at } : { ok: true, at: 0 };
}
const hhmm = (ms: number) => { const t = Math.ceil(Math.max(0, ms - Date.now()) / 60e3); const h = Math.floor(t / 60), m = t % 60; return h ? `${h}h${String(m).padStart(2, "0")}` : `${m} min`; };

// ---------- Inscription des chaînes ----------
async function startChannelSetup(u: any, ch: any) {
  u.state = { step: "price", ch: String(ch.id) };
  save();
  await say(u.id, TX[L(u)].askPrice(ch.title, ch.members || 0, maxPrice(ch.members)), undefined, false);
}
async function finishListing(u: any, chId: string) {
  const c = db.channels[chId];
  c.listed = true;
  u.state = null;
  save();
  await say(u.id, TX[L(u)].listed(c.title, c.price, c.perDay || 1), [[{ text: TX[L(u)].browse, web_app: { url: appUrl() } }]]);
  await notifyOwner(`📢 Nouvelle chaîne listée : ${c.title}${c.username ? " @" + c.username : ""} · ${c.members ?? "?"} abonnés · ${c.price} USDT · ${c.perDay || 1}/24h · ${c.theme}/${c.lang}`);
}
async function setWallet(u: any, a: Address) {
  u.wallet = friendly(a);
  const s = u.state;
  save();
  await say(u.id, TX[L(u)].walletSaved(u.wallet), undefined, false);
  if (s?.step === "wallet") {
    u.state = null; save();
    if (s.approve && db.orders[s.approve]?.status === "pending") return say(u.id, L(u) === "fr" ? "👉 Appuyez à nouveau sur <b>Accepter</b> sur la pub ci-dessus." : "👉 Tap <b>Approve</b> again on the ad above.", undefined, false);
    if (s.ch && db.channels[s.ch] && !db.channels[s.ch].listed) return finishListing(u, s.ch);
  }
}
async function refreshMembers(c: any) {
  try { c.members = await tg("getChatMemberCount", { chat_id: c.id }); c.membersAt = Date.now(); } catch { return; }
  const max = maxPrice(c.members);
  if (c.price && c.price > max) {
    c.price = max; save();
    const o = db.users[c.owner];
    if (o && c.listed) try { await say(o.id, TX[L(o)].priceCapped(c.title, max), undefined, false); } catch {}
  }
}

async function handleMyChatMember(m: any) {
  const chat = m.chat;
  if (chat.type === "private") return;
  const st = m.new_chat_member;
  const id = String(chat.id);
  if (st.status !== "administrator") {
    if (db.channels[id]) { db.channels[id].listed = false; db.channels[id].removed = true; save(); }
    return;
  }
  const { u } = getUser(m.from);
  if (chat.type === "channel" && !st.can_post_messages) {
    try { await say(u.id, TX[L(u)].notAdmin(chat.title), undefined, false); } catch {}
    return;
  }
  const ex = db.channels[id];
  db.channels[id] = {
    ...(ex || { ads: 0, clicks: 0, earned: 0, created: new Date().toISOString() }),
    id, title: chat.title, username: chat.username || null, type: chat.type, owner: u.id, removed: false,
  };
  const c = db.channels[id];
  await refreshMembers(c);
  photoCache.delete(id);
  if (!c.price) {
    // Mise en ligne immédiate avec des réglages par défaut, modifiables dans l'appli
    const max = maxPrice(c.members);
    c.price = Math.max(0.5, Math.round(max * 0.4 * 2) / 2);
    c.perDay = c.perDay || 2; c.theme = c.theme || "other"; c.lang = c.lang || (L(u) === "fr" ? "fr" : "en");
  }
  // 12 nov 2026 (Jeremy): every new channel waits for his approval (within 48h) before showing in the catalog
  if (c.approved === undefined || isOwner(u)) c.approved = isOwner(u) ? true : false;
  c.listed = !c.banned; u.state = null; save();
  const t = TX[L(u)];
  const kb: any[] = [[{ text: t.manage, web_app: { url: appUrl("?tab=mine") } }]];
  if (!u.wallet) kb.push(...walletKb(u));
  try { await say(u.id, t.quickListed(c.title, c.price, c.perDay, c.members || 0, !!u.wallet, !!c.approved && !c.banned), kb, false); } catch {}
  if (!c.approved || c.banned) await askApproval(c, u);
  else await notifyOwner(`📢 Nouvelle chaîne : ${esc(c.title)}${c.username ? " @" + c.username : ""} · ${c.members ?? "?"} abonnés · ${c.price} USDT`);
}
// 12 nov 2026 (Jeremy): a direct link per channel, for its owner to sell his ad
const chCode = (c: any) => "ch_" + String(c.id).replace("-", "m");
const sellLink = (c: any) => `https://t.me/${BOT_USERNAME}?start=${chCode(c)}`;
const chByCode = (code: string) => Object.values<any>(db.channels).find(c => chCode(c) === code);
async function showChannelCard(u: any, c: any) {
  const fr = L(u) === "fr", t = TX[L(u)];
  if (!c || c.removed || c.banned || c.approved === false || !c.listed) return say(u.id, fr ? "Cette chaîne n'est pas disponible pour le moment. Voici les autres chaînes 👇" : "This channel is not available right now. Here are the other channels 👇", [[{ text: t.browse, web_app: { url: appUrl() } }]], false);
  const sl = slotOf(c);
  return say(u.id, `📢 <b>${esc(c.title)}</b>${c.username ? " @" + c.username : ""}\n👥 ${c.members || 0} ${fr ? "abonnés" : "subscribers"} · 💰 <b>${c.price} USDT</b> ${fr ? "la pub (24 h)" : "per ad (24h)"}${c.kept ? `\n✅ ${c.kept} ${fr ? "pubs gardées 24 h" : "ads kept 24h"}` : ""}\n\n${fr ? "Envoie ta pub avec ton bouton, paie en USDT, elle est publiée automatiquement." : "Send your ad with your button, pay in USDT, it is posted automatically."}${sl.ok ? "" : `\n\n⏳ ${fr ? "Prochain créneau" : "Next slot"} : ${sl.at ? hhmm(sl.at) : (fr ? "bientôt" : "soon")}`}`,
    [[{ text: fr ? "🛒 Acheter une pub ici" : "🛒 Buy an ad here", web_app: { url: appUrl(`?ch=${encodeURIComponent(c.id)}`) } }], [{ text: t.browse, web_app: { url: appUrl() } }]], false);
}
const chLink = (c: any) => c.username ? `https://t.me/${c.username}` : "";
async function askApproval(c: any, u: any) {
  const o = Object.values<any>(db.users).find(isOwner);
  if (!o) return;
  try { await say(o.id, `🆕 <b>Chaîne à valider</b>${c.banned ? " (bannie pour une pub retirée avant 24 h)" : ""}\n\n<b>${esc(c.title)}</b>${c.username ? " @" + c.username : " (privée)"}\n👥 ${c.members ?? "?"} abonnés · 💰 ${c.price} USDT · 📅 ${c.perDay || 1}/jour\nPropriétaire : ${esc(u?.first_name || "")}${u?.username ? " @" + u.username : ""}\n\nValide-la sous 48 h.`,
    [...(chLink(c) ? [[{ text: "👀 Voir la chaîne", url: chLink(c) }]] : []), [{ text: "✅ Valider ou refuser dans l'appli", web_app: { url: appUrl("?tab=ord") } }]], false); } catch {}
}

// ---------- Commandes ----------
function newOrder(u: any, c: any) {
  const id = String(db.nextOrder++);
  db.orders[id] = { id, ch: c.id, adv: u.id, price: c.price, status: "await_msg", created: Date.now(), clicks: 0, clickers: {} };
  u.state = { step: "ad_msg", order: id };
  save();
  return db.orders[id];
}
function activeOrderOf(u: any) {
  return u.state?.order ? db.orders[u.state.order] : null;
}
const isBanned = (s: string) => { const l = (s || "").toLowerCase(); return BANNED.some(w => l.includes(w)); };
function normUrl(s: string) {
  let v = String(s || "").trim();
  if (/^t\.me\//i.test(v)) v = "https://" + v;
  // 14 nov 2026 (Jeremy): "monsite.com" or "www.monsite.com" without https:// is accepted too
  if (!/^[a-z]+:/i.test(v) && /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(v)) v = "https://" + v;
  if (/^@[A-Za-z0-9_]{4,}$/.test(v)) v = "https://t.me/" + v.slice(1);
  try { const x = new URL(v); if (x.protocol !== "https:" && x.protocol !== "http:") return null; return x.toString(); } catch { return null; }
}

async function sendForApproval(o: any) {
  const c = db.channels[o.ch];
  const pub = db.users[c.owner];
  const t = TX[L(pub)];
  const { pub: you } = split(o.price);
  await tg("copyMessage", {
    chat_id: pub.id, from_chat_id: o.adv, message_id: o.msgId,
    reply_markup: { inline_keyboard: [[{ text: o.btnText, url: o.btnUrl }]] },
  });
  await say(pub.id, t.req(c.title, o.price, fmt(you)), [[{ text: L(pub) === "fr" ? "✅ Accepter ou refuser dans l'appli" : "✅ Approve or reject in the app", web_app: { url: appUrl("?tab=ord") } }]], false);
  o.status = "pending";
  save();
}

async function postAd(o: any) {
  const c = db.channels[o.ch];
  const adv = db.users[o.adv];
  try {
    const r = await tg("copyMessage", {
      chat_id: c.id, from_chat_id: o.adv, message_id: o.msgId,
      reply_markup: { inline_keyboard: [[{ text: o.btnText, url: `${PUBLIC_URL}/r/${o.id}` }]] },
    });
    o.postedMsgId = r.message_id;
    o.postedAt = Date.now();
    o.status = "posted";
    c.ads = (c.ads || 0) + 1;
    c.earned = (c.earned || 0) + o.price;
    save();
    const link = c.username ? `https://t.me/${c.username}/${r.message_id}` : "";
    await say(adv.id, TX[L(adv)].posted(c.title, link), undefined, false);
  } catch (e: any) {
    o.status = "failed";
    save();
    console.error("post", o.id, e.message);
    try { await say(adv.id, TX[L(adv)].failedPost, undefined, false); } catch {}
    try { await say(c.owner, `⚠️ Order #${o.id}: payment received but posting failed (${esc(e.message)}). Please check my admin rights and contact the advertiser.`, undefined, false); } catch {}
    await notifyOwner(`⚠️ Commande #${o.id} payée mais publication impossible sur ${c.title} : ${e.message}`);
  }
}

// ---------- Messages ----------
async function handleMessage(m: any) {
  if (!m.from || m.chat.type !== "private") return;
  const text = (m.text || "").trim();
  const [cmd, arg] = text.split(/\s+/, 2);
  const src = arg?.startsWith("src_") ? arg.slice(4) : null;
  const refId = arg?.startsWith("ref_") ? arg.slice(4) : null;
  const chArg = arg?.startsWith("ch_") ? arg : null;
  const { u, isNew } = getUser(m.from, src || (refId ? "ref" : chArg ? "chlink" : undefined));
  const t = TX[L(u)];
  let refBy: any = null;
  if (isNew && refId && refId !== u.id && db.users[refId]) { u.ref = refId; refBy = db.users[refId]; save(); }
  if (isNew && !isOwner(u)) await notifyOwner(`🆕 Nouvel utilisateur : ${esc(u.first_name)}${u.username ? " @" + u.username : ""}${src ? ` (source : ${src})` : ""}${refBy ? ` (parrain : ${esc(refBy.first_name)}${refBy.username ? " @" + refBy.username : ""})` : ""} · total ${Object.keys(db.users).length}`);

  // 13 nov 2026 (Jeremy): no more chat steps, everything goes through the mini app
  if (u.state) { u.state = null; save(); }
  if (cmd.toLowerCase().split("@")[0] === "/start" && chArg) return showChannelCard(u, chByCode(chArg));
  // 14 nov 2026 (Jeremy): coming from the website, the link says what the person wants: answer with the right button straight away
  if (src && /^seo_.*_ad$|^seo_live$/.test(src)) return say(u.id, L(u) === "fr"
    ? "🛒 <b>Choisis une chaîne</b>, écris ta pub dans l'appli et envoie-la au propriétaire. Tu ne paies qu'une fois qu'il l'a acceptée."
    : "🛒 <b>Pick a channel</b>, write your ad in the app and send it to the owner. You only pay once they accept it.", [[{ text: L(u) === "fr" ? "🛒 Voir les chaînes" : "🛒 Browse channels", web_app: { url: appUrl() } }]], false);
  if (src && /^seo_(home|owner|band_[a-z]+|monetize|prices)_[a-z]{2}$/.test(src)) return say(u.id, L(u) === "fr"
    ? "💸 <b>Ajoute ta chaîne en 1 minute</b>\n\n1. Appuie sur le bouton ci-dessous\n2. Choisis ta chaîne\n3. Valide les droits (publier, modifier, supprimer des messages)\n\nElle est validée sous 48 h. Ensuite, chaque pub vendue te rapporte 90 % en USDT, directement sur ton wallet."
    : "💸 <b>Add your channel in 1 minute</b>\n\n1. Tap the button below\n2. Pick your channel\n3. Confirm the rights (post, edit, delete messages)\n\nIt is reviewed within 48h. Then every ad you sell pays you 90% in USDT, straight to your wallet.",
    [[{ text: L(u) === "fr" ? "➕ Ajouter ma chaîne" : "➕ Add my channel", url: `https://t.me/${BOT_USERNAME}?startchannel&admin=post_messages+edit_messages+delete_messages` }], [{ text: L(u) === "fr" ? "📢 Ouvrir l'appli" : "📢 Open the app", web_app: { url: appUrl("?tab=mine") } }]], false);
  return goApp(u);
}

async function showChannels(u: any) {
  const t = TX[L(u)];
  const list = Object.values<any>(db.channels).filter(c => c.owner === u.id && !c.removed);
  if (!list.length) return say(u.id, t.noChannels, homeKb(u), false);
  for (const c of list) {
    await say(u.id, `${t.chList}\n\n<b>${esc(c.title)}</b>${c.username ? " @" + c.username : ""}\n💰 ${c.price ?? "-"} USDT · 📅 ${c.perDay || 1}/24h · 👥 ${c.members ?? "?"} · 📢 ${c.ads || 0} ads · 👆 ${c.clicks || 0} clicks`,
      [[{ text: L(u) === "fr" ? "⚙️ Gérer dans l'appli" : "⚙️ Manage in the app", web_app: { url: appUrl("?tab=mine") } }], [{ text: t.editPrice, callback_data: `pr:${c.id}` }, { text: t.editPerDay, callback_data: `pdm:${c.id}` }]], false);
  }
}
async function showOrders(u: any) {
  const t = TX[L(u)];
  const list = Object.values<any>(db.orders).filter(o => o.adv === u.id).sort((a, b) => b.created - a.created).slice(0, 10);
  if (!list.length) return say(u.id, t.noOrders, homeKb(u), false);
  const lines = list.map(o => `#${o.id} · ${esc(db.channels[o.ch]?.title || "?")} · ${o.price} USDT · ${STATUS[L(u)][o.status] || o.status}${o.status === "posted" || o.status === "done" ? ` · 👆 ${o.clicks}` : ""}`);
  return say(u.id, `${t.myOrdersTitle}\n\n${lines.join("\n")}`, undefined, false);
}

// 13 nov 2026 (Jeremy): channel review shared by the bot buttons and the mini app
async function reviewChannel(u: any, c: any, ok: boolean) {
  const own = db.users[c.owner], fr = L(own) === "fr";
  const k = ok ? "cv" : "cx";
    if (k === "cv") {
      c.approved = true; c.rejected = false; c.banned = false; if (!c.removed) c.listed = true; save();
      await say(u.id, `✅ ${esc(c.title)} validée, elle est dans le catalogue.`, undefined, false);
      try { await say(c.owner, fr ? `✅ <b>${esc(c.title)}</b> est validée ! Elle est maintenant visible dans le catalogue PostPay. Tu recevras un message à chaque demande de pub.` : `✅ <b>${esc(c.title)}</b> is approved! It is now visible in the PostPay catalog. You will get a message for each ad request.`, [[{ text: TX[L(own)].manage, web_app: { url: appUrl("?tab=mine") } }]], false); } catch {}
      try { await say(c.owner, (fr ? "🔗 <b>Ton lien pour vendre ta pub</b>\nPartage-le dans ta chaîne ou à tes contacts : les annonceurs arrivent directement sur ta chaîne.\n\n" : "🔗 <b>Your link to sell your ad</b>\nShare it in your channel or with your contacts: advertisers land right on your channel.\n\n") + `<code>${sellLink(c)}</code>`, [[{ text: fr ? "📤 Partager" : "📤 Share", url: `https://t.me/share/url?url=${encodeURIComponent(sellLink(c))}&text=${encodeURIComponent((fr ? "📢 Fais ta pub sur " : "📢 Advertise on ") + c.title + (fr ? ` (${c.members || 0} abonnés), payé en USDT 👇` : ` (${c.members || 0} subscribers), paid in USDT 👇`))}` }]], false); } catch {}
    } else {
      c.approved = false; c.rejected = true; c.listed = false; save();
      await say(u.id, `❌ ${esc(c.title)} refusée.`, undefined, false);
      try { await say(c.owner, fr ? `❌ <b>${esc(c.title)}</b> n'a pas été acceptée sur PostPay. Pour en savoir plus : https://t.me/jeremstyke?direct` : `❌ <b>${esc(c.title)}</b> was not accepted on PostPay. To know more: https://t.me/jeremstyke?direct`, undefined, false); } catch {}
    }
}
// 13 nov 2026 (Jeremy): approve or refuse an ad request, from the bot or the mini app. Returns "ok" or an error code.
async function decideAd(u: any, orderId: string, ok: boolean): Promise<string> {
  const t = TX[L(u)];
  const o = db.orders[orderId];
  if (!o || o.status !== "pending" || db.channels[o.ch]?.owner !== u.id) return "order";
  const adv = db.users[o.adv];
  const ch = db.channels[o.ch];
  if (!ok) {
    o.status = "rejected"; save();
    await say(u.id, t.youRejected, undefined, false).catch(() => {});
    await say(adv.id, TX[L(adv)].rejected(ch.title), [[{ text: TX[L(adv)].browse, web_app: { url: appUrl() } }]], false).catch(() => {});
    return "ok";
  }
  if (!u.wallet) return "wallet";
  const sl = slotOf(ch, o.id);
  if (!sl.ok) { await say(u.id, t.slotBusy(sl.at ? hhmm(sl.at) : ""), undefined, false).catch(() => {}); return "busy"; }
  o.status = "approved"; o.approvedAt = Date.now(); o.pubWallet = u.wallet; save();
  await say(u.id, t.youApproved, undefined, false).catch(() => {});
  await say(adv.id, TX[L(adv)].approved(ch.title, o.price), [[{ text: TX[L(adv)].payBtn, web_app: { url: appUrl(`?pay=${o.id}`) } }]], false).catch(() => {});
  return "ok";
}
async function handleCallback(q: any) {
  const { u } = getUser(q.from);
  const t = TX[L(u)];
  const d = q.data || "";
  await tg("answerCallbackQuery", { callback_query_id: q.id }).catch(() => {});
  const [k, a, b] = d.split(":");
  if (!["ap", "rj", "cv", "cx"].includes(k)) return goApp(u);
  if (k === "lang") { u.lang = L(u) === "fr" ? "en" : "fr"; save(); return say(u.id, TX[L(u)].home(BOT_NAME), homeKb(u)); }
  if (k === "mych") return showChannels(u);
  if (k === "myor") return showOrders(u);
  if (k === "wal") return showWallet(u);
  if (k === "wguide") return say(u.id, t.walletGuide, walletKb(u).slice(0, 1), false);
  if (k === "earn") return showEarnings(u);
  if (k === "ref") return showEarnings(u);
  if (k === "pd" && u.state?.step === "perday" && u.state.ch === a) {
    db.channels[a].perDay = Math.min(5, Math.max(1, Number(b) || 1));
    u.state = { step: "theme", ch: a }; save();
    const kb = []; const th = THEMES.map(x => ({ text: THEME_LABEL[L(u)][x], callback_data: `th:${a}:${x}` }));
    for (let i = 0; i < th.length; i += 2) kb.push(th.slice(i, i + 2));
    return say(u.id, t.askTheme, kb, false);
  }
  if (k === "th" && u.state?.step === "theme" && u.state.ch === a) {
    db.channels[a].theme = b;
    u.state = { step: "clang", ch: a }; save();
    const kb: any[] = []; for (let i = 0; i < LANGS.length; i += 3) kb.push(LANGS.slice(i, i + 3).map(x => ({ text: LANG_LABEL[x], callback_data: `cl:${a}:${x}` })));
    return say(u.id, t.askLang, kb, false);
  }
  if (k === "cl" && u.state?.step === "clang" && u.state.ch === a) {
    db.channels[a].lang = b;
    if (u.wallet) return finishListing(u, a);
    u.state = { step: "wallet", ch: a }; save();
    return say(u.id, t.askWallet, walletKb(u), false);
  }
  const c = db.channels[a];
  if ((k === "cv" || k === "cx") && isOwner(u) && c) {
    await tg("editMessageReplyMarkup", { chat_id: u.id, message_id: q.message.message_id, reply_markup: { inline_keyboard: [] } }).catch(() => {});
    await reviewChannel(u, c, k === "cv");
    return;
  }
  if (k === "pdm" && c?.owner === u.id) return say(u.id, t.askPerDay, perDayKb(a, "pds"), false);
  if (k === "pds" && c?.owner === u.id) { c.perDay = Math.min(5, Math.max(1, Number(b) || 1)); save(); return say(u.id, t.listed(c.title, c.price, c.perDay), undefined, false); }
  if (k === "pr" && c?.owner === u.id) { u.state = { step: "price", ch: a, editOnly: true }; save(); return say(u.id, t.askPrice(c.title, c.members || 0, maxPrice(c.members)), undefined, false); }
  if (k === "ap" || k === "rj") {
    const r = await decideAd(u, a, k === "ap");
    if (r === "ok") await tg("editMessageReplyMarkup", { chat_id: u.id, message_id: q.message.message_id, reply_markup: { inline_keyboard: [] } }).catch(() => {});
    return;
  }
}

// ---------- Boucle de mise à jour Telegram ----------
async function pollUpdates() {
  while (true) {
    try {
      const ups = await tg("getUpdates", { offset: db.updateOffset, timeout: 30, allowed_updates: ["message", "callback_query", "my_chat_member"] });
      for (const up of ups) {
        db.updateOffset = up.update_id + 1;
        try {
          if (up.message) await handleMessage(up.message);
          else if (up.callback_query) await handleCallback(up.callback_query);
          else if (up.my_chat_member) await handleMyChatMember(up.my_chat_member);
        } catch (e: any) { console.error("update:", e.message); }
      }
      if (ups.length) save();
    } catch (e: any) { console.error("polling:", e.message); await new Promise(r => setTimeout(r, 5000)); }
  }
}

// ---------- Vérification des paiements, retrait des pubs ----------
let checking = false;
async function tick() {
  if (checking) return; checking = true;
  try {
    const now = Date.now();
    // 14 nov 2026 (Jeremy): reminders for ads not finished: form opened but nothing sent (after 1 h, then 24 h),
    // ad started in the bot chat but not finished (after 1 h), ad accepted but not paid (1 h before the payment link ends)
    for (const du of Object.values<any>(db.users)) {
      const d = du.draft; if (!d) continue;
      const c = db.channels[d.ch];
      if (!c || !c.listed || c.banned || now - d.at > 3 * 86400e3) { delete du.draft; save(); continue; }
      const due = d.n === 0 ? 3600e3 : d.n === 1 ? 86400e3 : Infinity;
      if (now - d.at < due) continue;
      const done = Object.values<any>(db.orders).some(o => o.adv === du.id && o.created > d.at && !String(o.status).startsWith("await") && o.status !== "cancelled" && o.status !== "failed");
      d.n++; if (done || d.n > 2) delete du.draft; save();
      if (done) continue;
      const fr = L(du) === "fr";
      try { await say(du.id, fr ? `✍️ Ta pub sur <b>${esc(c.title)}</b> n'est pas terminée.\n\nIl reste juste à écrire le texte, le bouton et le lien (par exemple monsite.com ou t.me/machaine). Ça prend une minute.` : `✍️ Your ad on <b>${esc(c.title)}</b> is not finished.\n\nYou just need the text, the button and the link (for example mysite.com or t.me/mychannel). It takes a minute.`, [[{ text: fr ? "✍️ Finir ma pub" : "✍️ Finish my ad", web_app: { url: appUrl("?ch=" + encodeURIComponent(c.id)) } }]], false); } catch {}
    }
    for (const o of Object.values<any>(db.orders)) {
      if (String(o.status).startsWith("await") && !o.reminded && now - o.created > 3600e3 && now - o.created < 86400e3) {
        o.reminded = true; save();
        const au = db.users[o.adv], c = db.channels[o.ch], fr = L(au) === "fr";
        if (au && c && au.state?.order === o.id) try { await say(au.id, fr ? `✍️ Ta pub sur <b>${esc(c.title)}</b> n'est pas terminée. Tu peux la finir ici dans la discussion, ou l'écrire directement dans l'appli.` : `✍️ Your ad on <b>${esc(c.title)}</b> is not finished. You can finish it here in the chat, or write it right in the app.`, [[{ text: fr ? "✍️ Finir dans l'appli" : "✍️ Finish in the app", web_app: { url: appUrl("?ch=" + encodeURIComponent(c.id)) } }]], false); } catch {}
      }
      if (o.status === "approved" && !o.payReminded && PAY_WINDOW_H * 3600e3 - (now - o.approvedAt) < 3600e3 && now - o.approvedAt < PAY_WINDOW_H * 3600e3) {
        o.payReminded = true; save();
        const au = db.users[o.adv], c = db.channels[o.ch], fr = L(au) === "fr";
        if (au && c) try { await say(au.id, fr ? `⏰ <b>${esc(c.title)}</b> a accepté ta pub, mais elle n'est pas encore payée. Il te reste moins d'une heure pour payer ${o.price} USDT, sinon la demande expire.` : `⏰ <b>${esc(c.title)}</b> approved your ad, but it is not paid yet. You have less than an hour left to pay ${o.price} USDT, or the request expires.`, [[{ text: fr ? "💳 Payer ma pub" : "💳 Pay my ad", web_app: { url: appUrl("?pay=" + o.id) } }]], false); } catch {}
      }
    }
    for (const o of Object.values<any>(db.orders)) {
      if (o.status === "approved") {
        if (now - o.approvedAt > PAY_WINDOW_H * 3600e3) {
          o.status = "expired"; save();
          try { await say(o.adv, TX[L(db.users[o.adv])].expired, undefined, false); } catch {}
          continue;
        }
        if (!o.txRequestedAt) continue;
        if (!o.plan) continue;
        const pub = BigInt(o.plan.pub), platform = BigInt(o.plan.platform);
        const comment = `ad#${o.id}`;
        try {
          const since = Math.floor(o.txRequestedAt / 1000);
          const found: any[] = [];
          const tp = await findTransfer(o.pubWallet, comment, pub, since);
          if (!tp) continue;
          found.push(tp);
          let tf: any = null;
          if (platform > 0n) { tf = await findTransfer(PLATFORM_WALLET, comment, platform, since); if (!tf) continue; found.push(tf); }
          let missing = false; const trs: any[] = [];
          for (const r of o.plan.refs) { const tr = await findTransfer(r.wallet, comment, BigInt(r.amount), since); if (!tr) { missing = true; break; } found.push(tr); trs.push(tr); }
          if (missing) continue;
          for (const f of found) db.usedTx[f.transaction_hash] = o.id;
          o.txs = { pub: txHex(tp.transaction_hash), platform: tf ? txHex(tf.transaction_hash) : null, refs: trs.map(x => txHex(x.transaction_hash)) };
          o.paidAt = now; o.status = "paid"; save();
          const c = db.channels[o.ch];
          await postAd(o);
          try { await say(c.owner, TX[L(db.users[c.owner])].pubPaid(c.title, fmt(pub)), undefined, false); } catch {}
          for (const r of o.plan.refs) {
            const ru = db.users[r.uid]; if (!ru) continue;
            ru.refEarned = String(BigInt(ru.refEarned || 0) + BigInt(r.amount)); save();
            try { await say(ru.id, TX[L(ru)].refEarned(fmt(BigInt(r.amount)), c.title), undefined, false); } catch {}
          }
          await notifyOwner(`💰 Pub #${o.id} payée : ${o.price} USDT sur ${c.title} · ta commission : ${fmt(platform)} USDT${o.plan.refs.length ? ` (parrains : ${o.plan.refs.map((r: any) => fmt(BigInt(r.amount))).join(" + ")} USDT)` : ""}`);
        } catch (e: any) { console.error("check", o.id, e.message); }
        await new Promise(r => setTimeout(r, 1200)); // limite toncenter sans clé
      }
      // 12 nov 2026 (Jeremy): every 30 min, check the ad is still on the channel (an unchanged edit answers "not modified" if it is there)
      if (o.status === "posted" && now - o.postedAt < AD_HOURS * 3600e3 - 10 * 60e3 && now - (o.checkedAt || o.postedAt) > 30 * 60e3) {
        o.checkedAt = now;
        const c = db.channels[o.ch];
        let gone = false;
        try { await tg("editMessageReplyMarkup", { chat_id: c.id, message_id: o.postedMsgId, reply_markup: { inline_keyboard: [[{ text: o.btnText, url: `${PUBLIC_URL}/r/${o.id}` }]] } }); }
        catch (e: any) { gone = /message to edit not found|message_id_invalid|MESSAGE_ID_INVALID/i.test(e.message); }
        if (gone) {
          o.status = "removed_early"; o.endedAt = now;
          c.clicks = (c.clicks || 0) + o.clicks; c.broken = (c.broken || 0) + 1; c.banned = true; c.listed = false; save();
          const h = hhmm(o.postedAt + AD_HOURS * 3600e3);
          const adv = db.users[o.adv], own = db.users[c.owner];
          try { await say(o.adv, L(adv) === "fr" ? `⚠️ Ta pub sur <b>${esc(c.title)}</b> a été supprimée par le propriétaire avant la fin des 24 h (il restait ${h}).\n\nLa chaîne est retirée du catalogue. 👆 ${o.clicks} clics avant la suppression.\n\nPour être aidé : https://t.me/jeremstyke?direct` : `⚠️ Your ad on <b>${esc(c.title)}</b> was deleted by the owner before the 24h ended (${h} left).\n\nThe channel has been removed from the catalog. 👆 ${o.clicks} clicks before it was deleted.\n\nNeed help: https://t.me/jeremstyke?direct`, undefined, false); } catch {}
          try { await say(c.owner, L(own) === "fr" ? `⚠️ La pub de la commande #${o.id} a été supprimée de <b>${esc(c.title)}</b> avant 24 h.\n\n🚫 Ta chaîne est <b>désactivée</b> sur PostPay jusqu'à sa réactivation par notre équipe. Pour la demander, écris à https://t.me/jeremstyke?direct` : `⚠️ The ad of order #${o.id} was deleted from <b>${esc(c.title)}</b> before 24h.\n\n🚫 Your channel is <b>disabled</b> on PostPay until our team reactivates it. To ask for it, write to https://t.me/jeremstyke?direct`, undefined, false); } catch {}
          await askApproval(c, own);
          continue;
        }
      }
      if (o.status === "posted" && now - o.postedAt > AD_HOURS * 3600e3) {
        const c = db.channels[o.ch];
        try { await tg("deleteMessage", { chat_id: c.id, message_id: o.postedMsgId }); } catch (e: any) { console.error("delete", o.id, e.message); }
        o.status = "done"; o.endedAt = now;
        c.clicks = (c.clicks || 0) + o.clicks; c.kept = (c.kept || 0) + 1;
        save();
        try { await say(o.adv, TX[L(db.users[o.adv])].results(c.title, o.clicks, o.price), [[{ text: TX[L(db.users[o.adv])].browse, web_app: { url: appUrl() } }]]); } catch {}
        try { await say(c.owner, TX[L(db.users[c.owner])].pubResults(c.title, o.clicks), undefined, false); } catch {}
      }
    }
    // Rafraîchit le nombre d'abonnés toutes les 6 h
    for (const c of Object.values<any>(db.channels)) {
      if (c.listed && (!c.membersAt || now - c.membersAt > 6 * 3600e3)) { await refreshMembers(c); save(); }
    }
  } finally { checking = false; }
}
setInterval(tick, 20_000);

// ---------- Mini app ----------
function checkInitData(initData: string): any | null {
  try {
    const p = new URLSearchParams(initData);
    const hash = p.get("hash"); if (!hash) return null;
    p.delete("hash");
    const dcs = [...p.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join("\n");
    const secret = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
    const calc = crypto.createHmac("sha256", secret).update(dcs).digest("hex");
    if (calc !== hash) return null;
    if (Date.now() / 1000 - Number(p.get("auth_date") || 0) > 86400) return null;
    return JSON.parse(p.get("user") || "null");
  } catch { return null; }
}
function publicChannel(c: any) {
  const cpc = c.clicks ? c.earned / c.clicks : null;
  const sl = slotOf(c);
  return { id: c.id, title: c.title, username: c.username, type: c.type, members: c.members || 0, price: c.price, theme: c.theme, lang: c.lang, ads: c.ads || 0, perDay: c.perDay || 1, cpc: cpc ? Math.round(cpc * 1000) / 1000 : null, kept: c.kept || 0, free: sl.ok, next: sl.ok ? null : (sl.at ? hhmm(sl.at) : "") };
}
const json = (o: any, status = 200) => Response.json(o, { status, headers: { "Access-Control-Allow-Origin": "*" } });

async function api(req: Request, url: URL) {
  if (url.pathname === "/api/channels") {
    const list = Object.values<any>(db.channels).filter(c => c.listed && !c.removed && !c.banned && c.approved !== false && c.price).map(publicChannel).sort((a, b) => b.members - a.members);
    return json({ channels: list, fee: FEE_PCT, payEnabled: !!PLATFORM_WALLET || FEE_PCT === 0 });
  }
  // 12 nov 2026 (Jeremy): stats for his dashboard and the Pass The Baton task, read from Supabase with a secret key
  if ((url.pathname === "/api/admin" || url.pathname === "/api/owner") && PP_KEY && url.searchParams.get("k") === PP_KEY) {
    if (url.pathname === "/api/owner") {
      const uid = String(url.searchParams.get("uid") || "");
      const mine = Object.values<any>(db.channels).filter(c => c.owner === uid && !c.removed);
      // 12 nov 2026 (Jeremy): the Pass The Baton task is done once one of his channels is approved
      return json({ n: mine.filter(c => c.approved !== false && !c.banned).length, wait: mine.filter(c => c.approved === false && !c.rejected).length, wallet: !!db.users[uid]?.wallet });
    }
    const day = (t: any) => new Date(t).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" });
    const today = day(Date.now()), wk = Date.now() - 7 * 864e5;
    const users = Object.values<any>(db.users).filter(u => !isOwner(u));
    const chs = Object.values<any>(db.channels).filter(c => !c.removed);
    const ord = Object.values<any>(db.orders).filter(o => o.status !== "cancelled");
    const paid = ord.filter(o => PAIDS.includes(o.status));
    const sum = (l: any[], f: (o: any) => number) => Math.round(l.reduce((a, o) => a + f(o), 0) * 100) / 100;
    const feeOf = (o: any) => o.plan ? Number(BigInt(o.plan.platform)) / 1e6 : Number(split(o.price).fee) / 1e6;
    const pAt = (o: any) => o.paidAt || o.postedAt || o.created;
    const src: any = {}; for (const u of users) { const k = u.src || "direct"; src[k] = (src[k] || 0) + 1; }
    const byS: any = {}; for (const o of ord) byS[o.status] = (byS[o.status] || 0) + 1;
    return json({
      users: users.length, new_today: users.filter(u => day(u.created) === today).length, new_7d: users.filter(u => Date.parse(u.created) > wk).length,
      wallets: users.filter(u => u.wallet).length,
      channels: chs.length, channels_7d: chs.filter(c => Date.parse(c.created) > wk).length, reach: chs.reduce((a, c) => a + (c.members || 0), 0),
      owners: new Set(chs.map(c => c.owner)).size,
      requests: ord.filter(o => !String(o.status).startsWith("await")).length, by_status: byS,
      paid: paid.length, paid_7d: paid.filter(o => pAt(o) > wk).length, paid_today: paid.filter(o => day(pAt(o)) === today).length,
      live: ord.filter(o => o.status === "posted").length,
      volume: sum(paid, o => o.price), volume_7d: sum(paid.filter(o => pAt(o) > wk), o => o.price), volume_today: sum(paid.filter(o => day(pAt(o)) === today), o => o.price),
      fee: sum(paid, feeOf), fee_7d: sum(paid.filter(o => pAt(o) > wk), feeOf),
      clicks: paid.reduce((a, o) => a + (o.clicks || 0), 0),
      top: chs.sort((a, b) => (b.members || 0) - (a.members || 0)).slice(0, 15).map(c => ({ t: c.title, u: c.username, m: c.members || 0, p: c.price, ads: c.ads || 0, cl: c.clicks || 0, l: !!c.listed })),
      sources: Object.entries(src).map(([k, n]) => ({ src: k, n })).sort((a: any, b: any) => b.n - a.n).slice(0, 15),
      last: ord.sort((a, b) => b.created - a.created).slice(0, 10).map(o => ({ at: o.created, ch: db.channels[o.ch]?.title || "?", p: o.price, s: o.status, cl: o.clicks || 0 })),
    });
  }
  if (req.method !== "POST") return json({ error: "method" }, 405);
  const body: any = await req.json().catch(() => ({}));
  const tu = checkInitData(body.initData || "");
  if (!tu) return json({ error: "auth" }, 401);
  const { u } = getUser(tu);
  // 14 nov 2026 (Jeremy): the ad form was opened. Remembered so the bot can remind people who did not finish.
  if (url.pathname === "/api/draft") {
    const c = db.channels[String(body.channelId)];
    if (!c || !c.listed || c.banned || c.owner === u.id) return json({ ok: false });
    if (!u.draft || u.draft.ch !== c.id) { u.draft = { ch: c.id, at: Date.now(), n: 0 }; save(); }
    return json({ ok: true });
  }
  if (url.pathname === "/api/order") {
    const c = db.channels[String(body.channelId)];
    if (!c || !c.listed || c.banned || c.approved === false) return json({ error: "channel" }, 404);
    if (c.owner === u.id) return json({ error: "own" }, 400);
    if (!slotOf(c).ok) return json({ error: "busy" }, 400);
    const cur = activeOrderOf(u);
    if (cur && cur.status.startsWith("await")) cur.status = "cancelled";
    // 13 nov 2026 (Jeremy): the ad can be written right in the mini app (text + button), no need to go to the bot chat
    if (body.text !== undefined) {
      const text = String(body.text || "").trim(), bt = String(body.btnText || "").trim(), bu = normUrl(String(body.btnUrl || ""));
      const photo = typeof body.photo === "string" && body.photo.startsWith("data:image/") ? body.photo : "";
      if (!u.draft || u.draft.ch !== c.id) { u.draft = { ch: c.id, at: Date.now(), n: 0 }; save(); }
      if (!text || text.length > (photo ? 1024 : 3500)) return json({ error: "text" }, 400);
      if (!bt || bt.length > 40) return json({ error: "btn" }, 400);
      if (!bu) return json({ error: "url" }, 400);
      if (isBanned(text) || isBanned(bt) || isBanned(bu)) return json({ error: "banned" }, 400);
      const o = newOrder(u, c);
      u.state = null;
      try {
        const m = photo ? await tgPhoto(u.id, photo, text) : await tg("sendMessage", { chat_id: u.id, text, disable_web_page_preview: true });
        await say(u.id, L(u) === "fr" ? "👆 Voici ta pub, elle part en validation chez le propriétaire de la chaîne." : "👆 Here is your ad, it was sent to the channel owner for approval.", undefined, false);
        delete u.draft;
        o.msgId = m.message_id; o.preview = text.slice(0, 200); o.btnText = bt; o.btnUrl = bu; save();
        await sendForApproval(o);
      } catch (e: any) { console.error("approval", e.message); o.status = "failed"; save(); return json({ error: "send" }, 500); }
      await notifyOwner(`🛒 Demande de pub #${o.id} : ${c.title} · ${o.price} USDT · par ${esc(u.first_name)}${u.username ? " @" + u.username : ""} (appli)`);
      return json({ ok: true, order: o.id, inApp: true });
    }
    return json({ error: "text" }, 400);
  }
  // 13 nov 2026 (Jeremy): everything manageable in the mini app: my orders, requests received, admin review
  if (url.pathname === "/api/orders") {
    const st = (o: any) => ({ id: o.id, ch: db.channels[o.ch]?.title || "?", u: db.channels[o.ch]?.username || null, price: o.price, s: o.status, at: o.created, preview: o.preview || "", btnText: o.btnText || "", btnUrl: o.btnUrl || "", clicks: o.clicks || 0, link: o.postedMsgId && db.channels[o.ch]?.username ? `https://t.me/${db.channels[o.ch].username}/${o.postedMsgId}` : "" });
    const all = Object.values<any>(db.orders);
    const mineO = all.filter(o => o.adv === u.id && o.status !== "cancelled" && !String(o.status).startsWith("await")).sort((a, b) => b.created - a.created).slice(0, 30).map(st);
    const reqs = all.filter(o => db.channels[o.ch]?.owner === u.id && ["pending", "approved", "posted"].includes(o.status)).sort((a, b) => b.created - a.created).map(o => ({ ...st(o), you: fmt(split(o.price).pub) }));
    const out: any = { orders: mineO, requests: reqs, wallet: !!u.wallet };
    if (isOwner(u)) out.review = Object.values<any>(db.channels).filter(c => !c.removed && ((c.approved === false && !c.rejected) || c.banned)).map(c => ({ id: c.id, title: c.title, username: c.username, members: c.members || 0, price: c.price, perDay: c.perDay || 1, banned: !!c.banned, owner: (db.users[c.owner]?.first_name || "") + (db.users[c.owner]?.username ? " @" + db.users[c.owner].username : "") }));
    return json(out);
  }
  if (url.pathname === "/api/decide") {
    const r = await decideAd(u, String(body.orderId), !!body.ok);
    return r === "ok" ? json({ ok: true }) : json({ error: r }, 400);
  }
  if (url.pathname === "/api/review") {
    const c = db.channels[String(body.id)];
    if (!isOwner(u) || !c) return json({ error: "forbidden" }, 403);
    await reviewChannel(u, c, !!body.ok);
    return json({ ok: true });
  }
  if (url.pathname === "/api/pay") {
    const o = db.orders[String(body.orderId)];
    if (!o || o.adv !== u.id) return json({ error: "order" }, 404);
    const c = db.channels[o.ch];
    const s = split(o.price);
    return json({ id: o.id, status: o.status, channel: c.title, price: o.price, btnText: o.btnText, preview: o.preview || "", fee: fmt(s.fee), pub: fmt(s.pub) });
  }
  if (url.pathname === "/api/earn") {
    let ch = 0n, n = 0;
    for (const o of Object.values<any>(db.orders)) {
      if (db.channels[o.ch]?.owner !== u.id || !PAIDS.includes(o.status)) continue;
      ch += o.plan ? BigInt(o.plan.pub) : split(o.price).pub; n++;
    }
    const ref = BigInt(u.refEarned || 0);
    const hist: any[] = [];
    for (const o of Object.values<any>(db.orders)) {
      if (!PAIDS.includes(o.status)) continue;
      const c = db.channels[o.ch]; const at = o.paidAt || o.postedAt || o.created;
      if (c?.owner === u.id) hist.push({ t: "ch", at, title: c.title, amount: fmt(o.plan ? BigInt(o.plan.pub) : split(o.price).pub), tx: o.txs?.pub || null });
    }
    hist.sort((a, b) => b.at - a.at);
    return json({ hist: hist.slice(0, 50), ch: fmt(ch), ads: n, ref: fmt(ref), total: fmt(ch + ref), refs: Object.values<any>(db.users).filter(x => x.ref === u.id).length, link: refLink(u), wallet: u.wallet, refPct: REF_PCT, feePct: FEE_PCT });
  }
  if (url.pathname === "/api/mine") {
    const mine = Object.values<any>(db.channels).filter(c => c.owner === u.id && !c.removed);
    return json({ channels: mine.map(c => ({ id: c.id, title: c.title, username: c.username, members: c.members || 0, price: c.price || 0, perDay: c.perDay || 1, listed: !!c.listed, ready: !!(c.price && c.theme), max: maxPrice(c.members), ads: c.ads || 0, theme: c.theme || "other", lang: c.lang || "other", st: c.banned ? "ban" : c.rejected ? "no" : c.approved === false ? "wait" : "ok", link: sellLink(c) })), wallet: u.wallet });
  }
  if (url.pathname === "/api/channel") {
    const c = db.channels[String(body.id)];
    if (!c || c.owner !== u.id || c.removed) return json({ error: "channel" }, 404);
    const max = maxPrice(c.members);
    if (body.price !== undefined) {
      const p = Number(String(body.price).replace(",", "."));
      if (!isFinite(p) || p < 0.5 || p > max) return json({ error: "price", max }, 400);
      c.price = Math.round(p * 100) / 100;
    }
    if (body.perDay !== undefined) c.perDay = Math.min(5, Math.max(1, Number(body.perDay) || 1));
    if (THEMES.includes(body.theme)) c.theme = body.theme;
    if (LANGS.includes(body.lang)) c.lang = body.lang;
    save();
    return json({ ok: true, price: c.price, perDay: c.perDay, listed: !!c.listed });
  }
  if (url.pathname === "/api/wallet") {
    const a = parseAddr(body.address);
    if (!a) return json({ error: "address" }, 400);
    await setWallet(u, a);
    return json({ ok: true, wallet: u.wallet });
  }
  if (url.pathname === "/api/tx") {
    const o = db.orders[String(body.orderId)];
    if (!o || o.adv !== u.id || o.status !== "approved") return json({ error: "order" }, 400);
    const payer = parseAddr(body.owner);
    if (!payer) return json({ error: "address" }, 400);
    const jw = await usdtWalletOf(payer).catch(() => null);
    const p = planOf(o);
    if (!jw) return json({ error: "no_usdt" }, 400);
    if (jw.balance < p.total) return json({ error: "balance", balance: fmt(jw.balance) }, 400);
    const comment = `ad#${o.id}`;
    const msg = (amt: bigint, to: string) => ({ address: jw.address.toString(), amount: "50000000", payload: jettonTransferBody(amt, Address.parse(to), payer, comment).toBoc().toString("base64") });
    const msgs = [msg(p.pub, o.pubWallet)];
    if (p.platform > 0n) msgs.push(msg(p.platform, PLATFORM_WALLET));
    for (const r of p.refs) msgs.push(msg(r.amount, r.wallet));
    o.plan = { pub: p.pub.toString(), platform: p.platform.toString(), refs: p.refs.map(r => ({ uid: r.uid, wallet: r.wallet, amount: r.amount.toString() })) };
    o.payer = payer.toRawString(); o.txRequestedAt = Date.now(); save();
    return json({ validUntil: Math.floor(Date.now() / 1000) + 600, messages: msgs });
  }
  return json({ error: "not found" }, 404);
}

const photoCache = new Map<string, any>();
async function channelPhoto(id: string) {
  const c = db.channels[id];
  if (!c || c.removed) return new Response("Not found", { status: 404 });
  const hit = photoCache.get(id);
  if (hit && Date.now() - hit.at < (hit.buf ? 6 * 3600e3 : 600e3)) return hit.buf ? new Response(hit.buf, { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=21600" } }) : new Response("No photo", { status: 404 });
  let buf: any = null;
  try {
    const chat = await tg("getChat", { chat_id: c.id });
    const fid = chat.photo?.small_file_id;
    if (fid) {
      const f = await tg("getFile", { file_id: fid });
      const r = await fetch(`https://api.telegram.org/file/bot${BOT_TOKEN}/${f.file_path}`);
      if (r.ok) buf = new Uint8Array(await r.arrayBuffer());
    }
  } catch {}
  photoCache.set(id, { buf, at: Date.now() });
  return buf ? new Response(buf, { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=21600" } }) : new Response("No photo", { status: 404 });
}

function trackClick(req: Request, id: string) {
  const o = db.orders[id];
  if (!o || !o.btnUrl) return new Response("Not found", { status: 404 });
  const ua = req.headers.get("user-agent") || "";
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "";
  const bot = /bot|crawl|spider|preview|telegram|facebookexternalhit|slurp|curl|wget|python|headless/i.test(ua) || !ua;
  if (!bot && o.status === "posted") {
    const key = crypto.createHash("sha256").update(ip + "|" + ua).digest("hex").slice(0, 16);
    if (!o.clickers[key]) { o.clickers[key] = 1; o.clicks++; save(); }
  }
  return Response.redirect(o.btnUrl, 302);
}

// 13 nov 2026: the mini app page lives on GitHub Pages (postpay/app.html) to keep this file small; reloaded every 10 min
let APP_HTML = "";
async function loadApp() { try { const r = await fetch("https://jeremstyke.github.io/postpay/app.html?t=" + Date.now()); if (r.ok) APP_HTML = await r.text(); } catch (e: any) { console.error("app", e.message); } }
await loadApp(); setInterval(loadApp, 10 * 60e3);

// ---------- HTTP ----------
Bun.serve({
  port: PORT,
  idleTimeout: 60,
  async fetch(req) {
    const url = new URL(req.url);
    try {
      if (url.pathname === "/" ) return Response.redirect(`https://t.me/${BOT_USERNAME}?start=src_web`, 302);
      if (url.pathname === "/app") { if (!APP_HTML) await loadApp(); return new Response(APP_HTML.replaceAll("__BOT__", BOT_USERNAME), { headers: { "Content-Type": "text/html; charset=utf-8" } }); }
      if (url.pathname === "/tonconnect-manifest.json") return json({ url: PUBLIC_URL, name: BOT_NAME, iconUrl: `${PUBLIC_URL}/icon.png` });
      if (url.pathname === "/icon.png") return Response.redirect("https://jeremstyke.github.io/postpay/icon.png", 302);
      if (url.pathname.startsWith("/r/")) return trackClick(req, url.pathname.slice(3));
      if (url.pathname.startsWith("/photo/")) return await channelPhoto(decodeURIComponent(url.pathname.slice(7)));
      if (url.pathname.startsWith("/api/")) return await api(req, url);
      return new Response("Not found", { status: 404 });
    } catch (e: any) { console.error("http", url.pathname, e.message); return json({ error: "server" }, 500); }
  },
});

// ---------- Démarrage ----------
async function setupBot() {
  try { const me = await tg("getMe"); BOT_USERNAME = me.username; BOT_NAME = me.first_name; } catch (e: any) { console.error("getMe", e.message); }
  const calls: [string, any][] = [
    ["setMyShortDescription", { short_description: "Buy and sell ads in Telegram channels. Pay in USDT, direct to the channel owner." }],
    ["setMyDescription", { description: "The marketplace to buy and sell ads in Telegram channels.\n\nAdvertisers: pick a channel, pay in USDT, your ad is posted automatically with your button.\nChannel owners: set your price, approve each ad, get paid in USDT straight to your wallet." }],
    ["setMyShortDescription", { language_code: "fr", short_description: "Achetez et vendez de la pub dans les chaînes Telegram. Paiement en USDT, direct au propriétaire." }],
    ["setMyDescription", { language_code: "fr", description: "La marketplace pour acheter et vendre de la pub dans les chaînes Telegram.\n\nAnnonceurs : choisissez une chaîne, payez en USDT, votre pub est publiée automatiquement avec votre bouton.\nPropriétaires : fixez votre prix, validez chaque pub, recevez les USDT directement sur votre wallet." }],
    ["setMyCommands", { commands: [{ command: "start", description: "Open PostPay" }] }],
    ["setMyCommands", { language_code: "fr", commands: [{ command: "start", description: "Ouvrir PostPay" }] }],
    ["setChatMenuButton", { menu_button: { type: "web_app", text: "PostPay", web_app: { url: appUrl() } } }],
  ];
  for (const [m, p] of calls) { try { await tg(m, p); } catch (e: any) { console.error(m, e.message); } }
}
for (const c of Object.values<any>(db.channels)) if (c.approved === undefined) c.approved = true;
for (const c of Object.values<any>(db.channels)) if (!c.removed && !c.banned && c.price && !c.listed) { c.listed = true; c.theme ||= "other"; c.lang ||= "other"; }
save();
console.log(`Marketplace ready on port ${PORT}`);
await setupBot();
pollUpdates();

