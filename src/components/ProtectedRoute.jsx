import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { isAuthenticated } from '../utils/tokenUtils';
import { checkToken } from '../services/authService';

const ProtectedRoute = ({ children }) => {
    const [isValidating, setIsValidating] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const validateToken = async () => {
            if (!isAuthenticated()) {
                setIsValidating(false);
                setIsValid(false);
                return;
            }

            try {
                const isValidToken = await checkToken();
                setIsValid(isValidToken);
            } catch (error) {
                console.error('Token validation error:', error);
                setIsValid(false);
            } finally {
                setIsValidating(false);
            }
        };

        validateToken();
    }, []);

    if (isValidating) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!isValid) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
