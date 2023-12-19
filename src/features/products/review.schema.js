import mongoose from "mongoose";

export const reviewSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products'
    },
    user:{
        type:String,
        ref:'users'
    },
    rating:Number
})