import { useState, useEffect } from 'react';
import { getTodayInsights } from '../services/firestoreService.js';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.js';

const USE_LOCAL_DATA = import.meta.env.VITE_USE_LOCAL_DATA === 'true';
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001';

/**
 * Custom hook to fetch articles and insights
 * Uses Firestore in production, local API in development
 * @returns {Object} Object with articles, insights, loading state, and error
 */
export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        if (USE_LOCAL_DATA) {
          // Local development: Use backend API
          const [articlesRes, insightsRes] = await Promise.all([
            fetch(`${BACKEND_API_URL}/api/articles`),
            fetch(`${BACKEND_API_URL}/api/insights`).catch(() => ({ ok: false })),
          ]);

          if (!articlesRes.ok) {
            throw new Error('Failed to fetch articles');
          }

          const articlesData = await articlesRes.json();
          let insightsData = { insights: [] };

          if (insightsRes.ok) {
            insightsData = await insightsRes.json();
          }

          if (mounted) {
            setArticles(articlesData.articles || []);
            setInsights(insightsData.insights || []);
          }
        } else {
          // Production: Use Firestore
          // Fetch articles
          const articlesRef = collection(db, 'articles');
          const articlesQuery = query(articlesRef, orderBy('published', 'desc'), limit(200));
          const articlesSnapshot = await getDocs(articlesQuery);
          const articlesData = articlesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Fetch insights
          const insightsData = await getTodayInsights();

          if (mounted) {
            setArticles(articlesData);
            setInsights(insightsData);
            console.log('[useArticles] Fetched', articlesData.length, 'articles and', insightsData.length, 'insights from Firestore');
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          console.error('[useArticles] Error:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { articles, insights, loading, error };
}
