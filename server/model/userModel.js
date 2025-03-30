import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    loyaltyLevel: {
      type: String,
      enum: ["bronze", "silver", "gold"],
      default: "bronze",
    },
    addresses: [
      {
        street: String,
        city: String,
        country: String,
        zipCode: String,
      },
    ],
    phone: String,
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
  },
  { timestamps: true } 
);

export const User = mongoose.model("User", userSchema);
