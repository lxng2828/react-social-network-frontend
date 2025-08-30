import React, { useState } from "react";
import { Typography, Card, Row, Col, Button, Space, Tag, Image, Avatar, Modal, Upload, message } from "antd";
import { UserOutlined, CameraOutlined, TeamOutlined, UploadOutlined } from "@ant-design/icons";
import { uploadProfilePicture } from "../../../services/userService";
import { useUser } from "../../../contexts/UserContext";
import { getMediaUrl } from "../../../services/apiConfig";

const { Title, Text, Paragraph } = Typography;

const ProfileHeader = ({ user, isOwnProfile = false }) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { refreshUser } = useUser();

  const handleAvatarClick = () => {
    setUploadModalVisible(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      await uploadProfilePicture(selectedFile);
      message.success('Upload ảnh đại diện thành công!');
      setUploadModalVisible(false);
      setPreviewImage(null);
      setSelectedFile(null);
      refreshUser(); // Cập nhật thông tin user
    } catch (error) {
      message.error(error.message || 'Upload ảnh thất bại!');
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ được upload file ảnh!');
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('File ảnh phải nhỏ hơn 5MB!');
      return false;
    }

    // Lưu file và preview ảnh
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target.result);
    reader.readAsDataURL(file);

    return false; // Không tự động upload
  };

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
              <Avatar
                size={120}
                src={user.profilePictureUrl ? getMediaUrl(user.profilePictureUrl) : undefined}
                icon={!user.profilePictureUrl ? <UserOutlined /> : null}
                style={{
                  borderRadius: "50%",
                  border: "5px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  cursor: isOwnProfile ? "pointer" : "default",
                  fontSize: "48px",
                }}
                onClick={isOwnProfile ? handleAvatarClick : undefined}
              />
              <div style={{ marginBottom: 8 }}>
                <Title
                  level={2}
                  style={{ color: "white", margin: 0, fontSize: 28 }}
                >
                  {user.firstName} {user.lastName}
                </Title>
                <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                  {user.email}
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
                  {user.firstName} {user.lastName}
                </Title>
                <Text
                  type="secondary"
                  style={{ fontSize: 16, marginBottom: 16, display: "block" }}
                >
                  {user.email}
                </Text>

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
                  <div style={{ color: "#666", fontSize: 14 }}>
                    Thông tin cá nhân
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Modal Upload Avatar */}
      <Modal
        title="Upload ảnh đại diện"
        open={uploadModalVisible}
        onCancel={() => {
          setUploadModalVisible(false);
          setPreviewImage(null);
          setSelectedFile(null);
        }}
        footer={null}
        width={500}
      >
        <div style={{ textAlign: 'center' }}>
          {previewImage && (
            <div style={{ marginBottom: '20px' }}>
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '2px solid #f0f0f0'
                }}
              />
            </div>
          )}

          <Upload
            beforeUpload={beforeUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button
              icon={<UploadOutlined />}
              size="large"
              loading={uploading}
            >
              Chọn ảnh
            </Button>
          </Upload>

          {previewImage && (
            <div style={{ marginTop: '20px' }}>
              <Button
                type="primary"
                size="large"
                onClick={handleUpload}
                loading={uploading}
                style={{ marginRight: '10px' }}
              >
                Upload
              </Button>
              <Button
                onClick={() => {
                  setPreviewImage(null);
                  setSelectedFile(null);
                }}
                disabled={uploading}
              >
                Chọn lại
              </Button>
            </div>
          )}

          <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            <p>• Chỉ hỗ trợ file ảnh (JPG, PNG, GIF)</p>
            <p>• Kích thước tối đa: 5MB</p>
            <p>• Ảnh sẽ được tự động resize về dạng vuông</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileHeader;
