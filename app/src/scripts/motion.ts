/**
 * Aurora Jewels — 2D Motion System (GSAP + ScrollTrigger, locked stack).
 *
 * Intensity map (docs/design-system.md §20):
 *   Home/editorial = Medium · Commerce = Low · Checkout/Account = minimal.
 *
 * Rules enforced here:
 *   - Transforms/opacity only (GPU-friendly, zero layout shift).
 *   - Parallax, magnetic buttons and mouse-follow run ONLY on fine pointers (desktop).
 *   - Everything no-ops under prefers-reduced-motion.
 *   - Whole-block text reveals (no letter splitting) to protect readability.
 *   - Single delegated listener for micro-interactions; full teardown on page swaps.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const finePointer = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let disposers: Array<() => void> = [];

function onDisposer(target: EventTarget, type: string, fn: EventListener, opts?: AddEventListenerOptions) {
  target.addEventListener(type, fn, opts);
  disposers.push(() => target.removeEventListener(type, fn));
}

function teardown() {
  disposers.forEach((d) => d());
  disposers = [];
  ScrollTrigger.getAll().forEach((t) => t.kill());
  gsap.killTweensOf('*');
}

/* ------------------------------------------------------------------ */
/* Scroll reveals                                                      */
/* ------------------------------------------------------------------ */

function initReveals() {
  // Single blocks marked .reveal
  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 24,
      duration: 0.85,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Staggered groups ([data-stagger] animates direct children)
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    gsap.from(group.children, {
      opacity: 0,
      y: 24,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 88%', once: true },
    });
  });
}

/* ------------------------------------------------------------------ */
/* Text reveals — whole-block fade+rise (no letter splitting)          */
/* ------------------------------------------------------------------ */

function initTextReveals() {
  document.querySelectorAll<HTMLElement>('[data-reveal-text]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  // Eyebrow labels — slide in from left
  document.querySelectorAll<HTMLElement>('[data-reveal-eyebrow]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      x: -16,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

/* ------------------------------------------------------------------ */
/* Section transitions — subtle divider line grow + section fade-in     */
/* ------------------------------------------------------------------ */

function initSectionTransitions() {
  document.querySelectorAll<HTMLElement>('[data-section-reveal]').forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: { trigger: section, start: 'top 85%', once: true },
    });
  });
}

/* ------------------------------------------------------------------ */
/* Hero entrance sequence (load-time, editorial pages)                 */
/* ------------------------------------------------------------------ */

function initHeroSequence() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  gsap.from(hero.children, {
    opacity: 0,
    y: 28,
    duration: 0.9,
    ease: 'power2.out',
    stagger: 0.08,
  });

  // Image mask reveal — inner media rises inside an overflow-hidden frame
  const frame = hero.parentElement?.querySelector<HTMLElement>('[data-hero-media]');
  if (frame) {
    gsap.from(frame, {
      yPercent: 10,
      scale: 1.04,
      duration: 1.1,
      ease: 'power3.out',
    });
  }
}

/* ------------------------------------------------------------------ */
/* Subtle parallax (desktop only, scrubbed)                            */
/* ------------------------------------------------------------------ */

function initParallax() {
  if (!finePointer()) return;

  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const shift = Number(el.dataset.parallax ?? '-6');
    gsap.to(el, {
      yPercent: shift,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('[data-parallax-frame]') ?? el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  });
}

/* ------------------------------------------------------------------ */
/* Magnetic buttons (desktop only, max ~6px, no bounce)                */
/* ------------------------------------------------------------------ */

const MAGNET_MAX = 6;

function initMagnetic() {
  if (!finePointer()) return;

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });

    const move = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      xTo(gsap.utils.clamp(-MAGNET_MAX, MAGNET_MAX, dx * 0.18));
      yTo(gsap.utils.clamp(-MAGNET_MAX, MAGNET_MAX, dy * 0.18));
    };

    const leave = () => {
      xTo(0);
      yTo(0);
    };

    onDisposer(btn, 'mousemove', move);
    onDisposer(btn, 'mouseleave', leave);
  });
}

/* ------------------------------------------------------------------ */
/* Mouse-follow atmosphere (desktop only, max 8px, imagery only)       */
/* ------------------------------------------------------------------ */

const FOLLOW_MAX = 8;

function initMouseFollow() {
  if (!finePointer()) return;

  document.querySelectorAll<HTMLElement>('[data-mouse-follow]').forEach((zone) => {
    const target = zone.querySelector<HTMLElement>('[data-mouse-follow-target]') ?? zone;
    const xTo = gsap.quickTo(target, 'x', { duration: 0.8, ease: 'power2.out' });
    const yTo = gsap.quickTo(target, 'y', { duration: 0.8, ease: 'power2.out' });

    const move = (e: MouseEvent) => {
      const rect = zone.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(nx * FOLLOW_MAX * 2);
      yTo(ny * FOLLOW_MAX * 2);
    };

    const leave = () => {
      xTo(0);
      yTo(0);
    };

    onDisposer(zone, 'mousemove', move);
    onDisposer(zone, 'mouseleave', leave);
  });
}

