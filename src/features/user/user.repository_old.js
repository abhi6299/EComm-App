import { getDB } from "../../config/mongodb.js";

class UserRepository{

    constructor(){
        this.collection="users";
    }

    async signUp(newUser){
        try{
            //1. Get the DB
            const db = getDB();
            //2. Get collection which we want to work on
            const collection = db.collection(this.collection);
            // const newUser = {
            //     name,
            //     email,
            //     password,
            //     type
            // };
            //3. Insert the document
            await collection.insertOne(newUser);
            return newUser;
        }catch(err){
            // throw new ApplicationError("Something went wrong in signup",500);
            console.log(err);
        }
        //OLD code before using mongoDB
        // const newUser = {
        //     name,
        //     email,
        //     password,
        //     type
        // };
        // newUser.id = users.length+1;
        // users.push(newUser);
        // return newUser;
    }
    async findByEmail(email){
        try{
            //1. Get the DB
            const db = getDB();
            //2. Get collection which we want to work on
            const collection = db.collection(this.collection);
            //3. Insert the document
            return await collection.findOne({email});
        }catch(err){
            // throw new ApplicationError("Something went wrong in signup",500);
            console.log(err);
        }
    }
}
export default UserRepository;