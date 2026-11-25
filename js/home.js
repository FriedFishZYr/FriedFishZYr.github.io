/* ==========================================================================
   home.js — Home page only, loaded with `defer`. No libraries. Without
   JavaScript the page still works: the full name stays in the header, the
   links are plain links, the statement is a plain sentence, and every
   piece of work is listed with a still cover.

   1. Header: dark bar + name collapses to "Y/Z" once the page scrolls.
   2. Dropdowns (Work, Contact) and the mobile menu.
   3. Statement words and the filter row: study / design / build.
   4. Covers: drawn inline so their parts can move on hover (css/home.css).
   ========================================================================== */

(function () {
  "use strict";

  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  /* ---------- 1. Header ---------- */

  function initHeader() {
    var hdr = document.querySelector("[data-hdr]");
    var sentinel = document.querySelector("[data-hdr-sentinel]");
    if (!hdr) return;

    // Give each collapsing part of the name its own width, so the collapse
    // animates from the real width rather than a guess.
    function measure() {
      var wasScrolled = hdr.classList.contains("is-scrolled");
      hdr.classList.remove("is-scrolled");
      all(".brand__c", hdr).forEach(function (el) {
        el.style.setProperty("--w", "none");
        el.style.setProperty("--w", el.getBoundingClientRect().width + 1 + "px");
      });
      if (wasScrolled) hdr.classList.add("is-scrolled");
    }
    measure();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);

    if (sentinel && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        hdr.classList.toggle("is-scrolled", !entries[0].isIntersecting);
      }).observe(sentinel);
    }
  }

  /* ---------- 2. Dropdowns and mobile menu ---------- */

  function initMenus() {
    var hdr = document.querySelector("[data-hdr]");
    if (!hdr) return;
    var open = null; // { button, panel }

    // Each dropdown is a plain link in the HTML (so it works without
    // JavaScript); here it becomes a button that opens its panel.
    all("[data-dd]", hdr).forEach(function (link) {
      var panel = document.getElementById(link.getAttribute("data-dd"));
      if (!panel) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = link.className;
      btn.innerHTML = link.innerHTML;
      btn.setAttribute("data-dd", link.getAttribute("data-dd"));
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", panel.id);
      link.parentNode.replaceChild(btn, link);

      btn.addEventListener("click", function () {
        if (open && open.button === btn) close(false);
        else {
          close(false);
          panel.hidden = false;
          btn.setAttribute("aria-expanded", "true");
          open = { button: btn, panel: panel };
        }
      });
    });

    function close(returnFocus) {
      if (!open) return;
      open.panel.hidden = true;
      open.button.setAttribute("aria-expanded", "false");
      if (returnFocus) open.button.focus();
      open = null;
    }

    // Mobile menu
    var toggle = hdr.querySelector("[data-hdr-toggle]");
    if (toggle) toggle.hidden = false;

    function setMenu(isOpen, returnFocus) {
      hdr.classList.toggle("is-open", isOpen);
      if (toggle) toggle.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen && returnFocus && toggle) toggle.focus();
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        setMenu(!hdr.classList.contains("is-open"), false);
      });
    }

    // Following a link closes everything.
    hdr.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        close(false);
        setMenu(false, false);
      }
    });

    document.addEventListener("click", function (e) {
      if (!hdr.contains(e.target)) {
        close(false);
        setMenu(false, false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (open) close(true);
      else if (hdr.classList.contains("is-open")) setMenu(false, true);
    });

    // Close a dropdown when focus leaves it.
    hdr.addEventListener("focusout", function (e) {
      if (!open) return;
      var to = e.relatedTarget;
      if (to && !open.panel.contains(to) && to !== open.button) close(false);
    });

    // Returning to a wide screen resets the mobile menu.
    window.matchMedia("(min-width: 821px)").addEventListener("change", function (m) {
      if (m.matches) setMenu(false, false);
    });
  }

  /* ---------- 3. Statement words and filter row ----------
     Each piece lists what it shows in data-skills ("study", "design",
     "build"). The three marked words in the statement and the row above
     the grid are two sets of buttons for the same filter. Pointing at a
     word previews it (the other pieces fade); pressing it keeps only the
     matching pieces; pressing it again shows everything. */

  function initSkills() {
    var pieces = all(".piece[data-skills]");
    var statement = document.querySelector("[data-statement]");
    var bar = document.querySelector("[data-filters]");
    var countEl = document.querySelector("[data-work-count]");
    var labelEl = document.querySelector("[data-work-label]");
    if (!pieces.length) return;

    var current = "all";
    var hovered = null;

    // The marked words become real buttons.
    var words = statement
      ? all("[data-skill]", statement).map(function (span) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "verb";
          btn.textContent = span.textContent;
          btn.setAttribute("data-skill", span.getAttribute("data-skill"));
          btn.setAttribute("aria-pressed", "false");
          btn.setAttribute("aria-controls", "work-grid");
          span.parentNode.replaceChild(btn, span);
          return btn;
        })
      : [];
    var buttons = bar ? all("[data-filter]", bar) : [];
    if (bar) bar.hidden = false;

    function shows(piece, skill) {
      return skill === "all" || piece.getAttribute("data-skills").split(/\s+/).indexOf(skill) !== -1;
    }

    function paint() {
      pieces.forEach(function (p) {
        p.classList.toggle("is-dim", !!hovered && !shows(p, hovered));
      });
      words.forEach(function (w) {
        var skill = w.getAttribute("data-skill");
        w.setAttribute("aria-pressed", String(skill === current));
        w.classList.toggle("is-lit", skill === hovered);
      });
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === current));
      });
      if (statement) statement.classList.toggle("is-quiet", current !== "all" || !!hovered);
    }

    function apply(skill) {
      current = skill;
      var n = 0;
      pieces.forEach(function (p) {
        var show = shows(p, skill);
        p.hidden = !show;
        if (show) n++;
      });
      if (countEl) countEl.textContent = n;
      if (labelEl) labelEl.textContent = n === 1 ? "piece" : "pieces";
      paint();
    }

    function preview(skill) {
      hovered = skill;
      paint();
    }

    words.forEach(function (w) {
      var skill = w.getAttribute("data-skill");
      w.addEventListener("click", function () {
        hovered = null;
        apply(current === skill ? "all" : skill);
      });
      w.addEventListener("mouseenter", function () {
        preview(skill);
      });
      w.addEventListener("mouseleave", function () {
        preview(null);
      });
      w.addEventListener("focus", function () {
        if (w.matches(":focus-visible")) preview(skill);
      });
      w.addEventListener("blur", function () {
        preview(null);
      });
    });

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.getAttribute("data-filter"));
      });
    });
  }

  /* ---------- 4. Covers ----------
     The covers are SVG files (assets/covers/). To move their parts on
     hover, each <img data-cover="name"> is swapped for the same drawing
     inline. Layer names from Figma arrive as ids; they are copied to
     data-part (which the CSS uses) and the ids are prefixed with the cover
     name, so two covers on one page never share an id. If a file fails to
     load or a layer is renamed, the cover simply stays still. */

  function initCovers() {
    if (!window.fetch || !window.DOMParser) return;

    all("img[data-cover]").forEach(function (img) {
      var name = img.getAttribute("data-cover");

      fetch(img.getAttribute("src"))
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          return res.text();
        })
        .then(function (text) {
          var svg = new DOMParser().parseFromString(text, "image/svg+xml").documentElement;
          if (!svg || svg.nodeName.toLowerCase() !== "svg") return;

          all("script", svg).forEach(function (el) {
            el.parentNode.removeChild(el);
          });
          all("[id]", svg).forEach(function (el) {
            el.setAttribute("data-part", el.id);
            el.id = name + "-" + el.id;
          });
          all("[clip-path]", svg).forEach(function (el) {
            el.setAttribute("clip-path", el.getAttribute("clip-path").replace(/url\(#([^)]+)\)/, "url(#" + name + "-$1)"));
          });

          svg.removeAttribute("width");
          svg.removeAttribute("height");
          svg.setAttribute("class", "cover cover--" + name);
          svg.setAttribute("role", "img");
          svg.setAttribute("aria-label", img.getAttribute("alt") || "");
          img.parentNode.replaceChild(document.importNode(svg, true), img);
        })
        .catch(function () {
          /* Keep the still image. */
        });
    });
  }

  function init() {
    initHeader();
    initMenus();
    initSkills();
    initCovers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
