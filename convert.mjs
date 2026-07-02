import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const artifactDir = 'C:\\Users\\rajab\\.gemini\\antigravity\\brain\\721a1b7f-e8de-4a61-a1d9-481789467e7e';
const publicDir = 'c:\\Get Shit Done - Master Hack\\public\\images';

async function convertImage(pngFile, webpFile) {
  const pngPath = path.join(artifactDir, pngFile);
  const webpPath = path.join(publicDir, webpFile);
  try {
    if (fs.existsSync(pngPath)) {
      await sharp(pngPath).webp({ quality: 80 }).toFile(webpPath);
      console.log(`Converted ${pngFile} to ${webpFile}`);
    } else {
      console.log(`File not found: ${pngPath}`);
    }
  } catch (e) {
    console.error(`Error converting ${pngFile}:`, e);
  }
}

async function run() {
  const files = fs.readdirSync(artifactDir);
  const mapping = {
    'tasting_menu_plating': 'tasting_menu_plating.webp',
    'cocktail_bar': 'cocktail_bar.webp',
    'wine_sommelier': 'wine_sommelier.webp',
    'seasonal_ingredients': 'seasonal_ingredients.webp',
    'restaurant_interior': 'restaurant_interior.webp',
    'reservation_ambiance': 'reservation_ambiance.webp',
  };

  for (const file of files) {
    for (const [prefix, output] of Object.entries(mapping)) {
      if (file.startsWith(prefix) && file.endsWith('.png')) {
        await convertImage(file, output);
      }
    }
  }
}

run();
