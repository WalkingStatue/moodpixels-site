import type { EmotionName, EmotionConfig } from './types';

/**
 * Maps every emotion to a combination of facial parts.
 *
 * Rule: no two emotions may share the same (eyes, eyebrows, mouth) triple.
 * Where two states are genuinely adjacent (good vs. happy, sad vs. lonely)
 * they are separated by lid shape and brow ANGLE first, and by a `details`
 * marker second — those are the two things still readable at 24dp.
 *
 * To add an emotion: extend EmotionName in types.ts, pick parts here, and add
 * a color in moodColors.ts.
 */
export const emotionMap: Record<EmotionName, EmotionConfig> = {
  // ── Neutral / baseline ──────────────────────────────────────────────
  normal: {
    eyes: 'normal',
    eyebrows: 'normal',
    mouth: 'neutral',
  },
  apathetic: {
    eyes: 'halfLidded',
    eyebrows: 'relaxed',
    mouth: 'flat',
  },
  confident: {
    eyes: 'squint',
    eyebrows: 'oneRaised',
    mouth: 'smirk',
  },

  // ── Positive ────────────────────────────────────────────────────────
  good: {
    eyes: 'normal',
    eyebrows: 'raised',
    mouth: 'slightSmile',
  },
  happy: {
    eyes: 'happy',
    eyebrows: 'raised',
    mouth: 'smile',
  },
  excited: {
    eyes: 'star',
    eyebrows: 'surprised',
    mouth: 'grin',
    details: ['stars'],
  },
  energetic: {
    eyes: 'excited',
    eyebrows: 'raised',
    mouth: 'openSmile',
    details: ['cheekMarks'],
  },
  dynamic: {
    eyes: 'sparkle',
    eyebrows: 'normal',
    mouth: 'grin',
  },
  calm: {
    eyes: 'closed',
    eyebrows: 'relaxed',
    mouth: 'slightSmile',
  },
  frisky: {
    eyes: 'squint',
    eyebrows: 'raised',
    mouth: 'tongue',
  },
  assertive: {
    eyes: 'normal',
    eyebrows: 'angry',
    mouth: 'flat',
  },

  // ── Affection ───────────────────────────────────────────────────────
  inLove: {
    eyes: 'happy',
    eyebrows: 'none',
    mouth: 'smile',
    details: ['hearts', 'blush'],
  },
  flirtatious: {
    eyes: 'sideGlance',
    eyebrows: 'oneRaised',
    mouth: 'smirk',
    details: ['hearts'],
  },
  bashful: {
    eyes: 'squint',
    eyebrows: 'worried',
    mouth: 'nervous',
    details: ['blush'],
  },

  // ── Low energy ──────────────────────────────────────────────────────
  sleepy: {
    eyes: 'sleepy',
    eyebrows: 'relaxed',
    mouth: 'neutral',
    details: ['zzz'],
  },
  exhausted: {
    eyes: 'sleepy',
    eyebrows: 'sad',
    mouth: 'sad',
    details: ['sweat'],
  },
  lowEnergy: {
    eyes: 'dizzy',
    eyebrows: 'sad',
    mouth: 'flat',
    details: ['spiral'],
  },

  // ── Unsettled ───────────────────────────────────────────────────────
  changeable: {
    eyes: 'confused',
    eyebrows: 'oneRaised',
    mouth: 'worried',
    details: ['spiral'],
  },
  anxious: {
    eyes: 'worried',
    eyebrows: 'worried',
    mouth: 'nervous',
    details: ['sweat'],
  },
  ashamed: {
    eyes: 'closed',
    eyebrows: 'sad',
    mouth: 'sad',
    details: ['blush'],
  },
  guilty: {
    eyes: 'sideGlance',
    eyebrows: 'worried',
    mouth: 'gritted',
    details: ['sweat'],
  },

  // ── Anger ───────────────────────────────────────────────────────────
  grumpy: {
    eyes: 'angry',
    eyebrows: 'pinched',
    mouth: 'frown',
  },
  irritated: {
    eyes: 'angry',
    eyebrows: 'angry',
    mouth: 'gritted',
    details: ['steam'],
  },

  // ── Sadness ─────────────────────────────────────────────────────────
  sad: {
    eyes: 'sad',
    eyebrows: 'sad',
    mouth: 'sad',
    details: ['tears'],
  },
  lonely: {
    eyes: 'sad',
    eyebrows: 'worried',
    mouth: 'flat',
  },
  depressed: {
    eyes: 'halfLidded',
    eyebrows: 'sad',
    mouth: 'frown',
  },
  miserable: {
    eyes: 'crying',
    eyebrows: 'worried',
    mouth: 'openFrown',
    details: ['tears'],
  },
};
