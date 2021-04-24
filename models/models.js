const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    user_name: {type: DataTypes.STRING, primaryKey: true, unique: true},
    name: {type: DataTypes.STRING, allowNull: true},
    password: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: true},
    avatar: {type: DataTypes.STRING, allowNull: true},
    role: {type: DataTypes.STRING, defaultValue: "USER"}
})

const Like = sequelize.define('like', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: {type: DataTypes.STRING, allowNull: false},
    post_id: {type: DataTypes.INTEGER, allowNull: false}
})

const Comment = sequelize.define('comment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: {type: DataTypes.STRING, allowNull: false},
    post_id: {type: DataTypes.INTEGER, allowNull: false},
    body: {type: DataTypes.TEXT, allowNull: false},
    date: {type: DataTypes.INTEGER, defaultValue: DataTypes.NOW, allowNull: false}
})

const Post = sequelize.define('post', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: true},
    image: {type: DataTypes.STRING,  allowNull: false},
    date: {type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false}
})

const Follower = sequelize.define('follower', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    follower_user: {type: DataTypes.STRING, allowNull: false},
    following_user: {type: DataTypes.STRING, allowNull: false},
})

User.hasMany(Post)
Post.belongsTo(User)

User.hasMany(Comment)
Comment.belongsTo(User)

Post.hasMany(Comment)
Comment.belongsTo(Post)

User.hasMany(Like)
Like.belongsTo(User)

Post.hasMany(Like)
Like.belongsTo(Post)

User.hasMany(Follower)
Follower.belongsTo(User)

module.exports = {
    User,
    Post,
    Like, 
    Comment,
    Follower
}