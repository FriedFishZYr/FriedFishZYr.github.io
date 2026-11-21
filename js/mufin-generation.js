/* ==========================================================================
   mufin-generation.js — the walkthrough demo on the MuFIN Generation
   article, loaded with `defer` by work/mufin-generation/index.html.
   No libraries, no network requests.

   The demo lives behind initMufinDemo(root). Without JavaScript the page
   shows step 1 of it, inert, plus a note. The section bar that both MuFIN
   articles share is in js/article.js.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Walkthrough demo ----------
     One scripted example, two flows (Layered, Non-layered). State lives in
     memory only; reloading resets it. No network requests, no model calls:
     every "feedback" string below is authored copy from Figma (or, for the
     three marked NEW, from the handoff). */

  // On-screen copy, from the Figma Walkthrough page (frames 135:576–135:1145).
  var COPY = {
    practice: "PRACTICE · DERIVATIVE AT A POINT",
    q1: "Which difference quotient gives the slope of f(x) = x² at a = 2?",
    options: {
      A: "lim x→2  (x² − 4) / (x + 2)",
      B: "lim x→2  (x² − 2) / (x − 2)",
      C: "lim x→2  (x² − 4) / (x − 2)",
      D: "lim x→2  (x − 2) / (x² − 4)",
    },
    check: "Check answer",
    scripted: "SCRIPTED STEP",
    chooseA: "Choose option A",
    chooseText: function (flow) {
      return (
        "It uses x + 2 as the bottom. Checking it opens the feedback for the " +
        (flow === "layered" ? "layered" : "non-layered") +
        " condition."
      );
    },
    s1Label: "SECTION 1 · VISUAL DIAGNOSIS",
    cap1: "Your top, x² − 4, measures how far the height moved from the point at 2. Your bottom, x + 2, measures from −2 instead. Compare the two bars.",
    cap2: "Slide x closer to 2. The solid bar from 2 shrinks toward zero, just like the change in height. The dashed bar from −2 stays above 4.",
    drag: "Drag x toward 2",
    toQuestion: "Continue to the question",
    toRule: "Continue to the rule",
    conceptLabel: "SECTION 2 · CONCEPT AND NEW EXAMPLE",
    conceptQ: "Measure every change from one fixed point, a.",
    rule: "f′(a) = lim x→a  ( f(x) − f(a) ) / ( x − a )",
    ruleText: "The bottom, x − a, is the horizontal step from the fixed point a to the moving input x.",
    exLabel: "NEW EXAMPLE · f(x) = x³ AT a = 1",
    exFormula: "f′(1) = lim x→1  (x³ − 1) / (x − 1)",
    exText: "Top and bottom both measure change from 1.",
    conceptCapLabel: "SECTION 2 · CONCEPT AND EXAMPLE",
    conceptCap: "The rule fixes one point, a, and measures every change from it. In a new example with a = 1, the bottom becomes x − 1.",
    turnLabel: function (flow) {
      return flow === "layered" ? "SECTION 2 · YOUR TURN" : "SECTION 3 · YOUR TURN";
    },
    turnQ: "Keep the top. What should the bottom be so it measures from 2?",
    sample: "Scripted sample input: x − 2",
    useSample: "Use sample answer",
    submit: "Submit",
    right: "Correct. x − 2 is the step from the fixed point 2 to x, the same starting point as the numerator.",
    simulated: "Simulated runtime feedback · authored copy",
    locked: "NEXT STEP LOCKED",
    lockedText: "Submit an answer and read its feedback to continue. The answer does not have to be correct.",
    unlocked: "NEXT STEP UNLOCKED",
    unlockedText: function (flow) {
      return flow === "layered"
        ? "Go back to the original question and revise your answer."
        : "The explanation of the original answer is now available.";
    },
    nextAfterAnswer: function (flow) {
      return flow === "layered" ? "Return to the original question" : "Show the answer explanation";
    },
    q4: "Back to the original question. Which quotient measures both changes from 2?",
    revise: "REVISE",
    dimmed: "Your first choice is dimmed",
    pick: "Pick the quotient whose bottom starts at 2.",
    confirm: "Correct. Top and bottom now both measure change from x = 2.",
    endLabel: function (flow) {
      return flow === "layered" ? "END OF LAYERED FLOW" : "END OF NON-LAYERED FLOW";
    },
    endTitle: "Restart, or compare with the other condition",
    restart: "Restart",
    back: "Back to case study",
    other: function (flow) {
      return flow === "layered" ? "Try the non-layered flow" : "Try the layered flow";
    },
    explLabel: "SECTION 4 · ANSWER EXPLANATION",
    explQ: "The correct choice is C.",
    explFormula: "f′(2) = lim x→2  (x² − 4) / (x − 2)",
    explText: "With a = 2, the denominator x − a becomes x − 2, so the top and the bottom both measure change from x = 2.",
    // NEW: written for the handoff, not in Figma, not yet reviewed.
    noteOnlyA: "This scripted example only includes the prepared feedback for option A.",
    wrong: "Not quite. The bottom should be the step from the fixed point 2 to x, which is x − 2.",
    noteRevisit: "In the study, another wrong answer repeats the diagnosis and question. This scripted example stops here, so pick again.",
  };

  var STEP_OF = { choose: 1, inspect: 2, concept: 2, answer: 3, revisit: 4, explain: 4 };
  var STEP_NAMES = ["Choose", "Inspect", "Answer", "Revisit"];
  var LINE_MS = 6000; // one narration line at 1.0×
  var SPEEDS = [1, 1.5, 0.75];

  // Graph geometry (component space, see handoff 5.5).
  var G = { ox: 255.2, oy: 226, ux: 68.5, uy: 20, solidY: 268, dashedY: 308 };
  function gx(x) {
    return G.ox + G.ux * x;
  }
  function gy(y) {
    return G.oy - G.uy * y;
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function trimZeros(s) {
    return s.indexOf(".") < 0 ? s : s.replace(/0+$/, "").replace(/\.$/, "");
  }

  function minus(s) {
    return s.replace(/^-/, "−");
  }

  // Read-outs: one decimal, two when x is within 0.1 of 2.
  function readouts(x) {
    var prec = Math.abs(x - 2) < 0.1 - 1e-9 ? 2 : 1;
    var d1 = x - 2;
    var d2 = x + 2;
    var d1s = trimZeros(d1.toFixed(prec));
    if (parseFloat(d1s) === 0) d1s = "0";
    return {
      x: minus(x.toFixed(prec)),
      d1: minus(d1s),
      d1abs: trimZeros(Math.abs(d1).toFixed(prec)),
      d2: trimZeros(d2.toFixed(prec)),
      point: "(" + trimZeros(x.toFixed(2)) + ", " + trimZeros((x * x).toFixed(2)) + ")",
    };
  }

  function initMufinDemo(root) {
    if (!root) return;
    var head = root.querySelector("[data-demo-head]");
    var body = root.querySelector("[data-demo-body]");
    var live = root.querySelector("[data-demo-live]");
    var nojs = root.querySelector("[data-demo-nojs]");
    if (!head || !body) return;
    if (nojs) nojs.parentNode.removeChild(nojs);
    body.removeAttribute("inert");
    body.classList.remove("is-inert");

    var uid = "mgd";
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    var S; // state
    var tl = { p: 1, playing: false, speed: 1, raf: 0, last: 0 };
    var dragAnim = 0;

    function freshState(flow) {
      return {
        flow: flow,
        screen: "choose",
        choice: "A",
        x: 3,
        reached: false,
        bars: { dashed: false, solid: false },
        answer: "",
        submitted: false,
        correct: false,
        pick: null,
        confirmed: false,
      };
    }

    /* ----- small builders ----- */

    function label(text, teal, tag, id) {
      tag = tag || "p";
      return (
        "<" + tag + ' class="demo-label' + (teal ? " demo-label--teal" : "") + '"' +
        (id ? ' id="' + id + '" tabindex="-1" data-focus' : "") +
        ">" + esc(text) + "</" + tag + ">"
      );
    }

    function heading(text, cls) {
      return '<h3 class="' + (cls || "demo-q") + '" id="' + uid + '-h" tabindex="-1" data-focus>' + esc(text) + "</h3>";
    }

    function noteCard(lab, title, text) {
      return (
        '<div class="demo-card">' +
        label(lab, true) +
        (title ? '<p class="demo-card__title">' + esc(title) + "</p>" : "") +
        (text ? '<p class="demo-card__text">' + esc(text) + "</p>" : "") +
        "</div>"
      );
    }

    function options(name, checked, dimA, disabledAll) {
      var html = "";
      ["A", "B", "C", "D"].forEach(function (k) {
        var dis = disabledAll || (dimA && k === "A");
        html +=
          '<label class="opt' + (dimA && k === "A" ? " is-dimmed" : "") + '">' +
          '<input class="opt__input" type="radio" name="' + name + '" value="' + k + '"' +
          (checked === k ? " checked" : "") + (dis ? " disabled" : "") + ">" +
          '<span class="opt__radio" aria-hidden="true"></span>' +
          '<span class="opt__letter">' + k + "</span>" +
          '<span class="opt__expr">' + esc(COPY.options[k]) + "</span>" +
          "</label>";
      });
      return html;
    }

    function chips(section) {
      var motion = !reduce.matches;
      return (
        '<div class="chips">' +
        (motion
          ? '<button class="chip chip--play" type="button" data-action="play">Pause</button>' +
            '<button class="chip" type="button" data-action="speed" aria-label="Playback speed 1.0×">1.0×</button>'
          : "") +
        '<span class="chip chip--static">Captions on</span>' +
        '<span class="chip chip--static">' + esc(section) + "</span>" +
        "</div>"
      );
    }

    function captionPanel(lab, labIsHeading, caption, section) {
      return (
        '<div class="demo-card demo-card--caption">' +
        (labIsHeading ? label(lab, true, "h3", uid + "-h") : label(lab, true)) +
        '<p class="demo-caption" data-caption>' + esc(caption) + "</p>" +
        (reduce.matches ? "" : '<div class="demo-progress" aria-hidden="true"><span data-progress></span></div>') +
        chips(section) +
        "</div>"
      );
    }

    function endActions() {
      return (
        noteCard(COPY.endLabel(S.flow), COPY.endTitle) +
        '<div class="demo-actions">' +
        '<button class="btn btn--secondary" type="button" data-action="restart" data-end-first>' + COPY.restart + "</button>" +
        '<a class="btn" href="#top">' + COPY.back + "</a>" +
        "</div>" +
        '<div class="demo-actions">' +
        '<button class="btn btn--secondary" type="button" data-action="other-flow">' + esc(COPY.other(S.flow)) + "</button>" +
        "</div>"
      );
    }

    function graphHTML() {
      var id = uid + "-x";
      return (
        '<div class="graph graph--live">' +
        '<svg class="graph__svg mg-live" viewBox="0 0 544 350" role="img" data-graph>' +
        '<use href="#mg-base"/>' +
        '<path data-g="drop" stroke="#6b7480" stroke-dasharray="3 4"/>' +
        '<path class="mg-solid" data-g="solid" stroke="#0f766e" stroke-width="6"/>' +
        '<path class="mg-dashed" data-g="dashed" stroke="#d9472f" stroke-width="4" stroke-dasharray="9 6"/>' +
        '<circle data-g="pt" r="7" fill="#faf9f6" stroke="#101418" stroke-width="2.5"/>' +
        '<text class="mg-fn" x="62" y="34">f(x) = x²</text>' +
        '<text class="mg-pt" x="382" y="136" text-anchor="end">(2, 4)</text>' +
        '<text class="mg-pt" data-g="ptlabel"></text>' +
        '<text class="mg-tick" x="97.2" y="215">−2</text>' +
        '<text class="mg-tick" x="378.2" y="215">2</text>' +
        '<text class="mg-tick" x="239.2" y="243">0</text>' +
        '<text class="mg-bar mg-bar--solid mg-solid" x="380" y="272" text-anchor="end" data-g="solidlabel"></text>' +
        '<text class="mg-bar mg-bar--dashed mg-dashed" x="126" y="294" data-g="dashedlabel"></text>' +
        "</svg>" +
        '<div class="mg-strip">' +
        '<label class="mg-strip__label" for="' + id + '">moving input x</label>' +
        '<span class="mg-range"><span class="mg-range__tick" aria-hidden="true"></span>' +
        '<input class="mg-range__input" id="' + id + '" type="range" min="1.6" max="3.2" step="0.05" value="' + S.x + '" data-range></span>' +
        '<output class="mg-strip__read" for="' + id + '" data-g="read"></output>' +
        "</div>" +
        "</div>"
      );
    }

    /* ----- screens: each returns [main, side] ----- */

    var screens = {
      choose: function () {
        return [
          label(COPY.practice) +
            heading(COPY.q1) +
            '<form class="demo-form" data-form="choose">' +
            '<fieldset class="opts" aria-labelledby="' + uid + '-h">' + options(uid + "-q1", S.choice) + "</fieldset>" +
            '<div class="demo-actions"><button class="btn" type="submit">' + COPY.check + "</button></div>" +
            '<p class="demo-note" data-note hidden></p>' +
            "</form>",
          noteCard(COPY.scripted, COPY.chooseA, COPY.chooseText(S.flow)),
        ];
      },

      inspect: function () {
        var section = S.flow === "layered" ? "Section 1 of 2" : "Section 1 of 4";
        return [
          graphHTML(),
          captionPanel(COPY.s1Label, true, S.reached ? COPY.cap2 : COPY.cap1, section) +
            '<div class="demo-actions"><button class="btn" type="button" data-action="' +
            (S.reached ? "next" : "drag") + '" data-inspect-btn>' +
            esc(S.reached ? (S.flow === "layered" ? COPY.toQuestion : COPY.toRule) : COPY.drag) +
            "</button></div>",
        ];
      },

      concept: function () {
        return [
          label(COPY.conceptLabel, true) +
            heading(COPY.conceptQ) +
            '<div class="rule-card"><p class="formula formula--24">' + esc(COPY.rule) + '</p><p class="rule-card__text">' + esc(COPY.ruleText) + "</p></div>" +
            '<div class="example-card">' + label(COPY.exLabel) + '<p class="formula formula--22">' + esc(COPY.exFormula) + '</p><p class="example-card__text">' + esc(COPY.exText) + "</p></div>",
          captionPanel(COPY.conceptCapLabel, false, COPY.conceptCap, "Section 2 of 4") +
            '<div class="demo-actions"><button class="btn" type="button" data-action="next">' + COPY.toQuestion + "</button></div>",
        ];
      },

      answer: function () {
        var id = uid + "-ans";
        var fb = "";
        if (S.submitted) {
          fb =
            '<div class="feedback' + (S.correct ? "" : " feedback--wrong") + '">' +
            '<p class="feedback__text">' + esc(S.correct ? COPY.right : COPY.wrong) + "</p>" +
            '<p class="feedback__meta">' + esc(COPY.simulated) + "</p>" +
            "</div>";
        }
        return [
          label(COPY.turnLabel(S.flow), true) +
            heading(COPY.turnQ) +
            '<form class="demo-form" data-form="answer">' +
            '<div class="quotient">' +
            '<span class="quotient__lim">lim x→2</span>' +
            '<span class="quotient__frac">' +
            '<span class="quotient__top">x² − 4</span>' +
            '<span class="quotient__bar" aria-hidden="true"></span>' +
            '<label class="visually-hidden" for="' + id + '">Denominator</label>' +
            '<input class="quotient__input' + (S.submitted ? (S.correct ? " is-right" : " is-sent") : "") +
            '" id="' + id + '" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="x − 2" value="' +
            esc(S.answer) + '"' + (S.submitted ? " readonly" : "") + " data-answer>" +
            "</span></div>" +
            '<p class="demo-sample"><span>' + esc(COPY.sample) + "</span>" +
            (S.submitted ? "" : '<button class="link-btn" type="button" data-action="sample">' + COPY.useSample + "</button>") +
            "</p>" +
            (S.submitted
              ? fb
              : '<div class="demo-actions"><button class="btn" type="submit" data-submit' + (S.answer.trim() ? "" : " disabled") + ">" + COPY.submit + "</button></div>") +
            "</form>",
          (S.submitted
            ? noteCard(COPY.unlocked, null, COPY.unlockedText(S.flow))
            : noteCard(COPY.locked, null, COPY.lockedText)) +
            '<div class="demo-actions"><button class="btn" type="button" data-action="next" data-next' +
            (S.submitted ? "" : " disabled") + ">" + esc(COPY.nextAfterAnswer(S.flow)) + "</button></div>",
        ];
      },

      revisit: function () {
        return [
          label(COPY.practice) +
            heading(COPY.q4) +
            '<form class="demo-form" data-form="revisit">' +
            '<fieldset class="opts" aria-labelledby="' + uid + '-h">' + options(uid + "-q4", S.pick, true, S.confirmed) + "</fieldset>" +
            (S.confirmed
              ? '<div class="confirm"><p>' + esc(COPY.confirm) + "</p></div>"
              : '<div class="demo-actions"><button class="btn" type="submit" data-check' + (S.pick ? "" : " disabled") + ">" + COPY.check + "</button></div>" +
                '<p class="demo-note" data-note hidden></p>') +
            "</form>",
          S.confirmed ? endActions() : noteCard(COPY.revise, COPY.dimmed, COPY.pick),
        ];
      },

      explain: function () {
        return [
          label(COPY.explLabel, true) +
            heading(COPY.explQ) +
            '<p class="formula formula--26">' + esc(COPY.explFormula) + "</p>" +
            '<p class="demo-expl">' + esc(COPY.explText) + "</p>",
          endActions(),
        ];
      },
    };

    /* ----- rendering ----- */

    function renderHead() {
      var step = STEP_OF[S.screen];
      var steps = STEP_NAMES.map(function (name, i) {
        var n = i + 1;
        return (
          "<li" + (n === step ? ' aria-current="step"' : "") + '><span class="pre">' + n + "  " + name + "</span>" +
          (n === step ? '<span class="visually-hidden"> (current step)</span>' : "") +
          "</li>"
        );
      }).join("");
      head.innerHTML =
        '<div class="demo-switch" role="group" aria-label="Feedback condition">' +
        '<button type="button" data-action="flow" data-flow="layered" aria-pressed="' + (S.flow === "layered") + '">Layered</button>' +
        '<button type="button" data-action="flow" data-flow="nonlayered" aria-pressed="' + (S.flow !== "layered") + '">Non-layered</button>' +
        "</div>" +
        '<ol class="demo-steps" role="list" aria-label="Walkthrough steps">' + steps + "</ol>" +
        '<button class="demo-restart" type="button" data-action="restart">Restart</button>';
    }

    function render() {
      renderHead();
      var parts = screens[S.screen]();
      body.innerHTML = '<div class="demo-main">' + parts[0] + '</div><div class="demo-side">' + parts[1] + "</div>";
      body.setAttribute("data-screen", S.screen);
      if (S.screen === "inspect") {
        updateGraph();
        applyBars();
      }
      syncTimeline();
    }

    // Focus without scrolling, unless the element is off screen. Then prefer
    // showing the top of the demo body (so on phones the graph above the
    // caption stays in view), as long as the element still fits on screen.
    function focusEl(el) {
      if (!el) return;
      el.focus({ preventScroll: true });
      var r = el.getBoundingClientRect();
      var topLimit = 60; // keep clear of the fixed section bar
      if (r.top >= topLimit && r.bottom <= window.innerHeight) return;
      var behavior = reduce.matches ? "auto" : "smooth";
      var delta = body.getBoundingClientRect().top - topLimit;
      if (r.bottom - delta <= window.innerHeight && r.top - delta >= topLimit) {
        window.scrollBy({ top: delta, behavior: behavior });
      } else {
        el.scrollIntoView({ block: "center", behavior: behavior });
      }
    }

    function announce(msg) {
      if (!live) return;
      live.textContent = "";
      window.setTimeout(function () {
        live.textContent = msg;
      }, 60);
    }

    function goTo(screen) {
      stopTimeline();
      cancelDrag();
      S.screen = screen;
      if (screen === "inspect") {
        S.x = 3;
        S.reached = false;
        S.bars = { dashed: false, solid: false };
      }
      if (screen === "answer") {
        S.answer = "";
        S.submitted = false;
        S.correct = false;
      }
      if (screen === "revisit") {
        S.pick = null;
        S.confirmed = false;
      }
      render();
      focusEl(body.querySelector("[data-focus]"));
      if (screen === "inspect" || screen === "concept") startTimeline();
    }

    function start(flow, focus) {
      stopTimeline();
      cancelDrag();
      S = freshState(flow);
      render();
      if (focus) focusEl(body.querySelector("[data-focus]"));
    }

    function next() {
      var order = S.flow === "layered"
        ? ["choose", "inspect", "answer", "revisit"]
        : ["choose", "inspect", "concept", "answer", "explain"];
      var i = order.indexOf(S.screen);
      if (i > -1 && i < order.length - 1) goTo(order[i + 1]);
    }

    /* ----- graph ----- */

    function q(sel) {
      return body.querySelector(sel);
    }

    function updateGraph() {
      var svg = q("[data-graph]");
      if (!svg) return;
      var x = S.x;
      var r = readouts(x);
      var px = gx(x);
      var py = gy(x * x);
      var a = gx(2);
      var b = gx(-2);
      q('[data-g="drop"]').setAttribute("d", "M" + px + " " + py + "V" + G.dashedY);
      q('[data-g="solid"]').setAttribute("d", "M" + a + " " + G.solidY + "H" + px);
      q('[data-g="dashed"]').setAttribute("d", "M" + b + " " + G.dashedY + "H" + px);
      var pt = q('[data-g="pt"]');
      pt.setAttribute("cx", px);
      pt.setAttribute("cy", py);
      var pl = q('[data-g="ptlabel"]');
      pl.textContent = r.point;
      // Label to the right of the point, or to the left near the right edge.
      var right = px + 12 + r.point.length * 7.9 < 540;
      pl.setAttribute("x", right ? px + 12 : px - 12);
      pl.setAttribute("y", py - 10 < 14 ? py + 22 : py - 10);
      pl.setAttribute("text-anchor", right ? "start" : "end");
      q('[data-g="solidlabel"]').textContent = "x − 2 = " + r.d1 + "   solid · from 2";
      q('[data-g="dashedlabel"]').textContent = "x + 2 = " + r.d2 + "   dashed · from −2";
      q('[data-g="read"]').textContent = "x = " + r.x;
      svg.setAttribute(
        "aria-label",
        "Graph of f(x) = x² with the fixed point (2, 4) and the moving input at x = " + r.x +
          ", point " + r.point + ". Solid teal bar from 2: x − 2 = " + r.d1 +
          ". Dashed red bar from −2: x + 2 = " + r.d2 + "."
      );
      var range = q("[data-range]");
      range.setAttribute(
        "aria-valuetext",
        "x is " + r.x + ". Distance from 2 is " + r.d1abs + ". Distance from −2 is " + r.d2 + "."
      );
    }

    function applyBars() {
      var svg = q("[data-graph]");
      if (!svg) return;
      var show = reduce.matches;
      svg.classList.toggle("hide-dashed", !(show || S.bars.dashed));
      svg.classList.toggle("hide-solid", !(show || S.bars.solid));
    }

    function setX(x) {
      S.x = Math.round(x * 100) / 100;
      updateGraph();
      if (!S.reached && S.x <= 2.5 + 1e-9) reach();
    }

    // Caption 1 → caption 2, and the button becomes "Continue …". Updated in
    // place so a slider drag in progress isn't interrupted.
    function reach() {
      S.reached = true;
      var cap = q("[data-caption]");
      if (cap) cap.textContent = COPY.cap2;
      var btn = q("[data-inspect-btn]");
      if (btn) {
        btn.textContent = S.flow === "layered" ? COPY.toQuestion : COPY.toRule;
        btn.setAttribute("data-action", "next");
      }
      announce(COPY.cap2);
      startTimeline();
    }

    function cancelDrag() {
      if (dragAnim) cancelAnimationFrame(dragAnim);
      dragAnim = 0;
    }

    // "Drag x toward 2": moves the slider to 2.2 for keyboard and switch users.
    function animateTo(target) {
      cancelDrag();
      endTimeline();
      var range = q("[data-range]");
      var from = S.x;
      if (reduce.matches) {
        range.value = target;
        setX(target);
        return;
      }
      var t0 = 0;
      var dur = 900;
      function stepFn(ts) {
        if (!t0) t0 = ts;
        var t = Math.min(1, (ts - t0) / dur);
        var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        var v = from + (target - from) * e;
        if (t >= 1) v = target;
        range.value = v;
        setX(v);
        dragAnim = t < 1 ? requestAnimationFrame(stepFn) : 0;
      }
      dragAnim = requestAnimationFrame(stepFn);
    }

    /* ----- caption timeline (stands in for the voiced line) ----- */

    function startTimeline() {
      stopTimeline();
      if (reduce.matches) {
        tl.p = 1;
        S.bars = { dashed: true, solid: true };
        applyBars();
        syncTimeline();
        return;
      }
      tl.p = 0;
      tl.playing = true;
      runTimeline();
    }

    function runTimeline() {
      cancelAnimationFrame(tl.raf);
      tl.last = 0;
      function frame(ts) {
        if (!tl.playing) return;
        if (!tl.last) tl.last = ts;
        tl.p = Math.min(1, tl.p + ((ts - tl.last) * tl.speed) / LINE_MS);
        tl.last = ts;
        cues();
        if (tl.p >= 1) tl.playing = false;
        syncTimeline();
        if (tl.playing) tl.raf = requestAnimationFrame(frame);
      }
      tl.raf = requestAnimationFrame(frame);
      syncTimeline();
    }

    // Figure 3's cues: dashed bar at 40% of the first line, solid at 75%.
    function cues() {
      if (S.screen !== "inspect" || S.reached) return;
      var changed = false;
      if (tl.p >= 0.4 && !S.bars.dashed) {
        S.bars.dashed = true;
        changed = true;
      }
      if (tl.p >= 0.75 && !S.bars.solid) {
        S.bars.solid = true;
        changed = true;
      }
      if (changed) applyBars();
    }

    function stopTimeline() {
      tl.playing = false;
      cancelAnimationFrame(tl.raf);
    }

    // Moving the slider ends the line and shows both bars.
    function endTimeline() {
      stopTimeline();
      tl.p = 1;
      S.bars = { dashed: true, solid: true };
      applyBars();
      syncTimeline();
    }

    function syncTimeline() {
      var play = q('[data-action="play"]');
      if (play) play.textContent = tl.playing ? "Pause" : "Play";
      var speed = q('[data-action="speed"]');
      if (speed) {
        var t = tl.speed.toFixed(tl.speed === 0.75 ? 2 : 1) + "×";
        speed.textContent = t;
        speed.setAttribute("aria-label", "Playback speed " + t);
      }
      var bar = q("[data-progress]");
      if (bar) bar.style.transform = "scaleX(" + tl.p + ")";
    }

    /* ----- answers ----- */

    function normalise(v) {
      var s = String(v).toLowerCase().replace(/[−–—]/g, "-").replace(/\s+/g, "");
      while (/^\(.*\)$/.test(s) && balanced(s.slice(1, -1))) s = s.slice(1, -1);
      return s;
    }

    function balanced(s) {
      var d = 0;
      for (var i = 0; i < s.length; i++) {
        if (s[i] === "(") d++;
        else if (s[i] === ")" && --d < 0) return false;
      }
      return d === 0;
    }

    function showNote(text) {
      var note = q("[data-note]");
      if (note) {
        note.textContent = text;
        note.hidden = false;
      }
      announce(text);
    }

    function clearNote() {
      var note = q("[data-note]");
      if (note) {
        note.hidden = true;
        note.textContent = "";
      }
    }

    /* ----- events (delegated) ----- */

    root.addEventListener("click", function (e) {
      var t = e.target.closest("[data-action]");
      if (!t || !root.contains(t)) return;
      var act = t.getAttribute("data-action");
      if (act === "flow") {
        var flow = t.getAttribute("data-flow");
        start(flow, true);
      } else if (act === "restart") {
        start(S.flow, true);
      } else if (act === "other-flow") {
        start(S.flow === "layered" ? "nonlayered" : "layered", true);
      } else if (act === "next") {
        next();
      } else if (act === "drag") {
        animateTo(2.2);
      } else if (act === "play") {
        if (tl.playing) {
          stopTimeline();
          syncTimeline();
        } else {
          if (tl.p >= 1) tl.p = 0;
          tl.playing = true;
          runTimeline();
        }
      } else if (act === "speed") {
        tl.speed = SPEEDS[(SPEEDS.indexOf(tl.speed) + 1) % SPEEDS.length];
        syncTimeline();
      } else if (act === "sample") {
        var input = q("[data-answer]");
        input.value = "x − 2";
        S.answer = input.value;
        q("[data-submit]").disabled = false;
        input.focus();
      }
    });

    root.addEventListener("change", function (e) {
      var t = e.target;
      if (t.type !== "radio") return;
      if (S.screen === "choose") S.choice = t.value;
      if (S.screen === "revisit") {
        S.pick = t.value;
        var check = q("[data-check]");
        if (check) check.disabled = false;
      }
      clearNote();
    });

    root.addEventListener("input", function (e) {
      var t = e.target;
      if (t.hasAttribute("data-range")) {
        cancelDrag();
        if (tl.p < 1 || tl.playing || !S.bars.solid || !S.bars.dashed) endTimeline();
        setX(parseFloat(t.value));
      } else if (t.hasAttribute("data-answer")) {
        S.answer = t.value;
        var sub = q("[data-submit]");
        if (sub) sub.disabled = !t.value.trim();
      }
    });

    root.addEventListener("submit", function (e) {
      e.preventDefault();
      var form = e.target.getAttribute("data-form");
      if (form === "choose") {
        if (S.choice === "A") next();
        else showNote(COPY.noteOnlyA);
      } else if (form === "answer") {
        if (!S.answer.trim() || S.submitted) return;
        S.submitted = true;
        S.correct = normalise(S.answer) === "x-2";
        render();
        announce(S.correct ? COPY.right : COPY.wrong);
        focusEl(q("[data-next]"));
      } else if (form === "revisit") {
        if (!S.pick) return;
        if (S.pick === "C") {
          S.confirmed = true;
          render();
          announce(COPY.confirm);
          focusEl(q("[data-end-first]"));
        } else {
          showNote(COPY.noteRevisit);
        }
      }
    });

    // If the reader turns reduced motion on or off mid-walkthrough, redraw.
    function onMotionChange() {
      stopTimeline();
      cancelDrag();
      render();
      if (S.screen === "inspect" || S.screen === "concept") startTimeline();
    }
    if (reduce.addEventListener) reduce.addEventListener("change", onMotionChange);

    start("layered", false);
  }

  function init() {
    initMufinDemo(document.querySelector("[data-demo]"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
