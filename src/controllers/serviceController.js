import { ServiceModel } from '../models/serviceModel.js'
import { deleteImage } from '../utilities/deleteImage.js';
import { uploadToCloudinary } from "../config/cloudinary.js";

export const CreateService = async (req, res) => {
    try {
        const { title, description, price } = req.body
        if (!title || !description || !price) {
            res.status(400).json({ mesage: "All fields are required" })
            return;
        }
        let imageUrl = "";
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer, "blog_app_service_pics");
        }


        const service = await ServiceModel.create({
            title,
            description,
            price,
            image: imageUrl
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

        const updateFields = {};

        if (req.body.title) updateFields.title = req.body.title;
        if (req.body.price) updateFields.price = req.body.price;
        if (req.body.description) updateFields.description = req.body.description;

        // Handle image removal
        if (req.body.removeImage === "true" && existingService.image) {
            await deleteImage(existingService.image);
            updateFields.image = null;
        }

        // Handle new image upload
        if (req.file) {
            if (existingService.image) {
                await deleteImage(existingService.image); // Delete previous image
            }
            updateFields.image = req.file.path; // Store new image path
        }

        const updatedService = await ServiceModel.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true }
        );

        res.status(200).json({ message: "Service updated successfully", updatedService });
    } catch (error) {
        res.status(400).json({ status: "failed to update", message: error.toString() });
    }
};

export const RemoveService = async (req, res) => {
    try {
        const service = await ServiceModel.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        // Delete image if it exists
        if (service.image) {
            await deleteImage(service.image);
        }

        // Delete service from DB
        await ServiceModel.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Service deleted successfully", service });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const GetAllServices = async (req, res) => {
    try {
        const services = await ServiceModel.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
