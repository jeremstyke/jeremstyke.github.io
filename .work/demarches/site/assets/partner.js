/* 21 nov 2026 (Jeremy) : partenaire NordVPN (lien affilié, source demarches) dans les pages organismes et les guides.
   Chargé par assets/track.js. Placé après le premier paragraphe du contenu. */
(function () {
  function run() { try {
    var c = document.querySelector("main .content"); if (!c || document.getElementById("dm-vpn")) return;
    var d = document.createElement("aside"); d.id = "dm-vpn";
    d.innerHTML = '<span class="s">Partenaire recommandé</span><b>Vous envoyez vos papiers en ligne ? Protégez votre connexion.</b><p>Pièce d\'identité, avis d\'imposition, RIB : sur un Wi-Fi public (café, gare, médiathèque), ce que vous envoyez peut être espionné. NordVPN chiffre votre connexion et masque votre adresse IP, sur téléphone comme sur ordinateur.</p><a target="_blank" rel="sponsored noopener" href="https://go.nordvpn.net/aff_c?offer_id=15&amp;aff_id=155375&amp;source=demarches">Protéger ma connexion avec NordVPN</a><small>Lien affilié, sans surcoût pour vous.</small>';
    var st = document.createElement("style");
    st.textContent = "#dm-vpn{display:block;background:#17233b;color:#fff;border-radius:12px;padding:18px 20px;margin:1.6em 0;font:15px/1.55 system-ui,-apple-system,Segoe UI,sans-serif}#dm-vpn .s{display:block;font-size:12px;color:#aab6cf}#dm-vpn b{display:block;font-size:18px;line-height:1.3;margin:4px 0 6px;color:#fff}#dm-vpn p{margin:0 0 14px;color:#d8deeb}#dm-vpn a{display:inline-block;background:#fff;color:#17233b;text-decoration:none;font-weight:700;border-radius:8px;padding:10px 16px}#dm-vpn a:hover{background:#e9edf6}#dm-vpn small{display:block;margin-top:10px;font-size:12px;color:#aab6cf}";
    document.head.appendChild(st);
    var p = c.querySelector(":scope > p");
    if (p) p.parentNode.insertBefore(d, p.nextSibling); else c.insertBefore(d, c.firstChild);
  } catch (e) {} }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
