
var qs = function(s){ return document.querySelector(s); };
var qsa = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };
var isNavigating = false;
var scrollIdleTimer = null;

// Mobile nav
var nav = qs(".nav"), btn = qs(".nav_toggle"), links = qsa(".nav_links a");
function setNav(open){
    nav.setAttribute("data-state", open ? "open" : "closed");
  if(btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.classList.toggle("no_scroll", open);
}
if(btn){
  btn.addEventListener("click", function(){ setNav(nav.getAttribute("data-state") !== "open"); });
}
links.forEach(function(a){ a.addEventListener("click", function(){ setNav(false); }); });
document.addEventListener("keydown", function(e){ if(e.key === "Escape"){ setNav(false); } });

// Set header height var for layout spacing
function setNavHeight(){
    document.documentElement.style.setProperty('--nav-h', (nav.offsetHeight || 72) + 'px');
}
setNavHeight();
window.addEventListener('load', setNavHeight);
window.addEventListener('resize', setNavHeight);

// When any nav link is clicked, keep header visible while the browser smooth-scrolls
links.forEach(function(a){
    a.addEventListener('click', function(){
    // only for in-page hashes
    var href = a.getAttribute('href') || '';
    if (href.startsWith('#')) {
        isNavigating = true;
        nav.classList.remove('nav--hidden');  // show header immediately
        if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
    }
    });
});

// Hide on scroll down, show on scroll up (with navigation guard)
var lastY = window.pageYOffset || 0;
var ticking = false;

window.addEventListener('scroll', function(){
    var y = window.pageYOffset || 0;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){

    // While navigating to an anchor, keep nav visible
    if (isNavigating) {
        nav.classList.remove('nav--hidden');
        // reset a small idle timer; when scrolling stops, re-enable hide/show
        if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
        scrollIdleTimer = setTimeout(function(){ isNavigating = false; }, 300);
        lastY = y;
        ticking = false;
        return;
    }

    if (nav.getAttribute('data-state') !== 'open') {
      if (y < 20) {
        nav.classList.remove('nav--hidden');
      } else if (y > lastY) {
        nav.classList.add('nav--hidden');    // scrolling down
      } else if (y < lastY) {
        nav.classList.remove('nav--hidden'); // scrolling up
      }
    }
    lastY = y;
    ticking = false;
    });
}, { passive: true });

// Hide on scroll down, show on scroll up
var lastY = window.pageYOffset || 0;
var ticking = false;
window.addEventListener('scroll', function(){
    var y = window.pageYOffset || 0;
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
    if(nav.getAttribute('data-state') !== 'open'){
        if(y < 20){ nav.classList.remove('nav--hidden'); }
        else if(y > lastY){ nav.classList.add('nav--hidden'); }
        else if(y < lastY){ nav.classList.remove('nav--hidden'); }
    }
    lastY = y;
    ticking = false;
    });
}, { passive: true });

// Scroll spy (highlights current section)
var sections = qsa("section[id]");
var navMap = {};
links.forEach(function(a){ navMap[a.getAttribute("href").slice(1)] = a; });
var spy = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
    if(entry.isIntersecting){
        var id = entry.target.id;
        links.forEach(function(a){ a.removeAttribute("aria-current"); });
        if(navMap[id]){ navMap[id].setAttribute("aria-current", "page"); }
    }
    });
}, { root: null, rootMargin: "0px 0px -70% 0px", threshold: 0.1 });
sections.forEach(function(s){ spy.observe(s); });
links.forEach(a => a.addEventListener('click', () => nav.classList.remove('nav--hidden')));
// Reveal on scroll (respects reduced motion)
if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    var revealer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
        if(entry.isIntersecting){
        entry.target.classList.add("in_view");
        revealer.unobserve(entry.target);
        }
    });
    }, { threshold: 0.15 });
    qsa(".reveal").forEach(function(el){ revealer.observe(el); });
}

// Scroll progress
var bar = qs(".scroll_progress span");
function updateProgress(){
    var h = document.documentElement;
    var scrolled = (h.scrollTop || document.body.scrollTop);
    var height = h.scrollHeight - h.clientHeight;
    var pct = height > 0 ? (scrolled / height) * 100 : 0;
    bar.style.width = pct.toFixed(2) + "%";
}
document.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

// Footer year
qs("#year").textContent = new Date().getFullYear();
