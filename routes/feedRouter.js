const Router = require('express')
const router = new Router()
const feedController = require('../controllers/feedController')
const authMiddleware = require('../middleware/AuthMiddleware')

router.post('/add', authMiddleware, feedController.create)
router.get('/', authMiddleware, feedController.getAll)
router.get('/:id',authMiddleware, feedController.getOne)

module.exports = router