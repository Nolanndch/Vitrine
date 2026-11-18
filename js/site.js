/* Shared, local-only glass interactions. No animation runs until the visitor interacts. */
(() => {
  const root = document.getElementById('takuzo-glass');
  if (!root) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const wired = new WeakSet();
  function enhance(scope = root) {
    scope.querySelectorAll('.g-glass').forEach(element => {
      if (wired.has(element)) return;
      wired.add(element);
      let frame = 0, pointer = null;
      element.addEventListener('pointermove', event => {
        if (reducedMotion.matches || event.pointerType === 'touch') return;
        pointer = { x: event.clientX, y: event.clientY };
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (!pointer) return;
          const rect = element.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (pointer.x - rect.left) / rect.width));
          const y = Math.max(0, Math.min(1, (pointer.y - rect.top) / rect.height));
          const orb = element.classList.contains('g-orb');
          element.style.setProperty('--gx', `${x * 100}%`);
          element.style.setProperty('--gy', `${y * 100}%`);
          element.style.setProperty('--rx', `${(.5 - y) * (orb ? 20 : 5)}deg`);
          element.style.setProperty('--ry', `${(x - .5) * (orb ? 20 : 5)}deg`);
          element.style.setProperty('--tx', `${(x - .5) * (orb ? 18 : 4)}px`);
          element.style.setProperty('--ty', `${(y - .5) * (orb ? 18 : 4)}px`);
        });
      });
      element.addEventListener('pointerleave', () => {
        pointer = null; cancelAnimationFrame(frame); frame = 0;
        ['--gx', '--gy', '--rx', '--ry', '--tx', '--ty'].forEach(key => element.style.removeProperty(key));
      });
    });
  }
  root.addEventListener('click', event => {
    const orb = event.target.closest('.g-orb');
    if (orb && !reducedMotion.matches && orb.animate) {
      orb.getAnimations().forEach(animation => animation.cancel());
      orb.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.2,.82)', offset: .18 },
        { transform: 'translateY(-18px) scale(.91,1.11)', offset: .44 },
        { transform: 'translateY(3px) scale(1.04,.96)', offset: .76 },
        { transform: 'scale(1)' }
      ], { duration: 700, easing: 'cubic-bezier(.25,.5,.3,1)' });
    }
    const glass = event.target.closest('a.g-glass, button.g-glass');
    if (!glass || reducedMotion.matches || orb) return;
    const rect = glass.getBoundingClientRect(), ripple = document.createElement('span');
    ripple.className = 'g-ripple'; ripple.setAttribute('aria-hidden', 'true');
    ripple.style.left = (event.detail ? event.clientX - rect.left : rect.width / 2) + 'px';
    ripple.style.top = (event.detail ? event.clientY - rect.top : rect.height / 2) + 'px';
    glass.append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });
  document.querySelectorAll('a[hreflang]').forEach(link => {
    link.href = link.href.split(/[?#]/)[0] + location.search + location.hash;
    link.addEventListener('click', () => {
      try { localStorage.setItem('takuzo_lang', link.hreflang); } catch (_) { /* Optional preference only. */ }
    });
  });
  window.TakuzoGlass = { enhance };
  enhance();
})();
