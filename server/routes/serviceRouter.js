const Router = require('express')
const router = new Router()

const serviceController = require('../controllers/serviceController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.post('/', authMiddleware, roleMiddleware('MASTER'), serviceController.create)
router.get('/', serviceController.getAll)
router.get('/:id', serviceController.getOne)
router.put('/:id', authMiddleware, roleMiddleware('MASTER'), serviceController.update)
router.delete('/:id', authMiddleware, roleMiddleware('MASTER'), serviceController.delete)

module.exports = router