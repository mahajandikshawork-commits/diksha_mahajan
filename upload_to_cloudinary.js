const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to find all MP4 files recursively
async function findMP4Files(dir, fileList = []) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      await findMP4Files(filePath, fileList);
    } else if (path.extname(file).toLowerCase() === '.mp4') {
      fileList.push(filePath);
    }
  }

  return fileList;
}

// Function to upload video to Cloudinary
async function uploadVideo(filePath) {
  const relativePath = filePath.replace('public/', '');
  const publicId = relativePath.replace('.mp4', '').replace(/\//g, '_');
  
  console.log(`\n📹 Uploading: ${path.basename(filePath)}`);
  console.log(`   Path: ${relativePath}`);
  console.log(`   Public ID: ${publicId}`);

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'video',
      public_id: publicId,
      folder: 'diksha_mahajan',
      overwrite: true,
      // Video transformation settings for optimization
      eager: [
        { 
          quality: 'auto',
          fetch_format: 'auto',
        }
      ],
      eager_async: true,
    });

    console.log(`   ✅ Uploaded successfully`);
    console.log(`   URL: ${result.secure_url}`);
    
    return {
      localPath: relativePath,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
      format: result.format,
    };
  } catch (error) {
    console.error(`   ❌ Upload failed: ${error.message}`);
    return null;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting Cloudinary video upload...');
  console.log('=========================================\n');

  // Check if credentials are configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Error: Cloudinary credentials not configured!');
    console.error('Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local');
    process.exit(1);
  }

  try {
    // Find all MP4 files
    console.log('🔍 Finding all MP4 files...\n');
    const mp4Files = await findMP4Files('public');
    console.log(`Found ${mp4Files.length} video files\n`);

    // Upload all videos
    const results = [];
    for (const filePath of mp4Files) {
      const result = await uploadVideo(filePath);
      if (result) {
        results.push(result);
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Save mapping to JSON file
    const mapping = {};
    results.forEach(result => {
      mapping[result.localPath] = result.cloudinaryUrl;
    });

    fs.writeFileSync(
      'cloudinary_mapping.json',
      JSON.stringify(mapping, null, 2)
    );

    console.log('\n=========================================');
    console.log('✨ Upload complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   Total files: ${mp4Files.length}`);
    console.log(`   Uploaded: ${results.length}`);
    console.log(`   Failed: ${mp4Files.length - results.length}`);
    console.log(`\n💾 URL mapping saved to: cloudinary_mapping.json`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
