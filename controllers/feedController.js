const {Post} = require('../models/models');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');

class FeedController {
    async create(req, res, next){
        try{
            const {description} = req.body
            const {image} = req.files
            let fileName = uuid.v4() + ".jpg"
            image.mv(path.resolve(__dirname, '..', 'static', fileName))
            const instaPost = await Post.create({user_id: req.user.user_name, image: fileName, description})
            return res.json(instaPost)
        } catch(e){
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res){
        const posts = await Post.findAll({where:{user_id: req.user.user_name}})
        return res.json(posts)
    }

    async getOne(req, res){
        const {id} = req.params
        console.log(id)
        const post = await Post.findOne({where: {id}})
        return res.json(post)
    }
}

module.exports = new FeedController()