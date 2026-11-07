/* AI Football Predictor - free football probabilities widget - https://jeremstyke.github.io/ai-football-predictor/widget/
   <div class="afp-widget" data-lang="fr" data-lg="F1,CL" data-team="" data-n="6" data-theme="dark"><a href="https://jeremstyke.github.io/ai-football-predictor/fr/">Probabilités foot par AI Football Predictor</a></div>
   <script async src="https://jeremstyke.github.io/ai-football-predictor/embed.js"></script> */
(function(){var B="https://jeremstyke.github.io/ai-football-predictor/w/",S="https://jeremstyke.github.io/ai-football-predictor/";
function mk(el){if(el.getAttribute("data-afp-done"))return;el.setAttribute("data-afp-done","1");var d=el.dataset,h=(location.hostname||"").replace(/^www\./,""),s=h.replace(/[^a-z0-9]/gi,"").slice(0,20),fr=(d.lang||navigator.language||"").slice(0,2)=="fr",
lv=d.type=="live",u=B+(lv?"live/":"")+"?lang="+encodeURIComponent(d.lang||"")+"&lg="+encodeURIComponent(d.lg||"")+"&team="+encodeURIComponent(d.team||"")+"&n="+encodeURIComponent(d.n||"6")+"&theme="+encodeURIComponent(d.theme||"dark")+"&s="+s+"&h="+encodeURIComponent(h),
f=document.createElement("iframe");f.src=u;f.title=lv?(fr?"Matchs de foot en direct et probabilités - AI Football Predictor":"Live football matches and probabilities - AI Football Predictor"):(fr?"Probabilités des matchs de foot - AI Football Predictor":"Football match probabilities - AI Football Predictor");f.loading="lazy";f.style.cssText="width:100%;max-width:520px;border:0;height:420px;display:block";
var a=el.querySelector("a");if(!a){a=document.createElement("a");a.href=S+(fr?"fr/":"");a.textContent=lv?(fr?"Foot en direct par AI Football Predictor":"Live football by AI Football Predictor"):(fr?"Probabilités foot par AI Football Predictor":"Football probabilities by AI Football Predictor");el.appendChild(a)}
a.style.cssText="display:block;max-width:520px;font:11px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#7d8ba1;text-align:right;text-decoration:none;margin-top:4px";el.insertBefore(f,el.firstChild);
addEventListener("message",function(e){if(e.source===f.contentWindow&&e.data&&e.data.afp)f.style.height=e.data.h+"px"})}
function go(){var l=document.querySelectorAll(".afp-widget");for(var i=0;i<l.length;i++)mk(l[i])}
if(document.readyState=="loading")document.addEventListener("DOMContentLoaded",go);else go()})();
