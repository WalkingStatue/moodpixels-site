import React from 'react';
import { Ellipse, Path, G } from '../svg';
import type { DetailVariant, FacePalette } from '../types';

interface DetailsProps {
  variants: DetailVariant[];
  palette: FacePalette;
}

/**
 * Optional overlay details (blush, tears, sparkles…) in the 100×100 space.
 *
 * These are the cheapest way to make two otherwise similar expressions
 * distinguishable at a glance, so several emotions lean on them as their
 * primary differentiator.
 */
export const Details = React.memo(function Details({ variants, palette }: DetailsProps) {
  const { stroke, sclera } = palette;

  return (
    <G>
      {variants.map((v) => {
        switch (v) {
          case 'blush':
            return (
              <G key="blush">
                <Ellipse cx={20} cy={57} rx={7.5} ry={4.5} fill={stroke} opacity={0.28} />
                <Ellipse cx={80} cy={57} rx={7.5} ry={4.5} fill={stroke} opacity={0.28} />
              </G>
            );

          case 'tears':
            // Welling drops sitting on the lower lid.
            return (
              <G key="tears">
                <Path d="M27,54 Q23,62 27,66 Q31,62 27,54 Z" fill={sclera} opacity={0.9} />
                <Path d="M73,54 Q69,62 73,66 Q77,62 73,54 Z" fill={sclera} opacity={0.9} />
              </G>
            );

          case 'sweat':
            return (
              <G key="sweat">
                <Path d="M80,24 Q75,33 80,39 Q85,33 80,24 Z" fill={sclera} opacity={0.9} />
                <Path
                  d="M80,24 Q75,33 80,39 Q85,33 80,24 Z"
                  stroke={stroke}
                  strokeWidth={1}
                  fill="none"
                  opacity={0.35}
                />
              </G>
            );

          case 'stars': {
            const star = (sx: number, sy: number, a: number) =>
              `M${sx},${sy - a} L${sx + a * 0.3},${sy - a * 0.3} L${sx + a},${sy} L${sx + a * 0.3},${sy + a * 0.3} L${sx},${sy + a} L${sx - a * 0.3},${sy + a * 0.3} L${sx - a},${sy} L${sx - a * 0.3},${sy - a * 0.3} Z`;
            return (
              <G key="stars">
                <Path d={star(82, 22, 5.5)} fill={sclera} opacity={0.95} />
                <Path d={star(18, 24, 4)} fill={sclera} opacity={0.8} />
                <Path d={star(88, 38, 2.8)} fill={sclera} opacity={0.6} />
              </G>
            );
          }

          case 'hearts': {
            const heart = (hx: number, hy: number, s: number) =>
              `M${hx},${hy + s * 0.9} C${hx - s * 1.2},${hy - s * 0.2} ${hx - s * 0.5},${hy - s} ${hx},${hy - s * 0.35} C${hx + s * 0.5},${hy - s} ${hx + s * 1.2},${hy - s * 0.2} ${hx},${hy + s * 0.9} Z`;
            return (
              <G key="hearts">
                <Path d={heart(81, 24, 6.5)} fill={sclera} opacity={0.95} />
                <Path d={heart(19, 27, 4.6)} fill={sclera} opacity={0.8} />
              </G>
            );
          }

          case 'cheekMarks':
            return (
              <G key="cheekMarks">
                {[
                  ['M21,55 L15,58', 'M21,59 L15,62'],
                  ['M79,55 L85,58', 'M79,59 L85,62'],
                ]
                  .flat()
                  .map((d) => (
                    <Path key={d} d={d} stroke={stroke} strokeWidth={2.2} strokeLinecap="round" opacity={0.4} />
                  ))}
              </G>
            );

          case 'steam':
            // Two puffs venting from the top of the head.
            return (
              <G key="steam">
                <Path
                  d="M32,14 Q26,8 32,3"
                  stroke={sclera}
                  strokeWidth={3}
                  strokeLinecap="round"
                  fill="none"
                  opacity={0.85}
                />
                <Path
                  d="M68,14 Q74,8 68,3"
                  stroke={sclera}
                  strokeWidth={3}
                  strokeLinecap="round"
                  fill="none"
                  opacity={0.85}
                />
              </G>
            );

          case 'zzz':
            return (
              <G key="zzz">
                <Path
                  d="M74,20 H84 L74,30 H84"
                  stroke={sclera}
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={0.95}
                />
                <Path
                  d="M86,8 H93 L86,15 H93"
                  stroke={sclera}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={0.75}
                />
              </G>
            );

          case 'spiral':
            // Wobbling / unsettled marker.
            return (
              <G key="spiral">
                <Path
                  d="M82,26 a4,4 0 1 1 -4,-4 a6,6 0 1 1 6,6 a8,8 0 1 1 -8,-8"
                  stroke={sclera}
                  strokeWidth={2.2}
                  fill="none"
                  opacity={0.9}
                />
              </G>
            );

          default:
            return null;
        }
      })}
    </G>
  );
});
