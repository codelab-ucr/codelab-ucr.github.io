// Site interactions: scrolled-header state + reveal-on-scroll.
(function () {
  "use strict";

  var head = document.querySelector(".site-head");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Header: add .scrolled once the page is scrolled past a small threshold ---
  if (head) {
    var onScroll = function () {
      head.classList.toggle("scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // --- Reveal-on-scroll ---
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    // Show everything immediately if motion is reduced or IO unsupported.
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target); // animate once
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });

  revealEls.forEach(function (el) { io.observe(el); });

  // --- Focus-area cards: tap/click toggles the flip (hover handles desktop) ---
  document.querySelectorAll(".flip-card").forEach(function (card) {
    card.addEventListener("click", function () {
      var flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", flipped ? "true" : "false");
    });
  });

  // --- Logo: 3D tilt toward the cursor on hover ---
  var brand = document.querySelector(".brand");
  if (brand && !reduceMotion) {
    var MAX_TILT = 8; // degrees
    brand.addEventListener("mousemove", function (e) {
      var r = brand.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 .. 0.5
      var py = (e.clientY - r.top) / r.height - 0.5;
      brand.style.setProperty("--ry", (px * MAX_TILT).toFixed(2) + "deg");
      brand.style.setProperty("--rx", (-py * MAX_TILT).toFixed(2) + "deg");
    });
    brand.addEventListener("mouseleave", function () {
      brand.style.setProperty("--rx", "0deg");
      brand.style.setProperty("--ry", "0deg");
    });
  }
})();
