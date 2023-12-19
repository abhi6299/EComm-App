import mongoose, { mongo } from "mongoose";

export const cartSchema = new Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"products"
    },
    userID: {
        type: String,
        ref: "users"
    },
    quantity: Number
})