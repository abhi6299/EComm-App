import { userSchema } from "./user.schema.js";
import mongoose from "mongoose";
//Creating model(~collection) from schema
const UserModel = mongoose.model("users",userSchema); // user or users no problem

export default class UserRepository{

    async resetPassword(userID,newPswd){
        try{
            let user = await UserModel.findById(userID);
            if(user){
                user.password = newPswd;
                //Updating the document as well in the db
                user.save();
                //OR use updateOne on UserModel directly
            }else{
                return "No such user found";
            }
        }catch(err){
            // throw new ApplicationError("Something went wrong in signup",500);
            console.log(err);
        }
    }

    async signUp(user){
        try{
            //create instance of model - a constructor using which we get instance(~document)
            const newUser = new UserModel(user);
            //save the document
            await newUser.save(); // OR UserModel.create(user);
            return newUser;
        }catch(err){
            console.log(err);
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }
            else{
                throw new ApplicationError("Something went wrong in signup database",500);
            }
        }
    }

    async signIn(email,password){
        try{
            return await UserModel.findOne({email,password});
        }catch(err){
            // throw new ApplicationError("Something went wrong in signup",500);
            console.log(err);            
        }
    }
    async findByEmail(email){
        try{
            return await UserModel.findOne({email});
        }catch(err){
            // throw new ApplicationError("Something went wrong in signup",500);
            console.log(err);
        }
    }
}