const fs = require('fs');
const path = require('path');

// Load the cloudinary mapping
const mappingPath = path.join(__dirname, 'cloudinary-mapping.json');
if (!fs.existsSync(mappingPath)) {
  console.error('Error: cloudinary-mapping.json not found. Please run upload-to-cloudinary.js first.');
  process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

console.log('Starting to delete uploaded files from local storage...\n');

let deletedCount = 0;
let failedCount = 0;

// Delete each file that was successfully uploaded
for (const [localPath, cloudinaryUrl] of Object.entries(mapping)) {
  const fullPath = path.join(__dirname, '../public', localPath);
  
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`✓ Deleted: ${localPath}`);
      deletedCount++;
    } else {
      console.log(`⚠ File not found (already deleted?): ${localPath}`);
    }
  } catch (error) {
    console.error(`✗ Failed to delete ${localPath}:`, error.message);
    failedCount++;
  }
}

console.log(`\n✓ Deletion complete!`);
console.log(`  Files deleted: ${deletedCount}`);
console.log(`  Files failed: ${failedCount}`);
console.log(`\nNote: Empty directories were not removed. You can manually delete them if needed.`);
