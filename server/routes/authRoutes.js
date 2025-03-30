import express from 'express';
import { register } from '../controller/authController.js';

export const authRouter = express.Router();


authRouter.post("/register",register);