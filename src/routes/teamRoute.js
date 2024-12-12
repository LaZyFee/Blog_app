import express from "express";
import { uploadTeamMemberPic } from "../utilities/multer.js";
import AuthMiddleware from '../middlewares/AuthMiddleware.js'
import {
    CreateTeam,
    UpdateTeam,
    RemoveOne,
    GetAllTeamMembers,
    GetUserProfileWithTeam
} from "../controllers/TeamController.js";

const router = express.Router();

router.post("/create-team", AuthMiddleware, uploadTeamMemberPic.single("image"), CreateTeam);
router.put("/team/:id", AuthMiddleware, uploadTeamMemberPic.single("image"), UpdateTeam);
router.delete("/team/:id", AuthMiddleware, RemoveOne);
router.get("/team", AuthMiddleware, GetAllTeamMembers);
router.get("/profile/:userId", GetUserProfileWithTeam);
export default router;
