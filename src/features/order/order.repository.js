import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { OrderModel } from "./order.model.js";
import { ApplicationError } from "../../../error-handler/applicationError.js";

export default class OrderRepository{
    constructor(){
        this.collection = "orders"
    }
    
    //NOTE: change env DB_URL = complete string in green when we type mongosh in terminal but replica set start ke baad
    async placeOrder(userID){
        const client = getClient();
        const session = client.startSession();
        try{
            const db = getDB();
            session.startTransaction();

            //1. Get the cart item and cal total amount
            const items = await this.getTotalAmount(userID,session);
            const finaltotalAmount = items.reduce((acc,item)=>acc+item.totalAmount,0);
            console.log(finaltotalAmount);

            //2. Create the order document
            const newOrder = new OrderModel(userID,finaltotalAmount, new Date());
            await db.collection(this.collection).insertOne(newOrder,{session});

            //3. Reduce the stock
            for(let item of items){
                await db.collection("products").updateOne( 
                    {_id: item.productID}, //filter
                    {$inc: {stock: -item.quantity}},{session}
                )
            }
            //4. Clear the cart item
            await db.collection("cart").deleteMany({userID:userID},{session});
            await session.commitTransaction(); //updates the DB i.e all operation in transaction have been completed
            await session.endSession(); //ending the seesion
        }catch(err){
            await session.abortTransaction(); // ABorting the session in case of any error so that next session created should be fresh
            await session.endSession();
            console.log(err);
            throw new ApplicationError("Something went wrong while placing order in order repository DB",500);
        }
    }
    async getTotalAmount(userID,session){
        const db=getDB();
        const items = await db.collection("cart").aggregate([
            {
                //Stage1. get cart item of the user
                $match: {userID: userID}
            },{
                //Stage2. get the products from products collection based on product id on cart collection
                $lookup:{
                    from:"products", // matching with ?
                    localField:"productID",
                    foreignField:"_id", //from products collection
                    as:"productInfo" // naming the result
                }
            },{
                //Stage3. once we get nested object attached in cart collection we want to retrieve all productInfo form cart collection
                $unwind:"$productInfo"
            },{
                //Stage4. Calculate total item for each cart Item
                $addFields: {"totalAmount":{ $multiply: ["$productInfo.price","$quantity"] }} // adding totalAmount to cart collection
            }
        ],{session}).toArray();
        console.log(items);
        return items;
    }
}