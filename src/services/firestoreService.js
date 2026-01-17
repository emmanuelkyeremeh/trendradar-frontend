import { 
  collection, 
  doc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

/**
 * Get today's date as YYYY-MM-DD string
 * @returns {string} Today's date
 */
function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get today's trending topics from Firestore
 * @returns {Promise<Array>} Array of trend objects
 */
export async function getTodayTrends() {
  try {
    const today = getTodayDateString();
    console.log('[Firestore] Fetching trends for date:', today);
    
    const trendsRef = doc(db, 'daily_trends', today);
    const trendsDoc = await getDoc(trendsRef);

    if (!trendsDoc.exists()) {
      console.log('[Firestore] No trends document found for date:', today);
      console.log('[Firestore] Document exists:', trendsDoc.exists());
      return [];
    }

    const data = trendsDoc.data();
    console.log('[Firestore] Found trends document:', {
      trendsCount: data.trends?.length || 0,
      updatedAt: data.updatedAt,
    });
    
    return data.trends || [];
  } catch (error) {
    console.error('[Firestore] Error fetching today\'s trends:', error);
    console.error('[Firestore] Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return [];
  }
}

/**
 * Get all insights from today
 * @returns {Promise<Array>} Array of insight objects
 */
export async function getTodayInsights() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStartISO = today.toISOString();

    const insightsRef = collection(db, 'insights');
    const q = query(
      insightsRef,
      where('createdAt', '>=', todayStartISO),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('[Firestore] Error fetching today\'s insights:', error);
    return [];
  }
}

/**
 * Get usage statistics for today
 * @returns {Promise<Object>} Usage object with ai_calls and articles_processed
 */
export async function getTodayUsage() {
  try {
    const today = getTodayDateString();
    const usageRef = doc(db, 'usage', today);
    const usageDoc = await getDoc(usageRef);

    if (!usageDoc.exists()) {
      return { ai_calls: 0, articles_processed: 0 };
    }

    return usageDoc.data();
  } catch (error) {
    console.error('[Firestore] Error fetching today\'s usage:', error);
    return { ai_calls: 0, articles_processed: 0 };
  }
}
