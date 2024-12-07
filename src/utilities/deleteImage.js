import fs from 'fs';

export const deleteImage = (imagePath) => {
    if (imagePath) {
        fs.unlink(imagePath, (err) => {
            if (err) console.error("Error deleting image:", err);
        });
    }
};
