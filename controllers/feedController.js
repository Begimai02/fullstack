const {Post, Follower, Like, User, Comment} = require('../models/models');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const userController = require('./userController');

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
    
    async delete_post(req, res) {
        const {id} = req.params
        const post = await Post.destroy({where: {id}})
        return res.json({status: 200})

    }

    async getOne(req, res){
        const {id} = req.params
        console.log(id)
        const post = await Post.findOne({where: {id}, include: [Like, Comment]})
        return res.json(post)
    }

    async get_feed(req, res) {
        let following = await Follower.findAll({where:{follower_user: req.user.user_name}})
        let ids = []
        for (let index in following) {
            ids.push(following[index].following_user)
        }
        console.log(following)
        const feed = await Post.findAll({
            where:{user_id: ids},
            include: [Like, Comment]
        })
        return res.json(feed)
    }

    async add_like(req, res) {
        const {id} = req.params
        const post = await Post.findOne({where:{id}})
        const like = await Like.create({user_id: req.user.user_name, post_id: post.id, postId: post.id})
        return res.json(like)
    }

    async delete_like(req, res) {
        const {id} = req.params
        const like = await Like.destroy({where:{user_id: req.user.user_name, post_id: id}})
        return res.json({status: 200})
    }

    async add_comment(req, res) {
        const {id} = req.params
        const comment = await Comment.create({user_id: req.user.user_name, post_id: post.id, postId: id})
        return res.json(like)
    }

    async delete_comment(req, res) {
        const {id} = req.params
        const comment = await Comment.destroy({where:{user_id: req.user.user_name, post_id: id}})
        return res.json({status: 200})
    }


    
}

module.exports = new FeedController()