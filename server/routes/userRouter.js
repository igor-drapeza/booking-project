const Router = require('express')
const router = new Router()

const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)


router.get('/', authMiddleware, userController.getAll)
router.get('/:id', authMiddleware, userController.getOne)
router.put('/:id', authMiddleware, userController.update)
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), userController.delete)

module.exports = router