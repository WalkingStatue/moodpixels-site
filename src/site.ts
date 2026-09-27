/** Shared site constants, route table and page metadata. */

export const supportEmail = 'support@dhruvsaija.in';
export const contact = `mailto:${supportEmail}`;

/** Firebase App Distribution — Android early-preview tester invite. */
export const androidPreview = 'https://appdistribution.firebase.dev/i/7aeeb31e55ee35fd';

export const origin = 'https://moodpixels.dhruvsaija.in';

/**
 * Google Search Console verification token.
 *
 * In Search Console, add `moodpixels.dhruvsaija.in` as a URL-prefix property,
 * choose the "HTML tag" method, and paste ONLY the `content="…"` value here —
 * not the whole tag. The prerenderer then emits it on every page. Leave it
 * empty and no tag is emitted.
 *
 * A DNS TXT record on dhruvsaija.in works too and verifies the whole domain;
 * if you use that, this can stay empty.
 */
export const googleSiteVerification = '';
export const owner = 'Dhruv Saija';
export const jurisdiction = 'Gujarat, India';
export const lastUpdated = '27 September 2026';

/**
 * Fixed rather than `new Date().getFullYear()`. The footer is server-rendered at
 * build time, so a live call would mismatch the prerendered markup during
 * hydration once the year rolls over.
 */
export const copyrightYear = 2026;

export type PageId = 'home' | 'privacy' | 'terms' | 'support' | 'notFound';

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  /** Excluded from the sitemap when false. */
  indexed: boolean;
};

export const pages: Record<PageId, PageMeta> = {
  home: {
    path: '/',
    title: 'MoodPixels — A little space for how you feel',
    description:
      'A private, offline mood journal for Android. Log how your day felt, watch a year fill with color, and keep every entry on your own device. No account, no cloud, no ads.',
    indexed: true,
  },
  privacy: {
    path: '/privacy/',
    title: 'Privacy Policy — MoodPixels',
    description:
      'How MoodPixels handles your journal: stored on your device, with no account, no cloud sync, no advertising and no analytics.',
    indexed: true,
  },
  terms: {
    path: '/terms/',
    title: 'Terms of Use — MoodPixels',
    description:
      'The terms that govern your use of MoodPixels, a personal mood-journaling app for adults aged 18 and over.',
    indexed: true,
  },
  support: {
    path: '/support/',
    title: 'Support — MoodPixels',
    description:
      'Get help with MoodPixels: join the Android preview, move your journal to a new phone, fix reminders, or reach a human.',
    indexed: true,
  },
  notFound: {
    path: '/404.html',
    title: 'Page not found — MoodPixels',
    description: 'That page has wandered off.',
    indexed: false,
  },
};

/** Maps a URL pathname onto a page id. Trailing slashes and `index.html` are tolerated. */
export function resolvePage(pathname: string): PageId {
  const path = pathname.replace(/index\.html$/, '').replace(/\/*$/, '/');
  if (path === '/') return 'home';
  if (path === '/privacy/') return 'privacy';
  if (path === '/terms/') return 'terms';
  if (path === '/support/') return 'support';
  return 'notFound';
}
