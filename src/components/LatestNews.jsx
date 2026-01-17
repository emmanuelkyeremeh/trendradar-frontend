import { formatTimeAgo, getPlaceholderImage } from '../utils/formatters.js';

/**
 * Latest news list with thumbnails
 */
export function LatestNews({ articles, showAll = false }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        No articles available
      </div>
    );
  }

  const displayArticles = showAll ? articles : articles.slice(0, 8);

  return (
    <div className="space-y-0 divide-y divide-gray-800">
      {displayArticles.map((article, index) => (
        <NewsItem key={article.url || index} article={article} />
      ))}
    </div>
  );
}

function NewsItem({ article }) {
  const imageUrl = article.image || getPlaceholderImage(article.source);
  const timeAgo = formatTimeAgo(article.published);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 py-4 hover:bg-gray-900/30 transition-colors -mx-2 px-2 rounded"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-24 h-16 rounded overflow-hidden">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = getPlaceholderImage(article.source);
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Category + Source */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#00D084] text-xs font-bold uppercase">
            {article.category || article.source}
          </span>
          <span className="text-gray-600 text-xs">•</span>
          <span className="text-gray-500 text-xs">{timeAgo}</span>
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-[#00D084] transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Source Badge */}
        <div className="mt-1 text-xs text-gray-600 uppercase">
          {article.source}
        </div>
      </div>
    </a>
  );
}
