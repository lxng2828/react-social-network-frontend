import React from "react";
import { Card, Button, Space, Image, Typography } from "antd";
import {
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined,
  MoreOutlined,
} from "@ant-design/icons";

const { Paragraph } = Typography;

const ProfilePostCard = ({ post }) => {
  return (
    <Card style={{ marginBottom: 16 }}>
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
    </Card>
  );
};

export default ProfilePostCard;
