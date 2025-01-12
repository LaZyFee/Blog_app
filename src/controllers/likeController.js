import mongoose from "mongoose";
import { CommentModel } from "../models/commentModel.js";

export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.query;
        const { user_id } = req.headers;

        // Validate `id`
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "failed", message: "Invalid comment ID format." });
        }

        // Validate `action`
        if (!["like", "dislike", "none"].includes(action)) {
            return res.status(400).json({ status: "failed", message: "Invalid action. Must be 'like', 'dislike', or 'none'." });
        }

        // Validate `user_id`
        if (!user_id) {
            return res.status(400).json({ status: "failed", message: "User ID is required." });
        }

        // Find the comment
        const comment = await CommentModel.findById(id);
        if (!comment) {
            return res.status(404).json({ status: "failed", message: "Comment not found." });
        }

        // Check if the user already reacted
        const existingReactionIndex = comment.reactions.findIndex(
            (reaction) => reaction.user.toString() === user_id
        );

        if (existingReactionIndex > -1) {
            const existingReaction = comment.reactions[existingReactionIndex];

            if (action === "none") {
                // Undo reaction
                comment.reactions.splice(existingReactionIndex, 1);
                if (existingReaction.type === "like") comment.likes--;
                if (existingReaction.type === "dislike") comment.disLikes--;
            } else if (existingReaction.type === action) {
                // If the same action is clicked, undo it
                comment.reactions.splice(existingReactionIndex, 1);
                action === "like" ? comment.likes-- : comment.disLikes--;
            } else {
                // Change reaction type
                comment.reactions[existingReactionIndex].type = action;
                if (action === "like") {
                    comment.likes++;
                    comment.disLikes--;
                } else {
                    comment.likes--;
                    comment.disLikes++;
                }
            }
        } else if (action !== "none") {
            // Add a new reaction
            comment.reactions.push({ user: user_id, type: action });
            action === "like" ? comment.likes++ : comment.disLikes++;
        }

        // Save the updated comment
        const updatedComment = await comment.save();

        // Get the updated user reaction
        const userReaction = comment.reactions.find(
            (reaction) => reaction.user.toString() === user_id
        );

        res.status(200).json({
            status: "success",
            data: {
                likes: updatedComment.likes,
                dislikes: updatedComment.disLikes,
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
