import { API_BASE_URL } from './apiConfig';

// Helper function để tạo header Authorization
const getAuthHeader = () => {
    const token = localStorage.getItem('jwt_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function để gọi API với xử lý response
const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    // Lấy auth headers
    const authHeaders = getAuthHeader();
    console.log('🔐 ReactionService - Auth Headers:', authHeaders);

    const config = {
        headers: {
            ...authHeaders, // Merge auth headers trước
            ...options.headers, // Sau đó merge options headers
        },
        ...options,
    };

    console.log('⚙️ ReactionService - Final Config:', {
        url,
        method: config.method,
        headers: config.headers
    });

    try {
        console.log(`🚀 ReactionService - API Call: ${url}`, { method: options.method });

        const response = await fetch(url, config);
        const responseText = await response.text();

        console.log(`📡 ReactionService - Response Status: ${response.status}`, {
            url,
            statusText: response.statusText,
            responseText: responseText.substring(0, 200) + '...'
        });

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

        console.log(`✅ ReactionService - API Success:`, data);
        return data;
    } catch (error) {
        console.error(`💥 ReactionService - API Error:`, error);
        throw error;
    }
};

// Thả tim bài viết
export const addHeart = async (postId) => {
    console.log(`💖 ReactionService - Adding heart to post ${postId}`);

    try {
        const response = await apiCall(`/posts/${postId}/hearts`, {
            method: 'POST',
            headers: getAuthHeader(),
        });

        console.log(`💖 ReactionService - Heart added successfully:`, response);
        return response.data;
    } catch (error) {
        console.error(`💥 ReactionService - Failed to add heart:`, error);
        throw error;
    }
};

// Bỏ tim bài viết
export const removeHeart = async (postId) => {
    console.log(`💔 ReactionService - Removing heart from post ${postId}`);

    try {
        const response = await apiCall(`/posts/${postId}/hearts`, {
            method: 'DELETE',
            headers: getAuthHeader(),
        });

        console.log(`💔 ReactionService - Heart removed successfully:`, response);
        return { success: true };
    } catch (error) {
        console.error(`💥 ReactionService - Failed to remove heart:`, error);
        throw error;
    }
};

// Lấy danh sách tim của bài viết
export const getHearts = async (postId, page = 1, limit = 20) => {
    console.log(`📋 ReactionService - Getting hearts for post ${postId}:`, { page, limit });
    
    try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);

        const response = await apiCall(`/posts/${postId}/hearts?${params}`, {
            method: 'GET',
            headers: getAuthHeader(),
        });
        
        console.log(`📋 ReactionService - Hearts fetched successfully:`, response);
        
        // Trả về response trực tiếp để hook xử lý
        return response;
    } catch (error) {
        console.error(`💥 ReactionService - Failed to fetch hearts:`, error);
        throw error;
    }
};
