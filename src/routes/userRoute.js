import express from "express"
import { Register, Login, LogoutUser } from '../controllers/userController.js'
import { uploadProfilePic } from "../utilities/multer.js";


const router = express.Router()

router.post("/register", uploadProfilePic.single("profilepic"), Register);
router.post("/login", Login);
router.post("/logout", LogoutUser);


export default router;