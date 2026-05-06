#!/usr/bin/env node

/**
 * Image Compression Script using Sharp
 * Optimizes JPEG/PNG images and creates WebP versions
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const CONFIG = {
  jpegQuality: 85,
  pngQuality: 85,
  webpQuality: 85,
  maxWidth: 2048,
  createWebP: true,
};

// Find all images
function findImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findImages(filePath, fileList);
    } else if (/\.(jpe?g|png|JPE?G|PNG)$/i.test(file) && !file.includes('_original') && !file.includes('_compressed')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Get file size
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  const mb = (stats.size / (1024 * 1024)).toFixed(2);
  return `${mb}MB`;
}

// Compress single image
async function compressImage(inputPath) {
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const name = path.basename(inputPath, ext);
  const outputPath = path.join(dir, `${name}_compressed${ext}`);
  const webpPath = path.join(dir, `${name}.webp`);
  
  const originalSize = getFileSize(inputPath);
  
  try {
    console.log(`Compressing: ${path.relative(process.cwd(), inputPath)}`);
    
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Resize if needed
    if (metadata.width > CONFIG.maxWidth) {
      image.resize(CONFIG.maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    // Compress based on format
    if (/jpe?g$/i.test(ext)) {
      await image
        .jpeg({ quality: CONFIG.jpegQuality, progressive: true })
        .toFile(outputPath);
    } else if (/png$/i.test(ext)) {
      await image
        .png({ quality: CONFIG.pngQuality, compressionLevel: 9 })
        .toFile(outputPath);
    }
    
    const compressedSize = getFileSize(outputPath);
    const originalBytes = fs.statSync(inputPath).size;
    const compressedBytes = fs.statSync(outputPath).size;
    const savings = ((1 - compressedBytes / originalBytes) * 100).toFixed(1);
    
    console.log(`  ✓ ${originalSize} → ${compressedSize} (${savings}% reduction)`);
    
    // Create WebP version
    if (CONFIG.createWebP) {
      await sharp(inputPath)
        .resize(CONFIG.maxWidth, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: CONFIG.webpQuality })
        .toFile(webpPath);
      
      const webpSize = getFileSize(webpPath);
      const webpBytes = fs.statSync(webpPath).size;
      const webpSavings = ((1 - webpBytes / originalBytes) * 100).toFixed(1);
      console.log(`  ✓ WebP: ${webpSize} (${webpSavings}% reduction)`);
    }
    
    console.log('');
    
    return {
      original: inputPath,
      compressed: outputPath,
      webp: CONFIG.createWebP ? webpPath : null,
      originalSize: originalBytes,
      compressedSize: compressedBytes,
      webpSize: CONFIG.createWebP ? fs.statSync(webpPath).size : 0,
    };
  } catch (error) {
    console.error(`  ✗ Failed: ${error.message}`);
    console.log('');
    return null;
  }
}

// Main function
async function main() {
  console.log('=== Image Compression Tool (Sharp) ===\n');
  
  console.log('Configuration:');
  console.log(`  JPEG Quality: ${CONFIG.jpegQuality}%`);
  console.log(`  PNG Quality: ${CONFIG.pngQuality}%`);
  console.log(`  WebP Quality: ${CONFIG.webpQuality}%`);
  console.log(`  Max Width: ${CONFIG.maxWidth}px`);
  console.log(`  Create WebP: ${CONFIG.createWebP ? 'Yes' : 'No'}`);
  console.log('');
  
  const publicDir = path.join(process.cwd(), 'public');
  const images = findImages(publicDir);
  
  console.log(`Found ${images.length} images to compress\n`);
  
  if (images.length === 0) {
    console.log('No images found.');
    return;
  }
  
  const results = [];
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  let totalWebPSize = 0;
  
  for (const imagePath of images) {
    const result = await compressImage(imagePath);
    if (result) {
      results.push(result);
      totalOriginalSize += result.originalSize;
      totalCompressedSize += result.compressedSize;
      totalWebPSize += result.webpSize;
    }
  }
  
  console.log('=== Compression Summary ===');
  console.log(`Processed: ${results.length} images`);
  console.log(`Original total: ${(totalOriginalSize / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`Compressed total: ${(totalCompressedSize / (1024 * 1024)).toFixed(2)}MB`);
  if (CONFIG.createWebP) {
    console.log(`WebP total: ${(totalWebPSize / (1024 * 1024)).toFixed(2)}MB`);
  }
  const totalSavings = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1);
  console.log(`Total savings: ${totalSavings}% (${((totalOriginalSize - totalCompressedSize) / (1024 * 1024)).toFixed(2)}MB saved)`);
  console.log('');
  
  console.log('Next steps:');
  console.log('1. Review compressed images in your file explorer');
  console.log('2. Run: node replace-images.js (to replace originals)');
  console.log('3. Consider using WebP images for better performance');
}

main().catch(console.error);
