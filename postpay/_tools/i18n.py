# 14 nov 2026 (Jeremy): PostPay site in 10 languages.
# EN pages are the source. "python3 i18n.py extract" writes strings/en.json (every text to translate).
# Each strings/<lang>.json maps the English text to its translation. "python3 i18n.py build" writes the pages
# of the other languages under /postpay/<lang>/ and refreshes hreflang, the language menu and the sitemap on every page.
import os, re, sys, json, copy
from bs4 import BeautifulSoup, NavigableString, Comment, Doctype
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
B = "https://jeremstyke.github.io/postpay/"
SD = os.path.join(os.path.dirname(__file__), "strings")
# page key -> path under /postpay/ for en and fr; other languages use "<lang>/" + the en path
PAGES = {
 "home": ("", "fr/"), "buy": ("buy-telegram-ads/", "fr/acheter-pub-telegram/"),
 "monetize": ("monetize-telegram-channel/", "fr/monetiser-chaine-telegram/"), "prices": ("telegram-ad-prices/", "fr/prix-pub-telegram/"),
 "faq": ("faq/", "fr/faq/"), "promote": ("promote-telegram-channel/", "fr/promouvoir-chaine-telegram/"),
 "write": ("how-to-write-telegram-ad/", "fr/rediger-pub-telegram/"),
}
LANGS = [("en", "English", "ltr"), ("fr", "Français", "ltr"), ("es", "Español", "ltr"), ("pt", "Português", "ltr"), ("ru", "Русский", "ltr"),
         ("tr", "Türkçe", "ltr"), ("id", "Bahasa Indonesia", "ltr"), ("hi", "हिन्दी", "ltr"), ("ar", "العربية", "rtl"), ("fa", "فارسی", "rtl")]
NEW = [l for l, _, _ in LANGS if l not in ("en", "fr")]
def path(key, lg):
    en, fr = PAGES[key]
    return en if lg == "en" else fr if lg == "fr" else lg + "/" + en
def read(p): return open(os.path.join(ROOT, p, "index.html"), encoding="utf-8").read()
SKIP_TAGS = {"script", "style"}
ATTRS = ["alt", "placeholder", "aria-label", "title", "data-empty", "data-subs"]
META = {"description", "og:title", "og:description", "twitter:title", "twitter:description"}
LD_KEYS = {"name", "text", "description", "headline"}
def ld_walk(o, fn):
    if isinstance(o, dict):
        for k, v in o.items():
            if isinstance(v, str) and k in LD_KEYS and v != "PostPay": o[k] = fn(v)
            else: ld_walk(v, fn)
    elif isinstance(o, list):
        for x in o: ld_walk(x, fn)
def walk(soup, fn):
    """Calls fn(text) on every translatable text and replaces it with the result."""
    for node in soup.find_all(string=True):
        if isinstance(node, (Comment, Doctype)) or node.parent.name in SKIP_TAGS: continue
        t = str(node); core = t.strip()
        if not core or not re.search(r"[^\W\d_]", core): continue
        lead = t[:len(t) - len(t.lstrip())]; trail = t[len(t.rstrip()):]
        node.replace_with(NavigableString(lead + fn(core) + trail))
    for tag in soup.find_all(True):
        for a in ATTRS:
            v = tag.get(a)
            if isinstance(v, str) and re.search(r"[^\W\d_]", v) and v != "PostPay": tag[a] = fn(v)
        if tag.name == "meta" and (tag.get("name") in META or tag.get("property") in META) and tag.get("content"):
            tag["content"] = fn(tag["content"])
    for sc in soup.find_all("script", type="application/ld+json"):
        d = json.loads(sc.string); ld_walk(d, fn); sc.string = json.dumps(d, ensure_ascii=False)
