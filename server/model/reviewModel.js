
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