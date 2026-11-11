import { CommentModel } from "../models/commentModel.js";
import { UserModel } from "../models/userModel.js";
import { BlogModel } from "../models/blogModel.js";
import { isValidObjectId, parsePagination, validateText } from "../utilities/requestValidation.js";

const canModerate = async (userId, blog) => {
  const user = await UserModel.findById(userId).select("role");
  return Boolean(user && (user.role === "admin" || blog.createdBy.toString() === userId));
};

export const addReply = async (req, res) => {
  try {
    const { user_id: userId } = req.headers;
    const { blog_id: blogId, comment_id: commentId } = req.params;
    const { comment } = req.body;
    const validationError = validateText(comment, { field: "reply", maxLength: 2000 });
    if (validationError) return res.status(400).json({ status: "failed", message: validationError });
    if (![blogId, commentId].every(isValidObjectId)) return res.status(400).json({ status: "failed", message: "Invalid blog or comment ID" });

    const [blog, parentComment, user] = await Promise.all([
      BlogModel.findById(blogId).select("_id"),
      CommentModel.findOne({ _id: commentId, parent: blogId, type: "comment", deleted: false, status: "approved" }),
      UserModel.findById(userId).select("_id name profilepic"),
    ]);
    if (!blog) return res.status(404).json({ status: "failed", message: "Blog not found" });
    if (!parentComment) return res.status(404).json({ status: "failed", message: "Comment not found" });
    if (!user) return res.status(401).json({ status: "failed", message: "User not authorized" });

    const newReply = await CommentModel.create({ comment: comment.trim(), createdBy: userId, parent: blogId, type: "reply" });
    parentComment.replies.push(newReply._id);
    await parentComment.save();
    const data = await CommentModel.findById(newReply._id).populate("createdBy", "name profilepic");
    return res.status(201).json({ status: "success", message: "Reply added successfully.", data });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Error creating reply." });
  }
};

export const updateReply = async (req, res) => {
  try {
    const { user_id: userId } = req.headers;
    const { blog_id: blogId, comment_id: commentId, reply_id: replyId } = req.params;
    const { comment } = req.body;
    const validationError = validateText(comment, { field: "reply", maxLength: 2000 });
    if (validationError) return res.status(400).json({ status: "failed", message: validationError });
    if (![blogId, commentId, replyId].every(isValidObjectId)) return res.status(400).json({ status: "failed", message: "Invalid blog, comment, or reply ID" });

    const parentComment = await CommentModel.findOne({ _id: commentId, parent: blogId, type: "comment", deleted: false });
    if (!parentComment) return res.status(404).json({ status: "failed", message: "Comment not found" });
    if (!parentComment.replies.some((id) => id.toString() === replyId)) return res.status(404).json({ status: "failed", message: "Reply not found" });
    const reply = await CommentModel.findOne({ _id: replyId, parent: blogId, type: "reply", deleted: false });
    if (!reply) return res.status(404).json({ status: "failed", message: "Reply not found" });
    if (reply.createdBy.toString() !== userId) return res.status(403).json({ status: "failed", message: "You are not allowed to update this reply" });

    reply.comment = comment.trim();
    await reply.save();
    const data = await reply.populate("createdBy", "name profilepic");
    return res.status(200).json({ status: "success", data });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Error updating reply." });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const { user_id: userId } = req.headers;
    const { blog_id: blogId, comment_id: commentId, reply_id: replyId } = req.params;
    if (![blogId, commentId, replyId].every(isValidObjectId)) return res.status(400).json({ status: "failed", message: "Invalid blog, comment, or reply ID" });

    const [blog, parentComment] = await Promise.all([
      BlogModel.findById(blogId).select("createdBy"),
      CommentModel.findOne({ _id: commentId, parent: blogId, type: "comment", deleted: false }),
    ]);
    if (!blog || !parentComment) return res.status(404).json({ status: "failed", message: "Reply not found" });
    const reply = await CommentModel.findOne({ _id: replyId, parent: blogId, type: "reply", deleted: false });
    if (!reply || !parentComment.replies.some((id) => id.toString() === replyId)) return res.status(404).json({ status: "failed", message: "Reply not found" });
    const authorized = reply.createdBy.toString() === userId || await canModerate(userId, blog);
    if (!authorized) return res.status(403).json({ status: "failed", message: "You are not allowed to delete this reply" });

    reply.deleted = true;
    await reply.save();
    parentComment.replies.pull(reply._id);
    await parentComment.save();
    return res.status(200).json({ status: "success", message: "Reply deleted" });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Error deleting reply." });
  }
};

export const getReplies = async (req, res) => {
  try {
    const { comment_id: commentId } = req.params;
    if (!isValidObjectId(commentId)) return res.status(400).json({ status: "failed", message: "Invalid comment ID" });
    const pagination = parsePagination(req.query, { defaultLimit: 10, maxLimit: 50 });
    if (pagination.error) return res.status(400).json({ status: "failed", message: pagination.error });

    const parent = await CommentModel.findOne({ _id: commentId, type: "comment", deleted: false, status: "approved" }).select("replies");
    if (!parent) return res.status(404).json({ status: "failed", message: "Comment not found" });
    const filter = { _id: { $in: parent.replies }, type: "reply", deleted: false, status: "approved" };
    const [replies, total] = await Promise.all([
      CommentModel.find(filter).populate("createdBy", "name profilepic").sort({ createdAt: 1, _id: 1 }).skip(pagination.skip).limit(pagination.limit),
      CommentModel.countDocuments(filter),
    ]);
    return res.status(200).json({
      status: "success",
      data: replies,
      pagination: { page: pagination.page, limit: pagination.limit, totalItems: total, totalPages: Math.ceil(total / pagination.limit) },
    });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Error fetching replies." });
  }
};

export const moderateReply = async (req, res) => {
  try {
    const { user_id: userId } = req.headers;
    const { reply_id: replyId } = req.params;
    const { status } = req.body;
    if (!isValidObjectId(replyId)) return res.status(400).json({ status: "failed", message: "Invalid reply ID" });
    if (!["approved", "hidden"].includes(status)) return res.status(400).json({ status: "failed", message: "status must be approved or hidden" });
    const moderator = await UserModel.findById(userId).select("role");
    if (!moderator || moderator.role !== "admin") return res.status(403).json({ status: "failed", message: "Admin access required" });
    const reply = await CommentModel.findOneAndUpdate({ _id: replyId, type: "reply", deleted: false }, { status }, { new: true, runValidators: true });
    if (!reply) return res.status(404).json({ status: "failed", message: "Reply not found" });
    return res.status(200).json({ status: "success", data: reply });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Error moderating reply." });
  }
};
