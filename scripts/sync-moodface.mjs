/**
 * Re-syncs `src/moodface/` from the app repo.
 *
 * The site renders the *real* mood faces rather than a redrawn imitation, so
 * these files are a verbatim copy of `components/MoodFace/` plus `lib/color.ts`.
 * The only change made on the way in is rewriting the `react-native-svg` import
 * onto the web shim in `src/moodface/svg.tsx`, which is hand-written and never
 * overwritten here.
 *
 * Usage:  npm run sync:moodface          (expects the app repo at ../)
 *         APP_REPO=../../moodpixels npm run sync:moodface
 */
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';

const APP = process.env.APP_REPO ?? '..';
const OUT = 'src/moodface';

/** Files copied as-is (no React Native imports). */
const PLAIN = [
  [`${APP}/components/MoodFace/emotionMap.ts`, `${OUT}/emotionMap.ts`],
  [`${APP}/components/MoodFace/labelToEmotion.ts`, `${OUT}/labelToEmotion.ts`],
  [`${APP}/components/MoodFace/types.ts`, `${OUT}/types.ts`],
  [`${APP}/components/MoodFace/index.ts`, `${OUT}/index.ts`],
  [`${APP}/lib/color.ts`, 'src/lib/color.ts'],
];

/** Files needing an import rewrite: [source, destination, shim specifier]. */
const REWRITTEN = [
  [`${APP}/components/MoodFace/MoodFace.tsx`, `${OUT}/MoodFace.tsx`, './svg'],
  [`${APP}/components/MoodFace/parts/Eyes.tsx`, `${OUT}/parts/Eyes.tsx`, '../svg'],
  [`${APP}/components/MoodFace/parts/Eyebrows.tsx`, `${OUT}/parts/Eyebrows.tsx`, '../svg'],
  [`${APP}/components/MoodFace/parts/Mouth.tsx`, `${OUT}/parts/Mouth.tsx`, '../svg'],
  [`${APP}/components/MoodFace/parts/Details.tsx`, `${OUT}/parts/Details.tsx`, '../svg'],
  // moodColors imports the color helper, which sits one level up here.
  [`${APP}/components/MoodFace/moodColors.ts`, `${OUT}/moodColors.ts`, null],
];

await mkdir(`${OUT}/parts`, { recursive: true });
await mkdir('src/lib', { recursive: true });

for (const [from, to] of PLAIN) {
  await copyFile(from, to);
  console.log(`sync: ${to}`);
}

for (const [from, to, shim] of REWRITTEN) {
  let source = await readFile(from, 'utf8');
  if (shim) source = source.replaceAll("from 'react-native-svg'", `from '${shim}'`);
  // `lib/color` is two levels up in the app, one level up here.
  source = source.replaceAll("from '../../lib/color'", "from '../lib/color'");
  await writeFile(to, source, 'utf8');
  console.log(`sync: ${to}`);
}

console.log('\nsync: done — run `npm run typecheck` to confirm the port still builds.');
