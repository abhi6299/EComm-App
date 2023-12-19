import mongoose, { mongo } from "mongoose";

export const userSchema = new mongoose.Schema({
    name: {type:String, maxLength:[25,"Name can't be greater than 25 character"]},
    email: {type: String, unique: true, required:true,
        match: [/.+\@.+\../,"Please enter a valid email"]   },
    // password: {type: String, validate:{
    //         validator: function(value){
    //             return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value)
    //         }, message: "Password should contain 8-12 character and have a special character" 
    //     }
    // },
    //commented as ye validating jab data db me jane vala hoga tab lagega and it will check for the hashed pswd which will fail the validation
    password: String,
    type: {type: String, enum: ['customer', 'seller']}
})