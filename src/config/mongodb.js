import { MongoClient, ObjectId } from "mongodb";

const url = process.env.DB_URL;
console.log(url);
let client;
//Below function will be called in server.js for starting the db as soon as server starts
export const connectToMongoDB = () => {
    const promise = MongoClient.connect(url)
    promise.then(x => { //x = Client-Instance from mongoDB once connection is established
        client = x;
        console.log('MongoDb connected');
        createCounter(client.db());
        createIndexes(client.db());
    }).catch(err=>{
        console.log(err);
    })

}
//Or via async - await ->
// const connectToMongoDB = async () => {
//     try{
//         await MongoClient.connect(url)
//         console.log('MongoDb connected');
//     }catch(err){
//         console.log(err);
//     }
// }

export const getClient = () => {
    return client;
}

//Below function will be called whenever we want to make any operations on mongoDB
export const getDB = () => {
    return client.db("ecommdb") ;
    // If we don't specify name of DB in url then client.db(db_name)
}

const createCounter = async(db) => {
    const existingCounter = await db.collection("counters").findOne({_id:'cartID'});
    if(!existingCounter){
        await db.collection("counters").insertOne({_id:'cartID',value:0});
    }
}

const createIndexes = async(db) => {
    try{
        // creating single-filed index for price attr. of product in ascending order
        await db.collection('products').createIndex({price:1}); // If index already present it will ignore it and not re-create same index
        //Compound Index
        await db.collection("products").createIndex({name:1, category:-1});
        //Text based index
        await db.collection('products').createIndex({desc:'text'});
    }catch(err){
        console.log(err);
    }
    console.log("Indexes are created");
}