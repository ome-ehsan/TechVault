import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tranId: { type: String, default: ""},
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      prodName: { type: String, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  invoiceUrl: { type: String, default: "" },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    city: { type: String },
    district: { type: String },
    postcode: { type: String }
  },
  shippingInfo: {
    address: { type: String },
    city: { type: String },
    district: { type: String },
    postCode: { type: String },
    country: { type: String , default: "Bangladesh"}
  },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model("Order", orderSchema);

