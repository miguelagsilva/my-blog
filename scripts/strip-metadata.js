const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(process.cwd(), 'public', 'images', 'posts');

// Supported image formats that can contain metadata
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif'];

async function stripMetadata(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    
    // Skip SVG files (they don't have EXIF metadata)
    if (ext === '.svg') {
      return { skipped: true, reason: 'SVG' };
    }

    if (!imageExtensions.includes(ext)) {
      return { skipped: true, reason: 'unsupported format' };
    }

    // Read image, strip metadata, and write back
    await sharp(filePath)
      .withMetadata({}) // Empty metadata object strips all metadata
      .toFile(filePath + '.tmp');
    
    // Replace original with cleaned version
    fs.renameSync(filePath + '.tmp', filePath);
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir} (skipping metadata stripping)`);
    return;
  }

  const files = fs.readdirSync(dir);
  const imageFiles = files.filter(file => 
    imageExtensions.includes(path.extname(file).toLowerCase())
  );

  if (imageFiles.length === 0) {
    return;
  }

  let processed = 0;
  let errors = 0;

  for (const file of imageFiles) {
    const result = await stripMetadata(path.join(dir, file));
    if (result.success) {
      processed++;
    } else if (result.error) {
      errors++;
      console.error(`Error processing ${file}:`, result.error);
    }
  }

  if (processed > 0) {
    console.log(`✓ Stripped metadata from ${processed} image(s)`);
  }
  if (errors > 0) {
    console.error(`✗ Failed to process ${errors} image(s)`);
  }
}

// Run the script
processDirectory(imagesDir).catch(console.error);
