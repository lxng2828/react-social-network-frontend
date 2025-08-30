import React, { useState, useEffect } from "react";
import { Typography, Tabs, Empty, Spin, message, Input, Space, Button } from "antd";
import { UserOutlined, TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  getFriendsList,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend
} from "../../services/friendshipService";
import { useUser } from "../../contexts/UserContext";

const { Text, Title } = Typography;
const { Search } = Input;

const Friends = () => {
  const [activeTab, setActiveTab] = useState("friends");
  const [searchText, setSearchText] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [acceptingRequest, setAcceptingRequest] = useState(null);
  const [decliningRequest, setDecliningRequest] = useState(null);
  const [removingFriend, setRemovingFriend] = useState(null);

  const { currentUser } = useUser();

  // Lấy danh sách bạn bè
  const fetchFriends = async () => {
    if (activeTab !== "friends") return;

    setLoading(true);
    try {
      const response = await getFriendsList(1, 20); // page bắt đầu từ 1
      setFriends(response.content || []);
    } catch (error) {
      message.error('Không thể tải danh sách bạn bè');
      console.error('Lỗi tải bạn bè:', error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách lời mời kết bạn
  const fetchFriendRequests = async () => {
    if (activeTab !== "requests") return;

    setLoadingRequests(true);
    try {
      const response = await getFriendRequests(1, 20); // page bắt đầu từ 1
      setFriendRequests(response.content || []);
    } catch (error) {
      message.error('Không thể tải danh sách lời mời kết bạn');
      console.error('Lỗi tải lời mời:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (activeTab === "friends") {
      fetchFriends();
    } else if (activeTab === "requests") {
      fetchFriendRequests();
    }
  }, [activeTab]);

  // Xử lý chấp nhận lời mời kết bạn
  const handleAcceptRequest = async (requestId) => {
    setAcceptingRequest(requestId);
    try {
      await acceptFriendRequest(requestId);
      message.success('Đã chấp nhận lời mời kết bạn!');
      // Cập nhật danh sách
      fetchFriendRequests();
      fetchFriends(); // Cập nhật danh sách bạn bè
    } catch (error) {
      message.error('Không thể chấp nhận lời mời kết bạn');
    } finally {
      setAcceptingRequest(null);
    }
  };

  // Xử lý từ chối lời mời kết bạn
  const handleDeclineRequest = async (requestId) => {
    setDecliningRequest(requestId);
    try {
      await declineFriendRequest(requestId);
      message.success('Đã từ chối lời mời kết bạn!');
      // Cập nhật danh sách
      fetchFriendRequests();
    } catch (error) {
      message.error('Không thể từ chối lời mời kết bạn');
    } finally {
      setDecliningRequest(null);
    }
  };

  // Xử lý hủy kết bạn
  const handleRemoveFriend = async (friendId) => {
    setRemovingFriend(friendId);
    try {
      await removeFriend(friendId);
      message.success('Đã hủy kết bạn!');
      // Cập nhật danh sách
      fetchFriends();
    } catch (error) {
      message.error('Không thể hủy kết bạn');
    } finally {
      setRemovingFriend(null);
    }
  };

  // Xử lý nhắn tin
  const handleMessage = (friend) => {
    message.info(`Chức năng nhắn tin với ${friend.firstName} ${friend.lastName} sẽ được phát triển sau`);
  };

  // Filter dữ liệu theo search
  const getFilteredFriends = () => {
    if (!searchText) return friends;
    return friends.filter(friend =>
      `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchText.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const getFilteredRequests = () => {
    if (!searchText) return friendRequests;
    return friendRequests.filter(request =>
      `${request.firstName} ${request.lastName}`.toLowerCase().includes(searchText.toLowerCase()) ||
      request.email.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const items = [
    {
      key: "friends",
      label: (
        <span>
          <TeamOutlined /> Bạn bè
          <span style={{ marginLeft: 8, color: '#666' }}>
            ({friends.length})
          </span>
        </span>
      ),
    },
    {
      key: "requests",
      label: (
        <span>
          <UserAddOutlined /> Lời mời kết bạn
        </span>
      ),
    },
  ];

  return (
    <div
      style={{
        maxWidth: "60%",
        width: "100%",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <Title level={3} style={{ margin: 0 }}>
          Bạn bè
        </Title>
        <Text type="secondary">
          Quản lý danh sách bạn bè và lời mời kết bạn
        </Text>
      </div>

      <Search
        placeholder="Tìm kiếm bạn bè..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: "16px" }}
        allowClear
      />

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        style={{ marginBottom: "16px" }}
      />

      {activeTab === "friends" && (
        <div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spin size="large" />
              <div style={{ marginTop: "16px" }}>Đang tải danh sách bạn bè...</div>
            </div>
          ) : getFilteredFriends().length > 0 ? (
            getFilteredFriends().map(friend => (
              <div key={friend.id} style={{
                padding: "16px",
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {friend.firstName} {friend.lastName}
                  </div>
                  <div style={{ color: "#666" }}>{friend.email}</div>
                </div>
                <Space>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleMessage(friend)}
                  >
                    Nhắn tin
                  </Button>
                  <Button
                    danger
                    size="small"
                    loading={removingFriend === friend.friendshipId}
                    onClick={() => handleRemoveFriend(friend.friendshipId)}
                  >
                    Hủy kết bạn
                  </Button>
                </Space>
              </div>
            ))
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                searchText
                  ? "Không tìm thấy bạn bè nào phù hợp"
                  : "Bạn chưa có bạn bè nào"
              }
            />
          )}
        </div>
      )}

      {activeTab === "requests" && (
        <div>
          {loadingRequests ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spin size="large" />
              <div style={{ marginTop: "16px" }}>Đang tải lời mời kết bạn...</div>
            </div>
          ) : getFilteredRequests().length > 0 ? (
            getFilteredRequests().map(request => (
              <div key={request.id} style={{
                padding: "16px",
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {request.firstName} {request.lastName}
                  </div>
                  <div style={{ color: "#666" }}>{request.email}</div>
                </div>
                <Space>
                  <Button
                    type="primary"
                    size="small"
                    loading={acceptingRequest === request.friendshipId}
                    onClick={() => handleAcceptRequest(request.friendshipId)}
                  >
                    Chấp nhận
                  </Button>
                  <Button
                    danger
                    size="small"
                    loading={decliningRequest === request.friendshipId}
                    onClick={() => handleDeclineRequest(request.friendshipId)}
                  >
                    Từ chối
                  </Button>
                </Space>
              </div>
            ))
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                searchText
                  ? "Không tìm thấy lời mời nào phù hợp"
                  : "Không có lời mời kết bạn nào"
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Friends;
