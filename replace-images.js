#!/usr/bin/env node

/**
 * Replace original images with compressed versions
 * WARNING: This modifies your image files. Ensure you've reviewed compressed versions first!
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Find all compressed images
function findCompressedImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findCompressedImages(filePath, fileList);
    } else if (/_compressed\.(jpe?g|png|JPE?G|PNG)$/i.test(file)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Replace image
function replaceImage(compressedPath) {
  const dir = path.dirname(compressedPath);
  const filename = path.basename(compressedPath);
  const ext = path.extname(compressedPath);
  const name = path.basename(compressedPath, ext).replace('_compressed', '');
  const originalPath = path.join(dir, `${name}${ext}`);
  const backupPath = path.join(dir, `${name}_original${ext}`);
  
  if (!fs.existsSync(originalPath)) {
    console.log(`Original not found: ${originalPath}`);
    return false;
  }
  
  try {
    // Backup original
    fs.copyFileSync(originalPath, backupPath);
    console.log(`Backed up: ${path.relative(process.cwd(), originalPath)}`);
    
    // Replace with compressed
    fs.copyFileSync(compressedPath, originalPath);
    console.log(`Replaced: ${path.relative(process.cwd(), originalPath)}`);
    
    // Delete compressed version
    fs.unlinkSync(compressedPath);
    
    console.log('');
    return true;
  } catch (error) {
    console.error(`Failed to replace ${originalPath}: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('⚠️  WARNING: This will replace original images with compressed versions\n');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const answer = await new Promise(resolve => {
    rl.question('Continue? (yes/no): ', resolve);
  });
  
  rl.close();
  
  if (answer.toLowerCase() !== 'yes') {
    console.log('Cancelled.');
    return;
  }
  
  console.log('\nCreating backups and replacing images...\n');
  
  const publicDir = path.join(process.cwd(), 'public');
  const compressedImages = findCompressedImages(publicDir);
  
  console.log(`Found ${compressedImages.length} compressed images\n`);
  
  let successCount = 0;
  for (const imagePath of compressedImages) {
    if (replaceImage(imagePath)) {
      successCount++;
    }
  }
  
  console.log('=== Replacement Complete ===');
  console.log(`Successfully replaced: ${successCount} images`);
  console.log('Original images backed up with _original suffix');
  console.log('\nTo restore originals, rename files from *_original.* to original names');
}

main().catch(console.error);
