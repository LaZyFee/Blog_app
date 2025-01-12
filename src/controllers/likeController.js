import mongoose from "mongoose";
import { CommentModel } from "../models/commentModel.js";

export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.query;
        const { user_id } = req.headers;

        console.log(id, action, user_id);
        console.log(typeof action);

        // Validate `id`
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: "failed", message: "Invalid comment ID format." });
        }

        // Validate `action`
        if (!["like", "dislike"].includes(action)) {
            return res.status(400).json({ status: "failed", message: "Invalid action. Must be 'like' or 'dislike'." });
        }

        // Validate `user_id`
        if (!user_id) {
            return res.status(400).json({ status: "failed", message: "User ID is required." });
        }

        // Find the comment
        const comment = await CommentModel.findById(id);
        console.log("comment", comment);
        if (!comment) {
            return res.status(404).json({ status: "failed", message: "Comment not found." });
        }

        // Check if the user already reacted
        const existingReactionIndex = comment.reactions.findIndex(
            (reaction) => reaction.user.toString() === user_id
        );
        console.log("existingReactionIndex", existingReactionIndex);

        // Update the reaction
        if (existingReactionIndex > -1) {
            const existingReaction = comment.reactions[existingReactionIndex];
            console.log("existingReaction", existingReaction);

            if (existingReaction.type === action) {
                // Undo the reaction
                comment.reactions.splice(existingReactionIndex, 1);
                action === "like" ? comment.likes-- : comment.disLikes--;
            } else {
                // Update reaction type
                comment.reactions[existingReactionIndex].type = action;
                if (action === "like") {
                    comment.likes++;
                    comment.disLikes--;
                } else {
                    comment.likes--;
                    comment.disLikes++;
                }
            }
        } else {
            // Add new reaction
            comment.reactions.push({ user: user_id, type: action });
            action === "like" ? comment.likes++ : comment.disLikes++;
        }

        // Save the updated comment
        const updatedComment = await comment.save();
        console.log("updatedComment", updatedComment);

        // Get the updated user reaction
        const userReaction = comment.reactions.find(
            (reaction) => reaction.user.toString() === user_id
        );
        console.log("userReaction", userReaction);

        res.status(200).json({
            status: "success",
            data: {
                likes: comment.likes,
                dislikes: comment.disLikes,
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
