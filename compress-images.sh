#!/bin/bash

# Compress images over 10MB to 85% quality
# This will reduce file sizes while maintaining good visual quality

echo "Finding and compressing images over 10MB..."

# Find all images over 10MB
find "/Users/ayushmangal/work/diksha_mahajan/public/products" -type f \( -name "*.jpeg" -o -name "*.jpg" -o -name "*.JPEG" -o -name "*.JPG" \) -size +10M | while read file; do
    echo "Compressing: $file"
    original_size=$(ls -lh "$file" | awk '{print $5}')
    
    # Create backup
    cp "$file" "${file}.backup"
    
    # Compress using sips (85% quality, max dimension 3000px)
    sips -s format jpeg -s formatOptions 85 --resampleHeightWidthMax 3000 "$file" --out "$file" > /dev/null 2>&1
    
    new_size=$(ls -lh "$file" | awk '{print $5}')
    echo "  $original_size -> $new_size"
done

echo "Compression complete!"
