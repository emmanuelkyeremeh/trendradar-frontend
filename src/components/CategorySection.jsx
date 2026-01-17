import { ArticleGrid } from './ArticleGrid.jsx';

/**
 * Category section showing articles grouped by category
 */
export function CategorySection({ category, articles, limit = 4 }) {
  const categoryArticles = articles
    .filter((a) => a.category === category || 
                   (category === 'AI' && (a.category === 'AI' || a.title.toLowerCase().includes('ai'))) ||
                   (category === 'Security' && (a.category === 'Security' || a.title.toLowerCase().includes('security') || a.title.toLowerCase().includes('hack'))) ||
                   (category === 'Big Tech' && (a.category === 'Big Tech' || ['apple', 'google', 'microsoft', 'meta', 'amazon'].some(tech => a.title.toLowerCase().includes(tech))))
    )
    .slice(0, limit);

  if (categoryArticles.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
        <span className="w-1 h-8 bg-[#00D084]"></span>
        {category.toUpperCase()}
      </h2>
      <ArticleGrid articles={categoryArticles} />
    </section>
  );
}
