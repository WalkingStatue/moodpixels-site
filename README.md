# MoodPixels public site

The public site for [moodpixels.dhruvsaija.in](https://moodpixels.dhruvsaija.in) — landing page,
Privacy Policy, Terms of Use, and Support.

React 19 + TypeScript + Tailwind v4, built with Vite and **prerendered to static HTML**, then
served by GitHub Pages.

## Commands

| Command                  | What it does                                                  |
| ------------------------ | ------------------------------------------------------------- |
| `npm run dev`            | Vite dev server                                               |
| `npm run build`          | Typecheck → bundle → prerender every route into `dist/`       |
| `npm run preview`        | Serve the built `dist/` exactly as Pages will                 |
| `npm test`               | Playwright suite against the built output                     |
| `npm run typecheck`      | `tsc --noEmit`                                                |
| `npm run icons`          | Regenerate icon assets from the app's artwork                 |
| `npm run sync:moodface`  | Re-copy the mood-face components from the app repo            |

## How it's put together

- **`src/site.ts`** is the single source of routes, page metadata, and the
  Firebase App Distribution preview link. Adding a page means adding it here;
  the router, prerenderer, and sitemap all read from it.
- **`scripts/prerender.tsx`** runs after `vite build`. It renders each route with
  `renderToString` and writes a real file per URL (`dist/privacy/index.html`, and
  so on), injecting that page's title, description, canonical, Open Graph tags,
  and JSON-LD. `src/main.tsx` then *hydrates* that markup rather than replacing it.
  Every page therefore works with JavaScript disabled and is independently indexable.
- **`dist/404.html`** is what Pages serves for unknown paths.

### The mood faces are the app's, not a copy

`src/moodface/` is a verbatim port of `components/MoodFace/` from the app repo, plus
`lib/color.ts`. The site renders the **real** faces and the **real** emotion palette,
so marketing can't drift from the product.

The only adaptation is `src/moodface/svg.tsx`, a hand-written shim mapping
`react-native-svg`'s element names onto the equivalent DOM tags. Everything else is
untouched, and `npm run sync:moodface` re-copies it after the app's artwork changes.
That script rewrites only the import specifiers; it never overwrites the shim.

Likewise `npm run icons` regenerates `public/` from the app's 1024px master icons —
they are ~850KB each, so they are downscaled and re-encoded (the hero mark ends up
around 16KB as WebP) rather than shipped raw.

### Theming

Light and dark, mirroring the app's Appearance setting: follow the system, or pin one.
The choice is stored in `localStorage` and applied as `data-theme` on `<html>`, with an
inline script in `index.html` running before first paint so there is no flash.

Colour tokens in `src/styles.css` are the app's own palette from its `lib/theme.ts`.
Dark values are defined for *both* `prefers-color-scheme` (guarded by
`:root:not([data-theme='light'])`) and `[data-theme='dark']`, so the system preference
and an explicit choice can never disagree.

## Deployment

`.github/workflows/deploy.yml` builds, runs the Playwright suite, and only then uploads
`dist/` to Pages. Pull requests run the same build and tests without deploying.

In **Settings → Pages**, the publishing source must be **GitHub Actions**, with the
custom domain set to `moodpixels.dhruvsaija.in`. `public/CNAME` is copied into `dist/`
on every build and must stay in place.

### DNS (GoDaddy)

1. **Domain Portfolio → dhruvsaija.in → DNS**.
2. Add a `CNAME` record: name `moodpixels`, value `walkingstatue.github.io`, default TTL.
3. Do not use a wildcard record such as `*.dhruvsaija.in`.
4. Back in GitHub Pages, wait for DNS verification, then enable **Enforce HTTPS**.

DNS usually propagates within an hour but can take up to 48. `support@dhruvsaija.in`
must exist or forward before launch — it is the public legal and support contact named
throughout the site.

## Getting found by Google

The technical groundwork is in the build already: prerendered HTML per route, one
canonical per page, unique titles and descriptions, Open Graph and Twitter cards,
`sitemap.xml`, `robots.txt`, and JSON-LD (`SoftwareApplication` + `FAQPage` on the
home page, `WebPage` + `BreadcrumbList` on the rest).

What is **not** automatic, in the order it has to happen:

1. **Deploy.** Merge to `main` so Pages serves `dist/`. Until then the live site is
   the old static one, with no `sitemap.xml` and no `robots.txt`.
2. **Enable HTTPS.** In **Settings → Pages**, wait for the custom domain to verify,
   then tick **Enforce HTTPS**. Google treats `http://` and `https://` as different
   sites and demotes pages served without TLS. If the certificate does not appear,
   remove the custom domain, save, re-add it, and save again — that re-triggers
   provisioning.
3. **Verify in Google Search Console.** Add `moodpixels.dhruvsaija.in` as a
   URL-prefix property, pick the *HTML tag* method, and paste the token into
   `googleSiteVerification` in `src/site.ts`. (A DNS TXT record on `dhruvsaija.in`
   verifies the whole domain instead and needs no code change.)
4. **Submit the sitemap** at `https://moodpixels.dhruvsaija.in/sitemap.xml`, then use
   **URL Inspection → Request indexing** on the home page to skip the queue.
5. **Get one real inbound link.** Google finds new sites mainly by following links.
   A link from the app's GitHub repo, your own site, or a Product Hunt / Reddit post
   does more for a brand-new domain than any tag in this repo.

Indexing takes days to a few weeks for a new domain; there is no way to buy it down.
Check progress under **Pages → Indexing** in Search Console rather than by searching
Google directly, which is not a reliable indicator.

Validate the structured data with the
[Rich Results Test](https://search.google.com/test/rich-results) after deploying —
the FAQ block is eligible for expandable results.

## Editing the legal pages

Privacy, Terms, and Support live in `src/Legal.tsx`. When you change them, update
`lastUpdated` in `src/site.ts` — it is rendered at the top of all three.

Claims on these pages are deliberately specific about what the app does (no network
calls, PBKDF2-SHA256 at 100,000 iterations, AES-256-CBC with an HMAC tag, and so on).
Check any change against the app's actual behaviour before publishing it.
