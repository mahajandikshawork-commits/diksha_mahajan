// Cloudinary utility functions

/**
 * Check if a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com');
}

/**
 * Get optimized Cloudinary video URL with transformations
 */
export function getOptimizedVideoUrl(url: string, options?: {
  quality?: 'auto' | 'low' | 'medium' | 'high';
  format?: 'auto' | 'mp4' | 'webm';
  width?: number;
}): string {
  if (!isCloudinaryUrl(url)) {
    return url; // Return original URL if not Cloudinary
  }

  const { quality = 'auto', format = 'auto', width } = options || {};
  
  // Parse Cloudinary URL
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  // Build transformation string
  const transformations = [];
  
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  if (width) transformations.push(`w_${width}`);
  
  // Add transformations to URL
  const transformString = transformations.join(',');
  return `${parts[0]}/upload/${transformString}/${parts[1]}`;
}

/**
 * Get video thumbnail URL from Cloudinary
 */
export function getVideoThumbnail(url: string, options?: {
  width?: number;
  height?: number;
  time?: number; // seconds into video
}): string {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  const { width = 400, height = 300, time = 0 } = options || {};
  
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  // Generate thumbnail transformation
  const transformString = `so_${time},w_${width},h_${height},c_fill,f_jpg,q_auto`;
  
  // Replace video extension with .jpg for thumbnail
  const videoPath = parts[1].replace(/\.(mp4|webm|mov)$/, '.jpg');
  
  return `${parts[0]}/upload/${transformString}/${videoPath}`;
}

/**
 * Preload Cloudinary video for faster playback
 */
export function preloadCloudinaryVideo(url: string): void {
  if (typeof window === 'undefined' || !isCloudinaryUrl(url)) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'video';
  link.href = getOptimizedVideoUrl(url);
  document.head.appendChild(link);
}
