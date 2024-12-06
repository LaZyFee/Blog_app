import { TeamModel } from "../models/teamModel.js";

export const CreateTeam = async (req, res) => {
    try {
        const { name, role } = req.body;

        if (!name || !role) {
            return res.status(400).json({ status: "failed", message: "Name and role are required." });
        }

        // Handle image path if provided
        const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : "";

        const teamMember = await TeamModel.create({
            name,
            role,
            image: imagePath,
        });

        res.status(201).json({
            status: "success",
            message: "Team member created successfully.",
            data: teamMember,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Error creating team member.", error: error.message });
    }
};
export const UpdateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role } = req.body;

        if (!id) {
            return res.status(400).json({ status: "failed", message: "Team member ID is required." });
        }

        const teamMember = await TeamModel.findById(id);

        if (!teamMember) {
            return res.status(404).json({ status: "failed", message: "Team member not found." });
        }

        // Update fields if provided
        if (name) teamMember.name = name;
        if (role) teamMember.role = role;

        // Handle image update
        if (req.file) {
            const imagePath = req.file.path.replace(/\\/g, "/");
            teamMember.image = imagePath;
        }

        await teamMember.save();

        res.status(200).json({
            status: "success",
            message: "Team member updated successfully.",
            data: teamMember,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Error updating team member.", error: error.message });
    }
};
export const RemoveOne = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ status: "failed", message: "Team member ID is required." });
        }

        const teamMember = await TeamModel.findByIdAndDelete(id);

        if (!teamMember) {
            return res.status(404).json({ status: "failed", message: "Team member not found." });
        }

        res.status(200).json({
            status: "success",
            message: "Team member removed successfully.",
            data: teamMember,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Error removing team member.", error: error.message });
    }
};
export const GetAllTeamMembers = async (req, res) => {
    try {
        const teamMembers = await TeamModel.find();
        res.status(200).json({ status: "success", data: teamMembers });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Error fetching team members.", error: error.message });
    }
};
