import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';

// NOTE: jsdom does not execute <script type="module"> tags, so this test
// loads the pre-render HTML shell into jsdom and then runs the *actual*
// source modules (render.js, reveal.js, contactForm.js — the same code the
// browser loads) directly against that DOM. This exercises the real logic
// without depending on module-script execution jsdom can't provide.

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
  const { initContactForm } = await import(path.resolve('src/components/contactForm.js'));

  renderAll();
  initReveal();
  initContactForm(window.document);
  window.document.getElementById('year').textContent = String(new Date().getFullYear());
} catch (err) {
  errored = true;
  console.error('Runtime error:', err);
}

const contactText = window.document.getElementById('contact')?.textContent || '';
const heroText = window.document.querySelector('.hero__role')?.textContent || '';

const checks = [
  ['Name renders', window.document.querySelector('.hero__name')?.textContent.includes('Kislay Anand')],
  ['Hero role mentions CEH, not Full-Stack Dev', heroText.includes('CEH') && !/full-stack/i.test(heroText)],
  ['Resume download link present', !!window.document.querySelector('a[download]')],
  ['GitHub link present', !!window.document.querySelector('a[href*="github.com/kislay-anand"]')],
  ['At least 2 project cards', window.document.querySelectorAll('#projects .card3d').length >= 2],
  ['At least one certification card', window.document.querySelectorAll('#certifications .card3d').length >= 1],
  ['Certificates rendered as flip cards (6)', window.document.querySelectorAll('#certificates .card3d').length === 6],
  ['No "more detail" buttons anywhere', window.document.querySelectorAll('.card3d__more').length === 0],
  ['No modal-root / modal component left in the DOM', !window.document.getElementById('modal-root')],
  ['Education has 3 entries', window.document.querySelectorAll('#education .list-card').length === 3],
  ['Intermediate percentage corrected to 63.6%', /63\.6%/.test(window.document.getElementById('education').textContent)],
  ['Matriculation percentage corrected to 74.6%', /74\.6%/.test(window.document.getElementById('education').textContent)],
  ['Degree reads "B.Tech. Hons."', /B\.Tech\. Hons\./.test(window.document.getElementById('education').textContent)],
  ['Contact form present with name/email/message fields', !!window.document.querySelector('#contact-form input[name="name"]') && !!window.document.querySelector('#contact-form input[name="email"]') && !!window.document.querySelector('#contact-form textarea[name="message"]')],
  ['Contact photo placeholder present', !!window.document.querySelector('.contact-photo')],
  ['GitHub/LinkedIn links present in contact section', window.document.querySelectorAll('#contact .contact-link').length === 2],
  ['No raw email/phone string anywhere in contact section', !/helltohacking|your\.email@example\.com|@gmail\.com/.test(contactText)],
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
