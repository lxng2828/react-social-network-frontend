import React, { useState, useEffect, useRef } from 'react';
import { List, Avatar, Spin, Empty } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../../services/userService';
import { getMediaUrl } from '../../services/apiConfig';
import { useUser } from '../../contexts/UserContext';

const SearchDropdown = ({ visible, searchTerm, onUserSelect, onClose }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const searchTimeoutRef = useRef(null);
    const { currentUser } = useUser();

    useEffect(() => {
        if (!visible || !searchTerm || searchTerm.trim().length < 2) {
            setUsers([]);
            return;
        }

        // Debounce search - tìm kiếm sau khi user ngừng gõ 500ms
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                setLoading(true);
                setError(null);
                const searchResults = await searchUsers(searchTerm, 0, 10);

                // Kiểm tra response structure
                if (searchResults && searchResults.content) {
                    setUsers(searchResults.content);
                } else if (Array.isArray(searchResults)) {
                    setUsers(searchResults);
                } else {
                    setUsers([]);
                }
            } catch (err) {
                setError(err.message);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm, visible]);

    const handleUserClick = (user) => {
        // Kiểm tra xem có phải profile của chính mình không
        if (user.id === currentUser?.id) {
            // Nếu là chính mình, navigate đến /profile (không có userId)
            navigate('/profile');
        } else {
            // Nếu là user khác, navigate đến /profile/{userId}
            navigate(`/profile/${user.id}`);
        }

        onUserSelect(user);
        onClose();
    };

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000,
                maxHeight: '400px',
                overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <Spin size="small" />
                    <div style={{ marginTop: '8px', color: '#666' }}>Đang tìm kiếm...</div>
                </div>
            ) : error ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#ff4d4f' }}>
                    {error}
                </div>
            ) : users.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Không tìm thấy người dùng nào"
                        style={{ margin: 0 }}
                    />
                </div>
            ) : (
                <List
                    dataSource={users}
                    renderItem={(user) => (
                        <List.Item
                            style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f0f0f0',
                            }}
                            onClick={() => handleUserClick(user)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f5f5f5';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                            }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        size={40}
                                        src={user.profilePictureUrl ? getMediaUrl(user.profilePictureUrl) : undefined}
                                        icon={!user.profilePictureUrl ? <UserOutlined /> : null}
                                    />
                                }
                                title={
                                    <div style={{ fontWeight: '500', fontSize: '14px' }}>
                                        {user.firstName} {user.lastName}
                                    </div>
                                }
                                description={
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        {user.email}
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default SearchDropdown;
