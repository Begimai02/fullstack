const ApiError = require('../error/ApiError');
const {User, Follower} = require('../models/models');
const uuid = require('uuid')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.user_name, req.user.role)
        
        return res.json({token})
    }


    async add_follow(req, res, next) {
        const {follow} = req.body
        const valid = await Follower.findOne({where:{following_user: follow, follower_user: req.user.user_name}})
        console.log(valid)
        if (valid) {
            return next(ApiError.badRequest('Уже подписан'))
        }
        const following = await Follower.create({follower_user: req.user.user_name, following_user: follow})
        return res.json(following)
    }

    async get_followers(req, res, next) {
        let followers = await Follower.findAll({where:{following_user: req.user.user_name}})
        let ids = []
        for (let i=0; i<followers.length; i++) {
            ids.push(followers[i].dataValues.follower_user)
        }
        const users = await User.findAll({where:{user_name: ids}}) 
        return res.json(users)

    }

    async get_following(req, res, next) {
        let following = await Follower.findAll({where:{follower_user: req.user.user_name}})
        let ids = []
        for (let i=0; i<followers.length; i++) {
            ids.push(following[i].dataValues.following_user)
        }
        
        const users = await User.findAll({where:{user_name: ids}}) 
        return res.json(users)
        
    }
}

module.exports = new UserController()