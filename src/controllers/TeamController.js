import { TeamModel } from "../models/teamModel.js";
import { UserModel } from "../models/userModel.js";
import { deleteImage } from '../utilities/deleteImage.js';
import { uploadToCloudinary } from "../config/cloudinary.js";
export const CreateTeam = async (req, res) => {
    try {
        const { name, role } = req.body;

        if (!name || !role) {
            return res.status(400).json({ status: "failed", message: "Name and role are required." });
        }

        let imageUrl = "";
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer, "blog_app_team_pics");
        }

        const { user_id } = req.headers;

        const teamMember = await TeamModel.create({
            name,
            role,
            image: imageUrl,
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
        const { name, role, removeImage } = req.body;

        // Find team member
        const teamMember = await TeamModel.findById(id);
        if (!teamMember) {
            return res.status(404).json({ status: "failed", message: "Team member not found." });
        }

        // Update name and role
        if (name) teamMember.name = name;
        if (role) teamMember.role = role;

        let imageUrl = teamMember.image;

        // Remove previous image if removeImage is true or a new image is uploaded
        if (removeImage === "true" || req.file) {
            if (teamMember.image) {
                await deleteImage(teamMember.image);
            }
            imageUrl = "";
        }

        // If a new image is uploaded, upload to Cloudinary
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer, "blog_app_team_pics");
        }

        teamMember.image = imageUrl;

        await teamMember.save();

        res.status(200).json({
            status: "success",
            message: "Team member updated successfully.",
            data: teamMember,
        });
    } catch (error) {
        console.error("Error updating team member:", error);
        res.status(500).json({
            status: "failed",
            message: "Error updating team member.",
            error: error.message,
        });
    }
};


export const RemoveOne = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id } = req.headers;

        // Find team member created by the user
        const teamMember = await TeamModel.findOne({ _id: id, createdBy: user_id });
        if (!teamMember) {
            return res.status(404).json({ status: "failed", message: "Team member not found or not authorized to delete." });
        }

        // Delete image from Cloudinary if it exists
        if (teamMember.image) {
            await deleteImage(teamMember.image);
        }

        // Delete team member from DB
        await TeamModel.findByIdAndDelete(id);

        // Remove reference from UserModel
        await UserModel.findByIdAndUpdate(user_id, { $pull: { team: id } });

        res.status(200).json({
            status: "success",
            message: "Team member and associated image removed successfully.",
            data: teamMember
        });
    } catch (error) {
        console.error("Error removing team member:", error);
        res.status(500).json({
            status: "failed",
            message: "Error removing team member.",
            error: error.message
        });
    }
};


export const GetAllTeamMembers = async (req, res) => {
    try {
        const { user_id } = req.params;
        const teamMembers = await TeamModel.find({
            createdBy: user_id
        });
        res.status(200).json({ status: "success", data: teamMembers });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Error fetching team members.", error: error.message });
    }
};
export const GetUserProfileWithTeam = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await UserModel.findById(userId)
            .populate('team')
            .populate('author')
            .select('-password');

        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found." });
        }

        res.status(200).json({ status: "success", data: user });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Error fetching user profile.", error: error.message });
    }
};
