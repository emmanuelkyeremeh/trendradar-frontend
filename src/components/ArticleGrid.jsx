import { formatTimeAgo, getPlaceholderImage } from '../utils/formatters.js';

/**
 * Grid of article cards
 */
export function ArticleGrid({ articles }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {articles.map((article, index) => (
        <ArticleCard key={article.url || index} article={article} />
      ))}
    </div>
  );
}

function ArticleCard({ article }) {
  const imageUrl = article.image || getPlaceholderImage(article.source);
  const timeAgo = formatTimeAgo(article.published);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      {/* Image */}
      <div className="aspect-[16/10] rounded-lg overflow-hidden mb-3 relative">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = getPlaceholderImage(article.source);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Category + Time */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[#00D084] text-xs font-bold uppercase tracking-wide">
          {article.category || article.source}
        </span>
        <span className="text-gray-500 text-xs">{timeAgo}</span>
      </div>

      {/* Title */}
      <h3 className="text-white font-bold text-lg leading-snug group-hover:text-[#00D084] transition-colors line-clamp-2">
        {article.title}
      </h3>
    </a>
  );
}
