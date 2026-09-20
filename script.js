(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- starfield ---------- */
  var canvas = document.getElementById("starfield");
  var ctx = canvas.getContext("2d");
  var stars = [];
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  function sizeCanvas() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }

  function makeStars() {
    var count = Math.round((window.innerWidth * window.innerHeight) / 9000);
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.1 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.25,
        twinkleSpeed: Math.random() * 0.015 + 0.004,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  var scrollY = 0;
  function drawStars(time) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    var drift = scrollY * 0.03;
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var alpha = prefersReducedMotion
        ? s.baseAlpha
        : s.baseAlpha + Math.sin(time * s.twinkleSpeed + s.phase) * 0.2;
      ctx.beginPath();
      ctx.fillStyle = "rgba(241,237,227," + Math.max(alpha, 0.08) + ")";
      var y = (s.y + drift) % window.innerHeight;
      if (y < 0) y += window.innerHeight;
      ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!prefersReducedMotion) {
      requestAnimationFrame(drawStars);
    }
  }

  sizeCanvas();
  makeStars();
  requestAnimationFrame(drawStars);
  if (prefersReducedMotion) drawStars(0);

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      sizeCanvas();
      makeStars();
      if (prefersReducedMotion) drawStars(0);
      drawConstellationLines();
    }, 150);
  });

  window.addEventListener(
    "scroll",
    function () {
      scrollY = window.scrollY;
    },
    { passive: true }
  );

  /* ---------- scroll reveal ---------- */
  var revealTargets = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---------- smooth scroll for [data-scroll] and nav dots ---------- */
  function scrollToTarget(selector) {
    var el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    }
  }

  document.querySelectorAll("[data-scroll]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (href && href.charAt(0) === "#") {
        e.preventDefault();
        scrollToTarget(href);
      }
    });
  });

  document.querySelectorAll(".mainnav a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (href && href.charAt(0) === "#") {
        e.preventDefault();
        scrollToTarget(href);
      }
    });
  });

  /* ---------- touch-friendly reveal toggles ---------- */
  var isTouch = window.matchMedia("(hover: none)").matches;
  if (!isTouch) {
    document.querySelectorAll(".node, .star-card").forEach(function (card) {
      card.addEventListener("click", function (e) {
        var alreadyOpen = card.classList.contains("is-open");
        document.querySelectorAll(".is-open").forEach(function (c) {
          if (c !== card) c.classList.remove("is-open");
        });
        if (!alreadyOpen) {
          e.preventDefault();
          card.classList.add("is-open");
        }
      });
    });
  }

  /* ---------- constellation connecting lines ---------- */
  var constellation = document.getElementById("constellation");
  var linesSvg = constellation ? constellation.querySelector(".constellation-lines") : null;

  function drawConstellationLines() {
    if (!constellation || !linesSvg) return;
    var cards = constellation.querySelectorAll(".star-card");
    var rect = constellation.getBoundingClientRect();
    linesSvg.setAttribute("viewBox", "0 0 " + rect.width + " " + rect.height);
    while (linesSvg.firstChild) linesSvg.removeChild(linesSvg.firstChild);

    var centers = [];
    cards.forEach(function (card) {
      var r = card.getBoundingClientRect();
      centers.push({
        x: r.left - rect.left + r.width / 2,
        y: r.top - rect.top
      });
    });

    for (var i = 0; i < centers.length - 1; i++) {
      var a = centers[i];
      var b = centers[i + 1];
      var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", a.x);
      line.setAttribute("y1", a.y);
      line.setAttribute("x2", b.x);
      line.setAttribute("y2", b.y);
      linesSvg.appendChild(line);
    }
  }

  window.addEventListener("load", drawConstellationLines);
  setTimeout(drawConstellationLines, 300);
})();
