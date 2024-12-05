import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
},
    { timestamps: true }
);

export const ServiceModel = mongoose.model('Service', ServiceSchema);