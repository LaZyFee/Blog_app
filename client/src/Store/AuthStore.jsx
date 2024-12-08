import { create } from "zustand";
import axios from "axios";

axios.defaults.withCredentials = true;

export const useAuth = create((set) => ({
  user: (() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  })(),
  isAuthenticated: !!localStorage.getItem("user"),
  error: null,
  isLoading: false,

  // Signup function
  signup: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/register`,
        formData
      );
      const { user, token } = response.data;

      // Check if user and token exist
      if (user && token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        throw new Error("User or token not provided in response");
      }
    } catch (error) {
      console.error("Signup error:", error);
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  // Login function
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        { email, password }
      );
      const { user, token } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  // Logout function
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  // Sync across tabs
  syncUserAcrossTabs: () => {
    window.addEventListener("storage", (event) => {
      if (event.key === "user") {
        const user = JSON.parse(event.newValue);
        const isAuthenticated = !!user;
        set({ user, isAuthenticated });
      }
    });
  },
}));

// Initialize the sync across tabs functionality
useAuth.getState().syncUserAcrossTabs();
