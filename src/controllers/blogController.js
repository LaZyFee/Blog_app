import { BlogModel } from "../models/blogModel.js";
import { UserModel } from "../models/userModel.js";
import { deleteImage } from '../utilities/deleteImage.js';
import { uploadToCloudinary } from "../config/cloudinary.js";

export const CreateBlog = async (req, res) => {
    try {
        const { user_id } = req.headers;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                status: "failed",
                message: "All fields are required"
            });
        }

        // Check if the user exists
        const user = await UserModel.findById(user_id);
        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found"
            });
        }

        let imageUrl = "";
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer, "blog_app_blog_pics");
        }

        // Create a new blog
        const newBlog = await BlogModel.create({
            title,
            content,
            image: imageUrl,
            createdBy: user._id,
        });

        // Update the user's author array with the new blog ID
        user.author.push(newBlog._id);
        await user.save();

        res.status(201).json({
            status: "success",
            message: "Blog created successfully",
            data: newBlog
        });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({
            status: "failed",
            message: "An error occurred while creating the blog",
            error: error.message
        });
    }
};

export const UpdateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, removeImage } = req.body;

        // Fetch the existing blog by ID
        const existingBlog = await BlogModel.findById(id);
        if (!existingBlog) {
            return res.status(404).json({
                status: "failed",
                message: "Blog not found."
            });
        }

        const updateFields = {};

        if (title) updateFields.title = title;
        if (content) updateFields.content = content;

        // Handle image removal
        if (removeImage === "true" && existingBlog.image) {
            await deleteImage(existingBlog.image); // Delete from Cloudinary
            updateFields.image = "";
        }

        // Handle new image upload
        if (req.file) {
            if (existingBlog.image) {
                await deleteImage(existingBlog.image); // Delete old image before replacing
            }
            updateFields.image = await uploadToCloudinary(req.file.buffer, "blog_app_blog_pics");
        }

        // Update the blog
        const updatedBlog = await BlogModel.findByIdAndUpdate(id, updateFields, { new: true });

        res.status(200).json({
            status: "success",
            message: "Blog updated successfully.",
            data: updatedBlog,
        });
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({
            status: "failed",
            message: "Error updating blog.",
            error: error.message,
        });
    }
};


export const DeleteBlog = async (req, res) => {
    try {
        const blog = await BlogModel.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Delete image from Cloudinary
        if (blog.image) {
            await deleteImage(blog.image);
        }

        // Delete the blog from DB
        await BlogModel.findByIdAndDelete(req.params.id);

        // Remove blog ID from user's author array
        await UserModel.findByIdAndUpdate(blog.createdBy, { $pull: { author: req.params.id } });

        res.status(200).json({ message: "Blog and associated image deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while deleting the blog", error: error.message });
    }
};


export const GetAllBlogs = async (req, res) => {
    try {
        const Blogs = await BlogModel.find().populate({
            path: "createdBy",
            select: "_id name profilepic"
        });

        return res.status(200).json({
            status: "success",
            Blogs
        });
    } catch (error) {
        return res.status(400).json({
            status: "Failed",
            message: error.toString()
        });
    }
};

export const GetBlogsById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the blog with populated comments and nested replies
        const blog = await BlogModel.findById(id)
            .populate({
                path: "createdBy",
                select: "_id name profilepic",
            })
            .populate({
                path: "comments",
                populate: [
                    { path: "createdBy", select: "_id name profilepic" }, // Populate comment authors
                    {
                        path: "replies",
                        populate: { path: "createdBy", select: "_id name profilepic" }, // Populate reply authors
                    },
                ],
            });

        if (!blog) {
            return res.status(404).json({
                status: "Failed",
                message: "Blog not found",
            });
        }

        return res.status(200).json({
            status: "success",
            blog, // Return the blog object with comments and replies
        });
    } catch (error) {
        return res.status(400).json({
            status: "Failed",
            message: error.toString(),
        });
    }
};

