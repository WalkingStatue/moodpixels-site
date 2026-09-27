import { hslToHex } from '../lib/color';
import type { EmotionName } from './types';

/**
 * Default color for every built-in emotion, generated from an HSL system
 * rather than picked by hand, so the whole set stays coherent:
 *
 * - HUE encodes the emotional family:
 *     joy / energy        45-55°   gold
 *     contentment         95-140°  green
 *     calm                168-192° teal → cyan
 *     sadness             205-225° blue
 *     fatigue             232-250° indigo
 *     anxiety / shame     265-292° violet
 *     anger               2-16°    red
 *     affection           330-348° rose
 *     neutral / apathy    220°     at very low saturation
 *
 * - SATURATION encodes arousal: ~28% for muted states, up to ~74% for peaks.
 *
 * - LIGHTNESS is held between 48% and 72% so every face keeps contrast against
 *   BOTH app backgrounds (#F9F6F0 light and #0C0C0E dark). Nothing goes lighter
 *   than 72% (would wash out on cream) or darker than 48% (would sink into the
 *   dark theme and kill the feature contrast the face relies on).
 *
 * A user's stored `colorHex` always overrides these — mood color is data.
 */
type HSL = [h: number, s: number, l: number];

const HSL_BY_EMOTION: Record<EmotionName, HSL> = {
  // neutral / baseline
  normal: [220, 12, 66],
  apathetic: [220, 8, 60],
  confident: [205, 30, 58],

  // positive
  good: [105, 42, 62],
  happy: [50, 74, 62],
  excited: [45, 82, 60],
  energetic: [130, 56, 52],
  dynamic: [155, 52, 52],
  calm: [178, 34, 60],
  frisky: [88, 50, 58],
  assertive: [24, 62, 56],

  // affection
  inLove: [344, 62, 66],
  flirtatious: [332, 56, 68],
  bashful: [348, 44, 72],

  // low energy
  sleepy: [238, 30, 66],
  exhausted: [246, 24, 58],
  lowEnergy: [252, 28, 62],

  // unsettled
  changeable: [292, 38, 66],
  anxious: [276, 48, 62],
  ashamed: [288, 26, 64],
  guilty: [268, 24, 58],

  // anger
  grumpy: [12, 52, 58],
  irritated: [4, 68, 56],

  // sadness
  sad: [212, 46, 58],
  lonely: [220, 34, 60],
  depressed: [228, 26, 52],
  miserable: [216, 32, 48],
};

/** Resolved hex per emotion (generated once at module load). */
export const moodColors = Object.fromEntries(
  (Object.keys(HSL_BY_EMOTION) as EmotionName[]).map((name) => {
    const [h, s, l] = HSL_BY_EMOTION[name];
    return [name, hslToHex(h, s, l)];
  }),
) as Record<EmotionName, string>;

/** The raw HSL system, exported for the seed palette and for tests. */
export { HSL_BY_EMOTION };
