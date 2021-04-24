const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/AuthMiddleware')

router.post('/signup', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.post('/following', authMiddleware, userController.add_follow)
router.get('/following', authMiddleware, userController.get_following)
router.get('/followers', authMiddleware, userController.get_followers)

module.exports = router