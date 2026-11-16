// Génère .work/lesoiseauxdujardin/assets/guide-nourrir-oiseaux.pdf à partir du guide pilier.
// Depuis la racine du dépôt : python3 .work/lesoiseauxdujardin/src/build.py
//   puis (cd .work/lesoiseauxdujardin/docs && python3 -m http.server 8766 &) ; node .work/lesoiseauxdujardin/src/make_pdf.js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:8766/nourrir-les-oiseaux-du-jardin/', {waitUntil: 'networkidle'});
  await p.addStyleTag({content: `
    .top,.foot,.bc,.pdfbox,.faq,.disc-in,.toc,.cta,.skip,.related,.sites,.meta{display:none!important}
    body{background:#fff!important;font-size:12pt}
    .prose a[href*="amazon.fr"]{color:inherit;text-decoration:none}
    h2{break-after:avoid} table,tr,li{break-inside:avoid}
    .pdf-head{border-bottom:3px solid #3F6B3A;margin-bottom:12pt;padding-bottom:6pt;color:#3F6B3A;font-weight:700}
  `});
  await p.evaluate(() => {
    const d = document.createElement('div'); d.className = 'pdf-head';
    d.textContent = 'Les oiseaux du jardin · Guide à imprimer · lesoiseauxdujardin.fr';
    document.querySelector('article').prepend(d);
  });
  await p.pdf({path: '.work/lesoiseauxdujardin/assets/guide-nourrir-oiseaux.pdf', format: 'A4', printBackground: true,
    margin: {top: '15mm', bottom: '15mm', left: '14mm', right: '14mm'},
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-size:8pt;width:100%;text-align:center;color:#56645A">Les oiseaux du jardin · page <span class="pageNumber"></span> / <span class="totalPages"></span> · Conseils issus des associations de protection des oiseaux</div>'});
  await b.close();
})();
