import { API_BASE_URL } from './apiConfig';

// Helper function để tạo header Authorization
const getAuthHeader = () => {
    const token = localStorage.getItem('jwt_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function để gọi API với xử lý response
const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);

        // Kiểm tra response có content không
        const responseText = await response.text();

        let data;
        if (responseText && responseText.trim()) {
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error('Response không phải JSON hợp lệ');
            }
        } else {
            data = { success: false, message: 'Response rỗng' };
        }

        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        throw error;
    }
};

// Gửi lời mời kết bạn
export const sendFriendRequest = async (receiverId) => {
    try {
        console.log('🔄 Gửi lời mời kết bạn cho receiverId:', receiverId);

        const response = await apiCall('/friendships', {
            method: 'POST',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ receiverId })
        });

        console.log('✅ Response sendFriendRequest:', response);
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi sendFriendRequest:', error);
        throw error;
    }
};

// Kiểm tra trạng thái quan hệ
export const getFriendshipStatus = async (userId) => {
    try {
        console.log('🔄 Kiểm tra trạng thái friendship cho userId:', userId);

        const response = await apiCall(`/friendships/status?userId=${userId}`, {
            headers: getAuthHeader()
        });

        console.log('✅ Response getFriendshipStatus:', response);
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi getFriendshipStatus:', error);
        throw error;
    }
};

// Chấp nhận lời mời kết bạn
export const acceptFriendRequest = async (friendshipId) => {
    try {
        console.log('🔄 Chấp nhận lời mời kết bạn:', friendshipId);

        const response = await apiCall(`/friendships/${friendshipId}/accept`, {
            method: 'PATCH',
            headers: getAuthHeader()
        });

        console.log('✅ Response acceptFriendRequest:', response);
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi acceptFriendRequest:', error);
        throw error;
    }
};

// Từ chối lời mời kết bạn
export const declineFriendRequest = async (friendshipId) => {
    try {
        console.log('🔄 Từ chối lời mời kết bạn:', friendshipId);

        const response = await apiCall(`/friendships/${friendshipId}/decline`, {
            method: 'PATCH',
            headers: getAuthHeader()
        });

        console.log('✅ Response declineFriendRequest:', response);
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi declineFriendRequest:', error);
        throw error;
    }
};

// Hủy lời mời kết bạn
export const cancelFriendRequest = async (friendshipId) => {
    try {
        console.log('🔄 Hủy lời mời kết bạn:', friendshipId);

        const response = await apiCall(`/friendships/${friendshipId}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });

        console.log('✅ Response cancelFriendRequest:', response);
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi cancelFriendRequest:', error);
        throw error;
    }
};

// Hủy kết bạn
export const removeFriend = async (friendshipId) => {
    try {
        console.log('🔄 Hủy kết bạn:', friendshipId);

        const response = await apiCall(`/friendships/${friendshipId}/remove`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });

        console.log('✅ Response removeFriend:', response);
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi removeFriend:', error);
        throw error;
    }
};

// Lấy danh sách bạn bè
export const getFriendsList = async (page = 1, limit = 10) => {
    try {
        console.log('🔄 Lấy danh sách bạn bè:', { page, limit });

        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);

        const response = await apiCall(`/friendships?${params}`, {
            method: 'GET',
            headers: getAuthHeader()
        });

        console.log('✅ Response getFriendsList:', response);
        return response.data || response;
    } catch (error) {
        console.error('❌ Lỗi getFriendsList:', error);
        throw error;
    }
};

// Lấy danh sách lời mời kết bạn đã nhận
export const getFriendRequests = async (page = 1, size = 20) => {
    try {
        console.log('🔄 Gọi API getFriendRequests:', `/friendships/received?page=${page}&limit=${size}`);

        const response = await apiCall(`/friendships/received?page=${page}&limit=${size}`, {
            headers: getAuthHeader()
        });

        console.log('✅ Response getFriendRequests:', response);

        // API trả về Page<FriendshipResponseDto>
        // FriendshipResponseDto: { id, sender: UserResponseDto, receiver: UserResponseDto, status, createdAt, updatedAt }
        // Cần map để lấy thông tin user từ field 'sender' (người gửi lời mời)
        if (response.data && response.data.content) {
            const mappedRequests = response.data.content.map(friendship => ({
                ...friendship.sender, // Lấy thông tin user gửi lời mời
                friendshipId: friendship.id, // Giữ lại ID của friendship để accept/decline
                status: friendship.status,
                createdAt: friendship.createdAt
            }));

            console.log('🔄 Mapped requests:', mappedRequests);

            return {
                ...response.data,
                content: mappedRequests
            };
        }

        return response.data;
    } catch (error) {
        console.error('❌ Lỗi getFriendRequests:', error);
        throw error;
    }
};
