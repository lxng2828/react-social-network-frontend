import { useState, useCallback, useEffect } from 'react';
import { addHeart, removeHeart, getHearts } from '../services/reactionService';

export const useReactions = (postId, initialIsLiked = false, initialLikeCount = 0) => {
    const [hearts, setHearts] = useState([]);
    const [currentUserHearted, setCurrentUserHearted] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cập nhật state khi props thay đổi
    useEffect(() => {
        setCurrentUserHearted(initialIsLiked);
        setLikeCount(initialLikeCount);
    }, [initialIsLiked, initialLikeCount]);

    // Tự động fetch trạng thái tim từ backend khi component mount
    useEffect(() => {
        if (postId) {
            console.log('💖 useReactions: Auto-fetching heart status for post:', postId);
            fetchHearts();
        }
    }, [postId]); // Chỉ chạy khi postId thay đổi

    const fetchHearts = useCallback(async () => {
        if (!postId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await getHearts(postId);
            console.log('💖 useReactions: Fetched hearts:', response);

            // Cập nhật state dựa trên response từ backend
            if (response && response.data) {
                const data = response.data;
                console.log('💖 useReactions: Processing response data:', data);
                
                if (data.hearts) {
                    setHearts(data.hearts);
                }
                if (typeof data.currentUserHearted === 'boolean') {
                    console.log('💖 useReactions: Setting currentUserHearted to:', data.currentUserHearted);
                    setCurrentUserHearted(data.currentUserHearted);
                }
                if (data.totalHearts !== undefined) {
                    console.log('💖 useReactions: Setting likeCount to:', data.totalHearts);
                    setLikeCount(data.totalHearts);
                }
            } else if (response) {
                // Fallback: xử lý trực tiếp response nếu không có data wrapper
                console.log('💖 useReactions: Processing direct response:', response);
                
                if (response.hearts) {
                    setHearts(response.hearts);
                }
                if (typeof response.currentUserHearted === 'boolean') {
                    console.log('💖 useReactions: Setting currentUserHearted to:', response.currentUserHearted);
                    setCurrentUserHearted(response.currentUserHearted);
                }
                if (response.totalHearts !== undefined) {
                    console.log('💖 useReactions: Setting likeCount to:', response.totalHearts);
                    setLikeCount(response.totalHearts);
                }
            }
        } catch (err) {
            setError(err.message);
            console.error('💥 useReactions: Lỗi khi lấy danh sách tim:', err);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    const handleHeartClick = useCallback(async () => {
        if (!postId) return;

        try {
            setError(null);
            setLoading(true);

            if (currentUserHearted) {
                // Bỏ tim
                console.log('💖 useReactions: Removing heart from post:', postId);
                await removeHeart(postId);
                setCurrentUserHearted(false);
                setLikeCount(prev => Math.max(0, prev - 1));
                console.log('💖 useReactions: Heart removed successfully');
            } else {
                // Thả tim
                console.log('💖 useReactions: Adding heart to post:', postId);
                try {
                    const newHeart = await addHeart(postId);
                    setCurrentUserHearted(true);
                    setLikeCount(prev => prev + 1);
                    console.log('💖 useReactions: Heart added successfully:', newHeart);
                } catch (addError) {
                    // Nếu lỗi "đã tim rồi", refresh state từ backend
                    if (addError.message && addError.message.includes('đã thả tin')) {
                        console.log('💖 useReactions: Post already liked, refreshing state from backend');
                        await fetchHearts(); // Refresh state từ backend
                    } else {
                        throw addError; // Re-throw lỗi khác
                    }
                }
            }
        } catch (err) {
            setError(err.message);
            console.error('💥 useReactions: Lỗi khi toggle heart:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [postId, currentUserHearted, fetchHearts]);

    const refreshHearts = useCallback(() => {
        fetchHearts();
    }, [fetchHearts]);

    return {
        hearts,
        currentUserHearted,
        likeCount,
        loading,
        error,
        fetchHearts,
        handleHeartClick,
        refreshHearts,
        setError
    };
};
