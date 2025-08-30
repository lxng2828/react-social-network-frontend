import React, { useState, useEffect } from 'react';
import { Button, Space, Spin, message, Tooltip, Dropdown, Modal } from 'antd';
import {
    UserAddOutlined,
    ClockCircleOutlined,
    CheckOutlined,
    CloseOutlined,
    TeamOutlined,
    UserDeleteOutlined,
    DownOutlined
} from '@ant-design/icons';
import {
    sendFriendRequest,
    getFriendshipStatus,
    acceptFriendRequest,
    declineFriendRequest,
    cancelFriendRequest,
    removeFriend
} from '../../services/friendshipService';

const FriendshipActions = ({
    targetUserId,
    isOwnProfile,
    currentUserId,
    onFriendshipChange
}) => {
    const [friendshipStatus, setFriendshipStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sendingRequest, setSendingRequest] = useState(false);
    const [acceptingRequest, setAcceptingRequest] = useState(false);
    const [decliningRequest, setDecliningRequest] = useState(false);
    const [cancelingRequest, setCancelingRequest] = useState(false);
    const [removingFriend, setRemovingFriend] = useState(false);

    // State cho popup xác nhận
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmFriendshipId, setConfirmFriendshipId] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    // Helper function để normalize trạng thái friendship
    const normalizeStatus = (status) => {
        if (!status) return null;

        const normalized = status.toString().toLowerCase();
        console.log('🔄 Normalize status:', status, '->', normalized);
        console.log('🔄 Type của status:', typeof status);
        console.log('🔄 Status gốc:', JSON.stringify(status, null, 2));

        // Kiểm tra trường hợp 'not_friends' trước để tránh hiểu nhầm
        if (normalized === 'not_friends' || normalized === 'none') {
            console.log('✅ Match NONE (not_friends)');
            return 'NONE';
        }

        if (normalized.includes('pending_sent') || normalized.includes('sent')) {
            console.log('✅ Match PENDING_SENT');
            return 'PENDING_SENT';
        }
        if (normalized.includes('pending_received') || normalized.includes('received')) {
            console.log('✅ Match PENDING_RECEIVED');
            return 'PENDING_RECEIVED';
        }
        if (normalized === 'friends' || normalized === 'accepted') {
            console.log('✅ Match FRIENDS (chính xác)');
            return 'FRIENDS';
        }

        console.log('⚠️ Không match với pattern nào, trả về:', normalized.toUpperCase());
        return normalized.toUpperCase();
    };

    // Hàm hiển thị popup xác nhận
    const showConfirmModal = (action, friendshipId, message) => {
        setConfirmAction(action);
        setConfirmFriendshipId(friendshipId);
        setConfirmMessage(message);
        setConfirmModalVisible(true);
        console.log('🔄 Hiển thị popup xác nhận cho:', action, 'với ID:', friendshipId);
    };

    // Hàm xử lý khi người dùng xác nhận trong popup
    const handleConfirm = async () => {
        if (!confirmAction || !confirmFriendshipId) return;

        setConfirmLoading(true);
        console.log('🔄 Xác nhận thực hiện:', confirmAction, 'với ID:', confirmFriendshipId);

        try {
            switch (confirmAction) {
                case 'decline':
                    await handleDeclineRequest(confirmFriendshipId);
                    break;
                case 'remove':
                    await handleRemoveFriend(confirmFriendshipId);
                    break;
                default:
                    console.error('❌ Hành động không được hỗ trợ:', confirmAction);
                    break;
            }
        } catch (error) {
            console.error('❌ Lỗi khi thực hiện hành động:', error);
        } finally {
            setConfirmLoading(false);
            setConfirmModalVisible(false);
            setConfirmAction(null);
            setConfirmFriendshipId(null);
            setConfirmMessage('');
        }
    };

    // Kiểm tra trạng thái friendship khi component mount
    useEffect(() => {
        const checkFriendshipStatus = async () => {
            if (!isOwnProfile && targetUserId && currentUserId) {
                setLoading(true);
                try {
                    const status = await getFriendshipStatus(targetUserId);
                    console.log('🔄 API trả về trạng thái:', status);
                    console.log('🔄 Type của status:', typeof status);
                    console.log('🔄 Status gốc:', JSON.stringify(status, null, 2));

                    // Merge dữ liệu từ API status với dữ liệu hiện tại
                    if (status && status.data) {
                        const apiData = status.data;
                        console.log('🔄 Dữ liệu từ API status:', apiData);
                        console.log('🔄 apiData.status:', apiData.status);
                        console.log('🔄 apiData.friendshipId:', apiData.friendshipId);

                        // Tạo trạng thái mới với cả id và friendshipId
                        const mergedStatus = {
                            status: apiData.status,
                            id: apiData.friendshipId, // Sử dụng friendshipId từ API status
                            friendshipId: apiData.friendshipId, // Giữ nguyên friendshipId
                            senderId: currentUserId,
                            receiverId: targetUserId
                        };

                        console.log('🔄 Trạng thái merged:', mergedStatus);
                        console.log('🔄 mergedStatus.status sẽ được normalize:', mergedStatus.status);
                        setFriendshipStatus(mergedStatus);
                    } else {
                        console.log('⚠️ Status không có data, set trực tiếp:', status);
                        setFriendshipStatus(status);
                    }
                } catch (error) {
                    console.error('Lỗi kiểm tra trạng thái friendship:', error);
                    message.error('Không thể kiểm tra trạng thái kết bạn');
                } finally {
                    setLoading(false);
                }
            }
        };

        checkFriendshipStatus();
    }, [isOwnProfile, targetUserId, currentUserId]);

    // Gửi lời mời kết bạn
    const handleSendFriendRequest = async () => {
        if (!targetUserId) return;

        try {
            setSendingRequest(true);
            const response = await sendFriendRequest(targetUserId);
            message.success('Đã gửi lời mời kết bạn!');

            console.log('✅ Gửi lời mời thành công, response:', response);

            // Lấy friendshipId từ response API
            // API trả về FriendshipResponseDto với id của friendship
            const friendshipId = response?.id;

            if (!friendshipId) {
                console.error('❌ Không có friendshipId từ API response');
                message.error('Không thể lấy ID lời mời kết bạn');
                return;
            }

            // Cập nhật trạng thái friendship với ID thực tế
            // API trả về status: "PENDING", nhưng chúng ta cần phân biệt PENDING_SENT vs PENDING_RECEIVED
            const pendingStatus = {
                status: 'PENDING_SENT', // Chúng ta tự set để phân biệt
                id: friendshipId, // ID từ API gửi lời mời
                friendshipId: friendshipId, // Thêm friendshipId để tương thích với API status
                senderId: currentUserId,
                receiverId: targetUserId,
                createdAt: response?.createdAt || new Date().toISOString(),
                originalStatus: response?.status // Giữ lại status gốc từ API
            };

            console.log('🔄 Set trạng thái PENDING_SENT với ID thực:', pendingStatus);
            setFriendshipStatus(pendingStatus);

            // Thông báo cho component cha
            if (onFriendshipChange) {
                onFriendshipChange(pendingStatus);
            }

        } catch (error) {
            console.error('❌ Lỗi gửi lời mời:', error);
            message.error(error.message || 'Gửi lời mời kết bạn thất bại!');
        } finally {
            setSendingRequest(false);
        }
    };

    // Chấp nhận lời mời kết bạn
    const handleAcceptRequest = async (friendshipId) => {
        if (!friendshipId) return;

        try {
            setAcceptingRequest(true);
            await acceptFriendRequest(friendshipId);
            message.success('Đã chấp nhận lời mời kết bạn!');

            console.log('✅ Chấp nhận lời mời thành công, friendshipId:', friendshipId);

            // Sau khi chấp nhận, cập nhật trạng thái thành FRIENDS
            const friendsStatus = {
                status: 'FRIENDS',
                id: friendshipId,
                friendshipId: friendshipId,
                senderId: currentUserId,
                receiverId: targetUserId
            };

            console.log('🔄 Set trạng thái FRIENDS sau khi chấp nhận:', friendsStatus);
            setFriendshipStatus(friendsStatus);

            // Thông báo cho component cha
            if (onFriendshipChange) {
                onFriendshipChange(friendsStatus);
            }

        } catch (error) {
            console.error('❌ Lỗi chấp nhận lời mời:', error);
            message.error(error.message || 'Chấp nhận lời mời thất bại!');
        } finally {
            setAcceptingRequest(false);
        }
    };

    // Từ chối lời mời kết bạn
    const handleDeclineRequest = async (friendshipId) => {
        if (!friendshipId) return;

        try {
            setDecliningRequest(true);
            await declineFriendRequest(friendshipId);
            message.success('Đã từ chối lời mời kết bạn!');

            console.log('✅ Từ chối lời mời thành công, friendshipId:', friendshipId);

            // Sau khi từ chối, cập nhật trạng thái về NONE
            const noneStatus = {
                status: 'NONE',
                id: null,
                friendshipId: null,
                senderId: null,
                receiverId: null
            };

            console.log('🔄 Set trạng thái NONE sau khi từ chối:', noneStatus);
            setFriendshipStatus(noneStatus);

            // Thông báo cho component cha
            if (onFriendshipChange) {
                onFriendshipChange(noneStatus);
            }

        } catch (error) {
            console.error('❌ Lỗi từ chối lời mời:', error);
            message.error(error.message || 'Từ chối lời mời thất bại!');
        } finally {
            setDecliningRequest(false);
        }
    };

    // Hủy lời mời kết bạn
    const handleCancelRequest = async (friendshipId) => {
        console.log('🔄 Bắt đầu hủy lời mời, friendshipId:', friendshipId);
        console.log('🔄 friendshipStatus hiện tại:', friendshipStatus);

        // Sử dụng friendshipId từ parameter hoặc từ friendshipStatus
        const actualFriendshipId = friendshipId || friendshipStatus?.id || friendshipStatus?.friendshipId;

        if (!actualFriendshipId) {
            console.error('❌ Không có friendshipId để hủy');
            console.error('❌ friendshipStatus:', friendshipStatus);
            message.error('Không có ID lời mời để hủy');
            return;
        }

        try {
            setCancelingRequest(true);
            console.log('🔄 Gọi API cancelFriendRequest với ID:', actualFriendshipId);

            const response = await cancelFriendRequest(actualFriendshipId);
            console.log('✅ API cancelFriendRequest thành công, response:', response);

            message.success('Đã hủy lời mời kết bạn!');

            // Sau khi hủy lời mời, cập nhật trạng thái về NONE
            const noneStatus = {
                status: 'NONE',
                id: null,
                friendshipId: null,
                senderId: null,
                receiverId: null
            };

            console.log('🔄 Set trạng thái NONE sau khi hủy lời mời:', noneStatus);
            setFriendshipStatus(noneStatus);

            // Thông báo cho component cha
            if (onFriendshipChange) {
                onFriendshipChange(noneStatus);
            }

        } catch (error) {
            console.error('❌ Lỗi hủy lời mời:', error);
            console.error('❌ Error details:', {
                message: error.message,
                stack: error.stack,
                friendshipId,
                currentStatus: friendshipStatus
            });
            message.error(error.message || 'Hủy lời mời thất bại!');
        } finally {
            setCancelingRequest(false);
        }
    };

    // Hủy kết bạn
    const handleRemoveFriend = async (friendshipId) => {
        if (!friendshipId) return;

        try {
            setRemovingFriend(true);
            await removeFriend(friendshipId);
            message.success('Đã hủy kết bạn!');

            console.log('✅ Hủy kết bạn thành công, friendshipId:', friendshipId);

            // Sau khi hủy kết bạn, cập nhật trạng thái về NONE
            const noneStatus = {
                status: 'NONE',
                id: null,
                friendshipId: null,
                senderId: null,
                receiverId: null
            };

            console.log('🔄 Set trạng thái NONE sau khi hủy kết bạn:', noneStatus);
            setFriendshipStatus(noneStatus);

            // Thông báo cho component cha
            if (onFriendshipChange) {
                onFriendshipChange(noneStatus);
            }

        } catch (error) {
            console.error('❌ Lỗi hủy kết bạn:', error);
            message.error(error.message || 'Hủy kết bạn thất bại!');
        } finally {
            setRemovingFriend(false);
        }
    };

    // Không hiển thị gì nếu là profile của chính mình
    if (isOwnProfile) {
        return null;
    }

    // Loading state
    if (loading) {
        return (
            <div style={{ textAlign: "center" }}>
                <Spin size="small" />
                <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                    Đang kiểm tra...
                </div>
            </div>
        );
    }

    // Render các actions dựa trên trạng thái friendship
    if (friendshipStatus) {
        const rawStatus = friendshipStatus.status;
        const status = normalizeStatus(rawStatus);

        console.log('🔍 Render FriendshipActions:', {
            friendshipStatus,
            rawStatus,
            normalizedStatus: status,
            targetUserId,
            currentUserId
        });
        console.log('🔍 So sánh status === "FRIENDS":', status === 'FRIENDS');
        console.log('🔍 So sánh status === "NONE":', status === 'NONE');
        console.log('🔍 So sánh status === "PENDING_SENT":', status === 'PENDING_SENT');
        console.log('🔍 So sánh status === "PENDING_RECEIVED":', status === 'PENDING_RECEIVED');

        // Đã gửi lời mời - hiển thị "Đã gửi" với tooltip "Hủy lời mời"
        if (status === 'PENDING_SENT') {
            console.log('✅ Render PENDING_SENT state với ID:', friendshipStatus.id);
            console.log('✅ friendshipId từ API status:', friendshipStatus.friendshipId);

            // Sử dụng friendshipId từ API status nếu có, fallback về id
            const actualId = friendshipStatus.friendshipId || friendshipStatus.id;

            return (
                <>
                    <Tooltip title="Hủy lời mời" placement="top">
                        <Button
                            type="default"
                            icon={<ClockCircleOutlined />}
                            style={{ width: '100%' }}
                            size="large"
                            onClick={() => {
                                console.log('🖱️ Click vào nút "Đã gửi"');
                                console.log('🖱️ friendshipStatus.id:', friendshipStatus.id);
                                console.log('🖱️ friendshipStatus.friendshipId:', friendshipStatus.friendshipId);
                                console.log('🖱️ Sử dụng ID:', actualId);
                                handleCancelRequest(actualId);
                            }}
                            loading={cancelingRequest}
                        >
                            Đã gửi
                        </Button>
                    </Tooltip>

                    {/* Modal xác nhận */}
                    <ConfirmModal
                        visible={confirmModalVisible}
                        onOk={handleConfirm}
                        onCancel={() => {
                            setConfirmModalVisible(false);
                            setConfirmAction(null);
                            setConfirmFriendshipId(null);
                            setConfirmMessage('');
                        }}
                        loading={confirmLoading}
                        message={confirmMessage}
                        action={confirmAction}
                    />
                </>
            );
        }

        // Đã nhận lời mời
        if (status === 'PENDING_RECEIVED') {
            console.log('✅ Render PENDING_RECEIVED state');
            console.log('✅ friendshipStatus.id:', friendshipStatus.id);
            console.log('✅ friendshipStatus.friendshipId:', friendshipStatus.friendshipId);

            // Sử dụng friendshipId từ API status nếu có, fallback về id
            const actualId = friendshipStatus.friendshipId || friendshipStatus.id;
            console.log('✅ Sử dụng ID để chấp nhận/từ chối:', actualId);

            return (
                <>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            size="small"
                            style={{ width: '100%' }}
                            onClick={() => {
                                console.log('🖱️ Click vào nút "Chấp nhận"');
                                console.log('🖱️ Sử dụng ID:', actualId);
                                handleAcceptRequest(actualId);
                            }}
                            loading={acceptingRequest}
                        >
                            Chấp nhận
                        </Button>
                        <Button
                            danger
                            icon={<CloseOutlined />}
                            size="small"
                            style={{ width: '100%' }}
                            onClick={() => {
                                console.log('🖱️ Click vào nút "Từ chối"');
                                console.log('🖱️ Sử dụng ID:', actualId);
                                showConfirmModal('decline', actualId, 'Bạn có chắc chắn muốn từ chối lời mời kết bạn này?');
                            }}
                            loading={decliningRequest}
                        >
                            Từ chối
                        </Button>
                    </Space>

                    {/* Modal xác nhận */}
                    <ConfirmModal
                        visible={confirmModalVisible}
                        onOk={handleConfirm}
                        onCancel={() => {
                            setConfirmModalVisible(false);
                            setConfirmAction(null);
                            setConfirmFriendshipId(null);
                            setConfirmMessage('');
                        }}
                        loading={confirmLoading}
                        message={confirmMessage}
                        action={confirmAction}
                    />
                </>
            );
        }

        // Đã là bạn bè - hiển thị "Bạn bè" với dropdown để hủy kết bạn
        if (status === 'FRIENDS') {
            console.log('✅ Render FRIENDS state');
            console.log('✅ friendshipStatus.id:', friendshipStatus.id);
            console.log('✅ friendshipStatus.friendshipId:', friendshipStatus.friendshipId);

            // Sử dụng friendshipId từ API status nếu có, fallback về id
            const actualId = friendshipStatus.friendshipId || friendshipStatus.id;
            console.log('✅ Sử dụng ID để hủy kết bạn:', actualId);

            const friendMenuItems = [
                {
                    key: 'remove',
                    label: 'Hủy kết bạn',
                    icon: <UserDeleteOutlined />,
                    danger: true,
                    onClick: () => {
                        console.log('🖱️ Click vào "Hủy kết bạn" trong dropdown');
                        console.log('🖱️ Sử dụng ID:', actualId);
                        showConfirmModal('remove', actualId, 'Bạn có chắc chắn muốn hủy kết bạn với người này?');
                    }
                }
            ];

            return (
                <>
                    <Dropdown
                        menu={{ items: friendMenuItems }}
                        placement="bottomRight"
                        trigger={['hover']}
                    >
                        <Button
                            type="default"
                            icon={<TeamOutlined />}
                            style={{ width: '100%' }}
                            size="large"
                            loading={removingFriend}
                        >
                            Bạn bè <DownOutlined />
                        </Button>
                    </Dropdown>

                    {/* Modal xác nhận */}
                    <ConfirmModal
                        visible={confirmModalVisible}
                        onOk={handleConfirm}
                        onCancel={() => {
                            setConfirmModalVisible(false);
                            setConfirmAction(null);
                            setConfirmFriendshipId(null);
                            setConfirmMessage('');
                        }}
                        loading={confirmLoading}
                        message={confirmMessage}
                        action={confirmAction}
                    />
                </>
            );
        }

        // Chưa kết bạn - hiển thị "Kết bạn" với màu primary
        if (status === 'NONE') {
            console.log('✅ Render NONE state');
            return (
                <>
                    <Button
                        type="primary"
                        icon={<UserAddOutlined />}
                        loading={sendingRequest}
                        onClick={handleSendFriendRequest}
                        style={{ width: '100%' }}
                        size="large"
                    >
                        Kết bạn
                    </Button>

                    {/* Modal xác nhận */}
                    <ConfirmModal
                        visible={confirmModalVisible}
                        onOk={handleConfirm}
                        onCancel={() => {
                            setConfirmModalVisible(false);
                            setConfirmAction(null);
                            setConfirmFriendshipId(null);
                            setConfirmMessage('');
                        }}
                        loading={confirmLoading}
                        message={confirmMessage}
                        action={confirmAction}
                    />
                </>
            );
        }

        console.log('⚠️ Không match với trạng thái nào, rawStatus:', rawStatus, 'normalizedStatus:', status);
    }

    // Fallback: Hiển thị nút kết bạn khi chưa có trạng thái
    console.log('🔄 Render fallback state (no friendshipStatus)');
    return (
        <>
            <Button
                type="primary"
                icon={<UserAddOutlined />}
                loading={sendingRequest}
                onClick={handleSendFriendRequest}
                style={{ width: '100%' }}
                size="large"
            >
                Kết bạn
            </Button>

            {/* Modal xác nhận - luôn được render */}
            <ConfirmModal
                visible={confirmModalVisible}
                onOk={handleConfirm}
                onCancel={() => {
                    setConfirmModalVisible(false);
                    setConfirmAction(null);
                    setConfirmFriendshipId(null);
                    setConfirmMessage('');
                }}
                loading={confirmLoading}
                message={confirmMessage}
                action={confirmAction}
            />
        </>
    );
};

// Modal xác nhận - luôn được render bên ngoài component chính
const ConfirmModal = ({
    visible,
    onOk,
    onCancel,
    loading,
    message,
    action
}) => (
    <Modal
        title="Xác nhận hành động"
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={loading}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{
            danger: action === 'remove' || action === 'decline'
        }}
    >
        <p>{message}</p>
    </Modal>
);

export default FriendshipActions;
