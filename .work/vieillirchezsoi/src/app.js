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

  // Questionnaire
  var quiz = document.getElementById('quiz');
  if (quiz) {
    var data = JSON.parse(document.getElementById('quiz-data').textContent);
    var R = location.pathname.replace(/quel-equipement\/.*$/, '');
    function restore(){
      var h = location.hash.slice(1); if (!h) return false;
      h.split('&').forEach(function(kv){ var p = kv.split('='); (p[1] || '').split(',').forEach(function(v){
        var i = quiz.querySelector('input[name="' + p[0] + '"][value="' + v + '"]'); if (i) i.checked = true; }); });
      return true;
    }
    function show(){
      var ess = [], ut = [], st = {};
      quiz.querySelectorAll('input:checked').forEach(function(i){
        i.dataset.e.split(' ').forEach(function(k){ if (k && ess.indexOf(k) < 0) ess.push(k); });
        i.dataset.u.split(' ').forEach(function(k){ if (k && ut.indexOf(k) < 0) ut.push(k); });
        st[i.name] = (st[i.name] ? st[i.name] + ',' : '') + i.value;
      });
      ut = ut.filter(function(k){ return ess.indexOf(k) < 0; });
      function li(k){ var d = data[k]; if (!d) return '';
        return '<li class="item"><span class="it-name">' + d.n + '</span><p>' + d.c + '</p><span class="links"><a class="amz" href="' + d.u + '" rel="sponsored nofollow noopener" target="_blank">Voir les modèles</a>' +
          (d.g ? ' <a href="' + R + d.g + '">Lire le guide</a>' : '') + '</span></li>'; }
      var hash = Object.keys(st).map(function(k){ return k + '=' + st[k]; }).join('&');
      history.replaceState(null, '', '#' + hash);
      var res = document.getElementById('quiz-res');
      res.innerHTML = '<h2>Les équipements conseillés</h2>' +
        (ess.length ? '<h3><span class="prio p1">En priorité</span></h3><ul class="cl">' + ess.map(li).join('') + '</ul>' : '<p>D\'après vos réponses, aucun équipement n\'est urgent. Les quelques achats ci-dessous peuvent quand même aider.</p>') +
        (ut.length ? '<h3><span class="prio p2">Utile aussi</span></h3><ul class="cl">' + ut.map(li).join('') + '</ul>' : '') +
        '<p class="share"><button class="btn ghost" type="button" id="q-share">Envoyer ce résultat à un proche</button> <a href="' + R + 'amenager-logement-personne-agee/">Voir le guide complet pièce par pièce</a></p>';
      res.hidden = false; res.scrollIntoView({behavior: 'smooth', block: 'start'});
      hit('quiz', hash);
      document.getElementById('q-share').onclick = function(){
        var u = location.href, t = 'Les équipements conseillés pour notre proche';
        if (navigator.share) navigator.share({title: t, url: u}).catch(function(){});
        else if (navigator.clipboard) navigator.clipboard.writeText(u).then(function(){ alert('Lien copié : vous pouvez le coller dans un message.'); });
      };
    }
    quiz.addEventListener('submit', function(e){ e.preventDefault(); show(); });
    if (restore() && quiz.checkValidity()) show();
  }
  // Guide PDF contre e-mail
  document.querySelectorAll('.pdf-form').forEach(function(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var mail = f.email.value.trim(); if (!/^\S+@\S+\.\S+$/.test(mail)) return;
      var btn = f.querySelector('button'); btn.disabled = true;
      function ok(){ f.querySelector('.pdf-ok').hidden = false; btn.hidden = true; hit('lead', f.dataset.src); }
      if (ls('vcs_moi') === '1') { ok(); return; }
      fetch(SB.replace('vcs_hits', 'vcs_leads'), {method: 'POST', headers: {'apikey': KEY, 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal'},
        body: JSON.stringify({email: mail.slice(0, 200), news: f.news.checked, source: f.dataset.src})}).then(ok, ok);
    });
  });
  document.addEventListener('click', function(e){ var a = e.target.closest && e.target.closest('a[href$=".pdf"]'); if (a) hit('pdf', location.pathname); });
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
