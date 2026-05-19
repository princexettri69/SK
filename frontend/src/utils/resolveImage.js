export const resolveImageUrl = (imageUrl) => {
  const placeholder = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231e293b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" font-weight="600" fill="%2364748b">No Image Available</text></svg>`;
  if (!imageUrl) return placeholder;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/uploads')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${apiUrl}${imageUrl}`;
  }
  // Local public assets (e.g. /images/products/...)
  return imageUrl;
};
