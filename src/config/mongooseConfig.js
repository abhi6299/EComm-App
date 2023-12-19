import mongoose from 'mongoose';
import { categorySchema } from '../features/products/category.schema.js';

const url = process.env.DB_URL+"ecommdb";
console.log(url);
export const connectUsingMongoose = async () =>{
    try{
        await mongoose.connect(url,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("Connected to mongoDB via mongoose ODM tool :)");
        defaultCategories();
    }catch(err){
        console.log("Error while connecting to mongoose DB");
        console.log(err);
    }
}

async function defaultCategories(){
    const cateogyModel = new mongoose.model('category',categorySchema);
    const categories = await cateogyModel.find();
    if(!categories || (await categories.length==0)){
        await cateogyModel.insertMany([{name:"Book"},{name:"Clothing"},{name:"Electronics"}]);
    }
    console.log('Cateogires added');
}   