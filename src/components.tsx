import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, Monitor, Moon, Sun, X } from 'lucide-react';
import { MoodFace, moodColors, type EmotionName } from './moodface';
import { androidPreview, copyrightYear } from './site';
import { apply, SCHEMES, type Scheme, stored } from './theme';

/**
 * A slice of the app's built-in mood set (`db/defaultMoods.ts`), kept in the
 * order the day sheet uses. Colors are NOT specified here — they resolve from
 * the app's own emotion palette, so the site can never drift from the product.
 */
export const demoMoods: { label: string; emotion: EmotionName }[] = [
  { label: 'Happy', emotion: 'happy' },
  { label: 'Calm', emotion: 'calm' },
  { label: 'Good', emotion: 'good' },
  { label: 'Sleepy', emotion: 'sleepy' },
  { label: 'Anxious', emotion: 'anxious' },
  { label: 'Sad', emotion: 'sad' },
];

export const colorOf = (emotion: EmotionName) => moodColors[emotion];

/**
 * Both official app icons ship in the markup and CSS reveals the right one.
 * Swapping the `src` in JS would flash the wrong mark on a prerendered page,
 * and `<picture media=…>` can't see a pinned `data-theme`.
 */
export function Brand({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <a className="brand" href="/" aria-label="MoodPixels home">
      <span className="brand-mark">
        <picture className="brand-light">
          <source srcSet="/moodpixels-icon-128.webp" type="image/webp" />
          <img src="/moodpixels-icon-128.png" alt="" width={34} height={34} decoding="async" />
        </picture>
        <picture className="brand-dark">
          <source srcSet="/moodpixels-icon-dark-128.webp" type="image/webp" />
          <img src="/moodpixels-icon-dark-128.png" alt="" width={34} height={34} decoding="async" />
        </picture>
      </span>
      {withWordmark ? <span>MoodPixels</span> : null}
    </a>
  );
}

const SCHEME_META: Record<Scheme, { icon: typeof Sun; label: string }> = {
  system: { icon: Monitor, label: 'Theme: follow system' },
  light: { icon: Sun, label: 'Theme: light' },
  dark: { icon: Moon, label: 'Theme: dark' },
};

/**
 * Cycles system → light → dark.
 *
 * Renders the 'system' icon on the server and corrects itself after mount:
 * the real preference lives in localStorage, which prerendering cannot see, so
 * reading it during render would mismatch during hydration.
 */
export function ThemeToggle() {
  const [scheme, setScheme] = useState<Scheme>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setScheme(stored());
    setReady(true);
  }, []);

  const next = () => {
    const value = SCHEMES[(SCHEMES.indexOf(scheme) + 1) % SCHEMES.length];
    setScheme(value);
    apply(value);
  };

  const { icon: Icon, label } = SCHEME_META[scheme];
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={next}
      aria-label={`${label}. Activate to change.`}
      title={label}
      suppressHydrationWarning
    >
      <Icon size={18} aria-hidden="true" />
      <span className="theme-toggle-text">{ready ? scheme : 'system'}</span>
    </button>
  );
}

const NAV = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#privacy', label: 'Privacy' },
  { href: '#faq', label: 'FAQ' },
];

export function Header({ home }: { home: boolean }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const prefix = home ? '' : '/';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Brand />
        <nav
          id="main-nav"
          className={open ? 'main-nav is-open' : 'main-nav'}
          aria-label="Main"
          onClick={() => setOpen(false)}
        >
          {NAV.map((item) => (
            <a key={item.href} href={`${prefix}${item.href}`}>
              {item.label}
            </a>
          ))}
          <a className="button button-small" href={androidPreview} target="_blank" rel="noreferrer">
            Get the preview <ArrowUpRight size={15} />
          </a>
        </nav>
        <div className="header-controls">
          <ThemeToggle />
          <button
            ref={toggle}
            className="menu-toggle"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand />
            <p>A private mood journal for Android. Your days, your colors, your device.</p>
          </div>
          <nav aria-label="Footer">
            <span className="footer-heading">Product</span>
            <a href="/#features">Features</a>
            <a href="/#how-it-works">How it works</a>
            <a href={androidPreview} target="_blank" rel="noreferrer">
              Android preview
            </a>
          </nav>
          <nav aria-label="Legal and support">
            <span className="footer-heading">More</span>
            <a href="/privacy/">Privacy Policy</a>
            <a href="/terms/">Terms of Use</a>
            <a href="/support/">Support</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {copyrightYear} Dhruv Saija</span>
          <span className="footer-note">
            <span className="tiny-pixel" aria-hidden="true" /> No accounts. No trackers. No cloud journal.
          </span>
        </div>
      </div>
    </footer>
  );
}

/**
 * A deterministic year-in-pixels grid.
 *
 * Mirrors the app's layout: one column per month, one cell per day. The
 * pattern is generated from a fixed seed so server-rendered and hydrated
 * markup agree — a random fill would mismatch on hydration.
 */
export function PixelGrid({ months = 12, days = 31 }: { months?: number; days?: number }) {
  const palette = demoMoods.map((m) => colorOf(m.emotion));
  return (
    <div className="pixel-grid" style={{ gridTemplateColumns: `repeat(${months}, 1fr)` }} aria-hidden="true">
      {Array.from({ length: months * days }, (_, i) => {
        const month = i % months;
        const day = Math.floor(i / months);
        // Deterministic pseudo-noise: cheap, stable, and visually irregular.
        const n = (month * 7 + day * 13 + ((month * day) % 5) * 3) % 11;
        const empty = n > 7 || (month === months - 1 && day > 18);
        return (
          <span
            key={i}
            className={empty ? 'cell empty' : 'cell'}
            style={empty ? undefined : { background: palette[n % palette.length] }}
          />
        );
      })}
    </div>
  );
}

export function MoodChip({ emotion, label, size = 24 }: { emotion: EmotionName; label: string; size?: number }) {
  return (
    <span className="mood-chip">
      <MoodFace emotion={emotion} size={size} />
      {label}
    </span>
  );
}
