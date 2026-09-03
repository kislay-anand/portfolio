import { profile } from '../data/cv.js';

function setStatus(statusEl, message, tone) {
  statusEl.textContent = message;
  statusEl.dataset.tone = tone; // 'success' | 'error' | 'info'
}

export function initContactForm(root = document) {
  const form = root.getElementById ? root.getElementById('contact-form') : root.querySelector('#contact-form');
  if (!form) return;

  const statusEl = form.querySelector('.contact-form__status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const endpoint = profile.contact.formEndpoint;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = form.elements.message.value.trim();
    if (!message) {
      setStatus(statusEl, 'Please write a message before sending.', 'error');
      return;
    }

    if (!endpoint) {
      // No backend wired up yet. Nothing is sent, and -- importantly -- no
      // email address is ever written into this page's HTML/JS to fall
      // back on. See README "Contact form" for the one-time setup.
      setStatus(
        statusEl,
        "This form isn't connected to a mailbox yet. (Site owner: add a form endpoint -- see README.)",
        'error'
      );
      return;
    }

    submitBtn.disabled = true;
    setStatus(statusEl, 'Sending...', 'info');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(`Form endpoint responded with ${res.status}`);
      setStatus(statusEl, "Message sent -- thank you! I'll get back to you soon.", 'success');
      form.reset();
    } catch (err) {
      console.warn('Contact form submission failed.', err);
      setStatus(statusEl, 'Something went wrong sending that -- please try again in a moment.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}
