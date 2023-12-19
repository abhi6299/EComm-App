import { ApplicationError } from "../../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";

export class UserModel{
    constructor(name,email,password,type){
        this.name=name;
        this.email=email;
        this.password=password;
        this.type = type;
        // this._id=id;
    }
    //Sifted to repository for db operation separately
    // static async signUp(name, email, password, type){
    //     try{
    //         //1. Get the DB
    //         const db = getDB();
    //         //2. Get collection which we want to work on
    //         const collection = db.collection("users");
    //         const newUser = {
    //             name,
    //             email,
    //             password,
    //             type
    //         };
    //         //3. Insert the document
    //         await collection.insertOne(newUser); // returns promise thus await
    //         return newUser;
    //     }catch(err){
    //         // throw new ApplicationError("Something went wrong in signup",500);
    //         console.log(err);
    //     }
    //     //OLD code before using mongoDB
    //     // const newUser = {
    //     //     name,
    //     //     email,
    //     //     password,
    //     //     type
    //     // };
    //     // newUser.id = users.length+1;
    //     // users.push(newUser);
    //     // return newUser;
    // }
    // static signIn(e,pswd){
    //     const u = users.find(p=> p.email == e && p.password == pswd);
    //     return u;
    // }
    static getAll(){
        return users;
    }
}

let users=[
{
    id:1,
    name: 'Seller user',
    email: 'seller@gmail.com',
    password: 'pswd1',
    type: 'seller'
},
{
    id:2,
    name: 'Customer user',
    email: 'customer@gmail.com',
    password: 'pswd2',
    type: 'customer'
},
];