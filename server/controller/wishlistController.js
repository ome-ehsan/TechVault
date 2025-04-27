import { Product } from "../model/productModel.js";
import { User } from "../model/userModel.js";

export const addToWishlistController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ msg: "Product ID is required." });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: "Product not found." });
    }

    const alreadyInterested = product.interestedUser.some(
      (entry) => entry.user.toString() === userId.toString()
    );

    if (alreadyInterested) {
      return res.status(400).json({ msg: "Product is already in your wishlist." });
    }

    product.interestedUser.push({ user: userId });
    await product.save();

    return res.status(200).json({ msg: "Product added to wishlist successfully." });
  } catch (error) {
    console.error("Add to Wishlist Error:", error);
    res.status(500).json({ msg: "Server error while adding to wishlist." });
  }
};

export const removeFromWishlistController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: "Product not found." });
    }

    product.interestedUser = product.interestedUser.filter(
      (entry) => entry.user.toString() !== userId.toString()
    );

    await product.save();

    return res.status(200).json({ msg: "Product removed from wishlist successfully." });
  } catch (error) {
    console.error("Remove from Wishlist Error:", error);
    res.status(500).json({ msg: "Server error while removing from wishlist." });
  }
};

export const getWishlistController = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlist = await Product.find({ 
      "interestedUser.user": userId 
    }).select("name price img category");

    return res.status(200).json({ wishlist });
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ msg: "Server error while fetching wishlist." });
  }
};
