import { UserModel } from "./user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserRepository from "./user.repository.js";

export default class UserController{4

    constructor () {
        this.userRepository = new UserRepository();
    }

    async signUp(req,res,next){
        const {name,email,password,type}=req.body;
        //Hashing the password
        const hashedpswd = await bcrypt.hash(password,12)
        // const user = await UserModel.signUp(name,email,password,type); //await as now signup is going to be asyncrnous operation
        //since now we are using repository so
        const user = new UserModel(name,email,hashedpswd,type);
        try{
            const newUser = await this.userRepository.signUp(user); // as signup return promise from insertOne f being used
            res.status(201).send(newUser);
        }catch(err){
            // console.log(err);
                // res.status(404).send("Erro ocuured while adding New User (in controller)");
            next(err);    
        }
    }
    async signIn(req,res,next){
        try{
            //Find user by email
            const user = await this.userRepository.findByEmail(req.body.email);
            if(!user){
                return res.status(400).send('Invalid credentils'); // 400 bad request 
            }else{
                //2. Compare pswd with hashed pswd
                const result = await bcrypt.compare(req.body.password,user.password) // returns promise of boolean
                if(result){
                    //When using JWT authentication 
                    //3. Create token
                    const token= jwt.sign({userID:user._id,email:user.email},process.env.JWT_SECRET,{
                        expiresIn: '1h',
                    })
                    //4. send token to the client
                    return res.status(200).send(token);
                }else{
                    return res.status(400).send('Invalid credentils'); // 400 bad request 
                }
            }
            // const {email,password}= req.body;
            // // const user = UserModel.signIn(email,password);
            // const user = await this.userRepository.signIn(email,password);
            // if(!user){
            //     return res.status(400).send('Invalid credentils'); // 400 bad request
            // }
            // //When using JWT authentication 
            // //1. Create token
            // const token= jwt.sign({userID:user.id,email:user.email},'U2oxseR9YUbXc7JchRtObLh36mATbCaS',{
            //     expiresIn: '1h',
            // })
            // //2. send token to the client
            // return res.status(200).send(token);
            // res.status(200).send('Login Successful');
        }catch(err){
            console.log(err);
            //since we can't trust application level middleware for error so NO next(err)
            // next(err);
            return res.status(400).send('Something went wrong in signIn');
        }
    }

    async resetPassword(req,res,next){
        const userID= req.userID;
        const {newPswd} = req.body;
        const hashedpswd = await bcrypt.hash(newPswd,12);
        try{
            await this.userRepository.resetPassword(userID,hashedpswd);
            res.status(200).send("Password reset successful");
        }catch(Err){
            console.log(Err);
            console.log("Passsing error to middleware");
            next(Err);
        }
    }
}