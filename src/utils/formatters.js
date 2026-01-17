/**
 * Format a date as "X minutes ago", "X hours ago", etc.
 * @param {string} dateString - ISO date string
 * @returns {string} Human-readable time ago string
 */
export function formatTimeAgo(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hr${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  // Fallback to date format
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get a placeholder image URL based on source
 * @param {string} source - News source name
 * @returns {string} Placeholder image URL
 */
export function getPlaceholderImage(source) {
  // Generate a gradient placeholder with source-specific colors
  const colors = {
    TechCrunch: ['22c55e', '16a34a'],
    'Hacker News': ['f97316', 'ea580c'],
    'Dev.to': ['6366f1', '4f46e5'],
    'The Verge': ['ec4899', 'db2777'],
    'Ars Technica': ['0ea5e9', '0284c7'],
  };

  const [color1, color2] = colors[source] || ['374151', '1f2937'];

  // Use a placeholder service with gradient
  return `https://placehold.co/800x450/${color1}/${color2}?text=${encodeURIComponent(source || 'TrendRadar')}`;
}

/**
 * Truncate text to a maximum length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
