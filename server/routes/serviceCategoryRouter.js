const Router = require('express')
const router = new Router()

const serviceCategoryController = require('../controllers/serviceCategoryController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

router.post('/', authMiddleware, roleMiddleware('ADMIN'), serviceCategoryController.create)
router.get('/', serviceCategoryController.getAll)
router.get('/:id', serviceCategoryController.getOne)
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), serviceCategoryController.update)
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), serviceCategoryController.delete)

module.exports = router