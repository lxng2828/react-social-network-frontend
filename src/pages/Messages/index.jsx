import React, { useState } from "react";
import {
  Layout,
  List,
  Avatar,
  Input,
  Button,
  Space,
  Typography,
  Badge,
} from "antd";
import {
  SendOutlined,
  SearchOutlined,
  MoreOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { ConversationItem, MessageBubble } from "./components";

const { Sider, Content } = Layout;
const { TextArea } = Input;
const { Text, Title } = Typography;

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "A",
      lastMessage: "Bạn có rảnh không?",
      time: "2 phút trước",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "B",
      lastMessage: "Cảm ơn bạn đã giúp đỡ!",
      time: "1 giờ trước",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Lê Văn C",
      avatar: "C",
      lastMessage: "Hẹn gặp lại nhé!",
      time: "3 giờ trước",
      unread: 1,
      online: true,
    },
    {
      id: 4,
      name: "Phạm Thị D",
      avatar: "D",
      lastMessage: "Dự án đang tiến triển tốt",
      time: "1 ngày trước",
      unread: 0,
      online: false,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "them",
      content: "Chào bạn!",
      time: "10:30",
    },
    {
      id: 2,
      sender: "me",
      content: "Chào! Bạn khỏe không?",
      time: "10:31",
    },
    {
      id: 3,
      sender: "them",
      content: "Mình khỏe, cảm ơn bạn. Bạn có rảnh không?",
      time: "10:32",
    },
    {
      id: 4,
      sender: "me",
      content: "Có rảnh, có gì không?",
      time: "10:33",
    },
    {
      id: 5,
      sender: "them",
      content: "Bạn có thể giúp mình xem qua code này không?",
      time: "10:35",
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Xử lý gửi tin nhắn ở đây
      setMessage("");
    }
  };

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedChat
  );

  return (
    <Layout style={{ height: "calc(100vh - 112px)", background: "#fff" }}>
      {/* Left Sidebar - Conversations List */}
      <Sider
        width={350}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "16px" }}>
          <Title level={4} style={{ margin: "0 0 16px 0" }}>
            Tin nhắn
          </Title>
          <Input
            placeholder="Tìm kiếm tin nhắn..."
            prefix={<SearchOutlined />}
            style={{ marginBottom: "16px" }}
          />
        </div>

        <List
          dataSource={conversations}
          renderItem={(conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedChat === conversation.id}
              onClick={setSelectedChat}
            />
          )}
        />
      </Sider>

      {/* Main Content - Chat Area */}
      <Content style={{ display: "flex", flexDirection: "column" }}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#fff",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Badge
                  dot={selectedConversation.online}
                  offset={[-5, 5]}
                  color="#52c41a"
                >
                  <Avatar size="large">{selectedConversation.avatar}</Avatar>
                </Badge>
                <div>
                  <Text strong style={{ fontSize: "16px" }}>
                    {selectedConversation.name}
                  </Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {selectedConversation.online
                        ? "Đang hoạt động"
                        : "Không hoạt động"}
                    </Text>
                  </div>
                </div>
              </div>
              <Space>
                <Button type="text" icon={<PhoneOutlined />} />
                <Button type="text" icon={<VideoCameraOutlined />} />
                <Button type="text" icon={<MoreOutlined />} />
              </Space>
            </div>

            {/* Messages Area */}
            <div
              style={{
                flex: 1,
                padding: "24px",
                overflowY: "auto",
                background: "#f5f5f5",
              }}
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>

            {/* Message Input */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #f0f0f0",
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-end",
                }}
              >
                <TextArea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  style={{ flex: 1, borderRadius: "20px" }}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  style={{ borderRadius: "50%", width: "40px", height: "40px" }}
                />
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#666",
            }}
          >
            <Text>Chọn một cuộc trò chuyện để bắt đầu</Text>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default Messages;
