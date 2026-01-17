/**
 * Source breakdown showing articles by source
 */
export function SourceBreakdown({ articles }) {
  if (!articles || articles.length === 0) return null;

  const sourceCounts = {};
  articles.forEach((article) => {
    sourceCounts[article.source] = (sourceCounts[article.source] || 0) + 1;
  });

  const sources = Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
      <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wide">
        BY SOURCE
      </h3>
      <div className="space-y-4">
        {sources.map(({ source, count }) => (
          <div key={source} className="flex items-center justify-between">
            <span className="text-white font-medium">{source}</span>
            <div className="flex items-center gap-3">
              <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00D084] rounded-full"
                  style={{
                    width: `${(count / articles.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-gray-400 text-sm w-12 text-right">{count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
