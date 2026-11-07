/* AI Football Predictor - free widget - https://jeremstyke.github.io/ai-football-predictor/widget/
   <div class="afp-widget" data-lang="fr" data-lg="F1,CL" data-team="" data-n="6" data-theme="dark"></div>
   <script async src="https://jeremstyke.github.io/ai-football-predictor/embed.js"></script> */
(function(){var B="https://jeremstyke.github.io/ai-football-predictor/w/";
function mk(el){if(el.getAttribute("data-afp-done"))return;el.setAttribute("data-afp-done","1");var d=el.dataset,s=(location.hostname||"").replace(/^www\./,"").replace(/[^a-z0-9]/gi,"").slice(0,20),
u=B+"?lang="+encodeURIComponent(d.lang||"")+"&lg="+encodeURIComponent(d.lg||"")+"&team="+encodeURIComponent(d.team||"")+"&n="+encodeURIComponent(d.n||"6")+"&theme="+encodeURIComponent(d.theme||"dark")+"&s="+s,
f=document.createElement("iframe");f.src=u;f.title="AI Football Predictor";f.loading="lazy";f.style.cssText="width:100%;max-width:520px;border:0;height:420px;display:block";el.appendChild(f);
addEventListener("message",function(e){if(e.source===f.contentWindow&&e.data&&e.data.afp)f.style.height=e.data.h+"px"})}
function go(){var l=document.querySelectorAll(".afp-widget");for(var i=0;i<l.length;i++)mk(l[i])}
if(document.readyState=="loading")document.addEventListener("DOMContentLoaded",go);else go()})();
