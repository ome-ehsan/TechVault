import express from "express";

import { getReviews,createReview,updateReview,deleteReview } from "../controller/reviewController.js";

const router = express.Router();

router.post('/', createReview);
router.get('/:productId', getReviews);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;

