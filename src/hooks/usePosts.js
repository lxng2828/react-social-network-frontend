import { useState, useCallback } from 'react';
import { createPost, getPosts, getUserPosts, updatePost, deletePost } from '../services/postService';

export const usePosts = (userId = null) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            let response;
            if (userId) {
                // Lấy bài viết của user cụ thể
                response = await getUserPosts(userId, page);
            } else {
                // Lấy feed bài viết chung
                response = await getPosts(page);
            }

            if (page === 1) {
                setPosts(response.posts || []);
            } else {
                setPosts(prev => [...prev, ...(response.posts || [])]);
            }

            setCurrentPage(page);
            setHasMore(response.hasNext || false);
        } catch (err) {
            setError(err.message);
            console.error('Lỗi khi lấy danh sách bài viết:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const addPost = useCallback(async (postData) => {
        try {
            setError(null);
            const newPost = await createPost(postData);
            setPosts(prev => [newPost, ...prev]);
            return newPost;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const updatePostById = useCallback(async (postId, postData) => {
        try {
            setError(null);
            const updatedPost = await updatePost(postId, postData);
            setPosts(prev => prev.map(post =>
                post.id === postId ? updatedPost : post
            ));
            return updatedPost;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const deletePostById = useCallback(async (postId) => {
        try {
            setError(null);
            await deletePost(postId);
            setPosts(prev => prev.filter(post => post.id !== postId));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const refreshPosts = useCallback(() => {
        fetchPosts(1);
    }, [fetchPosts]);

    const loadMorePosts = useCallback(() => {
        if (hasMore && !loading) {
            fetchPosts(currentPage + 1);
        }
    }, [hasMore, loading, currentPage, fetchPosts]);

    return {
        posts,
        loading,
        error,
        currentPage,
        hasMore,
        fetchPosts,
        addPost,
        updatePostById,
        deletePostById,
        refreshPosts,
        loadMorePosts,
        setError
    };
};
