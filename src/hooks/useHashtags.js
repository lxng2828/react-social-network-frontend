import { useState, useEffect, useCallback } from 'react';
import { getTopHashtags } from '../services/hashtagService';

/**
 * Hook để quản lý state và logic của top hashtags
 * @returns {Object} State và functions để quản lý hashtags
 */
export const useHashtags = () => {
    const [hashtags, setHashtags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch top hashtags từ API
     */
    const fetchHashtags = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🏷️ useHashtags: Fetching top hashtags...');
            
            const data = await getTopHashtags();
            console.log('🏷️ useHashtags: Hashtags fetched successfully:', data);
            
            setHashtags(data || []);
        } catch (err) {
            setError(err.message);
            console.error('💥 useHashtags: Error fetching hashtags:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Refresh hashtags data
     */
    const refreshHashtags = useCallback(() => {
        console.log('🔄 useHashtags: Refreshing hashtags...');
        fetchHashtags();
    }, [fetchHashtags]);

    // Auto-fetch khi component mount
    useEffect(() => {
        console.log('🏷️ useHashtags: Component mounted, fetching hashtags...');
        fetchHashtags();
    }, [fetchHashtags]);

    return {
        hashtags,
        loading,
        error,
        refreshHashtags,
        setError
    };
};
