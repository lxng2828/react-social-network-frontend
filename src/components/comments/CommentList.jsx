import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { List, Avatar, Button, Space, Typography, Spin, Empty, message, Input } from "antd";
import {
    LikeOutlined,
    DislikeOutlined,
    MessageOutlined,
    MoreOutlined,
    EditOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import { useUser } from "../../contexts/UserContext";
import { useComments } from "../../hooks/useComments";
import { createReply, getReplies, updateReply, deleteReply } from "../../services/replyService";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { getMediaUrl } from "../../utils/mediaUtils";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const CommentList = ({ postId, onRefresh }) => {
    const { currentUser } = useUser();
    const navigate = useNavigate();
    const {
        comments,
        loading,
        error,
        hasMore,
        fetchComments,
        addComment,
        updateCommentById,
        deleteCommentById,
        loadMoreComments
    } = useComments(postId);

    // Xử lý click vào tên để chuyển trang cá nhân
    const handleNameClick = (userId) => {
        if (userId) {
            navigate(`/profile/${userId}`);
        }
    };

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState("");
    const [replyingToId, setReplyingToId] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [replyLoading, setReplyLoading] = useState(false);

    // State cho replies
    const [replies, setReplies] = useState({});
    const [repliesLoading, setRepliesLoading] = useState({});

    // State cho edit/delete replies
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editReplyText, setEditReplyText] = useState("");
    const [replyEditLoading, setReplyEditLoading] = useState(false);
    const [replyDeleteLoading, setReplyDeleteLoading] = useState({});

    // Lấy comments khi component mount
    useEffect(() => {
        if (postId) {
            fetchComments(0);
        }
    }, [postId, fetchComments]);

    // Lấy replies cho comment
    const fetchReplies = async (commentId) => {
        if (replies[commentId]) return; // Đã có replies

        try {
            setRepliesLoading(prev => ({ ...prev, [commentId]: true }));
            console.log(`📋 CommentList: Fetching replies for comment ${commentId}`);

            const response = await getReplies(commentId);
            console.log(`📋 CommentList: Replies for comment ${commentId}:`, response);

            setReplies(prev => ({
                ...prev,
                [commentId]: response.content || []
            }));
        } catch (error) {
            console.error(`💥 CommentList: Error fetching replies for comment ${commentId}:`, error);
        } finally {
            setRepliesLoading(prev => ({ ...prev, [commentId]: false }));
        }
    };

    // Toggle hiển thị replies
    const toggleReplies = (commentId) => {
        if (replies[commentId]) {
            // Nếu đang hiển thị replies thì ẩn đi
            setReplies(prev => {
                const newReplies = { ...prev };
                delete newReplies[commentId];
                return newReplies;
            });
        } else {
            // Nếu chưa hiển thị replies thì fetch và hiển thị
            fetchReplies(commentId);
        }
    };

    const handleAddComment = async (content) => {
        try {
            await addComment(content);
            message.success("Bình luận thành công!");
            if (onRefresh) onRefresh();
        } catch (error) {
            message.error("Có lỗi xảy ra khi bình luận!");
        }
    };

    const handleEditComment = async (commentId, content) => {
        try {
            await updateCommentById(commentId, content);
            message.success("Chỉnh sửa bình luận thành công!");
            setEditingCommentId(null);
            setEditText("");
            if (onRefresh) onRefresh();
        } catch (error) {
            message.error("Có lỗi xảy ra khi chỉnh sửa bình luận!");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteCommentById(commentId);
            message.success("Xóa bình luận thành công!");
            if (onRefresh) onRefresh();
        } catch (error) {
            message.error("Có lỗi xảy ra khi xóa bình luận!");
        }
    };

    const startEdit = (comment) => {
        setEditingCommentId(comment.id);
        setEditText(comment.content);
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        setEditText("");
    };

    const startReply = (commentId) => {
        setReplyingToId(commentId);
        setReplyText("");
    };

    const cancelReply = () => {
        setReplyingToId(null);
        setReplyText("");
    };

    const submitReply = async (commentId, content) => {
        if (!content || !content.trim()) {
            message.warning("Vui lòng nhập nội dung trả lời!");
            return;
        }

        try {
            setReplyLoading(true);
            console.log(`💬 CommentList: Submitting reply for comment ${commentId}:`, { content });

            // Gọi API để tạo reply
            const newReply = await createReply(commentId, content);
            console.log(`💬 CommentList: Reply created successfully:`, newReply);

            message.success("Trả lời bình luận thành công!");
            setReplyingToId(null);
            setReplyText("");

            // Cập nhật replies state để hiển thị reply mới
            const replyData = newReply.data || newReply;
            const completeReply = {
                id: replyData.id || `temp-${Date.now()}`,
                content: content,
                user: {
                    id: replyData.user?.id || replyData.userId || currentUser?.id,
                    firstName: replyData.user?.firstName || replyData.userFirstName || currentUser?.firstName,
                    lastName: replyData.user?.lastName || replyData.userLastName || currentUser?.lastName,
                    profilePictureUrl: replyData.user?.profilePictureUrl || replyData.userProfilePicture || currentUser?.profilePictureUrl
                },
                commentId: commentId,
                createdAt: replyData.createdAt || new Date().toISOString(),
                updatedAt: replyData.updatedAt || new Date().toISOString()
            };

            setReplies(prev => ({
                ...prev,
                [commentId]: [completeReply, ...(prev[commentId] || [])]
            }));

            // Refresh comments để cập nhật reply count
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error(`💥 CommentList: Error submitting reply:`, error);
            message.error(`Có lỗi xảy ra khi trả lời bình luận: ${error.message}`);
        } finally {
            setReplyLoading(false);
        }
    };

    // Functions để sửa/xóa replies
    const startEditReply = (reply) => {
        setEditingReplyId(reply.id);
        setEditReplyText(reply.content);
    };

    const cancelEditReply = () => {
        setEditingReplyId(null);
        setEditReplyText("");
    };

    const handleEditReply = async (replyId, content) => {
        if (!content || !content.trim()) {
            message.warning("Vui lòng nhập nội dung trả lời!");
            return;
        }

        try {
            setReplyEditLoading(true);
            console.log(`✏️ CommentList: Editing reply ${replyId}:`, { content });

            // Gọi API để update reply
            const updatedReply = await updateReply(replyId, content);
            console.log(`✏️ CommentList: Reply updated successfully:`, updatedReply);

            message.success("Chỉnh sửa trả lời thành công!");
            setEditingReplyId(null);
            setEditReplyText("");

            // Cập nhật reply trong state
            setReplies(prev => {
                const newReplies = { ...prev };
                Object.keys(newReplies).forEach(commentId => {
                    newReplies[commentId] = newReplies[commentId].map(reply =>
                        reply.id === replyId
                            ? { ...reply, content: content, updatedAt: new Date().toISOString() }
                            : reply
                    );
                });
                return newReplies;
            });

            if (onRefresh) onRefresh();
        } catch (error) {
            console.error(`💥 CommentList: Error editing reply:`, error);
            message.error(`Có lỗi xảy ra khi chỉnh sửa trả lời: ${error.message}`);
        } finally {
            setReplyEditLoading(false);
        }
    };

    const handleDeleteReply = async (replyId, commentId) => {
        try {
            setReplyDeleteLoading(prev => ({ ...prev, [replyId]: true }));
            console.log(`🗑️ CommentList: Deleting reply ${replyId}`);

            // Gọi API để delete reply
            await deleteReply(replyId);
            console.log(`🗑️ CommentList: Reply deleted successfully`);

            message.success("Xóa trả lời thành công!");

            // Xóa reply khỏi state
            setReplies(prev => {
                const newReplies = { ...prev };
                if (newReplies[commentId]) {
                    newReplies[commentId] = newReplies[commentId].filter(reply => reply.id !== replyId);
                }
                return newReplies;
            });

            if (onRefresh) onRefresh();
        } catch (error) {
            console.error(`💥 CommentList: Error deleting reply:`, error);
            message.error(`Có lỗi xảy ra khi xóa trả lời: ${error.message}`);
        } finally {
            setReplyDeleteLoading(prev => ({ ...prev, [replyId]: false }));
        }
    };

    const formatTime = (dateString) => {
        try {
            return formatDistanceToNow(new Date(dateString), {
                addSuffix: true,
                locale: vi
            });
        } catch (error) {
            return 'Vừa xong';
        }
    };

    const renderComment = (comment) => {
        const isOwnComment = currentUser?.id === comment.user?.id;
        const isEditing = editingCommentId === comment.id;
        const isReplying = replyingToId === comment.id;

        return (
            <List.Item key={comment.id}>
                <List.Item.Meta
                    avatar={
                        <Avatar size={32} src={comment.user?.profilePictureUrl ? getMediaUrl(comment.user.profilePictureUrl) : null}>
                            {comment.user?.firstName?.[0] || "U"}
                        </Avatar>
                    }
                    title={
                        <Space>
                            <Text
                                strong
                                style={{
                                    cursor: 'pointer',
                                    color: '#1890ff',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                                onClick={() => handleNameClick(comment.user?.id)}
                            >
                                {comment.user?.firstName} {comment.user?.lastName}
                            </Text>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                {formatTime(comment.createdAt)}
                            </Text>
                        </Space>
                    }
                    description={
                        <div>
                            {isEditing ? (
                                <div style={{ marginTop: 8 }}>
                                    <TextArea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        autoSize={{ minRows: 1, maxRows: 3 }}
                                        style={{ marginBottom: 8 }}
                                    />
                                    <Space>
                                        <Button
                                            size="small"
                                            type="primary"
                                            onClick={() => handleEditComment(comment.id, editText)}
                                        >
                                            Lưu
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={cancelEdit}
                                        >
                                            Hủy
                                        </Button>
                                    </Space>
                                </div>
                            ) : (
                                <Paragraph style={{ margin: 0 }}>
                                    {comment.content}
                                </Paragraph>
                            )}

                            {/* Comment Actions */}
                            {!isEditing && (
                                <div style={{ marginTop: 8 }}>
                                    <Space size="small">
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<LikeOutlined />}
                                        >
                                            0
                                        </Button>
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<MessageOutlined />}
                                            onClick={() => startReply(comment.id)}
                                        >
                                            Trả lời
                                        </Button>
                                        {isOwnComment && (
                                            <>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<EditOutlined />}
                                                    onClick={() => startEdit(comment)}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<DeleteOutlined />}
                                                    danger
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                >
                                                    Xóa
                                                </Button>
                                            </>
                                        )}
                                    </Space>

                                    {/* Replies Toggle Button */}
                                    <div style={{ marginTop: 8 }}>
                                        <Button
                                            type="text"
                                            size="small"
                                            onClick={() => toggleReplies(comment.id)}
                                            loading={repliesLoading[comment.id]}
                                        >
                                            {replies[comment.id] ? 'Ẩn trả lời' : 'Xem trả lời'}
                                            {replies[comment.id] && replies[comment.id].length > 0 && (
                                                <span style={{ marginLeft: 4, color: '#1890ff' }}>
                                                    ({replies[comment.id].length})
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Reply Form */}
                            {isReplying && (
                                <div style={{ marginTop: 12, marginLeft: 20 }}>
                                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                        <Avatar size={24} src={currentUser?.profilePictureUrl ? getMediaUrl(currentUser.profilePictureUrl) : null}>
                                            {currentUser?.firstName?.[0] || "U"}
                                        </Avatar>
                                        <div style={{ flex: 1 }}>
                                            <TextArea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Viết trả lời..."
                                                autoSize={{ minRows: 1, maxRows: 3 }}
                                                style={{ marginBottom: 8 }}
                                            />
                                            <Space>
                                                <Button
                                                    type="primary"
                                                    size="small"
                                                    onClick={() => submitReply(comment.id, replyText)}
                                                    disabled={!replyText.trim() || replyLoading}
                                                    loading={replyLoading}
                                                >
                                                    Trả lời
                                                </Button>
                                                <Button
                                                    size="small"
                                                    onClick={cancelReply}
                                                >
                                                    Hủy
                                                </Button>
                                            </Space>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Replies List */}
                            {replies[comment.id] && replies[comment.id].length > 0 && (
                                <div style={{ marginTop: 12, marginLeft: 20 }}>
                                    <div style={{
                                        borderLeft: '2px solid #f0f0f0',
                                        paddingLeft: 16,
                                        background: '#fafafa',
                                        borderRadius: '0 8px 8px 0',
                                        padding: '12px 16px'
                                    }}>
                                        <div style={{ marginBottom: 8, color: '#666', fontSize: '12px' }}>
                                            Trả lời ({replies[comment.id].length})
                                        </div>
                                        {replies[comment.id].map((reply) => (
                                            <div key={reply.id} style={{
                                                marginBottom: 12,
                                                padding: '8px 12px',
                                                background: 'white',
                                                borderRadius: 8,
                                                border: '1px solid #f0f0f0'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                                    <Avatar size={20} src={reply.user?.profilePictureUrl ? getMediaUrl(reply.user.profilePictureUrl) : null}>
                                                        {reply.user?.firstName?.[0] || "U"}
                                                    </Avatar>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                            <Text
                                                                strong
                                                                style={{
                                                                    fontSize: '13px',
                                                                    cursor: 'pointer',
                                                                    color: '#1890ff',
                                                                    '&:hover': {
                                                                        textDecoration: 'underline'
                                                                    }
                                                                }}
                                                                onClick={() => handleNameClick(reply.user?.id)}
                                                            >
                                                                {reply.user?.firstName} {reply.user?.lastName}
                                                            </Text>
                                                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                                                {formatTime(reply.createdAt)}
                                                            </Text>
                                                        </div>

                                                        {/* Reply Content - Edit Mode */}
                                                        {editingReplyId === reply.id ? (
                                                            <div style={{ marginTop: 8 }}>
                                                                <TextArea
                                                                    value={editReplyText}
                                                                    onChange={(e) => setEditReplyText(e.target.value)}
                                                                    autoSize={{ minRows: 1, maxRows: 3 }}
                                                                    style={{ marginBottom: 8 }}
                                                                />
                                                                <Space size="small">
                                                                    <Button
                                                                        size="small"
                                                                        type="primary"
                                                                        onClick={() => handleEditReply(reply.id, editReplyText)}
                                                                        loading={replyEditLoading}
                                                                    >
                                                                        Lưu
                                                                    </Button>
                                                                    <Button
                                                                        size="small"
                                                                        onClick={cancelEditReply}
                                                                    >
                                                                        Hủy
                                                                    </Button>
                                                                </Space>
                                                            </div>
                                                        ) : (
                                                            /* Reply Content - View Mode */
                                                            <Text style={{ fontSize: '13px' }}>
                                                                {reply.content}
                                                            </Text>
                                                        )}

                                                        {/* Reply Actions */}
                                                        {!editingReplyId && currentUser?.id === reply.user?.id && (
                                                            <div style={{ marginTop: 8 }}>
                                                                <Space size="small">
                                                                    <Button
                                                                        type="text"
                                                                        size="small"
                                                                        icon={<EditOutlined />}
                                                                        onClick={() => startEditReply(reply)}
                                                                    >
                                                                        Sửa
                                                                    </Button>
                                                                    <Button
                                                                        type="text"
                                                                        size="small"
                                                                        icon={<DeleteOutlined />}
                                                                        danger
                                                                        loading={replyDeleteLoading[reply.id]}
                                                                        onClick={() => handleDeleteReply(reply.id, comment.id)}
                                                                    >
                                                                        Xóa
                                                                    </Button>
                                                                </Space>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                />
            </List.Item>
        );
    };

    if (loading && comments.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
                <Spin size="large" tip="Đang tải bình luận..." />
            </div>
        );
    }

    if (error && comments.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ color: "#ff4d4f", marginBottom: "16px" }}>
                    Có lỗi xảy ra: {error}
                </div>
                <Button
                    type="primary"
                    onClick={() => fetchComments(0)}
                >
                    Thử lại
                </Button>
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <Empty
                description="Chưa có bình luận nào"
                style={{ margin: "20px 0" }}
            />
        );
    }

    return (
        <div>
            <List
                dataSource={comments}
                renderItem={renderComment}
                itemLayout="horizontal"
                style={{ marginTop: 16 }}
            />

            {/* Load More Comments */}
            {hasMore && (
                <div style={{ textAlign: "center", margin: "16px 0" }}>
                    <Button
                        onClick={loadMoreComments}
                        loading={loading}
                        size="small"
                    >
                        {loading ? "Đang tải..." : "Tải thêm bình luận"}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CommentList;
