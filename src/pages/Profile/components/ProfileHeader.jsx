import React from "react";
import { Typography, Card, Row, Col, Button, Space, Tag, Image } from "antd";
import { UserOutlined, CameraOutlined, TeamOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const ProfileHeader = ({ user }) => {
  return (
    <div style={{ padding: "0 24px" }}>
      <Card
        style={{
          borderRadius: 8,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Cover Photo */}
        <div
          style={{
            position: "relative",
            height: 280,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "70%",
              background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
            }}
          />

          {/* Header content */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "0 32px 32px 32px",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
              <Image
                src={user.avatar}
                alt="Avatar"
                width={120}
                height={120}
                style={{
                  borderRadius: "50%",
                  border: "5px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                preview={{
                  mask: false,
                }}
              />
              <div style={{ marginBottom: 8 }}>
                <Title
                  level={2}
                  style={{ color: "white", margin: 0, fontSize: 28 }}
                >
                  {user.name}
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                  {user.username}
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div style={{ padding: "32px" }}>
          <Row gutter={32}>
            <Col span={16}>
              <div style={{ paddingTop: 20 }}>
                <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
                  {user.name}
                </Title>
                <Text
                  type="secondary"
                  style={{ fontSize: 16, marginBottom: 16, display: "block" }}
                >
                  {user.username}
                </Text>
                <Paragraph
                  style={{
                    margin: 0,
                    marginBottom: 20,
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "#666",
                  }}
                >
                  {user.bio}
                </Paragraph>

                <Space wrap size="middle">
                  <Tag
                    icon={<UserOutlined />}
                    style={{
                      padding: "8px 16px",
                      fontSize: 14,
                      borderRadius: 20,
                      border: "1px solid #e8e8e8",
                      background: "#f8f9fa",
                    }}
                  >
                    Lập trình viên
                  </Tag>
                  <Tag
                    icon={<CameraOutlined />}
                    style={{
                      padding: "8px 16px",
                      fontSize: 14,
                      borderRadius: 20,
                      border: "1px solid #e8e8e8",
                      background: "#f8f9fa",
                    }}
                  >
                    Nhiếp ảnh
                  </Tag>
                  <Tag
                    icon={<TeamOutlined />}
                    style={{
                      padding: "8px 16px",
                      fontSize: 14,
                      borderRadius: 20,
                      border: "1px solid #e8e8e8",
                      background: "#f8f9fa",
                    }}
                  >
                    Du lịch
                  </Tag>
                </Space>
              </div>
            </Col>
            <Col span={8}>
              <div
                style={{
                  textAlign: "right",
                  paddingTop: 20,
                  paddingLeft: 20,
                  borderLeft: "1px solid #f0f0f0",
                }}
              >
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#1890ff",
                    }}
                  >
                    {user.posts}
                  </div>
                  <div style={{ color: "#666", fontSize: 14 }}>bài viết</div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#52c41a",
                    }}
                  >
                    {user.friends}
                  </div>
                  <div style={{ color: "#666", fontSize: 14 }}>bạn bè</div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#722ed1",
                    }}
                  >
                    {user.photos}
                  </div>
                  <div style={{ color: "#666", fontSize: 14 }}>ảnh</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default ProfileHeader;
