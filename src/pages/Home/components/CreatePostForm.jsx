import React, { useState, useRef } from "react";
import { Card, Avatar, Button, Input, Space, Select, Upload, message, Tag } from "antd";
import {
  PictureOutlined,
  VideoCameraOutlined,
  SmileOutlined,
  DeleteOutlined,
  LockOutlined,
  UserOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useUser } from "../../../contexts/UserContext";
import { getMediaUrl } from "../../../utils/mediaUtils";

const { TextArea } = Input;
const { Option } = Select;

const CreatePostForm = ({ onSubmit, onSuccess }) => {
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("PUBLIC");
  const [hashtags, setHashtags] = useState([]);
  const [files, setFiles] = useState([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef();
  const { currentUser } = useUser();

  const handleSubmit = async () => {
    if (!content.trim()) {
      message.warning("Vui lòng nhập nội dung bài viết!");
      return;
    }

    try {
      setSubmitting(true);

      // Chuyển đổi files từ Ant Design format sang File objects
      const fileObjects = files.map(file => file.originFileObj || file);

      const postData = {
        content: content.trim(),
        privacy,
        hashtags,
        files: fileObjects
      };

      if (onSubmit) {
        await onSubmit(postData);
      }

      // Reset form
      setContent("");
      setPrivacy("PUBLIC");
      setHashtags([]);
      setFiles([]);
      setHashtagInput("");

      message.success("Đăng bài viết thành công!");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi đăng bài viết!");
      console.error("Lỗi đăng bài viết:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (info) => {
    const { fileList } = info;

    // Kiểm tra kích thước file (5MB)
    const validFiles = fileList.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        message.error(`File ${file.name} quá lớn (tối đa 5MB)`);
        return false;
      }
      return true;
    });

    setFiles(validFiles);
  };

  const removeFile = (fileToRemove) => {
    setFiles(prev => prev.filter(file => file.uid !== fileToRemove.uid));
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags(prev => [...prev, hashtagInput.trim()]);
      setHashtagInput("");
    }
  };

  const removeHashtag = (tagToRemove) => {
    setHashtags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      e.preventDefault();
      addHashtag();
    }
  };

  const privacyOptions = [
    {
      value: "PUBLIC",
      label: "Công khai",
      icon: <GlobalOutlined />,
      description: "Mọi người đều thấy"
    },
    {
      value: "FRIENDS",
      label: "Bạn bè",
      icon: <UserOutlined />,
      description: "Chỉ bạn bè thấy"
    },
    {
      value: "PRIVATE",
      label: "Riêng tư",
      icon: <LockOutlined />,
      description: "Chỉ mình thấy"
    }
  ];

  return (
    <Card style={{ marginBottom: "24px", borderRadius: "8px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <Avatar size="large" src={currentUser?.profilePictureUrl ? getMediaUrl(currentUser.profilePictureUrl) : null}>
          {currentUser?.firstName?.[0] || "U"}
        </Avatar>

        <div style={{ flex: 1 }}>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Bạn đang nghĩ gì?"
            autoSize={{ minRows: 3, maxRows: 6 }}
            style={{ marginBottom: "16px", borderRadius: "8px" }}
            maxLength={1000}
            showCount
          />

          {/* Privacy Selector */}
          <div style={{ marginBottom: "16px" }}>
            <Select
              value={privacy}
              onChange={setPrivacy}
              style={{ width: 150 }}
              size="small"
            >
              {privacyOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <Space>
                    {option.icon}
                    {option.label}
                  </Space>
                </Option>
              ))}
            </Select>
            <span style={{ marginLeft: "8px", color: "#666", fontSize: "12px" }}>
              {privacyOptions.find(opt => opt.value === privacy)?.description}
            </span>
          </div>

          {/* Hashtags */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <Input
                placeholder="Thêm hashtag..."
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ width: 200 }}
                size="small"
              />
              <Button size="small" onClick={addHashtag} disabled={!hashtagInput.trim()}>
                Thêm
              </Button>
            </div>
            {hashtags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {hashtags.map(tag => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => removeHashtag(tag)}
                    color="blue"
                  >
                    #{tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>

          {/* File Upload */}
          {files.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {files.map(file => (
                  <div key={file.uid} style={{ position: "relative" }}>
                    {file.type?.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file.originFileObj || file)}
                        alt={file.name}
                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }}
                      />
                    ) : (
                      <div style={{
                        width: "80px",
                        height: "80px",
                        border: "1px dashed #d9d9d9",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#fafafa"
                      }}>
                        <VideoCameraOutlined style={{ fontSize: "24px", color: "#999" }} />
                      </div>
                    )}
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => removeFile(file)}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "#ff4d4f",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Space>
              <Upload
                ref={fileInputRef}
                fileList={files}
                onChange={handleFileUpload}
                beforeUpload={() => false}
                multiple
                accept="image/*,video/*"
                showUploadList={false}
              >
                <Button icon={<PictureOutlined />} type="text">
                  Ảnh/Video
                </Button>
              </Upload>
            </Space>
            <Button
              type="primary"
              style={{ borderRadius: "20px" }}
              onClick={handleSubmit}
              disabled={!content.trim() || submitting}
              loading={submitting}
            >
              {submitting ? "Đang đăng..." : "Đăng bài"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CreatePostForm;
