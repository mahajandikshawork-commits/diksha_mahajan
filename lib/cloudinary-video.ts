/**
 * Cloudinary Video Optimization Utilities
 * Adds transformations to Cloudinary video URLs for better performance
 */

export function optimizeCloudinaryVideo(url: string, options?: {
  quality?: 'auto' | 'auto:low' | 'auto:good' | 'auto:best';
  format?: 'auto' | 'mp4' | 'webm';
  width?: number;
  height?: number;
}): string {
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  const {
    quality = 'auto:good',
    format = 'auto',
    width,
    height
  } = options || {};

  // Parse the URL
  const urlParts = url.split('/upload/');
  if (urlParts.length !== 2) {
    return url;
  }

  // Build transformation string
  const transformations: string[] = [];
  
  // Quality optimization
  transformations.push(`q_${quality}`);
  
  // Format optimization (auto will choose best format for browser)
  transformations.push(`f_${format}`);
  
  // Dimensions if specified
  if (width) {
    transformations.push(`w_${width}`);
  }
  if (height) {
    transformations.push(`h_${height}`);
  }
  
  // Add streaming profile for better playback
  transformations.push('sp_hd');
  
  // Combine transformations
  const transformString = transformations.join(',');
  
  // Reconstruct URL with transformations
  return `${urlParts[0]}/upload/${transformString}/${urlParts[1]}`;
}

/**
 * Get optimized video URL for hero sections
 */
export function getHeroVideoUrl(url: string): string {
  return optimizeCloudinaryVideo(url, {
    quality: 'auto:good',
    format: 'auto',
  });
}

/**
 * Get optimized video URL for product cards
 */
export function getProductVideoUrl(url: string): string {
  return optimizeCloudinaryVideo(url, {
    quality: 'auto:good',
    format: 'auto',
  });
}

/**
 * Get optimized video URL for mobile
 */
export function getMobileVideoUrl(url: string): string {
  return optimizeCloudinaryVideo(url, {
    quality: 'auto:low',
    format: 'auto',
    width: 1080, // Max mobile width
  });
}
