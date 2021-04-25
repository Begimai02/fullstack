const Router = require('express')
const router = new Router()
const feedController = require('../controllers/feedController')
const authMiddleware = require('../middleware/AuthMiddleware')



router.get('/', authMiddleware, feedController.get_posts)
router.post('/', authMiddleware, feedController.create_post)
router.get('/:id',authMiddleware, feedController.get_post)
router.post('/:id/update', authMiddleware, feedController.update_post)
router.get('/:id/delete', authMiddleware, feedController.delete_post)

router.get('/:id/like', authMiddleware, feedController.add_like)
router.get('/:id/like_delete', authMiddleware, feedController.delete_like)
router.post('/:id/comment', authMiddleware, feedController.add_comment)
router.get('/:id/comment_delete', authMiddleware, feedController.delete_comment)
module.exports = router