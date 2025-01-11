import { CommentModel } from "../models/commentModel.js";
import { UserModel } from "../models/userModel.js";

// Add a reply to a comment
export const addReply = async (req, res) => {
    try {
        const { user_id } = req.headers;
        const { blog_id, comment_id } = req.params;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ status: "failed", message: "Reply content is required." });
        }

        // Check parent comment existence
        const parentComment = await CommentModel.findById(comment_id);
        if (!parentComment) {
            return res.status(404).json({ status: "failed", message: "Parent comment not found." });
        }

        // Check user existence
        const user = await UserModel.findById(user_id, "name profilepic");
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found." });
        }

        // Create new reply
        const newReply = await CommentModel.create({
            comment,
            createdBy: user_id,
            parent: blog_id,
            type: "reply",
        });

        // Add reply to parent comment
        parentComment.replies.push(newReply._id);
        await parentComment.save();

        // Populate the reply
        const populatedReply = await CommentModel.findById(newReply._id)
            .populate("createdBy", "name profilepic");

        res.status(201).json({
            status: "success",
            message: "Reply added successfully.",
            data: populatedReply,
        });
    } catch (error) {
        const errorMessage = error.name === "ValidationError"
            ? "Invalid input data."
            : "An unexpected error occurred.";
        res.status(500).json({ status: "failed", message: errorMessage, error: error.message });
    }
};

// Update an existing reply
export const updateReply = async (req, res) => {
    try {
        const { user_id } = req.headers;
        const { blog_id, comment_id, reply_id } = req.params;
        const { comment, status } = req.body;

        // Find the reply
        const existingReply = await CommentModel.findOne({
            _id: reply_id,
            createdBy: user_id,
            parent: blog_id,
            "replies": { $in: [comment_id] }, // Ensure it's a reply to the correct comment
        });

        if (!existingReply) {
            return res.status(404).json({
                status: "failed",
                message: "Reply not found or unauthorized.",
            });
        }

        // Update fields
        if (comment) existingReply.comment = comment;
        if (status) existingReply.status = status;

        await existingReply.save();

        res.status(200).json({
            status: "success",
            message: "Reply updated successfully.",
            data: existingReply,
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Error updating reply.",
            error: error.message,
        });
    }
};
// Delete (soft delete) a reply
export const deleteReply = async (req, res) => {
    try {
        const { user_id } = req.headers;
        const { blog_id, comment_id, reply_id } = req.params;

        const deletedReply = await CommentModel.findOneAndUpdate(
            { _id: reply_id, createdBy: user_id, parent: blog_id, "replies": { $in: [comment_id] } },
            { deleted: true }, // Soft delete by flagging
            { new: true }
        );

        if (!deletedReply) {
            return res.status(404).json({
                status: "failed",
                message: "Reply not found or unauthorized.",
            });
        }

        // Optionally, remove the reference to the deleted reply from the parent comment
        await CommentModel.findByIdAndUpdate(comment_id, { $pull: { replies: reply_id } });

        res.status(200).json({
            status: "success",
            message: "Reply deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Error deleting reply.",
            error: error.message,
        });
    }
};
// Get replies for a specific comment
export const getReplies = async (req, res) => {
    try {
        const { comment_id } = req.params;

        // Find the comment and its replies
        const replies = await CommentModel.find({ parent: comment_id, type: "reply", deleted: false })
            .populate("createdBy", "name profilepic")
            .sort({ createdAt: -1 });


        // Count total replies for pagination
        const totalReplies = await CommentModel.countDocuments({ parent: comment_id, deleted: false });

        res.status(200).json({
            status: "success",
            data: replies,
            total: totalReplies,
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Error fetching replies.",
            error: error.message,
        });
    }
};
