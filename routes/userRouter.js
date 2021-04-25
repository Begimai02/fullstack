const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/AuthMiddleware')


// localhost:5000/api/accounts/....

router.get('/following', authMiddleware, userController.get_following) // Мои подписки
router.get('/followers', authMiddleware, userController.get_followers) // Мои подписчики
router.get('/search', userController.search)
router.get('/:user_name', userController.profile)


router.post('/signup', userController.registration)
router.post('/login', userController.login)
router.post('/update', authMiddleware, userController.profile_update)
router.post('/following', authMiddleware, userController.add_follow)
router.post('/delete_follow', authMiddleware, userController.delete_following)
router.post('/delete_follower', authMiddleware, userController.delete_follower)



module.exports = router