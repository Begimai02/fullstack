const ApiError = require('../error/ApiError');
const {User, Follower, Post} = require('../models/models');
const uuid = require('uuid')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const {Op} = require('sequelize');

const generateJwt = (id, user_name, role) => {
    return jwt.sign(
        {id, user_name, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {

    async registration(req, res, next) {
        const {user_name, password, role} = req.body
        if (!user_name || !password) {
            return next(ApiError.badRequest('Некорректный user_name или password'))
        }
        const candidate = await User.findOne({where: {user_name}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким user_name уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({user_name, role, password: hashPassword})
        const token = generateJwt(user.id, user.user_name, user.role)
        return res.json({token})
    }

    async login(req, res, next) {
        console.log(req.body)
        const {user_name, password} = req.body
        const user = await User.findOne({where: {user_name}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.user_name, user.role)
        return res.json({token})
    }

    async profile(req, res) {
        // /api/:user_name  -- req.params is ":user_name"
        const {user_name} = req.params
        const user = await User.findOne({where: {user_name: user_name}, include: Post})
        return res.json(user)
    }

    async profile_update(req, res, next) {
        const user = await User.findOne({where: {user_name: req.user.user_name}})
        const {name, description} = req.body
        if (name) {
            user.name = name
        }
        if (description) {
            user.description = description
        }
        try {
            const {image} = req.files
            let fileName = uuid.v4() + ".jpg"
            await image.mv(path.resolve(__dirname, '..', 'static', fileName))
            user.avatar = fileName
        } catch (e) {
            console.log(e)
        }
        await user.save()
        return res.json(user)
    }


    async add_follow(req, res, next) { // Подписаться на кого либо
        const {follow} = req.body
        const valid = await Follower.findOne({where: {following_user: follow, follower_user: req.user.user_name}})
        if (valid) {
            return next(ApiError.badRequest('Уже подписан'))
        }
        const following = await Follower.create({follower_user: req.user.user_name, following_user: follow})
        return res.json(following)
    }

    async delete_following(req, res, next) { // Отписка
        const {following} = req.body
        const user = await Follower.findOne({where: {following_user: following, follower_user: req.user.user_name}})
        if (user) {
            await user.destroy()
            return res.json({status:200})
        } else {
            return next(ApiError.badRequest('Не подписан'))
        }
    }

    async delete_follower(req, res, next) { // отписать подписчика
        const {follower} = req.body
        const user = await Follower.findOne({where: {following_user: req.user.user_name, follower_user: follower}})
        if (user) {
            await user.destroy()
            return res.json({status: 200})
        } else {
            return next(ApiError.badRequest('Не подписан'))
        }
    }

    async get_followers(req, res) { // вытащить моих подписчиков
        let followers = await Follower.findAll({where: {following_user: req.user.user_name}}) // я главный
        let user_names = []
        for (let index in followers) {
            user_names.push(followers[index].follower_user)
        }
        const users = await User.findAll({where: {user_name: user_names}})
        return res.json(users)
    }

    async get_following(req, res) {
        let following = await Follower.findAll({where: {follower_user: req.user.user_name}})
        let ids = []
        for (let index in following) {
            ids.push(following[index].following_user)
        }
        const users = await User.findAll({where: {user_name: ids}})
        return res.json(users)

    }

    async search(req, res) {
        const {user_name} = req.query
        const users = await User.findAll({where: {user_name: {[Op.like]: '%' + user_name + '%'}}})
        return res.json(users)
    }
}

module.exports = new UserController()