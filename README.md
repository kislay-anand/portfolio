# Kislay Anand — Cybersecurity Portfolio

A production-ready, chess-deck-themed portfolio site generated from `CV.docx`. Built as a static site with **Vite** and **Three.js**, deployable to **GitHub Pages** with zero server-side code.

Live sections: Hero · Summary · Skills · Experience · Projects · Labs & Training · Certifications · Certificates · Education · Contact.

---

## 1. Quick start (local development)

Requires **Node.js 18+**.

```bash
npm install
npm run dev        # starts a local dev server with hot reload
```

Open the URL Vite prints (typically `http://localhost:5173`).

```bash
npm run build       # production build → ./dist
npm run preview     # serve the production build locally to sanity-check it
npm test            # runs the automated smoke test (see §5)
```

---

## 2. Deploying to GitHub Pages

This repo ships with `.github/workflows/deploy.yml`, which builds the site with Vite and deploys `dist/` to GitHub Pages automatically **on every push to `main`**.

**One-time setup after you push this repo to GitHub:**

1. Go to your repo → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **"GitHub Actions"** (not "Deploy from a branch").
3. Push to `main` (or click **Run workflow** on the Actions tab). The first run creates the `github-pages` environment automatically.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/` (or `https://<your-username>.github.io/` if the repo is named `<your-username>.github.io`).

No manual `gh-pages` branch or `npm run deploy` step is needed — the Action handles build + deploy end to end.

### Why the site works at any sub-path
`vite.config.js` sets `base: './'` (a relative base), so the same build works whether GitHub Pages serves it from the domain root or from a `/repo-name/` sub-path. You do **not** need to edit this when you rename the repo.

### Custom domain (optional)
Add a `CNAME` file to `public/` containing your domain (e.g. `yourdomain.com`), then configure the DNS records GitHub Pages documents for custom domains.

---

## 3. Updating your content

**All CV content lives in one file: `src/data/cv.js`.** You do not need to touch any HTML, CSS, or the rendering logic to update your resume — edit the arrays/objects in that file (profile, summary, skills, experience, projects, labs, certifications, certificates, education, publications) and rebuild.

