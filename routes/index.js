const Router = require('express')
const router = new Router()

const userRouter = require('./userRouter')
const feedRouter = require('./feedRouter')

router.use('/accounts', userRouter)
router.use('/', feedRouter)

module.exports = router