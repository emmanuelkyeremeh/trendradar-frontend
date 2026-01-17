import { useState, useEffect } from 'react';
import { getTodayTrends } from '../services/firestoreService.js';

const USE_LOCAL_DATA = import.meta.env.VITE_USE_LOCAL_DATA === 'true';
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001';

/**
 * Custom hook to fetch and manage today's trends
 * Uses Firestore in production, local API in development
 * @returns {Object} Object with trends, loading state, and error
 */
export function useTrends() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchTrends() {
      try {
        setLoading(true);
        setError(null);

        console.log('[useTrends] Fetching trends...', USE_LOCAL_DATA ? '(local mode)' : '(Firestore mode)');

        if (USE_LOCAL_DATA) {
          // Local development: Use backend API
          const response = await fetch(`${BACKEND_API_URL}/api/trends`);
          if (response.ok) {
            const data = await response.json();
            if (mounted && data.trends) {
              setTrends(data.trends);
              console.log('[useTrends] Received', data.trends.length, 'trends from local API');
              return;
            }
          }
          // Fallback: Generate from articles
          const articlesRes = await fetch(`${BACKEND_API_URL}/api/articles`);
          if (articlesRes.ok) {
            const articlesData = await articlesRes.json();
            const generatedTrends = generateTrendsFromArticles(articlesData.articles || []);
            if (mounted) {
              setTrends(generatedTrends);
              console.log('[useTrends] Generated', generatedTrends.length, 'trends from articles');
            }
          }
        } else {
          // Production: Use Firestore
          const trendsData = await getTodayTrends();
          if (mounted) {
            setTrends(trendsData);
            console.log('[useTrends] Received', trendsData.length, 'trends from Firestore');
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          console.error('[useTrends] Error fetching trends:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchTrends();

    // Refresh every 5 minutes
    const interval = setInterval(fetchTrends, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { trends, loading, error };
}

/**
 * Generate trends from articles
 */
function generateTrendsFromArticles(articles) {
  if (!articles || articles.length === 0) return [];

  const topicMap = new Map();

  // Extract topics from categories and titles
  articles.forEach((article) => {
    const topics = [];

    // Use category if available
    if (article.category && article.category !== article.source) {
      topics.push(article.category);
    }

    // Extract key topics from title
    const title = (article.title || '').toLowerCase();
    if (title.includes('ai') || title.includes('artificial intelligence')) topics.push('AI');
    if (title.includes('chatgpt')) topics.push('ChatGPT');
    if (title.includes('openai')) topics.push('OpenAI');
    if (title.includes('google')) topics.push('Google');
    if (title.includes('apple')) topics.push('Apple');
    if (title.includes('microsoft')) topics.push('Microsoft');
    if (title.includes('tesla') || title.includes('musk')) topics.push('Tesla/Musk');
    if (title.includes('crypto') || title.includes('bitcoin')) topics.push('Crypto');
    if (title.includes('security') || title.includes('hack')) topics.push('Security');

    topics.forEach((topic) => {
      if (!topicMap.has(topic)) {
        topicMap.set(topic, {
          topic,
          mentions: 0,
          sentiment: 'neutral',
          keywords: [topic],
          articles: [],
        });
      }
      const trend = topicMap.get(topic);
      trend.mentions += 1;
      if (article.url) trend.articles.push(article.url);
    });
  });

  return Array.from(topicMap.values())
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 10)
    .map((trend) => ({
      ...trend,
      sentiment: trend.mentions > 3 ? 'positive' : 'neutral',
    }));
}
