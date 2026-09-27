import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/privacy/', '/terms/', '/support/'] as const;

test.describe('pages', () => {
  for (const path of ROUTES) {
    test(`${path} renders with a unique title, description and canonical`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      await expect(page).toHaveTitle(/MoodPixels/);
      await expect(page.locator('meta[name="description"]')).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://moodpixels.dhruvsaija.in${path}`,
      );
      await expect(page.locator('main#main-content')).toBeVisible();
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }

  test('unknown paths get the 404 page, excluded from indexing', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('wandered off');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
});

test.describe('content is server-rendered', () => {
  test('page HTML contains real content before JavaScript runs', async ({ browser }) => {
    // A context with JS disabled proves the markup — not hydration — carries the page.
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /join the android preview/i }).first()).toBeVisible();

    await page.goto('/privacy/');
    await expect(page.getByRole('heading', { name: 'Backups you create' })).toBeVisible();
    await expect(page.getByText(/never stored, never transmitted/i)).toBeVisible();

    await context.close();
  });
});

test.describe('the preview call to action', () => {
  test('points at Firebase App Distribution and opens safely', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /join the android preview/i }).first();

    await expect(cta).toHaveAttribute(
      'href',
      'https://appdistribution.firebase.dev/i/7aeeb31e55ee35fd',
    );
    await expect(cta).toHaveAttribute('rel', /noreferrer/);
    await expect(cta).toHaveAttribute('target', '_blank');
  });
});

test.describe('the mood demo', () => {
  test('toggles moods and reports the primary one', async ({ page }) => {
    await page.goto('/');
    const group = page.getByRole('group', { name: /try logging a mood/i });
    const happy = group.getByRole('button', { name: 'Happy' });
    const sad = group.getByRole('button', { name: 'Sad' });

    await expect(happy).toHaveAttribute('aria-pressed', 'true');

    await happy.click();
    await expect(happy).toHaveAttribute('aria-pressed', 'false');

    await sad.click();
    await expect(sad).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('status')).toContainText(/Calm|Sad/);
  });
});

test.describe('navigation', () => {
  test('footer links reach every legal page', async ({ page }) => {
    await page.goto('/');
    for (const [name, path] of [
      ['Privacy Policy', '/privacy/'],
      ['Terms of Use', '/terms/'],
      ['Support', '/support/'],
    ] as const) {
      await page.goto('/');
      await page.getByRole('contentinfo').getByRole('link', { name, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    }
  });

  test('the mobile menu opens, closes on Escape and returns focus', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'The toggle is only rendered at narrow widths.');

    await page.goto('/');
    const toggle = page.getByRole('button', { name: /open navigation/i });
    await toggle.click();
    await expect(page.locator('#main-nav')).toHaveClass(/is-open/);

    await page.keyboard.press('Escape');
    await expect(page.locator('#main-nav')).not.toHaveClass(/is-open/);
    await expect(toggle).toBeFocused();
  });
});

test.describe('theme', () => {
  test('defaults to following the system, in both directions', async ({ browser }) => {
    for (const scheme of ['light', 'dark'] as const) {
      const context = await browser.newContext({ colorScheme: scheme });
      const page = await context.newPage();
      await page.goto('/');

      // No explicit choice yet, so nothing is pinned and CSS follows the system.
      await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.*/);
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(bg).toBe(scheme === 'dark' ? 'rgb(12, 12, 14)' : 'rgb(249, 246, 240)');

      await context.close();
    }
  });

  test('cycles system → light → dark and persists the choice', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /^Theme:/ });

    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await page.evaluate(() => localStorage.getItem('moodpixels-theme'))).toBe('dark');

    // The inline head script must re-apply it before paint on the next page.
    await page.goto('/privacy/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Back to 'system' clears the pin rather than storing a third value.
    await toggle.click();
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.*/);
    expect(await page.evaluate(() => localStorage.getItem('moodpixels-theme'))).toBeNull();
  });

  test('a pinned light theme survives a dark system preference', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    await page.goto('/');

    await page.getByRole('button', { name: /^Theme:/ }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(249, 246, 240)');

    await context.close();
  });
});

test.describe('accessibility basics', () => {
  test('the skip link is the first focusable element and targets main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: /skip to content/i });
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute('href', '#main-content');
  });

  test('every image has an alt attribute', async ({ page }) => {
    await page.goto('/');
    for (const img of await page.locator('img').all()) {
      expect(await img.getAttribute('alt')).not.toBeNull();
    }
  });

  test('legal pages expose an in-page table of contents', async ({ page }) => {
    await page.goto('/privacy/');
    const toc = page.getByRole('navigation', { name: /on this page/i });
    await expect(toc.getByRole('link').first()).toBeVisible();
  });
});

test.describe('crawlability', () => {
  test('sitemap lists the indexable pages and robots points at it', async ({ request }) => {
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    for (const path of ROUTES) {
      expect(xml).toContain(`https://moodpixels.dhruvsaija.in${path}</loc>`);
    }

    const robots = await request.get('/robots.txt');
    expect(await robots.text()).toContain('sitemap.xml');
  });

  test('the home page carries app and FAQ structured data', async ({ page }) => {
    await page.goto('/');
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const graph = JSON.parse(raw ?? '{}')['@graph'] as { '@type': string; [k: string]: unknown }[];

    const app = graph.find((n) => n['@type'] === 'SoftwareApplication');
    expect(app?.operatingSystem).toBe('Android');
    expect((app?.offers as { price: string }).price).toBe('0');

    // FAQ entries must match the visible accordion, or Google treats it as spam.
    const faq = graph.find((n) => n['@type'] === 'FAQPage');
    const questions = (faq?.mainEntity as { name: string }[]).map((q) => q.name);
    expect(questions.length).toBeGreaterThan(4);
    for (const q of questions) {
      await expect(page.getByRole('group').filter({ hasText: q }).first()).toBeAttached();
    }
  });

  test('inner pages carry a breadcrumb trail', async ({ page }) => {
    await page.goto('/privacy/');
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const graph = JSON.parse(raw ?? '{}')['@graph'] as { '@type': string; [k: string]: unknown }[];

    const crumbs = graph.find((n) => n['@type'] === 'BreadcrumbList');
    const items = crumbs?.itemListElement as { name: string; item: string }[];
    expect(items.map((i) => i.name)).toEqual(['Home', 'Privacy Policy']);
  });

  test('indexable pages allow large image previews; the 404 does not index', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /max-image-preview:large/,
    );

    await page.goto('/404.html');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
});
