import { create } from "zustand";
import axios from "axios";

const useBlogStore = create((set) => ({
  blogs: [], // Stores the list of blogs
  loading: false, // Tracks loading state
  error: null, // Tracks errors

  // Fetch all blogs
  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/all-blogs");
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
      const response = await axios.get(`/blog/${id}`);
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

      const response = await axios.post("/api/blogs/create-blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          user_id: blogData.userId, // Assuming user_id is passed in blogData
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
  updateBlog: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      if (updatedData.title) formData.append("title", updatedData.title);
      if (updatedData.content) formData.append("content", updatedData.content);
      if (updatedData.removeImage) {
        formData.append("removeImage", "true");
      } else if (updatedData.image) {
        formData.append("image", updatedData.image);
      }

      const response = await axios.put(
        `/api/blogs/update-blog/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      set((state) => ({
        blogs: state.blogs.map((blog) =>
          blog._id === id ? response.data : blog
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
      await axios.delete(`/api/blogs/delete-blog/${id}`);
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete blog",
        loading: false,
      });
    }
  },
}));

export default useBlogStore;
