export const API_BASE_URL = 'http://localhost:8080/api';
export const MEDIA_BASE_URL = 'http://localhost:8080';
// Helper function để gọi API
export const apiCall = async (endpoint, options = {}) => {
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

// Helper function để tạo header Authorization
export const getAuthHeader = () => {
    const token = localStorage.getItem('jwt_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};


export const getMediaUrl = (path) => {
    return `${MEDIA_BASE_URL}${path}`;
};