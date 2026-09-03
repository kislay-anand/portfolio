let lastFocusedEl = null;

function trapFocus(container, e) {
  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

export function openModal({ title, meta, points = [], tags = [] }) {
  const root = document.getElementById('modal-root');
  lastFocusedEl = document.activeElement;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal__close" aria-label="Close dialog">&times;</button>
      ${meta ? `<span class="modal__meta">${meta}</span>` : ''}
      <h3 id="modal-title">${title}</h3>
      ${points.length ? `<ul>${points.map((p) => `<li>${p}</li>`).join('')}</ul>` : ''}
      ${tags.length ? `<div class="card3d__tags">${tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
    </div>
  `;

  root.appendChild(overlay);
  const closeBtn = overlay.querySelector('.modal__close');
  closeBtn.focus();

  function close() {
    overlay.remove();
    document.removeEventListener('keydown', onKeydown);
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
    trapFocus(overlay, e);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', onKeydown);
}
