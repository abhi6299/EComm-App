import { CartModel } from "./cart.model.js";
import CartRepository from "./cart.repository.js";

export default class CartController{
    constructor(){
        this.cartrepository = new CartRepository();
    }
    async add(req,res){
        try{
            const {productID,quantity} = req.body;
            const userID = req.userID;
            const cartItem = new CartModel(productID,userID,quantity);
            const updatedCart=await this.cartrepository.add(cartItem);
            res.status(201).send('cart is updated');
        }catch(err){
            console.log(err);
            return res.status(400).send("Something went wrong in adding a Cart in controller");
        }
    }
    async get(req,res){
        try{
            const userID = req.userID;
            const items = await this.cartrepository.get(userID);
            res.status(200).send(items);
        }catch(err){
            console.log(err);
            return res.status(400).send("Something went wrong in getting a Cart in controller");
        }
        
    }
    async delete(req,res){
        try{
            const userID = req.userID;
            const cartID = req.params.id;
            const isDeleted = await this.cartrepository.delete(cartID,userID);
            if(!isDeleted){
                return res.status(400).send('No item found to delete');
            }
            return res.status(200).send('Cart iten delete')
        }catch(err){
            console.log(err);
            return res.status(400).send("Something went wrong in deleting a Cart in controller");
        }
        

    }
}