#!/usr/bin/env node

/**
 * Image Compression Script for Diksha Mahajan Website
 * 
 * This script:
 * 1. Finds all JPEG/JPG/PNG images in public folder
 * 2. Creates optimized versions (reduced quality, smaller size)
 * 3. Optionally converts to WebP format
 * 4. Preserves originals with _original suffix
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  quality: 85, // JPEG quality (0-100)
  webpQuality: 85, // WebP quality (0-100)
  maxWidth: 2048, // Max width in pixels
  createWebP: true, // Also create WebP versions
  backupOriginals: true,
};

// Check if ImageMagick is installed
function checkDependencies() {
  try {
    execSync('convert -version', { stdio: 'ignore' });
    console.log('✓ ImageMagick found');
    return true;
  } catch (error) {
    console.error('✗ ImageMagick not found. Installing...');
    console.log('Run: brew install imagemagick');
    return false;
  }
}

// Get all image files
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

// Get file size in human readable format
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  const bytes = stats.size;
  const mb = (bytes / (1024 * 1024)).toFixed(2);
  return `${mb}MB`;
}

// Compress a single image
function compressImage(inputPath) {
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const name = path.basename(inputPath, ext);
  const outputPath = path.join(dir, `${name}_compressed${ext}`);
  const webpPath = path.join(dir, `${name}.webp`);
  
  const originalSize = getFileSize(inputPath);
  
  try {
    // Compress JPEG/PNG
    console.log(`Compressing: ${path.relative(process.cwd(), inputPath)}`);
    
    const isJPEG = /jpe?g$/i.test(ext);
    
    if (isJPEG) {
      // JPEG compression
      execSync(
        `convert "${inputPath}" -strip -interlace Plane -quality ${CONFIG.quality} -resize "${CONFIG.maxWidth}x>" "${outputPath}"`,
        { stdio: 'ignore' }
      );
    } else {
      // PNG compression
      execSync(
        `convert "${inputPath}" -strip -resize "${CONFIG.maxWidth}x>" -quality ${CONFIG.quality} "${outputPath}"`,
        { stdio: 'ignore' }
      );
    }
    
    const compressedSize = getFileSize(outputPath);
    const savings = ((1 - fs.statSync(outputPath).size / fs.statSync(inputPath).size) * 100).toFixed(1);
    
    console.log(`  ✓ ${originalSize} → ${compressedSize} (${savings}% reduction)`);
    
    // Create WebP version
    if (CONFIG.createWebP) {
      execSync(
        `convert "${inputPath}" -strip -resize "${CONFIG.maxWidth}x>" -quality ${CONFIG.webpQuality} "${webpPath}"`,
        { stdio: 'ignore' }
      );
      const webpSize = getFileSize(webpPath);
      console.log(`  ✓ WebP created: ${webpSize}`);
    }
    
    console.log('');
    
    return {
      original: inputPath,
      compressed: outputPath,
      webp: CONFIG.createWebP ? webpPath : null,
      originalSize: fs.statSync(inputPath).size,
      compressedSize: fs.statSync(outputPath).size,
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
  console.log('=== Image Compression Tool ===\n');
  
  if (!checkDependencies()) {
    process.exit(1);
  }
  
  console.log('\nConfiguration:');
  console.log(`  Quality: ${CONFIG.quality}%`);
  console.log(`  Max Width: ${CONFIG.maxWidth}px`);
  console.log(`  Create WebP: ${CONFIG.createWebP ? 'Yes' : 'No'}`);
  console.log('');
  
  // Find all images
  const publicDir = path.join(process.cwd(), 'public');
  const images = findImages(publicDir);
  
  console.log(`Found ${images.length} images to compress\n`);
  
  if (images.length === 0) {
    console.log('No images found to compress.');
    return;
  }
  
  // Compress all images
  const results = [];
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  let totalWebPSize = 0;
  
  for (const imagePath of images) {
    const result = compressImage(imagePath);
    if (result) {
      results.push(result);
      totalOriginalSize += result.originalSize;
      totalCompressedSize += result.compressedSize;
      totalWebPSize += result.webpSize;
    }
  }
  
  // Summary
  console.log('=== Compression Summary ===');
  console.log(`Processed: ${results.length} images`);
  console.log(`Original size: ${(totalOriginalSize / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`Compressed size: ${(totalCompressedSize / (1024 * 1024)).toFixed(2)}MB`);
  if (CONFIG.createWebP) {
    console.log(`WebP size: ${(totalWebPSize / (1024 * 1024)).toFixed(2)}MB`);
  }
  console.log(`Total savings: ${((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1)}%`);
  console.log('');
  
  console.log('Next steps:');
  console.log('1. Review compressed images to ensure quality is acceptable');
  console.log('2. Run: node replace-images.js (to replace originals with compressed versions)');
  console.log('3. Update image paths in your code to use .webp where supported');
}

main().catch(console.error);
