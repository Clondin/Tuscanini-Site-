# Tuscanini website audit

**Audit date:** July 21, 2026
**Production:** <https://tuscanini-site.vercel.app/>
**Scope:** visual design, responsive behavior, core flows, accessibility, performance, SEO, security posture, content/data integrity, and engineering operations.
**Result:** the site has a strong, cohesive premium-food presentation and sound responsive foundations, but it is not yet operating like a production-grade commerce discovery site. The most consequential issues are a newsletter form that never submits, a 26.3 MiB home-page load dominated by the hero video, inaccessible custom interactions, and a client-only deployment that serves the same generic HTML with HTTP 200 for every URL—including nonexistent pages and `robots.txt`.

No application source was changed during this audit. Evidence and generated screenshots are stored under `tmp/site-audit-2026-07-21/`.

## Executive assessment

| Area | Health | Assessment |
|---|---:|---|
| Brand and visual design | Strong | Distinctive, cohesive Italian editorial aesthetic; excellent imagery, type hierarchy, and product presentation. |
| Mobile responsiveness | Good, with gaps | True 390 px layouts do not overflow horizontally. The mobile menu/search and product first viewport need refinement. |
| Core functionality | Needs work | Navigation, search, category browsing, product details, lightbox, and 404 UI operate; the newsletter promise is nonfunctional. |
| Performance | Poor | Lighthouse: **67 mobile / 81 desktop**. Home page is **26.3 MiB** in the lab run, with **5.4 s mobile LCP**. |
| Accessibility | Needs work | Lighthouse is **94**, but important custom controls and overlays exclude or inconvenience keyboard and screen-reader users. |
| SEO/discoverability | Poor | Lighthouse is **92** only because the rendered home page has basic metadata; route metadata, canonical/OG data, valid robots/sitemap, structured data, and real HTTP 404 behavior are absent. |
| Security posture | Fair | HSTS and a clean production dependency audit are positives. Browser security headers are missing, and a client-side API-key define is a latent secret-exposure risk. |
| Reliability/maintainability | Needs work | Direct type-check/build pass, but there are no tests, the normal pnpm build workflow is not reproducible in the current install state, and startup is blocked on seven CMS collections. |

## Highest-priority findings

| Priority | Finding | Why it matters | Recommended outcome |
|---|---|---|---|
| P0 | Newsletter does not submit | The form prevents default submission and does nothing while promising delivery and unsubscribe behavior. This is a broken conversion and trust surface. | Connect a consent-aware email service/API with loading, success, duplicate, validation, and failure states—or remove the form until it works. |
| P0 | Home page transfers 26.3 MiB | Mobile LCP is 5.4 s. Lighthouse fetched about 22.1 MB of the hero video; the source MP4 is 32.3 MB. This is the dominant speed and data-cost problem. | Deliver a short, aggressively compressed mobile/desktop video pair with poster, preload policy, pause control, and a static/reduced-data fallback. Set an initial-page budget under 2–3 MB. |
| P0 | Custom interactions are not fully accessible | Search, quick view, lightbox, sourcing pins, and the image-lightbox trigger lack required semantics and keyboard/focus behavior. Core content is not equally operable. | Use semantic buttons and proper dialog primitives; label inputs; trap/restore focus; add Escape and keyboard support; make the background inert. |
| P0 | Every production URL returns the SPA shell with HTTP 200 | Unknown routes are soft 404s; `robots.txt`, `sitemap.xml`, and the manifest are returned as HTML. Search engines and diagnostics receive misleading responses. | Serve real static files, return an actual 404 status for unknown paths, and prerender or server-render indexable routes. |
| P1 | All routes share `Tuscanini` and one generic description | Category/product/about pages have no unique title, description, canonical, social cards, or structured data. Product discovery and sharing quality suffer. | Add route-aware metadata and Product, BreadcrumbList, Organization, and Recipe structured data; generate a sitemap from CMS slugs. |
| P1 | Below-fold imagery is loaded eagerly | Home loads 15/15 images eagerly; category 17/17; product 7/7; about 11/11. Lighthouse estimates **4.28 MiB** of image-delivery savings. | Lazy-load below-fold images, set explicit dimensions, use responsive AVIF/WebP sources, and reserve eager/high priority for the actual LCP asset only. |
| P1 | App mounting waits for the entire CMS bootstrap | `src/main.tsx:23` waits for seven content types before React renders. One slow collection delays first UI, and one rejected request causes the entire set to fall back. | Render the shell immediately; load route-critical content first; cache content; use per-collection `allSettled`/fallback behavior and observable retry/error states. |
| P1 | Modal/menu focus and background isolation are incomplete | The mobile menu leaves the page visible and potentially interactive; overlays do not declare dialog state or manage focus. | Use `aria-expanded`/`aria-controls`, focus containment and restoration, `inert` background behavior, and tested screen-reader announcements. |
| P1 | Static assets are not cached as immutable | Even the hashed JS and the MP4 return `Cache-Control: public, max-age=0, must-revalidate`. Repeat visits needlessly revalidate large files. | Cache hashed assets for one year with `immutable`; version non-hashed media or add content hashes and appropriate CDN caching. |
| P2 | Content and repository carry avoidable weight | `public/` is about 275 MiB. There are 35 exact duplicate groups (71 files) with about **22.7 MiB** of removable duplicate bytes. | Deduplicate the library, generate normalized derivatives, and enforce asset-size/format budgets in CI. |

