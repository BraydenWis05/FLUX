(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     SURVEY DATA
     Every option carries a {ps, eb} vector:
       ps  <0 → PEOPLE   ·  ps  >0 → SYSTEMS
       eb  <0 → EXPLORE  ·  eb  >0 → BUILD
     --------------------------------------------------------------- */

  var QUESTIONS = [
    {
      section: "Section 1 — Quick Picks",
      title: "You have a completely free Saturday. What sounds the most fun?",
      note: "Select as many as you want.",
      type: "multi",
      options: [
        { label: "Going somewhere I've never been", ps: 0, eb: -2 },
        { label: "Staying home and watching something", ps: 0, eb: -1 },
        { label: "Making or building something", ps: 0, eb: 2 },
        { label: "Hanging out with friends", ps: -2, eb: 0 },
        { label: "Organizing my room/life", ps: 1, eb: 1 },
        { label: "Playing around with a new app or technology", ps: 1, eb: -1 },
        { label: "Going down a random internet rabbit hole", ps: 0, eb: -2 },
        { label: "Doing absolutely nothing", ps: 0, eb: 0 }
      ]
    },
    {
      section: "Section 1 — Quick Picks",
      title: "Your friend gives you a problem they're having. What's your first reaction?",
      note: "Select as many as you want.",
      type: "multi",
      options: [
        { label: "“Tell me what happened.”", ps: -2, eb: -1 },
        { label: "“Why does that keep happening?”", ps: 1, eb: -1 },
        { label: "“I have an idea.”", ps: 0, eb: -1 },
        { label: "“Let me try it.”", ps: 0, eb: 2 },
        { label: "“How does this actually work?”", ps: 2, eb: -1 },
        { label: "“There has to be an easier way.”", ps: 1, eb: 1 }
      ]
    },
    {
      section: "Section 1 — Quick Picks",
      title: "Which of these would bother you the most?",
      note: "Pick up to 3.",
      type: "multi",
      max: 3,
      options: [
        { label: "Something looks bad", ps: -1, eb: 0 },
        { label: "Something is confusing", ps: -1, eb: -1 },
        { label: "Something takes too long", ps: 1, eb: 1 },
        { label: "Something doesn't work", ps: 0, eb: 2 },
        { label: "Nobody understands how something works", ps: 2, eb: -1 },
        { label: "People keep making the same mistake", ps: -1, eb: 0 },
        { label: "There's too much information", ps: 1, eb: 0 },
        { label: "A process has way too many steps", ps: 2, eb: 1 }
      ]
    },
    {
      section: "Section 2 — Rank It",
      title: "Rank these from MOST interesting to LEAST interesting.",
      note: "Use the arrows to put these in order — most interesting at the top.",
      type: "rank",
      options: [
        { label: "Talking to people", ps: -2, eb: -1 },
        { label: "Finding patterns", ps: 1, eb: -1 },
        { label: "Coming up with ideas", ps: 0, eb: -1 },
        { label: "Making things", ps: 0, eb: 2 },
        { label: "Making things look good", ps: -1, eb: 1 },
        { label: "Figuring out how something works", ps: 2, eb: -1 },
        { label: "Testing whether something works", ps: 0, eb: 2 }
      ]
    },
    {
      section: "Section 3 — You're the Designer Now",
      title: "Your group is designing a new coffee shop. What job do you want?",
      note: "Pick up to 3.",
      type: "multi",
      max: 3,
      options: [
        { label: "Talk to customers and find out what they want", ps: -2, eb: -1 },
        { label: "Figure out how people move through the space", ps: -1, eb: -1 },
        { label: "Design the menu", ps: -1, eb: 1 },
        { label: "Design the app", ps: 1, eb: 1 },
        { label: "Figure out how ordering should work", ps: 2, eb: -1 },
        { label: "Make a prototype", ps: 0, eb: 2 },
        { label: "Test it with people", ps: -1, eb: 2 },
        { label: "Figure out how the technology works", ps: 2, eb: -1 },
        { label: "Present the final idea", ps: -1, eb: 1 }
      ]
    },
    {
      section: "Section 3 — You're the Designer Now",
      title: "Your team is stuck. What are you most likely to say?",
      note: "",
      type: "single",
      options: [
        { label: "“Let's talk to someone who actually uses this.”", ps: -2, eb: -1 },
        { label: "“Let's step back and figure out the bigger problem.”", ps: 1, eb: -2 },
        { label: "“What if we tried this?”", ps: 0, eb: -1 },
        { label: "“Can I just make a quick version?”", ps: 0, eb: 2 },
        { label: "“Wait, how is this supposed to work?”", ps: 2, eb: -1 },
        { label: "“I think we're making this way more complicated than it needs to be.”", ps: 2, eb: 1 }
      ]
    },
    {
      section: "Section 4 — Slightly Random",
      title: "Your camera roll is probably mostly...",
      note: "",
      type: "single",
      weight: 0.5,
      options: [
        { label: "People", ps: -1, eb: 0 },
        { label: "Screenshots", ps: 1, eb: 0 },
        { label: "Places", ps: 0, eb: -1 },
        { label: "Food", ps: 0, eb: 0 },
        { label: "Random things I thought looked cool", ps: -1, eb: -1 },
        { label: "Notes / reminders", ps: 1, eb: 1 },
        { label: "Memes", ps: -1, eb: 0 },
        { label: "A completely unorganized mess", ps: -1, eb: -1 }
      ]
    },
    {
      section: "Section 4 — Slightly Random",
      title: "When you're traveling, you're the person who...",
      note: "",
      type: "single",
      weight: 0.5,
      options: [
        { label: "Makes the itinerary", ps: 2, eb: 1 },
        { label: "Finds the best places", ps: -1, eb: -1 },
        { label: "Talks to locals", ps: -2, eb: -1 },
        { label: "Takes all the photos", ps: -1, eb: 1 },
        { label: "Figures out transportation", ps: 2, eb: 1 },
        { label: "Just shows up and figures it out", ps: 0, eb: -2 },
        { label: "Finds some random place nobody else knows about", ps: 0, eb: -2 }
      ]
    },
    {
      section: "Section 4 — Slightly Random",
      title: "Pick your favorite kind of YouTube video.",
      note: "",
      type: "single",
      weight: 0.5,
      options: [
        { label: "Someone explaining how something works", ps: 2, eb: -1 },
        { label: "A documentary", ps: -1, eb: -1 },
        { label: "A room/home makeover", ps: 0, eb: 2 },
        { label: "A tutorial", ps: 1, eb: 1 },
        { label: "A review", ps: 1, eb: 1 },
        { label: "A vlog", ps: -1, eb: -1 },
        { label: "A deep dive into something incredibly specific", ps: 1, eb: -2 },
        { label: "A random video the algorithm somehow convinced me to watch", ps: 0, eb: -2 }
      ]
    },
    {
      section: "Section 5 — How You Work",
      title: "Put these in order from MOST like you to LEAST like you.",
      note: "Use the arrows to put these in order — most like you at the top.",
      type: "rank",
      options: [
        { label: "I like figuring out why people do things.", ps: -2, eb: -1 },
        { label: "I like organizing complicated information.", ps: 2, eb: 1 },
        { label: "I like making things look and feel right.", ps: -1, eb: 1 },
        { label: "I like making ideas real.", ps: 0, eb: 2 },
        { label: "I like figuring out how technology works.", ps: 2, eb: -1 }
      ]
    },
    {
      section: "Section 5 — How You Work",
      title: "When you're learning something new, what works best for you?",
      note: "Pick up to 2.",
      type: "multi",
      max: 2,
      options: [
        { label: "Someone explaining it to me", ps: -1, eb: -1 },
        { label: "Trying it myself", ps: 0, eb: 2 },
        { label: "Watching someone do it", ps: 0, eb: -1 },
        { label: "Reading about it", ps: 1, eb: -1 },
        { label: "Looking at examples", ps: 1, eb: -1 },
        { label: "Taking it apart and figuring it out", ps: 2, eb: 1 }
      ]
    },
    {
      section: "Section 6 — The “Would You Rather” Round",
      title: "Would you rather...",
      note: "Choose the one that pulls you more, even if it's close.",
      type: "versus",
      pairs: [
        { a: { label: "Spend a day interviewing people", ps: -2, eb: -1 }, b: { label: "Spend a day designing in Figma", ps: 1, eb: 1 } },
        { a: { label: "Fix a broken process", ps: 2, eb: 1 }, b: { label: "Create something completely new", ps: 0, eb: -2 } },
        { a: { label: "Work on something physical", ps: 0, eb: 1 }, b: { label: "Work on something digital", ps: 1, eb: 1 } },
        { a: { label: "Have a really good idea", ps: 0, eb: -2 }, b: { label: "Actually build the idea", ps: 0, eb: 2 } },
        { a: { label: "Know exactly how something works", ps: 2, eb: 0 }, b: { label: "Know exactly what people need", ps: -2, eb: 0 } }
      ]
    }
  ];

  var ARCHETYPES = {
    investigator: {
      key: "investigator",
      name: "The Investigator",
      tag: "PEOPLE + EXPLORE",
      desc: "You're driven by understanding people — their behaviors, needs, and the problems they can't quite name yet. You'd rather ask one more question than assume you already have the answer.",
      paths: ["UX Research", "UX Strategy"]
    },
    advocate: {
      key: "advocate",
      name: "The Advocate",
      tag: "PEOPLE + BUILD",
      desc: "You care about people, and you want to actually make something for them. You move fast from “this is broken” to “let me show you a version that isn't.”",
      paths: ["Interaction Design", "Service Design"]
    },
    analyst: {
      key: "analyst",
      name: "The Analyst",
      tag: "SYSTEMS + EXPLORE",
      desc: "You're pulled toward how things actually work — systems, logic, technology, the reasons underneath the reasons. You'd rather map the whole problem before touching a single pixel.",
      paths: ["UX Strategy", "Product Design"]
    },
    architect: {
      key: "architect",
      name: "The Architect",
      tag: "SYSTEMS + BUILD",
      desc: "You like turning complexity into structure — and then making that structure real. Give you a messy process or a messy interface and you'll come back with something that works.",
      paths: ["Product Design", "UI Design"]
    }
  };

  var NORMALIZE_BY = 40;

  /* ---------------------------------------------------------------
     STATE
     --------------------------------------------------------------- */
  var state = QUESTIONS.map(function (q) {
    if (q.type === "multi") return { selected: [] };
    if (q.type === "single") return { selected: null };
    if (q.type === "rank") return { order: q.options.map(function (_, i) { return i; }) };
    if (q.type === "versus") return { picks: q.pairs.map(function () { return null; }) };
  });

  var current = 0; // -1 = intro, QUESTIONS.length = results
  var TOTAL = QUESTIONS.length;

  var root = document.getElementById("quiz-root");
  var introEl = document.getElementById("intro");
  var resultsEl = document.getElementById("results");
  var progressFill = document.getElementById("progress-fill");
  var progressLabel = document.getElementById("progress-label");

  /* ---------------------------------------------------------------
     RENDER
     --------------------------------------------------------------- */
  function isValid(qIndex) {
    var q = QUESTIONS[qIndex];
    var s = state[qIndex];
    if (q.type === "multi") return s.selected.length > 0;
    if (q.type === "single") return s.selected !== null;
    if (q.type === "rank") return true;
    if (q.type === "versus") return s.picks.every(function (p) { return p !== null; });
    return false;
  }

  function renderQuestion(qIndex) {
    var q = QUESTIONS[qIndex];
    var s = state[qIndex];
    var panel = document.createElement("div");
    panel.className = "q-panel";

    var eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow mono q-eyebrow";
    eyebrow.textContent = q.section;
    panel.appendChild(eyebrow);

    var titleEl = document.createElement("h2");
    titleEl.className = "q-title";
    titleEl.textContent = q.title;
    panel.appendChild(titleEl);

    if (q.note) {
      var noteEl = document.createElement("p");
      noteEl.className = "q-note mono";
      noteEl.textContent = q.note;
      panel.appendChild(noteEl);
    }

    if (q.type === "multi" || q.type === "single") {
      var grid = document.createElement("div");
      grid.className = "option-grid";

      var counter = null;
      if (q.type === "multi" && q.max) {
        counter = document.createElement("p");
        counter.className = "select-counter mono";
        grid.appendChild(counter);
      }

      function updateChipStates() {
        var chips = grid.querySelectorAll(".option-chip");
        chips.forEach(function (chip, i) {
          var isSel = q.type === "multi" ? s.selected.indexOf(i) !== -1 : s.selected === i;
          chip.classList.toggle("is-selected", isSel);
          if (q.type === "multi" && q.max) {
            chip.disabled = !isSel && s.selected.length >= q.max;
          }
        });
        if (counter) {
          counter.textContent = s.selected.length + " / " + q.max + " selected";
        }
        updateNav();
      }

      q.options.forEach(function (opt, i) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "option-chip";
        chip.textContent = opt.label;
        chip.addEventListener("click", function () {
          if (q.type === "single") {
            s.selected = i;
          } else {
            var idx = s.selected.indexOf(i);
            if (idx !== -1) {
              s.selected.splice(idx, 1);
            } else {
              if (q.max && s.selected.length >= q.max) return;
              s.selected.push(i);
            }
          }
          updateChipStates();
        });
        grid.appendChild(chip);
      });

      panel.appendChild(grid);
      updateChipStates();
    }

    if (q.type === "rank") {
      var list = document.createElement("div");
      list.className = "rank-list";

      function renderRank() {
        list.innerHTML = "";
        s.order.forEach(function (optIndex, pos) {
          var row = document.createElement("div");
          row.className = "rank-item";

          var badge = document.createElement("span");
          badge.className = "rank-badge mono";
          badge.textContent = String(pos + 1).padStart(2, "0");
          row.appendChild(badge);

          var label = document.createElement("span");
          label.className = "rank-label";
          label.textContent = q.options[optIndex].label;
          row.appendChild(label);

          var btnGroup = document.createElement("div");
          btnGroup.className = "rank-btns";

          var up = document.createElement("button");
          up.type = "button";
          up.className = "rank-btn";
          up.setAttribute("aria-label", "Move up");
          up.textContent = "▲";
          up.disabled = pos === 0;
          up.addEventListener("click", function () {
            var tmp = s.order[pos - 1];
            s.order[pos - 1] = s.order[pos];
            s.order[pos] = tmp;
            renderRank();
          });

          var down = document.createElement("button");
          down.type = "button";
          down.className = "rank-btn";
          down.setAttribute("aria-label", "Move down");
          down.textContent = "▼";
          down.disabled = pos === s.order.length - 1;
          down.addEventListener("click", function () {
            var tmp = s.order[pos + 1];
            s.order[pos + 1] = s.order[pos];
            s.order[pos] = tmp;
            renderRank();
          });

          btnGroup.appendChild(up);
          btnGroup.appendChild(down);
          row.appendChild(btnGroup);

          list.appendChild(row);
        });
      }

      renderRank();
      panel.appendChild(list);
    }

    if (q.type === "versus") {
      var vList = document.createElement("div");
      vList.className = "versus-list";

      var vCounter = document.createElement("p");
      vCounter.className = "select-counter mono";
      vList.appendChild(vCounter);

      function updateVersusCounter() {
        var done = s.picks.filter(function (p) { return p !== null; }).length;
        vCounter.textContent = done + " / " + q.pairs.length + " chosen";
        updateNav();
      }

      q.pairs.forEach(function (pair, i) {
        var row = document.createElement("div");
        row.className = "versus-row";

        var aBtn = document.createElement("button");
        aBtn.type = "button";
        aBtn.className = "versus-chip";
        aBtn.textContent = pair.a.label;

        var orTag = document.createElement("span");
        orTag.className = "versus-or mono";
        orTag.textContent = "OR";

        var bBtn = document.createElement("button");
        bBtn.type = "button";
        bBtn.className = "versus-chip";
        bBtn.textContent = pair.b.label;

        function refresh() {
          aBtn.classList.toggle("is-selected", s.picks[i] === "a");
          bBtn.classList.toggle("is-selected", s.picks[i] === "b");
        }

        aBtn.addEventListener("click", function () {
          s.picks[i] = "a";
          refresh();
          updateVersusCounter();
        });
        bBtn.addEventListener("click", function () {
          s.picks[i] = "b";
          refresh();
          updateVersusCounter();
        });

        row.appendChild(aBtn);
        row.appendChild(orTag);
        row.appendChild(bBtn);
        vList.appendChild(row);
        refresh();
      });

      panel.appendChild(vList);
      updateVersusCounter();
    }

    return panel;
  }

  var navBack = document.getElementById("nav-back");
  var navNext = document.getElementById("nav-next");
  var panelHost = document.getElementById("panel-host");

  function updateNav() {
    navBack.disabled = current === 0;
    navNext.disabled = !isValid(current);
    navNext.textContent = current === TOTAL - 1 ? "See My Result →" : "Next →";
  }

  function renderCurrent() {
    panelHost.innerHTML = "";
    panelHost.appendChild(renderQuestion(current));
    progressFill.style.width = Math.round(((current + 1) / TOTAL) * 100) + "%";
    progressLabel.textContent = "QUESTION " + (current + 1) + " OF " + TOTAL;
    updateNav();
  }

  navBack.addEventListener("click", function () {
    if (current === 0) {
      showIntro();
      return;
    }
    current -= 1;
    renderCurrent();
  });

  navNext.addEventListener("click", function () {
    if (!isValid(current)) return;
    if (current === TOTAL - 1) {
      showResults();
      return;
    }
    current += 1;
    renderCurrent();
  });

  function showIntro() {
    introEl.hidden = false;
    root.hidden = true;
    resultsEl.hidden = true;
  }

  function showQuiz() {
    current = 0;
    introEl.hidden = true;
    root.hidden = false;
    resultsEl.hidden = true;
    renderCurrent();
    root.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  }

  document.getElementById("start-btn").addEventListener("click", showQuiz);
  document.getElementById("retake-btn").addEventListener("click", function () {
    state = QUESTIONS.map(function (q) {
      if (q.type === "multi") return { selected: [] };
      if (q.type === "single") return { selected: null };
      if (q.type === "rank") return { order: q.options.map(function (_, i) { return i; }) };
      if (q.type === "versus") return { picks: q.pairs.map(function () { return null; }) };
    });
    showQuiz();
  });

  /* ---------------------------------------------------------------
     SCORING
     --------------------------------------------------------------- */
  function computeScores() {
    var ps = 0;
    var eb = 0;

    QUESTIONS.forEach(function (q, qi) {
      var s = state[qi];
      var weight = q.weight || 1;

      if (q.type === "multi") {
        s.selected.forEach(function (i) {
          ps += q.options[i].ps * weight;
          eb += q.options[i].eb * weight;
        });
      } else if (q.type === "single") {
        if (s.selected !== null) {
          ps += q.options[s.selected].ps * weight;
          eb += q.options[s.selected].eb * weight;
        }
      } else if (q.type === "rank") {
        var n = q.options.length;
        var avg = (n - 1) / 2;
        s.order.forEach(function (optIndex, pos) {
          var rankWeight = (n - (pos + 1)) - avg; // pos is 0-indexed; rank = pos+1
          ps += q.options[optIndex].ps * rankWeight * weight;
          eb += q.options[optIndex].eb * rankWeight * weight;
        });
      } else if (q.type === "versus") {
        q.pairs.forEach(function (pair, i) {
          var pick = s.picks[i];
          if (pick === "a") {
            ps += pair.a.ps * weight;
            eb += pair.a.eb * weight;
          } else if (pick === "b") {
            ps += pair.b.ps * weight;
            eb += pair.b.eb * weight;
          }
        });
      }
    });

    var psPct = Math.max(-100, Math.min(100, Math.round((ps / NORMALIZE_BY) * 100)));
    var ebPct = Math.max(-100, Math.min(100, Math.round((eb / NORMALIZE_BY) * 100)));
    return { ps: psPct, eb: ebPct };
  }

  function pickArchetype(scores) {
    var peopleSide = scores.ps < 0;
    var exploreSide = scores.eb < 0;
    if (peopleSide && exploreSide) return ARCHETYPES.investigator;
    if (peopleSide && !exploreSide) return ARCHETYPES.advocate;
    if (!peopleSide && exploreSide) return ARCHETYPES.analyst;
    return ARCHETYPES.architect;
  }

  var MATRIX_CENTER = 160;
  var MATRIX_HALF = 120; // plot spans 40..280, so 120px = 100 score points

  function setMatrix(scores, archetypeKey) {
    var cx = MATRIX_CENTER + (scores.ps / 100) * MATRIX_HALF;
    var cy = MATRIX_CENTER - (scores.eb / 100) * MATRIX_HALF;

    document.getElementById("matrix-mark").setAttribute("cx", cx);
    document.getElementById("matrix-mark").setAttribute("cy", cy);

    var guideX = document.getElementById("matrix-guide-x");
    guideX.setAttribute("x1", MATRIX_CENTER);
    guideX.setAttribute("y1", cy);
    guideX.setAttribute("x2", cx);
    guideX.setAttribute("y2", cy);

    var guideY = document.getElementById("matrix-guide-y");
    guideY.setAttribute("x1", cx);
    guideY.setAttribute("y1", MATRIX_CENTER);
    guideY.setAttribute("x2", cx);
    guideY.setAttribute("y2", cy);

    document.querySelectorAll(".matrix-quad-rect, .matrix-quad-label").forEach(function (el) {
      el.classList.toggle("is-current", el.getAttribute("data-quad") === archetypeKey);
    });
  }

  function showResults() {
    var scores = computeScores();
    var archetype = pickArchetype(scores);

    root.hidden = true;
    introEl.hidden = true;
    resultsEl.hidden = false;

    document.getElementById("result-name").textContent = archetype.name;
    document.getElementById("result-tag").textContent = archetype.tag;
    document.getElementById("result-desc").textContent = archetype.desc;

    var pathsEl = document.getElementById("result-paths");
    pathsEl.innerHTML = "";
    archetype.paths.forEach(function (p) {
      var tag = document.createElement("span");
      tag.textContent = p;
      pathsEl.appendChild(tag);
    });

    setMatrix(scores, archetype.key);

    resultsEl.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  }

  showIntro();
})();
