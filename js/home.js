/* ==========================================================================
   home.js — Home page only, loaded with `defer`. No libraries, no network
   requests. Without JavaScript the page still works: the full name stays
   in the header, pills are plain links, featured pieces stack, and every
   piece of work is listed.

   1. Header: dark bar + name collapses to "Y/Z" once the page scrolls.
   2. Dropdowns (Work, Contact) and the mobile menu.
   3. Carousels (project columns on small screens, featured band).
   4. Filters for the list of work.
   ========================================================================== */

(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

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
      Array.prototype.forEach.call(hdr.querySelectorAll(".brand__c"), function (el) {
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
    Array.prototype.forEach.call(hdr.querySelectorAll("[data-dd]"), function (link) {
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

  /* ---------- 3. Carousels ---------- */

  function initCarousel(root) {
    var track = root.querySelector("[data-track]");
    var pager = root.querySelector("[data-pager]");
    if (!track || !pager) return;
    var slides = Array.prototype.slice.call(track.querySelectorAll("[data-slide]"));
    var prev = pager.querySelector("[data-prev]");
    var next = pager.querySelector("[data-next]");
    var countEl = pager.querySelector("[data-count]");
    var totalEl = pager.querySelector("[data-total]");
    var index = 0;

    function pad(n) {
      return n < 10 ? "0" + n : String(n);
    }
    totalEl.textContent = pad(slides.length);

    // Index of the slide nearest the left edge of the track.
    function current() {
      var left = track.getBoundingClientRect().left;
      var best = 0;
      var bestDist = Infinity;
      slides.forEach(function (s, i) {
        var d = Math.abs(s.getBoundingClientRect().left - left);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      return best;
    }

    function atEnd() {
      return track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    }

    function sync() {
      var overflow = track.scrollWidth > track.clientWidth + 2;
      pager.hidden = !overflow;
      if (!overflow) return;
      index = atEnd() ? slides.length - 1 : current();
      countEl.textContent = pad(index + 1);
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = atEnd();
    }

    function go(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      var left = slides[i].offsetLeft - slides[0].offsetLeft;
      track.scrollTo({ left: left, behavior: reduce.matches ? "auto" : "smooth" });
    }

    prev.addEventListener("click", function () {
      go(current() - 1);
    });
    next.addEventListener("click", function () {
      go(current() + 1);
    });

    var raf = 0;
    track.addEventListener("scroll", function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    });
    window.addEventListener("resize", sync);
    sync();
  }

  /* ---------- 4. Filters ---------- */

  function initFilters() {
    var bar = document.querySelector("[data-filters]");
    if (!bar) return;
    var rows = Array.prototype.slice.call(document.querySelectorAll(".piece[data-project]"));
    var buttons = Array.prototype.slice.call(bar.querySelectorAll("[data-filter]"));
    var countEl = document.querySelector("[data-work-count]");
    var labelEl = document.querySelector("[data-work-label]");
    bar.hidden = false;

    function apply(filter) {
      var n = 0;
      rows.forEach(function (r) {
        var show = filter === "all" || r.getAttribute("data-project") === filter;
        r.hidden = !show;
        if (show) n++;
      });
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === filter));
      });
      countEl.textContent = n;
      labelEl.textContent = n === 1 ? "piece" : "pieces";
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.getAttribute("data-filter"));
      });
    });
  }

  function init() {
    initHeader();
    initMenus();
    Array.prototype.forEach.call(document.querySelectorAll("[data-carousel]"), initCarousel);
    initFilters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
