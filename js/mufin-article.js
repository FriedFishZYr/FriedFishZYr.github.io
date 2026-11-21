/* ==========================================================================
   mufin-article.js — the section bar shared by the two MuFIN articles
   (work/mufin-generation/ and work/mufin/), loaded with `defer`.
   No libraries, no network requests.

   Once the lead row has scrolled away, a slim bar fixed to the top shows
   the current section; clicking it opens the contents. It is built from the
   contents rail in the page, so it needs: an element with id="lead", a
   `.toc .toc__list`, and `.sec[id]` sections that each contain an h2.

   Without JavaScript the bar never appears: the contents rail at the top is
   the only contents list, which is fine.
   ========================================================================== */

(function () {
  "use strict";

  function initSectionBar() {
    var lead = document.getElementById("lead");
    var railList = document.querySelector(".toc .toc__list");
    if (!lead || !railList || !("IntersectionObserver" in window)) return;

    var sections = Array.prototype.slice.call(
      document.querySelectorAll(".sec[id]")
    );
    var headings = sections.map(function (s) {
      return s.querySelector("h2");
    });
    if (!sections.length) return;

    // Build the bar from the rail so the two lists never drift apart.
    var bar = document.createElement("div");
    bar.className = "secbar";
    bar.innerHTML =
      '<div class="secbar__inner">' +
      '<button class="secbar__toggle" type="button" aria-expanded="false" aria-controls="secbar-menu">' +
      '<span class="secbar__num"></span>' +
      '<span class="secbar__title">Contents</span>' +
      '<svg class="secbar__chev" viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M1.5 3.5L5 7l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</button>" +
      '<nav class="secbar__menu" id="secbar-menu" aria-label="Contents" hidden></nav>' +
      "</div>";

    var toggle = bar.querySelector(".secbar__toggle");
    var numEl = bar.querySelector(".secbar__num");
    var titleEl = bar.querySelector(".secbar__title");
    var menu = bar.querySelector(".secbar__menu");
    var list = railList.cloneNode(true);
    menu.appendChild(list);
    var links = Array.prototype.slice.call(list.querySelectorAll("a"));

    document.body.insertBefore(bar, document.body.firstChild.nextSibling);

    var current = -1;

    function setCurrent(i) {
      if (i === current) return;
      current = i;
      links.forEach(function (a, j) {
        if (j === i) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
      if (i < 0) {
        numEl.textContent = "";
        titleEl.textContent = "Contents";
      } else {
        numEl.textContent = links[i].querySelector(".toc__num").textContent;
        titleEl.textContent = links[i].querySelector(".toc__title").textContent;
      }
    }

    function openMenu() {
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
    }

    function closeMenu(returnFocus) {
      if (menu.hidden) return;
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener("click", function () {
      if (menu.hidden) openMenu();
      else closeMenu(false);
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) closeMenu(true);
    });

    document.addEventListener("click", function (e) {
      if (!bar.contains(e.target)) closeMenu(false);
    });

    bar.addEventListener("focusout", function (e) {
      if (e.relatedTarget && !bar.contains(e.relatedTarget)) closeMenu(false);
    });

    // Show the bar only once the lead row is above the viewport.
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      var past = !e.isIntersecting && e.boundingClientRect.top < 0;
      bar.classList.toggle("is-visible", past);
      if (!past) closeMenu(false);
    }).observe(lead);

    // Current section: the last heading above the line 45% of the way down
    // the viewport. Before 01 the bar just says "Contents".
    function update() {
      var line = window.innerHeight * 0.45;
      var found = -1;
      for (var i = 0; i < headings.length; i++) {
        if (headings[i].getBoundingClientRect().top < line) found = i;
        else break;
      }
      setCurrent(found);
    }

    // Every block of the article is watched through a band in the middle of
    // the viewport. The band (10% of the height) is taller than the gaps
    // between blocks, so any scroll or anchor jump makes some block enter
    // or leave it, which triggers update().
    var bandObserver = new IntersectionObserver(update, {
      rootMargin: "-45% 0px -45% 0px",
    });
    Array.prototype.forEach.call(
      document.querySelectorAll(".article > *, .sec > *"),
      function (el) {
        bandObserver.observe(el);
      }
    );
    update();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSectionBar);
  } else {
    initSectionBar();
  }
})();