def extract():
    seen = {}
    for key in PAGES:
        soup = BeautifulSoup(read(path(key, "en")), "html.parser")
        def add(t):
            seen.setdefault(t, key); return t
        walk(soup, add)
    os.makedirs(SD, exist_ok=True)
    json.dump({k: "" for k in seen}, open(os.path.join(SD, "en.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    print(len(seen), "strings,", sum(len(k.split()) for k in seen), "words")
RTL_CSS = "[dir=rtl] th,[dir=rtl] td{text-align:right}[dir=rtl] .top nav{margin-left:0;margin-right:auto}[dir=rtl] ul,[dir=rtl] ol{padding-left:0;padding-right:20px}\n.langs{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:14px;margin-top:10px}.langs a{color:var(--mute)}"
def chrome(s, key, lg):
    """hreflang block, language menu, start params, links, RTL css: same treatment for every language."""
    alt = "".join('<link rel="alternate" hreflang="%s" href="%s%s">\n' % (l, B, path(key, l)) for l, _, _ in LANGS)
    alt += '<link rel="alternate" hreflang="x-default" href="%s%s">\n' % (B, path(key, "en"))
    s = re.sub(r'(<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?)+', lambda m: alt, s, count=1)
    code = lg.upper()
    s = re.sub(r'<a class="lang" href="[^"]*"( hreflang="[^"]*")?>[^<]*</a>', '<a class="lang" href="#langs">🌐 %s</a>' % code, s, count=1)
    s = re.sub(r'<div class="in langs" id="langs">.*?</div>\n?', "", s, flags=re.S)
    menu = '<div class="in langs" id="langs">' + "".join('<a href="%s%s" hreflang="%s" lang="%s">%s</a>' % (B, path(key, l), l, l, n) for l, n, _ in LANGS) + "</div>\n"
    s = s.replace("</footer>", menu + "</footer>", 1)
    if ".langs{" not in s: s = s.replace("</style>", RTL_CSS + "\n</style>", 1)
    return s
def render(key, lg, tr, missing):
    src = read(path(key, "en"))
    soup = BeautifulSoup(src, "html.parser")
    def t(x):
        v = tr.get(x)
        if not v: missing.add(x); return x
        return v
    walk(soup, t)
    html = soup.find("html"); html["lang"] = lg; html["dir"] = dict((l, d) for l, _, d in LANGS)[lg]
    for sc in soup.find_all("script", type="application/ld+json"):
        d = json.loads(sc.string)
        if d.get("@type") == "WebSite": d["inLanguage"] = lg
        sc.string = json.dumps(d, ensure_ascii=False)
    s = str(soup)
    # internal links and canonical to the same language
    for k in sorted(PAGES, key=lambda k: -len(PAGES[k][0])):
        s = s.replace('"' + B + path(k, "en") + '"', '"' + B + path(k, lg) + '"')
    s = re.sub(r"(start=src_[a-z_]*?)_en(_ad)?(?=[\"&])", lambda m: m.group(1) + "_" + lg + (m.group(2) or ""), s)
    return chrome(s, key, lg)
def build():
    total = 0
    for lg in NEW:
        f = os.path.join(SD, lg + ".json")
        if not os.path.exists(f): print("RESTE", lg, ": pas de traduction"); continue
        tr = json.load(open(f, encoding="utf-8")); missing = set()
        for key in PAGES:
            out = render(key, lg, tr, missing)
            d = os.path.join(ROOT, path(key, lg)); os.makedirs(d, exist_ok=True)
            open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(out); total += 1
        if missing: print("RESTE", lg, len(missing), "textes non traduits, ex.:", list(missing)[:3])
    for lg in ("en", "fr"):
        for key in PAGES:
            p = os.path.join(ROOT, path(key, lg), "index.html")
            cur = open(p, encoding="utf-8").read()  # read first: opening for writing empties the file
            if not cur.strip(): raise SystemExit("RESTE page vide : " + p)
            open(p, "w", encoding="utf-8").write(chrome(cur, key, lg))
    urls = [B + path(k, l) for l, _, _ in LANGS for k in PAGES if l in ("en", "fr") or os.path.exists(os.path.join(SD, l + ".json"))]
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(
        "  <url><loc>%s</loc><lastmod>2026-11-14</lastmod><priority>%s</priority></url>\n" % (u, "1.0" if u.rstrip("/").count("/") <= 4 else "0.8") for u in urls) + "</urlset>\n"
    open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8").write(sm)
    print(total, "pages traduites,", len(urls), "URL dans le sitemap")
def app():
    """Puts strings/app_<lang>.json into app.html (between the I18N markers)."""
    p = os.path.join(ROOT, "app.html"); s = open(p, encoding="utf-8").read()
    js = "".join("T0.%s=%s;\n" % (l, json.dumps(json.load(open(os.path.join(SD, "app_%s.json" % l), encoding="utf-8")), ensure_ascii=False)) for l in NEW if os.path.exists(os.path.join(SD, "app_%s.json" % l)))
    s = re.sub(r"/\*I18N\*/.*?/\*/I18N\*/\n?|/\*I18N\*/\n?", lambda m: "/*I18N*/\n" + js + "/*/I18N*/\n", s, count=1, flags=re.S)
    open(p, "w", encoding="utf-8").write(s); print("appli :", js.count("T0."), "langues ajoutées")
if __name__ == "__main__":
    {"extract": extract, "build": build, "app": app}[sys.argv[1]]()
