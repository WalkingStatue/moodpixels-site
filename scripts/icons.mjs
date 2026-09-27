/**
 * Regenerates the site's icon assets from the app's official artwork.
 *
 * The source PNGs in the app repo are 1024×1024 master icons (~850KB each) —
 * far too heavy to ship on a landing page. This downscales them to the sizes
 * the site actually renders and writes WebP alongside PNG.
 *
 * Run with `npm run icons` after the app's icon artwork changes.
 */
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const APP = process.env.APP_REPO ?? '..';
const OUT = 'public';

/** [source, basename, sizes] — sizes are square edge lengths in px. */
const JOBS = [
  [`${APP}/assets/images/MoodPixels_Icon_Light_Final.png`, 'moodpixels-icon', [128]],
  [`${APP}/assets/images/icon-dark.png`, 'moodpixels-icon-dark', [128]],
];

await mkdir(OUT, { recursive: true });

for (const [src, name, sizes] of JOBS) {
  for (const size of sizes) {
    const base = sharp(src).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
    await base.clone().png({ compressionLevel: 9, palette: true }).toFile(`${OUT}/${name}-${size}.png`);
    await base.clone().webp({ quality: 88 }).toFile(`${OUT}/${name}-${size}.webp`);
  }
}

// Favicons and PWA icons from the light master.
const master = `${APP}/assets/images/MoodPixels_Icon_Light_Final.png`;
for (const size of [16, 32, 180, 192, 512]) {
  await sharp(master).resize(size, size).png({ compressionLevel: 9 }).toFile(`${OUT}/icon-${size}.png`);
}

// Open Graph card sits on the app's cream background at the standard 1200×630.
await sharp({
  create: { width: 1200, height: 630, channels: 4, background: '#F9F6F0' },
})
  .composite([{ input: await sharp(master).resize(360, 360).png().toBuffer(), top: 135, left: 420 }])
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/og-image.png`);

console.log('icons: wrote optimized assets to public/');
