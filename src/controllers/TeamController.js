import { TeamModel } from "../models/teamModel.js";
import { UserModel } from "../models/userModel.js";
import fs from "fs";

export const CreateTeam = async (req, res) => {
    try {
        const { name, role } = req.body;

        if (!name || !role) {
            return res.status(400).json({ status: "failed", message: "Name and role are required." });
        }

        // Handle image path if provided
        const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : "";

        const { user_id } = req.headers;

        const teamMember = await TeamModel.create({
            name,
            role,
            image: imagePath,
            createdBy: user_id,
        });

        // Update the user's team field
        await UserModel.findByIdAndUpdate(user_id, { $push: { team: teamMember._id } });

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
        const { user_id } = req.headers;

        // Find the team member to get the image path and verify ownership
        const teamMember = await TeamModel.findOne({ _id: id, createdBy: user_id });

        if (!teamMember) {
            return res.status(404).json({
                status: "failed",
                message: "Team member not found or not authorized to delete."
            });
        }

        const imagePath = teamMember.image;

        // Remove the image file from the server if it exists
        if (imagePath) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error deleting image file:", err);
                } else {
                    console.log("Image file deleted successfully.");
                }
            });
        }

        // Delete the team member from the database
        await TeamModel.findByIdAndDelete(id);

        // Remove the team member reference from the user's `team` array
        await UserModel.findByIdAndUpdate(user_id, { $pull: { team: id } });

        res.status(200).json({
            status: "success",
            message: "Team member and associated image removed successfully.",
            data: teamMember,
        });
    } catch (error) {
        console.error("Error removing team member:", error);
        res.status(500).json({
            status: "failed",
            message: "Error removing team member.",
            error: error.message,
        });
    }
};


export const GetAllTeamMembers = async (req, res) => {
    try {
        const { user_id } = req.headers;
        const teamMembers = await TeamModel.find({ createdBy: user_id });
        res.status(200).json({ status: "success", data: teamMembers });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Error fetching team members.", error: error.message });
    }
};