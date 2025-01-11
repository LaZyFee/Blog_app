import { BlogModel } from "../models/blogModel.js";
import { UserModel } from "../models/userModel.js";
import { deleteImage } from '../utilities/deleteImage.js';


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

        // Handle blog picture path
        const blogPicPath = req.file ? req.file.path.replace(/\\/g, "/") : "";

        // Create a new blog
        const newBlog = await BlogModel.create({
            title,
            content,
            image: blogPicPath,
            createdBy: user._id,
        });

        // Update the user's author array with the new blog ID
        user.author.push(newBlog._id);
        await user.save();

        // Send success response
        res.status(201).json({
            status: "success",
            message: "Blog created successfully",
            data: newBlog
        });
    } catch (error) {
        // Handle errors
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
        const existingBlog = await BlogModel.findById(req.params.id);
        if (!existingBlog) {
            return res.status(404).json({ status: "Failed", message: "No data found with this id" });
        }

        const updateFields = {};

        if (req.body.title) updateFields.title = req.body.title;
        if (req.body.content) updateFields.content = req.body.content;

        if (req.body.removeImage === "true") {
            deleteImage(existingBlog.image);
            updateFields.image = null;
        }

        if (req.file && req.body.removeImage !== "true") {
            deleteImage(existingBlog.image);
            updateFields.image = req.file.path.replace(/\\/g, "/");
        }

        const updatedBlog = await BlogModel.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(400).json({ status: "Failed", message: error.toString() });
    }
};


export const DeleteBlog = async (req, res) => {
    try {
        const blog = await BlogModel.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        deleteImage(blog.image);
        await BlogModel.findByIdAndDelete(req.params.id);
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

