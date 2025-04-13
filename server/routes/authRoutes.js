import express from 'express';
import { register, login, logout, getUserProfile} from '../controller/authController.js';
import { authenticate , authorizeAdmin} from '../middleware/authMiddleware.js';
import { updateProfile } from '../controller/customerController.js';

export const authRouter = express.Router();

authRouter.post("/register",authorizeAdmin, register);
authRouter.post("/logout",logout);
authRouter.post("/login", login);
authRouter.get("/check", authenticate, getUserProfile); // might need update 

/////////IMTIAJ////////////
authRouter.put("/profile/update", authenticate, updateProfile);