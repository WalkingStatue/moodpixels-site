import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Check,
  Download,
  Fingerprint,
  Grid3x3,
  Heart,
  KeyRound,
  Moon,
  Palette,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  WifiOff,
} from 'lucide-react';
import { MoodFace, type EmotionName } from './moodface';
import { colorOf, demoMoods, MoodChip, PixelGrid } from './components';
import { androidPreview, supportEmail } from './site';
import { FAQ } from './content';

/** An interactive peek at the day sheet — the app's core interaction. */
function AppPreview() {
  const [selected, setSelected] = useState<number[]>([0, 1]);

  const toggle = (i: number) =>
    setSelected((current) =>
      current.includes(i) ? current.filter((n) => n !== i) : [...current, i].slice(-3),
    );

  const primary = selected[0];

  return (
    <div className="preview">
      <div className="preview-glow" aria-hidden="true" />

      <div className="phone">
        <div className="phone-screen">
          <div className="screen-head">
            <div>
              <p className="eyebrow">Your year</p>
              <h2>2026</h2>
            </div>
            <span className="streak">
              <Sparkles size={13} /> 12-day streak
            </span>
          </div>
          <div className="month-labels" aria-hidden="true">
            {'J F M A M J J A S O N D'.split(' ').map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
          {/* The real grid is 31 rows tall and scrolls in the app, so the frame
              crops it and fades the cut edge rather than squashing it. */}
          <div className="grid-viewport">
            <PixelGrid />
          </div>
        </div>
      </div>

      <div className="try-card">
        <div className="sheet-head">
          <div>
            <p className="eyebrow">Today</p>
            <h3>How did it feel?</h3>
          </div>
          <span className="sheet-hint">Tap to try</span>
        </div>
        <div className="mood-options" role="group" aria-label="Try logging a mood">
          {demoMoods.map((mood, i) => (
            <button
              key={mood.label}
              type="button"
              aria-pressed={selected.includes(i)}
              onClick={() => toggle(i)}
              className={selected.includes(i) ? 'mood-option selected' : 'mood-option'}
              style={selected.includes(i) ? { borderColor: colorOf(mood.emotion) } : undefined}
            >
              <MoodFace emotion={mood.emotion} size={36} />
              <span>{mood.label}</span>
            </button>
          ))}
        </div>
        <p className="sheet-status" role="status">
          {selected.length === 0 || primary === undefined ? (
            'Pick as many as fit. A day rarely holds just one feeling.'
          ) : (
            <>
              <span className="dot" style={{ background: colorOf(demoMoods[primary].emotion) }} />
              {selected.length === 1
                ? `${demoMoods[primary].label} — that colors your day.`
                : `${demoMoods[primary].label} leads, ${selected.length - 1} more logged.`}
            </>
          )}
        </p>
      </div>

      <p className="preview-caption">An interactive peek. Nothing here is saved.</p>
    </div>
  );
}

const FEATURES = [
  {
    icon: Grid3x3,
    title: 'A year that fills with color',
    body: 'Every day is one pixel in a 31×12 grid. Log more than one mood and the cell splits diagonally, so a complicated day still reads as one.',
  },
  {
    icon: Palette,
    title: 'Moods that actually fit',
    body: '26 built-in feelings, each with its own expressive face — from Excited to Apathetic to Feeling Guilty. Rename them, recolor them, add your own, or archive the ones you never reach for.',
  },
  {
    icon: BarChart3,
    title: 'Patterns worth noticing',
    body: 'Mood frequency, logging streaks, a trend line over time, weekday patterns, and a month-by-month summary. Descriptive, never diagnostic.',
  },
  {
    icon: Search,
    title: 'Notes you can find again',
    body: 'Add a note to any day, then search across everything you have written to find the day you are thinking of.',
  },
  {
    icon: Bell,
    title: 'One gentle reminder',
    body: 'An optional daily nudge at a time you choose. Off by default, and scheduled entirely on your device.',
  },
  {
    icon: Moon,
    title: 'Light, dark, and yours',
    body: 'Follow your system theme or pick a side. The accent color is drawn from the face you choose for your profile.',
  },
];

const PRIVACY_POINTS = [
  {
    icon: WifiOff,
    title: 'No servers, so no network calls',
    body: 'The app makes no requests to any backend of ours, because there is no backend of ours. Logging, notes, stats, and history all work in airplane mode.',
  },
  {
    icon: ShieldCheck,
    title: 'No accounts, ads, or analytics',
    body: 'Nothing to sign up for, and no analytics SDK counting your taps. There is no profile of you to sell, leak, or hand over.',
  },
  {
    icon: KeyRound,
    title: 'Backups you actually control',
    body: 'Export your journal as JSON and choose where it goes. Add a passphrase and the file is encrypted with AES-256 and PBKDF2-SHA256 at 100,000 iterations before it ever leaves the app.',
  },
  {
    icon: Fingerprint,
    title: 'Lock it behind your fingerprint',
    body: 'An optional biometric lock, handled by Android itself. It is smart enough not to challenge you again when you return from the share sheet.',
  },
];

const STEPS = [
  {
    title: 'Tap the day',
    body: 'Open today — or any day you missed — and pick the feelings that fit. The first one you choose is the one that colors the grid.',
  },
  {
    title: 'Add a little context',
    body: 'A sentence about what happened, or nothing at all. The color on its own is already a complete entry.',
  },
  {
    title: 'Watch the year assemble',
    body: 'Zoom out after a few weeks. The grid turns days you would never have remembered into something you can actually read.',
  },
];


const SHOWCASE: EmotionName[] = [
  'excited',
  'happy',
  'good',
  'calm',
  'normal',
  'frisky',
  'sleepy',
  'lowEnergy',
  'anxious',
  'grumpy',
  'sad',
  'inLove',
];

export function Home() {
  return (
    <main id="main-content">
      <section className="hero">
        <div className="shell hero-inner">
          <div className="hero-copy">
            <p className="pill">
              <span className="tiny-pixel" aria-hidden="true" /> Android preview · free
            </p>
            <h1>
              Every day gets <span className="underlined">a color</span>.
            </h1>
            <p className="lede">
              MoodPixels turns a year of feelings into one grid you can read at a glance. It works offline,
              asks for no account, and keeps every entry on your phone.
            </p>
            <div className="hero-actions">
              <a className="button" href={androidPreview} target="_blank" rel="noreferrer">
                <Smartphone size={18} /> Join the Android preview
              </a>
              <a className="text-link" href="#how-it-works">
                See how it works <ArrowDown size={16} />
              </a>
            </div>
            <ul className="hero-checks">
              <li>
                <Check size={15} /> No account
              </li>
              <li>
                <Check size={15} /> Works offline
              </li>
              <li>
                <Check size={15} /> No ads or trackers
              </li>
            </ul>
          </div>
          <AppPreview />
        </div>
      </section>

      <div className="marquee">
        <div className="shell">
          <span>
            <WifiOff size={17} /> Offline by default
          </span>
          <span>
            <Fingerprint size={17} /> Biometric lock
          </span>
          <span>
            <Download size={17} /> Encrypted backups
          </span>
          <span>
            <Heart size={17} /> No perfect days required
          </span>
        </div>
      </div>

      <section id="features" className="section shell">
        <div className="section-head">
          <p className="eyebrow">What you get</p>
          <h2>Small enough to keep up with. Deep enough to be worth it.</h2>
          <p>
            One tap is a complete entry. Everything else — notes, custom moods, stats, backups — is there
            when you want it and invisible when you don’t.
          </p>
        </div>
        <div className="feature-grid">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="feature-card">
              <span className="feature-icon">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="faces-showcase">
          <p className="eyebrow">A face for every feeling</p>
          <div className="faces-row">
            {SHOWCASE.map((emotion) => (
              <MoodFace key={emotion} emotion={emotion} size={54} />
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section steps-section">
        <div className="shell steps-layout">
          <div className="steps-intro">
            <p className="eyebrow">How it works</p>
            <h2>Thirty seconds a day.</h2>
            <p>
              You don’t need the right words, and you don’t need a good day. You only need to answer one
              question honestly.
            </p>
            <div className="steps-moods">
              <MoodChip emotion="happy" label="Happy" />
              <MoodChip emotion="sleepy" label="Sleepy" />
              <MoodChip emotion="anxious" label="Anxious" />
            </div>
          </div>
          <ol className="steps">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="step-number">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="privacy" className="section privacy-section">
        <div className="shell">
          <div className="section-head">
            <p className="eyebrow">Privacy</p>
            <h2>Your feelings are not a data point.</h2>
            <p>
              Most mood trackers are a database with a journal on top. MoodPixels is a journal with no
              database anywhere but your phone. That is a design decision, and these are its consequences.
            </p>
          </div>
          <div className="privacy-grid">
            {PRIVACY_POINTS.map(({ icon: Icon, title, body }) => (
              <article key={title} className="privacy-card">
                <span className="privacy-icon">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <a className="text-link" href="/privacy/">
            Read the full privacy policy <ArrowRight size={17} />
          </a>
        </div>
      </section>

      <section id="faq" className="section shell faq-section">
        <div className="faq-intro">
          <p className="eyebrow">FAQ</p>
          <h2>Questions, answered plainly.</h2>
          <p>
            Something still unclear?{' '}
            <a className="inline-link" href="/support/">
              Support is a real inbox <ArrowUpRight size={14} />
            </a>
          </p>
        </div>
        <div className="faq-list">
          {FAQ.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span aria-hidden="true" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="shell">
          <div className="cta-pixels" aria-hidden="true">
            {demoMoods.map((m) => (
              <span key={m.label} style={{ background: colorOf(m.emotion) }} />
            ))}
          </div>
          <h2>Start with today.</h2>
          <p>
            The preview is free and open to testers now. Join through Firebase App Distribution and new
            builds arrive as they ship.
          </p>
          <a className="button button-large" href={androidPreview} target="_blank" rel="noreferrer">
            <Smartphone size={19} /> Join the Android preview <ArrowUpRight size={18} />
          </a>
          <p className="cta-fine">
            Android only · adults 18+ · questions to <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
          </p>
        </div>
      </section>
    </main>
  );
}
