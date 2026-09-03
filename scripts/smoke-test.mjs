import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';

// NOTE: jsdom does not execute <script type="module"> tags, so this test
// loads the pre-render HTML shell into jsdom and then runs the *actual*
// source modules (render.js, reveal.js, clipboard.js — the same code Vite
// bundles) directly against that DOM. This exercises the real logic without
// depending on module-script execution jsdom can't provide.

const html = fs.readFileSync(path.resolve('index.html'), 'utf-8');

const dom = new JSDOM(html, {
  url: 'http://localhost/',
  pretendToBeVisual: true,
});
const { window } = dom;

window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
window.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
window.requestIdleCallback = (cb) => setTimeout(cb, 0);
window.navigator.clipboard = { writeText: async () => {} };
window.HTMLCanvasElement.prototype.getContext = () => null;

global.window = window;
global.document = window.document;
global.matchMedia = window.matchMedia;
global.IntersectionObserver = window.IntersectionObserver;
global.requestIdleCallback = window.requestIdleCallback;
global.HTMLCanvasElement = window.HTMLCanvasElement;
Object.defineProperty(global, 'navigator', { value: window.navigator, configurable: true });

let errored = false;
try {
  const { renderAll } = await import(path.resolve('src/components/render.js'));
  const { initReveal } = await import(path.resolve('src/components/reveal.js'));
  const { initCopyButtons } = await import(path.resolve('src/components/clipboard.js'));

  renderAll();
  initReveal();
  initCopyButtons();
  window.document.getElementById('year').textContent = String(new Date().getFullYear());
} catch (err) {
  errored = true;
  console.error('Runtime error:', err);
}

const checks = [
  ['Name renders', window.document.querySelector('.hero__name')?.textContent.includes('Kislay Anand')],
  ['Resume download link present', !!window.document.querySelector('a[download]')],
  ['GitHub link present', !!window.document.querySelector('a[href*="github.com/kislay-anand"]')],
  ['At least one project card', window.document.querySelectorAll('#projects .card3d').length >= 2],
  ['At least one certification card', window.document.querySelectorAll('#certifications .card3d').length >= 1],
  ['Certificates list rendered', window.document.querySelectorAll('#certificates .list-card').length === 6],
  ['Education list rendered', window.document.querySelectorAll('#education .list-card').length === 3],
  ['Contact section has copy buttons', window.document.querySelectorAll('.copy-btn').length === 2],
  ['Footer year populated', /\d{4}/.test(window.document.getElementById('year').textContent)],
  ['Nav has 8 links (no Publications, since list is empty)', window.document.querySelectorAll('#navMenu a').length === 8],
];

console.log('\n--- Smoke test results ---');
let allPass = !errored;
for (const [label, pass] of checks) {
  console.log(`${pass ? '✓' : '✗'} ${label}`);
  if (!pass) allPass = false;
}
console.log(errored ? '✗ No uncaught runtime errors' : '✓ No uncaught runtime errors');
console.log(allPass ? '\nALL CHECKS PASSED\n' : '\nSOME CHECKS FAILED\n');
process.exit(allPass ? 0 : 1);
