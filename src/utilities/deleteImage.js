import { v2 as cloudinary } from "cloudinary";

export const deleteImage = async (imagePath) => {
    if (!imagePath) return; // Skip if no image

    try {
        // Extract the public_id from the image URL
        const publicId = imagePath.split("/").slice(-2).join("/").split(".")[0];

        // Use Cloudinary API to delete the image
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== "ok") {
            console.error(`Failed to delete image: ${imagePath}`);
        }
    } catch (error) {
        console.error("Error deleting image:", error);
    }
};



// import fs from 'fs';

// export const deleteImage = (imagePath) => {
//     if (imagePath) {
//         fs.unlink(imagePath, (err) => {
//             if (err) console.error("Error deleting image:", err);
//         });
//     }
// };
