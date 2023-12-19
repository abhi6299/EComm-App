import express from 'express'
import productController from './product.controller.js';
import {upload} from '../../middlewares/file-upload.middleware.js';
//initialize express router
const productRouter = express.Router();
const productControl = new productController();
//All the paths to controller product req will be provided below
//localhost:3300/api/product - itna already complete kar chuki h req from server.js file
productRouter.get('/',(req,res)=>{
    productControl.getAllProducts(req,res);
});
productRouter.post('/',upload.single('imageUrl'),(req,res)=>{
    productControl.addProduct(req,res);
});
productRouter.post('/rate',(req,res,next)=>{
    productControl.rateProduct(req,res,next);
});
//localhost:3300/api/product/filter?minPrice=10&maxPrice=20&category=Category1
productRouter.get('/filter',(req,res)=>{
    productControl.filterProducts(req,res);
}); // 'Specific route h' so placed 
    //above /:id route else below /:id route, id will consider /filter?minPrice=10 as id and 
    //will try to get executed

productRouter.get('/avgPrice',(req,res,next)=>{
    productControl.averagePrice(req,res);
})

//localhost:3300/api/product/2
productRouter.get('/:id',(req,res)=>{
    productControl.getOneProduct(req,res);
});// THis is more 'General Route' hence
    //placed at the last



export default productRouter; 