const gallery = document.querySelector('[data-gallery]');
const cases = [...gallery.querySelectorAll('[data-project-case]')];
const nav = gallery.querySelector('[data-project-nav]');
const buttons = [...nav.querySelectorAll('[data-project]')];
const english = document.documentElement.lang === 'en';
let current = -1, swipe = null, suppressClickUntil = 0;
function fromHash() {
  let hash = '';
  try { hash = decodeURIComponent(location.hash.slice(1)); } catch (_) { /* Unknown hash falls back to the first project. */ }
  const index = cases.findIndex(project => project.id === hash);
  return index >= 0 ? index : 0;
}
function select(index, updateURL = false) {
  const next = (index + cases.length) % cases.length;
  if (next !== current) {
    current = next; gallery.classList.remove('g-zoomed');
    cases.forEach((project, i) => {
      project.hidden = i !== current;
      const zoom = project.querySelector('[data-zoom]');
      zoom.dataset.zoom = 'false'; zoom.setAttribute('aria-expanded', 'false');
      zoom.querySelector('[data-zoom-label]').textContent = english ? 'Enlarge ↗' : 'Agrandir ↗';
    });
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
  }
  if (updateURL) {
    history.replaceState(null, '', '#' + cases[current].id);
    document.querySelectorAll('a[hreflang]').forEach(link => { link.hash = cases[current].id; });
  }
}
gallery.classList.add('is-enhanced'); nav.hidden = false;
gallery.querySelectorAll('[data-project-controls]').forEach(control => { control.hidden = false; });
select(fromHash());
window.addEventListener('hashchange', () => select(fromHash()));
nav.addEventListener('pointerover', event => { const button = event.target.closest('[data-project]'); if (button && event.pointerType !== 'touch') select(buttons.indexOf(button)); });
nav.addEventListener('focusin', event => { const button = event.target.closest('[data-project]'); if (button) select(buttons.indexOf(button)); });
nav.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
  const button = event.target.closest('[data-project]'); if (!button) return;
  event.preventDefault();
  const next = (buttons.indexOf(button) + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length;
  select(next, true); buttons[next].focus({ preventScroll: true });
});
gallery.addEventListener('click', event => {
  const project = event.target.closest('[data-project]');
  if (project) { select(buttons.indexOf(project), true); return; }
  const step = event.target.closest('[data-project-step]');
  if (step) {
    const direction = Number(step.dataset.projectStep); select(current + direction, true);
    cases[current].querySelector(`[data-project-step="${direction}"]`).focus({ preventScroll: true }); return;
  }
  const zoom = event.target.closest('[data-zoom]'); if (!zoom) return;
  event.preventDefault(); if (Date.now() < suppressClickUntil) return;
  const expanded = zoom.dataset.zoom !== 'true'; zoom.dataset.zoom = String(expanded); zoom.setAttribute('aria-expanded', String(expanded));
  zoom.setAttribute('aria-label', expanded ? (english ? 'Reduce preview' : 'Réduire l’aperçu') : (english ? 'Enlarge preview' : 'Agrandir l’aperçu'));
  zoom.querySelector('[data-zoom-label]').textContent = expanded ? (english ? 'Reduce ↙' : 'Réduire ↙') : (english ? 'Enlarge ↗' : 'Agrandir ↗');
  gallery.classList.toggle('g-zoomed', expanded);
});
gallery.addEventListener('pointerdown', event => { if (event.pointerType === 'touch' && event.target.closest('[data-zoom]')) swipe = { x: event.clientX, y: event.clientY }; });
gallery.addEventListener('pointercancel', () => { swipe = null; });
gallery.addEventListener('pointerup', event => {
  if (!swipe) return;
  const dx = event.clientX - swipe.x, dy = event.clientY - swipe.y; swipe = null;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) { suppressClickUntil = Date.now() + 400; select(current + (dx < 0 ? 1 : -1), true); }
});
