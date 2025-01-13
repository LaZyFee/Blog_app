import { create } from "zustand";
import axiosInstance from "../Utils/axiosInstance";

const useCommentsStore = create((set, get) => ({
  comments: [],
  isLoading: false,
  error: null,

  // Fetch comments for a specific blog
  fetchComments: async (blogId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/${blogId}`);
      set({
        comments: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Create a new comment
  createComment: async (blogId, comment) => {
    const { comments } = get();
    try {
      const response = await axiosInstance.post(`/${blogId}/create-comment`, {
        comment,
      });
      set({
        comments: [response.data.data, ...comments],
      });
    } catch (error) {
      console.error(
        "Error creating comment:",
        error.response?.data?.message || error.message
      );
      set({
        error: error.response?.data?.message || "Failed to create comment",
      });
    }
  },

  // Update a comment
  updateComment: async (blogId, commentId, updatedContent) => {
    const { comments } = get();
    try {
      const response = await axiosInstance.put(
        `/${blogId}/update-comment/${commentId}`,
        { comment: updatedContent }
      );
      set({
        comments: comments.map((comment) =>
          comment._id === commentId ? response.data.data : comment
        ),
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Delete a comment
  deleteComment: async (blogId, commentId) => {
    const { comments } = get();
    try {
      await axiosInstance.delete(`/${blogId}/delete-comment/${commentId}`);
      set({
        comments: comments.filter((comment) => comment._id !== commentId),
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Add a reply to a comment
  addReply: async (blogId, commentId, replyContent) => {
    const { comments } = get();
    try {
      const response = await axiosInstance.post(
        `/${blogId}/${commentId}/add-reply`,
        { comment: replyContent }
      );
      set({
        comments: comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [response.data.data, ...comment.replies] }
            : comment
        ),
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Update a reply
  updateReply: async (blogId, commentId, replyId, updatedContent) => {
    const { comments } = get();
    try {
      const response = await axiosInstance.put(
        `/${blogId}/${commentId}/update-reply/${replyId}`,
        { comment: updatedContent }
      );
      set({
        comments: comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply._id === replyId ? response.data.data : reply
                ),
              }
            : comment
        ),
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Delete a reply
  deleteReply: async (blogId, commentId, replyId) => {
    const { comments } = get();
    try {
      await axiosInstance.delete(
        `/${blogId}/${commentId}/delete-reply/${replyId}`
      );
      set({
        comments: comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply._id !== replyId
                ),
              }
            : comment
        ),
      });
    } catch (error) {
      set({ error: error.message });
    }
  },

  toggleLike: async (id, action, type = "comment", parentId = null) => {
    const { comments } = get();
    try {
      const response = await axiosInstance.patch(`/${id}/like-unlike`, null, {
        params: { action, type },
      });

      const updatedData = response.data.data;

      set({
        comments: comments.map((comment) => {
          if (type === "comment" && comment._id === id) {
            return {
              ...comment,
              likes: updatedData.likes || 0,
              dislikes: updatedData.dislikes || 0,
              reactions: updatedData.userReaction || [],
            };
          }

          if (type === "reply" && comment._id === parentId) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply._id === id
                  ? {
                      ...reply,
                      likes: updatedData.likes || 0,
                      dislikes: updatedData.dislikes || 0,
                      reactions: updatedData.userReaction || [],
                    }
                  : reply
              ),
            };
          }

          return comment;
        }),
      });
    } catch (error) {
      console.error("Error toggling like:", error.message);
      set({ error: error.response?.data?.message || "Failed to toggle like" });
    }
  },
}));

export default useCommentsStore;
