import json
from playwright.sync_api import sync_playwright
OUT="/home/claude/videos/cap/"
LONG="https://www.amazon.fr/Bouilloire-Electrique-Inox-1-7L/dp/B0CXYZ1234/ref=sr_1_5?crid=2KX8&keywords=bouilloire+inox&qid=1732712345&sprefix=bouill%2Caps%2C98&sr=8-5"
with sync_playwright() as p:
    b=p.chromium.launch()
    def ctx():
        return b.new_context(viewport={"width":390,"height":693},device_scale_factor=1080/390,service_workers="block")
    # Hoplien
    c=ctx(); pg=c.new_page()
    pg.route("**/functions/v1/hop", lambda r: r.fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"*"},
        body=json.dumps({"ok":True,"court":"https://hoplien.fr/bouilloire","url":LONG,"code":"bouilloire"})))
    pg.route("**/rest/v1/**", lambda r: r.fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"*"}, body="[]"))
    pg.goto("http://localhost:8766/"); pg.wait_for_timeout(800)
    pg.screenshot(path=OUT+"h1.png")
    pg.fill("#url", LONG); pg.wait_for_timeout(300); pg.screenshot(path=OUT+"h2.png")
    pg.click("#f button[type=submit]"); pg.wait_for_timeout(900)
    pg.evaluate("document.getElementById('res').scrollIntoView({block:'center'})"); pg.wait_for_timeout(400)
    pg.screenshot(path=OUT+"h3.png")
    pg.click("#voirqr"); pg.wait_for_timeout(700)
    pg.evaluate("document.getElementById('qr').scrollIntoView({block:'center'})"); pg.wait_for_timeout(400)
    pg.screenshot(path=OUT+"h4.png")
    c.close()
    c=ctx(); pg=c.new_page()
    pg.route("**/rest/v1/rpc/hop_go", lambda r: r.fulfill(status=200, content_type="application/json", headers={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"*"},
        body=json.dumps([{"statut":"ok","url":"https://www.amazon.fr/dp/B0CXYZ1234"}])))
    pg.goto("http://localhost:8766/bouilloire"); pg.wait_for_timeout(1300)
    pg.screenshot(path=OUT+"h5.png")
    c.close()
    # CVLibre
    c=ctx(); pg=c.new_page()
    pg.goto("http://localhost:8777/"); pg.evaluate("localStorage.setItem('cvlibre.cvpass', JSON.stringify({u: Date.now()+1e10}))")
    pg.goto("http://localhost:8777/"); pg.wait_for_timeout(1200); pg.screenshot(path=OUT+"c1.png")
    pg.goto("http://localhost:8777/creer-un-cv/"); pg.wait_for_timeout(1500); pg.screenshot(path=OUT+"c2.png")
    pg.get_by_text("Aperçu", exact=True).first.click(); pg.wait_for_timeout(1200); pg.screenshot(path=OUT+"c3.png")
    sw=pg.locator("#swatches > *")
    sw.nth(2).click(); pg.wait_for_timeout(800); pg.screenshot(path=OUT+"c4.png")
    c.close()
