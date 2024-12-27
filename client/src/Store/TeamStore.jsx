import { create } from "zustand";
import axiosInstance from "../Utils/axiosInstance";

export const useTeamStore = create((set) => ({
  teamMembers: [],
  userProfile: null,
  error: null,
  isLoading: false,

  // Fetch all team members
  fetchTeamMembers: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/${id}/team`);
      set({ teamMembers: response.data.data || [], isLoading: false });
    } catch (error) {
      console.error("Error fetching team members:", error);
      set({
        teamMembers: [],
        error: error.response?.data?.message || "Failed to fetch team members",
        isLoading: false,
      });
    }
  },

  // Create a new team member
  createTeamMember: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/create-team", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        teamMembers: [...state.teamMembers, response.data.data],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error creating team member:", error);
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
      const response = await axiosInstance.put(`/team/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        teamMembers: state.teamMembers.map((member) =>
          member._id === id ? response.data.data : member
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error updating team member:", error);
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
      await axiosInstance.delete(`/team/${id}`);
      set((state) => ({
        teamMembers: state.teamMembers.filter((member) => member._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error removing team member:", error);
      set({
        error: error.response?.data?.message || "Failed to remove team member",
        isLoading: false,
      });
    }
  },

  // Get user profile
  getProfile: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/profile/${id}`);
      set({
        userProfile: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      set({
        userProfile: null,
        error: error.response?.data?.message || "Failed to fetch user profile",
        isLoading: false,
      });
    }
  },
}));
