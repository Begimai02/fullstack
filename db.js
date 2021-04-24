const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    process.env.DB_NAME, //name of db
    process.env.DB_USER,  // user
    process.env.DB_PASSWORD, // password
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
)

//this is primer