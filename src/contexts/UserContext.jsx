import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { isAuthenticated } from '../utils/tokenUtils';

// Tạo context
const UserContext = createContext();

// Hook để sử dụng UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Provider component
export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy thông tin user hiện tại khi component mount
    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (!isAuthenticated()) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const userData = await getCurrentUser();
                setCurrentUser(userData);
            } catch (err) {
                console.error('Lỗi khi lấy thông tin user:', err);
                setError(err.message);
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    // Cập nhật thông tin user (sau khi đăng nhập)
    const updateCurrentUser = (userData) => {
        setCurrentUser(userData);
        setError(null);
    };

    // Xóa thông tin user (sau khi đăng xuất)
    const clearCurrentUser = () => {
        setCurrentUser(null);
        setError(null);
    };

    // Refresh thông tin user
    const refreshUser = async () => {
        if (!isAuthenticated()) {
            clearCurrentUser();
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const userData = await getCurrentUser();
            setCurrentUser(userData);
        } catch (err) {
            console.error('Lỗi khi refresh thông tin user:', err);
            setError(err.message);
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        currentUser,
        loading,
        error,
        updateCurrentUser,
        clearCurrentUser,
        refreshUser,
        isAuthenticated: !!currentUser,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
