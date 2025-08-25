import { apiCall, getAuthHeader } from './apiConfig';

// Đăng ký tài khoản
export const register = async (userData) => {
    // Chuyển đổi dữ liệu từ form sang format API
    const apiData = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
    };

    // Thêm các field optional nếu có
    if (userData.gender) {
        apiData.gender = userData.gender;
    }

    if (userData.dateOfBirth) {
        apiData.dateOfBirth = userData.dateOfBirth.format('YYYY-MM-DD');
    }

    if (userData.phoneNumber) {
        apiData.phone = userData.phoneNumber;
    }

    if (userData.address) {
        apiData.address = userData.address;
    }

    const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(apiData),
    });

    // Theo API spec: response.data chứa RegisterResponse
    return response.data;
};

// Lấy thông tin user hiện tại
export const getCurrentUser = async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error('Không có token');

    return await apiCall('/users/me', {
        method: 'GET',
        headers: getAuthHeader(),
    });
};

// Cập nhật thông tin profile
export const updateProfile = async (profileData) => {
    const token = localStorage.getItem('jwt_token');
    if (!token) throw new Error('Không có token');

    const response = await apiCall('/users/profile', {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(profileData),
    });

    // Theo API spec: response.data chứa UserResponseDto
    return response.data;
};
