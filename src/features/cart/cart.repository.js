import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";

class CartRepository {
  constructor() {
    this.collectionName = "cart"; // name of the collection in mongodb
  }

  // Create a new expense
  async add(cartItem) {
    try{
      const db = getDB();
      const collection = db.collection(this.collectionName);
    //   Do below if you want sequantial id instead of 12 byte mongoDb generated one
      const id = await this.getNextCounter(db);
    //await collection.insertOne(cartItem);
      //Quantity should be updated not repearted
      //Find if there exist quantity for a product -> then either update if it exist or create one if it does not exist
      await collection.updateOne(
        {productID:new ObjectId(cartItem.productID), userID:cartItem.userID},
        {$setOnInsert: {_id:id}, $inc: {quantity: +cartItem.quantity}}, //setOnInsert is for inserting our custom made sequantial id
        {upsert:true} //upsert ensure if not present then insert instead of replacing
        );
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong while adding data in cart",500);
    }
  }

  // Get one expnese by its ID
  async get(userID) {
    try{
      const db = getDB();
      const collection = db.collection(this.collectionName);
      const cartItems=await collection.find({userID}).toArray();
      return cartItems;
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong while getting data from cart",500);
    }
  }

  async delete(cartID,userID){
    try{
        const db = getDB();
        const collection = db.collection(this.collectionName);
        const result = await collection.deleteOne({_id: new ObjectId(cartID),userID}); // result ia a obj which will store the no. of deleted items
        return result.deletedCount>0; // if any item deleted count will be >0 and will return true
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong while delete data in cart",500);
    }
  }

  async getNextCounter(db){
    const returnedDoc = await db.collection("counters").findOneAndUpdate({_id:'cartID'},{
        $inc:{value:1}},{returnDocument:'after'});
    console.log(returnedDoc.value);
    return returnedDoc.value;
  }

}

export default CartRepository;