## Performance and efficiency

### Lab results

One Lighthouse run was captured for each form factor against production. These are diagnostic lab measurements, not field Core Web Vitals.

| Metric | Mobile | Desktop | Interpretation |
|---|---:|---:|---|
| Performance score | **67** | **81** | Material room for improvement, especially on mobile. |
| First Contentful Paint | 3.5 s | 0.9 s | Mobile startup is slow. |
| Largest Contentful Paint | **5.4 s** | **2.4 s** | Mobile is poor; desktop is near the 2.5 s good threshold. |
| Speed Index | 5.9 s | 2.5 s | Long mobile visual completion. |
| Total Blocking Time | 130 ms | 0 ms | Main-thread blocking is not the primary bottleneck. |
| Cumulative Layout Shift | 0 | 0 | Excellent stability in both runs. |
| Total transfer | **26,290 KiB** | **26,289 KiB** | Network payload is the central performance issue. |

Supporting evidence: [mobile Lighthouse JSON](tmp/site-audit-2026-07-21/lighthouse-mobile.json) and [desktop Lighthouse JSON](tmp/site-audit-2026-07-21/lighthouse-desktop.json).

Key contributors:

- The source hero video is **32,296,412 bytes**. Lighthouse downloaded a partial/range response of roughly **22.1 MB** during the run.
- Lighthouse estimates **4,284–4,285 KiB** of image-delivery savings, **53 KiB** of unused JavaScript, and render-blocking savings of about **1.69 s mobile / 0.4 s desktop**.
- The main application chunk is **513.43 kB minified / 157.85 kB gzip** and triggers Vite's 500 kB chunk warning. Route chunks are already split, but the shared bundle still needs inspection.
- Google Fonts are loaded through a render-blocking CSS `@import` with four families and many weights (`src/index.css:1`). Self-hosting a curated subset and preloading only essential fonts would reduce dependency and render delay.
- Three visual textures are hotlinked from `transparenttextures.com` (`src/index.css:31`, `:35`, `:39`). Local optimized copies would remove a third-party failure and latency dependency.
- Production's hashed JS, video, and product images all use `max-age=0, must-revalidate`. Strong immutable caching would improve repeat navigation without changing visual quality.
- One displayed heritage image is naturally 360×640 but is enlarged to roughly 516×645 on desktop, which can look soft.

Recommended performance budget:

- Initial mobile transfer: **≤2.5 MiB** on the home page and **≤1.5 MiB** on category/product pages.
- JavaScript: **≤150 kB gzip** initial, with route and interaction modules loaded on demand.
- Images: responsive AVIF/WebP, generally **≤200 kB** each at delivered viewport size.
- Video: do not preload the full asset; target a brief optimized loop, poster-first paint, reduced-data/static fallback, and a visible pause control.

## Functional and UX audit

### What works well

- The visual system is unusually cohesive: cream, dark olive, terracotta, gold, editorial serif typography, subtle texture, and premium product photography support the brand promise.
- Navigation, the desktop Shop menu, mobile menu, category links, product links, quick-view entry points, search, breadcrumbs, and the designed 404 state all rendered in tested flows.
- Search for “pasta” returns useful categories and products, including description matches.
- Category and product routes preserve hierarchy and make the product archive feel curated instead of generic.
- Production and local desktop home visuals match closely.

