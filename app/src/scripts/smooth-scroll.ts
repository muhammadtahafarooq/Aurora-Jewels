/**
 * Premium smooth-scroll with inertia.
 * The page follows the wheel with a slight lag — feels luxurious.
 */
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let targetY = window.scrollY;
  let currentY = window.scrollY;
  const lerp = 0.08;          // lower = more lag
  const threshold = 0.5;
  let ticking = false;

  // On wheel, set where we want to go (clamped to document bounds)
  function onWheel(e: WheelEvent) {
    e.preventDefault();
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    targetY = Math.min(Math.max(targetY + e.deltaY, 0), maxScroll);
  }

  // Lerp toward target each frame
  function tick() {
    currentY += (targetY - currentY) * lerp;
    if (Math.abs(targetY - currentY) < threshold) {
      currentY = targetY;
    }
    window.scrollTo(0, currentY);
    if (!ticking) return;
    requestAnimationFrame(tick);
  }

  function start() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(tick);
  }

  // Keyboard and touch still work natively
  function onKeydown(e: KeyboardEvent) {
    const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
    if (keys.includes(e.key)) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetY = Math.min(Math.max(window.scrollY, 0), maxScroll);
      currentY = window.scrollY; // snap sync so keyboard feels instant
    }
  }

  function onScroll() {
    // If user scrolled via native means (touch, scrollbar), sync target
    if (!ticking) {
      targetY = window.scrollY;
      currentY = window.scrollY;
    }
  }

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('scroll', onScroll, { passive: true });
  start();

  // Re-sync after Astro page transitions
  document.addEventListener('astro:after-swap', () => {
    targetY = window.scrollY;
    currentY = window.scrollY;
  });
})();
