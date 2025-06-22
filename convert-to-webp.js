import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageDirs = [
  path.join(__dirname, 'public', 'lovable-uploads'),
  __dirname // project root
];

const exts = ['.png', '.jpg', '.jpeg'];

async function convertToWebP(filePath) {
  const outPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp');
  try {
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(outPath);
    console.log(`Converted: ${filePath} -> ${outPath}`);
  } catch (err) {
    console.error(`Failed to convert ${filePath}:`, err.message);
  }
}

function findImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => exts.includes(path.extname(f).toLowerCase()))
    .map(f => path.join(dir, f));
}

(async () => {
  for (const dir of imageDirs) {
    const images = findImages(dir);
    for (const img of images) {
      await convertToWebP(img);
    }
  }
})(); 