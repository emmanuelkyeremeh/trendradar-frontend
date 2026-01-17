/**
 * AI Insights panel showing analysis summaries
 */
export function InsightsPanel({ insights, articles, expanded = false }) {
  // Generate insights from articles if none provided
  const displayInsights = insights.length > 0 
    ? insights 
    : generateInsightsFromArticles(articles);

  const visibleInsights = expanded ? displayInsights : displayInsights.slice(0, 4);

  return (
    <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-xl p-6 border border-gray-800">
      <h3 className="text-xl font-black text-white mb-6 uppercase tracking-wide">
        AI INSIGHTS
      </h3>

      {visibleInsights.length === 0 ? (
        <p className="text-gray-500 text-sm">Analyzing articles...</p>
      ) : (
        <div className="space-y-4">
          {visibleInsights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </div>
      )}

      {!expanded && displayInsights.length > 4 && (
        <div className="mt-4 pt-4 border-t border-gray-800 text-center">
          <span className="text-xs text-gray-500">
            +{displayInsights.length - 4} more insights
          </span>
        </div>
      )}
    </div>
  );
}

function InsightCard({ insight }) {
  const sentimentColor = {
    positive: 'border-green-500/50 bg-green-500/10',
    negative: 'border-red-500/50 bg-red-500/10',
    neutral: 'border-gray-500/50 bg-gray-500/10',
  };

  return (
    <div
      className={`rounded-lg p-4 border ${
        sentimentColor[insight.sentiment] || sentimentColor.neutral
      }`}
    >
      {/* Topic */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#00D084] text-xs font-bold uppercase tracking-wider">
          {insight.topic}
        </span>
        <div className="flex items-center gap-2">
          {insight.impactScore && (
            <span className="text-xs text-gray-400">
              Impact: {insight.impactScore}/10
            </span>
          )}
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              insight.sentiment === 'positive'
                ? 'bg-green-500/20 text-green-400'
                : insight.sentiment === 'negative'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}
          >
            {insight.sentiment}
          </span>
        </div>
      </div>

      {/* Summary */}
      <p className="text-gray-300 text-sm leading-relaxed mb-2">
        {insight.summary}
      </p>

      {/* Additional metrics */}
      {(insight.articleCount || insight.trendDirection) && (
        <div className="flex items-center gap-4 mb-2 text-xs text-gray-400">
          {insight.articleCount && (
            <span>{insight.articleCount} articles</span>
          )}
          {insight.trendDirection && (
            <span className={`font-medium ${
              insight.trendDirection === 'rising' ? 'text-green-400' :
              insight.trendDirection === 'falling' ? 'text-red-400' :
              'text-gray-400'
            }`}>
              {insight.trendDirection === 'rising' ? '↑ Rising' :
               insight.trendDirection === 'falling' ? '↓ Falling' :
               '→ Stable'}
            </span>
          )}
        </div>
      )}

      {/* Keywords */}
      {insight.keywords && insight.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {insight.keywords.slice(0, 5).map((keyword, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Generate enhanced insights from articles when AI insights aren't available
 */
function generateInsightsFromArticles(articles) {
  if (!articles || articles.length === 0) return [];

  const insights = [];

  // Calculate trending metrics
  const now = new Date();
  const recentArticles = articles.filter(a => {
    const pubDate = new Date(a.published);
    const hoursAgo = (now - pubDate) / (1000 * 60 * 60);
    return hoursAgo < 24;
  });

  // AI/Tech insights with metrics
  const aiArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes('ai') ||
      a.title.toLowerCase().includes('chatgpt') ||
      a.title.toLowerCase().includes('openai') ||
      a.title.toLowerCase().includes('machine learning')
  );
  if (aiArticles.length > 0) {
    const recentAI = aiArticles.filter(a => {
      const pubDate = new Date(a.published);
      const hoursAgo = (now - pubDate) / (1000 * 60 * 60);
      return hoursAgo < 6;
    });
    insights.push({
      topic: 'Artificial Intelligence',
      summary: `${aiArticles.length} articles discuss AI developments. Recent coverage includes ChatGPT updates, OpenAI announcements, and AI applications across healthcare, enterprise, and consumer sectors.`,
      sentiment: aiArticles.length > 10 ? 'positive' : 'neutral',
      articleCount: aiArticles.length,
      impactScore: Math.min(10, Math.round((aiArticles.length / articles.length) * 10)),
      trendDirection: recentAI.length > aiArticles.length / 3 ? 'rising' : 'stable',
      keywords: ['AI', 'ChatGPT', 'OpenAI', 'Machine Learning', 'LLM'],
    });
  }

  // Security insights
  const securityArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes('hack') ||
      a.title.toLowerCase().includes('security') ||
      a.title.toLowerCase().includes('breach') ||
      a.title.toLowerCase().includes('cyber') ||
      a.category === 'Security'
  );
  if (securityArticles.length > 0) {
    insights.push({
      topic: 'Cybersecurity',
      summary: `${securityArticles.length} security-related stories covering data breaches, hacking incidents, vulnerability disclosures, and cybersecurity policy developments.`,
      sentiment: 'negative',
      articleCount: securityArticles.length,
      impactScore: Math.min(10, Math.round((securityArticles.length / articles.length) * 10)),
      trendDirection: 'stable',
      keywords: ['Security', 'Hacking', 'Data Breach', 'Privacy', 'Vulnerability'],
    });
  }

  // Big Tech insights
  const bigTechArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes('google') ||
      a.title.toLowerCase().includes('apple') ||
      a.title.toLowerCase().includes('microsoft') ||
      a.title.toLowerCase().includes('meta') ||
      a.title.toLowerCase().includes('amazon')
  );
  if (bigTechArticles.length > 0) {
    insights.push({
      topic: 'Big Tech',
      summary: `Major tech companies feature in ${bigTechArticles.length} stories covering product launches, regulatory changes, earnings reports, and strategic initiatives.`,
      sentiment: 'neutral',
      articleCount: bigTechArticles.length,
      impactScore: Math.min(10, Math.round((bigTechArticles.length / articles.length) * 10)),
      trendDirection: 'stable',
      keywords: ['Google', 'Apple', 'Microsoft', 'Meta', 'Amazon'],
    });
  }

  // Startup/VC insights
  const startupArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes('startup') ||
      a.title.toLowerCase().includes('funding') ||
      a.title.toLowerCase().includes('raises') ||
      a.title.toLowerCase().includes('venture') ||
      a.category === 'Startups'
  );
  if (startupArticles.length > 0) {
    insights.push({
      topic: 'Startups & Funding',
      summary: `${startupArticles.length} articles covering startup funding rounds, venture capital activity, and emerging companies in AI, fintech, and enterprise software.`,
      sentiment: 'positive',
      articleCount: startupArticles.length,
      impactScore: Math.min(10, Math.round((startupArticles.length / articles.length) * 10)),
      trendDirection: 'stable',
      keywords: ['Startups', 'Funding', 'VC', 'Investment', 'Series A'],
    });
  }

  // Cloud/Infrastructure
  const cloudArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes('cloud') ||
      a.title.toLowerCase().includes('aws') ||
      a.title.toLowerCase().includes('azure') ||
      a.title.toLowerCase().includes('gcp') ||
      a.title.toLowerCase().includes('kubernetes')
  );
  if (cloudArticles.length > 0) {
    insights.push({
      topic: 'Cloud & Infrastructure',
      summary: `${cloudArticles.length} stories on cloud computing, infrastructure-as-code, containerization, and DevOps practices.`,
      sentiment: 'neutral',
      articleCount: cloudArticles.length,
      impactScore: Math.min(10, Math.round((cloudArticles.length / articles.length) * 10)),
      trendDirection: 'stable',
      keywords: ['Cloud', 'AWS', 'Kubernetes', 'DevOps', 'Infrastructure'],
    });
  }

  return insights.slice(0, 8);
}