Examples:
- **New certification** → add an object to the `certifications` array.
- **New project** → add an object to the `projects` array (`title`, `period`, `summary`, `points`, `tags`).
- **New job/internship** → add to `experience`.
- **Publications** → add entries to the `publications` array; a "Publications" nav link and section appear automatically once that array is non-empty (it's hidden entirely while empty, matching your current CV).

After editing, just run `npm run build` (or push to `main` — the GitHub Action rebuilds for you).

### Contact form — action needed to actually receive emails
The Contact section is a message form (name / email / message) — no raw email or phone number is shown on the page anywhere. As shipped, it works with **zero setup** via a `mailto:` fallback: submitting opens the visitor's own email app, addressed to `helltohacking@gmail.com` with the message pre-filled. That's reliable but requires the visitor to hit "send" themselves in their mail app.

**To have messages land in your inbox automatically (no visitor action needed), wire up a free form backend — recommended: [Formspree](https://formspree.io):**

1. Sign up at formspree.io (free tier is enough) and verify `helltohacking@gmail.com` as the receiving address.
2. Create a new form; Formspree gives you an endpoint like `https://formspree.io/f/abcdwxyz`.
3. Paste it into `src/data/cv.js`:
   ```js
   contact: {
     destinationEmail: 'helltohacking@gmail.com',
     formEndpoint: 'https://formspree.io/f/abcdwxyz', // ← paste your real endpoint here
   },
   ```
4. Rebuild/redeploy. The form will now `POST` directly to Formspree, which emails you the submission — the mailto fallback only kicks back in if that request ever fails (e.g., Formspree is down), so the form always works either way.

Any Formspree-compatible service (Getform, Web3Forms, etc.) works the same way — just drop its endpoint into `formEndpoint`.

### Swapping the résumé PDF
Replace `public/Kislay_Anand_Resume.pdf` with an updated export of your CV (keep the same filename, or update `profile.resumeFile` in `src/data/cv.js` to match a new filename).

### Updating the CEH/certificate proof link
The Experience card's "View Certificate" button reads from `experience[i].certificateUrl`. Add or update that field per entry.

---

## 4. Design & technical notes

- **Visual theme:** black/red "chess deck" motif — card grid with chess-square corner accents, a chess pawn (♙) used as list-bullet glyph, and a rotating low-poly 3D chessboard + knight in the hero (built procedurally in Three.js — no external 3D model files to license or maintain).
- **3D & animation performance:**
  - The Three.js hero scene is code-split into its own chunk and lazy-loaded via `requestIdleCallback`, so it never blocks first paint.
  - It's skipped entirely (falling back to a CSS radial-gradient) on small screens (`< 760px`) or low-core-count devices, and the render loop pauses when the tab is hidden.
  - All other "3D" interactions (card flips) use CSS 3D transforms (`transform-style: preserve-3d`, `rotateY`), which are GPU-accelerated and far cheaper than WebGL per-card.
  - Every animation respects `prefers-reduced-motion: reduce` (scroll-reveal, card flip transition, and knight bobbing all disable or skip immediately).
- **Accessibility (WCAG AA target):**
  - Skip-to-content link, semantic landmarks (`header`, `main`, `footer`, labelled `section`s), visible focus rings (`:focus-visible`).
  - Cards are keyboard-operable (`tabindex="0"`, `Enter`/`Space` to flip, `aria-pressed` state).
  - Project/experience modals are accessible dialogs: `role="dialog"`, `aria-modal`, focus trap, `Escape` to close, focus returns to the trigger on close.
  - Text/background color pairs were checked against WCAG contrast math; body text ≥ 8:1, accent text used for copy ≥ 5.6:1, primary button text 4.66:1 (all pass AA; see `scripts/` if you want to re-verify after a palette change).
- **SEO & social previews:** meta description, canonical URL, Open Graph + Twitter Card tags, a generated `og-image.png`, `Person` JSON-LD structured data, `robots.txt`, and `sitemap.xml`. Update the placeholder URLs (`https://kislay-anand.github.io/`) in `index.html`, `public/robots.txt`, and `public/sitemap.xml` if you deploy under a different domain or repo name.
- **Analytics:** opt-in only. A consent banner appears after a short delay; no tracking script is ever requested until the visitor clicks "Accept." Wire your real analytics provider into `loadAnalyticsScript()` in `src/components/analytics.js` (a commented Plausible example is included). As shipped, consent is **not** persisted across sessions (no localStorage/cookies are set) — see the comment in that file if you want to persist the choice.
- **Contact form:** a name/email/message form with no raw email or phone displayed on the page. It posts to a configurable form backend (Formspree-compatible) and falls back to a `mailto:` link if no backend is configured or the request fails — see §3 for setup.
- **Asset optimization:** production build is minified, code-split (Three.js in its own cacheable chunk), and pre-compressed with both Brotli and gzip (`vite-plugin-compression2`) so a CDN/host that supports `Accept-Encoding` negotiation can serve the smaller files directly.

---

## 5. Quality assurance

### Automated
`npm test` runs `scripts/smoke-test.mjs`, which loads the real `index.html` and the actual source modules (`render.js`, `reveal.js`, `contactForm.js`) into a headless DOM (jsdom) and asserts:
- The name, resume download link, and GitHub link render.
- Every CV-driven section (projects, certifications, certificates, education) renders the expected number of entries.
- Contact form fields and its submit button are present.
- No uncaught runtime errors occur during render/init.

This catches data-shape regressions (e.g., a malformed entry in `cv.js`) and rendering crashes before you deploy. It does **not** test WebGL rendering, visual layout, or animations — see the manual checklist below for that.

### Manual checklist before publishing
- [ ] **Cross-browser:** check latest Chrome, Firefox, Safari, and Edge. Safari in particular is worth checking for `backdrop-filter` and 3D transform quirks.
- [ ] **Mobile:** verify the nav hamburger menu, card flip via tap, and that the hero falls back gracefully to the gradient background (no WebGL) on a real phone.
- [ ] **Reduced motion:** enable "Reduce Motion" in OS accessibility settings and confirm animations are skipped/instant.
- [ ] **Keyboard-only pass:** Tab through the whole page — nav, cards (flip with Enter/Space), modal open/close/focus-trap, and the contact form.
- [ ] **Screen reader spot-check:** VoiceOver/NVDA pass over the hero, a flipped card, and an open modal.
- [ ] **Lighthouse:** run a Performance + Accessibility + SEO audit on the deployed URL; the architecture here (code-split Three.js, compressed assets, semantic HTML) is designed to score well, but real device/network conditions vary.
- [ ] **Update the placeholder URLs** noted in §4 (SEO section) to match your actual deployed domain.
- [ ] **Configure the contact form backend** (Formspree endpoint) per §3 so messages land in your inbox automatically, rather than relying on the mailto fallback.

### Known non-issue
`npm audit` may flag a moderate/high advisory in `esbuild`/older `vite` versions. That advisory only affects the **local dev server** (`vite dev`) being reachable by other sites on your machine during development — it does not affect the static production build this site ships, and does not apply once deployed. Avoid running `npm run dev` on an untrusted network with the dev server exposed publicly, and keep dependencies updated (`npm outdated`) periodically.

---

## 6. Project structure

```
.
├── .github/workflows/deploy.yml   # CI: build + deploy to GitHub Pages on push to main
├── index.html                     # Document shell, SEO/meta tags, section anchors
├── public/                        # Copied as-is into the build (resume PDF, favicon, og-image, robots.txt, sitemap.xml)
├── src/
│   ├── data/cv.js                 # ← single source of truth for all content
│   ├── components/
│   │   ├── render.js              # Builds every section's DOM from cv.js
│   │   ├── modal.js                # Accessible project-detail dialog
│   │   ├── reveal.js               # Scroll-triggered fade-in (IntersectionObserver)
│   │   ├── contactForm.js          # Contact form: Formspree POST with mailto fallback
│   │   └── analytics.js            # Opt-in consent banner + analytics loader stub
│   ├── three/heroScene.js         # Procedural 3D chessboard + knight, lazy-loaded
│   └── styles/main.css            # Design tokens, layout, card-flip, responsive rules
├── scripts/smoke-test.mjs         # Automated content/render smoke test (npm test)
├── vite.config.js                 # Relative base + asset compression/splitting
└── package.json
```

---

## 7. License

No license file is included by default — add one (e.g. MIT) if you want to make the source reusable by others. The résumé PDF, name, and CV content remain personal to Kislay Anand regardless of the code license.
