// Randomise starting angle of every badge so each ring begins at a different orientation.
// Drop a <script src="js/orbit-random.js"></script> just AFTER the hero markup (or at end of body).

window.addEventListener('DOMContentLoaded', () => {
  const rings = document.querySelectorAll('.orbit-wrap > li > ul'); // every <ul class="ring‑N">

  rings.forEach((ringUl) => {
    const items = Array.from(ringUl.children);
    const childrenCount = items.length;
    if (!childrenCount) return;

    // Ring radius = half of the ul's computed width (CSS already set ring size)
    const radius = ringUl.getBoundingClientRect().width / 2;

    // Random offset 0‑360° so each ring starts at a unique rotation
    const offsetDeg = Math.random() * 360;

    items.forEach((li, index) => {
      const stepDeg = 360 / childrenCount;
      const angle   = offsetDeg + index * stepDeg;
      // replicate SCSS transform but with runtime angle
      li.style.transform = `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`;
    });
  });
});
