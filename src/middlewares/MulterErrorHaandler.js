import multer from "multer";

// Middleware to handle Multer errors
export const multerErrorHandler = (uploadMiddleware) => (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Handle Multer-specific errors
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ message: "File size should be less than 5MB." });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // Handle other errors
            return res.status(500).json({ message: err.message });
        }
        next();
    });
};