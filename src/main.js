import { renderAll } from './components/render.js';
import { initReveal } from './components/reveal.js';
import { initContactForm } from './components/contactForm.js';
import { initConsentBanner } from './components/analytics.js';

function initNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initFooterYear() {
  document.getElementById('year').textContent = new Date().getFullYear();
}

async function initHero3D() {
  const container = document.getElementById('hero-canvas-container');
  if (!container) return;

  // Defer the (relatively large) three.js chunk until the browser is idle,
  // so it never competes with first paint / first contentful paint.
  const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
  schedule(async () => {
    try {
      const { initHeroScene } = await import('./three/heroScene.js');
      initHeroScene(container);
    } catch (err) {
      // WebGL unsupported or failed to load — the CSS gradient fallback
      // in .hero::before already carries the visual, so fail silently.
      console.warn('3D hero scene unavailable, using static fallback.', err);
    }
  });
}

function init() {
  renderAll();
  initNav();
  initFooterYear();
  initReveal();
  initContactForm();
  initHero3D();

  // Show the analytics opt-in after the visitor has had a moment to look around.
  setTimeout(initConsentBanner, 1500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
