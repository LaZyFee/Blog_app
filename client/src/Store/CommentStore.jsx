import { create } from "zustand";
import axiosInstance from "../Utils/axiosInstance";

const DEFAULT_LIMIT = 10;
const errorMessage = (error, fallback) => error.response?.data?.message || error.message || fallback;

const useCommentsStore = create((set, get) => ({
  comments: [],
  pagination: { page: 1, limit: DEFAULT_LIMIT, totalItems: 0, totalPages: 0 },
  isLoading: false,
  isLoadingMore: false,
  error: null,
  activeBlogId: null,

  fetchComments: async (blogId, { page = 1, limit = DEFAULT_LIMIT, append = false } = {}) => {
    set((state) => ({
      activeBlogId: blogId,
      isLoading: !append,
      isLoadingMore: append,
      error: null,
      ...(append ? {} : { comments: [], pagination: { page: 1, limit, totalItems: 0, totalPages: 0 } }),
    }));
    try {
      const response = await axiosInstance.get(`/${blogId}`, { params: { page, limit } });
      if (get().activeBlogId !== blogId) return { success: false, stale: true };
      const data = response.data.data || [];
      set((state) => ({
        comments: append ? [...state.comments, ...data.filter((item) => !state.comments.some((old) => old._id === item._id))] : data,
        pagination: response.data.pagination || { page, limit, totalItems: data.length, totalPages: 1 },
        isLoading: false,
        isLoadingMore: false,
        error: null,
      }));
      return { success: true, data };
    } catch (error) {
      const message = errorMessage(error, "Failed to load comments");
      if (get().activeBlogId === blogId) set({ error: message, isLoading: false, isLoadingMore: false });
      return { success: false, error: message };
    }
  },

  createComment: async (blogId, comment) => {
    set({ error: null });
    try {
      const response = await axiosInstance.post(`/${blogId}/create-comment`, { comment });
      if (get().activeBlogId === blogId) {
        set((state) => ({ comments: [response.data.data, ...state.comments], pagination: { ...state.pagination, totalItems: state.pagination.totalItems + 1 } }));
      }
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = errorMessage(error, "Failed to create comment");
      set({ error: message });
      return { success: false, error: message };
    }
  },

  updateComment: async (blogId, commentId, updatedContent) => {
    set({ error: null });
    try {
      const response = await axiosInstance.put(`/${blogId}/update-comment/${commentId}`, { comment: updatedContent });
      if (get().activeBlogId === blogId) set((state) => ({ comments: state.comments.map((item) => item._id === commentId ? response.data.data : item) }));
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = errorMessage(error, "Failed to update comment");
      set({ error: message });
      return { success: false, error: message };
    }
  },

  deleteComment: async (blogId, commentId) => {
    set({ error: null });
    try {
      await axiosInstance.delete(`/${blogId}/delete-comment/${commentId}`);
      if (get().activeBlogId === blogId) set((state) => ({ comments: state.comments.filter((item) => item._id !== commentId), pagination: { ...state.pagination, totalItems: Math.max(0, state.pagination.totalItems - 1) } }));
      return { success: true };
    } catch (error) {
      const message = errorMessage(error, "Failed to delete comment");
      set({ error: message });
      return { success: false, error: message };
    }
  },

  addReply: async (blogId, commentId, replyContent) => {
    set({ error: null });
    try {
      const response = await axiosInstance.post(`/${blogId}/${commentId}/add-reply`, { comment: replyContent });
      if (get().activeBlogId === blogId) set((state) => ({ comments: state.comments.map((item) => item._id === commentId ? { ...item, replies: [response.data.data, ...(item.replies || [])] } : item) }));
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = errorMessage(error, "Failed to add reply");
      set({ error: message });
      return { success: false, error: message };
    }
  },

  updateReply: async (blogId, commentId, replyId, updatedContent) => {
    set({ error: null });
    try {
      const response = await axiosInstance.put(`/${blogId}/${commentId}/update-reply/${replyId}`, { comment: updatedContent });
      if (get().activeBlogId === blogId) set((state) => ({ comments: state.comments.map((item) => item._id === commentId ? { ...item, replies: (item.replies || []).map((reply) => reply._id === replyId ? response.data.data : reply) } : item) }));
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = errorMessage(error, "Failed to update reply");
      set({ error: message });
      return { success: false, error: message };
    }
  },

  deleteReply: async (blogId, commentId, replyId) => {
    set({ error: null });
    try {
      await axiosInstance.delete(`/${blogId}/${commentId}/delete-reply/${replyId}`);
      if (get().activeBlogId === blogId) set((state) => ({ comments: state.comments.map((item) => item._id === commentId ? { ...item, replies: (item.replies || []).filter((reply) => reply._id !== replyId) } : item) }));
      return { success: true };
    } catch (error) {
      const message = errorMessage(error, "Failed to delete reply");
      set({ error: message });
      return { success: false, error: message };
    }
  },

  fetchReplies: async (commentId, { page = 1, limit = DEFAULT_LIMIT } = {}) => {
    set({ error: null });
    try {
      const response = await axiosInstance.get(`/comments/${commentId}/replies`, { params: { page, limit } });
      return { success: true, data: response.data.data || [], pagination: response.data.pagination };
    } catch (error) {
      const message = errorMessage(error, "Failed to load replies");
      set({ error: message });
      return { success: false, error: message };
    }
  },

  toggleLike: async (id, action, type = "comment", parentId = null) => {
    set({ error: null });
    try {
      const response = await axiosInstance.patch(`/${id}/like-unlike`, null, { params: { action, type } });
      const updated = response.data.data;
      set((state) => ({
        comments: state.comments.map((item) => {
          if (type === "comment" && item._id === id) return { ...item, likes: updated.likes, disLikes: updated.dislikes, userReaction: updated.userReaction };
          if (type === "reply" && item._id === parentId) return { ...item, replies: (item.replies || []).map((reply) => reply._id === id ? { ...reply, likes: updated.likes, disLikes: updated.dislikes, userReaction: updated.userReaction } : reply) };
          return item;
        }),
      }));
      return { success: true, data: updated };
    } catch (error) {
      const message = errorMessage(error, "Failed to toggle reaction");
      set({ error: message });
      return { success: false, error: message };
    }
  },

  clearError: () => set({ error: null }),
  reset: () => set({ comments: [], pagination: { page: 1, limit: DEFAULT_LIMIT, totalItems: 0, totalPages: 0 }, isLoading: false, isLoadingMore: false, error: null, activeBlogId: null }),
}));

export default useCommentsStore;
