import { ObjectId } from "mongodb";
import { ApplicationError } from "../../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import mongoose from "mongoose";
import { categorySchema } from "./category.schema.js";
const productModel = mongoose.model('products',productSchema);
const reviewModel = mongoose.model('reviews',reviewSchema);
const categoryModel = mongoose.model('categories',categorySchema);

export class ProductRepository{

    constructor(){
        this.collection="products";
    }

    async add(newProduct){
        try{
            // const db = getDB();
            // const collection = db.collection(this.collection);
            // await collection.insertOne(newProduct);
            // return newProduct;
                //Using Mongoose - M2M relationship
            //1. Adding Product
            newProduct.categories = newProduct.category.split(',');
            console.log(newProduct);
            const newProd = new productModel(newProduct);
            const savedProd = await newProd.save();
            // 2. Update Categories
            await categoryModel.updateMany(
                {_id: {$in: newProduct.categories}},
                {$push: {products: new ObjectId(savedProd._id)}}
            )
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong while adding data to database",500);
        }
    }

    async getAll(){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.find().toArray(); // won't work
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong getting ALL data to database",500);
        }
    }

    async get(id){ // id is just a plain string received by postman
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            //since mongodb is expecting a ObjectId and not a plain string as id so id need to be converted
            // return collection.find({_id:new ObjectId(id)}).toArray();
                //OR
            return await collection.findOne({_id:new ObjectId(id)});
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong while getting specific data from database",500);
        }
    }

    async filter(minPrice,maxPrice,category){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            //Building filter expression to be used in find function
            let filterExpression = {};
            //Using $and operator
            if(minPrice){
                filterExpression.price =  {$gte: parseFloat(minPrice)};
            }
            if(maxPrice){
                filterExpression = {$and:[{price:{$lte:parseFloat(maxPrice)}}, filterExpression]}
            }
            if(category){
                //URL for category to make $in work: localhost:3300/api/product/filter?minPrice=240&maxPrice=600&category=['cat1','cat2']
                const categories = JSON.parse(category.replace(/'/g,'"'));
                filterExpression = {$and:[{category:{$in:categories}}, filterExpression]}
            }
            
            //without using operators

            // if(minPrice){
            //     //Filter all the products where price is >= minPrice
            //     filterExpression.price = {$gte: parseFloat(minPrice)};
            // }
            // if(maxPrice){
            //     //This stmt will override the above stmt
            //     // filterExpression.price = {$lte: parseFloat(maxPrice)};
            //     //This stmt instead of overriding, will extend the existing 
            //     filterExpression.price = {...filterExpression.price,$lte: parseFloat(maxPrice)};
            // }
            // if(category){
            //     filterExpression.category = category;
            // }
            return await collection.find(filterExpression).project({name:1,_id:0,ratings:{$slice:0}}).toArray();
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong while filter data in database",500);
        }
    }
    async rate(userID, productID, rating){
        try{
            //const db = getDB();
            //const collection = db.collection(this.collection);
                //Method 1:
                // //Find the product
                // const prod = await collection.findOne({_id:new ObjectId(productID)});
                // //Rating hai prod ki to do
                // const userRating = prod?.ratings?.find(r=> r.userID == userID); // prod?. = Is there is any prod
                // if(userRating){ 
                //     //Update the rating
                //     await collection.updateOne({
                //         _id:new ObjectId(productID), "ratings.userID": new ObjectId(userID)},{$set: {"ratings.$.Rating":rating}
                //     })   
                // }else{
                //     //create new rating
                //     await collection.updateOne({_id:new ObjectId(productID)},{$push: {ratings:{userID:new ObjectId(userID),Rating:rating}}});
                // }
            //Method 2: using $pull operator which also avoid race condition
            //Remove existing entry if any
            //await collection.updateOne({_id:new ObjectId(productID)},{$pull: {ratings: {userID:new ObjectId(userID) }}} );
            //await collection.updateOne({_id:new ObjectId(productID)},{$push: {ratings:{userID:new ObjectId(userID),Rating:rating}}});
        
            //Ading a 1 to Many relationship between product and review
            //Check if product exist
            const productToUpdate = await productModel.findById({_id:productID});
            if(!productToUpdate){
                throw new Error('Product not found');
            }
            //Find if the review already exist
            let userReview = await reviewModel.findOne({product: new mongoose.Types.ObjectId(productID),user: userID});
            if(userReview){
                userReview.rating = rating;
                await userReview.save();
            }else{
                const newReview = new reviewModel({product: new ObjectId(productID),user: userID,rating: rating});
                await newReview.save();
                //Adding reviews to product as well
                // const prod = await productModel.findById(bookId);
                // prod.reviews.push(newReview._id);
                // await prod.save();
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong while adding rating in database",500);
        }
    }

    async averageProductPricePerCategory(){
        try{
            const db = getDB();
            return await db.collection(this.collection).aggregate([
                    {
                        //Getting avg price per category
                        $group:{
                            _id:"$category",
                            averagePrice:{$avg: "$price"}
                        }
                    }
                ]).toArray();
            //Fund avg rating of a Product
             /*
                db.products.aggregate([
                    {
                        //Create separate documents for rating
                        $unwind:"$ratings"
                    },
                    {
                        //Group Rating per product and get average
                        $group:{
                            _id:"$name",
                            averageRating:{$avg:"$ratings.Rating"}
                        }
                    }
                ])
              */
             //Find no. of ratings for every product using $project instead of $group
                /*db.products.aggregate([
                    {
                        $project:{name:1, countOfRatings:{
                            $cond: {if:{$isArray:"$ratings"}, then:{$size:"$ratings"}, else:0}}}
                    }
                ])*/
             //Find the product with maximum rating count
                /*db.products.aggregate([
                    {
                        $project:{name:1, countOfRatings:{
                            $cond: {if:{$isArray:"$ratings"}, then:{$size:"$ratings"}, else:0}}}
                    },
                    {
                        $sort: {countOfRatings:-1}
                    },
                    {
                        $limit:1
                    }
                ])*/
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong while finding avg price in database",500);
        }
    }

}