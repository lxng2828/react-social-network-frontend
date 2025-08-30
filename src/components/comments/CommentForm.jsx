import React, { useState } from "react";
import { Avatar, Button, Input, Space } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useUser } from "../../contexts/UserContext";
import { getMediaUrl } from "../../utils/mediaUtils";

const { TextArea } = Input;

const CommentForm = ({ postId, onSubmit, onSuccess, placeholder = "Viết bình luận..." }) => {
    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { currentUser } = useUser();

    const handleSubmit = async () => {
        if (!commentText.trim()) return;

        try {
            setSubmitting(true);

            if (onSubmit) {
                await onSubmit(commentText.trim());
            }

            // Reset form
            setCommentText("");

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("Lỗi khi tạo bình luận:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <Avatar size={32} src={currentUser?.profilePictureUrl ? getMediaUrl(currentUser.profilePictureUrl) : null}>
                {currentUser?.firstName?.[0] || "U"}
            </Avatar>

            <div style={{ flex: 1 }}>
                <TextArea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={placeholder}
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    onKeyPress={handleKeyPress}
                    style={{ marginBottom: "8px" }}
                    maxLength={500}
                    showCount
                />

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        type="primary"
                        size="small"
                        icon={<SendOutlined />}
                        onClick={handleSubmit}
                        disabled={!commentText.trim() || submitting}
                        loading={submitting}
                    >
                        {submitting ? "Đang gửi..." : "Bình luận"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CommentForm;
