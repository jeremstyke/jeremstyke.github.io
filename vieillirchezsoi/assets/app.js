(function(){
  var SB = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/rest/v1/vcs_hits';
  var KEY = 'sb_publishable_7aA-njoU5fU2ialO0ExwQQ_REHjAEIe';
  function ls(k, v){ try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch(e){ return null; } }
  // ?moi=1 une fois sur ses appareils : plus compté dans les stats
  if (/[?&]moi=1/.test(location.search)) ls('vcs_moi', '1');
  if (/[?&]moi=0/.test(location.search)) ls('vcs_moi', '0');
  var bot = /bot|crawl|spider|slurp|lighthouse|headless|preview/i.test(navigator.userAgent);
  var vid = ls('vcs_vid'); if (!vid) { vid = Math.random().toString(36).slice(2, 12); ls('vcs_vid', vid); }
  var dev = /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  var ref = document.referrer ? (document.referrer.indexOf(location.host) > -1 ? 'interne' : document.referrer.split('/')[2] || '') : '';
  var path = location.pathname.replace(/^\/vieillirchezsoi/, '') || '/';
  function hit(kind, target){
    if (bot || ls('vcs_moi') === '1') return;
    var body = JSON.stringify({kind: kind, path: path.slice(0, 290), ref: ref.slice(0, 290), dev: dev, vid: vid, target: (target || '').slice(0, 290)});
    try { fetch(SB, {method: 'POST', keepalive: true, headers: {'apikey': KEY, 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal'}, body: body}); } catch(e){}
  }
  hit('view');
  var tb = document.getElementById('txt-size');
  if (tb) {
    var big = document.documentElement.classList.contains('big');
    tb.setAttribute('aria-pressed', big ? 'true' : 'false');
    tb.addEventListener('click', function(){
      big = document.documentElement.classList.toggle('big');
      tb.setAttribute('aria-pressed', big ? 'true' : 'false');
      ls('vcs_big', big ? '1' : '0');
    });
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href*="amazon.fr"]');
    if (a) { var m = a.href.match(/[?&]k=([^&]+)/); hit('amz', m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : a.href); }
  });
  // Checklist
  var boxes = document.querySelectorAll('.cl input[type=checkbox]');
  if (!boxes.length) return;
  var saved = {}; try { saved = JSON.parse(ls('vcs_cl') || '{}'); } catch(e){}
  function upd(){
    var n = 0; boxes.forEach(function(b){ b.closest('.item').classList.toggle('done', b.checked); if (b.checked) n++; });
    document.getElementById('bar').style.width = (100 * n / boxes.length) + '%';
    document.getElementById('ptxt').textContent = n + ' sur ' + boxes.length + ' en place';
  }
  boxes.forEach(function(b){
    b.checked = !!saved[b.dataset.id];
    b.addEventListener('change', function(){ saved[b.dataset.id] = b.checked ? 1 : 0; ls('vcs_cl', JSON.stringify(saved)); upd(); });
  });
  upd();
})();
