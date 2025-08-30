import { API_BASE_URL } from './apiConfig';

// Helper function để tạo header Authorization
const getAuthHeader = () => {
    const token = localStorage.getItem('jwt_token');
    console.log('🔑 ReplyService - JWT Token check:', {
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
    console.log('🔐 ReplyService - Auth Headers:', authHeaders);

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
            ...options.headers,
        },
        ...options,
    };

    console.log('⚙️ ReplyService - Final Config:', {
        url,
        method: config.method,
        headers: config.headers,
        body: config.body
    });

    try {
        console.log(`🚀 ReplyService - API Call: ${url}`, { method: options.method, body: options.body });

        const response = await fetch(url, config);
        const responseText = await response.text();

        console.log(`📡 ReplyService - Response Status: ${response.status}`, {
            url,
            statusText: response.statusText,
            responseText: responseText.substring(0, 200) + '...'
        });

        let data;
        if (responseText && responseText.trim()) {
            try {
                data = JSON.parse(responseText);
                console.log(`📊 ReplyService - Parsed Response:`, data);
            } catch (parseError) {
                console.error(`❌ ReplyService - Parse Error:`, parseError);
                throw new Error('Response không phải JSON hợp lệ');
            }
        } else {
            data = { success: false, message: 'Response rỗng' };
            console.warn(`⚠️ ReplyService - Empty Response:`, data);
        }

        if (!response.ok) {
            console.error(`❌ ReplyService - HTTP Error: ${response.status}`, data);
            throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        console.log(`✅ ReplyService - API Success:`, data);
        return data;
    } catch (error) {
        console.error(`💥 ReplyService - API Error:`, error);
        throw error;
    }
};

// Tạo reply mới
export const createReply = async (commentId, content) => {
    console.log(`💬 ReplyService - Creating reply for comment ${commentId}:`, { content });

    try {
        const response = await apiCall(`/comments/${commentId}/replies`, {
            method: 'POST',
            body: JSON.stringify({ content }),
        });

        console.log(`💬 ReplyService - Reply created successfully:`, response);
        return response.data;
    } catch (error) {
        console.error(`💥 ReplyService - Failed to create reply:`, error);
        throw error;
    }
};

// Lấy danh sách replies của comment
export const getReplies = async (commentId, page = 0, size = 20) => {
    console.log(`📋 ReplyService - Getting replies for comment ${commentId}:`, { page, size });

    try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);

        const response = await apiCall(`/comments/${commentId}/replies?${params}`, {
            method: 'GET',
        });

        console.log(`📋 ReplyService - Replies retrieved successfully:`, response);
        return response.data;
    } catch (error) {
        console.error(`💥 ReplyService - Failed to get replies:`, error);
        throw error;
    }
};

// Cập nhật reply
export const updateReply = async (replyId, content) => {
    console.log(`✏️ ReplyService - Updating reply ${replyId}:`, { content });

    try {
        const response = await apiCall(`/replies/${replyId}`, {
            method: 'PATCH',
            body: JSON.stringify({ content }),
        });

        console.log(`✏️ ReplyService - Reply updated successfully:`, response);
        return response.data;
    } catch (error) {
        console.error(`💥 ReplyService - Failed to update reply:`, error);
        throw error;
    }
};

// Xóa reply
export const deleteReply = async (replyId) => {
    console.log(`🗑️ ReplyService - Deleting reply ${replyId}`);

    try {
        await apiCall(`/replies/${replyId}`, {
            method: 'DELETE',
        });

        console.log(`🗑️ ReplyService - Reply deleted successfully`);
        return { success: true };
    } catch (error) {
        console.error(`💥 ReplyService - Failed to delete reply:`, error);
        throw error;
    }
};
