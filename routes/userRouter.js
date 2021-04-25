const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/AuthMiddleware')

router.get('/all', userController.get_all)
router.get('/all_follow', userController.get_follow)
router.post('/signup', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.post('/following', authMiddleware, userController.add_follow)
router.get('/following', authMiddleware, userController.get_following)
router.get('/followers', authMiddleware, userController.get_followers)
router.get('/search', userController.search)
router.get('/:user_name', authMiddleware, userController.profile)



module.exports = router