import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ObjectId } from "mongodb";

const likeModel = mongoose.model('likes',likeSchema);

export class LikeRepository{

    async getLikes(type,id){
        // console.log('inside getting');
        return await likeModel.find({
            likeable: new ObjectId(id),
            on_model: type
        }).populate('user') //populate() is like $lookup in mongoDb
        .populate({path:'likeable',model: type})// use this 'path' to populate this 'model'
    }

    async   likeProduct(userId,productId){
        try{
            const newLike = new likeModel({
                user:userId,
                likeable: new ObjectId(productId),
                on_model: 'products'
            });
            await newLike.save();
        }catch(err){
            console.log(err);
        }
    }
    async likeCategory(userId,categoryId){
        try{
            // console.log('Insedide cateogry');
            const newLike = new likeModel({
                user:userId,
                likeable: new ObjectId(categoryId),
                on_model: 'categories'
            });
            await newLike.save();
        }catch(err){
            console.log(err);
        }
    }
}