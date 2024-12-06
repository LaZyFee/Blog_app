import express from "express";
import { uploadTeamMemberPic } from "../utilities/multer.js";
import {
    CreateTeam,
    UpdateTeam,
    RemoveOne,
    GetAllTeamMembers,
} from "../controllers/TeamController.js";

const router = express.Router();

router.post("/team", uploadTeamMemberPic.single("image"), CreateTeam);
router.put("/team/:id", uploadTeamMemberPic.single("image"), UpdateTeam);
router.delete("/team/:id", RemoveOne);
router.get("/team", GetAllTeamMembers);

export default router;
