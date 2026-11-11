import { BlogModel } from "../models/blogModel.js";
import { UserModel } from "../models/userModel.js";
import { deleteImage } from "../utilities/deleteImage.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { isValidObjectId, parsePagination, validateText } from "../utilities/requestValidation.js";

const isOwnerOrAdmin = (blog, userId, userRole) => Boolean(blog && userId && (blog.createdBy.toString() === userId || userRole === "admin"));
const titleMaxLength = 160;
const contentMaxLength = 50000;

export const CreateBlog = async (req, res) => {
  try {
    const { user_id: userId } = req.headers;
    const { title, content } = req.body;
    const titleError = validateText(title, { field: "title", maxLength: titleMaxLength });
    const contentError = validateText(content, { field: "content", maxLength: contentMaxLength });
    if (titleError || contentError) return res.status(400).json({ status: "failed", message: titleError || contentError });

    const user = await UserModel.findById(userId);
    if (!user) return res.status(401).json({ status: "failed", message: "User not authorized" });

    const imageUrl = req.file ? await uploadToCloudinary(req.file.buffer, "blog_app_blog_pics") : "";
    const newBlog = await BlogModel.create({ title: title.trim(), content: content.trim(), image: imageUrl, createdBy: user._id });
    user.author.push(newBlog._id);
    await user.save();
    return res.status(201).json({ status: "success", message: "Blog created successfully", data: newBlog });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "An error occurred while creating the blog" });
  }
};

export const UpdateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, removeImage } = req.body;
    const userId = req.headers.user_id;
    if (!isValidObjectId(id)) return res.status(400).json({ status: "failed", message: "Invalid blog ID" });
    if (removeImage !== undefined && !["true", "false", true, false].includes(removeImage)) return res.status(400).json({ status: "failed", message: "removeImage must be true or false" });
    if (title !== undefined) {
      const message = validateText(title, { field: "title", maxLength: titleMaxLength });
      if (message) return res.status(400).json({ status: "failed", message });
    }
    if (content !== undefined) {
      const message = validateText(content, { field: "content", maxLength: contentMaxLength });
      if (message) return res.status(400).json({ status: "failed", message });
    }
    if (title === undefined && content === undefined && removeImage === undefined && !req.file) return res.status(400).json({ status: "failed", message: "Provide at least one field to update" });

    const existingBlog = await BlogModel.findById(id);
    if (!existingBlog) return res.status(404).json({ status: "failed", message: "Blog not found." });
    const requester = await UserModel.findById(userId);
    if (!requester) return res.status(401).json({ status: "failed", message: "User not authorized." });
    if (!isOwnerOrAdmin(existingBlog, userId, requester.role)) return res.status(403).json({ status: "failed", message: "You are not allowed to update this blog." });

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (content !== undefined) updateFields.content = content.trim();
    if (removeImage === "true" || removeImage === true) updateFields.image = "";
    if (req.file) updateFields.image = await uploadToCloudinary(req.file.buffer, "blog_app_blog_pics");

    const updatedBlog = await BlogModel.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
    if (updatedBlog.image !== existingBlog.image && existingBlog.image) await deleteImage(existingBlog.image);
    if (!updatedBlog.image && existingBlog.image) await deleteImage(existingBlog.image);
    return res.status(200).json({ status: "success", message: "Blog updated successfully.", data: updatedBlog });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Error updating blog." });
  }
};

export const DeleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers.user_id;
    if (!isValidObjectId(id)) return res.status(400).json({ status: "failed", message: "Invalid blog ID" });
    const blog = await BlogModel.findById(id);
    if (!blog) return res.status(404).json({ status: "failed", message: "Blog not found" });
    const requester = await UserModel.findById(userId);
    if (!requester) return res.status(401).json({ status: "failed", message: "User not authorized." });
    if (!isOwnerOrAdmin(blog, userId, requester.role)) return res.status(403).json({ status: "failed", message: "You are not allowed to delete this blog." });
    if (blog.image) await deleteImage(blog.image);
    await BlogModel.findByIdAndDelete(id);
    await UserModel.findByIdAndUpdate(blog.createdBy, { $pull: { author: id } });
    return res.status(200).json({ status: "success", message: "Blog and associated image deleted successfully" });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "An error occurred while deleting the blog" });
  }
};

export const GetAllBlogs = async (req, res) => {
  try {
    const pagination = parsePagination(req.query, { defaultLimit: 10, maxLimit: 50 });
    if (pagination.error) return res.status(400).json({ status: "failed", message: pagination.error });
    const [blogs, totalItems] = await Promise.all([
      BlogModel.find().populate({ path: "createdBy", select: "_id name profilepic" }).sort({ createdAt: -1, _id: -1 }).skip(pagination.skip).limit(pagination.limit),
      BlogModel.countDocuments(),
    ]);
    return res.status(200).json({ status: "success", Blogs: blogs, data: blogs, pagination: { page: pagination.page, limit: pagination.limit, totalItems, totalPages: Math.ceil(totalItems / pagination.limit) } });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Error fetching blogs" });
  }
};

export const GetBlogsById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ status: "failed", message: "Invalid blog ID" });
    const blog = await BlogModel.findById(id).populate({ path: "createdBy", select: "_id name profilepic" });
    if (!blog) return res.status(404).json({ status: "failed", message: "Blog not found" });
    return res.status(200).json({ status: "success", blog, data: blog });
  } catch (error) {
    return res.status(500).json({ status: "failed", message: "Error fetching blog" });
  }
};
