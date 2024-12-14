import { create } from "zustand";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "/api";

export const useTeamStore = create((set) => ({
  teamMembers: [],
  error: null,
  isLoading: false,

  // Fetch all team members
  fetchTeamMembers: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/${id}/team`);
      set({ teamMembers: response.data.data || [], isLoading: false });
    } catch (error) {
      set({
        teamMembers: [], // Clear members on error
        error: error.response?.data?.message || "Failed to fetch team members",
        isLoading: false,
      });
    }
  },

  // Create a new team member
  createTeamMember: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/create-team", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        teamMembers: [...state.teamMembers, response.data.data],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create team member",
        isLoading: false,
      });
    }
  },

  // Update an existing team member
  updateTeamMember: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/team/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        teamMembers: state.teamMembers.map((member) =>
          member._id === id ? response.data.data : member
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update team member",
        isLoading: false,
      });
    }
  },

  // Remove a team member
  removeTeamMember: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/team/${id}`);
      set((state) => ({
        teamMembers: state.teamMembers.filter((member) => member._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to remove team member",
        isLoading: false,
      });
    }
  },
  getProfile: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/profile/${id}`);
      const userData = response.data.data; // Extract user data from the response

      set({
        userProfile: userData,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch user profile",
        isLoading: false,
      });
    }
  },
}));
