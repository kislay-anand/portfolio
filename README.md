# Kislay Anand — Cybersecurity Portfolio

A chess-deck-themed portfolio site generated from `CV.docx`. It's a **plain static site — no build step, no bundler, no npm install required to host it.** Push these files to a GitHub repo, flip on GitHub Pages, and it's live.

Sections: Hero · Summary · Skills · Experience · Projects · Labs & Training · Certifications · Certificates · Education · Contact.

---

## 1. Host it on GitHub Pages (this is the whole process)

You do **not** need Node.js, npm, or a build step to host this. It's just HTML/CSS/JS files.

1. **Create a GitHub repository** (e.g. `portfolio`, or `<your-username>.github.io` if you want it at your root domain).
2. **Push these files to it.** Either:
   - Use GitHub's web UI: open your repo → **Add file → Upload files** → drag in everything from this folder → commit. *(No git or terminal needed.)*
   - Or, if you're comfortable with git: this folder is already a git repo —
     ```bash
     git remote add origin https://github.com/<your-username>/<repo-name>.git
     git push -u origin main
     ```
3. **Turn on Pages:** in the repo, go to **Settings → Pages**. Under "Build and deployment → Source", pick **either**:
   - **"Deploy from a branch"** → branch `main`, folder `/ (root)` → Save. *(Simplest option — GitHub just serves the files directly, checks for updates every time you push. Recommended if you're not using the included Action.)*
   - **"GitHub Actions"** → the included `.github/workflows/deploy.yml` will run automatically and publish the site (it also runs a rebuild on every future push). Pick this if you want the deploy step to explicitly skip files like `README.md` from the published site.
4. Wait 1–2 minutes. Your site is live at `https://<your-username>.github.io/<repo-name>/` (or `https://<your-username>.github.io/` if the repo is your `.github.io` repo).

That's it — there's no `npm run build`, no `dist` folder, nothing to compile. What you push is what gets served.

### Why no build step is needed
The browser loads `src/main.js` directly as a native ES module (`<script type="module">`), and every file it imports is plain, unbundled JavaScript. The one external dependency, Three.js, is loaded from a CDN via a browser **import map** declared right in `index.html` — so there's nothing to `npm install` for the site to run.

### Why it works at any URL/sub-path
Every path in `index.html` and the JS (`./src/...`, `./favicon.svg`, etc.) is written as a **relative** path, so the site works identically whether it's served from your domain root or from a `/repo-name/` sub-path. Nothing needs to change if you rename the repo.

---

## 2. Local preview (optional)

You don't need this to host the site, but it's useful for checking changes before you push:

```bash
npm run dev
```

This just runs a static file server (`npx serve .`) — no build, no transformation, exactly the files GitHub Pages will serve. Alternatively, open `index.html` directly in a browser, or use any static server / VS Code's "Live Server" extension.

---

## 3. Contact form — how messages reach your inbox (and why no email address is anywhere in this repo)

The Contact section is a plain message box (name / email / message) — **no email address or phone number appears anywhere on the page, in the page source, or in this repo's code.** That's deliberate: on a static site, anything written into the HTML/JS is public and visible to anyone who views source or opens dev tools, so your address is never placed there.

To receive the messages, the form posts to a small third-party form backend — the destination inbox is configured **only inside that service's own dashboard**, never in this codebase:

1. Go to **[formspree.io](https://formspree.io)** (free tier is enough) and sign up.
2. Create a new form and verify it with the email you want messages to arrive at. Formspree gives you an endpoint URL like `https://formspree.io/f/abcdwxyz`.
3. Open `src/data/cv.js` and paste it in:
   ```js
   contact: {
     formEndpoint: 'https://formspree.io/f/abcdwxyz', // ← your real endpoint
   },
   ```
4. Push the change. The form now posts straight to Formspree, which emails you the submission — your address itself lives only in Formspree's dashboard.

Any Formspree-compatible service (Getform, Web3Forms, etc.) works identically — just drop its endpoint into `formEndpoint`.

**Until you do this, the form is fully functional in the UI but shows a polite "not connected yet" message on submit** rather than silently failing or falling back to anything that would expose an address (there's no mailto fallback — that would put your email in the page).

---

## 4. Updating your content

**All CV content lives in one file: `src/data/cv.js`.** Edit the arrays/objects there — no HTML/CSS/JS structure changes needed:
- **New certification** → add to `certifications`.
- **New project** → add to `projects` (`title`, `period`, `summary`, `points`, `tags`).
- **New job/internship** → add to `experience`.
- **Publications** → add to `publications`; the nav link and section appear automatically once it's non-empty (hidden while empty, matching your current CV).

### Swapping the résumé PDF
Replace `Kislay_Anand_Resume.pdf` at the repo root with an updated export (keep the filename, or update `profile.resumeFile` in `cv.js` if you rename it).

### Updating the CEH/certificate proof link
The Experience card's "View Certificate" button reads `experience[i].certificateUrl` — edit that field per entry.

---

## 5. Design & technical notes

- **Visual theme:** black/red "chess deck" motif — card grid with chess-square corner accents, a chess pawn (♙) as the list-bullet glyph, and a rotating low-poly 3D chessboard + knight in the hero (built procedurally in Three.js — no external 3D model files to license or maintain).
- **3D & animation performance:**
  - The Three.js hero scene is deferred via `requestIdleCallback` and loaded as a separate module, so it never blocks first paint.
  - It's skipped entirely (falling back to a CSS radial-gradient) on small screens (`< 760px`) or low-core-count devices, and the render loop pauses when the tab is hidden.
  - Card flips use CSS 3D transforms (`preserve-3d`, `rotateY`) — GPU-accelerated and much cheaper than WebGL per card.
  - Every animation respects `prefers-reduced-motion: reduce`.
- **Accessibility (WCAG AA target):**
  - Skip-to-content link, semantic landmarks, visible focus rings (`:focus-visible`).
  - Cards are keyboard-operable (`Enter`/`Space` to flip, `aria-pressed` state).
  - Project/experience modals are accessible dialogs (`role="dialog"`, focus trap, `Escape` to close, focus returns to trigger on close).
  - Text/background pairs were checked against WCAG contrast math; body text ≥ 8:1, accent text ≥ 5.6:1, primary button text 4.66:1.
- **SEO & social previews:** meta description, canonical URL, Open Graph + Twitter Card tags, a generated `og-image.png`, `Person` JSON-LD, `robots.txt`, `sitemap.xml`. Update the placeholder URL (`https://kislay-anand.github.io/`) in `index.html`, `robots.txt`, and `sitemap.xml` if your final URL differs.
- **Analytics:** opt-in only — a consent banner appears after a short delay; no tracking script is requested until the visitor clicks "Accept." Wire a real provider into `loadAnalyticsScript()` in `src/components/analytics.js` (a commented Plausible example is included). Consent is not persisted across sessions by default (no cookies/localStorage are set).

---

## 6. Quality assurance

### Automated
`npm test` runs `scripts/smoke-test.mjs` (requires `npm install` first, dev-only — not needed for hosting). It loads the real `index.html` and the actual source modules into a headless DOM and asserts:
- The name, resume download link, and GitHub link render.
- Every CV-driven section renders the expected number of entries.
- The contact form's fields are present, and **no email or phone string appears anywhere in the rendered contact section** — this is checked automatically so a future edit can't accidentally reintroduce one.
- No uncaught runtime errors occur during render/init.

### Manual checklist before publishing
- [ ] **Cross-browser:** check latest Chrome, Firefox, Safari, and Edge.
- [ ] **Mobile:** nav hamburger menu, tap-to-flip cards, hero gradient fallback (no WebGL) on a real phone.
- [ ] **Reduced motion:** enable "Reduce Motion" in OS accessibility settings and confirm animations skip/are instant.
- [ ] **Keyboard-only pass:** Tab through nav, cards (flip with Enter/Space), modal open/close/focus-trap, and the contact form.
- [ ] **Screen reader spot-check:** VoiceOver/NVDA over the hero, a flipped card, and an open modal.
- [ ] **Lighthouse:** run Performance + Accessibility + SEO on the deployed URL.
- [ ] **Configure the Formspree endpoint** (§3) so messages actually reach you.
- [ ] **Update placeholder URLs** (§5, SEO) to match your real deployed domain.

---

## 7. Project structure

```
.
├── index.html                     # Document shell, SEO/meta tags, import map, section anchors
├── Kislay_Anand_Resume.pdf        # Downloadable résumé (linked from the hero)
├── favicon.svg, og-image.png, robots.txt, sitemap.xml
├── .github/workflows/deploy.yml   # Optional: Actions-based Pages deploy (see §1)
├── src/
│   ├── data/cv.js                 # ← single source of truth for all content
│   ├── components/
│   │   ├── render.js              # Builds every section's DOM from cv.js
│   │   ├── modal.js                # Accessible project-detail dialog
│   │   ├── reveal.js               # Scroll-triggered fade-in (IntersectionObserver)
│   │   ├── contactForm.js          # Contact form → Formspree-compatible POST (no client-side email)
│   │   └── analytics.js            # Opt-in consent banner + analytics loader stub
│   ├── three/heroScene.js         # Procedural 3D chessboard + knight, lazy-loaded, uses the "three" import map
│   └── styles/main.css            # Design tokens, layout, card-flip, responsive rules
├── scripts/smoke-test.mjs         # Dev-only automated smoke test (npm test)
└── package.json                   # Dev-only scripts (local preview + test) — not required to host
```

---

## 8. License

No license file is included by default — add one (e.g. MIT) if you want to make the source reusable by others. The résumé PDF, name, and CV content remain personal to Kislay Anand regardless of the code license.
