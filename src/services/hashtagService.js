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
    console.log('🔐 HashtagService - Auth Headers:', authHeaders);

    const config = {
        headers: {
            ...authHeaders, // Merge auth headers trước
            ...options.headers, // Sau đó merge options headers
        },
        ...options,
    };

    console.log('⚙️ HashtagService - Final Config:', {
        url,
        method: config.method,
        headers: config.headers
    });

    try {
        console.log(`🚀 HashtagService - API Call: ${url}`, { method: options.method });

        const response = await fetch(url, config);
        const responseText = await response.text();

        console.log(`📡 HashtagService - Response Status: ${response.status}`, {
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

        console.log(`✅ HashtagService - API Success:`, data);
        return data;
    } catch (error) {
        console.error(`💥 HashtagService - API Error:`, error);
        throw error;
    }
};

/**
 * Lấy danh sách top 5 hashtag phổ biến nhất
 * @returns {Promise<Array>} Danh sách hashtag với thống kê
 */
export const getTopHashtags = async () => {
    console.log('🏷️ HashtagService - Fetching top hashtags');

    try {
        const response = await apiCall('/posts/hashtags/top', {
            method: 'GET',
        });

        console.log('✅ HashtagService - Top hashtags fetched successfully:', response);

        // Trả về data từ response hoặc response trực tiếp
        return response.data || response;
    } catch (error) {
        console.error('💥 HashtagService - Failed to fetch top hashtags:', error);
        throw error;
    }
};
