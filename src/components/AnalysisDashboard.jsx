import { InsightsPanel } from './InsightsPanel.jsx';
import { TrendingChart } from './TrendingChart.jsx';
import { SourceBreakdown } from './SourceBreakdown.jsx';

/**
 * Enhanced AI Analysis Dashboard with comprehensive visualizations
 */
export function AnalysisDashboard({ insights, trends, articles }) {
  const totalArticles = articles.length;

  // Calculate category distribution
  const categoryCounts = {};
  articles.forEach((article) => {
    const cat = article.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const topCategories = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Calculate sentiment distribution
  const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
  trends.forEach((trend) => {
    sentimentCounts[trend.sentiment] = (sentimentCounts[trend.sentiment] || 0) + 1;
  });

  // Calculate hourly distribution
  const hourlyDistribution = {};
  articles.forEach((article) => {
    const date = new Date(article.published);
    const hour = date.getUTCHours();
    hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;
  });

  // Calculate daily distribution (last 7 days)
  const dailyDistribution = {};
  const now = new Date();
  articles.forEach((article) => {
    const date = new Date(article.published);
    const daysAgo = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (daysAgo <= 7) {
      dailyDistribution[daysAgo] = (dailyDistribution[daysAgo] || 0) + 1;
    }
  });

  // Calculate trend momentum
  const momentumCounts = { rising: 0, falling: 0, stable: 0 };
  insights.forEach((insight) => {
    if (insight.trendDirection) {
      momentumCounts[insight.trendDirection] = (momentumCounts[insight.trendDirection] || 0) + 1;
    }
  });

  // Impact score distribution
  const impactScoreDistribution = { high: 0, medium: 0, low: 0 };
  insights.forEach((insight) => {
    const score = insight.impactScore || 0;
    if (score >= 7) impactScoreDistribution.high++;
    else if (score >= 4) impactScoreDistribution.medium++;
    else impactScoreDistribution.low++;
  });

  // Top keywords from all insights
  const keywordCounts = {};
  insights.forEach((insight) => {
    if (insight.keywords) {
      insight.keywords.forEach((keyword) => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      });
    }
  });
  const topKeywords = Object.entries(keywordCounts)
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // Category vs Sentiment matrix
  const categorySentimentMatrix = {};
  articles.forEach((article) => {
    const cat = article.category || 'Other';
    const sentiment = article.sentiment || 'neutral';
    if (!categorySentimentMatrix[cat]) {
      categorySentimentMatrix[cat] = { positive: 0, negative: 0, neutral: 0 };
    }
    categorySentimentMatrix[cat][sentiment] = (categorySentimentMatrix[cat][sentiment] || 0) + 1;
  });

  // Top trending topics by mentions
  const topTrending = trends.slice(0, 10);

  // Calculate article freshness (hours since publication)
  const freshnessDistribution = { recent: 0, today: 0, yesterday: 0, older: 0 };
  articles.forEach((article) => {
    const date = new Date(article.published);
    const hoursAgo = (now - date) / (1000 * 60 * 60);
    if (hoursAgo < 6) freshnessDistribution.recent++;
    else if (hoursAgo < 24) freshnessDistribution.today++;
    else if (hoursAgo < 48) freshnessDistribution.yesterday++;
    else freshnessDistribution.older++;
  });

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111] rounded-xl p-4 border border-gray-800">
          <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Total Articles</div>
          <div className="text-3xl font-black text-white">{totalArticles}</div>
        </div>
        <div className="bg-[#111] rounded-xl p-4 border border-gray-800">
          <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Top Topics</div>
          <div className="text-3xl font-black text-white">{trends.length}</div>
        </div>
        <div className="bg-[#111] rounded-xl p-4 border border-gray-800">
          <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Sources</div>
          <div className="text-3xl font-black text-white">
            {new Set(articles.map((a) => a.source)).size}
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InsightsPanel insights={insights} articles={articles} expanded />
        <TrendingChart trends={trends} expanded />
      </div>

      {/* Top Trending Topics with Mentions Chart */}
      <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wide">
          TOP TRENDING TOPICS
        </h3>
        <div className="space-y-3">
          {topTrending.map((trend, index) => {
            const maxMentions = topTrending[0]?.mentions || 1;
            const percentage = (trend.mentions / maxMentions) * 100;
            return (
              <div key={trend.topic} className="flex items-center gap-4">
                <div className="w-8 text-lg font-black text-[#00D084]">#{index + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-bold">{trend.topic}</span>
                    <span className="text-gray-400 text-sm">{trend.mentions} mentions</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00D084] rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category vs Sentiment Matrix */}
      {Object.keys(categorySentimentMatrix).length > 0 && (
        <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wide">
            CATEGORY SENTIMENT MATRIX
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 text-gray-400 font-bold uppercase">Category</th>
                  <th className="text-center py-3 text-green-400 font-bold">Positive</th>
                  <th className="text-center py-3 text-gray-400 font-bold">Neutral</th>
                  <th className="text-center py-3 text-red-400 font-bold">Negative</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categorySentimentMatrix)
                  .sort((a, b) => {
                    const totalA = a[1].positive + a[1].neutral + a[1].negative;
                    const totalB = b[1].positive + b[1].neutral + b[1].negative;
                    return totalB - totalA;
                  })
                  .slice(0, 8)
                  .map(([category, sentiments]) => {
                    const total = sentiments.positive + sentiments.neutral + sentiments.negative;
                    return (
                      <tr key={category} className="border-b border-gray-800/50">
                        <td className="py-3 text-white font-medium">{category}</td>
                        <td className="text-center py-3 text-green-400">{sentiments.positive}</td>
                        <td className="text-center py-3 text-gray-400">{sentiments.neutral}</td>
                        <td className="text-center py-3 text-red-400">{sentiments.negative}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Impact Score Distribution */}
      {Object.values(impactScoreDistribution).some((count) => count > 0) && (
        <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wide">
            IMPACT SCORE DISTRIBUTION
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(impactScoreDistribution).map(([level, count]) => {
              if (count === 0) return null;
              const total = Object.values(impactScoreDistribution).reduce((a, b) => a + b, 0);
              const percentage = Math.round((count / total) * 100);
              const color =
                level === 'high'
                  ? 'bg-green-500'
                  : level === 'medium'
                  ? 'bg-yellow-500'
                  : 'bg-gray-500';
              return (
                <div key={level} className="text-center">
                  <div className={`w-20 h-20 rounded-full ${color} mx-auto mb-3 flex items-center justify-center`}>
                    <span className="text-2xl font-black text-white">{count}</span>
                  </div>
                  <div className="text-white font-bold uppercase tracking-wide mb-1">{level}</div>
                  <div className="text-gray-400 text-sm">{percentage}% of insights</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Distribution Chart */}
      {Object.keys(dailyDistribution).length > 0 && (
        <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wide">
            PUBLICATION TREND (LAST 7 DAYS)
          </h3>
          <div className="space-y-3">
            {Array.from({ length: 7 }, (_, i) => {
              const daysAgo = 6 - i;
              const count = dailyDistribution[daysAgo] || 0;
              const maxCount = Math.max(...Object.values(dailyDistribution), 1);
              const percentage = (count / maxCount) * 100;
              const date = new Date(now);
              date.setUTCDate(date.getUTCDate() - daysAgo);
              const label = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
              return (
                <div key={daysAgo} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-400 font-medium">{label}</div>
                  <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-[#00D084] rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                    {count > 0 && (
                      <div className="absolute inset-0 flex items-center justify-end pr-2">
                        <span className="text-xs text-white font-medium">{count}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Distribution & Source Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wide">
            CATEGORY DISTRIBUTION
          </h3>
          <div className="space-y-4">
            {topCategories.map(({ category, count }) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{category}</span>
                  <span className="text-gray-400 text-sm">{count} articles</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00D084] rounded-full"
                    style={{
                      width: `${(count / totalArticles) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <SourceBreakdown articles={articles} />
      </div>

      {/* Sentiment Distribution */}
      <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wide">
          SENTIMENT DISTRIBUTION
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(sentimentCounts).map(([sentiment, count]) => {
            const percentage = trends.length > 0 ? Math.round((count / trends.length) * 100) : 0;
            const color =
              sentiment === 'positive'
                ? 'bg-green-500'
                : sentiment === 'negative'
                ? 'bg-red-500'
                : 'bg-gray-500';
            return (
              <div key={sentiment} className="text-center">
                <div className={`w-24 h-24 rounded-full ${color} mx-auto mb-3 flex items-center justify-center`}>
                  <span className="text-2xl font-black text-white">{percentage}%</span>
                </div>
                <div className="text-white font-bold uppercase tracking-wide mb-1">{sentiment}</div>
                <div className="text-gray-400 text-sm">{count} topics</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hourly Publication Chart */}
      <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wide">
          PUBLICATION BY HOUR (UTC)
        </h3>
        <div className="space-y-3">
          {Array.from({ length: 24 }, (_, hour) => {
            const count = hourlyDistribution[hour] || 0;
            const maxCount = Math.max(...Object.values(hourlyDistribution), 1);
            const percentage = (count / maxCount) * 100;
            return (
              <div key={hour} className="flex items-center gap-4">
                <div className="w-12 text-sm text-gray-400 font-mono">{String(hour).padStart(2, '0')}:00</div>
                <div className="flex-1 h-6 bg-gray-800 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-[#00D084] rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                  {count > 0 && (
                    <div className="absolute inset-0 flex items-center justify-end pr-2">
                      <span className="text-xs text-white font-medium">{count}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Article Freshness Distribution */}
      <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wide">
          ARTICLE FRESHNESS
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(freshnessDistribution).map(([period, count]) => {
            const percentage = totalArticles > 0 ? Math.round((count / totalArticles) * 100) : 0;
            const labels = {
              recent: 'Last 6h',
              today: 'Today',
              yesterday: 'Yesterday',
              older: 'Older',
            };
            return (
              <div key={period} className="text-center p-4 bg-gray-900 rounded-lg">
                <div className="text-3xl font-black text-[#00D084] mb-2">{count}</div>
                <div className="text-white font-medium mb-1">{labels[period]}</div>
                <div className="text-gray-400 text-xs">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trend Momentum */}
      {Object.values(momentumCounts).some((count) => count > 0) && (
        <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wide">
            TREND MOMENTUM
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(momentumCounts).map(([direction, count]) => {
              if (count === 0) return null;
              const total = Object.values(momentumCounts).reduce((a, b) => a + b, 0);
              const percentage = Math.round((count / total) * 100);
              const icon = direction === 'rising' ? '↑' : direction === 'falling' ? '↓' : '→';
              const color =
                direction === 'rising'
                  ? 'text-green-400'
                  : direction === 'falling'
                  ? 'text-red-400'
                  : 'text-gray-400';
              return (
                <div key={direction} className="text-center">
                  <div className={`text-5xl font-black ${color} mb-2`}>{icon}</div>
                  <div className="text-white font-bold uppercase tracking-wide mb-1">{direction}</div>
                  <div className="text-gray-400 text-sm">{count} insights ({percentage}%)</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Keywords Word Cloud Style */}
      {topKeywords.length > 0 && (
        <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wide">
            TOP KEYWORDS
          </h3>
          <div className="flex flex-wrap gap-3">
            {topKeywords.map(({ keyword, count }) => {
              const maxCount = topKeywords[0].count;
              const intensity = Math.round((count / maxCount) * 100);
              const size = Math.max(14, Math.min(28, 12 + (intensity / 100) * 16));
              return (
                <div
                  key={keyword}
                  className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 hover:border-[#00D084] transition-colors"
                  style={{ fontSize: `${size}px` }}
                >
                  <span className="text-white font-medium">{keyword}</span>
                  <span className="text-gray-400 text-xs ml-2">({count})</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Source Performance Comparison */}
      <div className="bg-[#111] rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wide">
          SOURCE PERFORMANCE COMPARISON
        </h3>
        <div className="space-y-4">
          {Object.entries(
            articles.reduce((acc, article) => {
              const source = article.source;
              if (!acc[source]) {
                acc[source] = { count: 0, withImages: 0, categories: new Set() };
              }
              acc[source].count++;
              if (article.image) acc[source].withImages++;
              if (article.category) acc[source].categories.add(article.category);
              return acc;
            }, {})
          )
            .map(([source, data]) => ({
              source,
              ...data,
              categories: Array.from(data.categories),
            }))
            .sort((a, b) => b.count - a.count)
            .map(({ source, count, withImages, categories }) => (
              <div key={source} className="border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold">{source}</span>
                  <span className="text-gray-400 text-sm">{count} articles</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{withImages} with images</span>
                  {categories.length > 0 && (
                    <span>{categories.slice(0, 3).join(', ')}</span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
