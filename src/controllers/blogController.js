import { BlogModel } from "../models/blogModel.js";
import { UserModel } from "../models/userModel.js";
import fs from "fs";

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
        const existingBlog = await BlogModel.findById(req.params.id)
        if (!existingBlog) {
            return res.status(400).json({
                status: "Failed",
                message: "No data found with this id"
            })
        }
        // Create an object to hold the update fields
        const updateFields = {};

        // Check if each field is provided and add it to the updateFields object
        if (req.body.title) {
            updateFields.title = req.body.title;
        }
        if (req.body.content) {
            updateFields.content = req.body.content;
        }

        // Handle image removal if the removeImage flag is set
        if (req.body.removeImage === "true") {
            // Check if the service has an existing image
            const oldImagePath = existingService.image;
            if (oldImagePath) {
                // Delete the old image file
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("Failed to delete old image:", err);
                    }
                });
                // Set the image field to null
                updateFields.image = null;
            }
        }

        // Store new image path if a new image is uploaded and removeImage is false
        if (req.file && req.body.removeImage !== "true") {
            // Delete the old image file if it exists and if not already removed
            const oldImagePath = existingService.image;
            if (oldImagePath) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error("Failed to delete old image:", err);
                    }
                });
            }

            // Add the new image path to the update fields
            updateFields.image = req.file.path.replace(/\\/g, "/");
        }

        // Update the service with the provided fields
        const updatedBlog = await BlogModel.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true }
        );

        res.status(200).json(updatedBlog);

    } catch (error) {
        return res.status(400).json({
            status: "Failed",
            message: error.toString()
        })
    }
}


export const DeleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;

        // Find the blog to get the image path and creator's user ID
        const blog = await BlogModel.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const userId = blog.createdBy;
        const imagePath = blog.image;

        // Remove the image file from the server if it exists
        if (imagePath) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error deleting image file:", err);
                } else {
                    console.log("Image file deleted successfully.");
                }
            });
        }

        // Delete the blog
        await BlogModel.findByIdAndDelete(blogId);

        // Remove the blog ID from the user's author array
        await UserModel.findByIdAndUpdate(userId, { $pull: { author: blogId } });

        res.status(200).json({ message: "Blog and associated image deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ message: "An error occurred while deleting the blog", error: error.message });
    }
};


export const GetAllBlogs = async (req, res) => {
    try {
        const Blogs = await BlogModel.find();
        return res.status(200).json({
            status: "success",
            Blogs
        })
    } catch (error) {
        return res.status(400).json({
            status: "Failed",
            message: error.toString()
        })
    }
}