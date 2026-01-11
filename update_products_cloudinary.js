const fs = require('fs');

// Read the cloudinary mapping
const mapping = JSON.parse(fs.readFileSync('cloudinary_mapping.json', 'utf8'));

// Read products.json
const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

let updatedCount = 0;

// Update each product's mediaSrc
products.forEach(product => {
  if (product.mediaSrc) {
    const localPath = product.mediaSrc.replace(/^\//, '');
    
    if (mapping[localPath]) {
      console.log(`✅ Updating: ${product.name}`);
      console.log(`   From: ${product.mediaSrc}`);
      console.log(`   To: ${mapping[localPath]}`);
      product.mediaSrc = mapping[localPath];
      updatedCount++;
    } else {
      console.log(`⚠️  No mapping found for: ${product.name} (${localPath})`);
    }
  }
});

// Write updated products.json
fs.writeFileSync('data/products.json', JSON.stringify(products, null, 2));

console.log(`\n✨ Updated ${updatedCount} products with Cloudinary URLs`);
