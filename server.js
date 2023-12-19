import express from 'express'
import './env.js';
import productRouter from './src/features/products/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
import cartRouter from './src/features/cart/cart.route.js';
import expenseRouter from "./src/features/expense/expense.routes.js";
import orderRouter from './src/features/order/order.route.js';
import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import bodyParser from 'body-parser';
//-------------
import swagger from 'swagger-ui-express';
import  apiDocs from './swagger.json' assert {type:'json'};
import  apidocs from './swagger3.0.json' assert {type:'json'};
import cors from 'cors';
import logsMiddleware from './src/middlewares/logger.middleware.js';
import { log } from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './error-handler/applicationError.js';
import {connectToMongoDB} from './src/config/mongodb.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import mongoose from 'mongoose';
import likeRouter from './src/features/like/like.router.js';
const server = express(); // Instantiating exporess to create a server



//CORS policy configuration for client ot access our APIs
// server.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','http://localhost:5500');
//     res.header('Access-Control-Allow-Headers','*');
//     res.header('Access-Control-Allow-Method','*');
//     // return ok for preflight request
//     if(req.method == 'OPTIONS'){
//         return res.sendStatus(200);
//     }
//     next();
// })

//using pkg to configure cors policy
var corsOption = {
    origin: 'http://localhost:5500',
    allowedHeaders:'*'
}
server.use(cors(corsOption));

server.use(bodyParser.json());

//UI using swagger 2.0 specifications
server.use('/apiDocs',swagger.serve,swagger.setup(apiDocs)); // serve generate UI
//UI using swagger 3.0.0 specifications
server.use('/apidocs',swagger.serve,swagger.setup(apidocs)); // serve generate UI

//Applying logger at application level
server.use(logsMiddleware)

//for all request related to product, redirecct to product routes
//localhost:3300/api/product become root for product api now
// server.use("/api/product",basicAuthorizer, productRouter);//When authenticating via basic auth
server.use("/api/product",logsMiddleware,jwtAuth, productRouter);//When authenticating via JWT auth
server.use("/api/user",userRouter);
server.use("/api/cart",logsMiddleware,jwtAuth,cartRouter);
server.use("/api/expenses", expenseRouter);
server.use("/api/order",jwtAuth,orderRouter);
server.use("/api/likes",jwtAuth,likeRouter);

server.get('/',(req,res)=>{ // Default req handler
    res.send('All OK');
})

//Middleware to handle all invalid path req. (404 req)
server.use((req,res)=>{
    res.status(404).send('API not found. Please check our documentation for more information at localhost:3300/apidocs or localhost:3300/apiDocs')
})

//Error handling middleware at application level
server.use((err,req,res,next)=>{
    console.log(err);
        // For handling user-defined errors
    log("Errrrr"+err); // also logging the errors
    if(err instanceof mongoose.Error.ValidationError){
        return res.status(500).send(err.message);
    }
    if(err instanceof ApplicationError){
        // console.log(err.code, err.message);
        return res.status(err.code).send(err.message);
    }
        // For handling server errors
    res.status(500).send("Something went wrongg !");
})

server.listen(3200,()=>{
    console.log('Server listening on port 3200!');
    // connectToMongoDB();
    connectUsingMongoose();
})