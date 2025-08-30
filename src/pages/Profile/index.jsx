import React, { useState, useEffect } from "react";
import {
  Layout,
  Avatar,
  Typography,
  Tabs,
  Card,
  Row,
  Col,
  Button,
  Space,
  Image,
  List,
  Descriptions,
  Badge,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined,
  MoreOutlined,
  TeamOutlined,
  FileTextOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { ProfileHeader, ProfilePostCard } from "./components";
import { useUser } from "../../contexts/UserContext";
import { useParams } from "react-router-dom";
import { getUserById } from "../../services/userService";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [targetUser, setTargetUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const { currentUser, loading } = useUser();
  const { userId } = useParams();

  // Nếu có userId trong URL, hiển thị profile của user khác
  // Nếu không có, hiển thị profile của user hiện tại
  const isOwnProfile = !userId;
  const targetUserId = userId || currentUser?.id;

  // Lấy thông tin user cần hiển thị
  useEffect(() => {
    const fetchUser = async () => {
      if (userId && userId !== currentUser?.id) {
        // Lấy thông tin user khác
        setLoadingUser(true);
        try {
          const userData = await getUserById(userId);
          setTargetUser(userData);
        } catch (error) {
          console.error('Lỗi lấy thông tin user:', error);
        } finally {
          setLoadingUser(false);
        }
      } else {
        // Hiển thị profile của chính mình
        setTargetUser(null);
      }
    };

    if (currentUser) {
      fetchUser();
    }
  }, [userId, currentUser]);

  // Sử dụng thông tin user cần hiển thị
  const user = targetUser || (currentUser ? {
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    phone: currentUser.phone,
    address: currentUser.address,
    dateOfBirth: currentUser.dateOfBirth,
    gender: currentUser.gender,
    profilePictureUrl: currentUser.profilePictureUrl,
  } : null);

  const posts = [
    {
      id: 1,
      content:
        "Vừa hoàn thành xong dự án React mới! Cảm thấy thật tuyệt vời khi được làm việc với team giỏi.",
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
      likes: 24,
      comments: 8,
      shares: 3,
      time: "2 giờ trước",
    },
    {
      id: 2,
      content:
        "Cuối tuần này sẽ đi du lịch Đà Nẵng. Ai có kinh nghiệm gì chia sẻ không?",
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
      likes: 45,
      comments: 12,
      shares: 5,
      time: "1 ngày trước",
    },
    {
      id: 3,
      content:
        "Học được nhiều điều mới từ khóa học React Advanced. Khuyến nghị mọi người thử!",
      likes: 18,
      comments: 6,
      shares: 2,
      time: "3 ngày trước",
    },
  ];

  const friends = [
    {
      id: 1,
      name: "Trần Thị B",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      mutualFriends: 12,
      online: true,
    },
    {
      id: 2,
      name: "Lê Văn C",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      mutualFriends: 8,
      online: false,
    },
    {
      id: 3,
      name: "Phạm Thị D",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      mutualFriends: 15,
      online: true,
    },
  ];

  const photos = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  ];

  const renderPost = (post) => <ProfilePostCard key={post.id} post={post} />;

  const renderFriend = (friend) => (
    <List.Item key={friend.id}>
      <List.Item.Meta
        avatar={
          <Badge dot={friend.online} offset={[-5, 5]}>
            <Avatar size={50} src={friend.avatar} />
          </Badge>
        }
        title={<Text strong>{friend.name}</Text>}
        description={`${friend.mutualFriends} bạn chung`}
      />
      <Button type="primary" size="small">
        Nhắn tin
      </Button>
    </List.Item>
  );

  // Loading state
  if (loading || loadingUser) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: "#f5f5f5"
      }}>
        <div>Đang tải thông tin profile...</div>
      </div>
    );
  }

  // Kiểm tra user
  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: "#f5f5f5"
      }}>
        <div>Không tìm thấy thông tin người dùng</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "60%", width: "100%", margin: "0 auto" }}>
        <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
        <br />
        {/* Tabs */}
        <div style={{ padding: "0 24px" }}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane
                tab={
                  <span>
                    <FileTextOutlined />
                    Bài viết
                  </span>
                }
                key="posts"
              >
                {posts.map(renderPost)}
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <UserOutlined />
                    Thông tin
                  </span>
                }
                key="info"
              >
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="Họ và tên">
                    {user.firstName} {user.lastName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email" icon={<MailOutlined />}>
                    {user.email}
                  </Descriptions.Item>
                  {user.phone && (
                    <Descriptions.Item
                      label="Số điện thoại"
                      icon={<PhoneOutlined />}
                    >
                      {user.phone}
                    </Descriptions.Item>
                  )}
                  {user.address && (
                    <Descriptions.Item
                      label="Địa chỉ"
                      icon={<EnvironmentOutlined />}
                    >
                      {user.address}
                    </Descriptions.Item>
                  )}
                  {user.dateOfBirth && (
                    <Descriptions.Item
                      label="Ngày sinh"
                      icon={<CalendarOutlined />}
                    >
                      {new Date(user.dateOfBirth).toLocaleDateString('vi-VN')}
                    </Descriptions.Item>
                  )}
                  {user.gender && (
                    <Descriptions.Item label="Giới tính">
                      {user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <TeamOutlined />
                    Bạn bè
                  </span>
                }
                key="friends"
              >
                <List
                  dataSource={friends}
                  renderItem={renderFriend}
                  itemLayout="horizontal"
                />
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <PictureOutlined />
                    Ảnh
                  </span>
                }
                key="photos"
              >
                <Row gutter={[16, 16]}>
                  {photos.map((photo, index) => (
                    <Col span={8} key={index}>
                      <Image
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        style={{ width: "100%", borderRadius: 8 }}
                        preview={{ mask: "Xem ảnh" }}
                      />
                    </Col>
                  ))}
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
