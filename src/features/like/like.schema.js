import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
    user:{type:String, ref:"users"},
    //Stroes the object id of the object we have liked, can be product or cateogry
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        //'on_model' will be separate attr which specify 'which type' of object can appear in likable
        refPath:'on_model'
    },
    on_model:{
        type:String,
        enum:['products','categories']
    }
}).pre('save',(next)=>{ // DOcument middleware
    console.log('New Like coming in');
    next();
}).post('save', (doc)=>{
    console.log('Like is saved');
    console.log(doc);
}).pre('find',(next)=>{
    console.log('Retrieving likes');
    next();
}).post('find',(docs)=>{ //Query middleware
    console.log('Found the Liked object');
    console.log(docs);
})