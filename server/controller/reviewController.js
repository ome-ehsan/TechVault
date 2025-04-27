import { Review } from "../model/reviewModel.js";

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { productId, user, rating, comment } = req.body;

    if (!productId || !user || !rating) {
      return res.status(400).json({ message: "Product ID, user, and rating are required." });
    }

    const newReview = new Review({
      product: productId,
      user,
      rating,
      comment,
    });

    await newReview.save();

    res.status(201).json({ message: "Review added successfully!" });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get reviews for a specific product
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a review (Admin or user)
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    await Review.findByIdAndDelete(id);

    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};
