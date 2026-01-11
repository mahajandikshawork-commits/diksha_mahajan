#!/bin/bash

# Convert remaining .mov files that weren't converted due to spaces in filenames
echo "Converting remaining videos with proper path handling..."
echo "================================"

# Array of files to convert (with proper quoting)
files=(
    "public/products/Chaand Saaya/Chaand saya.mov"
    "public/products/Crimson Whispers/Crimson Whispers.mov"
    "public/products/Evening wine/Evening wine.mov"
    "public/products/Mint Sovereign/Mint sovereign.mov"
    "public/products/Ombre_Mirage/Ombré mirage.mov"
    "public/products/Ruhani/Ruhani.mov"
    "public/products/The Blue Affairè/The Blue Affaire.mov"
    "public/products/feathered_rose/Feathered Rose.mov"
    "public/products/glided_grace/Glided Grace_.mov"
    "public/products/gulaabi_noor/gulabi noor.mov"
    "public/products/silver_lullaby/Silver Lullaby.mov"
)

for file in "${files[@]}"; do
    # Check if file exists
    if [ ! -f "$file" ]; then
        echo "⏭️  Skipping (not found): $file"
        continue
    fi
    
    # Get output filename
    output="${file%.mov}.mp4"
    
    # Skip if already converted
    if [ -f "$output" ]; then
        echo "⏭️  Already exists: $output"
        continue
    fi
    
    echo "🎬 Converting: $file"
    
    ffmpeg -i "$file" \
        -c:v libx264 \
        -preset slow \
        -crf 23 \
        -movflags +faststart \
        -c:a aac \
        -b:a 128k \
        "$output" \
        -y \
        -loglevel error -stats
    
    if [ $? -eq 0 ]; then
        original_size=$(du -h "$file" | cut -f1)
        new_size=$(du -h "$output" | cut -f1)
        echo "   ✅ Done! $original_size → $new_size"
    else
        echo "   ❌ Failed"
    fi
    echo ""
done

echo "================================"
echo "✨ All videos converted!"
