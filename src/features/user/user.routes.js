import express from 'express'
import UserController from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';
const userRouter = express.Router();
const userControl = new UserController();

// userRouter.post('/signup',userControl.signUp);
userRouter.post('/signup',(req,res,next)=>{
    userControl.signUp(req,res,next);
})
// userRouter.post('/signin',userControl.signIn);
userRouter.post('/signin',(req,res)=>{
    userControl.signIn(req,res);
})
userRouter.put('/resetPswd',jwtAuth,(req,res,next)=>{
    userControl.resetPassword(req,res,next);
})
export default userRouter;