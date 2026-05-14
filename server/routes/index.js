const Router = require('express')
const router = new Router()

const roleRouter = require('./roleRouter')
const userRouter = require('./userRouter')
const serviceCategoryRouter = require('./serviceCategoryRouter')
const serviceRouter = require('./serviceRouter')
const bookingStatusRouter = require('./bookingStatuseRouter')
const bookingRouter = require('./bookingRouter')

router.use('/role', roleRouter)
router.use('/user', userRouter)
router.use('/servicecategory', serviceCategoryRouter)
router.use('/service', serviceRouter)
router.use('/bookingstatus', bookingStatusRouter)
router.use('/booking', bookingRouter)

module.exports = router 