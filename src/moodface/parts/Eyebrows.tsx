import React from 'react';
import { Path, G } from '../svg';
import type { EyebrowVariant } from '../types';

interface EyebrowsProps {
  variant: EyebrowVariant;
  color: string;
  sw?: number;
}

const LX = 34;
const RX = 66;
/** Baseline brow height. Individual variants shift from here. */
const Y = 27;
/** Half-width of a brow. Wider than the eye so the angle is readable small. */
const W = 8.5;

/** A mirrored pair of brow strokes. `d` is written for the LEFT brow. */
function BrowPair({
  d,
  mirror,
  color,
  sw,
}: {
  d: (x: number) => string;
  mirror: (x: number) => string;
  color: string;
  sw: number;
}) {
  return (
    <G>
      <Path d={d(LX)} stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
      <Path d={mirror(RX)} stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
    </G>
  );
}

/**
 * Renders both eyebrows above the eyes in the 100×100 SVG space.
 *
 * Brow ANGLE carries most of the emotional signal at small sizes, so each
 * variant commits to a distinct slope rather than a subtle curve.
 */
export const Eyebrows = React.memo(function Eyebrows({ variant, color, sw = 3.6 }: EyebrowsProps) {
  if (variant === 'none') return null;

  switch (variant) {
    case 'normal':
      return (
        <BrowPair
          color={color}
          sw={sw}
          d={(x) => `M${x - W},${Y + 1} L${x + W},${Y + 1}`}
          mirror={(x) => `M${x - W},${Y + 1} L${x + W},${Y + 1}`}
        />
      );

    case 'raised':
      return (
        <BrowPair
          color={color}
          sw={sw}
          d={(x) => `M${x - W},${Y} Q${x},${Y - 7} ${x + W},${Y}`}
          mirror={(x) => `M${x - W},${Y} Q${x},${Y - 7} ${x + W},${Y}`}
        />
      );

    case 'worried':
      // Inner corners pulled UP — the distress brow.
      return (
        <BrowPair
          color={color}
          sw={sw}
          d={(x) => `M${x - W},${Y + 4} L${x + W},${Y - 2}`}
          mirror={(x) => `M${x + W},${Y + 4} L${x - W},${Y - 2}`}
        />
      );

    case 'sad':
      // Outer corners dropping while the inner ends stay level.
      return (
        <BrowPair
          color={color}
          sw={sw}
          d={(x) => `M${x - W},${Y + 5} Q${x - 1},${Y - 1} ${x + W},${Y + 1}`}
          mirror={(x) => `M${x + W},${Y + 5} Q${x + 1},${Y - 1} ${x - W},${Y + 1}`}
        />
      );

    case 'angry':
      // Inner corners driven DOWN and in, hard straight lines.
      return (
        <BrowPair
          color={color}
          sw={sw + 0.4}
          d={(x) => `M${x - W},${Y - 3} L${x + W},${Y + 5}`}
          mirror={(x) => `M${x + W},${Y - 3} L${x - W},${Y + 5}`}
        />
      );

    case 'surprised':
      return (
        <BrowPair
          color={color}
          sw={sw}
          d={(x) => `M${x - W},${Y - 4} Q${x},${Y - 13} ${x + W},${Y - 4}`}
          mirror={(x) => `M${x - W},${Y - 4} Q${x},${Y - 13} ${x + W},${Y - 4}`}
        />
      );

    case 'relaxed':
      return (
        <BrowPair
          color={color}
          sw={sw - 0.4}
          d={(x) => `M${x - 7},${Y + 2} Q${x},${Y + 6} ${x + 7},${Y + 2}`}
          mirror={(x) => `M${x - 7},${Y + 2} Q${x},${Y + 6} ${x + 7},${Y + 2}`}
        />
      );

    case 'pinched':
      // Short, low, squeezed toward the nose — tension without anger.
      return (
        <BrowPair
          color={color}
          sw={sw}
          d={(x) => `M${x - 5},${Y + 5} L${x + 6},${Y + 2}`}
          mirror={(x) => `M${x + 5},${Y + 5} L${x - 6},${Y + 2}`}
        />
      );

    case 'oneRaised':
      // Asymmetric: left flat, right arched high.
      return (
        <G>
          <Path
            d={`M${LX - W},${Y + 2} L${LX + W},${Y + 3}`}
            stroke={color}
            strokeWidth={sw}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d={`M${RX - W},${Y - 4} Q${RX},${Y - 11} ${RX + W},${Y - 3}`}
            stroke={color}
            strokeWidth={sw}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      );

    default:
      return null;
  }
});
