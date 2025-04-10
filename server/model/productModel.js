import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    warranty: { type: Number, default: 0 },
    img: String,
    category: { 
        type: String, 
        required: true, 
        enum: ['RAM', 'GPU', 'CPU', 'LAPTOP', 'PSU', 'MONITOR', 'COOLER', 'MOTHERBOARD'] 
    },
    ratings: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        score: { type: Number, min: 1, max: 5 },
        comment: String,
        date: { type: Date, default: Date.now }
    }],
    specification: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    interestedUser: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        notified: { type: Boolean, default: false }
    }],
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
