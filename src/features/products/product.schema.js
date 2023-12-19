import mongoose, { mongo } from "mongoose";

export const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    description: String,
    inStock: Number,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'reviews'
        }
    ],
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'category'
        }
    ] 
})