// Hoplien : création de liens courts et signalements. La redirection passe par la fonction SQL hop_go (appelée par le Worker Cloudflare).
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const ORIGINS = ["https://hoplien.fr", "https://www.hoplien.fr", "https://jeremstyke.github.io", "http://localhost:8766"];
const SITE = "https://hoplien.fr";
const ALPHA = "abcdefghjkmnpqrstuvwxyz23456789";
const RESERVES = new Set(["admin", "login", "guide", "guides", "aide", "stats", "about", "media", "image", "debug", "compte", "signaler", "bloque", "introuvable", "mentions-legales", "assets", "sitemap", "robots", "api", "contact", "cgu", "confidentialite", "hoplien", "www", "favicon", "static", "app", "connexion", "inscription", "faq", "blog", "pro", "tarifs", "prix", "aide-en-ligne", "support", "admin-hop"]);
const SLUG = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/;
function slugifier(x: string) { return String(x || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 40); }
const MAX_HEURE = 20, MAX_JOUR = 80;

function cors(req: Request) {
  const o = req.headers.get("origin") || "";
  return { "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : SITE, "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST,OPTIONS", "Vary": "Origin" };
}
async function sha(s: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function code() { const a = new Uint8Array(5); crypto.getRandomValues(a); return [...a].map((x) => ALPHA[x % ALPHA.length]).join(""); }

// Nettoie et valide le lien ; renvoie l'URL propre ou un motif de refus
function nettoyer(brut: string): { url?: string; hote?: string; refus?: string } {
  let v = String(brut || "").trim().replace(/[\u0000-\u001f\u007f]/g, "");
  if (!v) return { refus: "vide" };
  if (v.length > 2000) return { refus: "long" };
  if (!/^[a-z][a-z0-9+.-]*:/i.test(v)) v = "https://" + v;
  let u: URL;
  try { u = new URL(v); } catch { return { refus: "invalide" }; }
  if (u.protocol !== "https:" && u.protocol !== "http:") return { refus: "protocole" };
  if (u.username || u.password) return { refus: "identifiants" };
  const h = u.hostname.toLowerCase().replace(/\.$/, "");
  if (!h.includes(".") || /^[\d.]+$/.test(h) || h.includes(":") || h === "localhost" || /\.(local|internal|localhost)$/.test(h)) return { refus: "invalide" };
  return { url: u.toString(), hote: h.replace(/^www\./, "") };
}
async function bloque(hote: string) {
  const parts = hote.split("."), cands: string[] = [];
  for (let i = 0; i < parts.length - 1; i++) cands.push(parts.slice(i).join("."));
  const { data } = await sb.from("hop_bloques").select("hote,motif").in("hote", cands).limit(1);
  return data && data.length ? data[0] : null;
}
// Vérification Google Safe Browsing, si une clé est configurée (tm_cfg.gsb_key)
let GSB = "";
async function gsbCle() {
  if (GSB) return GSB;
  GSB = Deno.env.get("GSB_KEY") || "";
  if (!GSB) { const { data } = await sb.from("tm_cfg").select("v").eq("k", "gsb_key").maybeSingle(); GSB = data?.v || "-"; }
  return GSB;
}
async function dangereux(url: string) {
  const k = await gsbCle();
  if (!k || k === "-") return false;
  try {
    const r = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${k}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      client: { clientId: "hoplien", clientVersion: "1.0" },
      threatInfo: { threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"], platformTypes: ["ANY_PLATFORM"], threatEntryTypes: ["URL"], threatEntries: [{ url }] } }) });
    if (!r.ok) return false;
    const j = await r.json();
    return !!(j.matches && j.matches.length);
  } catch { return false; }
}
async function alerte(sujet: string, lignes: string[]) {
  try {
    const { data } = await sb.from("tm_cfg").select("v").eq("k", "resend_qoaq").maybeSingle();
    if (!data?.v) return;
    await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${data.v}`, "Content-Type": "application/json" }, body: JSON.stringify({
      from: "Alertes Jérémy <alertes@qui-offre-a-qui.fr>", to: ["juryjeremy@gmail.com"], subject: sujet, text: lignes.join("\n") }) });
  } catch { /* rien */ }
}

// Comptes sans mot de passe : jeton signé envoyé par e-mail
const SECRET = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "x";
const EMAIL = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[a-z]{2,24}$/i;
const b64u = (x: string) => btoa(unescape(encodeURIComponent(x))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const deb64u = (x: string) => { try { return decodeURIComponent(escape(atob(x.replace(/-/g, "+").replace(/_/g, "/")))); } catch { return ""; } };
async function jeton(email: string) { const exp = Math.floor(Date.now() / 1000) + 180 * 86400; return `${b64u(email)}.${exp}.${(await sha(`hopc|${email}|${exp}|${SECRET}`)).slice(0, 32)}`; }
async function lireJeton(t: string) {
  const m = /^([A-Za-z0-9_-]{4,400})\.(\d{9,11})\.([a-f0-9]{32})$/.exec(String(t || ""));
  if (!m || +m[2] < Date.now() / 1000) return null;
  const e = deb64u(m[1]).toLowerCase();
  if (!EMAIL.test(e) || (await sha(`hopc|${e}|${m[2]}|${SECRET}`)).slice(0, 32) !== m[3]) return null;
  return e;
}
function cle() { const a = new Uint8Array(12); crypto.getRandomValues(a); return [...a].map((x) => x.toString(16).padStart(2, "0")).join(""); }
async function envoyer(to: string, sujet: string, html: string, text: string) {
  const { data } = await sb.from("tm_cfg").select("v").eq("k", "resend_qoaq").maybeSingle();
  if (!data?.v) return false;
  for (const from of ["Hoplien <connexion@hoplien.fr>", "Hoplien <hoplien@qui-offre-a-qui.fr>"]) {
    try {
      const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${data.v}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [to], subject: sujet, html, text }) });
      if (r.ok) return true;
      console.log("resend", from, (await r.text()).slice(0, 200));
    } catch (e) { console.log("resend", String(e).slice(0, 200)); }
  }
  return false;
}
async function mesLiens(email: string) {
  const { data: ls } = await sb.from("hop_links").select("code,url,created_at,clicks,last_click,statut").eq("compte", email).order("created_at", { ascending: false }).limit(300);
  const codes = (ls || []).map((x) => x.code);
  const depuis = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
  const { data: cs } = codes.length ? await sb.from("hop_clicks").select("code,day,n").in("code", codes).gte("day", depuis) : { data: [] as any[] };
  const parCode: Record<string, Record<string, number>> = {};
  (cs || []).forEach((c: any) => { (parCode[c.code] ||= {})[c.day] = c.n; });
  return (ls || []).map((l) => ({ ...l, jours: parCode[l.code] || {} }));
}

Deno.serve(async (req) => {
  const H = cors(req);
  const J = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...H, "Content-Type": "application/json", "Cache-Control": "no-store" } });
  if (req.method === "OPTIONS") return new Response(null, { headers: H });
  if (req.method !== "POST") return J({ ok: false }, 405);
  let b: any;
  try { b = await req.json(); } catch { return J({ ok: false, raison: "format" }, 400); }
  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "?";
  const ipH = await sha("hop|" + ip);

  if (b.action === "signaler") {
    const m = /([a-z0-9-]{3,40})\/?$/.exec(String(b.code || "").trim().toLowerCase());
    if (!m) return J({ ok: false, raison: "code" }, 400);
    const { count } = await sb.from("hop_reports").select("id", { count: "exact", head: true }).eq("ip_hash", ipH).gte("created_at", new Date(Date.now() - 3600e3).toISOString());
    if ((count || 0) >= 10) return J({ ok: false, raison: "limite" }, 429);
    const { data: l } = await sb.from("hop_links").select("code,url,statut").eq("code", m[1]).maybeSingle();
    if (!l) return J({ ok: false, raison: "inconnu" }, 404);
    await sb.from("hop_reports").insert({ code: l.code, motif: String(b.motif || "").slice(0, 300), ip_hash: ipH });
    const { data: rs } = await sb.from("hop_reports").select("ip_hash").eq("code", l.code);
    const n = new Set((rs || []).map((x) => x.ip_hash)).size;
    if (n >= 3 && l.statut === "ok") await sb.from("hop_links").update({ statut: "bloque", raison: "signalements" }).eq("code", l.code);
    await alerte(`🚩 Hoplien : lien signalé (${l.code})`, [`Lien : ${SITE}/${l.code}`, `Destination : ${l.url}`, `Motif : ${String(b.motif || "non précisé").slice(0, 300)}`, `Signalements : ${n}${n >= 3 ? " (bloqué automatiquement)" : ""}`]);
    return J({ ok: true });
  }

  if (b.action === "connexion") {
    const em = String(b.email || "").trim().toLowerCase().slice(0, 254);
    if (!EMAIL.test(em)) return J({ ok: false, raison: "email" }, 400);
    const eh = await sha("hope|" + em), dep = new Date(Date.now() - 3600e3).toISOString();
    const { count: ni } = await sb.from("hop_envois").select("id", { count: "exact", head: true }).eq("ip_hash", ipH).gte("at", dep);
    const { count: ne } = await sb.from("hop_envois").select("id", { count: "exact", head: true }).eq("email_hash", eh).gte("at", dep);
    if ((ni || 0) >= 8 || (ne || 0) >= 3) return J({ ok: false, raison: "limite" }, 429);
    await sb.from("hop_envois").insert({ email_hash: eh, ip_hash: ipH });
    const url = `${SITE}/compte/#t=${await jeton(em)}`;
    const html = `<!doctype html><html lang="fr"><body style="margin:0;background:#EDF1FF"><div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;background:#fff;color:#12173A;padding:28px 24px"><p style="margin:0 0 18px;font-size:22px;font-weight:bold">hop<span style="color:#2F4BFF">/</span>lien</p><h1 style="font-size:22px;margin:0 0 12px">Votre lien de connexion</h1><p style="font-size:15px;line-height:1.5;margin:0 0 20px">Cliquez sur le bouton pour ouvrir votre compte Hoplien : vous y retrouvez tous vos liens courts et leurs clics. Pas de mot de passe à retenir.</p><p style="margin:0 0 24px"><a href="${url}" style="display:inline-block;background:#2F4BFF;color:#fff;text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:12px">Ouvrir mon compte</a></p><p style="font-size:13px;color:#5A6185;line-height:1.5;margin:0">Ce lien reste valable 6 mois sur l'appareil où vous l'ouvrez. Vous n'avez rien demandé ? Ignorez ce message : sans clic, rien ne se passe.</p></div></body></html>`;
    const ok = await envoyer(em, "Votre lien de connexion Hoplien", html, `Ouvrez votre compte Hoplien : ${url}\n\nVous n'avez rien demandé ? Ignorez ce message.`);
    return J({ ok });
  }
  if (b.action === "moi" || b.action === "supprimer") {
    const em = await lireJeton(b.t);
    if (!em) return J({ ok: false, raison: "jeton" }, 401);
    await sb.from("hop_comptes").upsert({ email: em, last_login: new Date().toISOString() }, { onConflict: "email" });
    if (b.action === "supprimer") {
      const c = String(b.code || "");
      if (SLUG.test(c)) await sb.from("hop_links").delete().eq("code", c).eq("compte", em);
    } else {
      const rat = (Array.isArray(b.liens) ? b.liens.slice(0, 100) : []).filter((x: any) => /^[a-z0-9]{5}$/.test(x?.code) && /^[a-f0-9]{24}$/.test(x?.cle));
      for (const x of rat) await sb.from("hop_links").update({ compte: em }).eq("code", x.code).eq("cle", x.cle).is("compte", null);
    }
    return J({ ok: true, email: em, liens: await mesLiens(em) });
  }

  if (b.action !== "creer") return J({ ok: false }, 400);
  const c = nettoyer(b.url);
  if (c.refus) return J({ ok: false, raison: c.refus }, 400);
  const bl = await bloque(c.hote!);
  if (bl) return J({ ok: false, raison: bl.motif === "raccourcisseur" ? "raccourcisseur" : bl.motif === "boucle" ? "boucle" : "interdit" }, 400);

  const depuisH = new Date(Date.now() - 3600e3).toISOString(), depuisJ = new Date(Date.now() - 86400e3).toISOString();
  const { data: deja } = await sb.from("hop_links").select("code").eq("ip_hash", ipH).eq("url", c.url!).eq("statut", "ok").gte("created_at", depuisJ).limit(1);
  const compte = b.t ? await lireJeton(b.t) : null;
  let alias = "";
  if (b.alias) {
    if (!compte) return J({ ok: false, raison: "compte" }, 401);
    alias = slugifier(b.alias);
    if (!SLUG.test(alias)) return J({ ok: false, raison: "alias" }, 400);
    if (RESERVES.has(alias)) return J({ ok: false, raison: "reserve" }, 400);
    const { data: pris } = await sb.from("hop_links").select("code").eq("code", alias).maybeSingle();
    if (pris) return J({ ok: false, raison: "pris", alias }, 409);
  }
  if (deja && deja.length && !compte) return J({ ok: true, code: deja[0].code, court: `${SITE}/${deja[0].code}`, url: c.url, deja: true });
  const { count: nh } = await sb.from("hop_links").select("code", { count: "exact", head: true }).eq("ip_hash", ipH).gte("created_at", depuisH);
  const { count: nj } = await sb.from("hop_links").select("code", { count: "exact", head: true }).eq("ip_hash", ipH).gte("created_at", depuisJ);
  if ((nh || 0) >= MAX_HEURE || (nj || 0) >= MAX_JOUR) return J({ ok: false, raison: "limite" }, 429);

  if (await dangereux(c.url!)) {
    await sb.from("hop_bloques").upsert({ hote: c.hote!, motif: "google safe browsing" });
    return J({ ok: false, raison: "dangereux" }, 400);
  }

  if (alias) {
    const kc = cle();
    const { error } = await sb.from("hop_links").insert({ code: alias, url: c.url, hote: c.hote, ip_hash: ipH, cle: kc, compte, perso: true });
    if (!error) return J({ ok: true, code: alias, cle: kc, court: `${SITE}/${alias}`, url: c.url, compte: true });
    if (String(error.code).startsWith("23505")) return J({ ok: false, raison: "pris", alias }, 409);
    return J({ ok: false, raison: "serveur" }, 500);
  }
  for (let essai = 0; essai < 6; essai++) {
    const k = code();
    if (RESERVES.has(k)) continue;
    const kc = cle();
    const { error } = await sb.from("hop_links").insert({ code: k, url: c.url, hote: c.hote, ip_hash: ipH, cle: kc, compte });
    if (!error) return J({ ok: true, code: k, cle: kc, court: `${SITE}/${k}`, url: c.url, compte: !!compte });
    if (!String(error.code).startsWith("23505")) return J({ ok: false, raison: "serveur" }, 500);
  }
  return J({ ok: false, raison: "serveur" }, 500);
});
