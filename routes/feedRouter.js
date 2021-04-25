const Router = require('express')
const router = new Router()
const feedController = require('../controllers/feedController')
const authMiddleware = require('../middleware/AuthMiddleware')

router.post('/add', authMiddleware, feedController.create)
router.get('/like/:id', authMiddleware, feedController.add_like)
router.get('/like_delete/:id', authMiddleware, feedController.delete_like)
router.get('/', authMiddleware, feedController.get_feed)
router.get('/:id',authMiddleware, feedController.getOne)
router.get('/:id/delete', authMiddleware, feedController.delete_post)

module.exports = router