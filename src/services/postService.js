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
    console.log('🔐 PostService - Auth Headers:', authHeaders);

    const config = {
        headers: {
            ...authHeaders, // Merge auth headers trước
            ...options.headers, // Sau đó merge options headers
        },
        ...options,
    };

    console.log('⚙️ PostService - Final Config:', {
        url,
        method: config.method,
        headers: config.headers,
        body: config.body
    });

    // Nếu có body là FormData, không set Content-Type header
    // Browser sẽ tự động set Content-Type với boundary
    if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    try {
        console.log(`🚀 PostService - API Call: ${url}`, { method: options.method, body: options.body });

        const response = await fetch(url, config);
        const responseText = await response.text();

        console.log(`📡 PostService - Response Status: ${response.status}`, {
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

        console.log(`✅ PostService - API Success:`, data);
        return data;
    } catch (error) {
        console.error(`💥 PostService - API Error:`, error);
        throw error;
    }
};

// Tạo bài viết mới
export const createPost = async (postData) => {
    const formData = new FormData();
    formData.append('content', postData.content);

    if (postData.privacy) {
        formData.append('privacy', postData.privacy);
    }

    if (postData.hashtags && postData.hashtags.length > 0) {
        formData.append('hashtags', JSON.stringify(postData.hashtags));
    }

    if (postData.files && postData.files.length > 0) {
        postData.files.forEach((file, index) => {
            formData.append('files', file);
        });
    }

    const response = await apiCall('/posts', {
        method: 'POST',
        headers: getAuthHeader(),
        body: formData,
    });

    return response.data;
};

// Lấy feed bài viết
export const getPosts = async (page = 1, limit = 20) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    const response = await apiCall(`/posts/feed?${params}`, {
        method: 'GET',
        headers: getAuthHeader(),
    });

    return response.data;
};

// Lấy bài viết theo ID
export const getPostById = async (postId) => {
    const response = await apiCall(`/posts/${postId}`, {
        method: 'GET',
        headers: getAuthHeader(),
    });

    return response.data;
};

// Lấy bài viết của user
export const getUserPosts = async (userId, page = 1, limit = 20) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

    const response = await apiCall(`/posts/users/${userId}/posts?${params}`, {
        method: 'GET',
        headers: getAuthHeader(),
    });

    return response.data;
};

// Cập nhật bài viết
export const updatePost = async (postId, postData) => {
    const formData = new FormData();

    if (postData.content) {
        formData.append('content', postData.content);
    }

    if (postData.privacy) {
        formData.append('privacy', postData.privacy);
    }

    if (postData.hashtags && postData.hashtags.length > 0) {
        formData.append('hashtags', JSON.stringify(postData.hashtags));
    }

    if (postData.files && postData.files.length > 0) {
        postData.files.forEach((file, index) => {
            formData.append('files', file);
        });
    }

    const response = await apiCall(`/posts/${postId}`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: formData,
    });

    return response.data;
};

// Xóa bài viết
export const deletePost = async (postId) => {
    console.log(`🗑️ PostService - Deleting post ${postId}`);

    try {
        const response = await apiCall(`/posts/${postId}`, {
            method: 'DELETE',
            headers: getAuthHeader(),
        });

        console.log(`🗑️ PostService - Post deleted successfully:`, response);
        return { success: true };
    } catch (error) {
        console.error(`💥 PostService - Failed to delete post ${postId}:`, error);
        throw error;
    }
};
