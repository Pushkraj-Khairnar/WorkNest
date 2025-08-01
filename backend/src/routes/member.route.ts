import { Router } from "express";
import { joinWorkspaceController } from "../controllers/member.controller";

const memberRoutes = Router();

// Legacy invite code system - still needed for invite links
memberRoutes.post("/workspace/:inviteCode/join", joinWorkspaceController);

export default memberRoutes;
