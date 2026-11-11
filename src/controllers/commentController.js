import { BlogModel } from "../models/blogModel.js";
import { UserModel } from "../models/userModel.js";
import { CommentModel } from "../models/commentModel.js";
import { isValidObjectId, parsePagination, validateText } from "../utilities/requestValidation.js";

const commentLimit = 2000;

const canModerate = async (userId, blog) => {
  const user = await UserModel.findById(userId).select("role");
  return Boolean(user && (user.role === "admin" || blog.createdBy.toString() === userId));
};

export const createComment = async (req, res) => {
  try {
    const { user_id: userId } = req.headers;
    const { blog_id: blogId } = req.params;
    const { comment } = req.body;

    const validationError = validateText(comment, { field: "comment", maxLength: commentLimit });
    if (validationError) return res.status(400).json({ status: "failed", message: validationError });
    if (!isValidObjectId(blogId)) return res.status(400).json({ status: "failed", message: "Invalid blog ID" });

    const [blog, user] = await Promise.all([
      BlogModel.findById(blogId).select("_id"),
      UserModel.findById(userId).select("_id name profilepic"),
    ]);
    if (!blog) return res.status(404).json({ status: "failed", message: "Blog not found" });
    if (!user) return res.status(401).json({ status: "failed", message: "User not authorized" });

    const created = await CommentModel.create({ comment: comment.trim(), createdBy: userId, parent: blogId });
    await BlogModel.findByIdAndUpdate(blogId, { $push: { comments: created._id }, $inc: { commentsCount: 1 } });
    const data = await CommentModel.findById(created._id).populate("createdBy", "name profilepic");
    return res.status(201).json({ status: "success", message: "Comment created successfully.", data });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Error creating comment." });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { user_id: userId } = req.headers;
    const { blog_id: blogId, comment_id: commentId } = req.params;
    const { comment } = req.body;
    const validationError = validateText(comment, { field: "comment", maxLength: commentLimit });
    if (validationError) return res.status(400).json({ status: "failed", message: validationError });
    if (![blogId, commentId].every(isValidObjectId)) return res.status(400).json({ status: "failed", message: "Invalid blog or comment ID" });

    const existing = await CommentModel.findOne({ _id: commentId, parent: blogId, type: "comment", deleted: false });
    if (!existing) return res.status(404).json({ status: "failed", message: "Comment not found" });
    if (existing.createdBy.toString() !== userId) return res.status(403).json({ status: "failed", message: "You are not allowed to update this comment" });

    existing.comment = comment.trim();
    await existing.save();
    const data = await existing.populate("createdBy", "name profilepic");
    return res.status(200).json({ status: "success", data });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Error updating comment." });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { user_id: userId } = req.headers;
    const { blog_id: blogId, comment_id: commentId } = req.params;
    if (![blogId, commentId].every(isValidObjectId)) return res.status(400).json({ status: "failed", message: "Invalid blog or comment ID" });

    const [blog, comment] = await Promise.all([
      BlogModel.findById(blogId).select("createdBy"),
      CommentModel.findOne({ _id: commentId, parent: blogId, type: "comment", deleted: false }),
    ]);
    if (!blog || !comment) return res.status(404).json({ status: "failed", message: "Comment not found" });
    const authorized = comment.createdBy.toString() === userId || await canModerate(userId, blog);
    if (!authorized) return res.status(403).json({ status: "failed", message: "You are not allowed to delete this comment" });

    const replyIds = comment.replies || [];
    await CommentModel.updateMany({ _id: { $in: replyIds } }, { $set: { deleted: true } });
    comment.deleted = true;
    await comment.save();
    await BlogModel.findByIdAndUpdate(blogId, {
      $pull: { comments: comment._id },
      $inc: { commentsCount: -1 },
    });
    return res.status(200).json({ status: "success", message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Error deleting comment." });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const { blog_id: blogId } = req.params;
    if (!isValidObjectId(blogId)) return res.status(400).json({ status: "failed", message: "Invalid blog ID" });
    const pagination = parsePagination(req.query, { defaultLimit: 10, maxLimit: 50 });
    if (pagination.error) return res.status(400).json({ status: "failed", message: pagination.error });

    const filter = { parent: blogId, type: "comment", deleted: false, status: "approved" };
    const [comments, total] = await Promise.all([
      CommentModel.find(filter)
        .populate("createdBy", "name profilepic")
        .sort({ createdAt: -1, _id: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit),
      CommentModel.countDocuments(filter),
    ]);
    return res.status(200).json({
      status: "success",
      data: comments,
      pagination: { page: pagination.page, limit: pagination.limit, totalItems: total, totalPages: Math.ceil(total / pagination.limit) },
    });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Error fetching comments." });
  }
};

export const moderateComment = async (req, res) => {
  try {
    const { user_id: userId } = req.headers;
    const { comment_id: commentId } = req.params;
    const { status } = req.body;
    if (!isValidObjectId(commentId)) return res.status(400).json({ status: "failed", message: "Invalid comment ID" });
    if (!["approved", "hidden"].includes(status)) return res.status(400).json({ status: "failed", message: "status must be approved or hidden" });

    const moderator = await UserModel.findById(userId).select("role");
    if (!moderator || moderator.role !== "admin") return res.status(403).json({ status: "failed", message: "Admin access required" });
    const comment = await CommentModel.findOneAndUpdate(
      { _id: commentId, deleted: false },
      { status },
      { new: true, runValidators: true }
    );
    if (!comment) return res.status(404).json({ status: "failed", message: "Comment not found" });
    return res.status(200).json({ status: "success", data: comment });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Error moderating comment." });
  }
};
