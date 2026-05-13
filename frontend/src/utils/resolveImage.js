export const resolveImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://via.placeholder.com/400';
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/uploads')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${apiUrl}${imageUrl}`;
  }
  // Local public assets (e.g. /images/products/...)
  return imageUrl;
};
