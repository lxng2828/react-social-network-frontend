import React, { useState } from "react";
import { List, Typography, Badge, Tabs } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { SearchInput, EmptyState } from "../../components/common";
import { NotificationItem } from "./components";

const { Text, Title } = Typography;

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");

  const notifications = [
    {
      id: 1,
      type: "like",
      user: "Nguyễn Văn A",
      avatar: "A",
      action: "đã thích bài viết của bạn",
      target: "Dự án React mới",
      time: "2 phút trước",
      read: false,
    },
    {
      id: 2,
      type: "comment",
      user: "Trần Thị B",
      avatar: "B",
      action: "đã bình luận bài viết của bạn",
      target: "Bài viết về JavaScript",
      time: "15 phút trước",
      read: false,
    },
    {
      id: 3,
      type: "follow",
      user: "Lê Văn C",
      avatar: "C",
      action: "đã theo dõi bạn",
      target: "",
      time: "1 giờ trước",
      read: true,
    },
    {
      id: 4,
      type: "mention",
      user: "Phạm Thị D",
      avatar: "D",
      action: "đã nhắc đến bạn trong bình luận",
      target: "Bài viết về AI",
      time: "2 giờ trước",
      read: false,
    },
    {
      id: 5,
      type: "like",
      user: "Hoàng Văn E",
      avatar: "E",
      action: "đã thích bình luận của bạn",
      target: "Bình luận về React",
      time: "3 giờ trước",
      read: true,
    },
    {
      id: 6,
      type: "share",
      user: "Vũ Thị F",
      avatar: "F",
      action: "đã chia sẻ bài viết của bạn",
      target: "Bài viết về Web Development",
      time: "5 giờ trước",
      read: true,
    },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "unread") return !notification.read;
    if (activeTab === "read") return notification.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id) => {
    console.log("Mark as read:", id);
    // Xử lý đánh dấu đã đọc
  };

  const handleDelete = (id) => {
    console.log("Delete notification:", id);
    // Xử lý xóa thông báo
  };

  const items = [
    {
      key: "all",
      label: (
        <span>
          Tất cả
          <Badge count={notifications.length} style={{ marginLeft: 8 }} />
        </span>
      ),
    },
    {
      key: "unread",
      label: (
        <span>
          Chưa đọc
          <Badge count={unreadCount} style={{ marginLeft: 8 }} />
        </span>
      ),
    },
    {
      key: "read",
      label: (
        <span>
          Đã đọc
          <Badge
            count={notifications.length - unreadCount}
            style={{ marginLeft: 8 }}
          />
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
          Thông báo
        </Title>
        <Text type="secondary">Bạn có {unreadCount} thông báo chưa đọc</Text>
      </div>

      <SearchInput
        placeholder="Tìm kiếm thông báo..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        style={{ marginBottom: "16px" }}
      />

      <List
        dataSource={filteredNotifications}
        renderItem={(notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
          />
        )}
      />

      {filteredNotifications.length === 0 && (
        <EmptyState icon={<BellOutlined />} title="Không có thông báo nào" />
      )}
    </div>
  );
};

export default Notifications;
