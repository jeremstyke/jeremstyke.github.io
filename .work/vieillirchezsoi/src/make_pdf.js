// Génère vieillirchezsoi/assets/guide-amenager-logement.pdf à partir du guide pilier.
// Lancer depuis la racine du dépôt : python3 -m http.server 8765 & node .work/vieillirchezsoi/src/make_pdf.js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:8765/vieillirchezsoi/amenager-logement-personne-agee/', {waitUntil: 'networkidle'});
  await p.addStyleTag({content: `
    .top,.foot,.bc,.pdfbox,.faq,.disc-in,.toc,.cta,.skip{display:none!important}
    body{background:#fff!important;font-size:12pt}
    .item{break-inside:avoid;border:1px solid #E2DDD0}
    .cl-sec{break-inside:auto}
    .item .amz{display:inline!important;font-size:10pt}
    .prose a[href*="amazon.fr"]::before{content:""}
    h2{break-after:avoid}
    .pdf-head{border-bottom:3px solid #2F6B57;margin-bottom:12pt;padding-bottom:6pt;color:#2F6B57;font-weight:700}
  `});
  await p.evaluate(() => {
    const d = document.createElement('div'); d.className = 'pdf-head';
    d.textContent = 'Vieillir chez soi · Guide à imprimer · jeremstyke.github.io/vieillirchezsoi';
    document.querySelector('article').prepend(d);
  });
  await p.pdf({path: 'vieillirchezsoi/assets/guide-amenager-logement.pdf', format: 'A4', printBackground: true,
    margin: {top: '15mm', bottom: '15mm', left: '14mm', right: '14mm'},
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-size:8pt;width:100%;text-align:center;color:#55635D">Vieillir chez soi · page <span class="pageNumber"></span> / <span class="totalPages"></span> · Conseils généraux, demandez l\'avis d\'un professionnel de santé</div>'});
  await b.close();
})();
