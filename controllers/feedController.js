const {Post, Follower, Like, User, Comment} = require('../models/models');
const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const userController = require('./userController');

class FeedController {
    async create_post(req, res, next) {
        try {
            const {description} = req.body
            const {image} = req.files
            let fileName = uuid.v4() + ".jpg"
            await image.mv(path.resolve(__dirname, '..', 'static', fileName))
            const instaPost = await Post.create({userUserName: req.user.user_name, image: fileName, description})
            return res.json(instaPost)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update_post(req, res, next) {
        const {id} = req.params
        const {description} = req.body
        const post = Post.findOne({where: {id}})
        if (post) {
            post.description = description
            await post.save()
            return res.json(post)
        } else {
            next(ApiError.badRequest('Пост не найден'))
        }

    }

    async delete_post(req, res, next) {
        try {
            const {id} = req.params
            await Post.destroy({where: {id}})
            return res.json({status: 200})
        } catch (e) {
            return next(ApiError.badRequest('Пост не найден'))
        }
    }

    async get_post(req, res) {
        const {id} = req.params
        console.log(id)
        const post = await Post.findOne({where: {id}, include: [Like, Comment]})
        return res.json(post)
    }

    async get_posts(req, res) { // id поста
        let following = await Follower.findAll({where: {follower_user: req.user.user_name}})
        let user_names = []
        for (let index in following) {
            user_names.push(following[index].following_user)
        }
        const feed = await Post.findAll({
            where: {userUserName: user_names},
            include: [Like, Comment]
        })
        return res.json(feed)
    }

    async add_like(req, res) { // id поста
        const {id} = req.params
        let valid = await Like.findOne({userUserName: req.user.user_name, postId: id})
        console.log(valid)
        if (valid) {
            return res.json({status: "Уже залайкано"})
        }
        const like = await Like.create({userUserName: req.user.user_name, postId: id})
        return res.json(like)
    }

    async delete_like(req, res) { // id поста
        const {id} = req.params
        await Like.destroy({where: {userUserName: req.user.user_name, postId: id}})
        return res.json({status: 200})
    }

    async add_comment(req, res) { // id поста
        const {id} = req.params
        const {body} = req.body
        const comment = await Comment.create({userUserName: req.user.user_name, postId: id, body: body})
        return res.json(comment)
    }

    async delete_comment(req, res) { // id коммента
        const {id} = req.params
        await Comment.destroy({where: {userUserName: req.user.user_name, id: id}})
        return res.json({status: 200})
    }
}

module.exports = new FeedController()