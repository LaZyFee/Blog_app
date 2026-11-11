import { create } from "zustand";
import axiosInstance from "../Utils/axiosInstance";

const initialPagination = { page: 1, limit: 10, totalItems: 0, totalPages: 0 };
const messageFor = (error, fallback) => error.response?.data?.message || error.message || fallback;

const useBlogStore = create((set, get) => ({
  blogs: [],
  blog: null,
  pagination: initialPagination,
  loading: false,
  error: null,

  fetchBlogs: async ({ page = 1, limit = 10, append = false } = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/all-blogs", { params: { page, limit } });
      const data = response.data.data || response.data.Blogs || [];
      set((state) => ({
        blogs: append ? [...state.blogs, ...data.filter((item) => !state.blogs.some((old) => old._id === item._id))] : data,
        pagination: response.data.pagination || { ...initialPagination, page, limit, totalItems: data.length, totalPages: 1 },
        loading: false,
        error: null,
      }));
      return { success: true, data };
    } catch (error) {
      set({ error: messageFor(error, "Failed to fetch blogs"), loading: false });
      return { success: false, error: messageFor(error, "Failed to fetch blogs") };
    }
  },

  fetchBlogById: async (id) => {
    set({ loading: true, error: null, blog: null });
    try {
      const response = await axiosInstance.get(`/blog/${id}`);
      set({ blog: response.data.blog || response.data.data, loading: false, error: null });
      return { success: true, data: response.data.blog || response.data.data };
    } catch (error) {
      const message = messageFor(error, "Failed to fetch blog");
      set({ error: message, loading: false, blog: null });
      return { success: false, error: message };
    }
  },

  createBlog: async (blogData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("content", blogData.content);
      if (blogData.image) formData.append("image", blogData.image);
      const response = await axiosInstance.post("/create-blog", formData);
      set((state) => ({ blogs: [response.data.data, ...state.blogs], loading: false, error: null }));
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = messageFor(error, "Failed to create blog");
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updateBlog: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/update-blog/${id}`, formData);
      const updatedBlog = response.data.data;
      set((state) => ({
        blogs: state.blogs.map((blog) => blog._id === id ? updatedBlog : blog),
        blog: state.blog?._id === id ? updatedBlog : state.blog,
        loading: false,
        error: null,
      }));
      return { success: true, data: updatedBlog };
    } catch (error) {
      const message = messageFor(error, "Failed to update blog");
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  deleteBlog: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/delete-blog/${id}`);
      set((state) => ({ blogs: state.blogs.filter((blog) => blog._id !== id), blog: state.blog?._id === id ? null : state.blog, loading: false, error: null }));
      return { success: true };
    } catch (error) {
      const message = messageFor(error, "Failed to delete blog");
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  toggleLike: async (id, action, type = "blog") => {
    try {
      const response = await axiosInstance.patch(`/${id}/like-unlike`, null, { params: { action, type } });
      const updated = response.data.data;
      set((state) => ({
        blogs: state.blogs.map((blog) => blog._id === id ? { ...blog, likes: updated.likes, disLikes: updated.dislikes, userReaction: updated.userReaction } : blog),
        blog: state.blog?._id === id ? { ...state.blog, likes: updated.likes, disLikes: updated.dislikes, userReaction: updated.userReaction } : state.blog,
        error: null,
      }));
      return { success: true, data: updated };
    } catch (error) {
      const message = messageFor(error, "Failed to toggle reaction");
      set({ error: message });
      return { success: false, error: message };
    }
  },

  clearError: () => set({ error: null }),
  reset: () => set({ blogs: [], blog: null, pagination: initialPagination, loading: false, error: null }),
}));

export default useBlogStore;
