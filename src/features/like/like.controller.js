import { LikeRepository } from "./like.repository.js";


export class LikeController{

    constructor(){
        this.likeRepository = new LikeRepository();
    }

    async likeItem(req,res){
        try{
            const {id,type} = req.body;
            if(type!='products' && type!="categories"){
                return res.status(200).send('Invalid');
            }
            if(type=='products'){
                await this.likeRepository.likeProduct(req.userID,id);
            }else{
                await this.likeRepository.likeCategory(req.userID,id);
            }
            res.status(200).send('added');
        }catch(err){
            console.log(err);
            return res.status(400).send("Something went wrong in liking the item in controller");
        }
    }

    async getLikes(req,res,next){
        try{
            const {id,type} = req.query;
            const likes = await this.likeRepository.getLikes(type,id);
            res.status(200).send(likes);
        }catch(err){
            console.log(err);
            return res.status(400).send("Something went wrong in fetching the likes in controller");
        }
    }

}