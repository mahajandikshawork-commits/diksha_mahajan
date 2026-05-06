#!/bin/bash

# Script to replace original videos with compressed versions
# WARNING: This will modify your video files. Make sure you've reviewed the compressed versions first!

echo "⚠️  WARNING: This will replace original videos with compressed versions"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

echo "Creating backups..."
mkdir -p video_backups

# Function to replace video
replace_video() {
    compressed="$1"
    
    # Get original filename (remove _compressed suffix)
    dir=$(dirname "$compressed")
    filename=$(basename "$compressed")
    name="${filename%_compressed.*}"
    ext="${filename##*.}"
    original="${dir}/${name}.${ext}"
    
    if [ ! -f "$original" ]; then
        echo "Original not found for: $compressed"
        return
    fi
    
    # Backup original
    backup_name="video_backups/$(date +%Y%m%d)_${name}.${ext}"
    cp "$original" "$backup_name"
    echo "Backed up: $original → $backup_name"
    
    # Replace with compressed version
    mv "$compressed" "$original"
    echo "Replaced: $original"
    echo ""
}

# Replace all compressed videos
find public -type f \( -name "*_compressed.mp4" -o -name "*_compressed.MP4" \) | while read video; do
    replace_video "$video"
done

echo "=== Replacement Complete ==="
echo "Original videos backed up to: video_backups/"
echo ""
echo "File size comparison:"
du -sh public/videos public/products
