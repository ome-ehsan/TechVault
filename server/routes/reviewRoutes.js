import express from "express";
import { createReview, getReviewsByProduct, deleteReview } from "../controller/reviewController.js";

export const reviewRouter = express.Router();

// POST a new review
reviewRouter.post("/", createReview);

// GET all reviews for a product
reviewRouter.get("/:productId", getReviewsByProduct);

// DELETE a review (admin or user)
reviewRouter.delete("/:id", deleteReview);
