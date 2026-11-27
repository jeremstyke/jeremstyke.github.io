// Hoplien : outil de création, compte, signalement, QR code
(function(){
var API="https://txvrlvcxfnylnrpdrxtt.supabase.co/functions/v1/hop";
var SB="https://txvrlvcxfnylnrpdrxtt.supabase.co/rest/v1/vcs_hits",KEY="sb_publishable_7aA-njoU5fU2ialO0ExwQQ_REHjAEIe";
var $=function(i){return document.getElementById(i)};
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}}
function esc(x){return String(x==null?"":x).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function post(o){return fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}).then(function(r){return r.json().then(function(j){j._s=r.status;return j})})}
function toast(t){var x=$("toast");if(!x)return;x.textContent=t;x.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(function(){x.classList.remove("on")},1800)}
function copier(txt,b){if(navigator.clipboard)navigator.clipboard.writeText(txt).then(function(){if(b)b.textContent="Copié";toast("Lien copié")});else{window.prompt("Copiez le lien :",txt)}}
function liens(){try{return JSON.parse(ls("hop_liens")||"[]")}catch(e){return[]}}
// Mesure d'audience anonyme
var vid=ls("aff_vid");if(!vid){vid=Math.random().toString(36).slice(2,12);ls("aff_vid",vid)}
function hit(kind,target){if(/bot|crawl|spider|headless|lighthouse/i.test(navigator.userAgent)||ls("aff_moi")==="1")return;var ref=document.referrer?(document.referrer.indexOf(location.host)>-1?"interne":document.referrer.split("/")[2]||""):"";try{fetch(SB,{method:"POST",keepalive:true,headers:{apikey:KEY,Authorization:"Bearer "+KEY,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({site:"hop",kind:kind,path:location.pathname.slice(0,290),ref:ref.slice(0,290),dev:/Mobi|Android|iPhone/i.test(navigator.userAgent)?"mobile":"desktop",vid:vid,target:(target||"").slice(0,290)})})}catch(e){}}
if(/[?&]moi=1/.test(location.search))ls("aff_moi","1");
hit("view");
window.hopHit=hit;

// QR code réel (bibliothèque qrcode-generator) avec mention hoplien.fr dessous
function dessinerQR(cv,txt){
  var q=qrcode(0,"M");q.addData(txt);q.make();var n=q.getModuleCount(),t=8,m=4*t,pied=34;
  cv.width=n*t+2*m;cv.height=n*t+2*m+pied;var c=cv.getContext("2d");
  c.fillStyle="#fff";c.fillRect(0,0,cv.width,cv.height);c.fillStyle="#12173A";
  for(var y=0;y<n;y++)for(var x=0;x<n;x++)if(q.isDark(y,x))c.fillRect(m+x*t,m+y*t,t,t);
  c.font="bold 18px Arial,sans-serif";c.textAlign="center";c.fillStyle="#2F4BFF";c.fillText("Créé avec hoplien.fr",cv.width/2,cv.height-16);
}

// Accueil : création d'un lien
var f=$("f");
if(f){
  var court="";
  function mesLiens(){
    var L=liens(),box=$("mes");if(!box)return;
    if(!L.length){box.classList.add("cache");return}
    box.classList.remove("cache");var ul=$("mes-l");ul.innerHTML="";
    L.slice(0,5).forEach(function(x){var li=document.createElement("li");li.innerHTML='<span><b>hoplien.fr/'+esc(x.code)+'</b> '+esc(x.url)+'</span><button class="btn petit clair" type="button">Copier</button>';li.querySelector("button").onclick=function(){copier("https://hoplien.fr/"+x.code,this)};ul.appendChild(li)});
  }
  mesLiens();
  var connecte=!!ls("hop_t");
  if(connecte){var cc=$("cta-compte");if(cc)cc.innerHTML='Connecté : vos liens et leurs clics sont dans <a href="compte/">votre compte</a>.';$("perso-info").textContent="Lettres, chiffres et tirets. Laissez vide pour un lien au hasard."}
  else{$("alias").disabled=true;$("perso").classList.add("off")}
  $("alias").oninput=function(){var v=this.value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[\s_]+/g,"-").replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-");if(v!==this.value)this.value=v};
  var MSG={vide:"Collez d'abord un lien.",long:"Ce lien est trop long (2000 caractères maximum).",invalide:"Ce lien n'a pas l'air valide. Vérifiez qu'il ressemble à site.fr/page.",protocole:"Seuls les liens qui commencent par http ou https sont acceptés.",identifiants:"Ce lien contient un identifiant ou un mot de passe : retirez-le.",raccourcisseur:"Ce lien est déjà un lien raccourci. Collez plutôt le lien d'origine.",boucle:"Ce lien est déjà un lien Hoplien.",interdit:"Ce site n'est pas accepté sur Hoplien.",dangereux:"Ce lien mène vers un site signalé comme dangereux. Nous ne pouvons pas le raccourcir.",limite:"Vous avez créé beaucoup de liens d'un coup. Réessayez dans une heure.",compte:"Connectez-vous pour choisir un nom personnalisé.",alias:"Ce nom n'est pas valide : 3 à 40 caractères, lettres, chiffres et tirets.",reserve:"Ce nom est réservé par Hoplien. Essayez une variante.",pris:"Ce nom est déjà pris. Essayez une variante, par exemple en ajoutant l'année.",serveur:"Petit souci de notre côté. Réessayez dans un instant."};
  f.onsubmit=function(e){
    e.preventDefault();var v=$("url").value.trim(),bt=f.querySelector("button");$("err").textContent="";
    if(!v){$("err").textContent=MSG.vide;return}
    bt.disabled=true;bt.textContent="Hop...";
    var al=$("alias").value.replace(/^-+|-+$/g,"");post({action:"creer",url:v,t:ls("hop_t")||undefined,alias:al||undefined}).then(function(j){
      bt.disabled=false;bt.textContent="Raccourcir";
      if(!j.ok){$("err").textContent=MSG[j.raison]||MSG.serveur;return}
      court=j.court;
      if(j.cle){var L=liens().filter(function(x){return x.code!==j.code});L.unshift({code:j.code,cle:j.cle,url:j.url,ts:Date.now()});ls("hop_liens",JSON.stringify(L.slice(0,100)))}
      $("r-long").textContent=j.url;$("r-court").textContent=court.replace(/^https:\/\//,"");
      var g=j.url.replace(/^https?:\/\//,"").length-court.replace(/^https:\/\//,"").length;
      $("r-gain").textContent=g>0?g+" caractères en moins":"Votre lien court est prêt";
      var r=$("res");r.classList.remove("on");void r.offsetWidth;r.classList.add("on");
      $("qr").classList.remove("on");$("copier").textContent="Copier";
      $("alias").value="";mesLiens();hit("creer",j.code);
    }).catch(function(){bt.disabled=false;bt.textContent="Raccourcir";$("err").textContent="Pas de connexion. Vérifiez votre réseau et réessayez."});
  };
  $("copier").onclick=function(){copier(court,this);hit("copie")};
  $("voirqr").onclick=function(){var q=$("qr");q.classList.toggle("on");if(q.classList.contains("on")){dessinerQR($("cv"),court);hit("qr")}};
  $("dlqr").onclick=function(){var a=document.createElement("a");a.download="qr-"+court.split("/").pop()+".png";a.href=$("cv").toDataURL("image/png");a.click()};
}

// Signalement
var sg=$("sig");
if(sg){sg.onsubmit=function(e){e.preventDefault();var c=sg.querySelector("input").value.trim(),mo=sg.querySelector("[name=motif]"),msg=$("sig-msg");
  post({action:"signaler",code:c,motif:mo?mo.value:""}).then(function(j){msg.textContent=j.ok?"Merci, le lien sera examiné rapidement.":j.raison==="inconnu"?"Ce lien Hoplien n'existe pas.":j.raison==="code"?"Collez un lien du type hoplien.fr/ab3k9.":j.raison==="limite"?"Trop de signalements depuis votre connexion, réessayez plus tard.":"Le signalement n'a pas marché, réessayez."}).catch(function(){msg.textContent="Pas de connexion, réessayez."})}}

// Compte
var cpt=$("compte");
if(cpt){
  var hm=location.hash.match(/t=([A-Za-z0-9_.-]+)/);
  if(hm){ls("hop_t",hm[1]);history.replaceState(null,"",location.pathname)}
  function vueConnexion(){$("v-co").classList.remove("cache");$("v-moi").classList.add("cache")}
  function barres(j){var h="",d=new Date(),max=1,vals=[];for(var i=13;i>=0;i--){var x=new Date(d.getTime()-i*864e5),k=x.toISOString().slice(0,10),v=j[k]||0;vals.push(v);if(v>max)max=v}vals.forEach(function(v){h+='<i style="height:'+Math.max(4,Math.round(v/max*100))+'%" title="'+v+' clic'+(v>1?"s":"")+'"></i>'});return h}
  function charger(){
    var t=ls("hop_t");if(!t){vueConnexion();return}
    $("v-moi").classList.remove("cache");$("v-co").classList.add("cache");$("moi-l").innerHTML='<li>Chargement...</li>';
    post({action:"moi",t:t,liens:liens().map(function(x){return{code:x.code,cle:x.cle}})}).then(function(j){
      if(!j.ok){ls("hop_t",null);vueConnexion();$("co-msg").textContent="Votre connexion a expiré. Recevez un nouveau lien.";return}
      $("moi-email").textContent=j.email;var ul=$("moi-l");ul.innerHTML="";
      var tot=j.liens.reduce(function(s,x){return s+x.clicks},0);$("moi-tot").textContent=j.liens.length+" lien"+(j.liens.length>1?"s":"")+", "+tot+" clic"+(tot>1?"s":"")+" au total";
      if(!j.liens.length){ul.innerHTML='<li class="vide">Aucun lien pour l\'instant. <a href="../">Raccourcissez votre premier lien</a>.</li>';return}
      j.liens.forEach(function(l){var li=document.createElement("li");li.className="ligne";
        li.innerHTML='<div class="l-txt"><b>hoplien.fr/'+esc(l.code)+'</b>'+(l.statut!=="ok"?' <em class="bl">bloqué</em>':'')+'<span>'+esc(l.url)+'</span></div><div class="l-stat"><strong>'+l.clicks+'</strong> clic'+(l.clicks>1?"s":"")+'<div class="mini" aria-hidden="true">'+barres(l.jours)+'</div></div><div class="l-act"><button class="btn petit clair c1" type="button">Copier</button><button class="btn petit clair c2" type="button" aria-label="Supprimer ce lien">Supprimer</button></div>';
        li.querySelector(".c1").onclick=function(){copier("https://hoplien.fr/"+l.code,this)};
        li.querySelector(".c2").onclick=function(){var b=this;if(b.dataset.ok!=="1"){b.dataset.ok="1";b.textContent="Confirmer";return}post({action:"supprimer",t:t,code:l.code}).then(function(){li.remove();toast("Lien supprimé")})};
        ul.appendChild(li)});
    }).catch(function(){$("moi-l").innerHTML='<li>Pas de connexion, rechargez la page.</li>'});
  }
  $("co-f").onsubmit=function(e){e.preventDefault();var em=$("co-email").value.trim(),b=this.querySelector("button"),m=$("co-msg");
    if(!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(em)){m.textContent="Cette adresse n'a pas l'air valide.";return}
    b.disabled=true;b.textContent="Envoi...";
    post({action:"connexion",email:em}).then(function(j){b.disabled=false;b.textContent="Recevoir mon lien";m.textContent=j.ok?"C'est envoyé ! Ouvrez l'e-mail sur cet appareil et cliquez sur le bouton. Pensez à regarder dans les indésirables.":j.raison==="limite"?"Trop de demandes. Réessayez dans une heure.":"L'envoi n'a pas marché, réessayez.";if(j.ok)hit("connexion")}).catch(function(){b.disabled=false;b.textContent="Recevoir mon lien";m.textContent="Pas de connexion, réessayez."})};
  $("deco").onclick=function(){ls("hop_t",null);vueConnexion();toast("Vous êtes déconnecté")};
  charger();
}
})();
