/**
 * Optimizes a Cloudinary image URL by adding transformation parameters.
 * @param url The original Cloudinary URL
 * @param options Transformation options
 * @returns The optimized URL
 */
export function getOptimizedImage(url: string | undefined, options: { width?: number; quality?: number; height?: number } = {}) {
  if (!url) return "/placeholder.jpg";
  if (!url.includes("cloudinary.com")) return url;

  const { width = 800, quality = 80, height } = options;
  
  // Cloudinary transformation string
  const transform = `c_fill,g_auto,w_${width},q_${quality},f_auto${height ? `,h_${height}` : ""}`;
  
  // Insert transformation after /upload/
  if (url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/${transform}/`);
  }
  
  return url;
}

/**
 * Specifically for thumbnails (listings)
 */
export function getThumbnail(url: string | undefined) {
  return getOptimizedImage(url, { width: 400, quality: 60 });
}
