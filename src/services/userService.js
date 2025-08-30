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

// Tìm kiếm người dùng
export const searchUsers = async (searchTerm, page = 0, size = 20) => {
    try {
        // Sử dụng endpoint /users/search (theo Postman test thành công)
        if (searchTerm && searchTerm.trim()) {
            const searchParams = new URLSearchParams();
            searchParams.append('searchTerm', searchTerm.trim());
            searchParams.append('page', page);
            searchParams.append('size', size);

            try {
                // Thêm Authorization header cho search endpoint
                const searchResponse = await apiCall(`/users/search?${searchParams}`, {
                    headers: getAuthHeader()
                });
                return searchResponse.data;
            } catch (searchError) {
                // Thử fallback về /users nếu /users/search lỗi
                const fallbackParams = new URLSearchParams();
                fallbackParams.append('page', page);
                fallbackParams.append('size', size);

                const fallbackResponse = await apiCall(`/users?${fallbackParams}`, {
                    headers: getAuthHeader()
                });

                // Filter kết quả theo searchTerm
                if (fallbackResponse.data && fallbackResponse.data.content) {
                    const filteredUsers = fallbackResponse.data.content.filter(user => {
                        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
                        const searchLower = searchTerm.toLowerCase();
                        return fullName.includes(searchLower) ||
                            user.email.toLowerCase().includes(searchLower);
                    });

                    return {
                        ...fallbackResponse.data,
                        content: filteredUsers
                    };
                }

                return fallbackResponse.data;
            }
        }

        // Nếu không có searchTerm, lấy tất cả users
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);

        const response = await apiCall(`/users?${params}`);
        return response.data;
    } catch (error) {
        // Trả về array rỗng nếu có lỗi
        return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            currentPage: page,
            pageSize: size
        };
    }
};

// Upload ảnh đại diện
export const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiCall('/users/profile-picture', {
        method: 'POST',
        headers: {
            ...getAuthHeader(),
        },
        body: formData,
    });

    // Theo API spec: response.data chứa UserResponseDto
    return response.data;
};

// Lấy thông tin user theo ID
export const getUserById = async (userId) => {
    try {
        const response = await apiCall(`/users/${userId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
