export function initCopyButtons(root = document) {
  root.querySelectorAll('.copy-btn[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        // Fallback for browsers without Clipboard API permissions
        const ta = document.createElement('textarea');
        ta.value = value;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      btn.dataset.copied = 'true';
      btn.setAttribute('aria-live', 'polite');
      setTimeout(() => {
        btn.textContent = original;
        btn.dataset.copied = 'false';
      }, 1800);
    });
  });
}
