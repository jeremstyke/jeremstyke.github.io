// Worker Cloudflare de hoplien.fr
// - hoplien.fr/ab3k9 ou hoplien.fr/un-nom : redirige vers le lien d'origine (et compte le clic)
// - toutes les autres adresses : affiche le site (hébergé sur GitHub Pages)
const ORIGINE = "https://jeremstyke.github.io/hoplien";
const SB = "https://txvrlvcxfnylnrpdrxtt.supabase.co/rest/v1/rpc/hop_go";
const CLE = "sb_publishable_7aA-njoU5fU2ialO0ExwQQ_REHjAEIe";
// Pages du site : tout le reste (hoplien.fr/un-nom) est un lien court
const PAGES = new Set(["compte", "guides", "signaler", "bloque", "introuvable", "mentions-legales", "assets"]);

async function pageSite(chemin, statut) {
  const r = await fetch(ORIGINE + chemin, { cf: { cacheTtl: 300, cacheEverything: true } });
  if (r.status === 404 && chemin !== "/introuvable/") return pageSite("/introuvable/", 404);
  const h = new Headers(r.headers);
  h.delete("x-github-request-id");
  h.set("X-Content-Type-Options", "nosniff");
  return new Response(r.body, { status: statut || r.status, headers: h });
}

export default {
  async fetch(req) {
    const u = new URL(req.url);
    if (u.hostname.startsWith("www.")) return Response.redirect("https://hoplien.fr" + u.pathname + u.search, 301);
    if (u.protocol === "http:") return Response.redirect("https://hoplien.fr" + u.pathname + u.search, 301);

    const m = /^\/([A-Za-z0-9][A-Za-z0-9-]{1,38}[A-Za-z0-9])\/?$/.exec(u.pathname);
    if (m && !PAGES.has(m[1].toLowerCase())) {
      const code = m[1].toLowerCase();
      let ligne = null;
      try {
        const r = await fetch(SB, { method: "POST", headers: { apikey: CLE, "Content-Type": "application/json" }, body: JSON.stringify({ c: code }) });
        const j = await r.json();
        ligne = Array.isArray(j) && j.length ? j[0] : null;
      } catch (e) { return new Response("Hoplien est momentanément indisponible. Réessayez dans un instant.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }); }
      if (!ligne) return pageSite("/introuvable/", 404);
      if (ligne.statut !== "ok") return pageSite("/bloque/", 410);
      return new Response(null, { status: 302, headers: { Location: ligne.url, "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer-when-downgrade", "X-Robots-Tag": "noindex" } });
    }

    let chemin = u.pathname;
    if (!chemin.includes(".") && !chemin.endsWith("/")) return Response.redirect("https://hoplien.fr" + chemin + "/" + u.search, 301);
    return pageSite(chemin);
  },
};
