/* =============================================================
   STARFIELD / HYPERLIGHT BACKGROUND                       
   ---------------------------------------------------------
   Edit the CONFIG object below to customise the look:
   • STAR_COUNT – total particles
   • BASE_SPEED – overall speed multiplier
   • WARP       – true  = hyperspace (stars rush past camera)
                  false = gentle downward drift
   • STAR_COLOR – base colour of stars
   • STAR_SIZE_RANGE – min & max radius (px) each star can take
   ============================================================= */

const CONFIG = {
  STAR_COUNT: 300,
  BASE_SPEED: 0.1,               // pixels per frame (baseline)
  WARP: true,                  // hyper‑light vs drifting night sky
  STAR_COLOR: '#ffffff',
  STAR_SIZE_RANGE: [0.4, 1.6]
};

/* =============================================================
   ENGINE – wait until DOM is ready so <canvas id="bgCanvas"> exists
   ============================================================= */

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) {
    console.error('[Starfield] Cannot find <canvas id="bgCanvas">');
    return;
  }
  const ctx = canvas.getContext('2d');
  let stars = [];

  /* ---------- helpers ---------- */
  const rand = (min, max) => Math.random() * (max - min) + min;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }
  window.addEventListener('resize', resize);

  function initStars() {
    stars.length = 0;
    const [minR, maxR] = CONFIG.STAR_SIZE_RANGE;
    for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: CONFIG.WARP ? Math.random() * canvas.width : 0,
        r: rand(minR, maxR)
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = CONFIG.STAR_COLOR;

    for (const s of stars) {
      if (CONFIG.WARP) {
        // move star towards viewer (decrease z)
        s.z -= CONFIG.BASE_SPEED * 3;
        if (s.z <= 0) s.z = canvas.width;
        const k  = 128 / s.z;  // perspective factor
        const px = (s.x - canvas.width  / 2) * k + canvas.width  / 2;
        const py = (s.y - canvas.height / 2) * k + canvas.height / 2;
        const pr = s.r * k;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // subtle downward drift
        s.y += CONFIG.BASE_SPEED;
        if (s.y > canvas.height) s.y = 0;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    requestAnimationFrame(step);
  }

  resize();
  requestAnimationFrame(step);
});
