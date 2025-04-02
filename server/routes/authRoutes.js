import express from 'express';
import { register, login, logout, getUserProfile, updateProfile } from '../controller/authController.js';
import { authenticate , authorizeAdmin} from '../middleware/authMiddleware.js';

export const authRouter = express.Router();

authRouter.post("/register",authorizeAdmin, register);
authRouter.post("/logout",logout);
authRouter.post("/login", login);
authRouter.get("/profile", authenticate, getUserProfile);
authRouter.put("/profile/update", authenticate, updateProfile);
authRouter.get("/check", authenticate, getUserProfile); // might need update 