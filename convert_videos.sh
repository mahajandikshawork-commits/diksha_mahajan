#!/bin/bash

# Batch convert all .mov files to optimized .mp4
# This script will:
# 1. Convert to H.264 codec (better browser support)
# 2. Compress videos (CRF 23 = high quality, smaller size)
# 3. Add faststart flag for web streaming
# 4. Keep original files as backup

echo "Starting video conversion..."
echo "================================"

# Find all .mov files and convert them
find public/products -name "*.mov" -type f | while read -r file; do
    # Get directory and filename without extension
    dir=$(dirname "$file")
    filename=$(basename "$file" .mov)
    
    # Output file path
    output="${dir}/${filename}.mp4"
    
    # Skip if mp4 already exists
    if [ -f "$output" ]; then
        echo "⏭️  Skipping (already exists): $output"
        continue
    fi
    
    echo "🎬 Converting: $file"
    echo "   → $output"
    
    # Convert with optimizations:
    # -c:v libx264: H.264 codec (best browser support)
    # -preset slow: Better compression (takes longer but smaller file)
    # -crf 23: Quality (18=high, 28=medium, lower=better quality)
    # -movflags +faststart: Optimize for web streaming
    # -c:a aac: Audio codec
    # -b:a 128k: Audio bitrate
    ffmpeg -i "$file" \
        -c:v libx264 \
        -preset slow \
        -crf 23 \
        -movflags +faststart \
        -c:a aac \
        -b:a 128k \
        "$output" \
        -y \
        2>&1 | grep -E "Duration|time=|error" || true
    
    if [ $? -eq 0 ]; then
        # Get file sizes
        original_size=$(du -h "$file" | cut -f1)
        new_size=$(du -h "$output" | cut -f1)
        echo "   ✅ Done! Original: $original_size → New: $new_size"
    else
        echo "   ❌ Error converting $file"
    fi
    echo ""
done

echo "================================"
echo "✨ Conversion complete!"
echo ""
echo "Next steps:"
echo "1. Update products.json to use .mp4 instead of .mov"
echo "2. Test the videos on your site"
echo "3. If everything works, you can delete the .mov files"
