import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Avatar,
  Button,
  Space,
  Typography,
  Dropdown,
  message,
  Popconfirm,
  Modal
} from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  TeamOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { CommentList, CommentForm } from "../comments";
import { useUser } from '../../contexts/UserContext';
import { useReactions } from '../../hooks/useReactions';
import { useComments } from '../../hooks/useComments';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getMediaUrl } from '../../utils/mediaUtils';
import { MediaGrid } from './index';

const { Text, Paragraph } = Typography;

const PostCard = ({ post, onRefresh, onEdit, onDelete }) => {
  const { currentUser } = useUser();
  const [showComments, setShowComments] = useState(false);
  const navigate = useNavigate();

  // Sử dụng useReactions hook
  const {
    currentUserHearted,
    likeCount,
    loading: heartLoading,
    handleHeartClick
  } = useReactions(post.id, post.isLiked || false, post.likeCount || 0);

  // Xử lý click vào tên để chuyển trang cá nhân
  const handleNameClick = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  // Sử dụng useComments hook
  const {
    addComment,
    refreshComments,
    comments,
    loading,
    error,
    hasMore,
    fetchComments,
    updateCommentById,
    deleteCommentById,
    loadMoreComments
  } = useComments(post.id);

  // Format thời gian
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

  // Xử lý tạo comment
  const handleCommentSubmit = async (content) => {
    try {
      console.log(`💬 PostCard: handleCommentSubmit called with content: "${content}"`);
      console.log(`💬 PostCard: postId: ${post.id}, currentUser:`, currentUser);
      console.log(`💬 PostCard: Comments before adding:`, comments);

      // Thêm comment và lấy comment data
      const newComment = await addComment(content);
      console.log(`💬 PostCard: Comment added successfully:`, newComment);
      console.log(`💬 PostCard: Comments after adding:`, comments);

      // Hiển thị thông báo thành công
      message.success("Bình luận thành công!");

      // KHÔNG cần gọi refreshComments() vì addComment đã cập nhật state local
      // Chỉ cần refresh post data nếu cần
      if (onRefresh) {
        console.log(`💬 PostCard: Calling onRefresh to update post data`);
        onRefresh();
      }
    } catch (error) {
      console.error(`💥 PostCard: Error in handleCommentSubmit:`, error);
      message.error(`Có lỗi xảy ra khi bình luận: ${error.message}`);
    }
  };

  // Xử lý thành công comment (không cần thiết nữa)
  const handleCommentSuccess = () => {
    console.log(`💬 PostCard: handleCommentSuccess called (legacy, not needed)`);
    // Không cần làm gì vì comment đã được thêm vào state local
  };

  // Render hashtags
  const renderHashtags = () => {
    if (!post.hashtags || post.hashtags.length === 0) return null;

    return (
      <div style={{ marginBottom: 12 }}>
        {post.hashtags.map((tag, index) => (
          <Text
            key={index}
            style={{
              color: '#1890ff',
              marginRight: 8,
              cursor: 'pointer'
            }}
          >
            #{tag}
          </Text>
        ))}
      </div>
    );
  };

  // Privacy icon và text
  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case 'PUBLIC':
        return <GlobalOutlined style={{ color: '#52c41a' }} />;
      case 'FRIENDS':
        return <TeamOutlined style={{ color: '#1890ff' }} />;
      case 'PRIVATE':
        return <LockOutlined style={{ color: '#faad14' }} />;
      default:
        return <GlobalOutlined style={{ color: '#52c41a' }} />;
    }
  };

  const getPrivacyText = (privacy) => {
    switch (privacy) {
      case 'PUBLIC':
        return 'Công khai';
      case 'FRIENDS':
        return 'Bạn bè';
      case 'PRIVATE':
        return 'Riêng tư';
      default:
        return 'Công khai';
    }
  };

  // More menu items
  const moreMenuItems = [];

  if (currentUser?.id === post.user?.id) {
    moreMenuItems.push(
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Chỉnh sửa',
        onClick: () => onEdit && onEdit(post)
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Xóa',
        danger: true,
        onClick: () => {
          if (onDelete) {
            // Sử dụng Modal.confirm thay vì Popconfirm.confirm
            Modal.confirm({
              title: 'Bạn có chắc chắn muốn xóa bài viết này?',
              content: 'Hành động này không thể hoàn tác.',
              okText: 'Xóa',
              cancelText: 'Hủy',
              okType: 'danger',
              onOk: () => onDelete(post.id)
            });
          }
        }
      }
    );
  }

  return (
    <Card
      style={{
        marginBottom: 16,
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
      bodyStyle={{ padding: '16px' }}
    >
      {/* Post Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <Avatar size={40} src={post.user?.profilePictureUrl ? getMediaUrl(post.user.profilePictureUrl) : null}>
          {post.user?.firstName?.[0] || "U"}
        </Avatar>
        <div style={{ flex: 1, marginLeft: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Text
              strong
              style={{
                cursor: 'pointer',
                color: '#1890ff',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
              onClick={() => handleNameClick(post.user?.id)}
            >
              {post.user?.firstName} {post.user?.lastName}
            </Text>
            {getPrivacyIcon(post.privacy)}
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {getPrivacyText(post.privacy)}
            </Text>
          </div>
          <div>
            <Text type="secondary">{formatTime(post.createdAt)}</Text>
          </div>
        </div>
        {moreMenuItems.length > 0 && (
          <Dropdown
            menu={{ items: moreMenuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        )}
      </div>

      <div>
        <Paragraph style={{ marginBottom: 12 }}>{post.content}</Paragraph>

        {renderHashtags()}

        {/* Sử dụng MediaGrid mới */}
        <MediaGrid
          imageUrls={post.imageUrls || []}
          videoUrls={post.videoUrls || []}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space>
            <Button
              type="text"
              icon={currentUserHearted ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
              onClick={handleHeartClick}
              loading={heartLoading}
            >
              {likeCount || 0}
            </Button>
            <Button
              type="text"
              icon={<MessageOutlined />}
              onClick={() => setShowComments(!showComments)}
            >
              {post.commentCount || 0}
            </Button>
          </Space>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div style={{ marginTop: 16, borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
            {/* Comment Form */}
            <CommentForm
              postId={post.id}
              onSubmit={handleCommentSubmit}
              onSuccess={handleCommentSuccess}
            />

            {/* Comments List */}
            <CommentList
              postId={post.id}
              comments={comments}
              loading={loading}
              error={error}
              hasMore={hasMore}
              fetchComments={fetchComments}
              addComment={addComment}
              updateCommentById={updateCommentById}
              deleteCommentById={deleteCommentById}
              loadMoreComments={loadMoreComments}
              onRefresh={onRefresh}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default PostCard;
