require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file
async function uploadFile(filePath, folder) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto', // Automatically detect image or video
      use_filename: true,
      unique_filename: false,
    });
    console.log(`✓ Uploaded: ${filePath} -> ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`✗ Failed to upload ${filePath}:`, error.message);
    return null;
  }
}

// Function to recursively upload directory
async function uploadDirectory(dirPath, cloudinaryFolder = '') {
  const items = fs.readdirSync(dirPath);
  const uploadedFiles = {};

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip certain directories
      if (item === 'node_modules' || item === '.git' || item === '.next') {
        continue;
      }
      
      const newFolder = cloudinaryFolder ? `${cloudinaryFolder}/${item}` : item;
      const subResults = await uploadDirectory(fullPath, newFolder);
      Object.assign(uploadedFiles, subResults);
    } else if (stat.isFile()) {
      // Only upload image and video files
      const ext = path.extname(item).toLowerCase();
      const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.tiff'];
      const videoExts = ['.mp4', '.mov', '.avi', '.webm'];
      
      if (imageExts.includes(ext) || videoExts.includes(ext)) {
        const url = await uploadFile(fullPath, cloudinaryFolder);
        if (url) {
          const relativePath = fullPath.replace(path.join(__dirname, '../public'), '');
          uploadedFiles[relativePath] = url;
        }
      }
    }
  }

  return uploadedFiles;
}

// Main function
async function main() {
  console.log('Starting Cloudinary upload...\n');
  
  const publicDir = path.join(__dirname, '../public');
  const results = await uploadDirectory(publicDir, 'diksha-mahajan');
  
  // Save mapping to a JSON file
  const mappingPath = path.join(__dirname, 'cloudinary-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(results, null, 2));
  
  console.log(`\n✓ Upload complete! Mapping saved to ${mappingPath}`);
  console.log(`Total files uploaded: ${Object.keys(results).length}`);
}

// Run the script
main().catch(console.error);
