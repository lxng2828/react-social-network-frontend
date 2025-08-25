import React from "react";
import { Card, Button, Space, Typography } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Avatar } from "../../../components/common";

const { Text } = Typography;

const FriendRequestItem = ({ request, onAccept, onReject }) => {
  return (
    <Card
      style={{
        marginBottom: "12px",
        borderRadius: "8px",
        border: "1px solid #d9d9d9",
      }}
      styles={{ body: { padding: "16px" } }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Avatar>{request.avatar}</Avatar>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "4px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              {request.name}
            </Text>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <Text type="secondary" style={{ fontSize: "13px" }}>
              {request.mutualFriends} bạn chung
            </Text>
            <Text
              type="secondary"
              style={{ fontSize: "12px", marginLeft: "8px" }}
            >
              • {request.requestTime}
            </Text>
          </div>
        </div>

        <Space>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => onAccept && onAccept(request.id)}
          >
            Chấp nhận
          </Button>
          <Button
            icon={<CloseOutlined />}
            onClick={() => onReject && onReject(request.id)}
          >
            Từ chối
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default FriendRequestItem;
