import React from "react";
import { Card, Button, Typography } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { Avatar } from "../../../components/common";

const { Text } = Typography;

const FriendSuggestionItem = ({ suggestion, onAddFriend }) => {
  return (
    <Card
      style={{
        marginBottom: "12px",
        borderRadius: "8px",
      }}
      styles={{ body: { padding: "16px" } }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Avatar>{suggestion.avatar}</Avatar>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "4px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              {suggestion.name}
            </Text>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              {suggestion.mutualFriends} bạn chung
            </Text>
          </div>
        </div>

        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => onAddFriend && onAddFriend(suggestion.id)}
        >
          Thêm bạn
        </Button>
      </div>
    </Card>
  );
};

export default FriendSuggestionItem;
