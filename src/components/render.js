import {
  profile, summary, skills, experience, projects, labs,
  certifications, certificates, education, publications,
} from '../data/cv.js';
import { openModal } from './modal.js';

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/* ---------------------------- HERO ---------------------------- */
function renderHero() {
  const hero = document.getElementById('hero');
  hero.appendChild(el(`
    <div>
      <span class="hero__eyebrow">Portfolio</span>
      <h1 class="hero__name">${profile.name}</h1>
      <p class="hero__role">${profile.role}</p>
      <p class="hero__tagline">${profile.tagline}</p>
      <div class="hero__cta">
        <a class="btn btn--primary" href="${profile.resumeFile}" download>Download Resume</a>
        <a class="btn btn--ghost" href="${profile.links.github}" target="_blank" rel="noopener noreferrer">View GitHub</a>
        <a class="btn btn--ghost" href="${profile.links.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </div>
  `));
}

/* ---------------------------- SUMMARY ---------------------------- */
function renderSummary() {
  const section = document.getElementById('summary');
  section.appendChild(el(`
    <div class="reveal">
      <span class="section__eyebrow">About</span>
      <h2 class="section__heading" id="summary-heading">Summary</h2>
      <p class="section__intro" style="margin-bottom:0;">${summary}</p>
    </div>
  `));
}

/* ---------------------------- SKILLS ---------------------------- */
function renderSkills() {
  const section = document.getElementById('skills');
  const groups = skills.map((g) => `
    <div class="skill-group">
      <h3>${g.category}</h3>
      <ul>${g.items.map((i) => `<li>${i}</li>`).join('')}</ul>
    </div>
  `).join('');

  section.appendChild(el(`
    <div class="reveal">
      <span class="section__eyebrow">Toolbox</span>
      <h2 class="section__heading" id="skills-heading">Skills</h2>
      <div class="skills-grid">${groups}</div>
    </div>
  `));
}

/* ---------------------------- EXPERIENCE ---------------------------- */
function renderExperience() {
  const section = document.getElementById('experience');
  const cards = experience.map((e, i) => makeFlipCard({
    id: `exp-${i}`,
    title: e.title,
    meta: `${e.type} · ${e.period}`,
    summaryText: e.points[0] || '',
    points: e.points,
    tags: [],
    extraLink: e.certificateUrl ? { label: 'View Certificate', url: e.certificateUrl } : null,
  })).join('');

  section.appendChild(el(`
    <div class="reveal">
      <span class="section__eyebrow">Track Record</span>
      <h2 class="section__heading" id="experience-heading">Experience</h2>
      <p class="section__intro">Click or press Enter on a card to flip it and see the details.</p>
      <div class="deck-grid">${cards}</div>
    </div>
  `));
  wireFlipCards(section);
}

/* ---------------------------- PROJECTS ---------------------------- */
function renderProjects() {
  const section = document.getElementById('projects');
  const cards = projects.map((p, i) => makeFlipCard({
    id: `proj-${i}`,
    title: p.title,
    meta: p.period,
    summaryText: p.summary,
    points: p.points,
    tags: p.tags,
  })).join('');

  section.appendChild(el(`
    <div class="reveal">
      <span class="section__eyebrow">Builds</span>
      <h2 class="section__heading" id="projects-heading">Projects</h2>
      <p class="section__intro">Flip a card for implementation details, or open the full write-up in a dialog.</p>
      <div class="deck-grid">${cards}</div>
    </div>
  `));
  wireFlipCards(section, { modal: true, data: projects });
}

/* ---------------------------- LABS / CTFs ---------------------------- */
function renderLabs() {
  const section = document.getElementById('labs');
  if (!labs.length) return;
  const cards = labs.map((l, i) => makeFlipCard({
    id: `lab-${i}`,
    title: l.title,
    meta: l.period,
    summaryText: l.points[0] || '',
    points: l.points,
    tags: [],
  })).join('');

  section.appendChild(el(`
    <div class="reveal">
      <span class="section__eyebrow">Hands-On</span>
      <h2 class="section__heading" id="labs-heading">Labs &amp; Training</h2>
      <div class="deck-grid">${cards}</div>
    </div>
  `));
  wireFlipCards(section);
}

/* ---------------------------- CERTIFICATIONS ---------------------------- */
function renderCertifications() {
  const section = document.getElementById('certifications');
  if (!certifications.length) return;
  const cards = certifications.map((c, i) => makeFlipCard({
    id: `cert-${i}`,
    title: c.title,
    meta: c.period,
    summaryText: c.points[0] || '',
    points: c.points,
    tags: [],
  })).join('');

  section.appendChild(el(`
    <div class="reveal">
      <span class="section__eyebrow">Credentials</span>
      <h2 class="section__heading" id="certifications-heading">Certifications</h2>
      <div class="deck-grid">${cards}</div>
    </div>
  `));
  wireFlipCards(section);
}

/* ---------------------------- CERTIFICATES (list) ---------------------------- */
function renderCertificates() {
  const section = document.getElementById('certificates');
  if (!certificates.length) return;
  const rows = certificates.map((c) => `
    <div class="list-card">
      <div>
        <div class="list-card__title">${c.title}</div>
        <div class="list-card__issuer">${c.issuer}</div>
      </div>
      <span class="list-card__period">${c.period}</span>
    </div>
  `).join('');

  section.appendChild(el(`
    <div class="reveal">
      <span class="section__eyebrow">Additional Learning</span>
      <h2 class="section__heading" id="certificates-heading">Certificates</h2>
      <div>${rows}</div>
    </div>
  `));
}

