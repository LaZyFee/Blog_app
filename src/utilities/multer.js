import fs from 'fs';
import path from 'path';
import multer from 'multer';
// Storage engine for profile pictures
const profilePicStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/uploads/profile-pics/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Storage engine for blog pictures
const blogPicStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "src/uploads/blog-pics/";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
// Storage engine for service pictures
const TeamPicStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "src/uploads/team-pics/";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
// Storage engine for service pictures
const servicePicStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "src/uploads/service-pics/";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});



// File filter (common for both profile and blog images)
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only images are allowed"));
    }
};

// Upload for profile pictures
export const uploadProfilePic = multer({
    storage: profilePicStorage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: fileFilter
});

// Upload for blog pictures
export const uploadBlogPic = multer({
    storage: blogPicStorage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: fileFilter
});
// Upload for service pictures
export const uploadServicePic = multer({
    storage: servicePicStorage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: fileFilter
});
export const uploadTeamMemberPic = multer({
    storage: TeamPicStorage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: fileFilter
});