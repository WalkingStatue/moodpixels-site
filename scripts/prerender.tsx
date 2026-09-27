/**
 * Static pre-rendering.
 *
 * Vite emits a single `dist/index.html` shell. This runs after it, renders each
 * route to HTML with React, and writes a real file per URL — so every page
 * arrives with its content and its own metadata, works without JavaScript, and
 * is indexable. `src/main.tsx` hydrates the markup rather than replacing it.
 *
 * Also emits `sitemap.xml`, `site.webmanifest`, and a `404.html` that GitHub
 * Pages serves for unknown paths.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { StrictMode } from 'react';
import { App } from '../src/App';
import {
  androidPreview,
  googleSiteVerification,
  origin,
  owner,
  pages,
  type PageId,
} from '../src/site';
import { FAQ } from '../src/content';

const DIST = 'dist';

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Structured data, so search results describe the app rather than guess at it.
 *
 * Returns a @graph of several linked nodes rather than one object: the home
 * page declares the app, the website, and its FAQ (which Google can render as
 * expandable rich results), while inner pages declare themselves plus a
 * breadcrumb trail back to the root.
 */
function jsonLd(page: PageId) {
  const publisher = { '@type': 'Person', '@id': `${origin}#person`, name: owner, url: origin };
  const website = {
    '@type': 'WebSite',
    '@id': `${origin}#website`,
    name: 'MoodPixels',
    url: origin,
    inLanguage: 'en',
    publisher: { '@id': `${origin}#person` },
  };

  if (page === 'home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        publisher,
        website,
        {
          '@type': 'SoftwareApplication',
          '@id': `${origin}#app`,
          name: 'MoodPixels',
          applicationCategory: 'LifestyleApplication',
          applicationSubCategory: 'Mood journal',
          operatingSystem: 'Android',
          description: pages.home.description,
          url: origin,
          downloadUrl: androidPreview,
          softwareVersion: 'Preview',
          isAccessibleForFree: true,
          author: { '@id': `${origin}#person` },
          publisher: { '@id': `${origin}#person` },
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
          '@type': 'FAQPage',
          '@id': `${origin}#faq`,
          mainEntity: FAQ.map(([question, answer]) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          })),
        },
      ],
    };
  }

  const meta = pages[page];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      publisher,
      website,
      {
        '@type': 'WebPage',
        '@id': `${origin}${meta.path}#page`,
        name: meta.title,
        description: meta.description,
        url: `${origin}${meta.path}`,
        inLanguage: 'en',
        isPartOf: { '@id': `${origin}#website` },
        publisher: { '@id': `${origin}#person` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
          { '@type': 'ListItem', position: 2, name: meta.title.split(' — ')[0], item: `${origin}${meta.path}` },
        ],
      },
    ],
  };
}

function head(page: PageId) {
  const meta = pages[page];
  const canonical = `${origin}${meta.path}`;
  const image = `${origin}/og-image.png`;

  const tags = [
    `<meta name="description" content="${escape(meta.description)}" />`,
    googleSiteVerification
      ? `<meta name="google-site-verification" content="${escape(googleSiteVerification)}" />`
      : '',
    meta.indexed
      ? `<link rel="canonical" href="${canonical}" />`
      : '<meta name="robots" content="noindex, follow" />',
    // Lets Google use a full-size image thumbnail and an untruncated snippet.
    // Without this, rich results fall back to a small preview.
    meta.indexed
      ? '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />'
      : '',
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="en" />',
    '<meta property="og:site_name" content="MoodPixels" />',
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escape(meta.title)}" />`,
    `<meta name="twitter:description" content="${escape(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    // `<` is escaped so a stray "</script>" in content can never close the tag early.
    `<script type="application/ld+json">${JSON.stringify(jsonLd(page)).replace(/</g, '\\u003c')}</script>`,
  ];

  return tags.filter(Boolean).join('\n    ');
}

const shell = await readFile(`${DIST}/index.html`, 'utf8');

for (const [id, meta] of Object.entries(pages) as [PageId, (typeof pages)[PageId]][]) {
  const markup = renderToString(
    <StrictMode>
      <App page={id} />
    </StrictMode>,
  );

  const html = shell
    .replace('<!-- page-meta -->', head(id))
    .replace(/<title>.*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);

  // '/' -> dist/index.html, '/privacy/' -> dist/privacy/index.html, '/404.html' -> dist/404.html
  const file = meta.path.endsWith('.html')
    ? `${DIST}${meta.path}`
    : `${DIST}${meta.path}index.html`;

  await mkdir(file.slice(0, file.lastIndexOf('/')), { recursive: true });
  await writeFile(file, html, 'utf8');
  console.log(`prerender: ${meta.path} -> ${file}`);
}

const indexed = Object.values(pages).filter((p) => p.indexed);
const today = new Date().toISOString().slice(0, 10);

await writeFile(
  `${DIST}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexed
  .map(
    (p) =>
      `  <url><loc>${origin}${p.path}</loc><lastmod>${today}</lastmod><priority>${
        p.path === '/' ? '1.0' : '0.7'
      }</priority></url>`,
  )
  .join('\n')}
</urlset>
`,
  'utf8',
);

await writeFile(
  `${DIST}/site.webmanifest`,
  JSON.stringify(
    {
      name: 'MoodPixels',
      short_name: 'MoodPixels',
      description: pages.home.description,
      start_url: '/',
      display: 'browser',
      background_color: '#F9F6F0',
      theme_color: '#F9F6F0',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  ),
  'utf8',
);

console.log(`prerender: wrote sitemap.xml (${indexed.length} urls) and site.webmanifest`);
