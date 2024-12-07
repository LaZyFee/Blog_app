import { CommentModel } from "../models/commentModel.js";
import { UserModel } from "../models/userModel.js";
import { BlogModel } from "../models/blogModel.js";
// Create a new comment
export const createComment = async (req, res) => {
    try {
        const { user_id } = req.headers;
        const { blog_id } = req.params;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ status: "failed", message: "Comment content is required." });
        }

        const user = await UserModel.findById(user_id, "name profilepic");
        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found." });
        }

        const newComment = await CommentModel.create({
            comment,
            createdBy: user_id,
            parent: blog_id,
        });

        await BlogModel.findByIdAndUpdate(blog_id, { $inc: { commentsCount: 1 } });

        const populatedComment = await CommentModel.findById(newComment._id)
            .populate("createdBy", "name profilepic");

        res.status(201).json({
            status: "success",
            message: "Comment created successfully.",
            data: populatedComment,
        });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Error creating comment.", error: error.message });
    }
};

// Update an existing comment
export const updateComment = async (req, res) => {
    try {
        const { user_id } = req.headers;
        const { blog_id } = req.params;
        const { comment, status } = req.body;

        // Find the comment
        const existingComment = await CommentModel.findOne({
            _id: req.params.comment_id,
            createdBy: user_id,
            parent: blog_id,
        });

        if (!existingComment) {
            return res.status(404).json({
                status: "failed",
                message: "Comment not found or unauthorized.",
            });
        }

        // Update fields
        if (comment) existingComment.comment = comment;
        if (status) existingComment.status = status;

        await existingComment.save();

        res.status(200).json({
            status: "success",
            message: "Comment updated successfully.",
            data: existingComment,
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Error updating comment.",
            error: error.message,
        });
    }
};

// Delete (soft delete) a comment
export const deleteComment = async (req, res) => {
    try {
        const { user_id } = req.headers;
        const { blog_id, comment_id } = req.params;

        const deletedComment = await CommentModel.findOneAndUpdate(
            { _id: comment_id, createdBy: user_id, parent: blog_id },
            { deleted: true }, // Soft delete by flagging
            { new: true }
        );

        if (!deletedComment) {
            return res.status(404).json({
                status: "failed",
                message: "Comment not found or unauthorized.",
            });
        }

        await BlogModel.findByIdAndUpdate(blog_id, { $inc: { commentsCount: -1 } });

        res.status(200).json({
            status: "success",
            message: "Comment deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Error deleting comment.",
            error: error.message,
        });
    }
};


// Get all comments for a blog with pagination
export const getAllComments = async (req, res) => {
    try {
        const { blog_id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const comments = await CommentModel.find({ parent: blog_id, deleted: false })
            .populate("createdBy", "name profilepic")
            .populate({
                path: "replies",
                populate: { path: "createdBy", select: "name profilepic" },
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalComments = await CommentModel.countDocuments({ parent: blog_id, deleted: false });

        res.status(200).json({
            status: "success",
            data: comments,
            total: totalComments,
            page: parseInt(page),
            totalPages: Math.ceil(totalComments / limit),
        });
    } catch (error) {
        res.status(500).json({ status: "failed", message: "Error fetching comments.", error: error.message });
    }
};