/* ------------------------------------------------------------------ */
/* Cursor aura — fine champagne ring trailing the pointer              */
/* (desktop only, decorative, never replaces the native cursor)        */
/* ------------------------------------------------------------------ */

function initCursorAura() {
  if (!finePointer() || document.getElementById('cursor-aura')) return;

  const aura = document.createElement('div');
  aura.id = 'cursor-aura';
  aura.setAttribute('aria-hidden', 'true');
  aura.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:28px',
    'height:28px',
    'margin:-14px 0 0 -14px',
    'border:1px solid rgba(198,165,106,0.55)',
    'border-radius:50%',
    'pointer-events:none',
    'z-index:90',
    'opacity:0',
  ].join(';');
  document.body.appendChild(aura);

  const xTo = gsap.quickTo(aura, 'x', { duration: 0.55, ease: 'power3.out' });
  const yTo = gsap.quickTo(aura, 'y', { duration: 0.55, ease: 'power3.out' });
  const sTo = gsap.quickTo(aura, 'scale', { duration: 0.35, ease: 'power2.out' });
  const oTo = gsap.quickTo(aura, 'opacity', { duration: 0.4, ease: 'power2.out' });

  let shown = false;
  const move = (e: MouseEvent) => {
    xTo(e.clientX);
    yTo(e.clientY);
    if (!shown) {
      shown = true;
      oTo(1);
    }
  };

  // Expand gently over interactive elements; contract elsewhere
  const over = (e: MouseEvent) => {
    const interactive = (e.target as HTMLElement).closest('a, button, [data-cursor="expand"]');
    sTo(interactive ? 1.7 : 1);
  };

  onDisposer(window, 'mousemove', move, { passive: true });
  onDisposer(document, 'mouseover', over, { passive: true });

  disposers.push(() => aura.remove());
}

/* ------------------------------------------------------------------ */
/* Image hover tilt — subtle 3D tilt on product cards (desktop only)   */
/* ------------------------------------------------------------------ */

function initImageHoverTilt() {
  if (!finePointer()) return;

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    const img = card.querySelector<HTMLElement>('img');
    if (!img) return;

    const xTo = gsap.quickTo(img, 'rotateY', { duration: 0.4, ease: 'power2.out' });
    const yTo = gsap.quickTo(img, 'rotateX', { duration: 0.4, ease: 'power2.out' });

    const move = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(nx * 4);  // max ±2deg
      yTo(-ny * 4);
    };

    const leave = () => {
      xTo(0);
      yTo(0);
    };

    onDisposer(card, 'mousemove', move);
    onDisposer(card, 'mouseleave', leave);
  });
}

/* ------------------------------------------------------------------ */
/* Micro-interactions (delegated — one listener total)                 */
/* ------------------------------------------------------------------ */

function initMicroInteractions() {
  // Wishlist heart pop
  onDisposer(document, 'click', (e) => {
    const target = (e.target as HTMLElement).closest('[data-wishlist]');
    if (!target || reducedMotion()) return;
    gsap.fromTo(
      target,
      { scale: 1 },
      { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.inOut', clearProps: 'scale' }
    );
  });

  // Bag icon pulse when the cart changes
  onDisposer(document, 'aj-cart-changed', () => {
    if (reducedMotion()) return;
    const bag = document.querySelector('#site-navbar a[aria-label="Shopping bag"]');
    if (!bag) return;
    gsap.fromTo(
      bag,
      { scale: 1 },
      { scale: 1.15, duration: 0.18, yoyo: true, repeat: 1, ease: 'power1.inOut', clearProps: 'scale' }
    );
  });

  // Add-to-bag button success flash
  onDisposer(document, 'click', (e) => {
    const btn = (e.target as HTMLElement).closest('#add-to-bag');
    if (!btn || reducedMotion()) return;
    gsap.fromTo(
      btn,
      { boxShadow: '0 0 0 0 rgba(18,60,54,0.3)' },
      { boxShadow: '0 0 0 8px rgba(18,60,54,0)', duration: 0.5, ease: 'power2.out' }
    );
  });
}

/* ------------------------------------------------------------------ */

function initMotion() {
  teardown();
  initMicroInteractions();

  if (reducedMotion()) {
    // Static experience: content fully visible, nothing animated.
    return;
  }

  initReveals();
  initTextReveals();
  initSectionTransitions();
  initHeroSequence();
  initParallax();
  initMagnetic();
  initMouseFollow();
  initCursorAura();
  initImageHoverTilt();
}

initMotion();
document.addEventListener('astro:after-swap', initMotion);
document.addEventListener('astro:before-swap', teardown);
