import { Router } from "express";
import { getCurrentUserController } from "../controllers/user.controller";
import isAuthenticated from "../middlewares/isAuthenticated.middleware";

const userRoutes = Router();

// This route needs authentication middleware to access req.user
userRoutes.get("/current", isAuthenticated, getCurrentUserController);

// Add other user routes here with authentication if needed
// userRoutes.put("/profile", isAuthenticated, updateProfileController);

export default userRoutes;
