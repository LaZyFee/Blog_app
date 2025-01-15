import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utilities/cloudinary.js";

// Common file filter for image uploads
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only images are allowed"));
    }
};

// Cloudinary storage for profile pictures
const profilePicStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "profile-pics", // Folder name in Cloudinary
        allowed_formats: ["jpeg", "jpg", "png"],
        transformation: [
            { width: 500, height: 500, crop: "limit", quality: "auto" },
        ],
        public_id: (req, file) => `profile_${Date.now()}_${file.originalname}`, // Optional custom public ID
    },
});

// Cloudinary storage for blog pictures
const blogPicStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "blog-pics",
        allowed_formats: ["jpeg", "jpg", "png"],
        public_id: (req, file) => `blog_${Date.now()}_${file.originalname}`,
    },
});

// Cloudinary storage for service pictures
const servicePicStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "service-pics",
        allowed_formats: ["jpeg", "jpg", "png"],
        public_id: (req, file) => `service_${Date.now()}_${file.originalname}`,
    },
});
// Cloudinary storage for team member pictures
const teamMemberPicStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "team-member-pics",
        allowed_formats: ["jpeg", "jpg", "png"],
        transformation: [
            { width: 500, height: 500, crop: "limit", quality: "auto" },
        ],
        public_id: (req, file) => `team_member_${Date.now()}_${file.originalname}`,
    },
});

// Multer upload middleware
export const uploadProfilePic = multer({
    storage: profilePicStorage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

export const uploadBlogPic = multer({
    storage: blogPicStorage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

export const uploadServicePic = multer({
    storage: servicePicStorage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

export const uploadTeamMemberPic = multer({
    storage: teamMemberPicStorage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});