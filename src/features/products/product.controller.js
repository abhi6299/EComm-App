import ProductModel from "./product.model.js";
import { ProductRepository } from "./product.repository.js";
export default class productController{
    constructor(){
        this.productRepository = new ProductRepository();
    }
    async getAllProducts(req,res){
        try{
            const prodt = await this.productRepository.getAll(); 
            //No view to be created so
            res.status(200).send(prodt);
        }catch(err){
            console.log(err);
            return res.status(400).send("Something went wrong in fetch ALL Products");
        }
    }
    async addProduct(req,res){
        try{
            const {name, price, sizes, categories} = req.body;
            const newProd = new ProductModel(name,'',parseFloat(price),req.file.filename,categories,sizes.split(','),);
            const addedProdt = await this.productRepository.add(newProd);
            res.status(201).send(addedProdt); // 201 mean resource is created
        }catch(err){
            console.log(err);
            return res.status(400).send("Something went wrong in adding a Product");
        }
    }
    async getOneProduct(req,res){
        try{
            const id = req.params.id;
            const product = await this.productRepository.get(id);
            if(!product) // id product is undefined or null
                return res.status(404).send('Product not found');
            return res.status(200).send(product);
        }catch(err){
            console.log(err);
            return res.status(400).send("Something went wrong in fetching a Product by ID");
        }
    }
    async filterProducts(req,res){
        try{
            const minPrice= req.query.minPrice;
            const maxPrice = req.query.maxPrice;
            const category = req.query.category;    
            const filteredProdt =await this.productRepository.filter(minPrice,maxPrice,category);
            res.status(200).send(filteredProdt);
        }catch(err){
            console.log(err);
            return res.status(400).send("Something went wrong in filtereing a Product in controller");
        }
    }
    async rateProduct(req,res,next){
        try{
            const userID = req.userID;
            const {productID,rating} = req.body;
                //Made intentional error to test our application-level error handler middleware
            // const {userID,productID,rating} = req.querys;
            console.log(userID,productID,rating);
                //Handling error via return keyword from model
            // const error=ProductModel.rateProduct(userID,productID,rating);
            // if(error){
            //     return res.status(400).send(error);
            // } else {
            //     return res.status(200).send("Rating has been added");
            // }
                //Handling errors in a better way
            /*try{
                ProductModel.rateProduct(userID,productID,rating);
            }catch(error){
                return res.status(400).send(error.message);
            }*/
                //Handling user-defined error via express error handler middleware
            await this.productRepository.rate(userID,productID,rating); //here error from model will be picked up by the error handler middleware
            return res.status(200).send("Rating has been added");
        }catch(err){
            console.log("Something went wrong in rateProduct controller function");
            next(err);
        }
    }
    async averagePrice(req,res,next){
        try{
            const result = await this.productRepository.averageProductPricePerCategory();
            return res.status(200).send(result);
        }catch(err){
            console.log(err);
            return res.status(400).send("Something went wrong in getting avg prices per cateogry of a Product");
        }
    }
}