// import mongoose from "mongoose";

// const reviewSchema = new mongoose.Schema({
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   user: {
//     type: String, // You can change this to ObjectId if you have a User model
//     required: true,
//   },
//   rating: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 5,
//   },
//   comment: {
//     type: String,
//     default: "",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export const Review = mongoose.model("Review", reviewSchema);


import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    productId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    score: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        trim: true 
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); 

export const Review = mongoose.model("Review", reviewSchema);