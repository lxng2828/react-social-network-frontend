import React, { useState } from "react";
import { Card, Avatar, Button, Input, Space } from "antd";
import {
  PictureOutlined,
  VideoCameraOutlined,
  SmileOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

const CreatePostForm = ({ onSubmit, userAvatar = "U" }) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim() && onSubmit) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <Card style={{ marginBottom: "24px", borderRadius: "8px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <Avatar size="large">{userAvatar}</Avatar>
        <div style={{ flex: 1 }}>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bạn đang nghĩ gì?"
            autoSize={{ minRows: 3, maxRows: 6 }}
            style={{ marginBottom: "16px", borderRadius: "8px" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space>
              <Button icon={<PictureOutlined />} type="text">
                Ảnh
              </Button>
              <Button icon={<VideoCameraOutlined />} type="text">
                Video
              </Button>
              <Button icon={<SmileOutlined />} type="text">
                Cảm xúc
              </Button>
            </Space>
            <Button
              type="primary"
              style={{ borderRadius: "20px" }}
              onClick={handleSubmit}
              disabled={!content.trim()}
            >
              Đăng bài
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CreatePostForm;
