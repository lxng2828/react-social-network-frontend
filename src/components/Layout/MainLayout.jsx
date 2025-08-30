import React, { useState } from "react";
import { Layout, Menu, Input, Avatar, Badge, Button, Dropdown } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  MessageOutlined,
  BellOutlined,
  TeamOutlined,
  CompassOutlined,
  SettingOutlined,
  SearchOutlined,
  PlusOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { logout } from "../../services/authService";
import { useUser } from "../../contexts/UserContext";
import { getMediaUrl } from "../../utils/mediaUtils";
import SearchDropdown from "../common/SearchDropdown";

const { Header, Sider, Content } = Layout;
const { Search } = Input;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, clearCurrentUser } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);

  const leftMenuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Trang chủ",
    },
    {
      key: "/profile",
      icon: <UserOutlined />,
      label: "Hồ sơ",
    },
    {
      key: "/friends",
      icon: <TeamOutlined />,
      label: "Bạn bè",
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
  };

  const handleLogout = async () => {
    try {
      await logout();
      clearCurrentUser(); // Xóa thông tin user khỏi context
      navigate("/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      clearCurrentUser(); // Vẫn xóa thông tin user
      // Vẫn redirect về login ngay cả khi có lỗi
      navigate("/login");
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Trang cá nhân",
      onClick: () => navigate("/profile"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      onClick: () => navigate("/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header
        style={{
          padding: "0 24px",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2 style={{ margin: 0, color: "#1890ff" }}>SocialApp</h2>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            position: "relative",
          }}
        >
          <Search
            placeholder="Tìm kiếm người dùng..."
            style={{ width: 500 }}
            allowClear
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchVisible(e.target.value.length > 0);
            }}
            onFocus={() => {
              if (searchTerm.length > 0) setSearchVisible(true);
            }}
            onBlur={() => {
              // Delay để user có thể click vào kết quả
              setTimeout(() => setSearchVisible(false), 200);
            }}
          />
          <SearchDropdown
            visible={searchVisible}
            searchTerm={searchTerm}
            onUserSelect={(user) => {
              setSearchTerm("");
              setSearchVisible(false);
            }}
            onClose={() => setSearchVisible(false)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginRight: "48px" }}>
            <Badge count={3}>
              <MessageOutlined
                style={{ fontSize: "20px", cursor: "pointer" }}
                onClick={() => navigate("/messages")}
              />
            </Badge>
            <Badge count={5}>
              <BellOutlined
                style={{ fontSize: "20px", cursor: "pointer" }}
                onClick={handleNotificationClick}
              />
            </Badge>
          </div>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <span style={{ fontWeight: "500", color: "#333" }}>
                {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Người dùng"}
              </span>
              <Avatar
                size="large"
                src={currentUser?.profilePictureUrl ? getMediaUrl(currentUser.profilePictureUrl) : undefined}
                icon={!currentUser?.profilePictureUrl ? <UserOutlined /> : null}
              />

            </div>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        {/* Left Sidebar */}
        <Sider
          width={250}
          style={{
            background: "#fff",
            borderRight: "1px solid #f0f0f0",
            position: "sticky",
            top: 64,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={leftMenuItems}
            onClick={handleMenuClick}
            style={{ border: "none", paddingTop: "16px" }}
          />
        </Sider>

        {/* Main Content */}
        <Content
          style={{
            margin: "24px",
            padding: "0 24px",
            minHeight: 280,
            background: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <Outlet />
        </Content>

        {/* Right Sidebar */}
        <Sider
          width={300}
          style={{
            background: "#fff",
            borderLeft: "1px solid #f0f0f0",
            position: "sticky",
            top: 64,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
          }}
        >
          <div style={{ padding: "24px" }}>
            <h3>Bạn bè của tôi</h3>
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <Avatar size="small" icon={<UserOutlined />} />
                <span>Nguyễn Văn A</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <Avatar size="small" icon={<UserOutlined />} />
                <span>Trần Thị B</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Avatar size="small" icon={<UserOutlined />} />
                <span>Lê Văn C</span>
              </div>
            </div>

            <h3>Xu hướng</h3>
            <div>
              <div style={{ marginBottom: "8px" }}>
                <span style={{ color: "#1890ff" }}>#ReactJS</span>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  1.2k bài viết
                </div>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <span style={{ color: "#1890ff" }}>#JavaScript</span>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  856 bài viết
                </div>
              </div>
              <div>
                <span style={{ color: "#1890ff" }}>#WebDevelopment</span>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  543 bài viết
                </div>
              </div>
            </div>
          </div>
        </Sider>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
