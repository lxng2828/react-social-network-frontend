import React from "react";
import { List, Avatar, Badge, Typography } from "antd";
import { Avatar as CommonAvatar } from "../../../components/common";

const { Text } = Typography;

const ConversationItem = ({ conversation, isSelected, onClick }) => {
  return (
    <List.Item
      style={{
        padding: "12px 16px",
        cursor: "pointer",
        backgroundColor: isSelected ? "#f0f8ff" : "transparent",
        borderBottom: "1px solid #f0f0f0",
      }}
      onClick={() => onClick && onClick(conversation.id)}
    >
      <List.Item.Meta
        avatar={
          <CommonAvatar isOnline={conversation.online}>
            {conversation.avatar}
          </CommonAvatar>
        }
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text strong>{conversation.name}</Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {conversation.time}
            </Text>
          </div>
        }
        description={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text
              type="secondary"
              style={{
                fontSize: "13px",
                color: conversation.unread > 0 ? "#000" : "#666",
                fontWeight: conversation.unread > 0 ? "500" : "normal",
              }}
            >
              {conversation.lastMessage}
            </Text>
            {conversation.unread > 0 && (
              <Badge count={conversation.unread} size="small" />
            )}
          </div>
        }
      />
    </List.Item>
  );
};

export default ConversationItem;
