import { ServiceModel } from '../models/serviceModel.js'
import fs from 'fs';

export const CreateService = async (req, res) => {
    try {
        const { title, description, price } = req.body
        if (!title || !description || !price) {
            res.status(400).json({ mesage: "All fields are required" })
            return;
        }
        const ServicePicPath = req.file ? req.file.path.replace(/\\/g, "/") : ""

        const service = await ServiceModel.create({
            title,
            description,
            price,
            image: ServicePicPath
        })
        res.status(200).json({
            status: "success",
            service: {
                id: service._id,
                title: service.title,
                description: service.description,
                image: service.image
            }
        })
    } catch (error) {
        res.status(400).json({
            message: error.toString()
        })
    }
}

export const UpdateService = async (req, res) => {
    try {
        const existingService = await ServiceModel.findById(req.params.id);
        if (!existingService) {
            return res.status(404).json({ message: "Service not found" });
        }

        // Create an object to hold the update fields
        const updateFields = {};

        // Check if each field is provided and add it to the updateFields object
        if (req.body.title) {
            updateFields.title = req.body.title;
        }
        if (req.body.price) {
            updateFields.price = req.body.price;
        }
        if (req.body.description) {
            updateFields.description = req.body.description;
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
        const updatedService = await ServiceModel.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true }
        );

        res.status(200).json(updatedService);
    } catch (error) {
        res.status(400).json({
            status: "failed to update",
            message: error.toString()
        })
    }
}
export const GetAllServices = async (req, res) => {
    try {
        const services = await ServiceModel.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const RemoveService = async (req, res) => {
    try {
        const service = await ServiceModel.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json({ message: "Service deleted successfully", service });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};