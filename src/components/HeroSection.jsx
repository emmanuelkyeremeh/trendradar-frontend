import { formatTimeAgo, getPlaceholderImage } from '../utils/formatters.js';

/**
 * Hero section with featured article
 */
export function HeroSection({ article }) {
  if (!article) return null;

  const imageUrl = article.image || getPlaceholderImage(article.source);
  const timeAgo = formatTimeAgo(article.published);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative overflow-hidden rounded-xl"
    >
      {/* Background Image */}
      <div className="aspect-[16/9] relative">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = getPlaceholderImage(article.source);
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {/* Category Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#00D084] text-black text-xs font-bold uppercase tracking-wide">
              {article.category || article.source}
            </span>
            <span className="text-gray-300 text-sm">{timeAgo}</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-3 group-hover:text-[#00D084] transition-colors">
            {article.title}
          </h2>

          {/* Description */}
          {article.content && (
            <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-2xl">
              {article.content}
            </p>
          )}

          {/* Source */}
          <div className="mt-4 text-xs text-gray-400 uppercase tracking-wider">
            {article.source}
          </div>
        </div>
      </div>
    </a>
  );
}
