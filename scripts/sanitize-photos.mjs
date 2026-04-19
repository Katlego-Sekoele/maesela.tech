import { mkdir, readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const IMAGE_RE = /\.(jpe?g|png|webp|avif)$/i;

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkFiles(fullPath);
    return fullPath;
  }));
  return nested.flat();
}

function getFormat(filepath) {
  const ext = path.extname(filepath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'jpeg';
  if (ext === '.png') return 'png';
  if (ext === '.webp') return 'webp';
  if (ext === '.avif') return 'avif';
  return null;
}

async function sanitizeFile(inputPath, inputRoot, outputRoot) {
  const format = getFormat(inputPath);
  if (!format) return false;

  const inputBuffer = await readFile(inputPath);
  const image = sharp(inputBuffer).rotate();
  let outputBuffer;

  if (format === 'jpeg') outputBuffer = await image.jpeg({ quality: 92 }).toBuffer();
  if (format === 'png') outputBuffer = await image.png({ compressionLevel: 9 }).toBuffer();
  if (format === 'webp') outputBuffer = await image.webp({ quality: 92 }).toBuffer();
  if (format === 'avif') outputBuffer = await image.avif({ quality: 50 }).toBuffer();

  // Intentionally do not call withMetadata(): this strips EXIF/location/device metadata.
  const relative = path.relative(inputRoot, inputPath);
  const outputPath = path.join(outputRoot, relative);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, outputBuffer);
  return true;
}

async function main() {
  const inputRoot = process.argv[2];
  const outputRoot = process.argv[3];

  if (!inputRoot || !outputRoot) {
    console.error('Usage: npm run photos:sanitize -- <inputDir> <outputDir>');
    process.exit(1);
  }

  const allFiles = await walkFiles(inputRoot);
  const imageFiles = allFiles.filter((file) => IMAGE_RE.test(file));
  let sanitized = 0;

  for (const file of imageFiles) {
    const wrote = await sanitizeFile(file, inputRoot, outputRoot);
    if (wrote) sanitized += 1;
  }

  console.log(`Sanitized ${sanitized} files to ${outputRoot}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
