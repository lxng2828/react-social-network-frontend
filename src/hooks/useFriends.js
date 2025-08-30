import { useState, useEffect, useCallback } from 'react';
import { getFriendsList } from '../services/friendshipService';

/**
 * Hook để quản lý state và logic của danh sách bạn bè
 * @returns {Object} State và functions để quản lý bạn bè
 */
export const useFriends = (limit = 10) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(false);

    /**
     * Fetch danh sách bạn bè từ API
     */
    const fetchFriends = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            console.log('👥 useFriends: Fetching friends list...', { page, limit });

            const response = await getFriendsList(page, limit);
            console.log('👥 useFriends: Friends fetched successfully:', response);

            // Xử lý response từ API
            if (response && response.content) {
                // API trả về Page<FriendResponseDto>
                // FriendResponseDto: { id, friend: UserResponseDto, acceptedAt }
                // Cần map để lấy thông tin user từ field 'friend'
                const mappedFriends = response.content.map(friendResponse => ({
                    ...friendResponse.friend, // Lấy thông tin user
                    friendshipId: friendResponse.id, // Giữ lại ID của friendship để xóa
                    acceptedAt: friendResponse.acceptedAt
                }));

                console.log('👥 useFriends: Mapped friends:', mappedFriends);

                if (page === 1) {
                    setFriends(mappedFriends);
                } else {
                    setFriends(prev => [...prev, ...mappedFriends]);
                }

                setHasMore(!response.last);
            } else if (Array.isArray(response)) {
                // Nếu API trả về array trực tiếp
                setFriends(response);
                setHasMore(false);
            } else {
                setFriends([]);
                setHasMore(false);
            }
        } catch (err) {
            setError(err.message);
            console.error('💥 useFriends: Error fetching friends:', err);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    /**
     * Refresh danh sách bạn bè
     */
    const refreshFriends = useCallback(() => {
        console.log('🔄 useFriends: Refreshing friends list...');
        fetchFriends(1);
    }, [fetchFriends]);

    /**
     * Load thêm bạn bè (pagination)
     */
    const loadMoreFriends = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = Math.floor(friends.length / limit) + 1;
            console.log('👥 useFriends: Loading more friends, page:', nextPage);
            fetchFriends(nextPage);
        }
    }, [loading, hasMore, friends.length, limit, fetchFriends]);

    // Auto-fetch khi component mount
    useEffect(() => {
        console.log('👥 useFriends: Component mounted, fetching friends...');
        fetchFriends(1);
    }, [fetchFriends]);

    return {
        friends,
        loading,
        error,
        hasMore,
        fetchFriends,
        refreshFriends,
        loadMoreFriends,
        setError
    };
};
