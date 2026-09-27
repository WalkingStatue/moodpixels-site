import type { EmotionName } from './types';

/**
 * Best-effort mapping from a mood label (as stored in the database) to
 * a MoodFace EmotionName. Normalises to lowercase for comparison.
 *
 * When users create custom moods with labels we don't recognise, this
 * returns `undefined` — the MoodPill will fall back to the legacy emoji.
 */
const labelMap: Record<string, EmotionName> = {
  // ─── Default seeds ──────────────────────────────────────────
  'amazing':      'excited',
  'good':         'good',
  'productive':   'energetic',
  'normal':       'normal',
  'calm':         'calm',
  'stressed':     'anxious',
  'annoyed':      'irritated',
  'tired, lazy':  'sleepy',
  'tired':        'sleepy',
  'lazy':         'sleepy',
  'sick':         'exhausted',
  'horrible':     'miserable',

  // ─── All built-in emotion names (direct match) ─────────────
  'happy':        'happy',
  'excited':      'excited',
  'changeable':   'changeable',
  'low energy':   'lowEnergy',
  'depressed':    'depressed',
  'anxious':      'anxious',
  'grumpy':       'grumpy',
  'apathetic':    'apathetic',
  'energetic':    'energetic',
  'dynamic':      'dynamic',
  'frisky':       'frisky',
  'confident':    'confident',
  'assertive':    'assertive',
  'flirtatious':  'flirtatious',
  'in love':      'inLove',
  'bashful':      'bashful',
  'sleepy':       'sleepy',
  'exhausted':    'exhausted',
  'irritated':    'irritated',
  'ashamed':      'ashamed',
  'guilty':       'guilty',
  'feeling guilty': 'guilty',
  'lonely':       'lonely',
  'sad':          'sad',
  'miserable':    'miserable',
};

/**
 * Resolve a mood label to a MoodFace emotion.
 * Returns undefined for unrecognised labels so the caller can fall back.
 */
export function labelToEmotion(label: string): EmotionName | undefined {
  return labelMap[label.toLowerCase().trim()];
}
