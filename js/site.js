/* TAKUZO — comportements communs à toutes les pages : menu mobile, en-tête, retour en haut, apparitions au scroll. */

// Menu mobile (appelé par le bouton #mobile-menu-btn)
function toggleMobileMenu(force) {
  var menu = document.getElementById('mobile-menu');
  var btn = document.getElementById('mobile-menu-btn');
  if (!menu || !btn) return;
  var open = typeof force === 'boolean' ? force : btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  if (open) { var first = menu.querySelector('a'); if (first) first.focus({ preventScroll: true }); }
}

(function () {
  var header = document.getElementById('site-header');
  var btt = document.getElementById('back-to-top');

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (btt) {
      var show = y > 600;
      btt.classList.toggle('is-visible', show);
      btt.tabIndex = show ? 0 : -1;
      if (show) btt.removeAttribute('aria-hidden'); else btt.setAttribute('aria-hidden', 'true');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (btt) btt.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  window.addEventListener('keydown', function (e) {
    var btn = document.getElementById('mobile-menu-btn');
    if (e.key === 'Escape' && btn && btn.getAttribute('aria-expanded') === 'true') { toggleMobileMenu(false); btn.focus(); }
  });
  // Un lien du menu vers une ancre de la page courante referme le menu
  var menu = document.getElementById('mobile-menu');
  if (menu) menu.addEventListener('click', function (e) { if (e.target.closest('a')) toggleMobileMenu(false); });
  window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) { if (m.matches) toggleMobileMenu(false); });

  // Apparitions progressives
  var items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('is-in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -4% 0px', threshold: 0.02 });
  items.forEach(function (el) { io.observe(el); });
})();
