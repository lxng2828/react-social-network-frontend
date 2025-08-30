import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Tag, Button, Space, Upload, message } from "antd";
import {
    PictureOutlined,
    VideoCameraOutlined,
    DeleteOutlined,
    LockOutlined,
    UserOutlined,
    GlobalOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const EditPostModal = ({ visible, post, onCancel, onSave, loading = false }) => {
    const [content, setContent] = useState("");
    const [privacy, setPrivacy] = useState("PUBLIC");
    const [hashtags, setHashtags] = useState([]);
    const [hashtagInput, setHashtagInput] = useState("");
    const [files, setFiles] = useState([]);

    // Cập nhật state khi post thay đổi
    useEffect(() => {
        if (post) {
            setContent(post.content || "");
            setPrivacy(post.privacy || "PUBLIC");
            setHashtags(post.hashtags || []);
            setFiles([]); // Reset files khi edit
        }
    }, [post]);

    const handleSave = () => {
        if (!content.trim()) {
            message.warning("Vui lòng nhập nội dung bài viết!");
            return;
        }

        // Chuyển đổi files từ Ant Design format sang File objects
        const fileObjects = files.map(file => file.originFileObj || file);

        const postData = {
            content: content.trim(),
            privacy,
            hashtags,
            files: fileObjects
        };

        onSave(postData);
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

    const handleCancel = () => {
        // Reset form
        setContent("");
        setPrivacy("PUBLIC");
        setHashtags([]);
        setHashtagInput("");
        setFiles([]);
        onCancel();
    };

    return (
        <Modal
            title="Chỉnh sửa bài viết"
            open={visible}
            onCancel={handleCancel}
            onOk={handleSave}
            confirmLoading={loading}
            width={600}
            okText="Lưu thay đổi"
            cancelText="Hủy"
        >
            <div style={{ marginBottom: 16 }}>
                <TextArea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Bạn đang nghĩ gì?"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    maxLength={1000}
                    showCount
                />
            </div>

            {/* Privacy Selector */}
            <div style={{ marginBottom: 16 }}>
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
            <div style={{ marginBottom: 16 }}>
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
            <div style={{ marginBottom: 16 }}>
                <Upload
                    fileList={files}
                    onChange={handleFileUpload}
                    beforeUpload={() => false}
                    multiple
                    accept="image/*,video/*"
                    showUploadList={false}
                >
                    <Button icon={<PictureOutlined />} size="small">
                        Thêm ảnh/Video
                    </Button>
                </Upload>

                {files.length > 0 && (
                    <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {files.map((file, index) => (
                            <div key={file.uid} style={{ position: "relative" }}>
                                {file.type?.startsWith('image/') ? (
                                    <img
                                        src={URL.createObjectURL(file.originFileObj || file)}
                                        alt={file.name}
                                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                                    />
                                ) : (
                                    <div style={{
                                        width: "60px",
                                        height: "60px",
                                        border: "1px dashed #d9d9d9",
                                        borderRadius: "4px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "#fafafa"
                                    }}>
                                        <VideoCameraOutlined style={{ fontSize: "18px", color: "#999" }} />
                                    </div>
                                )}
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeFile(file)}
                                    style={{
                                        position: "absolute",
                                        top: "-6px",
                                        right: "-6px",
                                        background: "#ff4d4f",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "18px",
                                        height: "18px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "10px"
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ color: "#666", fontSize: "12px" }}>
                <p>• Chỉnh sửa nội dung, quyền riêng tư và hashtags</p>
                <p>• Có thể thêm ảnh/video mới</p>
                <p>• Những thay đổi sẽ được lưu ngay lập tức</p>
            </div>
        </Modal>
    );
};

export default EditPostModal;
