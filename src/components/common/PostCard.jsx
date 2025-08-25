import React from "react";
import { Card, Avatar, Button, Space, Image, Typography } from "antd";
import {
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined,
  MoreOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const PostCard = ({ post, showAuthor = true }) => {
  return (
    <Card style={{ marginBottom: 16 }}>
      {showAuthor && (
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 12 }}
        >
          <Avatar size={40} src={post.avatar} />
          <div style={{ marginLeft: 12 }}>
            <div>
              <Text strong>{post.author}</Text>
            </div>
            <div>
              <Text type="secondary">{post.time}</Text>
            </div>
          </div>
        </div>
      )}

      <div>
        <Paragraph style={{ marginBottom: 12 }}>{post.content}</Paragraph>

        {post.image && (
          <Image
            src={post.image}
            alt="Post image"
            style={{
              width: "100%",
              borderRadius: 8,
              marginBottom: 12,
              cursor: "pointer",
            }}
            preview={{ mask: false }}
          />
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space>
            <Button type="text" icon={<HeartOutlined />}>
              {post.likes}
            </Button>
            <Button type="text" icon={<MessageOutlined />}>
              {post.comments}
            </Button>
            <Button type="text" icon={<ShareAltOutlined />}>
              {post.shares}
            </Button>
          </Space>
          <Button type="text" icon={<MoreOutlined />} />
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
