import express from "express"
import { Register, Login, LogoutUser } from '../controllers/userController.js'
import { uploadSingle } from "../config/multer.js";

const router = express.Router()

router.post("/register", uploadSingle, Register);
router.post("/login", Login);
router.post("/logout", LogoutUser);


export default router;