### Broken or misleading behavior

1. **Newsletter submission is a no-op.** `src/components/home/NewsletterSignup.tsx:27` only calls `preventDefault()`. There is no request, confirmation, failure state, or persisted subscription. Because the UI says content will be “delivered to your inbox” and “unsubscribe anytime,” this should be treated as a release-blocking trust defect.
2. **“Where to Buy” is generic.** The product CTA sends users to the brand home site rather than a product-specific locator or retailer path. If that is intentional, change the label; otherwise use SKU-aware destinations.
3. **Search relevance is broad.** “Pasta” surfaces olive oil and flour because the description contains the term. Keep description matching, but rank exact product/category/title matches above incidental description hits and add a concise “view all results” path.
4. **Mobile product information starts too low.** At 390×844, breadcrumb, padding, and the square image dominate the first viewport; the product name/details begin at or below the fold. Move the name/key metadata above the image or reduce the mobile media block and top spacing.
5. **The mobile menu is not fully modal.** It scrolls internally and locks body scroll, but the hero remains visible behind a panel that does not cover the entire viewport. Without inert/focus containment, background interaction is still possible for keyboard and assistive-technology users.
6. **The About page is long and animation-heavy.** Measured mobile document height is about **9,795 px**; home is **8,016 px**. Strong storytelling is a benefit, but a sticky subnav, section index, or tighter mobile pacing would improve scanability.
7. **The sourcing map deliberately reveals content slowly.** Paths animate for about two seconds, with pins staggered after that. The captured transition state shows a large nearly blank region. Preserve delight, but reveal essential content immediately for reduced-motion users and shorten the default delay.
8. **The desktop Shop menu is spacious to the point of feeling unfinished.** Some columns have large unused areas (especially Foodservice), and a featured tile visibly crops source-ad lettering. Rebalance the grid and use an image intended for that card ratio.

## Mobile audit

True mobile device metrics were applied at **390×844**. Home, category, product, about, and not-found pages all reported `scrollWidth === clientWidth === 390`; no page-level horizontal overflow was found.

Strengths:

- Header search and menu controls are 44×44 px.
- Typography, product grids, hero crops, and breadcrumb wrapping remain coherent.
- Category and product imagery retains quality without horizontal clipping.
- Search results are legible and useful in the overlay.

Risks:

- Mobile menu toggle has `aria-label="Toggle menu"` but no `aria-expanded` or `aria-controls` (`src/components/layout/Navbar.tsx:179–184`).
- The search trigger likewise does not expose expanded state, and the overlay background is not isolated.
- Product detail content is pushed below the first viewport.
- Several footer/social controls and text links measure below 24 px in one dimension; spacing exceptions may apply, but these should be manually checked against WCAG 2.2 target-size rules.
- This was an emulated Chrome audit, not a physical iOS/Android and VoiceOver/TalkBack pass. Safari video/autoplay, touch zoom, safe-area behavior, and mobile screen-reader output remain validation gaps.

## Accessibility

Lighthouse scored **94** on both mobile and desktop, but that score does not exercise every interaction. Confirmed automated failures:

- **Color contrast:** a 10 px bold gold label over the cream collections background measured **1.99:1**, below the required 4.5:1 for normal text.
- **Heading order:** footer `h4` headings follow page `h2` sections without an intervening `h3`.

Confirmed code-level issues:

- Search input has only a placeholder and no label or `aria-label` (`src/components/ui/SearchOverlay.tsx:164–171`).
- Search overlay, quick-view modal, and image lightbox have no `role="dialog"`, `aria-modal`, accessible dialog name, focus trap, or focus restoration (`SearchOverlay.tsx:145`, `QuickViewModal.tsx:36`, `ImageLightbox.tsx:73`). Escape handling exists in several overlays, which is a good start.
- Product image opens the lightbox from a clickable `div` with no keyboard or button semantics (`src/components/product/ProductHero.tsx:32–37`).
- Sourcing pins are mouse-only SVG groups with hover and click handlers, but no focusability, accessible name, role, or keyboard activation (`src/components/about/SourcingMap.tsx:235–249`). The SVG itself has no programmatic title/label.
- No skip-to-content link appears before the logo. Keyboard focus is visibly outlined by the browser, which is positive, but reaching page content requires traversing navigation controls.
- CSS partially honors `prefers-reduced-motion` (`src/index.css:125–131`), but Framer Motion components do not consult `useReducedMotion`, the route effect calls smooth scrolling directly (`src/components/Layout.tsx:10–12`), and the autoplay hero video has no pause control. Reduced-motion support is therefore incomplete.
- Some alternative text should be editorially reviewed for accuracy; for example, one heritage image is labeled “Tuscanini Italian Market” despite not clearly depicting that subject.

