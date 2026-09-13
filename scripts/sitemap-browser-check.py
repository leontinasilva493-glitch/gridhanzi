from pathlib import Path
import json
import os
from playwright.sync_api import sync_playwright

output = Path("artifacts/sitemap-review")
output.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for width in [1366, 390]:
        page = browser.new_page(viewport={"width": width, "height": 900})
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        response = page.goto(os.environ.get("QA_BASE_URL", "http://localhost:4338") + "/sitemap.xml", wait_until="networkidle")
        assert response.status == 200
        evidence = page.evaluate("""() => {
          const rows = [...document.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'url')];
          const root = document.documentElement;
          return {rows: rows.length, display: getComputedStyle(rows[0]).display,
            firstY: rows[0].getBoundingClientRect().y, secondY: rows[1].getBoundingClientRect().y,
            heading: getComputedStyle(root, '::before').content,
            overflow: root.scrollWidth > window.innerWidth,
            priorities: [...document.getElementsByTagNameNS(root.namespaceURI, 'priority')].map(n => n.textContent)};
        }""")
        assert evidence["rows"] == 125
        assert evidence["display"] == "grid"
        assert evidence["secondY"] > evidence["firstY"]
        assert not evidence["overflow"]
        assert set(evidence["priorities"]) == {"1.0", "0.9", "0.8", "0.7"}
        assert not errors, errors
        page.screenshot(path=str(output / f"sitemap-{width}.png"))
        print(json.dumps({"width":width, "rows": evidence["rows"], "overflow": evidence["overflow"], "display": evidence["display"]}, ensure_ascii=False))
        page.close()
    browser.close()
