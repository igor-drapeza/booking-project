const Router = require('express')
const router = new Router()

const bookingStatuseController = require( '../controllers/bookingStatuseController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.post('/', authMiddleware, roleMiddleware('ADMIN'), bookingStatuseController.create)
router.get('/', bookingStatuseController.getAll)
router.get('/:id', bookingStatuseController.getOne)
router.put( '/:id', authMiddleware, roleMiddleware('ADMIN'), bookingStatuseController.update)
router.delete( '/:id', authMiddleware, roleMiddleware('ADMIN'), bookingStatuseController.delete)

module.exports = router