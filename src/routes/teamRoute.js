import express from "express";
import AuthMiddleware from '../middlewares/AuthMiddleware.js'
import {
    CreateTeam,
    UpdateTeam,
    RemoveOne,
    GetAllTeamMembers,
    GetUserProfileWithTeam
} from "../controllers/TeamController.js";
import { uploadSingle } from "../config/multer.js";

const router = express.Router();

router.post("/create-team", AuthMiddleware, uploadSingle, CreateTeam);
router.put("/team/:id", AuthMiddleware, uploadSingle, UpdateTeam);
router.delete("/team/:id", AuthMiddleware, RemoveOne);
router.get("/:user_id/team", GetAllTeamMembers);
router.get("/profile/:userId", GetUserProfileWithTeam);
export default router;
