import mongoose from "mongoose";
import { CommentModel } from "../models/commentModel.js";
import { BlogModel } from "../models/blogModel.js";

export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, type } = req.query; // `type` specifies 'comment' or 'blog'
        const { user_id } = req.headers;
        console.log("toggleLike action:", action, "type:", type, "id:", id, "user_id:", user_id);

        // Validate `type`
        if (!["comment", "reply", "blog"].includes(type)) {
            return res.status(400).json({ status: "failed", message: "Invalid type. Must be 'comment' or 'blog'." });
        }

        // Validate `id`
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "failed", message: `Invalid ${type} ID format.` });
        }

        // Validate `action`
        if (!["like", "dislike", "none"].includes(action)) {
            return res.status(400).json({ status: "failed", message: "Invalid action. Must be 'like', 'dislike', or 'none'." });
        }

        // Validate `user_id`
        if (!user_id) {
            return res.status(400).json({ status: "failed", message: "User ID is required." });
        }

        // Determine model based on `type`
        const Model = type === "comment" || type === "reply" ? CommentModel : BlogModel;

        // Find the document
        const doc = await Model.findById(id);
        if (!doc) {
            return res.status(404).json({ status: "failed", message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found.` });
        }

        // Check if the user already reacted
        const existingReactionIndex = doc.reactions.findIndex(
            (reaction) => reaction.user.toString() === user_id
        );

        if (existingReactionIndex > -1) {
            const existingReaction = doc.reactions[existingReactionIndex];

            if (action === "none") {
                // Undo reaction
                doc.reactions.splice(existingReactionIndex, 1);
                if (existingReaction.type === "like") doc.likes--;
                if (existingReaction.type === "dislike") doc.disLikes--;
            } else if (existingReaction.type === action) {
                // If the same action is clicked, undo it
                doc.reactions.splice(existingReactionIndex, 1);
                action === "like" ? doc.likes-- : doc.disLikes--;
            } else {
                // Change reaction type
                doc.reactions[existingReactionIndex].type = action;
                if (action === "like") {
                    doc.likes++;
                    doc.disLikes--;
                } else {
                    doc.likes--;
                    doc.disLikes++;
                }
            }
        } else if (action !== "none") {
            // Add a new reaction
            doc.reactions.push({ user: user_id, type: action });
            action === "like" ? doc.likes++ : doc.disLikes++;
        }

        // Save the updated document
        const updatedDoc = await doc.save();

        // Ensure `userReaction` is an array (even if it's empty)
        const userReaction = Array.isArray(doc.reactions)
            ? doc.reactions.find((reaction) => reaction.user.toString() === user_id)
            : null;

        res.status(200).json({
            status: "success",
            data: {
                likes: updatedDoc.likes,
                dislikes: updatedDoc.disLikes,
                userReaction: userReaction ? userReaction.type : null,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
