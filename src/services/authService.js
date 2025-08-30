import { setToken, removeToken } from '../utils/tokenUtils';
import { apiCall, getAuthHeader } from './apiConfig';

// Đăng nhập
export const login = async (email, password) => {
    const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    // Theo API spec: response.data chứa LoginResponse
    if (response.success && response.data && response.data.token) {
        setToken(response.data.token);

        // Lấy thông tin user ngay sau khi đăng nhập
        try {
            const userData = await getCurrentUser();
            return { ...response.data, user: userData };
        } catch (error) {
            console.error('Lỗi khi lấy thông tin user:', error);
            // Vẫn trả về response nếu không lấy được user info
            return response.data;
        }
    }

    throw new Error('Đăng nhập thất bại');
};

// Đăng xuất
export const logout = async () => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        try {
            await apiCall('/auth/logout', {
                method: 'POST',
                body: JSON.stringify({ token }),
            });
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    }

    removeToken();
};

// Kiểm tra token
export const checkToken = async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) return false;

    try {
        const response = await apiCall('/auth/introspect', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });
        // Theo API spec: response.data chứa IntrospectResponse
        return response.success && response.data && response.data.valid;
    } catch (error) {
        removeToken();
        return false;
    }
};

// Lấy thông tin user hiện tại
export const getCurrentUser = async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error('Không có token');

    const response = await apiCall('/users/me', {
        method: 'GET',
        headers: getAuthHeader(),
    });

    // Theo API spec: response.data chứa UserResponseDto
    return response.data;
};
