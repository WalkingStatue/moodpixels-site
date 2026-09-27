// ─── Facial-part variant unions ──────────────────────────────────────────────

export type EyeVariant =
  | 'normal'      // open, pupils centred
  | 'happy'       // squeezed shut, arcs curving up
  | 'sad'         // open, pupils low, outer lids drooping
  | 'worried'     // small pupils high in a tall white
  | 'closed'      // flat lines
  | 'sleepy'      // heavy upper lid over the top half
  | 'halfLidded'  // lid at mid-height, pupils still visible
  | 'squint'      // narrow slits curving down
  | 'excited'     // wide whites, large pupils, double catchlight
  | 'wideOpen'    // very wide whites, small pupils (alarm)
  | 'star'        // five-point stars
  | 'sparkle'     // four-point sparkles beside small pupils
  | 'dizzy'       // X eyes
  | 'crying'      // squeezed shut curving down, with tear streams
  | 'angry'       // overhanging angled upper lid
  | 'confused'    // one open, one squinting
  | 'sideGlance'  // pupils pushed to one side
  | 'surprised';  // ring outlines

export type EyebrowVariant =
  | 'none'
  | 'normal'      // flat
  | 'raised'      // arched up, high
  | 'worried'     // inner corners up
  | 'sad'         // outer corners down
  | 'angry'       // inner corners down, sharp
  | 'surprised'   // very high arches
  | 'relaxed'     // gentle downward curves
  | 'pinched'     // short, low, angled inward
  | 'oneRaised';  // asymmetric

export type MouthVariant =
  | 'smile'
  | 'slightSmile'
  | 'grin'         // wide, filled interior
  | 'openSmile'
  | 'neutral'
  | 'flat'
  | 'sad'
  | 'frown'
  | 'openFrown'    // filled downturned oval
  | 'worried'      // wavy
  | 'nervous'      // zigzag
  | 'pout'
  | 'surprised'    // O
  | 'agape'        // tall open oval
  | 'tongue'
  | 'smirk'        // asymmetric
  | 'gritted';     // rectangle with teeth lines

export type DetailVariant =
  | 'blush'
  | 'tears'
  | 'sweat'
  | 'stars'
  | 'hearts'
  | 'cheekMarks'
  | 'steam'
  | 'zzz'
  | 'spiral';

// ─── Emotion names ──────────────────────────────────────────────────────────

export type EmotionName =
  | 'normal'
  | 'happy'
  | 'excited'
  | 'changeable'
  | 'lowEnergy'
  | 'depressed'
  | 'anxious'
  | 'grumpy'
  | 'apathetic'
  | 'calm'
  | 'good'
  | 'energetic'
  | 'dynamic'
  | 'frisky'
  | 'confident'
  | 'assertive'
  | 'flirtatious'
  | 'inLove'
  | 'bashful'
  | 'sleepy'
  | 'exhausted'
  | 'irritated'
  | 'ashamed'
  | 'guilty'
  | 'lonely'
  | 'sad'
  | 'miserable';

// ─── Emotion configuration ──────────────────────────────────────────────────

export interface EmotionConfig {
  eyes: EyeVariant;
  eyebrows: EyebrowVariant;
  mouth: MouthVariant;
  details?: DetailVariant[];
}

// ─── Component props ────────────────────────────────────────────────────────

/** Palette derived from a single mood color, shared by every facial part. */
export interface FacePalette {
  /** Brow / mouth / lid stroke color. */
  stroke: string;
  /** Eye white. */
  sclera: string;
  /** Iris + pupil. */
  pupil: string;
  /** The face fill itself — used to draw lids that occlude the eye white. */
  face: string;
}

export type MoodFaceVariant = '3d' | 'flat';

export interface MoodFaceProps {
  /** The emotion to render. */
  emotion: EmotionName;
  /** Override the default face color (normally the mood's `colorHex`). */
  color?: string;
  /** Width & height in dp (default 32). */
  size?: number;
  /**
   * Rendering style. `'3d'` adds a gradient orb, occlusion, rim light and
   * specular highlight; `'flat'` is a plain fill. Sizes below 28dp are always
   * rendered flat — the extra layers are invisible at that scale but still cost
   * SVG nodes, and the grid legend renders one face per mood.
   */
  variant?: MoodFaceVariant;
  /** Optional style forwarded to the outer Svg element. */
  style?: object;
}
