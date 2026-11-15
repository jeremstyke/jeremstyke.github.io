(function(){
  var SITE = 'oiseaux';
  var SB = 'https://txvrlvcxfnylnrpdrxtt.supabase.co/rest/v1/vcs_hits';
  var KEY = 'sb_publishable_7aA-njoU5fU2ialO0ExwQQ_REHjAEIe';
  function ls(k, v){ try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch(e){ return null; } }
  if (/[?&]moi=1/.test(location.search)) ls('loj_moi', '1');
  if (/[?&]moi=0/.test(location.search)) ls('loj_moi', '0');
  var bot = /bot|crawl|spider|slurp|lighthouse|headless|preview|google-site-verification/i.test(navigator.userAgent);
  var vid = ls('loj_vid'); if (!vid) { vid = Math.random().toString(36).slice(2, 12); ls('loj_vid', vid); }
  var dev = /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  var ref = document.referrer ? (document.referrer.indexOf(location.host) > -1 ? 'interne' : document.referrer.split('/')[2] || '') : '';
  function hit(kind, target){
    if (bot || ls('loj_moi') === '1') return;
    var body = JSON.stringify({site: SITE, kind: kind, path: location.pathname.slice(0, 290), ref: ref.slice(0, 290), dev: dev, vid: vid, target: (target || '').slice(0, 290)});
    try { fetch(SB, {method: 'POST', keepalive: true, headers: {'apikey': KEY, 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal'}, body: body}); } catch(e){}
  }
  hit('view');
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href*="amazon.fr"]');
    if (a) { var m = a.href.match(/[?&]k=([^&]+)/); hit('amz', m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : a.href.split('?')[0]); }
  }, true);
  var tb = document.getElementById('txt-size');
  if (tb) {
    var big = document.documentElement.classList.contains('big');
    tb.setAttribute('aria-pressed', big ? 'true' : 'false');
    tb.addEventListener('click', function(){
      big = document.documentElement.classList.toggle('big');
      tb.setAttribute('aria-pressed', big ? 'true' : 'false');
      ls('loj_big', big ? '1' : '0');
    });
  }
})();
