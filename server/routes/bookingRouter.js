const Router = require('express')
const router = new Router()

const bookingController = require('../controllers/bookingController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.post('/', authMiddleware, bookingController.create)
router.get('/', authMiddleware, bookingController.getAll)
router.get('/:id', authMiddleware, bookingController.getOne)
router.put('/:id', authMiddleware, bookingController.update)
router.delete('/:id', authMiddleware, bookingController.delete)

module.exports = router