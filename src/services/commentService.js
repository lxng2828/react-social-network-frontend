import { API_BASE_URL } from './apiConfig';

// Helper function để tạo header Authorization
const getAuthHeader = () => {
    const token = localStorage.getItem('jwt_token');
    console.log('🔑 JWT Token check:', {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'null'
    });
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper function để gọi API với xử lý response
const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    // Lấy auth headers
    const authHeaders = getAuthHeader();
    console.log('🔐 Auth Headers:', authHeaders);

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
            ...options.headers,
        },
        ...options,
    };

    console.log('⚙️ Final Config:', {
        url,
        method: config.method,
        headers: config.headers,
        body: config.body
    });

    try {
        console.log(`🚀 API Call: ${url}`, { method: options.method, body: options.body });

        const response = await fetch(url, config);
        const responseText = await response.text();

        console.log(`📡 Response Status: ${response.status}`, {
            url,
            statusText: response.statusText,
            responseText: responseText.substring(0, 200) + '...'
        });

        let data;
        if (responseText && responseText.trim()) {
            try {
                data = JSON.parse(responseText);
                console.log(`📊 Parsed Response:`, data);
            } catch (parseError) {
                console.error(`❌ Parse Error:`, parseError);
                throw new Error('Response không phải JSON hợp lệ');
            }
        } else {
            data = { success: false, message: 'Response rỗng' };
            console.warn(`⚠️ Empty Response:`, data);
        }

        if (!response.ok) {
            console.error(`❌ HTTP Error: ${response.status}`, data);
            throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        console.log(`✅ API Success:`, data);
        return data;
    } catch (error) {
        console.error(`💥 API Error:`, error);
        throw error;
    }
};

// Tạo comment mới
export const createComment = async (postId, content) => {
    console.log(`💬 Creating comment for post ${postId}:`, { content });

    try {
        const response = await apiCall(`/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content }),
        });

        console.log(`💬 Comment created successfully:`, response);
        return response.data;
    } catch (error) {
        console.error(`💥 Failed to create comment:`, error);
        throw error;
    }
};

// Lấy danh sách comments của bài viết
export const getComments = async (postId, page = 0, size = 10) => {
    console.log(`📋 Getting comments for post ${postId}:`, { page, size });

    try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);

        const response = await apiCall(`/posts/${postId}/comments?${params}`, {
            method: 'GET',
        });

        console.log(`📋 Comments retrieved successfully:`, response);
        return response.data;
    } catch (error) {
        console.error(`💥 Failed to get comments:`, error);
        throw error;
    }
};

// Cập nhật comment
export const updateComment = async (commentId, content) => {
    console.log(`✏️ Updating comment ${commentId}:`, { content });

    try {
        const response = await apiCall(`/comments/${commentId}`, {
            method: 'PATCH',
            body: JSON.stringify({ content }),
        });

        console.log(`✏️ Comment updated successfully:`, response);
        return response.data;
    } catch (error) {
        console.error(`💥 Failed to update comment:`, error);
        throw error;
    }
};

// Xóa comment
export const deleteComment = async (commentId) => {
    console.log(`🗑️ Deleting comment ${commentId}`);

    try {
        await apiCall(`/comments/${commentId}`, {
            method: 'DELETE',
        });

        console.log(`🗑️ Comment deleted successfully`);
        return { success: true };
    } catch (error) {
        console.error(`💥 Failed to delete comment:`, error);
        throw error;
    }
};
