# Kislay Anand — Cybersecurity Portfolio

A chess-deck-themed portfolio site generated from your CV. It's a **plain static site — no build step, no bundler, no npm install required to host it.** Push these files to a GitHub repo, flip on GitHub Pages, and it's live.

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
   - **"Deploy from a branch"** → branch `main`, folder `/ (root)` → Save. *(Simplest option.)*
   - **"GitHub Actions"** → the included `.github/workflows/deploy.yml` runs automatically and keeps repo-only files like `README.md` out of the published site.
4. Wait 1–2 minutes. Your site is live at `https://<your-username>.github.io/<repo-name>/` (or `https://<your-username>.github.io/` if the repo is your `.github.io` repo).

No `npm run build`, no `dist` folder — what you push is what gets served, because the browser loads every JS file as a native ES module and Three.js comes from a CDN via a browser import map declared in `index.html`.

### Why it works at any URL/sub-path
Every path in `index.html` and the JS is written as a **relative** path, so the site works identically at your domain root or at a `/repo-name/` sub-path — nothing to change if you rename the repo.

---

## 2. Local preview (optional)

```bash
npm run dev
```

Runs a plain static file server (`npx serve .`) — the exact files GitHub Pages will serve, no build. You can also just open `index.html` directly in a browser.

---

## 3. Add your photo

The Contact section has a photo placeholder next to the message form, above the GitHub/LinkedIn links. To swap it for a real photo:

1. Drop a square photo (400×400px or larger works best) into the repo root — e.g. `photo.jpg`.
2. In `src/data/cv.js`, update:
   ```js
   photo: './photo.jpg',   // ← was './profile-placeholder.svg'
   ```

Until you do this, `profile-placeholder.svg` (a plain silhouette) is shown so the layout is complete and nothing looks broken.

---

## 4. Contact form — how messages reach your inbox (and why no email address is anywhere in this repo)

The Contact section is a plain message box (name / email / message) — **no email address or phone number appears anywhere on the page, in the page source, or in this repo's code.** Anything written into a static site's HTML/JS is public to anyone who views source, so your address is never placed there.

To receive messages, the form posts to a small third-party form backend — the destination inbox is configured **only inside that service's own dashboard**, never in this codebase:

