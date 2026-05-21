/**
 * Convert relative or absolute image URLs to correct backend URL
 * Handles both Cloudinary URLs and local server uploads
 */
export const getImageUrl = (
  imageUrl: string | null | undefined,
): string | undefined => {
  if (!imageUrl) {
    return undefined;
  }

  // If it's already a full URL (http/https), return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  // If it's a relative path (e.g., /uploads/filename.png),
  // keep it same-origin so the load balancer can proxy requests.
  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

  // Fallback: return as is
  return imageUrl;
};