Accessibility acceptance criteria:

- Every interaction works with Tab, Shift+Tab, Enter/Space, Escape, and visible focus.
- Each overlay announces as a labeled modal dialog, traps focus while open, restores focus on close, and makes background content inert.
- Sourcing locations are a semantic list of buttons in addition to—or underlying—the SVG.
- Autoplay motion can be paused and respects reduced-motion/reduced-data preferences.
- Axe/Lighthouse have no high-impact failures, followed by manual NVDA + Chrome and VoiceOver + Safari checks.

## SEO, social sharing, and routing

Production returns the same **491-byte HTML shell** for home, category, product, about, an arbitrary nonexistent route, `robots.txt`, `sitemap.xml`, and `manifest.webmanifest`. Each returns HTTP 200; the last three are incorrectly served as `text/html`.

After JavaScript and CMS initialization, every tested page has:

- Title: `Tuscanini`
- Description: `Taste Tuscanini. Know Italy.`
- No canonical URL
- No Open Graph/Twitter metadata
- No robots meta
- No theme color
- No detected JSON-LD structured data

The cause is visible in `src/data/cms.ts:141–152`, which globally applies the CMS site title and tagline. `vercel.json:2–4` rewrites every path to `/`, causing the soft-404/static-file behavior.

Recommended model:

- Prerender or server-render the finite CMS catalog so category/product/recipe/about URLs ship meaningful HTML before JavaScript.
- Generate unique titles/descriptions, canonicals, social cards, and JSON-LD from CMS records.
- Generate `robots.txt` and a sitemap that includes all live category, product, recipe, and page slugs.
- Configure a real not-found route and HTTP 404 response.
- Add a useful `noscript` fallback if the site remains client-rendered.

## Security and privacy posture

Positives:

- HTTPS responses include HSTS: `max-age=63072000; includeSubDomains; preload`.
- `pnpm audit --prod` reported no known production dependency vulnerabilities on the audit date.
- Inspected external `target="_blank"` links include `noopener noreferrer`.
- The site is a static catalog with no authentication, checkout, or account data, so its direct application attack surface is modest.

Hardening gaps:

- Production responses omit Content-Security-Policy, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. Add a measured policy after inventorying the CMS, fonts, video, and texture origins; do not deploy an untested CSP that breaks assets.
- `vite.config.ts:11` defines `process.env.GEMINI_API_KEY` for client substitution. The current source does not reference that value, so no current bundle leak was found, but any future reference would embed the secret in public JavaScript. Remove the define and route privileged AI calls through a server-side function if the feature returns.
- `.env.example:1–4` contains legacy AI Studio guidance that does not match this static Vite deployment and increases the chance of unsafe configuration.
- Remote Google Fonts, public CMS calls, and hotlinked textures increase privacy/CSP surface and availability dependencies. Self-host nonessential visual assets where practical.

## CMS and content integrity

The live CMS contained **20 categories, 143 products, and 12 recipes** during the audit.

Positives:

- No duplicate category/product IDs or slugs were found.
- No product pointed to an unknown category.
- No category was empty.
- No product image was missing, and all **233 unique source-referenced local assets** existed with exact filename casing.
- The all-or-nothing bundled fallback gives the site some resilience when the CMS fails.

Issues:

- Three recipe-to-product references do not resolve and are silently filtered from the UI:
  - `classic-margherita-pizza` → `pizza-crust`
  - `bruschetta-trio` → `flatbread`
  - `focaccia-panini` → `focaccia-bread`
- Startup fetches seven content types concurrently (`src/data/cms.ts:166–168`) with a 10-second timeout per request (`src/data/cms.ts:52–54`). One measured CMS pass ranged from roughly 0.3 to 1.1 seconds per first-page request; products require pagination beyond 100 items. A single rejection discards all otherwise successful live collections.
- There is no visible freshness, degraded-mode, or stale-content signal. Add telemetry so fallback use is observable even if users continue seeing content.

