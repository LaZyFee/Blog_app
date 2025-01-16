import { create } from "zustand";
import axiosInstance from "../Utils/axiosInstance";

const useBlogStore = create((set, get) => ({
  blogs: [], // Stores the list of blogs
  loading: false, // Tracks loading state
  error: null, // Tracks errors

  // Fetch all blogs
  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/all-blogs");
      set({ blogs: response.data.Blogs, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch blogs",
        loading: false,
      });
    }
  },
  fetchBlogById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/blog/${id}`);
      set({ blog: response.data.blog, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch blogs",
        loading: false,
      });
    }
  },

  // Create a new blog
  createBlog: async (blogData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("content", blogData.content);
      if (blogData.image) {
        formData.append("image", blogData.image);
      }

      const response = await axiosInstance.post("/create-blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        blogs: [...state.blogs, response.data.data],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create blog",
        loading: false,
      });
    }
  },

  // Update an existing blog
  updateBlog: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/update-blog/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update the blogs state immediately
      set((state) => ({
        blogs: state.blogs.map((blog) =>
          blog._id === id ? { ...blog, ...response.data } : blog
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update blog",
        loading: false,
      });
    }
  },

  // Delete a blog
  deleteBlog: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/delete-blog/${id}`);
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete blog",
        loading: false,
      });
      console.error("Error deleting blog:", error);
    }
  },

  // Toggle like or dislike for a blog
  toggleLike: async (id, action, type = "blog") => {
    const { blogs } = get();
    try {
      const response = await axiosInstance.patch(`/${id}/like-unlike`, null, {
        params: { action, type },
      });

      const updatedData = response.data.data;

      // Update the specific blog in the state
      set({
        blogs: blogs.map((blog) =>
          blog._id === id
            ? {
                ...blog,
                likes: updatedData.likes || 0,
                dislikes: updatedData.dislikes || 0,
                userReaction: updatedData.userReaction || null,
              }
            : blog
        ),
      });
    } catch (error) {
      console.error("Error toggling like:", error.message);
      set({ error: error.response?.data?.message || "Failed to toggle like" });
    }
  },
}));

export default useBlogStore;
