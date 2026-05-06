#!/bin/bash

# Video compression script for Diksha Mahajan website
# This script compresses all MP4 videos to reduce file size while maintaining quality

echo "Starting video compression..."
echo "This will create compressed versions with '_compressed' suffix"
echo ""

# Create backup directory
mkdir -p video_backups

# Function to compress a single video
compress_video() {
    input_file="$1"
    dir=$(dirname "$input_file")
    filename=$(basename "$input_file")
    name="${filename%.*}"
    ext="${filename##*.}"
    output_file="${dir}/${name}_compressed.${ext}"
    
    # Skip if already compressed
    if [[ "$filename" == *"_compressed"* ]]; then
        echo "Skipping already compressed: $filename"
        return
    fi
    
    echo "Compressing: $input_file"
    
    # Get original file size
    original_size=$(du -h "$input_file" | cut -f1)
    
    # Compress video
    ffmpeg -i "$input_file" \
        -c:v libx264 \
        -crf 28 \
        -preset slow \
        -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -y \
        "$output_file" 2>&1 | grep -E "frame=|size=|time=" | tail -1
    
    if [ $? -eq 0 ]; then
        new_size=$(du -h "$output_file" | cut -f1)
        echo "✓ Compressed: $original_size → $new_size"
        echo "  Original: $input_file"
        echo "  Compressed: $output_file"
        echo ""
    else
        echo "✗ Failed to compress: $input_file"
        echo ""
    fi
}

# Compress hero videos
echo "=== Compressing Hero Videos ==="
for video in public/videos/*.mp4 public/videos/*.MP4; do
    [ -f "$video" ] && compress_video "$video"
done

echo ""
echo "=== Compressing Product Videos ==="
# Compress product videos
find public/products -type f \( -name "*.mp4" -o -name "*.MP4" \) | while read video; do
    compress_video "$video"
done

echo ""
echo "=== Compression Complete ==="
echo ""
echo "Next steps:"
echo "1. Review the compressed videos to ensure quality is acceptable"
echo "2. If satisfied, replace original files with compressed versions:"
echo "   - Rename original files (add _original suffix)"
echo "   - Rename compressed files (remove _compressed suffix)"
echo "3. Update data/products.json if needed"
echo ""
echo "To replace all videos automatically, run:"
echo "  bash replace-videos.sh"
