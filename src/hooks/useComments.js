import { useState, useCallback } from 'react';
import { getComments, createComment, updateComment, deleteComment } from '../services/commentService';

export const useComments = (postId) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchComments = useCallback(async (page = 0) => {
        if (!postId) {
            console.log('⚠️ fetchComments: No postId provided');
            return;
        }

        try {
            console.log(`📋 fetchComments: Starting for post ${postId}, page ${page}`);
            setLoading(true);
            setError(null);

            const response = await getComments(postId, page);
            console.log(`📋 fetchComments: API response:`, response);

            // Fix: response.data chứa Page<CommentResponse>
            const pageData = response.data || response;
            console.log(`📋 fetchComments: Page data:`, pageData);

            if (page === 0) {
                setComments(pageData.content || []);
            } else {
                setComments(prev => [...prev, ...(pageData.content || [])]);
            }

            setCurrentPage(page);
            // Fix: sử dụng pageData thay vì response trực tiếp
            setHasMore(!pageData.last);

            console.log(`📋 fetchComments: Success - comments count: ${pageData.content?.length || 0}, hasMore: ${!pageData.last}`);
        } catch (err) {
            console.error(`💥 fetchComments: Error:`, err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    const addComment = useCallback(async (content) => {
        if (!postId) {
            console.log('⚠️ addComment: No postId provided');
            return;
        }

        if (!content || !content.trim()) {
            console.log('⚠️ addComment: No content provided');
            return;
        }

        try {
            console.log(`💬 addComment: Starting for post ${postId}, content: "${content}"`);
            setError(null);

            const newComment = await createComment(postId, content);
            console.log(`💬 addComment: API response:`, newComment);

            // Fix: newComment có thể là response.data hoặc trực tiếp
            const commentData = newComment.data || newComment;
            console.log(`💬 addComment: Comment data:`, commentData);

            // Tạo comment object hoàn chỉnh nếu cần
            const completeComment = {
                id: commentData.id || `temp-${Date.now()}`,
                content: content,
                user: {
                    id: commentData.user?.id || commentData.userId,
                    firstName: commentData.user?.firstName || commentData.userFirstName,
                    lastName: commentData.user?.lastName || commentData.userLastName,
                    profilePictureUrl: commentData.user?.profilePictureUrl || commentData.userProfilePicture
                },
                postId: postId,
                createdAt: commentData.createdAt || new Date().toISOString(),
                updatedAt: commentData.updatedAt || new Date().toISOString()
            };

            console.log(`💬 addComment: Complete comment object:`, completeComment);

            // Cập nhật state local ngay lập tức
            setComments(prev => {
                const newComments = [completeComment, ...prev];
                console.log(`💬 addComment: Updated comments array:`, newComments);
                return newComments;
            });

            console.log(`💬 addComment: Success - comment added to state immediately`);
            return completeComment;
        } catch (err) {
            console.error(`💥 addComment: Error:`, err);
            setError(err.message);
            throw err;
        }
    }, [postId]);

    const updateCommentById = useCallback(async (commentId, content) => {
        if (!commentId || !content) {
            console.log('⚠️ updateCommentById: Missing commentId or content');
            return;
        }

        try {
            console.log(`✏️ updateCommentById: Starting for comment ${commentId}, content: "${content}"`);
            setError(null);

            const updatedComment = await updateComment(commentId, content);
            console.log(`✏️ updateCommentById: API response:`, updatedComment);

            // Fix: updatedComment có thể là response.data hoặc trực tiếp
            const commentData = updatedComment.data || updatedComment;
            console.log(`✏️ updateCommentById: Comment data:`, commentData);

            setComments(prev => {
                const newComments = prev.map(comment =>
                    comment.id === commentId ? commentData : comment
                );
                console.log(`✏️ updateCommentById: Updated comments array:`, newComments);
                return newComments;
            });

            console.log(`✏️ updateCommentById: Success - comment updated in state`);
            return commentData;
        } catch (err) {
            console.error(`💥 updateCommentById: Error:`, err);
            setError(err.message);
            throw err;
        }
    }, []);

    const deleteCommentById = useCallback(async (commentId) => {
        if (!commentId) {
            console.log('⚠️ deleteCommentById: No commentId provided');
            return;
        }

        try {
            console.log(`🗑️ deleteCommentById: Starting for comment ${commentId}`);
            setError(null);

            await deleteComment(commentId);
            console.log(`🗑️ deleteCommentById: API success`);

            setComments(prev => {
                const newComments = prev.filter(comment => comment.id !== commentId);
                console.log(`🗑️ deleteCommentById: Updated comments array:`, newComments);
                return newComments;
            });

            console.log(`🗑️ deleteCommentById: Success - comment removed from state`);
        } catch (err) {
            console.error(`💥 deleteCommentById: Error:`, err);
            setError(err.message);
            throw err;
        }
    }, []);

    const refreshComments = useCallback(() => {
        console.log(`🔄 refreshComments: Starting refresh for post ${postId}`);
        fetchComments(0);
    }, [fetchComments, postId]);

    const loadMoreComments = useCallback(() => {
        if (hasMore && !loading) {
            console.log(`📥 loadMoreComments: Loading more comments for post ${postId}, page ${currentPage + 1}`);
            fetchComments(currentPage + 1);
        } else {
            console.log(`⚠️ loadMoreComments: Cannot load more - hasMore: ${hasMore}, loading: ${loading}`);
        }
    }, [hasMore, loading, currentPage, fetchComments, postId]);

    return {
        comments,
        loading,
        error,
        currentPage,
        hasMore,
        fetchComments,
        addComment,
        updateCommentById,
        deleteCommentById,
        refreshComments,
        loadMoreComments,
        setError
    };
};