1. Go to **[formspree.io](https://formspree.io)** (free tier is enough) and sign up.
2. Create a new form and verify it with the email you want messages to arrive at. Formspree gives you an endpoint URL like `https://formspree.io/f/abcdwxyz`.
3. Open `src/data/cv.js` and paste it in:
   ```js
   contact: {
     formEndpoint: 'https://formspree.io/f/abcdwxyz', // ← your real endpoint
   },
   ```

Any Formspree-compatible service (Getform, Web3Forms, etc.) works identically. **Until this is set, the form shows a polite "not connected yet" message on submit** — there's no fallback that would expose an address.

---

## 5. Updating your content

**All CV content lives in one file: `src/data/cv.js`.** Edit the arrays/objects there — no HTML/CSS/JS structure changes needed:
- **New certification/certificate** → add to `certifications` or `certificates` (each can include a `certificateUrl` — it renders as a "View Certificate" link on the back of the flip card).
- **New project** → add to `projects` (`title`, `period`, `summary`, `points`, `tags`).
- **New job/internship** → add to `experience`.
- **Publications** → add to `publications`; the nav link and section appear automatically once it's non-empty.

### Swapping the résumé PDF
Replace `Kislay_Anand_Resume.pdf` at the repo root (keep the filename, or update `profile.resumeFile` in `cv.js` if you rename it).

---

## 6. Design & technical notes

- **Visual theme:** black/red "chess deck" motif — card grid with chess-square corner accents, a chess king (♔) as the list-bullet glyph, and two low-poly 3D king pieces (built procedurally in Three.js — no external model files) facing each other across a rotating chessboard in the hero: **red** faces the viewer when the page opens, **black** stands opposite it.
- **Cards:** flip-to-view is the *only* detail interaction — click/tap or press Enter/Space to flip a card and see its full detail list on the back (no separate "more detail" popup). Experience, Projects, Labs, Certifications, and Certificates all use the same card treatment, including a "View Certificate" link wherever a proof link exists.
- **Animation, throughout the page, not just the hero:**
  - The 3D chessboard sits as a fixed, transparent backdrop **behind the entire page** (not just the hero) — it's visible faintly as you scroll all the way down, and its rotation is tied to scroll progress across the *whole document*, not just the first screen.
  - Every card, list row, and skill group fades/slides in on scroll with a staggered delay (via `IntersectionObserver`), so sections cascade in as you reach them rather than only the section headings animating.
  - Card flips use CSS 3D transforms (`preserve-3d`, `rotateY`) — GPU-accelerated.
  - Every animation respects `prefers-reduced-motion: reduce`.
- **3D performance:** the Three.js scene is deferred via `requestIdleCallback` (so it never blocks first paint), skipped entirely on small screens (`< 760px`) or low-core-count devices in favor of a CSS gradient fallback, and its render loop pauses when the tab is hidden.
- **Accessibility (WCAG AA target):** skip-to-content link, semantic landmarks, visible focus rings, keyboard-operable cards (`Enter`/`Space` to flip, `aria-pressed` state), and contrast-checked text/background pairs (body text ≥ 8:1, accent text ≥ 5.6:1, primary button text 4.66:1).
- **SEO & social previews:** meta description, canonical URL, Open Graph + Twitter Card tags, `og-image.png`, `Person` JSON-LD, `robots.txt`, `sitemap.xml`. Update the placeholder URL (`https://kislay-anand.github.io/`) in `index.html`, `robots.txt`, and `sitemap.xml` if your final URL differs.
- **Analytics:** opt-in only — no tracking script loads until the visitor clicks "Accept" on the consent banner. Wire a real provider into `loadAnalyticsScript()` in `src/components/analytics.js`.

---

## 7. Quality assurance

### Automated
```bash
npm install   # dev-only, not needed for hosting — installs jsdom for the test
npm test
```
`scripts/smoke-test.mjs` loads the real `index.html` and the actual source modules into a headless DOM and asserts:
- The name, corrected hero role text (CEH, no "Full-Stack Dev"), résumé link, and GitHub link render.
- Every CV-driven section renders the expected number of entries, including the corrected education percentages (63.6% / 74.6%) and the "B.Tech. Hons." degree label.
- Certificates render as flip cards (not a plain list), and no "more detail" button exists anywhere.
- The contact form and photo placeholder are present, and **no email/phone string appears anywhere in the contact section** — checked automatically so a future edit can't reintroduce one.
- No uncaught runtime errors occur during render/init.

### Manual checklist before publishing
- [ ] **Cross-browser:** latest Chrome, Firefox, Safari, Edge.
- [ ] **Mobile:** nav hamburger menu, tap-to-flip cards, hero gradient fallback (no WebGL) on a real phone.
- [ ] **Reduced motion:** enable "Reduce Motion" in OS accessibility settings and confirm animations skip/are instant.
- [ ] **Keyboard-only pass:** Tab through nav, cards (flip with Enter/Space), and the contact form.
- [ ] **Add your real photo** (§3) and **configure the Formspree endpoint** (§4).
- [ ] **Update placeholder URLs** (§6, SEO) to match your real deployed domain.

---

## 8. Project structure

```
.
├── index.html                     # Document shell, SEO/meta tags, import map, section anchors
├── Kislay_Anand_Resume.pdf        # Downloadable résumé
├── profile-placeholder.svg        # Photo placeholder — swap per §3
├── favicon.svg, og-image.png, robots.txt, sitemap.xml
├── .github/workflows/deploy.yml   # Optional: Actions-based Pages deploy (see §1)
├── src/
│   ├── data/cv.js                 # ← single source of truth for all content
│   ├── components/
│   │   ├── render.js              # Builds every section's DOM from cv.js
│   │   ├── reveal.js               # Staggered scroll-triggered fade-in (IntersectionObserver)
│   │   ├── contactForm.js          # Contact form → Formspree-compatible POST (no client-side email)
│   │   └── analytics.js            # Opt-in consent banner + analytics loader stub
│   ├── three/heroScene.js         # Two facing 3D king pieces (red/black) + chessboard, full-page scroll-linked
│   └── styles/main.css            # Design tokens, layout, card-flip, responsive rules
├── scripts/smoke-test.mjs         # Dev-only automated smoke test (npm test)
└── package.json                   # Dev-only scripts (local preview + test) — not required to host
```

---

## 9. License

No license file is included by default — add one (e.g. MIT) if you want to make the source reusable by others. The résumé PDF, name, photo, and CV content remain personal to Kislay Anand regardless of the code license.
