import React from 'react';
import { Path, Circle, Ellipse, G } from '../svg';
import type { MouthVariant, FacePalette } from '../types';

interface MouthProps {
  variant: MouthVariant;
  palette: FacePalette;
  sw?: number;
}

const CX = 50;
/** Mouth baseline. Lower than the old 62 to balance the larger eyes. */
const Y = 65;

/**
 * Renders the mouth in the 100×100 SVG space.
 *
 * Open mouths are filled with the pupil color rather than a translucent tint —
 * a mouth cavity that shows the face color through it reads as a smudge at
 * 24-32dp.
 */
export const Mouth = React.memo(function Mouth({ variant, palette, sw = 4 }: MouthProps) {
  const { stroke, pupil, sclera } = palette;

  switch (variant) {
    case 'smile':
      return (
        <Path
          d={`M${CX - 13},${Y - 2} Q${CX},${Y + 10} ${CX + 13},${Y - 2}`}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
      );

    case 'slightSmile':
      return (
        <Path
          d={`M${CX - 8},${Y} Q${CX},${Y + 5} ${CX + 8},${Y}`}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
      );

    case 'grin':
      // Wide open grin with a tongue hint and a tooth line.
      return (
        <G>
          <Path
            d={`M${CX - 15},${Y - 4} Q${CX},${Y + 15} ${CX + 15},${Y - 4} Z`}
            fill={pupil}
          />
          <Path
            d={`M${CX - 15},${Y - 4} H${CX + 15}`}
            stroke={sclera}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </G>
      );

    case 'openSmile':
      return (
        <G>
          <Path d={`M${CX - 11},${Y - 1} Q${CX},${Y + 14} ${CX + 11},${Y - 1} Z`} fill={pupil} />
          <Path
            d={`M${CX - 11},${Y - 1} Q${CX},${Y + 14} ${CX + 11},${Y - 1}`}
            stroke={stroke}
            strokeWidth={sw - 1}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      );

    case 'neutral':
      return (
        <Path
          d={`M${CX - 7},${Y} L${CX + 7},${Y}`}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
      );

    case 'flat':
      return (
        <Path
          d={`M${CX - 13},${Y} L${CX + 13},${Y}`}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
      );

    case 'sad':
      return (
        <Path
          d={`M${CX - 11},${Y + 4} Q${CX},${Y - 5} ${CX + 11},${Y + 4}`}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
      );

    case 'frown':
      return (
        <Path
          d={`M${CX - 13},${Y + 7} Q${CX},${Y - 8} ${CX + 13},${Y + 7}`}
          stroke={stroke}
          strokeWidth={sw + 0.4}
          strokeLinecap="round"
          fill="none"
        />
      );

    case 'openFrown':
      // Filled downturned cavity — misery, not just displeasure.
      return (
        <G>
          <Path d={`M${CX - 11},${Y + 8} Q${CX},${Y - 7} ${CX + 11},${Y + 8} Z`} fill={pupil} />
          <Path
            d={`M${CX - 11},${Y + 8} Q${CX},${Y - 7} ${CX + 11},${Y + 8}`}
            stroke={stroke}
            strokeWidth={sw - 1}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      );

    case 'worried':
      return (
        <Path
          d={`M${CX - 12},${Y} Q${CX - 6},${Y - 6} ${CX},${Y} Q${CX + 6},${Y + 6} ${CX + 12},${Y}`}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
      );

    case 'nervous':
      return (
        <Path
          d={`M${CX - 11},${Y} L${CX - 5.5},${Y - 4} L${CX},${Y + 2} L${CX + 5.5},${Y - 3} L${CX + 11},${Y + 1}`}
          stroke={stroke}
          strokeWidth={sw - 0.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );

    case 'pout':
      return (
        <G>
          <Ellipse cx={CX} cy={Y + 1} rx={6} ry={4.6} fill={pupil} />
          <Path
            d={`M${CX - 9},${Y - 4} Q${CX},${Y - 7} ${CX + 9},${Y - 4}`}
            stroke={stroke}
            strokeWidth={sw - 1}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      );

    case 'surprised':
      return (
        <G>
          <Circle cx={CX} cy={Y + 1} r={7} fill={pupil} />
          <Circle cx={CX} cy={Y + 1} r={7} fill="none" stroke={stroke} strokeWidth={sw - 1.4} />
        </G>
      );

    case 'agape':
      return <Ellipse cx={CX} cy={Y + 2} rx={6.5} ry={9} fill={pupil} />;

    case 'tongue':
      return (
        <G>
          <Path d={`M${CX - 12},${Y - 2} Q${CX},${Y + 12} ${CX + 12},${Y - 2} Z`} fill={pupil} />
          <Path
            d={`M${CX - 4.5},${Y + 6} Q${CX},${Y + 17} ${CX + 4.5},${Y + 6} Z`}
            fill={sclera}
            opacity={0.95}
          />
        </G>
      );

    case 'smirk':
      // One corner up, the other flat — self-satisfaction.
      return (
        <Path
          d={`M${CX - 12},${Y + 2} Q${CX + 2},${Y + 6} ${CX + 12},${Y - 5}`}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
      );

    case 'gritted':
      // Clenched teeth: a filled band split by vertical tooth lines.
      return (
        <G>
          <Path
            d={`M${CX - 13},${Y - 4} H${CX + 13} V${Y + 4} H${CX - 13} Z`}
            fill={sclera}
            stroke={stroke}
            strokeWidth={sw - 1.6}
          />
          {[-6.5, 0, 6.5].map((dx) => (
            <Path
              key={dx}
              d={`M${CX + dx},${Y - 4} V${Y + 4}`}
              stroke={stroke}
              strokeWidth={sw - 2.4}
              opacity={0.7}
            />
          ))}
        </G>
      );

    default:
      return null;
  }
});
