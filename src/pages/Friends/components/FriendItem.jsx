import React from "react";
import { Card, Button, Space, Typography, Tag, Dropdown, Menu } from "antd";
import {
  MessageOutlined,
  MoreOutlined,
  UserDeleteOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Avatar } from "../../../components/common";

const { Text } = Typography;

const FriendItem = ({ friend, onMessage }) => {
  const handleUnfriend = () => {
    console.log("Huỷ kết bạn với:", friend.name);
    // Xử lý huỷ kết bạn ở đây
  };

  const handleDelete = () => {
    console.log("Xóa bạn:", friend.name);
    // Xử lý xóa bạn ở đây
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="unfriend"
        icon={<UserDeleteOutlined />}
        onClick={handleUnfriend}
      >
        Huỷ kết bạn
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        onClick={handleDelete}
        danger
      >
        Xóa bạn
      </Menu.Item>
    </Menu>
  );

  return (
    <Card
      style={{
        marginBottom: "12px",
        borderRadius: "8px",
      }}
      styles={{ body: { padding: "16px" } }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Avatar isOnline={friend.status === "online"}>{friend.avatar}</Avatar>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "4px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              {friend.name}
            </Text>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              {friend.mutualFriends} bạn chung
            </Text>
            {friend.lastSeen && (
              <Text
                type="secondary"
                style={{ fontSize: "12px", marginLeft: "8px" }}
              >
                • {friend.lastSeen}
              </Text>
            )}
          </div>

          {friend.status === "online" && (
            <Tag color="green" size="small">
              Đang hoạt động
            </Tag>
          )}
        </div>

        <Space>
          <Button
            type="text"
            icon={<MessageOutlined />}
            onClick={() => onMessage && onMessage(friend.id)}
          >
            Nhắn tin
          </Button>
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      </div>
    </Card>
  );
};

export default FriendItem;
