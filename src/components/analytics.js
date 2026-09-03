const CONSENT_KEY = 'analytics-consent'; // stored in-memory per session only (see note below)

// NOTE: This site intentionally avoids localStorage for consent persistence
// to keep the codebase framework-agnostic and privacy-first by default —
// swap in a cookie or localStorage write here if you want the choice to
// persist across visits. As shipped, the banner reappears each new session.
let consentState = null;

/**
 * Plug your real analytics snippet in here. It only ever runs after
 * explicit opt-in, and never on page load.
 */
function loadAnalyticsScript() {
  // Example (Plausible — swap in your own domain/provider):
  // const s = document.createElement('script');
  // s.defer = true;
  // s.dataset.domain = 'yourdomain.com';
  // s.src = 'https://plausible.io/js/script.js';
  // document.head.appendChild(s);
  console.info('[analytics] Consent granted — analytics script would load here.');
}

export function initConsentBanner() {
  if (consentState !== null) return;
  const root = document.getElementById('consent-banner-root');

  const banner = document.createElement('div');
  banner.className = 'consent-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Analytics consent');
  banner.innerHTML = `
    <p>This site can use privacy-respecting analytics to understand traffic. No tracking happens unless you opt in.</p>
    <div class="consent-banner__actions">
      <button class="btn btn--ghost btn--small" id="consent-decline">Decline</button>
      <button class="btn btn--primary btn--small" id="consent-accept">Accept</button>
    </div>
  `;
  root.appendChild(banner);

  banner.querySelector('#consent-accept').addEventListener('click', () => {
    consentState = true;
    loadAnalyticsScript();
    banner.remove();
  });
  banner.querySelector('#consent-decline').addEventListener('click', () => {
    consentState = false;
    banner.remove();
  });
}
