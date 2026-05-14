const Router = require('express')
const router = new Router()

const scheduleSlotController = require('../controllers/scheduleSlotController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.post('/', authMiddleware, roleMiddleware('MASTER'), scheduleSlotController.create)
router.get('/', scheduleSlotController.getAll)
router.get('/master/:masterId', scheduleSlotController.getMasterSlots)
router.get('/:id', scheduleSlotController.getOne)
router.put('/:id', authMiddleware, roleMiddleware('MASTER'), scheduleSlotController.update)
router.delete('/:id', authMiddleware, roleMiddleware('MASTER'), scheduleSlotController.delete)

module.exports = router