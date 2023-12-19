//Import
import express from 'express'
import CartController from './cart.controller.js';

//initialize express router
const cartRouter = express.Router();
const cartControl = new CartController();

cartRouter.post('/',(req,res)=>{
    cartControl.add(req,res)});
cartRouter.get('/',(req,res)=>{
    cartControl.get(req,res)});
cartRouter.delete('/:id',(req,res)=>{
    cartControl.delete(req,res)});

export default cartRouter; 