/* ---------------------------- EDUCATION ---------------------------- */
function renderEducation() {
  const section = document.getElementById('education');
  const rows = education.map((e) => `
    <div class="list-card">
      <div>
        <div class="list-card__title">${e.school} — ${e.degree}</div>
        <div class="list-card__issuer">${e.location} · ${e.metric}</div>
      </div>
      <span class="list-card__period">${e.period}</span>
    </div>
  `).join('');

  section.appendChild(el(`
    <div class="reveal">
      <span class="section__eyebrow">Academics</span>
      <h2 class="section__heading" id="education-heading">Education</h2>
      <div>${rows}</div>
    </div>
  `));
}

/* ---------------------------- PUBLICATIONS (optional) ---------------------------- */
function renderPublicationsNavIfNeeded() {
  if (!publications.length) return;
  const navMenu = document.getElementById('navMenu');
  const li = el(`<li><a href="#publications">Publications</a></li>`);
  navMenu.insertBefore(li, navMenu.lastElementChild);

  const section = document.getElementById('education');
  const pubSection = el(`<section id="publications" class="section" aria-labelledby="publications-heading"></section>`);
  section.after(pubSection);
  const rows = publications.map((p) => `
    <div class="list-card">
      <div>
        <div class="list-card__title">${p.title}</div>
        <div class="list-card__issuer">${p.venue || ''}</div>
      </div>
      <span class="list-card__period">${p.period || ''}</span>
    </div>
  `).join('');
  pubSection.appendChild(el(`
    <div class="reveal">
      <span class="section__eyebrow">Research</span>
      <h2 class="section__heading" id="publications-heading">Publications</h2>
      <div>${rows}</div>
    </div>
  `));
}

/* ---------------------------- CONTACT ---------------------------- */
function renderContact() {
  const section = document.getElementById('contact');

  section.appendChild(el(`
    <div class="reveal">
      <span class="section__eyebrow">Get in Touch</span>
      <h2 class="section__heading" id="contact-heading">Contact</h2>
      <p class="section__intro">
        Send a message directly — it goes straight to my inbox. Prefer to connect elsewhere? GitHub and LinkedIn are one click away.
      </p>

      <div class="contact-layout">
        <form id="contact-form" class="contact-form" novalidate>
          <div class="contact-form__row">
            <label for="contact-name">Name</label>
            <input id="contact-name" name="name" type="text" autocomplete="name" required />
          </div>
          <div class="contact-form__row">
            <label for="contact-email">Your email</label>
            <input id="contact-email" name="email" type="email" autocomplete="email" required />
          </div>
          <div class="contact-form__row">
            <label for="contact-message">Message</label>
            <textarea id="contact-message" name="message" rows="5" required></textarea>
          </div>
          <div class="contact-form__actions">
            <button class="btn btn--primary" type="submit">Send message</button>
            <span class="contact-form__status" role="status" aria-live="polite"></span>
          </div>
        </form>

        <div class="contact-links">
          <a class="contact-link" href="${profile.links.github}" target="_blank" rel="noopener noreferrer">
            <span class="contact-item__label">GitHub</span>
            <span class="contact-item__value">${profile.links.github.replace('https://', '')}</span>
          </a>
          <a class="contact-link" href="${profile.links.linkedin}" target="_blank" rel="noopener noreferrer">
            <span class="contact-item__label">LinkedIn</span>
            <span class="contact-item__value">View profile</span>
          </a>
        </div>
      </div>
    </div>
  `));
}

/* ---------------------------- Card factory + flip wiring ---------------------------- */
function makeFlipCard({ id, title, meta, summaryText, points, tags, extraLink }) {
  return `
    <div class="card3d reveal" id="${id}" tabindex="0" role="button"
         aria-pressed="false" aria-label="${title}, press Enter to flip for details">
      <div class="card3d__inner">
        <div class="card3d__face card3d__face--front">
          <span class="card3d__meta">${meta}</span>
          <h3 class="card3d__title">${title}</h3>
          <p class="card3d__summary">${summaryText}</p>
          ${tags.length ? `<div class="card3d__tags">${tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
          <span class="card3d__flip-hint">&#9821; Flip for details</span>
        </div>
        <div class="card3d__face card3d__face--back">
          <span class="card3d__meta">${meta}</span>
          <h3 class="card3d__title">${title}</h3>
          <ul class="card3d__back-list">${points.map((p) => `<li>${p}</li>`).join('')}</ul>
          ${extraLink ? `<a class="btn btn--ghost btn--small" href="${extraLink.url}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${extraLink.label}</a>` : ''}
          ${points.length > 2 ? `<button class="btn btn--ghost btn--small card3d__more" type="button">More detail</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

function wireFlipCards(container, options = {}) {
  container.querySelectorAll('.card3d').forEach((card, i) => {
    const flip = (e) => {
      // Let links/buttons on the back face work without triggering a flip-back.
      if (e.target.closest('a, button')) {
        if (e.target.classList.contains('card3d__more') && options.modal) {
          const p = options.data[i];
          openModal({ title: p.title, meta: p.period, points: p.points, tags: p.tags });
        }
        return;
      }
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(flipped));
    };
    card.addEventListener('click', flip);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip(e);
      }
    });
  });
}

export function renderAll() {
  renderHero();
  renderSummary();
  renderSkills();
  renderExperience();
  renderProjects();
  renderLabs();
  renderCertifications();
  renderCertificates();
  renderEducation();
  renderPublicationsNavIfNeeded();
  renderContact();
}
