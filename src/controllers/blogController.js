import { BlogModel } from "../models/blogModel.js";
import { UserModel } from "../models/userModel.js";
import { deleteImage } from "../utilities/deleteImage.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

const isOwnerOrAdmin = (blog, userId, userRole) => {
  if (!blog || !userId) return false;
  return blog.createdBy.toString() === userId || userRole === "admin";
};

export const CreateBlog = async (req, res) => {
  try {
    const { user_id } = req.headers;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        status: "failed",
        message: "All fields are required",
      });
    }

    const user = await UserModel.findById(user_id);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, "blog_app_blog_pics");
    }

    const newBlog = await BlogModel.create({
      title,
      content,
      image: imageUrl,
      createdBy: user._id,
    });

    user.author.push(newBlog._id);
    await user.save();

    return res.status(201).json({
      status: "success",
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while creating the blog",
      error: error.message,
    });
  }
};

export const UpdateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, removeImage } = req.body;
    const userId = req.headers.user_id;

    const existingBlog = await BlogModel.findById(id);
    if (!existingBlog) {
      return res.status(404).json({
        status: "failed",
        message: "Blog not found.",
      });
    }

    const requester = await UserModel.findById(userId);
    if (!requester) {
      return res.status(401).json({
        status: "failed",
        message: "User not authorized.",
      });
    }

    if (!isOwnerOrAdmin(existingBlog, userId, requester.role)) {
      return res.status(403).json({
        status: "failed",
        message: "You are not allowed to update this blog.",
      });
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (content) updateFields.content = content;

    if (removeImage === "true" && existingBlog.image) {
      await deleteImage(existingBlog.image);
      updateFields.image = "";
    }

    if (req.file) {
      if (existingBlog.image) {
        await deleteImage(existingBlog.image);
      }
      updateFields.image = await uploadToCloudinary(req.file.buffer, "blog_app_blog_pics");
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(id, updateFields, { new: true });

    return res.status(200).json({
      status: "success",
      message: "Blog updated successfully.",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({
      status: "failed",
      message: "Error updating blog.",
      error: error.message,
    });
  }
};

export const DeleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers.user_id;
    const blog = await BlogModel.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const requester = await UserModel.findById(userId);
    if (!requester) {
      return res.status(401).json({
        status: "failed",
        message: "User not authorized.",
      });
    }

    if (!isOwnerOrAdmin(blog, userId, requester.role)) {
      return res.status(403).json({
        status: "failed",
        message: "You are not allowed to delete this blog.",
      });
    }

    if (blog.image) {
      await deleteImage(blog.image);
    }

    await BlogModel.findByIdAndDelete(id);
    await UserModel.findByIdAndUpdate(blog.createdBy, { $pull: { author: id } });

    return res.status(200).json({
      status: "success",
      message: "Blog and associated image deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while deleting the blog",
      error: error.message,
    });
  }
};

export const GetAllBlogs = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [blogs, totalItems] = await Promise.all([
      BlogModel.find()
        .populate({
          path: "createdBy",
          select: "_id name profilepic",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      BlogModel.countDocuments(),
    ]);

    return res.status(200).json({
      status: "success",
      Blogs: blogs,
      data: blogs,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.toString(),
    });
  }
};

export const GetBlogsById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await BlogModel.findById(id)
      .populate({
        path: "createdBy",
        select: "_id name profilepic",
      })
      .populate({
        path: "comments",
        populate: [
          { path: "createdBy", select: "_id name profilepic" },
          {
            path: "replies",
            populate: { path: "createdBy", select: "_id name profilepic" },
          },
        ],
      });

    if (!blog) {
      return res.status(404).json({
        status: "failed",
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      status: "success",
      blog,
      data: blog,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.toString(),
    });
  }
};
