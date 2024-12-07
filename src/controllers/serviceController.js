import { ServiceModel } from '../models/serviceModel.js'
import { deleteImage } from '../utilities/deleteImage.js';
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

        const updateFields = {};

        if (req.body.title) updateFields.title = req.body.title;
        if (req.body.price) updateFields.price = req.body.price;
        if (req.body.description) updateFields.description = req.body.description;

        if (req.body.removeImage === "true") {
            deleteImage(existingService.image);
            updateFields.image = null;
        }

        if (req.file && req.body.removeImage !== "true") {
            deleteImage(existingService.image);
            updateFields.image = req.file.path.replace(/\\/g, "/");
        }

        const updatedService = await ServiceModel.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true }
        );

        res.status(200).json(updatedService);
    } catch (error) {
        res.status(400).json({ status: "failed to update", message: error.toString() });
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

export const RemoveService = async (req, res) => {
    try {
        const service = await ServiceModel.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        deleteImage(service.image);
        res.status(200).json({ message: "Service deleted successfully", service });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};