## Engineering quality and operations

Verification results:

- Direct `tsc --noEmit`: **pass**.
- Direct Vite production build: **pass** (2,142 modules; about 5.6 s in this environment).
- Standard `pnpm run build`: **not reproducible in the current install state** because pnpm blocks/requests approval for dependency build scripts. Document and commit the intended `onlyBuiltDependencies`/approval policy so CI and new machines behave consistently.
- Production dependency audit: **0 known vulnerabilities**.
- Automated unit, integration, and end-to-end tests: **none found**.

Maintainability findings:

- The `lint` script is only a TypeScript check; there is no ESLint/style rule gate.
- TypeScript is permissive (`allowJs: true`, `skipLibCheck: true`, and no `strict: true`). Tighten incrementally rather than switching everything at once.
- `vite` is declared in both dependencies and devDependencies. `@google/genai`, `dotenv`, and `express` appear unused by the current client source; remove verified dead dependencies. Move build-only tooling such as Vite/plugin-react to devDependencies where deployment conventions allow.
- Several installed packages have newer major versions. Treat this as a tested maintenance track, not an emergency upgrade.
- No CI asset budget, link check, accessibility smoke test, or route E2E coverage exists. A compact suite should cover home rendering, menu/search keyboard behavior, category→product navigation, quick view/lightbox, newsletter success/failure, unique metadata, and real 404/static-file responses.

## Recommended delivery plan

### Phase 1 — protect trust and access

1. Implement or temporarily remove newsletter signup.
2. Replace clickable non-controls with buttons and install a shared accessible dialog primitive for search, quick view, lightbox, and mobile navigation.
3. Add semantic/keyboard alternatives for sourcing pins, a skip link, expanded-state attributes, and corrected contrast/heading structure.
4. Add automated interaction tests for those paths before refactoring visuals.

### Phase 2 — make the experience fast

1. Replace the 32.3 MB hero source with responsive optimized video/poster variants and motion/data fallbacks.
2. Lazy-load and right-size below-fold images; create AVIF/WebP derivatives from original PNGs.
3. Deduplicate the asset library and enforce per-file/page budgets.
4. Self-host the required font subset and textures; remove unused JavaScript/dependencies.
5. Configure immutable caching for versioned assets.

### Phase 3 — make the catalog discoverable

1. Prerender/SSR catalog routes and ship route-specific metadata.
2. Add sitemap, valid robots, canonical/OG/Twitter tags, and product/recipe/breadcrumb structured data.
3. Return a real HTTP 404 for unknown routes.
4. Validate in search/social preview tools after deployment.

### Phase 4 — reliability and polish

1. Decouple initial rendering from full CMS bootstrap and use per-collection fallback/caching.
2. Repair the three broken recipe product references and add CMS relation validation.
3. Improve mobile product above-the-fold hierarchy, menu coverage, search ranking, About-page pacing, and Shop-menu composition.
4. Add monitoring for CMS fallback, frontend errors, performance budgets, and key conversions.

## Visual walkthrough evidence

Each screenshot is a valid captured state at the named viewport. Animation timing, video frames, and remote font/texture availability can vary; these images supplement, rather than replace, code and interaction inspection.

1. **Home, desktop — Needs performance work.** Strong hero composition, clear CTA, and cohesive art direction. Main risk is the oversized autoplay video and all-eager below-fold imagery. Output: `accepted-01-home-desktop.png`.

   ![Desktop home](tmp/site-audit-2026-07-21/accepted-01-home-desktop.png)

2. **Shop menu, desktop — Needs layout polish.** Categories are discoverable and the interaction works. Large unused space and a visibly cropped promotional tile weaken the premium finish. Output: `accepted-02-home-desktop-shop-menu.png`.

   ![Desktop Shop mega-menu](tmp/site-audit-2026-07-21/accepted-02-home-desktop-shop-menu.png)

3. **Home, mobile — Healthy responsive foundation.** No horizontal overflow; CTA, crop, and 44 px header controls remain usable. Performance and page length are the main limitations. Output: `accepted-03-home-mobile.png`.

   ![Mobile home](tmp/site-audit-2026-07-21/accepted-03-home-mobile.png)

