const fs = require('fs');
const path = require('path');

// Load the cloudinary mapping
const mappingPath = path.join(__dirname, 'cloudinary-mapping.json');
if (!fs.existsSync(mappingPath)) {
  console.error('Error: cloudinary-mapping.json not found. Please run upload-to-cloudinary.js first.');
  process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Function to replace paths in an object
function replacePaths(obj) {
  if (typeof obj === 'string') {
    // Check if this string is a path that needs to be replaced
    for (const [localPath, cloudinaryUrl] of Object.entries(mapping)) {
      if (obj === localPath || obj === localPath.replace(/\\/g, '/')) {
        return cloudinaryUrl;
      }
    }
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(item => replacePaths(item));
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = replacePaths(value);
    }
    return newObj;
  }
  return obj;
}

// Update products.json
const productsPath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const updatedProducts = replacePaths(products);
fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));
console.log('✓ Updated products.json');

// Update spotlight.json
const spotlightPath = path.join(__dirname, '../data/spotlight.json');
const spotlight = JSON.parse(fs.readFileSync(spotlightPath, 'utf8'));
const updatedSpotlight = replacePaths(spotlight);
fs.writeFileSync(spotlightPath, JSON.stringify(updatedSpotlight, null, 2));
console.log('✓ Updated spotlight.json');

console.log('\n✓ All JSON files updated with Cloudinary URLs!');
