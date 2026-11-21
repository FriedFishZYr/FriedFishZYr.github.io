/* ==========================================================================
   mufin-article.js — the contents bar shared by the two MuFIN articles
   (work/mufin-generation/ and work/mufin/), loaded with `defer`.
   No libraries, no network requests.

   The contents rail at the left of the lead row turns into a one-row bar
   under the top bar. On wide screens the bar slides down from behind the
   top bar once the rail has scrolled out of sight, and slides back up when
   the rail returns. On screens too narrow for the rail it is always there.
   The bar shows the current section; clicking it opens the contents.

   It is built from the rail in the page, so it needs: a `.topbar`, a
   `.toc .toc__list`, and `.sec[id]` sections that each contain an h2.

   Without JavaScript the bar never appears: wide screens keep the rail and
   narrow screens show the same list behind a disclosure (`.toc-mini`).
   ========================================================================== */

(function () {
  "use strict";

  function initSectionBar() {
    var topbar = document.querySelector(".topbar");
    var rail = document.querySelector(".toc");
    var railList = rail && rail.querySelector(".toc__list");
    if (!topbar || !railList || !("IntersectionObserver" in window)) return;

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
      '<span class="secbar__label">' +
      '<span class="secbar__num"></span>' +
      '<span class="secbar__title">Contents</span>' +
      "</span>" +
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

    // Right after the top bar, so it follows it in reading and tab order.
    topbar.parentNode.insertBefore(bar, topbar.nextSibling);
    document.documentElement.classList.add("has-secbar");

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

    // Show the bar when the rail is not on screen: scrolled up behind the
    // top bar, or hidden altogether on narrow screens (its box is then
    // empty, which counts as gone too).
    var topH = topbar.offsetHeight;
    new IntersectionObserver(
      function (entries) {
        var e = entries[entries.length - 1];
        var gone = !e.isIntersecting && e.boundingClientRect.bottom <= topH + 1;
        bar.classList.toggle("is-visible", gone);
        if (!gone) closeMenu(false);
      },
      { rootMargin: "-" + topH + "px 0px 0px 0px" }
    ).observe(rail);

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
