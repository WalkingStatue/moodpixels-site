import React from 'react';
import { Circle, Ellipse, Path, Line, G } from '../svg';
import type { EyeVariant, FacePalette } from '../types';

interface EyesProps {
  variant: EyeVariant;
  palette: FacePalette;
  /** Stroke width in viewBox units. */
  sw?: number;
}

/** Eye centres and geometry in the 100×100 viewBox. */
const LX = 34;
const RX = 66;
const Y = 44;
const SRX = 8.6; // sclera radius x
const SRY = 9.6; // sclera radius y
const PR = 4.6; // pupil radius

type LidKind = 'none' | 'heavy' | 'half' | 'angryL' | 'angryR' | 'droopL' | 'droopR';

/**
 * One open eye: white, pupil, catchlight, and an optional lid drawn in the
 * FACE color so it occludes the white. Filling the lid (rather than just
 * stroking a line) is what makes a sleepy or angry eye read as a lid.
 */
function EyeBall({
  cx,
  palette,
  rx = SRX,
  ry = SRY,
  pr = PR,
  dx = 0,
  dy = 0,
  lid = 'none',
  sw = 4,
  catchlights = 1,
}: {
  cx: number;
  palette: FacePalette;
  rx?: number;
  ry?: number;
  pr?: number;
  dx?: number;
  dy?: number;
  lid?: LidKind;
  sw?: number;
  catchlights?: number;
}) {
  const px = cx + dx;
  const py = Y + dy;

  let lidShape: React.ReactNode = null;
  if (lid === 'heavy' || lid === 'half') {
    const cut = lid === 'heavy' ? ry * 0.72 : ry * 0.25;
    lidShape = (
      <G>
        <Path
          d={`M${cx - rx - 0.5},${Y - ry - 1} H${cx + rx + 0.5} V${Y - cut} Q${cx},${Y - cut + 3} ${cx - rx - 0.5},${Y - cut} Z`}
          fill={palette.face}
        />
        <Path
          d={`M${cx - rx},${Y - cut} Q${cx},${Y - cut + 3.2} ${cx + rx},${Y - cut}`}
          stroke={palette.stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
      </G>
    );
  } else if (lid === 'angryL' || lid === 'angryR') {
    // Overhanging lid angled down toward the nose.
    const inner = lid === 'angryL' ? cx + rx : cx - rx;
    const outer = lid === 'angryL' ? cx - rx : cx + rx;
    lidShape = (
      <G>
        <Path
          d={`M${outer},${Y - ry - 1} H${inner} V${Y + ry * 0.15} L${outer},${Y - ry * 0.55} Z`}
          fill={palette.face}
        />
        <Path
          d={`M${outer},${Y - ry * 0.55} L${inner},${Y + ry * 0.15}`}
          stroke={palette.stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
      </G>
    );
  } else if (lid === 'droopL' || lid === 'droopR') {
    // Lid drooping at the OUTER corner — reads as sadness, not anger.
    const outer = lid === 'droopL' ? cx - rx : cx + rx;
    const inner = lid === 'droopL' ? cx + rx : cx - rx;
    lidShape = (
      <G>
        <Path
          d={`M${outer},${Y - ry - 1} H${inner} V${Y - ry * 0.62} L${outer},${Y + ry * 0.1} Z`}
          fill={palette.face}
        />
        <Path
          d={`M${outer},${Y + ry * 0.1} L${inner},${Y - ry * 0.62}`}
          stroke={palette.stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
      </G>
    );
  }

  return (
    <G>
      <Ellipse cx={cx} cy={Y} rx={rx} ry={ry} fill={palette.sclera} />
      <Circle cx={px} cy={py} r={pr} fill={palette.pupil} />
      <Circle cx={px - pr * 0.34} cy={py - pr * 0.44} r={pr * 0.33} fill="#FFFFFF" opacity={0.92} />
      {catchlights > 1 ? (
        <Circle cx={px + pr * 0.42} cy={py + pr * 0.38} r={pr * 0.18} fill="#FFFFFF" opacity={0.6} />
      ) : null}
      {lidShape}
    </G>
  );
}

/** Two mirrored closed-eye strokes. */
function ClosedPair({
  d,
  color,
  sw,
}: {
  d: (x: number) => string;
  color: string;
  sw: number;
}) {
  return (
    <G>
      <Path d={d(LX)} stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
      <Path d={d(RX)} stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
    </G>
  );
}

function starPath(cx: number, cy: number, r: number, ri: number, points: number): string {
  let d = '';
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : ri;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const px = cx + rad * Math.cos(angle);
    const py = cy + rad * Math.sin(angle);
    d += i === 0 ? `M${px.toFixed(2)},${py.toFixed(2)}` : `L${px.toFixed(2)},${py.toFixed(2)}`;
  }
  return `${d}Z`;
}

/**
 * Renders both eyes inside the 100×100 SVG space.
 *
 * Expression comes from LID SHAPE and pupil placement, not from pupil size —
 * that is what keeps variants apart at 24-32dp, where a 1-unit radius
 * difference is invisible.
 */
export const Eyes = React.memo(function Eyes({ variant, palette, sw = 4 }: EyesProps) {
  const { stroke } = palette;

  switch (variant) {
    case 'normal':
      return (
        <G>
          <EyeBall cx={LX} palette={palette} sw={sw} />
          <EyeBall cx={RX} palette={palette} sw={sw} />
        </G>
      );

    case 'happy':
      // Squeezed shut, arcing up — the classic ^ ^.
      return (
        <ClosedPair
          color={stroke}
          sw={sw + 0.6}
          d={(x) => `M${x - 8},${Y + 3} Q${x},${Y - 8} ${x + 8},${Y + 3}`}
        />
      );

    case 'sad':
      return (
        <G>
          <EyeBall cx={LX} palette={palette} dy={2.2} lid="droopL" sw={sw} />
          <EyeBall cx={RX} palette={palette} dy={2.2} lid="droopR" sw={sw} />
        </G>
      );

    case 'worried':
      // Small pupils riding high in a tall white — a fear tell.
      return (
        <G>
          <EyeBall cx={LX} palette={palette} rx={7.6} ry={10.2} pr={3.4} dy={-2.4} sw={sw} />
          <EyeBall cx={RX} palette={palette} rx={7.6} ry={10.2} pr={3.4} dy={-2.4} sw={sw} />
        </G>
      );

    case 'closed':
      return <ClosedPair color={stroke} sw={sw} d={(x) => `M${x - 8},${Y} L${x + 8},${Y}`} />;

    case 'sleepy':
      return (
        <G>
          <EyeBall cx={LX} palette={palette} dy={2} lid="heavy" sw={sw} />
          <EyeBall cx={RX} palette={palette} dy={2} lid="heavy" sw={sw} />
        </G>
      );

    case 'halfLidded':
      return (
        <G>
          <EyeBall cx={LX} palette={palette} lid="half" sw={sw} />
          <EyeBall cx={RX} palette={palette} lid="half" sw={sw} />
        </G>
      );

    case 'squint':
      // Narrow slits with a pupil showing through.
      return (
        <G>
          <Ellipse cx={LX} cy={Y} rx={8.4} ry={3.4} fill={palette.sclera} />
          <Ellipse cx={RX} cy={Y} rx={8.4} ry={3.4} fill={palette.sclera} />
          <Circle cx={LX} cy={Y} r={2.9} fill={palette.pupil} />
          <Circle cx={RX} cy={Y} r={2.9} fill={palette.pupil} />
          <ClosedPair
            color={stroke}
            sw={sw - 0.6}
            d={(x) => `M${x - 8.6},${Y - 3.4} Q${x},${Y - 5.6} ${x + 8.6},${Y - 3.4}`}
          />
        </G>
      );

    case 'excited':
      return (
        <G>
          <EyeBall cx={LX} palette={palette} rx={9.6} ry={10.6} pr={5.6} catchlights={2} sw={sw} />
          <EyeBall cx={RX} palette={palette} rx={9.6} ry={10.6} pr={5.6} catchlights={2} sw={sw} />
        </G>
      );

    case 'wideOpen':
      return (
        <G>
          <EyeBall cx={LX} palette={palette} rx={10} ry={11} pr={3.2} sw={sw} />
          <EyeBall cx={RX} palette={palette} rx={10} ry={11} pr={3.2} sw={sw} />
        </G>
      );

    case 'star':
      return (
        <G>
          <Path d={starPath(LX, Y, 9, 3.8, 5)} fill={stroke} />
          <Path d={starPath(RX, Y, 9, 3.8, 5)} fill={stroke} />
        </G>
      );

    case 'sparkle':
      return (
        <G>
          <EyeBall cx={LX} palette={palette} rx={7.4} ry={8.2} pr={3.8} sw={sw} />
          <EyeBall cx={RX} palette={palette} rx={7.4} ry={8.2} pr={3.8} sw={sw} />
          <Path d={starPath(LX - 9.5, Y - 8, 4.2, 1.2, 4)} fill={stroke} opacity={0.85} />
          <Path d={starPath(RX + 9.5, Y - 8, 4.2, 1.2, 4)} fill={stroke} opacity={0.85} />
        </G>
      );

    case 'dizzy':
      return (
        <G>
          {[LX, RX].map((x) => (
            <G key={x}>
              <Line x1={x - 6} y1={Y - 6} x2={x + 6} y2={Y + 6} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
              <Line x1={x + 6} y1={Y - 6} x2={x - 6} y2={Y + 6} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
            </G>
          ))}
        </G>
      );

    case 'crying':
      // Squeezed shut curving DOWN, with streams below.
      return (
        <G>
          <ClosedPair
            color={stroke}
            sw={sw + 0.6}
            d={(x) => `M${x - 8},${Y - 3} Q${x},${Y + 7} ${x + 8},${Y - 3}`}
          />
          <Path
            d={`M${LX - 2},${Y + 6} Q${LX - 5},${Y + 14} ${LX - 2},${Y + 20}`}
            stroke={palette.sclera}
            strokeWidth={3.2}
            strokeLinecap="round"
            fill="none"
            opacity={0.85}
          />
          <Path
            d={`M${RX + 2},${Y + 6} Q${RX + 5},${Y + 14} ${RX + 2},${Y + 20}`}
            stroke={palette.sclera}
            strokeWidth={3.2}
            strokeLinecap="round"
            fill="none"
            opacity={0.85}
          />
        </G>
      );

    case 'angry':
      return (
        <G>
          <EyeBall cx={LX} palette={palette} dy={1.6} lid="angryL" sw={sw} />
          <EyeBall cx={RX} palette={palette} dy={1.6} lid="angryR" sw={sw} />
        </G>
      );

    case 'confused':
      // Deliberately asymmetric: one open, one squinting.
      return (
        <G>
          <EyeBall cx={LX} palette={palette} dy={1} sw={sw} />
          <Ellipse cx={RX} cy={Y - 1} rx={8.4} ry={3.6} fill={palette.sclera} />
          <Circle cx={RX} cy={Y - 1} r={3} fill={palette.pupil} />
          <Path
            d={`M${RX - 8.6},${Y - 4.6} Q${RX},${Y - 7} ${RX + 8.6},${Y - 4.6}`}
            stroke={stroke}
            strokeWidth={sw - 0.6}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      );

    case 'sideGlance':
      return (
        <G>
          <EyeBall cx={LX} palette={palette} dx={4} sw={sw} />
          <EyeBall cx={RX} palette={palette} dx={4} sw={sw} />
        </G>
      );

    case 'surprised':
      return (
        <G>
          {[LX, RX].map((x) => (
            <G key={x}>
              <Circle cx={x} cy={Y} r={8.4} fill={palette.sclera} />
              <Circle cx={x} cy={Y} r={8.4} fill="none" stroke={stroke} strokeWidth={sw - 1.2} />
              <Circle cx={x} cy={Y} r={3.4} fill={palette.pupil} />
            </G>
          ))}
        </G>
      );

    default:
      return null;
  }
});
