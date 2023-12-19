import { ApplicationError } from '../../../error-handler/applicationError.js';
import {UserModel} from '../user/user.model.js'
export default class ProductModel{
    constructor(name, desc, price, imageUrl, category, sizes, id){
        this.name=name;
        this.desc=desc;
        this.price=price;
        this.imageUrl=imageUrl;
        this.category=category;
        this.sizes=sizes;
        this._id=id;
    }

    static getAll(){
        return products;
    }
    static add (prodt){
        prodt.id = products.length+1; // When working with DB, it will be DBs responsibility not servers
        products.push(prodt); 
        return prodt;
    }
    static get(id){
        const product = products.find(p=> p.id==id);
        return product;
    }
    static filter(minPrice,maxPrice,category){
        const prodts= products.filter((p => {
            if((!minPrice || p.price >=  minPrice ) && (!maxPrice || p.price<=maxPrice) && (!category || p.category == category)){
                return p;
            }
        }))
        return prodts;
    }
    static rateProduct(userID, productID, rating){
        //1. Validate user and product existence
        const user = UserModel.getAll().find( u => u.id == userID);
        if(!user){
            //User-defined error
            // return 'User not found';
                //Handling errors in a better way
            throw new ApplicationError('User not found',400);
        }
        const prod = ProductModel.getAll().find(p=> p.id == productID);
        if(!prod){
            //User-defined error
            // return 'Product not found';
                //Handling errors in a better way
            throw new ApplicationError('Product not found',404);
        }
        //2. Check if there are any rating in the product and if not add ratings array
        if(!prod.ratings){
            prod.ratings=[];
            prod.ratings.push({userID:userID, "rating":rating});
        } else { // If rating is there then has this user rated ever before

            const existingRatingIndex=prod.ratings.findIndex(r=> r.userID == userID);//findIndex five -1 If not found else the index

            if(existingRatingIndex>=0)  // If user has rated before so we will just update his rating
                prod.ratings[existingRatingIndex]={userID:userID, rating:rating};
            else // If no existing rating for the user
                prod.ratings.push({userID:userID, rating:rating});
        }
    }
} 

var products = [
    new ProductModel(
      1,
      'Product 1',
      'Description for Product 1',
      19.99,
      'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
      'Category1'
    ),
    new ProductModel(
      2,
      'Product 2',
      'Description for Product 2',
      29.99,
      'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
      'Category2',
      ['M', 'XL']
    ),
    new ProductModel(
      3,
      'Product 3',
      'Description for Product 3',
      39.99,
      'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
      'Category3',
      ['M', 'XL','S']
    )];