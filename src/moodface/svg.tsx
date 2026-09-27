/**
 * Web shim for the `react-native-svg` API.
 *
 * `src/moodface/` is a verbatim port of `components/MoodFace/` from the app
 * repo, so the site renders the *real* faces rather than a redrawn imitation.
 * The only thing the app's version needs that a browser does not provide is
 * this module: react-native-svg's element names are capitalised wrappers over
 * the same SVG elements, with identical camelCase props (`strokeWidth`,
 * `stopColor`, …), so each one maps to its DOM tag directly.
 *
 * Keeping the shim here — rather than editing the ported files — means
 * re-syncing from the app is a copy plus an import rewrite. See `npm run sync:moodface`.
 */
import type { ComponentPropsWithoutRef } from 'react';

type SvgProps = ComponentPropsWithoutRef<'svg'>;

export default function Svg(props: SvgProps) {
  return <svg xmlns="http://www.w3.org/2000/svg" {...props} />;
}

export const Circle = (p: ComponentPropsWithoutRef<'circle'>) => <circle {...p} />;
export const Ellipse = (p: ComponentPropsWithoutRef<'ellipse'>) => <ellipse {...p} />;
export const Path = (p: ComponentPropsWithoutRef<'path'>) => <path {...p} />;
export const Line = (p: ComponentPropsWithoutRef<'line'>) => <line {...p} />;
export const G = (p: ComponentPropsWithoutRef<'g'>) => <g {...p} />;
export const Defs = (p: ComponentPropsWithoutRef<'defs'>) => <defs {...p} />;
export const LinearGradient = (p: ComponentPropsWithoutRef<'linearGradient'>) => <linearGradient {...p} />;
export const RadialGradient = (p: ComponentPropsWithoutRef<'radialGradient'>) => <radialGradient {...p} />;
export const Stop = (p: ComponentPropsWithoutRef<'stop'>) => <stop {...p} />;
