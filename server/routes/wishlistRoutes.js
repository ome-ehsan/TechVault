import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { addToWishlistController, removeFromWishlistController, getWishlistController } from "../controller/wishlistController.js";


export const wishlistRouter = express.Router();

wishlistRouter.post("/add/:productId", authenticate, addToWishlistController);
wishlistRouter.delete("/remove/:productId", authenticate, removeFromWishlistController);
wishlistRouter.get("/get", authenticate, getWishlistController);
 