4. **Mobile menu — Needs accessibility work.** The two-column category presentation is efficient, but the panel is not a semantically isolated dialog and background content remains visible. Output: `accepted-04-home-mobile-menu.png`.

   ![Mobile navigation menu](tmp/site-audit-2026-07-21/accepted-04-home-mobile-menu.png)

5. **Mobile search — Useful but incomplete.** Results are readable and relevant; the input lacks an accessible name and the overlay lacks dialog/focus semantics. Search ranking also overweights incidental description matches. Output: `accepted-05-home-mobile-search-results.png`.

   ![Mobile search results](tmp/site-audit-2026-07-21/accepted-05-home-mobile-search-results.png)

6. **Category, desktop and mobile — Healthy.** Strong hierarchy, product count, imagery, and responsive grid; all category images still load eagerly. Outputs: `accepted-06-category-desktop.png`, `accepted-07-category-mobile.png`.

   ![Desktop beverage category](tmp/site-audit-2026-07-21/accepted-06-category-desktop.png)

   ![Mobile beverage category](tmp/site-audit-2026-07-21/accepted-07-category-mobile.png)

7. **Product, desktop and mobile — Strong content, weak mobile first viewport.** Desktop balance is excellent. Mobile remains overflow-free, but the product name and decisive details sit too low; the image lightbox trigger is not keyboard semantic. Outputs: `accepted-08-product-desktop.png`, `accepted-09-product-mobile.png`.

   ![Desktop product detail](tmp/site-audit-2026-07-21/accepted-08-product-desktop.png)

   ![Mobile product detail](tmp/site-audit-2026-07-21/accepted-09-product-mobile.png)

8. **About, desktop and mobile — Strong storytelling, long pacing.** Editorial quality is high; the mobile page is nearly 9,800 px tall. Outputs: `accepted-10-about-desktop.png`, `accepted-11-about-mobile.png`.

   ![Desktop About page](tmp/site-audit-2026-07-21/accepted-10-about-desktop.png)

   ![Mobile About page](tmp/site-audit-2026-07-21/accepted-11-about-mobile.png)

9. **Sourcing journey reveal, mobile — Needs faster/accessible disclosure.** This captured early animation state demonstrates the large sparse interval before the map and pins finish revealing. The screenshot is intentionally timing-sensitive and does not imply the map never appears. Output: `accepted-12-about-mobile-sourcing-journey.png`.

   ![Mobile sourcing journey during reveal](tmp/site-audit-2026-07-21/accepted-12-about-mobile-sourcing-journey.png)

10. **Not found, mobile — Visually healthy, technically incorrect.** The page is branded and actionable, but production returns HTTP 200 instead of 404. Output: `accepted-13-not-found-mobile.png`.

    ![Mobile not-found page](tmp/site-audit-2026-07-21/accepted-13-not-found-mobile.png)

11. **Production parity, desktop — Healthy.** The deployed home view matches the local audited design. Output: `accepted-14-production-home-desktop.png`.

    ![Production desktop home](tmp/site-audit-2026-07-21/accepted-14-production-home-desktop.png)

## Method and limitations

- Reviewed React/Vite architecture, routing, CMS initialization, UI components, styles, dependencies, build configuration, assets, and deployment configuration.
- Validated live response codes, content types, cache policy, and selected security headers.
- Ran direct TypeScript and production builds, production dependency audit, asset-reference and duplicate checks, CMS relationship checks, Lighthouse mobile/desktop, keyboard tab sampling, responsive DOM measurements, and visual captures.
- Tested production and local responsive states in headless Chrome. The desktop Lighthouse artifact completed successfully, although Lighthouse reported a Windows temporary-directory cleanup error after writing the JSON; the report itself is valid and parseable.
- Did not test analytics correctness, real newsletter/email delivery (none is implemented), search-engine indexing consoles, a physical device matrix, or full assistive-technology combinations. These remain part of release validation.

## Bottom line

Tuscanini already looks like a premium brand. The next step is not a visual redesign; it is productionization. Fix the false conversion, make custom interactions semantic, reduce the home payload by an order of magnitude, and serve indexable routes with real HTTP behavior. Those changes will preserve the design while making the site faster, more trustworthy, more inclusive, and substantially easier to discover.
