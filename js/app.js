if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// === Utility Selectors ===
var qs = function(s){ return document.querySelector(s); };
var qsa = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };

// === Reveal on Scroll (respects prefers-reduced-motion) ===
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  var revealer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in_view");
        revealer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  qsa(".reveal").forEach(function(el) {
    revealer.observe(el);
  });
}

// === Footer Year ===
qs("#year").textContent = new Date().getFullYear();
