/**
 * Trending topics chart (Billboard Hot 100 style)
 */
export function TrendingChart({ trends, expanded = false }) {
  if (!trends || trends.length === 0) {
    return (
      <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-black text-white mb-4 uppercase tracking-wide">
          TRENDING
        </h3>
        <p className="text-gray-500 text-sm">No trending topics yet</p>
      </div>
    );
  }

  const displayTrends = expanded ? trends : trends.slice(0, 5);

  return (
    <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
      <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wide">
        TRENDING
      </h3>

      <div className="space-y-4">
        {displayTrends.map((trend, index) => (
          <div key={trend.topic} className="flex items-center gap-4">
            {/* Rank */}
            <div className="flex-shrink-0 w-8 text-2xl font-black text-[#00D084]">
              {index + 1}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold truncate">{trend.topic}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{trend.mentions} mentions</span>
                <span>•</span>
                <span
                  className={`uppercase font-medium ${
                    trend.sentiment === 'positive'
                      ? 'text-green-400'
                      : trend.sentiment === 'negative'
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}
                >
                  {trend.sentiment}
                </span>
              </div>
            </div>

            {/* Bar indicator */}
            <div className="flex-shrink-0 w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00D084] rounded-full"
                style={{
                  width: `${Math.min(100, (trend.mentions / Math.max(...trends.map((t) => t.mentions))) * 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {!expanded && trends.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-800 text-center">
          <span className="text-xs text-gray-500">
            +{trends.length - 5} more topics
          </span>
        </div>
      )}
    </div>
  );
}
