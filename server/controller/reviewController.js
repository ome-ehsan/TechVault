

// Create a new review
import { Review } from "../model/reviewModel.js";

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { productId, userId, score, comment } = req.body;

    if (!productId || !userId || !score) {
      return res.status(400).json({ message: "Product ID, User ID, and Score are required." });
    }

    const newReview = new Review({ productId, userId, score, comment });
    const savedReview = await newReview.save();

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: "Failed to create review", error: error.message });
  }
};

// Get all reviews (optionally filter by productId)
export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const filter = productId ? { productId } : {};
    const reviews = await Review.find(filter)
      .populate('userId', 'name email')  // adjust as per your User schema
      .populate('productId', 'name');    // adjust as per your Product schema

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to get reviews", error: error.message });
  }
};

// Update a review (only by user who posted it, you may adjust this logic)
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, comment } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { score, comment },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Failed to update review", error: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review", error: error.message });
  }
};
