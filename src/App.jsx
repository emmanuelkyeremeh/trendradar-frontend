import { useState } from 'react';
import { useTrends } from './hooks/useTrends.js';
import { useArticles } from './hooks/useArticles.js';
import { LoadingSpinner } from './components/LoadingSpinner.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { LatestNews } from './components/LatestNews.jsx';
import { ArticleGrid } from './components/ArticleGrid.jsx';
import { CategorySection } from './components/CategorySection.jsx';
import { AnalysisDashboard } from './components/AnalysisDashboard.jsx';

/**
 * Main App component
 * Displays the TrendRadar dashboard with today's trending topics
 * Inspired by Billboard's clean, bold design
 */
function App() {
  const [activeTab, setActiveTab] = useState('trending');
  const { trends, loading: trendsLoading, error: trendsError } = useTrends();
  const { articles, insights, loading: articlesLoading, error: articlesError } = useArticles();

  const loading = trendsLoading || articlesLoading;
  const error = trendsError || articlesError;

  const handleRefresh = () => {
    window.location.reload();
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
            <h2 className="text-red-400 font-bold text-lg mb-2">Error Loading Data</h2>
            <p className="text-red-300 text-sm mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get featured article (first with image)
  const featuredArticle = articles.find((a) => a.image) || articles[0];
  const topArticles = articles.filter((a) => a !== featuredArticle).slice(0, 4);
  const latestArticles = articles.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="bg-[#00D084]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-3xl font-black tracking-tight text-black">TRENDRADAR</h1>
            <div className="text-sm font-medium text-black/80">{today}</div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-[#111] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 py-4">
            {['trending', 'tech news', 'analysis'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-bold uppercase tracking-wide transition-colors ${
                  activeTab === tab
                    ? 'text-[#00D084]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
            <div className="ml-auto">
              <button
                onClick={handleRefresh}
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                ↻ Refresh
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'trending' && (
          <>
            {/* Hero Section */}
            <div className="mb-12">
              <HeroSection article={featuredArticle} />
              
              {/* Top Stories Grid */}
              <div className="mt-8">
                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 bg-[#00D084]"></span>
                  TOP STORIES
                </h2>
                <ArticleGrid articles={topArticles} />
              </div>
            </div>

            {/* Category Sections */}
            <CategorySection category="AI" articles={articles} />
            <CategorySection category="Security" articles={articles} />
            <CategorySection category="Big Tech" articles={articles} />

            {/* Latest News Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-[#00D084]"></span>
                LATEST NEWS
              </h2>
              <LatestNews articles={latestArticles} />
            </section>
          </>
        )}

        {activeTab === 'tech news' && (
          <section>
            <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
              <span className="w-1 h-10 bg-[#00D084]"></span>
              ALL TECH NEWS
            </h2>
            <LatestNews articles={articles} showAll />
          </section>
        )}

        {activeTab === 'analysis' && (
          <section>
            <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
              <span className="w-1 h-10 bg-[#00D084]"></span>
              AI ANALYSIS
            </h2>
            <AnalysisDashboard insights={insights} trends={trends} articles={articles} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#0a0a0a] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              TrendRadar • Powered by AI • Updated every 6 hours
            </p>
            <div className="flex gap-4 text-xs text-gray-600">
              <span>TechCrunch</span>
              <span>•</span>
              <span>Hacker News</span>
              <span>•</span>
              <span>Dev.to</span>
              <span>•</span>
              <span>The Verge</span>
              <span>•</span>
              <span>Ars Technica</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
