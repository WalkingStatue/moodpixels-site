/** Parse a #RGB or #RRGGBB string into [r, g, b] channels (0-255). */
export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  const num = parseInt(h, 16);
  if (Number.isNaN(num) || h.length !== 6) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/** WCAG relative luminance of a hex color (0 = black, 1 = white). */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/**
 * WCAG contrast ratio between two colors, from 1 (identical) to 21
 * (black on white). 4.5 is the AA threshold for body text, 3 for large text
 * and for UI component boundaries.
 */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

export const NEAR_BLACK = '#18181B';
export const NEAR_WHITE = '#FFFFFF';

/**
 * Pick whichever of near-black / white ACTUALLY contrasts more against `hex`.
 *
 * Uses the true luminance crossover (~0.179) rather than an arbitrary 0.5
 * threshold. Contrast against white is `1.05 / (L + 0.05)` and against black
 * `(L + 0.05) / 0.05`, equal when `L ≈ 0.179`. On a mid-tone accent this is
 * the difference between a 1.9:1 label and a 5.9:1 one.
 */
export function preferredTextOn(hex: string): typeof NEAR_BLACK | typeof NEAR_WHITE {
  return contrastRatio(hex, NEAR_BLACK) >= contrastRatio(hex, NEAR_WHITE) ? NEAR_BLACK : NEAR_WHITE;
}

// ─── HSL helpers (used by MoodFace) ─────────────────────────────────────────

/** Convert a hex color to [h, s, l] where h is 0-360, s/l are 0-100. */
export function hexToHSL(hex: string): [number, number, number] {
  const [rr, gg, bb] = hexToRgb(hex);
  const r = rr / 255;
  const g = gg / 255;
  const b = bb / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s * 100, l * 100];
}

/** Convert [h, s, l] back to a hex string. */
export function hslToHex(h: number, s: number, l: number): string {
  const s1 = s / 100;
  const l1 = l / 100;
  const a = s1 * Math.min(l1, 1 - l1);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l1 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * Math.max(0, Math.min(1, color)))
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Darken a hex color by reducing lightness.
 * Used by MoodFace to derive feature stroke colors from the face fill.
 * @param hex   — base color
 * @param amount — lightness reduction (0-100, default 30)
 * @param saturate — optional saturation boost (default 10)
 */
export function darkenColor(hex: string, amount = 30, saturate = 10): string {
  const [h, s, l] = hexToHSL(hex);
  return hslToHex(h, Math.min(100, s + saturate), Math.max(0, l - amount));
}

/**
 * Lighten a hex color by raising lightness.
 * @param hex      — base color
 * @param amount   — lightness increase (0-100, default 20)
 * @param saturate — saturation delta (default -6, i.e. slightly washed out)
 */
export function lightenColor(hex: string, amount = 20, saturate = -6): string {
  const [h, s, l] = hexToHSL(hex);
  return hslToHex(h, Math.max(0, Math.min(100, s + saturate)), Math.min(100, l + amount));
}

/**
 * Linearly blend two hex colors in RGB space.
 * @param t — 0 returns `a`, 1 returns `b`.
 */
export function mixColors(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const k = Math.max(0, Math.min(1, t));
  const ch = (x: number, y: number) => Math.round(x + (y - x) * k).toString(16).padStart(2, '0');
  return `#${ch(ar, br)}${ch(ag, bg)}${ch(ab, bb)}`;
}

/** Convert a hex color to an `rgba()` string with the given alpha (0-1). */
export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}

/**
 * Force a color to a target lightness, keeping its hue and saturation.
 *
 * Unlike `darkenColor`/`lightenColor` this is ABSOLUTE, which is what overlay
 * text needs: a relative shift produces wildly different contrast depending on
 * how light the source color happened to be.
 *
 * @param minSaturation — floor the saturation so very washed-out colors still
 *   read as themselves rather than as grey.
 */
export function withLightness(hex: string, lightness: number, minSaturation = 0): string {
  const [h, s] = hexToHSL(hex);
  return hslToHex(h, Math.max(minSaturation, s), Math.max(0, Math.min(100, lightness)));
}
