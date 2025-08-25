import React from "react";
import { Card, Avatar, Button, Space, Typography } from "antd";
import {
  HeartOutlined,
  CommentOutlined,
  UserAddOutlined,
  UserOutlined,
  ShareAltOutlined,
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Avatar as CommonAvatar } from "../../../components/common";

const { Text } = Typography;

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <HeartOutlined style={{ color: "#ff4d4f" }} />;
      case "comment":
        return <CommentOutlined style={{ color: "#1890ff" }} />;
      case "follow":
        return <UserAddOutlined style={{ color: "#52c41a" }} />;
      case "mention":
        return <UserOutlined style={{ color: "#faad14" }} />;
      case "share":
        return <ShareAltOutlined style={{ color: "#722ed1" }} />;
      default:
        return <BellOutlined style={{ color: "#666" }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "like":
        return "#fff1f0";
      case "comment":
        return "#f0f8ff";
      case "follow":
        return "#f6ffed";
      case "mention":
        return "#fffbe6";
      case "share":
        return "#f9f0ff";
      default:
        return "#fafafa";
    }
  };

  return (
    <Card
      style={{
        marginBottom: "12px",
        borderRadius: "8px",
        backgroundColor: notification.read
          ? "#fff"
          : getNotificationColor(notification.type),
        border: notification.read ? "1px solid #f0f0f0" : "1px solid #d9d9d9",
      }}
      styles={{ body: { padding: "16px" } }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ marginTop: "4px" }}>
          {getNotificationIcon(notification.type)}
        </div>

        <CommonAvatar style={{ marginRight: "12px" }}>
          {notification.avatar}
        </CommonAvatar>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "8px" }}>
            <Text strong>{notification.user}</Text>{" "}
            <Text>{notification.action}</Text>
            {notification.target && (
              <>
                {" "}
                <Text strong style={{ color: "#1890ff" }}>
                  "{notification.target}"
                </Text>
              </>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {notification.time}
            </Text>

            <Space>
              {!notification.read && (
                <Button
                  type="text"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => onMarkAsRead && onMarkAsRead(notification.id)}
                >
                  Đánh dấu đã đọc
                </Button>
              )}
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => onDelete && onDelete(notification.id)}
              >
                Xóa
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationItem;
