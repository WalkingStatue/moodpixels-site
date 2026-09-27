import React, { useId, useMemo } from 'react';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, RadialGradient, Stop } from './svg';
import { Eyes } from './parts/Eyes';
import { Eyebrows } from './parts/Eyebrows';
import { Mouth } from './parts/Mouth';
import { Details } from './parts/Details';
import { emotionMap } from './emotionMap';
import { moodColors } from './moodColors';
import { darkenColor, lightenColor, mixColors, preferredTextOn, NEAR_BLACK } from '../lib/color';
import type { FacePalette, MoodFaceProps } from './types';

/** Below this size the 3D layers are sub-pixel, so we render flat instead. */
const FLAT_THRESHOLD = 28;

/**
 * Derive every color the face needs from one base hex.
 *
 * The key decision is direction: on a light mood color the features must be
 * darker than the face, on a dark one they must be lighter. A fixed darken
 * (what this component used to do) makes features vanish on already-dark
 * moods. Pupils stay dark in both cases because they sit on the white sclera.
 */
function buildPalette(base: string): FacePalette {
  const baseIsLight = preferredTextOn(base) === NEAR_BLACK;
  return {
    face: base,
    stroke: baseIsLight ? darkenColor(base, 46, 22) : lightenColor(base, 50, -18),
    sclera: mixColors(base, '#FFFFFF', 0.88),
    pupil: mixColors(base, '#101319', 0.78),
  };
}

/**
 * Composable mood face.
 *
 * All coordinates live in a 100×100 viewBox so the component scales cleanly to
 * any `size`. The 3D treatment is a stack of five cheap layers (contact
 * shadow, gradient orb, bottom occlusion, rim light, specular highlight) —
 * no filters, which react-native-svg renders inconsistently across platforms.
 *
 * @example
 * <MoodFace emotion="happy" size={48} />
 * <MoodFace emotion="sad" color="#7BA7CC" size={24} />
 */
export const MoodFace = React.memo(function MoodFace({
  emotion,
  color,
  size = 32,
  variant = '3d',
  style,
}: MoodFaceProps) {
  const config = emotionMap[emotion];
  const faceColor = color ?? moodColors[emotion];

  // Stable, collision-free gradient ids — two faces of the same color must not
  // share a <Defs> id, or one will paint with the other's gradient.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  const palette = useMemo(() => buildPalette(faceColor), [faceColor]);
  const shading = useMemo(
    () => ({
      top: lightenColor(faceColor, 22, -4),
      mid: faceColor,
      low: darkenColor(faceColor, 18, 8),
      occlusion: darkenColor(faceColor, 34, 10),
      rim: lightenColor(faceColor, 34, -10),
      contact: darkenColor(faceColor, 30, 6),
    }),
    [faceColor],
  );

  if (!config) return null;

  const is3d = variant === '3d' && size >= FLAT_THRESHOLD;
  const orbId = `mf-orb-${uid}`;
  const occId = `mf-occ-${uid}`;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      {is3d ? (
        <>
          <Defs>
            <RadialGradient id={orbId} cx="34%" cy="27%" r="82%">
              <Stop offset="0%" stopColor={shading.top} />
              <Stop offset="55%" stopColor={shading.mid} />
              <Stop offset="100%" stopColor={shading.low} />
            </RadialGradient>
            <LinearGradient id={occId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={shading.occlusion} stopOpacity={0} />
              <Stop offset="100%" stopColor={shading.occlusion} stopOpacity={0.55} />
            </LinearGradient>
          </Defs>

          {/* Contact shadow — grounds the orb instead of letting it float. */}
          <Ellipse cx={50} cy={95} rx={30} ry={4} fill={shading.contact} opacity={0.16} />

          {/* The orb */}
          <Circle cx={50} cy={50} r={46} fill={`url(#${orbId})`} />

          {/* Bottom occlusion (lower half only, fading upward) */}
          <Path d="M4,50 A46,46 0 0 0 96,50 Z" fill={`url(#${occId})`} />

          {/* Rim light along the upper edge */}
          <Path
            d="M10,32 A44,44 0 0 1 90,32"
            stroke={shading.rim}
            strokeWidth={2.2}
            strokeLinecap="round"
            fill="none"
            opacity={0.5}
          />

          {/* Specular highlight */}
          <Ellipse
            cx={33}
            cy={29}
            rx={13}
            ry={8.5}
            fill="#FFFFFF"
            opacity={0.26}
            transform="rotate(-24 33 29)"
          />
          <Circle cx={67} cy={25} r={3.2} fill="#FFFFFF" opacity={0.16} />
        </>
      ) : (
        <Circle cx={50} cy={50} r={46} fill={faceColor} />
      )}

      {/* Facial features */}
      <Eyebrows variant={config.eyebrows} color={palette.stroke} />
      <Eyes variant={config.eyes} palette={palette} />
      <Mouth variant={config.mouth} palette={palette} />

      {config.details && config.details.length > 0 ? (
        <Details variants={config.details} palette={palette} />
      ) : null}
    </Svg>
  );
});
