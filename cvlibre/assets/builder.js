/* Créateur de CV : état, formulaire, aperçu en direct, impression PDF. Tout reste dans le navigateur. */
(function () {
  "use strict";
  var KEY = "cvlibre.v1";
  var COLORS = [["#1f4fd8", "Bleu"], ["#0f766e", "Vert"], ["#9d174d", "Prune"], ["#b45309", "Ambre"], ["#374151", "Ardoise"], ["#111827", "Noir"]];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };

  var LISTS = {
    exp: { el: "#exp-list", label: "Expérience", blank: { role: "", company: "", city: "", from: "", to: "", desc: "" }, fields: [
      ["role", "Poste", "text", "full"], ["company", "Entreprise", "text", "half"], ["city", "Ville", "text", "half"],
      ["from", "Début", "text", "half", "Ex. Sept. 2022"], ["to", "Fin", "text", "half", "Ex. Aujourd'hui"],
      ["desc", "Missions et résultats", "area", "full", "Une ligne par mission. Commence la ligne par un tiret pour faire une puce."]] },
    edu: { el: "#edu-list", label: "Formation", blank: { degree: "", school: "", from: "", to: "", desc: "" }, fields: [
      ["degree", "Diplôme ou formation", "text", "full"], ["school", "École ou université", "text", "full"],
      ["from", "Début", "text", "half"], ["to", "Fin", "text", "half"], ["desc", "Détails (facultatif)", "area", "full"]] },
    langs: { el: "#langs-list", label: "Langue", blank: { name: "", level: "" }, fields: [
      ["name", "Langue", "text", "half"], ["level", "Niveau", "text", "half", "Ex. Courant (C1)"]] }
  };

  var S = load(), saveT = 0;
  function load() {
    try {
      var t = localStorage.getItem(KEY);
      if (t) { var o = JSON.parse(t); if (o && typeof o === "object") return Object.assign(clone(CVR.sample), o); }
    } catch (e) {}
    return clone(CVR.sample);
  }
  function flush() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function save() { clearTimeout(saveT); saveT = setTimeout(flush, 300); }
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(); });

  /* ---------- aperçu ---------- */
  var sheet = $("#sheet"), pbox = $("#pbox"), warn = $("#pages-warn");
  function paint() {
    sheet.className = "sheet t-" + S.tpl;
    sheet.style.setProperty("--acc", S.accent);
    sheet.innerHTML = CVR.render(S);
    fit();
    $$("#tpls button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.tpl === S.tpl)); });
    $$("#swatches button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.c === S.accent)); });
  }
  function fit() {
    var w = pbox.clientWidth, sw = sheet.offsetWidth;
    if (!w || !sw) return;
    var k = w / sw;
    sheet.style.transform = "scale(" + k + ")";
    pbox.style.height = Math.ceil(sheet.offsetHeight * k) + "px";
    var pages = Math.ceil((sheet.offsetHeight - 3) / (297 * 96 / 25.4));
    if (pages > 1) { warn.hidden = false; warn.textContent = "Ton CV fait " + pages + " pages. Pour la plupart des candidatures, une page suffit : raccourcis les descriptions ou garde les expériences les plus récentes."; }
    else warn.hidden = true;
  }
  function changed() { save(); paint(); }

  /* ---------- champs simples ---------- */
  $$("[data-k]").forEach(function (el) {
    el.value = S[el.dataset.k] || "";
    el.addEventListener("input", function () { S[el.dataset.k] = el.value; changed(); });
  });

  /* ---------- listes (expériences, formations, langues) ---------- */
  function renderList(key) {
    var cfg = LISTS[key], box = $(cfg.el), arr = S[key];
    box.innerHTML = "";
    arr.forEach(function (item, i) {
      var card = document.createElement("div"); card.className = "item";
      var head = document.createElement("div"); head.className = "item-head";
      var t = document.createElement("strong"); t.textContent = cfg.label + " " + (i + 1);
      var mini = document.createElement("div"); mini.className = "mini";
      [["↑", "Monter", -1], ["↓", "Descendre", 1], ["×", "Supprimer", 0]].forEach(function (a) {
        var b = document.createElement("button"); b.type = "button"; b.textContent = a[0];
        b.setAttribute("aria-label", a[1] + " : " + cfg.label.toLowerCase() + " " + (i + 1));
        if ((a[2] === -1 && i === 0) || (a[2] === 1 && i === arr.length - 1)) b.disabled = true;
        b.addEventListener("click", function () {
          if (a[2] === 0) arr.splice(i, 1);
          else { var j = i + a[2], tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; }
          renderList(key); changed();
        });
        mini.appendChild(b);
      });
      head.appendChild(t); head.appendChild(mini); card.appendChild(head);
      var row = null;
      cfg.fields.forEach(function (f) {
        var id = key + "-" + i + "-" + f[0], wrap = document.createElement("div"); wrap.className = "fld";
        var lab = document.createElement("label"); lab.htmlFor = id; lab.textContent = f[1];
        var inp = document.createElement(f[2] === "area" ? "textarea" : "input"); inp.id = id; inp.value = item[f[0]] || "";
        if (f[4] && f[2] !== "area") inp.placeholder = f[4];
        wrap.appendChild(lab); wrap.appendChild(inp);
        if (f[4] && f[2] === "area") { var h = document.createElement("span"); h.className = "hint"; h.textContent = f[4]; wrap.appendChild(h); }
        inp.addEventListener("input", function () { item[f[0]] = inp.value; changed(); });
        if (f[3] === "half") {
          if (!row) { row = document.createElement("div"); row.className = "row2"; card.appendChild(row); }
          row.appendChild(wrap);
          if (row.children.length === 2) row = null;
        } else { row = null; card.appendChild(wrap); }
      });
      box.appendChild(card);
    });
  }
  $$("[data-add]").forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.dataset.add; S[k].push(clone(LISTS[k].blank)); renderList(k); changed();
      var last = $(LISTS[k].el + " .item:last-child input"); if (last) last.focus();
    });
  });
  Object.keys(LISTS).forEach(renderList);

  /* ---------- modèle et couleur ---------- */
  $$("#tpls button").forEach(function (b) { b.addEventListener("click", function () { S.tpl = b.dataset.tpl; changed(); }); });
  COLORS.forEach(function (c) {
    var b = document.createElement("button"); b.type = "button"; b.dataset.c = c[0]; b.style.background = c[0];
    b.setAttribute("aria-label", c[1]); b.title = c[1];
    b.addEventListener("click", function () { S.accent = c[0]; changed(); });
    $("#swatches").appendChild(b);
  });

  /* ---------- photo ---------- */
  var prev = $("#photo-prev"), del = $("#photo-del");
  function photoUI() { prev.style.backgroundImage = S.photo ? "url(" + S.photo + ")" : "none"; del.hidden = !S.photo; }
  $("#photo-file").addEventListener("change", function (e) {
    var f = e.target.files && e.target.files[0]; if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      var img = new Image();
      img.onload = function () {
        var s = Math.min(img.width, img.height), c = document.createElement("canvas"); c.width = c.height = 360;
        c.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 360, 360);
        S.photo = c.toDataURL("image/jpeg", 0.85); photoUI(); changed();
      };
      img.src = rd.result;
    };
    rd.readAsDataURL(f);
  });
  del.addEventListener("click", function () { S.photo = ""; $("#photo-file").value = ""; photoUI(); changed(); });

  /* ---------- impression PDF ---------- */
  var oldTitle = document.title;
  $("#print").addEventListener("click", function () {
    var n = (S.name || "").trim();
    document.title = n ? "CV " + n : "CV";
    window.print();
  });
  window.addEventListener("afterprint", function () { document.title = oldTitle; });

  /* ---------- repartir de zéro ---------- */
  var rst = $("#reset"), rstT = 0;
  rst.addEventListener("click", function () {
    if (rst.dataset.arm !== "1") {
      rst.dataset.arm = "1"; rst.textContent = "Confirmer l'effacement";
      rstT = setTimeout(function () { rst.dataset.arm = ""; rst.textContent = "Repartir de zéro"; }, 4000); return;
    }
    clearTimeout(rstT); rst.dataset.arm = ""; rst.textContent = "Repartir de zéro";
    var keepTpl = S.tpl, keepAcc = S.accent;
    S = { tpl: keepTpl, accent: keepAcc, photo: "", name: "", title: "", email: "", phone: "", city: "", link: "", summary: "", exp: [clone(LISTS.exp.blank)], edu: [clone(LISTS.edu.blank)], skills: "", langs: [clone(LISTS.langs.blank)], hobbies: "" };
    $$("[data-k]").forEach(function (el) { el.value = ""; });
    Object.keys(LISTS).forEach(renderList); photoUI(); changed();
  });

  /* ---------- onglets mobile ---------- */
  $$(".mobile-tabs button").forEach(function (b) {
    b.addEventListener("click", function () {
      document.body.dataset.tab = b.dataset.tab;
      $$(".mobile-tabs button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      setTimeout(fit, 30); window.scrollTo(0, 0);
    });
  });

  window.addEventListener("resize", fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  photoUI(); paint();
})();
