import express from 'express';
import { register, login, logout } from '../controller/authController.js';

export const authRouter = express.Router();


authRouter.post("/register",register);
authRouter.post("/logout",logout);
authRouter.post("/login", login);