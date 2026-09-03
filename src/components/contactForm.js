import { profile } from '../data/cv.js';

function buildMailtoUrl({ name, email, message }) {
  const to = profile.contact.destinationEmail;
  const subject = encodeURIComponent(`Portfolio contact from ${name || 'a visitor'}`);
  const bodyLines = [
    message,
    '',
    '—',
    `From: ${name || '(no name given)'}`,
    `Reply-to: ${email || '(no email given)'}`,
  ];
  const body = encodeURIComponent(bodyLines.join('\n'));
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

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
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.message || !data.message.trim()) {
      setStatus(statusEl, 'Please write a message before sending.', 'error');
      return;
    }

    // No Formspree (or similar) endpoint configured yet — use the mailto
    // fallback so the form is still fully functional out of the box.
    if (!endpoint) {
      window.location.href = buildMailtoUrl(data);
      setStatus(
        statusEl,
        'Opening your email app to send this — no backend is configured yet (see README).',
        'info'
      );
      return;
    }

    submitBtn.disabled = true;
    setStatus(statusEl, 'Sending…', 'info');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (res.ok) {
        setStatus(statusEl, 'Message sent — thank you! I\u2019ll reply by email soon.', 'success');
        form.reset();
      } else {
        throw new Error(`Form endpoint responded with ${res.status}`);
      }
    } catch (err) {
      console.warn('Contact form submission failed, falling back to mailto.', err);
      window.location.href = buildMailtoUrl(data);
      setStatus(statusEl, 'Could not reach the form service — opening your email app instead.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}
